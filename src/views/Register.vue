<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const router = useRouter()
const auth = useAuthStore()
const state = reactive({ name: '', email: '', password: '', role: 'student' })
const loading = ref(false)
const error = ref('')
const success = ref(false)
async function onSubmit() {
  loading.value = true; error.value = ''; success.value = false
  try { await auth.register(state); success.value = true; setTimeout(()=>router.push('/login'),800) }
  catch(e:any){ error.value = e.message } finally{ loading.value=false }
}
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-slate-50 dark:bg-slate-950 px-4">
    <div class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <h1 class="text-xl font-bold">Create account</h1>
      <p class="text-sm text-slate-500 mb-4">Student atau Admin (admin kelola courses)</p>
      <form @submit.prevent="onSubmit" class="space-y-3">
        <div><label class="text-sm font-medium">Name</label><input v-model="state.name" required placeholder="Budi" class="mt-1 w-full border rounded px-3 py-2 text-sm dark:bg-slate-800" /></div>
        <div><label class="text-sm font-medium">Email</label><input v-model="state.email" type="email" required placeholder="budi@test.com" class="mt-1 w-full border rounded px-3 py-2 text-sm dark:bg-slate-800" /></div>
        <div><label class="text-sm font-medium">Password</label><input v-model="state.password" type="password" required placeholder="min 6 chars" class="mt-1 w-full border rounded px-3 py-2 text-sm dark:bg-slate-800" /></div>
        <div><label class="text-sm font-medium">Role</label><select v-model="state.role" class="mt-1 w-full border rounded px-3 py-2 text-sm dark:bg-slate-800"><option value="student">Student</option><option value="admin">Admin</option></select></div>
        <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{{ error }}</div>
        <div v-if="success" class="text-sm text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">Registered! Redirecting...</div>
        <button type="submit" :disabled="loading" class="w-full bg-violet-600 text-white rounded py-2 text-sm font-medium disabled:opacity-50">{{ loading ? 'Loading...' : 'Register' }}</button>
      </form>
      <div class="text-sm text-center text-slate-500 mt-4">Have account? <RouterLink to="/login" class="text-violet-600">Login</RouterLink></div>
    </div>
  </div>
</template>
