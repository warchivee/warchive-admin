<script lang="ts">
  //components
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  //utils
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  //variables
  export let form: ActionData;
</script>

<svelte:head>
  <title>Signin</title>
</svelte:head>

<form method="post" use:enhance>
  <div class="grid w-full max-w-sm items-center gap-1.5">
    <Label for="account">계정</Label>
    <input
      class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
      type="text"
      name="account"
    />
  </div>

  <div class="grid w-full max-w-sm items-center gap-1.5">
    <Label for="password">비밀번호</Label>
    <input
      class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
      type="password"
      name="password"
    />
  </div>

  <p>{form?.message ?? ""}</p>

  <Button type="submit">로그인하기</Button>
</form>
