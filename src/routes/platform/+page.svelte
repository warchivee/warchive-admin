<script lang="ts">
  //components
  import * as Alert from "$lib/components/ui/alert";
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";

  //dislogs
  import AddPlatformDialog from "./dialogs/AddPlatformDialog.svelte";
  import EditPlatformDialog from "./dialogs/EditPlatformDialog.svelte";
  import DeletePlatformDialog from "./dialogs/DeletePlatformDialog.svelte";

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
</script>

<svelte:head>
  <title>키워드 관리</title>
</svelte:head>

<div class="text-lg my-4 font-bold">
  <h1>플랫폼 관리</h1>
</div>

<Tabs.Root value="category-1">
  <Tabs.List class="flex">
    {#each $categories as category}
      <Tabs.Trigger class="flex-1" value="category-{category.id}"
        >{category.name}</Tabs.Trigger
      >
    {/each}
  </Tabs.List>
  {#each $categories as category}
    <Tabs.Content value="category-{category.id}">
      <Alert.Root class="mb-4">
        <Terminal class="h-4 w-4" />
        <Alert.Title>각 항목 설명</Alert.Title>
        <Alert.Description
          >· <b>상단 노출 여부</b>는 와카이브 웹의 [키워드로 검색] 창에서
          상단으로 정렬시켜 사용자들에게 먼저 노출할 지의 여부입니다. 주로
          메이저 플랫폼을 상단노출 시킵니다.<br /> · <b>도메인</b>은 데이터 입력
          시 플랫폼의 URL을 붙여넣을 때 플랫폼이 자동 선택되게 하기 위해
          입력하는 항목입니다. 각 플랫폼의 URL 도메인명, 혹은 호스트명을
          입력하시면 됩니다.</Alert.Description
        >
      </Alert.Root>

      <Card.Root>
        <Card.Content class="p-4 w-full">
          <ul class="flex gap-4 flex-col">
            {#each category.platforms as platform, index}
              <li
                class="flex justify-between items-center rounded-md border border-slate-200 bg-white p-4"
              >
                <div class="space-y-2">
                  <div class="space-x-2">
                    <h2 class="inline-block text-md font-semibold">
                      {platform.name}
                    </h2>
                    {#if platform.orderTop}
                      <Badge class="ml-4">상단노출</Badge>
                    {/if}
                  </div>
                  <p class="text-gray-500 text-sm">
                    도메인: {platform?.domain ? platform.domain : "-"}
                  </p>
                </div>

                <div class="flex">
                  <EditPlatformDialog {category} value={platform} />
                  <DeletePlatformDialog {category} value={platform} />
                </div>
              </li>
            {/each}

            <AddPlatformDialog {category} />
          </ul>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  {/each}
</Tabs.Root>
