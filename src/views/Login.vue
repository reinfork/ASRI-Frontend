<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const state = reactive({ email: 'admin@test.com', password: 'admin123' })
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true; error.value = ''
  try { await auth.login(state.email, state.password); router.push('/dashboard') }
  catch (e:any) { error.value = e.message }
  finally { loading.value = false }
}
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-slate-50 dark:bg-slate-950 px-4">
    <div class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <h1 class="text-xl font-bold">Login to Asri</h1>
      <p class="text-sm text-slate-500 mb-4">ASR English practice — masuk untuk dashboard</p>
      <form @submit.prevent="onSubmit" class="space-y-3">
        <div>
          <label class="text-sm font-medium">Email</label>
          <input v-model="state.email" type="email" required placeholder="admin@test.com" class="mt-1 w-full border rounded px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700" />
        </div>
        <div>
          <label class="text-sm font-medium">Password</label>
          <input v-model="state.password" type="password" required placeholder="••••••••" class="mt-1 w-full border rounded px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700" />
        </div>
        <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{{ error }}</div>
        <button type="submit" :disabled="loading" class="w-full bg-violet-600 text-white rounded py-2 text-sm font-medium disabled:opacity-50">{{ loading ? 'Loading...' : 'Login' }}</button>
      </form>
      <div class="text-sm text-center text-slate-500 mt-4">No account? <RouterLink to="/register" class="text-violet-600">Register</RouterLink> • <RouterLink to="/" class="text-violet-600">Landing</RouterLink></div>
    </div>
  </div>
</template>
