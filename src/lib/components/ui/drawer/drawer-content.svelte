<script lang="ts">
  import { Drawer as DrawerPrimitive } from "vaul-svelte";
  import DrawerOverlay from "./drawer-overlay.svelte";
  import { cn } from "$lib/utils.js";

  type $$Props = DrawerPrimitive.ContentProps;

  let className: $$Props["class"] = undefined;

  export { className as class };
  export { direction as direction };
</script>

<DrawerPrimitive.Portal>
  <DrawerOverlay />
  <DrawerPrimitive.Content
    class={cn(
      `bg-background fixed h-auto  z-50 flex flex-col rounded-t-[10px] border`,
      className ? className : "mt-24 inset-x-0 bottom-0"
    )}
    {...$$restProps}
  >
    <div class="bg-muted mx-auto mt-4 h-2 w-[100px] rounded-full"></div>
    <slot />
  </DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
