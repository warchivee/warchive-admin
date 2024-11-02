<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<h1>Hi, {$page.data?.user?.name}!</h1>
<form action="/?/logout" method="post" use:enhance>
  <button>Sign out</button>
</form>
