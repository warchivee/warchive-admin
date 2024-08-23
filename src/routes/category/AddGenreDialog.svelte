<script lang="ts">
  //components
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  //icons
  import Plus from "lucide-svelte/icons/plus";
  import { toast } from "svelte-sonner";

  //utils
  import { cn } from "$lib/utils";
  import axiosInstance from "$lib/axios";
  import { addGenre } from "$lib/stores/categories.store";

  //variables
  export let category: { id: number; name: string };

  let open = false;
  let name = "";

  //functions
  function handleClose() {
    open = false;
    name = "";
  }

  async function handleSubmit() {
    const trimName = name.trim();

    if (!trimName) {
      toast.error("장르명을 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/category/${category.id}/genres`,
        {
          name,
        }
      );

      addGenre(category.id, response.data);

      toast.success(`${category.name} 에 '${trimName}' 장르를 추가했습니다.`);

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
      "flex gap-1 items-center w-fit",
      buttonVariants({ variant: "ghost" })
    )}
  >
    <Plus class="h-5 w-5 text-slate-400" />
    <div class="underline underline-offset-2">
      '{category.name}'에 새 장르 추가
    </div>
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>'{category.name}' 에 새 장르 추가</Dialog.Title>
    </Dialog.Header>
    <Input
      id="name"
      placeholder="장르명을 입력해주세요..."
      autocomplete="off"
      bind:value={name}
    />
    <Dialog.Footer>
      <Button type="submit" on:click={handleSubmit}>추가하기</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
