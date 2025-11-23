<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">🚀</span>
            <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vont Vue Example
            </span>
          </div>
          <div class="flex space-x-8">
            <router-link
              to="/"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              activeClass="text-blue-600 bg-blue-50"
            >
              Home
            </router-link>
            <router-link
              to="/users"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              activeClass="text-blue-600 bg-blue-50"
            >
              Users
            </router-link>
            <router-link
              to="/about"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              activeClass="text-blue-600 bg-blue-50"
            >
              About
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          Welcome to
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Vont Vue Example
          </span>
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          A modern full-stack TypeScript framework with Vue 3
        </p>
        <div class="flex justify-center gap-4">
          <router-link
            to="/users"
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            View Users →
          </router-link>
          <router-link
            to="/about"
            class="bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg border border-gray-200"
          >
            Learn More
          </router-link>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mt-16">
        <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div class="text-4xl mb-4">📁</div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900">File-based Routing</h3>
          <p class="text-gray-600">
            Automatic API and page routes based on file structure
          </p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div class="text-4xl mb-4">🔥</div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900">Hot Module Replacement</h3>
          <p class="text-gray-600">
            Instant feedback during development with HMR
          </p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div class="text-4xl mb-4">🔤</div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900">TypeScript First</h3>
          <p class="text-gray-600">
            Full type safety across your entire stack
          </p>
        </div>
      </div>

      <!-- Code Example -->
      <div class="mt-16 bg-gray-900 rounded-xl p-8 shadow-2xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white font-semibold">Quick Start</h3>
          <div class="flex space-x-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <pre class="text-green-400 font-mono text-sm overflow-x-auto"><code>$ npm create vont@latest
$ cd my-vont-app
$ npm run dev

🚀 Development server is ready!
📍 Local:   http://localhost:3000</code></pre>
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
// 首页组件
</script>

