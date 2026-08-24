<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const route = useRoute()
const auth = useAuthStore()
const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'
const id = route.params.id as string

const course = ref<any>(null)
const lessons = ref<any[]>([])
const pendingCourse = ref(true)
const pendingLessons = ref(true)
const page = ref(1)
const limit = 10
const total = ref(0)
const showCreate = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const error = ref('')
const form = ref({ title: '', order_index: 1, target_text: '' })
const recognition = ref<any>(null)
const isRecording = ref(false)
const transcript = ref('')
const score = ref<number|null>(null)
const feedback = ref('')
const practiceLesson = ref<any>(null)

function initSpeech() {
  const w: any = window
  const SR = w.SpeechRecognition || w.webkitSpeechRecognition
  if (!SR) return null
  const rec = new SR()
  rec.lang = 'en-US'
  rec.interimResults = false
  rec.onresult = async (e:any) => {
    transcript.value = e.results[0][0].transcript
    isRecording.value = false
    await computeScoreBackend()
  }
  rec.onerror = () => isRecording.value = false
  rec.onend = () => isRecording.value = false
  return rec
}
async function computeScoreBackend() {
  const lesson = practiceLesson.value || editing.value || lessons.value[0]
  if (!lesson) return
  try {
    const res: any = await auth.authFetch(`/lessons/${lesson.id}/practice`, {
      method: 'POST',
      body: JSON.stringify({ transcript: transcript.value })
    })
    score.value = res.score
    feedback.value = res.feedback
  } catch {
    // fallback client-side if backend fails
    const target = lesson.target_text || ''
    const a = transcript.value.toLowerCase().trim().split(/\s+/)
    const b = target.toLowerCase().trim().split(/\s+/)
    let match = 0
    b.forEach((w: string) => { if (a.includes(w)) match++ })
    score.value = b.length ? Math.round(match / b.length * 100) : 0
    feedback.value = score.value! >= 90 ? 'Excellent!' : score.value! >= 70 ? 'Good!' : 'Keep practicing'
  }
}
function startRecording(lesson?: any) {
  if (lesson) { practiceLesson.value = lesson; editing.value = lesson; transcript.value=''; score.value=null; feedback.value='' }
  if (!recognition.value) recognition.value = initSpeech()
  if (!recognition.value) { alert('Web Speech API not supported in this browser'); return }
  transcript.value=''; score.value=null; feedback.value=''; isRecording.value = true
  try { recognition.value.start() } catch {}
}
async function fetchCourse(){ pendingCourse.value=true; try{ course.value = await fetch(`${API}/courses/${id}`).then(r=>r.json()) } catch{} finally{ pendingCourse.value=false } }
async function fetchLessons(){
  pendingLessons.value=true
  try{
    const res:any = await fetch(`${API}/courses/${id}/lessons?page=${page.value}&limit=${limit}`).then(r=>r.json())
    lessons.value = res.data || []
    total.value = res.meta?.total ?? lessons.value.length
  } catch{} finally{ pendingLessons.value=false }
}
async function saveLesson(){
  saving.value=true; error.value=''
  try{
    if(editing.value && editing.value.id){
      await auth.authFetch(`/lessons/${editing.value.id}`, { method:'PUT', body: JSON.stringify({ title: form.value.title, order_index: form.value.order_index, target_text: form.value.target_text }) })
    } else {
      await auth.authFetch('/lessons', { method:'POST', body: JSON.stringify({ course_id: Number(id), ...form.value }) })
    }
    showCreate.value=false; editing.value=null; form.value.title=''; form.value.target_text=''; await fetchLessons()
  } catch(e:any){ error.value = e.message } finally{ saving.value=false }
}
function editLesson(l:any){ editing.value=l; form.value.title=l.title; form.value.order_index=l.order_index; form.value.target_text=l.target_text; showCreate.value=true }
async function removeLesson(lid:number){ if(!confirm('Delete lesson?')) return; try{ await auth.authFetch(`/lessons/${lid}`, {method:'DELETE'}); await fetchLessons()} catch(e:any){ alert(e.message)} }

watch(page, fetchLessons)
onMounted(()=>{ fetchCourse(); fetchLessons() })
</script>

<template>
  <div class="p-6">
    <RouterLink to="/courses" class="text-sm text-violet-600">← Back to courses</RouterLink>
    <div v-if="pendingCourse" class="py-8 text-center text-sm">Loading course...</div>
    <div v-else-if="course" class="mt-3">
      <div class="border rounded-xl p-5 bg-white dark:bg-slate-900">
        <h1 class="text-xl font-bold">{{ course.title }}</h1>
        <p class="text-sm text-slate-500 mt-1">{{ course.description }}</p>
        <div class="text-xs text-slate-400 mt-2">{{ lessons.length }} lessons • Created {{ new Date(course.created_at).toLocaleDateString() }}</div>
      </div>

      <div class="flex items-center justify-between mt-6">
        <h2 class="font-semibold">Lessons — Speaking Practice</h2>
        <button v-if="auth.isAdmin" @click="showCreate=true; editing=null; form.title=''; form.target_text=''" class="text-sm bg-violet-600 text-white px-3 py-1 rounded">+ Add Lesson</button>
      </div>

      <div v-if="pendingLessons" class="py-6 text-sm text-slate-500">Loading lessons...</div>
      <div v-else-if="lessons.length===0" class="py-6 text-sm text-slate-500 text-center">No lessons yet.</div>
      <div v-else class="space-y-3 mt-3">
        <div v-for="l in lessons" :key="l.id" class="border rounded-xl p-4 bg-white dark:bg-slate-900">
          <div class="flex items-start justify-between gap-3">
            <div class="flex gap-3">
              <span class="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 grid place-items-center text-sm font-bold text-violet-700">{{ l.order_index }}</span>
              <div>
                <div class="font-medium">{{ l.title }}</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">{{ l.target_text }}</div>
                <div class="mt-2 flex gap-2">
                  <button @click="startRecording(l)" class="text-xs px-2 py-1 rounded bg-emerald-600 text-white">{{ isRecording && practiceLesson?.id===l.id ? 'Listening...' : '🎤 Practice' }}</button>
                  <span v-if="transcript && practiceLesson?.id===l.id" class="text-xs text-slate-500">Heard: "{{ transcript }}" <span v-if="score!==null" class="font-bold text-emerald-600">Score {{ score }}% — {{ feedback }}</span></span>
                </div>
              </div>
            </div>
            <div v-if="auth.isAdmin" class="flex gap-1">
              <button @click="editLesson(l)" class="text-xs border px-2 py-1 rounded">Edit</button>
              <button @click="removeLesson(l.id)" class="text-xs border px-2 py-1 rounded text-red-600">Delete</button>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-1 mt-3">
          <button @click="page=Math.max(1,page-1)" :disabled="page===1" class="px-2 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
          <span class="text-sm px-2 py-1">Page {{ page }}</span>
          <button @click="page++" class="px-2 py-1 border rounded text-sm">Next</button>
        </div>

        <!-- global transcript -->
        <div v-if="transcript && score!==null" class="border rounded p-3 text-sm bg-emerald-50 dark:bg-emerald-950/20">
          Last transcript: "{{ transcript }}" <span class="font-bold">Score {{ score }}% — {{ feedback }}</span>
        </div>
      </div>
    </div>

    <div v-if="showCreate" class="fixed inset-0 bg-black/40 grid place-items-center p-4">
      <div class="bg-white dark:bg-slate-900 rounded-xl p-5 w-full max-w-md">
        <h3 class="font-semibold mb-3">{{ editing?.id ? 'Edit' : 'New' }} Lesson (English)</h3>
        <input v-model="form.title" placeholder="Title" class="w-full border rounded px-3 py-2 text-sm mb-2" />
        <input v-model.number="form.order_index" type="number" placeholder="Order index" class="w-full border rounded px-3 py-2 text-sm mb-2" />
        <textarea v-model="form.target_text" placeholder="Target text (English sentence to read)" rows="3" class="w-full border rounded px-3 py-2 text-sm"></textarea>
        <div v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</div>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showCreate=false" class="px-3 py-1 border rounded text-sm">Cancel</button>
          <button @click="saveLesson" :disabled="saving" class="px-3 py-1 bg-violet-600 text-white rounded text-sm">{{ saving?'Saving...': editing?.id ? 'Update' : 'Create' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
