<script lang="ts">
  //components
  import * as Table from "$lib/components/ui/table/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";

  //variables
  export const results: Record<string, string[]> = {
    new_watas: [],
    update_watas: [],
    delete_watas: [],
  };

  const statusMap = {
    new_watas: "게시",
    update_watas: "수정",
    delete_watas: "게시내림",
  };

  const tableDatas = Object.entries(results).flatMap(([key, items]) =>
    items.map((item) => ({
      title: item,
      status: statusMap[key as keyof typeof statusMap],
    }))
  );
</script>

<Table.Root>
  <Table.Caption>업데이트 결과</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">상태</Table.Head>
      <Table.Head>작품명</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each tableDatas as data, i (i)}
      <Table.Row>
        <Table.Cell><Badge variant="secondary">{data.status}</Badge></Table.Cell
        >
        <Table.Cell class="font-medium">{data.title}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
