<script lang="ts">
  //components
  import * as Popover from "$lib/components/ui/popover";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";

  //icons
  import Plus from "lucide-svelte/icons/plus";
  import Info from "lucide-svelte/icons/info";

  //utils
  import { toast } from "svelte-sonner";
  import { cn } from "$lib/utils";
  import axiosInstance from "$lib/axios";
  import { addPlatform } from "$lib/stores/categories.store";

  //variables
  export let category: { id: number; name: string };

  let open = false;
  let orderTop = false;
  let name = "";
  let domain = "";

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
      toast.error("추가할 플랫폼명을 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/category/${category.id}/platforms`,
        {
          name,
          domain,
          orderTop,
        }
      );

      addPlatform(category.id, response.data);

      toast.success(
        `'${category.name}' 에 '${trimName}' 플랫폼을 추가했습니다.`
      );

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
    <Plus class="h-5 w-5 text-slate-400" />
    <div class="underline underline-offset-2">
      '{category.name}' 에 새 플랫폼 추가
    </div>
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px] space-y-2">
    <Dialog.Header>
      <Dialog.Title>'{category.name}' 에 새 플랫폼 추가</Dialog.Title>
    </Dialog.Header>
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="name">플랫폼명</Label>
      <Input
        id="name"
        placeholder="추가할 플랫폼명을 입력해주세요..."
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
      <Button type="submit" on:click={handleSubmit}>추가하기</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
