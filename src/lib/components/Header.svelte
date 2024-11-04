<!-- https://flowbite.com/docs/components/sidebar/ -->

<script>
  //components
  import * as Dialog from "$lib/components/ui/dialog";
  import Menu from "./Menu.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button";

  //assets
  import logo from "$lib/images/logo.png";
  import { enhance } from "$app/forms";

  //utils
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let open = false;
  let isMobile = false;

  onMount(() => {
    const handleResize = () => {
      isMobile = window.innerWidth < 640;
      if (!isMobile) {
        open = false;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  function toggleMenu() {
    open = !open;
  }
</script>

<nav
  class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
>
  <div class="px-3 py-3 lg:px-5 lg:pl-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-start rtl:justify-end">
        <Dialog.Root bind:open>
          <Dialog.Trigger
            class={`${buttonVariants({ variant: "ghost" })} sm:hidden`}
          >
            <svg
              class="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </Dialog.Trigger>
          <Dialog.Content
            class="flex flex-col pr-0 pl-0 translate-x-0 translate-y-0 bg-background fixed z-50 shadow-lg inset-y-0 left-0 h-full w-[300px] border-r sm:max-w-sm "
          >
            <Dialog.Header>
              <Dialog.Title>Menu</Dialog.Title>
            </Dialog.Header>
            <Menu handleClick={toggleMenu} />
          </Dialog.Content>
        </Dialog.Root>

        <a href="/" class="ms-2 md:me-24 hidden sm:flex">
          <img src={logo} class="h-8 me-3" alt="Warchive Logo" />
          <span
            class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
            >Warchive</span
          >
        </a>
      </div>

      {#if $page.data?.user}
        <div class="flex items-center">
          <div class="flex items-center ms-3 gap-2">
            <form action="/?/logout" method="post" use:enhance>
              <Button class="text-sm h-[30px]" type="submit">로그아웃</Button>
            </form>
          </div>
        </div>
      {/if}
    </div>
  </div>
</nav>

<aside
  id="logo-sidebar"
  class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
>
  <Menu handleClick={() => {}} />
</aside>
