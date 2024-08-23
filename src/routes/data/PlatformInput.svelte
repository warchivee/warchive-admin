<script lang="ts">
  //components
  import * as Select from "$lib/components/ui/select/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import Button from "$lib/components/ui/button/button.svelte";

  //icons
  import { XIcon } from "lucide-svelte";
  import Plus from "lucide-svelte/icons/plus";
  import type { Platform } from "./type";

  //utils

  export let allPlatforms: Platform[];
  export let values: Platform[];
  export let onChange: (values: Platform[]) => void;
</script>

{#if values}
  <ul class="space-y-2">
    {#each values as value, index}
      {@const selectedPlatform = value
        ? { value: value.id, label: value.name }
        : undefined}
      <li class="flex items-center justify-between gap-1">
        <div class="flex-1 p-0 rounded-md overflow-hidden">
          <Select.Root
            selected={selectedPlatform}
            onSelectedChange={(v) => {
              if (!v) {
                return;
              }

              const newPlatforms = values ?? [];
              newPlatforms[index] = {
                ...value,
                id: v.value,
                name: v?.label ?? "",
              };

              onChange(newPlatforms);
            }}
          >
            <Select.Trigger
              class="w-full h-8 text-xs bg-slate-100 border-none rounded-none"
            >
              <Select.Value placeholder="플랫폼을 선택하세요..." />
            </Select.Trigger>
            <Select.Content>
              <ScrollArea class="h-[200px]">
                {#if !allPlatforms || allPlatforms.length === 0}
                  <p class="text-center p-5">장르를 먼저 선택해주세요.</p>
                {:else}
                  {#each allPlatforms as platform}
                    <Select.Item value={platform.id} label={platform.name} />
                  {/each}
                {/if}
              </ScrollArea>
            </Select.Content>
          </Select.Root>
          <Input
            class="text-xs h-8 rounded-none border-slate-100"
            autocomplete="off"
            bind:value={value.url}
            on:input={(e) => {
              const target = e.target;

              if (!(target instanceof HTMLInputElement)) {
                return;
              }

              const input = target.value;
              const domain = input.includes("?") ? input.split("?")[0] : input;

              const matchPlatform = allPlatforms?.find(
                (p) => p.domain && domain.includes(p.domain)
              );

              if (!matchPlatform) {
                return;
              }

              const newPlatforms = values ?? [];
              newPlatforms[index] = {
                ...value,
                ...matchPlatform,
              };

              onChange(newPlatforms);
            }}
          />
        </div>

        <div class="w-fit h-fit p-0">
          <Button
            variant="ghost"
            class="w-fit h-fit p-2"
            on:click={() => {
              const newPlatforms = values ?? [];

              onChange(newPlatforms.filter((np) => np.id !== value.id));
            }}><XIcon class="h-4 w-4 text-slate-400" /></Button
          >
        </div>
      </li>
    {/each}
  </ul>
{/if}

<Button
  variant="ghost"
  class="flex gap-1 items-center w-fit"
  on:click={() => {
    if (values && values[values.length - 1]?.id === -1) {
      return;
    }

    const newPlatforms = values ?? [];

    newPlatforms.push({
      id: -1,
      name: "",
      url: "",
    });

    onChange(newPlatforms);
  }}
>
  <Plus class="h-5 w-5 text-slate-400" />
  <div class="underline underline-offset-2">'플랫폼 추가</div></Button
>
