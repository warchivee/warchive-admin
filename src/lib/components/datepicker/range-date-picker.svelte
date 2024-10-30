<script lang="ts">
  import {
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    differenceInYears,
  } from "date-fns";

  import CalendarIcon from "lucide-svelte/icons/calendar";
  import type { DateRange } from "bits-ui";
  import {
    today,
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  const df = new DateFormatter("ko-KR", {
    dateStyle: "short",
  });

  export let value: DateRange | undefined = {
    start: undefined,
    end: undefined,
  };

  let startValue: DateValue | undefined = undefined;

  function formatDateRange(
    startDate: Date | number | string | undefined,
    endDate: Date | number | string | undefined
  ) {
    if (!endDate || !startDate) {
      return "1일";
    }

    const days = differenceInDays(endDate, startDate);
    const weeks = differenceInWeeks(endDate, startDate);
    const months = differenceInMonths(endDate, startDate);
    const years = differenceInYears(endDate, startDate);

    if (years > 0) {
      return `약 ${years} 년`;
    } else if (months > 0) {
      return `약 ${months} 개월`;
    } else if (weeks > 0) {
      return `약 ${weeks} 주`;
    } else {
      return `약 ${days + 1} 일`;
    }
  }

  $: if (!value) {
    value = { start: undefined, end: undefined };
    startValue = undefined;
  }
</script>

<div class="grid gap-2">
  <Popover.Root openFocus>
    <Popover.Trigger asChild let:builder>
      <Button
        variant="outline"
        class={cn(
          "w-[300px] justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
        builders={[builder]}
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {#if value && value?.start}
          {#if value?.end}
            {df.format(value?.start.toDate(getLocalTimeZone()))} - {df.format(
              value?.end.toDate(getLocalTimeZone())
            )}

            ({formatDateRange(
              value?.start.toDate(getLocalTimeZone()),
              value.end.toDate(getLocalTimeZone())
            )})
          {:else}
            {df.format(value?.start.toDate(getLocalTimeZone()))}

            ({formatDateRange(
              value?.start.toDate(getLocalTimeZone()),
              undefined
            )})
          {/if}
        {:else if startValue}
          {df.format(startValue.toDate(getLocalTimeZone()))}

          ({formatDateRange(startValue.toDate(getLocalTimeZone()), undefined)})
        {:else}
          Pick a date
        {/if}
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <RangeCalendar
        bind:value
        bind:startValue
        initialFocus
        numberOfMonths={2}
        placeholder={value?.start}
      />
    </Popover.Content>
  </Popover.Root>
</div>
