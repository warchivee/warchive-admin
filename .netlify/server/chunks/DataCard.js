import { l as get_store_value, p as getContext, s as setContext, c as create_ssr_component, a as subscribe, h as compute_rest_props, i as spread, k as escape_object, b as add_attribute, g as escape, j as escape_attribute_value, v as validate_component, o as onDestroy, e as each, q as createEventDispatcher } from "./ssr.js";
import { a as isHTMLElement$1, i as isBrowser$1, w as withGet, l as getElementByMeltId, n as isElement, p as isHTMLLabelElement, o as omit$1, f as createElHelpers, q as dequal, r as isObject, t as stripValues, m as makeElement, u as disabledAttr, e as executeCallbacks, d as addMeltEventListener, k as kbd, v as isHTMLButtonElement, F as FIRST_LAST_KEYS, x as isElementDisabled, y as useEscapeKeydown, s as styleToString$1, g as effect$1, z as createHiddenInput, A as safeOnMount, C as isHTMLInputElement, D as noop$1, h as createBitAttrs, j as createDispatcher, c as cn, E as flyAndScale, I as Input$1, B as Button, b as buttonVariants } from "./input.js";
import { w as writable, d as derived, a as readonly, r as readable } from "./index2.js";
import { s as sleep$1, w as wrapArray, o as overridable$1, b as toWritableStores$1, g as generateIds, d as tick, l as last, f as back, h as forward, p as prev, n as next, j as getPortalDestination, k as generateId$1, m as removeScroll, q as toggle, v as nanoid, r as removeUndefined$1, e as getOptionUpdater$1, x as scale, I as Icon, y as toast } from "./Toaster.svelte_svelte_type_style_lang.js";
import { d as derivedVisible, u as usePopper, g as getPositioningUpdater, D as Dialog_description } from "./index3.js";
import { c as createLabel, L as Label } from "./label.js";
import "clsx";
import { B as Badge, b as badgeVariants } from "./index4.js";
import { e as Dialog, f as Dialog_content, g as Dialog_overlay, h as Dialog_close, i as Dialog_trigger, j as Dialog_portal, k as Dialog_title, X, P as Plus, R as Root$2, D as Dialog_content$1, a as Dialog_header, b as Dialog_title$1, c as Dialog_footer, T as Trigger$2, d as axiosInstance } from "./axios.js";
import { C as Check, S as Scroll_area, K as KeywordSelect, T as Textarea } from "./KeywordSelect.js";
import { S as Switch } from "./switch.js";
import cloneDeep from "lodash/cloneDeep.js";
import { c as categories } from "./categories.store.js";
import { k as keywords, c as cautions } from "./cautions.store.js";
function addHighlight(element) {
  element.setAttribute("data-highlighted", "");
}
function removeHighlight(element) {
  element.removeAttribute("data-highlighted");
}
function getOptions(el) {
  return Array.from(el.querySelectorAll('[role="option"]:not([data-disabled])')).filter((el2) => isHTMLElement$1(el2));
}
function debounce(fn, wait = 500) {
  let timeout = null;
  return function(...args) {
    const later = () => {
      timeout = null;
      fn(...args);
    };
    timeout && clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function handleRovingFocus(nextElement) {
  if (!isBrowser$1)
    return;
  sleep$1(1).then(() => {
    const currentFocusedElement = document.activeElement;
    if (!isHTMLElement$1(currentFocusedElement) || currentFocusedElement === nextElement)
      return;
    currentFocusedElement.tabIndex = -1;
    if (nextElement) {
      nextElement.tabIndex = 0;
      nextElement.focus();
    }
  });
}
const ignoredKeys = /* @__PURE__ */ new Set(["Shift", "Control", "Alt", "Meta", "CapsLock", "NumLock"]);
const defaults$1 = {
  onMatch: handleRovingFocus,
  getCurrentItem: () => document.activeElement
};
function createTypeaheadSearch(args = {}) {
  const withDefaults = { ...defaults$1, ...args };
  const typed = withGet(writable([]));
  const resetTyped = debounce(() => {
    typed.update(() => []);
  });
  const handleTypeaheadSearch = (key, items) => {
    if (ignoredKeys.has(key))
      return;
    const currentItem = withDefaults.getCurrentItem();
    const $typed = get_store_value(typed);
    if (!Array.isArray($typed)) {
      return;
    }
    $typed.push(key.toLowerCase());
    typed.set($typed);
    const candidateItems = items.filter((item) => {
      if (item.getAttribute("disabled") === "true" || item.getAttribute("aria-disabled") === "true" || item.hasAttribute("data-disabled")) {
        return false;
      }
      return true;
    });
    const isRepeated = $typed.length > 1 && $typed.every((char) => char === $typed[0]);
    const normalizeSearch = isRepeated ? $typed[0] : $typed.join("");
    const currentItemIndex = isHTMLElement$1(currentItem) ? candidateItems.indexOf(currentItem) : -1;
    let wrappedItems = wrapArray(candidateItems, Math.max(currentItemIndex, 0));
    const excludeCurrentItem = normalizeSearch.length === 1;
    if (excludeCurrentItem) {
      wrappedItems = wrappedItems.filter((v) => v !== currentItem);
    }
    const nextItem = wrappedItems.find((item) => item?.innerText && item.innerText.toLowerCase().startsWith(normalizeSearch.toLowerCase()));
    if (isHTMLElement$1(nextItem) && nextItem !== currentItem) {
      withDefaults.onMatch(nextItem);
    }
    resetTyped();
  };
  return {
    typed,
    resetTyped,
    handleTypeaheadSearch
  };
}
function createClickOutsideIgnore(meltId) {
  return (e) => {
    const target = e.target;
    const triggerEl = getElementByMeltId(meltId);
    if (!triggerEl || !isElement(target))
      return false;
    const id = triggerEl.id;
    if (isHTMLLabelElement(target) && id === target.htmlFor) {
      return true;
    }
    if (target.closest(`label[for="${id}"]`)) {
      return true;
    }
    return false;
  };
}
const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];
const defaults = {
  positioning: {
    placement: "bottom",
    sameWidth: true
  },
  scrollAlignment: "nearest",
  loop: true,
  defaultOpen: false,
  closeOnOutsideClick: true,
  preventScroll: true,
  closeOnEscape: true,
  forceVisible: false,
  portal: void 0,
  builder: "listbox",
  disabled: false,
  required: false,
  name: void 0,
  typeahead: true,
  highlightOnHover: true,
  onOutsideClick: void 0
};
const listboxIdParts = ["trigger", "menu", "label"];
function createListbox(props) {
  const withDefaults = { ...defaults, ...props };
  const activeTrigger = withGet(writable(null));
  const highlightedItem = withGet(writable(null));
  const selectedWritable = withDefaults.selected ?? writable(withDefaults.defaultSelected);
  const selected = overridable$1(selectedWritable, withDefaults?.onSelectedChange);
  const highlighted = derived(highlightedItem, ($highlightedItem) => $highlightedItem ? getOptionProps($highlightedItem) : void 0);
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable$1(openWritable, withDefaults?.onOpenChange);
  const options = toWritableStores$1({
    ...omit$1(withDefaults, "open", "defaultOpen", "builder", "ids"),
    multiple: withDefaults.multiple ?? false
  });
  const { scrollAlignment, loop, closeOnOutsideClick, closeOnEscape, preventScroll: preventScroll2, portal, forceVisible, positioning, multiple, arrowSize, disabled, required, typeahead, name: nameProp, highlightOnHover, onOutsideClick } = options;
  const { name, selector } = createElHelpers(withDefaults.builder);
  const ids = toWritableStores$1({ ...generateIds(listboxIdParts), ...withDefaults.ids });
  const { handleTypeaheadSearch } = createTypeaheadSearch({
    onMatch: (element) => {
      highlightedItem.set(element);
      element.scrollIntoView({ block: scrollAlignment.get() });
    },
    getCurrentItem() {
      return highlightedItem.get();
    }
  });
  function getOptionProps(el) {
    const value = el.getAttribute("data-value");
    const label2 = el.getAttribute("data-label");
    const disabled2 = el.hasAttribute("data-disabled");
    return {
      value: value ? JSON.parse(value) : value,
      label: label2 ?? el.textContent ?? void 0,
      disabled: disabled2 ? true : false
    };
  }
  const setOption = (newOption) => {
    selected.update(($option) => {
      const $multiple = multiple.get();
      if ($multiple) {
        const optionArr = Array.isArray($option) ? [...$option] : [];
        return toggle(newOption, optionArr, (itemA, itemB) => dequal(itemA.value, itemB.value));
      }
      return newOption;
    });
  };
  function selectItem(item) {
    const props2 = getOptionProps(item);
    setOption(props2);
  }
  async function openMenu() {
    open.set(true);
    const triggerEl = document.getElementById(ids.trigger.get());
    if (!triggerEl)
      return;
    if (triggerEl !== activeTrigger.get())
      activeTrigger.set(triggerEl);
    await tick();
    const menuElement = document.getElementById(ids.menu.get());
    if (!isHTMLElement$1(menuElement))
      return;
    const selectedItem = menuElement.querySelector("[aria-selected=true]");
    if (!isHTMLElement$1(selectedItem))
      return;
    highlightedItem.set(selectedItem);
  }
  function closeMenu() {
    open.set(false);
    highlightedItem.set(null);
  }
  const isVisible = derivedVisible({ open, forceVisible, activeTrigger });
  const isSelected = derived([selected], ([$selected]) => {
    return (value) => {
      if (Array.isArray($selected)) {
        return $selected.some((o) => dequal(o.value, value));
      }
      if (isObject(value)) {
        return dequal($selected?.value, stripValues(value, void 0));
      }
      return dequal($selected?.value, value);
    };
  });
  const isHighlighted = derived([highlighted], ([$value]) => {
    return (item) => {
      return dequal($value?.value, item);
    };
  });
  const trigger = makeElement(name("trigger"), {
    stores: [open, highlightedItem, disabled, ids.menu, ids.trigger, ids.label],
    returned: ([$open, $highlightedItem, $disabled, $menuId, $triggerId, $labelId]) => {
      return {
        "aria-activedescendant": $highlightedItem?.id,
        "aria-autocomplete": "list",
        "aria-controls": $menuId,
        "aria-expanded": $open,
        "aria-labelledby": $labelId,
        // autocomplete: 'off',
        id: $triggerId,
        role: "combobox",
        disabled: disabledAttr($disabled),
        type: withDefaults.builder === "select" ? "button" : void 0
      };
    },
    action: (node) => {
      const isInput2 = isHTMLInputElement(node);
      const unsubscribe = executeCallbacks(
        addMeltEventListener(node, "click", () => {
          node.focus();
          const $open = open.get();
          if ($open) {
            closeMenu();
          } else {
            openMenu();
          }
        }),
        // Handle all input key events including typing, meta, and navigation.
        addMeltEventListener(node, "keydown", (e) => {
          const $open = open.get();
          if (!$open) {
            if (INTERACTION_KEYS.includes(e.key)) {
              return;
            }
            if (e.key === kbd.TAB) {
              return;
            }
            if (e.key === kbd.BACKSPACE && isInput2 && node.value === "") {
              return;
            }
            if (e.key === kbd.SPACE && isHTMLButtonElement(node)) {
              return;
            }
            openMenu();
            tick().then(() => {
              const $selectedItem = selected.get();
              if ($selectedItem)
                return;
              const menuEl = document.getElementById(ids.menu.get());
              if (!isHTMLElement$1(menuEl))
                return;
              const enabledItems = Array.from(menuEl.querySelectorAll(`${selector("item")}:not([data-disabled]):not([data-hidden])`)).filter((item) => isHTMLElement$1(item));
              if (!enabledItems.length)
                return;
              if (e.key === kbd.ARROW_DOWN) {
                highlightedItem.set(enabledItems[0]);
                enabledItems[0].scrollIntoView({ block: scrollAlignment.get() });
              } else if (e.key === kbd.ARROW_UP) {
                highlightedItem.set(last(enabledItems));
                last(enabledItems).scrollIntoView({ block: scrollAlignment.get() });
              }
            });
          }
          if (e.key === kbd.TAB) {
            closeMenu();
            return;
          }
          if (e.key === kbd.ENTER && !e.isComposing || e.key === kbd.SPACE && isHTMLButtonElement(node)) {
            e.preventDefault();
            const $highlightedItem = highlightedItem.get();
            if ($highlightedItem) {
              selectItem($highlightedItem);
            }
            if (!multiple.get()) {
              closeMenu();
            }
          }
          if (e.key === kbd.ARROW_UP && e.altKey) {
            closeMenu();
          }
          if (FIRST_LAST_KEYS.includes(e.key)) {
            e.preventDefault();
            const menuElement = document.getElementById(ids.menu.get());
            if (!isHTMLElement$1(menuElement))
              return;
            const itemElements = getOptions(menuElement);
            if (!itemElements.length)
              return;
            const candidateNodes = itemElements.filter((opt) => !isElementDisabled(opt) && opt.dataset.hidden === void 0);
            const $currentItem = highlightedItem.get();
            const currentIndex = $currentItem ? candidateNodes.indexOf($currentItem) : -1;
            const $loop = loop.get();
            const $scrollAlignment = scrollAlignment.get();
            let nextItem;
            switch (e.key) {
              case kbd.ARROW_DOWN:
                nextItem = next(candidateNodes, currentIndex, $loop);
                break;
              case kbd.ARROW_UP:
                nextItem = prev(candidateNodes, currentIndex, $loop);
                break;
              case kbd.PAGE_DOWN:
                nextItem = forward(candidateNodes, currentIndex, 10, $loop);
                break;
              case kbd.PAGE_UP:
                nextItem = back(candidateNodes, currentIndex, 10, $loop);
                break;
              case kbd.HOME:
                nextItem = candidateNodes[0];
                break;
              case kbd.END:
                nextItem = last(candidateNodes);
                break;
              default:
                return;
            }
            highlightedItem.set(nextItem);
            nextItem?.scrollIntoView({ block: $scrollAlignment });
          } else if (typeahead.get()) {
            const menuEl = document.getElementById(ids.menu.get());
            if (!isHTMLElement$1(menuEl))
              return;
            handleTypeaheadSearch(e.key, getOptions(menuEl));
          }
        })
      );
      let unsubEscapeKeydown = noop$1;
      const escape2 = useEscapeKeydown(node, {
        handler: closeMenu,
        enabled: derived([open, closeOnEscape], ([$open, $closeOnEscape]) => {
          return $open && $closeOnEscape;
        })
      });
      if (escape2 && escape2.destroy) {
        unsubEscapeKeydown = escape2.destroy;
      }
      return {
        destroy() {
          unsubscribe();
          unsubEscapeKeydown();
        }
      };
    }
  });
  const menu = makeElement(name("menu"), {
    stores: [isVisible, ids.menu],
    returned: ([$isVisible, $menuId]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        id: $menuId,
        role: "listbox",
        style: styleToString$1({ display: $isVisible ? void 0 : "none" })
      };
    },
    action: (node) => {
      let unsubPopper = noop$1;
      const unsubscribe = executeCallbacks(
        // Bind the popper portal to the input element.
        effect$1([isVisible, portal, closeOnOutsideClick, positioning, activeTrigger], ([$isVisible, $portal, $closeOnOutsideClick, $positioning, $activeTrigger]) => {
          unsubPopper();
          if (!$isVisible || !$activeTrigger)
            return;
          tick().then(() => {
            unsubPopper();
            const ignoreHandler = createClickOutsideIgnore(ids.trigger.get());
            unsubPopper = usePopper(node, {
              anchorElement: $activeTrigger,
              open,
              options: {
                floating: $positioning,
                focusTrap: null,
                modal: {
                  closeOnInteractOutside: $closeOnOutsideClick,
                  onClose: closeMenu,
                  open: $isVisible,
                  shouldCloseOnInteractOutside: (e) => {
                    onOutsideClick.get()?.(e);
                    if (e.defaultPrevented)
                      return false;
                    const target = e.target;
                    if (!isElement(target))
                      return false;
                    if (target === $activeTrigger || $activeTrigger.contains(target)) {
                      return false;
                    }
                    if (ignoreHandler(e))
                      return false;
                    return true;
                  }
                },
                escapeKeydown: null,
                portal: getPortalDestination(node, $portal)
              }
            }).destroy;
          });
        })
      );
      return {
        destroy: () => {
          unsubscribe();
          unsubPopper();
        }
      };
    }
  });
  const { elements: { root: labelBuilder } } = createLabel();
  const { action: labelAction } = get_store_value(labelBuilder);
  const label = makeElement(name("label"), {
    stores: [ids.label, ids.trigger],
    returned: ([$labelId, $triggerId]) => {
      return {
        id: $labelId,
        for: $triggerId
      };
    },
    action: labelAction
  });
  const option = makeElement(name("option"), {
    stores: [isSelected],
    returned: ([$isSelected]) => (props2) => {
      const selected2 = $isSelected(props2.value);
      return {
        "data-value": JSON.stringify(props2.value),
        "data-label": props2.label,
        "data-disabled": disabledAttr(props2.disabled),
        "aria-disabled": props2.disabled ? true : void 0,
        "aria-selected": selected2,
        "data-selected": selected2 ? "" : void 0,
        id: generateId$1(),
        role: "option"
      };
    },
    action: (node) => {
      const unsubscribe = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        if (isElementDisabled(node)) {
          e.preventDefault();
          return;
        }
        selectItem(node);
        if (!multiple.get()) {
          closeMenu();
        }
      }), effect$1(highlightOnHover, ($highlightOnHover) => {
        if (!$highlightOnHover)
          return;
        const unsub = executeCallbacks(addMeltEventListener(node, "mouseover", () => {
          highlightedItem.set(node);
        }), addMeltEventListener(node, "mouseleave", () => {
          highlightedItem.set(null);
        }));
        return unsub;
      }));
      return { destroy: unsubscribe };
    }
  });
  const group = makeElement(name("group"), {
    returned: () => {
      return (groupId) => ({
        role: "group",
        "aria-labelledby": groupId
      });
    }
  });
  const groupLabel = makeElement(name("group-label"), {
    returned: () => {
      return (groupId) => ({
        id: groupId
      });
    }
  });
  const hiddenInput = createHiddenInput({
    value: derived([selected], ([$selected]) => {
      const value = Array.isArray($selected) ? $selected.map((o) => o.value) : $selected?.value;
      return typeof value === "string" ? value : JSON.stringify(value);
    }),
    name: readonly(nameProp),
    required,
    prefix: withDefaults.builder
  });
  const arrow = makeElement(name("arrow"), {
    stores: arrowSize,
    returned: ($arrowSize) => ({
      "data-arrow": true,
      style: styleToString$1({
        position: "absolute",
        width: `var(--arrow-size, ${$arrowSize}px)`,
        height: `var(--arrow-size, ${$arrowSize}px)`
      })
    })
  });
  safeOnMount(() => {
    if (!isBrowser$1)
      return;
    const menuEl = document.getElementById(ids.menu.get());
    const triggerEl = document.getElementById(ids.trigger.get());
    if (triggerEl) {
      activeTrigger.set(triggerEl);
    }
    if (!menuEl)
      return;
    const selectedEl = menuEl.querySelector("[data-selected]");
    if (!isHTMLElement$1(selectedEl))
      return;
  });
  effect$1([highlightedItem], ([$highlightedItem]) => {
    if (!isBrowser$1)
      return;
    const menuElement = document.getElementById(ids.menu.get());
    if (!isHTMLElement$1(menuElement))
      return;
    getOptions(menuElement).forEach((node) => {
      if (node === $highlightedItem) {
        addHighlight(node);
      } else {
        removeHighlight(node);
      }
    });
  });
  effect$1([open], ([$open]) => {
    if (!isBrowser$1)
      return;
    let unsubScroll = noop$1;
    if (preventScroll2.get() && $open) {
      unsubScroll = removeScroll();
    }
    return () => {
      unsubScroll();
    };
  });
  return {
    ids,
    elements: {
      trigger,
      group,
      option,
      menu,
      groupLabel,
      label,
      hiddenInput,
      arrow
    },
    states: {
      open,
      selected,
      highlighted,
      highlightedItem
    },
    helpers: {
      isSelected,
      isHighlighted,
      closeMenu
    },
    options
  };
}
function createSelect(props) {
  const listbox = createListbox({ ...props, builder: "select" });
  const selectedLabel = derived(listbox.states.selected, ($selected) => {
    if (Array.isArray($selected)) {
      return $selected.map((o) => o.label).join(", ");
    }
    return $selected?.label ?? "";
  });
  return {
    ...listbox,
    elements: {
      ...listbox.elements
    },
    states: {
      ...listbox.states,
      selectedLabel
    }
  };
}
function generateId() {
  return nanoid(10);
}
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
}
function getSelectData() {
  const NAME = "select";
  const GROUP_NAME = "select-group";
  const ITEM_NAME = "select-item";
  const PARTS = [
    "arrow",
    "content",
    "group",
    "item",
    "indicator",
    "input",
    "label",
    "trigger",
    "value"
  ];
  return {
    NAME,
    GROUP_NAME,
    ITEM_NAME,
    PARTS
  };
}
function getCtx$1() {
  const { NAME } = getSelectData();
  return getContext(NAME);
}
function setCtx$1(props) {
  const { NAME, PARTS } = getSelectData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const select = {
    ...createSelect({ ...removeUndefined$1(props), forceVisible: true }),
    getAttrs
  };
  setContext(NAME, select);
  return {
    ...select,
    updateOption: getOptionUpdater$1(select.options)
  };
}
function setGroupCtx() {
  const { GROUP_NAME } = getSelectData();
  const id = generateId();
  setContext(GROUP_NAME, id);
  const { elements: { group }, getAttrs } = getCtx$1();
  return { group, id, getAttrs };
}
function setItemCtx(value) {
  const { ITEM_NAME } = getSelectData();
  const select = getCtx$1();
  setContext(ITEM_NAME, value);
  return select;
}
function getGroupLabel() {
  const { GROUP_NAME } = getSelectData();
  const id = getContext(GROUP_NAME);
  const { elements: { groupLabel }, getAttrs } = getCtx$1();
  return { groupLabel, id, getAttrs };
}
function getItemIndicator() {
  const { ITEM_NAME } = getSelectData();
  const { helpers: { isSelected }, getAttrs } = getCtx$1();
  const value = getContext(ITEM_NAME);
  return {
    value,
    isSelected,
    getAttrs
  };
}
function updatePositioning(props) {
  const defaultPlacement = {
    side: "bottom",
    align: "center",
    sameWidth: true
  };
  const withDefaults = { ...defaultPlacement, ...props };
  const { options: { positioning } } = getCtx$1();
  const updater = getPositioningUpdater(positioning);
  updater(withDefaults);
}
const Select = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $idValues, $$unsubscribe_idValues;
  let { required = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { preventScroll: preventScroll2 = void 0 } = $$props;
  let { loop = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { name = void 0 } = $$props;
  let { multiple = false } = $$props;
  let { selected = void 0 } = $$props;
  let { onSelectedChange = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { items = [] } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  let { typeahead = void 0 } = $$props;
  const { states: { open: localOpen, selected: localSelected }, updateOption, ids } = setCtx$1({
    required,
    disabled,
    preventScroll: preventScroll2,
    loop,
    closeOnEscape,
    closeOnOutsideClick,
    portal,
    name,
    onOutsideClick,
    multiple,
    forceVisible: true,
    defaultSelected: Array.isArray(selected) ? [...selected] : selected,
    defaultOpen: open,
    onSelectedChange: ({ next: next2 }) => {
      if (Array.isArray(next2)) {
        if (!Array.isArray(selected) || !arraysAreEqual(selected, next2)) {
          onSelectedChange?.(next2);
          selected = next2;
          return next2;
        }
        return next2;
      }
      if (selected !== next2) {
        onSelectedChange?.(next2);
        selected = next2;
      }
      return next2;
    },
    onOpenChange: ({ next: next2 }) => {
      if (open !== next2) {
        onOpenChange?.(next2);
        open = next2;
      }
      return next2;
    },
    items,
    typeahead
  });
  const idValues = derived([ids.menu, ids.trigger, ids.label], ([$menuId, $triggerId, $labelId]) => ({
    menu: $menuId,
    trigger: $triggerId,
    label: $labelId
  }));
  $$unsubscribe_idValues = subscribe(idValues, (value) => $idValues = value);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0) $$bindings.required(required);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll2 !== void 0) $$bindings.preventScroll(preventScroll2);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0) $$bindings.loop(loop);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0) $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0) $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0) $$bindings.portal(portal);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0) $$bindings.multiple(multiple);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0) $$bindings.selected(selected);
  if ($$props.onSelectedChange === void 0 && $$bindings.onSelectedChange && onSelectedChange !== void 0) $$bindings.onSelectedChange(onSelectedChange);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0) $$bindings.onOpenChange(onOpenChange);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0) $$bindings.items(items);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0) $$bindings.onOutsideClick(onOutsideClick);
  if ($$props.typeahead === void 0 && $$bindings.typeahead && typeahead !== void 0) $$bindings.typeahead(typeahead);
  open !== void 0 && localOpen.set(open);
  selected !== void 0 && localSelected.set(Array.isArray(selected) ? [...selected] : selected);
  {
    updateOption("required", required);
  }
  {
    updateOption("disabled", disabled);
  }
  {
    updateOption("preventScroll", preventScroll2);
  }
  {
    updateOption("loop", loop);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("portal", portal);
  }
  {
    updateOption("name", name);
  }
  {
    updateOption("multiple", multiple);
  }
  {
    updateOption("onOutsideClick", onOutsideClick);
  }
  {
    updateOption("typeahead", typeahead);
  }
  $$unsubscribe_idValues();
  return `${slots.default ? slots.default({ ids: $idValues }) : ``}`;
});
const Select_content$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "side",
    "align",
    "sideOffset",
    "alignOffset",
    "collisionPadding",
    "avoidCollisions",
    "collisionBoundary",
    "sameWidth",
    "fitViewport",
    "strategy",
    "overlap",
    "el"
  ]);
  let $open, $$unsubscribe_open;
  let $menu, $$unsubscribe_menu;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { side = "bottom" } = $$props;
  let { align = "center" } = $$props;
  let { sideOffset = 0 } = $$props;
  let { alignOffset = 0 } = $$props;
  let { collisionPadding = 8 } = $$props;
  let { avoidCollisions = true } = $$props;
  let { collisionBoundary = void 0 } = $$props;
  let { sameWidth = true } = $$props;
  let { fitViewport = false } = $$props;
  let { strategy = "absolute" } = $$props;
  let { overlap = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { menu }, states: { open }, ids, getAttrs } = getCtx$1();
  $$unsubscribe_menu = subscribe(menu, (value) => $menu = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  createDispatcher();
  const attrs = getAttrs("content");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0) $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0) $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0) $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0) $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0) $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0) $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0) $$bindings.side(side);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0) $$bindings.align(align);
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0) $$bindings.sideOffset(sideOffset);
  if ($$props.alignOffset === void 0 && $$bindings.alignOffset && alignOffset !== void 0) $$bindings.alignOffset(alignOffset);
  if ($$props.collisionPadding === void 0 && $$bindings.collisionPadding && collisionPadding !== void 0) $$bindings.collisionPadding(collisionPadding);
  if ($$props.avoidCollisions === void 0 && $$bindings.avoidCollisions && avoidCollisions !== void 0) $$bindings.avoidCollisions(avoidCollisions);
  if ($$props.collisionBoundary === void 0 && $$bindings.collisionBoundary && collisionBoundary !== void 0) $$bindings.collisionBoundary(collisionBoundary);
  if ($$props.sameWidth === void 0 && $$bindings.sameWidth && sameWidth !== void 0) $$bindings.sameWidth(sameWidth);
  if ($$props.fitViewport === void 0 && $$bindings.fitViewport && fitViewport !== void 0) $$bindings.fitViewport(fitViewport);
  if ($$props.strategy === void 0 && $$bindings.strategy && strategy !== void 0) $$bindings.strategy(strategy);
  if ($$props.overlap === void 0 && $$bindings.overlap && overlap !== void 0) $$bindings.overlap(overlap);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.menu.set(id);
    }
  }
  builder = $menu;
  {
    Object.assign(builder, attrs);
  }
  {
    if ($open) {
      updatePositioning({
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        avoidCollisions,
        collisionBoundary,
        sameWidth,
        fitViewport,
        strategy,
        overlap
      });
    }
  }
  $$unsubscribe_open();
  $$unsubscribe_menu();
  return ` ${asChild && $open ? `${slots.default ? slots.default({ builder }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Select_group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $group, $$unsubscribe_group;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { group, id, getAttrs } = setGroupCtx();
  $$unsubscribe_group = subscribe(group, (value) => $group = value);
  const attrs = getAttrs("group");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $group(id);
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_group();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Select_input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $hiddenInput, $$unsubscribe_hiddenInput;
  let $disabled, $$unsubscribe_disabled;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { hiddenInput }, options: { disabled }, getAttrs } = getCtx$1();
  $$unsubscribe_hiddenInput = subscribe(hiddenInput, (value) => $hiddenInput = value);
  $$unsubscribe_disabled = subscribe(disabled, (value) => $disabled = value);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = {
    ...getAttrs("input"),
    disabled: $disabled ? true : void 0
  };
  builder = $hiddenInput;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_hiddenInput();
  $$unsubscribe_disabled();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<input${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>`}`;
});
const Select_item$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let isSelected;
  let $$restProps = compute_rest_props($$props, ["value", "disabled", "label", "asChild", "el"]);
  let $isSelectedStore, $$unsubscribe_isSelectedStore;
  let $item, $$unsubscribe_item;
  let { value } = $$props;
  let { disabled = void 0 } = $$props;
  let { label = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { option: item }, helpers: { isSelected: isSelectedStore }, getAttrs } = setItemCtx(value);
  $$unsubscribe_item = subscribe(item, (value2) => $item = value2);
  $$unsubscribe_isSelectedStore = subscribe(isSelectedStore, (value2) => $isSelectedStore = value2);
  createDispatcher();
  const attrs = getAttrs("item");
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $item({ value, disabled, label });
  {
    Object.assign(builder, attrs);
  }
  isSelected = $isSelectedStore(value);
  $$unsubscribe_isSelectedStore();
  $$unsubscribe_item();
  return ` ${asChild ? `${slots.default ? slots.default({ builder, isSelected }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, isSelected }) : ` ${escape(label || value)} `}</div>`}`;
});
const Select_item_indicator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $isSelected, $$unsubscribe_isSelected;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { isSelected, value, getAttrs } = getItemIndicator();
  $$unsubscribe_isSelected = subscribe(isSelected, (value2) => $isSelected = value2);
  const attrs = getAttrs("indicator");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  $$unsubscribe_isSelected();
  return `${asChild ? `${slots.default ? slots.default({ attrs, isSelected: $isSelected(value) }) : ``}` : `<div${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${$isSelected(value) ? `${slots.default ? slots.default({ attrs, isSelected: $isSelected(value) }) : ``}` : ``}</div>`}`;
});
const Select_label$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "id", "el"]);
  let $groupLabel, $$unsubscribe_groupLabel;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { ids, getAttrs } = getCtx$1();
  const { groupLabel, id: groupId } = getGroupLabel();
  $$unsubscribe_groupLabel = subscribe(groupLabel, (value) => $groupLabel = value);
  const attrs = getAttrs("label");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.label.set(id);
    }
  }
  builder = $groupLabel(groupId);
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_groupLabel();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Select_trigger$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "id", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, ids, getAttrs } = getCtx$1();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  const attrs = getAttrs("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.trigger.set(id);
    }
  }
  builder = $trigger;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Select_value = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let label;
  let $$restProps = compute_rest_props($$props, ["placeholder", "asChild", "el"]);
  let $selectedLabel, $$unsubscribe_selectedLabel;
  let { placeholder = "" } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { states: { selectedLabel }, getAttrs } = getCtx$1();
  $$unsubscribe_selectedLabel = subscribe(selectedLabel, (value) => $selectedLabel = value);
  const attrs = getAttrs("value");
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  label = $selectedLabel;
  $$unsubscribe_selectedLabel();
  return `${asChild ? `${slots.default ? slots.default({ label, attrs }) : ``}` : `<span${spread(
    [
      escape_object($$restProps),
      escape_object(attrs),
      {
        "data-placeholder": escape_attribute_value(!label ? "" : void 0)
      }
    ],
    {}
  )}${add_attribute("this", el, 0)}>${escape(label || placeholder)}</span>`}`;
});
const Select_label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Select_label$1, "SelectPrimitive.Label").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)
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
const Select_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value", "label", "disabled"]);
  let { class: className = void 0 } = $$props;
  let { value } = $$props;
  let { label = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  return `${validate_component(Select_item$1, "SelectPrimitive.Item").$$render(
    $$result,
    Object.assign(
      {},
      { value },
      { disabled },
      { label },
      {
        class: cn("data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">${validate_component(Select_item_indicator, "SelectPrimitive.ItemIndicator").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Check, "Check").$$render($$result, { class: "h-4 w-4" }, {}, {})}`;
          }
        })}</span> ${slots.default ? slots.default({}) : ` ${escape(label || value)} `}`;
      }
    }
  )}`;
});
const Select_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "sideOffset",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "class"
  ]);
  let { sideOffset = 4 } = $$props;
  let { inTransition = flyAndScale } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = scale } = $$props;
  let { outTransitionConfig = { start: 0.95, opacity: 0, duration: 50 } } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0) $$bindings.sideOffset(sideOffset);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0) $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0) $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0) $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0) $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Select_content$1, "SelectPrimitive.Content").$$render(
    $$result,
    Object.assign(
      {},
      { inTransition },
      { inTransitionConfig },
      { outTransition },
      { outTransitionConfig },
      { sideOffset },
      {
        class: cn("bg-popover text-popover-foreground relative z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md outline-none", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<div class="w-full p-1">${slots.default ? slots.default({}) : ``}</div>`;
      }
    }
  )}`;
});
const Chevron_down = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "chevron-down" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Select_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Select_trigger$1, "SelectPrimitive.Trigger").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("border-input bg-background ring-offset-background focus-visible:ring-ring aria-[invalid]:border-destructive data-[placeholder]:[&>span]:text-muted-foreground flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ builder }) => {
        return `${slots.default ? slots.default({ builder }) : ``} <div>${validate_component(Chevron_down, "ChevronDown").$$render($$result, { class: "h-4 w-4 opacity-50" }, {}, {})}</div>`;
      }
    }
  )}`;
});
const Root$1 = Select;
const Group = Select_group;
const Input = Select_input;
const Value = Select_value;
function getOptionUpdater(options) {
  return function(key, value) {
    if (value === void 0)
      return;
    const store = options[key];
    if (store) {
      store.set(value);
    }
  };
}
const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1]
};
const VELOCITY_THRESHOLD = 0.4;
function effect(stores, fn) {
  if (typeof document === "undefined") {
    return () => {
    };
  }
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
  safeOnDestroy(unsub);
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
  safeOnDestroy(unsubscribe);
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
const safeOnDestroy = (fn) => {
  try {
    onDestroy(fn);
  } catch {
    return fn();
  }
};
const overridable = (store, onChange) => {
  const update = (updater, sideEffect) => {
    store.update((curr) => {
      const next2 = updater(curr);
      let res = next2;
      if (onChange) {
        res = onChange({ curr, next: next2 });
      }
      sideEffect?.(res);
      return res;
    });
  };
  const set2 = (curr) => {
    update(() => curr);
  };
  return {
    ...store,
    update,
    set: set2
  };
};
function toWritableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    result[propertyKey] = writable(value);
  });
  return result;
}
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
const cache = /* @__PURE__ */ new WeakMap();
function set(el, styles, ignoreCache = false) {
  if (!el || !(el instanceof HTMLElement) || !styles)
    return;
  const originalStyles = {};
  Object.entries(styles).forEach(([key, value]) => {
    if (key.startsWith("--")) {
      el.style.setProperty(key, value);
      return;
    }
    originalStyles[key] = el.style[key];
    el.style[key] = value;
  });
  if (ignoreCache)
    return;
  cache.set(el, originalStyles);
}
function reset(el, prop) {
  if (!el || !(el instanceof HTMLElement))
    return;
  const originalStyles = cache.get(el);
  if (!originalStyles) {
    return;
  }
  if (prop) {
    el.style[prop] = originalStyles[prop];
  } else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      el.style[key] = value;
    });
  }
}
function getTranslate(element, direction) {
  const style = window.getComputedStyle(element);
  const transform = (
    // @ts-expect-error - vendor prefix
    style.transform || style.webkitTransform || style.mozTransform
  );
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    return parseFloat(mat[1].split(", ")[isVertical(direction) ? 13 : 12]);
  }
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(", ")[isVertical(direction) ? 5 : 4]) : null;
}
function styleToString(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
function noop() {
}
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
const nonTextInputTypes = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
const isBrowser = typeof document !== "undefined";
function isInput(target) {
  return target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type) || target instanceof HTMLTextAreaElement || target instanceof HTMLElement && target.isContentEditable;
}
function isVertical(direction) {
  if (direction === "top" || direction === "bottom")
    return true;
  return false;
}
function isBottomOrRight(direction) {
  if (direction === "bottom" || direction === "right")
    return true;
  return false;
}
function chain(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function handleSnapPoints({ activeSnapPoint, snapPoints, drawerRef, overlayRef, fadeFromIndex, openTime, direction }) {
  const isLastSnapPoint = derived([snapPoints, activeSnapPoint], ([$snapPoints, $activeSnapPoint]) => {
    return $activeSnapPoint === $snapPoints?.[$snapPoints.length - 1];
  });
  const shouldFade = derived([snapPoints, fadeFromIndex, activeSnapPoint], ([$snapPoints, $fadeFromIndex, $activeSnapPoint]) => {
    return $snapPoints && $snapPoints.length > 0 && ($fadeFromIndex || $fadeFromIndex === 0) && !Number.isNaN($fadeFromIndex) && $snapPoints[$fadeFromIndex] === $activeSnapPoint || !$snapPoints;
  });
  const activeSnapPointIndex = derived([snapPoints, activeSnapPoint], ([$snapPoints, $activeSnapPoint]) => $snapPoints?.findIndex((snapPoint) => snapPoint === $activeSnapPoint) ?? null);
  const snapPointsOffset = derived(snapPoints, ($snapPoints) => {
    if ($snapPoints) {
      return $snapPoints.map((snapPoint) => {
        const hasWindow = typeof window !== "undefined";
        const isPx = typeof snapPoint === "string";
        let snapPointAsNumber = 0;
        if (isPx) {
          snapPointAsNumber = parseInt(snapPoint, 10);
        }
        const $direction = get_store_value(direction);
        if (isVertical($direction)) {
          const height = isPx ? snapPointAsNumber : hasWindow ? snapPoint * window.innerHeight : 0;
          if (hasWindow) {
            return $direction === "bottom" ? window.innerHeight - height : window.innerHeight + height;
          }
          return height;
        }
        const width = isPx ? snapPointAsNumber : hasWindow ? snapPoint * window.innerWidth : 0;
        if (hasWindow) {
          return $direction === "right" ? window.innerWidth - width : window.innerWidth + width;
        }
        return width;
      });
    }
    return [];
  });
  const activeSnapPointOffset = derived([snapPointsOffset, activeSnapPointIndex], ([$snapPointsOffset, $activeSnapPointIndex]) => $activeSnapPointIndex !== null ? $snapPointsOffset?.[$activeSnapPointIndex] : null);
  effect([activeSnapPoint, drawerRef], ([$activeSnapPoint, $drawerRef]) => {
    if ($activeSnapPoint && $drawerRef) {
      const $snapPoints = get_store_value(snapPoints);
      const $snapPointsOffset = get_store_value(snapPointsOffset);
      const newIndex = $snapPoints?.findIndex((snapPoint) => snapPoint === $activeSnapPoint) ?? -1;
      if ($snapPointsOffset && newIndex !== -1 && typeof $snapPointsOffset[newIndex] === "number") {
        snapToPoint($snapPointsOffset[newIndex]);
      }
    }
  });
  function snapToPoint(dimension) {
    tick().then(() => {
      const $snapPointsOffset = get_store_value(snapPointsOffset);
      const newSnapPointIndex = $snapPointsOffset?.findIndex((snapPointDim) => snapPointDim === dimension) ?? null;
      const $drawerRef = get_store_value(drawerRef);
      const $direction = get_store_value(direction);
      onSnapPointChange(newSnapPointIndex);
      set($drawerRef, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        transform: isVertical($direction) ? `translate3d(0, ${dimension}px, 0)` : `translate3d(${dimension}px, 0, 0)`
      });
      const $fadeFromIndex = get_store_value(fadeFromIndex);
      const $overlayRef = get_store_value(overlayRef);
      if (snapPointsOffset && newSnapPointIndex !== $snapPointsOffset.length - 1 && newSnapPointIndex !== $fadeFromIndex) {
        set($overlayRef, {
          transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
          opacity: "0"
        });
      } else {
        set($overlayRef, {
          transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
          opacity: "1"
        });
      }
      activeSnapPoint.update(() => {
        const $snapPoints = get_store_value(snapPoints);
        if (newSnapPointIndex === null || !$snapPoints)
          return null;
        return $snapPoints[newSnapPointIndex];
      });
    });
  }
  function onRelease({ draggedDistance, closeDrawer, velocity, dismissible }) {
    const $fadeFromIndex = get_store_value(fadeFromIndex);
    if ($fadeFromIndex === void 0)
      return;
    const $activeSnapPointOffset = get_store_value(activeSnapPointOffset);
    const $activeSnapPointIndex = get_store_value(activeSnapPointIndex);
    const $overlayRef = get_store_value(overlayRef);
    const $snapPointsOffset = get_store_value(snapPointsOffset);
    const $snapPoints = get_store_value(snapPoints);
    const $direction = get_store_value(direction);
    const currentPosition = $direction === "bottom" || $direction === "right" ? ($activeSnapPointOffset ?? 0) - draggedDistance : ($activeSnapPointOffset ?? 0) + draggedDistance;
    const isOverlaySnapPoint = $activeSnapPointIndex === $fadeFromIndex - 1;
    const isFirst = $activeSnapPointIndex === 0;
    const hasDraggedUp = draggedDistance > 0;
    if (isOverlaySnapPoint) {
      set($overlayRef, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    }
    if (velocity > 2 && !hasDraggedUp) {
      if (dismissible)
        closeDrawer();
      else
        snapToPoint($snapPointsOffset[0]);
      return;
    }
    if (velocity > 2 && hasDraggedUp && $snapPointsOffset && $snapPoints) {
      snapToPoint($snapPointsOffset[$snapPoints.length - 1]);
      return;
    }
    const closestSnapPoint = $snapPointsOffset?.reduce((prev2, curr) => {
      if (typeof prev2 !== "number" || typeof curr !== "number")
        return prev2;
      return Math.abs(curr - currentPosition) < Math.abs(prev2 - currentPosition) ? curr : prev2;
    });
    const dim = isVertical($direction) ? window.innerHeight : window.innerWidth;
    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < dim * 0.4) {
      const dragDirection = hasDraggedUp ? 1 : -1;
      if (dragDirection > 0 && get_store_value(isLastSnapPoint) && $snapPoints) {
        snapToPoint($snapPointsOffset[$snapPoints.length - 1]);
        return;
      }
      if (isFirst && dragDirection < 0 && dismissible) {
        closeDrawer();
      }
      if ($activeSnapPointIndex === null)
        return;
      snapToPoint($snapPointsOffset[$activeSnapPointIndex + dragDirection]);
      return;
    }
    snapToPoint(closestSnapPoint);
  }
  function onDrag({ draggedDistance }) {
    const $drawerRef = get_store_value(drawerRef);
    const $activeSnapPointOffset = get_store_value(activeSnapPointOffset);
    if ($activeSnapPointOffset === null)
      return;
    const $snapPointsOffset = get_store_value(snapPointsOffset);
    const $direction = get_store_value(direction);
    const newValue = $direction === "bottom" || $direction === "right" ? $activeSnapPointOffset - draggedDistance : $activeSnapPointOffset + draggedDistance;
    const lastSnapPoint = $snapPointsOffset[$snapPointsOffset.length - 1];
    if (isBottomOrRight($direction) && newValue < lastSnapPoint) {
      return;
    }
    if (!isBottomOrRight($direction) && newValue > lastSnapPoint) {
      return;
    }
    set($drawerRef, {
      transform: isVertical($direction) ? `translate3d(0, ${newValue}px, 0)` : `translate3d(${newValue}px, 0, 0)`
    });
  }
  function getPercentageDragged(absDraggedDistance, isDraggingDown) {
    const $activeSnapPointIndex = get_store_value(activeSnapPointIndex);
    const $snapPointsOffset = get_store_value(snapPointsOffset);
    const $snapPoints = get_store_value(snapPoints);
    const $fadeFromIndex = get_store_value(fadeFromIndex);
    if (!$snapPoints || typeof $activeSnapPointIndex !== "number" || !$snapPointsOffset || $fadeFromIndex === void 0)
      return null;
    const isOverlaySnapPoint = $activeSnapPointIndex === $fadeFromIndex - 1;
    const isOverlaySnapPointOrHigher = $activeSnapPointIndex >= $fadeFromIndex;
    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }
    if (isOverlaySnapPoint && !isDraggingDown)
      return 1;
    if (!get_store_value(shouldFade) && !isOverlaySnapPoint)
      return null;
    const targetSnapPointIndex = isOverlaySnapPoint ? $activeSnapPointIndex + 1 : $activeSnapPointIndex - 1;
    const snapPointDistance = isOverlaySnapPoint ? $snapPointsOffset[targetSnapPointIndex] - $snapPointsOffset[targetSnapPointIndex - 1] : $snapPointsOffset[targetSnapPointIndex + 1] - $snapPointsOffset[targetSnapPointIndex];
    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);
    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }
  function onSnapPointChange(activeSnapPointIndex2) {
    const $snapPoints = get_store_value(snapPoints);
    const $snapPointsOffset = get_store_value(snapPointsOffset);
    if ($snapPoints && activeSnapPointIndex2 === $snapPointsOffset.length - 1) {
      openTime.set(/* @__PURE__ */ new Date());
    }
  }
  return {
    isLastSnapPoint,
    shouldFade,
    getPercentageDragged,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointsOffset
  };
}
function isMac() {
  return testPlatform(/^Mac/);
}
function isIPhone() {
  return testPlatform(/^iPhone/);
}
function isIPad() {
  return testPlatform(/^iPad/) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  isMac() && navigator.maxTouchPoints > 1;
}
function isIOS() {
  return isIPhone() || isIPad();
}
function testPlatform(re) {
  return typeof window !== "undefined" && window.navigator != null ? re.test(window.navigator.platform) : void 0;
}
const visualViewport = typeof document !== "undefined" && window.visualViewport;
function isScrollable(node) {
  const style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}
function getScrollParent(node) {
  if (isScrollable(node)) {
    node = node.parentElement;
  }
  while (node && !isScrollable(node)) {
    node = node.parentElement;
  }
  return node || document.scrollingElement || document.documentElement;
}
let preventScrollCount = 0;
let restore;
function preventScroll() {
  if (typeof document === "undefined")
    return () => {
    };
  preventScrollCount++;
  if (preventScrollCount === 1) {
    if (isIOS()) {
      restore = preventScrollMobileSafari();
    } else {
      restore = preventScrollStandard();
    }
  }
  return () => {
    preventScrollCount--;
    if (preventScrollCount === 0) {
      restore();
    }
  };
}
function getPaddingProperty(documentElement) {
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}
function setCSSProperty(el, property, value) {
  if (!el)
    return;
  const previousValue = el.style.getPropertyValue(property);
  el.style.setProperty(property, value);
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue);
    } else {
      el.style.removeProperty(property);
    }
  };
}
function preventScrollStandard() {
  if (typeof document === "undefined")
    return () => {
    };
  const win = document.defaultView ?? window;
  const { documentElement, body } = document;
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () => setCSSProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];
  return chain(setScrollbarWidthProperty(), setStyle(body, paddingProperty, `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`), setStyle(body, "overflow", "hidden"));
}
function preventScrollMobileSafari() {
  let scrollable;
  let lastY = 0;
  const { documentElement, body, activeElement } = document;
  function onTouchStart(e) {
    scrollable = getScrollParent(e.target);
    if (scrollable === documentElement && scrollable === body)
      return;
    lastY = e.changedTouches[0].pageY;
  }
  function onTouchMove(e) {
    if (!scrollable || scrollable === documentElement || scrollable === body) {
      e.preventDefault();
      return;
    }
    const y = e.changedTouches[0].pageY;
    const scrollTop = scrollable.scrollTop;
    const bottom = scrollable.scrollHeight - scrollable.clientHeight;
    if (bottom === 0)
      return;
    if (scrollTop <= 0 && y > lastY || scrollTop >= bottom && y < lastY) {
      e.preventDefault();
    }
    lastY = y;
  }
  function onTouchEnd(e) {
    const target = e.target;
    if (!(isInput(target) && target !== activeElement))
      return;
    e.preventDefault();
    target.style.transform = "translateY(-2000px)";
    target.focus();
    requestAnimationFrame(() => {
      target.style.transform = "";
    });
  }
  function onFocus(e) {
    const target = e.target;
    if (!isInput(target))
      return;
    target.style.transform = "translateY(-2000px)";
    requestAnimationFrame(() => {
      target.style.transform = "";
      if (visualViewport) {
        if (visualViewport.height < window.innerHeight) {
          requestAnimationFrame(() => {
            scrollIntoView(target);
          });
        } else {
          visualViewport.addEventListener("resize", () => scrollIntoView(target), { once: true });
        }
      }
    });
  }
  function onWindowScroll() {
    window.scrollTo(0, 0);
  }
  const scrollX = window.pageXOffset;
  const scrollY = window.pageYOffset;
  const restoreStyles = chain(
    setStyle(documentElement, "paddingRight", `${window.innerWidth - documentElement.clientWidth}px`),
    setStyle(documentElement, "overflow", "hidden")
    // setStyle(document.body, 'marginTop', `-${scrollY}px`),
  );
  window.scrollTo(0, 0);
  const removeEvents = chain(addEventListener(document, "touchstart", onTouchStart, { passive: false, capture: true }), addEventListener(document, "touchmove", onTouchMove, { passive: false, capture: true }), addEventListener(document, "touchend", onTouchEnd, { passive: false, capture: true }), addEventListener(document, "focus", onFocus, true), addEventListener(window, "scroll", onWindowScroll));
  return () => {
    restoreStyles();
    removeEvents();
    window.scrollTo(scrollX, scrollY);
  };
}
function setStyle(element, style, value) {
  const cur = element.style[style];
  element.style[style] = value;
  return () => {
    element.style[style] = cur;
  };
}
function scrollIntoView(target) {
  const { documentElement, body, scrollingElement } = document;
  const root = scrollingElement || documentElement;
  while (target && target !== root) {
    const scrollable = getScrollParent(target);
    if (scrollable !== documentElement && scrollable !== body && scrollable !== target) {
      const scrollableTop = scrollable.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const targetBottom = target.getBoundingClientRect().bottom;
      const keyboardHeight = scrollable.getBoundingClientRect().bottom;
      if (targetBottom > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop;
      }
    }
    target = scrollable.parentElement;
  }
}
const documentEscapeKeyStore = readable(void 0, (set2) => {
  function keydown(event) {
    if (event && event.key === "Escape") {
      set2(event);
    }
    set2(void 0);
  }
  const unsubscribe = addEventListener(document, "keydown", keydown, {
    passive: false
  });
  return unsubscribe;
});
function handleEscapeKeydown(node, handler) {
  let unsub = noop;
  function update(handler2) {
    unsub();
    unsub = chain(
      // Handle escape keydowns
      documentEscapeKeyStore.subscribe((e) => {
        if (!e)
          return;
        const target = e.target;
        if (!isHTMLElement(target) || target.closest("[data-escapee]") !== node) {
          return;
        }
        e.preventDefault();
        handler2(e);
      })
    );
    node.setAttribute("data-escapee", "");
  }
  update(handler);
  return () => {
    unsub();
    node.removeAttribute("data-escapee");
  };
}
function isHTMLElement(el) {
  return el instanceof HTMLElement;
}
let previousBodyPosition = null;
function handlePositionFixed({ isOpen, modal, nested, hasBeenOpened }) {
  const activeUrl = writable(typeof window !== "undefined" ? window.location.href : "");
  let scrollPos = 0;
  function setPositionFixed(open) {
    if (!(previousBodyPosition === null && open))
      return;
    previousBodyPosition = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      height: document.body.style.height
    };
    const { scrollX, innerHeight } = window;
    document.body.style.setProperty("position", "fixed", "important");
    document.body.style.top = `${-scrollPos}px`;
    document.body.style.left = `${-scrollX}px`;
    document.body.style.right = "0px";
    document.body.style.height = "auto";
    setTimeout(() => requestAnimationFrame(() => {
      const bottomBarHeight = innerHeight - window.innerHeight;
      if (bottomBarHeight && scrollPos >= innerHeight) {
        document.body.style.top = `${-(scrollPos + bottomBarHeight)}px`;
      }
    }), 300);
  }
  function restorePositionSetting() {
    if (previousBodyPosition === null)
      return;
    const $activeUrl = get_store_value(activeUrl);
    const y = -parseInt(document.body.style.top, 10);
    const x = -parseInt(document.body.style.left, 10);
    document.body.style.position = previousBodyPosition.position;
    document.body.style.top = previousBodyPosition.top;
    document.body.style.left = previousBodyPosition.left;
    document.body.style.height = previousBodyPosition.height;
    document.body.style.right = "unset";
    requestAnimationFrame(() => {
      if ($activeUrl !== window.location.href) {
        activeUrl.set(window.location.href);
        return;
      }
      window.scrollTo(x, y);
    });
    previousBodyPosition = null;
  }
  effect([isOpen, activeUrl], ([$isOpen, _]) => {
    if (typeof document === "undefined")
      return;
    if (get_store_value(nested) || !get_store_value(hasBeenOpened))
      return;
    if ($isOpen) {
      setPositionFixed($isOpen);
      if (!get_store_value(modal)) {
        setTimeout(() => {
          restorePositionSetting();
        }, 500);
      }
    } else {
      restorePositionSetting();
    }
  });
  return { restorePositionSetting };
}
const CLOSE_THRESHOLD = 0.25;
const SCROLL_LOCK_TIMEOUT = 100;
const BORDER_RADIUS = 8;
const NESTED_DISPLACEMENT = 16;
const WINDOW_TOP_OFFSET = 26;
const DRAG_CLASS = "vaul-dragging";
const openDrawerIds = writable([]);
const defaultProps = {
  closeThreshold: CLOSE_THRESHOLD,
  shouldScaleBackground: true,
  scrollLockTimeout: SCROLL_LOCK_TIMEOUT,
  onDrag: void 0,
  onRelease: void 0,
  snapPoints: void 0,
  fadeFromIndex: void 0,
  defaultActiveSnapPoint: void 0,
  onActiveSnapPointChange: void 0,
  defaultOpen: false,
  onOpenChange: void 0,
  fixed: void 0,
  dismissible: true,
  modal: true,
  nested: false,
  onClose: void 0,
  direction: "bottom"
};
const omittedOptions = [
  "defaultOpen",
  "onOpenChange",
  "defaultActiveSnapPoint",
  "onActiveSnapPointChange",
  "onDrag",
  "onRelease",
  "onClose"
];
function createVaul(props) {
  const { snapPoints: snapPointsProp, fadeFromIndex: fadeFromIndexProp = snapPointsProp && snapPointsProp.length - 1, ...withDefaults } = { ...defaultProps, ...removeUndefined(props) };
  const options = toWritableStores(omit({
    ...withDefaults,
    snapPoints: snapPointsProp,
    fadeFromIndex: fadeFromIndexProp
  }, ...omittedOptions));
  const triggerRef = writable(void 0);
  const { onDrag: onDragProp, onRelease: onReleaseProp, onClose, onOpenChange } = withDefaults;
  const { snapPoints, fadeFromIndex, fixed, dismissible, modal, nested, shouldScaleBackground, scrollLockTimeout, closeThreshold, direction } = options;
  const openStore = writable(withDefaults.defaultOpen);
  const isOpen = overridable(openStore, withDefaults.onOpenChange);
  const hasBeenOpened = writable(false);
  const visible = writable(false);
  const justReleased = writable(false);
  const overlayRef = writable(void 0);
  const openTime = writable(null);
  const keyboardIsOpen = writable(false);
  const drawerRef = writable(void 0);
  const drawerId = writable(void 0);
  let isDragging = false;
  let dragStartTime = null;
  let isClosing = false;
  let pointerStart = 0;
  let dragEndTime = null;
  let lastTimeDragPrevented = null;
  let isAllowedToDrag = false;
  let drawerHeightRef = get_store_value(drawerRef)?.getBoundingClientRect().height || 0;
  let previousDiffFromInitial = 0;
  let initialDrawerHeight = 0;
  let nestedOpenChangeTimer = null;
  const activeSnapPoint = overridable(writable(withDefaults.defaultActiveSnapPoint), withDefaults.onActiveSnapPointChange);
  const { activeSnapPointIndex, getPercentageDragged: getSnapPointsPercentageDragged, onDrag: onDragSnapPoints, onRelease: onReleaseSnapPoints, shouldFade, snapPointsOffset } = handleSnapPoints({
    snapPoints,
    activeSnapPoint,
    drawerRef,
    fadeFromIndex,
    overlayRef,
    openTime,
    direction
  });
  const getContentStyle = derived([snapPointsOffset], ([$snapPointsOffset]) => {
    return (style = "") => {
      if ($snapPointsOffset && $snapPointsOffset.length > 0) {
        const styleProp = styleToString({
          "--snap-point-height": `${$snapPointsOffset[0]}px`
        });
        return style + styleProp;
      }
      return style;
    };
  });
  effect([drawerRef], ([$drawerRef]) => {
    if ($drawerRef) {
      drawerId.set($drawerRef.id);
    }
  });
  effect([isOpen], ([$open]) => {
    sleep(100).then(() => {
      const id = get_store_value(drawerId);
      if ($open && id) {
        openDrawerIds.update((prev2) => {
          if (prev2.includes(id)) {
            return prev2;
          }
          prev2.push(id);
          return prev2;
        });
      } else {
        openDrawerIds.update((prev2) => prev2.filter((id2) => id2 !== id2));
      }
    });
  });
  effect([isOpen], ([$isOpen]) => {
    if (!$isOpen && get_store_value(shouldScaleBackground)) {
      const id = setTimeout(() => {
        reset(document.body, "background");
      }, 200);
      return () => clearTimeout(id);
    }
  });
  effect([isOpen], ([$isOpen]) => {
    let unsub = () => {
    };
    if ($isOpen) {
      unsub = preventScroll();
    }
    return unsub;
  });
  const { restorePositionSetting } = handlePositionFixed({ isOpen, modal, nested, hasBeenOpened });
  effect([drawerRef], ([$drawerRef]) => {
    let unsub = noop;
    if ($drawerRef) {
      unsub = handleEscapeKeydown($drawerRef, () => {
        closeDrawer(true);
      });
    }
    return () => {
      unsub();
    };
  });
  function openDrawer() {
    if (isClosing)
      return;
    hasBeenOpened.set(true);
    isOpen.set(true);
  }
  function onPress(event) {
    const $drawerRef = get_store_value(drawerRef);
    if (!get_store_value(dismissible) && !get_store_value(snapPoints))
      return;
    if ($drawerRef && !$drawerRef.contains(event.target))
      return;
    drawerHeightRef = $drawerRef?.getBoundingClientRect().height || 0;
    isDragging = true;
    dragStartTime = /* @__PURE__ */ new Date();
    if (isIOS()) {
      window.addEventListener("touchend", () => isAllowedToDrag = false, { once: true });
    }
    event.target.setPointerCapture(event.pointerId);
    pointerStart = isVertical(get_store_value(direction)) ? event.screenY : event.screenX;
  }
  function shouldDrag(el, isDraggingInDirection) {
    const $drawerRef = get_store_value(drawerRef);
    let element = el;
    const highlightedText = window.getSelection()?.toString();
    const $direction = get_store_value(direction);
    const swipeAmount = $drawerRef ? getTranslate($drawerRef, $direction) : null;
    const date = /* @__PURE__ */ new Date();
    if (element.hasAttribute("data-vaul-no-drag") || element.closest("[data-vaul-no-drag]")) {
      return false;
    }
    const $openTime = get_store_value(openTime);
    if ($openTime && date.getTime() - $openTime.getTime() < 500) {
      return false;
    }
    if (swipeAmount !== null) {
      if ($direction === "bottom" || $direction === "right" ? swipeAmount > 0 : swipeAmount < 0) {
        return true;
      }
    }
    if (swipeAmount !== null && swipeAmount > 0) {
      return true;
    }
    if (highlightedText && highlightedText.length > 0) {
      return false;
    }
    const $scrollLockTimeout = get_store_value(scrollLockTimeout);
    if (lastTimeDragPrevented && date.getTime() - lastTimeDragPrevented.getTime() < $scrollLockTimeout && swipeAmount === 0) {
      lastTimeDragPrevented = date;
      return false;
    }
    if (isDraggingInDirection) {
      lastTimeDragPrevented = date;
      return false;
    }
    while (element) {
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented = /* @__PURE__ */ new Date();
          return false;
        }
        if (element.getAttribute("role") === "dialog") {
          return true;
        }
      }
      element = element.parentNode;
    }
    return true;
  }
  function onDrag(event) {
    const $drawerRef = get_store_value(drawerRef);
    if (!$drawerRef || !isDragging)
      return;
    const $direction = get_store_value(direction);
    const directionMultiplier = getDirectionMultiplier($direction);
    const draggedDistance = getDistanceMoved(pointerStart, $direction, event) * directionMultiplier;
    const isDraggingInDirection = draggedDistance > 0;
    const $activeSnapPointIndex = get_store_value(activeSnapPointIndex);
    const $snapPoints = get_store_value(snapPoints);
    if ($snapPoints && $activeSnapPointIndex === 0 && !get_store_value(dismissible))
      return;
    if (!isAllowedToDrag && !shouldDrag(event.target, isDraggingInDirection)) {
      return;
    }
    $drawerRef.classList.add(DRAG_CLASS);
    isAllowedToDrag = true;
    set($drawerRef, {
      transition: "none"
    });
    const $overlayRef = get_store_value(overlayRef);
    set($overlayRef, {
      transition: "none"
    });
    if ($snapPoints) {
      onDragSnapPoints({ draggedDistance });
    }
    if (isDraggingInDirection && !$snapPoints) {
      const dampenedDraggedDistance = dampenValue(draggedDistance);
      const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
      set($drawerRef, {
        transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
      });
      return;
    }
    const absDraggedDistance = Math.abs(draggedDistance);
    let percentageDragged = absDraggedDistance / drawerHeightRef;
    const snapPointPercentageDragged = getSnapPointsPercentageDragged(absDraggedDistance, isDraggingInDirection);
    if (snapPointPercentageDragged !== null) {
      percentageDragged = snapPointPercentageDragged;
    }
    const opacityValue = 1 - percentageDragged;
    const $fadeFromIndex = get_store_value(fadeFromIndex);
    const $shouldFade = get_store_value(shouldFade);
    if ($shouldFade || $fadeFromIndex && $activeSnapPointIndex === $fadeFromIndex - 1) {
      onDragProp?.(event, percentageDragged);
      set($overlayRef, {
        opacity: `${opacityValue}`,
        transition: "none"
      }, true);
    }
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    if (wrapper && $overlayRef && get_store_value(shouldScaleBackground)) {
      const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
      const borderRadiusValue = 8 - percentageDragged * 8;
      const translateValue = Math.max(0, 14 - percentageDragged * 14);
      set(wrapper, {
        borderRadius: `${borderRadiusValue}px`,
        transform: isVertical($direction) ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)` : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
        transition: "none"
      }, true);
    }
    if (!$snapPoints) {
      const translateValue = absDraggedDistance * directionMultiplier;
      set($drawerRef, {
        transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
      });
    }
  }
  function scaleBackground(open, backgroundColor = "black") {
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    if (!wrapper || !get_store_value(shouldScaleBackground))
      return;
    const $direction = get_store_value(direction);
    if (open) {
      set(document.body, {
        background: document.body.style.backgroundColor || document.body.style.background
      });
      set(document.body, {
        background: backgroundColor
      }, true);
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...isVertical($direction) ? {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
          transformOrigin: "top"
        } : {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
          transformOrigin: "left"
        },
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    } else {
      reset(wrapper, "overflow");
      reset(wrapper, "transform");
      reset(wrapper, "borderRadius");
      set(wrapper, {
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    }
  }
  effect([activeSnapPointIndex, snapPoints, snapPointsOffset], ([$activeSnapPointIndex, $snapPoints, $snapPointsOffset]) => {
    function onVisualViewportChange() {
      const $drawerRef = get_store_value(drawerRef);
      if (!$drawerRef)
        return;
      const $keyboardIsOpen = get_store_value(keyboardIsOpen);
      const focusedElement = document.activeElement;
      if (isInput(focusedElement) || $keyboardIsOpen) {
        const visualViewportHeight = window.visualViewport?.height || 0;
        let diffFromInitial = window.innerHeight - visualViewportHeight;
        const drawerHeight = $drawerRef.getBoundingClientRect().height || 0;
        if (!initialDrawerHeight) {
          initialDrawerHeight = drawerHeight;
        }
        const offsetFromTop = $drawerRef.getBoundingClientRect().top;
        if (Math.abs(previousDiffFromInitial - diffFromInitial) > 60) {
          keyboardIsOpen.set(!$keyboardIsOpen);
        }
        if ($snapPoints && $snapPoints.length > 0 && $snapPointsOffset && $activeSnapPointIndex) {
          const activeSnapPointHeight = $snapPointsOffset[$activeSnapPointIndex] || 0;
          diffFromInitial += activeSnapPointHeight;
        }
        previousDiffFromInitial = diffFromInitial;
        if (drawerHeight > visualViewportHeight || $keyboardIsOpen) {
          const height = $drawerRef.getBoundingClientRect().height;
          let newDrawerHeight = height;
          if (height > visualViewportHeight) {
            newDrawerHeight = visualViewportHeight - WINDOW_TOP_OFFSET;
          }
          if (get_store_value(fixed)) {
            $drawerRef.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
          } else {
            $drawerRef.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
          }
        } else {
          $drawerRef.style.height = `${initialDrawerHeight}px`;
        }
        if ($snapPoints && $snapPoints.length > 0 && !$keyboardIsOpen) {
          $drawerRef.style.bottom = `0px`;
        } else {
          $drawerRef.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
        }
      }
    }
    let removeListener = noop;
    if (window.visualViewport) {
      removeListener = addEventListener(window.visualViewport, "resize", onVisualViewportChange);
    }
    return () => {
      removeListener();
    };
  });
  function closeDrawer(withKeyboard = false) {
    if (isClosing)
      return;
    const $drawerRef = get_store_value(drawerRef);
    if (!$drawerRef)
      return;
    const $direction = get_store_value(direction);
    onClose?.();
    set($drawerRef, {
      transform: isVertical($direction) ? `translate3d(0, ${$direction === "bottom" ? "100%" : "-100%"}, 0)` : `translate3d(${$direction === "right" ? "100%" : "-100%"}, 0, 0)`,
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    set(get_store_value(overlayRef), {
      opacity: "0",
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    scaleBackground(false);
    isClosing = true;
    setTimeout(() => {
      visible.set(false);
      isOpen.set(false);
      isClosing = false;
      if (withKeyboard) {
        get_store_value(triggerRef)?.focus();
      }
    }, 300);
    const $snapPoints = get_store_value(snapPoints);
    setTimeout(() => {
      reset(document.documentElement, "scrollBehavior");
      if ($snapPoints) {
        activeSnapPoint.set($snapPoints[0]);
      }
    }, TRANSITIONS.DURATION * 1e3);
  }
  effect([isOpen], ([$isOpen]) => {
    if ($isOpen) {
      hasBeenOpened.set(true);
    } else {
      closeDrawer();
    }
  });
  function resetDrawer() {
    const $drawerRef = get_store_value(drawerRef);
    if (!$drawerRef)
      return;
    const $overlayRef = get_store_value(overlayRef);
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    const $direction = get_store_value(direction);
    const currentSwipeAmount = getTranslate($drawerRef, $direction);
    set($drawerRef, {
      transform: "translate3d(0, 0, 0)",
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    set($overlayRef, {
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      opacity: "1"
    });
    const $shouldScaleBackground = get_store_value(shouldScaleBackground);
    const $isOpen = get_store_value(isOpen);
    if ($shouldScaleBackground && currentSwipeAmount && currentSwipeAmount > 0 && $isOpen) {
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...isVertical($direction) ? {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
          transformOrigin: "top"
        } : {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
          transformOrigin: "left"
        },
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      }, true);
    }
  }
  function onRelease(event) {
    const $drawerRef = get_store_value(drawerRef);
    if (!isDragging || !$drawerRef)
      return;
    if (isAllowedToDrag && isInput(event.target)) {
      event.target.blur();
    }
    $drawerRef.classList.remove(DRAG_CLASS);
    isAllowedToDrag = false;
    isDragging = false;
    dragEndTime = /* @__PURE__ */ new Date();
    const $direction = get_store_value(direction);
    const swipeAmount = getTranslate($drawerRef, $direction);
    if (event.target && !shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount))
      return;
    if (dragStartTime === null)
      return;
    const timeTaken = dragEndTime.getTime() - dragStartTime.getTime();
    const distMoved = getDistanceMoved(pointerStart, $direction, event);
    const velocity = Math.abs(distMoved) / timeTaken;
    if (velocity > 0.05) {
      justReleased.set(true);
      setTimeout(() => {
        justReleased.set(false);
      }, 200);
    }
    if (get_store_value(snapPoints)) {
      onReleaseSnapPoints({
        draggedDistance: distMoved * getDirectionMultiplier($direction),
        closeDrawer,
        velocity,
        dismissible: get_store_value(dismissible)
      });
      onReleaseProp?.(event, true);
      return;
    }
    if ($direction === "bottom" || $direction === "right" ? distMoved > 0 : distMoved < 0) {
      resetDrawer();
      onReleaseProp?.(event, true);
      return;
    }
    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }
    const visibleDrawerHeight = Math.min(get_store_value(drawerRef)?.getBoundingClientRect().height ?? 0, window.innerHeight);
    if (swipeAmount >= visibleDrawerHeight * get_store_value(closeThreshold)) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }
    onReleaseProp?.(event, true);
    resetDrawer();
  }
  effect([isOpen], ([$isOpen]) => {
    if (!$isOpen)
      return;
    if (isBrowser) {
      set(document.documentElement, {
        scrollBehavior: "auto"
      });
    }
    openTime.set(/* @__PURE__ */ new Date());
    scaleBackground(true, props.backgroundColor);
  });
  effect([visible], ([$visible]) => {
    if (!$visible)
      return;
    const $drawerRef = get_store_value(drawerRef);
    if (!$drawerRef)
      return;
    const children = $drawerRef.querySelectorAll("*");
    children.forEach((child) => {
      const htmlChild = child;
      if (htmlChild.scrollHeight > htmlChild.clientHeight || htmlChild.scrollWidth > htmlChild.clientWidth) {
        htmlChild.classList.add("vaul-scrollable");
      }
    });
  });
  function onNestedOpenChange(o) {
    const $drawerRef = get_store_value(drawerRef);
    const scale2 = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;
    const y = o ? -NESTED_DISPLACEMENT : 0;
    if (nestedOpenChangeTimer) {
      window.clearTimeout(nestedOpenChangeTimer);
    }
    set($drawerRef, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      transform: `scale(${scale2}) translate3d(0, ${y}px, 0)`
    });
    if (!o && $drawerRef) {
      nestedOpenChangeTimer = setTimeout(() => {
        const $direction = get_store_value(direction);
        const translateValue = getTranslate($drawerRef, $direction);
        set($drawerRef, {
          transition: "none",
          transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
        });
      }, 500);
    }
  }
  function onNestedDrag(_, percentageDragged) {
    if (percentageDragged < 0)
      return;
    const initialScale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth;
    const newScale = initialScale + percentageDragged * (1 - initialScale);
    const newTranslate = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT;
    const $direction = get_store_value(direction);
    set(get_store_value(drawerRef), {
      transform: isVertical($direction) ? `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)` : `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`,
      transition: "none"
    });
  }
  function onNestedRelease(_, o) {
    const $direction = get_store_value(direction);
    const dim = isVertical($direction) ? window.innerHeight : window.innerWidth;
    const scale2 = o ? (dim - NESTED_DISPLACEMENT) / dim : 1;
    const translate = o ? -NESTED_DISPLACEMENT : 0;
    if (o) {
      set(get_store_value(drawerRef), {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        transform: isVertical($direction) ? `scale(${scale2}) translate3d(0, ${translate}px, 0)` : `scale(${scale2}) translate3d(${translate}px, 0, 0)`
      });
    }
  }
  return {
    states: {
      isOpen,
      hasBeenOpened,
      snapPoints,
      activeSnapPoint,
      snapPointsOffset,
      keyboardIsOpen,
      shouldFade,
      visible,
      drawerId,
      openDrawerIds
    },
    helpers: {
      getContentStyle
    },
    methods: {
      closeDrawer,
      onOpenChange,
      onPress,
      onRelease,
      onDrag,
      scaleBackground,
      onNestedDrag,
      onNestedOpenChange,
      onNestedRelease,
      restorePositionSetting,
      openDrawer
    },
    refs: {
      drawerRef,
      overlayRef,
      triggerRef
    },
    options
  };
}
function dampenValue(v) {
  return 8 * (Math.log(v + 1) - 2);
}
function getScale() {
  return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
}
function getDistanceMoved(pointerStart, direction, event) {
  if (event.type.startsWith("touch")) {
    return getDistanceMovedForTouch(pointerStart, direction, event);
  } else {
    return getDistanceMovedForPointer(pointerStart, direction, event);
  }
}
function getDistanceMovedForPointer(pointerStart, direction, event) {
  return pointerStart - (isVertical(direction) ? event.screenY : event.screenX);
}
function getDistanceMovedForTouch(pointerStart, direction, event) {
  return pointerStart - (isVertical(direction) ? event.changedTouches[0].screenY : event.changedTouches[0].screenX);
}
function getDirectionMultiplier(direction) {
  return direction === "bottom" || direction === "right" ? 1 : -1;
}
const VAUL_ROOT = Symbol("VAUL_ROOT");
function setCtx(props = {}) {
  const vaul = createVaul(props);
  const updateOption = getOptionUpdater(vaul.options);
  setContext(VAUL_ROOT, { ...vaul, updateOption });
  return {
    ...vaul,
    updateOption
  };
}
function getCtx() {
  return getContext(VAUL_ROOT);
}
const css$1 = {
  code: '[data-vaul-drawer]{touch-action:none;transition:transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)}[data-vaul-drawer][data-vaul-drawer-direction="bottom"]{transform:translate3d(0, 100%, 0)}[data-vaul-drawer][data-vaul-drawer-direction="top"]{transform:translate3d(0, -100%, 0)}[data-vaul-drawer][data-vaul-drawer-direction="left"]{transform:translate3d(-100%, 0, 0)}[data-vaul-drawer][data-vaul-drawer-direction="right"]{transform:translate3d(100%, 0, 0)}.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction="top"]{overflow-y:hidden !important}.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction="bottom"]{overflow-y:hidden !important}.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction="left"]{overflow-x:hidden !important}.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction="right"]{overflow-x:hidden !important}[data-vaul-drawer][data-vaul-drawer-visible="true"][data-vaul-drawer-direction="top"]{transform:translate3d(0, var(--snap-point-height, 0), 0)}\n			[data-vaul-drawer][data-vaul-drawer-visible="true"][data-vaul-drawer-direction="bottom"]\n		{transform:translate3d(0, var(--snap-point-height, 0), 0)}[data-vaul-drawer][data-vaul-drawer-visible="true"][data-vaul-drawer-direction="left"]{transform:translate3d(var(--snap-point-height, 0), 0, 0)}[data-vaul-drawer][data-vaul-drawer-visible="true"][data-vaul-drawer-direction="right"]{transform:translate3d(var(--snap-point-height, 0), 0, 0)}[data-vaul-overlay]{opacity:0;transition:opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)}[data-vaul-overlay][data-vaul-drawer-visible="true"]{opacity:1}[data-vaul-drawer]::after{content:"";position:absolute;background:inherit;background-color:inherit}[data-vaul-drawer][data-vaul-drawer-direction="top"]::after{top:initial;bottom:100%;left:0;right:0;height:200%}[data-vaul-drawer][data-vaul-drawer-direction="bottom"]::after{top:100%;bottom:initial;left:0;right:0;height:200%}[data-vaul-drawer][data-vaul-drawer-direction="left"]::after{left:initial;right:100%;top:0;bottom:0;width:200%}[data-vaul-drawer][data-vaul-drawer-direction="right"]::after{left:100%;right:initial;top:0;bottom:0;width:200%}\n			[data-vaul-overlay][data-vaul-snap-points="true"]:not(\n					[data-vaul-snap-points-overlay="true"]\n				):not([data-state="closed"])\n		{opacity:0}\n			[data-vaul-overlay][data-vaul-snap-points-overlay="true"]:not(\n					[data-vaul-drawer-visible="false"]\n				)\n		{opacity:1}@keyframes fake-animation{from{}to{}}@media(hover: hover) and (pointer: fine){[data-vaul-drawer]{-webkit-user-select:none;-moz-user-select:none;user-select:none}}',
  map: '{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<script>import { Dialog as DialogPrimitive } from \\"bits-ui\\";\\nimport { setCtx } from \\"../ctx.js\\";\\nimport { get } from \\"svelte/store\\";\\nexport let open = false;\\nexport let onOpenChange = void 0;\\nexport let closeThreshold = void 0;\\nexport let scrollLockTimeout = void 0;\\nexport let snapPoints = void 0;\\nexport let fadeFromIndex = void 0;\\nexport let openFocus = void 0;\\nexport let onOutsideClick = void 0;\\nexport let closeOnOutsideClick = true;\\nexport let backgroundColor = \\"black\\";\\nexport let nested = false;\\nexport let shouldScaleBackground = false;\\nexport let activeSnapPoint = void 0;\\nexport let onActiveSnapPointChange = void 0;\\nexport let onRelease = void 0;\\nexport let onDrag = void 0;\\nexport let onClose = void 0;\\nexport let dismissible = void 0;\\nexport let direction = \\"bottom\\";\\nconst {\\n  states: {\\n    keyboardIsOpen,\\n    activeSnapPoint: localActiveSnapPoint,\\n    drawerId,\\n    openDrawerIds,\\n    isOpen\\n  },\\n  methods: { closeDrawer, openDrawer },\\n  options: { dismissible: localDismissible },\\n  updateOption\\n} = setCtx({\\n  defaultOpen: open,\\n  defaultActiveSnapPoint: activeSnapPoint,\\n  onOpenChange: ({ next }) => {\\n    if (open !== next) {\\n      onOpenChange?.(next);\\n      open = next;\\n    }\\n    return next;\\n  },\\n  onActiveSnapPointChange: ({ next }) => {\\n    if (next === void 0 && snapPoints && activeSnapPoint !== next) {\\n      const newNext = snapPoints[0];\\n      onActiveSnapPointChange?.(newNext);\\n      activeSnapPoint = newNext;\\n      return newNext;\\n    }\\n    if (activeSnapPoint !== next) {\\n      onActiveSnapPointChange?.(next);\\n      activeSnapPoint = next;\\n    }\\n    return next;\\n  },\\n  closeThreshold,\\n  scrollLockTimeout,\\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\\n  snapPoints,\\n  fadeFromIndex,\\n  nested,\\n  onDrag,\\n  onClose,\\n  onRelease,\\n  shouldScaleBackground,\\n  backgroundColor,\\n  dismissible,\\n  direction\\n});\\n$:\\n  activeSnapPoint !== void 0 && localActiveSnapPoint.set(activeSnapPoint);\\n$:\\n  updateOption(\\"closeThreshold\\", closeThreshold);\\n$:\\n  updateOption(\\"scrollLockTimeout\\", scrollLockTimeout);\\n$:\\n  updateOption(\\"snapPoints\\", snapPoints);\\n$:\\n  updateOption(\\"fadeFromIndex\\", fadeFromIndex);\\n$:\\n  updateOption(\\"openFocus\\", openFocus);\\n$:\\n  updateOption(\\"shouldScaleBackground\\", shouldScaleBackground);\\n$:\\n  updateOption(\\"backgroundColor\\", backgroundColor);\\n$:\\n  updateOption(\\"dismissible\\", dismissible);\\n$:\\n  updateOption(\\"direction\\", direction);\\n$:\\n  open && !$isOpen && openDrawer();\\n$:\\n  !open && $isOpen && closeDrawer();\\n<\/script>\\n\\n<DialogPrimitive.Root\\n\\t{closeOnOutsideClick}\\n\\tcloseOnEscape={false}\\n\\tbind:open\\n\\tpreventScroll={false}\\n\\tonOpenChange={(o) => {\\n\\t\\tonOpenChange?.(o);\\n\\t\\tif (!o) {\\n\\t\\t\\tcloseDrawer();\\n\\t\\t} else if (o) {\\n\\t\\t\\topenDrawer();\\n\\t\\t}\\n\\t}}\\n\\tonOutsideClick={(e) => {\\n\\t\\tif (!closeOnOutsideClick) return;\\n\\n\\t\\tonOutsideClick?.(e);\\n\\n\\t\\tif (e?.defaultPrevented) return;\\n\\n\\t\\tif ($keyboardIsOpen) {\\n\\t\\t\\tkeyboardIsOpen.set(false);\\n\\t\\t}\\n\\t\\te.preventDefault();\\n\\t\\tif (!$localDismissible) {\\n\\t\\t\\treturn;\\n\\t\\t}\\n\\t\\tconst $openDialogIds = get(openDrawerIds);\\n\\t\\tconst isLast = $openDialogIds[$openDialogIds.length - 1] === get(drawerId);\\n\\t\\tif (isLast) {\\n\\t\\t\\tonOpenChange?.(false);\\n\\t\\t\\tcloseDrawer();\\n\\t\\t}\\n\\t}}\\n\\t{...$$restProps}\\n>\\n\\t<slot />\\n</DialogPrimitive.Root>\\n\\n<style>\\n\\t:global([data-vaul-drawer]) {\\n\\t\\ttouch-action: none;\\n\\t\\ttransition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-direction=\\"bottom\\"]) {\\n\\t\\ttransform: translate3d(0, 100%, 0);\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-direction=\\"top\\"]) {\\n\\t\\ttransform: translate3d(0, -100%, 0);\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-direction=\\"left\\"]) {\\n\\t\\ttransform: translate3d(-100%, 0, 0);\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-direction=\\"right\\"]) {\\n\\t\\ttransform: translate3d(100%, 0, 0);\\n\\t}\\n\\n\\t:global(.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction=\\"top\\"]) {\\n\\t\\toverflow-y: hidden !important;\\n\\t}\\n\\n\\t:global(.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction=\\"bottom\\"]) {\\n\\t\\toverflow-y: hidden !important;\\n\\t}\\n\\n\\t:global(.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction=\\"left\\"]) {\\n\\t\\toverflow-x: hidden !important;\\n\\t}\\n\\t:global(.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction=\\"right\\"]) {\\n\\t\\toverflow-x: hidden !important;\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-visible=\\"true\\"][data-vaul-drawer-direction=\\"top\\"]) {\\n\\t\\ttransform: translate3d(0, var(--snap-point-height, 0), 0);\\n\\t}\\n\\n\\t:global(\\n\\t\\t\\t[data-vaul-drawer][data-vaul-drawer-visible=\\"true\\"][data-vaul-drawer-direction=\\"bottom\\"]\\n\\t\\t) {\\n\\t\\ttransform: translate3d(0, var(--snap-point-height, 0), 0);\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-visible=\\"true\\"][data-vaul-drawer-direction=\\"left\\"]) {\\n\\t\\ttransform: translate3d(var(--snap-point-height, 0), 0, 0);\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-visible=\\"true\\"][data-vaul-drawer-direction=\\"right\\"]) {\\n\\t\\ttransform: translate3d(var(--snap-point-height, 0), 0, 0);\\n\\t}\\n\\n\\t:global([data-vaul-overlay]) {\\n\\t\\topacity: 0;\\n\\t\\ttransition: opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1);\\n\\t}\\n\\n\\t:global([data-vaul-overlay][data-vaul-drawer-visible=\\"true\\"]) {\\n\\t\\topacity: 1;\\n\\t}\\n\\n\\t:global([data-vaul-drawer]::after) {\\n\\t\\tcontent: \\"\\";\\n\\t\\tposition: absolute;\\n\\t\\tbackground: inherit;\\n\\t\\tbackground-color: inherit;\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-direction=\\"top\\"]::after) {\\n\\t\\ttop: initial;\\n\\t\\tbottom: 100%;\\n\\t\\tleft: 0;\\n\\t\\tright: 0;\\n\\t\\theight: 200%;\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-direction=\\"bottom\\"]::after) {\\n\\t\\ttop: 100%;\\n\\t\\tbottom: initial;\\n\\t\\tleft: 0;\\n\\t\\tright: 0;\\n\\t\\theight: 200%;\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-direction=\\"left\\"]::after) {\\n\\t\\tleft: initial;\\n\\t\\tright: 100%;\\n\\t\\ttop: 0;\\n\\t\\tbottom: 0;\\n\\t\\twidth: 200%;\\n\\t}\\n\\n\\t:global([data-vaul-drawer][data-vaul-drawer-direction=\\"right\\"]::after) {\\n\\t\\tleft: 100%;\\n\\t\\tright: initial;\\n\\t\\ttop: 0;\\n\\t\\tbottom: 0;\\n\\t\\twidth: 200%;\\n\\t}\\n\\n\\t:global(\\n\\t\\t\\t[data-vaul-overlay][data-vaul-snap-points=\\"true\\"]:not(\\n\\t\\t\\t\\t\\t[data-vaul-snap-points-overlay=\\"true\\"]\\n\\t\\t\\t\\t):not([data-state=\\"closed\\"])\\n\\t\\t) {\\n\\t\\topacity: 0;\\n\\t}\\n\\n\\t:global(\\n\\t\\t\\t[data-vaul-overlay][data-vaul-snap-points-overlay=\\"true\\"]:not(\\n\\t\\t\\t\\t\\t[data-vaul-drawer-visible=\\"false\\"]\\n\\t\\t\\t\\t)\\n\\t\\t) {\\n\\t\\topacity: 1;\\n\\t}\\n\\n\\t/* This will allow us to not animate via animation, but still benefit from delaying\\n\\tunmount via Bits */\\n\\t@keyframes -global-fake-animation {\\n\\t\\tfrom {\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t}\\n\\t}\\n\\n\\t@media (hover: hover) and (pointer: fine) {\\n\\t\\t:global([data-vaul-drawer]) {\\n\\t\\t\\t-webkit-user-select: none;\\n\\t\\t\\t   -moz-user-select: none;\\n\\t\\t\\t        user-select: none;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAwIS,kBAAoB,CAC3B,YAAY,CAAE,IAAI,CAClB,UAAU,CAAE,SAAS,CAAC,IAAI,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACzD,CAEQ,uDAAyD,CAChE,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAClC,CAEQ,oDAAsD,CAC7D,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CACnC,CAEQ,qDAAuD,CAC9D,SAAS,CAAE,YAAY,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnC,CAEQ,sDAAwD,CAC/D,SAAS,CAAE,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAClC,CAEQ,kEAAoE,CAC3E,UAAU,CAAE,MAAM,CAAC,UACpB,CAEQ,qEAAuE,CAC9E,UAAU,CAAE,MAAM,CAAC,UACpB,CAEQ,mEAAqE,CAC5E,UAAU,CAAE,MAAM,CAAC,UACpB,CACQ,oEAAsE,CAC7E,UAAU,CAAE,MAAM,CAAC,UACpB,CAEQ,qFAAuF,CAC9F,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,IAAI,mBAAmB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CACzD;AAGD;AACA,EAAI,CACF,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,IAAI,mBAAmB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CACzD,CAEQ,sFAAwF,CAC/F,SAAS,CAAE,YAAY,IAAI,mBAAmB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACzD,CAEQ,uFAAyF,CAChG,SAAS,CAAE,YAAY,IAAI,mBAAmB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACzD,CAEQ,mBAAqB,CAC5B,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,OAAO,CAAC,IAAI,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACvD,CAEQ,oDAAsD,CAC7D,OAAO,CAAE,CACV,CAEQ,yBAA2B,CAClC,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,UAAU,CAAE,OAAO,CACnB,gBAAgB,CAAE,OACnB,CAEQ,2DAA6D,CACpE,GAAG,CAAE,OAAO,CACZ,MAAM,CAAE,IAAI,CACZ,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,IACT,CAEQ,8DAAgE,CACvE,GAAG,CAAE,IAAI,CACT,MAAM,CAAE,OAAO,CACf,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,IACT,CAEQ,4DAA8D,CACrE,IAAI,CAAE,OAAO,CACb,KAAK,CAAE,IAAI,CACX,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,IACR,CAEQ,6DAA+D,CACtE,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,OAAO,CACd,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,IACR;AAGD;AACA;AACA;AACA,EAAI,CACF,OAAO,CAAE,CACV;AAGD;AACA;AACA;AACA,EAAI,CACF,OAAO,CAAE,CACV,CAIA,WAAmB,cAAe,CACjC,IAAK,CACL,CACA,EAAG,CACH,CACD,CAEA,MAAO,QAAQ,KAAK,CAAC,CAAC,GAAG,CAAC,UAAU,IAAI,CAAE,CACjC,kBAAoB,CAC3B,mBAAmB,CAAE,IAAI,CACtB,gBAAgB,CAAE,IAAI,CACjB,WAAW,CAAE,IACtB,CACD"}'
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "open",
    "onOpenChange",
    "closeThreshold",
    "scrollLockTimeout",
    "snapPoints",
    "fadeFromIndex",
    "openFocus",
    "onOutsideClick",
    "closeOnOutsideClick",
    "backgroundColor",
    "nested",
    "shouldScaleBackground",
    "activeSnapPoint",
    "onActiveSnapPointChange",
    "onRelease",
    "onDrag",
    "onClose",
    "dismissible",
    "direction"
  ]);
  let $isOpen, $$unsubscribe_isOpen;
  let $keyboardIsOpen, $$unsubscribe_keyboardIsOpen;
  let $localDismissible, $$unsubscribe_localDismissible;
  let { open = false } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { closeThreshold = void 0 } = $$props;
  let { scrollLockTimeout = void 0 } = $$props;
  let { snapPoints = void 0 } = $$props;
  let { fadeFromIndex = void 0 } = $$props;
  let { openFocus = void 0 } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  let { closeOnOutsideClick = true } = $$props;
  let { backgroundColor = "black" } = $$props;
  let { nested = false } = $$props;
  let { shouldScaleBackground = false } = $$props;
  let { activeSnapPoint = void 0 } = $$props;
  let { onActiveSnapPointChange = void 0 } = $$props;
  let { onRelease = void 0 } = $$props;
  let { onDrag = void 0 } = $$props;
  let { onClose = void 0 } = $$props;
  let { dismissible = void 0 } = $$props;
  let { direction = "bottom" } = $$props;
  const { states: { keyboardIsOpen, activeSnapPoint: localActiveSnapPoint, drawerId, openDrawerIds: openDrawerIds2, isOpen }, methods: { closeDrawer, openDrawer }, options: { dismissible: localDismissible }, updateOption } = setCtx({
    defaultOpen: open,
    defaultActiveSnapPoint: activeSnapPoint,
    onOpenChange: ({ next: next2 }) => {
      if (open !== next2) {
        onOpenChange?.(next2);
        open = next2;
      }
      return next2;
    },
    onActiveSnapPointChange: ({ next: next2 }) => {
      if (next2 === void 0 && snapPoints && activeSnapPoint !== next2) {
        const newNext = snapPoints[0];
        onActiveSnapPointChange?.(newNext);
        activeSnapPoint = newNext;
        return newNext;
      }
      if (activeSnapPoint !== next2) {
        onActiveSnapPointChange?.(next2);
        activeSnapPoint = next2;
      }
      return next2;
    },
    closeThreshold,
    scrollLockTimeout,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapPoints,
    fadeFromIndex,
    nested,
    onDrag,
    onClose,
    onRelease,
    shouldScaleBackground,
    backgroundColor,
    dismissible,
    direction
  });
  $$unsubscribe_keyboardIsOpen = subscribe(keyboardIsOpen, (value) => $keyboardIsOpen = value);
  $$unsubscribe_isOpen = subscribe(isOpen, (value) => $isOpen = value);
  $$unsubscribe_localDismissible = subscribe(localDismissible, (value) => $localDismissible = value);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0) $$bindings.onOpenChange(onOpenChange);
  if ($$props.closeThreshold === void 0 && $$bindings.closeThreshold && closeThreshold !== void 0) $$bindings.closeThreshold(closeThreshold);
  if ($$props.scrollLockTimeout === void 0 && $$bindings.scrollLockTimeout && scrollLockTimeout !== void 0) $$bindings.scrollLockTimeout(scrollLockTimeout);
  if ($$props.snapPoints === void 0 && $$bindings.snapPoints && snapPoints !== void 0) $$bindings.snapPoints(snapPoints);
  if ($$props.fadeFromIndex === void 0 && $$bindings.fadeFromIndex && fadeFromIndex !== void 0) $$bindings.fadeFromIndex(fadeFromIndex);
  if ($$props.openFocus === void 0 && $$bindings.openFocus && openFocus !== void 0) $$bindings.openFocus(openFocus);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0) $$bindings.onOutsideClick(onOutsideClick);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0) $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.backgroundColor === void 0 && $$bindings.backgroundColor && backgroundColor !== void 0) $$bindings.backgroundColor(backgroundColor);
  if ($$props.nested === void 0 && $$bindings.nested && nested !== void 0) $$bindings.nested(nested);
  if ($$props.shouldScaleBackground === void 0 && $$bindings.shouldScaleBackground && shouldScaleBackground !== void 0) $$bindings.shouldScaleBackground(shouldScaleBackground);
  if ($$props.activeSnapPoint === void 0 && $$bindings.activeSnapPoint && activeSnapPoint !== void 0) $$bindings.activeSnapPoint(activeSnapPoint);
  if ($$props.onActiveSnapPointChange === void 0 && $$bindings.onActiveSnapPointChange && onActiveSnapPointChange !== void 0) $$bindings.onActiveSnapPointChange(onActiveSnapPointChange);
  if ($$props.onRelease === void 0 && $$bindings.onRelease && onRelease !== void 0) $$bindings.onRelease(onRelease);
  if ($$props.onDrag === void 0 && $$bindings.onDrag && onDrag !== void 0) $$bindings.onDrag(onDrag);
  if ($$props.onClose === void 0 && $$bindings.onClose && onClose !== void 0) $$bindings.onClose(onClose);
  if ($$props.dismissible === void 0 && $$bindings.dismissible && dismissible !== void 0) $$bindings.dismissible(dismissible);
  if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0) $$bindings.direction(direction);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    activeSnapPoint !== void 0 && localActiveSnapPoint.set(activeSnapPoint);
    {
      updateOption("closeThreshold", closeThreshold);
    }
    {
      updateOption("scrollLockTimeout", scrollLockTimeout);
    }
    {
      updateOption("snapPoints", snapPoints);
    }
    {
      updateOption("fadeFromIndex", fadeFromIndex);
    }
    {
      updateOption("openFocus", openFocus);
    }
    {
      updateOption("shouldScaleBackground", shouldScaleBackground);
    }
    {
      updateOption("backgroundColor", backgroundColor);
    }
    {
      updateOption("dismissible", dismissible);
    }
    {
      updateOption("direction", direction);
    }
    open && !$isOpen && openDrawer();
    !open && $isOpen && closeDrawer();
    $$rendered = `${validate_component(Dialog, "DialogPrimitive.Root").$$render(
      $$result,
      Object.assign(
        {},
        { closeOnOutsideClick },
        { closeOnEscape: false },
        { preventScroll: false },
        {
          onOpenChange: (o) => {
            onOpenChange?.(o);
            if (!o) {
              closeDrawer();
            } else if (o) {
              openDrawer();
            }
          }
        },
        {
          onOutsideClick: (e) => {
            if (!closeOnOutsideClick) return;
            onOutsideClick?.(e);
            if (e?.defaultPrevented) return;
            if ($keyboardIsOpen) {
              keyboardIsOpen.set(false);
            }
            e.preventDefault();
            if (!$localDismissible) {
              return;
            }
            const $openDialogIds = get_store_value(openDrawerIds2);
            const isLast = $openDialogIds[$openDialogIds.length - 1] === get_store_value(drawerId);
            if (isLast) {
              onOpenChange?.(false);
              closeDrawer();
            }
          }
        },
        $$restProps,
        { open }
      ),
      {
        open: ($$value) => {
          open = $$value;
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
  $$unsubscribe_isOpen();
  $$unsubscribe_keyboardIsOpen();
  $$unsubscribe_localDismissible();
  return $$rendered;
});
const Visible = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  getCtx();
  return ``;
});
const Content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["style"]);
  let $drawerRef, $$unsubscribe_drawerRef;
  let $getContentStyle, $$unsubscribe_getContentStyle;
  let $direction, $$unsubscribe_direction;
  let $visible, $$unsubscribe_visible;
  const { refs: { drawerRef }, states: { visible }, helpers: { getContentStyle }, methods: { onPress, onDrag, onRelease }, options: { direction } } = getCtx();
  $$unsubscribe_drawerRef = subscribe(drawerRef, (value) => $drawerRef = value);
  $$unsubscribe_visible = subscribe(visible, (value) => $visible = value);
  $$unsubscribe_getContentStyle = subscribe(getContentStyle, (value) => $getContentStyle = value);
  $$unsubscribe_direction = subscribe(direction, (value) => $direction = value);
  let { style = "" } = $$props;
  if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Dialog_content, "DialogPrimitive.Content").$$render(
      $$result,
      Object.assign(
        {},
        { style: $getContentStyle(style) },
        { "data-vaul-drawer": "" },
        { "data-vaul-drawer-direction": $direction },
        {
          "data-vaul-drawer-visible": $visible ? "true" : "false"
        },
        $$restProps,
        { el: $drawerRef }
      ),
      {
        el: ($$value) => {
          $drawerRef = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Visible, "Visible").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_drawerRef();
  $$unsubscribe_getContentStyle();
  $$unsubscribe_direction();
  $$unsubscribe_visible();
  return $$rendered;
});
const Overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let hasSnapPoints;
  let $$restProps = compute_rest_props($$props, []);
  let $snapPoints, $$unsubscribe_snapPoints;
  let $overlayRef, $$unsubscribe_overlayRef;
  let $visible, $$unsubscribe_visible;
  let $isOpen, $$unsubscribe_isOpen;
  let $shouldFade, $$unsubscribe_shouldFade;
  const { refs: { overlayRef }, states: { isOpen, visible, snapPoints, shouldFade }, methods: { onRelease } } = getCtx();
  $$unsubscribe_overlayRef = subscribe(overlayRef, (value) => $overlayRef = value);
  $$unsubscribe_isOpen = subscribe(isOpen, (value) => $isOpen = value);
  $$unsubscribe_visible = subscribe(visible, (value) => $visible = value);
  $$unsubscribe_snapPoints = subscribe(snapPoints, (value) => $snapPoints = value);
  $$unsubscribe_shouldFade = subscribe(shouldFade, (value) => $shouldFade = value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    hasSnapPoints = $snapPoints && $snapPoints.length > 0;
    $$rendered = `${validate_component(Dialog_overlay, "DialogPrimitive.Overlay").$$render(
      $$result,
      Object.assign(
        {},
        {
          "data-vaul-drawer-visible": $visible ? "true" : "false"
        },
        { "data-vaul-overlay": "" },
        {
          "data-vaul-snap-points": $isOpen && hasSnapPoints ? "true" : "false"
        },
        {
          "data-vaul-snap-points-overlay": $isOpen && $shouldFade ? "true" : "false"
        },
        $$restProps,
        { el: $overlayRef }
      ),
      {
        el: ($$value) => {
          $overlayRef = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_snapPoints();
  $$unsubscribe_overlayRef();
  $$unsubscribe_visible();
  $$unsubscribe_isOpen();
  $$unsubscribe_shouldFade();
  return $$rendered;
});
const Close_wrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let _;
  let rest;
  let { meltBuilder } = $$props;
  const { methods: { closeDrawer } } = getCtx();
  const wrappedAction = (node) => {
    const handleKeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeDrawer(true);
      }
    };
    const handleClick = () => {
      closeDrawer();
    };
    node.addEventListener("keydown", handleKeydown);
    node.addEventListener("click", handleClick);
    return () => {
      node.removeEventListener("keydown", handleKeydown);
      node.removeEventListener("click", handleClick);
    };
  };
  if ($$props.meltBuilder === void 0 && $$bindings.meltBuilder && meltBuilder !== void 0) $$bindings.meltBuilder(meltBuilder);
  ({ _, ...rest } = meltBuilder);
  {
    Object.assign(rest, { action: wrappedAction });
  }
  return `${slots.default ? slots.default({ newBuilder: rest }) : ``}`;
});
const Close$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "asChild"]);
  let { el = void 0 } = $$props;
  let { asChild = false } = $$props;
  getCtx();
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${asChild ? `${validate_component(Dialog_close, "DialogPrimitive.Close").$$render(
      $$result,
      Object.assign({}, $$restProps, { asChild }, { el }),
      {
        el: ($$value) => {
          el = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ builder }) => {
          return `${validate_component(Close_wrapper, "CloseWrapper").$$render($$result, { meltBuilder: builder }, {}, {
            default: ({ newBuilder }) => {
              return `${slots.default ? slots.default({ builder: newBuilder }) : ``}`;
            }
          })}`;
        }
      }
    )}` : `${validate_component(Dialog_close, "DialogPrimitive.Close").$$render(
      $$result,
      Object.assign({}, $$restProps, { asChild }, { el }),
      {
        el: ($$value) => {
          el = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ builder }) => {
          return `${slots.default ? slots.default({ builder }) : ``}`;
        }
      }
    )}`}`;
  } while (!$$settled);
  return $$rendered;
});
const Trigger_wrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let action;
  let rest;
  let { meltBuilder } = $$props;
  const { refs: { triggerRef } } = getCtx();
  const wrappedAction = (node) => {
    triggerRef.set(node);
    return action(node);
  };
  if ($$props.meltBuilder === void 0 && $$bindings.meltBuilder && meltBuilder !== void 0) $$bindings.meltBuilder(meltBuilder);
  ({ action, ...rest } = meltBuilder);
  {
    Object.assign(rest, { action: wrappedAction });
  }
  return `${slots.default ? slots.default({ newBuilder: rest }) : ``}`;
});
const Trigger$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "asChild"]);
  const { refs: { triggerRef } } = getCtx();
  let { el = void 0 } = $$props;
  let { asChild = false } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (el) {
        triggerRef.set(el);
      }
    }
    $$rendered = `${asChild ? `${validate_component(Dialog_trigger, "DialogPrimitive.Trigger").$$render(
      $$result,
      Object.assign({}, { asChild }, $$restProps, { el }),
      {
        el: ($$value) => {
          el = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ builder }) => {
          return `${validate_component(Trigger_wrapper, "TriggerWrapper").$$render($$result, { meltBuilder: builder }, {}, {
            default: ({ newBuilder }) => {
              return `${slots.default ? slots.default({ builder: newBuilder }) : ``}`;
            }
          })}`;
        }
      }
    )}` : `${validate_component(Dialog_trigger, "DialogPrimitive.Trigger").$$render(
      $$result,
      Object.assign({}, $$restProps, { el }),
      {
        el: ($$value) => {
          el = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ builder }) => {
          return `${slots.default ? slots.default({ builder }) : ``}`;
        }
      }
    )}`}`;
  } while (!$$settled);
  return $$rendered;
});
const Portal = Dialog_portal;
const Title = Dialog_title;
const Drawer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["shouldScaleBackground", "open", "activeSnapPoint"]);
  let { shouldScaleBackground = true } = $$props;
  let { open = false } = $$props;
  let { activeSnapPoint = void 0 } = $$props;
  if ($$props.shouldScaleBackground === void 0 && $$bindings.shouldScaleBackground && shouldScaleBackground !== void 0) $$bindings.shouldScaleBackground(shouldScaleBackground);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.activeSnapPoint === void 0 && $$bindings.activeSnapPoint && activeSnapPoint !== void 0) $$bindings.activeSnapPoint(activeSnapPoint);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Root, "DrawerPrimitive.Root").$$render(
      $$result,
      Object.assign({}, { shouldScaleBackground }, $$restProps, { open }, { activeSnapPoint }),
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        },
        activeSnapPoint: ($$value) => {
          activeSnapPoint = $$value;
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
const Drawer_overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Overlay, "DrawerPrimitive.Overlay").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn("fixed inset-0 z-50 bg-black/80", className)
        },
        $$restProps,
        { el }
      ),
      {
        el: ($$value) => {
          el = $$value;
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
const Drawer_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Portal, "DrawerPrimitive.Portal").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Drawer_overlay, "DrawerOverlay").$$render($$result, {}, {}, {})} ${validate_component(Content, "DrawerPrimitive.Content").$$render(
        $$result,
        Object.assign(
          {},
          {
            class: cn(`bg-background fixed h-auto  z-50 flex flex-col rounded-t-[10px] border`, className ? className : "mt-24 inset-x-0 bottom-0")
          },
          $$restProps
        ),
        {},
        {
          default: () => {
            return `<div class="bg-muted mx-auto mt-4 h-2 w-[100px] rounded-full"></div> ${slots.default ? slots.default({}) : ``}`;
          }
        }
      )}`;
    }
  })}`;
});
const Drawer_footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("mt-auto flex flex-col gap-2 p-4", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Drawer_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("grid gap-1.5 p-4 text-center sm:text-left", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Drawer_title = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Title, "DrawerPrimitive.Title").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn("text-lg font-semibold leading-none tracking-tight", className)
        },
        $$restProps,
        { el }
      ),
      {
        el: ($$value) => {
          el = $$value;
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
const Trigger = Trigger$1;
const Close = Close$1;
const PlatformInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { allPlatforms } = $$props;
  let { values } = $$props;
  let { onChange } = $$props;
  if ($$props.allPlatforms === void 0 && $$bindings.allPlatforms && allPlatforms !== void 0) $$bindings.allPlatforms(allPlatforms);
  if ($$props.values === void 0 && $$bindings.values && values !== void 0) $$bindings.values(values);
  if ($$props.onChange === void 0 && $$bindings.onChange && onChange !== void 0) $$bindings.onChange(onChange);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${values ? `<ul class="space-y-2">${each(values, (value, index) => {
      let selectedPlatform = value ? { value: value.id, label: value.name } : void 0;
      return ` <li class="flex items-center justify-between gap-1"><div class="flex-1 p-0 rounded-md overflow-hidden">${validate_component(Root$1, "Select.Root").$$render(
        $$result,
        {
          selected: selectedPlatform,
          onSelectedChange: (v) => {
            if (!v) {
              return;
            }
            const newPlatforms = values ?? [];
            newPlatforms[index] = {
              ...value,
              id: v.value,
              name: v?.label ?? ""
            };
            onChange(newPlatforms);
          }
        },
        {},
        {
          default: () => {
            return `${validate_component(Select_trigger, "Select.Trigger").$$render(
              $$result,
              {
                class: "w-full h-8 text-xs bg-slate-100 border-none rounded-none"
              },
              {},
              {
                default: () => {
                  return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "플랫폼을 선택하세요..." }, {}, {})} `;
                }
              }
            )} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Scroll_area, "ScrollArea").$$render($$result, { class: "h-[200px]" }, {}, {
                  default: () => {
                    return `${!allPlatforms || allPlatforms.length === 0 ? `<p class="text-center p-5" data-svelte-h="svelte-1j5png0">장르를 먼저 선택해주세요.</p>` : `${each(allPlatforms, (platform) => {
                      return `${validate_component(Select_item, "Select.Item").$$render($$result, { value: platform.id, label: platform.name }, {}, {})}`;
                    })}`} `;
                  }
                })} `;
              }
            })} `;
          }
        }
      )} ${validate_component(Input$1, "Input").$$render(
        $$result,
        {
          class: "text-xs h-8 rounded-none border-slate-100",
          autocomplete: "off",
          value: value.url
        },
        {
          value: ($$value) => {
            value.url = $$value;
            $$settled = false;
          }
        },
        {}
      )}</div> <div class="w-fit h-fit p-0">${validate_component(Button, "Button").$$render(
        $$result,
        {
          variant: "ghost",
          class: "w-fit h-fit p-2"
        },
        {},
        {
          default: () => {
            return `${validate_component(X, "XIcon").$$render($$result, { class: "h-4 w-4 text-slate-400" }, {}, {})}`;
          }
        }
      )}</div> </li>`;
    })}</ul>` : ``} ${validate_component(Button, "Button").$$render(
      $$result,
      {
        variant: "ghost",
        class: "flex gap-1 items-center w-fit"
      },
      {},
      {
        default: () => {
          return `${validate_component(Plus, "Plus").$$render($$result, { class: "h-5 w-5 text-slate-400" }, {}, {})} <div class="underline underline-offset-2" data-svelte-h="svelte-bc5ud2">&#39;플랫폼 추가</div>`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
function restrictPosition(position, imageSize, cropSize, zoom) {
  return {
    x: restrictPositionCoord(position.x, imageSize.width, cropSize.width, zoom),
    y: restrictPositionCoord(position.y, imageSize.height, cropSize.height, zoom)
  };
}
function restrictPositionCoord(position, imageSize, cropSize, zoom) {
  let maxPosition = imageSize * zoom / 2 - cropSize / 2;
  if (zoom < 1) {
    maxPosition = cropSize / 2 - imageSize * zoom / 2;
  }
  return Math.min(maxPosition, Math.max(position, -maxPosition));
}
function getDistanceBetweenPoints(pointA, pointB) {
  return Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2));
}
function getCenter(a, b) {
  return {
    x: (b.x + a.x) / 2,
    y: (b.y + a.y) / 2
  };
}
const css = {
  code: ".svelte-easy-crop-container.svelte-15oki7n{position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;user-select:none;touch-action:none;cursor:move}.svelte-easy-crop-image.svelte-15oki7n{max-width:100%;max-height:100%;margin:auto;position:absolute;top:0;bottom:0;left:0;right:0;will-change:transform}.svelte-easy-crop-area.svelte-15oki7n{position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);box-shadow:0 0 0 9999em;box-sizing:border-box;color:rgba(0, 0, 0, 0.5);border:1px solid rgba(255, 255, 255, 0.5);overflow:hidden}.svelte-easy-crop-grid.svelte-15oki7n:before{content:' ';box-sizing:border-box;border:1px solid rgba(255, 255, 255, 0.5);position:absolute;top:0;bottom:0;left:33.33%;right:33.33%;border-top:0;border-bottom:0}.svelte-easy-crop-grid.svelte-15oki7n:after{content:' ';box-sizing:border-box;border:1px solid rgba(255, 255, 255, 0.5);position:absolute;top:33.33%;bottom:33.33%;left:0;right:0;border-left:0;border-right:0}.svelte-easy-crop-round.svelte-15oki7n{border-radius:50%}",
  map: `{"version":3,"file":"Cropper.svelte","sources":["Cropper.svelte"],"sourcesContent":["<script>import { createEventDispatcher, onDestroy, onMount } from \\"svelte\\";\\nimport * as helpers from \\"./helpers\\";\\nexport let image;\\nexport let crop = { x: 0, y: 0 };\\nexport let zoom = 1;\\nexport let aspect = 4 / 3;\\nexport let minZoom = 1;\\nexport let maxZoom = 3;\\nexport let cropSize = null;\\nexport let cropShape = \\"rect\\";\\nexport let showGrid = true;\\nexport let zoomSpeed = 1;\\nexport let crossOrigin = null;\\nexport let restrictPosition = true;\\nexport let tabindex = void 0;\\nlet cropperSize = null;\\nlet imageSize = { width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 };\\nlet containerEl = null;\\nlet containerRect = null;\\nlet imgEl = null;\\nlet dragStartPosition = { x: 0, y: 0 };\\nlet dragStartCrop = { x: 0, y: 0 };\\nlet lastPinchDistance = 0;\\nlet rafDragTimeout = null;\\nlet rafZoomTimeout = null;\\nconst dispatch = createEventDispatcher();\\nonMount(() => {\\n  if (imgEl && imgEl.complete) {\\n    onImgLoad();\\n  }\\n  if (containerEl) {\\n    containerEl.addEventListener(\\"gesturestart\\", preventZoomSafari);\\n    containerEl.addEventListener(\\"gesturechange\\", preventZoomSafari);\\n  }\\n});\\nonDestroy(() => {\\n  if (containerEl) {\\n    containerEl.removeEventListener(\\"gesturestart\\", preventZoomSafari);\\n    containerEl.removeEventListener(\\"gesturechange\\", preventZoomSafari);\\n  }\\n  cleanEvents();\\n});\\nconst preventZoomSafari = (e) => e.preventDefault();\\nconst cleanEvents = () => {\\n  if (typeof document !== \\"undefined\\") {\\n    document.removeEventListener(\\"mousemove\\", onMouseMove);\\n    document.removeEventListener(\\"mouseup\\", onDragStopped);\\n    document.removeEventListener(\\"touchmove\\", onTouchMove);\\n    document.removeEventListener(\\"touchend\\", onDragStopped);\\n  }\\n};\\nconst onImgLoad = () => {\\n  computeSizes();\\n  emitCropData();\\n};\\nconst getAspect = () => {\\n  if (cropSize) {\\n    return cropSize.width / cropSize.height;\\n  }\\n  return aspect;\\n};\\nconst computeSizes = () => {\\n  if (imgEl) {\\n    imageSize = {\\n      width: imgEl.width,\\n      height: imgEl.height,\\n      naturalWidth: imgEl.naturalWidth,\\n      naturalHeight: imgEl.naturalHeight\\n    };\\n    cropperSize = cropSize ? cropSize : helpers.getCropSize(imgEl.width, imgEl.height, aspect);\\n  }\\n  if (containerEl) {\\n    containerRect = containerEl.getBoundingClientRect();\\n  }\\n};\\nconst getMousePoint = (e) => ({\\n  x: Number(e.clientX),\\n  y: Number(e.clientY)\\n});\\nconst getTouchPoint = (touch) => ({\\n  x: Number(touch.clientX),\\n  y: Number(touch.clientY)\\n});\\nconst onMouseDown = (e) => {\\n  document.addEventListener(\\"mousemove\\", onMouseMove);\\n  document.addEventListener(\\"mouseup\\", onDragStopped);\\n  onDragStart(getMousePoint(e));\\n};\\nconst onMouseMove = (e) => onDrag(getMousePoint(e));\\nconst onTouchStart = (e) => {\\n  document.addEventListener(\\"touchmove\\", onTouchMove, { passive: false });\\n  document.addEventListener(\\"touchend\\", onDragStopped);\\n  if (e.touches.length === 2) {\\n    onPinchStart(e);\\n  } else if (e.touches.length === 1) {\\n    onDragStart(getTouchPoint(e.touches[0]));\\n  }\\n};\\nconst onTouchMove = (e) => {\\n  e.preventDefault();\\n  if (e.touches.length === 2) {\\n    onPinchMove(e);\\n  } else if (e.touches.length === 1) {\\n    onDrag(getTouchPoint(e.touches[0]));\\n  }\\n};\\nconst onDragStart = ({ x, y }) => {\\n  dragStartPosition = { x, y };\\n  dragStartCrop = { x: crop.x, y: crop.y };\\n};\\nconst onDrag = ({ x, y }) => {\\n  if (rafDragTimeout)\\n    window.cancelAnimationFrame(rafDragTimeout);\\n  rafDragTimeout = window.requestAnimationFrame(() => {\\n    if (x === void 0 || y === void 0 || !cropperSize)\\n      return;\\n    const offsetX = x - dragStartPosition.x;\\n    const offsetY = y - dragStartPosition.y;\\n    const requestedPosition = {\\n      x: dragStartCrop.x + offsetX,\\n      y: dragStartCrop.y + offsetY\\n    };\\n    crop = restrictPosition ? helpers.restrictPosition(requestedPosition, imageSize, cropperSize, zoom) : requestedPosition;\\n  });\\n};\\nconst onDragStopped = () => {\\n  cleanEvents();\\n  emitCropData();\\n};\\nconst onPinchStart = (e) => {\\n  const pointA = getTouchPoint(e.touches[0]);\\n  const pointB = getTouchPoint(e.touches[1]);\\n  lastPinchDistance = helpers.getDistanceBetweenPoints(pointA, pointB);\\n  onDragStart(helpers.getCenter(pointA, pointB));\\n};\\nconst onPinchMove = (e) => {\\n  const pointA = getTouchPoint(e.touches[0]);\\n  const pointB = getTouchPoint(e.touches[1]);\\n  const center = helpers.getCenter(pointA, pointB);\\n  onDrag(center);\\n  if (rafZoomTimeout)\\n    window.cancelAnimationFrame(rafZoomTimeout);\\n  rafZoomTimeout = window.requestAnimationFrame(() => {\\n    const distance = helpers.getDistanceBetweenPoints(pointA, pointB);\\n    const newZoom = zoom * (distance / lastPinchDistance);\\n    setNewZoom(newZoom, center);\\n    lastPinchDistance = distance;\\n  });\\n};\\nconst onWheel = (e) => {\\n  const point = getMousePoint(e);\\n  const newZoom = zoom - e.deltaY * zoomSpeed / 200;\\n  setNewZoom(newZoom, point);\\n};\\nconst getPointOnContainer = ({ x, y }) => {\\n  if (!containerRect) {\\n    throw new Error(\\"The Cropper is not mounted\\");\\n  }\\n  return {\\n    x: containerRect.width / 2 - (x - containerRect.left),\\n    y: containerRect.height / 2 - (y - containerRect.top)\\n  };\\n};\\nconst getPointOnImage = ({ x, y }) => ({\\n  x: (x + crop.x) / zoom,\\n  y: (y + crop.y) / zoom\\n});\\nconst setNewZoom = (newZoom, point) => {\\n  if (!cropperSize)\\n    return;\\n  const zoomPoint = getPointOnContainer(point);\\n  const zoomTarget = getPointOnImage(zoomPoint);\\n  zoom = Math.min(maxZoom, Math.max(newZoom, minZoom));\\n  const requestedPosition = {\\n    x: zoomTarget.x * zoom - zoomPoint.x,\\n    y: zoomTarget.y * zoom - zoomPoint.y\\n  };\\n  crop = restrictPosition ? helpers.restrictPosition(requestedPosition, imageSize, cropperSize, zoom) : requestedPosition;\\n};\\nconst emitCropData = () => {\\n  if (!cropperSize || cropperSize.width === 0)\\n    return;\\n  const position = restrictPosition ? helpers.restrictPosition(crop, imageSize, cropperSize, zoom) : crop;\\n  const { croppedAreaPercentages, croppedAreaPixels } = helpers.computeCroppedArea(\\n    position,\\n    imageSize,\\n    cropperSize,\\n    getAspect(),\\n    zoom,\\n    restrictPosition\\n  );\\n  dispatch(\\"cropcomplete\\", {\\n    percent: croppedAreaPercentages,\\n    pixels: croppedAreaPixels\\n  });\\n};\\n$:\\n  if (imgEl) {\\n    cropperSize = cropSize ? cropSize : helpers.getCropSize(imgEl.width, imgEl.height, aspect);\\n  }\\n$:\\n  zoom && emitCropData();\\n$:\\n  if (aspect) {\\n    computeSizes();\\n    emitCropData();\\n  }\\n<\/script>\\n\\n<svelte:window on:resize={computeSizes} />\\n<div\\n  class=\\"svelte-easy-crop-container\\"\\n  bind:this={containerEl}\\n  on:mousedown|preventDefault={onMouseDown}\\n  on:touchstart|nonpassive|preventDefault={onTouchStart}\\n  on:wheel|nonpassive|preventDefault={onWheel}\\n  {tabindex}\\n  role=\\"button\\"\\n  data-testid=\\"container\\"\\n>\\n  <img\\n    bind:this={imgEl}\\n    class=\\"svelte-easy-crop-image\\"\\n    src={image}\\n    on:load={onImgLoad}\\n    alt=\\"\\"\\n    style=\\"transform: translate({crop.x}px, {crop.y}px) scale({zoom});\\"\\n    crossorigin={crossOrigin}\\n  />\\n  {#if cropperSize}\\n    <div\\n      class=\\"svelte-easy-crop-area\\"\\n      class:svelte-easy-crop-round={cropShape === 'round'}\\n      class:svelte-easy-crop-grid={showGrid}\\n      style=\\"width: {cropperSize.width}px; height: {cropperSize.height}px;\\"\\n      data-testid=\\"cropper\\"\\n    />\\n  {/if}\\n</div>\\n\\n<style>\\n  .svelte-easy-crop-container {\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    right: 0;\\n    bottom: 0;\\n    overflow: hidden;\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n            user-select: none;\\n    touch-action: none;\\n    cursor: move;\\n  }\\n\\n  .svelte-easy-crop-image {\\n    max-width: 100%;\\n    max-height: 100%;\\n    margin: auto;\\n    position: absolute;\\n    top: 0;\\n    bottom: 0;\\n    left: 0;\\n    right: 0;\\n    will-change: transform;\\n  }\\n\\n  .svelte-easy-crop-area {\\n    position: absolute;\\n    left: 50%;\\n    top: 50%;\\n    transform: translate(-50%, -50%);\\n    box-shadow: 0 0 0 9999em;\\n    box-sizing: border-box;\\n    color: rgba(0, 0, 0, 0.5);\\n    border: 1px solid rgba(255, 255, 255, 0.5);\\n    overflow: hidden;\\n  }\\n\\n  .svelte-easy-crop-grid:before {\\n    content: ' ';\\n    box-sizing: border-box;\\n    border: 1px solid rgba(255, 255, 255, 0.5);\\n    position: absolute;\\n    top: 0;\\n    bottom: 0;\\n    left: 33.33%;\\n    right: 33.33%;\\n    border-top: 0;\\n    border-bottom: 0;\\n  }\\n\\n  .svelte-easy-crop-grid:after {\\n    content: ' ';\\n    box-sizing: border-box;\\n    border: 1px solid rgba(255, 255, 255, 0.5);\\n    position: absolute;\\n    top: 33.33%;\\n    bottom: 33.33%;\\n    left: 0;\\n    right: 0;\\n    border-left: 0;\\n    border-right: 0;\\n  }\\n\\n  .svelte-easy-crop-round {\\n    border-radius: 50%;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAiPE,0CAA4B,CAC1B,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,CACT,QAAQ,CAAE,MAAM,CAChB,mBAAmB,CAAE,IAAI,CACtB,gBAAgB,CAAE,IAAI,CACjB,WAAW,CAAE,IAAI,CACzB,YAAY,CAAE,IAAI,CAClB,MAAM,CAAE,IACV,CAEA,sCAAwB,CACtB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,WAAW,CAAE,SACf,CAEA,qCAAuB,CACrB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,UAAU,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,MAAM,CACxB,UAAU,CAAE,UAAU,CACtB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACzB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAC1C,QAAQ,CAAE,MACZ,CAEA,qCAAsB,OAAQ,CAC5B,OAAO,CAAE,GAAG,CACZ,UAAU,CAAE,UAAU,CACtB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAC1C,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,MAAM,CACZ,KAAK,CAAE,MAAM,CACb,UAAU,CAAE,CAAC,CACb,aAAa,CAAE,CACjB,CAEA,qCAAsB,MAAO,CAC3B,OAAO,CAAE,GAAG,CACZ,UAAU,CAAE,UAAU,CACtB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAC1C,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,MAAM,CACX,MAAM,CAAE,MAAM,CACd,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,WAAW,CAAE,CAAC,CACd,YAAY,CAAE,CAChB,CAEA,sCAAwB,CACtB,aAAa,CAAE,GACjB"}`
};
const Cropper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { image } = $$props;
  let { crop = { x: 0, y: 0 } } = $$props;
  let { zoom = 1 } = $$props;
  let { aspect = 4 / 3 } = $$props;
  let { minZoom = 1 } = $$props;
  let { maxZoom = 3 } = $$props;
  let { cropSize = null } = $$props;
  let { cropShape = "rect" } = $$props;
  let { showGrid = true } = $$props;
  let { zoomSpeed = 1 } = $$props;
  let { crossOrigin = null } = $$props;
  let { restrictPosition: restrictPosition$1 = true } = $$props;
  let { tabindex = void 0 } = $$props;
  let cropperSize = null;
  let imageSize = {
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0
  };
  let containerEl = null;
  let imgEl = null;
  let dragStartPosition = { x: 0, y: 0 };
  let dragStartCrop = { x: 0, y: 0 };
  let rafDragTimeout = null;
  let rafZoomTimeout = null;
  createEventDispatcher();
  onDestroy(() => {
    cleanEvents();
  });
  const cleanEvents = () => {
    if (typeof document !== "undefined") {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onDragStopped);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onDragStopped);
    }
  };
  const getMousePoint = (e) => ({
    x: Number(e.clientX),
    y: Number(e.clientY)
  });
  const getTouchPoint = (touch) => ({
    x: Number(touch.clientX),
    y: Number(touch.clientY)
  });
  const onMouseMove = (e) => onDrag(getMousePoint(e));
  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      onPinchMove(e);
    } else if (e.touches.length === 1) {
      onDrag(getTouchPoint(e.touches[0]));
    }
  };
  const onDrag = ({ x, y }) => {
    if (rafDragTimeout) window.cancelAnimationFrame(rafDragTimeout);
    rafDragTimeout = window.requestAnimationFrame(() => {
      if (x === void 0 || y === void 0 || !cropperSize) return;
      const offsetX = x - dragStartPosition.x;
      const offsetY = y - dragStartPosition.y;
      const requestedPosition = {
        x: dragStartCrop.x + offsetX,
        y: dragStartCrop.y + offsetY
      };
      crop = restrictPosition$1 ? restrictPosition(requestedPosition, imageSize, cropperSize, zoom) : requestedPosition;
    });
  };
  const onDragStopped = () => {
    cleanEvents();
    emitCropData();
  };
  const onPinchMove = (e) => {
    const pointA = getTouchPoint(e.touches[0]);
    const pointB = getTouchPoint(e.touches[1]);
    const center = getCenter(pointA, pointB);
    onDrag(center);
    if (rafZoomTimeout) window.cancelAnimationFrame(rafZoomTimeout);
    rafZoomTimeout = window.requestAnimationFrame(() => {
      getDistanceBetweenPoints(pointA, pointB);
      setNewZoom();
    });
  };
  const setNewZoom = (newZoom, point) => {
    return;
  };
  const emitCropData = () => {
    return;
  };
  if ($$props.image === void 0 && $$bindings.image && image !== void 0) $$bindings.image(image);
  if ($$props.crop === void 0 && $$bindings.crop && crop !== void 0) $$bindings.crop(crop);
  if ($$props.zoom === void 0 && $$bindings.zoom && zoom !== void 0) $$bindings.zoom(zoom);
  if ($$props.aspect === void 0 && $$bindings.aspect && aspect !== void 0) $$bindings.aspect(aspect);
  if ($$props.minZoom === void 0 && $$bindings.minZoom && minZoom !== void 0) $$bindings.minZoom(minZoom);
  if ($$props.maxZoom === void 0 && $$bindings.maxZoom && maxZoom !== void 0) $$bindings.maxZoom(maxZoom);
  if ($$props.cropSize === void 0 && $$bindings.cropSize && cropSize !== void 0) $$bindings.cropSize(cropSize);
  if ($$props.cropShape === void 0 && $$bindings.cropShape && cropShape !== void 0) $$bindings.cropShape(cropShape);
  if ($$props.showGrid === void 0 && $$bindings.showGrid && showGrid !== void 0) $$bindings.showGrid(showGrid);
  if ($$props.zoomSpeed === void 0 && $$bindings.zoomSpeed && zoomSpeed !== void 0) $$bindings.zoomSpeed(zoomSpeed);
  if ($$props.crossOrigin === void 0 && $$bindings.crossOrigin && crossOrigin !== void 0) $$bindings.crossOrigin(crossOrigin);
  if ($$props.restrictPosition === void 0 && $$bindings.restrictPosition && restrictPosition$1 !== void 0) $$bindings.restrictPosition(restrictPosition$1);
  if ($$props.tabindex === void 0 && $$bindings.tabindex && tabindex !== void 0) $$bindings.tabindex(tabindex);
  $$result.css.add(css);
  return ` <div class="svelte-easy-crop-container svelte-15oki7n"${add_attribute("tabindex", tabindex, 0)} role="button" data-testid="container"${add_attribute("this", containerEl, 0)}><img class="svelte-easy-crop-image svelte-15oki7n"${add_attribute("src", image, 0)} alt="" style="${"transform: translate(" + escape(crop.x, true) + "px, " + escape(crop.y, true) + "px) scale(" + escape(zoom, true) + ");"}"${add_attribute("crossorigin", crossOrigin, 0)}${add_attribute("this", imgEl, 0)}> ${``} </div>`;
});
const createImage = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.addEventListener("load", () => resolve(image));
  image.addEventListener("error", (error) => reject(error));
  image.setAttribute("crossOrigin", "anonymous");
  image.src = url;
});
function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}
function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
  };
}
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, flip = { horizontal: false, vertical: false }) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "";
  }
  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  if (!croppedCtx) {
    return "";
  }
  croppedCanvas.width = pixelCrop.w;
  croppedCanvas.height = pixelCrop.h;
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.w,
    pixelCrop.h,
    0,
    0,
    pixelCrop.w,
    pixelCrop.h
  );
  return new Promise((resolve) => {
    croppedCanvas.toBlob((file) => {
      if (file) resolve(croppedCanvas.toDataURL());
    }, "image/jpeg");
  });
}
const ImageCrop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { image } = $$props;
  let { type = "card" } = $$props;
  let { cropArea } = $$props;
  let { handleConfirm } = $$props;
  let aspect = type === "card" ? 300 / 124 : 105 / 150;
  let open = false;
  let cropImage = image;
  async function crop() {
    if (!image) {
      return;
    }
    if (!cropArea) {
      return;
    }
    cropImage = await getCroppedImg(image, cropArea, 0);
  }
  if ($$props.image === void 0 && $$bindings.image && image !== void 0) $$bindings.image(image);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.cropArea === void 0 && $$bindings.cropArea && cropArea !== void 0) $$bindings.cropArea(cropArea);
  if ($$props.handleConfirm === void 0 && $$bindings.handleConfirm && handleConfirm !== void 0) $$bindings.handleConfirm(handleConfirm);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      cropImage = image;
    }
    {
      crop();
    }
    $$rendered = `${image ? `${validate_component(Root$2, "Dialog.Root").$$render(
      $$result,
      { open },
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Dialog_content$1, "Dialog.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title$1, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `이미지 편집`;
                    }
                  })} ${validate_component(Dialog_description, "Dialog.Description").$$render($$result, {}, {}, {
                    default: () => {
                      return `이미지가 어쩌고저쩌고`;
                    }
                  })}`;
                }
              })} <div style="position: relative; background: #fff; height: 400px; width: 100%;">${validate_component(Cropper, "Cropper").$$render(
                $$result,
                {
                  image,
                  zoom: 1,
                  crop: { x: 0, y: 0 },
                  aspect
                },
                {},
                {}
              )}</div> ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                    default: () => {
                      return `확인`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )} <div class="${"relative group rounded-md drop-shadow-md " + escape(
      type === "card" ? "w-[300px] h-[124px]" : "w-[105px] h-[150px]",
      true
    )}"><img loading="lazy" decoding="async"${add_attribute("src", cropImage, 0)}${add_attribute("alt", `fdfdfd`, 0)} class="object-cover content-visibility-auto transition-all duration-300 w-full h-full"> <div class="absolute rounded-md inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 w-full h-full">${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `수정하기`;
      }
    })}</div></div>` : ``}`;
  } while (!$$settled);
  return $$rendered;
});
const DataEditDrawer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedGenre;
  let $categories, $$unsubscribe_categories;
  let $keywords, $$unsubscribe_keywords;
  let $cautions, $$unsubscribe_cautions;
  $$unsubscribe_categories = subscribe(categories, (value2) => $categories = value2);
  $$unsubscribe_keywords = subscribe(keywords, (value2) => $keywords = value2);
  $$unsubscribe_cautions = subscribe(cautions, (value2) => $cautions = value2);
  let { action = "add" } = $$props;
  let { value = { title: "" } } = $$props;
  let formData;
  let open = false;
  const handleReset = () => {
    formData = cloneDeep(value);
  };
  if ($$props.action === void 0 && $$bindings.action && action !== void 0) $$bindings.action(action);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      handleReset();
    }
    selectedGenre = formData?.genre ? {
      label: formData.genre.name,
      value: formData.genre.id
    } : { label: "", value: -1 };
    $$rendered = `${validate_component(Drawer, "Drawer.Root").$$render(
      $$result,
      {
        shouldScaleBackground: false,
        direction: "right",
        open
      },
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Trigger, "Drawer.Trigger").$$render($$result, {}, {}, {
            default: ({ builder }) => {
              return `${validate_component(Button, "Button").$$render(
                $$result,
                {
                  builders: [builder],
                  class: "text-sm h-[30px]"
                },
                {},
                {
                  default: () => {
                    return `${escape(action === "add" ? "데이터 추가" : "수정")}`;
                  }
                }
              )}`;
            }
          })} ${validate_component(Drawer_content, "Drawer.Content").$$render(
            $$result,
            {
              class: "inset-y-0 right-0 h-full w-screen max-w-96"
            },
            {},
            {
              default: () => {
                return `${validate_component(Drawer_header, "Drawer.Header").$$render($$result, { class: "flex flex-row justify-between" }, {}, {
                  default: () => {
                    return `${validate_component(Drawer_title, "Drawer.Title").$$render($$result, {}, {}, {
                      default: () => {
                        return `데이터 ${escape(action === "add" ? "추가" : "수정")}`;
                      }
                    })} ${validate_component(Close, "Drawer.Close").$$render($$result, {}, {}, {
                      default: () => {
                        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${add_attribute("stroke-width", 1.5, 0)} stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg>`;
                      }
                    })}`;
                  }
                })} ${validate_component(Scroll_area, "ScrollArea").$$render($$result, { class: "h-full w-full" }, {}, {
                  default: () => {
                    return `<form method="POST" class="p-4 space-y-6"><div>${validate_component(Label, "Label").$$render($$result, {}, {}, {
                      default: () => {
                        return `제목`;
                      }
                    })} ${validate_component(Input$1, "Input").$$render(
                      $$result,
                      {
                        id: "title",
                        name: "title",
                        autocomplete: "off",
                        value: formData.title
                      },
                      {
                        value: ($$value) => {
                          formData.title = $$value;
                          $$settled = false;
                        }
                      },
                      {}
                    )}</div> <div>${validate_component(Label, "Label").$$render($$result, {}, {}, {
                      default: () => {
                        return `작가/감독`;
                      }
                    })} ${validate_component(Input$1, "Input").$$render(
                      $$result,
                      {
                        id: "creators",
                        name: "creators",
                        autocomplete: "off",
                        value: formData.creators
                      },
                      {
                        value: ($$value) => {
                          formData.creators = $$value;
                          $$settled = false;
                        }
                      },
                      {}
                    )}</div> <div>${validate_component(Label, "Label").$$render($$result, {}, {}, {
                      default: () => {
                        return `카테고리/장르`;
                      }
                    })} ${validate_component(Root$1, "Select.Root").$$render($$result, { selected: selectedGenre }, {}, {
                      default: () => {
                        return `${validate_component(Select_trigger, "Select.Trigger").$$render($$result, { class: "w-full" }, {}, {
                          default: () => {
                            return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "카테고리/장르를 선택하세요." }, {}, {})}`;
                          }
                        })} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(Scroll_area, "ScrollArea").$$render($$result, { class: "h-[200px] w-full" }, {}, {
                              default: () => {
                                return `${each($categories, (category) => {
                                  return `${validate_component(Group, "Select.Group").$$render($$result, {}, {}, {
                                    default: () => {
                                      return `${validate_component(Select_label, "Select.Label").$$render($$result, { class: "pl-2" }, {}, {
                                        default: () => {
                                          return `${escape(category.name)}`;
                                        }
                                      })} <div>${each(category.genres, (genre) => {
                                        return `${validate_component(Select_item, "Select.Item").$$render($$result, { value: genre.id, label: genre.name }, {}, {
                                          default: () => {
                                            return `${escape(genre.name)}`;
                                          }
                                        })}`;
                                      })}</div> `;
                                    }
                                  })}`;
                                })}`;
                              }
                            })}`;
                          }
                        })} ${validate_component(Input, "Select.Input").$$render(
                          $$result,
                          {
                            id: "category",
                            name: "category",
                            value: formData.genre
                          },
                          {
                            value: ($$value) => {
                              formData.genre = $$value;
                              $$settled = false;
                            }
                          },
                          {}
                        )}`;
                      }
                    })}</div> <div>${validate_component(Label, "Label").$$render($$result, {}, {}, {
                      default: () => {
                        return `키워드`;
                      }
                    })} ${validate_component(KeywordSelect, "KeywordSelect").$$render(
                      $$result,
                      {
                        allKeywords: $keywords,
                        values: formData.keywords ?? [],
                        limitCount: 5,
                        limitMessage: "키워드는 5개까지 선택할 수 있습니다.",
                        onChange: (newValues) => {
                          formData.keywords = newValues;
                        }
                      },
                      {},
                      {}
                    )} <input hidden${add_attribute("value", formData.keywords ? 0 : 0, 0)} id="keywords" name="keywords"></div> <div>${validate_component(Label, "Label").$$render($$result, {}, {}, {
                      default: () => {
                        return `주의 키워드`;
                      }
                    })} ${validate_component(KeywordSelect, "KeywordSelect").$$render(
                      $$result,
                      {
                        allKeywords: $cautions,
                        values: formData.cautions ?? [],
                        onChange: (newValues) => {
                          formData.cautions = newValues;
                        }
                      },
                      {},
                      {}
                    )} <input hidden${add_attribute("value", formData.cautions ? 0 : 0, 0)} id="cautions" name="cautions"></div> <div class="flex flex-col gap-4">${validate_component(Label, "Label").$$render($$result, {}, {}, {
                      default: () => {
                        return `썸네일 파일 업로드`;
                      }
                    })} ${validate_component(Input$1, "Input").$$render($$result, { id: "picture", type: "file" }, {}, {})} ${validate_component(Label, "Label").$$render($$result, {}, {}, {
                      default: () => {
                        return `썸네일 편집`;
                      }
                    })} <div class="flex flex-col gap-6 border border-slate-200 p-4 rounded-md"><div class="flex justify-center">${validate_component(ImageCrop, "ImageCrop").$$render(
                      $$result,
                      {
                        image: formData.thumbnail,
                        type: "card",
                        cropArea: formData.thumbnailCard,
                        handleConfirm: (value2) => {
                          formData.thumbnailCard = value2;
                        }
                      },
                      {},
                      {}
                    )}</div> <hr> <div class="flex justify-center">${validate_component(ImageCrop, "ImageCrop").$$render(
                      $$result,
                      {
                        image: formData.thumbnail,
                        type: "book",
                        cropArea: formData.thumbnailBook,
                        handleConfirm: (value2) => {
                          formData.thumbnailBook = value2;
                        }
                      },
                      {},
                      {}
                    )}</div></div></div> <div><div class="flex justify-between mb-2">${validate_component(Label, "Label").$$render($$result, {}, {}, {
                      default: () => {
                        return `플랫폼`;
                      }
                    })} <div class="flex items-center space-x-2"><p${add_attribute("class", cn("text-sm", formData.noPlatform ? "text-black" : "text-slate-400"), 0)}>서비스하는 곳 없음</p> ${validate_component(Switch, "Switch").$$render(
                      $$result,
                      {
                        id: "noPlatform",
                        name: "noPlatform",
                        disabled: formData.platforms && formData.platforms.length > 0,
                        checked: formData.noPlatform
                      },
                      {
                        checked: ($$value) => {
                          formData.noPlatform = $$value;
                          $$settled = false;
                        }
                      },
                      {}
                    )}</div></div> ${validate_component(PlatformInput, "PlatformInput").$$render(
                      $$result,
                      {
                        values: formData.platforms,
                        allPlatforms: $categories?.find((c) => c.id === formData.genre?.category.id)?.platforms ?? [],
                        onChange: (values) => {
                          if (formData.platforms && formData.platforms.length > 0) {
                            formData.noPlatform = false;
                          }
                          formData.platforms = values;
                        }
                      },
                      {},
                      {}
                    )}</div> <div>${validate_component(Label, "Label").$$render($$result, {}, {}, {
                      default: () => {
                        return `비고`;
                      }
                    })} ${validate_component(Textarea, "Textarea").$$render(
                      $$result,
                      {
                        placeholder: "",
                        class: "resize-none",
                        id: "note",
                        name: "note",
                        autocomplete: "off",
                        value: formData.note
                      },
                      {
                        value: ($$value) => {
                          formData.note = $$value;
                          $$settled = false;
                        }
                      },
                      {}
                    )}</div></form>`;
                  }
                })} ${validate_component(Drawer_footer, "Drawer.Footer").$$render($$result, { class: "flex flex-row-reverse" }, {}, {
                  default: () => {
                    return `${validate_component(Button, "Button").$$render($$result, { class: "w-[120px]" }, {}, {
                      default: () => {
                        return `확인`;
                      }
                    })} ${validate_component(Button, "Button").$$render($$result, { class: "w-[120px]", variant: "ghost" }, {}, {
                      default: () => {
                        return `전체 초기화`;
                      }
                    })}`;
                  }
                })}`;
              }
            }
          )}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_categories();
  $$unsubscribe_keywords();
  $$unsubscribe_cautions();
  return $$rendered;
});
const DataDeleteDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value = { title: "" } } = $$props;
  let open = false;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Root$2, "Dialog.Root").$$render(
      $$result,
      { open },
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Trigger$2, "Dialog.Trigger").$$render(
            $$result,
            {
              class: cn("text-sm h-[30px]", buttonVariants({ variant: "ghost" }))
            },
            {},
            {
              default: () => {
                return `삭제`;
              }
            }
          )} ${validate_component(Dialog_content$1, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px] space-y-2" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title$1, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `&#39;${escape(value.title)}&#39; 삭제`;
                    }
                  })} ${validate_component(Dialog_description, "Dialog.Description").$$render($$result, {}, {}, {
                    default: () => {
                      return `&#39;${escape(value.title)}&#39; 을(를) 삭제하시겠습니까?`;
                    }
                  })}`;
                }
              })} ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, { variant: "destructive", type: "submit" }, {}, {
                    default: () => {
                      return `삭제하기`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const DataLabelEditDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const LABELS = {
    NEED_CHECK: "검수전",
    CHECKING: "검수중",
    CHECKED: "검수완료",
    HOLD: "보류",
    NEED_CONTACT: "컨택필요",
    CENSOR: "탈락"
  };
  let { open = false } = $$props;
  let { data } = $$props;
  let { editLabel } = $$props;
  let { handleSubmit } = $$props;
  let note = data.note;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.editLabel === void 0 && $$bindings.editLabel && editLabel !== void 0) $$bindings.editLabel(editLabel);
  if ($$props.handleSubmit === void 0 && $$bindings.handleSubmit && handleSubmit !== void 0) $$bindings.handleSubmit(handleSubmit);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Root$2, "Dialog.Root").$$render(
      $$result,
      { open },
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Dialog_content$1, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px] space-y-2" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title$1, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(LABELS[editLabel])}`;
                    }
                  })} ${validate_component(Dialog_description, "Dialog.Description").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(LABELS[editLabel])} 사유를 작성해주세요.`;
                    }
                  })}`;
                }
              })} <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "note" }, {}, {
                default: () => {
                  return `비고`;
                }
              })} ${validate_component(Textarea, "Textarea").$$render(
                $$result,
                { id: "note", value: note },
                {
                  value: ($$value) => {
                    note = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div> ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                    default: () => {
                      return `확인`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const DataCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const LABELS = {
    NEED_CHECK: "검수전",
    CHECKING: "검수중",
    CHECKED: "검수완료",
    HOLD: "보류",
    NEED_CONTACT: "컨택필요",
    CENSOR: "탈락"
  };
  const LABEL_COLORS = {
    NEED_CHECK: "#e8eaed",
    CHECKING: "#ffe5a0",
    CHECKED: "#e6cff2",
    HOLD: "#c6dbe1",
    NEED_CONTACT: "#bfe1f6",
    CENSOR: "#ffcfc9"
  };
  let { data } = $$props;
  let open = false;
  let openSelect = false;
  let editLabel = data.label;
  data.label;
  async function handleLabel(label) {
    open = false;
    if (label === "HOLD" || label === "CENSOR") {
      open = true;
      editLabel = label;
      openSelect = false;
      return;
    }
    await handleSubmit({ label, note: "" });
    openSelect = false;
  }
  async function handleSubmit(value) {
    try {
      await axiosInstance.patch(`/watas/${data.id}`, {
        ...data,
        label: value.label,
        note: value.note
      });
      toast.success(`'${data.title}' 의 라벨을 ${LABELS[value.label]} 으로 수정했습니다.`);
      data.label = value.label;
      open = false;
    } catch (error) {
      console.error(error);
      toast.error("sorry, this functions is failed");
    }
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="p-4 bg-white shadow-md rounded-lg flex flex-col space-y-4"><div id="header" class="flex justify-between w-full"><div class="flex items-center gap-4">${validate_component(Root$1, "Select.Root").$$render(
      $$result,
      {
        selected: data.label ? {
          label: LABELS[data.label],
          value: data.label
        } : void 0,
        onSelectedChange: (v) => {
          v && handleLabel(v.value);
        },
        open: openSelect
      },
      {
        open: ($$value) => {
          openSelect = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Select_trigger, "Select.Trigger").$$render(
            $$result,
            {
              class: "w-[105px] h-[30px] border-none",
              style: "background-color: " + (LABEL_COLORS[data.label] || "transparent")
            },
            {},
            {
              default: () => {
                return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "라벨" }, {}, {})}`;
              }
            }
          )} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${each(Object.keys(LABELS), (label, i) => {
                return `${validate_component(Select_item, "Select.Item").$$render($$result, { value: label }, {}, {
                  default: () => {
                    return `${escape(LABELS[label])}`;
                  }
                })}`;
              })}`;
            }
          })}`;
        }
      }
    )} <p class="text-gray-600 text-xs"><b data-svelte-h="svelte-1026bwd">Last updated</b> <br> ${escape(data?.updater?.nickname)} | ${escape(new Date(data?.updatedAt)?.toLocaleDateString())}<br></p></div> <div>${validate_component(DataEditDrawer, "DataEditDrawer").$$render($$result, { action: "edit", value: data }, {}, {})} ${!data.isPublished ? `${validate_component(DataDeleteDialog, "DataDeleteDialog").$$render($$result, { value: data }, {}, {})}` : ``}</div></div>  <div class="flex items-center">${data.thumbnail ? `<img${add_attribute("src", data.thumbnail, 0)} alt="Thumbnail" class="w-20 h-auto mr-3 object-cover rounded-lg">` : `<div class="w-20 h-auto mr-3 rounded-lg text-xs text-red-600" data-svelte-h="svelte-r4llku">썸네일 미등록</div>`} <div class="flex flex-col"><div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center">${data.isPublished ? `${validate_component(Badge, "Badge").$$render($$result, { class: "text-xs h-[17px]" }, {}, {
      default: () => {
        return `게시`;
      }
    })}` : ``} <h3 class="text-md font-semibold text-gray-900 flex-1">${escape(data.title)}</h3></div> <div class="flex mt-2 flex-col"><h4 class="text-xs font-semibold mb-1" data-svelte-h="svelte-hyhlvz">장르</h4> <p class="text-sm">${data.genre ? `<p class="text-sm">${escape(data.genre.category.name)} | ${escape(data.genre.name)}</p>` : `<p class="text-xs text-red-600" data-svelte-h="svelte-thubtl">장르 미등록</p>`}</p></div> <div class="flex mt-2 flex-col"><h4 class="text-xs font-semibold flex-1 mb-1" data-svelte-h="svelte-vym2bi">작가/감독</h4> ${data.creators ? `<p class="text-sm">${escape(data.creators)}</p>` : `<p class="text-xs text-red-600" data-svelte-h="svelte-pj61rj">작가/감독 미등록</p>`}</div></div></div> <div class="space-y-2"><h4 class="text-xs font-semibold" data-svelte-h="svelte-1te3g27">키워드</h4> <div class="flex flex-wrap gap-1">${data.keywords && data.keywords?.length > 0 ? `${each(data.keywords, (keyword, idx) => {
      return `${validate_component(Badge, "Badge").$$render($$result, { variant: "outline", class: "text-xs" }, {}, {
        default: () => {
          return `${escape(keyword.name)}`;
        }
      })}`;
    })}` : `<p class="text-xs text-red-600" data-svelte-h="svelte-ravjtk">키워드 미등록</p>`} ${data.cautions ? `${each(data.cautions, (caution, idx) => {
      return `${validate_component(Badge, "Badge").$$render(
        $$result,
        {
          variant: "outline",
          class: "text-xs bg-red-100 text-red-800"
        },
        {},
        {
          default: () => {
            return `${escape(caution.name)}`;
          }
        }
      )}`;
    })}` : ``}</div> <h4 class="text-xs font-semibold" data-svelte-h="svelte-rhhqjy">플랫폼</h4> ${data.platforms && data.platforms?.length > 0 ? `<div class="flex flex-wrap gap-1">${each(data.platforms, (platform, idx) => {
      return `<a${add_attribute("href", platform.url, 0)} target="_blank"${add_attribute("class", `${badgeVariants({ variant: "secondary" })} text-xs`, 0)}>${escape(platform.name)}</a>`;
    })}</div>` : `${data.noPlatform ? `<p${add_attribute("class", "text-xs", 0)} data-svelte-h="svelte-1v68dwj">서비스하는 곳 없음</p>` : `<p class="text-xs text-red-600" data-svelte-h="svelte-ywi57p">플랫폼 미등록</p>`}`} ${data?.note ? `<p class="text-gray-600 text-xs bg-gray-100 p-3 rounded-md">${escape(data.note)}<br></p>` : ``}</div></div> ${validate_component(DataLabelEditDialog, "DataLabelEditDialog").$$render($$result, { data, editLabel, open, handleSubmit }, {}, {})}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Close as C,
  DataCard as D,
  Trigger as T,
  DataEditDrawer as a,
  Drawer as b,
  Drawer_content as c,
  Drawer_header as d,
  Drawer_title as e,
  Drawer_footer as f
};
