import { c as create_ssr_component, v as validate_component, g as escape, a as subscribe, e as each } from "../../../chunks/ssr.js";
import { A as Alert, T as Terminal, a as Alert_title, b as Alert_description, C as Card, c as Card_content } from "../../../chunks/card-content.js";
import "clsx";
import { S as Separator } from "../../../chunks/separator.js";
import { C as Chevron_right } from "../../../chunks/chevron-right.js";
import { R as Root, T as Trigger, P as Plus, D as Dialog_content, a as Dialog_header, b as Dialog_title, c as Dialog_footer } from "../../../chunks/axios.js";
import { c as cn, b as buttonVariants, I as Input, B as Button } from "../../../chunks/input.js";
import "../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { P as Pencil } from "../../../chunks/pencil.js";
import { c as categories } from "../../../chunks/categories.store.js";
const AddCategoryDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let open = false;
  let name = "";
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
              class: cn("flex gap-1 items-center w-fit", buttonVariants({ variant: "ghost" }))
            },
            {},
            {
              default: () => {
                return `${validate_component(Plus, "Plus").$$render($$result, { class: "h-5 w-5 text-slate-400" }, {}, {})} <div class="underline underline-offset-2" data-svelte-h="svelte-1n8kb2u">새 카테고리 추가</div>`;
              }
            }
          )} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px]" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `새 카테고리 추가`;
                    }
                  })}`;
                }
              })} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: "카테고리명을 입력해주세요...",
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
              )} ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
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
const AddGenreDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { category } = $$props;
  let open = false;
  let name = "";
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
              class: cn("flex gap-1 items-center w-fit", buttonVariants({ variant: "ghost" }))
            },
            {},
            {
              default: () => {
                return `${validate_component(Plus, "Plus").$$render($$result, { class: "h-5 w-5 text-slate-400" }, {}, {})} <div class="underline underline-offset-2">&#39;${escape(category.name)}&#39;에 새 장르 추가</div>`;
              }
            }
          )} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px]" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `&#39;${escape(category.name)}&#39; 에 새 장르 추가`;
                    }
                  })}`;
                }
              })} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: "장르명을 입력해주세요...",
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
              )} ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
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
const EditCategoryDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value } = $$props;
  let { selected = false } = $$props;
  let open = false;
  let name = value.name;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0) $$bindings.selected(selected);
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
              class: cn(buttonVariants({ variant: "ghost" }), "h-[30px] hover:bg-transparent")
            },
            {},
            {
              default: () => {
                return `${validate_component(Pencil, "Pencil").$$render(
                  $$result,
                  {
                    class: "h-4 w-4 text-slate-" + (selected ? 300 : 400)
                  },
                  {},
                  {}
                )}`;
              }
            }
          )} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px]" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `&#39;${escape(value.name)}&#39; 카테고리 수정`;
                    }
                  })}`;
                }
              })} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: "수정할 카테고리명을 입력해주세요...",
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
              )} ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
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
const EditGenreDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { category } = $$props;
  let { value } = $$props;
  let open = false;
  let name = value.name;
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
              class: cn(buttonVariants({ variant: "ghost" }), "h-[30px] hover:bg-transparent")
            },
            {},
            {
              default: () => {
                return `${validate_component(Pencil, "Pencil").$$render($$result, { class: "h-4 w-4 text-slate-400" }, {}, {})}`;
              }
            }
          )} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px]" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `&#39;${escape(category.name)} - ${escape(value.name)}&#39; 장르 수정`;
                    }
                  })}`;
                }
              })} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: "수정할 장르명을 입력해주세요...",
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
              )} ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
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
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $categories, $$unsubscribe_categories;
  $$unsubscribe_categories = subscribe(categories, (value) => $categories = value);
  let { data } = $$props;
  categories.set(data.categories);
  let selectCategoryIndex = 0;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_categories();
  return `${$$result.head += `<!-- HEAD_svelte-16jbehh_START -->${$$result.title = `<title>카테고리 관리</title>`, ""}<!-- HEAD_svelte-16jbehh_END -->`, ""} <div class="text-lg my-4 font-bold" data-svelte-h="svelte-1afj5ez"><h1>카테고리 관리</h1></div> ${validate_component(Alert, "Alert.Root").$$render($$result, { class: "mb-4" }, {}, {
    default: () => {
      return `${validate_component(Terminal, "Terminal").$$render($$result, { class: "h-4 w-4" }, {}, {})} ${validate_component(Alert_title, "Alert.Title").$$render($$result, {}, {}, {
        default: () => {
          return `유의사항`;
        }
      })} ${validate_component(Alert_description, "Alert.Description").$$render($$result, {}, {}, {
        default: () => {
          return `카테고리와 장르의 추가는 신중한 검토와 논의 후 결정해주시기 바랍니다.
    추가된 카테고리와 장르는 특별한 사유가 없는 한 삭제가 어렵습니다.`;
        }
      })}`;
    }
  })} ${validate_component(Card, "Card.Root").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Card_content, "Card.Content").$$render(
        $$result,
        {
          class: "p-4 flex flex-col md:flex-row gap-4"
        },
        {},
        {
          default: () => {
            return `<ul class="flex-1 flex gap-4 flex-col">${each($categories, (category, index) => {
              let selected = selectCategoryIndex === index;
              return ` <li class="${"flex justify-between items-center transition rounded-md border border-slate-300 hover:border-slate-500 " + escape(selected ? "bg-black text-white" : "bg-white", true)}"><span class="cursor-pointer flex-1 p-2 text-sm" aria-hidden>${escape(category.name)}</span> ${validate_component(EditCategoryDialog, "EditCategoryDialog").$$render($$result, { value: category }, {}, {})} </li>`;
            })} ${validate_component(AddCategoryDialog, "AddCategoryDialog").$$render($$result, {}, {}, {})}</ul> ${validate_component(Separator, "Separator").$$render($$result, { orientation: "vertical" }, {}, {})} <ul class="flex-1 flex gap-4 flex-col">${(() => {
              let category = $categories[selectCategoryIndex];
              return ` <h4 class="text-lg mb-2 font-bold flex items-center">${escape(category.name)} ${validate_component(Chevron_right, "RightArrow").$$render($$result, { class: "h-5 w-5 text-slate-400" }, {}, {})}</h4> ${each(category.genres, (genre, index) => {
                return `<li class="flex justify-between items-center rounded-md border border-slate-300 bg-white"><span class="flex-1 p-2 text-sm">${escape(genre.name)}</span> ${validate_component(EditGenreDialog, "EditGenreDialog").$$render($$result, { category, value: genre }, {}, {})} </li>`;
              })} ${validate_component(AddGenreDialog, "AddGenreDialog").$$render($$result, { category }, {}, {})}`;
            })()}</ul>`;
          }
        }
      )}`;
    }
  })}`;
});
export {
  Page as default
};
