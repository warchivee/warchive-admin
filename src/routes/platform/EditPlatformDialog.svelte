<script lang="ts">
  //components
  import * as Popover from "$lib/components/ui/popover";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";

  //icons
  import Pencil from "lucide-svelte/icons/pencil";
  import Info from "lucide-svelte/icons/info";

  //utils
  import { toast } from "svelte-sonner";
  import { cn } from "$lib/utils";
  import axiosInstance from "$lib/axios";
  import { updatePlatform } from "$lib/stores/categories.store";

  //variables
  export let category: { id: number; name: string };
  export let value: {
    id: number;
    name: string;
    domain: string | null;
    orderTop: boolean;
  };

  let open = false;
  let orderTop = value.orderTop;
  let name = value.name;
  let domain = value.domain;

  //functions
  function handleClose() {
    open = false;
    name = "";
    domain = "";
    orderTop = false;
  }

  async function handleSubmit() {
    const trimName = name.trim();

    if (!trimName) {
      toast.error("수정할 플랫폼명을 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/category/${category.id}/platforms/${value.id}`,
        {
          orderTop,
          name,
          domain,
        }
      );

      updatePlatform(category.id, response.data);

      toast.success(`'${trimName}' 플랫폼을 수정했습니다.`);

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
      "flex gap-1 items-center w-fit"
    )}
  >
    <Pencil class="h-4 w-4 text-slate-400" />
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px] space-y-2">
    <Dialog.Header>
      <Dialog.Title>{category.name}의 '{value.name}' 플랫폼 수정</Dialog.Title>
    </Dialog.Header>
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="name">플랫폼명</Label>
      <Input
        id="name"
        placeholder="수정할 플랫폼명을 입력해주세요..."
        autocomplete="off"
        bind:value={name}
      />
    </div>

    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="name" class="flex items-center gap-2">
        도메인명
        <Popover.Root>
          <Popover.Trigger>
            <Info class="h-5 w-5 text-slate-400" />
          </Popover.Trigger>
          <Popover.Content>
            <h4 class="font-medium leading-none">예시</h4>
            <p class="text-muted-foreground text-sm">
              www.naver.com 에서 naver 를 입력.
              <br />
              <br />
              한 플랫폼에서 여러 서비스를 운영중인 경우 구분 가능하도록 입력
              <br />
              ˙구글무비(play.google.com/store/movies)
              <br />
              ˙구글북스(play.google.com/store/books)
            </p>
          </Popover.Content>
        </Popover.Root>
      </Label>
      <Input
        id="name"
        placeholder="플랫폼의 도메인을 입력해주세요..."
        autocomplete="off"
        bind:value={domain}
      />
    </div>

    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="order-top">상단노출 여부</Label>
      <div class="flex items-center space-x-2">
        <Switch id="order-top" bind:checked={orderTop} />
        <p class={cn("text-sm", orderTop ? "text-black" : "text-slate-300")}>
          {orderTop ? "ON" : "OFF"}
        </p>
      </div>
    </div>

    <Dialog.Footer>
      <Button type="submit" on:click={handleSubmit}>수정하기</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
