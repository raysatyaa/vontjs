<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <span class="text-2xl">🚀</span>
            <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vont Framework
            </span>
          </router-link>
          <div class="flex space-x-8">
            <router-link
              to="/"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </router-link>
            <router-link
              to="/users"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Users
            </router-link>
            <router-link
              to="/about"
              class="text-blue-600 bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          About Vont Framework
        </h1>
        <p class="text-xl text-gray-600">
          A modern full-stack TypeScript framework
        </p>
      </div>

      <!-- Features -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-semibold mb-6 text-gray-900">✨ Key Features</h2>
        <div class="space-y-4">
          <div class="flex items-start">
            <span class="text-2xl mr-4">📁</span>
            <div>
              <h3 class="font-semibold text-gray-900">File-based Routing</h3>
              <p class="text-gray-600">Automatic API and page routes based on file structure</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">🔥</span>
            <div>
              <h3 class="font-semibold text-gray-900">Hot Module Replacement</h3>
              <p class="text-gray-600">Instant feedback during development</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">⚙️</span>
            <div>
              <h3 class="font-semibold text-gray-900">Zero Configuration</h3>
              <p class="text-gray-600">Convention over configuration, works out of the box</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">🔤</span>
            <div>
              <h3 class="font-semibold text-gray-900">TypeScript First</h3>
              <p class="text-gray-600">Full type safety across your entire stack</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-semibold mb-6 text-gray-900">🛠️ Technology Stack</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Frontend</h3>
            <ul class="space-y-2 text-gray-600">
              <li>• Vue 3 - Progressive Framework</li>
              <li>• TypeScript - Type Safety</li>
              <li>• Tailwind CSS - Utility-first CSS</li>
              <li>• Vite - Lightning Fast Build Tool</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Backend</h3>
            <ul class="space-y-2 text-gray-600">
              <li>• Koa - Modern Web Framework</li>
              <li>• TypeScript - Type Safety</li>
              <li>• File-based Routing - Convention over Configuration</li>
              <li>• Hot Reload - Fast Development</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Links -->
      <div class="mt-12 text-center">
        <div class="flex justify-center gap-4">
          <a
            href="https://github.com/yourusername/vont"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
          >
            GitHub
          </a>
          <router-link
            to="/users"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
          >
            Try Demo →
          </router-link>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p class="text-center text-gray-600">
          Built with ❤️ using Vont Framework + Vue 3 + TypeScript
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 关于页面组件
</script>

