<script lang="ts">
  //components
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";

  //icons
  import Trash from "lucide-svelte/icons/trash-2";
  import { toast } from "svelte-sonner";
  import axiosInstance from "$lib/axios";
  import { deleteKeyword } from "$lib/stores/keywords.store";
  import { deleteCaution } from "$lib/stores/cautions.store";

  //variables
  export let value: { id: number; name: string };
  export let type: string = "keywords";

  const dialogLabel = type === "cautions" ? "주의 키워드" : "키워드";

  let open = false;

  //functions
  function handleClose() {
    open = false;
  }

  async function handleSubmit() {
    try {
      await axiosInstance.delete(`/${type}/${value.id}`);

      toast.success(`'${value.name}' ${dialogLabel}를 삭제했습니다.`);

      if (type === "keywords") {
        deleteKeyword(value.id);
      } else {
        deleteCaution(value.id);
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
    <Trash class="h-4 w-4 text-slate-400" />
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>'{value.name}' {dialogLabel} 삭제</Dialog.Title>
      <Dialog.Description>
        '{value.name}' {dialogLabel}를 삭제하시겠습니까? 삭제한 {dialogLabel}는
        복구할 수 없습니다.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="destructive" type="submit" on:click={handleSubmit}>
        삭제하기
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
