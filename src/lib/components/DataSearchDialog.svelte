<script lang="ts">
  //components
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import DataCard from "./DataCard.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

  //utils
  import { cn } from "$lib/utils.js";
  import { toast } from "svelte-sonner";
  import axiosInstance from "$lib/axios";
  import type { Wata } from "../../routes/data/type";

  //variables
  let open = false;
  let input = "";
  let searchDatas: Wata[] | null = null;
</script>

<Dialog.Root
  bind:open
  onOpenChange={() => {
    input = "";
    searchDatas = null;
  }}
>
  <Dialog.Trigger
    class={cn(
      buttonVariants({ variant: "outline" }),
      "w-[180px] text-sm h-[30px]"
    )}
  >
    <span class="w-full text-left">검색하기...</span>
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px] h-3/4 content-start">
    <Dialog.Header>
      <Dialog.Title>데이터 검색</Dialog.Title>
    </Dialog.Header>

    <div>
      <Input
        bind:value={input}
        type="text"
        placeholder="제목을 입력해주세요..."
        on:keydown={async (event) => {
          if (event.key === "Enter") {
            if (input.trim().length <= 0) {
              toast.error("공백은 입력할 수 없습니다.");
              return;
            }

            try {
              const response = await axiosInstance.get(`/watas?title=${input}`);

              searchDatas = response.data?.watas ?? [];
            } catch (error) {
              console.error(error);
              toast.error("sorry, this functions is failed");
            }
          }
        }}
      />
    </div>

    <ScrollArea>
      <div>
        {#if searchDatas && searchDatas.length <= 0}
          <div>검색 결과가 없습니다.</div>
        {:else if searchDatas && searchDatas.length > 0}
          <div class="space-y-4">
            {#each searchDatas as data}
              <DataCard {data} />
            {/each}
          </div>
        {/if}
      </div>
    </ScrollArea>
  </Dialog.Content>
</Dialog.Root>
