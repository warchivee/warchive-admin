<script lang="ts">
  //components
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  //utils
  import type { Wata } from "@prisma/client";

  //variables
  const LABELS: Record<string, string> = {
    NEED_CHECK: "검수전",
    CHECKING: "검수중",
    CHECKED: "검수완료",
    HOLD: "보류",
    NEED_CONTACT: "컨택필요",
    CENSOR: "탈락",
  };

  export let open = false;
  export let data: Wata;
  export let editLabel: string;
  export let handleSubmit: (value: {
    label: string;
    note: string | null;
  }) => void;

  let note = data.note;
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-[425px] space-y-2">
    <Dialog.Header>
      <Dialog.Title>{LABELS[editLabel]}</Dialog.Title>
      <Dialog.Description
        >{LABELS[editLabel]} 사유를 작성해주세요.</Dialog.Description
      >
    </Dialog.Header>
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="note">비고</Label>
      <Textarea id="note" bind:value={note} />
    </div>
    <Dialog.Footer>
      <Button
        on:click={() => {
          handleSubmit({ label: editLabel, note: note });
        }}>확인</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
