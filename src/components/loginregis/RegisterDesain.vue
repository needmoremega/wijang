<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="card w-96 bg-white shadow-xl p-6">
      <form>
        <!-- Input dengan animasi label ke border -->
        <div class="form-control relative mb-6">
          <label
            :class="{
              'absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200': true,
              'text-xs -top-2 left-3 px-1 bg-white': isFocused || inputValue,
            }"
          >
            Email
          </label>
          <input
            type="email"
            v-model="inputValue"
            @focus="isFocused = true"
            @blur="isFocused = false"
            class="input input-bordered w-full pt-4"
          />
        </div>
        <div class="form-control relative mb-6">
          <label
            :class="{
              'absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200': true,
              'text-sm -top-2.5 left-1 px-2 font-bold': isPasswordFocused || passwordValue,
            }"
          >
            Password
          </label>
          <input
            type="password"
            v-model="passwordValue"
            @focus="isPasswordFocused = true"
            @blur="isPasswordFocused = false"
            class="input input-bordered w-full pt-4"
          />
        </div>
        <button type="submit" class="btn btn-primary w-full">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      passwordValue: '',
      isFocused: false,
      isPasswordFocused: false,
    }
  },
}
</script>

<style scoped>
/* Adjust padding to ensure label floats at the border */
.input {
  padding-top: 1rem; /* Space for the label to "float" */
}
</style>
