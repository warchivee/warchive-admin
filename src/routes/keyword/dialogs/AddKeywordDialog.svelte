<script lang="ts">
  //components
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  //icons
  import Plus from "lucide-svelte/icons/plus";

  //utils
  import { cn } from "$lib/utils";
  import axiosInstance from "$lib/axios";
  import { addKeyword } from "$lib/stores/keywords.store";
  import { addCaution } from "$lib/stores/cautions.store";
  import { toast } from "svelte-sonner";

  //variables
  export let type: string = "keywords";

  const dialogLabel = type === "cautions" ? "주의 키워드" : "키워드";

  let open = false;
  let name = "";
  let description = "";

  //functions
  function handleClose() {
    open = false;
    name = "";
    description = "";
  }

  async function handleSubmit() {
    const trimName = name.trim();

    if (!trimName) {
      toast.error("키워드명을 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post(`/${type}`, {
        name,
        description,
      });

      if (type === "keywords") {
        addKeyword(response.data);
      } else {
        addCaution(response.data);
      }

      toast.success(`'${trimName}' ${dialogLabel}를 추가했습니다.`);

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
    <div class="underline underline-offset-2">새 {dialogLabel} 추가</div>
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px] space-y-2">
    <Dialog.Header>
      <Dialog.Title>새 {dialogLabel} 추가</Dialog.Title>
    </Dialog.Header>
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="name">{dialogLabel}명</Label>
      <Input
        id="name"
        placeholder="{dialogLabel}명을 입력해주세요..."
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
      <Button type="submit" on:click={handleSubmit}>추가하기</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
