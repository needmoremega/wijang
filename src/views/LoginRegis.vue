<script setup>
import { ref, computed, shallowRef } from 'vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';

const isLogin = ref(true);
const formTitle = computed(() => (isLogin.value ? 'Login' : 'Register'));
const currentComponent = shallowRef(LoginPage);

const toggleForm = () => {
  isLogin.value = !isLogin.value;
  currentComponent.value = isLogin.value ? LoginPage : RegisterPage;
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <div class="card bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700">
      <div class="flex justify-center mb-4">
        <img src="/src/assets/gibrna.jpg" alt="Icon" class="w-24 h-24 object-cover rounded-full shadow-lg transition-transform duration-300 hover:scale-105" />
      </div>

      <h3 class="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200 transition-all duration-300">
        {{ formTitle }}
      </h3>

      <div class="mt-4 min-h-[250px] flex justify-center items-center w-full">
        <Transition name="fade-slide" mode="out-in">
          <div class="w-full max-w-md" :key="isLogin">
            <component :is="currentComponent" />
          </div>
        </Transition>
      </div>

      <button
        class="btn btn-outline w-full mt-6 py-2 font-medium text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-600 rounded-lg transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
        @click.prevent="toggleForm">
        {{ isLogin ? 'Belum punya akun? Register' : 'Sudah punya akun? Login' }}
      </button>
    </div>
  </div>
</template>

<style>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
