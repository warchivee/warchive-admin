<script lang="ts">
  //components
  import * as Alert from "$lib/components/ui/alert";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import RightArrow from "lucide-svelte/icons/chevron-right";

  //dialogs
  import AddCategoryDialog from "./AddCategoryDialog.svelte";
  import AddGenreDialog from "./AddGenreDialog.svelte";
  import EditCategoryDialog from "./EditCategoryDialog.svelte";
  import EditGenreDialog from "./EditGenreDialog.svelte";

  //icons
  import Terminal from "lucide-svelte/icons/terminal";

  //utils
  import type { PageData } from "./$types.js";
  import { categories } from "$lib/stores/categories.store";
  import type { Category, Genre, Platform } from "@prisma/client";

  //variables
  export let data: PageData;

  categories.set(
    data.categories as (Category & {
      genres: Genre[];
      platforms: Platform[];
    })[]
  );

  let selectCategoryIndex = 0;
</script>

<svelte:head>
  <title>카테고리 관리</title>
</svelte:head>

<div class="text-lg my-4 font-bold">
  <h1>카테고리 관리</h1>
</div>

<Alert.Root class="mb-4">
  <Terminal class="h-4 w-4" />
  <Alert.Title>유의사항</Alert.Title>
  <Alert.Description
    >카테고리와 장르의 추가는 신중한 검토와 논의 후 결정해주시기 바랍니다.
    추가된 카테고리와 장르는 특별한 사유가 없는 한 삭제가 어렵습니다.</Alert.Description
  >
</Alert.Root>

<Card.Root>
  <Card.Content class="p-4 flex flex-col md:flex-row gap-4">
    <ul class="flex-1 flex gap-4 flex-col">
      {#each $categories as category, index}
        {@const selected = selectCategoryIndex === index}
        <li
          class="flex justify-between items-center transition rounded-md border border-slate-300 hover:border-slate-500 {selected
            ? 'bg-black text-white'
            : 'bg-white'}"
        >
          <span
            class="cursor-pointer flex-1 p-2 text-sm"
            on:click={() => {
              selectCategoryIndex = index;
            }}
            aria-hidden
          >
            {category.name}
          </span>
          <EditCategoryDialog value={category} />
        </li>
      {/each}

      <AddCategoryDialog />
    </ul>

    <Separator orientation="vertical" />

    <ul class="flex-1 flex gap-4 flex-col">
      {#if selectCategoryIndex === -1}
        <!-- content here -->
      {:else}
        {@const category = $categories[selectCategoryIndex]}

        <h4 class="text-lg mb-2 font-bold flex items-center">
          {category.name}
          <RightArrow class="h-5 w-5 text-slate-400" />
        </h4>

        {#each category.genres as genre, index}
          <li
            class="flex justify-between items-center rounded-md border border-slate-300 bg-white"
          >
            <span class="flex-1 p-2 text-sm">
              {genre.name}
            </span>
            <EditGenreDialog {category} value={genre} />
          </li>
        {/each}

        <AddGenreDialog {category} />
      {/if}
    </ul>
  </Card.Content>
</Card.Root>
