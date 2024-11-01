import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import { I as Input, B as Button } from "../../../chunks/input.js";
import { L as Label } from "../../../chunks/label.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let username = "";
  let password = "";
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-106ptwb_START -->${$$result.title = `<title>Signin</title>`, ""}<!-- HEAD_svelte-106ptwb_END -->`, ""} <div><div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "username" }, {}, {
      default: () => {
        return `계정`;
      }
    })} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "username",
        autocomplete: "off",
        value: username
      },
      {
        value: ($$value) => {
          username = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "password" }, {}, {
      default: () => {
        return `비밀번호`;
      }
    })} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        type: "password",
        id: "password",
        autocomplete: "off",
        value: password
      },
      {
        value: ($$value) => {
          password = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> ${``} ${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, {
      default: () => {
        return `로그인하기`;
      }
    })}</div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
