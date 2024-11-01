import { c as create_ssr_component, v as validate_component, g as escape, a as subscribe, e as each } from "../../../chunks/ssr.js";
import { R as Root$1, T as Tabs_list, a as Tabs_trigger, b as Tabs_content } from "../../../chunks/index5.js";
import { A as Alert, T as Terminal, a as Alert_title, b as Alert_description, C as Card, c as Card_content } from "../../../chunks/card-content.js";
import "clsx";
import { R as Root, T as Trigger, P as Plus, D as Dialog_content, a as Dialog_header, b as Dialog_title, c as Dialog_footer } from "../../../chunks/axios.js";
import { c as cn, b as buttonVariants, I as Input, B as Button } from "../../../chunks/input.js";
import { L as Label } from "../../../chunks/label.js";
import { T as Textarea, K as KeywordSelect } from "../../../chunks/KeywordSelect.js";
import "../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { P as Pencil } from "../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import { D as Dialog_description } from "../../../chunks/index3.js";
import { k as keywords, c as cautions } from "../../../chunks/cautions.store.js";
const AddKeywordDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { type = "keywords" } = $$props;
  const dialogLabel = type === "cautions" ? "주의 키워드" : "키워드";
  let open = false;
  let name = "";
  let description = "";
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
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
                return `${validate_component(Plus, "Plus").$$render($$result, { class: "h-5 w-5 text-slate-400" }, {}, {})} <div class="underline underline-offset-2">새 ${escape(dialogLabel)} 추가</div>`;
              }
            }
          )} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px] space-y-2" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `새 ${escape(dialogLabel)} 추가`;
                    }
                  })}`;
                }
              })} <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "name" }, {}, {
                default: () => {
                  return `${escape(dialogLabel)}명`;
                }
              })} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: dialogLabel + "명을 입력해주세요...",
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
              )}</div> <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "description" }, {}, {
                default: () => {
                  return `설명`;
                }
              })} ${validate_component(Textarea, "Textarea").$$render(
                $$result,
                {
                  id: "description",
                  placeholder: "설명을 적어주세요.",
                  value: description
                },
                {
                  value: ($$value) => {
                    description = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div> ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
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
const EditKeywordDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value } = $$props;
  let { type = "keywords" } = $$props;
  const dialogLabel = type === "cautions" ? "주의 키워드" : "키워드";
  let open = false;
  let name = value.name;
  let description = value.description;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
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
                return `${validate_component(Pencil, "Pencil").$$render($$result, { class: "h-4 w-4 text-slate-400" }, {}, {})}`;
              }
            }
          )} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px] space-y-2" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `&#39;${escape(value.name)}&#39; ${escape(dialogLabel)} 수정`;
                    }
                  })}`;
                }
              })} <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "name" }, {}, {
                default: () => {
                  return `${escape(dialogLabel)}명`;
                }
              })} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: "수정할 " + dialogLabel + "명을 입력해주세요...",
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
              )}</div> <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "description" }, {}, {
                default: () => {
                  return `설명`;
                }
              })} ${validate_component(Textarea, "Textarea").$$render(
                $$result,
                {
                  id: "description",
                  placeholder: "설명을 적어주세요.",
                  value: description
                },
                {
                  value: ($$value) => {
                    description = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div> ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
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
const DeleteKeywordDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value } = $$props;
  let { type = "keywords" } = $$props;
  const dialogLabel = type === "cautions" ? "주의 키워드" : "키워드";
  let open = false;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
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
                      return `&#39;${escape(value.name)}&#39; ${escape(dialogLabel)} 삭제`;
                    }
                  })} ${validate_component(Dialog_description, "Dialog.Description").$$render($$result, {}, {}, {
                    default: () => {
                      return `&#39;${escape(value.name)}&#39; ${escape(dialogLabel)}를 삭제하시겠습니까? 삭제한 ${escape(dialogLabel)}는
        복구할 수 없습니다.`;
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
const MergeEeywordDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { type = "keywords" } = $$props;
  let { allKeywords } = $$props;
  const dialogLabel = type === "cautions" ? "주의 키워드" : "키워드";
  let open = false;
  let name = "";
  let values = [];
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.allKeywords === void 0 && $$bindings.allKeywords && allKeywords !== void 0) $$bindings.allKeywords(allKeywords);
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
              class: cn("flex gap-1 items-center w-fit", buttonVariants({ variant: "secondary" }))
            },
            {},
            {
              default: () => {
                return `${escape(dialogLabel)} 합치기`;
              }
            }
          )} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, { class: "sm:max-w-[425px] space-y-2" }, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(dialogLabel)} 합치기`;
                    }
                  })}`;
                }
              })} <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "name" }, {}, {
                default: () => {
                  return `합칠 ${escape(dialogLabel)}`;
                }
              })} ${validate_component(KeywordSelect, "KeywordSelect").$$render(
                $$result,
                {
                  allKeywords,
                  values,
                  onChange: (newValues) => {
                    values = newValues;
                  }
                },
                {},
                {}
              )}</div> <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "name" }, {}, {
                default: () => {
                  return `새 ${escape(dialogLabel)}명`;
                }
              })} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "name",
                  placeholder: dialogLabel + "명을 입력해주세요...",
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
              )}</div> ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, {
                    default: () => {
                      return `키워드 합치기`;
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
  let $keywords, $$unsubscribe_keywords;
  let $cautions, $$unsubscribe_cautions;
  $$unsubscribe_keywords = subscribe(keywords, (value) => $keywords = value);
  $$unsubscribe_cautions = subscribe(cautions, (value) => $cautions = value);
  let { data } = $$props;
  keywords.set(data.keywords);
  cautions.set(data.cautions);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_keywords();
  $$unsubscribe_cautions();
  return `${$$result.head += `<!-- HEAD_svelte-6qctm5_START -->${$$result.title = `<title>키워드 관리</title>`, ""}<!-- HEAD_svelte-6qctm5_END -->`, ""} <div class="text-lg my-4 font-bold" data-svelte-h="svelte-1dq5xp"><h1>키워드 관리</h1></div> ${validate_component(Root$1, "Tabs.Root").$$render($$result, { value: "keywords" }, {}, {
    default: () => {
      return `${validate_component(Tabs_list, "Tabs.List").$$render($$result, { class: "flex" }, {}, {
        default: () => {
          return `${validate_component(Tabs_trigger, "Tabs.Trigger").$$render($$result, { class: "flex-1", value: "keywords" }, {}, {
            default: () => {
              return `키워드`;
            }
          })} ${validate_component(Tabs_trigger, "Tabs.Trigger").$$render($$result, { class: "flex-1", value: "cautions" }, {}, {
            default: () => {
              return `주의키워드`;
            }
          })}`;
        }
      })} ${each(["keywords", "cautions"], (keywordType) => {
        let allKeywords = keywordType === "keywords" ? $keywords : $cautions;
        return ` ${validate_component(Tabs_content, "Tabs.Content").$$render($$result, { value: keywordType }, {}, {
          default: () => {
            return `${keywordType === "keywords" ? `${validate_component(Alert, "Alert.Root").$$render($$result, { class: "my-4" }, {}, {
              default: () => {
                return `${validate_component(Terminal, "Terminal").$$render($$result, { class: "h-4 w-4" }, {}, {})} ${validate_component(Alert_title, "Alert.Title").$$render($$result, {}, {}, {
                  default: () => {
                    return `키워드 추가 시 주의사항`;
                  }
                })} ${validate_component(Alert_description, "Alert.Description").$$render($$result, {}, {}, {
                  default: () => {
                    return `키워드가 많으면 사용자들이 검색할 때 오히려 혼란스러울 수 있습니다.
            키워드 추가 시에는 신중한 논의를 하여 사용자가 흔히 알아볼 수 있고
            키워드로써 자주 사용하는 단어로 추가해주시기 바랍니다.`;
                  }
                })} `;
              }
            })}` : `${validate_component(Alert, "Alert.Root").$$render($$result, { class: "my-4" }, {}, {
              default: () => {
                return `${validate_component(Terminal, "Terminal").$$render($$result, { class: "h-4 w-4" }, {}, {})} ${validate_component(Alert_title, "Alert.Title").$$render($$result, {}, {}, {
                  default: () => {
                    return `주의 키워드 주의사항`;
                  }
                })} ${validate_component(Alert_description, "Alert.Description").$$render($$result, {}, {}, {
                  default: () => {
                    return `주의 키워드 주의사항`;
                  }
                })} `;
              }
            })}`} ${validate_component(Card, "Card.Root").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Card_content, "Card.Content").$$render($$result, { class: "p-4 w-full" }, {}, {
                  default: () => {
                    return `<div class="flex justify-between items-center py-2">${validate_component(AddKeywordDialog, "AddKeywordDialog").$$render($$result, { type: keywordType }, {}, {})} ${validate_component(MergeEeywordDialog, "MergeKeywordDialog").$$render($$result, { type: keywordType, allKeywords }, {}, {})}</div> <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">${each(allKeywords, (keyword, index) => {
                      return `<li class="flex justify-between items-center rounded-md border border-slate-200 bg-white pl-4 pr-2 py-2"><div class="space-y-2"><h2 class="inline-block text-sm">${escape(keyword.name)}</h2> ${keyword.description ? `<p class="text-gray-500 text-sm">${escape(keyword.description)} </p>` : ``}</div> <div class="flex">${validate_component(EditKeywordDialog, "EditKeywordDialog").$$render($$result, { type: keywordType, value: keyword }, {}, {})} ${validate_component(DeleteKeywordDialog, "DeleteKeywordDialog").$$render($$result, { type: keywordType, value: keyword }, {}, {})}</div> </li>`;
                    })}</ul> `;
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
