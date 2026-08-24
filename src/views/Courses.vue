<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'

const page = ref(1)
const limit = 6
const total = ref(0)
const courses = ref<any[]>([])
const pending = ref(true)
const q = ref('')
const showCreate = ref(false)
const error = ref('')
const creating = ref(false)
const form = ref({ title: '', description: '' })

const totalPages = computed(() => Math.ceil(total.value / limit) || 1)
const filtered = computed(() => q.value ? courses.value.filter(c=>c.title.toLowerCase().includes(q.value.toLowerCase())) : courses.value)

async function fetchData() {
  pending.value = true
  try {
    const res: any = await fetch(`${API}/courses?page=${page.value}&limit=${limit}`).then(r=>r.json())
    courses.value = res.data || []
    total.value = res.meta?.total ?? courses.value.length
  } catch {} finally { pending.value = false }
}
async function create() {
  creating.value = true; error.value = ''
  try {
    await auth.authFetch('/courses', { method: 'POST', body: JSON.stringify(form.value) })
    showCreate.value = false; form.value.title=''; form.value.description=''; await fetchData()
  } catch(e:any){ error.value = e.message } finally { creating.value = false }
}
async function remove(id:number) {
  if(!confirm('Delete course?')) return
  try { await auth.authFetch(`/courses/${id}`, { method: 'DELETE' }); await fetchData() } catch(e:any){ alert(e.message) }
}
watch(page, fetchData)
onMounted(fetchData)
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold">Courses — English ASR Practice</h1>
      <div class="flex gap-2">
        <input v-model="q" placeholder="Search..." class="border rounded px-3 py-1 text-sm" />
        <button v-if="auth.isAdmin" @click="showCreate=true" class="bg-violet-600 text-white px-3 py-1 rounded text-sm">+ New</button>
      </div>
    </div>

    <div v-if="pending" class="py-12 text-center text-sm">Loading...</div>
    <div v-else>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="c in filtered" :key="c.id" class="border rounded-xl p-4 bg-white dark:bg-slate-900">
          <div class="font-semibold">{{ c.title }}</div>
          <div class="text-xs text-slate-500">ID {{ c.id }} • {{ c.lessons?.length ?? 0 }} lessons</div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{{ c.description }}</p>
          <div class="mt-3 flex gap-2">
            <RouterLink :to="`/courses/${c.id}`" class="text-xs bg-violet-600 text-white px-2 py-1 rounded">Practice</RouterLink>
            <button v-if="auth.isAdmin" @click="remove(c.id)" class="text-xs border px-2 py-1 rounded text-red-600">Delete</button>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between mt-4 text-sm">
        <span class="text-slate-500">Total {{ total }} • Page {{ page }}/{{ totalPages }}</span>
        <div class="flex gap-1">
          <button @click="page=Math.max(1,page-1)" :disabled="page===1" class="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
          <button @click="page=Math.min(totalPages,page+1)" :disabled="page===totalPages" class="px-2 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <div v-if="showCreate" class="fixed inset-0 bg-black/40 grid place-items-center p-4">
      <div class="bg-white dark:bg-slate-900 rounded-xl p-5 w-full max-w-md">
        <h3 class="font-semibold mb-3">New Course (admin)</h3>
        <input v-model="form.title" placeholder="Title min 3 chars" class="w-full border rounded px-3 py-2 text-sm mb-2" />
        <textarea v-model="form.description" placeholder="Description" rows="3" class="w-full border rounded px-3 py-2 text-sm"></textarea>
        <div v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</div>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showCreate=false" class="px-3 py-1 border rounded text-sm">Cancel</button>
          <button @click="create" :disabled="creating" class="px-3 py-1 bg-violet-600 text-white rounded text-sm">{{ creating?'Creating...':'Create' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
