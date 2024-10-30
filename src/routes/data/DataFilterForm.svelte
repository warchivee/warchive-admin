<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Drawer from "$lib/components/ui/drawer";

  //utils
  import FilterIcon from "lucide-svelte/icons/filter";

  import { Label } from "$lib/components/ui/label";
  import RangeDatePicker from "$lib/components/datepicker/range-date-picker.svelte";

  export let handleSubmit = (searchConditions: Record<string, any>) => {};
  let open = false;

  const filterValues: Record<string, { name: string; values: any[] }> = {
    categories: {
      name: "카테고리",
      values: [
        {
          id: "1",
          name: "게임",
        },
        {
          id: "2",
          name: "공연/전시",
        },
        {
          id: "3",
          name: "만화",
        },
        {
          id: "4",
          name: "서적",
        },
        {
          id: "5",
          name: "영상",
        },
      ],
    },
    label: {
      name: "라벨",
      values: [
        {
          name: "검수전",
          id: "NEED_CHECK",
        },
        {
          name: "검수중",
          id: "CHECKING",
        },
        {
          name: "검수완료",
          id: "CHECKED",
        },
        {
          name: "보류",
          id: "HOLD",
        },
        {
          name: "컨택필요",
          id: "NEED_CONTACT",
        },
        {
          name: "탈락",
          id: "CENSOR",
        },
      ],
    },
    needWriteItems: {
      name: "미입력항목",
      values: [
        {
          id: "creator",
          name: "작가/감독",
        },
        {
          id: "genre",
          name: "장르",
        },
        {
          id: "keywords",
          name: "키워드",
        },
        {
          id: "platforms",
          name: "플랫폼",
        },
        {
          id: "thumbnail",
          name: "썸네일",
        },
      ],
    },
  };

  const formData: Record<string, any> = {
    title: "",
    label: [],
    categories: [],
    updateDate: null,
    isPublished: null,
    needWriteItems: [],
  };

  function addItem(itemKey: string, key: string | number) {
    formData[itemKey] = [...formData[itemKey], key];
  }

  function removeItem(itemKey: string, key: string | number) {
    formData[itemKey] = formData[itemKey].filter(
      (k: string | number) => k !== key
    );
  }

  function resetItems(itemKey: string) {
    formData[itemKey] = [];
  }

  function resetAllItems() {
    formData.title = "";
    formData.label = [];
    formData.categories = [];
    formData.updateDate = null;
    formData.isPublished = null;
    formData.needWriteItems = [];
  }
</script>

<Drawer.Root shouldScaleBackground={false} bind:open>
  <Drawer.Trigger let:builder>
    <div class="fixed end-6 bottom-6">
      <Button builders={[builder]} class="w-14 h-14 rounded-full shadow-lg">
        <FilterIcon />
      </Button>
    </div></Drawer.Trigger
  >
  <Drawer.Content>
    <Drawer.Header class="flex flex-row justify-between">
      <Drawer.Title>데이터 검색</Drawer.Title>
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

    <div class="p-8">
      <div class="space-y-3">
        {#each Object.keys(filterValues) as filterKey}
          <div class="space-y-2">
            <div class="flex gap-2">
              <h6 class="font-bold text-sm">{filterValues[filterKey].name}</h6>
              <Button
                variant="ghost"
                class="text-gray-400 h-[20px] w-[40px] text-xs"
                on:click={() => {
                  resetItems(filterKey);
                }}>초기화</Button
              >
            </div>
            <ul
              class="grid grid-cols-3 items-center w-full bg-white rounded-md overflow-hidden"
            >
              {#each filterValues[filterKey].values as value}
                {@const checked = formData[filterKey].includes(value.id)}
                <li
                  class="w-full {checked
                    ? 'bg-gray-200'
                    : ''} hover:bg-gray-300"
                >
                  <Label
                    class="text-[13px] cursor-pointer flex w-full p-2 truncate"
                    for={`${filterKey}-${value.id}`}>{value.name}</Label
                  >
                  <input
                    hidden
                    type="checkbox"
                    id={`${filterKey}-${value.id}`}
                    name={filterKey}
                    value={value.id}
                    on:change={(e) => {
                      if (!(e.target instanceof HTMLInputElement)) {
                        return;
                      }

                      if (e.target.checked) {
                        addItem(filterKey, value.id);
                      } else {
                        removeItem(filterKey, value.id);
                      }
                    }}
                    {checked}
                  />
                </li>
              {/each}
            </ul>
          </div>

          <hr />
        {/each}

        <div class="space-y-2">
          <div class="flex gap-2">
            <h6 class="font-bold text-sm">마지막 수정일</h6>
            <Button
              variant="ghost"
              class="text-gray-400 h-[20px] w-[40px] text-xs"
              on:click={() => {
                formData.updateDate = null;
              }}>초기화</Button
            >
          </div>
          <RangeDatePicker bind:value={formData.updateDate} />
        </div>
      </div>
    </div>

    <Drawer.Footer class="flex flex-row-reverse">
      <Button
        class="w-[120px]"
        on:click={() => {
          handleSubmit(formData);
          open = false;
        }}>검색</Button
      >
      <Button
        class="w-[120px]"
        variant="ghost"
        on:click={() => {
          resetAllItems();
          handleSubmit(formData);
          open = false;
        }}>전체 초기화</Button
      >
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
