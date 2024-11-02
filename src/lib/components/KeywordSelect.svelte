<script lang="ts">
  //components
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { toast } from "svelte-sonner";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { buttonVariants } from "$lib/components/ui/button";

  //icons
  import XIcon from "lucide-svelte/icons/x";
  import Check from "lucide-svelte/icons/check";

  //utils
  import { cn } from "$lib/utils";

  //variables
  export let limitMessage: string = "";
  export let limitCount: number | undefined = undefined;
  export let allKeywords: { id: number; name: string }[] = [];
  export let values: { id: number; name: string }[] = [];
  export let onChange: (values: { id: number; name: string }[]) => void;
</script>

<Popover.Root let:ids>
  <Popover.Trigger
    class={cn(
      buttonVariants({ variant: "outline" }),
      "w-full h-fit flex flex-wrap justify-start gap-4",
      !values && "text-muted-foreground"
    )}
    role="combobox"
  >
    {#if values && values?.length > 0}
      {@const selectedKeywords = allKeywords.filter((keyword) =>
        values?.find((fk) => fk.id === keyword.id)
      )}
      {#each selectedKeywords as selectedKeyword}
        <Badge variant="secondary"
          >{selectedKeyword.name}
          <Button
            class="h-fit w-fit p-0"
            variant="ghost"
            on:click={() => {
              onChange(values?.filter((fk) => fk.id !== selectedKeyword.id));
            }}><XIcon class="ml-auto h-4 w-4"></XIcon></Button
          ></Badge
        >
      {/each}
    {:else}
      <p class="text-slate-500">키워드를 선택해주세요.</p>
    {/if}
    <!-- <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" /> -->
  </Popover.Trigger>
  <Popover.Content class="w-[95%] p-0">
    <Command.Root>
      <Command.Input autofocus placeholder="Search keywords..." class="h-9" />
      <Command.Empty>No keyword found</Command.Empty>
      <Command.Group>
        <ScrollArea class="h-[200px] w-full">
          {#each allKeywords as keyword}
            {@const hasKeyword = !!values?.find((fk) => fk.id === keyword.id)}
            <Command.Item
              value={keyword.name}
              onSelect={() => {
                if (hasKeyword) {
                  onChange(values?.filter((fk) => fk.id !== keyword.id));
                  return;
                }

                if (limitCount && (values ?? [])?.length >= limitCount) {
                  toast.error(limitMessage);
                  return;
                }

                const newKeywords = values ?? [];
                newKeywords.push(keyword);

                onChange(newKeywords);
              }}
            >
              <span class={hasKeyword ? "text-slate-300" : ""}>
                {keyword.name}
              </span>

              <Check
                class={cn("ml-auto h-4 w-4", !hasKeyword && "text-transparent")}
              />
            </Command.Item>
          {/each}
        </ScrollArea>
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
