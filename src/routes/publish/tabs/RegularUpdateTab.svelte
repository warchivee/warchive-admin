<script lang="ts">
  //components
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Alert from "$lib/components/ui/alert";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button/index.js";
  import Result from "../components/Result.svelte";

  //icons
  import Terminal from "lucide-svelte/icons/terminal";

  //variables
  let results = {
    add_items: [],
    update_items: [],
    remove_items: [],
  };
</script>

<Alert.Root class="mb-4">
  <Terminal class="h-4 w-4" />
  <Alert.Title>정기 업데이트란?</Alert.Title>
  <Alert.Description
    >2달에 한 번 진행하는 정기 업데이트입니다. 검수 완료된 데이터들이 전부
    업데이트됩니다.</Alert.Description
  >
</Alert.Root>

<Card.Root class="flex-1">
  <Card.Header>
    <Card.Title>업데이트 하기</Card.Title>
    <Card.Description>마지막 업데이트 일자 :</Card.Description>
  </Card.Header>
  <Card.Content>
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button class="w-full text-center">업데이트</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>업데이트하시겠습니까?</AlertDialog.Title>
          <AlertDialog.Description>
            정기 업데이트가 진행됩니다.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>취소</AlertDialog.Cancel>
          <AlertDialog.Action>확인</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </Card.Content>
</Card.Root>

<Card.Root class="flex-1 mt-4">
  <Card.Header>
    <Card.Title>결과</Card.Title>
    <Card.Description
      >결과를 드래그 후 복사해서 구글 스프레드 시트에 붙여넣기할 수 있습니다.</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <Result {results} />
  </Card.Content>
</Card.Root>
