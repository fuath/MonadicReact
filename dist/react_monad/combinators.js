"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Immutable = require("immutable");
var i18next = require("i18next");
var core_1 = require("./core");
var html_1 = require("./html");
var primitives_1 = require("./primitives");
var Repeat = /** @class */ (function (_super) {
    __extends(Repeat, _super);
    function Repeat(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.stopped = false;
        _this.state = { current_value: props.value, frame_index: 1 };
        return _this;
    }
    Repeat.prototype.componentWillUnmount = function () {
        this.stopped = true;
    };
    Repeat.prototype.componentWillMount = function () {
        this.stopped = false;
    };
    Repeat.prototype.render = function () {
        var _this = this;
        this.props.debug_info && console.log("Render:", this.props.debug_info(), this.state.current_value);
        return this.props.p(this.state.current_value).comp(this.props.context)(function (callback) { return function (new_value) {
            if (_this.stopped)
                return;
            return _this.setState(__assign({}, _this.state, { frame_index: _this.state.frame_index + 1, current_value: new_value }), function () {
                return _this.props.cont(callback)(new_value);
            });
        }; });
    };
    return Repeat;
}(React.Component));
exports.repeat = function (key, dbg) {
    return function (p) { return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Repeat, ({ kind: "repeat", debug_info: dbg, p: p, value: initial_value, context: ctxt, cont: cont, key: key }));
    }; }); }; };
};
var Any = /** @class */ (function (_super) {
    __extends(Any, _super);
    function Any(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { ps: "creating" };
        return _this;
    }
    Any.prototype.componentWillReceiveProps = function (new_props) {
        this.setState(__assign({}, this.state, { ps: new_props.ps.map(function (p) {
                return p(new_props.value).comp(new_props.context)(function (callback) { return function (new_value) {
                    return new_props.cont(callback)(new_value);
                }; });
            }) }));
    };
    Any.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { ps: this.props.ps.map(function (p) {
                return p(_this.props.value).comp(_this.props.context)(function (callback) { return function (new_value) {
                    return _this.props.cont(callback)(new_value);
                }; });
            }) }));
    };
    Any.prototype.render = function () {
        return React.createElement("div", { className: this.props.className },
            " ",
            this.state.ps != "creating" ? this.state.ps : null,
            " ");
    };
    return Any;
}(React.Component));
exports.any = function (key, className, dbg) {
    return function (ps) { return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Any, { kind: "any", debug_info: dbg, ps: ps, value: initial_value, context: ctxt, cont: cont, key: key, className: className });
    }; }); }; };
};
var Never = /** @class */ (function (_super) {
    __extends(Never, _super);
    function Never(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "loading" };
        return _this;
    }
    Never.prototype.componentWillReceiveProps = function (new_props) {
        this.setState(__assign({}, this.state, { p: new_props.p.comp(new_props.context)(function (callback) { return function (new_value) { }; }) }));
    };
    Never.prototype.componentWillMount = function () {
        this.setState(__assign({}, this.state, { p: this.props.p.comp(this.props.context)(function (callback) { return function (new_value) { }; }) }));
    };
    Never.prototype.render = function () {
        return this.state.p != "loading" ? this.state.p : [];
    };
    return Never;
}(React.Component));
exports.never = function (p, key) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Never, { kind: "never", p: p, context: ctxt, cont: cont, key: key, debug_info: undefined });
    }; });
};
var All = /** @class */ (function (_super) {
    __extends(All, _super);
    function All(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { results: Immutable.Map(), ps: "creating" };
        return _this;
    }
    All.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        this.setState(__assign({}, this.state, { ps: new_props.ps.map(function (p, p_i) {
                return p.comp(new_props.context)(function (callback) { return function (result) {
                    return _this.setState(__assign({}, _this.state, { results: _this.state.results.set(p_i, result) }), function () {
                        if (_this.state.results.keySeq().toSet().equals(Immutable.Range(0, new_props.ps.length).toSet())) {
                            var results_1 = _this.state.results.sortBy(function (r, r_i) { return r_i; }).toArray();
                            _this.setState(__assign({}, _this.state, { results: Immutable.Map() }), function () {
                                return new_props.cont(callback)(results_1);
                            });
                        }
                    });
                }; });
            }) }));
    };
    All.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { ps: this.props.ps.map(function (p, p_i) {
                return p.comp(_this.props.context)(function (callback) { return function (result) {
                    return _this.setState(__assign({}, _this.state, { results: _this.state.results.set(p_i, result) }), function () {
                        if (_this.state.results.keySeq().toSet().equals(Immutable.Range(0, _this.props.ps.length).toSet())) {
                            var results_2 = _this.state.results.sortBy(function (r, r_i) { return r_i; }).toArray();
                            _this.setState(__assign({}, _this.state, { results: Immutable.Map() }), function () {
                                return _this.props.cont(callback)(results_2);
                            });
                        }
                    });
                }; });
            }) }));
    };
    All.prototype.render = function () {
        return React.createElement("div", null,
            " ",
            this.state.ps != "creating" ? this.state.ps : null,
            " ");
    };
    return All;
}(React.Component));
exports.all = function (ps, key, dbg) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(All, { kind: "all", debug_info: dbg, ps: ps, context: ctxt, cont: cont, key: key });
    }; });
};
var Retract = /** @class */ (function (_super) {
    __extends(Retract, _super);
    function Retract(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "creating" };
        return _this;
    }
    Retract.prototype.componentWillReceiveProps = function (new_props) {
        this.setState(__assign({}, this.state, { p: new_props.p(new_props.inb(new_props.value)).comp(new_props.context)(function (callback) { return function (new_value) {
                return new_props.cont(callback)(new_props.out(new_props.value)(new_value));
            }; }) }));
    };
    Retract.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p(this.props.inb(this.props.value)).comp(this.props.context)(function (callback) { return function (new_value) {
                return _this.props.cont(callback)(_this.props.out(_this.props.value)(new_value));
            }; }) }));
    };
    Retract.prototype.render = function () {
        return this.state.p != "creating" ? this.state.p : [];
    };
    return Retract;
}(React.Component));
exports.retract = function (key, dbg) {
    return function (inb, out, p) { return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Retract, { kind: "retract", debug_info: dbg, inb: inb, out: out, p: p, value: initial_value, context: ctxt, cont: cont, key: key });
    }; }); }; };
};
var LiftPromise = /** @class */ (function (_super) {
    __extends(LiftPromise, _super);
    function LiftPromise(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.wait_time = 500;
        _this.stopped = false;
        _this.state = { result: "busy", input: props.value };
        return _this;
    }
    LiftPromise.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        // if (this.state.result != "busy" && this.state.result != "error") {
        //   this.props.debug_info && console.log("New props (ignored):", this.props.debug_info(), this.state.input, new_props.value)
        //   return
        // }
        this.props.debug_info && console.log("New props:", this.props.debug_info(), this.state.input, new_props.value);
        this.setState(__assign({}, this.state, { input: new_props.value }), function () {
            return _this.load(new_props);
        });
    };
    LiftPromise.prototype.load = function (props) {
        var _this = this;
        if (this.stopped)
            return;
        this.setState(__assign({}, this.state, { result: "busy" }), function () {
            return props.p(_this.state.input).then(function (x) {
                _this.wait_time = 500;
                if (_this.props.debug_info)
                    console.log("Promise done:", _this.props.debug_info());
                if (_this.stopped)
                    return;
                _this.setState(__assign({}, _this.state, { result: x }), function () { return props.cont(function () { return null; })(x); });
            })
                .catch(function () {
                if (props.retry_strategy == "never") {
                    if (_this.stopped)
                        return;
                    _this.setState(__assign({}, _this.state, { result: "error" }));
                }
                else {
                    _this.wait_time = Math.floor(Math.max(_this.wait_time * 1.5, 2500));
                    setTimeout(function () { return _this.load(props); }, _this.wait_time);
                }
            });
        });
    };
    LiftPromise.prototype.componentWillUnmount = function () {
        this.stopped = true;
    };
    LiftPromise.prototype.componentWillMount = function () {
        this.stopped = false;
        this.props.debug_info && console.log("Mount:", this.props.debug_info());
        this.load(this.props);
    };
    LiftPromise.prototype.render = function () {
        this.props.debug_info && console.log("Render:", this.props.debug_info());
        return this.state.result == "busy" ? React.createElement("div", { className: "busy" }, i18next.t("busy"))
            : this.state.result == "error" ? React.createElement("div", { className: "error" }, i18next.t("error"))
                : []; // <div className="done">{i18next.t("done")}</div>
    };
    return LiftPromise;
}(React.Component));
exports.lift_promise = function (p, retry_strategy, key, dbg) {
    return function (x) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(LiftPromise, { kind: "lift promise", debug_info: dbg, value: x, retry_strategy: retry_strategy, p: p, context: ctxt, cont: cont, key: key });
    }; }); };
};
var Delay = /** @class */ (function (_super) {
    __extends(Delay, _super);
    function Delay(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.running = false;
        _this.state = { status: "dirty", value: props.value, last_command: props.p(props.value).comp(props.context)(props.cont) };
        return _this;
    }
    Delay.prototype.componentWillMount = function () {
        var _this = this;
        // console.log("starting delay thread")
        if (this.running)
            return;
        this.running = true;
        var self = this;
        var process = function () { return setTimeout(function () {
            // console.log("delay is ticking", self.state.status, self.state.value)
            if (self.state.status == "dirty") {
                // console.log("delay is submitting the data to save")
                if (!_this.running)
                    return;
                self.setState(__assign({}, self.state, { status: "waiting", last_command: self.props.p(self.state.value).comp(_this.props.context)(function (callback) { return function (new_value) {
                        // console.log("calling the continuation of dirty", self.state.value)
                        self.props.cont(callback)(new_value);
                    }; }) }));
                process();
            }
            else {
                if (self.running)
                    process();
            }
        }, self.props.dt); };
        process();
    };
    Delay.prototype.componentWillUnmount = function () {
        // console.log("stopping delay thread")
        this.running = false;
    };
    Delay.prototype.componentWillReceiveProps = function (new_props) {
        // console.log("Delay received new props and is going back to dirty")
        this.setState(__assign({}, this.state, { value: new_props.value, status: "dirty" }));
    };
    Delay.prototype.render = function () {
        return this.state.last_command;
    };
    return Delay;
}(React.Component));
exports.delay = function (dt, key, dbg) {
    return function (p) { return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Delay, { kind: "delay", debug_info: dbg, dt: dt, p: p, value: initial_value, context: ctxt, cont: cont, key: key });
    }; }); }; };
};
exports.mk_submenu_entry = function (label, children) { return { kind: "sub menu", label: label, children: children }; };
exports.mk_menu_entry = function (v) { return { kind: "item", value: v }; };
exports.simple_menu = function (type, to_string, key, dbg) {
    var content_menu_class, content_class, menu_class, entries_class, entry_class, sub_entry_class;
    if (type == "side menu") {
        content_menu_class = "monadic-content-with-menu";
        content_class = "monadic-content";
        menu_class = "monadic-content-menu";
        entries_class = "monadic-content-menu__entries";
        entry_class = "monadic-content-menu__entry";
        sub_entry_class = "monadic-content-menu__sub-entry";
    }
    else {
        content_menu_class = "monadic-content-with-tabs";
        content_class = "monadic-content";
        menu_class = "monadic-tabs";
        entries_class = "monadic-tabs__entries";
        entry_class = "monadic-tabs__entry";
        sub_entry_class = "monadic-tabs__sub-entry";
    }
    return function (items_array, p, selected_item, selected_sub_menu) {
        var items = Immutable.List(items_array);
        var entries = function (s) {
            return (type != "side menu" && s.shown_range.first > 0 ?
                [function (s) { return html_1.div(entry_class + " monadic-prev-tab")(html_1.a("<"))(__assign({}, s, { shown_range: __assign({}, s.shown_range, { first: s.shown_range.first - 1 }) })); }]
                :
                    []).concat(items.map(function (item, i) {
                return function (s) {
                    return item.kind == "item" ?
                        html_1.div(entry_class + " " + (s.selected.kind == "item" && item.value == s.selected.value ? " " + entry_class + "--active" : ""), to_string(item.value))(html_1.a(to_string(item.value), undefined, undefined, false, undefined))(__assign({}, s, { sub_selected: { kind: "nothing" }, selected: item, last_action: { kind: "selection" } }))
                        :
                            exports.any(item.label)([
                                function (s) { return html_1.div(entry_class + " ", item.label)(html_1.a(item.label, undefined, undefined, false, undefined))(__assign({}, s, { sub_selected: item, last_action: { kind: "selection" } })); }
                            ].concat((s.sub_selected.kind == "sub menu" && item.label == s.sub_selected.label) ||
                                (s.selected.kind == "item" && item.children.some(function (c) { return s.selected.kind == "item" && c.value == s.selected.value; })) ?
                                item.children.map(function (c) {
                                    return function (s) { return html_1.div(sub_entry_class + " " + (s.selected.kind == "item" && c.value == s.selected.value ? " " + sub_entry_class + "--active" : ""), to_string(c.value))(html_1.a(to_string(c.value), undefined, undefined, false, undefined))(__assign({}, s, { sub_selected: item, selected: c, last_action: { kind: "selection" } })); };
                                })
                                :
                                    []))(s);
                };
            }).filter(function (i, i_i) { return type == "side menu" || i_i >= s.shown_range.first && (i_i - s.shown_range.first) < s.shown_range.amount; })
                .concat(type != "side menu" && s.shown_range.first + s.shown_range.amount < items.count() ?
                [function (s) { return html_1.div(entry_class + " monadic-next-tab")(html_1.a(">"))(__assign({}, s, { shown_range: __assign({}, s.shown_range, { first: s.shown_range.first + 1 }) })); }]
                :
                    [])
                .toArray());
        };
        return exports.repeat()(html_1.div()(exports.any(undefined, content_menu_class)([
            html_1.div(menu_class, menu_class)(function (s) { return exports.any(undefined, entries_class)(entries(s))(s); }),
            html_1.div(content_class, content_class)(function (s) { return s.selected.kind == "item" ?
                p(s.selected.value).then(undefined, function (p_res) { return core_1.unit(__assign({}, s, { last_action: { kind: "p", p_res: p_res } })); })
                :
                    core_1.unit(s).never(); })
        ])))({ selected: selected_item == undefined ? { kind: "nothing" } : { kind: "item", value: selected_item },
            sub_selected: selected_sub_menu == undefined ? { kind: "nothing" } : { kind: "sub menu", label: selected_sub_menu },
            last_action: { kind: "init" },
            shown_range: type == "side menu" ? undefined : { first: 0, amount: type.max_tabs } })
            .filter(function (s) { return s.last_action.kind != "p"; })
            .map(function (s) { return s.last_action.kind == "p" && s.last_action.p_res; });
    };
};
exports.custom = function (key, dbg) {
    return function (render) { return core_1.make_C(function (ctxt) { return function (cont) { return render(ctxt)(cont); }; }); };
};
exports.hide = function (f_name, f) {
    return exports.repeat()(function (visible) {
        return primitives_1.bool("edit", "plus/minus")(visible);
    })(false).then(f_name + " toggle", function (visible) {
        return !visible ?
            core_1.unit(null)
            :
                f.then("visible " + f_name, function (_) { return core_1.unit(null); });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVhY3RfbW9uYWQvY29tYmluYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkJBQThCO0FBRTlCLHFDQUFzQztBQUN0QyxpQ0FBa0M7QUFFbEMsK0JBQTRFO0FBQzVFLCtCQUE2QjtBQUM3QiwyQ0FBaUM7QUFhakM7SUFBd0IsMEJBQThDO0lBQ3BFLGdCQUFZLEtBQW9CLEVBQUMsT0FBVztRQUE1QyxZQUNFLGtCQUFNLEtBQUssRUFBRSxPQUFPLENBQUMsU0FFdEI7UUFDRCxhQUFPLEdBQVcsS0FBSyxDQUFBO1FBRnJCLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxFQUFFLENBQUE7O0lBQzVELENBQUM7SUFHRCxxQ0FBb0IsR0FBcEI7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtJQUNyQixDQUFDO0lBRUQsbUNBQWtCLEdBQWxCO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7SUFDdEIsQ0FBQztJQUVELHVCQUFNLEdBQU47UUFBQSxpQkFPQztRQU5DLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUNsRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFVBQUEsU0FBUztZQUMxRixFQUFFLENBQUMs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