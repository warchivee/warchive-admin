<script lang="ts">
  //components
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
</script>

<div class="p-4 bg-white shadow-md rounded-lg flex flex-col space-y-4">
  <div id="header" class="flex justify-between w-full">
    <div class="flex items-center gap-4 flex-1">
      <Skeleton class="w-40 h-8" />
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex items-center">
    <Skeleton class="w-24 h-32 mr-3 rounded-lg" />

    <div class="flex flex-col">
      <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <Skeleton class="h-8 w-52" />
      </div>

      <div class="flex mt-2 flex-col">
        <Skeleton class="h-8 w-20" />
      </div>

      <div class="flex mt-2 flex-col">
        <Skeleton class="h-8 w-28" />
      </div>
    </div>
  </div>

  <div class="space-y-2">
    <div class="flex flex-wrap gap-1">
      <Skeleton class="h-8 w-52" />
    </div>

    <div class="flex flex-wrap gap-1">
      <Skeleton class="h-8 w-64" />
    </div>
  </div>
</div>
