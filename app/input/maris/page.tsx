'use client'

import { useState, useEffect } from 'react'

type MainDataRow = {
  productCode: string
  goodPro: string | number
  dlnc: string | number
  case: string
  reject: string | number
  scrap: string | number
  screen: string | number
  visslab: string | number
}

type StopTimeRow = {
  stopTime: string
  hour: string
}

type ProblemRow = {
  problem: string
  hour: string
}

type FormData = {
  date: string
  employee: string
  shift: string
  mainData: MainDataRow[]
  stopTimeRows: number
  problemRows: number
  stopTimes: StopTimeRow[]
  problems: ProblemRow[]
  comment: string
}

const PRODUCT_CODES = ['P001', 'P002', 'P003']
const CASES = ['Case A', 'Case B', 'Case C']
const STOP_TIMES = ['Machine A', 'Machine B']
const PROBLEMS = ['Problem X', 'Problem Y']

export default function MarisInputPage() {
  const defaultMainDataRowCount = 1
  const defaultStopTimesRowCount = 0
  const defaultProblemsRowCount = 0

  const [mainDataRows, setMainDataRows] = useState<number>(defaultMainDataRowCount)
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/nhanvien/`)
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error('Lỗi khi tải danh sách nhân viên:', err))
  }, [])

  const getEmptyMainData = (count: number): MainDataRow[] =>
    Array.from({ length: count }, () => ({
      productCode: '',
      goodPro: '',
      dlnc: '',
      case: '',
      reject: '',
      scrap: '',
      screen: '',
      visslab: ''
    }))

  const getEmptyStopTimes = (count: number): StopTimeRow[] =>
    Array.from({ length: count }, () => ({ stopTime: '', hour: '' }))

  const getEmptyProblems = (count: number): ProblemRow[] =>
    Array.from({ length: count }, () => ({ problem: '', hour: '' }))

  const [formData, setFormData] = useState<FormData>({
    date: '',
    employee: '',
    shift: '',
    mainData: getEmptyMainData(defaultMainDataRowCount),
    stopTimeRows: defaultStopTimesRowCount,
    problemRows: defaultProblemsRowCount,
    stopTimes: getEmptyStopTimes(defaultStopTimesRowCount),
    problems: getEmptyProblems(defaultProblemsRowCount),
    comment: ''
  })

  const resetForm = () => {
    setFormData({
      date: '',
      employee: '',
      shift: '',
      mainData: getEmptyMainData(defaultMainDataRowCount),
      stopTimeRows: defaultStopTimesRowCount,
      problemRows: defaultProblemsRowCount,
      stopTimes: getEmptyStopTimes(defaultStopTimesRowCount),
      problems: getEmptyProblems(defaultProblemsRowCount),
      comment: ''
    })
    setMainDataRows(defaultMainDataRowCount)
  }

  const updateFormArray = <T extends keyof FormData>(
    type: T,
    index: number,
    key: string,
    value: any
  ) => {
    const updated = [...(formData[type] as any)]
    updated[index] = { ...updated[index], [key]: value }
    setFormData({ ...formData, [type]: updated })
  }

  const handleMainDataRowChange = (count: number) => {
    setMainDataRows(count)
    const newRows: MainDataRow[] = Array.from({ length: count }, (_, i) =>
      formData.mainData[i] || {
        productCode: '',
        goodPro: '',
        dlnc: '',
        case: '',
        reject: '',
        scrap: '',
        screen: '',
        visslab: ''
      }
    )
    setFormData({ ...formData, mainData: newRows })
  }

  const handleDynamicRowChange = (type: 'stopTimes' | 'problems', count: number) => {
    setFormData({
      ...formData,
      [`${type}Rows`]: count,
      [type]: Array.from({ length: count }, (_, i) =>
        formData[type][i] || {
          [type === 'stopTimes' ? 'stopTime' : 'problem']: '',
          hour: ''
        }
      )
    })
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entries/maris/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.log(JSON.stringify(formData, null, 2))
        alert(`Gửi dữ liệu thất bại. Lỗi: ${res.status} - ${errorText}`)
        return
      }

      alert('Dữ liệu đã được gửi thành công!')
      resetForm()
    } catch (error: any) {
      alert(`Lỗi khi gửi dữ liệu: ${error.message}`)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Maris Input</h1>

      {/* Trường Chung */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="date"
          className="p-2 border rounded"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          value={formData.employee}
          onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
        >
          <option value="">Employees</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.name}>
              {emp.name}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={formData.shift}
          onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
        >
          <option value="">Shift</option>
          {['Day', 'Night'].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Số dòng Dữ liệu chính */}
        <div className="flex items-center">
          <label className="font-semibold mr-3">Production Input:</label>
            <select className="p-2 border rounded" value={mainDataRows}
              onChange={(e) => handleMainDataRowChange(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                        {n}
                    </option>
                ))}
            </select>
        </div>

        {/* Dữ liệu Chính */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Dữ liệu Chính</h2>
            {formData.mainData.map((row, idx) => (
                <div key={idx} className="grid grid-cols-8 gap-2">
                    <select
                        className="p-2 border rounded"
                        value={row.productCode}
                        onChange={(e) => updateFormArray('mainData', idx, 'productCode', e.target.value)}
            >
              <option value="">ProductCode</option>
              {PRODUCT_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            {['goodPro', 'dlnc', 'reject', 'scrap', 'screen', 'visslab'].map((field) => (
              <input
                key={field}
                type="number"
                placeholder={field}
                className="p-2 border rounded"
                value={row[field as keyof MainDataRow] || ''}
                onChange={(e) => updateFormArray('mainData', idx, field, e.target.value)}
              />
            ))}
            <select
              className="p-2 border rounded"
              value={row.case}
              onChange={(e) => updateFormArray('mainData', idx, 'case', e.target.value)}
            >
              <option value="">Case</option>
              {CASES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* StopTime */}


        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Stop Time</h2>
            <select
              className="p-2 border rounded" value={formData.stopTimeRows}
              onChange={(e) => handleDynamicRowChange('stopTimes', Number(e.target.value))}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
            {formData.stopTimes.map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                    <select
                        className="p-2 border rounded"
                        value={row.stopTime}
                        onChange={(e) => updateFormArray('stopTimes', idx, 'stopTime', e.target.value)}
                    >
                        <option value="">Chọn StopTime</option>
                        {STOP_TIMES.map((st) => (
                            <option key={st} value={st}>
                                {st}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Giờ/Thời gian"
                        className="p-2 border rounded"
                        value={row.hour}
                        onChange={(e) => updateFormArray('stopTimes', idx, 'hour', e.target.value)}
                    />
                </div>
            ))}
        </div>

        {/* Problem */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Problem</h2>
            <select
                className="p-2 border rounded"
                value={formData.problemRows}
                onChange={(e) => handleDynamicRowChange('problems', Number(e.target.value))}
            >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {formData.problems.map((row, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-2">
            <select
              className="p-2 border rounded"
              value={row.problem}
              onChange={(e) => updateFormArray('problems', idx, 'problem', e.target.value)}
            >
              <option value="">Chọn Problem</option>
              {PROBLEMS.map((pr) => (
                <option key={pr} value={pr}>
                  {pr}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Giờ"
              className="p-2 border rounded"
              value={row.hour}
              onChange={(e) => updateFormArray('problems', idx, 'hour', e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Comment */}
      <div>
        <textarea
          placeholder="Comment"
          className="p-2 border rounded w-full"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Nhập Dữ Liệu
      </button>
    </div>
  )
}
