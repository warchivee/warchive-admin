<script lang="ts">
  //components
  import * as Drawer from "$lib/components/ui/drawer";
  import * as Pagination from "$lib/components/ui/pagination";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import DataCard from "./DataCard.svelte";
  import DataFilterForm from "./DataFilterForm.svelte";

  //utils
  import { onMount } from "svelte";
  import axiosInstance from "$lib/axios";
  import { watas } from "$lib/stores/watas.store";

  //variables
  let inputPage = "";
  let pageSize = 10;
  let currentPage = 1;

  let totalCount = 0;

  $: pageSize, fetchData(); // perPage 변경 시 fetchData 실행
  $: currentPage, fetchData(); // currentPage 변경 시 fetchData 실행

  //utils
  async function fetchData() {
    try {
      const response = await axiosInstance(
        `/watas?page=${currentPage}&pageSize=${pageSize}`
      );
      const newData = response.data;

      totalCount = newData.totalCount;

      watas.set(newData.watas);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function changeInputPage() {
    const pageNumber = +inputPage;
    handlePageClick(pageNumber);

    inputPage = "";
  }

  function handlePageClick(page: number) {
    const maxPage = Math.ceil(totalCount / pageSize);

    if (page === -1) {
      currentPage = 1;
    } else if (page > maxPage) {
      currentPage = maxPage;
    } else {
      currentPage = page;
    }

    fetchData();
  }

  onMount(async () => {
    await fetchData();
  });
</script>

<svelte:head>
  <title>데이터 관리</title>
</svelte:head>

<div class="text-lg my-4 font-bold">
  <h1>데이터 관리</h1>
</div>

<section class="mt-4">
  <article class="space-y-10">
    <div class="space-y-4">
      {#each $watas as wata}
        <DataCard data={wata} />
      {/each}
    </div>

    <div class="flex flex-col items-center gap-5">
      <Pagination.Root
        count={totalCount}
        perPage={pageSize}
        siblingCount={1}
        page={currentPage}
        let:pages
      >
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.PrevButton
              on:click={() => handlePageClick(currentPage - 1)}
            />
          </Pagination.Item>

          {#each pages as page (page.key)}
            {#if page.type === "ellipsis"}
              <Pagination.Item>
                <Pagination.Ellipsis />
              </Pagination.Item>
            {:else}
              <Pagination.Item>
                <Pagination.Link
                  {page}
                  isActive={currentPage == page.value}
                  class="text-xs w-[35px] h-[35px]"
                  on:click={() => handlePageClick(page.value)}
                >
                  {page.value}
                </Pagination.Link>
              </Pagination.Item>
            {/if}
          {/each}

          <Pagination.Item>
            <Pagination.NextButton
              on:click={() => handlePageClick(currentPage + 1)}
            />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination.Root>

      <!-- 페이지 이동 입력란과 버튼 -->
      <div class="flex items-center space-x-2 ml-4">
        <p class="text-xs">Move to ...</p>
        <Input
          type="number"
          placeholder="Page No"
          class="text-xs w-24"
          bind:value={inputPage}
          on:keydown={(event) => {
            if (event.key === "Enter") {
              changeInputPage();
            }
          }}
        />
        <Button class="text-xs rounded-md" on:click={changeInputPage}
          >이동</Button
        >
      </div>
    </div>
  </article>
</section>

<Drawer.Root shouldScaleBackground={false}>
  <Drawer.Trigger let:builder>
    <div class="fixed end-6 bottom-6">
      <Button builders={[builder]} class="w-14 h-14 rounded-full shadow-lg"
        >Filter</Button
      >
    </div></Drawer.Trigger
  >
  <Drawer.Content>
    <Drawer.Header class="flex flex-row justify-between">
      <Drawer.Title>데이터 검색</Drawer.Title>
      <Drawer.Close
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width={1.5}
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </Drawer.Close>
    </Drawer.Header>

    <div class="p-8">
      <DataFilterForm />
    </div>

    <Drawer.Footer class="flex flex-row-reverse">
      <Button class="w-[120px]">검색</Button>
      <Button class="w-[120px]" variant="ghost">전체 초기화</Button>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
