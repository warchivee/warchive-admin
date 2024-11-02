<script lang="ts">
  //components
  import * as Select from "$lib/components/ui/select";
  import { Badge } from "$lib/components/ui/badge";
  import DataEditDrawer from "./DataEditDrawer.svelte";
  import { badgeVariants } from "$lib/components/ui/badge";
  import DataDeleteDialog from "../../routes/data/dialogs/DataDeleteDialog.svelte";

  //utils
  import type { Wata } from "../../routes/data/type";
  import DataLabelEditDialog from "../../routes/data/dialogs/DataLabelEditDialog.svelte";
  import axiosInstance from "$lib/axios";
  import { toast } from "svelte-sonner";

  //variables
  const LABELS: Record<string, string> = {
    NEED_CHECK: "검수전",
    CHECKING: "검수중",
    CHECKED: "검수완료",
    HOLD: "보류",
    NEED_CONTACT: "컨택필요",
    CENSOR: "탈락",
  };

  const LABEL_COLORS: Record<string, string> = {
    NEED_CHECK: "#e8eaed",
    CHECKING: "#ffe5a0",
    CHECKED: "#e6cff2",
    HOLD: "#c6dbe1",
    NEED_CONTACT: "#bfe1f6",
    CENSOR: "#ffcfc9",
  };

  export let data: Wata;

  let open = false;
  let openSelect = false;
  let editLabel = data.label;

  async function handleLabel(label: string) {
    open = false; // open 이 계속 true 인 경우 상태 변화 트리거 안 되어서 한번 false 로 설정...

    if (label === "HOLD" || label === "CENSOR") {
      open = true;
      editLabel = label;

      openSelect = false;

      return;
    }

    await handleSubmit({ label, note: "" });

    openSelect = false;
  }

  async function handleSubmit(value: { label: string; note: string | null }) {
    try {
      await axiosInstance.patch(`/watas/${data.id}`, {
        ...data,
        label: value.label,
        note: value.note,
      });

      toast.success(
        `'${data.title}' 의 라벨을 ${LABELS[value.label]} 으로 수정했습니다.`
      );

      data.label = value.label; //데이터 재조회(혹은 새로고침) 안 하기 위해 값 직접 할당.
      open = false;
    } catch (error) {
      console.error(error);
      toast.error("sorry, this functions is failed");
    }
  }
</script>

<div class="p-4 bg-white shadow-md rounded-lg flex flex-col space-y-4">
  <div id="header" class="flex justify-between w-full">
    <div class="flex items-center gap-4">
      <Select.Root
        bind:open={openSelect}
        selected={data.label
          ? { label: LABELS[data.label], value: data.label }
          : undefined}
        onSelectedChange={(v) => {
          v && handleLabel(v.value);
        }}
      >
        <Select.Trigger
          class="w-[105px] h-[30px] border-none"
          style="background-color: {LABEL_COLORS[data.label] || 'transparent'}"
        >
          <Select.Value placeholder="라벨" />
        </Select.Trigger>
        <Select.Content>
          {#each Object.keys(LABELS) as label, i}
            <Select.Item
              value={label}
              on:click={(e) => {
                e.preventDefault();

                handleLabel(label);
              }}>{LABELS[label]}</Select.Item
            >
          {/each}
        </Select.Content>
      </Select.Root>

      <p class="text-gray-600 text-xs">
        <b>Last updated</b>
        <br />
        {data?.updater?.nickname} | {new Date(
          data?.updatedAt
        )?.toLocaleDateString()}<br />
      </p>
    </div>

    <div>
      <DataEditDrawer action="edit" value={data} />
      {#if !data.isPublished}
        <DataDeleteDialog value={data} />
      {/if}
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex items-center">
    {#if data.thumbnail}
      <img
        src={data.thumbnail}
        alt="Thumbnail"
        class="w-20 h-auto mr-3 object-cover rounded-lg"
      />
    {:else}
      <div class="w-20 h-auto mr-3 rounded-lg text-xs text-red-600">
        썸네일 미등록
      </div>
    {/if}
    <div class="flex flex-col">
      <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        {#if data.isPublished}
          <Badge class="text-xs h-[17px]">게시</Badge>
        {/if}

        <h3 class="text-md font-semibold text-gray-900 flex-1">{data.title}</h3>
      </div>

      <div class="flex mt-2 flex-col">
        <h4 class="text-xs font-semibold mb-1">장르</h4>
        <p class="text-sm">
          {#if data.genre}
            <p class="text-sm">
              {data.genre.category.name} | {data.genre.name}
            </p>
          {:else}
            <p class="text-xs text-red-600">장르 미등록</p>
          {/if}
        </p>
      </div>

      <div class="flex mt-2 flex-col">
        <h4 class="text-xs font-semibold flex-1 mb-1">작가/감독</h4>
        {#if data.creators}
          <p class="text-sm">{data.creators}</p>
        {:else}
          <p class="text-xs text-red-600">작가/감독 미등록</p>
        {/if}
      </div>
    </div>
  </div>

  <div class="space-y-2">
    <h4 class="text-xs font-semibold">키워드</h4>

    <div class="flex flex-wrap gap-1">
      {#if data.keywords && data.keywords?.length > 0}
        {#each data.keywords as keyword, idx}
          <Badge variant="outline" class="text-xs">{keyword.name}</Badge>
        {/each}
      {:else}
        <p class="text-xs text-red-600">키워드 미등록</p>
      {/if}

      {#if data.cautions}
        {#each data.cautions as caution, idx}
          <Badge variant="outline" class="text-xs bg-red-100 text-red-800"
            >{caution.name}</Badge
          >
        {/each}
      {/if}
    </div>

    <h4 class="text-xs font-semibold">플랫폼</h4>
    {#if data.platforms && data.platforms?.length > 0}
      <div class="flex flex-wrap gap-1">
        {#each data.platforms as platform, idx}
          <a
            href={platform.url}
            target="_blank"
            class={`${badgeVariants({ variant: "secondary" })} text-xs`}
            >{platform.name}</a
          >
        {/each}
      </div>
    {:else if data.noPlatform}
      <p class={"text-xs"}>서비스하는 곳 없음</p>
    {:else}
      <p class="text-xs text-red-600">플랫폼 미등록</p>
    {/if}
    {#if data?.note}
      <p class="text-gray-600 text-xs bg-gray-100 p-3 rounded-md">
        {data.note}<br />
      </p>
    {/if}
  </div>
</div>

<DataLabelEditDialog {data} {editLabel} {open} {handleSubmit} />
