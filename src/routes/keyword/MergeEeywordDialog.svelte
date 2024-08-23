<script lang="ts">
  //components
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import KeywordSelect from "../data/KeywordSelect.svelte";

  //icons
  import { toast } from "svelte-sonner";

  //utils
  import { cn } from "$lib/utils";
  import axiosInstance from "$lib/axios";
  import { addKeyword, deleteKeyword } from "$lib/stores/keywords.store";
  import { addCaution, deleteCaution } from "$lib/stores/cautions.store";

  //variables
  export let type: string = "keywords";
  export let allKeywords;

  const dialogLabel = type === "cautions" ? "주의 키워드" : "키워드";

  let open = false;
  let name: string = "";
  let values: { id: number; name: string }[] = [];

  //functions
  function handleClose() {
    open = false;
    values = [];
    name = "";
  }

  async function handleSubmit() {
    const trimName = name.trim();

    if (values.length < 2) {
      toast.error(`합칠 ${dialogLabel}를 2개 이상 선택해주세요.`);
      return;
    }

    if (!trimName) {
      toast.error(`새 ${dialogLabel} 명을 입력해주세요.`);
      return;
    }

    const ids = values?.map((v) => v.id);

    const response = await axiosInstance.post(`/${type}/merge`, {
      name,
      targetIds: ids,
    });

    if (type === "keywords") {
      ids.forEach((i) => deleteKeyword(i));
      addKeyword(response.data);
    } else {
      ids.forEach((i) => deleteCaution(i));
      addCaution(response.data);
    }

    toast.success(
      `${values?.map?.((v) => v.name)?.join(", ")} ${dialogLabel}들을 '${trimName}' 으로 합쳤습니다.`
    );

    handleClose();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger
    class={cn(
      "flex gap-1 items-center w-fit",
      buttonVariants({ variant: "secondary" })
    )}
  >
    {dialogLabel} 합치기
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px] space-y-2">
    <Dialog.Header>
      <Dialog.Title>{dialogLabel} 합치기</Dialog.Title>
    </Dialog.Header>
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="name">합칠 {dialogLabel}</Label>
      <KeywordSelect
        {allKeywords}
        {values}
        onChange={(newValues) => {
          values = newValues;
        }}
      />
    </div>

    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="name">새 {dialogLabel}명</Label>
      <Input
        id="name"
        placeholder="{dialogLabel}명을 입력해주세요..."
        autocomplete="off"
        bind:value={name}
      />
    </div>
    <Dialog.Footer>
      <Button type="submit" on:click={handleSubmit}>키워드 합치기</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
