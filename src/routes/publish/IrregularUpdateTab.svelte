<script lang="ts">
  //components
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Alert from "$lib/components/ui/alert";
  import { Input } from "$lib/components/ui/input";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Result from "./Result.svelte";

  //icons
  import Terminal from "lucide-svelte/icons/terminal";

  //utils
  import { toast } from "svelte-sonner";

  //variables
  let input: string = "";
  let titles: string[] = [];
  let results = {
    add_items: [],
    update_items: [],
    remove_items: [],
  };
</script>

<Alert.Root class="mb-4">
  <Terminal class="h-4 w-4" />
  <Alert.Title>비정기 업데이트란?</Alert.Title>
  <Alert.Description
    >플레이, 아티클 오픈 시 필요한 데이터를 게시하거나, 작가/작품 이슈로 게시된
    데이터의 정보를 업데이트하거나 내려야할 때 사용합니다.</Alert.Description
  >
</Alert.Root>

<div class="flex flex-col xl:flex-row gap-4 w-full">
  <Card.Root class="flex-1">
    <Card.Header>
      <Card.Title>업데이트할 작품</Card.Title>
      <Card.Description
        >업데이트가 필요한 작품명을 오탈자 없이 정확하게 입력해주세요.</Card.Description
      >
    </Card.Header>
    <Card.Content>
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          T
        </div>
        <Input
          class="mt-2 px-8"
          type="text"
          id="title"
          placeholder="작품명을 입력 후 엔터를 누르세요."
          bind:value={input}
          on:keydown={(event) => {
            if (event.key === "Enter") {
              if (input.trim().length <= 0) {
                toast.error("공백은 입력할 수 없습니다.");
                return;
              }

              if (titles.includes(input)) {
                toast.error("이미 업데이트 목록에 추가된 작품입니다.");
                return;
              }

              titles = [input.trim(), ...titles];
              input = "";
            }
          }}
        />
        <div
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-lg"
        >
          ↵
        </div>
      </div>

      <div class="p-4">
        {#if titles.length <= 0}
          <p class="text-slate-500">업데이트할 작품이 없습니다.</p>
        {/if}
        {#each titles as title}
          <div class="flex justify-between items-center">
            <h2 class="text-sm">{title}</h2>
            <Button
              class="text-xs h-[30px]"
              variant="secondary"
              on:click={() => {
                titles = titles.filter((t) => t != title);
              }}>삭제</Button
            >
          </div>
          <Separator class="my-2" />
        {/each}
      </div>
    </Card.Content>
    <Card.Footer class="flex justify-end">
      <!-- alertDialog.trigger button 에 disabled 해도 클릭 되는 현상 때문에 분기처리 -->
      {#if titles.length <= 0}
        <Button disabled>업데이트</Button>
      {:else}
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Button>업데이트</Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>업데이트하시겠습니까?</AlertDialog.Title>
              <AlertDialog.Description>
                모든 작품명이 정확하게 입력되었는지 확인해 주시기 바랍니다.
                작품명이 부정확할 경우, 업데이트가 제대로 진행되지 않습니다.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>취소</AlertDialog.Cancel>
              <AlertDialog.Action>확인</AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      {/if}
    </Card.Footer>
  </Card.Root>

  <Card.Root class="flex-1">
    <Card.Header>
      <Card.Title>결과</Card.Title>
      <Card.Description
        >결과를 드래그 후 복사해서 구글 스프레드 시트에 붙여넣기할 수 있습니다.</Card.Description
      >
    </Card.Header>
    <Card.Content>
      <Result {results} />
    </Card.Content>
  </Card.Root>
</div>
