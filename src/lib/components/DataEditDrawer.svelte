<script lang="ts">
  //components
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Drawer from "$lib/components/ui/drawer";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import KeywordSelect from "./KeywordSelect.svelte";
  import PlatformInput from "../../routes/data/components/PlatformInput.svelte";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";

  //utils
  import cloneDeep from "lodash/cloneDeep";
  import axios, { AxiosError } from "axios";
  import { toast } from "svelte-sonner";
  import { categories } from "$lib/stores/categories.store";
  import { keywords } from "$lib/stores/keywords.store";
  import { cautions } from "$lib/stores/cautions.store";
  import { cn } from "$lib/utils";
  import axiosInstance from "$lib/axios";
  import { addWata, updateWata } from "$lib/stores/watas.store";
  import ImageCrop from "../../routes/data/components/ImageCrop.svelte";
  import resizeImage from "$lib/thumbnail/resize";
  import type { Wata } from "../../routes/data/type";

  //vatiables
  export let action: string = "add";
  export let value: Wata = {
    title: "",
  } as Wata;

  /**
   *   formData = value 하면 참조를 해서 formData 바뀔 때마다 value도 같이 바뀜.
   * {...value} 로 할당해줘도, 안의 배열은 계속 참조하기 때문에 깊은 복사를 이용.
   */
  let formData: Wata;
  let open = false;

  const handleClose = () => {
    open = false;
  };

  //functions
  const handleReset = () => {
    formData = cloneDeep(value);
  };

  const uploadImage = async (image: string, name: string) => {
    const formData = new FormData();

    formData.append("image", image);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_PUBLIC_IMGBB_API_KEY}&name=${name}`,
      formData,
      {
        headers: {
          "Content-Type": "form-data",
        },
      }
    );

    //delete_url, url
    return response?.data?.data?.url as string;
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as data URL"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const dataUrl = await readFileAsDataURL(file);
    const resizedImage = await resizeImage(dataUrl, { width: 500 });

    formData.thumbnailBook = null;
    formData.thumbnailCard = null;
    formData.thumbnail = resizedImage;
  };

  const handleSubmit = async () => {
    formData.title = formData.title.trim();

    if (formData.creators) {
      formData.creators = formData.creators.trim();
    }

    if (!formData.title) {
      toast.error("제목은 필수입니다.");
      return;
    }

    if (formData.keywords?.length > 5) {
      toast.error("키워드는 5개까지만 선택할 수 있습니다.");
      return;
    }

    try {
      if (
        formData.thumbnail &&
        value.thumbnail !== formData.thumbnail &&
        !formData.thumbnail?.includes("http")
      ) {
        const uploaded = await uploadImage(
          formData.thumbnail?.replace("data:image/jpeg;base64,", ""),
          `${formData?.title}`
        );

        formData.thumbnail = uploaded;
      }

      const requestBody = {
        ...formData,
        genreId: formData.genre?.id,
      };

      if (action === "add") {
        const response = await axiosInstance.post(`/watas`, requestBody);

        addWata(response.data as Wata);

        toast.success(`${formData.title} 를 추가했습니다.`);
      } else {
        const response = await axiosInstance.patch(
          `/watas/${value.id}`,
          requestBody
        );

        updateWata(response.data as Wata);

        toast.success(`${formData.title} 를 수정했습니다.`);
      }

      handleClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "data update failed");
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  $: value, handleReset();

  // undefined 를 사용하면 초기화했을 때 화면 상에서 초기화 안 되는 현상으로  { label: "", value: -1 } 를 사용.
  $: selectedGenre = formData?.genre
    ? {
        label: formData.genre.name,
        value: formData.genre.id,
      }
    : { label: "", value: -1 };
</script>

<Drawer.Root shouldScaleBackground={false} direction="right" bind:open>
  <Drawer.Trigger let:builder>
    <Button builders={[builder]} class="text-sm h-[30px]"
      >{action === "add" ? "데이터 추가" : "수정"}</Button
    >
  </Drawer.Trigger>
  <Drawer.Content class="inset-y-0 right-0 h-full w-screen max-w-96">
    <Drawer.Header class="flex flex-row justify-between">
      <Drawer.Title>데이터 {action === "add" ? "추가" : "수정"}</Drawer.Title>
      <Drawer.Close
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width={1.5}
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </Drawer.Close>
    </Drawer.Header>
    <ScrollArea class="h-full w-full">
      <form method="POST" class="p-4 space-y-6">
        <div>
          <Label>제목</Label>
          <Input
            id="title"
            name="title"
            autocomplete="off"
            bind:value={formData.title}
          />
        </div>

        <div>
          <Label>작가/감독</Label>
          <Input
            id="creators"
            name="creators"
            autocomplete="off"
            bind:value={formData.creators}
          />
        </div>

        <div>
          <Label>카테고리/장르</Label>
          <Select.Root selected={selectedGenre}>
            <Select.Trigger class="w-full">
              <Select.Value placeholder="카테고리/장르를 선택하세요." />
            </Select.Trigger>
            <Select.Content>
              <ScrollArea class="h-[200px] w-full">
                {#each $categories as category}
                  <Select.Group>
                    <Select.Label class="pl-2">{category.name}</Select.Label>
                    <div>
                      {#each category.genres as genre}
                        <Select.Item
                          value={genre.id}
                          label={genre.name}
                          on:click={() => {
                            formData.genre = {
                              ...genre,
                              category: category,
                            };
                          }}>{genre.name}</Select.Item
                        >
                      {/each}
                    </div>
                  </Select.Group>
                {/each}
              </ScrollArea>
            </Select.Content>
            <Select.Input
              id="category"
              name="category"
              bind:value={formData.genre}
            />
          </Select.Root>
        </div>

        <div>
          <Label>키워드</Label>
          <KeywordSelect
            allKeywords={$keywords}
            values={formData.keywords ?? []}
            limitCount={5}
            limitMessage={"키워드는 5개까지 선택할 수 있습니다."}
            onChange={(newValues) => {
              formData.keywords = newValues;
            }}
          />
          <input
            hidden
            value={formData.keywords ? 0 : 0}
            id="keywords"
            name="keywords"
          />
        </div>

        <div>
          <Label>주의 키워드</Label>

          <KeywordSelect
            allKeywords={$cautions}
            values={formData.cautions ?? []}
            onChange={(newValues) => {
              formData.cautions = newValues;
            }}
          />
          <input
            hidden
            value={formData.cautions ? 0 : 0}
            id="cautions"
            name="cautions"
          />
        </div>

        <div class="flex flex-col gap-4">
          <Label>썸네일 파일 업로드</Label>
          <Input id="picture" type="file" on:change={handleFileChange} />

          <Label>썸네일 편집</Label>
          <div
            class="flex flex-col gap-6 border border-slate-200 p-4 rounded-md"
          >
            <div class="flex justify-center">
              <ImageCrop
                image={formData.thumbnail}
                type="card"
                cropArea={formData.thumbnailCard}
                handleConfirm={(value) => {
                  formData.thumbnailCard = value;
                }}
              />
            </div>

            <hr />

            <div class="flex justify-center">
              <ImageCrop
                image={formData.thumbnail}
                type="book"
                cropArea={formData.thumbnailBook}
                handleConfirm={(value) => {
                  formData.thumbnailBook = value;
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <div class="flex justify-between mb-2">
            <Label>플랫폼</Label>
            <div class="flex items-center space-x-2">
              <p
                class={cn(
                  "text-sm",
                  formData.noPlatform ? "text-black" : "text-slate-400"
                )}
              >
                서비스하는 곳 없음
              </p>
              <Switch
                id="noPlatform"
                name="noPlatform"
                bind:checked={formData.noPlatform}
                disabled={formData.platforms && formData.platforms.length > 0}
              />
            </div>
          </div>

          <PlatformInput
            values={formData.platforms}
            allPlatforms={$categories?.find(
              (c) => c.id === formData.genre?.category.id
            )?.platforms ?? []}
            onChange={(values) => {
              if (formData.platforms && formData.platforms.length > 0) {
                formData.noPlatform = false;
              }

              formData.platforms = values;
            }}
          />
        </div>

        <div>
          <Label>비고</Label>
          <Textarea
            placeholder=""
            class="resize-none"
            id="note"
            name="note"
            autocomplete="off"
            bind:value={formData.note}
          />
        </div>
      </form>
    </ScrollArea>
    <Drawer.Footer class="flex flex-row-reverse">
      <Button class="w-[120px]" on:click={handleSubmit}>확인</Button>
      <Button class="w-[120px]" variant="ghost" on:click={handleReset}
        >전체 초기화</Button
      >
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
