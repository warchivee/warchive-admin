<script lang="ts">
  //components
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Alert from "$lib/components/ui/alert";

  //dialogs
  import AddKeywordDialog from "./AddKeywordDialog.svelte";
  import EditKeywordDialog from "./EditKeywordDialog.svelte";
  import DeleteKeywordDialog from "./DeleteKeywordDialog.svelte";
  import MergeKeywordDialog from "./MergeEeywordDialog.svelte";

  //icons
  import Terminal from "lucide-svelte/icons/terminal";

  //utils
  import type { PageData } from "./$types.js";
  import { keywords } from "$lib/stores/keywords.store";
  import { cautions } from "$lib/stores/cautions.store";

  //variables
  export let data: PageData;

  keywords.set(data.keywords);
  cautions.set(data.cautions);
</script>

<svelte:head>
  <title>키워드 관리</title>
</svelte:head>

<div class="text-lg my-4 font-bold">
  <h1>키워드 관리</h1>
</div>

<Tabs.Root value="keywords">
  <Tabs.List class="flex">
    <Tabs.Trigger class="flex-1" value="keywords">키워드</Tabs.Trigger>
    <Tabs.Trigger class="flex-1" value="cautions">주의키워드</Tabs.Trigger>
  </Tabs.List>
  {#each ["keywords", "cautions"] as keywordType}
    {@const allKeywords = keywordType === "keywords" ? $keywords : $cautions}
    <Tabs.Content value={keywordType}>
      {#if keywordType === "keywords"}
        <Alert.Root class="my-4">
          <Terminal class="h-4 w-4" />
          <Alert.Title>키워드 추가 시 주의사항</Alert.Title>
          <Alert.Description
            >키워드가 많으면 사용자들이 검색할 때 오히려 혼란스러울 수 있습니다.
            키워드 추가 시에는 신중한 논의를 하여 사용자가 흔히 알아볼 수 있고
            키워드로써 자주 사용하는 단어로 추가해주시기 바랍니다.</Alert.Description
          >
        </Alert.Root>
      {:else}
        <Alert.Root class="my-4">
          <Terminal class="h-4 w-4" />
          <Alert.Title>주의 키워드 주의사항</Alert.Title>
          <Alert.Description>주의 키워드 주의사항</Alert.Description>
        </Alert.Root>
      {/if}

      <Card.Root>
        <Card.Content class="p-4 w-full">
          <div class="flex justify-between items-center py-2">
            <AddKeywordDialog type={keywordType} />

            <MergeKeywordDialog type={keywordType} {allKeywords} />
          </div>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each allKeywords as keyword, index}
              <li
                class="flex justify-between items-center rounded-md border border-slate-200 bg-white pl-4 pr-2 py-2"
              >
                <div class="space-y-2">
                  <h2 class="inline-block text-sm">
                    {keyword.name}
                  </h2>
                  {#if keyword.description}
                    <p class="text-gray-500 text-sm">
                      {keyword.description}
                    </p>
                  {/if}
                </div>

                <div class="flex">
                  <EditKeywordDialog type={keywordType} value={keyword} />
                  <DeleteKeywordDialog type={keywordType} value={keyword} />
                </div>
              </li>
            {/each}
          </ul>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  {/each}
</Tabs.Root>
