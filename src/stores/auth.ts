import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  email: string
  role: string
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    isAdmin: (s) => s.user?.role === 'admin'
  },
  actions: {
    async login(email: string, password: string) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      this.token = data.token
      this.user = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      return data
    },
    async register(payload: { name: string, email: string, password: string, role: string }) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Register failed')
      return data
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    async fetchMe() {
      if (!this.token) return null
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
      if (!res.ok) { this.logout(); return null }
      const data = await res.json()
      this.user = data
      localStorage.setItem('user', JSON.stringify(data))
      return data
    },
    authFetch(path: string, opts: RequestInit = {}) {
      const headers: Record<string,string> = { ...(opts.headers as any) }
      if (this.token) headers['Authorization'] = `Bearer ${this.token}`
      if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'
      return fetch(`${API_BASE}${path}`, { ...opts, headers }).then(async r => {
        const text = await r.text()
        let json: any
        try { json = text ? JSON.parse(text) : {} } catch { json = { raw: text } }
        if (!r.ok) throw new Error(json.error || `HTTP ${r.status}`)
        return json
      })
    }
  }
})
