"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const monadic_react_1 = require("../../src/monadic_react");
const button_1 = require("./samples/button");
const label_1 = require("./samples/label");
const selector_and_custom_class_1 = require("./samples/selector_and_custom_class");
const multiselector_1 = require("./samples/multiselector");
const menu_1 = require("./samples/menu");
const tabbed_menu_1 = require("./samples/tabbed menu");
const toggles_1 = require("./samples/toggles");
const moments_1 = require("./samples/moments");
const rich_text_1 = require("./samples/rich text");
const pagination_1 = require("./samples/pagination");
const list_1 = require("./samples/list");
const editable_list_1 = require("./samples/editable_list");
const link_1 = require("./samples/link");
const overlay_1 = require("./samples/overlay");
const context_1 = require("./samples/context");
const form_1 = require("./samples/form");
const promise_sample_1 = require("./samples/promise_sample");
const delay_wait_1 = require("./samples/delay_wait");
function HomePage(slug) {
    let all_samples = [
        monadic_react_1.mk_submenu_entry("controls", [
            monadic_react_1.mk_menu_entry({ sample: link_1.link_sample, description: "links" }),
            monadic_react_1.mk_menu_entry({ sample: label_1.label_sample, description: "label" }),
            monadic_react_1.mk_menu_entry({ sample: button_1.button_sample, description: "button" }),
            monadic_react_1.mk_menu_entry({ sample: rich_text_1.rich_text_sample, description: "rich text" }),
        ]),
        monadic_react_1.mk_submenu_entry("dataflows", [
            monadic_react_1.mk_menu_entry({ sample: selector_and_custom_class_1.selector_sample, description: "selector" }),
            monadic_react_1.mk_menu_entry({ sample: multiselector_1.multiselector_sample, description: "multi-selector" }),
            monadic_react_1.mk_menu_entry({ sample: moments_1.moments_sample, description: "dates and times" }),
            monadic_react_1.mk_menu_entry({ sample: toggles_1.toggles_sample, description: "coordinated toggles" }),
        ]),
        monadic_react_1.mk_submenu_entry("forms", [
            monadic_react_1.mk_menu_entry({ sample: form_1.course_form_with_autosave_sample, description: "simple form" }),
            monadic_react_1.mk_menu_entry({ sample: form_1.should_component_update_sample, description: "form with update control" })
        ]),
        monadic_react_1.mk_submenu_entry("lists", [
            monadic_react_1.mk_menu_entry({ sample: list_1.list_sample, description: "list" }),
            monadic_react_1.mk_menu_entry({ sample: pagination_1.pagination_sample, description: "pagination" }),
            monadic_react_1.mk_menu_entry({ sample: editable_list_1.editable_list_sample, description: "editable list" }),
        ]),
        monadic_react_1.mk_submenu_entry("menus", [
            monadic_react_1.mk_menu_entry({ sample: menu_1.menu_sample, description: "nested menu" }),
            monadic_react_1.mk_menu_entry({ sample: tabbed_menu_1.tabbed_menu_sample, description: "tabbed menu" })
        ]),
        monadic_react_1.mk_submenu_entry("other", [
            monadic_react_1.mk_menu_entry({ sample: context_1.context_sample, description: "context management" }),
            monadic_react_1.mk_menu_entry({ sample: overlay_1.overlay_sample, description: "overlay" }),
            monadic_react_1.mk_menu_entry({ sample: promise_sample_1.promise_sample, description: "promise" }),
            monadic_react_1.mk_menu_entry({ sample: delay_wait_1.delay_wait, description: "delay and wait" })
        ]),
    ];
    let edit_toggle = () => ({
        url: monadic_react_1.make_url(["edit_toggle_sample"]),
        page: _ => monadic_react_1.repeat("edit toggle sample")(monadic_react_1.any()([
            monadic_react_1.retract()(s => s.mode, s => m => (Object.assign({}, s, { mode: m })), mode => monadic_react_1.button("Toggle editing")(mode == "view" ? "edit" : "view")),
            state => monadic_react_1.retract()(s => s.text, s => t => (Object.assign({}, s, { text: t })), monadic_react_1.rich_text(state.mode))(state)
        ]))({ mode: "edit", text: "" }).ignore()
    });
    let sample_minipage = s => monadic_react_1.get_context().then(s.description, c => {
        let e = all_samples.find(e => e.children.findIndex(s1 => s1.value.description == s.description) != -1);
        return c.set_url({}, monadic_react_1.make_url([e.label.replace(/\s/g, "_"), s.description.replace(/\s/g, "_")])).then(`${s.description}_set_url`, _ => monadic_react_1.h2(s.description, "", s.description)(_ => s.sample)(null));
    });
    let menu_page = () => ({
        url: monadic_react_1.fallback_url(),
        page: (_) => monadic_react_1.simple_menu("side menu", s => s.description)(all_samples, s => {
            return sample_minipage(s);
        })
    });
    let sample_route = (e, s) => ({
        url: monadic_react_1.make_url([e.label.replace(/\s/g, "_"), s.description.replace(/\s/g, "_")]),
        page: (_) => monadic_react_1.simple_menu("side menu", s => s.description)(all_samples, sample_minipage, s, e.label)
    });
    let submenu_route = (e) => ({
        url: monadic_react_1.make_url([e.label.replace(/\s/g, "_")]),
        page: (_) => monadic_react_1.simple_menu("side menu", s => s.description)(all_samples, sample_minipage, undefined, e.label)
    });
    let all_menu_routes = Array()
        .concat(...all_samples.map(s => s.children.map(c => sample_route(s, c.value))))
        .concat(all_samples.map(s => submenu_route(s)));
    // let test =
    //   repeat<string>("repeat", () => "repeat")(
    //     string("edit", "text", "string", () => "string")
    //   )("Hello world!")
    return React.createElement("div", null, React.createElement("div", { className: "component" }, monadic_react_1.application("edit", window.location.href.replace(slug, ""), slug, () => Promise.resolve(all_menu_routes.concat([
        edit_toggle(),
        menu_page()
    ])))
    // simple_application(test, x => console.log("test broadcasts", JSON.stringify(x)))
    ));
}
exports.HomePage = HomePage;
exports.HomePage_to = (slug, target_element_id) => {
    ReactDOM.render(HomePage(slug), document.getElementById(target_element_id));
};
//# sourceMappingURL=homepage.js.map