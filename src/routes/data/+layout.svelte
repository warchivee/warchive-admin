<script lang="ts">
  //utils
  import type {
    Keyword,
    Caution,
    Category,
    Platform,
    Genre,
  } from "@prisma/client";
  import { categories } from "$lib/stores/categories.store";
  import { keywords } from "$lib/stores/keywords.store";
  import { cautions } from "$lib/stores/cautions.store";
  import type { LayoutData } from "./$types";

  //variables
  export let data: LayoutData;

  categories.set(
    data.categories as (Category & {
      genres: Genre[];
      platforms: Platform[];
    })[]
  );
  keywords.set(data.keywords as Keyword[]);
  cautions.set(data.cautions as Caution[]);
</script>

<slot></slot>
