"use client";
import React from 'react';

interface ComingSoonProps {
  featureName?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ featureName = "This Feature" }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="relative max-w-2xl w-full text-center">

        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10"></div>

        {/* Icon / Illustration Placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center border border-slate-100 animate-bounce-slow">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-[12px] font-black uppercase tracking-[4px] text-indigo-500 mb-4 italic">
          Coming Soon
        </h2>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          {featureName} is <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 text-glow">Under Construction</span>
        </h1>

        <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto mb-10">
          We're working hard to bring you the best experience. Our engineers are polishing the final details of this module.
        </p>

        {/* Progress Bar Visual */}
        <div className="max-w-xs mx-auto mb-12">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2 px-1">
                <span>Development Progress</span>
                <span>85%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-[1px]">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-progress-flow" style={{width: '85%'}}></div>
            </div>
        </div>

        {/* Action / Interaction */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
                onClick={() => window.history.back()}
                className="px-8 py-3 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
                Return to Dashboard
            </button>
            <button className="px-8 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">
                Notify Me
            </button>
        </div>

      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        @keyframes progress-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        .text-glow {
            text-shadow: 0 0 20px rgba(79, 70, 229, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
