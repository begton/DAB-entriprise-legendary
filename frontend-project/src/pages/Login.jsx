import React, { useState } from 'react'

export default function Login({ onLogin }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function submit(e){
    e.preventDefault()
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
    if(res.ok){
      // refresh session in app
      await onLogin()
    } else alert('Login failed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="p-6 bg-white rounded shadow w-80">
        <h2 className="text-lg font-bold mb-4">HRMS Login</h2>
        <input className="w-full p-2 border mb-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input type="password" className="w-full p-2 border mb-4" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  )
}
