import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Employees from './pages/Employees'

export default function App(){
  const [user, setUser] = useState(null)

  async function fetchMe(){
    try{
      const res = await fetch('http://localhost:4000/api/auth/me', { credentials: 'include' })
      const data = await res.json()
      if(data.authenticated) setUser(data.user)
      else setUser(null)
    }catch(e){ setUser(null) }
  }

  useEffect(()=>{ fetchMe() },[])

  if(!user) return <Login onLogin={fetchMe} />
  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <div className="font-bold">HRMS</div>
        <div>
          <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={async ()=>{ await fetch('http://localhost:4000/api/auth/logout',{method:'POST',credentials:'include'}); setUser(null); }}>Logout</button>
        </div>
      </div>
      <Employees />
    </div>
  )
}
