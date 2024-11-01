<script lang="ts">
  //components
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
  let searchConditions: Record<string, any> = {};

  let totalCount = 0;

  $: pageSize, fetchData(); // perPage 변경 시 fetchData 실행
  $: currentPage, fetchData(); // currentPage 변경 시 fetchData 실행

  //utils
  async function fetchData() {
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

<DataFilterForm
  handleSubmit={async (formData) => {
    searchConditions = formData;

    if (currentPage === 1) {
      await fetchData();
    } else {
      currentPage = 1;
    }
  }}
/>
