<script lang="ts">
  //components
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";

  //utils
  import { toast } from "svelte-sonner";
  import { cn } from "$lib/utils";
  import axiosInstance from "$lib/axios";
  import type { Wata } from "./type";
  import { deleteWata } from "$lib/stores/watas.store";

  //variables
  export let value: Wata = {
    title: "",
  } as Wata;

  let open = false;

  //functions
  function handleClose() {
    open = false;
  }

  async function handleSubmit() {
    try {
      await axiosInstance.delete(`/watas/${value.id}`);

      toast.success(`'${value.title}' 를 삭제했습니다.`);

      deleteWata(value.id);

      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("sorry, this functions is failed");
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger
    class={cn("text-sm h-[30px]", buttonVariants({ variant: "ghost" }))}
  >
    삭제
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px] space-y-2">
    <Dialog.Header>
      <Dialog.Title>'{value.title}' 삭제</Dialog.Title>
      <Dialog.Description>
        '{value.title}' 을(를) 삭제하시겠습니까?
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="destructive" type="submit" on:click={handleSubmit}>
        삭제하기
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
