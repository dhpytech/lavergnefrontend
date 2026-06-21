"use client";

import React, { useState, useEffect } from 'react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (senderEmail: string, senderPass: string, recipients: string[], subject: string, notes: string) => Promise<void>;
  selectedDate: string;
}

interface MailAccount {
  id: string | number;
  mail_address: string;
  mail_person: string;
  mail_status: string;
}

export default function EmailModal({ isOpen, onClose, onSend, selectedDate }: EmailModalProps) {
  const [mailList, setMailList] = useState<MailAccount[]>([]);

  const [senderEmail, setSenderEmail] = useState('');
  const [senderPass, setSenderPass] = useState('');

  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');

  const [subject, setSubject] = useState(`[Lavergne VN] Maris Daily Production Report - ${selectedDate}`);
  const [notes, setNotes] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMails, setIsLoadingMails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchMailAddresses = async () => {
        setIsLoadingMails(true);
        try {
          const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gunicorn-lavergnebackendwsgi-production.up.railway.app';
          const response = await fetch(`${BASE_URL}/mail/mail/`);

          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data: MailAccount[] = await response.json();
              const activeMails = data.filter(m => m.mail_status.toLowerCase() === 'active');
              setMailList(activeMails);
              setSelectedRecipients(activeMails.map(m => m.mail_address));
            } else {
              const rawText = await response.text();
              console.error("Expected JSON but received HTML/Text. Raw response excerpt:", rawText.slice(0, 300));
              alert("Server Configuration Error: The server returned a web page instead of structured email data.");
            }
          } else {
            console.error(`Server error status code: ${response.status}`);
          }
        } catch (err) {
          console.error("Network error fetching email list:", err);
        } finally {
          setIsLoadingMails(false);
        }
      };
      fetchMailAddresses();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle checklist for system emails
  const handleCheckboxChange = (email: string) => {
    setSelectedRecipients(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleAddCustomEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const emailTrimmed = customInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailTrimmed)) {
      alert("Invalid email format!");
      return;
    }

    const isExistInSystem = mailList.some(m => m.mail_address.toLowerCase() === emailTrimmed);
    if (isExistInSystem) {
      alert("This email already exists in the system recipient list below.");
      return;
    }

    if (customEmails.includes(emailTrimmed)) {
      alert("This email has already been added.");
      return;
    }

    setCustomEmails(prev => [...prev, emailTrimmed]);
    setCustomInput('');
  };

  const handleRemoveCustomEmail = (email: string) => {
    setCustomEmails(prev => prev.filter(e => e !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderEmail || !senderPass) {
      alert("Please enter the sender email and app password!");
      return;
    }

    const finalRecipients = [...selectedRecipients, ...customEmails];

    if (finalRecipients.length === 0) {
      alert("Please select or add at least one recipient!");
      return;
    }

    setIsSending(true);
    try {
      await onSend(senderEmail, senderPass, finalRecipients, subject, notes);
      onClose();
      setNotes('');
      setCustomEmails([]);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-sans text-xs antialiased overflow-y-auto py-6">
      <div className="w-full max-w-5xl h-full p-5 bg-white rounded-lg shadow-2xl border border-slate-300 my-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-[16px] font-bold text-blue-800 flex items-center gap-1.5">
            <span>✉️</span> CONFIG & SEND DAILY REPORT EMAIL
          </h3>
          <button onClick={onClose} type="button" className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-3">
            <span className="block text-[13px] font-bold text-blue-800 uppercase tracking-wider">🔒 SENDER CONFIG</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-600 mb-0.5">Email:</label>
                <input
                  type="email" required placeholder="your-email@lavergne.ca" value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded text-slate-900 outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-600 mb-0.5">App Password:</label>
                <input
                  type="password" required placeholder="Email App Password" value={senderPass}
                  onChange={(e) => setSenderPass(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded text-slate-900 outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[13px] font-bold text-slate-700 uppercase mb-1">Add External Recipient (Optional):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter external email (e.g., partner@gmail.com) and press Enter"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomEmail();
                    }
                  }}
                  className="flex-1 p-2 border border-slate-300 rounded text-slate-900 outline-none focus:border-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomEmail()}
                  className="px-4 py-2 font-bold text-white bg-blue-600 border border-blue-700 rounded hover:bg-blue-700"
                >
                  ADD
                </button>
              </div>

              {customEmails.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 p-1.5 border border-dashed border-slate-300 rounded bg-amber-50/50">
                  {customEmails.map((email) => (
                    <div key={`custom-${email}`} className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-900 rounded font-mono text-[10px]">
                      <span>{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomEmail(email)}
                        className="text-amber-500 hover:text-amber-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 uppercase mb-1">System Recipient List:</label>
              {isLoadingMails ? (
                <div className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-slate-500 italic">⏳ Loading email list...</div>
              ) : (
                <div className="max-h-100 overflow-y-auto p-2 border border-slate-200 rounded space-y-1.5 bg-slate-50">
                  {mailList.length === 0 ? (
                    <p className="text-slate-400 italic">No Recipients Available</p>
                  ) : (
                    mailList.map((m, index) => (
                      <label
                        key={m.id ? `sys-${m.id}` : `sys-mail-${m.mail_address}-${index}`}
                        className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-200 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRecipients.includes(m.mail_address)}
                          onChange={() => handleCheckboxChange(m.mail_address)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                        />
                        <span className="text-slate-800 font-medium">
                          {m.mail_person} <span className="text-slate-500 font-mono">({m.mail_address})</span>
                        </span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>


          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-[13px] font-bold text-slate-700 uppercase mb-1">Subject:</label>
              <input
                type="text" required value={subject} onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-700 uppercase mb-1">Message Notes:</label>
              <textarea
                rows={3} placeholder="Enter optional notes to accompany the report..." value={notes} onChange={(e) => setNotes(e.target.value)}
                className="w-full h-50 p-2.5 border border-slate-300 rounded text-slate-900 outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>


          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={isSending} className="px-4 py-2 font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200">
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSending || (selectedRecipients.length === 0 && customEmails.length === 0)}
              className="px-5 py-2 font-bold text-white bg-amber-600 border border-amber-700 rounded hover:bg-amber-700 flex items-center gap-1.5 shadow"
            >
              {isSending ? "SENDING..." : "SEND EMAIL"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
