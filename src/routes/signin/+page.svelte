<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { signIn } from "@auth/sveltekit/client";

  let username = "";
  let password = "";
  let loginError = "";

  async function handleSignIn() {
    try {
      loginError = "";
      await signIn("credentials", {
        username,
        password,
        callbackUrl: "/",
      });
    } catch (error) {
      loginError = "Login failed. Please check your username and password.";
    }
  }
</script>

<svelte:head>
  <title>Signin</title>
</svelte:head>

<div>
  <div class="grid w-full max-w-sm items-center gap-1.5">
    <Label for="username">계정</Label>
    <Input id="username" autocomplete="off" bind:value={username} />
  </div>

  <div class="grid w-full max-w-sm items-center gap-1.5">
    <Label for="password">비밀번호</Label>
    <Input
      type="password"
      id="password"
      autocomplete="off"
      bind:value={password}
    />
  </div>

  {#if loginError}
    <p class="errorText">{loginError}</p>
  {/if}

  <Button type="submit" on:click={handleSignIn}>로그인하기</Button>
</div>
