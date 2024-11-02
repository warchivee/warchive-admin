<script>
  import { page } from "$app/stores";

  export let handleClick;
</script>

<div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
  <ul class="space-y-2 font-medium">
    <li>
      <a
        on:click={handleClick}
        aria-current={$page.url.pathname === "/data" ? "page" : undefined}
        href="/data"
        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        <span class="flex-1 ms-3 whitespace-nowrap">데이터 관리</span>
      </a>
    </li>
    <li aria-current={$page.url.pathname === "/category" ? "page" : undefined}>
      <a
        on:click={handleClick}
        href="/category"
        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        <span class="flex-1 ms-3 whitespace-nowrap">카테고리 관리</span>
      </a>
    </li>

    <li aria-current={$page.url.pathname === "/keyword" ? "page" : undefined}>
      <a
        on:click={handleClick}
        href="/keyword"
        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        <span class="flex-1 ms-3 whitespace-nowrap">키워드 관리</span>
      </a>
    </li>

    <li aria-current={$page.url.pathname === "/platform" ? "page" : undefined}>
      <a
        on:click={handleClick}
        href="/platform"
        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        <span class="flex-1 ms-3 whitespace-nowrap">플랫폼 관리</span>
      </a>
    </li>
    <li aria-current={$page.url.pathname === "/publish" ? "page" : undefined}>
      <a
        on:click={handleClick}
        href="/publish"
        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        <span class="flex-1 ms-3 whitespace-nowrap">데이터 업데이트</span>
      </a>
    </li>
  </ul>
</div>
