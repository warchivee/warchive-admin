<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { signIn } from "@auth/sveltekit/client";
  import { onMount } from "svelte";

  let username = "";
  let password = "";
  let loginError = "";

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const code = urlParams.get("code");

    if (error === "CredentialsSignin" && code === "credentials") {
      loginError = "Invalid username or password. Please try again.";
    }
  });
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

  <Button
    type="submit"
    on:click={() =>
      signIn("credentials", { username, password, callbackUrl: "/" })}
    >로그인하기</Button
  >
</div>
