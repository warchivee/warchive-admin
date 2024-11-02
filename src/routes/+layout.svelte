<script lang="ts">
  //styles
  import "../app.css";

  //components
  import Header from "$lib/components/Header.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
</script>

<div class="app bg-slate-50">
  <Header></Header>

  <main class="p-4 mt-12 sm:ml-64">
    <slot></slot>
  </main>

  <footer class="p-4 mt-12 sm:ml-64">
    <p>Copyright © 2024 Warchive. All rights reserved.</p>
  </footer>

  <Toaster />
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    font-size: small;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
