<script lang="ts">
  //components
  import * as Tabs from "$lib/components/ui/tabs";
  import IrregularUpdateTab from "./IrregularUpdateTab.svelte";
  import RegularUpdateTab from "./RegularUpdateTab.svelte";
</script>

<svelte:head>
  <title>데이터 업데이트</title>
</svelte:head>

<div class="text-lg my-4 font-bold">
  <h1>데이터 업데이트</h1>
</div>

<Tabs.Root value="irregular">
  <Tabs.List class="flex">
    <Tabs.Trigger class="flex-1" value="irregular">비정기 업데이트</Tabs.Trigger
    >
    <Tabs.Trigger class="flex-1" value="regular">정기 업데이트</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="irregular">
    <IrregularUpdateTab />
  </Tabs.Content>
  <Tabs.Content value="regular">
    <RegularUpdateTab />
  </Tabs.Content>
</Tabs.Root>
