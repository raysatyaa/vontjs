<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
              class="text-blue-600 bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
            >
              Users
            </router-link>
            <router-link
              to="/about"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
        <p class="text-gray-600">Manage users with full CRUD operations</p>
      </div>

      <!-- Add User Form -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-900">Add New User</h2>
        <form @submit.prevent="handleAddUser" class="flex gap-4">
          <div class="flex-1">
            <input
              v-model="newUser.name"
              type="text"
              placeholder="Name"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="flex-1">
            <input
              v-model="newUser.email"
              type="email"
              placeholder="Email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Adding...' : 'Add User' }}
          </button>
        </form>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8"
      >
        {{ error }}
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-8"
      >
        {{ successMessage }}
      </div>

      <!-- Loading State -->
      <div v-if="loading && !users.length" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading users...</p>
      </div>

      <!-- Users List -->
      <div v-else-if="users.length > 0" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="editingUserId === user.id" class="flex items-center gap-2">
                    <input
                      v-model="editForm.name"
                      type="text"
                      class="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div v-else class="text-sm font-medium text-gray-900">
                    {{ user.name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="editingUserId === user.id" class="flex items-center gap-2">
                    <input
                      v-model="editForm.email"
                      type="email"
                      class="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div v-else class="text-sm text-gray-600">
                    {{ user.email }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div v-if="editingUserId === user.id" class="flex justify-end gap-2">
                    <button
                      @click="handleSaveEdit(user.id)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEdit"
                      class="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                  <div v-else class="flex justify-end gap-2">
                    <button
                      @click="startEdit(user)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDeleteUser(user.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
        <div class="text-6xl mb-4">👥</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Users Yet</h3>
        <p class="text-gray-600">Add your first user using the form above</p>
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
import { ref, onMounted } from 'vue';
import { userApi } from '../lib/api';
import type { User } from '../types/api';

// State
const users = ref<User[]>([]);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');
const editingUserId = ref<number | null>(null);

const newUser = ref({
  name: '',
  email: '',
});

const editForm = ref({
  name: '',
  email: '',
});

// 加载用户列表
const loadUsers = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await userApi.getAll();
    users.value = response.data || [];
  } catch (err) {
    error.value = 'Failed to load users';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 添加用户
const handleAddUser = async () => {
  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const response = await userApi.create(newUser.value);
    if (response.data) {
      users.value.push(response.data);
      newUser.value = { name: '', email: '' };
      successMessage.value = 'User added successfully!';
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    }
  } catch (err) {
    error.value = 'Failed to add user';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 开始编辑
const startEdit = (user: User) => {
  editingUserId.value = user.id;
  editForm.value = {
    name: user.name,
    email: user.email,
  };
};

// 取消编辑
const cancelEdit = () => {
  editingUserId.value = null;
  editForm.value = { name: '', email: '' };
};

// 保存编辑
const handleSaveEdit = async (userId: number) => {
  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const response = await userApi.update(userId, editForm.value);
    if (response.data) {
      const index = users.value.findIndex((u) => u.id === userId);
      if (index !== -1) {
        users.value[index] = response.data;
      }
      editingUserId.value = null;
      successMessage.value = 'User updated successfully!';
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    }
  } catch (err) {
    error.value = 'Failed to update user';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 删除用户
const handleDeleteUser = async (userId: number) => {
  if (!confirm('Are you sure you want to delete this user?')) {
    return;
  }

  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    await userApi.delete(userId);
    users.value = users.value.filter((u) => u.id !== userId);
    successMessage.value = 'User deleted successfully!';
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (err) {
    error.value = 'Failed to delete user';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 组件挂载时加载用户
onMounted(() => {
  loadUsers();
});
</script>

