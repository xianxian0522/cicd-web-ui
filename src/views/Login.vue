<template>
  <div class="login">
    <div class="login-admin">
      <h2>通过 SSO 登录 CICD</h2>
      <a-button size="large" type="primary" @click="login">登录</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cicdRepository from "@/api/cicdRepository";
import tokenRepositories from "@/composable/tokenRepositories";

export default defineComponent({
  name: "Login",
  setup() {
    const login = async () => {
      try {
        const data = await cicdRepository.login()
        if (data?.url) {
          window.location.href = data.url
        }
        if (data?.token) {
          tokenRepositories(data?.token)
        }
      } catch (e) {
        console.error(e)
      }
    }

    return {
      login,
    }
  }
});
</script>

<style lang="less" scoped>
@import "../components/index";
</style>
