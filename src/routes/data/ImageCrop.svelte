<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { cn } from "$lib/utils";
  //components

  //utils
  import Cropper from "svelte-easy-crop";
  import type { ThumbnailCropArea } from "./type";
  import getCroppedImg from "$lib/thumbnail/crop";

  //variables
  export let image: string | null;
  export let type = "card";
  export let cropArea: ThumbnailCropArea | null;
  export let handleConfirm: (value: any) => void;

  let aspect = type === "card" ? 300 / 124 : 105 / 150;

  let open = false;

  let cropInfo: ThumbnailCropArea;

  let cropImage: string | null = image;

  function previewCrop(e: any) {
    cropInfo = {
      x: e.detail.pixels.x,
      y: e.detail.pixels.y,
      w: e.detail.pixels.width,
      h: e.detail.pixels.height,
    };
  }

  async function crop() {
    if (!image) {
      return;
    }

    if (!cropArea) {
      return;
    }

    cropImage = await getCroppedImg(image, cropArea, 0);
  }

  $: image, (cropImage = image);
  $: cropArea, crop();
</script>

{#if image}
  <Dialog.Root bind:open>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>이미지 편집</Dialog.Title>
        <Dialog.Description>이미지가 어쩌고저쩌고</Dialog.Description>
      </Dialog.Header>

      <div
        style="position: relative; background: #fff; height: 400px; width: 100%;"
      >
        <Cropper
          {image}
          zoom={1}
          crop={{ x: 0, y: 0 }}
          {aspect}
          on:cropcomplete={previewCrop}
        />
      </div>
      <Dialog.Footer>
        <Button
          on:click={() => {
            handleConfirm(cropInfo);
            open = false;
          }}
        >
          확인
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>

  <div
    class="relative group rounded-md drop-shadow-md {type === 'card'
      ? 'w-[300px] h-[124px]'
      : 'w-[105px] h-[150px]'}"
  >
    <img
      loading="lazy"
      decoding="async"
      src={cropImage}
      alt={`fdfdfd`}
      class="object-cover content-visibility-auto transition-all duration-300 w-full h-full"
    />
    <div
      class="absolute rounded-md inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 w-full h-full"
    >
      <Button on:click={() => (open = true)}>수정하기</Button>
    </div>
  </div>
{/if}
