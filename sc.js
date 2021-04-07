! function () {
    var g = {
        _textEvent: function (e) {
            var t = (i = e.target).dd,
                d = cur.wdd[t];
            switch (e.type) {
                case "focus":
                    i.focused = !0, (!i.active || d.opts.noMultiSelect && d.chosen && d.chosen[1] == val(i)) && (val(i, ""), i.style.color = "", i.active = 1, i.phd = !1), g._updateTextInput(d), g._updateList(d), d.opts.onTextFocus && d.opts.onTextFocus();
                    break;
                case "blur":
                    i.focused = !1, (i.active = !i.phd && i.value ? 1 : "") ? d.over && d.opts.chooseOnBlur && d.opts.chooseOnBlur(d.over) && (g.select(t), hide(i), d.full || show(d.add)) : isEmpty(d.selected) && !d.chosen ? (val(i, i.ph), i.style.color = "#777", i.phd = !0) : d.chosen && !val(i) ? val(i, "INPUT" == i.tagName ? unclean(d.chosen[1]) : d.chosen[1]) : (hide(i), d.full || show(d.add)), g._hideList(d), d.opts.onTextBlur && d.opts.onTextBlur();
                    break;
                case "keydown":
                case "keypress":
                case "paste":
                    clearTimeout(d.updateTimer), d.updateTimer = setTimeout(g._updateList.pbind(d, !1), 0);
                    var i = ge("wddi" + d.over + "_" + t);
                    if (e.keyCode == KEY.UP) return i && domPS(i) && g.over(t, domPS(i).id.replace(/^wddi/, "").replace(new RegExp("_" + t + "$", ""), ""), !0), e.canceled = !0, cancelEvent(e);
                    if (e.keyCode == KEY.DOWN) return i && domNS(i) && g.over(t, domNS(i).id.replace(/^wddi/, "").replace(new RegExp("_" + t + "$", ""), ""), !0), e.canceled = !0, cancelEvent(e);
                    if (e.keyCode == KEY.RETURN) return g.select(t), e.canceled = !0, cancelEvent(e);
                    if (e.keyCode == KEY.ESC) return d.text.blur(), e.canceled = !0, cancelEvent(e);
                    d.opts.onSearch && (clearTimeout(d.searchTimer), d.searchTimer = setTimeout(function () {
                        d.opts.onSearch(trim(val(d.text)), d)
                    }, 0))
            }
        },
        _getTextValue: function () {
            return this.active ? this.value : ""
        },
        _widenTextInput: function (e) {
            vk.rtl ? e.text.style.width = Math.max((20 < e.text.offsetTop ? e.fullWidth : e.partWidth) - e.fullWidth + (e.text.offsetLeft + e.text.offsetWidth) - 2, e.addWidth) - e.textDelta + "px" : e.text.style.width = Math.max((20 < e.text.offsetTop ? e.fullWidth : e.partWidth) - (e.text.offsetLeft - e.textOffset) - 2, e.addWidth) - e.textDelta + "px", g._showList(e)
        },
        _updateTextInput: function (e) {
            e.addWidth && (e.text.style.width = e.addWidth - e.textDelta + "px", setTimeout(g._widenTextInput.pbind(e), 0))
        },
        _focusText: function (e) {
            e.full || e.disabled || (hide(e.add), show(e.text), g._updateTextInput(e), setTimeout(elfocus.pbind(e.text), 0))
        },
        _clickEvent: function (e, t) {
            if (t.target != e.arrow) {
                if (t.target == e.text.parentNode) return g._focusText(e);
                for (var d = t.target; d && d != e.text.parentNode; d = d.parentNode)
                    if (d == e.add) return g._focusText(e)
            }
        },
        _arrDownEvent: function (e, t) {
            isVisible(e.listWrap) ? g._hideList(e) : g._focusText(e)
        },
        _afterInit: function (e) {
            g._index(e), browser.opera_mobile || g._textEvent({
                target: e.text,
                type: e.text.focused ? "focus" : "blur"
            }), extend(e, {
                addWidth: getSize(e.add)[0],
                textDelta: getSize(e.text)[0] - intval(getStyle(e.text, "width")),
                fullWidth: getSize(domPN(e.text))[0] - 5,
                textOffset: e.text.offsetLeft
            }), e.partWidth = e.fullWidth - getSize(e.arrow)[0], e.text.focused ? g._updateList(e) : g._updateTextInput(e), addEvent(e.text.parentNode, "click", g._clickEvent.pbind(e)), addEvent(e.arrow, "mousedown", g._arrDownEvent.pbind(e)), e.opts.noMultiSelect && e.opts.chosen && g.choose(e.id, !1, e.opts.chosen, !0)
        },
        _updateList: function (e, t, d) {
            if (e.cache[""])
                if (d = void 0 !== d ? d : trim(val(e.text)), e.lastQ !== d || t) {
                    e.lastQ = d, clearTimeout(e.requestTimer);
                    var i = e.opts.custom,
                        s = i && i(d);
                    s ? g._renderList(e, s) : (s = e.cache[d]) ? g._renderList(e, s, !0) : (s = g._search(e, d), g._renderList(e, s, !e.opts.url), e.opts.url && (e.requestTimer = setTimeout(g._requestList.pbind(e), e.opts.requestWait)))
                } else g._showList(e)
        },
        _index: function (e) {
            var t, d, i = e.opts.defaultItems,
                s = e.opts.items,
                a = [];
            for (t = 0, d = i.length; t < d; ++t) a.push(t);
            for (e.cache[""] = a, t = 0, d = s.length; t < d; ++t) g._indexItem(e, t, s[t])
        },
        _indexItem: function (e, t, d) {
            var i, s, a, o = "",
                r = e.opts.searchKeys,
                n = {};
            for (i = 0, a = r.length; i < a; ++i) o += " " + (d[r[i]] || "").replace(e.opts.delimeter, " ").replace(/<[^>]*>/g, "");
            for (o += (parseLatin(o) || "") + (parseCyr(o) || ""), o = trim(o.toLowerCase()).split(/\s+/), i = 0; i < o.length; i++)
                for (s = 1; s <= e.opts.wholeIndex; s++) {
                    var l = o[i].substr(0, s);
                    n[l] || (e.index[l] || (e.index[l] = []), e.index[l].push(t), n[l] = 1)
                }
        },
        _search: function (e, t) {
            if (!(t = trim(t.toLowerCase().replace(e.opts.delimeter, " ")))) return e.cache[""];
            var d = e.opts.wholeIndex;
            if (t.length <= d && -1 == t.indexOf(" ")) return e.index[t] || [];
            var i, s, a = 0,
                o = "";
            for (i = 0, s = (t = t.split(" ")).length; i < s; ++i) {
                var r = t[i].substr(0, d),
                    n = e.index[r];
                if (o && n && !(n.length < a) || (a = n ? n.length : 0, o = r), !a) return []
            }
            var l = [],
                c = e.opts.searchKeys,
                u = c.length,
                p = t.length;
            for (i = 0, s = e.index[o].length; i < s; ++i) {
                for (var f = e.index[o][i], _ = e.opts.items[f], v = !1, h = "", m = 0; m < u; ++m) h += " " + (_[c[m]] || "").replace(e.opts.delimeter, " ").replace(/<[^>]*>/g, "");
                for (h = (h += (parseLatin(h) || "") + (parseCyr(h) || "")).toLowerCase(), m = 0; m < p; ++m)
                    if (-1 == h.indexOf(" " + t[m])) {
                        v = !0;
                        break
                    } v || l.push(f)
            }
            return l
        },
        _requestList: function (t) {
            var d = trim(val(t.text));
            d && ajax.post(t.opts.url, extend({
                str: d
            }, t.opts.params || {}), {
                onDone: function (e) {
                    t.opts.onDataLoaded && (e = t.opts.onDataLoaded(e)), t.cache[d] = g._search(t, d).concat(e), g._renderList(t, e, !0, !0)
                }
            })
        },
        _renderList: function (e, t, d, i) {
            var s = [],
                a = 0,
                o = e.lastQ,
                r = g._highlight,
                n = e.opts.itemMark;
            e.outdated && (i = !1), a = i ? (e.list.__uiScroll__ ? e.list.__uiScroll__.content : e.list).childNodes.length : (e.shown = {}, 0);
            for (var l = 0, c = t.length; l < c; ++l) {
                var u = t[l];
                isArray(u) || (u = e.opts.items[u]);
                var p = u[0] + "",
                    f = p + "_",
                    _ = "";
                if (cur.shNewUi) {
                    if (e.selected[f] || e.shown[f] || e.selCount && 0 < u[8] && !e.opts.allowMultiselectAll) continue
                } else if (e.selected[f] || e.shown[f] || e.selCount && 0 < u[8]) continue;
                e.shown[f] = u;
                var v = isArray(u[3]) ? "" : " " + onlinePlatformClass(n(u)),
                    h = u[3] ? '<b class="fl_l wddi_thumb' + v + '"><img class="wddi_img" src="' + (isArray(u[3]) ? "/images/community_" + (2 <= window.devicePixelRatio ? 100 : 50) + ".png" : u[3]) + '" /></b>' : "";
                a ? _ = "wddi" : (_ = "wddi_over", e.over = p);
                var m = o && r(u[1] || "", o) || u[1] || "",
                    w = o && r(u[2] || "", o) || u[2] || "",
                    x = o && r(u[10] || "", o) || u[10] || "";
                s.push('<div class="' + _ + '" onmousedown="WideDropdown.over(\'' + e.id + "', '" + clean(p) + "'); WideDropdown.select('" + e.id + "', event)\" onmousemove=\"WideDropdown.over('" + e.id + "', '" + clean(p) + '\')" id="wddi' + p + "_" + e.id + '" onclick="">  <div class="wddi_data">' + h + '    <div class="wddi_text">' + m + '</div>    <div class="wddi_sub">' + w + x + "</div>  </div></div>"), ++a
            }
            s = s.join(""), !a && d && (s = '<div class="wddi_no">' + (o ? e.opts.noResult : e.opts.introText) + "</div>"), i ? (e.list.__uiScroll__ ? e.list.__uiScroll__.content : e.list).innerHTML += s : s ? (e.outdated = !1, (e.list.__uiScroll__ ? e.list.__uiScroll__.content : e.list).innerHTML = s) : e.outdated = !0, e.outdated || (e.list.style.height = 5 < a ? "242px" : "", g._showList(e), e.scroll && e.scroll.scrollTop(), setTimeout(g._checkScroll.pbind(e), 0)), g._updatePos(e)
        },
        _highlight: function (e, t) {
            var d = [escapeRE(t)],
                i = parseLatin(t),
                s = parseCyr(t);
            null !== i && d.push(escapeRE(i)), null !== s && d.push(escapeRE(s));
            var a = new RegExp("(?![^&;]+;)(?!<[^<>]*)((\\(*)(" + d.join("|") + "))(?![^<>]*>)(?![^&;]+;)", "gi");
            return e.replace(a, '$2<span class="wdd_hl">$3</span>')
        },
        _checkScroll: function (e) {
            void 0 === e.scroll && (e.scroll = !1, stManager.add(["ui_common.css", "ui_common.js"], function () {
                e.scroll = new uiScroll(e.list, {
                    global: !0
                })
            }))
        },
        _updatePos: function (e) {
            var t = e.opts.toup ? -getSize(e.listWrap)[1] - (e.opts.input && getSize(e.opts.input)[1] || 0) : getSize(e.listWrap.parentNode)[1];
            e.listWrap.style.marginTop = t + "px"
        },
        _showList: function (e) {
            e.text.focused && !e.disabled && (isVisible(e.listWrap) || (ge(e.listWrap).style.display = "block", e.scroll && e.scroll.update(), g._updateList(e, !0)), g._updatePos(e), addClass(e.container, "wdd_focused"))
        },
        _hideList: function (e) {
            hide(e.listWrap), removeClass(e.container, "wdd_focused")
        },
        _updateImgs: function (e, t) {
            var d = e.img;
            if (e.img) {
                t = e.opts.noAnim ? e.opts.noAnim : t;
                var i, s = 0,
                    a = [],
                    o = [];
                for (var r in e.selected) {
                    var n = (_ = e.selected[r])[3],
                        l = _[4],
                        c = _[5],
                        u = _[6];
                    if (isArray(n))
                        for (var p = 0, f = n.length; p < f; ++p)(d = clone(_))[0] = u[p], d[3] = n[p], d[4] = l[p], d[5] = c[p], o.push(d);
                    else o.push(_)
                }
                for (var r in i = o.length, o) {
                    var _, v, h, m, w, x;
                    n = (_ = o[r])[3], l = _[4];
                    if (v = 3 < i ? "wdd_img_tiny " + (1 == ++s || 4 == s ? "fl_l" : "fl_r") : 3 == i ? s++ ? "wdd_img_tiny fl_r" : "wdd_img_half fl_l" : 2 == i ? "wdd_img_half " + (s++ ? "fl_r" : "fl_l") : "wdd_img_full", a.push(l ? '<a href="' + l + '" class="' + v + '">' : '<div class="' + v + '">'), a.push('<img class="wdd_img" src="' + n + '" />'), a.push(l ? "</a>" : "</div>"), 4 <= s) break
                }
                if (h = a.join("") || e.opts.defImgText || "", !(e.imgRand = !1) === t) val(e.img, h);
                else {
                    for (w = ce("div", {
                            className: "wdd_img_layer",
                            innerHTML: h
                        }), x = e.imgRand = Math.random(), m = domFC(e.img); m && "wdd_img_layer" == m.className;) m = domNS(m);
                    animate(m ? e.img.insertBefore(w, m) : e.img.appendChild(w), {
                        opacity: 1
                    }, 150, function () {
                        e.imgRand === x && val(e.img, h)
                    })
                }
            }
        },
        init: function (e, t) {
            if (!(e = ge(e))) return !1;
            stManager.add(["notifier.css", "notifier.js"]);
            var d = e.id;
            if (!e.id) return !1;
            if (cur.wdd) {
                if (cur.wdd[d]) return !1
            } else cur.wdd = {};
            t = extend({
                cacheLength: 1e4,
                requestWait: 300,
                wholeIndex: 2,
                maxItems: 29,
                noAnim: !1,
                searchKeys: [1],
                defaultItems: t.items || [],
                items: t.defaultItems || [],
                itemMark: function (e) {
                    return intval(e[5])
                }
            }, t || {});
            var i = {
                id: d,
                container: e,
                text: geByClass1("wdd_text", e),
                arrow: geByClass1("wdd_arr", e),
                img: t.img && ge(t.img),
                opts: t,
                selected: {},
                selCount: 0,
                index: {},
                delimeter: /[\s\(\)\.,\-]+/g,
                cache: {}
            };
            return (i.text.ph = i.text.getAttribute("placeholder") || "") && e.setAttribute("placeholder", ""), i.text.dd = d, t.toup && addClass(e, "wdd_toup"), i.add = e.insertBefore(ce("div", {
                className: "wdd_add fl_l",
                innerHTML: '<div class="wdd_add2">  <table cellspacing="0" cellpadding="0"><tr>    <td><div class="wdd_add3">      <nobr>' + getLang("global_add") + '</nobr>    </div></td>    <td><div class="wdd_add_plus" onmousedown="WideDropdown.focus(\'' + d + "')\"></div></td>  </table></div>"
            }), i.text), i.bubbles = e.insertBefore(ce("div", {
                className: "wdd_bubbles"
            }), i.add), i.listWrap = e.insertBefore(ce("div", {
                className: "wdd_lwrap",
                innerHTML: '<div class="wdd_list"></div>'
            }, {
                display: "none",
                width: t.width || getSize(e)[0] || "auto"
            }), e.firstChild), i.list = geByClass1("wdd_list", i.listWrap), browser.opera_mobile || (i.text.active = val(i.text) ? 1 : "", i.text.getValue = g._getTextValue.bind(i.text), addEvent(i.text, "focus blur paste " + (browser.opera ? "keypress" : "keydown"), g._textEvent)), setTimeout(g._afterInit.pbind(i), 0), cur.wdd[d] = i
        },
        initSelect: function (e, t) {
            if (!(e = ge(e))) return !1;
            stManager.add(["notifier.css", "notifier.js"]);
            var d = e.id;
            if (!e.id) return !1;
            cur.wdd || (cur.wdd = {});
            var i = {
                id: d,
                container: e,
                text: (t = extend({
                    cacheLength: 1e4,
                    requestWait: 300,
                    wholeIndex: 2,
                    maxItems: 29,
                    searchKeys: [1],
                    defaultItems: t.items || [],
                    items: t.defaultItems || [],
                    itemMark: function (e) {
                        return intval(e[5])
                    }
                }, t || {})).text || geByClass1("wdd_text", e),
                opts: t,
                selected: {},
                selCount: 0,
                index: {},
                delimeter: /[\s\(\)\.,\-]+/g,
                cache: {}
            };
            return i.text.dd = d, t.toup && addClass(e, "wdd_toup"), i.listWrap = e.insertBefore(ce("div", {
                className: "wdd_lwrap",
                innerHTML: '<div class="wdd_list"></div>'
            }, {
                display: "none",
                width: t.width || getSize(e)[0]
            }), e.firstChild), i.list = geByClass1("wdd_list", i.listWrap), setTimeout(g._index.pbind(i), 0), cur.wdd[d] = i
        },
        deinit: function (e, t) {
            if (!(t = t || cur).wdd || !(e = ge(e))) return !1;
            var d = e.id;
            if (!e.id) return !1;
            var i = t.wdd[d];
            return !!i && (cleanElems(i.text, domPN(i.text)), delete t.wdd[d], !0)
        },
        items: function (e, t, d) {
            var i = cur.wdd[e];
            d = d || t, extend(i, {
                index: {},
                cache: {}
            }), extend(i.opts, {
                defaultItems: t || [],
                items: d || []
            }), g._index(i), g._updateList(i, !0)
        },
        over: function (e, t, d) {
            var i = cur.wdd[e];
            if (i.over != t) {
                i.over && replaceClass("wddi" + i.over + "_" + e, "wddi_over", "wddi"), i.over = t;
                var s = ge("wddi" + i.over + "_" + e);
                replaceClass(s, "wddi", "wddi_over"), d && i.scroll && i.scroll.scrollIntoView(s.firstElementChild || s)
            }
        },
        choose: function (e, t, d, i) {
            var s = cur.wdd[e],
                a = d ? d[0] : s.over,
                o = a + "_";
            if (d = d || s.shown[o], void 0 !== a && d) {
                if (s.over = !1, s.opts.onItemSelect && !1 === s.opts.onItemSelect(d)) return t && cancelEvent(t);
                s.chosen = d, val(s.text, "INPUT" == s.text.tagName ? unclean(d[1]) : d[1]), s.text.style.color = "", s.text.blur(), g._textEvent({
                    target: s.text,
                    type: s.text.focused ? "focus" : "blur"
                });
                var r = !(s.opts.onChange && !i) || s.opts.onChange(1, a),
                    n = 1 === r;
                return 0 !== r && setTimeout(g._updateImgs.pbind(s, n), 0), t && cancelEvent(t)
            }
        },
        select: function (e, t, d) {
            var i = cur.wdd[e],
                s = d ? d[0] : i.over,
                a = s + "_";
            if (i.opts.noMultiSelect) return this.choose(e, t, d);
            if (d = d || i.shown[a], void 0 !== s && !i.selected[a] && d) {
                if (i.over = !1, i.opts.onItemSelect && !1 === i.opts.onItemSelect(d)) return t && cancelEvent(t);
                i.selected[a] = d, ++i.selCount, cur.shNewUi ? i.full = i.opts.maxItems && i.selCount >= i.opts.maxItems || 0 < d[8] && !i.opts.allowMultiselectAll : i.full = i.opts.maxItems && i.selCount >= i.opts.maxItems || 0 < d[8], i.bubbles.appendChild(ce("div", {
                    id: "wddb" + a + e,
                    className: "summary_tab_sel fl_l",
                    innerHTML: '<div class="summary_tab2">  <table cellspacing="0" cellpadding="0"><tr>    <td><div class="summary_tab3">      <nobr>' + d[1] + '</nobr>    </div></td>    <td><div class="summary_tab_x" onmousedown="WideDropdown.deselect(\'' + e + "', '" + clean(s + "") + "', event)\"></div></td>  </table></div>"
                })), val(i.text, ""), i.text.blur(), g._textEvent({
                    target: i.text,
                    type: i.text.focused ? "focus" : "blur"
                }), i.full ? (hide(i.add), i.arrow.style.visibility = "hidden") : g._updateList(i, !0);
                var o = !i.opts.onChange || i.opts.onChange(1, s),
                    r = 1 === o;
                return 0 !== o && setTimeout(g._updateImgs.pbind(i, r), 0), t && cancelEvent(t)
            }
        },
        updimgs: function (e) {
            var t = cur.wdd[e],
                d = !t.opts.onChange || t.opts.onChange(0),
                i = 1 === d;
            0 !== d && setTimeout(g._updateImgs.pbind(t, i), 0)
        },
        focus: function (e) {
            g._focusText(cur.wdd[e])
        },
        clear: function (e) {
            var t = cur.wdd[e];
            val(t.text, ""), t.text.blur(), g._textEvent({
                target: t.text,
                type: t.text.focused ? "focus" : "blur"
            }), g._updateList(t, !0)
        },
        disable: function (e, t) {
            var d = cur.wdd[e];
            t && !d.disabled ? (d.disabled = !0, addClass(e, "wdd_disabled")) : !t && d.disabled && (d.disabled = !1, removeClass(e, "wdd_disabled"), g._updateList(d, !0))
        }
    };
    window.WideDropdown = g
}();
try {
    stManager.done("wide_dd.js")
} catch (e) {}