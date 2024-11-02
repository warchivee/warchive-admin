<script lang="ts">
  //components
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  //icons
  import Pencil from "lucide-svelte/icons/pencil";

  //utils
  import { toast } from "svelte-sonner";
  import axiosInstance from "$lib/axios";
  import { updateKeyword } from "$lib/stores/keywords.store";
  import { updateCaution } from "$lib/stores/cautions.store";

  //variables
  export let value: { id: number; name: string; description: string | null };
  export let type: string = "keywords";

  const dialogLabel = type === "cautions" ? "주의 키워드" : "키워드";

  let open = false;
  let name = value.name;
  let description = value.description;

  //functions
  function handleClose() {
    open = false;
  }

  async function handleSubmit() {
    const trimName = name.trim();

    if (!trimName) {
      toast.error(`수정할 ${dialogLabel}명을 입력해주세요.`);
      return;
    }

    try {
      const response = await axiosInstance.patch(`/${type}/${value.id}`, {
        name,
        description,
      });

      toast.success(
        `'${value.name}' ${dialogLabel}를 '${trimName}' 으로 수정했습니다.`
      );

      if (type === "keywords") {
        updateKeyword(response.data);
      } else {
        updateCaution(response.data);
      }

      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("sorry, this functions is failed");
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={buttonVariants({ variant: "ghost" })}>
    <Pencil class="h-4 w-4 text-slate-400" />
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px] space-y-2">
    <Dialog.Header>
      <Dialog.Title>'{value.name}' {dialogLabel} 수정</Dialog.Title>
    </Dialog.Header>
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="name">{dialogLabel}명</Label>
      <Input
        id="name"
        placeholder="수정할 {dialogLabel}명을 입력해주세요..."
        autocomplete="off"
        bind:value={name}
      />
    </div>

    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="description">설명</Label>
      <Textarea
        id="description"
        placeholder="설명을 적어주세요."
        bind:value={description}
      />
    </div>
    <Dialog.Footer>
      <Button type="submit" on:click={handleSubmit}>수정하기</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
