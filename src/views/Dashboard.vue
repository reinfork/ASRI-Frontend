<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'
const courses = ref<any[]>([])
const total = ref(0)
const pending = ref(true)

async function fetchData() {
  pending.value = true
  try {
    const res: any = await fetch(`${API}/courses?page=1&limit=4`).then(r=>r.json())
    courses.value = res.data || []
    total.value = res.meta?.total ?? courses.value.length
  } catch {} finally { pending.value = false }
}
onMounted(() => { auth.fetchMe(); fetchData() })
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p class="text-sm text-slate-500">Welcome, {{ auth.user?.name }} ({{ auth.user?.role }}) — ASR English Practice</p>
      </div>
      <button @click="fetchData()" class="text-sm px-3 py-1 border rounded hover:bg-slate-50">Refresh</button>
    </div>

    <div class="grid md:grid-cols-3 gap-4 mb-6">
      <div class="border rounded-xl p-4 bg-white dark:bg-slate-900">
        <div class="text-sm text-slate-500">Courses</div>
        <div class="text-2xl font-bold">{{ total }}</div>
        <div class="text-xs text-slate-500">English ASR courses</div>
      </div>
      <div class="border rounded-xl p-4 bg-white dark:bg-slate-900">
        <div class="text-sm text-slate-500">Your Role</div>
        <div class="text-2xl font-bold capitalize">{{ auth.user?.role }}</div>
        <div class="text-xs text-slate-500">{{ auth.user?.email }}</div>
      </div>
      <div class="border rounded-xl p-4 bg-violet-600 text-white">
        <div class="text-sm text-white/80">Next Step</div>
        <div class="font-semibold">Practice Speaking</div>
        <RouterLink to="/courses" class="inline-block mt-2 text-xs bg-white text-violet-600 px-3 py-1 rounded">Open Courses →</RouterLink>
      </div>
    </div>

    <div class="border rounded-xl p-4 bg-white dark:bg-slate-900">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-semibold">Recent Courses</h2>
        <RouterLink to="/courses" class="text-sm text-violet-600">View all</RouterLink>
      </div>
      <div v-if="pending" class="py-8 text-center text-sm text-slate-500">Loading...</div>
      <div v-else class="grid md:grid-cols-2 gap-3">
        <div v-for="c in courses" :key="c.id" class="border rounded-lg p-3">
          <div class="font-medium">{{ c.title }}</div>
          <div class="text-sm text-slate-500 line-clamp-2">{{ c.description }}</div>
          <RouterLink :to="`/courses/${c.id}`" class="text-xs text-violet-600 mt-2 inline-block">Practice →</RouterLink>
        </div>
        <div v-if="courses.length===0" class="text-sm text-slate-500">No courses yet. Admin can create via Courses menu.</div>
      </div>
    </div>
  </div>
</template>
