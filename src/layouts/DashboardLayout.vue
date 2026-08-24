<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const router = useRouter()
const logout = () => { auth.logout(); router.push('/') }
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
      <div class="p-5 flex items-center gap-2 font-bold text-lg border-b border-slate-200 dark:border-slate-800">
        <span class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">A</span>
        Asri ASR
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <RouterLink to="/dashboard" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" :class="$route.path==='/dashboard' ? 'bg-violet-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'">
          <span>◧</span> Dashboard
        </RouterLink>
        <RouterLink to="/courses" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" :class="$route.path.startsWith('/courses') ? 'bg-violet-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'">
          <span>▦</span> Courses
        </RouterLink>
      </nav>
      <div class="p-3 border-t border-slate-200 dark:border-slate-800">
        <div class="text-sm font-medium truncate">{{ auth.user?.name }}</div>
        <div class="text-xs text-slate-500 truncate">{{ auth.user?.email }} • {{ auth.user?.role }}</div>
        <button @click="logout" class="mt-2 w-full text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded px-2 py-1">Logout</button>
      </div>
    </aside>

    <!-- Mobile header -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="md:hidden flex items-center justify-between p-3 border-b bg-white dark:bg-slate-900">
        <span class="font-bold">Asri</span>
        <div class="flex gap-2">
          <RouterLink to="/dashboard" class="text-sm px-2 py-1 rounded bg-slate-100">Dashboard</RouterLink>
          <RouterLink to="/courses" class="text-sm px-2 py-1 rounded bg-slate-100">Courses</RouterLink>
        </div>
      </header>
      <main class="flex-1 bg-slate-50 dark:bg-slate-950">
        <router-view />
      </main>
    </div>
  </div>
</template>
