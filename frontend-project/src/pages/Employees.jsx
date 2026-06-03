import React, { useEffect, useState } from 'react'

export default function Employees(){
  const [list, setList] = useState([])
  const [q, setQ] = useState('')
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [form, setForm] = useState({ EmpFirstName:'', EmpLastName:'', EmpEmail:'', EmpTelephone:'', EmpStatus:'on mission', DepartmentId:'', PositionId:'' })
  const [editing, setEditing] = useState(null)
  const [report, setReport] = useState(null)

  async function load(){
    const res = await fetch('http://localhost:4000/api/employees?q='+encodeURIComponent(q), { credentials: 'include' })
    const data = await res.json()
    setList(data)
  }

  async function loadMeta(){
    const d = await fetch('http://localhost:4000/api/departments',{credentials:'include'}).then(r=>r.json())
    const p = await fetch('http://localhost:4000/api/positions',{credentials:'include'}).then(r=>r.json())
    setDepartments(d); setPositions(p)
  }

  useEffect(()=>{ load(); loadMeta() }, [])

  async function submit(e){
    e.preventDefault()
    const body = { ...form }
    const url = editing ? 'http://localhost:4000/api/employees/'+editing : 'http://localhost:4000/api/employees'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, { method, credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    if(res.ok){ setForm({ EmpFirstName:'', EmpLastName:'', EmpEmail:'', EmpTelephone:'', EmpStatus:'on mission', DepartmentId:'', PositionId:'' }); setEditing(null); load() }
    else alert('Error')
  }

  function startEdit(e){
    setEditing(e.id)
    setForm({ EmpFirstName:e.EmpFirstName, EmpLastName:e.EmpLastName, EmpEmail:e.EmpEmail, EmpTelephone:e.EmpTelephone, EmpStatus:e.EmpStatus, DepartmentId:e.DepartmentId||'', PositionId:e.PositionId||'' })
    window.scrollTo({top:0,behavior:'smooth'})
  }

  async function remove(id){ if(!confirm('Delete?')) return; await fetch('http://localhost:4000/api/employees/'+id, { method:'DELETE', credentials:'include' }); load() }

  async function loadReport(){ const res = await fetch('http://localhost:4000/api/employees/report/on-leave', { credentials:'include' }); const data = await res.json(); setReport(data) }

  return (
    <div className="p-6">
      <form onSubmit={submit} className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">{editing ? 'Edit Employee' : 'Add Employee'}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input required value={form.EmpFirstName} onChange={e=>setForm({...form,EmpFirstName:e.target.value})} placeholder="First name" className="p-2 border" />
          <input required value={form.EmpLastName} onChange={e=>setForm({...form,EmpLastName:e.target.value})} placeholder="Last name" className="p-2 border" />
          <input value={form.EmpEmail} onChange={e=>setForm({...form,EmpEmail:e.target.value})} placeholder="Email" type="email" className="p-2 border" />
          <input value={form.EmpTelephone} onChange={e=>setForm({...form,EmpTelephone:e.target.value})} placeholder="Telephone" type='number' className="p-2 border" />
          <select value={form.DepartmentId} onChange={e=>setForm({...form,DepartmentId:e.target.value})} className="p-2 border">
            <option value="">Select Department</option>
            {departments.map(d=> <option key={d.id} value={d.id}>{d.DepartName}</option>)}
          </select>
          <select value={form.PositionId} onChange={e=>setForm({...form,PositionId:e.target.value})} className="p-2 border">
            <option value="">Select Position</option>
            {positions.map(p=> <option key={p.id} value={p.id}>{p.PosName}</option>)}
          </select>
          <select value={form.EmpStatus} onChange={e=>setForm({...form,EmpStatus:e.target.value})} className="p-2 border">
            <option value="on leave">on leave</option>
            <option value="left">left</option>
            <option value="blacklisted">blacklisted</option>
            <option value="deceased">deceased</option>
            <option value="on mission">on mission</option>
          </select>
        </div>
        <div className="mt-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded mr-2">{editing? 'Save':'Add'}</button>
          {editing && <button type="button" onClick={()=>{ setEditing(null); setForm({ EmpFirstName:'', EmpLastName:'', EmpEmail:'', EmpTelephone:'', EmpStatus:'on mission', DepartmentId:'', PositionId:'' }) }} className="px-3 py-2 bg-gray-300 rounded">Cancel</button>}
        </div>
      </form>

      <div className="mb-4 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} className="p-2 border" placeholder="Search" />
        <button onClick={load} className="px-4 py-2 bg-blue-600 text-white">Search</button>
        <button onClick={loadReport} className="px-4 py-2 bg-yellow-600 text-white">On-Leave Report</button>
      </div>

      {report && (
        <div className="mb-4 bg-white p-4 rounded shadow">
          <h4 className="font-bold mb-2">Employees On Leave</h4>
          {report.counts.map(c=> (
            <div key={c.DepartName} className="mb-2">
              <div className="font-semibold">{c.DepartName} — {c.TotalOnLeave}</div>
              <ul className="ml-4">
                {report.rows.filter(r=>r.DepartName===c.DepartName).map(r=> (<li key={r.EmployeeId}>{r.EmpFirstName} {r.EmpLastName} — {r.EmpEmail}</li>))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead><tr><th className="p-2">First</th><th>Last</th><th>Email</th><th>Department</th><th>Position</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {list.map(e=> (
            <tr key={e.id} className="border-t"><td className="p-2">{e.EmpFirstName}</td><td>{e.EmpLastName}</td><td>{e.EmpEmail}</td><td>{e.DepartName}</td><td>{e.PosName}</td><td>{e.EmpStatus}</td><td><button className="px-2 py-1 bg-indigo-600 text-white rounded mr-2" onClick={()=>startEdit(e)}>Edit</button><button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=>remove(e.id)}>Delete</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
