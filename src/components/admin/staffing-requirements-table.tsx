'use client'
import { Plus, X, ChevronDown } from 'lucide-react'

export interface RoleRow {
  role: string
  headcount: number
  breakMinutes: number
}

const ROLE_OPTIONS = ['Supervisor', 'Sampling Lead', 'Brand Ambassador', 'Demonstrator']

interface StaffingRequirementsTableProps {
  roles: RoleRow[]
  onChange: (roles: RoleRow[]) => void
}

export function StaffingRequirementsTable({ roles, onChange }: StaffingRequirementsTableProps) {
  function update(i: number, patch: Partial<RoleRow>) {
    const next = roles.map((r, idx) => idx === i ? { ...r, ...patch } : r)
    onChange(next)
  }

  function remove(i: number) {
    onChange(roles.filter((_, idx) => idx !== i))
  }

  function addRow() {
    onChange([...roles, { role: ROLE_OPTIONS[0], headcount: 1, breakMinutes: 30 }])
  }

  const inputCls = 'h-8 border border-border-rostr text-xs px-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-action w-full rounded-lg'

  return (
    <div className="space-y-2">
      {roles.length > 0 && (
        <div className="overflow-x-auto border border-border-rostr rounded-lg">
          <table className="w-full text-xs min-w-[400px]">
            <thead>
              <tr className="bg-gray-50 border-b border-border-rostr">
                {['ROLE', 'HEADCOUNT', 'BREAK', ''].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-[11px] font-semibold text-text-secondary tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((row, i) => (
                <tr key={i} className="border-b border-border-rostr last:border-0">
                  <td className="px-3 py-2 w-48">
                    <div className="relative">
                      <select
                        value={row.role}
                        onChange={e => update(i, { role: e.target.value })}
                        className={`${inputCls} appearance-none pr-8`}
                      >
                        {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-3 py-2 w-24">
                    <input
                      type="number" min={1} max={20}
                      value={row.headcount}
                      onChange={e => update(i, { headcount: Math.max(1, Number(e.target.value)) })}
                      className={inputCls}
                    />
                  </td>
                  <td className="px-3 py-2 w-28">
                    <input
                      type="number" min={0} max={120} step={15}
                      value={row.breakMinutes}
                      onChange={e => update(i, { breakMinutes: Number(e.target.value) })}
                      className={inputCls}
                    />
                  </td>
                  <td className="px-3 py-2 w-8">
                    <button type="button" onClick={() => remove(i)} className="text-text-secondary hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 text-xs text-indigo-action hover:text-indigo-hover font-medium transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Add role
      </button>
    </div>
  )
}
