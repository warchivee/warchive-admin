import { s as setContext, p as getContext, c as create_ssr_component, h as compute_rest_props, a as subscribe, i as spread, k as escape_object, b as add_attribute, v as validate_component, j as escape_attribute_value, g as escape, o as onDestroy, l as get_store_value, r as set_store_value, e as each } from "./ssr.js";
import { D as noop, G as safeOnDestroy, w as withGet, m as makeElement, s as styleToString$2, g as effect$1, H as addEventListener$1, e as executeCallbacks$1, d as addMeltEventListener, a as isHTMLElement, o as omit$1, f as createElHelpers, h as createBitAttrs, c as cn, b as buttonVariants, B as Button } from "./input.js";
import { R as Root, T as Trigger, P as Popover_content } from "./index3.js";
import { z as isTouchDevice, A as isFirefox, b as toWritableStores$1, g as generateIds, r as removeUndefined$1, e as getOptionUpdater, I as Icon, v as nanoid, d as tick, y as toast } from "./Toaster.svelte_svelte_type_style_lang.js";
import { d as derived, w as writable } from "./index2.js";
import { X } from "./axios.js";
import { B as Badge } from "./index4.js";
function clamp(min, value, max) {
  return Math.max(min, Math.min(value, max));
}
function debounceCallback(cb, delay) {
  let debounceTimer = 0;
  safeOnDestroy(() => {
    clearTimeout(debounceTimer);
  });
  return () => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(cb, delay);
  };
}
function resizeObserver(node, handleResize) {
  let animationFrame = 0;
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(handleResize);
  });
  observer.observe(node);
  return () => {
    window.cancelAnimationFrame(animationFrame);
    observer.unobserve(node);
  };
}
function addUnlinkedScrollListener(node, handler = noop) {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll)
      handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1])
      return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const [scrollClampMin, scrollClampMax] = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp(scrollClampMin, scrollPos, scrollClampMax);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function createStateMachine(initialState, machine) {
  const state = withGet.writable(initialState);
  function reducer(event) {
    const $state = state.get();
    const nextState = machine[$state][event];
    return nextState ?? $state;
  }
  const dispatch = (event) => {
    state.set(reducer(event));
  };
  return {
    state,
    dispatch
  };
}
function createBaseScrollbarAction(state) {
  const { rootState, scrollbarState } = state;
  scrollbarState.isVisible.set(true);
  function handleDragScroll(e) {
    const $domRect = scrollbarState.domRect.get();
    if (!$domRect)
      return;
    const x = e.clientX - $domRect.left;
    const y = e.clientY - $domRect.top;
    const $isHorizontal = scrollbarState.isHorizontal.get();
    if ($isHorizontal) {
      scrollbarState.onDragScroll(x);
    } else {
      scrollbarState.onDragScroll(y);
    }
  }
  function handlePointerDown(e) {
    if (e.button !== 0)
      return;
    const target = e.target;
    if (!isHTMLElement(target))
      return;
    target.setPointerCapture(e.pointerId);
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(currentTarget))
      return;
    scrollbarState.domRect.set(currentTarget.getBoundingClientRect());
    scrollbarState.prevWebkitUserSelect.set(document.body.style.webkitUserSelect);
    document.body.style.webkitUserSelect = "none";
    const $viewportEl = rootState.viewportEl.get();
    if ($viewportEl) {
      $viewportEl.style.scrollBehavior = "auto";
    }
    handleDragScroll(e);
  }
  function handlePointerMove(e) {
    handleDragScroll(e);
  }
  function handlePointerUp(e) {
    const target = e.target;
    if (!isHTMLElement(target))
      return;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }
    document.body.style.webkitUserSelect = scrollbarState.prevWebkitUserSelect.get();
    const $viewportEl = rootState.viewportEl.get();
    if ($viewportEl) {
      $viewportEl.style.scrollBehavior = "";
    }
    scrollbarState.domRect.set(null);
  }
  function handleWheel(e) {
    const target = e.target;
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(target) || !isHTMLElement(currentTarget))
      return;
    const isScrollbarWheel = currentTarget.contains(target);
    if (!isScrollbarWheel)
      return;
    const $sizes = scrollbarState.sizes.get();
    if (!$sizes)
      return;
    const maxScrollPos = $sizes.content - $sizes.viewport;
    scrollbarState.handleWheelScroll(e, maxScrollPos);
  }
  function baseAction(node) {
    scrollbarState.scrollbarEl.set(node);
    const unsubEvents = executeCallbacks$1(addMeltEventListener(node, "pointerdown", handlePointerDown), addMeltEventListener(node, "pointermove", handlePointerMove), addMeltEventListener(node, "pointerup", handlePointerUp), addEventListener$1(document, "wheel", handleWheel, { passive: false }));
    const unsubResizeContent = effect$1([rootState.contentEl], ([$contentEl]) => {
      if (!$contentEl)
        return noop;
      return resizeObserver($contentEl, scrollbarState.handleSizeChange);
    });
    return {
      destroy() {
        unsubEvents();
        unsubResizeContent();
      }
    };
  }
  return baseAction;
}
function createAutoScrollbarAction(state) {
  const baseAction = createBaseScrollbarAction(state);
  const { rootState, scrollbarState } = state;
  const handleResize = debounceCallback(() => {
    const $viewportEl = rootState.viewportEl.get();
    if (!$viewportEl)
      return;
    const isOverflowX = $viewportEl.offsetWidth < $viewportEl.scrollWidth;
    const isOverflowY = $viewportEl.offsetHeight < $viewportEl.scrollHeight;
    scrollbarState.isVisible.set(scrollbarState.isHorizontal.get() ? isOverflowX : isOverflowY);
  }, 10);
  function scrollbarAutoAction(node) {
    const unsubBaseAction = baseAction(node)?.destroy;
    handleResize();
    const unsubObservers = [];
    const $viewportEl = rootState.viewportEl.get();
    if ($viewportEl) {
      unsubObservers.push(resizeObserver($viewportEl, handleResize));
    }
    const $contentEl = rootState.contentEl.get();
    if ($contentEl) {
      unsubObservers.push(resizeObserver($contentEl, handleResize));
    }
    return {
      destroy() {
        unsubObservers.forEach((unsub) => unsub());
        unsubBaseAction();
      }
    };
  }
  return scrollbarAutoAction;
}
function createHoverScrollbarAction(state) {
  const baseAction = createBaseScrollbarAction(state);
  const { rootState, scrollbarState } = state;
  scrollbarState.isVisible.set(false);
  let timeout;
  function handlePointerEnter() {
    window.clearTimeout(timeout);
    if (scrollbarState.isVisible.get())
      return;
    const $viewportEl = rootState.viewportEl.get();
    if (!$viewportEl)
      return;
    const isOverflowX = $viewportEl.offsetWidth < $viewportEl.scrollWidth;
    const isOverflowY = $viewportEl.offsetHeight < $viewportEl.scrollHeight;
    scrollbarState.isVisible.set(scrollbarState.isHorizontal.get() ? isOverflowX : isOverflowY);
  }
  function handlePointerLeave() {
    timeout = window.setTimeout(() => {
      if (!scrollbarState.isVisible.get())
        return;
      scrollbarState.isVisible.set(false);
    }, rootState.options.hideDelay.get());
  }
  function scrollbarHoverAction(node) {
    const unsubBaseAction = baseAction(node)?.destroy;
    const scrollAreaEl = node.closest("[data-melt-scroll-area]");
    let unsubScrollAreaListeners = noop;
    if (scrollAreaEl) {
      if (isTouchDevice()) {
        unsubScrollAreaListeners = executeCallbacks$1(addEventListener$1(scrollAreaEl, "touchstart", handlePointerEnter), addEventListener$1(scrollAreaEl, "touchend", handlePointerLeave));
      } else if (isFirefox()) {
        unsubScrollAreaListeners = executeCallbacks$1(addEventListener$1(scrollAreaEl, "pointerenter", handlePointerEnter), addEventListener$1(scrollAreaEl, "mouseenter", handlePointerEnter), addEventListener$1(scrollAreaEl, "mouseleave", handlePointerLeave));
      } else {
        unsubScrollAreaListeners = executeCallbacks$1(addEventListener$1(scrollAreaEl, "pointerenter", handlePointerEnter), addEventListener$1(scrollAreaEl, "pointerleave", handlePointerLeave));
      }
    }
    return {
      destroy() {
        unsubBaseAction?.();
        unsubScrollAreaListeners();
      }
    };
  }
  return scrollbarHoverAction;
}
function createScrollScrollbarAction(state) {
  const baseAction = createBaseScrollbarAction(state);
  const { rootState, scrollbarState } = state;
  const machine = createStateMachine("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  effect$1([machine.state], ([$status]) => {
    if ($status === "idle") {
      window.setTimeout(() => {
        machine.dispatch("HIDE");
      }, rootState.options.hideDelay.get());
    }
    if ($status === "hidden") {
      scrollbarState.isVisible.set(false);
    } else {
      scrollbarState.isVisible.set(true);
    }
  });
  const debounceScrollEnd = debounceCallback(() => machine.dispatch("SCROLL_END"), 100);
  effect$1([rootState.viewportEl, scrollbarState.isHorizontal], ([$viewportEl, $isHorizontal]) => {
    const scrollDirection = $isHorizontal ? "scrollLeft" : "scrollTop";
    let unsub = noop;
    if ($viewportEl) {
      let prevScrollPos = $viewportEl[scrollDirection];
      const handleScroll = () => {
        const scrollPos = $viewportEl[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          machine.dispatch("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      unsub = addEventListener$1($viewportEl, "scroll", handleScroll);
    }
    return () => {
      unsub();
    };
  });
  function scrollbarScrollAction(node) {
    const unsubBaseAction = baseAction(node)?.destroy;
    const unsubListeners = executeCallbacks$1(addEventListener$1(node, "pointerenter", () => machine.dispatch("POINTER_ENTER")), addEventListener$1(node, "pointerleave", () => machine.dispatch("POINTER_LEAVE")));
    return {
      destroy() {
        unsubBaseAction?.();
        unsubListeners();
      }
    };
  }
  return scrollbarScrollAction;
}
function createScrollbarX(state, createAction) {
  const action = createAction(state);
  const { rootState, scrollbarState } = state;
  return makeElement(name("scrollbar"), {
    stores: [scrollbarState.sizes, rootState.options.dir, scrollbarState.isVisible],
    returned: ([$sizes, $dir, $isVisible]) => {
      return {
        style: styleToString$2({
          position: "absolute",
          bottom: 0,
          left: $dir === "rtl" ? "var(--melt-scroll-area-corner-width)" : 0,
          right: $dir === "ltr" ? "var(--melt-scroll-area-corner-width)" : 0,
          "--melt-scroll-area-thumb-width": `${getThumbSize($sizes)}px`,
          visibility: !$isVisible ? "hidden" : void 0
        }),
        "data-state": $isVisible ? "visible" : "hidden"
      };
    },
    action: (node) => {
      const unsubAction = action(node)?.destroy;
      rootState.scrollbarXEl.set(node);
      rootState.scrollbarXEnabled.set(true);
      return {
        destroy() {
          unsubAction?.();
          rootState.scrollbarXEl.set(null);
        }
      };
    }
  });
}
function createScrollbarY(state, createAction) {
  const action = createAction(state);
  const { rootState, scrollbarState } = state;
  return makeElement(name("scrollbar"), {
    stores: [scrollbarState.sizes, rootState.options.dir, scrollbarState.isVisible],
    returned: ([$sizes, $dir, $isVisible]) => {
      return {
        style: styleToString$2({
          position: "absolute",
          top: 0,
          right: $dir === "ltr" ? 0 : void 0,
          left: $dir === "rtl" ? 0 : void 0,
          bottom: "var(--melt-scroll-area-corner-height)",
          "--melt-scroll-area-thumb-height": `${getThumbSize($sizes)}px`,
          visibility: !$isVisible ? "hidden" : void 0
        }),
        "data-state": $isVisible ? "visible" : "hidden"
      };
    },
    action: (node) => {
      const unsubAction = action(node)?.destroy;
      rootState.scrollbarYEl.set(node);
      rootState.scrollbarYEnabled.set(true);
      return {
        destroy() {
          unsubAction?.();
          rootState.scrollbarYEl.set(null);
        }
      };
    }
  });
}
function getScrollbarActionByType(type) {
  switch (type) {
    case "always":
      return createBaseScrollbarAction;
    case "auto":
      return createAutoScrollbarAction;
    case "hover":
      return createHoverScrollbarAction;
    case "scroll":
      return createScrollScrollbarAction;
    default:
      return createBaseScrollbarAction;
  }
}
const { name } = createElHelpers("scroll-area");
const scrollAreaIdParts = [
  "root",
  "viewport",
  "content",
  "scrollbarX",
  "scrollbarY",
  "thumbX",
  "thumbY"
];
const defaults$1 = {
  type: "hover",
  hideDelay: 600,
  dir: "ltr"
};
function createScrollArea(props) {
  const withDefaults = { ...defaults$1, ...props };
  const options = toWritableStores$1(omit$1(withDefaults, "ids"));
  const cornerWidth = withGet.writable(0);
  const cornerHeight = withGet.writable(0);
  const scrollbarXEnabled = withGet.writable(false);
  const scrollbarYEnabled = withGet.writable(false);
  const scrollAreaEl = withGet.writable(null);
  const viewportEl = withGet.writable(null);
  const contentEl = withGet.writable(null);
  const scrollbarXEl = withGet.writable(null);
  const scrollbarYEl = withGet.writable(null);
  const ids = toWritableStores$1({ ...generateIds(scrollAreaIdParts), ...withDefaults.ids });
  const rootState = {
    cornerWidth,
    cornerHeight,
    scrollbarXEnabled,
    scrollbarYEnabled,
    viewportEl,
    contentEl,
    options,
    scrollbarXEl,
    scrollbarYEl,
    scrollAreaEl,
    ids
  };
  const root = makeElement(name(), {
    stores: [cornerWidth, cornerHeight, ids.root],
    returned: ([$cornerWidth, $cornderHeight, $rootId]) => {
      return {
        style: styleToString$2({
          position: "relative",
          "--melt-scroll-area-corner-width": `${$cornerWidth}px`,
          "--melt-scroll-area-corner-height": `${$cornderHeight}px`
        }),
        id: $rootId
      };
    },
    action: (node) => {
      scrollAreaEl.set(node);
      return {
        destroy() {
          scrollAreaEl.set(null);
        }
      };
    }
  });
  const viewport = makeElement(name("viewport"), {
    stores: [scrollbarXEnabled, scrollbarYEnabled, ids.viewport],
    returned: ([$scrollbarXEnabled, $scrollbarYEnabled, $viewportId]) => {
      return {
        style: styleToString$2({
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
          "-webkit-overflow-scrolling": "touch",
          "-webkit-scrollbar": "none",
          "overflow-x": $scrollbarXEnabled ? "scroll" : "hidden",
          "overflow-y": $scrollbarYEnabled ? "scroll" : "hidden"
        }),
        id: $viewportId
      };
    },
    action: (node) => {
      const styleNode = document.createElement("style");
      styleNode.innerHTML = `
				/* Hide scrollbars cross-browser and enable momentum scroll for touch
					devices */
				[data-melt-scroll-area-viewport] {
					scrollbar-width: none;
					-ms-overflow-style: none;
					-webkit-overflow-scrolling: touch;
				}

				[data-melt-scroll-area-viewport]::-webkit-scrollbar {
					display: none;
				}
			`;
      node.parentElement?.insertBefore(styleNode, node);
      viewportEl.set(node);
      return {
        destroy() {
          styleNode.remove();
          viewportEl.set(null);
        }
      };
    }
  });
  const content = makeElement(name("content"), {
    stores: [ids.content],
    returned: ([$contentId]) => {
      return {
        style: styleToString$2({
          "min-width": "100%",
          display: "table"
        }),
        id: $contentId
      };
    },
    action: (node) => {
      contentEl.set(node);
      return {
        destroy() {
          contentEl.set(null);
        }
      };
    }
  });
  function createScrollbar(orientationProp = "vertical") {
    const orientation = withGet.writable(orientationProp);
    const isHorizontal = withGet.writable(orientationProp === "horizontal");
    const domRect = withGet.writable(null);
    const prevWebkitUserSelect = withGet.writable("");
    const pointerOffset = withGet.writable(0);
    const thumbEl = withGet.writable(null);
    const thumbOffset = withGet.writable(0);
    const scrollbarEl = withGet.writable(null);
    const sizes = withGet.writable({
      content: 0,
      viewport: 0,
      scrollbar: {
        size: 0,
        paddingStart: 0,
        paddingEnd: 0
      }
    });
    const isVisible = withGet.writable(false);
    const hasThumb = withGet.derived(sizes, ($sizes) => {
      const thumbRatio = getThumbRatio($sizes.viewport, $sizes.content);
      return Boolean(thumbRatio > 0 && thumbRatio < 1);
    });
    function getScrollPosition(pointerPos, dir) {
      return getScrollPositionFromPointer(pointerPos, pointerOffset.get(), sizes.get(), dir);
    }
    function handleWheelScroll(e, payload) {
      const $viewportEl = viewportEl.get();
      if (!$viewportEl)
        return;
      if (isHorizontal.get()) {
        const scrollPos = $viewportEl.scrollLeft + e.deltaY;
        $viewportEl.scrollLeft = scrollPos;
        if (isScrollingWithinScrollbarBounds(scrollPos, payload)) {
          e.preventDefault();
        }
      } else {
        const scrollPos = $viewportEl.scrollTop + e.deltaY;
        $viewportEl.scrollTop = scrollPos;
        if (isScrollingWithinScrollbarBounds(scrollPos, payload)) {
          e.preventDefault();
        }
      }
    }
    function handleThumbDown(payload) {
      if (isHorizontal.get()) {
        pointerOffset.set(payload.x);
      } else {
        pointerOffset.set(payload.y);
      }
    }
    function handleThumbUp() {
      pointerOffset.set(0);
    }
    function onThumbPositionChange() {
      const $viewportEl = viewportEl.get();
      const $thumbEl = thumbEl.get();
      if (!$viewportEl || !$thumbEl)
        return;
      const scrollPos = isHorizontal.get() ? $viewportEl.scrollLeft : $viewportEl.scrollTop;
      const offset = getThumbOffsetFromScroll(scrollPos, sizes.get(), rootState.options.dir.get());
      thumbOffset.set(offset);
    }
    function onDragScroll(payload) {
      const $viewportEl = viewportEl.get();
      if (!$viewportEl)
        return;
      if (isHorizontal.get()) {
        $viewportEl.scrollLeft = getScrollPosition(payload, rootState.options.dir.get());
      } else {
        $viewportEl.scrollTop = getScrollPosition(payload);
      }
    }
    function handleSizeChange() {
      const $scrollbarEl = scrollbarState.scrollbarEl.get();
      if (!$scrollbarEl)
        return;
      const $isHorizontal = scrollbarState.isHorizontal.get();
      const $viewportEl = rootState.viewportEl.get();
      if ($isHorizontal) {
        scrollbarState.sizes.set({
          content: $viewportEl?.scrollWidth ?? 0,
          viewport: $viewportEl?.offsetWidth ?? 0,
          scrollbar: {
            size: $scrollbarEl.clientWidth ?? 0,
            paddingStart: toInt(getComputedStyle($scrollbarEl).paddingLeft),
            paddingEnd: toInt(getComputedStyle($scrollbarEl).paddingRight)
          }
        });
      } else {
        scrollbarState.sizes.set({
          content: $viewportEl?.scrollHeight ?? 0,
          viewport: $viewportEl?.offsetHeight ?? 0,
          scrollbar: {
            size: $scrollbarEl.clientHeight ?? 0,
            paddingStart: toInt(getComputedStyle($scrollbarEl).paddingLeft),
            paddingEnd: toInt(getComputedStyle($scrollbarEl).paddingRight)
          }
        });
      }
    }
    const scrollbarState = {
      isHorizontal,
      domRect,
      prevWebkitUserSelect,
      pointerOffset,
      thumbEl,
      thumbOffset,
      sizes,
      orientation,
      handleThumbDown,
      handleThumbUp,
      onThumbPositionChange,
      onDragScroll,
      handleWheelScroll,
      hasThumb,
      scrollbarEl,
      isVisible,
      handleSizeChange
    };
    const scrollbarActionByType = getScrollbarActionByType(options.type.get());
    const scrollAreaState = { rootState, scrollbarState };
    const scrollbar = orientationProp === "horizontal" ? createScrollbarX(scrollAreaState, scrollbarActionByType) : createScrollbarY(scrollAreaState, scrollbarActionByType);
    const thumb = createScrollbarThumb(scrollAreaState);
    return {
      scrollbar,
      thumb
    };
  }
  const { scrollbar: scrollbarX, thumb: thumbX } = createScrollbar("horizontal");
  const { scrollbar: scrollbarY, thumb: thumbY } = createScrollbar("vertical");
  const corner = createScrollAreaCorner(rootState);
  return {
    options,
    elements: {
      root,
      viewport,
      content,
      corner,
      scrollbarX,
      scrollbarY,
      thumbX,
      thumbY
    }
  };
}
function createScrollbarThumb(state) {
  const { scrollbarState, rootState } = state;
  function handlePointerDown(e) {
    const thumb2 = e.target;
    if (!isHTMLElement(thumb2))
      return;
    const thumbRect = thumb2.getBoundingClientRect();
    const x = e.clientX - thumbRect.left;
    const y = e.clientY - thumbRect.top;
    scrollbarState.handleThumbDown({ x, y });
  }
  function handlePointerUp(e) {
    scrollbarState.handleThumbUp(e);
  }
  let unsubListener = void 0;
  function handleScroll() {
    if (unsubListener)
      return;
    const $viewportEl = rootState.viewportEl.get();
    if ($viewportEl) {
      unsubListener = addUnlinkedScrollListener($viewportEl, scrollbarState.onThumbPositionChange);
    }
    scrollbarState.onThumbPositionChange();
  }
  const thumb = makeElement(name("thumb"), {
    stores: [scrollbarState.hasThumb, scrollbarState.isHorizontal, scrollbarState.thumbOffset],
    returned: ([$hasThumb, $isHorizontal, $offset]) => {
      return {
        style: styleToString$2({
          width: "var(--melt-scroll-area-thumb-width)",
          height: "var(--melt-scroll-area-thumb-height)",
          transform: $isHorizontal ? `translate3d(${Math.round($offset)}px, 0, 0)` : `translate3d(0, ${Math.round($offset)}px, 0)`
        }),
        "data-state": $hasThumb ? "visible" : "hidden"
      };
    },
    action: (node) => {
      scrollbarState.thumbEl.set(node);
      const unsubEffect = effect$1([scrollbarState.sizes], ([_]) => {
        const $viewportEl = rootState.viewportEl.get();
        if (!$viewportEl)
          return noop;
        scrollbarState.onThumbPositionChange();
        return addEventListener$1($viewportEl, "scroll", handleScroll);
      });
      const unsubEvents = executeCallbacks$1(addMeltEventListener(node, "pointerdown", handlePointerDown), addMeltEventListener(node, "pointerup", handlePointerUp));
      return {
        destroy() {
          unsubListener?.();
          unsubEvents();
          unsubEffect();
        }
      };
    }
  });
  return thumb;
}
function createScrollAreaCorner(rootState) {
  const width = writable(0);
  const height = writable(0);
  const hasSize = derived([width, height], ([$width, $height]) => !!$width && !!$height);
  function setCornerHeight() {
    const offsetHeight = rootState.scrollbarXEl.get()?.offsetHeight || 0;
    rootState.cornerHeight.set(offsetHeight);
    height.set(offsetHeight);
  }
  function setCornerWidth() {
    const offsetWidth = rootState.scrollbarYEl.get()?.offsetWidth || 0;
    rootState.cornerWidth.set(offsetWidth);
    width.set(offsetWidth);
  }
  effect$1([rootState.scrollbarXEl], ([$scrollbarXEl]) => {
    if ($scrollbarXEl) {
      setCornerHeight();
    }
  });
  effect$1([rootState.scrollbarYEl], ([$scrollbarYEl]) => {
    if ($scrollbarYEl) {
      setCornerWidth();
    }
  });
  const hasBothScrollbarsVisible = derived([rootState.scrollbarXEl, rootState.scrollbarYEl], ([$scrollbarXEl, $scrollbarYEl]) => {
    return !!$scrollbarXEl && !!$scrollbarYEl;
  });
  const hasCorner = derived([rootState.options.type, hasBothScrollbarsVisible], ([$type, $hasBoth]) => {
    return $type !== "scroll" && $hasBoth;
  });
  const shouldDisplay = derived([hasCorner, hasSize], ([$hasCorner, $hasSize]) => $hasCorner && $hasSize);
  const corner = makeElement(name("corner"), {
    stores: [width, height, rootState.options.dir, shouldDisplay],
    returned: ([$width, $height, $dir, $shouldDisplay]) => {
      return {
        style: styleToString$2({
          display: $shouldDisplay ? "block" : "none",
          width: `${$width}px`,
          height: `${$height}px`,
          position: "absolute",
          right: $dir === "ltr" ? 0 : void 0,
          left: $dir === "rtl" ? 0 : void 0,
          bottom: 0
        })
      };
    }
  });
  return corner;
}
function styleToString$1(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return `${str}${key}:${style[key]};`;
  }, "");
}
function getScrollAreaData() {
  const NAME2 = "scroll-area";
  const SCROLLBAR_NAME = "scrollbar";
  const PARTS = [
    "scrollbar-x",
    "scrollbar-y",
    "thumb-x",
    "thumb-y",
    "viewport",
    "content",
    "root",
    "corner"
  ];
  return { NAME: NAME2, PARTS, SCROLLBAR_NAME };
}
function setCtx(props) {
  const { NAME: NAME2, PARTS } = getScrollAreaData();
  const getAttrs = createBitAttrs(NAME2, PARTS);
  const scrollArea = { ...createScrollArea(removeUndefined$1(props)), getAttrs };
  setContext(NAME2, scrollArea);
  return {
    ...scrollArea,
    updateOption: getOptionUpdater(scrollArea.options)
  };
}
function getCtx$1() {
  const { NAME: NAME2 } = getScrollAreaData();
  return getContext(NAME2);
}
function setScrollbarOrientation(orientation) {
  const { SCROLLBAR_NAME } = getScrollAreaData();
  return setContext(SCROLLBAR_NAME, orientation);
}
function getScrollbarOrientation() {
  const { SCROLLBAR_NAME } = getScrollAreaData();
  return getContext(SCROLLBAR_NAME);
}
const Scroll_area$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let attrs;
  let $$restProps = compute_rest_props($$props, ["type", "dir", "hideDelay", "asChild", "el"]);
  let $root, $$unsubscribe_root;
  let { type = "hover" } = $$props;
  let { dir = "ltr" } = $$props;
  let { hideDelay = 600 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, updateOption, getAttrs } = setCtx({ type, dir, hideDelay });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  const bitsAttrs = getAttrs("root");
  const style = styleToString$1({ overflow: "hidden" });
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.dir === void 0 && $$bindings.dir && dir !== void 0) $$bindings.dir(dir);
  if ($$props.hideDelay === void 0 && $$bindings.hideDelay && hideDelay !== void 0) $$bindings.hideDelay(hideDelay);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $root;
  {
    updateOption("type", type);
  }
  {
    updateOption("dir", dir);
  }
  {
    updateOption("hideDelay", hideDelay);
  }
  attrs = { ...$$restProps, ...bitsAttrs, style };
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Scroll_area_viewport = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $viewport, $$unsubscribe_viewport;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { viewport }, getAttrs } = getCtx$1();
  $$unsubscribe_viewport = subscribe(viewport, (value) => $viewport = value);
  const bitsAttrs = getAttrs("viewport");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = { ...$$restProps, ...bitsAttrs };
  builder = $viewport;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_viewport();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Scroll_area_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $content, $$unsubscribe_content;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, getAttrs } = getCtx$1();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  const bitsAttrs = getAttrs("content");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = { ...$$restProps, ...bitsAttrs };
  builder = $content;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_content();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Scroll_area_scrollbar_y = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $scrollbarY, $$unsubscribe_scrollbarY;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { scrollbarY }, getAttrs } = getCtx$1();
  $$unsubscribe_scrollbarY = subscribe(scrollbarY, (value) => $scrollbarY = value);
  const bitsAttrs = getAttrs("scrollbar-y");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = { ...$$restProps, ...bitsAttrs };
  builder = $scrollbarY;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_scrollbarY();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Scroll_area_scrollbar_x = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $scrollbarX, $$unsubscribe_scrollbarX;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { scrollbarX }, getAttrs } = getCtx$1();
  $$unsubscribe_scrollbarX = subscribe(scrollbarX, (value) => $scrollbarX = value);
  const bitsAttrs = getAttrs("scrollbar-x");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = { ...$$restProps, ...bitsAttrs };
  builder = $scrollbarX;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_scrollbarX();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Scroll_area_scrollbar$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["orientation"]);
  let $orientationStore, $$unsubscribe_orientationStore;
  let { orientation } = $$props;
  const orientationStore = writable(orientation);
  $$unsubscribe_orientationStore = subscribe(orientationStore, (value) => $orientationStore = value);
  setScrollbarOrientation(orientationStore);
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0) $$bindings.orientation(orientation);
  {
    orientationStore.set(orientation);
  }
  $$unsubscribe_orientationStore();
  return `${$orientationStore === "vertical" ? `${validate_component(Scroll_area_scrollbar_y, "ScrollAreaScrollbarY").$$render($$result, Object.assign({}, $$restProps), {}, {
    default: ({ builder }) => {
      return `${slots.default ? slots.default({ builder }) : ``}`;
    }
  })}` : `${validate_component(Scroll_area_scrollbar_x, "ScrollAreaScrollbarX").$$render($$result, Object.assign({}, $$restProps), {}, {
    default: ({ builder }) => {
      return `${slots.default ? slots.default({ builder }) : ``}`;
    }
  })}`}`;
});
const Scroll_area_thumb_y = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $thumbY, $$unsubscribe_thumbY;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { thumbY }, getAttrs } = getCtx$1();
  $$unsubscribe_thumbY = subscribe(thumbY, (value) => $thumbY = value);
  const bitsAttrs = getAttrs("thumb-y");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = { ...$$restProps, ...bitsAttrs };
  builder = $thumbY;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_thumbY();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Scroll_area_thumb_x = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $thumbX, $$unsubscribe_thumbX;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { thumbX }, getAttrs } = getCtx$1();
  $$unsubscribe_thumbX = subscribe(thumbX, (value) => $thumbX = value);
  const bitsAttrs = getAttrs("thumb-x");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = { ...$$restProps, ...bitsAttrs };
  builder = $thumbX;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_thumbX();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Scroll_area_thumb = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  let $orientation, $$unsubscribe_orientation;
  const orientation = getScrollbarOrientation();
  $$unsubscribe_orientation = subscribe(orientation, (value) => $orientation = value);
  $$unsubscribe_orientation();
  return `${$orientation === "vertical" ? `${validate_component(Scroll_area_thumb_y, "ScrollAreaThumbY").$$render($$result, Object.assign({}, $$restProps), {}, {
    default: ({ builder }) => {
      return `${slots.default ? slots.default({ builder }) : ``}`;
    }
  })}` : `${validate_component(Scroll_area_thumb_x, "ScrollAreaThumbX").$$render($$result, Object.assign({}, $$restProps), {}, {
    default: ({ builder }) => {
      return `${slots.default ? slots.default({ builder }) : ``}`;
    }
  })}`}`;
});
const Scroll_area_corner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $corner, $$unsubscribe_corner;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { corner }, getAttrs } = getCtx$1();
  $$unsubscribe_corner = subscribe(corner, (value) => $corner = value);
  const bitsAttrs = getAttrs("corner");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = { ...$$restProps, ...bitsAttrs };
  builder = $corner;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_corner();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "check" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Textarea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value", "readonly"]);
  let { class: className = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { readonly = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly !== void 0) $$bindings.readonly(readonly);
  return `<textarea${spread(
    [
      {
        class: escape_attribute_value(cn("border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className))
      },
      { readonly: readonly || null },
      escape_object($$restProps)
    ],
    {}
  )}>${escape(value || "")}</textarea>`;
});
const Scroll_area_scrollbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  let { orientation = "vertical" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0) $$bindings.orientation(orientation);
  return `${validate_component(Scroll_area_scrollbar$1, "ScrollAreaPrimitive.Scrollbar").$$render(
    $$result,
    {
      orientation,
      class: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-px", orientation === "horizontal" && "h-2.5 w-full border-t border-t-transparent p-px", className)
    },
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``} ${validate_component(Scroll_area_thumb, "ScrollAreaPrimitive.Thumb").$$render(
          $$result,
          {
            class: cn("bg-border relative rounded-full", orientation === "vertical" && "flex-1")
          },
          {},
          {}
        )}`;
      }
    }
  )}`;
});
const Scroll_area = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "orientation", "scrollbarXClasses", "scrollbarYClasses"]);
  let { class: className = void 0 } = $$props;
  let { orientation = "vertical" } = $$props;
  let { scrollbarXClasses = "" } = $$props;
  let { scrollbarYClasses = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0) $$bindings.orientation(orientation);
  if ($$props.scrollbarXClasses === void 0 && $$bindings.scrollbarXClasses && scrollbarXClasses !== void 0) $$bindings.scrollbarXClasses(scrollbarXClasses);
  if ($$props.scrollbarYClasses === void 0 && $$bindings.scrollbarYClasses && scrollbarYClasses !== void 0) $$bindings.scrollbarYClasses(scrollbarYClasses);
  return `${validate_component(Scroll_area$1, "ScrollAreaPrimitive.Root").$$render(
    $$result,
    Object.assign({}, $$restProps, {
      class: cn("relative overflow-hidden", className)
    }),
    {},
    {
      default: () => {
        return `${validate_component(Scroll_area_viewport, "ScrollAreaPrimitive.Viewport").$$render($$result, { class: "h-full w-full rounded-[inherit]" }, {}, {
          default: () => {
            return `${validate_component(Scroll_area_content, "ScrollAreaPrimitive.Content").$$render($$result, {}, {}, {
              default: () => {
                return `${slots.default ? slots.default({}) : ``}`;
              }
            })}`;
          }
        })} ${orientation === "vertical" || orientation === "both" ? `${validate_component(Scroll_area_scrollbar, "Scrollbar").$$render(
          $$result,
          {
            orientation: "vertical",
            class: scrollbarYClasses
          },
          {},
          {}
        )}` : ``} ${orientation === "horizontal" || orientation === "both" ? `${validate_component(Scroll_area_scrollbar, "Scrollbar").$$render(
          $$result,
          {
            orientation: "horizontal",
            class: scrollbarXClasses
          },
          {},
          {}
        )}` : ``} ${validate_component(Scroll_area_corner, "ScrollAreaPrimitive.Corner").$$render($$result, {}, {}, {})}`;
      }
    }
  )}`;
});
const SCORE_CONTINUE_MATCH = 1, SCORE_SPACE_WORD_JUMP = 0.9, SCORE_NON_SPACE_WORD_JUMP = 0.8, SCORE_CHARACTER_JUMP = 0.17, SCORE_TRANSPOSITION = 0.1, PENALTY_SKIPPED = 0.999, PENALTY_CASE_MISMATCH = 0.9999, PENALTY_NOT_COMPLETE = 0.99;
const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/, COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g, IS_SPACE_REGEXP = /[\s-]/, COUNT_SPACE_REGEXP = /[\s-]/g;
function commandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, stringIndex, abbreviationIndex, memoizedResults) {
  if (abbreviationIndex === abbreviation.length) {
    if (stringIndex === string.length) {
      return SCORE_CONTINUE_MATCH;
    }
    return PENALTY_NOT_COMPLETE;
  }
  const memoizeKey = `${stringIndex},${abbreviationIndex}`;
  if (memoizedResults[memoizeKey] !== void 0) {
    return memoizedResults[memoizeKey];
  }
  const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
  let index = lowerString.indexOf(abbreviationChar, stringIndex);
  let highScore = 0;
  let score, transposedScore, wordBreaks, spaceBreaks;
  while (index >= 0) {
    score = commandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 1, memoizedResults);
    if (score > highScore) {
      if (index === stringIndex) {
        score *= SCORE_CONTINUE_MATCH;
      } else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_NON_SPACE_WORD_JUMP;
        wordBreaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP);
        if (wordBreaks && stringIndex > 0) {
          score *= Math.pow(PENALTY_SKIPPED, wordBreaks.length);
        }
      } else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_SPACE_WORD_JUMP;
        spaceBreaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP);
        if (spaceBreaks && stringIndex > 0) {
          score *= Math.pow(PENALTY_SKIPPED, spaceBreaks.length);
        }
      } else {
        score *= SCORE_CHARACTER_JUMP;
        if (stringIndex > 0) {
          score *= Math.pow(PENALTY_SKIPPED, index - stringIndex);
        }
      }
      if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) {
        score *= PENALTY_CASE_MISMATCH;
      }
    }
    if (score < SCORE_TRANSPOSITION && lowerString.charAt(index - 1) === lowerAbbreviation.charAt(abbreviationIndex + 1) || lowerAbbreviation.charAt(abbreviationIndex + 1) === lowerAbbreviation.charAt(abbreviationIndex) && // allow duplicate letters. Ref #7428
    lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex)) {
      transposedScore = commandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 2, memoizedResults);
      if (transposedScore * SCORE_TRANSPOSITION > score) {
        score = transposedScore * SCORE_TRANSPOSITION;
      }
    }
    if (score > highScore) {
      highScore = score;
    }
    index = lowerString.indexOf(abbreviationChar, index + 1);
  }
  memoizedResults[memoizeKey] = highScore;
  return highScore;
}
function formatInput(string) {
  return string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}
function commandScore(string, abbreviation) {
  return commandScoreInner(string, abbreviation, formatInput(string), formatInput(abbreviation), 0, 0, {});
}
const isBrowser = typeof document !== "undefined";
function isUndefined(value) {
  return value === void 0;
}
function generateId() {
  return nanoid(10);
}
const kbd = {
  ALT: "Alt",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  BACKSPACE: "Backspace",
  CAPS_LOCK: "CapsLock",
  CONTROL: "Control",
  DELETE: "Delete",
  END: "End",
  ENTER: "Enter",
  ESCAPE: "Escape",
  F1: "F1",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  HOME: "Home",
  META: "Meta",
  PAGE_DOWN: "PageDown",
  PAGE_UP: "PageUp",
  SHIFT: "Shift",
  SPACE: " ",
  TAB: "Tab",
  CTRL: "Control",
  ASTERISK: "*"
};
function omit(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
function removeUndefined(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
}
function toWritableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    result[propertyKey] = writable(value);
  });
  return result;
}
function effect(stores, fn) {
  const unsub = derivedWithUnsubscribe(stores, (stores2, onUnsubscribe) => {
    return {
      stores: stores2,
      onUnsubscribe
    };
  }).subscribe(({ stores: stores2, onUnsubscribe }) => {
    const returned = fn(stores2);
    if (returned) {
      onUnsubscribe(returned);
    }
  });
  onDestroy(unsub);
  return unsub;
}
function derivedWithUnsubscribe(stores, fn) {
  let unsubscribers = [];
  const onUnsubscribe = (cb) => {
    unsubscribers.push(cb);
  };
  const unsubscribe = () => {
    unsubscribers.forEach((fn2) => fn2());
    unsubscribers = [];
  };
  const derivedStore = derived(stores, ($storeValues) => {
    unsubscribe();
    return fn($storeValues, onUnsubscribe);
  });
  onDestroy(unsubscribe);
  const subscribe2 = (...args) => {
    const unsub = derivedStore.subscribe(...args);
    return () => {
      unsub();
      unsubscribe();
    };
  };
  return {
    ...derivedStore,
    subscribe: subscribe2
  };
}
function styleToString(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
const srOnlyStyles = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0"
};
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
function executeCallbacks(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
const NAME = "Command";
const STATE_NAME = "CommandState";
const GROUP_NAME = "CommandGroup";
const LIST_SELECTOR = `[data-cmdk-list-sizer]`;
const GROUP_SELECTOR = `[data-cmdk-group]`;
const GROUP_ITEMS_SELECTOR = `[data-cmdk-group-items]`;
const GROUP_HEADING_SELECTOR = `[data-cmdk-group-heading]`;
const ITEM_SELECTOR = `[data-cmdk-item]`;
const VALID_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([aria-disabled="true"])`;
const VALUE_ATTR = `data-value`;
const defaultFilter = (value, search) => commandScore(value, search);
function getCtx() {
  return getContext(NAME);
}
function getState() {
  return getContext(STATE_NAME);
}
function createGroup(alwaysRender) {
  const id = generateId();
  setContext(GROUP_NAME, {
    id,
    alwaysRender: isUndefined(alwaysRender) ? false : alwaysRender
  });
  return { id };
}
function getGroup() {
  const context = getContext(GROUP_NAME);
  if (!context)
    return void 0;
  return context;
}
function createState(initialValues) {
  const defaultState = {
    search: "",
    value: "",
    filtered: {
      count: 0,
      items: /* @__PURE__ */ new Map(),
      groups: /* @__PURE__ */ new Set()
    }
  };
  const state = writable(initialValues ? { ...defaultState, ...removeUndefined(initialValues) } : defaultState);
  return state;
}
const defaults = {
  label: "Command menu",
  shouldFilter: true,
  loop: false,
  onValueChange: void 0,
  value: void 0,
  filter: defaultFilter,
  ids: {
    root: generateId(),
    list: generateId(),
    label: generateId(),
    input: generateId()
  }
};
function createCommand(props) {
  const ids = {
    root: generateId(),
    list: generateId(),
    label: generateId(),
    input: generateId(),
    ...props.ids
  };
  const withDefaults = {
    ...defaults,
    ...removeUndefined(props)
  };
  const state = props.state ?? createState({
    value: withDefaults.value
  });
  const allItems = writable(/* @__PURE__ */ new Set());
  const allGroups = writable(/* @__PURE__ */ new Map());
  const allIds = writable(/* @__PURE__ */ new Map());
  const commandEl = writable(null);
  const options = toWritableStores(omit(withDefaults, "value", "ids"));
  let $allItems = get_store_value(allItems);
  let $allGroups = get_store_value(allGroups);
  let $allIds = get_store_value(allIds);
  let shouldFilter = get_store_value(options.shouldFilter);
  let loop = get_store_value(options.loop);
  let label = get_store_value(options.label);
  let filter = get_store_value(options.filter);
  effect(options.shouldFilter, ($shouldFilter) => {
    shouldFilter = $shouldFilter;
  });
  effect(options.loop, ($loop) => {
    loop = $loop;
  });
  effect(options.filter, ($filter) => {
    filter = $filter;
  });
  effect(options.label, ($label) => {
    label = $label;
  });
  effect(allItems, (v) => {
    $allItems = v;
  });
  effect(allGroups, (v) => {
    $allGroups = v;
  });
  effect(allIds, (v) => {
    $allIds = v;
  });
  const context = {
    value: (id, value) => {
      if (value !== $allIds.get(id)) {
        allIds.update(($allIds2) => {
          $allIds2.set(id, value);
          return $allIds2;
        });
        state.update(($state) => {
          $state.filtered.items.set(id, score(value, $state.search));
          return $state;
        });
      }
    },
    // Track item lifecycle (add/remove)
    item: (id, groupId) => {
      allItems.update(($allItems2) => $allItems2.add(id));
      if (groupId) {
        allGroups.update(($allGroups2) => {
          if (!$allGroups2.has(groupId)) {
            $allGroups2.set(groupId, /* @__PURE__ */ new Set([id]));
          } else {
            $allGroups2.get(groupId)?.add(id);
          }
          return $allGroups2;
        });
      }
      state.update(($state) => {
        const filteredState = filterItems($state, shouldFilter);
        if (!filteredState.value) {
          const value = selectFirstItem();
          filteredState.value = value ?? "";
        }
        return filteredState;
      });
      return () => {
        allIds.update(($allIds2) => {
          $allIds2.delete(id);
          return $allIds2;
        });
        allItems.update(($allItems2) => {
          $allItems2.delete(id);
          return $allItems2;
        });
        state.update(($state) => {
          $state.filtered.items.delete(id);
          const selectedItem = getSelectedItem();
          const filteredState = filterItems($state);
          if (selectedItem?.getAttribute("id") === id) {
            filteredState.value = selectFirstItem() ?? "";
          }
          return $state;
        });
      };
    },
    group: (id) => {
      allGroups.update(($allGroups2) => {
        if (!$allGroups2.has(id)) {
          $allGroups2.set(id, /* @__PURE__ */ new Set());
        }
        return $allGroups2;
      });
      return () => {
        allIds.update(($allIds2) => {
          $allIds2.delete(id);
          return $allIds2;
        });
        allGroups.update(($allGroups2) => {
          $allGroups2.delete(id);
          return $allGroups2;
        });
      };
    },
    filter: () => {
      return shouldFilter;
    },
    label: label || props["aria-label"] || "",
    commandEl,
    ids,
    updateState
  };
  function updateState(key, value, preventScroll) {
    state.update((curr) => {
      if (Object.is(curr[key], value))
        return curr;
      curr[key] = value;
      if (key === "search") {
        const filteredState = filterItems(curr, shouldFilter);
        curr = filteredState;
        const sortedState = sort(curr, shouldFilter);
        curr = sortedState;
        tick().then(() => state.update((curr2) => {
          curr2.value = selectFirstItem() ?? "";
          props.onValueChange?.(curr2.value);
          return curr2;
        }));
      } else if (key === "value") {
        props.onValueChange?.(curr.value);
        if (!preventScroll) {
          tick().then(() => scrollSelectedIntoView());
        }
      }
      return curr;
    });
  }
  function filterItems(state2, shouldFilterVal) {
    const $shouldFilter = shouldFilterVal ?? shouldFilter;
    if (!state2.search || !$shouldFilter) {
      state2.filtered.count = $allItems.size;
      return state2;
    }
    state2.filtered.groups = /* @__PURE__ */ new Set();
    let itemCount = 0;
    for (const id of $allItems) {
      const value = $allIds.get(id);
      const rank = score(value, state2.search);
      state2.filtered.items.set(id, rank);
      if (rank > 0) {
        itemCount++;
      }
    }
    for (const [groupId, group] of $allGroups) {
      for (const itemId of group) {
        const rank = state2.filtered.items.get(itemId);
        if (rank && rank > 0) {
          state2.filtered.groups.add(groupId);
        }
      }
    }
    state2.filtered.count = itemCount;
    return state2;
  }
  function sort(state2, shouldFilterVal) {
    const $shouldFilter = shouldFilterVal ?? shouldFilter;
    if (!state2.search || !$shouldFilter) {
      return state2;
    }
    const scores = state2.filtered.items;
    const groups = [];
    for (const value of state2.filtered.groups) {
      const items = $allGroups.get(value);
      if (!items)
        continue;
      let max = 0;
      for (const item of items) {
        const score2 = scores.get(item);
        if (isUndefined(score2))
          continue;
        max = Math.max(score2, max);
      }
      groups.push([value, max]);
    }
    const rootEl = document.getElementById(ids.root);
    if (!rootEl)
      return state2;
    const list = rootEl.querySelector(LIST_SELECTOR);
    const validItems = getValidItems(rootEl).sort((a, b) => {
      const valueA = a.getAttribute(VALUE_ATTR) ?? "";
      const valueB = b.getAttribute(VALUE_ATTR) ?? "";
      return (scores.get(valueA) ?? 0) - (scores.get(valueB) ?? 0);
    });
    for (const item of validItems) {
      const group = item.closest(GROUP_ITEMS_SELECTOR);
      const closest = item.closest(`${GROUP_ITEMS_SELECTOR} > *`);
      if (group) {
        if (item.parentElement === group) {
          group.appendChild(item);
        } else {
          if (!closest)
            continue;
          group.appendChild(closest);
        }
      } else {
        if (item.parentElement === list) {
          list?.appendChild(item);
        } else {
          if (!closest)
            continue;
          list?.appendChild(closest);
        }
      }
    }
    groups.sort((a, b) => b[1] - a[1]);
    for (const group of groups) {
      const el = rootEl.querySelector(`${GROUP_SELECTOR}[${VALUE_ATTR}="${group[0]}"]`);
      el?.parentElement?.appendChild(el);
    }
    return state2;
  }
  function selectFirstItem() {
    const item = getValidItems().find((item2) => !item2.ariaDisabled);
    if (!item)
      return;
    const value = item.getAttribute(VALUE_ATTR);
    if (!value)
      return;
    return value;
  }
  function score(value, search) {
    const lowerCaseAndTrimmedValue = value?.toLowerCase().trim();
    const filterFn = filter;
    if (!filterFn) {
      return lowerCaseAndTrimmedValue ? defaultFilter(lowerCaseAndTrimmedValue, search) : 0;
    }
    return lowerCaseAndTrimmedValue ? filterFn(lowerCaseAndTrimmedValue, search) : 0;
  }
  function scrollSelectedIntoView() {
    const item = getSelectedItem();
    if (!item) {
      return;
    }
    if (item.parentElement?.firstChild === item) {
      tick().then(() => item.closest(GROUP_SELECTOR)?.querySelector(GROUP_HEADING_SELECTOR)?.scrollIntoView({
        block: "nearest"
      }));
    }
    tick().then(() => item.scrollIntoView({ block: "nearest" }));
  }
  function getValidItems(rootElement) {
    const rootEl = rootElement ?? document.getElementById(ids.root);
    if (!rootEl)
      return [];
    return Array.from(rootEl.querySelectorAll(VALID_ITEM_SELECTOR)).filter((el) => el ? true : false);
  }
  function getSelectedItem(rootElement) {
    const rootEl = document.getElementById(ids.root);
    if (!rootEl)
      return;
    const selectedEl = rootEl.querySelector(`${VALID_ITEM_SELECTOR}[aria-selected="true"]`);
    if (!selectedEl)
      return;
    return selectedEl;
  }
  function updateSelectedToIndex(index) {
    const rootEl = document.getElementById(ids.root);
    if (!rootEl)
      return;
    const items = getValidItems(rootEl);
    const item = items[index];
    if (!item)
      return;
    updateState("value", item.getAttribute(VALUE_ATTR) ?? "");
  }
  function updateSelectedByChange(change) {
    const selected = getSelectedItem();
    const items = getValidItems();
    const index = items.findIndex((item) => item === selected);
    let newSelected = items[index + change];
    if (loop) {
      if (index + change < 0) {
        newSelected = items[items.length - 1];
      } else if (index + change === items.length) {
        newSelected = items[0];
      } else {
        newSelected = items[index + change];
      }
    }
    if (newSelected) {
      updateState("value", newSelected.getAttribute(VALUE_ATTR) ?? "");
    }
  }
  function updateSelectedToGroup(change) {
    const selected = getSelectedItem();
    let group = selected?.closest(GROUP_SELECTOR);
    let item = void 0;
    while (group && !item) {
      group = change > 0 ? findNextSibling(group, GROUP_SELECTOR) : findPreviousSibling(group, GROUP_SELECTOR);
      item = group?.querySelector(VALID_ITEM_SELECTOR);
    }
    if (item) {
      updateState("value", item.getAttribute(VALUE_ATTR) ?? "");
    } else {
      updateSelectedByChange(change);
    }
  }
  function last() {
    return updateSelectedToIndex(getValidItems().length - 1);
  }
  function next(e) {
    e.preventDefault();
    if (e.metaKey) {
      last();
    } else if (e.altKey) {
      updateSelectedToGroup(1);
    } else {
      updateSelectedByChange(1);
    }
  }
  function prev(e) {
    e.preventDefault();
    if (e.metaKey) {
      updateSelectedToIndex(0);
    } else if (e.altKey) {
      updateSelectedToGroup(-1);
    } else {
      updateSelectedByChange(-1);
    }
  }
  function handleRootKeydown(e) {
    switch (e.key) {
      case kbd.ARROW_DOWN:
        next(e);
        break;
      case kbd.ARROW_UP:
        prev(e);
        break;
      case kbd.HOME:
        e.preventDefault();
        updateSelectedToIndex(0);
        break;
      case kbd.END:
        e.preventDefault();
        last();
        break;
      case kbd.ENTER: {
        e.preventDefault();
        const item = getSelectedItem();
        if (item) {
          item?.click();
        }
      }
    }
  }
  setContext(NAME, context);
  const stateStore = {
    subscribe: state.subscribe,
    update: state.update,
    set: state.set,
    updateState
  };
  setContext(STATE_NAME, stateStore);
  return {
    state: stateStore,
    handleRootKeydown,
    commandEl,
    ids
  };
}
function findNextSibling(el, selector) {
  let sibling = el.nextElementSibling;
  while (sibling) {
    if (sibling.matches(selector))
      return sibling;
    sibling = sibling.nextElementSibling;
  }
}
function findPreviousSibling(el, selector) {
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (sibling.matches(selector))
      return sibling;
    sibling = sibling.previousElementSibling;
  }
}
const Command$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let slotProps;
  let $$restProps = compute_rest_props($$props, [
    "label",
    "shouldFilter",
    "filter",
    "value",
    "onValueChange",
    "loop",
    "onKeydown",
    "state",
    "ids",
    "asChild"
  ]);
  let $stateStore, $$unsubscribe_stateStore;
  let { label = void 0 } = $$props;
  let { shouldFilter = true } = $$props;
  let { filter = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { onValueChange = void 0 } = $$props;
  let { loop = void 0 } = $$props;
  let { onKeydown = void 0 } = $$props;
  let { state = void 0 } = $$props;
  let { ids = void 0 } = $$props;
  let { asChild = false } = $$props;
  const { commandEl, handleRootKeydown, ids: commandIds, state: stateStore } = createCommand({
    label,
    shouldFilter,
    filter,
    value,
    onValueChange: (next) => {
      if (next !== value) {
        value = next;
        onValueChange?.(next);
      }
    },
    loop,
    state,
    ids
  });
  $$unsubscribe_stateStore = subscribe(stateStore, (value2) => $stateStore = value2);
  function syncValueAndState(value2) {
    if (value2 && value2 !== $stateStore.value) {
      set_store_value(stateStore, $stateStore.value = value2, $stateStore);
    }
  }
  function rootAction(node) {
    commandEl.set(node);
    const unsubEvents = executeCallbacks(addEventListener(node, "keydown", handleKeydown));
    return { destroy: unsubEvents };
  }
  const rootAttrs = {
    role: "application",
    id: commandIds.root,
    "data-cmdk-root": ""
  };
  const labelAttrs = {
    "data-cmdk-label": "",
    for: commandIds.input,
    id: commandIds.label,
    style: styleToString(srOnlyStyles)
  };
  function handleKeydown(e) {
    onKeydown?.(e);
    if (e.defaultPrevented) return;
    handleRootKeydown(e);
  }
  const root = { action: rootAction, attrs: rootAttrs };
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.shouldFilter === void 0 && $$bindings.shouldFilter && shouldFilter !== void 0) $$bindings.shouldFilter(shouldFilter);
  if ($$props.filter === void 0 && $$bindings.filter && filter !== void 0) $$bindings.filter(filter);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0) $$bindings.onValueChange(onValueChange);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0) $$bindings.loop(loop);
  if ($$props.onKeydown === void 0 && $$bindings.onKeydown && onKeydown !== void 0) $$bindings.onKeydown(onKeydown);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0) $$bindings.state(state);
  if ($$props.ids === void 0 && $$bindings.ids && ids !== void 0) $$bindings.ids(ids);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  {
    syncValueAndState(value);
  }
  slotProps = {
    root,
    label: { attrs: labelAttrs },
    stateStore,
    state: $stateStore
  };
  $$unsubscribe_stateStore();
  return `${asChild ? `${slots.default ? slots.default({ ...slotProps }) : ``}` : `<div${spread([escape_object(rootAttrs), escape_object($$restProps)], {})}> <label${spread([escape_object(labelAttrs)], {})}>${escape(label ?? "")}</label> ${slots.default ? slots.default({ ...slotProps }) : ``}</div>`}`;
});
const CommandEmpty = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  compute_rest_props($$props, ["asChild"]);
  let $state, $$unsubscribe_state;
  let { asChild = false } = $$props;
  const state = getState();
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  $state.filtered.count === 0;
  $$unsubscribe_state();
  return `${``}`;
});
const CommandGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let containerAttrs;
  let groupAttrs;
  let container;
  let group;
  let $$restProps = compute_rest_props($$props, ["heading", "value", "alwaysRender", "asChild"]);
  let $render, $$unsubscribe_render;
  let { heading = void 0 } = $$props;
  let { value = "" } = $$props;
  let { alwaysRender = false } = $$props;
  let { asChild = false } = $$props;
  const { id } = createGroup(alwaysRender);
  const context = getCtx();
  const state = getState();
  const headingId = generateId();
  const render = derived(state, ($state) => {
    if (alwaysRender) return true;
    if (context.filter() === false) return true;
    if (!$state.search) return true;
    return $state.filtered.groups.has(id);
  });
  $$unsubscribe_render = subscribe(render, (value2) => $render = value2);
  function containerAction(node) {
    if (value) {
      context.value(id, value);
      node.setAttribute(VALUE_ATTR, value);
      return;
    }
    if (heading) {
      value = heading.trim().toLowerCase();
    } else if (node.textContent) {
      value = node.textContent.trim().toLowerCase();
    }
    context.value(id, value);
    node.setAttribute(VALUE_ATTR, value);
  }
  const headingAttrs = {
    "data-cmdk-group-heading": "",
    "aria-hidden": true,
    id: headingId
  };
  if ($$props.heading === void 0 && $$bindings.heading && heading !== void 0) $$bindings.heading(heading);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.alwaysRender === void 0 && $$bindings.alwaysRender && alwaysRender !== void 0) $$bindings.alwaysRender(alwaysRender);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  containerAttrs = {
    "data-cmdk-group": "",
    role: "presentation",
    hidden: $render ? void 0 : true,
    "data-value": value
  };
  groupAttrs = {
    "data-cmdk-group-items": "",
    role: "group",
    "aria-labelledby": heading ? headingId : void 0
  };
  container = {
    action: containerAction,
    attrs: containerAttrs
  };
  group = { attrs: groupAttrs };
  $$unsubscribe_render();
  return `${asChild ? `${slots.default ? slots.default({
    container,
    group,
    heading: { attrs: headingAttrs }
  }) : ``}` : `<div${spread([escape_object(containerAttrs), escape_object($$restProps)], {})}>${heading ? `<div${spread([escape_object(headingAttrs)], {})}>${escape(heading)}</div>` : ``} <div${spread([escape_object(groupAttrs)], {})}>${slots.default ? slots.default({
    container,
    group,
    heading: { attrs: headingAttrs }
  }) : ``}</div></div>`}`;
});
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const CommandInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["autofocus", "value", "asChild", "el"]);
  let $selectedItemId, $$unsubscribe_selectedItemId;
  const { ids, commandEl } = getCtx();
  const state = getState();
  const search = derived(state, ($state) => $state.search);
  const valueStore = derived(state, ($state) => $state.value);
  let { autofocus = void 0 } = $$props;
  let { value = get_store_value(search) } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const selectedItemId = derived([valueStore, commandEl], ([$value, $commandEl]) => {
    if (!isBrowser) return void 0;
    const item = $commandEl?.querySelector(`${ITEM_SELECTOR}[${VALUE_ATTR}="${$value}"]`);
    return item?.getAttribute("id");
  });
  $$unsubscribe_selectedItemId = subscribe(selectedItemId, (value2) => $selectedItemId = value2);
  function handleValueUpdate(v) {
    state.updateState("search", v);
  }
  function action(node) {
    if (autofocus) {
      sleep(10).then(() => node.focus());
    }
    if (asChild) {
      const unsubEvents = addEventListener(node, "change", (e) => {
        const currTarget = e.currentTarget;
        state.updateState("search", currTarget.value);
      });
      return { destroy: unsubEvents };
    }
  }
  let attrs;
  if ($$props.autofocus === void 0 && $$bindings.autofocus && autofocus !== void 0) $$bindings.autofocus(autofocus);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    handleValueUpdate(value);
  }
  attrs = {
    type: "text",
    "data-cmdk-input": "",
    autocomplete: "off",
    autocorrect: "off",
    spellcheck: false,
    "aria-autocomplete": "list",
    role: "combobox",
    "aria-expanded": true,
    "aria-controls": ids.list,
    "aria-labelledby": ids.label,
    "aria-activedescendant": $selectedItemId ?? void 0,
    id: ids.input
  };
  $$unsubscribe_selectedItemId();
  return `${asChild ? `${slots.default ? slots.default({ action, attrs }) : ``}` : `<input${spread([escape_object(attrs), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}${add_attribute("value", value, 0)}>`}`;
});
const CommandItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let $$restProps = compute_rest_props($$props, ["disabled", "value", "onSelect", "alwaysRender", "asChild", "id"]);
  let $selected, $$unsubscribe_selected;
  let $render, $$unsubscribe_render;
  let { disabled = false } = $$props;
  let { value = "" } = $$props;
  let { onSelect = void 0 } = $$props;
  let { alwaysRender = false } = $$props;
  let { asChild = false } = $$props;
  let { id = generateId() } = $$props;
  const groupContext = getGroup();
  const context = getCtx();
  const state = getState();
  const trueAlwaysRender = alwaysRender ?? groupContext?.alwaysRender;
  const render = derived(state, ($state) => {
    if (trueAlwaysRender || context.filter() === false || !$state.search) return true;
    const currentScore = $state.filtered.items.get(id);
    if (isUndefined(currentScore)) return false;
    return currentScore > 0;
  });
  $$unsubscribe_render = subscribe(render, (value2) => $render = value2);
  let isFirstRender = true;
  const selected = derived(state, ($state) => $state.value === value);
  $$unsubscribe_selected = subscribe(selected, (value2) => $selected = value2);
  function action(node) {
    if (!value && node.textContent) {
      value = node.textContent.trim().toLowerCase();
    }
    context.value(id, value);
    node.setAttribute(VALUE_ATTR, value);
    const unsubEvents = executeCallbacks(
      addEventListener(node, "pointermove", () => {
        if (disabled) return;
        select();
      }),
      addEventListener(node, "click", () => {
        if (disabled) return;
        handleItemClick();
      })
    );
    return {
      destroy() {
        unsubEvents();
      }
    };
  }
  function handleItemClick() {
    select();
    onSelect?.(value);
  }
  function select() {
    state.updateState("value", value, true);
  }
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.onSelect === void 0 && $$bindings.onSelect && onSelect !== void 0) $$bindings.onSelect(onSelect);
  if ($$props.alwaysRender === void 0 && $$bindings.alwaysRender && alwaysRender !== void 0) $$bindings.alwaysRender(alwaysRender);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  attrs = {
    "aria-disabled": disabled ? true : void 0,
    "aria-selected": $selected ? true : void 0,
    "data-disabled": disabled ? true : void 0,
    "data-selected": $selected ? true : void 0,
    "data-cmdk-item": "",
    "data-value": value,
    role: "option",
    id
  };
  $$unsubscribe_selected();
  $$unsubscribe_render();
  return `${$render || isFirstRender ? `${asChild ? `${slots.default ? slots.default({ action, attrs }) : ``}` : `<div${spread([escape_object(attrs), escape_object($$restProps)], {})}>${slots.default ? slots.default({ action, attrs }) : ``}</div>`}` : ``}`;
});
const Command = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["value", "class"]);
  let { value = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Command$1, "CommandPrimitive.Root").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn("bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md", className)
        },
        $$restProps,
        { value }
      ),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Command_empty = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(CommandEmpty, "CommandPrimitive.Empty").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("py-6 text-center text-sm", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Command_group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(CommandGroup, "CommandPrimitive.Group").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-foreground [&_[data-cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:py-1.5 [&_[data-cmdk-group-heading]]:text-xs [&_[data-cmdk-group-heading]]:font-medium", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Command_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "class"]);
  let { asChild = false } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(CommandItem, "CommandPrimitive.Item").$$render(
    $$result,
    Object.assign(
      {},
      { asChild },
      {
        class: cn("aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ action, attrs }) => {
        return `${slots.default ? slots.default({ action, attrs }) : ``}`;
      }
    }
  )}`;
});
const Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "11", "cy": "11", "r": "8" }],
    ["path", { "d": "m21 21-4.3-4.3" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "search" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Command_input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value"]);
  let { class: className = void 0 } = $$props;
  let { value = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="flex items-center border-b px-2" data-cmdk-input-wrapper="">${validate_component(Search, "Search").$$render(
      $$result,
      {
        class: "mr-2 h-4 w-4 shrink-0 opacity-50"
      },
      {},
      {}
    )} ${validate_component(CommandInput, "CommandPrimitive.Input").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn("placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50", className)
        },
        $$restProps,
        { value }
      ),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const KeywordSelect = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { limitMessage = "" } = $$props;
  let { limitCount = void 0 } = $$props;
  let { allKeywords = [] } = $$props;
  let { values = [] } = $$props;
  let { onChange } = $$props;
  if ($$props.limitMessage === void 0 && $$bindings.limitMessage && limitMessage !== void 0) $$bindings.limitMessage(limitMessage);
  if ($$props.limitCount === void 0 && $$bindings.limitCount && limitCount !== void 0) $$bindings.limitCount(limitCount);
  if ($$props.allKeywords === void 0 && $$bindings.allKeywords && allKeywords !== void 0) $$bindings.allKeywords(allKeywords);
  if ($$props.values === void 0 && $$bindings.values && values !== void 0) $$bindings.values(values);
  if ($$props.onChange === void 0 && $$bindings.onChange && onChange !== void 0) $$bindings.onChange(onChange);
  return `${validate_component(Root, "Popover.Root").$$render($$result, {}, {}, {
    default: ({ ids }) => {
      return `${validate_component(Trigger, "Popover.Trigger").$$render(
        $$result,
        {
          class: cn(buttonVariants({ variant: "outline" }), "w-full h-fit flex flex-wrap justify-start gap-4", !values && "text-muted-foreground"),
          role: "combobox"
        },
        {},
        {
          default: () => {
            return `${values && values?.length > 0 ? (() => {
              let selectedKeywords = allKeywords.filter((keyword) => values?.find((fk) => fk.id === keyword.id));
              return ` ${each(selectedKeywords, (selectedKeyword) => {
                return `${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
                  default: () => {
                    return `${escape(selectedKeyword.name)} ${validate_component(Button, "Button").$$render(
                      $$result,
                      {
                        class: "h-fit w-fit p-0",
                        variant: "ghost"
                      },
                      {},
                      {
                        default: () => {
                          return `${validate_component(X, "XIcon").$$render($$result, { class: "ml-auto h-4 w-4" }, {}, {})}`;
                        }
                      }
                    )}`;
                  }
                })}`;
              })}`;
            })() : `<p class="text-slate-500" data-svelte-h="svelte-ew3q7r">키워드를 선택해주세요.</p>`} `;
          }
        }
      )} ${validate_component(Popover_content, "Popover.Content").$$render($$result, { class: "w-[95%] p-0" }, {}, {
        default: () => {
          return `${validate_component(Command, "Command.Root").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Command_input, "Command.Input").$$render(
                $$result,
                {
                  autofocus: true,
                  placeholder: "Search keywords...",
                  class: "h-9"
                },
                {},
                {}
              )} ${validate_component(Command_empty, "Command.Empty").$$render($$result, {}, {}, {
                default: () => {
                  return `No keyword found`;
                }
              })} ${validate_component(Command_group, "Command.Group").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Scroll_area, "ScrollArea").$$render($$result, { class: "h-[200px] w-full" }, {}, {
                    default: () => {
                      return `${each(allKeywords, (keyword) => {
                        let hasKeyword = !!values?.find((fk) => fk.id === keyword.id);
                        return ` ${validate_component(Command_item, "Command.Item").$$render(
                          $$result,
                          {
                            value: keyword.name,
                            onSelect: () => {
                              if (hasKeyword) {
                                onChange(values?.filter((fk) => fk.id !== keyword.id));
                                return;
                              }
                              if (limitCount && (values ?? [])?.length >= limitCount) {
                                toast.error(limitMessage);
                                return;
                              }
                              const newKeywords = values ?? [];
                              newKeywords.push(keyword);
                              onChange(newKeywords);
                            }
                          },
                          {},
                          {
                            default: () => {
                              return `<span${add_attribute("class", hasKeyword ? "text-slate-300" : "", 0)}>${escape(keyword.name)}</span> ${validate_component(Check, "Check").$$render(
                                $$result,
                                {
                                  class: cn("ml-auto h-4 w-4", !hasKeyword && "text-transparent")
                                },
                                {},
                                {}
                              )} `;
                            }
                          }
                        )}`;
                      })}`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});
export {
  Check as C,
  KeywordSelect as K,
  Scroll_area as S,
  Textarea as T
};
