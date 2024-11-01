import { c as create_ssr_component, v as validate_component, g as escape, b as add_attribute, a as subscribe, e as each } from "../../../chunks/ssr.js";
import { A as Alert, T as Terminal, a as Alert_title, b as Alert_description, C as Card, c as Card_content } from "../../../chunks/card-content.js";
import { R as Root$2, T as Tabs_list, a as Tabs_trigger, b as Tabs_content } from "../../../chunks/index5.js";
import "clsx";
import { B as Badge } from "../../../chunks/index4.js";
import { R as Root$1, T as Trigger$1, P as Popover_content, D as Dialog_description } from "../../../chunks/index3.js";
import { R as Root, T as Trigger, P as Plus, D as Dialog_content, a as Dialog_header, b as Dialog_title, c as Dialog_footer } from "../../../chunks/axios.js";
import { c as cn, b as buttonVariants, I as Input, B as Button } from "../../../chunks/input.js";
import { L as Label } from "../../../chunks/label.js";
import { S as Switch } from "../../../chunks/switch.js";
import { I as Icon } from "../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { P as Pencil } from "../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import { c as categories } from "../../../chunks/categories.store.js";
const Info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "info" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const AddPlatformDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { category } = $$props;
  let open = false;
  let orderTop = false;
  let name = "";
  let domain = "";
  if ($$props.category === void 0 && $$bindings.category && category !== void 0) $$bindings.category(category);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Root, "Dialog.Root").$$render(
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
          return `${validate_component(Trigger, "Dialog.Trigger").$$render(
            $$result,
            {
              class: cn(buttonVariants({ variant: "ghost" }), "flex gap-1 items-center w-fit")
            },
            {},
            {
              default: () => {
                return `${validate_component(Plus, "Plus").$$render($$result, { class: "h-5 w-5 text-slate-400" }, {}, {})} <div class="underline underline-offset-2">&#39;${escape(category.name)}&#39; 에 새 플랫폼 추가</div>`;
              }
            }
          )} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px] space-y-2" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `&#39;${escape(category.name)}&#39; 에 새 플랫폼 추가`;
                    }
                  })}`;
                }
              })} <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "name" }, {}, {
                default: () => {
                  return `플랫폼명`;
                }
              })} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: "추가할 플랫폼명을 입력해주세요...",
                  autocomplete: "off",
                  value: name
                },
                {
                  value: ($$value) => {
                    name = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div> <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render(
                $$result,
                {
                  for: "name",
                  class: "flex items-center gap-2"
                },
                {},
                {
                  default: () => {
                    return `도메인명
        ${validate_component(Root$1, "Popover.Root").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(Trigger$1, "Popover.Trigger").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(Info, "Info").$$render($$result, { class: "h-5 w-5 text-slate-400" }, {}, {})}`;
                          }
                        })} ${validate_component(Popover_content, "Popover.Content").$$render($$result, {}, {}, {
                          default: () => {
                            return `<h4 class="font-medium leading-none" data-svelte-h="svelte-1dey93n">예시</h4> <p class="text-muted-foreground text-sm" data-svelte-h="svelte-fgakiu">www.naver.com 에서 naver 를 입력.
              <br> <br>
              한 플랫폼에서 여러 서비스를 운영중인 경우 구분 가능하도록 입력
              <br>
              ˙구글무비(play.google.com/store/movies)
              <br>
              ˙구글북스(play.google.com/store/books)</p>`;
                          }
                        })}`;
                      }
                    })}`;
                  }
                }
              )} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: "플랫폼의 도메인을 입력해주세요...",
                  autocomplete: "off",
                  value: domain
                },
                {
                  value: ($$value) => {
                    domain = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div> <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "order-top" }, {}, {
                default: () => {
                  return `상단노출 여부`;
                }
              })} <div class="flex items-center space-x-2">${validate_component(Switch, "Switch").$$render(
                $$result,
                { id: "order-top", checked: orderTop },
                {
                  checked: ($$value) => {
                    orderTop = $$value;
                    $$settled = false;
                  }
                },
                {}
              )} <p${add_attribute("class", cn("text-sm", orderTop ? "text-black" : "text-slate-300"), 0)}>${escape(orderTop ? "ON" : "OFF")}</p></div></div> ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, {
                    default: () => {
                      return `추가하기`;
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
const EditPlatformDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { category } = $$props;
  let { value } = $$props;
  let open = false;
  let orderTop = value.orderTop;
  let name = value.name;
  let domain = value.domain;
  if ($$props.category === void 0 && $$bindings.category && category !== void 0) $$bindings.category(category);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Root, "Dialog.Root").$$render(
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
          return `${validate_component(Trigger, "Dialog.Trigger").$$render(
            $$result,
            {
              class: cn(buttonVariants({ variant: "ghost" }), "flex gap-1 items-center w-fit")
            },
            {},
            {
              default: () => {
                return `${validate_component(Pencil, "Pencil").$$render($$result, { class: "h-4 w-4 text-slate-400" }, {}, {})}`;
              }
            }
          )} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px] space-y-2" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(category.name)}의 &#39;${escape(value.name)}&#39; 플랫폼 수정`;
                    }
                  })}`;
                }
              })} <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "name" }, {}, {
                default: () => {
                  return `플랫폼명`;
                }
              })} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: "수정할 플랫폼명을 입력해주세요...",
                  autocomplete: "off",
                  value: name
                },
                {
                  value: ($$value) => {
                    name = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div> <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render(
                $$result,
                {
                  for: "name",
                  class: "flex items-center gap-2"
                },
                {},
                {
                  default: () => {
                    return `도메인명
        ${validate_component(Root$1, "Popover.Root").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(Trigger$1, "Popover.Trigger").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(Info, "Info").$$render($$result, { class: "h-5 w-5 text-slate-400" }, {}, {})}`;
                          }
                        })} ${validate_component(Popover_content, "Popover.Content").$$render($$result, {}, {}, {
                          default: () => {
                            return `<h4 class="font-medium leading-none" data-svelte-h="svelte-1dey93n">예시</h4> <p class="text-muted-foreground text-sm" data-svelte-h="svelte-fgakiu">www.naver.com 에서 naver 를 입력.
              <br> <br>
              한 플랫폼에서 여러 서비스를 운영중인 경우 구분 가능하도록 입력
              <br>
              ˙구글무비(play.google.com/store/movies)
              <br>
              ˙구글북스(play.google.com/store/books)</p>`;
                          }
                        })}`;
                      }
                    })}`;
                  }
                }
              )} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: "플랫폼의 도메인을 입력해주세요...",
                  autocomplete: "off",
                  value: domain
                },
                {
                  value: ($$value) => {
                    domain = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div> <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "order-top" }, {}, {
                default: () => {
                  return `상단노출 여부`;
                }
              })} <div class="flex items-center space-x-2">${validate_component(Switch, "Switch").$$render(
                $$result,
                { id: "order-top", checked: orderTop },
                {
                  checked: ($$value) => {
                    orderTop = $$value;
                    $$settled = false;
                  }
                },
                {}
              )} <p${add_attribute("class", cn("text-sm", orderTop ? "text-black" : "text-slate-300"), 0)}>${escape(orderTop ? "ON" : "OFF")}</p></div></div> ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, {
                    default: () => {
                      return `수정하기`;
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
const DeletePlatformDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { category } = $$props;
  let { value } = $$props;
  let open = false;
  if ($$props.category === void 0 && $$bindings.category && category !== void 0) $$bindings.category(category);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Root, "Dialog.Root").$$render(
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
          return `${validate_component(Trigger, "Dialog.Trigger").$$render(
            $$result,
            {
              class: buttonVariants({ variant: "ghost" })
            },
            {},
            {
              default: () => {
                return `${validate_component(Trash_2, "Trash").$$render($$result, { class: "h-4 w-4 text-slate-400" }, {}, {})}`;
              }
            }
          )} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px]" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `&#39;${escape(value.name)}&#39; 플랫폼 삭제`;
                    }
                  })} ${validate_component(Dialog_description, "Dialog.Description").$$render($$result, {}, {}, {
                    default: () => {
                      return `&#39;${escape(value.name)}&#39; 플랫폼을 삭제하시겠습니까? 삭제한 플랫폼은 복구할 수
        없습니다.`;
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
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $categories, $$unsubscribe_categories;
  $$unsubscribe_categories = subscribe(categories, (value) => $categories = value);
  let { data } = $$props;
  categories.set(data.categories);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_categories();
  return `${$$result.head += `<!-- HEAD_svelte-6qctm5_START -->${$$result.title = `<title>키워드 관리</title>`, ""}<!-- HEAD_svelte-6qctm5_END -->`, ""} <div class="text-lg my-4 font-bold" data-svelte-h="svelte-18camoa"><h1>플랫폼 관리</h1></div> ${validate_component(Root$2, "Tabs.Root").$$render($$result, { value: "category-1" }, {}, {
    default: () => {
      return `${validate_component(Tabs_list, "Tabs.List").$$render($$result, { class: "flex" }, {}, {
        default: () => {
          return `${each($categories, (category) => {
            return `${validate_component(Tabs_trigger, "Tabs.Trigger").$$render(
              $$result,
              {
                class: "flex-1",
                value: "category-" + category.id
              },
              {},
              {
                default: () => {
                  return `${escape(category.name)}`;
                }
              }
            )}`;
          })}`;
        }
      })} ${each($categories, (category) => {
        return `${validate_component(Tabs_content, "Tabs.Content").$$render($$result, { value: "category-" + category.id }, {}, {
          default: () => {
            return `${validate_component(Alert, "Alert.Root").$$render($$result, { class: "mb-4" }, {}, {
              default: () => {
                return `${validate_component(Terminal, "Terminal").$$render($$result, { class: "h-4 w-4" }, {}, {})} ${validate_component(Alert_title, "Alert.Title").$$render($$result, {}, {}, {
                  default: () => {
                    return `각 항목 설명`;
                  }
                })} ${validate_component(Alert_description, "Alert.Description").$$render($$result, {}, {}, {
                  default: () => {
                    return `· <b data-svelte-h="svelte-1jn994r">상단 노출 여부</b>는 와카이브 웹의 [키워드로 검색] 창에서
          상단으로 정렬시켜 사용자들에게 먼저 노출할 지의 여부입니다. 주로
          메이저 플랫폼을 상단노출 시킵니다.<br> · <b data-svelte-h="svelte-1cpmo0w">도메인</b>은 데이터 입력
          시 플랫폼의 URL을 붙여넣을 때 플랫폼이 자동 선택되게 하기 위해
          입력하는 항목입니다. 각 플랫폼의 URL 도메인명, 혹은 호스트명을
          입력하시면 됩니다.`;
                  }
                })} `;
              }
            })} ${validate_component(Card, "Card.Root").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Card_content, "Card.Content").$$render($$result, { class: "p-4 w-full" }, {}, {
                  default: () => {
                    return `<ul class="flex gap-4 flex-col">${each(category.platforms, (platform, index) => {
                      return `<li class="flex justify-between items-center rounded-md border border-slate-200 bg-white p-4"><div class="space-y-2"><div class="space-x-2"><h2 class="inline-block text-md font-semibold">${escape(platform.name)}</h2> ${platform.orderTop ? `${validate_component(Badge, "Badge").$$render($$result, { class: "ml-4" }, {}, {
                        default: () => {
                          return `상단노출`;
                        }
                      })}` : ``}</div> <p class="text-gray-500 text-sm">도메인: ${escape(platform?.domain ? platform.domain : "-")} </p></div> <div class="flex">${validate_component(EditPlatformDialog, "EditPlatformDialog").$$render($$result, { category, value: platform }, {}, {})} ${validate_component(DeletePlatformDialog, "DeletePlatformDialog").$$render($$result, { category, value: platform }, {}, {})}</div> </li>`;
                    })} ${validate_component(AddPlatformDialog, "AddPlatformDialog").$$render($$result, { category }, {}, {})}</ul> `;
                  }
                })} `;
              }
            })} `;
          }
        })}`;
      })}`;
    }
  })}`;
});
export {
  Page as default
};
