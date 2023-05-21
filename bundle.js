
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe$1(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe$1(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Schedules a callback to run immediately before the component is updated after any state change.
     *
     * The first time the callback runs will be before the initial `onMount`
     *
     * https://svelte.dev/docs#run-time-svelte-beforeupdate
     */
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    /**
     * Retrieves the whole context map that belongs to the closest parent component.
     * Must be called during component initialisation. Useful, for example, if you
     * programmatically create a component and want to pass the existing context to it.
     *
     * https://svelte.dev/docs#run-time-svelte-getallcontexts
     */
    function getAllContexts() {
        return get_current_component().$$.context;
    }
    /**
     * Checks whether a given `key` has been set in the context of a parent component.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-hascontext
     */
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind$1(component, name, callback, value) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            if (value === undefined) {
                callback(component.$$.ctx[index]);
            }
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }
    /**
     * Base class to create strongly typed Svelte components.
     * This only exists for typing purposes and should be used in `.d.ts` files.
     *
     * ### Example:
     *
     * You have component library on npm called `component-library`, from which
     * you export a component called `MyComponent`. For Svelte+TypeScript users,
     * you want to provide typings. Therefore you create a `index.d.ts`:
     * ```ts
     * import { SvelteComponentTyped } from "svelte";
     * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
     * ```
     * Typing this makes it possible for IDEs like VS Code with the Svelte extension
     * to provide intellisense and to use the component like this in a Svelte file
     * with TypeScript:
     * ```svelte
     * <script lang="ts">
     * 	import { MyComponent } from "component-library";
     * </script>
     * <MyComponent foo={'bar'} />
     * ```
     *
     * #### Why not make this part of `SvelteComponent(Dev)`?
     * Because
     * ```ts
     * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
     * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
     * ```
     * will throw a type error, so we need to separate the more strictly typed class.
     */
    class SvelteComponentTyped extends SvelteComponentDev {
        constructor(options) {
            super(options);
        }
    }

    function subscribe(store, ...callbacks) {
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get(store) {
        let value = undefined;
        subscribe(store, (_) => (value = _))();
        return value;
    }

    class FelteSubmitError extends Error {
        constructor(message, response) {
            super(message);
            this.name = 'FelteSubmitError';
            this.response = response;
        }
    }

    /** @ignore */
    function _some(obj, pred) {
        const keys = Object.keys(obj);
        return keys.some((key) => pred(obj[key]));
    }

    /** @ignore */
    function _mapValues(obj, updater) {
        const keys = Object.keys(obj || {});
        return keys.reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: updater(obj[key]) })), {});
    }

    /** @ignore */
    function _isPlainObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    /** @ignore */
    function _cloneDeep(obj) {
        return Object.keys(obj || {}).reduce((res, key) => (Object.assign(Object.assign({}, res), { [key]: _isPlainObject(obj[key])
                ? _cloneDeep(obj[key])
                : Array.isArray(obj[key])
                    ? [...obj[key]]
                    : obj[key] })), {});
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest$2(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function handleArray(value) {
        return function (propVal) {
            if (_isPlainObject(propVal)) {
                const _a = deepSet(propVal, value), field = __rest$2(_a, ["key"]);
                return field;
            }
            return value;
        };
    }
    /**
     * @category Helper
     */
    function deepSet(obj, value) {
        return _mapValues(obj, (prop) => _isPlainObject(prop)
            ? deepSet(prop, value)
            : Array.isArray(prop)
                ? prop.map(handleArray(value))
                : value);
    }

    /** @ignore */
    function _mergeWith(...args) {
        const customizer = args.pop();
        const _obj = args.shift();
        if (typeof _obj === "string")
            return _obj;
        const obj = _cloneDeep(_obj);
        if (args.length === 0)
            return obj;
        for (const source of args) {
            if (!source)
                continue;
            if (typeof source === "string")
                return source;
            let rsValue = customizer(obj, source);
            if (typeof rsValue !== 'undefined')
                return rsValue;
            const keys = Array.from(new Set(Object.keys(obj).concat(Object.keys(source))));
            for (const key of keys) {
                rsValue = customizer(obj[key], source[key]);
                if (typeof rsValue !== 'undefined') {
                    obj[key] = rsValue;
                }
                else if (_isPlainObject(source[key]) && _isPlainObject(obj[key])) {
                    obj[key] = _mergeWith(obj[key], source[key], customizer);
                }
                else if (Array.isArray(source[key])) {
                    obj[key] = source[key].map((val, i) => {
                        if (!_isPlainObject(val))
                            return val;
                        const newObj = Array.isArray(obj[key]) ? obj[key][i] : obj[key];
                        return _mergeWith(newObj, val, customizer);
                    });
                }
                else if (_isPlainObject(source[key])) {
                    const defaultObj = deepSet(_cloneDeep(source[key]), undefined);
                    obj[key] = _mergeWith(defaultObj, source[key], customizer);
                }
                else if (typeof source[key] !== 'undefined') {
                    obj[key] = source[key];
                }
            }
        }
        return obj;
    }

    function defaultsCustomizer(objValue, srcValue) {
        if (_isPlainObject(objValue) && _isPlainObject(srcValue))
            return;
        if (Array.isArray(srcValue)) {
            if (srcValue.some(_isPlainObject))
                return;
            const objArray = Array.isArray(objValue) ? objValue : [];
            return srcValue.map((value, index) => { var _a; return (_a = objArray[index]) !== null && _a !== void 0 ? _a : value; });
        }
        if (typeof objValue !== 'undefined')
            return objValue;
    }
    /** @ignore */
    function _defaultsDeep(...args) {
        return _mergeWith(...args, defaultsCustomizer);
    }

    /** @ignore */
    function _merge(...args) {
        return _mergeWith(...args, () => undefined);
    }

    /* From: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get */
    /** @ignore */
    function _get(obj, path, defaultValue) {
        const travel = (regexp) => String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
        const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
        return result === undefined || result === obj ? defaultValue : result;
    }

    /** @ignore */
    function _update(obj, path, updater) {
        if (obj)
            obj = _cloneDeep(obj);
        if (!_isPlainObject(obj))
            obj = {};
        const splitPath = !Array.isArray(path) ? path.match(/[^.[\]]+/g) || [] : path;
        const lastSection = splitPath[splitPath.length - 1];
        if (!lastSection)
            return obj;
        let property = obj;
        for (let i = 0; i < splitPath.length - 1; i++) {
            const section = splitPath[i];
            if (!property[section] ||
                (!_isPlainObject(property[section]) && !Array.isArray(property[section]))) {
                const nextSection = splitPath[i + 1];
                if (isNaN(Number(nextSection))) {
                    property[section] = {};
                }
                else {
                    property[section] = [];
                }
            }
            property = property[section];
        }
        property[lastSection] = updater(property[lastSection]);
        return obj;
    }

    /** @ignore */
    function _set(obj, path, value) {
        return _update(obj, path, () => value);
    }

    function _unset(obj, path) {
        if (!obj || Object(obj) !== obj)
            return;
        // When obj is not an object
        else if (typeof obj !== 'undefined')
            obj = _cloneDeep(obj);
        // If not yet an array, get the keys from the string-path
        const newPath = !Array.isArray(path)
            ? path.toString().match(/[^.[\]]+/g) || []
            : path;
        const foundProp = newPath.length === 1 ? obj : _get(obj, newPath.slice(0, -1).join('.'));
        if (Array.isArray(foundProp)) {
            foundProp.splice(Number(newPath[newPath.length - 1]), 1);
        }
        else {
            foundProp === null || foundProp === void 0 ? true : delete foundProp[newPath[newPath.length - 1]];
        }
        return obj;
    }

    /**
     * @category Helper
     */
    function deepSome(obj, pred) {
        return _some(obj, (value) => _isPlainObject(value)
            ? deepSome(value, pred)
            : Array.isArray(value)
                ? value.length === 0 || value.every((v) => typeof v === 'string')
                    ? pred(value)
                    : value.some((v) => _isPlainObject(v) ? deepSome(v, pred) : pred(v))
                : pred(value));
    }

    /**
     * @category Helper
     */
    function isInputElement(el) {
        var _a;
        return ((_a = el) === null || _a === void 0 ? void 0 : _a.nodeName) === 'INPUT';
    }
    /**
     * @category Helper
     */
    function isTextAreaElement(el) {
        var _a;
        return ((_a = el) === null || _a === void 0 ? void 0 : _a.nodeName) === 'TEXTAREA';
    }
    /**
     * @category Helper
     */
    function isSelectElement(el) {
        var _a;
        return ((_a = el) === null || _a === void 0 ? void 0 : _a.nodeName) === 'SELECT';
    }
    /**
     * @category Helper
     */
    function isFieldSetElement(el) {
        var _a;
        return ((_a = el) === null || _a === void 0 ? void 0 : _a.nodeName) === 'FIELDSET';
    }
    /**
     * @category Helper
     */
    function isFormControl(el) {
        return isInputElement(el) || isTextAreaElement(el) || isSelectElement(el);
    }
    /**
     * @category Helper
     */
    function isElement(el) {
        return el.nodeType === Node.ELEMENT_NODE;
    }

    /**
     * @category Helper
     */
    function getPath(el, name) {
        return name !== null && name !== void 0 ? name : (isFormControl(el) ? el.name : '');
    }

    /**
     * @category Helper
     */
    function shouldIgnore(el) {
        let parent = el;
        while (parent && parent.nodeName !== 'FORM') {
            if (parent.hasAttribute('data-felte-ignore'))
                return true;
            parent = parent.parentElement;
        }
        return false;
    }

    function executeCustomizer(objValue, srcValue) {
        if (_isPlainObject(objValue) || _isPlainObject(srcValue))
            return;
        if (objValue === null || objValue === '')
            return srcValue;
        if (srcValue === null || srcValue === '')
            return objValue;
        if (!srcValue)
            return objValue;
        if (!objValue || !srcValue)
            return;
        if (Array.isArray(objValue)) {
            if (!Array.isArray(srcValue))
                return [...objValue, srcValue];
            const newErrors = [];
            const errLength = Math.max(srcValue.length, objValue.length);
            for (let i = 0; i < errLength; i++) {
                let obj = objValue[i];
                let src = srcValue[i];
                if (!_isPlainObject(obj) && !_isPlainObject(src)) {
                    if (!Array.isArray(obj))
                        obj = [obj];
                    if (!Array.isArray(src))
                        src = [src];
                    newErrors.push(...obj, ...src);
                }
                else {
                    newErrors.push(mergeErrors([obj !== null && obj !== void 0 ? obj : {}, src !== null && src !== void 0 ? src : {}]));
                }
            }
            return newErrors.filter(Boolean);
        }
        if (!Array.isArray(srcValue))
            srcValue = [srcValue];
        return [objValue, ...srcValue]
            .reduce((acc, value) => acc.concat(value), [])
            .filter(Boolean);
    }
    function mergeErrors(errors) {
        const merged = _mergeWith(...errors, executeCustomizer);
        return merged;
    }
    function runValidations(values, validationOrValidations) {
        if (!validationOrValidations)
            return [];
        const validations = Array.isArray(validationOrValidations)
            ? validationOrValidations
            : [validationOrValidations];
        return validations.map((v) => v(values));
    }

    function executeTransforms(values, transforms) {
        if (!transforms)
            return values;
        if (!Array.isArray(transforms))
            return transforms(values);
        return transforms.reduce((res, t) => t(res), values);
    }

    function createId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    }

    function debounce(func, timeout, { onInit, onEnd } = {}) {
        let timer;
        return (...args) => {
            if (!timer)
                onInit === null || onInit === void 0 ? void 0 : onInit();
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
                timer = undefined;
                onEnd === null || onEnd === void 0 ? void 0 : onEnd();
            }, timeout);
        };
    }

    /**
     * @ignore
     */
    function getFormControls(el) {
        if (isFormControl(el))
            return [el];
        if (el.childElementCount === 0)
            return [];
        const foundControls = new Set();
        for (const child of el.children) {
            if (isFormControl(child))
                foundControls.add(child);
            if (isFieldSetElement(child)) {
                for (const fieldsetChild of child.elements) {
                    if (isFormControl(fieldsetChild))
                        foundControls.add(fieldsetChild);
                }
            }
            if (child.childElementCount > 0)
                getFormControls(child).forEach((value) => foundControls.add(value));
        }
        return Array.from(foundControls);
    }
    /**
     * @ignore
     */
    function addAttrsFromFieldset(fieldSet) {
        for (const element of fieldSet.elements) {
            if (!isFormControl(element) && !isFieldSetElement(element))
                continue;
            if (fieldSet.hasAttribute('data-felte-keep-on-remove') &&
                !element.hasAttribute('data-felte-keep-on-remove')) {
                element.dataset.felteKeepOnRemove = fieldSet.dataset.felteKeepOnRemove;
            }
        }
    }
    /** @ignore */
    function getInputTextOrNumber(el) {
        if (el.type.match(/^(number|range)$/)) {
            return !el.value ? undefined : +el.value;
        }
        else {
            return el.value;
        }
    }
    /**
     * @ignore
     */
    function getFormDefaultValues(node) {
        var _a;
        let defaultData = {};
        let defaultTouched = {};
        for (const el of node.elements) {
            if (isFieldSetElement(el))
                addAttrsFromFieldset(el);
            if (!isFormControl(el) || !el.name)
                continue;
            const elName = getPath(el);
            if (isInputElement(el)) {
                if (el.type === 'checkbox') {
                    if (typeof _get(defaultData, elName) === 'undefined') {
                        const checkboxes = Array.from(node.querySelectorAll(`[name="${el.name}"]`)).filter((checkbox) => {
                            if (!isFormControl(checkbox))
                                return false;
                            return elName === getPath(checkbox);
                        });
                        if (checkboxes.length === 1) {
                            defaultData = _set(defaultData, elName, el.checked);
                            defaultTouched = _set(defaultTouched, elName, false);
                            continue;
                        }
                        defaultData = _set(defaultData, elName, el.checked ? [el.value] : []);
                        defaultTouched = _set(defaultTouched, elName, false);
                        continue;
                    }
                    if (Array.isArray(_get(defaultData, elName)) && el.checked) {
                        defaultData = _update(defaultData, elName, (value) => [
                            ...value,
                            el.value,
                        ]);
                    }
                    continue;
                }
                if (el.type === 'radio') {
                    if (_get(defaultData, elName))
                        continue;
                    defaultData = _set(defaultData, elName, el.checked ? el.value : undefined);
                    defaultTouched = _set(defaultTouched, elName, false);
                    continue;
                }
                if (el.type === 'file') {
                    defaultData = _set(defaultData, elName, el.multiple ? Array.from(el.files || []) : (_a = el.files) === null || _a === void 0 ? void 0 : _a[0]);
                    defaultTouched = _set(defaultTouched, elName, false);
                    continue;
                }
            }
            else if (isSelectElement(el)) {
                const multiple = el.multiple;
                if (!multiple) {
                    defaultData = _set(defaultData, elName, el.value);
                }
                else {
                    const selectedOptions = Array.from(el.options)
                        .filter((opt) => opt.selected)
                        .map((opt) => opt.value);
                    defaultData = _set(defaultData, elName, selectedOptions);
                }
                defaultTouched = _set(defaultTouched, elName, false);
                continue;
            }
            const inputValue = getInputTextOrNumber(el);
            defaultData = _set(defaultData, elName, inputValue);
            defaultTouched = _set(defaultTouched, elName, false);
        }
        return { defaultData, defaultTouched };
    }
    function setControlValue(el, value) {
        var _a;
        if (!isFormControl(el))
            return;
        const fieldValue = value;
        if (isInputElement(el)) {
            if (el.type === 'checkbox') {
                const checkboxesDefaultData = fieldValue;
                if (typeof checkboxesDefaultData === 'undefined' ||
                    typeof checkboxesDefaultData === 'boolean') {
                    el.checked = !!checkboxesDefaultData;
                    return;
                }
                if (Array.isArray(checkboxesDefaultData)) {
                    if (checkboxesDefaultData.includes(el.value)) {
                        el.checked = true;
                    }
                    else {
                        el.checked = false;
                    }
                }
                return;
            }
            if (el.type === 'radio') {
                const radioValue = fieldValue;
                if (el.value === radioValue)
                    el.checked = true;
                else
                    el.checked = false;
                return;
            }
            if (el.type === 'file') {
                el.files = null;
                el.value = '';
                return;
            }
        }
        else if (isSelectElement(el)) {
            const multiple = el.multiple;
            if (!multiple) {
                el.value = String(fieldValue !== null && fieldValue !== void 0 ? fieldValue : '');
                for (const option of el.options) {
                    if (option.value === String(fieldValue)) {
                        option.selected = true;
                    }
                    else {
                        option.selected = false;
                    }
                }
            }
            else if (Array.isArray(fieldValue)) {
                el.value = String((_a = fieldValue[0]) !== null && _a !== void 0 ? _a : '');
                const stringValues = fieldValue.map((v) => String(v));
                for (const option of el.options) {
                    if (stringValues.includes(option.value)) {
                        option.selected = true;
                    }
                    else {
                        option.selected = false;
                    }
                }
            }
            return;
        }
        el.value = String(fieldValue !== null && fieldValue !== void 0 ? fieldValue : '');
    }
    /** Sets the form inputs value to match the data object provided. */
    function setForm(node, data) {
        for (const el of node.elements) {
            if (isFieldSetElement(el))
                addAttrsFromFieldset(el);
            if (!isFormControl(el) || !el.name)
                continue;
            const elName = getPath(el);
            setControlValue(el, _get(data, elName));
        }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest$1(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function deepSetTouched(obj, value) {
        return _mapValues(obj, (prop) => {
            if (_isPlainObject(prop))
                return deepSetTouched(prop, value);
            if (Array.isArray(prop)) {
                if (prop.length === 0 || prop.every((p) => typeof p === 'string'))
                    return value;
                return prop.map((p) => {
                    const _a = deepSetTouched(p, value), field = __rest$1(_a, ["key"]);
                    return field;
                });
            }
            return value;
        });
    }

    function deepSetKey(obj) {
        if (!obj)
            return {};
        return _mapValues(obj, (prop) => {
            if (_isPlainObject(prop))
                return deepSetKey(prop);
            if (Array.isArray(prop)) {
                if (prop.length === 0 || prop.every((p) => typeof p === 'string'))
                    return prop;
                return prop.map((p) => {
                    if (!_isPlainObject(p))
                        return p;
                    const field = deepSetKey(p);
                    if (!field.key)
                        field.key = createId();
                    return field;
                });
            }
            return prop;
        });
    }
    function deepRemoveKey(obj) {
        if (!obj)
            return {};
        return _mapValues(obj, (prop) => {
            if (_isPlainObject(prop))
                return deepSetKey(prop);
            if (Array.isArray(prop)) {
                if (prop.length === 0 || prop.every((p) => typeof p === 'string'))
                    return prop;
                return prop.map((p) => {
                    if (!_isPlainObject(p))
                        return p;
                    const _a = deepSetKey(p), field = __rest$1(_a, ["key"]);
                    return field;
                });
            }
            return prop;
        });
    }

    function createEventConstructors() {
        class SuccessEvent extends CustomEvent {
            constructor(detail) {
                super('feltesuccess', { detail });
            }
        }
        class ErrorEvent extends CustomEvent {
            constructor(detail) {
                super('felteerror', { detail, cancelable: true });
            }
            setErrors(errors) {
                this.preventDefault();
                this.errors = errors;
            }
        }
        class SubmitEvent extends Event {
            constructor() {
                super('feltesubmit', { cancelable: true });
            }
            handleSubmit(onSubmit) {
                this.onSubmit = onSubmit;
            }
            handleError(onError) {
                this.onError = onError;
            }
            handleSuccess(onSuccess) {
                this.onSuccess = onSuccess;
            }
        }
        return {
            createErrorEvent: (detail) => new ErrorEvent(detail),
            createSubmitEvent: () => new SubmitEvent(),
            createSuccessEvent: (detail) => new SuccessEvent(detail),
        };
    }

    function createDefaultSubmitHandler(form) {
        if (!form)
            return;
        return async function onSubmit() {
            let body = new FormData(form);
            const action = new URL(form.action);
            const method = form.method.toLowerCase() === 'get'
                ? 'get'
                : action.searchParams.get('_method') || form.method;
            let enctype = form.enctype;
            if (form.querySelector('input[type="file"]')) {
                enctype = 'multipart/form-data';
            }
            if (method === 'get' || enctype === 'application/x-www-form-urlencoded') {
                body = new URLSearchParams(body);
            }
            let fetchOptions;
            if (method === 'get') {
                body.forEach((value, key) => {
                    action.searchParams.append(key, value);
                });
                fetchOptions = { method, headers: { Accept: 'application/json' } };
            }
            else {
                fetchOptions = {
                    method,
                    body,
                    headers: Object.assign(Object.assign({}, (enctype !== 'multipart/form-data' && {
                        'Content-Type': enctype,
                    })), { Accept: 'application/json' }),
                };
            }
            const response = await window.fetch(action.toString(), fetchOptions);
            if (response.ok)
                return response;
            throw new FelteSubmitError('An error occurred while submitting the form', response);
        };
    }

    function addAtIndex(storeValue, path, value, index) {
        return _update(storeValue, path, (oldValue) => {
            if (typeof oldValue !== 'undefined' && !Array.isArray(oldValue))
                return oldValue;
            if (!oldValue)
                oldValue = [];
            if (typeof index === 'undefined') {
                oldValue.push(value);
            }
            else {
                oldValue.splice(index, 0, value);
            }
            return oldValue;
        });
    }
    function swapInArray(storeValue, path, from, to) {
        return _update(storeValue, path, (oldValue) => {
            if (!oldValue || !Array.isArray(oldValue))
                return oldValue;
            [oldValue[from], oldValue[to]] = [oldValue[to], oldValue[from]];
            return oldValue;
        });
    }
    function moveInArray(storeValue, path, from, to) {
        return _update(storeValue, path, (oldValue) => {
            if (!oldValue || !Array.isArray(oldValue))
                return oldValue;
            oldValue.splice(to, 0, oldValue.splice(from, 1)[0]);
            return oldValue;
        });
    }
    function isUpdater(value) {
        return typeof value === 'function';
    }
    function createSetHelper(storeSetter) {
        const setHelper = (pathOrValue, valueOrUpdater) => {
            if (typeof pathOrValue === 'string') {
                const path = pathOrValue;
                storeSetter((oldValue) => {
                    const newValue = isUpdater(valueOrUpdater)
                        ? valueOrUpdater(_get(oldValue, path))
                        : valueOrUpdater;
                    return _set(oldValue, path, newValue);
                });
            }
            else {
                storeSetter((oldValue) => isUpdater(pathOrValue) ? pathOrValue(oldValue) : pathOrValue);
            }
        };
        return setHelper;
    }
    function createHelpers({ stores, config, validateErrors, validateWarnings, _getCurrentExtenders, }) {
        var _a;
        let formNode;
        let initialValues = deepSetKey(((_a = config.initialValues) !== null && _a !== void 0 ? _a : {}));
        const { data, touched, errors, warnings, isDirty, isSubmitting, interacted, } = stores;
        const setData = createSetHelper(data.update);
        const setTouched = createSetHelper(touched.update);
        const setErrors = createSetHelper(errors.update);
        const setWarnings = createSetHelper(warnings.update);
        function updateFields(updater) {
            setData((oldData) => {
                const newData = updater(oldData);
                if (formNode)
                    setForm(formNode, newData);
                return newData;
            });
        }
        const setFields = (pathOrValue, valueOrUpdater, shouldTouch) => {
            const fieldsSetter = createSetHelper(updateFields);
            fieldsSetter(pathOrValue, valueOrUpdater);
            if (typeof pathOrValue === 'string' && shouldTouch) {
                setTouched(pathOrValue, true);
            }
        };
        function addField(path, value, index) {
            const touchedValue = _isPlainObject(value)
                ? deepSetTouched(value, false)
                : false;
            const errValue = _isPlainObject(touchedValue)
                ? deepSet(touchedValue, [])
                : [];
            value = _isPlainObject(value) ? Object.assign(Object.assign({}, value), { key: createId() }) : value;
            errors.update(($errors) => {
                return addAtIndex($errors, path, errValue, index);
            });
            warnings.update(($warnings) => {
                return addAtIndex($warnings, path, errValue, index);
            });
            touched.update(($touched) => {
                return addAtIndex($touched, path, touchedValue, index);
            });
            data.update(($data) => {
                const newData = addAtIndex($data, path, value, index);
                setTimeout(() => formNode && setForm(formNode, newData));
                return newData;
            });
        }
        function updateAll(updater) {
            errors.update(updater);
            warnings.update(updater);
            touched.update(updater);
            data.update(($data) => {
                const newData = updater($data);
                setTimeout(() => formNode && setForm(formNode, newData));
                return newData;
            });
        }
        function unsetField(path) {
            updateAll((storeValue) => _unset(storeValue, path));
        }
        function swapFields(path, from, to) {
            updateAll((storeValue) => swapInArray(storeValue, path, from, to));
        }
        function moveField(path, from, to) {
            updateAll((storeValue) => moveInArray(storeValue, path, from, to));
        }
        function resetField(path) {
            const initialValue = _get(initialValues, path);
            const touchedValue = _isPlainObject(initialValue)
                ? deepSetTouched(initialValue, false)
                : false;
            const errValue = _isPlainObject(touchedValue)
                ? deepSet(touchedValue, [])
                : [];
            data.update(($data) => {
                const newData = _set($data, path, initialValue);
                if (formNode)
                    setForm(formNode, newData);
                return newData;
            });
            touched.update(($touched) => {
                return _set($touched, path, touchedValue);
            });
            errors.update(($errors) => {
                return _set($errors, path, errValue);
            });
            warnings.update(($warnings) => {
                return _set($warnings, path, errValue);
            });
        }
        const setIsSubmitting = createSetHelper(isSubmitting.update);
        const setIsDirty = createSetHelper(isDirty.update);
        const setInteracted = createSetHelper(interacted.update);
        async function validate() {
            const currentData = get(data);
            touched.set(deepSetTouched(currentData, true));
            interacted.set(null);
            const currentErrors = await validateErrors(currentData);
            await validateWarnings(currentData);
            return currentErrors;
        }
        function reset() {
            setFields(_cloneDeep(initialValues));
            setTouched(($touched) => deepSet($touched, false));
            interacted.set(null);
            isDirty.set(false);
        }
        function createSubmitHandler(altConfig) {
            return async function handleSubmit(event) {
                var _a, _b, _c, _d, _e, _f, _g;
                const { createErrorEvent, createSubmitEvent, createSuccessEvent, } = createEventConstructors();
                const submitEvent = createSubmitEvent();
                formNode === null || formNode === void 0 ? void 0 : formNode.dispatchEvent(submitEvent);
                const onError = (_b = (_a = submitEvent.onError) !== null && _a !== void 0 ? _a : altConfig === null || altConfig === void 0 ? void 0 : altConfig.onError) !== null && _b !== void 0 ? _b : config.onError;
                const onSuccess = (_d = (_c = submitEvent.onSuccess) !== null && _c !== void 0 ? _c : altConfig === null || altConfig === void 0 ? void 0 : altConfig.onSuccess) !== null && _d !== void 0 ? _d : config.onSuccess;
                const onSubmit = (_g = (_f = (_e = submitEvent.onSubmit) !== null && _e !== void 0 ? _e : altConfig === null || altConfig === void 0 ? void 0 : altConfig.onSubmit) !== null && _f !== void 0 ? _f : config.onSubmit) !== null && _g !== void 0 ? _g : createDefaultSubmitHandler(formNode);
                if (!onSubmit)
                    return;
                event === null || event === void 0 ? void 0 : event.preventDefault();
                if (submitEvent.defaultPrevented)
                    return;
                isSubmitting.set(true);
                interacted.set(null);
                const currentData = deepRemoveKey(get(data));
                const currentErrors = await validateErrors(currentData, altConfig === null || altConfig === void 0 ? void 0 : altConfig.validate);
                const currentWarnings = await validateWarnings(currentData, altConfig === null || altConfig === void 0 ? void 0 : altConfig.warn);
                if (currentWarnings)
                    warnings.set(_merge(deepSet(currentData, []), currentWarnings));
                touched.set(deepSetTouched(currentData, true));
                if (currentErrors) {
                    touched.set(deepSetTouched(currentErrors, true));
                    const hasErrors = deepSome(currentErrors, (error) => Array.isArray(error) ? error.length >= 1 : !!error);
                    if (hasErrors) {
                        await new Promise((r) => setTimeout(r));
                        _getCurrentExtenders().forEach((extender) => {
                            var _a;
                            return (_a = extender.onSubmitError) === null || _a === void 0 ? void 0 : _a.call(extender, {
                                data: currentData,
                                errors: currentErrors,
                            });
                        });
                        isSubmitting.set(false);
                        return;
                    }
                }
                const context = {
                    setFields,
                    setData,
                    setTouched,
                    setErrors,
                    setWarnings,
                    unsetField,
                    addField,
                    resetField,
                    reset,
                    setInitialValues: publicHelpers.setInitialValues,
                    moveField,
                    swapFields,
                    form: formNode,
                    controls: formNode && Array.from(formNode.elements).filter(isFormControl),
                    config: Object.assign(Object.assign({}, config), altConfig),
                };
                try {
                    const response = await onSubmit(currentData, context);
                    formNode === null || formNode === void 0 ? void 0 : formNode.dispatchEvent(createSuccessEvent(Object.assign({ response }, context)));
                    await (onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(response, context));
                }
                catch (e) {
                    const errorEvent = createErrorEvent(Object.assign({ error: e }, context));
                    formNode === null || formNode === void 0 ? void 0 : formNode.dispatchEvent(errorEvent);
                    if (!onError && !errorEvent.defaultPrevented) {
                        throw e;
                    }
                    if (!onError && !errorEvent.errors)
                        return;
                    const serverErrors = errorEvent.errors || (await (onError === null || onError === void 0 ? void 0 : onError(e, context)));
                    if (serverErrors) {
                        touched.set(deepSetTouched(serverErrors, true));
                        errors.set(serverErrors);
                        await new Promise((r) => setTimeout(r));
                        _getCurrentExtenders().forEach((extender) => {
                            var _a;
                            return (_a = extender.onSubmitError) === null || _a === void 0 ? void 0 : _a.call(extender, {
                                data: currentData,
                                errors: get(errors),
                            });
                        });
                    }
                }
                finally {
                    isSubmitting.set(false);
                }
            };
        }
        const publicHelpers = {
            setData,
            setFields,
            setTouched,
            setErrors,
            setWarnings,
            setIsSubmitting,
            setIsDirty,
            setInteracted,
            validate,
            reset,
            unsetField,
            resetField,
            addField,
            swapFields,
            moveField,
            createSubmitHandler,
            handleSubmit: createSubmitHandler(),
            setInitialValues: (values) => {
                initialValues = deepSetKey(values);
            },
        };
        const privateHelpers = {
            _setFormNode(node) {
                formNode = node;
            },
            _getInitialValues: () => initialValues,
        };
        return {
            public: publicHelpers,
            private: privateHelpers,
        };
    }

    function createFormAction({ helpers, stores, config, extender, createSubmitHandler, handleSubmit, _setFormNode, _getInitialValues, _setCurrentExtenders, _getCurrentExtenders, }) {
        const { setFields, setTouched, reset, setInitialValues } = helpers;
        const { addValidator, addTransformer, validate } = helpers;
        const { data, errors, warnings, touched, isSubmitting, isDirty, interacted, isValid, isValidating, } = stores;
        function form(node) {
            if (!node.requestSubmit)
                node.requestSubmit = handleSubmit;
            function callExtender(stage) {
                return function (extender) {
                    return extender({
                        form: node,
                        stage,
                        controls: Array.from(node.elements).filter(isFormControl),
                        data,
                        errors,
                        warnings,
                        touched,
                        isValid,
                        isValidating,
                        isSubmitting,
                        isDirty,
                        interacted,
                        config,
                        addValidator,
                        addTransformer,
                        setFields,
                        validate,
                        reset,
                        createSubmitHandler,
                        handleSubmit,
                    });
                };
            }
            _setCurrentExtenders(extender.map(callExtender('MOUNT')));
            node.noValidate = !!config.validate;
            const { defaultData, defaultTouched } = getFormDefaultValues(node);
            _setFormNode(node);
            setInitialValues(_merge(_cloneDeep(defaultData), _getInitialValues()));
            setFields(_getInitialValues());
            touched.set(defaultTouched);
            function setCheckboxValues(target) {
                const elPath = getPath(target);
                const checkboxes = Array.from(node.querySelectorAll(`[name="${target.name}"]`)).filter((checkbox) => {
                    if (!isFormControl(checkbox))
                        return false;
                    return elPath === getPath(checkbox);
                });
                if (checkboxes.length === 0)
                    return;
                if (checkboxes.length === 1) {
                    return data.update(($data) => _set($data, getPath(target), target.checked));
                }
                return data.update(($data) => {
                    return _set($data, getPath(target), checkboxes
                        .filter(isInputElement)
                        .filter((el) => el.checked)
                        .map((el) => el.value));
                });
            }
            function setRadioValues(target) {
                const radios = node.querySelectorAll(`[name="${target.name}"]`);
                const checkedRadio = Array.from(radios).find((el) => isInputElement(el) && el.checked);
                data.update(($data) => _set($data, getPath(target), checkedRadio === null || checkedRadio === void 0 ? void 0 : checkedRadio.value));
            }
            function setFileValue(target) {
                var _a;
                const files = Array.from((_a = target.files) !== null && _a !== void 0 ? _a : []);
                data.update(($data) => {
                    return _set($data, getPath(target), target.multiple ? files : files[0]);
                });
            }
            function setSelectValue(target) {
                if (!target.multiple) {
                    data.update(($data) => {
                        return _set($data, getPath(target), target.value);
                    });
                }
                else {
                    const selectedOptions = Array.from(target.options)
                        .filter((opt) => opt.selected)
                        .map((opt) => opt.value);
                    data.update(($data) => {
                        return _set($data, getPath(target), selectedOptions);
                    });
                }
            }
            function handleInput(e) {
                const target = e.target;
                if (!target ||
                    !isFormControl(target) ||
                    isSelectElement(target) ||
                    shouldIgnore(target))
                    return;
                if (['checkbox', 'radio', 'file'].includes(target.type))
                    return;
                if (!target.name)
                    return;
                isDirty.set(true);
                const inputValue = getInputTextOrNumber(target);
                interacted.set(target.name);
                data.update(($data) => {
                    return _set($data, getPath(target), inputValue);
                });
            }
            function handleChange(e) {
                const target = e.target;
                if (!target || !isFormControl(target) || shouldIgnore(target))
                    return;
                if (!target.name)
                    return;
                setTouched(getPath(target), true);
                interacted.set(target.name);
                if (isSelectElement(target) ||
                    ['checkbox', 'radio', 'file', 'hidden'].includes(target.type)) {
                    isDirty.set(true);
                }
                if (target.type === 'hidden') {
                    data.update(($data) => {
                        return _set($data, getPath(target), target.value);
                    });
                }
                if (isSelectElement(target))
                    setSelectValue(target);
                else if (!isInputElement(target))
                    return;
                else if (target.type === 'checkbox')
                    setCheckboxValues(target);
                else if (target.type === 'radio')
                    setRadioValues(target);
                else if (target.type === 'file')
                    setFileValue(target);
            }
            function handleBlur(e) {
                const target = e.target;
                if (!target || !isFormControl(target) || shouldIgnore(target))
                    return;
                if (!target.name)
                    return;
                setTouched(getPath(target), true);
                interacted.set(target.name);
            }
            function handleReset(e) {
                e.preventDefault();
                reset();
            }
            const mutationOptions = { childList: true, subtree: true };
            function unsetTaggedForRemove(formControls) {
                let currentData = get(data);
                let currentTouched = get(touched);
                let currentErrors = get(errors);
                let currentWarnings = get(warnings);
                for (const control of formControls.reverse()) {
                    if (control.hasAttribute('data-felte-keep-on-remove') &&
                        control.dataset.felteKeepOnRemove !== 'false')
                        continue;
                    const fieldArrayReg = /.*(\[[0-9]+\]|\.[0-9]+)\.[^.]+$/;
                    let fieldName = getPath(control);
                    const shape = get(touched);
                    const isFieldArray = fieldArrayReg.test(fieldName);
                    if (isFieldArray) {
                        const arrayPath = fieldName.split('.').slice(0, -1).join('.');
                        const valueToRemove = _get(shape, arrayPath);
                        if (_isPlainObject(valueToRemove) &&
                            Object.keys(valueToRemove).length <= 1) {
                            fieldName = arrayPath;
                        }
                    }
                    currentData = _unset(currentData, fieldName);
                    currentTouched = _unset(currentTouched, fieldName);
                    currentErrors = _unset(currentErrors, fieldName);
                    currentWarnings = _unset(currentWarnings, fieldName);
                }
                data.set(currentData);
                touched.set(currentTouched);
                errors.set(currentErrors);
                warnings.set(currentWarnings);
            }
            const updateAddedNodes = debounce(() => {
                _getCurrentExtenders().forEach((extender) => { var _a; return (_a = extender.destroy) === null || _a === void 0 ? void 0 : _a.call(extender); });
                _setCurrentExtenders(extender.map(callExtender('UPDATE')));
                const { defaultData: newDefaultData, defaultTouched: newDefaultTouched, } = getFormDefaultValues(node);
                data.update(($data) => _defaultsDeep($data, newDefaultData));
                touched.update(($touched) => {
                    return _defaultsDeep($touched, newDefaultTouched);
                });
            }, 0);
            let removedFormControls = [];
            const updateRemovedNodes = debounce(() => {
                _getCurrentExtenders().forEach((extender) => { var _a; return (_a = extender.destroy) === null || _a === void 0 ? void 0 : _a.call(extender); });
                _setCurrentExtenders(extender.map(callExtender('UPDATE')));
                unsetTaggedForRemove(removedFormControls);
                removedFormControls = [];
            }, 0);
            function handleNodeAddition(mutation) {
                const shouldUpdate = Array.from(mutation.addedNodes).some((node) => {
                    if (!isElement(node))
                        return false;
                    if (isFormControl(node))
                        return true;
                    const formControls = getFormControls(node);
                    return formControls.length > 0;
                });
                if (!shouldUpdate)
                    return;
                updateAddedNodes();
            }
            function handleNodeRemoval(mutation) {
                for (const removedNode of mutation.removedNodes) {
                    if (!isElement(removedNode))
                        continue;
                    const formControls = getFormControls(removedNode);
                    if (formControls.length === 0)
                        continue;
                    removedFormControls.push(...formControls);
                    updateRemovedNodes();
                }
            }
            function mutationCallback(mutationList) {
                for (const mutation of mutationList) {
                    if (mutation.type !== 'childList')
                        continue;
                    if (mutation.addedNodes.length > 0)
                        handleNodeAddition(mutation);
                    if (mutation.removedNodes.length > 0)
                        handleNodeRemoval(mutation);
                }
            }
            const observer = new MutationObserver(mutationCallback);
            observer.observe(node, mutationOptions);
            node.addEventListener('input', handleInput);
            node.addEventListener('change', handleChange);
            node.addEventListener('focusout', handleBlur);
            node.addEventListener('submit', handleSubmit);
            node.addEventListener('reset', handleReset);
            const unsubscribeErrors = errors.subscribe(($errors) => {
                for (const el of node.elements) {
                    if (!isFormControl(el) || !el.name)
                        continue;
                    const fieldErrors = _get($errors, getPath(el));
                    const message = Array.isArray(fieldErrors)
                        ? fieldErrors.join('\n')
                        : typeof fieldErrors === 'string'
                            ? fieldErrors
                            : undefined;
                    if (message === el.dataset.felteValidationMessage)
                        continue;
                    if (message) {
                        el.dataset.felteValidationMessage = message;
                        el.setAttribute('aria-invalid', 'true');
                    }
                    else {
                        delete el.dataset.felteValidationMessage;
                        el.removeAttribute('aria-invalid');
                    }
                }
            });
            return {
                destroy() {
                    observer.disconnect();
                    node.removeEventListener('input', handleInput);
                    node.removeEventListener('change', handleChange);
                    node.removeEventListener('focusout', handleBlur);
                    node.removeEventListener('submit', handleSubmit);
                    node.removeEventListener('reset', handleReset);
                    unsubscribeErrors();
                    _getCurrentExtenders().forEach((extender) => { var _a; return (_a = extender.destroy) === null || _a === void 0 ? void 0 : _a.call(extender); });
                },
            };
        }
        return { form };
    }

    function createValidationController(priority) {
        const signal = { aborted: false, priority };
        return {
            signal,
            abort() {
                signal.aborted = true;
            },
        };
    }
    function errorFilterer(touchValue, errValue) {
        if (_isPlainObject(touchValue)) {
            if (!errValue ||
                (_isPlainObject(errValue) && Object.keys(errValue).length === 0)) {
                return deepSet(touchValue, null);
            }
            return;
        }
        if (Array.isArray(touchValue)) {
            if (touchValue.some(_isPlainObject))
                return;
            const errArray = Array.isArray(errValue) ? errValue : [];
            return touchValue.map((value, index) => {
                const err = errArray[index];
                if (Array.isArray(err) && err.length === 0)
                    return null;
                return (value && err) || null;
            });
        }
        if (Array.isArray(errValue) && errValue.length === 0)
            return null;
        if (Array.isArray(errValue))
            return touchValue ? errValue : null;
        return touchValue && errValue ? [errValue] : null;
    }
    function warningFilterer(touchValue, errValue) {
        if (_isPlainObject(touchValue)) {
            if (!errValue ||
                (_isPlainObject(errValue) && Object.keys(errValue).length === 0)) {
                return deepSet(touchValue, null);
            }
            return;
        }
        if (Array.isArray(touchValue)) {
            if (touchValue.some(_isPlainObject))
                return;
            const errArray = Array.isArray(errValue) ? errValue : [];
            return touchValue.map((_, index) => {
                const err = errArray[index];
                if (Array.isArray(err) && err.length === 0)
                    return null;
                return err || null;
            });
        }
        if (Array.isArray(errValue) && errValue.length === 0)
            return null;
        if (Array.isArray(errValue))
            return errValue;
        return errValue ? [errValue] : null;
    }
    function filterErrors([errors, touched]) {
        return _mergeWith(touched, errors, errorFilterer);
    }
    function filterWarnings([errors, touched]) {
        return _mergeWith(touched, errors, warningFilterer);
    }
    // A `derived` store factory that can defer subscription and be constructed
    // with any store factory.
    function createDerivedFactory(storeFactory) {
        return function derived(storeOrStores, deriver, initialValue) {
            const stores = Array.isArray(storeOrStores)
                ? storeOrStores
                : [storeOrStores];
            const values = new Array(stores.length);
            const derivedStore = storeFactory(initialValue);
            const storeSet = derivedStore.set;
            const storeSubscribe = derivedStore.subscribe;
            let unsubscribers;
            function startStore() {
                unsubscribers = stores.map((store, index) => {
                    return store.subscribe(($store) => {
                        values[index] = $store;
                        storeSet(deriver(values));
                    });
                });
            }
            function stopStore() {
                unsubscribers === null || unsubscribers === void 0 ? void 0 : unsubscribers.forEach((unsub) => unsub());
            }
            derivedStore.subscribe = function subscribe(subscriber) {
                const unsubscribe = storeSubscribe(subscriber);
                return () => {
                    unsubscribe();
                };
            };
            return [derivedStore, startStore, stopStore];
        };
    }
    function createStores(storeFactory, config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const derived = createDerivedFactory(storeFactory);
        const initialValues = (config.initialValues = config.initialValues
            ? deepSetKey(executeTransforms(_cloneDeep(config.initialValues), config.transform))
            : {});
        const initialTouched = deepSetTouched(deepRemoveKey(initialValues), false);
        const touched = storeFactory(initialTouched);
        const validationCount = storeFactory(0);
        const [isValidating, startIsValidating, stopIsValidating] = derived([touched, validationCount], ([$touched, $validationCount]) => {
            const isTouched = deepSome($touched, (t) => !!t);
            return isTouched && $validationCount >= 1;
        }, false);
        // It is important not to destructure stores created with the factory
        // since some stores may be callable.
        delete isValidating.set;
        delete isValidating.update;
        function cancellableValidation(store) {
            let activeController;
            return async function executeValidations($data, shape, validations, priority = false) {
                if (!validations || !$data)
                    return;
                let current = shape && Object.keys(shape).length > 0
                    ? shape
                    : deepSet($data, []);
                // Keeping a controller allows us to cancel previous asynchronous
                // validations if they've become stale.
                const controller = createValidationController(priority);
                // By assigning `priority` we can prevent specific validations
                // from being aborted. Used when submitting the form or
                // calling the `validate` helper.
                if (!(activeController === null || activeController === void 0 ? void 0 : activeController.signal.priority) || priority) {
                    activeController === null || activeController === void 0 ? void 0 : activeController.abort();
                    activeController = controller;
                }
                // If the current controller has priority and we're not trying to
                // override it, completely prevent validations
                if (activeController.signal.priority && !priority)
                    return;
                validationCount.update((c) => c + 1);
                const results = runValidations($data, validations);
                results.forEach(async (promise) => {
                    const result = await promise;
                    if (controller.signal.aborted)
                        return;
                    current = mergeErrors([current, result]);
                    store.set(current);
                });
                await Promise.all(results);
                activeController = undefined;
                validationCount.update((c) => c - 1);
                return current;
            };
        }
        let storesShape = deepSet(initialTouched, []);
        const data = storeFactory(initialValues);
        const initialErrors = deepSet(initialTouched, []);
        const immediateErrors = storeFactory(initialErrors);
        const debouncedErrors = storeFactory(_cloneDeep(initialErrors));
        const [errors, startErrors, stopErrors] = derived([
            immediateErrors,
            debouncedErrors,
        ], mergeErrors, _cloneDeep(initialErrors));
        const initialWarnings = deepSet(initialTouched, []);
        const immediateWarnings = storeFactory(initialWarnings);
        const debouncedWarnings = storeFactory(_cloneDeep(initialWarnings));
        const [warnings, startWarnings, stopWarnings] = derived([
            immediateWarnings,
            debouncedWarnings,
        ], mergeErrors, _cloneDeep(initialWarnings));
        const [filteredErrors, startFilteredErrors, stopFilteredErrors] = derived([errors, touched], filterErrors, _cloneDeep(initialErrors));
        const [filteredWarnings, startFilteredWarnings, stopFilteredWarnings,] = derived([warnings, touched], filterWarnings, _cloneDeep(initialWarnings));
        // This is necessary since, on the first run, validations
        // have not run yet. We assume the form is not valid in the first calling
        // if there's validation functions assigned in the configuration.
        let firstCalled = false;
        const [isValid, startIsValid, stopIsValid] = derived(errors, ([$errors]) => {
            var _a;
            if (!firstCalled) {
                firstCalled = true;
                return !config.validate && !((_a = config.debounced) === null || _a === void 0 ? void 0 : _a.validate);
            }
            else {
                return !deepSome($errors, (error) => Array.isArray(error) ? error.length >= 1 : !!error);
            }
        }, !config.validate && !((_a = config.debounced) === null || _a === void 0 ? void 0 : _a.validate));
        delete isValid.set;
        delete isValid.update;
        const isSubmitting = storeFactory(false);
        const isDirty = storeFactory(false);
        const interacted = storeFactory(null);
        const validateErrors = cancellableValidation(immediateErrors);
        const validateWarnings = cancellableValidation(immediateWarnings);
        const validateDebouncedErrors = cancellableValidation(debouncedErrors);
        const validateDebouncedWarnings = cancellableValidation(debouncedWarnings);
        const _validateDebouncedErrors = debounce(validateDebouncedErrors, (_e = (_c = (_b = config.debounced) === null || _b === void 0 ? void 0 : _b.validateTimeout) !== null && _c !== void 0 ? _c : (_d = config.debounced) === null || _d === void 0 ? void 0 : _d.timeout) !== null && _e !== void 0 ? _e : 300, {
            onInit: () => {
                validationCount.update((c) => c + 1);
            },
            onEnd: () => {
                validationCount.update((c) => c - 1);
            },
        });
        const _validateDebouncedWarnings = debounce(validateDebouncedWarnings, (_j = (_g = (_f = config.debounced) === null || _f === void 0 ? void 0 : _f.warnTimeout) !== null && _g !== void 0 ? _g : (_h = config.debounced) === null || _h === void 0 ? void 0 : _h.timeout) !== null && _j !== void 0 ? _j : 300);
        async function executeErrorsValidation(data, altValidate) {
            var _a;
            const $data = deepRemoveKey(data);
            const errors = validateErrors($data, storesShape, altValidate !== null && altValidate !== void 0 ? altValidate : config.validate, true);
            if (altValidate)
                return errors;
            const debouncedErrors = validateDebouncedErrors($data, storesShape, (_a = config.debounced) === null || _a === void 0 ? void 0 : _a.validate, true);
            return mergeErrors(await Promise.all([errors, debouncedErrors]));
        }
        async function executeWarningsValidation(data, altWarn) {
            var _a;
            const $data = deepRemoveKey(data);
            const warnings = validateWarnings($data, storesShape, altWarn !== null && altWarn !== void 0 ? altWarn : config.warn, true);
            if (altWarn)
                return warnings;
            const debouncedWarnings = validateDebouncedWarnings($data, storesShape, (_a = config.debounced) === null || _a === void 0 ? void 0 : _a.warn, true);
            return mergeErrors(await Promise.all([warnings, debouncedWarnings]));
        }
        let errorsValue = initialErrors;
        let warningsValue = initialWarnings;
        function start() {
            const dataUnsubscriber = data.subscribe(($keyedData) => {
                var _a, _b;
                const $data = deepRemoveKey($keyedData);
                validateErrors($data, storesShape, config.validate);
                validateWarnings($data, storesShape, config.warn);
                _validateDebouncedErrors($data, storesShape, (_a = config.debounced) === null || _a === void 0 ? void 0 : _a.validate);
                _validateDebouncedWarnings($data, storesShape, (_b = config.debounced) === null || _b === void 0 ? void 0 : _b.warn);
            });
            const unsubscribeTouched = touched.subscribe(($touched) => {
                storesShape = deepSet($touched, []);
            });
            const unsubscribeErrors = errors.subscribe(($errors) => {
                errorsValue = $errors;
            });
            const unsubscribeWarnings = warnings.subscribe(($warnings) => {
                warningsValue = $warnings;
            });
            startErrors();
            startIsValid();
            startWarnings();
            startFilteredErrors();
            startFilteredWarnings();
            startIsValidating();
            function cleanup() {
                dataUnsubscriber();
                stopFilteredErrors();
                stopErrors();
                stopWarnings();
                stopFilteredWarnings();
                stopIsValid();
                stopIsValidating();
                unsubscribeTouched();
                unsubscribeErrors();
                unsubscribeWarnings();
            }
            return cleanup;
        }
        function publicErrorsUpdater(updater) {
            immediateErrors.set(updater(errorsValue));
            debouncedErrors.set({});
        }
        function publicWarningsUpdater(updater) {
            immediateWarnings.set(updater(warningsValue));
            debouncedWarnings.set({});
        }
        function publicErrorsSetter(value) {
            publicErrorsUpdater(() => value);
        }
        function publicWarningsSetter(value) {
            publicWarningsUpdater(() => value);
        }
        filteredErrors.set = publicErrorsSetter;
        filteredErrors.update = publicErrorsUpdater;
        filteredWarnings.set = publicWarningsSetter;
        filteredWarnings.update = publicWarningsUpdater;
        return {
            data: data,
            errors: filteredErrors,
            warnings: filteredWarnings,
            touched,
            isValid,
            isSubmitting,
            isDirty,
            isValidating,
            interacted,
            validateErrors: executeErrorsValidation,
            validateWarnings: executeWarningsValidation,
            cleanup: config.preventStoreStart ? () => undefined : start(),
            start,
        };
    }

    function createForm$1(config, adapters) {
        var _a, _b;
        (_a = config.extend) !== null && _a !== void 0 ? _a : (config.extend = []);
        (_b = config.debounced) !== null && _b !== void 0 ? _b : (config.debounced = {});
        if (config.validate && !Array.isArray(config.validate))
            config.validate = [config.validate];
        if (config.debounced.validate && !Array.isArray(config.debounced.validate))
            config.debounced.validate = [config.debounced.validate];
        if (config.transform && !Array.isArray(config.transform))
            config.transform = [config.transform];
        if (config.warn && !Array.isArray(config.warn))
            config.warn = [config.warn];
        if (config.debounced.warn && !Array.isArray(config.debounced.warn))
            config.debounced.warn = [config.debounced.warn];
        function addValidator(validator, { debounced, level } = {
            debounced: false,
            level: 'error',
        }) {
            var _a;
            const prop = level === 'error' ? 'validate' : 'warn';
            (_a = config.debounced) !== null && _a !== void 0 ? _a : (config.debounced = {});
            const validateConfig = debounced ? config.debounced : config;
            if (!validateConfig[prop]) {
                validateConfig[prop] = [validator];
            }
            else {
                validateConfig[prop] = [
                    ...validateConfig[prop],
                    validator,
                ];
            }
        }
        function addTransformer(transformer) {
            if (!config.transform) {
                config.transform = [transformer];
            }
            else {
                config.transform = [
                    ...config.transform,
                    transformer,
                ];
            }
        }
        const extender = Array.isArray(config.extend)
            ? config.extend
            : [config.extend];
        let currentExtenders = [];
        const _getCurrentExtenders = () => currentExtenders;
        const _setCurrentExtenders = (extenders) => {
            currentExtenders = extenders;
        };
        const { isSubmitting, isValidating, data, errors, warnings, touched, isValid, isDirty, cleanup, start, validateErrors, validateWarnings, interacted, } = createStores(adapters.storeFactory, config);
        const originalUpdate = data.update;
        const originalSet = data.set;
        const transUpdate = (updater) => originalUpdate((values) => deepSetKey(executeTransforms(updater(values), config.transform)));
        const transSet = (values) => originalSet(deepSetKey(executeTransforms(values, config.transform)));
        data.update = transUpdate;
        data.set = transSet;
        const helpers = createHelpers({
            extender,
            config,
            addValidator,
            addTransformer,
            validateErrors,
            validateWarnings,
            _getCurrentExtenders,
            stores: {
                data,
                errors,
                warnings,
                touched,
                isValid,
                isValidating,
                isSubmitting,
                isDirty,
                interacted,
            },
        });
        const { createSubmitHandler, handleSubmit } = helpers.public;
        currentExtenders = extender.map((extender) => extender({
            stage: 'SETUP',
            errors,
            warnings,
            touched,
            data,
            isDirty,
            isValid,
            isValidating,
            isSubmitting,
            interacted,
            config,
            addValidator,
            addTransformer,
            setFields: helpers.public.setFields,
            reset: helpers.public.reset,
            validate: helpers.public.validate,
            handleSubmit,
            createSubmitHandler,
        }));
        const formActionConfig = Object.assign({ config, stores: {
                data,
                touched,
                errors,
                warnings,
                isSubmitting,
                isValidating,
                isValid,
                isDirty,
                interacted,
            }, createSubmitHandler,
            handleSubmit, helpers: Object.assign(Object.assign({}, helpers.public), { addTransformer,
                addValidator }), extender,
            _getCurrentExtenders,
            _setCurrentExtenders }, helpers.private);
        const { form } = createFormAction(formActionConfig);
        return Object.assign({ data,
            errors,
            warnings,
            touched,
            isValid,
            isSubmitting,
            isValidating,
            isDirty,
            interacted,
            form,
            cleanup, startStores: start }, helpers.public);
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe$1(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    var svelte = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SvelteComponent: SvelteComponentDev,
        SvelteComponentTyped: SvelteComponentTyped,
        afterUpdate: afterUpdate,
        beforeUpdate: beforeUpdate,
        createEventDispatcher: createEventDispatcher,
        getAllContexts: getAllContexts,
        getContext: getContext,
        hasContext: hasContext,
        onDestroy: onDestroy,
        onMount: onMount,
        setContext: setContext,
        tick: tick
    });

    function createForm(config) {
        var _a = createForm$1(config !== null && config !== void 0 ? config : {}, {
            storeFactory: writable
        }), cleanup = _a.cleanup; _a.startStores; var rest = __rest(_a, ["cleanup", "startStores"]);
        onDestroy(cleanup);
        return rest;
    }

    var translations = {
      en: {
        "language": "en",
        "homepage.title": "Ration Calculator",
        "homepage.lactation": "Lactation Number",
        "homepage.daily": "Daily Milk Yield",
        "homepage.fat": "Milk Fat Percentage",
        "homepage.week": "Week of Lactation",
        "homepage.weight": "Live Weight",
        "homepage.gestation": "Gestation Period (day)",
        "button.next": "Next",
        "button.back": "Back",
        "button.calculate": "Calculate",
        "feed.forage": "Forage",
        "feed.mixed": "Concentrate Mixture",
        "feed.energy": "Energy",
        "feed.protein": "Protein",
        "feed.other": "Other Feed",
        "warning.forage": "Please choose at least one forage feed",
      },
      tr: {
        "language": "tr",
        "homepage.title": "Rasyon Hesaplayıcı",
        "homepage.lactation": "Laktasyon Sırası",
        "homepage.daily": "Günlük Süt Verimi",
        "homepage.fat": "Süt Yağ Yüzdesi",
        "homepage.week": "Laktasyon Haftası",
        "homepage.weight": "Canlı Ağırlık",
        "homepage.gestation": "Gebelik Süresi (Gün)",
        "button.next": "İleri",
        "button.back": "Geri",
        "button.calculate": "Hesapla",
        "feed.forage": "Kaba",
        "feed.mixed": "Kesif",
        "feed.energy": "Enerji",
        "feed.protein": "Protein",
        "feed.other": "Diğer Yem",
        "warning.forage": "Lütfen en az bir kaba yem seçiniz",
      },
    };

    let locale; //= writable("tr");
    const locales = Object.keys(translations);
    if(navigator.language==='tr-TR') {
      locale = writable("tr");
    }
    else {
      locale = writable("en");
    }
    function translate(locale, key, vars) {
      // Let's throw some errors if we're trying to use keys/locales that don't exist.
      // We could improve this by using Typescript and/or fallback values.
      if (!key) throw new Error("no key provided to $t()");
      if (!locale) throw new Error(`no translation for key "${key}"`);

      // Grab the translation from the translations object.
      let text = translations[locale][key];

      if (!text) throw new Error(`no translation found for ${locale}.${key}`);

      // Replace any passed in variables in the translation string.
      Object.keys(vars).map((k) => {
        const regex = new RegExp(`{{${k}}}`, "g");
        text = text.replace(regex, vars[k]);
      });

      return text;
    }

    const t = derived(locale, ($locale) => (key, vars = {}) =>
      translate($locale, key, vars)
    );

    /* src/Page1.svelte generated by Svelte v3.55.0 */
    const file$b = "src/Page1.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (25:4) {#each locales as l}
    function create_each_block$3(ctx) {
    	let option;
    	let t_1_value = /*l*/ ctx[19] + "";
    	let t_1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t_1 = text(t_1_value);
    			option.__value = /*l*/ ctx[19];
    			option.value = option.__value;
    			add_location(option, file$b, 25, 3, 558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t_1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(25:4) {#each locales as l}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let main;
    	let p;
    	let select;
    	let t0;
    	let h1;
    	let t1_value = /*$t*/ ctx[7]("homepage.title") + "";
    	let t1;
    	let t2;
    	let form_1;
    	let label0;
    	let t3_value = /*$t*/ ctx[7]("homepage.lactation") + "";
    	let t3;
    	let t4;
    	let input0;
    	let t5;
    	let br0;
    	let t6;
    	let label1;
    	let t7_value = /*$t*/ ctx[7]("homepage.daily") + "";
    	let t7;
    	let t8;
    	let input1;
    	let br1;
    	let t9;
    	let label2;
    	let t10_value = /*$t*/ ctx[7]("homepage.fat") + "";
    	let t10;
    	let t11;
    	let input2;
    	let br2;
    	let t12;
    	let label3;
    	let t13_value = /*$t*/ ctx[7]("homepage.week") + "";
    	let t13;
    	let t14;
    	let input3;
    	let br3;
    	let t15;
    	let label4;
    	let t16_value = /*$t*/ ctx[7]("homepage.weight") + "";
    	let t16;
    	let t17;
    	let input4;
    	let br4;
    	let t18;
    	let label5;
    	let t19_value = /*$t*/ ctx[7]("homepage.gestation") + "";
    	let t19;
    	let t20;
    	let input5;
    	let br5;
    	let t21;
    	let button;
    	let t22_value = /*$t*/ ctx[7]("button.next") + "";
    	let t22;
    	let mounted;
    	let dispose;
    	let each_value = locales;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			p = element("p");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = space();
    			form_1 = element("form");
    			label0 = element("label");
    			t3 = text(t3_value);
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			br0 = element("br");
    			t6 = space();
    			label1 = element("label");
    			t7 = text(t7_value);
    			t8 = space();
    			input1 = element("input");
    			br1 = element("br");
    			t9 = space();
    			label2 = element("label");
    			t10 = text(t10_value);
    			t11 = space();
    			input2 = element("input");
    			br2 = element("br");
    			t12 = space();
    			label3 = element("label");
    			t13 = text(t13_value);
    			t14 = space();
    			input3 = element("input");
    			br3 = element("br");
    			t15 = space();
    			label4 = element("label");
    			t16 = text(t16_value);
    			t17 = space();
    			input4 = element("input");
    			br4 = element("br");
    			t18 = space();
    			label5 = element("label");
    			t19 = text(t19_value);
    			t20 = space();
    			input5 = element("input");
    			br5 = element("br");
    			t21 = space();
    			button = element("button");
    			t22 = text(t22_value);
    			if (/*$locale*/ ctx[6] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[12].call(select));
    			add_location(select, file$b, 23, 2, 500);
    			add_location(p, file$b, 22, 1, 494);
    			attr_dev(h1, "class", "svelte-k1jnks");
    			add_location(h1, file$b, 29, 1, 622);
    			attr_dev(label0, "for", "lactation");
    			add_location(label0, file$b, 31, 2, 676);
    			attr_dev(input0, "id", "lactation");
    			attr_dev(input0, "name", "lactation");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "0");
    			add_location(input0, file$b, 32, 8, 741);
    			add_location(br0, file$b, 33, 8, 832);
    			attr_dev(label1, "for", "yield");
    			add_location(label1, file$b, 34, 2, 839);
    			attr_dev(input1, "id", "yield");
    			attr_dev(input1, "name", "yield");
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			add_location(input1, file$b, 35, 8, 897);
    			add_location(br1, file$b, 35, 77, 966);
    			attr_dev(label2, "for", "fatRatio");
    			add_location(label2, file$b, 36, 8, 979);
    			attr_dev(input2, "id", "fatRatio");
    			attr_dev(input2, "step", "any");
    			attr_dev(input2, "name", "fatRatio");
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "min", "3");
    			attr_dev(input2, "max", "5");
    			add_location(input2, file$b, 37, 2, 1031);
    			add_location(br2, file$b, 37, 92, 1121);
    			attr_dev(label3, "for", "weekofLactation");
    			add_location(label3, file$b, 38, 8, 1134);
    			attr_dev(input3, "id", "weekofLactation");
    			attr_dev(input3, "name", "weekofLactation");
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "min", "0");
    			add_location(input3, file$b, 39, 2, 1194);
    			add_location(br3, file$b, 39, 96, 1288);
    			attr_dev(label4, "for", "liveWeight");
    			add_location(label4, file$b, 40, 8, 1301);
    			attr_dev(input4, "id", "liveWeight");
    			attr_dev(input4, "name", "liveWeight");
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "min", "0");
    			add_location(input4, file$b, 41, 2, 1358);
    			add_location(br4, file$b, 41, 81, 1437);
    			attr_dev(label5, "for", "gestationPeriod");
    			add_location(label5, file$b, 42, 8, 1450);
    			attr_dev(input5, "id", "gestationPeriod");
    			attr_dev(input5, "name", "gestationPeriod");
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "min", "0");
    			add_location(input5, file$b, 43, 2, 1515);
    			add_location(br5, file$b, 43, 96, 1609);
    			attr_dev(button, "type", "submit");
    			add_location(button, file$b, 44, 8, 1622);
    			attr_dev(form_1, "class", "svelte-k1jnks");
    			add_location(form_1, file$b, 30, 4, 658);
    			attr_dev(main, "class", "svelte-k1jnks");
    			add_location(main, file$b, 21, 0, 486);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, p);
    			append_dev(p, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*$locale*/ ctx[6]);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(main, t2);
    			append_dev(main, form_1);
    			append_dev(form_1, label0);
    			append_dev(label0, t3);
    			append_dev(form_1, t4);
    			append_dev(form_1, input0);
    			set_input_value(input0, /*lactationNumber*/ ctx[0]);
    			append_dev(form_1, t5);
    			append_dev(form_1, br0);
    			append_dev(form_1, t6);
    			append_dev(form_1, label1);
    			append_dev(label1, t7);
    			append_dev(form_1, t8);
    			append_dev(form_1, input1);
    			set_input_value(input1, /*yieldDaily*/ ctx[1]);
    			append_dev(form_1, br1);
    			append_dev(form_1, t9);
    			append_dev(form_1, label2);
    			append_dev(label2, t10);
    			append_dev(form_1, t11);
    			append_dev(form_1, input2);
    			set_input_value(input2, /*fatRatio*/ ctx[2]);
    			append_dev(form_1, br2);
    			append_dev(form_1, t12);
    			append_dev(form_1, label3);
    			append_dev(label3, t13);
    			append_dev(form_1, t14);
    			append_dev(form_1, input3);
    			set_input_value(input3, /*weekofLactation*/ ctx[3]);
    			append_dev(form_1, br3);
    			append_dev(form_1, t15);
    			append_dev(form_1, label4);
    			append_dev(label4, t16);
    			append_dev(form_1, t17);
    			append_dev(form_1, input4);
    			set_input_value(input4, /*liveWeight*/ ctx[4]);
    			append_dev(form_1, br4);
    			append_dev(form_1, t18);
    			append_dev(form_1, label5);
    			append_dev(label5, t19);
    			append_dev(form_1, t20);
    			append_dev(form_1, input5);
    			set_input_value(input5, /*gestationPeriod*/ ctx[5]);
    			append_dev(form_1, br5);
    			append_dev(form_1, t21);
    			append_dev(form_1, button);
    			append_dev(button, t22);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[12]),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[15]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[16]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[17]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[18]),
    					action_destroyer(/*form*/ ctx[8].call(null, form_1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*locales*/ 0) {
    				each_value = locales;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$locale, locales*/ 64) {
    				select_option(select, /*$locale*/ ctx[6]);
    			}

    			if (dirty & /*$t*/ 128 && t1_value !== (t1_value = /*$t*/ ctx[7]("homepage.title") + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$t*/ 128 && t3_value !== (t3_value = /*$t*/ ctx[7]("homepage.lactation") + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*lactationNumber*/ 1 && to_number(input0.value) !== /*lactationNumber*/ ctx[0]) {
    				set_input_value(input0, /*lactationNumber*/ ctx[0]);
    			}

    			if (dirty & /*$t*/ 128 && t7_value !== (t7_value = /*$t*/ ctx[7]("homepage.daily") + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*yieldDaily*/ 2 && to_number(input1.value) !== /*yieldDaily*/ ctx[1]) {
    				set_input_value(input1, /*yieldDaily*/ ctx[1]);
    			}

    			if (dirty & /*$t*/ 128 && t10_value !== (t10_value = /*$t*/ ctx[7]("homepage.fat") + "")) set_data_dev(t10, t10_value);

    			if (dirty & /*fatRatio*/ 4 && to_number(input2.value) !== /*fatRatio*/ ctx[2]) {
    				set_input_value(input2, /*fatRatio*/ ctx[2]);
    			}

    			if (dirty & /*$t*/ 128 && t13_value !== (t13_value = /*$t*/ ctx[7]("homepage.week") + "")) set_data_dev(t13, t13_value);

    			if (dirty & /*weekofLactation*/ 8 && to_number(input3.value) !== /*weekofLactation*/ ctx[3]) {
    				set_input_value(input3, /*weekofLactation*/ ctx[3]);
    			}

    			if (dirty & /*$t*/ 128 && t16_value !== (t16_value = /*$t*/ ctx[7]("homepage.weight") + "")) set_data_dev(t16, t16_value);

    			if (dirty & /*liveWeight*/ 16 && to_number(input4.value) !== /*liveWeight*/ ctx[4]) {
    				set_input_value(input4, /*liveWeight*/ ctx[4]);
    			}

    			if (dirty & /*$t*/ 128 && t19_value !== (t19_value = /*$t*/ ctx[7]("homepage.gestation") + "")) set_data_dev(t19, t19_value);

    			if (dirty & /*gestationPeriod*/ 32 && to_number(input5.value) !== /*gestationPeriod*/ ctx[5]) {
    				set_input_value(input5, /*gestationPeriod*/ ctx[5]);
    			}

    			if (dirty & /*$t*/ 128 && t22_value !== (t22_value = /*$t*/ ctx[7]("button.next") + "")) set_data_dev(t22, t22_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $locale;
    	let $t;
    	validate_store(locale, 'locale');
    	component_subscribe($$self, locale, $$value => $$invalidate(6, $locale = $$value));
    	validate_store(t, 't');
    	component_subscribe($$self, t, $$value => $$invalidate(7, $t = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Page1', slots, []);
    	let { initialValues } = $$props;
    	let { onSubmit } = $$props;
    	let { requiredVals } = $$props;
    	const { form } = createForm({ onSubmit, initialValues });

    	/*if(navigator.language==='tr-TR') {
    	locale = writable("tr");
    }
    else {
    	locale = writable("en");
    }*/
    	let lactationNumber = 3;

    	let yieldDaily = 15;
    	let fatRatio = 3.6;
    	let weekofLactation = 20;
    	let liveWeight = 500;
    	let gestationPeriod = 80;

    	$$self.$$.on_mount.push(function () {
    		if (initialValues === undefined && !('initialValues' in $$props || $$self.$$.bound[$$self.$$.props['initialValues']])) {
    			console.warn("<Page1> was created without expected prop 'initialValues'");
    		}

    		if (onSubmit === undefined && !('onSubmit' in $$props || $$self.$$.bound[$$self.$$.props['onSubmit']])) {
    			console.warn("<Page1> was created without expected prop 'onSubmit'");
    		}

    		if (requiredVals === undefined && !('requiredVals' in $$props || $$self.$$.bound[$$self.$$.props['requiredVals']])) {
    			console.warn("<Page1> was created without expected prop 'requiredVals'");
    		}
    	});

    	const writable_props = ['initialValues', 'onSubmit', 'requiredVals'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Page1> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		$locale = select_value(this);
    		locale.set($locale);
    	}

    	function input0_input_handler() {
    		lactationNumber = to_number(this.value);
    		$$invalidate(0, lactationNumber);
    	}

    	function input1_input_handler() {
    		yieldDaily = to_number(this.value);
    		$$invalidate(1, yieldDaily);
    	}

    	function input2_input_handler() {
    		fatRatio = to_number(this.value);
    		$$invalidate(2, fatRatio);
    	}

    	function input3_input_handler() {
    		weekofLactation = to_number(this.value);
    		$$invalidate(3, weekofLactation);
    	}

    	function input4_input_handler() {
    		liveWeight = to_number(this.value);
    		$$invalidate(4, liveWeight);
    	}

    	function input5_input_handler() {
    		gestationPeriod = to_number(this.value);
    		$$invalidate(5, gestationPeriod);
    	}

    	$$self.$$set = $$props => {
    		if ('initialValues' in $$props) $$invalidate(9, initialValues = $$props.initialValues);
    		if ('onSubmit' in $$props) $$invalidate(10, onSubmit = $$props.onSubmit);
    		if ('requiredVals' in $$props) $$invalidate(11, requiredVals = $$props.requiredVals);
    	};

    	$$self.$capture_state = () => ({
    		createForm,
    		t,
    		locale,
    		locales,
    		initialValues,
    		onSubmit,
    		requiredVals,
    		form,
    		lactationNumber,
    		yieldDaily,
    		fatRatio,
    		weekofLactation,
    		liveWeight,
    		gestationPeriod,
    		$locale,
    		$t
    	});

    	$$self.$inject_state = $$props => {
    		if ('initialValues' in $$props) $$invalidate(9, initialValues = $$props.initialValues);
    		if ('onSubmit' in $$props) $$invalidate(10, onSubmit = $$props.onSubmit);
    		if ('requiredVals' in $$props) $$invalidate(11, requiredVals = $$props.requiredVals);
    		if ('lactationNumber' in $$props) $$invalidate(0, lactationNumber = $$props.lactationNumber);
    		if ('yieldDaily' in $$props) $$invalidate(1, yieldDaily = $$props.yieldDaily);
    		if ('fatRatio' in $$props) $$invalidate(2, fatRatio = $$props.fatRatio);
    		if ('weekofLactation' in $$props) $$invalidate(3, weekofLactation = $$props.weekofLactation);
    		if ('liveWeight' in $$props) $$invalidate(4, liveWeight = $$props.liveWeight);
    		if ('gestationPeriod' in $$props) $$invalidate(5, gestationPeriod = $$props.gestationPeriod);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		lactationNumber,
    		yieldDaily,
    		fatRatio,
    		weekofLactation,
    		liveWeight,
    		gestationPeriod,
    		$locale,
    		$t,
    		form,
    		initialValues,
    		onSubmit,
    		requiredVals,
    		select_change_handler,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler
    	];
    }

    class Page1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			initialValues: 9,
    			onSubmit: 10,
    			requiredVals: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page1",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get initialValues() {
    		throw new Error("<Page1>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialValues(value) {
    		throw new Error("<Page1>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSubmit() {
    		throw new Error("<Page1>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSubmit(value) {
    		throw new Error("<Page1>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get requiredVals() {
    		throw new Error("<Page1>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set requiredVals(value) {
    		throw new Error("<Page1>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* node_modules/svelte-multiselect/CircleSpinner.svelte generated by Svelte v3.55.0 */

    const file$a = "node_modules/svelte-multiselect/CircleSpinner.svelte";

    function create_fragment$b(ctx) {
    	let div;

    	let style_border_color = `${/*color*/ ctx[0]} transparent ${/*color*/ ctx[0]}
  ${/*color*/ ctx[0]}`;

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_style(div, "--duration", /*duration*/ ctx[1]);
    			attr_dev(div, "class", "svelte-66wdl1");
    			set_style(div, "border-color", style_border_color);
    			set_style(div, "width", /*size*/ ctx[2]);
    			set_style(div, "height", /*size*/ ctx[2]);
    			add_location(div, file$a, 5, 0, 111);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*duration*/ 2) {
    				set_style(div, "--duration", /*duration*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1 && style_border_color !== (style_border_color = `${/*color*/ ctx[0]} transparent ${/*color*/ ctx[0]}
  ${/*color*/ ctx[0]}`)) {
    				set_style(div, "border-color", style_border_color);
    			}

    			if (dirty & /*size*/ 4) {
    				set_style(div, "width", /*size*/ ctx[2]);
    			}

    			if (dirty & /*size*/ 4) {
    				set_style(div, "height", /*size*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CircleSpinner', slots, []);
    	let { color = `cornflowerblue` } = $$props;
    	let { duration = `1.5s` } = $$props;
    	let { size = `1em` } = $$props;
    	const writable_props = ['color', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CircleSpinner> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ color, duration, size });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, duration, size];
    }

    class CircleSpinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { color: 0, duration: 1, size: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CircleSpinner",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get color() {
    		throw new Error("<CircleSpinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<CircleSpinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<CircleSpinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<CircleSpinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<CircleSpinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CircleSpinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-multiselect/icons/ChevronExpand.svelte generated by Svelte v3.55.0 */

    const file$9 = "node_modules/svelte-multiselect/icons/ChevronExpand.svelte";

    function create_fragment$a(ctx) {
    	let svg;
    	let path;
    	let svg_levels = [/*$$props*/ ctx[0], { fill: "currentColor" }, { viewBox: "0 0 16 16" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z");
    			add_location(path, file$9, 1, 2, 61);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0],
    				{ fill: "currentColor" },
    				{ viewBox: "0 0 16 16" }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChevronExpand', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class ChevronExpand extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronExpand",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* node_modules/svelte-multiselect/icons/Cross.svelte generated by Svelte v3.55.0 */

    const file$8 = "node_modules/svelte-multiselect/icons/Cross.svelte";

    function create_fragment$9(ctx) {
    	let svg;
    	let path;
    	let svg_levels = [/*$$props*/ ctx[0], { viewBox: "0 0 24 24" }, { fill: "currentColor" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z");
    			add_location(path, file$8, 1, 2, 61);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0],
    				{ viewBox: "0 0 24 24" },
    				{ fill: "currentColor" }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cross', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Cross extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cross",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* node_modules/svelte-multiselect/icons/Disabled.svelte generated by Svelte v3.55.0 */

    const file$7 = "node_modules/svelte-multiselect/icons/Disabled.svelte";

    function create_fragment$8(ctx) {
    	let svg;
    	let path;
    	let svg_levels = [/*$$props*/ ctx[0], { viewBox: "0 0 24 24" }, { fill: "currentColor" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Zm-4.906-3.68L18.32 7.094A8 8 0 0 1 7.094 18.32ZM5.68 16.906A8 8 0 0 1 16.906 5.68L5.68 16.906Z");
    			add_location(path, file$7, 2, 2, 113);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$7, 1, 0, 52);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0],
    				{ viewBox: "0 0 24 24" },
    				{ fill: "currentColor" }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Disabled', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Disabled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Disabled",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* node_modules/svelte-multiselect/Wiggle.svelte generated by Svelte v3.55.0 */
    const file$6 = "node_modules/svelte-multiselect/Wiggle.svelte";

    function create_fragment$7(ctx) {
    	let span;

    	let style_transform = `rotate(${/*$store*/ ctx[0].angle}deg) scale(${/*$store*/ ctx[0].scale}) translate(${/*$store*/ ctx[0].dx}px,
  ${/*$store*/ ctx[0].dy}px)`;

    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_style(span, "transform", style_transform);
    			add_location(span, file$6, 18, 0, 678);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*$store*/ 1 && style_transform !== (style_transform = `rotate(${/*$store*/ ctx[0].angle}deg) scale(${/*$store*/ ctx[0].scale}) translate(${/*$store*/ ctx[0].dx}px,
  ${/*$store*/ ctx[0].dy}px)`)) {
    				set_style(span, "transform", style_transform);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Wiggle', slots, ['default']);
    	let { wiggle = false } = $$props;
    	let { angle = 0 } = $$props;
    	let { scale = 1 } = $$props;
    	let { dx = 0 } = $$props;
    	let { dy = 0 } = $$props;
    	let { duration = 200 } = $$props;
    	let { stiffness = 0.05 } = $$props;
    	let { damping = 0.1 } = $$props;
    	let rest_state = { angle: 0, scale: 1, dx: 0, dy: 0 };
    	let store = spring(rest_state, { stiffness, damping });
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(0, $store = value));
    	const writable_props = ['wiggle', 'angle', 'scale', 'dx', 'dy', 'duration', 'stiffness', 'damping'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Wiggle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('wiggle' in $$props) $$invalidate(2, wiggle = $$props.wiggle);
    		if ('angle' in $$props) $$invalidate(3, angle = $$props.angle);
    		if ('scale' in $$props) $$invalidate(4, scale = $$props.scale);
    		if ('dx' in $$props) $$invalidate(5, dx = $$props.dx);
    		if ('dy' in $$props) $$invalidate(6, dy = $$props.dy);
    		if ('duration' in $$props) $$invalidate(7, duration = $$props.duration);
    		if ('stiffness' in $$props) $$invalidate(8, stiffness = $$props.stiffness);
    		if ('damping' in $$props) $$invalidate(9, damping = $$props.damping);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		spring,
    		wiggle,
    		angle,
    		scale,
    		dx,
    		dy,
    		duration,
    		stiffness,
    		damping,
    		rest_state,
    		store,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('wiggle' in $$props) $$invalidate(2, wiggle = $$props.wiggle);
    		if ('angle' in $$props) $$invalidate(3, angle = $$props.angle);
    		if ('scale' in $$props) $$invalidate(4, scale = $$props.scale);
    		if ('dx' in $$props) $$invalidate(5, dx = $$props.dx);
    		if ('dy' in $$props) $$invalidate(6, dy = $$props.dy);
    		if ('duration' in $$props) $$invalidate(7, duration = $$props.duration);
    		if ('stiffness' in $$props) $$invalidate(8, stiffness = $$props.stiffness);
    		if ('damping' in $$props) $$invalidate(9, damping = $$props.damping);
    		if ('rest_state' in $$props) $$invalidate(12, rest_state = $$props.rest_state);
    		if ('store' in $$props) $$invalidate(1, store = $$props.store);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*wiggle, duration*/ 132) {
    			if (wiggle) setTimeout(() => $$invalidate(2, wiggle = false), duration);
    		}

    		if ($$self.$$.dirty & /*wiggle, scale, angle, dx, dy*/ 124) {
    			store.set(wiggle ? { scale, angle, dx, dy } : rest_state);
    		}
    	};

    	return [
    		$store,
    		store,
    		wiggle,
    		angle,
    		scale,
    		dx,
    		dy,
    		duration,
    		stiffness,
    		damping,
    		$$scope,
    		slots
    	];
    }

    class Wiggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			wiggle: 2,
    			angle: 3,
    			scale: 4,
    			dx: 5,
    			dy: 6,
    			duration: 7,
    			stiffness: 8,
    			damping: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Wiggle",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get wiggle() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wiggle(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get angle() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set angle(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dx() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dx(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dy() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dy(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stiffness() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stiffness(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get damping() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set damping(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-multiselect/MultiSelect.svelte generated by Svelte v3.55.0 */

    const { Boolean: Boolean_1, Object: Object_1$1, console: console_1$2 } = globals;
    const file$5 = "node_modules/svelte-multiselect/MultiSelect.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[105] = list[i];
    	child_ctx[112] = i;

    	const constants_0 = /*option*/ child_ctx[105] instanceof Object
    	? /*option*/ child_ctx[105]
    	: { label: /*option*/ child_ctx[105] };

    	child_ctx[106] = constants_0.label;

    	child_ctx[41] = constants_0.disabled !== undefined
    	? constants_0.disabled
    	: null;

    	child_ctx[107] = constants_0.title !== undefined
    	? constants_0.title
    	: null;

    	child_ctx[108] = constants_0.selectedTitle !== undefined
    	? constants_0.selectedTitle
    	: null;

    	child_ctx[109] = constants_0.disabledTitle !== undefined
    	? constants_0.disabledTitle
    	: child_ctx[13];

    	const constants_1 = /*activeIndex*/ child_ctx[0] === /*idx*/ child_ctx[112];
    	child_ctx[110] = constants_1;
    	return child_ctx;
    }

    const get_option_slot_changes = dirty => ({ option: dirty[0] & /*matchingOptions*/ 2 });

    const get_option_slot_context = ctx => ({
    	option: /*option*/ ctx[105],
    	idx: /*idx*/ ctx[112]
    });

    const get_remove_icon_slot_changes_1 = dirty => ({});
    const get_remove_icon_slot_context_1 = ctx => ({});
    const get_disabled_icon_slot_changes = dirty => ({});
    const get_disabled_icon_slot_context = ctx => ({});
    const get_spinner_slot_changes = dirty => ({});
    const get_spinner_slot_context = ctx => ({});

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[105] = list[i];
    	child_ctx[112] = i;
    	return child_ctx;
    }

    const get_remove_icon_slot_changes = dirty => ({});
    const get_remove_icon_slot_context = ctx => ({});

    const get_selected_slot_changes = dirty => ({
    	option: dirty[0] & /*selected*/ 16,
    	idx: dirty[0] & /*selected*/ 16
    });

    const get_selected_slot_context = ctx => ({
    	option: /*option*/ ctx[105],
    	idx: /*idx*/ ctx[112]
    });

    const get_expand_icon_slot_changes = dirty => ({ open: dirty[0] & /*open*/ 256 });
    const get_expand_icon_slot_context = ctx => ({ open: /*open*/ ctx[8] });

    // (365:34)      
    function fallback_block_6(ctx) {
    	let expandicon;
    	let current;

    	expandicon = new ChevronExpand({
    			props: {
    				width: "15px",
    				style: "min-width: 1em; padding: 0 1pt; cursor: pointer;"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(expandicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(expandicon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expandicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expandicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(expandicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_6.name,
    		type: "fallback",
    		source: "(365:34)      ",
    		ctx
    	});

    	return block;
    }

    // (384:10) {:else}
    function create_else_block_3(ctx) {
    	let t_value = /*get_label*/ ctx[47](/*option*/ ctx[105]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selected*/ 16 && t_value !== (t_value = /*get_label*/ ctx[47](/*option*/ ctx[105]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(384:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (382:10) {#if parseLabelsAsHtml}
    function create_if_block_9(ctx) {
    	let html_tag;
    	let raw_value = /*get_label*/ ctx[47](/*option*/ ctx[105]) + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selected*/ 16 && raw_value !== (raw_value = /*get_label*/ ctx[47](/*option*/ ctx[105]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(382:10) {#if parseLabelsAsHtml}",
    		ctx
    	});

    	return block;
    }

    // (381:45)            
    function fallback_block_5(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*parseLabelsAsHtml*/ ctx[31]) return create_if_block_9;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_5.name,
    		type: "fallback",
    		source: "(381:45)            ",
    		ctx
    	});

    	return block;
    }

    // (388:8) {#if !disabled && (minSelect === null || selected.length > minSelect)}
    function create_if_block_8(ctx) {
    	let button;
    	let button_title_value;
    	let current;
    	let mounted;
    	let dispose;
    	const remove_icon_slot_template = /*#slots*/ ctx[65]["remove-icon"];
    	const remove_icon_slot = create_slot(remove_icon_slot_template, ctx, /*$$scope*/ ctx[102], get_remove_icon_slot_context);
    	const remove_icon_slot_or_fallback = remove_icon_slot || fallback_block_4(ctx);

    	function mouseup_handler() {
    		return /*mouseup_handler*/ ctx[84](/*option*/ ctx[105]);
    	}

    	function keydown_handler_1() {
    		return /*keydown_handler_1*/ ctx[85](/*option*/ ctx[105]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (remove_icon_slot_or_fallback) remove_icon_slot_or_fallback.c();
    			attr_dev(button, "type", "button");
    			attr_dev(button, "title", button_title_value = "" + (/*removeBtnTitle*/ ctx[35] + " " + /*get_label*/ ctx[47](/*option*/ ctx[105])));
    			attr_dev(button, "class", "svelte-2agpg7");
    			add_location(button, file$5, 388, 10, 16564);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (remove_icon_slot_or_fallback) {
    				remove_icon_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "mouseup", stop_propagation(mouseup_handler), false, false, true),
    					listen_dev(
    						button,
    						"keydown",
    						function () {
    							if (is_function(/*if_enter_or_space*/ ctx[53](keydown_handler_1))) /*if_enter_or_space*/ ctx[53](keydown_handler_1).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (remove_icon_slot) {
    				if (remove_icon_slot.p && (!current || dirty[3] & /*$$scope*/ 512)) {
    					update_slot_base(
    						remove_icon_slot,
    						remove_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[102],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[102])
    						: get_slot_changes(remove_icon_slot_template, /*$$scope*/ ctx[102], dirty, get_remove_icon_slot_changes),
    						get_remove_icon_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*selected*/ 16 | dirty[1] & /*removeBtnTitle*/ 16 && button_title_value !== (button_title_value = "" + (/*removeBtnTitle*/ ctx[35] + " " + /*get_label*/ ctx[47](/*option*/ ctx[105])))) {
    				attr_dev(button, "title", button_title_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(remove_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(remove_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (remove_icon_slot_or_fallback) remove_icon_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(388:8) {#if !disabled && (minSelect === null || selected.length > minSelect)}",
    		ctx
    	});

    	return block;
    }

    // (395:37)                
    function fallback_block_4(ctx) {
    	let crossicon;
    	let current;
    	crossicon = new Cross({ props: { width: "15px" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(crossicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(crossicon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(crossicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(crossicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(crossicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_4.name,
    		type: "fallback",
    		source: "(395:37)                ",
    		ctx
    	});

    	return block;
    }

    // (369:4) {#each selected as option, idx (get_label(option))}
    function create_each_block_1(key_1, ctx) {
    	let li;
    	let t;
    	let li_class_value;
    	let rect;
    	let stop_animation = noop;
    	let current;
    	let mounted;
    	let dispose;
    	const selected_slot_template = /*#slots*/ ctx[65].selected;
    	const selected_slot = create_slot(selected_slot_template, ctx, /*$$scope*/ ctx[102], get_selected_slot_context);
    	const selected_slot_or_fallback = selected_slot || fallback_block_5(ctx);
    	let if_block = !/*disabled*/ ctx[41] && (/*minSelect*/ ctx[36] === null || /*selected*/ ctx[4].length > /*minSelect*/ ctx[36]) && create_if_block_8(ctx);

    	function dragenter_handler() {
    		return /*dragenter_handler*/ ctx[86](/*idx*/ ctx[112]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			if (selected_slot_or_fallback) selected_slot_or_fallback.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*liSelectedClass*/ ctx[23]) + " svelte-2agpg7"));
    			attr_dev(li, "aria-selected", "true");
    			attr_dev(li, "draggable", /*selectedOptionsDraggable*/ ctx[38]);
    			attr_dev(li, "ondragover", "return false");
    			toggle_class(li, "active", /*drag_idx*/ ctx[45] === /*idx*/ ctx[112]);
    			add_location(li, file$5, 369, 6, 15915);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (selected_slot_or_fallback) {
    				selected_slot_or_fallback.m(li, null);
    			}

    			append_dev(li, t);
    			if (if_block) if_block.m(li, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						li,
    						"dragstart",
    						function () {
    							if (is_function(/*dragstart*/ ctx[56](/*idx*/ ctx[112]))) /*dragstart*/ ctx[56](/*idx*/ ctx[112]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						li,
    						"drop",
    						prevent_default(function () {
    							if (is_function(/*drop*/ ctx[55](/*idx*/ ctx[112]))) /*drop*/ ctx[55](/*idx*/ ctx[112]).apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					),
    					listen_dev(li, "dragenter", dragenter_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (selected_slot) {
    				if (selected_slot.p && (!current || dirty[0] & /*selected*/ 16 | dirty[3] & /*$$scope*/ 512)) {
    					update_slot_base(
    						selected_slot,
    						selected_slot_template,
    						ctx,
    						/*$$scope*/ ctx[102],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[102])
    						: get_slot_changes(selected_slot_template, /*$$scope*/ ctx[102], dirty, get_selected_slot_changes),
    						get_selected_slot_context
    					);
    				}
    			} else {
    				if (selected_slot_or_fallback && selected_slot_or_fallback.p && (!current || dirty[0] & /*selected*/ 16 | dirty[1] & /*parseLabelsAsHtml*/ 1)) {
    					selected_slot_or_fallback.p(ctx, !current ? [-1, -1, -1, -1] : dirty);
    				}
    			}

    			if (!/*disabled*/ ctx[41] && (/*minSelect*/ ctx[36] === null || /*selected*/ ctx[4].length > /*minSelect*/ ctx[36])) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*selected*/ 16 | dirty[1] & /*disabled, minSelect*/ 1056) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(li, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*liSelectedClass*/ 8388608 && li_class_value !== (li_class_value = "" + (null_to_empty(/*liSelectedClass*/ ctx[23]) + " svelte-2agpg7"))) {
    				attr_dev(li, "class", li_class_value);
    			}

    			if (!current || dirty[1] & /*selectedOptionsDraggable*/ 128) {
    				attr_dev(li, "draggable", /*selectedOptionsDraggable*/ ctx[38]);
    			}

    			if (!current || dirty[0] & /*liSelectedClass, selected*/ 8388624 | dirty[1] & /*drag_idx*/ 16384) {
    				toggle_class(li, "active", /*drag_idx*/ ctx[45] === /*idx*/ ctx[112]);
    			}
    		},
    		r: function measure() {
    			rect = li.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(li);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(li, rect, flip, { duration: 100 });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selected_slot_or_fallback, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selected_slot_or_fallback, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (selected_slot_or_fallback) selected_slot_or_fallback.d(detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(369:4) {#each selected as option, idx (get_label(option))}",
    		ctx
    	});

    	return block;
    }

    // (435:2) {#if loading}
    function create_if_block_7(ctx) {
    	let current;
    	const spinner_slot_template = /*#slots*/ ctx[65].spinner;
    	const spinner_slot = create_slot(spinner_slot_template, ctx, /*$$scope*/ ctx[102], get_spinner_slot_context);
    	const spinner_slot_or_fallback = spinner_slot || fallback_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (spinner_slot_or_fallback) spinner_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (spinner_slot_or_fallback) {
    				spinner_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (spinner_slot) {
    				if (spinner_slot.p && (!current || dirty[3] & /*$$scope*/ 512)) {
    					update_slot_base(
    						spinner_slot,
    						spinner_slot_template,
    						ctx,
    						/*$$scope*/ ctx[102],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[102])
    						: get_slot_changes(spinner_slot_template, /*$$scope*/ ctx[102], dirty, get_spinner_slot_changes),
    						get_spinner_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (spinner_slot_or_fallback) spinner_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(435:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (436:25)        
    function fallback_block_3(ctx) {
    	let circlespinner;
    	let current;
    	circlespinner = new CircleSpinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(circlespinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(circlespinner, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(circlespinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(circlespinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(circlespinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(436:25)        ",
    		ctx
    	});

    	return block;
    }

    // (444:32) 
    function create_if_block_4(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*maxSelect*/ ctx[25] && (/*maxSelect*/ ctx[25] > 1 || /*maxSelectMsg*/ ctx[26]) && create_if_block_6(ctx);
    	let if_block1 = /*maxSelect*/ ctx[25] !== 1 && /*selected*/ ctx[4].length > 1 && create_if_block_5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*maxSelect*/ ctx[25] && (/*maxSelect*/ ctx[25] > 1 || /*maxSelectMsg*/ ctx[26])) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*maxSelect, maxSelectMsg*/ 100663296) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*maxSelect*/ ctx[25] !== 1 && /*selected*/ ctx[4].length > 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*maxSelect, selected*/ 33554448) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(444:32) ",
    		ctx
    	});

    	return block;
    }

    // (440:2) {#if disabled}
    function create_if_block_3(ctx) {
    	let current;
    	const disabled_icon_slot_template = /*#slots*/ ctx[65]["disabled-icon"];
    	const disabled_icon_slot = create_slot(disabled_icon_slot_template, ctx, /*$$scope*/ ctx[102], get_disabled_icon_slot_context);
    	const disabled_icon_slot_or_fallback = disabled_icon_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (disabled_icon_slot_or_fallback) disabled_icon_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (disabled_icon_slot_or_fallback) {
    				disabled_icon_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (disabled_icon_slot) {
    				if (disabled_icon_slot.p && (!current || dirty[3] & /*$$scope*/ 512)) {
    					update_slot_base(
    						disabled_icon_slot,
    						disabled_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[102],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[102])
    						: get_slot_changes(disabled_icon_slot_template, /*$$scope*/ ctx[102], dirty, get_disabled_icon_slot_changes),
    						get_disabled_icon_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(disabled_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(disabled_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (disabled_icon_slot_or_fallback) disabled_icon_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(440:2) {#if disabled}",
    		ctx
    	});

    	return block;
    }

    // (445:4) {#if maxSelect && (maxSelect > 1 || maxSelectMsg)}
    function create_if_block_6(ctx) {
    	let wiggle_1;
    	let updating_wiggle;
    	let current;

    	function wiggle_1_wiggle_binding(value) {
    		/*wiggle_1_wiggle_binding*/ ctx[89](value);
    	}

    	let wiggle_1_props = {
    		angle: 20,
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*wiggle*/ ctx[42] !== void 0) {
    		wiggle_1_props.wiggle = /*wiggle*/ ctx[42];
    	}

    	wiggle_1 = new Wiggle({ props: wiggle_1_props, $$inline: true });
    	binding_callbacks.push(() => bind$1(wiggle_1, 'wiggle', wiggle_1_wiggle_binding, /*wiggle*/ ctx[42]));

    	const block = {
    		c: function create() {
    			create_component(wiggle_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(wiggle_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const wiggle_1_changes = {};

    			if (dirty[0] & /*maxSelectMsgClass, maxSelectMsg, selected, maxSelect*/ 234881040 | dirty[3] & /*$$scope*/ 512) {
    				wiggle_1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_wiggle && dirty[1] & /*wiggle*/ 2048) {
    				updating_wiggle = true;
    				wiggle_1_changes.wiggle = /*wiggle*/ ctx[42];
    				add_flush_callback(() => updating_wiggle = false);
    			}

    			wiggle_1.$set(wiggle_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wiggle_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wiggle_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(wiggle_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(445:4) {#if maxSelect && (maxSelect > 1 || maxSelectMsg)}",
    		ctx
    	});

    	return block;
    }

    // (446:6) <Wiggle bind:wiggle angle={20}>
    function create_default_slot(ctx) {
    	let span;
    	let t_value = /*maxSelectMsg*/ ctx[26]?.(/*selected*/ ctx[4].length, /*maxSelect*/ ctx[25]) + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", span_class_value = "max-select-msg " + /*maxSelectMsgClass*/ ctx[27] + " svelte-2agpg7");
    			add_location(span, file$5, 446, 8, 18204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*maxSelectMsg, selected, maxSelect*/ 100663312 && t_value !== (t_value = /*maxSelectMsg*/ ctx[26]?.(/*selected*/ ctx[4].length, /*maxSelect*/ ctx[25]) + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*maxSelectMsgClass*/ 134217728 && span_class_value !== (span_class_value = "max-select-msg " + /*maxSelectMsgClass*/ ctx[27] + " svelte-2agpg7")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(446:6) <Wiggle bind:wiggle angle={20}>",
    		ctx
    	});

    	return block;
    }

    // (452:4) {#if maxSelect !== 1 && selected.length > 1}
    function create_if_block_5(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const remove_icon_slot_template = /*#slots*/ ctx[65]["remove-icon"];
    	const remove_icon_slot = create_slot(remove_icon_slot_template, ctx, /*$$scope*/ ctx[102], get_remove_icon_slot_context_1);
    	const remove_icon_slot_or_fallback = remove_icon_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (remove_icon_slot_or_fallback) remove_icon_slot_or_fallback.c();
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "remove-all svelte-2agpg7");
    			attr_dev(button, "title", /*removeAllTitle*/ ctx[34]);
    			add_location(button, file$5, 452, 6, 18406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (remove_icon_slot_or_fallback) {
    				remove_icon_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "mouseup", stop_propagation(/*remove_all*/ ctx[52]), false, false, true),
    					listen_dev(button, "keydown", /*if_enter_or_space*/ ctx[53](/*remove_all*/ ctx[52]), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (remove_icon_slot) {
    				if (remove_icon_slot.p && (!current || dirty[3] & /*$$scope*/ 512)) {
    					update_slot_base(
    						remove_icon_slot,
    						remove_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[102],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[102])
    						: get_slot_changes(remove_icon_slot_template, /*$$scope*/ ctx[102], dirty, get_remove_icon_slot_changes_1),
    						get_remove_icon_slot_context_1
    					);
    				}
    			}

    			if (!current || dirty[1] & /*removeAllTitle*/ 8) {
    				attr_dev(button, "title", /*removeAllTitle*/ ctx[34]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(remove_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(remove_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (remove_icon_slot_or_fallback) remove_icon_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(452:4) {#if maxSelect !== 1 && selected.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (460:33)            
    function fallback_block_2(ctx) {
    	let crossicon;
    	let current;
    	crossicon = new Cross({ props: { width: "15px" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(crossicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(crossicon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(crossicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(crossicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(crossicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(460:33)            ",
    		ctx
    	});

    	return block;
    }

    // (441:31)        
    function fallback_block_1(ctx) {
    	let disabledicon;
    	let current;

    	disabledicon = new Disabled({
    			props: {
    				width: "14pt",
    				style: "margin: 0 2pt;",
    				"data-name": "disabled-icon"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(disabledicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(disabledicon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(disabledicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(disabledicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(disabledicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(441:31)        ",
    		ctx
    	});

    	return block;
    }

    // (468:2) {#if searchText || options?.length > 0}
    function create_if_block$2(ctx) {
    	let ul;
    	let ul_class_value;
    	let current;
    	let each_value = /*matchingOptions*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1(ctx);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			attr_dev(ul, "class", ul_class_value = "options " + /*ulOptionsClass*/ ctx[39] + " svelte-2agpg7");
    			toggle_class(ul, "hidden", !/*open*/ ctx[8]);
    			add_location(ul, file$5, 468, 4, 18895);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*matchingOptions, liOptionClass, activeIndex, liActiveOptionClass, addOptionMsg, searchText, duplicates, selected, duplicateFunc, duplicateOptionMsg, allowUserOptions, noMatchingOptionsMsg*/ 543394843 | dirty[1] & /*is_selected, add, get_label, parseLabelsAsHtml, add_option_msg_is_active*/ 233473 | dirty[3] & /*$$scope*/ 512) {
    				each_value = /*matchingOptions*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_1(ctx);
    					each_1_else.c();
    					each_1_else.m(ul, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}

    			if (!current || dirty[1] & /*ulOptionsClass*/ 256 && ul_class_value !== (ul_class_value = "options " + /*ulOptionsClass*/ ctx[39] + " svelte-2agpg7")) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (!current || dirty[0] & /*open*/ 256 | dirty[1] & /*ulOptionsClass*/ 256) {
    				toggle_class(ul, "hidden", !/*open*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean_1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(468:2) {#if searchText || options?.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (509:6) {:else}
    function create_else_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (/*allowUserOptions*/ ctx[11] && /*searchText*/ ctx[3]) return create_if_block_2$1;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(509:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (526:8) {:else}
    function create_else_block_2(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*noMatchingOptionsMsg*/ ctx[29]);
    			attr_dev(span, "class", "svelte-2agpg7");
    			add_location(span, file$5, 526, 10, 21036);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*noMatchingOptionsMsg*/ 536870912) set_data_dev(t, /*noMatchingOptionsMsg*/ ctx[29]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(526:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (510:8) {#if allowUserOptions && searchText}
    function create_if_block_2$1(ctx) {
    	let li;

    	let t0_value = (!/*duplicates*/ ctx[17] && /*selected*/ ctx[4].some(/*func*/ ctx[95])
    	? /*duplicateOptionMsg*/ ctx[16]
    	: /*addOptionMsg*/ ctx[10]) + "";

    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "title", /*addOptionMsg*/ ctx[10]);
    			attr_dev(li, "aria-selected", "false");
    			attr_dev(li, "class", "svelte-2agpg7");
    			toggle_class(li, "active", /*add_option_msg_is_active*/ ctx[43]);
    			add_location(li, file$5, 510, 10, 20329);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "mousedown", stop_propagation(/*mousedown_handler_2*/ ctx[67]), false, false, true),
    					listen_dev(li, "mouseup", stop_propagation(/*mouseup_handler_2*/ ctx[96]), false, false, true),
    					listen_dev(li, "mouseover", /*mouseover_handler_1*/ ctx[97], false, false, false),
    					listen_dev(li, "focus", /*focus_handler_2*/ ctx[98], false, false, false),
    					listen_dev(li, "mouseout", /*mouseout_handler_1*/ ctx[99], false, false, false),
    					listen_dev(li, "blur", /*blur_handler_2*/ ctx[100], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*duplicates, selected, duplicateFunc, searchText, duplicateOptionMsg, addOptionMsg*/ 230424 && t0_value !== (t0_value = (!/*duplicates*/ ctx[17] && /*selected*/ ctx[4].some(/*func*/ ctx[95])
    			? /*duplicateOptionMsg*/ ctx[16]
    			: /*addOptionMsg*/ ctx[10]) + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*addOptionMsg*/ 1024) {
    				attr_dev(li, "title", /*addOptionMsg*/ ctx[10]);
    			}

    			if (dirty[1] & /*add_option_msg_is_active*/ 4096) {
    				toggle_class(li, "active", /*add_option_msg_is_active*/ ctx[43]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(510:8) {#if allowUserOptions && searchText}",
    		ctx
    	});

    	return block;
    }

    // (504:12) {:else}
    function create_else_block$2(ctx) {
    	let t_value = /*get_label*/ ctx[47](/*option*/ ctx[105]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*matchingOptions*/ 2 && t_value !== (t_value = /*get_label*/ ctx[47](/*option*/ ctx[105]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(504:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (502:12) {#if parseLabelsAsHtml}
    function create_if_block_1$1(ctx) {
    	let html_tag;
    	let raw_value = /*get_label*/ ctx[47](/*option*/ ctx[105]) + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*matchingOptions*/ 2 && raw_value !== (raw_value = /*get_label*/ ctx[47](/*option*/ ctx[105]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(502:12) {#if parseLabelsAsHtml}",
    		ctx
    	});

    	return block;
    }

    // (501:45)              
    function fallback_block(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*parseLabelsAsHtml*/ ctx[31]) return create_if_block_1$1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(501:45)              ",
    		ctx
    	});

    	return block;
    }

    // (470:6) {#each matchingOptions as option, idx}
    function create_each_block$2(ctx) {
    	let li;
    	let t;
    	let li_title_value;
    	let li_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const option_slot_template = /*#slots*/ ctx[65].option;
    	const option_slot = create_slot(option_slot_template, ctx, /*$$scope*/ ctx[102], get_option_slot_context);
    	const option_slot_or_fallback = option_slot || fallback_block(ctx);

    	function mouseup_handler_1(...args) {
    		return /*mouseup_handler_1*/ ctx[90](/*disabled*/ ctx[41], /*label*/ ctx[106], ...args);
    	}

    	function mouseover_handler() {
    		return /*mouseover_handler*/ ctx[91](/*disabled*/ ctx[41], /*idx*/ ctx[112]);
    	}

    	function focus_handler_1() {
    		return /*focus_handler_1*/ ctx[92](/*disabled*/ ctx[41], /*idx*/ ctx[112]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (option_slot_or_fallback) option_slot_or_fallback.c();
    			t = space();

    			attr_dev(li, "title", li_title_value = /*disabled*/ ctx[41]
    			? /*disabledTitle*/ ctx[109]
    			: /*is_selected*/ ctx[46](/*label*/ ctx[106]) && /*selectedTitle*/ ctx[108] || /*title*/ ctx[107]);

    			attr_dev(li, "class", li_class_value = "" + (/*liOptionClass*/ ctx[22] + " " + (/*active*/ ctx[110]
    			? /*liActiveOptionClass*/ ctx[21]
    			: ``) + " svelte-2agpg7"));

    			attr_dev(li, "aria-selected", "false");
    			toggle_class(li, "selected", /*is_selected*/ ctx[46](/*label*/ ctx[106]));
    			toggle_class(li, "active", /*active*/ ctx[110]);
    			toggle_class(li, "disabled", /*disabled*/ ctx[41]);
    			add_location(li, file$5, 478, 8, 19286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (option_slot_or_fallback) {
    				option_slot_or_fallback.m(li, null);
    			}

    			append_dev(li, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "mousedown", stop_propagation(/*mousedown_handler_1*/ ctx[66]), false, false, true),
    					listen_dev(li, "mouseup", stop_propagation(mouseup_handler_1), false, false, true),
    					listen_dev(li, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(li, "focus", focus_handler_1, false, false, false),
    					listen_dev(li, "mouseout", /*mouseout_handler*/ ctx[93], false, false, false),
    					listen_dev(li, "blur", /*blur_handler_1*/ ctx[94], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (option_slot) {
    				if (option_slot.p && (!current || dirty[0] & /*matchingOptions*/ 2 | dirty[3] & /*$$scope*/ 512)) {
    					update_slot_base(
    						option_slot,
    						option_slot_template,
    						ctx,
    						/*$$scope*/ ctx[102],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[102])
    						: get_slot_changes(option_slot_template, /*$$scope*/ ctx[102], dirty, get_option_slot_changes),
    						get_option_slot_context
    					);
    				}
    			} else {
    				if (option_slot_or_fallback && option_slot_or_fallback.p && (!current || dirty[0] & /*matchingOptions*/ 2 | dirty[1] & /*parseLabelsAsHtml*/ 1)) {
    					option_slot_or_fallback.p(ctx, !current ? [-1, -1, -1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*matchingOptions*/ 2 | dirty[1] & /*is_selected*/ 32768 && li_title_value !== (li_title_value = /*disabled*/ ctx[41]
    			? /*disabledTitle*/ ctx[109]
    			: /*is_selected*/ ctx[46](/*label*/ ctx[106]) && /*selectedTitle*/ ctx[108] || /*title*/ ctx[107])) {
    				attr_dev(li, "title", li_title_value);
    			}

    			if (!current || dirty[0] & /*liOptionClass, activeIndex, liActiveOptionClass*/ 6291457 && li_class_value !== (li_class_value = "" + (/*liOptionClass*/ ctx[22] + " " + (/*active*/ ctx[110]
    			? /*liActiveOptionClass*/ ctx[21]
    			: ``) + " svelte-2agpg7"))) {
    				attr_dev(li, "class", li_class_value);
    			}

    			if (!current || dirty[0] & /*liOptionClass, activeIndex, liActiveOptionClass, matchingOptions*/ 6291459 | dirty[1] & /*is_selected*/ 32768) {
    				toggle_class(li, "selected", /*is_selected*/ ctx[46](/*label*/ ctx[106]));
    			}

    			if (!current || dirty[0] & /*liOptionClass, activeIndex, liActiveOptionClass, activeIndex*/ 6291457) {
    				toggle_class(li, "active", /*active*/ ctx[110]);
    			}

    			if (!current || dirty[0] & /*liOptionClass, activeIndex, liActiveOptionClass, matchingOptions*/ 6291459) {
    				toggle_class(li, "disabled", /*disabled*/ ctx[41]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(option_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(option_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (option_slot_or_fallback) option_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(470:6) {#each matchingOptions as option, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let input0;
    	let input0_required_value;
    	let input0_value_value;
    	let t0;
    	let t1;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t2;
    	let li;
    	let input1;
    	let input1_class_value;
    	let input1_placeholder_value;
    	let input1_aria_invalid_value;
    	let ul_class_value;
    	let t3;
    	let t4;
    	let current_block_type_index;
    	let if_block1;
    	let t5;
    	let div_aria_multiselectable_value;
    	let div_class_value;
    	let div_title_value;
    	let div_aria_disabled_value;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[81]);
    	const expand_icon_slot_template = /*#slots*/ ctx[65]["expand-icon"];
    	const expand_icon_slot = create_slot(expand_icon_slot_template, ctx, /*$$scope*/ ctx[102], get_expand_icon_slot_context);
    	const expand_icon_slot_or_fallback = expand_icon_slot || fallback_block_6(ctx);
    	let each_value_1 = /*selected*/ ctx[4];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*get_label*/ ctx[47](/*option*/ ctx[105]);
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	let if_block0 = /*loading*/ ctx[24] && create_if_block_7(ctx);
    	const if_block_creators = [create_if_block_3, create_if_block_4];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*disabled*/ ctx[41]) return 0;
    		if (/*selected*/ ctx[4].length > 0) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let if_block2 = (/*searchText*/ ctx[3] || /*options*/ ctx[2]?.length > 0) && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input0 = element("input");
    			t0 = space();
    			if (expand_icon_slot_or_fallback) expand_icon_slot_or_fallback.c();
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			li = element("li");
    			input1 = element("input");
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(input0, "name", /*name*/ ctx[28]);
    			input0.required = input0_required_value = Boolean(/*required*/ ctx[37]);

    			input0.value = input0_value_value = /*selected*/ ctx[4].length >= /*required*/ ctx[37]
    			? JSON.stringify(/*selected*/ ctx[4])
    			: null;

    			attr_dev(input0, "tabindex", "-1");
    			attr_dev(input0, "aria-hidden", "true");
    			attr_dev(input0, "aria-label", "ignore this, used only to prevent form submission if select is required but empty");
    			attr_dev(input0, "class", "form-control svelte-2agpg7");
    			add_location(input0, file$5, 342, 2, 14962);
    			attr_dev(input1, "class", input1_class_value = "" + (null_to_empty(/*inputClass*/ ctx[19]) + " svelte-2agpg7"));
    			attr_dev(input1, "autocomplete", /*autocomplete*/ ctx[12]);
    			attr_dev(input1, "id", /*id*/ ctx[18]);
    			input1.disabled = /*disabled*/ ctx[41];
    			attr_dev(input1, "inputmode", /*inputmode*/ ctx[20]);
    			attr_dev(input1, "pattern", /*pattern*/ ctx[32]);

    			attr_dev(input1, "placeholder", input1_placeholder_value = /*selected*/ ctx[4].length == 0
    			? /*placeholder*/ ctx[33]
    			: null);

    			attr_dev(input1, "aria-invalid", input1_aria_invalid_value = /*invalid*/ ctx[7] ? `true` : null);
    			attr_dev(input1, "ondrop", "return false");
    			add_location(input1, file$5, 402, 6, 17015);
    			set_style(li, "display", "contents");
    			attr_dev(li, "class", "svelte-2agpg7");
    			add_location(li, file$5, 401, 4, 16977);
    			attr_dev(ul, "class", ul_class_value = "selected " + /*ulSelectedClass*/ ctx[40] + " svelte-2agpg7");
    			add_location(ul, file$5, 367, 2, 15813);
    			attr_dev(div, "aria-expanded", /*open*/ ctx[8]);
    			attr_dev(div, "aria-multiselectable", div_aria_multiselectable_value = /*maxSelect*/ ctx[25] === null || /*maxSelect*/ ctx[25] > 1);
    			attr_dev(div, "class", div_class_value = "multiselect " + /*outerDivClass*/ ctx[30] + " svelte-2agpg7");

    			attr_dev(div, "title", div_title_value = /*disabled*/ ctx[41]
    			? /*disabledInputTitle*/ ctx[14]
    			: null);

    			attr_dev(div, "aria-disabled", div_aria_disabled_value = /*disabled*/ ctx[41] ? `true` : null);
    			attr_dev(div, "data-id", /*id*/ ctx[18]);
    			toggle_class(div, "disabled", /*disabled*/ ctx[41]);
    			toggle_class(div, "single", /*maxSelect*/ ctx[25] === 1);
    			toggle_class(div, "open", /*open*/ ctx[8]);
    			toggle_class(div, "invalid", /*invalid*/ ctx[7]);
    			add_location(div, file$5, 327, 0, 14468);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);
    			/*input0_binding*/ ctx[82](input0);
    			append_dev(div, t0);

    			if (expand_icon_slot_or_fallback) {
    				expand_icon_slot_or_fallback.m(div, null);
    			}

    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t2);
    			append_dev(ul, li);
    			append_dev(li, input1);
    			/*input1_binding*/ ctx[87](input1);
    			set_input_value(input1, /*searchText*/ ctx[3]);
    			append_dev(div, t3);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t4);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			append_dev(div, t5);
    			if (if_block2) if_block2.m(div, null);
    			/*div_binding*/ ctx[101](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*on_click_outside*/ ctx[54], false, false, false),
    					listen_dev(window, "touchstart", /*on_click_outside*/ ctx[54], false, false, false),
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[81]),
    					listen_dev(input0, "invalid", /*invalid_handler*/ ctx[83], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[88]),
    					listen_dev(input1, "mouseup", self(stop_propagation(/*open_dropdown*/ ctx[50])), false, false, true),
    					listen_dev(input1, "keydown", stop_propagation(/*handle_keydown*/ ctx[51]), false, false, true),
    					listen_dev(input1, "focus", /*focus_handler*/ ctx[68], false, false, false),
    					listen_dev(input1, "focus", /*open_dropdown*/ ctx[50], false, false, false),
    					listen_dev(input1, "blur", /*blur_handler*/ ctx[69], false, false, false),
    					listen_dev(input1, "change", /*change_handler*/ ctx[70], false, false, false),
    					listen_dev(input1, "click", /*click_handler*/ ctx[71], false, false, false),
    					listen_dev(input1, "keydown", /*keydown_handler*/ ctx[72], false, false, false),
    					listen_dev(input1, "keyup", /*keyup_handler*/ ctx[73], false, false, false),
    					listen_dev(input1, "mousedown", /*mousedown_handler*/ ctx[74], false, false, false),
    					listen_dev(input1, "mouseenter", /*mouseenter_handler*/ ctx[75], false, false, false),
    					listen_dev(input1, "mouseleave", /*mouseleave_handler*/ ctx[76], false, false, false),
    					listen_dev(input1, "touchcancel", /*touchcancel_handler*/ ctx[77], false, false, false),
    					listen_dev(input1, "touchend", /*touchend_handler*/ ctx[78], false, false, false),
    					listen_dev(input1, "touchmove", /*touchmove_handler*/ ctx[79], false, false, false),
    					listen_dev(input1, "touchstart", /*touchstart_handler*/ ctx[80], false, false, false),
    					listen_dev(div, "mouseup", stop_propagation(/*open_dropdown*/ ctx[50]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*name*/ 268435456) {
    				attr_dev(input0, "name", /*name*/ ctx[28]);
    			}

    			if (!current || dirty[1] & /*required*/ 64 && input0_required_value !== (input0_required_value = Boolean(/*required*/ ctx[37]))) {
    				prop_dev(input0, "required", input0_required_value);
    			}

    			if (!current || dirty[0] & /*selected*/ 16 | dirty[1] & /*required*/ 64 && input0_value_value !== (input0_value_value = /*selected*/ ctx[4].length >= /*required*/ ctx[37]
    			? JSON.stringify(/*selected*/ ctx[4])
    			: null) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (expand_icon_slot) {
    				if (expand_icon_slot.p && (!current || dirty[0] & /*open*/ 256 | dirty[3] & /*$$scope*/ 512)) {
    					update_slot_base(
    						expand_icon_slot,
    						expand_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[102],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[102])
    						: get_slot_changes(expand_icon_slot_template, /*$$scope*/ ctx[102], dirty, get_expand_icon_slot_changes),
    						get_expand_icon_slot_context
    					);
    				}
    			}

    			if (dirty[0] & /*liSelectedClass, selected*/ 8388624 | dirty[1] & /*selectedOptionsDraggable, drag_idx, dragstart, drop, removeBtnTitle, get_label, remove, if_enter_or_space, disabled, minSelect, parseLabelsAsHtml*/ 54871217 | dirty[3] & /*$$scope*/ 512) {
    				each_value_1 = /*selected*/ ctx[4];
    				validate_each_argument(each_value_1);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block_1, t2, get_each_context_1);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}

    			if (!current || dirty[0] & /*inputClass*/ 524288 && input1_class_value !== (input1_class_value = "" + (null_to_empty(/*inputClass*/ ctx[19]) + " svelte-2agpg7"))) {
    				attr_dev(input1, "class", input1_class_value);
    			}

    			if (!current || dirty[0] & /*autocomplete*/ 4096) {
    				attr_dev(input1, "autocomplete", /*autocomplete*/ ctx[12]);
    			}

    			if (!current || dirty[0] & /*id*/ 262144) {
    				attr_dev(input1, "id", /*id*/ ctx[18]);
    			}

    			if (!current || dirty[1] & /*disabled*/ 1024) {
    				prop_dev(input1, "disabled", /*disabled*/ ctx[41]);
    			}

    			if (!current || dirty[0] & /*inputmode*/ 1048576) {
    				attr_dev(input1, "inputmode", /*inputmode*/ ctx[20]);
    			}

    			if (!current || dirty[1] & /*pattern*/ 2) {
    				attr_dev(input1, "pattern", /*pattern*/ ctx[32]);
    			}

    			if (!current || dirty[0] & /*selected*/ 16 | dirty[1] & /*placeholder*/ 4 && input1_placeholder_value !== (input1_placeholder_value = /*selected*/ ctx[4].length == 0
    			? /*placeholder*/ ctx[33]
    			: null)) {
    				attr_dev(input1, "placeholder", input1_placeholder_value);
    			}

    			if (!current || dirty[0] & /*invalid*/ 128 && input1_aria_invalid_value !== (input1_aria_invalid_value = /*invalid*/ ctx[7] ? `true` : null)) {
    				attr_dev(input1, "aria-invalid", input1_aria_invalid_value);
    			}

    			if (dirty[0] & /*searchText*/ 8 && input1.value !== /*searchText*/ ctx[3]) {
    				set_input_value(input1, /*searchText*/ ctx[3]);
    			}

    			if (!current || dirty[1] & /*ulSelectedClass*/ 512 && ul_class_value !== (ul_class_value = "selected " + /*ulSelectedClass*/ ctx[40] + " svelte-2agpg7")) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (/*loading*/ ctx[24]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*loading*/ 16777216) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t4);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];

    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					} else {
    						if_block1.p(ctx, dirty);
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(div, t5);
    				} else {
    					if_block1 = null;
    				}
    			}

    			if (/*searchText*/ ctx[3] || /*options*/ ctx[2]?.length > 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*searchText, options*/ 12) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*open*/ 256) {
    				attr_dev(div, "aria-expanded", /*open*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*maxSelect*/ 33554432 && div_aria_multiselectable_value !== (div_aria_multiselectable_value = /*maxSelect*/ ctx[25] === null || /*maxSelect*/ ctx[25] > 1)) {
    				attr_dev(div, "aria-multiselectable", div_aria_multiselectable_value);
    			}

    			if (!current || dirty[0] & /*outerDivClass*/ 1073741824 && div_class_value !== (div_class_value = "multiselect " + /*outerDivClass*/ ctx[30] + " svelte-2agpg7")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty[0] & /*disabledInputTitle*/ 16384 | dirty[1] & /*disabled*/ 1024 && div_title_value !== (div_title_value = /*disabled*/ ctx[41]
    			? /*disabledInputTitle*/ ctx[14]
    			: null)) {
    				attr_dev(div, "title", div_title_value);
    			}

    			if (!current || dirty[1] & /*disabled*/ 1024 && div_aria_disabled_value !== (div_aria_disabled_value = /*disabled*/ ctx[41] ? `true` : null)) {
    				attr_dev(div, "aria-disabled", div_aria_disabled_value);
    			}

    			if (!current || dirty[0] & /*id*/ 262144) {
    				attr_dev(div, "data-id", /*id*/ ctx[18]);
    			}

    			if (!current || dirty[0] & /*outerDivClass*/ 1073741824 | dirty[1] & /*disabled*/ 1024) {
    				toggle_class(div, "disabled", /*disabled*/ ctx[41]);
    			}

    			if (!current || dirty[0] & /*outerDivClass, maxSelect*/ 1107296256) {
    				toggle_class(div, "single", /*maxSelect*/ ctx[25] === 1);
    			}

    			if (!current || dirty[0] & /*outerDivClass, open*/ 1073742080) {
    				toggle_class(div, "open", /*open*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*outerDivClass, invalid*/ 1073741952) {
    				toggle_class(div, "invalid", /*invalid*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expand_icon_slot_or_fallback, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expand_icon_slot_or_fallback, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input0_binding*/ ctx[82](null);
    			if (expand_icon_slot_or_fallback) expand_icon_slot_or_fallback.d(detaching);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*input1_binding*/ ctx[87](null);
    			if (if_block0) if_block0.d();

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (if_block2) if_block2.d();
    			/*div_binding*/ ctx[101](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let is_selected;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MultiSelect', slots, ['expand-icon','selected','remove-icon','spinner','disabled-icon','option']);
    	let { activeIndex = null } = $$props;
    	let { activeOption = null } = $$props;
    	let { addOptionMsg = `Create this option...` } = $$props;
    	let { allowUserOptions = false } = $$props;
    	let { autocomplete = `off` } = $$props;
    	let { autoScroll = true } = $$props;
    	let { breakpoint = 800 } = $$props;
    	let { defaultDisabledTitle = `This option is disabled` } = $$props;
    	let { disabled = false } = $$props;
    	let { disabledInputTitle = `This input is disabled` } = $$props;
    	let { duplicateFunc = (op1, op2) => `${get_label(op1)}`.toLowerCase() === `${get_label(op2)}`.toLowerCase() } = $$props;
    	let { duplicateOptionMsg = `This option is already selected` } = $$props;
    	let { duplicates = false } = $$props;

    	let { filterFunc = (op, searchText) => {
    		if (!searchText) return true;
    		return `${get_label(op)}`.toLowerCase().includes(searchText.toLowerCase());
    	} } = $$props;

    	let { focusInputOnSelect = `desktop` } = $$props;
    	let { form_input = null } = $$props;
    	let { id = null } = $$props;
    	let { input = null } = $$props;
    	let { inputClass = `` } = $$props;
    	let { inputmode = null } = $$props;
    	let { invalid = false } = $$props;
    	let { liActiveOptionClass = `` } = $$props;
    	let { liOptionClass = `` } = $$props;
    	let { liSelectedClass = `` } = $$props;
    	let { loading = false } = $$props;
    	let { matchingOptions = [] } = $$props;
    	let { maxSelect = null } = $$props;
    	let { maxSelectMsg = (current, max) => max > 1 ? `${current}/${max}` : `` } = $$props;
    	let { maxSelectMsgClass = `` } = $$props;
    	let { name = null } = $$props;
    	let { noMatchingOptionsMsg = `No matching options` } = $$props;
    	let { open = false } = $$props;
    	let { options } = $$props;
    	let { outerDiv = null } = $$props;
    	let { outerDivClass = `` } = $$props;
    	let { parseLabelsAsHtml = false } = $$props;
    	let { pattern = null } = $$props;
    	let { placeholder = null } = $$props;
    	let { removeAllTitle = `Remove all` } = $$props;
    	let { removeBtnTitle = `Remove` } = $$props;
    	let { minSelect = null } = $$props;
    	let { required = false } = $$props;
    	let { resetFilterOnAdd = true } = $$props;
    	let { searchText = `` } = $$props;
    	let { selected = options?.filter(op => op?.preselected).slice(0, maxSelect ?? undefined) ?? [] } = $$props;
    	let { sortSelected = false } = $$props;
    	let { selectedOptionsDraggable = !sortSelected } = $$props;
    	let { ulOptionsClass = `` } = $$props;
    	let { ulSelectedClass = `` } = $$props;
    	let { value = null } = $$props;

    	// get the label key from an option object or the option itself if it's a string or number
    	const get_label = op => op instanceof Object ? op.label : op;

    	let wiggle = false; // controls wiggle animation when user tries to exceed maxSelect

    	if (!(options?.length > 0)) {
    		if (allowUserOptions || loading || disabled) {
    			options = []; // initializing as array avoids errors when component mounts
    		} else {
    			// only error for empty options if user is not allowed to create custom
    			// options and loading is false
    			console.error(`MultiSelect received no options`);
    		}
    	}

    	if (parseLabelsAsHtml && allowUserOptions) {
    		console.warn(`Don't combine parseLabelsAsHtml and allowUserOptions. It's susceptible to XSS attacks!`);
    	}

    	if (maxSelect !== null && maxSelect < 1) {
    		console.error(`MultiSelect's maxSelect must be null or positive integer, got ${maxSelect}`);
    	}

    	if (!Array.isArray(selected)) {
    		console.error(`MultiSelect's selected prop should always be an array, got ${selected}`);
    	}

    	if (maxSelect && typeof required === `number` && required > maxSelect) {
    		console.error(`MultiSelect maxSelect=${maxSelect} < required=${required}, makes it impossible for users to submit a valid form`);
    	}

    	if (sortSelected && selectedOptionsDraggable) {
    		console.warn(`MultiSelect's sortSelected and selectedOptionsDraggable should not be combined as any user re-orderings of selected options will be undone by sortSelected on component re-renders.`);
    	}

    	const dispatch = createEventDispatcher();
    	let add_option_msg_is_active = false; // controls active state of <li>{addOptionMsg}</li>
    	let window_width;

    	// raise if matchingOptions[activeIndex] does not yield a value
    	if (activeIndex !== null && !matchingOptions[activeIndex]) {
    		throw `Run time error, activeIndex=${activeIndex} is out of bounds, matchingOptions.length=${matchingOptions.length}`;
    	}

    	// add an option to selected list
    	function add(label, event) {
    		if (maxSelect && maxSelect > 1 && selected.length >= maxSelect) $$invalidate(42, wiggle = true);
    		if (!isNaN(Number(label)) && typeof selected.map(get_label)[0] === `number`) label = Number(label); // convert to number if possible
    		const is_duplicate = selected.some(option => duplicateFunc(option, label));

    		if ((maxSelect === null || maxSelect === 1 || selected.length < maxSelect) && (duplicates || !is_duplicate)) {
    			// first check if we find option in the options list
    			let option = options.find(op => get_label(op) === label);

    			if (!option && // this has the side-effect of not allowing to user to add the same
    			// custom option twice in append mode
    			[true, `append`].includes(allowUserOptions) && searchText.length > 0) {
    				// user entered text but no options match, so if allowUserOptions=true | 'append', we create
    				// a new option from the user-entered text
    				if (typeof options[0] === `object`) {
    					// if 1st option is an object, we create new option as object to keep type homogeneity
    					option = { label: searchText, value: searchText };
    				} else {
    					if ([`number`, `undefined`].includes(typeof options[0]) && !isNaN(Number(searchText))) {
    						// create new option as number if it parses to a number and 1st option is also number or missing
    						option = Number(searchText);
    					} else option = searchText; // else create custom option as string
    				}

    				if (allowUserOptions === `append`) $$invalidate(2, options = [...options, option]);
    			}

    			if (option === undefined) {
    				throw `Run time error, option with label ${label} not found in options list`;
    			}

    			if (resetFilterOnAdd) $$invalidate(3, searchText = ``); // reset search string on selection

    			if ([``, undefined, null].includes(option)) {
    				console.error(`MultiSelect: encountered missing option with label ${label} (or option is poorly labeled)`);
    				return;
    			}

    			if (maxSelect === 1) {
    				// for maxselect = 1 we always replace current option with new one
    				$$invalidate(4, selected = [option]);
    			} else {
    				$$invalidate(4, selected = [...selected, option]);

    				if (sortSelected === true) {
    					$$invalidate(4, selected = selected.sort((op1, op2) => {
    						const [label1, label2] = [get_label(op1), get_label(op2)];

    						// coerce to string if labels are numbers
    						return `${label1}`.localeCompare(`${label2}`);
    					}));
    				} else if (typeof sortSelected === `function`) {
    					$$invalidate(4, selected = selected.sort(sortSelected));
    				}
    			}

    			if (selected.length === maxSelect) close_dropdown(event); else if (focusInputOnSelect === true || focusInputOnSelect === `desktop` && window_width > breakpoint) {
    				input?.focus();
    			}

    			dispatch(`add`, { option });
    			dispatch(`change`, { option, type: `add` });
    			$$invalidate(7, invalid = false); // reset error status whenever new items are selected
    			form_input?.setCustomValidity(``);
    		}
    	}

    	// remove an option from selected list
    	function remove(label) {
    		if (selected.length === 0) return;
    		selected.splice(selected.map(get_label).lastIndexOf(label), 1);
    		$$invalidate(4, selected); // Svelte rerender after in-place splice

    		const option = options.find(option => get_label(option) === label) ?? (// if option with label could not be found but allowUserOptions is truthy,
    		// assume it was created by user and create correspondidng option object
    		// on the fly for use as event payload
    		allowUserOptions && { label, value: label });

    		if (!option) {
    			return console.error(`MultiSelect: option with label ${label} not found`);
    		}

    		dispatch(`remove`, { option });
    		dispatch(`change`, { option, type: `remove` });
    		$$invalidate(7, invalid = false); // reset error status whenever items are removed
    		form_input?.setCustomValidity(``);
    	}

    	function open_dropdown(event) {
    		if (disabled) return;
    		$$invalidate(8, open = true);

    		if (!(event instanceof FocusEvent)) {
    			// avoid double-focussing input when event that opened dropdown was already input FocusEvent
    			input?.focus();
    		}

    		dispatch(`open`, { event });
    	}

    	function close_dropdown(event) {
    		$$invalidate(8, open = false);
    		input?.blur();
    		$$invalidate(57, activeOption = null);
    		dispatch(`close`, { event });
    	}

    	// handle all keyboard events this component receives
    	async function handle_keydown(event) {
    		// on escape or tab out of input: dismiss options dropdown and reset search text
    		if (event.key === `Escape` || event.key === `Tab`) {
    			close_dropdown(event);
    			$$invalidate(3, searchText = ``);
    		} else // on enter key: toggle active option and reset search text
    		if (event.key === `Enter`) {
    			event.preventDefault(); // prevent enter key from triggering form submission

    			if (activeOption) {
    				const label = get_label(activeOption);

    				selected.map(get_label).includes(label)
    				? remove(label)
    				: add(label, event);

    				$$invalidate(3, searchText = ``);
    			} else if (allowUserOptions && searchText.length > 0) {
    				// user entered text but no options match, so if allowUserOptions is truthy, we create new option
    				add(searchText, event);
    			} else // no active option and no search text means the options dropdown is closed
    			// in which case enter means open it
    			open_dropdown(event);
    		} else // on up/down arrow keys: update active option
    		if ([`ArrowDown`, `ArrowUp`].includes(event.key)) {
    			// if no option is active yet, but there are matching options, make first one active
    			if (activeIndex === null && matchingOptions.length > 0) {
    				$$invalidate(0, activeIndex = 0);
    				return;
    			} else if (allowUserOptions && !matchingOptions.length && searchText.length > 0) {
    				// if allowUserOptions is truthy and user entered text but no options match, we make
    				// <li>{addUserMsg}</li> active on keydown (or toggle it if already active)
    				$$invalidate(43, add_option_msg_is_active = !add_option_msg_is_active);

    				return;
    			} else if (activeIndex === null) {
    				// if no option is active and no options are matching, do nothing
    				return;
    			}

    			event.preventDefault();

    			// if none of the above special cases apply, we make next/prev option
    			// active with wrap around at both ends
    			const increment = event.key === `ArrowUp` ? -1 : 1;

    			$$invalidate(0, activeIndex = (activeIndex + increment) % matchingOptions.length);

    			// in JS % behaves like remainder operator, not real modulo, so negative numbers stay negative
    			// need to do manual wrap around at 0
    			if (activeIndex < 0) $$invalidate(0, activeIndex = matchingOptions.length - 1);

    			if (autoScroll) {
    				await tick();
    				const li = document.querySelector(`ul.options > li.active`);
    				if (li) li.scrollIntoViewIfNeeded?.();
    			}
    		} else // on backspace key: remove last selected option
    		if (event.key === `Backspace` && selected.length > 0 && !searchText) {
    			remove(selected.map(get_label).at(-1));
    		}
    	}

    	function remove_all() {
    		dispatch(`removeAll`, { options: selected });
    		dispatch(`change`, { options: selected, type: `removeAll` });
    		$$invalidate(4, selected = []);
    		$$invalidate(3, searchText = ``);
    	}

    	const if_enter_or_space = handler => event => {
    		if ([`Enter`, `Space`].includes(event.code)) {
    			event.preventDefault();
    			handler();
    		}
    	};

    	function on_click_outside(event) {
    		if (outerDiv && !outerDiv.contains(event.target)) {
    			close_dropdown(event);
    		}
    	}

    	let drag_idx = null;

    	// event handlers enable dragging to reorder selected options
    	const drop = target_idx => event => {
    		if (!event.dataTransfer) return;
    		event.dataTransfer.dropEffect = `move`;
    		const start_idx = parseInt(event.dataTransfer.getData(`text/plain`));
    		const new_selected = selected;

    		if (start_idx < target_idx) {
    			new_selected.splice(target_idx + 1, 0, new_selected[start_idx]);
    			new_selected.splice(start_idx, 1);
    		} else {
    			new_selected.splice(target_idx, 0, new_selected[start_idx]);
    			new_selected.splice(start_idx + 1, 1);
    		}

    		$$invalidate(4, selected = new_selected);
    		$$invalidate(45, drag_idx = null);
    	};

    	const dragstart = idx => event => {
    		if (!event.dataTransfer) return;

    		// only allow moving, not copying (also affects the cursor during drag)
    		event.dataTransfer.effectAllowed = `move`;

    		event.dataTransfer.dropEffect = `move`;
    		event.dataTransfer.setData(`text/plain`, `${idx}`);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (options === undefined && !('options' in $$props || $$self.$$.bound[$$self.$$.props['options']])) {
    			console_1$2.warn("<MultiSelect> was created without expected prop 'options'");
    		}
    	});

    	const writable_props = [
    		'activeIndex',
    		'activeOption',
    		'addOptionMsg',
    		'allowUserOptions',
    		'autocomplete',
    		'autoScroll',
    		'breakpoint',
    		'defaultDisabledTitle',
    		'disabled',
    		'disabledInputTitle',
    		'duplicateFunc',
    		'duplicateOptionMsg',
    		'duplicates',
    		'filterFunc',
    		'focusInputOnSelect',
    		'form_input',
    		'id',
    		'input',
    		'inputClass',
    		'inputmode',
    		'invalid',
    		'liActiveOptionClass',
    		'liOptionClass',
    		'liSelectedClass',
    		'loading',
    		'matchingOptions',
    		'maxSelect',
    		'maxSelectMsg',
    		'maxSelectMsgClass',
    		'name',
    		'noMatchingOptionsMsg',
    		'open',
    		'options',
    		'outerDiv',
    		'outerDivClass',
    		'parseLabelsAsHtml',
    		'pattern',
    		'placeholder',
    		'removeAllTitle',
    		'removeBtnTitle',
    		'minSelect',
    		'required',
    		'resetFilterOnAdd',
    		'searchText',
    		'selected',
    		'sortSelected',
    		'selectedOptionsDraggable',
    		'ulOptionsClass',
    		'ulSelectedClass',
    		'value'
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<MultiSelect> was created with unknown prop '${key}'`);
    	});

    	function mousedown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousedown_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchcancel_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchmove_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchstart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onwindowresize() {
    		$$invalidate(44, window_width = window.innerWidth);
    	}

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			form_input = $$value;
    			$$invalidate(5, form_input);
    		});
    	}

    	const invalid_handler = () => {
    		$$invalidate(7, invalid = true);
    		let msg;

    		if (maxSelect && maxSelect > 1 && required > 1) {
    			msg = `Please select between ${required} and ${maxSelect} options`;
    		} else if (required > 1) {
    			msg = `Please select at least ${required} options`;
    		} else {
    			msg = `Please select an option`;
    		}

    		form_input?.setCustomValidity(msg);
    	};

    	const mouseup_handler = option => remove(get_label(option));
    	const keydown_handler_1 = option => remove(get_label(option));
    	const dragenter_handler = idx => $$invalidate(45, drag_idx = idx);

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(6, input);
    		});
    	}

    	function input1_input_handler() {
    		searchText = this.value;
    		$$invalidate(3, searchText);
    	}

    	function wiggle_1_wiggle_binding(value) {
    		wiggle = value;
    		$$invalidate(42, wiggle);
    	}

    	const mouseup_handler_1 = (disabled, label, event) => {
    		if (!disabled) add(label, event);
    	};

    	const mouseover_handler = (disabled, idx) => {
    		if (!disabled) $$invalidate(0, activeIndex = idx);
    	};

    	const focus_handler_1 = (disabled, idx) => {
    		if (!disabled) $$invalidate(0, activeIndex = idx);
    	};

    	const mouseout_handler = () => $$invalidate(0, activeIndex = null);
    	const blur_handler_1 = () => $$invalidate(0, activeIndex = null);
    	const func = option => duplicateFunc(option, searchText);
    	const mouseup_handler_2 = event => add(searchText, event);
    	const mouseover_handler_1 = () => $$invalidate(43, add_option_msg_is_active = true);
    	const focus_handler_2 = () => $$invalidate(43, add_option_msg_is_active = true);
    	const mouseout_handler_1 = () => $$invalidate(43, add_option_msg_is_active = false);
    	const blur_handler_2 = () => $$invalidate(43, add_option_msg_is_active = false);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			outerDiv = $$value;
    			$$invalidate(9, outerDiv);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('activeIndex' in $$props) $$invalidate(0, activeIndex = $$props.activeIndex);
    		if ('activeOption' in $$props) $$invalidate(57, activeOption = $$props.activeOption);
    		if ('addOptionMsg' in $$props) $$invalidate(10, addOptionMsg = $$props.addOptionMsg);
    		if ('allowUserOptions' in $$props) $$invalidate(11, allowUserOptions = $$props.allowUserOptions);
    		if ('autocomplete' in $$props) $$invalidate(12, autocomplete = $$props.autocomplete);
    		if ('autoScroll' in $$props) $$invalidate(59, autoScroll = $$props.autoScroll);
    		if ('breakpoint' in $$props) $$invalidate(60, breakpoint = $$props.breakpoint);
    		if ('defaultDisabledTitle' in $$props) $$invalidate(13, defaultDisabledTitle = $$props.defaultDisabledTitle);
    		if ('disabled' in $$props) $$invalidate(41, disabled = $$props.disabled);
    		if ('disabledInputTitle' in $$props) $$invalidate(14, disabledInputTitle = $$props.disabledInputTitle);
    		if ('duplicateFunc' in $$props) $$invalidate(15, duplicateFunc = $$props.duplicateFunc);
    		if ('duplicateOptionMsg' in $$props) $$invalidate(16, duplicateOptionMsg = $$props.duplicateOptionMsg);
    		if ('duplicates' in $$props) $$invalidate(17, duplicates = $$props.duplicates);
    		if ('filterFunc' in $$props) $$invalidate(61, filterFunc = $$props.filterFunc);
    		if ('focusInputOnSelect' in $$props) $$invalidate(62, focusInputOnSelect = $$props.focusInputOnSelect);
    		if ('form_input' in $$props) $$invalidate(5, form_input = $$props.form_input);
    		if ('id' in $$props) $$invalidate(18, id = $$props.id);
    		if ('input' in $$props) $$invalidate(6, input = $$props.input);
    		if ('inputClass' in $$props) $$invalidate(19, inputClass = $$props.inputClass);
    		if ('inputmode' in $$props) $$invalidate(20, inputmode = $$props.inputmode);
    		if ('invalid' in $$props) $$invalidate(7, invalid = $$props.invalid);
    		if ('liActiveOptionClass' in $$props) $$invalidate(21, liActiveOptionClass = $$props.liActiveOptionClass);
    		if ('liOptionClass' in $$props) $$invalidate(22, liOptionClass = $$props.liOptionClass);
    		if ('liSelectedClass' in $$props) $$invalidate(23, liSelectedClass = $$props.liSelectedClass);
    		if ('loading' in $$props) $$invalidate(24, loading = $$props.loading);
    		if ('matchingOptions' in $$props) $$invalidate(1, matchingOptions = $$props.matchingOptions);
    		if ('maxSelect' in $$props) $$invalidate(25, maxSelect = $$props.maxSelect);
    		if ('maxSelectMsg' in $$props) $$invalidate(26, maxSelectMsg = $$props.maxSelectMsg);
    		if ('maxSelectMsgClass' in $$props) $$invalidate(27, maxSelectMsgClass = $$props.maxSelectMsgClass);
    		if ('name' in $$props) $$invalidate(28, name = $$props.name);
    		if ('noMatchingOptionsMsg' in $$props) $$invalidate(29, noMatchingOptionsMsg = $$props.noMatchingOptionsMsg);
    		if ('open' in $$props) $$invalidate(8, open = $$props.open);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('outerDiv' in $$props) $$invalidate(9, outerDiv = $$props.outerDiv);
    		if ('outerDivClass' in $$props) $$invalidate(30, outerDivClass = $$props.outerDivClass);
    		if ('parseLabelsAsHtml' in $$props) $$invalidate(31, parseLabelsAsHtml = $$props.parseLabelsAsHtml);
    		if ('pattern' in $$props) $$invalidate(32, pattern = $$props.pattern);
    		if ('placeholder' in $$props) $$invalidate(33, placeholder = $$props.placeholder);
    		if ('removeAllTitle' in $$props) $$invalidate(34, removeAllTitle = $$props.removeAllTitle);
    		if ('removeBtnTitle' in $$props) $$invalidate(35, removeBtnTitle = $$props.removeBtnTitle);
    		if ('minSelect' in $$props) $$invalidate(36, minSelect = $$props.minSelect);
    		if ('required' in $$props) $$invalidate(37, required = $$props.required);
    		if ('resetFilterOnAdd' in $$props) $$invalidate(63, resetFilterOnAdd = $$props.resetFilterOnAdd);
    		if ('searchText' in $$props) $$invalidate(3, searchText = $$props.searchText);
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    		if ('sortSelected' in $$props) $$invalidate(64, sortSelected = $$props.sortSelected);
    		if ('selectedOptionsDraggable' in $$props) $$invalidate(38, selectedOptionsDraggable = $$props.selectedOptionsDraggable);
    		if ('ulOptionsClass' in $$props) $$invalidate(39, ulOptionsClass = $$props.ulOptionsClass);
    		if ('ulSelectedClass' in $$props) $$invalidate(40, ulSelectedClass = $$props.ulSelectedClass);
    		if ('value' in $$props) $$invalidate(58, value = $$props.value);
    		if ('$$scope' in $$props) $$invalidate(102, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		tick,
    		flip,
    		CircleSpinner,
    		CrossIcon: Cross,
    		DisabledIcon: Disabled,
    		ExpandIcon: ChevronExpand,
    		Wiggle,
    		activeIndex,
    		activeOption,
    		addOptionMsg,
    		allowUserOptions,
    		autocomplete,
    		autoScroll,
    		breakpoint,
    		defaultDisabledTitle,
    		disabled,
    		disabledInputTitle,
    		duplicateFunc,
    		duplicateOptionMsg,
    		duplicates,
    		filterFunc,
    		focusInputOnSelect,
    		form_input,
    		id,
    		input,
    		inputClass,
    		inputmode,
    		invalid,
    		liActiveOptionClass,
    		liOptionClass,
    		liSelectedClass,
    		loading,
    		matchingOptions,
    		maxSelect,
    		maxSelectMsg,
    		maxSelectMsgClass,
    		name,
    		noMatchingOptionsMsg,
    		open,
    		options,
    		outerDiv,
    		outerDivClass,
    		parseLabelsAsHtml,
    		pattern,
    		placeholder,
    		removeAllTitle,
    		removeBtnTitle,
    		minSelect,
    		required,
    		resetFilterOnAdd,
    		searchText,
    		selected,
    		sortSelected,
    		selectedOptionsDraggable,
    		ulOptionsClass,
    		ulSelectedClass,
    		value,
    		get_label,
    		wiggle,
    		dispatch,
    		add_option_msg_is_active,
    		window_width,
    		add,
    		remove,
    		open_dropdown,
    		close_dropdown,
    		handle_keydown,
    		remove_all,
    		if_enter_or_space,
    		on_click_outside,
    		drag_idx,
    		drop,
    		dragstart,
    		is_selected
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeIndex' in $$props) $$invalidate(0, activeIndex = $$props.activeIndex);
    		if ('activeOption' in $$props) $$invalidate(57, activeOption = $$props.activeOption);
    		if ('addOptionMsg' in $$props) $$invalidate(10, addOptionMsg = $$props.addOptionMsg);
    		if ('allowUserOptions' in $$props) $$invalidate(11, allowUserOptions = $$props.allowUserOptions);
    		if ('autocomplete' in $$props) $$invalidate(12, autocomplete = $$props.autocomplete);
    		if ('autoScroll' in $$props) $$invalidate(59, autoScroll = $$props.autoScroll);
    		if ('breakpoint' in $$props) $$invalidate(60, breakpoint = $$props.breakpoint);
    		if ('defaultDisabledTitle' in $$props) $$invalidate(13, defaultDisabledTitle = $$props.defaultDisabledTitle);
    		if ('disabled' in $$props) $$invalidate(41, disabled = $$props.disabled);
    		if ('disabledInputTitle' in $$props) $$invalidate(14, disabledInputTitle = $$props.disabledInputTitle);
    		if ('duplicateFunc' in $$props) $$invalidate(15, duplicateFunc = $$props.duplicateFunc);
    		if ('duplicateOptionMsg' in $$props) $$invalidate(16, duplicateOptionMsg = $$props.duplicateOptionMsg);
    		if ('duplicates' in $$props) $$invalidate(17, duplicates = $$props.duplicates);
    		if ('filterFunc' in $$props) $$invalidate(61, filterFunc = $$props.filterFunc);
    		if ('focusInputOnSelect' in $$props) $$invalidate(62, focusInputOnSelect = $$props.focusInputOnSelect);
    		if ('form_input' in $$props) $$invalidate(5, form_input = $$props.form_input);
    		if ('id' in $$props) $$invalidate(18, id = $$props.id);
    		if ('input' in $$props) $$invalidate(6, input = $$props.input);
    		if ('inputClass' in $$props) $$invalidate(19, inputClass = $$props.inputClass);
    		if ('inputmode' in $$props) $$invalidate(20, inputmode = $$props.inputmode);
    		if ('invalid' in $$props) $$invalidate(7, invalid = $$props.invalid);
    		if ('liActiveOptionClass' in $$props) $$invalidate(21, liActiveOptionClass = $$props.liActiveOptionClass);
    		if ('liOptionClass' in $$props) $$invalidate(22, liOptionClass = $$props.liOptionClass);
    		if ('liSelectedClass' in $$props) $$invalidate(23, liSelectedClass = $$props.liSelectedClass);
    		if ('loading' in $$props) $$invalidate(24, loading = $$props.loading);
    		if ('matchingOptions' in $$props) $$invalidate(1, matchingOptions = $$props.matchingOptions);
    		if ('maxSelect' in $$props) $$invalidate(25, maxSelect = $$props.maxSelect);
    		if ('maxSelectMsg' in $$props) $$invalidate(26, maxSelectMsg = $$props.maxSelectMsg);
    		if ('maxSelectMsgClass' in $$props) $$invalidate(27, maxSelectMsgClass = $$props.maxSelectMsgClass);
    		if ('name' in $$props) $$invalidate(28, name = $$props.name);
    		if ('noMatchingOptionsMsg' in $$props) $$invalidate(29, noMatchingOptionsMsg = $$props.noMatchingOptionsMsg);
    		if ('open' in $$props) $$invalidate(8, open = $$props.open);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('outerDiv' in $$props) $$invalidate(9, outerDiv = $$props.outerDiv);
    		if ('outerDivClass' in $$props) $$invalidate(30, outerDivClass = $$props.outerDivClass);
    		if ('parseLabelsAsHtml' in $$props) $$invalidate(31, parseLabelsAsHtml = $$props.parseLabelsAsHtml);
    		if ('pattern' in $$props) $$invalidate(32, pattern = $$props.pattern);
    		if ('placeholder' in $$props) $$invalidate(33, placeholder = $$props.placeholder);
    		if ('removeAllTitle' in $$props) $$invalidate(34, removeAllTitle = $$props.removeAllTitle);
    		if ('removeBtnTitle' in $$props) $$invalidate(35, removeBtnTitle = $$props.removeBtnTitle);
    		if ('minSelect' in $$props) $$invalidate(36, minSelect = $$props.minSelect);
    		if ('required' in $$props) $$invalidate(37, required = $$props.required);
    		if ('resetFilterOnAdd' in $$props) $$invalidate(63, resetFilterOnAdd = $$props.resetFilterOnAdd);
    		if ('searchText' in $$props) $$invalidate(3, searchText = $$props.searchText);
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    		if ('sortSelected' in $$props) $$invalidate(64, sortSelected = $$props.sortSelected);
    		if ('selectedOptionsDraggable' in $$props) $$invalidate(38, selectedOptionsDraggable = $$props.selectedOptionsDraggable);
    		if ('ulOptionsClass' in $$props) $$invalidate(39, ulOptionsClass = $$props.ulOptionsClass);
    		if ('ulSelectedClass' in $$props) $$invalidate(40, ulSelectedClass = $$props.ulSelectedClass);
    		if ('value' in $$props) $$invalidate(58, value = $$props.value);
    		if ('wiggle' in $$props) $$invalidate(42, wiggle = $$props.wiggle);
    		if ('add_option_msg_is_active' in $$props) $$invalidate(43, add_option_msg_is_active = $$props.add_option_msg_is_active);
    		if ('window_width' in $$props) $$invalidate(44, window_width = $$props.window_width);
    		if ('drag_idx' in $$props) $$invalidate(45, drag_idx = $$props.drag_idx);
    		if ('is_selected' in $$props) $$invalidate(46, is_selected = $$props.is_selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*maxSelect, selected*/ 33554448) {
    			// if maxSelect=1, value is the single item in selected (or null if selected is empty)
    			// this solves both https://github.com/janosh/svelte-multiselect/issues/86 and
    			// https://github.com/janosh/svelte-multiselect/issues/136
    			$$invalidate(58, value = maxSelect === 1 ? selected[0] ?? null : selected);
    		}

    		if ($$self.$$.dirty[0] & /*options, searchText, selected*/ 28 | $$self.$$.dirty[1] & /*filterFunc*/ 1073741824) {
    			// options matching the current search text
    			$$invalidate(1, matchingOptions = options.filter(op => filterFunc(op, searchText) && !selected.map(get_label).includes(get_label(op)))); // remove already selected options from dropdown list
    		}

    		if ($$self.$$.dirty[0] & /*activeIndex, matchingOptions*/ 3) {
    			// update activeOption when activeIndex changes
    			$$invalidate(57, activeOption = activeIndex !== null
    			? matchingOptions[activeIndex]
    			: null);
    		}

    		if ($$self.$$.dirty[0] & /*selected*/ 16) {
    			$$invalidate(46, is_selected = label => selected.map(get_label).includes(label));
    		}
    	};

    	return [
    		activeIndex,
    		matchingOptions,
    		options,
    		searchText,
    		selected,
    		form_input,
    		input,
    		invalid,
    		open,
    		outerDiv,
    		addOptionMsg,
    		allowUserOptions,
    		autocomplete,
    		defaultDisabledTitle,
    		disabledInputTitle,
    		duplicateFunc,
    		duplicateOptionMsg,
    		duplicates,
    		id,
    		inputClass,
    		inputmode,
    		liActiveOptionClass,
    		liOptionClass,
    		liSelectedClass,
    		loading,
    		maxSelect,
    		maxSelectMsg,
    		maxSelectMsgClass,
    		name,
    		noMatchingOptionsMsg,
    		outerDivClass,
    		parseLabelsAsHtml,
    		pattern,
    		placeholder,
    		removeAllTitle,
    		removeBtnTitle,
    		minSelect,
    		required,
    		selectedOptionsDraggable,
    		ulOptionsClass,
    		ulSelectedClass,
    		disabled,
    		wiggle,
    		add_option_msg_is_active,
    		window_width,
    		drag_idx,
    		is_selected,
    		get_label,
    		add,
    		remove,
    		open_dropdown,
    		handle_keydown,
    		remove_all,
    		if_enter_or_space,
    		on_click_outside,
    		drop,
    		dragstart,
    		activeOption,
    		value,
    		autoScroll,
    		breakpoint,
    		filterFunc,
    		focusInputOnSelect,
    		resetFilterOnAdd,
    		sortSelected,
    		slots,
    		mousedown_handler_1,
    		mousedown_handler_2,
    		focus_handler,
    		blur_handler,
    		change_handler,
    		click_handler,
    		keydown_handler,
    		keyup_handler,
    		mousedown_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		touchcancel_handler,
    		touchend_handler,
    		touchmove_handler,
    		touchstart_handler,
    		onwindowresize,
    		input0_binding,
    		invalid_handler,
    		mouseup_handler,
    		keydown_handler_1,
    		dragenter_handler,
    		input1_binding,
    		input1_input_handler,
    		wiggle_1_wiggle_binding,
    		mouseup_handler_1,
    		mouseover_handler,
    		focus_handler_1,
    		mouseout_handler,
    		blur_handler_1,
    		func,
    		mouseup_handler_2,
    		mouseover_handler_1,
    		focus_handler_2,
    		mouseout_handler_1,
    		blur_handler_2,
    		div_binding,
    		$$scope
    	];
    }

    class MultiSelect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$6,
    			create_fragment$6,
    			safe_not_equal,
    			{
    				activeIndex: 0,
    				activeOption: 57,
    				addOptionMsg: 10,
    				allowUserOptions: 11,
    				autocomplete: 12,
    				autoScroll: 59,
    				breakpoint: 60,
    				defaultDisabledTitle: 13,
    				disabled: 41,
    				disabledInputTitle: 14,
    				duplicateFunc: 15,
    				duplicateOptionMsg: 16,
    				duplicates: 17,
    				filterFunc: 61,
    				focusInputOnSelect: 62,
    				form_input: 5,
    				id: 18,
    				input: 6,
    				inputClass: 19,
    				inputmode: 20,
    				invalid: 7,
    				liActiveOptionClass: 21,
    				liOptionClass: 22,
    				liSelectedClass: 23,
    				loading: 24,
    				matchingOptions: 1,
    				maxSelect: 25,
    				maxSelectMsg: 26,
    				maxSelectMsgClass: 27,
    				name: 28,
    				noMatchingOptionsMsg: 29,
    				open: 8,
    				options: 2,
    				outerDiv: 9,
    				outerDivClass: 30,
    				parseLabelsAsHtml: 31,
    				pattern: 32,
    				placeholder: 33,
    				removeAllTitle: 34,
    				removeBtnTitle: 35,
    				minSelect: 36,
    				required: 37,
    				resetFilterOnAdd: 63,
    				searchText: 3,
    				selected: 4,
    				sortSelected: 64,
    				selectedOptionsDraggable: 38,
    				ulOptionsClass: 39,
    				ulSelectedClass: 40,
    				value: 58
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MultiSelect",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get activeIndex() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeIndex(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeOption() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeOption(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addOptionMsg() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addOptionMsg(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allowUserOptions() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allowUserOptions(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autocomplete() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autocomplete(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoScroll() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoScroll(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get breakpoint() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breakpoint(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultDisabledTitle() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultDisabledTitle(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabledInputTitle() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabledInputTitle(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duplicateFunc() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duplicateFunc(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duplicateOptionMsg() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duplicateOptionMsg(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duplicates() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duplicates(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterFunc() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterFunc(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusInputOnSelect() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusInputOnSelect(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form_input() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form_input(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputmode() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputmode(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get liActiveOptionClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set liActiveOptionClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get liOptionClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set liOptionClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get liSelectedClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set liSelectedClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loading() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get matchingOptions() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set matchingOptions(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxSelect() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxSelect(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxSelectMsg() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxSelectMsg(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxSelectMsgClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxSelectMsgClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noMatchingOptionsMsg() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noMatchingOptionsMsg(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outerDiv() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outerDiv(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outerDivClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outerDivClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parseLabelsAsHtml() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parseLabelsAsHtml(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pattern() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pattern(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeAllTitle() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removeAllTitle(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeBtnTitle() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removeBtnTitle(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minSelect() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minSelect(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resetFilterOnAdd() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resetFilterOnAdd(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchText() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchText(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortSelected() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortSelected(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedOptionsDraggable() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedOptionsDraggable(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ulOptionsClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ulOptionsClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ulSelectedClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ulSelectedClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // Firefox lacks support for scrollIntoViewIfNeeded, see
    // https://github.com/janosh/svelte-multiselect/issues/87
    // this polyfill was copied from
    // https://github.com/nuxodin/lazyfill/blob/a8e63/polyfills/Element/prototype/scrollIntoViewIfNeeded.js
    if (typeof Element !== `undefined` &&
        !Element.prototype?.scrollIntoViewIfNeeded &&
        typeof IntersectionObserver !== `undefined`) {
        Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded = true) {
            const el = this;
            new IntersectionObserver(function ([entry]) {
                const ratio = entry.intersectionRatio;
                if (ratio < 1) {
                    const place = ratio <= 0 && centerIfNeeded ? `center` : `nearest`;
                    el.scrollIntoView({
                        block: place,
                        inline: place,
                    });
                }
                this.disconnect();
            }).observe(this);
        };
    }

    /* src/MultiSelectCustom.svelte generated by Svelte v3.55.0 */
    const file$4 = "src/MultiSelectCustom.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[20] = list;
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (34:4) {:else}
    function create_else_block$1(ctx) {
    	let multiselect;
    	let updating_selected;
    	let current;

    	function multiselect_selected_binding_1(value) {
    		/*multiselect_selected_binding_1*/ ctx[13](value);
    	}

    	let multiselect_props = {
    		id: /*typeOfFeed*/ ctx[5],
    		options: /*optionsForMultiSelect*/ ctx[4]
    	};

    	if (/*selected*/ ctx[0] !== void 0) {
    		multiselect_props.selected = /*selected*/ ctx[0];
    	}

    	multiselect = new MultiSelect({ props: multiselect_props, $$inline: true });
    	binding_callbacks.push(() => bind$1(multiselect, 'selected', multiselect_selected_binding_1, /*selected*/ ctx[0]));
    	multiselect.$on("add", /*add_handler_1*/ ctx[14]);
    	multiselect.$on("remove", /*remove_handler_1*/ ctx[15]);

    	const block = {
    		c: function create() {
    			create_component(multiselect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(multiselect, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const multiselect_changes = {};
    			if (dirty & /*typeOfFeed*/ 32) multiselect_changes.id = /*typeOfFeed*/ ctx[5];
    			if (dirty & /*optionsForMultiSelect*/ 16) multiselect_changes.options = /*optionsForMultiSelect*/ ctx[4];

    			if (!updating_selected && dirty & /*selected*/ 1) {
    				updating_selected = true;
    				multiselect_changes.selected = /*selected*/ ctx[0];
    				add_flush_callback(() => updating_selected = false);
    			}

    			multiselect.$set(multiselect_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(multiselect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(multiselect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(multiselect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(34:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#if maxNumOfSel>-1}
    function create_if_block$1(ctx) {
    	let multiselect;
    	let updating_selected;
    	let current;

    	function multiselect_selected_binding(value) {
    		/*multiselect_selected_binding*/ ctx[10](value);
    	}

    	let multiselect_props = {
    		id: /*typeOfFeed*/ ctx[5],
    		options: /*optionsForMultiSelect*/ ctx[4],
    		maxSelect: /*maxNumOfSel*/ ctx[6]
    	};

    	if (/*selected*/ ctx[0] !== void 0) {
    		multiselect_props.selected = /*selected*/ ctx[0];
    	}

    	multiselect = new MultiSelect({ props: multiselect_props, $$inline: true });
    	binding_callbacks.push(() => bind$1(multiselect, 'selected', multiselect_selected_binding, /*selected*/ ctx[0]));
    	multiselect.$on("add", /*add_handler*/ ctx[11]);
    	multiselect.$on("remove", /*remove_handler*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(multiselect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(multiselect, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const multiselect_changes = {};
    			if (dirty & /*typeOfFeed*/ 32) multiselect_changes.id = /*typeOfFeed*/ ctx[5];
    			if (dirty & /*optionsForMultiSelect*/ 16) multiselect_changes.options = /*optionsForMultiSelect*/ ctx[4];
    			if (dirty & /*maxNumOfSel*/ 64) multiselect_changes.maxSelect = /*maxNumOfSel*/ ctx[6];

    			if (!updating_selected && dirty & /*selected*/ 1) {
    				updating_selected = true;
    				multiselect_changes.selected = /*selected*/ ctx[0];
    				add_flush_callback(() => updating_selected = false);
    			}

    			multiselect.$set(multiselect_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(multiselect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(multiselect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(multiselect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(25:4) {#if maxNumOfSel>-1}",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#each selected as option, i}
    function create_each_block$1(ctx) {
    	let p;
    	let t0_value = /*option*/ ctx[19] + "";
    	let t0;
    	let t1;
    	let table;
    	let tr;
    	let th0;
    	let t3;
    	let td0;
    	let input0;
    	let input0_id_value;
    	let input0_name_value;
    	let t4;
    	let th1;
    	let t6;
    	let td1;
    	let input1;
    	let input1_id_value;
    	let input1_name_value;
    	let t7;
    	let th2;
    	let t9;
    	let td2;
    	let input2;
    	let input2_id_value;
    	let input2_name_value;
    	let t10;
    	let mounted;
    	let dispose;

    	function input0_input_handler() {
    		/*input0_input_handler*/ ctx[16].call(input0, /*option*/ ctx[19]);
    	}

    	function input1_input_handler() {
    		/*input1_input_handler*/ ctx[17].call(input1, /*option*/ ctx[19]);
    	}

    	function input2_input_handler() {
    		/*input2_input_handler*/ ctx[18].call(input2, /*option*/ ctx[19]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Fiyat:";
    			t3 = space();
    			td0 = element("td");
    			input0 = element("input");
    			t4 = space();
    			th1 = element("th");
    			th1.textContent = "Minimum Tüketim Miktarı:";
    			t6 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t7 = space();
    			th2 = element("th");
    			th2.textContent = "Maksimum Tüketim Miktarı:";
    			t9 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t10 = space();
    			attr_dev(p, "class", "svelte-1qylmvx");
    			add_location(p, file$4, 43, 8, 1264);
    			attr_dev(th0, "class", "svelte-1qylmvx");
    			add_location(th0, file$4, 46, 16, 1330);
    			attr_dev(input0, "id", input0_id_value = /*option*/ ctx[19] + "fiyat");
    			attr_dev(input0, "name", input0_name_value = /*option*/ ctx[19] + "fiyat");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "0");
    			attr_dev(input0, "class", "svelte-1qylmvx");
    			add_location(input0, file$4, 48, 21, 1389);
    			attr_dev(td0, "class", "svelte-1qylmvx");
    			add_location(td0, file$4, 47, 16, 1364);
    			attr_dev(th1, "class", "svelte-1qylmvx");
    			add_location(th1, file$4, 56, 16, 1673);
    			attr_dev(input1, "id", input1_id_value = /*option*/ ctx[19] + "min");
    			attr_dev(input1, "name", input1_name_value = /*option*/ ctx[19] + "min");
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "class", "svelte-1qylmvx");
    			add_location(input1, file$4, 58, 21, 1750);
    			attr_dev(td1, "class", "svelte-1qylmvx");
    			add_location(td1, file$4, 57, 16, 1725);
    			attr_dev(th2, "class", "svelte-1qylmvx");
    			add_location(th2, file$4, 66, 16, 2031);
    			attr_dev(input2, "id", input2_id_value = /*option*/ ctx[19] + "max");
    			attr_dev(input2, "name", input2_name_value = /*option*/ ctx[19] + "max");
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "min", "0");
    			attr_dev(input2, "class", "svelte-1qylmvx");
    			add_location(input2, file$4, 68, 21, 2109);
    			attr_dev(td2, "class", "svelte-1qylmvx");
    			add_location(td2, file$4, 67, 16, 2084);
    			add_location(tr, file$4, 45, 12, 1309);
    			attr_dev(table, "class", "svelte-1qylmvx");
    			add_location(table, file$4, 44, 8, 1289);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*prices*/ ctx[1][/*option*/ ctx[19]]);
    			append_dev(tr, t4);
    			append_dev(tr, th1);
    			append_dev(tr, t6);
    			append_dev(tr, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*minVals*/ ctx[2][/*option*/ ctx[19]]);
    			append_dev(tr, t7);
    			append_dev(tr, th2);
    			append_dev(tr, t9);
    			append_dev(tr, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*maxVals*/ ctx[3][/*option*/ ctx[19]]);
    			append_dev(table, t10);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", input0_input_handler),
    					listen_dev(input1, "input", input1_input_handler),
    					listen_dev(input2, "input", input2_input_handler)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*selected*/ 1 && t0_value !== (t0_value = /*option*/ ctx[19] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*selected*/ 1 && input0_id_value !== (input0_id_value = /*option*/ ctx[19] + "fiyat")) {
    				attr_dev(input0, "id", input0_id_value);
    			}

    			if (dirty & /*selected*/ 1 && input0_name_value !== (input0_name_value = /*option*/ ctx[19] + "fiyat")) {
    				attr_dev(input0, "name", input0_name_value);
    			}

    			if (dirty & /*prices, selected*/ 3 && to_number(input0.value) !== /*prices*/ ctx[1][/*option*/ ctx[19]]) {
    				set_input_value(input0, /*prices*/ ctx[1][/*option*/ ctx[19]]);
    			}

    			if (dirty & /*selected*/ 1 && input1_id_value !== (input1_id_value = /*option*/ ctx[19] + "min")) {
    				attr_dev(input1, "id", input1_id_value);
    			}

    			if (dirty & /*selected*/ 1 && input1_name_value !== (input1_name_value = /*option*/ ctx[19] + "min")) {
    				attr_dev(input1, "name", input1_name_value);
    			}

    			if (dirty & /*minVals, selected*/ 5 && to_number(input1.value) !== /*minVals*/ ctx[2][/*option*/ ctx[19]]) {
    				set_input_value(input1, /*minVals*/ ctx[2][/*option*/ ctx[19]]);
    			}

    			if (dirty & /*selected*/ 1 && input2_id_value !== (input2_id_value = /*option*/ ctx[19] + "max")) {
    				attr_dev(input2, "id", input2_id_value);
    			}

    			if (dirty & /*selected*/ 1 && input2_name_value !== (input2_name_value = /*option*/ ctx[19] + "max")) {
    				attr_dev(input2, "name", input2_name_value);
    			}

    			if (dirty & /*maxVals, selected*/ 9 && to_number(input2.value) !== /*maxVals*/ ctx[3][/*option*/ ctx[19]]) {
    				set_input_value(input2, /*maxVals*/ ctx[3][/*option*/ ctx[19]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(table);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(43:4) {#each selected as option, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let label;
    	let t0;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*maxNumOfSel*/ ctx[6] > -1) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value = /*selected*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			label = element("label");
    			t0 = text(/*typeOfFeed*/ ctx[5]);
    			t1 = space();
    			if_block.c();
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(label, "for", /*typeOfFeed*/ ctx[5]);
    			attr_dev(label, "class", "svelte-1qylmvx");
    			add_location(label, file$4, 23, 4, 678);
    			add_location(main, file$4, 22, 0, 667);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, label);
    			append_dev(label, t0);
    			append_dev(main, t1);
    			if_blocks[current_block_type_index].m(main, null);
    			append_dev(main, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*typeOfFeed*/ 32) set_data_dev(t0, /*typeOfFeed*/ ctx[5]);

    			if (!current || dirty & /*typeOfFeed*/ 32) {
    				attr_dev(label, "for", /*typeOfFeed*/ ctx[5]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, t2);
    			}

    			if (dirty & /*selected, maxVals, minVals, prices*/ 15) {
    				each_value = /*selected*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(main, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MultiSelectCustom', slots, []);
    	let { optionsForMultiSelect } = $$props;
    	let { typeOfFeed = "" } = $$props;
    	let { selected = [] } = $$props;
    	let { prices = [] } = $$props;
    	let { minVals = [] } = $$props;
    	let { maxVals = [] } = $$props;
    	let { minNumOfSel = 0 } = $$props;
    	let { maxNumOfSel = -1 } = $$props;

    	function addTableRow(event) {
    		$$invalidate(1, prices[event.detail.option] = 0, prices);
    		$$invalidate(2, minVals[event.detail.option] = 0, minVals);
    		$$invalidate(3, maxVals[event.detail.option] = 99999, maxVals);
    	}

    	function removeTableRow(event) {
    		delete prices[event.detail.option];
    		delete minVals[event.detail.option];
    		delete maxVals[event.detail.option];
    	}

    	$$self.$$.on_mount.push(function () {
    		if (optionsForMultiSelect === undefined && !('optionsForMultiSelect' in $$props || $$self.$$.bound[$$self.$$.props['optionsForMultiSelect']])) {
    			console.warn("<MultiSelectCustom> was created without expected prop 'optionsForMultiSelect'");
    		}
    	});

    	const writable_props = [
    		'optionsForMultiSelect',
    		'typeOfFeed',
    		'selected',
    		'prices',
    		'minVals',
    		'maxVals',
    		'minNumOfSel',
    		'maxNumOfSel'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MultiSelectCustom> was created with unknown prop '${key}'`);
    	});

    	function multiselect_selected_binding(value) {
    		selected = value;
    		$$invalidate(0, selected);
    	}

    	const add_handler = event => addTableRow(event);
    	const remove_handler = event => removeTableRow(event);

    	function multiselect_selected_binding_1(value) {
    		selected = value;
    		$$invalidate(0, selected);
    	}

    	const add_handler_1 = event => addTableRow(event);
    	const remove_handler_1 = event => removeTableRow(event);

    	function input0_input_handler(option) {
    		prices[option] = to_number(this.value);
    		$$invalidate(1, prices);
    	}

    	function input1_input_handler(option) {
    		minVals[option] = to_number(this.value);
    		$$invalidate(2, minVals);
    	}

    	function input2_input_handler(option) {
    		maxVals[option] = to_number(this.value);
    		$$invalidate(3, maxVals);
    	}

    	$$self.$$set = $$props => {
    		if ('optionsForMultiSelect' in $$props) $$invalidate(4, optionsForMultiSelect = $$props.optionsForMultiSelect);
    		if ('typeOfFeed' in $$props) $$invalidate(5, typeOfFeed = $$props.typeOfFeed);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('prices' in $$props) $$invalidate(1, prices = $$props.prices);
    		if ('minVals' in $$props) $$invalidate(2, minVals = $$props.minVals);
    		if ('maxVals' in $$props) $$invalidate(3, maxVals = $$props.maxVals);
    		if ('minNumOfSel' in $$props) $$invalidate(9, minNumOfSel = $$props.minNumOfSel);
    		if ('maxNumOfSel' in $$props) $$invalidate(6, maxNumOfSel = $$props.maxNumOfSel);
    	};

    	$$self.$capture_state = () => ({
    		MultiSelect,
    		optionsForMultiSelect,
    		typeOfFeed,
    		selected,
    		prices,
    		minVals,
    		maxVals,
    		minNumOfSel,
    		maxNumOfSel,
    		addTableRow,
    		removeTableRow
    	});

    	$$self.$inject_state = $$props => {
    		if ('optionsForMultiSelect' in $$props) $$invalidate(4, optionsForMultiSelect = $$props.optionsForMultiSelect);
    		if ('typeOfFeed' in $$props) $$invalidate(5, typeOfFeed = $$props.typeOfFeed);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('prices' in $$props) $$invalidate(1, prices = $$props.prices);
    		if ('minVals' in $$props) $$invalidate(2, minVals = $$props.minVals);
    		if ('maxVals' in $$props) $$invalidate(3, maxVals = $$props.maxVals);
    		if ('minNumOfSel' in $$props) $$invalidate(9, minNumOfSel = $$props.minNumOfSel);
    		if ('maxNumOfSel' in $$props) $$invalidate(6, maxNumOfSel = $$props.maxNumOfSel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selected,
    		prices,
    		minVals,
    		maxVals,
    		optionsForMultiSelect,
    		typeOfFeed,
    		maxNumOfSel,
    		addTableRow,
    		removeTableRow,
    		minNumOfSel,
    		multiselect_selected_binding,
    		add_handler,
    		remove_handler,
    		multiselect_selected_binding_1,
    		add_handler_1,
    		remove_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class MultiSelectCustom extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			optionsForMultiSelect: 4,
    			typeOfFeed: 5,
    			selected: 0,
    			prices: 1,
    			minVals: 2,
    			maxVals: 3,
    			minNumOfSel: 9,
    			maxNumOfSel: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MultiSelectCustom",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get optionsForMultiSelect() {
    		throw new Error("<MultiSelectCustom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set optionsForMultiSelect(value) {
    		throw new Error("<MultiSelectCustom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get typeOfFeed() {
    		throw new Error("<MultiSelectCustom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set typeOfFeed(value) {
    		throw new Error("<MultiSelectCustom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<MultiSelectCustom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<MultiSelectCustom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prices() {
    		throw new Error("<MultiSelectCustom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prices(value) {
    		throw new Error("<MultiSelectCustom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minVals() {
    		throw new Error("<MultiSelectCustom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minVals(value) {
    		throw new Error("<MultiSelectCustom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxVals() {
    		throw new Error("<MultiSelectCustom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxVals(value) {
    		throw new Error("<MultiSelectCustom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minNumOfSel() {
    		throw new Error("<MultiSelectCustom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minNumOfSel(value) {
    		throw new Error("<MultiSelectCustom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxNumOfSel() {
    		throw new Error("<MultiSelectCustom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxNumOfSel(value) {
    		throw new Error("<MultiSelectCustom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const dataFeed =
      [
        {
          "feed": "Yonca Kuru Otu, 1. Kalite >%21 HP,     <%37 NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Yonca Kuru Otu, 2. Kalite >%19 HP,     <%37-40 NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Yonca Kuru Otu, 3. Kalite >%16 HP,     <%44-48 NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Yonca Kuru Otu, 4. Kalite >%14 HP,     <%48-54 NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Yonca Kuru Otu, 5. Kalite >%13 HP,     >%54 NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Yonca Kuru Otu, Erken Vejetatif",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Yonca Kuru Otu, Geç Vejetatif",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Yonca Kuru Otu, 6. Kalite <%11 HP,     >%54 NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Badem-Kabukları",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Elma Posası yaş",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Fırıncılık Yan Ürünleri,Un Artığı",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Fırıncılık Yan Ürünleri, Ekmek Artığı",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Fırıncılık Yan Ürünleri, Tahıl Artığı",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Fırıncılık Yan Ürünleri, Bisküvi Artığı",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Arpa , Ezme",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Arpa, Malt Cili",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Arpa Silajı, Başaklı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Şeker Pancarı",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Şeker Pancarı Posası, Kuru",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Şeker Pancarı Posası Yaş",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Şeker Pancarı Posası Yaş ambalajlı",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Köpek dişi(BERMUDA-Çimi)-Sahil-Erken başaklanma",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Köpek dişi(BERMUDA-Çimi)-3-4 haftalık",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Bira posası kuru",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Bira posası yaş",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Kanola Tohumu",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Kanola Küspesi",
          "TDNClass": "Protein"
        },
        {
          "feed": "Çikolata yan ürünleri",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Turunçgil posası kuru",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Mısır Koçanı",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Mısır-DDGS-Kuru",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Mısır gluten yemi kuru",
          "TDNClass": "Protein"
        },
        {
          "feed": "Mısır gluteni 63",
          "TDNClass": "Protein"
        },
        {
          "feed": "Mısır gluteni 44",
          "TDNClass": "Protein"
        },
        {
          "feed": "Kırılmış Mısır",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Öğütülmüş Mısır",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Pul Haline gelmiş Mısır",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Ezilmiş Mısır",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Öğütülmüş Mısır",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Mısır koçanı öğütülmüş",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Mısır koçanı taneli öğütülmüş nemi yüksek",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Mısır Grizi",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Mısır Slajı-25%-KM",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Mısır Slajı-32-38%-KM",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Mısır Slajı-40%-KM",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Pamuk tohumu küspesi press",
          "TDNClass": "Protein"
        },
        {
          "feed": "Pamuk tohumu kabuğu",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Pamuk tohumu küspesi solvent-41%-CP",
          "TDNClass": "Protein"
        },
        {
          "feed": "Yağ Kalsiyum sabunları",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Yağ bitkisel",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Mera soğuk mevsim bakımlı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır kuru otu soğuk mevsim",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır kuru otu soğuk mevsim körpe",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır kuru otu soğuk mevsim orta olgunluk",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır kuru otu soğuk mevsim olgun",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır slajı soğuk mevsim",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır slajı soğuk mevsim körpe",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır slajı soğuk mevsim orta olgun",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır slajı soğuk mevsim olgun",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı kuru ot körpe-51%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı kuru ot orta olgunluk-51-57%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı kuru ot olgun-57%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj körpe-51%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj orta olgunluk-51-57%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj olgun-57%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı kuru ot körpe-47%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı kuru ot orta olgunluk-47-53%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı kuru ot olgun-53%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj körpe-47%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj orta olgunluk-47-53%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj olgun-47%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj körpe-44%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj orta olgun-44-50%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj olgun-50%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj körpe-44%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj orta olgun-44-50%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çayır baklagil karışımı slaj olgun-50%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Baklagil merası yoğun otlatma",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Baklagil merası",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Baklagil kuru ot körpe-40%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Baklagil kuru ot orta olgunluk-40-46%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Baklagil kuru ot olgun-46%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Baklagil slaj",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Baklagil slaj körpe-40%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Baklagil slaj orta olgun-40-46%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Baklagil slaj olgun-46%-NDF",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Keten tohumu küspesi solvent",
          "TDNClass": "Protein"
        },
        {
          "feed": "Melas (şeker pancarı)",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Melas şeker kamışı",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Yulaf ezmesi",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Yulaf otu başaklı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Yulaf sılajı başaklı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Fıstık küspesi solvent",
          "TDNClass": "Protein"
        },
        {
          "feed": "Patetes yemek artığı",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Pirinç kepeği",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Çeltik slajı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Aspir küspesi solvent",
          "TDNClass": "Protein"
        },
        {
          "feed": "Sorgum kuru ezme",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Sorgum pul haline getirilmiş",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Sorgum sılajı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Sorgum sudan kuru otu",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Sorgum sudan slajı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Soya tohumu kabukları",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Soya küspesi-45%-HP",
          "TDNClass": "Protein"
        },
        {
          "feed": "Soya fasulyesi kahverengileştirilmiş",
          "TDNClass": "Protein"
        },
        {
          "feed": "Soya küspesi-44%-HP",
          "TDNClass": "Protein"
        },
        {
          "feed": "Soya küspesi-48%-HP",
          "TDNClass": "Protein"
        },
        {
          "feed": "Soya tohumu",
          "TDNClass": "Protein"
        },
        {
          "feed": "Tam yağlı soya tohumu",
          "TDNClass": "Protein"
        },
        {
          "feed": "Soya slajı erken olgun",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Ayçiçeği küspesi",
          "TDNClass": "Protein"
        },
        {
          "feed": "Ayçiçeği yağlık tohumları",
          "TDNClass": "Protein"
        },
        {
          "feed": "Domates posası",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Trtitikale silajı başaklı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Buğday kepeği",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Buğday ezmesi",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Buğday otu başaklı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Buğday kepeği razmol",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Buğday slajı başaklı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Buğday samanı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Fiğ Kuru Otu",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Fiğ Kuru Otu, Erken Vejetatif",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Fiğ Kuru Otu, Geç Vejetatif",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Mercimek samanı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Nohut samanı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Yer fıstığı sapı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Buğday samanı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Çavdar slajı Körpe",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Şalgam yaprakları",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Şalgam yaprak,kök",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Tritikale bezelya slajı(APAK)",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Tritikale bezelya slajı",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Ayçiçeği Küspesi, Solvent, %28 HP",
          "TDNClass": "Protein"
        },
        {
          "feed": "Ayçiçeği Küspesi, Solvent, %32 HP",
          "TDNClass": "Protein"
        },
        {
          "feed": "Ayçiçeği küspesi",
          "TDNClass": "Protein"
        },
        {
          "feed": "Ayçiçeği küspesi",
          "TDNClass": "Protein"
        },
        {
          "feed": "Yer Fıstığı Küspesi",
          "TDNClass": "Protein"
        },
        {
          "feed": "Yonca Unu,% 17 HP",
          "TDNClass": "Kaba yem"
        },
        {
          "feed": "Havuç",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Yem Şalgamı",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Tritakale",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Bon Kalite",
          "TDNClass": "Enerji"
        },
        {
          "feed": "Domates kuru",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Ecomass",
          "TDNClass": "Protein"
        },
        {
          "feed": "Havuç Posası , Yaş",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "İncir Kurusu",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Patates Yan Ürünleri",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Üzüm Kurusu",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Üzüm posası",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Zeytin Küspesi, Yağı Tam Alınmamış",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Zeytin Küspesi, Yağı Tam Alınmamış",
          "TDNClass": "Diğer Yem"
        },
        {
          "feed": "Buzağı Başlangıç Yemi",
          "TDNClass": "Karma"
        },
        {
          "feed": "Buzağı Büyütme Yemi",
          "TDNClass": "Karma"
        },
        {
          "feed": "Düve yemi 1. sınıf",
          "TDNClass": "Karma"
        },
        {
          "feed": "Düve yemi 2. sınıf",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Besi Yemi",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,16 HP, 2400 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,16 HP, 2500 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,16 HP, 2600 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,18 HP, 2600 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,18 HP, 2500 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,18 HP, 2400 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,18 HP, 2650 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,19 HP, 2600 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,19 HP, 2700 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,19 HP, 2800 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,20 HP, 2650 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,21 HP, 2650 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,21HP, 2600 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,21 HP, 2700 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,21 HP, 2750 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,21 HP, 2800 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,22 HP, 2750 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,24 HP, 2900 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,24 HP, 3100 ME",
          "TDNClass": "Karma"
        },
        {
          "feed": "Sığır Süt Yemi,25HP, 2550 ME",
          "TDNClass": "Karma"
        }
      ];

    const dataFeedEn =
        [
            {
                "feed": "ALFALFA-Meal-17%-CP",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "ALMOND-Hulls",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "APPLE-Pomace-wet",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "BAKERY-BYPRODUCT-meal",
                "TDNClass": "Enerji"
            },
            {
                "feed": "BAKERY-BYPRODUCT-Bread-waste",
                "TDNClass": "Enerji"
            },
            {
                "feed": "BAKERY-BYPRODUCT-Cereal",
                "TDNClass": "Enerji"
            },
            {
                "feed": "BAKERY-BYPRODUCT-Cookie",
                "TDNClass": "Enerji"
            },
            {
                "feed": "BARLEY-Grain-rolled",
                "TDNClass": "Enerji"
            },
            {
                "feed": "BARLEY-Malt-sprouts",
                "TDNClass": "Enerji"
            },
            {
                "feed": "BARLEY-Silage-headed",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "BEET-SUGAR-Pulp-dried",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "BERMUDA-GRASS-Coastal-hay-early-head",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "BERMUDA-GRASS-Tifton-85-hay-3-4-wk-growth",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "BREWERS-GRAINS-Dried",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "BREWERS-GRAINS-Wet",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "CANOLA-Seed",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CANOLA-Meal-mech-extracted",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CHOCOLATE-Byproduct",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CITRUS-Pulp-dried",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "CORN-Cobs",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "CORN-Distillers-grains-with-solubles-dried",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Gluten-feed-dried",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Gluten-meal-dried",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Grain-cracked-dry",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Grain-ground-dry",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Grain-steam-flaked",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Grain-rolled-high-moisture",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Grain-ground-high-moisture",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Grain-and-cob-dry-ground",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Grain-and-cob-high-moisture",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Hominy",
                "TDNClass": "Enerji"
            },
            {
                "feed": "CORN-Silage-immature-25%-DM",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "CORN-Silage-normal-32-38%-DM",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "CORN-Silage-mature-40%-DM",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "COTTON-SEED-Whole-seeds-with-lint",
                "TDNClass": "Protein"
            },
            {
                "feed": "COTTON-SEED-Hulls",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "COTTON-SEED-Meal-solvent-41%-CP",
                "TDNClass": "Protein"
            },
            {
                "feed": "FATS-OILS-Calcium-soaps",
                "TDNClass": "Enerji"
            },
            {
                "feed": "FATS-OILS-Hydrolyzed-tallow-fatty-acids",
                "TDNClass": "Enerji"
            },
            {
                "feed": "FATS-OILS-Partially-hydrogenated-tallow",
                "TDNClass": "Enerji"
            },
            {
                "feed": "FATS-OILS-Tallow",
                "TDNClass": "Enerji"
            },
            {
                "feed": "FATS-OILS-Vegetable-oil",
                "TDNClass": "Enerji"
            },
            {
                "feed": "FEATHERS-Hydrolyzed-meal",
                "TDNClass": "Protein"
            },
            {
                "feed": "FEATHERS-Hydrolyzed-meal-with-some-viscera",
                "TDNClass": "Protein"
            },
            {
                "feed": "GRASES-COOL-SEASON-Pasture-intensively-managed",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASES-COOL-SEASON-Hay-all-samples",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASES-COOL-SEASON-Hay-immature",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASES-COOL-SEASON-Hay-mid-maturity",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASES-COOL-SEASON-Hay-mature",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASES-COOL-SEASON-Silage-all-samples",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASES-COOL-SEASON-Silage-immature-55%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASES-COOL-SEASON-Silage-mid-maturity",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASES-COOL-SEASON-Silage-mature",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Hay-immature-51%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Hay-mid-maturity-51-57%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Hay-mature-57%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Silage-immature-51%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Silage-mid-maturity-51-57%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Silage-mature-57%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Hay-immature-47%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Hay-mid-maturity-47-53%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Hay-mature-53%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Silage-immature-47%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Silage-mid-maturity-47-53%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Silage-mature-47%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Hay-immature-44%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Hay-mid-maturity-44-50%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Hay-mature-50%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Silage-immature-44%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Silage-mid-maturity-44-50%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "GRASS-LEGUME-MIXTURES-Silage-mature-50%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "LEGUMES-FORAGE-Pasture-intensively-managed",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "LEGUMES-FORAGE-Hay-all-samples",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "LEGUMES-FORAGE-Hay-immature-40%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "LEGUMES-FORAGE-Hay-mid-maturity-40-46%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "LEGUMES-FORAGE-Hay-mature-46%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "LEGUMES-FORAGE-Silage-all-samples",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "LEGUMES-FORAGE-Silage-immature-40%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "LEGUMES-FORAGE-Silage-mid-maturity-40-46%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "LEGUMES-FORAGE-Silage-mature-46%-NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "LINSEED-meal-solvent",
                "TDNClass": "Protein"
            },
            {
                "feed": "MOLASES-Beet-sugar",
                "TDNClass": "Enerji"
            },
            {
                "feed": "MOLASES-Sugarcane",
                "TDNClass": "Enerji"
            },
            {
                "feed": "OATS-Grain-rolled",
                "TDNClass": "Enerji"
            },
            {
                "feed": "OATS-Hay-headed",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "OATS-Silage-headed",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "PEANUT-Meal-solvent",
                "TDNClass": "Protein"
            },
            {
                "feed": "POTATO-Byproduct-meal",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "RICE-Bran",
                "TDNClass": "Enerji"
            },
            {
                "feed": "RYE-ANNUAL-Silage-vegetative",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "SAFFLOWER-Meal-solvent",
                "TDNClass": "Protein"
            },
            {
                "feed": "SORGHUM-GRAIN-TYPE-Grain-dry-rolled",
                "TDNClass": "Enerji"
            },
            {
                "feed": "SORGHUM-GRAIN-TYPE-Grain-steam-flaked",
                "TDNClass": "Enerji"
            },
            {
                "feed": "SORGHUM-GRAIN-TYPE-Silage",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "SORGHUM-SUDAN-TYPE-Hay",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "SORGHUM-SUDAN-TYPE-Silage",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "SOYBEAN-Hulls",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "SOYBEAN-Meal-expellers-45%-CP",
                "TDNClass": "Protein"
            },
            {
                "feed": "SOYBEAN-Meal-nonenzymatically-browned",
                "TDNClass": "Protein"
            },
            {
                "feed": "SOYBEAN-Meal-solvent-44%-CP",
                "TDNClass": "Protein"
            },
            {
                "feed": "SOYBEAN-Meal-solvent-48%-CP",
                "TDNClass": "Protein"
            },
            {
                "feed": "SOYBEAN-Seeds-whole",
                "TDNClass": "Enerji"
            },
            {
                "feed": "SOYBEAN-Seeds-whole-roasted",
                "TDNClass": "Enerji"
            },
            {
                "feed": "SOYBEAN-Silage-early-maturity",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "SUNFLOWER-Meal-solvent",
                "TDNClass": "Protein"
            },
            {
                "feed": "SUNFLOWER-Oil-seeds-whole",
                "TDNClass": "Enerji"
            },
            {
                "feed": "TOMATO-Pomace",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "TRITICALE-Silage-headed",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "WHEAT-Bran",
                "TDNClass": "Enerji"
            },
            {
                "feed": "WHEAT-Grain-rolled",
                "TDNClass": "Enerji"
            },
            {
                "feed": "WHEAT-Hay-headed",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "WHEAT-Middlings",
                "TDNClass": "Enerji"
            },
            {
                "feed": "WHEAT-Silage-early-head",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "WHEAT-Straw",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "WHEY-Wet-cattle",
                "TDNClass": "Diğer Yem"
            },
            {
                "feed": "Dairy Compound Feed,16 HP, 2400 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,16 HP, 2500 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,16 HP, 2600 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,18 HP, 2600 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,18 HP, 2500 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,18 HP, 2400 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,18 HP, 2650 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,19 HP, 2600 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,19 HP, 2700 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,19 HP, 2800 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,20 HP, 2650 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,21 HP, 2650 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,21HP, 2600 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,21 HP, 2700 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,21 HP, 2750 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,21 HP, 2800 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,22 HP, 2750 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,24 HP, 2900 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,24 HP, 3100 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "Dairy Compound Feed,25HP, 2550 ME",
                "TDNClass": "Karma"
            },
            {
                "feed": "ALFALFA, 1. Quality >%21 HP,     <%37 NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "ALFALFA, 2. Quality >%19 HP,     <%37-40 NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "ALFALFA, 3. Quality >%16 HP,     <%44-48 NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "ALFALFA, 4. Quality >%14 HP,     <%48-54 NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "ALFALFA, 5. Quality >%13 HP,     >%54 NDF",
                "TDNClass": "Kaba yem"
            },
            {
                "feed": "ALFALFA, 6. Quality <%11 HP,     >%54 NDF",
                "TDNClass": "Kaba yem"
            }
        ];

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules/svelte-simple-modal/src/Modal.svelte generated by Svelte v3.55.0 */

    const { Object: Object_1, window: window_1 } = globals;
    const file$3 = "node_modules/svelte-simple-modal/src/Modal.svelte";

    // (469:0) {#if Component}
    function create_if_block(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div0_class_value;
    	let div1_class_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let div1_transition;
    	let div2_class_value;
    	let div3_id_value;
    	let div3_class_value;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[1].closeButton && create_if_block_1(ctx);
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-n7cvum"));
    			attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			add_location(div0, file$3, 514, 8, 14163);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-n7cvum"));
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null);
    			attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			add_location(div1, file$3, 485, 6, 13188);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-n7cvum"));
    			attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			add_location(div2, file$3, 479, 4, 13055);
    			attr_dev(div3, "id", div3_id_value = /*state*/ ctx[1].id);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-n7cvum"));
    			attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			add_location(div3, file$3, 469, 2, 12791);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			if (switch_instance) mount_component(switch_instance, div0, null);
    			/*div1_binding*/ ctx[50](div1);
    			/*div2_binding*/ ctx[51](div2);
    			/*div3_binding*/ ctx[52](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[13])) /*onOpen*/ ctx[13].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[14])) /*onClose*/ ctx[14].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[15])) /*onOpened*/ ctx[15].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[16])) /*onClosed*/ ctx[16].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*handleOuterMousedown*/ ctx[20], false, false, false),
    					listen_dev(div3, "mouseup", /*handleOuterMouseup*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[1].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-n7cvum"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*cssContent*/ 512) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			}

    			if (!current || dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-n7cvum"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_label_value !== (div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null)) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 256) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-n7cvum"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*cssWindowWrap*/ 128) {
    				attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div3_id_value !== (div3_id_value = /*state*/ ctx[1].id)) {
    				attr_dev(div3, "id", div3_id_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-n7cvum"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 64) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[50](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[51](null);
    			/*div3_binding*/ ctx[52](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(469:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (501:8) {#if state.closeButton}
    function create_if_block_1(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*state*/ 2) show_if = null;
    		if (show_if == null) show_if = !!/*isFunction*/ ctx[17](/*state*/ ctx[1].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(501:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (504:10) {:else}
    function create_else_block(ctx) {
    	let button;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-n7cvum"));
    			attr_dev(button, "aria-label", "Close modal");
    			attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			attr_dev(button, "type", "button");
    			toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			add_location(button, file$3, 504, 12, 13884);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-n7cvum"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*cssCloseButton*/ 1024) {
    				attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(504:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (502:10) {#if isFunction(state.closeButton)}
    function create_if_block_2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[1].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[18] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[1].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(502:10) {#if isFunction(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[2] && create_if_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[49].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[48], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[48],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[48])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[48], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function bind(Component, props = {}) {
    	return function ModalComponent(options) {
    		return new Component({
    				...options,
    				props: { ...props, ...options.props }
    			});
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const baseSetContext = setContext;

    	/**
     * A basic function that checks if a node is tabbale
     */
    	const baseIsTabbable = node => node.tabIndex >= 0 && !node.hidden && !node.disabled && node.style.display !== 'none' && node.type !== 'hidden' && Boolean(node.offsetWidth || node.offsetHeight || node.getClientRects().length);

    	let { isTabbable = baseIsTabbable } = $$props;
    	let { show = null } = $$props;
    	let { id = null } = $$props;
    	let { key = 'simple-modal' } = $$props;
    	let { ariaLabel = null } = $$props;
    	let { ariaLabelledBy = null } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = {} } = $$props;
    	let { styleWindowWrap = {} } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { classBg = null } = $$props;
    	let { classWindowWrap = null } = $$props;
    	let { classWindow = null } = $$props;
    	let { classContent = null } = $$props;
    	let { classCloseButton = null } = $$props;
    	let { unstyled = false } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;
    	let { disableFocusTrap = false } = $$props;

    	const defaultState = {
    		id,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isTabbable,
    		unstyled
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	let scrollY;
    	let cssBg;
    	let cssWindowWrap;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;
    	let prevBodyPosition;
    	let prevBodyOverflow;
    	let prevBodyWidth;
    	let outerClickTarget;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

    	const toCssString = props => props
    	? Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, '')
    	: '';

    	const isFunction = f => !!(f && f.constructor && f.call && f.apply);

    	const updateStyleTransition = () => {
    		$$invalidate(6, cssBg = toCssString(Object.assign(
    			{},
    			{
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			state.styleBg
    		)));

    		$$invalidate(7, cssWindowWrap = toCssString(state.styleWindowWrap));
    		$$invalidate(8, cssWindow = toCssString(state.styleWindow));
    		$$invalidate(9, cssContent = toCssString(state.styleContent));
    		$$invalidate(10, cssCloseButton = toCssString(state.styleCloseButton));
    		$$invalidate(11, currentTransitionBg = state.transitionBg);
    		$$invalidate(12, currentTransitionWindow = state.transitionWindow);
    	};

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	/**
     * Open a modal.
     * @description Calling this method will close the modal. Additionally, it
     * allows to specify onClose and onClosed event handlers.`
     * @type {Open}
     */
    	const open = (NewComponent, newProps = {}, options = {}, callbacks = {}) => {
    		$$invalidate(2, Component = bind(NewComponent, newProps));
    		$$invalidate(1, state = { ...defaultState, ...options });
    		updateStyleTransition();
    		disableScroll();

    		$$invalidate(13, onOpen = event => {
    			if (callbacks.onOpen) callbacks.onOpen(event);

    			/**
     * The open event is fired right before the modal opens
     * @event {void} open
     */
    			dispatch('open');

    			/**
     * The opening event is fired right before the modal opens
     * @event {void} opening
     * @deprecated Listen to the `open` event instead
     */
    			dispatch('opening'); // Deprecated. Do not use!
    		});

    		$$invalidate(14, onClose = event => {
    			if (callbacks.onClose) callbacks.onClose(event);

    			/**
     * The close event is fired right before the modal closes
     * @event {void} close
     */
    			dispatch('close');

    			/**
     * The closing event is fired right before the modal closes
     * @event {void} closing
     * @deprecated Listen to the `close` event instead
     */
    			dispatch('closing'); // Deprecated. Do not use!
    		});

    		$$invalidate(15, onOpened = event => {
    			if (callbacks.onOpened) callbacks.onOpened(event);

    			/**
     * The opened event is fired after the modal's opening transition
     * @event {void} opened
     */
    			dispatch('opened');
    		});

    		$$invalidate(16, onClosed = event => {
    			if (callbacks.onClosed) callbacks.onClosed(event);

    			/**
     * The closed event is fired after the modal's closing transition
     * @event {void} closed
     */
    			dispatch('closed');
    		});
    	};

    	/**
     * Close the modal.
     * @description Calling this method will close the modal. Additionally, it
     * allows to specify onClose and onClosed event handlers.`
     * @type {Close}
     */
    	const close = (callbacks = {}) => {
    		if (!Component) return;
    		$$invalidate(14, onClose = callbacks.onClose || onClose);
    		$$invalidate(16, onClosed = callbacks.onClosed || onClosed);
    		$$invalidate(2, Component = null);
    		enableScroll();
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === 'Escape') {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === 'Tab' && !state.disableFocusTrap) {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll('*');

    			const tabbable = Array.from(nodes).filter(state.isTabbable).sort((a, b) => a.tabIndex - b.tabIndex);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterMousedown = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) outerClickTarget = event.target;
    	};

    	const handleOuterMouseup = event => {
    		if (state.closeOnOuterClick && event.target === outerClickTarget) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const disableScroll = () => {
    		scrollY = window.scrollY;
    		prevBodyPosition = document.body.style.position;
    		prevBodyOverflow = document.body.style.overflow;
    		prevBodyWidth = document.body.style.width;
    		document.body.style.position = 'fixed';
    		document.body.style.top = `-${scrollY}px`;
    		document.body.style.overflow = 'hidden';
    		document.body.style.width = '100%';
    	};

    	const enableScroll = () => {
    		document.body.style.position = prevBodyPosition || '';
    		document.body.style.top = '';
    		document.body.style.overflow = prevBodyOverflow || '';
    		document.body.style.width = prevBodyWidth || '';

    		window.scrollTo({
    			top: scrollY,
    			left: 0,
    			behavior: 'instant'
    		});
    	};

    	/**
     * The exposed context methods: open() and close()
     * @type {Context}
     */
    	const context = { open, close };

    	setContext$1(key, context);
    	let isMounted = false;

    	onDestroy(() => {
    		if (isMounted) close();
    	});

    	onMount(() => {
    		$$invalidate(47, isMounted = true);
    	});

    	const writable_props = [
    		'isTabbable',
    		'show',
    		'id',
    		'key',
    		'ariaLabel',
    		'ariaLabelledBy',
    		'closeButton',
    		'closeOnEsc',
    		'closeOnOuterClick',
    		'styleBg',
    		'styleWindowWrap',
    		'styleWindow',
    		'styleContent',
    		'styleCloseButton',
    		'classBg',
    		'classWindowWrap',
    		'classWindow',
    		'classContent',
    		'classCloseButton',
    		'unstyled',
    		'setContext',
    		'transitionBg',
    		'transitionBgProps',
    		'transitionWindow',
    		'transitionWindowProps',
    		'disableFocusTrap'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modalWindow = $$value;
    			$$invalidate(5, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isTabbable' in $$props) $$invalidate(22, isTabbable = $$props.isTabbable);
    		if ('show' in $$props) $$invalidate(23, show = $$props.show);
    		if ('id' in $$props) $$invalidate(24, id = $$props.id);
    		if ('key' in $$props) $$invalidate(25, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(26, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(27, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(28, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(29, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(30, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(31, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(32, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(33, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(34, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(35, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(36, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(37, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(38, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(39, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(40, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(41, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(42, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(43, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(44, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(45, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(46, disableFocusTrap = $$props.disableFocusTrap);
    		if ('$$scope' in $$props) $$invalidate(48, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		bind,
    		svelte,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		baseSetContext,
    		baseIsTabbable,
    		isTabbable,
    		show,
    		id,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		unstyled,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		defaultState,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		scrollY,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		prevBodyPosition,
    		prevBodyOverflow,
    		prevBodyWidth,
    		outerClickTarget,
    		camelCaseToDash,
    		toCssString,
    		isFunction,
    		updateStyleTransition,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		disableScroll,
    		enableScroll,
    		context,
    		isMounted
    	});

    	$$self.$inject_state = $$props => {
    		if ('isTabbable' in $$props) $$invalidate(22, isTabbable = $$props.isTabbable);
    		if ('show' in $$props) $$invalidate(23, show = $$props.show);
    		if ('id' in $$props) $$invalidate(24, id = $$props.id);
    		if ('key' in $$props) $$invalidate(25, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(26, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(27, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(28, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(29, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(30, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(31, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(32, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(33, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(34, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(35, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(36, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(37, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(38, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(39, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(40, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(41, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(42, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(43, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(44, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(45, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(46, disableFocusTrap = $$props.disableFocusTrap);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('background' in $$props) $$invalidate(3, background = $$props.background);
    		if ('wrap' in $$props) $$invalidate(4, wrap = $$props.wrap);
    		if ('modalWindow' in $$props) $$invalidate(5, modalWindow = $$props.modalWindow);
    		if ('scrollY' in $$props) scrollY = $$props.scrollY;
    		if ('cssBg' in $$props) $$invalidate(6, cssBg = $$props.cssBg);
    		if ('cssWindowWrap' in $$props) $$invalidate(7, cssWindowWrap = $$props.cssWindowWrap);
    		if ('cssWindow' in $$props) $$invalidate(8, cssWindow = $$props.cssWindow);
    		if ('cssContent' in $$props) $$invalidate(9, cssContent = $$props.cssContent);
    		if ('cssCloseButton' in $$props) $$invalidate(10, cssCloseButton = $$props.cssCloseButton);
    		if ('currentTransitionBg' in $$props) $$invalidate(11, currentTransitionBg = $$props.currentTransitionBg);
    		if ('currentTransitionWindow' in $$props) $$invalidate(12, currentTransitionWindow = $$props.currentTransitionWindow);
    		if ('prevBodyPosition' in $$props) prevBodyPosition = $$props.prevBodyPosition;
    		if ('prevBodyOverflow' in $$props) prevBodyOverflow = $$props.prevBodyOverflow;
    		if ('prevBodyWidth' in $$props) prevBodyWidth = $$props.prevBodyWidth;
    		if ('outerClickTarget' in $$props) outerClickTarget = $$props.outerClickTarget;
    		if ('onOpen' in $$props) $$invalidate(13, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(14, onClose = $$props.onClose);
    		if ('onOpened' in $$props) $$invalidate(15, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(16, onClosed = $$props.onClosed);
    		if ('isMounted' in $$props) $$invalidate(47, isMounted = $$props.isMounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*show*/ 8388608 | $$self.$$.dirty[1] & /*isMounted*/ 65536) {
    			{
    				if (isMounted) {
    					if (isFunction(show)) {
    						open(show);
    					} else {
    						close();
    					}
    				}
    			}
    		}
    	};

    	return [
    		unstyled,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		isFunction,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		isTabbable,
    		show,
    		id,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isMounted,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				isTabbable: 22,
    				show: 23,
    				id: 24,
    				key: 25,
    				ariaLabel: 26,
    				ariaLabelledBy: 27,
    				closeButton: 28,
    				closeOnEsc: 29,
    				closeOnOuterClick: 30,
    				styleBg: 31,
    				styleWindowWrap: 32,
    				styleWindow: 33,
    				styleContent: 34,
    				styleCloseButton: 35,
    				classBg: 36,
    				classWindowWrap: 37,
    				classWindow: 38,
    				classContent: 39,
    				classCloseButton: 40,
    				unstyled: 0,
    				setContext: 41,
    				transitionBg: 42,
    				transitionBgProps: 43,
    				transitionWindow: 44,
    				transitionWindowProps: 45,
    				disableFocusTrap: 46
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get isTabbable() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isTabbable(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unstyled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unstyled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableFocusTrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableFocusTrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Popup.svelte generated by Svelte v3.55.0 */

    const file$2 = "src/Popup.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (7:4) {#each feeds as feed, i}
    function create_each_block(ctx) {
    	let p;
    	let t0_value = /*feed*/ ctx[2] + "";
    	let t0;
    	let t1;
    	let t2_value = /*masses*/ ctx[1][/*i*/ ctx[4]] + "";
    	let t2;
    	let t3;
    	let br;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = text(": ");
    			t2 = text(t2_value);
    			t3 = space();
    			br = element("br");
    			add_location(p, file$2, 7, 4, 105);
    			add_location(br, file$2, 8, 4, 137);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*feeds*/ 1 && t0_value !== (t0_value = /*feed*/ ctx[2] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*masses*/ 2 && t2_value !== (t2_value = /*masses*/ ctx[1][/*i*/ ctx[4]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(7:4) {#each feeds as feed, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let each_value = /*feeds*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(main, file$2, 5, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*masses, feeds*/ 3) {
    				each_value = /*feeds*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(main, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Popup', slots, []);
    	let { feeds } = $$props;
    	let { masses } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (feeds === undefined && !('feeds' in $$props || $$self.$$.bound[$$self.$$.props['feeds']])) {
    			console.warn("<Popup> was created without expected prop 'feeds'");
    		}

    		if (masses === undefined && !('masses' in $$props || $$self.$$.bound[$$self.$$.props['masses']])) {
    			console.warn("<Popup> was created without expected prop 'masses'");
    		}
    	});

    	const writable_props = ['feeds', 'masses'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Popup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('feeds' in $$props) $$invalidate(0, feeds = $$props.feeds);
    		if ('masses' in $$props) $$invalidate(1, masses = $$props.masses);
    	};

    	$$self.$capture_state = () => ({ feeds, masses });

    	$$self.$inject_state = $$props => {
    		if ('feeds' in $$props) $$invalidate(0, feeds = $$props.feeds);
    		if ('masses' in $$props) $$invalidate(1, masses = $$props.masses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [feeds, masses];
    }

    class Popup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { feeds: 0, masses: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Popup",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get feeds() {
    		throw new Error("<Popup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set feeds(value) {
    		throw new Error("<Popup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get masses() {
    		throw new Error("<Popup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set masses(value) {
    		throw new Error("<Popup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Warning.svelte generated by Svelte v3.55.0 */

    const file$1 = "src/Warning.svelte";

    function create_fragment$2(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*message*/ ctx[0]);
    			add_location(p, file$1, 4, 0, 44);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 1) set_data_dev(t, /*message*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Warning', slots, []);
    	let { message } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (message === undefined && !('message' in $$props || $$self.$$.bound[$$self.$$.props['message']])) {
    			console.warn("<Warning> was created without expected prop 'message'");
    		}
    	});

    	const writable_props = ['message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Warning> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ message });

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message];
    }

    class Warning extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { message: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Warning",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get message() {
    		throw new Error("<Warning>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Warning>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Page2.svelte generated by Svelte v3.55.0 */

    const { console: console_1$1 } = globals;
    const file = "src/Page2.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let h1;
    	let t0_value = /*$t*/ ctx[21]("homepage.title") + "";
    	let t0;
    	let t1;
    	let form_1;
    	let multiselectcustom0;
    	let updating_selected;
    	let updating_prices;
    	let updating_minVals;
    	let updating_maxVals;
    	let t2;
    	let multiselectcustom1;
    	let updating_selected_1;
    	let updating_prices_1;
    	let updating_minVals_1;
    	let updating_maxVals_1;
    	let t3;
    	let multiselectcustom2;
    	let updating_selected_2;
    	let updating_prices_2;
    	let updating_minVals_2;
    	let updating_maxVals_2;
    	let t4;
    	let multiselectcustom3;
    	let updating_selected_3;
    	let updating_prices_3;
    	let updating_minVals_3;
    	let updating_maxVals_3;
    	let t5;
    	let multiselectcustom4;
    	let updating_selected_4;
    	let updating_prices_4;
    	let updating_minVals_4;
    	let updating_maxVals_4;
    	let t6;
    	let br0;
    	let t7;
    	let br1;
    	let t8;
    	let button0;
    	let t9_value = /*$t*/ ctx[21]("button.back") + "";
    	let t9;
    	let t10;
    	let button1;
    	let t11_value = /*$t*/ ctx[21]("button.calculate") + "";
    	let t11;
    	let t12;
    	let modal_1;
    	let current;
    	let mounted;
    	let dispose;

    	function multiselectcustom0_selected_binding(value) {
    		/*multiselectcustom0_selected_binding*/ ctx[36](value);
    	}

    	function multiselectcustom0_prices_binding(value) {
    		/*multiselectcustom0_prices_binding*/ ctx[37](value);
    	}

    	function multiselectcustom0_minVals_binding(value) {
    		/*multiselectcustom0_minVals_binding*/ ctx[38](value);
    	}

    	function multiselectcustom0_maxVals_binding(value) {
    		/*multiselectcustom0_maxVals_binding*/ ctx[39](value);
    	}

    	let multiselectcustom0_props = {
    		typeOfFeed: /*$t*/ ctx[21]("feed.forage"),
    		optionsForMultiSelect: /*multiSelectOptionsKaba*/ ctx[27],
    		minNumOfSel: 1,
    		maxNumOfSel: -1
    	};

    	if (/*selectedKaba*/ ctx[1] !== void 0) {
    		multiselectcustom0_props.selected = /*selectedKaba*/ ctx[1];
    	}

    	if (/*pricesKaba*/ ctx[2] !== void 0) {
    		multiselectcustom0_props.prices = /*pricesKaba*/ ctx[2];
    	}

    	if (/*minValsKaba*/ ctx[3] !== void 0) {
    		multiselectcustom0_props.minVals = /*minValsKaba*/ ctx[3];
    	}

    	if (/*maxValsKaba*/ ctx[4] !== void 0) {
    		multiselectcustom0_props.maxVals = /*maxValsKaba*/ ctx[4];
    	}

    	multiselectcustom0 = new MultiSelectCustom({
    			props: multiselectcustom0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind$1(multiselectcustom0, 'selected', multiselectcustom0_selected_binding, /*selectedKaba*/ ctx[1]));
    	binding_callbacks.push(() => bind$1(multiselectcustom0, 'prices', multiselectcustom0_prices_binding, /*pricesKaba*/ ctx[2]));
    	binding_callbacks.push(() => bind$1(multiselectcustom0, 'minVals', multiselectcustom0_minVals_binding, /*minValsKaba*/ ctx[3]));
    	binding_callbacks.push(() => bind$1(multiselectcustom0, 'maxVals', multiselectcustom0_maxVals_binding, /*maxValsKaba*/ ctx[4]));

    	function multiselectcustom1_selected_binding(value) {
    		/*multiselectcustom1_selected_binding*/ ctx[40](value);
    	}

    	function multiselectcustom1_prices_binding(value) {
    		/*multiselectcustom1_prices_binding*/ ctx[41](value);
    	}

    	function multiselectcustom1_minVals_binding(value) {
    		/*multiselectcustom1_minVals_binding*/ ctx[42](value);
    	}

    	function multiselectcustom1_maxVals_binding(value) {
    		/*multiselectcustom1_maxVals_binding*/ ctx[43](value);
    	}

    	let multiselectcustom1_props = {
    		typeOfFeed: /*$t*/ ctx[21]("feed.mixed"),
    		optionsForMultiSelect: /*multiSelectOptionsKarma*/ ctx[31],
    		minNumOfSel: 0,
    		maxNumOfSel: -1
    	};

    	if (/*selectedKarma*/ ctx[17] !== void 0) {
    		multiselectcustom1_props.selected = /*selectedKarma*/ ctx[17];
    	}

    	if (/*pricesKarma*/ ctx[18] !== void 0) {
    		multiselectcustom1_props.prices = /*pricesKarma*/ ctx[18];
    	}

    	if (/*minValsKarma*/ ctx[19] !== void 0) {
    		multiselectcustom1_props.minVals = /*minValsKarma*/ ctx[19];
    	}

    	if (/*maxValsKarma*/ ctx[20] !== void 0) {
    		multiselectcustom1_props.maxVals = /*maxValsKarma*/ ctx[20];
    	}

    	multiselectcustom1 = new MultiSelectCustom({
    			props: multiselectcustom1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind$1(multiselectcustom1, 'selected', multiselectcustom1_selected_binding, /*selectedKarma*/ ctx[17]));
    	binding_callbacks.push(() => bind$1(multiselectcustom1, 'prices', multiselectcustom1_prices_binding, /*pricesKarma*/ ctx[18]));
    	binding_callbacks.push(() => bind$1(multiselectcustom1, 'minVals', multiselectcustom1_minVals_binding, /*minValsKarma*/ ctx[19]));
    	binding_callbacks.push(() => bind$1(multiselectcustom1, 'maxVals', multiselectcustom1_maxVals_binding, /*maxValsKarma*/ ctx[20]));

    	function multiselectcustom2_selected_binding(value) {
    		/*multiselectcustom2_selected_binding*/ ctx[44](value);
    	}

    	function multiselectcustom2_prices_binding(value) {
    		/*multiselectcustom2_prices_binding*/ ctx[45](value);
    	}

    	function multiselectcustom2_minVals_binding(value) {
    		/*multiselectcustom2_minVals_binding*/ ctx[46](value);
    	}

    	function multiselectcustom2_maxVals_binding(value) {
    		/*multiselectcustom2_maxVals_binding*/ ctx[47](value);
    	}

    	let multiselectcustom2_props = {
    		typeOfFeed: /*$t*/ ctx[21]("feed.energy"),
    		optionsForMultiSelect: /*multiSelectOptionsEnerji*/ ctx[29],
    		minNumOfSel: 0,
    		maxNumOfSel: -1
    	};

    	if (/*selectedEnerji*/ ctx[9] !== void 0) {
    		multiselectcustom2_props.selected = /*selectedEnerji*/ ctx[9];
    	}

    	if (/*pricesEnerji*/ ctx[10] !== void 0) {
    		multiselectcustom2_props.prices = /*pricesEnerji*/ ctx[10];
    	}

    	if (/*minValsEnerji*/ ctx[11] !== void 0) {
    		multiselectcustom2_props.minVals = /*minValsEnerji*/ ctx[11];
    	}

    	if (/*maxValsEnerji*/ ctx[12] !== void 0) {
    		multiselectcustom2_props.maxVals = /*maxValsEnerji*/ ctx[12];
    	}

    	multiselectcustom2 = new MultiSelectCustom({
    			props: multiselectcustom2_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind$1(multiselectcustom2, 'selected', multiselectcustom2_selected_binding, /*selectedEnerji*/ ctx[9]));
    	binding_callbacks.push(() => bind$1(multiselectcustom2, 'prices', multiselectcustom2_prices_binding, /*pricesEnerji*/ ctx[10]));
    	binding_callbacks.push(() => bind$1(multiselectcustom2, 'minVals', multiselectcustom2_minVals_binding, /*minValsEnerji*/ ctx[11]));
    	binding_callbacks.push(() => bind$1(multiselectcustom2, 'maxVals', multiselectcustom2_maxVals_binding, /*maxValsEnerji*/ ctx[12]));

    	function multiselectcustom3_selected_binding(value) {
    		/*multiselectcustom3_selected_binding*/ ctx[48](value);
    	}

    	function multiselectcustom3_prices_binding(value) {
    		/*multiselectcustom3_prices_binding*/ ctx[49](value);
    	}

    	function multiselectcustom3_minVals_binding(value) {
    		/*multiselectcustom3_minVals_binding*/ ctx[50](value);
    	}

    	function multiselectcustom3_maxVals_binding(value) {
    		/*multiselectcustom3_maxVals_binding*/ ctx[51](value);
    	}

    	let multiselectcustom3_props = {
    		typeOfFeed: /*$t*/ ctx[21]("feed.protein"),
    		optionsForMultiSelect: /*multiSelectOptionsProtein*/ ctx[30],
    		minNumOfSel: 0,
    		maxNumOfSel: -1
    	};

    	if (/*selectedProtein*/ ctx[13] !== void 0) {
    		multiselectcustom3_props.selected = /*selectedProtein*/ ctx[13];
    	}

    	if (/*pricesProtein*/ ctx[14] !== void 0) {
    		multiselectcustom3_props.prices = /*pricesProtein*/ ctx[14];
    	}

    	if (/*minValsProtein*/ ctx[15] !== void 0) {
    		multiselectcustom3_props.minVals = /*minValsProtein*/ ctx[15];
    	}

    	if (/*maxValsProtein*/ ctx[16] !== void 0) {
    		multiselectcustom3_props.maxVals = /*maxValsProtein*/ ctx[16];
    	}

    	multiselectcustom3 = new MultiSelectCustom({
    			props: multiselectcustom3_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind$1(multiselectcustom3, 'selected', multiselectcustom3_selected_binding, /*selectedProtein*/ ctx[13]));
    	binding_callbacks.push(() => bind$1(multiselectcustom3, 'prices', multiselectcustom3_prices_binding, /*pricesProtein*/ ctx[14]));
    	binding_callbacks.push(() => bind$1(multiselectcustom3, 'minVals', multiselectcustom3_minVals_binding, /*minValsProtein*/ ctx[15]));
    	binding_callbacks.push(() => bind$1(multiselectcustom3, 'maxVals', multiselectcustom3_maxVals_binding, /*maxValsProtein*/ ctx[16]));

    	function multiselectcustom4_selected_binding(value) {
    		/*multiselectcustom4_selected_binding*/ ctx[52](value);
    	}

    	function multiselectcustom4_prices_binding(value) {
    		/*multiselectcustom4_prices_binding*/ ctx[53](value);
    	}

    	function multiselectcustom4_minVals_binding(value) {
    		/*multiselectcustom4_minVals_binding*/ ctx[54](value);
    	}

    	function multiselectcustom4_maxVals_binding(value) {
    		/*multiselectcustom4_maxVals_binding*/ ctx[55](value);
    	}

    	let multiselectcustom4_props = {
    		typeOfFeed: /*$t*/ ctx[21]("feed.other"),
    		optionsForMultiSelect: /*multiSelectOptionsDiger*/ ctx[28],
    		minNumOfSel: 0,
    		maxNumOfSel: 3
    	};

    	if (/*selectedDiger*/ ctx[5] !== void 0) {
    		multiselectcustom4_props.selected = /*selectedDiger*/ ctx[5];
    	}

    	if (/*pricesDiger*/ ctx[6] !== void 0) {
    		multiselectcustom4_props.prices = /*pricesDiger*/ ctx[6];
    	}

    	if (/*minValsDiger*/ ctx[7] !== void 0) {
    		multiselectcustom4_props.minVals = /*minValsDiger*/ ctx[7];
    	}

    	if (/*maxValsDiger*/ ctx[8] !== void 0) {
    		multiselectcustom4_props.maxVals = /*maxValsDiger*/ ctx[8];
    	}

    	multiselectcustom4 = new MultiSelectCustom({
    			props: multiselectcustom4_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind$1(multiselectcustom4, 'selected', multiselectcustom4_selected_binding, /*selectedDiger*/ ctx[5]));
    	binding_callbacks.push(() => bind$1(multiselectcustom4, 'prices', multiselectcustom4_prices_binding, /*pricesDiger*/ ctx[6]));
    	binding_callbacks.push(() => bind$1(multiselectcustom4, 'minVals', multiselectcustom4_minVals_binding, /*minValsDiger*/ ctx[7]));
    	binding_callbacks.push(() => bind$1(multiselectcustom4, 'maxVals', multiselectcustom4_maxVals_binding, /*maxValsDiger*/ ctx[8]));

    	modal_1 = new Modal({
    			props: { show: /*$modal*/ ctx[23] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			form_1 = element("form");
    			create_component(multiselectcustom0.$$.fragment);
    			t2 = space();
    			create_component(multiselectcustom1.$$.fragment);
    			t3 = space();
    			create_component(multiselectcustom2.$$.fragment);
    			t4 = space();
    			create_component(multiselectcustom3.$$.fragment);
    			t5 = space();
    			create_component(multiselectcustom4.$$.fragment);
    			t6 = space();
    			br0 = element("br");
    			t7 = space();
    			br1 = element("br");
    			t8 = space();
    			button0 = element("button");
    			t9 = text(t9_value);
    			t10 = space();
    			button1 = element("button");
    			t11 = text(t11_value);
    			t12 = space();
    			create_component(modal_1.$$.fragment);
    			attr_dev(h1, "class", "svelte-1tky8bj");
    			add_location(h1, file, 87, 1, 3300);
    			add_location(br0, file, 143, 2, 4733);
    			add_location(br1, file, 144, 2, 4742);
    			attr_dev(button0, "type", "button");
    			add_location(button0, file, 145, 2, 4751);
    			attr_dev(button1, "type", "button");
    			add_location(button1, file, 146, 2, 4835);
    			add_location(form_1, file, 88, 1, 3333);
    			attr_dev(main, "class", "svelte-1tky8bj");
    			add_location(main, file, 86, 0, 3292);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, form_1);
    			mount_component(multiselectcustom0, form_1, null);
    			append_dev(form_1, t2);
    			mount_component(multiselectcustom1, form_1, null);
    			append_dev(form_1, t3);
    			mount_component(multiselectcustom2, form_1, null);
    			append_dev(form_1, t4);
    			mount_component(multiselectcustom3, form_1, null);
    			append_dev(form_1, t5);
    			mount_component(multiselectcustom4, form_1, null);
    			append_dev(form_1, t6);
    			append_dev(form_1, br0);
    			append_dev(form_1, t7);
    			append_dev(form_1, br1);
    			append_dev(form_1, t8);
    			append_dev(form_1, button0);
    			append_dev(button0, t9);
    			append_dev(form_1, t10);
    			append_dev(form_1, button1);
    			append_dev(button1, t11);
    			append_dev(main, t12);
    			mount_component(modal_1, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[56], false, false, false),
    					listen_dev(button1, "click", /*denemeFunc*/ ctx[32], false, false, false),
    					action_destroyer(/*form*/ ctx[25].call(null, form_1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*$t*/ 2097152) && t0_value !== (t0_value = /*$t*/ ctx[21]("homepage.title") + "")) set_data_dev(t0, t0_value);
    			const multiselectcustom0_changes = {};
    			if (dirty[0] & /*$t*/ 2097152) multiselectcustom0_changes.typeOfFeed = /*$t*/ ctx[21]("feed.forage");

    			if (!updating_selected && dirty[0] & /*selectedKaba*/ 2) {
    				updating_selected = true;
    				multiselectcustom0_changes.selected = /*selectedKaba*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
    			}

    			if (!updating_prices && dirty[0] & /*pricesKaba*/ 4) {
    				updating_prices = true;
    				multiselectcustom0_changes.prices = /*pricesKaba*/ ctx[2];
    				add_flush_callback(() => updating_prices = false);
    			}

    			if (!updating_minVals && dirty[0] & /*minValsKaba*/ 8) {
    				updating_minVals = true;
    				multiselectcustom0_changes.minVals = /*minValsKaba*/ ctx[3];
    				add_flush_callback(() => updating_minVals = false);
    			}

    			if (!updating_maxVals && dirty[0] & /*maxValsKaba*/ 16) {
    				updating_maxVals = true;
    				multiselectcustom0_changes.maxVals = /*maxValsKaba*/ ctx[4];
    				add_flush_callback(() => updating_maxVals = false);
    			}

    			multiselectcustom0.$set(multiselectcustom0_changes);
    			const multiselectcustom1_changes = {};
    			if (dirty[0] & /*$t*/ 2097152) multiselectcustom1_changes.typeOfFeed = /*$t*/ ctx[21]("feed.mixed");

    			if (!updating_selected_1 && dirty[0] & /*selectedKarma*/ 131072) {
    				updating_selected_1 = true;
    				multiselectcustom1_changes.selected = /*selectedKarma*/ ctx[17];
    				add_flush_callback(() => updating_selected_1 = false);
    			}

    			if (!updating_prices_1 && dirty[0] & /*pricesKarma*/ 262144) {
    				updating_prices_1 = true;
    				multiselectcustom1_changes.prices = /*pricesKarma*/ ctx[18];
    				add_flush_callback(() => updating_prices_1 = false);
    			}

    			if (!updating_minVals_1 && dirty[0] & /*minValsKarma*/ 524288) {
    				updating_minVals_1 = true;
    				multiselectcustom1_changes.minVals = /*minValsKarma*/ ctx[19];
    				add_flush_callback(() => updating_minVals_1 = false);
    			}

    			if (!updating_maxVals_1 && dirty[0] & /*maxValsKarma*/ 1048576) {
    				updating_maxVals_1 = true;
    				multiselectcustom1_changes.maxVals = /*maxValsKarma*/ ctx[20];
    				add_flush_callback(() => updating_maxVals_1 = false);
    			}

    			multiselectcustom1.$set(multiselectcustom1_changes);
    			const multiselectcustom2_changes = {};
    			if (dirty[0] & /*$t*/ 2097152) multiselectcustom2_changes.typeOfFeed = /*$t*/ ctx[21]("feed.energy");

    			if (!updating_selected_2 && dirty[0] & /*selectedEnerji*/ 512) {
    				updating_selected_2 = true;
    				multiselectcustom2_changes.selected = /*selectedEnerji*/ ctx[9];
    				add_flush_callback(() => updating_selected_2 = false);
    			}

    			if (!updating_prices_2 && dirty[0] & /*pricesEnerji*/ 1024) {
    				updating_prices_2 = true;
    				multiselectcustom2_changes.prices = /*pricesEnerji*/ ctx[10];
    				add_flush_callback(() => updating_prices_2 = false);
    			}

    			if (!updating_minVals_2 && dirty[0] & /*minValsEnerji*/ 2048) {
    				updating_minVals_2 = true;
    				multiselectcustom2_changes.minVals = /*minValsEnerji*/ ctx[11];
    				add_flush_callback(() => updating_minVals_2 = false);
    			}

    			if (!updating_maxVals_2 && dirty[0] & /*maxValsEnerji*/ 4096) {
    				updating_maxVals_2 = true;
    				multiselectcustom2_changes.maxVals = /*maxValsEnerji*/ ctx[12];
    				add_flush_callback(() => updating_maxVals_2 = false);
    			}

    			multiselectcustom2.$set(multiselectcustom2_changes);
    			const multiselectcustom3_changes = {};
    			if (dirty[0] & /*$t*/ 2097152) multiselectcustom3_changes.typeOfFeed = /*$t*/ ctx[21]("feed.protein");

    			if (!updating_selected_3 && dirty[0] & /*selectedProtein*/ 8192) {
    				updating_selected_3 = true;
    				multiselectcustom3_changes.selected = /*selectedProtein*/ ctx[13];
    				add_flush_callback(() => updating_selected_3 = false);
    			}

    			if (!updating_prices_3 && dirty[0] & /*pricesProtein*/ 16384) {
    				updating_prices_3 = true;
    				multiselectcustom3_changes.prices = /*pricesProtein*/ ctx[14];
    				add_flush_callback(() => updating_prices_3 = false);
    			}

    			if (!updating_minVals_3 && dirty[0] & /*minValsProtein*/ 32768) {
    				updating_minVals_3 = true;
    				multiselectcustom3_changes.minVals = /*minValsProtein*/ ctx[15];
    				add_flush_callback(() => updating_minVals_3 = false);
    			}

    			if (!updating_maxVals_3 && dirty[0] & /*maxValsProtein*/ 65536) {
    				updating_maxVals_3 = true;
    				multiselectcustom3_changes.maxVals = /*maxValsProtein*/ ctx[16];
    				add_flush_callback(() => updating_maxVals_3 = false);
    			}

    			multiselectcustom3.$set(multiselectcustom3_changes);
    			const multiselectcustom4_changes = {};
    			if (dirty[0] & /*$t*/ 2097152) multiselectcustom4_changes.typeOfFeed = /*$t*/ ctx[21]("feed.other");

    			if (!updating_selected_4 && dirty[0] & /*selectedDiger*/ 32) {
    				updating_selected_4 = true;
    				multiselectcustom4_changes.selected = /*selectedDiger*/ ctx[5];
    				add_flush_callback(() => updating_selected_4 = false);
    			}

    			if (!updating_prices_4 && dirty[0] & /*pricesDiger*/ 64) {
    				updating_prices_4 = true;
    				multiselectcustom4_changes.prices = /*pricesDiger*/ ctx[6];
    				add_flush_callback(() => updating_prices_4 = false);
    			}

    			if (!updating_minVals_4 && dirty[0] & /*minValsDiger*/ 128) {
    				updating_minVals_4 = true;
    				multiselectcustom4_changes.minVals = /*minValsDiger*/ ctx[7];
    				add_flush_callback(() => updating_minVals_4 = false);
    			}

    			if (!updating_maxVals_4 && dirty[0] & /*maxValsDiger*/ 256) {
    				updating_maxVals_4 = true;
    				multiselectcustom4_changes.maxVals = /*maxValsDiger*/ ctx[8];
    				add_flush_callback(() => updating_maxVals_4 = false);
    			}

    			multiselectcustom4.$set(multiselectcustom4_changes);
    			if ((!current || dirty[0] & /*$t*/ 2097152) && t9_value !== (t9_value = /*$t*/ ctx[21]("button.back") + "")) set_data_dev(t9, t9_value);
    			if ((!current || dirty[0] & /*$t*/ 2097152) && t11_value !== (t11_value = /*$t*/ ctx[21]("button.calculate") + "")) set_data_dev(t11, t11_value);
    			const modal_1_changes = {};
    			if (dirty[0] & /*$modal*/ 8388608) modal_1_changes.show = /*$modal*/ ctx[23];
    			modal_1.$set(modal_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(multiselectcustom0.$$.fragment, local);
    			transition_in(multiselectcustom1.$$.fragment, local);
    			transition_in(multiselectcustom2.$$.fragment, local);
    			transition_in(multiselectcustom3.$$.fragment, local);
    			transition_in(multiselectcustom4.$$.fragment, local);
    			transition_in(modal_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(multiselectcustom0.$$.fragment, local);
    			transition_out(multiselectcustom1.$$.fragment, local);
    			transition_out(multiselectcustom2.$$.fragment, local);
    			transition_out(multiselectcustom3.$$.fragment, local);
    			transition_out(multiselectcustom4.$$.fragment, local);
    			transition_out(modal_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(multiselectcustom0);
    			destroy_component(multiselectcustom1);
    			destroy_component(multiselectcustom2);
    			destroy_component(multiselectcustom3);
    			destroy_component(multiselectcustom4);
    			destroy_component(modal_1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $t;
    	let $data;
    	let $modal;
    	validate_store(t, 't');
    	component_subscribe($$self, t, $$value => $$invalidate(21, $t = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Page2', slots, []);
    	const modal = writable(null);
    	validate_store(modal, 'modal');
    	component_subscribe($$self, modal, value => $$invalidate(23, $modal = value));
    	let { initialValues } = $$props;
    	let { onSubmit } = $$props;
    	let { onBack } = $$props;
    	let { requiredVals } = $$props;
    	const { form, data } = createForm({ onSubmit, initialValues });
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(22, $data = value));
    	let tndclasses = ['Kaba yem', 'Diğer Yem', 'Enerji', 'Protein', 'Karma'];
    	let dataSelect = dataFeed;

    	if ($t("language") === "en") {
    		dataSelect = dataFeedEn;
    	}

    	//const multiSelectOptions = dataFeed.map(option => option["feed"])
    	const multiSelectOptionsKaba = dataSelect.filter(element => element["TDNClass"] === tndclasses[0]).map(option => option["feed"]);

    	let selectedKaba = [];
    	let pricesKaba = [];
    	let minValsKaba = [];
    	let maxValsKaba = [];
    	const multiSelectOptionsDiger = dataSelect.filter(element => element["TDNClass"] === tndclasses[1]).map(option => option["feed"]);
    	let selectedDiger = [];
    	let pricesDiger = [];
    	let minValsDiger = [];
    	let maxValsDiger = [];
    	const multiSelectOptionsEnerji = dataSelect.filter(element => element["TDNClass"] === tndclasses[2]).map(option => option["feed"]);
    	let selectedEnerji = [];
    	let pricesEnerji = [];
    	let minValsEnerji = [];
    	let maxValsEnerji = [];
    	const multiSelectOptionsProtein = dataSelect.filter(element => element["TDNClass"] === tndclasses[3]).map(option => option["feed"]);
    	let selectedProtein = [];
    	let pricesProtein = [];
    	let minValsProtein = [];
    	let maxValsProtein = [];
    	const multiSelectOptionsKarma = dataSelect.filter(element => element["TDNClass"] === tndclasses[4]).map(option => option["feed"]);
    	let selectedKarma = [];
    	let pricesKarma = [];
    	let minValsKarma = [];
    	let maxValsKarma = [];
    	console.log({ requiredVals });

    	async function denemeFunc() {
    		if (selectedKaba.length < 1) {
    			modal.set(bind(Warning, { message: $t("warning.forage") }));
    		} else {
    			let selectedOpts = selectedKaba.concat(selectedDiger, selectedEnerji, selectedProtein, selectedKarma);

    			let prices = {
    				...pricesKaba,
    				...pricesDiger,
    				...pricesEnerji,
    				...pricesProtein,
    				...pricesKarma
    			};

    			let minVals = {
    				...minValsKaba,
    				...minValsDiger,
    				...minValsEnerji,
    				...minValsProtein,
    				...minValsKarma
    			};

    			let maxVals = {
    				...maxValsKaba,
    				...maxValsDiger,
    				...maxValsEnerji,
    				...maxValsProtein,
    				...maxValsKarma
    			};

    			let model = {};

    			selectedOpts.forEach(option => {
    				model[option] = {
    					price: prices[option],
    					min: minVals[option],
    					max: maxVals[option]
    				};
    			});

    			console.log(model);
    			const body = { "m": model, "r": requiredVals };

    			const response = await fetch('http://127.0.0.1:5000/solve', {
    				method: 'POST',
    				headers: { 'Content-Type': 'application/json' },
    				body: JSON.stringify(body)
    			});

    			const json = await response.json();
    			console.log(json);

    			if (json["status"] === "optimal") modal.set(bind(Popup, {
    				feeds: json["feeds"],
    				masses: json["values"]
    			})); else modal.set(bind(Warning, { message: json["status"] }));
    		}
    	} //optimizePrice(requiredVals, prices, selectedOpts)

    	$$self.$$.on_mount.push(function () {
    		if (initialValues === undefined && !('initialValues' in $$props || $$self.$$.bound[$$self.$$.props['initialValues']])) {
    			console_1$1.warn("<Page2> was created without expected prop 'initialValues'");
    		}

    		if (onSubmit === undefined && !('onSubmit' in $$props || $$self.$$.bound[$$self.$$.props['onSubmit']])) {
    			console_1$1.warn("<Page2> was created without expected prop 'onSubmit'");
    		}

    		if (onBack === undefined && !('onBack' in $$props || $$self.$$.bound[$$self.$$.props['onBack']])) {
    			console_1$1.warn("<Page2> was created without expected prop 'onBack'");
    		}

    		if (requiredVals === undefined && !('requiredVals' in $$props || $$self.$$.bound[$$self.$$.props['requiredVals']])) {
    			console_1$1.warn("<Page2> was created without expected prop 'requiredVals'");
    		}
    	});

    	const writable_props = ['initialValues', 'onSubmit', 'onBack', 'requiredVals'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Page2> was created with unknown prop '${key}'`);
    	});

    	function multiselectcustom0_selected_binding(value) {
    		selectedKaba = value;
    		$$invalidate(1, selectedKaba);
    	}

    	function multiselectcustom0_prices_binding(value) {
    		pricesKaba = value;
    		$$invalidate(2, pricesKaba);
    	}

    	function multiselectcustom0_minVals_binding(value) {
    		minValsKaba = value;
    		$$invalidate(3, minValsKaba);
    	}

    	function multiselectcustom0_maxVals_binding(value) {
    		maxValsKaba = value;
    		$$invalidate(4, maxValsKaba);
    	}

    	function multiselectcustom1_selected_binding(value) {
    		selectedKarma = value;
    		$$invalidate(17, selectedKarma);
    	}

    	function multiselectcustom1_prices_binding(value) {
    		pricesKarma = value;
    		$$invalidate(18, pricesKarma);
    	}

    	function multiselectcustom1_minVals_binding(value) {
    		minValsKarma = value;
    		$$invalidate(19, minValsKarma);
    	}

    	function multiselectcustom1_maxVals_binding(value) {
    		maxValsKarma = value;
    		$$invalidate(20, maxValsKarma);
    	}

    	function multiselectcustom2_selected_binding(value) {
    		selectedEnerji = value;
    		$$invalidate(9, selectedEnerji);
    	}

    	function multiselectcustom2_prices_binding(value) {
    		pricesEnerji = value;
    		$$invalidate(10, pricesEnerji);
    	}

    	function multiselectcustom2_minVals_binding(value) {
    		minValsEnerji = value;
    		$$invalidate(11, minValsEnerji);
    	}

    	function multiselectcustom2_maxVals_binding(value) {
    		maxValsEnerji = value;
    		$$invalidate(12, maxValsEnerji);
    	}

    	function multiselectcustom3_selected_binding(value) {
    		selectedProtein = value;
    		$$invalidate(13, selectedProtein);
    	}

    	function multiselectcustom3_prices_binding(value) {
    		pricesProtein = value;
    		$$invalidate(14, pricesProtein);
    	}

    	function multiselectcustom3_minVals_binding(value) {
    		minValsProtein = value;
    		$$invalidate(15, minValsProtein);
    	}

    	function multiselectcustom3_maxVals_binding(value) {
    		maxValsProtein = value;
    		$$invalidate(16, maxValsProtein);
    	}

    	function multiselectcustom4_selected_binding(value) {
    		selectedDiger = value;
    		$$invalidate(5, selectedDiger);
    	}

    	function multiselectcustom4_prices_binding(value) {
    		pricesDiger = value;
    		$$invalidate(6, pricesDiger);
    	}

    	function multiselectcustom4_minVals_binding(value) {
    		minValsDiger = value;
    		$$invalidate(7, minValsDiger);
    	}

    	function multiselectcustom4_maxVals_binding(value) {
    		maxValsDiger = value;
    		$$invalidate(8, maxValsDiger);
    	}

    	const click_handler = () => onBack($data);

    	$$self.$$set = $$props => {
    		if ('initialValues' in $$props) $$invalidate(33, initialValues = $$props.initialValues);
    		if ('onSubmit' in $$props) $$invalidate(34, onSubmit = $$props.onSubmit);
    		if ('onBack' in $$props) $$invalidate(0, onBack = $$props.onBack);
    		if ('requiredVals' in $$props) $$invalidate(35, requiredVals = $$props.requiredVals);
    	};

    	$$self.$capture_state = () => ({
    		createForm,
    		MultiSelectCustom,
    		t,
    		locale,
    		locales,
    		dataFeed,
    		dataFeedEn,
    		writable,
    		Modal,
    		bind,
    		Popup,
    		Warning,
    		modal,
    		initialValues,
    		onSubmit,
    		onBack,
    		requiredVals,
    		form,
    		data,
    		tndclasses,
    		dataSelect,
    		multiSelectOptionsKaba,
    		selectedKaba,
    		pricesKaba,
    		minValsKaba,
    		maxValsKaba,
    		multiSelectOptionsDiger,
    		selectedDiger,
    		pricesDiger,
    		minValsDiger,
    		maxValsDiger,
    		multiSelectOptionsEnerji,
    		selectedEnerji,
    		pricesEnerji,
    		minValsEnerji,
    		maxValsEnerji,
    		multiSelectOptionsProtein,
    		selectedProtein,
    		pricesProtein,
    		minValsProtein,
    		maxValsProtein,
    		multiSelectOptionsKarma,
    		selectedKarma,
    		pricesKarma,
    		minValsKarma,
    		maxValsKarma,
    		denemeFunc,
    		$t,
    		$data,
    		$modal
    	});

    	$$self.$inject_state = $$props => {
    		if ('initialValues' in $$props) $$invalidate(33, initialValues = $$props.initialValues);
    		if ('onSubmit' in $$props) $$invalidate(34, onSubmit = $$props.onSubmit);
    		if ('onBack' in $$props) $$invalidate(0, onBack = $$props.onBack);
    		if ('requiredVals' in $$props) $$invalidate(35, requiredVals = $$props.requiredVals);
    		if ('tndclasses' in $$props) tndclasses = $$props.tndclasses;
    		if ('dataSelect' in $$props) dataSelect = $$props.dataSelect;
    		if ('selectedKaba' in $$props) $$invalidate(1, selectedKaba = $$props.selectedKaba);
    		if ('pricesKaba' in $$props) $$invalidate(2, pricesKaba = $$props.pricesKaba);
    		if ('minValsKaba' in $$props) $$invalidate(3, minValsKaba = $$props.minValsKaba);
    		if ('maxValsKaba' in $$props) $$invalidate(4, maxValsKaba = $$props.maxValsKaba);
    		if ('selectedDiger' in $$props) $$invalidate(5, selectedDiger = $$props.selectedDiger);
    		if ('pricesDiger' in $$props) $$invalidate(6, pricesDiger = $$props.pricesDiger);
    		if ('minValsDiger' in $$props) $$invalidate(7, minValsDiger = $$props.minValsDiger);
    		if ('maxValsDiger' in $$props) $$invalidate(8, maxValsDiger = $$props.maxValsDiger);
    		if ('selectedEnerji' in $$props) $$invalidate(9, selectedEnerji = $$props.selectedEnerji);
    		if ('pricesEnerji' in $$props) $$invalidate(10, pricesEnerji = $$props.pricesEnerji);
    		if ('minValsEnerji' in $$props) $$invalidate(11, minValsEnerji = $$props.minValsEnerji);
    		if ('maxValsEnerji' in $$props) $$invalidate(12, maxValsEnerji = $$props.maxValsEnerji);
    		if ('selectedProtein' in $$props) $$invalidate(13, selectedProtein = $$props.selectedProtein);
    		if ('pricesProtein' in $$props) $$invalidate(14, pricesProtein = $$props.pricesProtein);
    		if ('minValsProtein' in $$props) $$invalidate(15, minValsProtein = $$props.minValsProtein);
    		if ('maxValsProtein' in $$props) $$invalidate(16, maxValsProtein = $$props.maxValsProtein);
    		if ('selectedKarma' in $$props) $$invalidate(17, selectedKarma = $$props.selectedKarma);
    		if ('pricesKarma' in $$props) $$invalidate(18, pricesKarma = $$props.pricesKarma);
    		if ('minValsKarma' in $$props) $$invalidate(19, minValsKarma = $$props.minValsKarma);
    		if ('maxValsKarma' in $$props) $$invalidate(20, maxValsKarma = $$props.maxValsKarma);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		onBack,
    		selectedKaba,
    		pricesKaba,
    		minValsKaba,
    		maxValsKaba,
    		selectedDiger,
    		pricesDiger,
    		minValsDiger,
    		maxValsDiger,
    		selectedEnerji,
    		pricesEnerji,
    		minValsEnerji,
    		maxValsEnerji,
    		selectedProtein,
    		pricesProtein,
    		minValsProtein,
    		maxValsProtein,
    		selectedKarma,
    		pricesKarma,
    		minValsKarma,
    		maxValsKarma,
    		$t,
    		$data,
    		$modal,
    		modal,
    		form,
    		data,
    		multiSelectOptionsKaba,
    		multiSelectOptionsDiger,
    		multiSelectOptionsEnerji,
    		multiSelectOptionsProtein,
    		multiSelectOptionsKarma,
    		denemeFunc,
    		initialValues,
    		onSubmit,
    		requiredVals,
    		multiselectcustom0_selected_binding,
    		multiselectcustom0_prices_binding,
    		multiselectcustom0_minVals_binding,
    		multiselectcustom0_maxVals_binding,
    		multiselectcustom1_selected_binding,
    		multiselectcustom1_prices_binding,
    		multiselectcustom1_minVals_binding,
    		multiselectcustom1_maxVals_binding,
    		multiselectcustom2_selected_binding,
    		multiselectcustom2_prices_binding,
    		multiselectcustom2_minVals_binding,
    		multiselectcustom2_maxVals_binding,
    		multiselectcustom3_selected_binding,
    		multiselectcustom3_prices_binding,
    		multiselectcustom3_minVals_binding,
    		multiselectcustom3_maxVals_binding,
    		multiselectcustom4_selected_binding,
    		multiselectcustom4_prices_binding,
    		multiselectcustom4_minVals_binding,
    		multiselectcustom4_maxVals_binding,
    		click_handler
    	];
    }

    class Page2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				initialValues: 33,
    				onSubmit: 34,
    				onBack: 0,
    				requiredVals: 35
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page2",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get initialValues() {
    		throw new Error("<Page2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialValues(value) {
    		throw new Error("<Page2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSubmit() {
    		throw new Error("<Page2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSubmit(value) {
    		throw new Error("<Page2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onBack() {
    		throw new Error("<Page2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onBack(value) {
    		throw new Error("<Page2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get requiredVals() {
    		throw new Error("<Page2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set requiredVals(value) {
    		throw new Error("<Page2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class RationCalculator {

        
        constructor(lactationNumber, yieldDaily, fatRatio, weekofLactation, liveWeight, gestationPeriod) {
            this.lactationNumber = lactationNumber;
            this.yieldDaily = yieldDaily;
            this.fatRatio = fatRatio;
            this.weekofLactation = weekofLactation;
            this.liveWeight = liveWeight;
            this.gestationPeriod = gestationPeriod;
            this.ADF = 21;
            this.NDF = 28;
        }
        
        fourPercentCorrectedMilkYield() {
            return 15 * this.yieldDaily * this.fatRatio / 100 + 0.4 * this.yieldDaily;
        }
        calculateDryMatter() {
            //
            return 0.025 * this.liveWeight + 0.1 * this.fourPercentCorrectedMilkYield()
        }
        calculateMethobolicEnergy() {
            return 0.133 * (this.liveWeight ** 0.75) * 1.13;
        }
        calculateMilkYieldMethobolicEnergy() {
            return 1.185 * this.fourPercentCorrectedMilkYield();
        }
        calculateNetEnergy() {
            return 0.75 * this.calculateMethobolicEnergy();
        }
        calculateNetEnergyLactation() {
            return 0.361 * this.fourPercentCorrectedMilkYield()
        }
        calculateMethobolicEnergyGestation() {
            if (this.gestationPeriod > 190) {
                return (((0.00318 * this.gestationPeriod) - 0.0352) * (this.liveWeight * 0.07 / 45)) / 0.14
            }
            else {
                return 0
            }
        }
        calculateNetEnergyGestation() {
            if (this.gestationPeriod > 190) {
                return (((0.00318 * this.gestationPeriod) - 0.0352) * (this.liveWeight * 0.07 / 45)) / 0.218
            }
            else {
                return 0
            }
        }
        calculateGrowth() {
            if (this.lactationNumber === 1) {
                return 0.0635 * (this.liveWeight ** 0.75) * (this.liveWeight / 1000) ** 1.097
            }
            else if (this.lactationNumber === 2) {
                return 0.0635 * (this.liveWeight ** 0.75) * (this.liveWeight / 2000) ** 1.097
            }
            else {
                return 0
            }
        }
        calculateTotalNetEnergy() {
            return this.calculateNetEnergyGestation() + this.calculateNetEnergyLactation() + this.calculateNetEnergy() + this.calculateGrowth()
        }
        calculateTotalMethobolicEnergy() {
            return this.calculateMethobolicEnergy() + this.calculateMethobolicEnergyGestation() + this.calculateMilkYieldMethobolicEnergy() + this.calculateGrowth() / 0.64
        }
        calculateMaintanceMP() {
            return 3.8 * (this.liveWeight ** 0.75);
        }
        calculateGestationMP() {
            if (this.gestationPeriod > 190)
                return (0.69 * this.gestationPeriod - 69.2) * ((this.liveWeight ** 0.75) * (0.35 / 45)) / 0.33
            else
                return 0
        }
        calculateLactationMP() {
            return 60 * this.fourPercentCorrectedMilkYield()
        }
        calculateRumendeMP() {
            return 36.5 * this.calculateTotalMethobolicEnergy()
        }
        calculateMicrobialMP() {
            return 0.64 * this.calculateRumendeMP()
        }
        calculateGrowthNetProtein() {
            if (this.lactationNumber === 1)
                return (this.liveWeight / 1000) * (268 - 29.4 * this.calculateGrowth() / (this.liveWeight / 1000))
            else if (this.lactationNumber === 2)
                return (this.liveWeight / 2000) * (268 - 29.4 * this.calculateGrowth() / (this.liveWeight / 2000))
            else
                return 0
        }

        calculateGrowthMP() {
            if (this.liveWeight < 478)
                return this.calculateGrowthNetProtein() / (0.834 - this.liveWeight * 0.00114)
            else
                return this.calculateGrowthNetProtein() / (0.834 - 478 * 0.00114)
        }
        calculateTotalMP() {
            return this.calculateGestationMP() + this.calculateGrowthMP() + this.calculateLactationMP() + this.calculateMaintanceMP()
        }
        calculateRYDMP() {
            return this.calculateTotalMP() - this.calculateMicrobialMP()
        }
        calculateRYDHP() {
            return this.calculateRYDMP() / 0.8
        }
        calculateTotalRawProtein() {
            return this.calculateRumendeMP() + this.calculateRYDHP()
        }
        calculateCA() {
            return 0.0405 * this.liveWeight
        }
        calculateLactationCA() {
            return 3.21 * this.yieldDaily
        }
        calculateP() {
            return 0.0286 * this.liveWeight
        }
        calculateLactationP() {
            return 1.98 * this.yieldDaily
        }

        calculateRation() {
            //setOptimumRation(Number(lactationNumber)+Number(yieldDaily)+Number(fatRatio)+Number(weekofLactation)+Number(liveWeight)+Number(gestationPeriod))
            /*
            Total CP > crudeProtein
            Total ME > totalME
            phosphor > phosphorNeed
            ca > calciumNeed
            dryMatter * 1.1  > dryMatterData > dryMatterData * 0.95
            Total NDF > 28
            Total ADF > 21
            NDF ve ADF'yi DM ile çarpmak gerekiyor
            */
            const crudeProtein = this.calculateTotalRawProtein();//calculateTotalMP()
            const totalME = this.calculateTotalMethobolicEnergy();
            const phosphorNeed = this.calculateP() + this.calculateLactationP();
            const calciumNeed = this.calculateCA() + this.calculateLactationCA();
            const dryMatter = this.calculateDryMatter();

            return {"CP":crudeProtein,"ME":totalME,"P":phosphorNeed,"Ca":calciumNeed,"DM":dryMatter}
        }

        



    }

    /* src/App.svelte generated by Svelte v3.55.0 */

    const { console: console_1 } = globals;

    function create_fragment(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*pages*/ ctx[3][/*page*/ ctx[0]];

    	function switch_props(ctx) {
    		return {
    			props: {
    				onSubmit: /*onSubmit*/ ctx[4],
    				onBack: /*onBack*/ ctx[5],
    				initialValues: /*pagesState*/ ctx[1][/*page*/ ctx[0]],
    				requiredVals: /*requiredVals*/ ctx[2]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*pagesState, page*/ 3) switch_instance_changes.initialValues = /*pagesState*/ ctx[1][/*page*/ ctx[0]];
    			if (dirty & /*requiredVals*/ 4) switch_instance_changes.requiredVals = /*requiredVals*/ ctx[2];

    			if (switch_value !== (switch_value = /*pages*/ ctx[3][/*page*/ ctx[0]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let rationCalculator;
    	const pages = [Page1, Page2];
    	let page = 0;
    	let pagesState = [];
    	let requiredVals;

    	// Our handlers
    	function onSubmit(values) {
    		if (page === pages.length - 1) {
    			// On our final page with POST our data somewhere
    			console.log('Submitted data: ', pagesState);
    		} else {
    			// If we're not on the last page, store our data and increase a step
    			$$invalidate(1, pagesState[page] = values, pagesState);

    			$$invalidate(1, pagesState); // Triggering update
    			rationCalculator = new RationCalculator(values["lactation"], values["yield"], values["fatRatio"], values["weekofLactation"], values["liveWeight"], values["gestationPeriod"]);
    			$$invalidate(2, requiredVals = rationCalculator.calculateRation());
    			$$invalidate(0, page += 1);
    		}
    	}

    	function onBack(values) {
    		if (page === 0) return;
    		$$invalidate(1, pagesState[page] = values, pagesState);
    		$$invalidate(1, pagesState); // Triggering update
    		$$invalidate(0, page -= 1);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Page1,
    		Page2,
    		RationCalculator,
    		rationCalculator,
    		pages,
    		page,
    		pagesState,
    		requiredVals,
    		onSubmit,
    		onBack
    	});

    	$$self.$inject_state = $$props => {
    		if ('rationCalculator' in $$props) rationCalculator = $$props.rationCalculator;
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('pagesState' in $$props) $$invalidate(1, pagesState = $$props.pagesState);
    		if ('requiredVals' in $$props) $$invalidate(2, requiredVals = $$props.requiredVals);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page, pagesState, requiredVals, pages, onSubmit, onBack];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
