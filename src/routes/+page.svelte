<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<h1>Hi, {data.user.name}!</h1>
<form action="/?/logout" method="post" use:enhance>
  <button>Sign out</button>
</form>
