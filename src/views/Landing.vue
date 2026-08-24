<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-950">
    <!-- Header -->
    <header class="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2 font-bold text-lg"><span class="w-8 h-8 rounded bg-violet-600 text-white grid place-items-center">A</span> Asri ASR</div>
        <nav class="flex gap-2">
          <RouterLink v-if="auth.isAuthenticated" to="/dashboard" class="px-3 py-1.5 rounded bg-violet-600 text-white text-sm">Dashboard</RouterLink>
          <template v-else>
            <RouterLink to="/login" class="px-3 py-1.5 text-sm hover:bg-slate-100 rounded">Login</RouterLink>
            <RouterLink to="/register" class="px-3 py-1.5 bg-violet-600 text-white rounded text-sm">Register</RouterLink>
          </template>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-8 items-center">
      <div class="space-y-5">
        <span class="inline-block text-xs px-2 py-1 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/30">ASR E-Book Interaktif • Bahasa Inggris</span>
        <h1 class="text-4xl lg:text-5xl font-bold leading-tight">Automatic Speech Recognition <span class="text-violet-600">untuk Belajar Bahasa Inggris</span></h1>
        <p class="text-slate-600 dark:text-slate-300">
          Automatic Speech Recognition (ASR) adalah teknologi yang mengenali, memproses, dan mengubah ujaran menjadi teks secara otomatis — mendukung pembelajaran mandiri di dalam dan luar kelas.
        </p>
        <div class="flex gap-3">
          <RouterLink :to="auth.isAuthenticated ? '/dashboard' : '/register'" class="px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium">Mulai Belajar →</RouterLink>
          <RouterLink to="/login" class="px-5 py-2.5 border rounded-lg text-sm">Masuk</RouterLink>
        </div>
        <div class="text-xs text-slate-500 flex gap-4">
          <span>✓ Go + Gin + GORM</span><span>✓ Vue + Vite + Tailwind</span><span>✓ JWT + RBAC</span>
        </div>
      </div>
      <div class="bg-gradient-to-br from-violet-600 to-emerald-500 rounded-2xl p-6 text-white">
        <h3 class="font-semibold">How ASR Works</h3>
        <div class="mt-3 bg-white/10 rounded-lg p-3 text-sm">
          <div class="text-white/60 text-xs">Contoh Language Model</div>
          <div class="font-mono">"I eat …" → apple / rice / breakfast</div>
        </div>
        <ol class="mt-4 space-y-1 text-sm list-decimal list-inside">
          <li>Speech Input</li><li>Signal Processing</li><li>Feature Extraction</li><li>Pattern Matching</li><li>Text Output</li>
        </ol>
      </div>
    </section>

    <!-- What is ASR -->
    <section class="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-4">
      <div class="border rounded-xl p-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div class="text-sm font-semibold text-violet-600">Definisi</div>
        <p class="text-sm mt-2">ASR adalah sistem yang dirancang untuk mengidentifikasi kata-kata yang diucapkan oleh manusia dan mengubahnya menjadi representasi teks <span class="text-slate-500">(Daniel Jurafsky)</span>.</p>
      </div>
      <div class="border rounded-xl p-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div class="text-sm font-semibold text-violet-600">James H. Martin</div>
        <p class="text-sm mt-2">ASR adalah AI yang mampu memahami bahasa lisan manusia dan memberi umpan balik otomatis.</p>
      </div>
      <div class="border rounded-xl p-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div class="text-sm font-semibold text-violet-600">Language Model</div>
        <p class="text-sm mt-2">Model memprediksi urutan kata yang mungkin muncul berikutnya dalam kalimat.</p>
      </div>
    </section>

    <!-- Benefits -->
    <section class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="text-xl font-bold">ASR meningkatkan keterampilan karena:</h2>
      <div class="grid md:grid-cols-2 gap-4 mt-4">
        <div class="space-y-2 text-sm">
          <div class="flex gap-2"><span class="text-violet-600">1.</span> Siswa dapat melatih pengucapan kata dan kalimat secara berulang hingga mencapai pelafalan yang benar</div>
          <div class="flex gap-2"><span class="text-violet-600">2.</span> Sistem dapat memberikan koreksi terhadap kesalahan pengucapan secara langsung</div>
          <div class="flex gap-2"><span class="text-violet-600">3.</span> Siswa dapat berlatih berbicara tanpa harus selalu didampingi oleh guru</div>
          <div class="flex gap-2"><span class="text-violet-600">4.</span> Integrasi ASR dalam e-book interaktif memungkinkan interaksi langsung dengan materi</div>
        </div>
        <div class="border rounded-xl p-4 bg-violet-50 dark:bg-violet-950/30 text-sm">
          <div class="font-semibold">Mendukung pembelajaran mandiri</div>
          <p class="text-slate-600 dark:text-slate-400 mt-1">Memfasilitasi belajar di dalam dan luar kelas (David Nunan). Menyesuaikan kemampuan & kecepatan masing-masing. Memberi umpan balik real-time saat membaca & berbicara (Godwin-Jones).</p>
        </div>
      </div>
    </section>

    <!-- Components -->
    <section class="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-4">
      <div class="border rounded-xl p-5">
        <h3 class="font-semibold">E-book berbasis ASR</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-2"><b>Speaking Practice</b> — fitur utama. ASR terbukti meningkatkan akurasi pengucapan, efektif untuk in-class learning (Yoa Liu).</p>
        <ul class="text-xs mt-3 list-disc list-inside text-slate-500">
          <li>Systematic Review (2020–2023) — Ms Dina: efektif speaking skill, immediate feedback, autonomous learning</li>
          <li>Xian Xian WU: mengukur akurasi, membandingkan speech dengan teks → reading aloud</li>
          <li>caoji WU: adaptif aksen & noise, real-time processing</li>
        </ul>
      </div>
      <div class="border rounded-xl p-5 bg-slate-900 text-white">
        <h3 class="font-semibold">Alur Penggunaan E-book ASR</h3>
        <ol class="mt-3 space-y-1 text-sm list-decimal list-inside text-white/80">
          <li>Siswa membuka e-book digital</li>
          <li>Membaca / mendengarkan materi</li>
          <li>Melakukan latihan berbicara</li>
          <li>Sistem ASR merekam suara</li>
          <li>Menganalisis pengucapan</li>
          <li>Memberikan umpan balik otomatis</li>
          <li>Memberi score</li>
        </ol>
        <p class="text-xs mt-3 text-white/60">Interaktif • berbasis praktik • feedback langsung • mandiri</p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 py-10 text-center">
      <div class="rounded-2xl bg-violet-600 text-white p-8">
        <h2 class="text-2xl font-bold">Siap berlatih Bahasa Inggris dengan ASR?</h2>
        <p class="text-white/80 text-sm mt-2">Login untuk membuka dashboard, atau register sebagai student/admin.</p>
        <div class="mt-4 flex justify-center gap-3">
          <RouterLink to="/register" class="px-5 py-2 bg-white text-violet-600 rounded-lg text-sm font-medium">Daftar Sekarang</RouterLink>
          <RouterLink to="/login" class="px-5 py-2 bg-violet-700 rounded-lg text-sm">Masuk</RouterLink>
        </div>
      </div>
    </section>

    <footer class="border-t py-6 text-center text-xs text-slate-500">Asri ASR E-Book • Vue + Vite + Tailwind • Go/Gin Backend</footer>
  </div>
</template>
