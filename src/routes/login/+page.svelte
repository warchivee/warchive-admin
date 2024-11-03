<script lang="ts">
  //components
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";

  //utils
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  //variables
  export let form: ActionData;
</script>

<svelte:head>
  <title>로그인</title>
</svelte:head>

<div class="flex flex-col items-center justify-center mt-24">
  <img
    class="w-[375px]"
    src="https://www.womynarchive.com/images/logo/sh-logo.png"
    alt="warchive-logo"
  />

  <form method="post" use:enhance>
    <Card.Root class="w-[375px]">
      <Card.Header class="space-y-3">
        <Card.Title>Login</Card.Title>
        <Card.Description>계정과 비밀번호를 입력해주세요.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid w-full items-center gap-4">
          <div class="grid w-full max-w-sm items-center gap-1.5">
            <Label for="account">계정</Label>
            <!-- <input
          class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          type="text"
          name="account"
        /> -->

            <Input
              type="text"
              id="account"
              name="account"
              placeholder="account"
              autocomplete="false"
            />
          </div>

          <div class="grid w-full max-w-sm items-center gap-1.5">
            <Label for="password">비밀번호</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              autocomplete="false"
            />
            <!-- <input
          class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          type="password"
          name="password"
        /> -->
          </div>

          <p class="text-sm text-red-500">{form?.message ?? ""}</p>
        </div>
      </Card.Content>
      <Card.Footer>
        <Button type="submit" class="w-full">로그인</Button>
      </Card.Footer>
    </Card.Root>
  </form>
</div>
