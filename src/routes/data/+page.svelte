<script lang="ts">
  //components
  import * as Pagination from "$lib/components/ui/pagination";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import DataCard from "./components/DataCard.svelte";
  import DataFilterForm from "./components/DataFilterForm.svelte";
  import DataEditDialog from "./dialogs/DataEditDialog.svelte";
  import DataCardSkeleton from "./components/DataCardSkeleton.svelte";

  //utils
  import { onMount } from "svelte";
  import axiosInstance from "$lib/axios";
  import { watas } from "$lib/stores/watas.store";
  import { toast } from "svelte-sonner";

  //variables
  let loading = false;

  let inputPage = "";
  let pageSize = 10;
  let currentPage = 1;
  let serachDataInput = "";
  let searchConditions: Record<string, any> = {};
  let totalCount = 0;

  $: pageSize, fetchData(); // perPage 변경 시 fetchData 실행
  $: currentPage, fetchData(); // currentPage 변경 시 fetchData 실행

  //utils
  async function fetchData() {
    loading = true;

    try {
      const {
        title,
        categories,
        label,
        updateDate,
        isPublished,
        needWriteItems,
      } = searchConditions;

      const params = {
        page: currentPage,
        pageSize: pageSize,
        ...(title && { title }),
        ...(categories && categories.length > 0 && { categories }),
        ...(label && label.length > 0 && { label: label.join(",") }),
        ...(updateDate?.start && {
          updateStartDate: new Date(updateDate.start)?.toLocaleDateString(
            "en-CA"
          ),
        }),
        ...(updateDate?.end && {
          updateEndDate: new Date(updateDate?.end)?.toLocaleDateString("en-CA"),
        }),
        ...(isPublished && { isPublished }),
        ...(needWriteItems &&
          needWriteItems.length > 0 && {
            needWriteItems: needWriteItems.join(","),
          }),
      };

      let queryString = "";

      if (params) {
        queryString += Object.keys(params)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
          )
          .join("&");
      }

      const response = await axiosInstance.get(`/watas?${queryString}`);
      const newData = response.data;

      totalCount = newData.totalCount;

      watas.set(newData.watas);
    } catch (error) {
      toast.error(`Error fetching data: ${error}`);
    } finally {
      loading = false;
    }
  }

  async function refreshData() {
    if (currentPage === 1) {
      await fetchData();
    } else {
      currentPage = 1;
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
  }

  onMount(async () => {
    await fetchData();
  });
</script>

<svelte:head>
  <title>데이터 관리</title>
</svelte:head>

<div class="flex justify-between">
  <h1 class="text-lg my-4 font-bold">데이터 관리</h1>

  {#if !loading}
    <DataEditDialog action="add" />
  {/if}
</div>

<div
  class="sticky top-14 z-10 bg-white opacity-90 hover:opacity-100 shadow-md rounded-md p-4"
>
  <div class="relative">
    <div
      class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
    >
      <svg
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
    </div>
    <Input
      class="pl-10"
      bind:value={serachDataInput}
      disabled={loading}
      type="text"
      placeholder="제목을 입력해주세요..."
      on:keydown={async (event) => {
        if (event.key === "Enter") {
          if (serachDataInput.trim().length <= 0) {
            toast.error("공백은 입력할 수 없습니다.");
            return;
          }

          searchConditions = { title: serachDataInput };

          await refreshData();
        }
      }}
    />

    {#if !loading}
      <div class="absolute inset-y-0 end-0 flex items-center pr-3">
        <DataFilterForm
          handleSubmit={async (formData) => {
            serachDataInput = "";
            searchConditions = formData;

            await refreshData();
          }}
        />
      </div>
    {/if}
  </div>
</div>

<section class="mt-4">
  <article class="space-y-10">
    {#if loading}
      <DataCardSkeleton />
      <DataCardSkeleton />
      <DataCardSkeleton />
    {:else}
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
    {/if}
  </article>
</section>
