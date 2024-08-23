<script lang="ts">
  //components
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  //icons
  import Pencil from "lucide-svelte/icons/pencil";
  import { toast } from "svelte-sonner";

  //utils
  import { cn } from "$lib/utils";
  import axiosInstance from "$lib/axios";
  import { updateGenre } from "$lib/stores/categories.store";

  //variables
  export let category: { id: number; name: string };
  export let value: { id: number; name: string };

  let open = false;
  let name = value.name;

  //functions
  function handleClose() {
    open = false;
  }

  async function handleSubmit() {
    const trimName = name.trim();

    if (!trimName) {
      toast.error("수정할 장르명을 입력해주세요.");
      return;
    }

    if (trimName === value.name) {
      toast.error("기존과 같은 장르명으로는 수정할 수 없습니다.");
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/category/${category.id}/genres/${value.id}`,
        {
          name,
        }
      );

      toast.success(`'${value.name}' 장르를 '${trimName}' 으로 수정했습니다.`);

      updateGenre(category.id, response.data);

      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("sorry, this functions is failed");
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger
    class={cn(
      buttonVariants({ variant: "ghost" }),
      "h-[30px] hover:bg-transparent"
    )}
  >
    <Pencil class="h-4 w-4 text-slate-400" />
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>'{category.name} - {value.name}' 장르 수정</Dialog.Title>
    </Dialog.Header>
    <Input
      id="name"
      placeholder="수정할 장르명을 입력해주세요..."
      autocomplete="off"
      bind:value={name}
    />
    <Dialog.Footer>
      <Button type="submit" on:click={handleSubmit}>수정하기</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
