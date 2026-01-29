(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to2, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to2, key) && key !== except)
          __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to2;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../../node_modules/@rails/actioncable/src/adapters.js
  var adapters_default;
  var init_adapters = __esm({
    "../../node_modules/@rails/actioncable/src/adapters.js"() {
      adapters_default = {
        logger: typeof console !== "undefined" ? console : void 0,
        WebSocket: typeof WebSocket !== "undefined" ? WebSocket : void 0
      };
    }
  });

  // ../../node_modules/@rails/actioncable/src/logger.js
  var logger_default;
  var init_logger = __esm({
    "../../node_modules/@rails/actioncable/src/logger.js"() {
      init_adapters();
      logger_default = {
        log(...messages) {
          if (this.enabled) {
            messages.push(Date.now());
            adapters_default.logger.log("[ActionCable]", ...messages);
          }
        }
      };
    }
  });

  // ../../node_modules/@rails/actioncable/src/connection_monitor.js
  var now2, secondsSince2, ConnectionMonitor2, connection_monitor_default;
  var init_connection_monitor = __esm({
    "../../node_modules/@rails/actioncable/src/connection_monitor.js"() {
      init_logger();
      now2 = () => (/* @__PURE__ */ new Date()).getTime();
      secondsSince2 = (time) => (now2() - time) / 1e3;
      ConnectionMonitor2 = class {
        constructor(connection) {
          this.visibilityDidChange = this.visibilityDidChange.bind(this);
          this.connection = connection;
          this.reconnectAttempts = 0;
        }
        start() {
          if (!this.isRunning()) {
            this.startedAt = now2();
            delete this.stoppedAt;
            this.startPolling();
            addEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
          }
        }
        stop() {
          if (this.isRunning()) {
            this.stoppedAt = now2();
            this.stopPolling();
            removeEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log("ConnectionMonitor stopped");
          }
        }
        isRunning() {
          return this.startedAt && !this.stoppedAt;
        }
        recordMessage() {
          this.pingedAt = now2();
        }
        recordConnect() {
          this.reconnectAttempts = 0;
          delete this.disconnectedAt;
          logger_default.log("ConnectionMonitor recorded connect");
        }
        recordDisconnect() {
          this.disconnectedAt = now2();
          logger_default.log("ConnectionMonitor recorded disconnect");
        }
        // Private
        startPolling() {
          this.stopPolling();
          this.poll();
        }
        stopPolling() {
          clearTimeout(this.pollTimeout);
        }
        poll() {
          this.pollTimeout = setTimeout(
            () => {
              this.reconnectIfStale();
              this.poll();
            },
            this.getPollInterval()
          );
        }
        getPollInterval() {
          const { staleThreshold, reconnectionBackoffRate } = this.constructor;
          const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
          const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
          const jitter = jitterMax * Math.random();
          return staleThreshold * 1e3 * backoff * (1 + jitter);
        }
        reconnectIfStale() {
          if (this.connectionIsStale()) {
            logger_default.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince2(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              logger_default.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince2(this.disconnectedAt)} s`);
            } else {
              logger_default.log("ConnectionMonitor reopening");
              this.connection.reopen();
            }
          }
        }
        get refreshedAt() {
          return this.pingedAt ? this.pingedAt : this.startedAt;
        }
        connectionIsStale() {
          return secondsSince2(this.refreshedAt) > this.constructor.staleThreshold;
        }
        disconnectedRecently() {
          return this.disconnectedAt && secondsSince2(this.disconnectedAt) < this.constructor.staleThreshold;
        }
        visibilityDidChange() {
          if (document.visibilityState === "visible") {
            setTimeout(
              () => {
                if (this.connectionIsStale() || !this.connection.isOpen()) {
                  logger_default.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
                  this.connection.reopen();
                }
              },
              200
            );
          }
        }
      };
      ConnectionMonitor2.staleThreshold = 6;
      ConnectionMonitor2.reconnectionBackoffRate = 0.15;
      connection_monitor_default = ConnectionMonitor2;
    }
  });

  // ../../node_modules/@rails/actioncable/src/internal.js
  var internal_default;
  var init_internal = __esm({
    "../../node_modules/@rails/actioncable/src/internal.js"() {
      internal_default = {
        "message_types": {
          "welcome": "welcome",
          "disconnect": "disconnect",
          "ping": "ping",
          "confirmation": "confirm_subscription",
          "rejection": "reject_subscription"
        },
        "disconnect_reasons": {
          "unauthorized": "unauthorized",
          "invalid_request": "invalid_request",
          "server_restart": "server_restart",
          "remote": "remote"
        },
        "default_mount_path": "/cable",
        "protocols": [
          "actioncable-v1-json",
          "actioncable-unsupported"
        ]
      };
    }
  });

  // ../../node_modules/@rails/actioncable/src/connection.js
  var message_types2, protocols2, supportedProtocols2, indexOf2, Connection2, connection_default;
  var init_connection = __esm({
    "../../node_modules/@rails/actioncable/src/connection.js"() {
      init_adapters();
      init_connection_monitor();
      init_internal();
      init_logger();
      ({ message_types: message_types2, protocols: protocols2 } = internal_default);
      supportedProtocols2 = protocols2.slice(0, protocols2.length - 1);
      indexOf2 = [].indexOf;
      Connection2 = class {
        constructor(consumer2) {
          this.open = this.open.bind(this);
          this.consumer = consumer2;
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new connection_monitor_default(this);
          this.disconnected = true;
        }
        send(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        }
        open() {
          if (this.isActive()) {
            logger_default.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
            return false;
          } else {
            const socketProtocols = [...protocols2, ...this.consumer.subprotocols || []];
            logger_default.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${socketProtocols}`);
            if (this.webSocket) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new adapters_default.WebSocket(this.consumer.url, socketProtocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        }
        close({ allowReconnect } = { allowReconnect: true }) {
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isOpen()) {
            return this.webSocket.close();
          }
        }
        reopen() {
          logger_default.log(`Reopening WebSocket, current state is ${this.getState()}`);
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error2) {
              logger_default.log("Failed to reopen WebSocket", error2);
            } finally {
              logger_default.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        }
        getProtocol() {
          if (this.webSocket) {
            return this.webSocket.protocol;
          }
        }
        isOpen() {
          return this.isState("open");
        }
        isActive() {
          return this.isState("open", "connecting");
        }
        triedToReconnect() {
          return this.monitor.reconnectAttempts > 0;
        }
        // Private
        isProtocolSupported() {
          return indexOf2.call(supportedProtocols2, this.getProtocol()) >= 0;
        }
        isState(...states) {
          return indexOf2.call(states, this.getState()) >= 0;
        }
        getState() {
          if (this.webSocket) {
            for (let state in adapters_default.WebSocket) {
              if (adapters_default.WebSocket[state] === this.webSocket.readyState) {
                return state.toLowerCase();
              }
            }
          }
          return null;
        }
        installEventHandlers() {
          for (let eventName in this.events) {
            const handler = this.events[eventName].bind(this);
            this.webSocket[`on${eventName}`] = handler;
          }
        }
        uninstallEventHandlers() {
          for (let eventName in this.events) {
            this.webSocket[`on${eventName}`] = function() {
            };
          }
        }
      };
      Connection2.reopenDelay = 500;
      Connection2.prototype.events = {
        message(event) {
          if (!this.isProtocolSupported()) {
            return;
          }
          const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
          this.monitor.recordMessage();
          switch (type) {
            case message_types2.welcome:
              if (this.triedToReconnect()) {
                this.reconnectAttempted = true;
              }
              this.monitor.recordConnect();
              return this.subscriptions.reload();
            case message_types2.disconnect:
              logger_default.log(`Disconnecting. Reason: ${reason}`);
              return this.close({ allowReconnect: reconnect });
            case message_types2.ping:
              return null;
            case message_types2.confirmation:
              this.subscriptions.confirmSubscription(identifier);
              if (this.reconnectAttempted) {
                this.reconnectAttempted = false;
                return this.subscriptions.notify(identifier, "connected", { reconnected: true });
              } else {
                return this.subscriptions.notify(identifier, "connected", { reconnected: false });
              }
            case message_types2.rejection:
              return this.subscriptions.reject(identifier);
            default:
              return this.subscriptions.notify(identifier, "received", message);
          }
        },
        open() {
          logger_default.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
          this.disconnected = false;
          if (!this.isProtocolSupported()) {
            logger_default.log("Protocol is unsupported. Stopping monitor and disconnecting.");
            return this.close({ allowReconnect: false });
          }
        },
        close(event) {
          logger_default.log("WebSocket onclose event");
          if (this.disconnected) {
            return;
          }
          this.disconnected = true;
          this.monitor.recordDisconnect();
          return this.subscriptions.notifyAll("disconnected", { willAttemptReconnect: this.monitor.isRunning() });
        },
        error() {
          logger_default.log("WebSocket onerror event");
        }
      };
      connection_default = Connection2;
    }
  });

  // ../../node_modules/@rails/actioncable/src/subscription.js
  var extend, Subscription;
  var init_subscription = __esm({
    "../../node_modules/@rails/actioncable/src/subscription.js"() {
      extend = function(object, properties) {
        if (properties != null) {
          for (let key in properties) {
            const value = properties[key];
            object[key] = value;
          }
        }
        return object;
      };
      Subscription = class {
        constructor(consumer2, params = {}, mixin) {
          this.consumer = consumer2;
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }
        // Perform a channel action with the optional data passed as an attribute
        perform(action, data = {}) {
          data.action = action;
          return this.send(data);
        }
        send(data) {
          return this.consumer.send({ command: "message", identifier: this.identifier, data: JSON.stringify(data) });
        }
        unsubscribe() {
          return this.consumer.subscriptions.remove(this);
        }
      };
    }
  });

  // ../../node_modules/@rails/actioncable/src/subscription_guarantor.js
  var SubscriptionGuarantor, subscription_guarantor_default;
  var init_subscription_guarantor = __esm({
    "../../node_modules/@rails/actioncable/src/subscription_guarantor.js"() {
      init_logger();
      SubscriptionGuarantor = class {
        constructor(subscriptions) {
          this.subscriptions = subscriptions;
          this.pendingSubscriptions = [];
        }
        guarantee(subscription) {
          if (this.pendingSubscriptions.indexOf(subscription) == -1) {
            logger_default.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
            this.pendingSubscriptions.push(subscription);
          } else {
            logger_default.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
          }
          this.startGuaranteeing();
        }
        forget(subscription) {
          logger_default.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
          this.pendingSubscriptions = this.pendingSubscriptions.filter((s2) => s2 !== subscription);
        }
        startGuaranteeing() {
          this.stopGuaranteeing();
          this.retrySubscribing();
        }
        stopGuaranteeing() {
          clearTimeout(this.retryTimeout);
        }
        retrySubscribing() {
          this.retryTimeout = setTimeout(
            () => {
              if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
                this.pendingSubscriptions.map((subscription) => {
                  logger_default.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
                  this.subscriptions.subscribe(subscription);
                });
              }
            },
            500
          );
        }
      };
      subscription_guarantor_default = SubscriptionGuarantor;
    }
  });

  // ../../node_modules/@rails/actioncable/src/subscriptions.js
  var Subscriptions;
  var init_subscriptions = __esm({
    "../../node_modules/@rails/actioncable/src/subscriptions.js"() {
      init_logger();
      init_subscription();
      init_subscription_guarantor();
      Subscriptions = class {
        constructor(consumer2) {
          this.consumer = consumer2;
          this.guarantor = new subscription_guarantor_default(this);
          this.subscriptions = [];
        }
        create(channelName, mixin) {
          const channel = channelName;
          const params = typeof channel === "object" ? channel : { channel };
          const subscription = new Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        }
        // Private
        add(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.subscribe(subscription);
          return subscription;
        }
        remove(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        }
        reject(identifier) {
          return this.findAll(identifier).map((subscription) => {
            this.forget(subscription);
            this.notify(subscription, "rejected");
            return subscription;
          });
        }
        forget(subscription) {
          this.guarantor.forget(subscription);
          this.subscriptions = this.subscriptions.filter((s2) => s2 !== subscription);
          return subscription;
        }
        findAll(identifier) {
          return this.subscriptions.filter((s2) => s2.identifier === identifier);
        }
        reload() {
          return this.subscriptions.map((subscription) => this.subscribe(subscription));
        }
        notifyAll(callbackName, ...args) {
          return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
        }
        notify(subscription, callbackName, ...args) {
          let subscriptions;
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
        }
        subscribe(subscription) {
          if (this.sendCommand(subscription, "subscribe")) {
            this.guarantor.guarantee(subscription);
          }
        }
        confirmSubscription(identifier) {
          logger_default.log(`Subscription confirmed ${identifier}`);
          this.findAll(identifier).map((subscription) => this.guarantor.forget(subscription));
        }
        sendCommand(subscription, command) {
          const { identifier } = subscription;
          return this.consumer.send({ command, identifier });
        }
      };
    }
  });

  // ../../node_modules/@rails/actioncable/src/consumer.js
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      const a2 = document.createElement("a");
      a2.href = url;
      a2.href = a2.href;
      a2.protocol = a2.protocol.replace("http", "ws");
      return a2.href;
    } else {
      return url;
    }
  }
  var Consumer;
  var init_consumer = __esm({
    "../../node_modules/@rails/actioncable/src/consumer.js"() {
      init_connection();
      init_subscriptions();
      Consumer = class {
        constructor(url) {
          this._url = url;
          this.subscriptions = new Subscriptions(this);
          this.connection = new connection_default(this);
          this.subprotocols = [];
        }
        get url() {
          return createWebSocketURL(this._url);
        }
        send(data) {
          return this.connection.send(data);
        }
        connect() {
          return this.connection.open();
        }
        disconnect() {
          return this.connection.close({ allowReconnect: false });
        }
        ensureActiveConnection() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        }
        addSubProtocol(subprotocol) {
          this.subprotocols = [...this.subprotocols, subprotocol];
        }
      };
    }
  });

  // ../../node_modules/@rails/actioncable/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Connection: () => connection_default,
    ConnectionMonitor: () => connection_monitor_default,
    Consumer: () => Consumer,
    INTERNAL: () => internal_default,
    Subscription: () => Subscription,
    SubscriptionGuarantor: () => subscription_guarantor_default,
    Subscriptions: () => Subscriptions,
    adapters: () => adapters_default,
    createConsumer: () => createConsumer,
    createWebSocketURL: () => createWebSocketURL,
    getConfig: () => getConfig,
    logger: () => logger_default
  });
  function createConsumer(url = getConfig("url") || internal_default.default_mount_path) {
    return new Consumer(url);
  }
  function getConfig(name) {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  var init_src = __esm({
    "../../node_modules/@rails/actioncable/src/index.js"() {
      init_adapters();
      init_connection();
      init_connection_monitor();
      init_consumer();
      init_internal();
      init_logger();
      init_subscription();
      init_subscription_guarantor();
      init_subscriptions();
    }
  });

  // ../../node_modules/lodash/lodash.js
  var require_lodash = __commonJS({
    "../../node_modules/lodash/lodash.js"(exports, module) {
      (function() {
        var undefined2;
        var VERSION = "4.17.21";
        var LARGE_ARRAY_SIZE = 200;
        var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
        var HASH_UNDEFINED = "__lodash_hash_undefined__";
        var MAX_MEMOIZE_SIZE = 500;
        var PLACEHOLDER = "__lodash_placeholder__";
        var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
        var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
        var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
        var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
        var HOT_COUNT = 800, HOT_SPAN = 16;
        var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
        var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
        var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
        var wrapFlags = [
          ["ary", WRAP_ARY_FLAG],
          ["bind", WRAP_BIND_FLAG],
          ["bindKey", WRAP_BIND_KEY_FLAG],
          ["curry", WRAP_CURRY_FLAG],
          ["curryRight", WRAP_CURRY_RIGHT_FLAG],
          ["flip", WRAP_FLIP_FLAG],
          ["partial", WRAP_PARTIAL_FLAG],
          ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
          ["rearg", WRAP_REARG_FLAG]
        ];
        var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
        var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
        var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
        var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
        var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
        var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
        var reTrimStart = /^\s+/;
        var reWhitespace = /\s/;
        var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
        var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
        var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
        var reEscapeChar = /\\(\\)?/g;
        var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
        var reFlags = /\w*$/;
        var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
        var reIsBinary = /^0b[01]+$/i;
        var reIsHostCtor = /^\[object .+?Constructor\]$/;
        var reIsOctal = /^0o[0-7]+$/i;
        var reIsUint = /^(?:0|[1-9]\d*)$/;
        var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
        var reNoMatch = /($^)/;
        var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
        var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
        var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
        var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
        var reApos = RegExp(rsApos, "g");
        var reComboMark = RegExp(rsCombo, "g");
        var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
        var reUnicodeWord = RegExp([
          rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
          rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
          rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
          rsUpper + "+" + rsOptContrUpper,
          rsOrdUpper,
          rsOrdLower,
          rsDigits,
          rsEmoji
        ].join("|"), "g");
        var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
        var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
        var contextProps = [
          "Array",
          "Buffer",
          "DataView",
          "Date",
          "Error",
          "Float32Array",
          "Float64Array",
          "Function",
          "Int8Array",
          "Int16Array",
          "Int32Array",
          "Map",
          "Math",
          "Object",
          "Promise",
          "RegExp",
          "Set",
          "String",
          "Symbol",
          "TypeError",
          "Uint8Array",
          "Uint8ClampedArray",
          "Uint16Array",
          "Uint32Array",
          "WeakMap",
          "_",
          "clearTimeout",
          "isFinite",
          "parseInt",
          "setTimeout"
        ];
        var templateCounter = -1;
        var typedArrayTags = {};
        typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
        typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
        var cloneableTags = {};
        cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
        cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
        var deburredLetters = {
          // Latin-1 Supplement block.
          "\xC0": "A",
          "\xC1": "A",
          "\xC2": "A",
          "\xC3": "A",
          "\xC4": "A",
          "\xC5": "A",
          "\xE0": "a",
          "\xE1": "a",
          "\xE2": "a",
          "\xE3": "a",
          "\xE4": "a",
          "\xE5": "a",
          "\xC7": "C",
          "\xE7": "c",
          "\xD0": "D",
          "\xF0": "d",
          "\xC8": "E",
          "\xC9": "E",
          "\xCA": "E",
          "\xCB": "E",
          "\xE8": "e",
          "\xE9": "e",
          "\xEA": "e",
          "\xEB": "e",
          "\xCC": "I",
          "\xCD": "I",
          "\xCE": "I",
          "\xCF": "I",
          "\xEC": "i",
          "\xED": "i",
          "\xEE": "i",
          "\xEF": "i",
          "\xD1": "N",
          "\xF1": "n",
          "\xD2": "O",
          "\xD3": "O",
          "\xD4": "O",
          "\xD5": "O",
          "\xD6": "O",
          "\xD8": "O",
          "\xF2": "o",
          "\xF3": "o",
          "\xF4": "o",
          "\xF5": "o",
          "\xF6": "o",
          "\xF8": "o",
          "\xD9": "U",
          "\xDA": "U",
          "\xDB": "U",
          "\xDC": "U",
          "\xF9": "u",
          "\xFA": "u",
          "\xFB": "u",
          "\xFC": "u",
          "\xDD": "Y",
          "\xFD": "y",
          "\xFF": "y",
          "\xC6": "Ae",
          "\xE6": "ae",
          "\xDE": "Th",
          "\xFE": "th",
          "\xDF": "ss",
          // Latin Extended-A block.
          "\u0100": "A",
          "\u0102": "A",
          "\u0104": "A",
          "\u0101": "a",
          "\u0103": "a",
          "\u0105": "a",
          "\u0106": "C",
          "\u0108": "C",
          "\u010A": "C",
          "\u010C": "C",
          "\u0107": "c",
          "\u0109": "c",
          "\u010B": "c",
          "\u010D": "c",
          "\u010E": "D",
          "\u0110": "D",
          "\u010F": "d",
          "\u0111": "d",
          "\u0112": "E",
          "\u0114": "E",
          "\u0116": "E",
          "\u0118": "E",
          "\u011A": "E",
          "\u0113": "e",
          "\u0115": "e",
          "\u0117": "e",
          "\u0119": "e",
          "\u011B": "e",
          "\u011C": "G",
          "\u011E": "G",
          "\u0120": "G",
          "\u0122": "G",
          "\u011D": "g",
          "\u011F": "g",
          "\u0121": "g",
          "\u0123": "g",
          "\u0124": "H",
          "\u0126": "H",
          "\u0125": "h",
          "\u0127": "h",
          "\u0128": "I",
          "\u012A": "I",
          "\u012C": "I",
          "\u012E": "I",
          "\u0130": "I",
          "\u0129": "i",
          "\u012B": "i",
          "\u012D": "i",
          "\u012F": "i",
          "\u0131": "i",
          "\u0134": "J",
          "\u0135": "j",
          "\u0136": "K",
          "\u0137": "k",
          "\u0138": "k",
          "\u0139": "L",
          "\u013B": "L",
          "\u013D": "L",
          "\u013F": "L",
          "\u0141": "L",
          "\u013A": "l",
          "\u013C": "l",
          "\u013E": "l",
          "\u0140": "l",
          "\u0142": "l",
          "\u0143": "N",
          "\u0145": "N",
          "\u0147": "N",
          "\u014A": "N",
          "\u0144": "n",
          "\u0146": "n",
          "\u0148": "n",
          "\u014B": "n",
          "\u014C": "O",
          "\u014E": "O",
          "\u0150": "O",
          "\u014D": "o",
          "\u014F": "o",
          "\u0151": "o",
          "\u0154": "R",
          "\u0156": "R",
          "\u0158": "R",
          "\u0155": "r",
          "\u0157": "r",
          "\u0159": "r",
          "\u015A": "S",
          "\u015C": "S",
          "\u015E": "S",
          "\u0160": "S",
          "\u015B": "s",
          "\u015D": "s",
          "\u015F": "s",
          "\u0161": "s",
          "\u0162": "T",
          "\u0164": "T",
          "\u0166": "T",
          "\u0163": "t",
          "\u0165": "t",
          "\u0167": "t",
          "\u0168": "U",
          "\u016A": "U",
          "\u016C": "U",
          "\u016E": "U",
          "\u0170": "U",
          "\u0172": "U",
          "\u0169": "u",
          "\u016B": "u",
          "\u016D": "u",
          "\u016F": "u",
          "\u0171": "u",
          "\u0173": "u",
          "\u0174": "W",
          "\u0175": "w",
          "\u0176": "Y",
          "\u0177": "y",
          "\u0178": "Y",
          "\u0179": "Z",
          "\u017B": "Z",
          "\u017D": "Z",
          "\u017A": "z",
          "\u017C": "z",
          "\u017E": "z",
          "\u0132": "IJ",
          "\u0133": "ij",
          "\u0152": "Oe",
          "\u0153": "oe",
          "\u0149": "'n",
          "\u017F": "s"
        };
        var htmlEscapes = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        };
        var htmlUnescapes = {
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": '"',
          "&#39;": "'"
        };
        var stringEscapes = {
          "\\": "\\",
          "'": "'",
          "\n": "n",
          "\r": "r",
          "\u2028": "u2028",
          "\u2029": "u2029"
        };
        var freeParseFloat = parseFloat, freeParseInt = parseInt;
        var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
        var freeSelf = typeof self == "object" && self && self.Object === Object && self;
        var root = freeGlobal || freeSelf || Function("return this")();
        var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
        var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
        var moduleExports = freeModule && freeModule.exports === freeExports;
        var freeProcess = moduleExports && freeGlobal.process;
        var nodeUtil = (function() {
          try {
            var types = freeModule && freeModule.require && freeModule.require("util").types;
            if (types) {
              return types;
            }
            return freeProcess && freeProcess.binding && freeProcess.binding("util");
          } catch (e2) {
          }
        })();
        var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
        function apply(func, thisArg, args) {
          switch (args.length) {
            case 0:
              return func.call(thisArg);
            case 1:
              return func.call(thisArg, args[0]);
            case 2:
              return func.call(thisArg, args[0], args[1]);
            case 3:
              return func.call(thisArg, args[0], args[1], args[2]);
          }
          return func.apply(thisArg, args);
        }
        function arrayAggregator(array, setter, iteratee, accumulator) {
          var index = -1, length = array == null ? 0 : array.length;
          while (++index < length) {
            var value = array[index];
            setter(accumulator, value, iteratee(value), array);
          }
          return accumulator;
        }
        function arrayEach(array, iteratee) {
          var index = -1, length = array == null ? 0 : array.length;
          while (++index < length) {
            if (iteratee(array[index], index, array) === false) {
              break;
            }
          }
          return array;
        }
        function arrayEachRight(array, iteratee) {
          var length = array == null ? 0 : array.length;
          while (length--) {
            if (iteratee(array[length], length, array) === false) {
              break;
            }
          }
          return array;
        }
        function arrayEvery(array, predicate) {
          var index = -1, length = array == null ? 0 : array.length;
          while (++index < length) {
            if (!predicate(array[index], index, array)) {
              return false;
            }
          }
          return true;
        }
        function arrayFilter(array, predicate) {
          var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
          while (++index < length) {
            var value = array[index];
            if (predicate(value, index, array)) {
              result[resIndex++] = value;
            }
          }
          return result;
        }
        function arrayIncludes(array, value) {
          var length = array == null ? 0 : array.length;
          return !!length && baseIndexOf(array, value, 0) > -1;
        }
        function arrayIncludesWith(array, value, comparator) {
          var index = -1, length = array == null ? 0 : array.length;
          while (++index < length) {
            if (comparator(value, array[index])) {
              return true;
            }
          }
          return false;
        }
        function arrayMap(array, iteratee) {
          var index = -1, length = array == null ? 0 : array.length, result = Array(length);
          while (++index < length) {
            result[index] = iteratee(array[index], index, array);
          }
          return result;
        }
        function arrayPush(array, values) {
          var index = -1, length = values.length, offset = array.length;
          while (++index < length) {
            array[offset + index] = values[index];
          }
          return array;
        }
        function arrayReduce(array, iteratee, accumulator, initAccum) {
          var index = -1, length = array == null ? 0 : array.length;
          if (initAccum && length) {
            accumulator = array[++index];
          }
          while (++index < length) {
            accumulator = iteratee(accumulator, array[index], index, array);
          }
          return accumulator;
        }
        function arrayReduceRight(array, iteratee, accumulator, initAccum) {
          var length = array == null ? 0 : array.length;
          if (initAccum && length) {
            accumulator = array[--length];
          }
          while (length--) {
            accumulator = iteratee(accumulator, array[length], length, array);
          }
          return accumulator;
        }
        function arraySome(array, predicate) {
          var index = -1, length = array == null ? 0 : array.length;
          while (++index < length) {
            if (predicate(array[index], index, array)) {
              return true;
            }
          }
          return false;
        }
        var asciiSize = baseProperty("length");
        function asciiToArray(string) {
          return string.split("");
        }
        function asciiWords(string) {
          return string.match(reAsciiWord) || [];
        }
        function baseFindKey(collection, predicate, eachFunc) {
          var result;
          eachFunc(collection, function(value, key, collection2) {
            if (predicate(value, key, collection2)) {
              result = key;
              return false;
            }
          });
          return result;
        }
        function baseFindIndex(array, predicate, fromIndex, fromRight) {
          var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
          while (fromRight ? index-- : ++index < length) {
            if (predicate(array[index], index, array)) {
              return index;
            }
          }
          return -1;
        }
        function baseIndexOf(array, value, fromIndex) {
          return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
        }
        function baseIndexOfWith(array, value, fromIndex, comparator) {
          var index = fromIndex - 1, length = array.length;
          while (++index < length) {
            if (comparator(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        function baseIsNaN(value) {
          return value !== value;
        }
        function baseMean(array, iteratee) {
          var length = array == null ? 0 : array.length;
          return length ? baseSum(array, iteratee) / length : NAN;
        }
        function baseProperty(key) {
          return function(object) {
            return object == null ? undefined2 : object[key];
          };
        }
        function basePropertyOf(object) {
          return function(key) {
            return object == null ? undefined2 : object[key];
          };
        }
        function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
          eachFunc(collection, function(value, index, collection2) {
            accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
          });
          return accumulator;
        }
        function baseSortBy(array, comparer) {
          var length = array.length;
          array.sort(comparer);
          while (length--) {
            array[length] = array[length].value;
          }
          return array;
        }
        function baseSum(array, iteratee) {
          var result, index = -1, length = array.length;
          while (++index < length) {
            var current = iteratee(array[index]);
            if (current !== undefined2) {
              result = result === undefined2 ? current : result + current;
            }
          }
          return result;
        }
        function baseTimes(n2, iteratee) {
          var index = -1, result = Array(n2);
          while (++index < n2) {
            result[index] = iteratee(index);
          }
          return result;
        }
        function baseToPairs(object, props) {
          return arrayMap(props, function(key) {
            return [key, object[key]];
          });
        }
        function baseTrim(string) {
          return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
        }
        function baseUnary(func) {
          return function(value) {
            return func(value);
          };
        }
        function baseValues(object, props) {
          return arrayMap(props, function(key) {
            return object[key];
          });
        }
        function cacheHas(cache2, key) {
          return cache2.has(key);
        }
        function charsStartIndex(strSymbols, chrSymbols) {
          var index = -1, length = strSymbols.length;
          while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
          }
          return index;
        }
        function charsEndIndex(strSymbols, chrSymbols) {
          var index = strSymbols.length;
          while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
          }
          return index;
        }
        function countHolders(array, placeholder) {
          var length = array.length, result = 0;
          while (length--) {
            if (array[length] === placeholder) {
              ++result;
            }
          }
          return result;
        }
        var deburrLetter = basePropertyOf(deburredLetters);
        var escapeHtmlChar = basePropertyOf(htmlEscapes);
        function escapeStringChar(chr) {
          return "\\" + stringEscapes[chr];
        }
        function getValue(object, key) {
          return object == null ? undefined2 : object[key];
        }
        function hasUnicode(string) {
          return reHasUnicode.test(string);
        }
        function hasUnicodeWord(string) {
          return reHasUnicodeWord.test(string);
        }
        function iteratorToArray(iterator) {
          var data, result = [];
          while (!(data = iterator.next()).done) {
            result.push(data.value);
          }
          return result;
        }
        function mapToArray(map) {
          var index = -1, result = Array(map.size);
          map.forEach(function(value, key) {
            result[++index] = [key, value];
          });
          return result;
        }
        function overArg(func, transform) {
          return function(arg) {
            return func(transform(arg));
          };
        }
        function replaceHolders(array, placeholder) {
          var index = -1, length = array.length, resIndex = 0, result = [];
          while (++index < length) {
            var value = array[index];
            if (value === placeholder || value === PLACEHOLDER) {
              array[index] = PLACEHOLDER;
              result[resIndex++] = index;
            }
          }
          return result;
        }
        function setToArray(set) {
          var index = -1, result = Array(set.size);
          set.forEach(function(value) {
            result[++index] = value;
          });
          return result;
        }
        function setToPairs(set) {
          var index = -1, result = Array(set.size);
          set.forEach(function(value) {
            result[++index] = [value, value];
          });
          return result;
        }
        function strictIndexOf(array, value, fromIndex) {
          var index = fromIndex - 1, length = array.length;
          while (++index < length) {
            if (array[index] === value) {
              return index;
            }
          }
          return -1;
        }
        function strictLastIndexOf(array, value, fromIndex) {
          var index = fromIndex + 1;
          while (index--) {
            if (array[index] === value) {
              return index;
            }
          }
          return index;
        }
        function stringSize(string) {
          return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
        }
        function stringToArray(string) {
          return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
        }
        function trimmedEndIndex(string) {
          var index = string.length;
          while (index-- && reWhitespace.test(string.charAt(index))) {
          }
          return index;
        }
        var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
        function unicodeSize(string) {
          var result = reUnicode.lastIndex = 0;
          while (reUnicode.test(string)) {
            ++result;
          }
          return result;
        }
        function unicodeToArray(string) {
          return string.match(reUnicode) || [];
        }
        function unicodeWords(string) {
          return string.match(reUnicodeWord) || [];
        }
        var runInContext = (function runInContext2(context) {
          context = context == null ? root : _2.defaults(root.Object(), context, _2.pick(root, contextProps));
          var Array2 = context.Array, Date2 = context.Date, Error2 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String2 = context.String, TypeError2 = context.TypeError;
          var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
          var coreJsData = context["__core-js_shared__"];
          var funcToString = funcProto.toString;
          var hasOwnProperty = objectProto.hasOwnProperty;
          var idCounter = 0;
          var maskSrcKey = (function() {
            var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
            return uid ? "Symbol(src)_1." + uid : "";
          })();
          var nativeObjectToString = objectProto.toString;
          var objectCtorString = funcToString.call(Object2);
          var oldDash = root._;
          var reIsNative = RegExp2(
            "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
          );
          var Buffer2 = moduleExports ? context.Buffer : undefined2, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined2, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined2, symIterator = Symbol2 ? Symbol2.iterator : undefined2, symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined2;
          var defineProperty = (function() {
            try {
              var func = getNative(Object2, "defineProperty");
              func({}, "", {});
              return func;
            } catch (e2) {
            }
          })();
          var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date2 && Date2.now !== root.Date.now && Date2.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
          var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined2, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date2.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
          var DataView = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"), WeakMap2 = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
          var metaMap = WeakMap2 && new WeakMap2();
          var realNames = {};
          var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap2);
          var symbolProto = Symbol2 ? Symbol2.prototype : undefined2, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined2, symbolToString = symbolProto ? symbolProto.toString : undefined2;
          function lodash(value) {
            if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
              if (value instanceof LodashWrapper) {
                return value;
              }
              if (hasOwnProperty.call(value, "__wrapped__")) {
                return wrapperClone(value);
              }
            }
            return new LodashWrapper(value);
          }
          var baseCreate = /* @__PURE__ */ (function() {
            function object() {
            }
            return function(proto) {
              if (!isObject(proto)) {
                return {};
              }
              if (objectCreate) {
                return objectCreate(proto);
              }
              object.prototype = proto;
              var result2 = new object();
              object.prototype = undefined2;
              return result2;
            };
          })();
          function baseLodash() {
          }
          function LodashWrapper(value, chainAll) {
            this.__wrapped__ = value;
            this.__actions__ = [];
            this.__chain__ = !!chainAll;
            this.__index__ = 0;
            this.__values__ = undefined2;
          }
          lodash.templateSettings = {
            /**
             * Used to detect `data` property values to be HTML-escaped.
             *
             * @memberOf _.templateSettings
             * @type {RegExp}
             */
            "escape": reEscape,
            /**
             * Used to detect code to be evaluated.
             *
             * @memberOf _.templateSettings
             * @type {RegExp}
             */
            "evaluate": reEvaluate,
            /**
             * Used to detect `data` property values to inject.
             *
             * @memberOf _.templateSettings
             * @type {RegExp}
             */
            "interpolate": reInterpolate,
            /**
             * Used to reference the data object in the template text.
             *
             * @memberOf _.templateSettings
             * @type {string}
             */
            "variable": "",
            /**
             * Used to import variables into the compiled template.
             *
             * @memberOf _.templateSettings
             * @type {Object}
             */
            "imports": {
              /**
               * A reference to the `lodash` function.
               *
               * @memberOf _.templateSettings.imports
               * @type {Function}
               */
              "_": lodash
            }
          };
          lodash.prototype = baseLodash.prototype;
          lodash.prototype.constructor = lodash;
          LodashWrapper.prototype = baseCreate(baseLodash.prototype);
          LodashWrapper.prototype.constructor = LodashWrapper;
          function LazyWrapper(value) {
            this.__wrapped__ = value;
            this.__actions__ = [];
            this.__dir__ = 1;
            this.__filtered__ = false;
            this.__iteratees__ = [];
            this.__takeCount__ = MAX_ARRAY_LENGTH;
            this.__views__ = [];
          }
          function lazyClone() {
            var result2 = new LazyWrapper(this.__wrapped__);
            result2.__actions__ = copyArray(this.__actions__);
            result2.__dir__ = this.__dir__;
            result2.__filtered__ = this.__filtered__;
            result2.__iteratees__ = copyArray(this.__iteratees__);
            result2.__takeCount__ = this.__takeCount__;
            result2.__views__ = copyArray(this.__views__);
            return result2;
          }
          function lazyReverse() {
            if (this.__filtered__) {
              var result2 = new LazyWrapper(this);
              result2.__dir__ = -1;
              result2.__filtered__ = true;
            } else {
              result2 = this.clone();
              result2.__dir__ *= -1;
            }
            return result2;
          }
          function lazyValue() {
            var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start4 = view.start, end = view.end, length = end - start4, index = isRight ? end : start4 - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
            if (!isArr || !isRight && arrLength == length && takeCount == length) {
              return baseWrapperValue(array, this.__actions__);
            }
            var result2 = [];
            outer:
              while (length-- && resIndex < takeCount) {
                index += dir;
                var iterIndex = -1, value = array[index];
                while (++iterIndex < iterLength) {
                  var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
                  if (type == LAZY_MAP_FLAG) {
                    value = computed;
                  } else if (!computed) {
                    if (type == LAZY_FILTER_FLAG) {
                      continue outer;
                    } else {
                      break outer;
                    }
                  }
                }
                result2[resIndex++] = value;
              }
            return result2;
          }
          LazyWrapper.prototype = baseCreate(baseLodash.prototype);
          LazyWrapper.prototype.constructor = LazyWrapper;
          function Hash(entries) {
            var index = -1, length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function hashClear() {
            this.__data__ = nativeCreate ? nativeCreate(null) : {};
            this.size = 0;
          }
          function hashDelete(key) {
            var result2 = this.has(key) && delete this.__data__[key];
            this.size -= result2 ? 1 : 0;
            return result2;
          }
          function hashGet(key) {
            var data = this.__data__;
            if (nativeCreate) {
              var result2 = data[key];
              return result2 === HASH_UNDEFINED ? undefined2 : result2;
            }
            return hasOwnProperty.call(data, key) ? data[key] : undefined2;
          }
          function hashHas(key) {
            var data = this.__data__;
            return nativeCreate ? data[key] !== undefined2 : hasOwnProperty.call(data, key);
          }
          function hashSet(key, value) {
            var data = this.__data__;
            this.size += this.has(key) ? 0 : 1;
            data[key] = nativeCreate && value === undefined2 ? HASH_UNDEFINED : value;
            return this;
          }
          Hash.prototype.clear = hashClear;
          Hash.prototype["delete"] = hashDelete;
          Hash.prototype.get = hashGet;
          Hash.prototype.has = hashHas;
          Hash.prototype.set = hashSet;
          function ListCache(entries) {
            var index = -1, length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function listCacheClear() {
            this.__data__ = [];
            this.size = 0;
          }
          function listCacheDelete(key) {
            var data = this.__data__, index = assocIndexOf(data, key);
            if (index < 0) {
              return false;
            }
            var lastIndex = data.length - 1;
            if (index == lastIndex) {
              data.pop();
            } else {
              splice.call(data, index, 1);
            }
            --this.size;
            return true;
          }
          function listCacheGet(key) {
            var data = this.__data__, index = assocIndexOf(data, key);
            return index < 0 ? undefined2 : data[index][1];
          }
          function listCacheHas(key) {
            return assocIndexOf(this.__data__, key) > -1;
          }
          function listCacheSet(key, value) {
            var data = this.__data__, index = assocIndexOf(data, key);
            if (index < 0) {
              ++this.size;
              data.push([key, value]);
            } else {
              data[index][1] = value;
            }
            return this;
          }
          ListCache.prototype.clear = listCacheClear;
          ListCache.prototype["delete"] = listCacheDelete;
          ListCache.prototype.get = listCacheGet;
          ListCache.prototype.has = listCacheHas;
          ListCache.prototype.set = listCacheSet;
          function MapCache(entries) {
            var index = -1, length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function mapCacheClear() {
            this.size = 0;
            this.__data__ = {
              "hash": new Hash(),
              "map": new (Map2 || ListCache)(),
              "string": new Hash()
            };
          }
          function mapCacheDelete(key) {
            var result2 = getMapData(this, key)["delete"](key);
            this.size -= result2 ? 1 : 0;
            return result2;
          }
          function mapCacheGet(key) {
            return getMapData(this, key).get(key);
          }
          function mapCacheHas(key) {
            return getMapData(this, key).has(key);
          }
          function mapCacheSet(key, value) {
            var data = getMapData(this, key), size2 = data.size;
            data.set(key, value);
            this.size += data.size == size2 ? 0 : 1;
            return this;
          }
          MapCache.prototype.clear = mapCacheClear;
          MapCache.prototype["delete"] = mapCacheDelete;
          MapCache.prototype.get = mapCacheGet;
          MapCache.prototype.has = mapCacheHas;
          MapCache.prototype.set = mapCacheSet;
          function SetCache(values2) {
            var index = -1, length = values2 == null ? 0 : values2.length;
            this.__data__ = new MapCache();
            while (++index < length) {
              this.add(values2[index]);
            }
          }
          function setCacheAdd(value) {
            this.__data__.set(value, HASH_UNDEFINED);
            return this;
          }
          function setCacheHas(value) {
            return this.__data__.has(value);
          }
          SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
          SetCache.prototype.has = setCacheHas;
          function Stack(entries) {
            var data = this.__data__ = new ListCache(entries);
            this.size = data.size;
          }
          function stackClear() {
            this.__data__ = new ListCache();
            this.size = 0;
          }
          function stackDelete(key) {
            var data = this.__data__, result2 = data["delete"](key);
            this.size = data.size;
            return result2;
          }
          function stackGet(key) {
            return this.__data__.get(key);
          }
          function stackHas(key) {
            return this.__data__.has(key);
          }
          function stackSet(key, value) {
            var data = this.__data__;
            if (data instanceof ListCache) {
              var pairs = data.__data__;
              if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
                pairs.push([key, value]);
                this.size = ++data.size;
                return this;
              }
              data = this.__data__ = new MapCache(pairs);
            }
            data.set(key, value);
            this.size = data.size;
            return this;
          }
          Stack.prototype.clear = stackClear;
          Stack.prototype["delete"] = stackDelete;
          Stack.prototype.get = stackGet;
          Stack.prototype.has = stackHas;
          Stack.prototype.set = stackSet;
          function arrayLikeKeys(value, inherited) {
            var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String2) : [], length = result2.length;
            for (var key in value) {
              if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
              (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
              isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
              isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
              isIndex(key, length)))) {
                result2.push(key);
              }
            }
            return result2;
          }
          function arraySample(array) {
            var length = array.length;
            return length ? array[baseRandom(0, length - 1)] : undefined2;
          }
          function arraySampleSize(array, n2) {
            return shuffleSelf(copyArray(array), baseClamp(n2, 0, array.length));
          }
          function arrayShuffle(array) {
            return shuffleSelf(copyArray(array));
          }
          function assignMergeValue(object, key, value) {
            if (value !== undefined2 && !eq(object[key], value) || value === undefined2 && !(key in object)) {
              baseAssignValue(object, key, value);
            }
          }
          function assignValue(object, key, value) {
            var objValue = object[key];
            if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined2 && !(key in object)) {
              baseAssignValue(object, key, value);
            }
          }
          function assocIndexOf(array, key) {
            var length = array.length;
            while (length--) {
              if (eq(array[length][0], key)) {
                return length;
              }
            }
            return -1;
          }
          function baseAggregator(collection, setter, iteratee2, accumulator) {
            baseEach(collection, function(value, key, collection2) {
              setter(accumulator, value, iteratee2(value), collection2);
            });
            return accumulator;
          }
          function baseAssign(object, source) {
            return object && copyObject(source, keys(source), object);
          }
          function baseAssignIn(object, source) {
            return object && copyObject(source, keysIn(source), object);
          }
          function baseAssignValue(object, key, value) {
            if (key == "__proto__" && defineProperty) {
              defineProperty(object, key, {
                "configurable": true,
                "enumerable": true,
                "value": value,
                "writable": true
              });
            } else {
              object[key] = value;
            }
          }
          function baseAt(object, paths) {
            var index = -1, length = paths.length, result2 = Array2(length), skip = object == null;
            while (++index < length) {
              result2[index] = skip ? undefined2 : get(object, paths[index]);
            }
            return result2;
          }
          function baseClamp(number, lower, upper) {
            if (number === number) {
              if (upper !== undefined2) {
                number = number <= upper ? number : upper;
              }
              if (lower !== undefined2) {
                number = number >= lower ? number : lower;
              }
            }
            return number;
          }
          function baseClone(value, bitmask, customizer, key, object, stack) {
            var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
            if (customizer) {
              result2 = object ? customizer(value, key, object, stack) : customizer(value);
            }
            if (result2 !== undefined2) {
              return result2;
            }
            if (!isObject(value)) {
              return value;
            }
            var isArr = isArray(value);
            if (isArr) {
              result2 = initCloneArray(value);
              if (!isDeep) {
                return copyArray(value, result2);
              }
            } else {
              var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
              if (isBuffer(value)) {
                return cloneBuffer(value, isDeep);
              }
              if (tag == objectTag || tag == argsTag || isFunc && !object) {
                result2 = isFlat || isFunc ? {} : initCloneObject(value);
                if (!isDeep) {
                  return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
                }
              } else {
                if (!cloneableTags[tag]) {
                  return object ? value : {};
                }
                result2 = initCloneByTag(value, tag, isDeep);
              }
            }
            stack || (stack = new Stack());
            var stacked = stack.get(value);
            if (stacked) {
              return stacked;
            }
            stack.set(value, result2);
            if (isSet(value)) {
              value.forEach(function(subValue) {
                result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
              });
            } else if (isMap(value)) {
              value.forEach(function(subValue, key2) {
                result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
              });
            }
            var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
            var props = isArr ? undefined2 : keysFunc(value);
            arrayEach(props || value, function(subValue, key2) {
              if (props) {
                key2 = subValue;
                subValue = value[key2];
              }
              assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
            });
            return result2;
          }
          function baseConforms(source) {
            var props = keys(source);
            return function(object) {
              return baseConformsTo(object, source, props);
            };
          }
          function baseConformsTo(object, source, props) {
            var length = props.length;
            if (object == null) {
              return !length;
            }
            object = Object2(object);
            while (length--) {
              var key = props[length], predicate = source[key], value = object[key];
              if (value === undefined2 && !(key in object) || !predicate(value)) {
                return false;
              }
            }
            return true;
          }
          function baseDelay(func, wait, args) {
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            return setTimeout2(function() {
              func.apply(undefined2, args);
            }, wait);
          }
          function baseDifference(array, values2, iteratee2, comparator) {
            var index = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
            if (!length) {
              return result2;
            }
            if (iteratee2) {
              values2 = arrayMap(values2, baseUnary(iteratee2));
            }
            if (comparator) {
              includes2 = arrayIncludesWith;
              isCommon = false;
            } else if (values2.length >= LARGE_ARRAY_SIZE) {
              includes2 = cacheHas;
              isCommon = false;
              values2 = new SetCache(values2);
            }
            outer:
              while (++index < length) {
                var value = array[index], computed = iteratee2 == null ? value : iteratee2(value);
                value = comparator || value !== 0 ? value : 0;
                if (isCommon && computed === computed) {
                  var valuesIndex = valuesLength;
                  while (valuesIndex--) {
                    if (values2[valuesIndex] === computed) {
                      continue outer;
                    }
                  }
                  result2.push(value);
                } else if (!includes2(values2, computed, comparator)) {
                  result2.push(value);
                }
              }
            return result2;
          }
          var baseEach = createBaseEach(baseForOwn);
          var baseEachRight = createBaseEach(baseForOwnRight, true);
          function baseEvery(collection, predicate) {
            var result2 = true;
            baseEach(collection, function(value, index, collection2) {
              result2 = !!predicate(value, index, collection2);
              return result2;
            });
            return result2;
          }
          function baseExtremum(array, iteratee2, comparator) {
            var index = -1, length = array.length;
            while (++index < length) {
              var value = array[index], current = iteratee2(value);
              if (current != null && (computed === undefined2 ? current === current && !isSymbol(current) : comparator(current, computed))) {
                var computed = current, result2 = value;
              }
            }
            return result2;
          }
          function baseFill(array, value, start4, end) {
            var length = array.length;
            start4 = toInteger(start4);
            if (start4 < 0) {
              start4 = -start4 > length ? 0 : length + start4;
            }
            end = end === undefined2 || end > length ? length : toInteger(end);
            if (end < 0) {
              end += length;
            }
            end = start4 > end ? 0 : toLength(end);
            while (start4 < end) {
              array[start4++] = value;
            }
            return array;
          }
          function baseFilter(collection, predicate) {
            var result2 = [];
            baseEach(collection, function(value, index, collection2) {
              if (predicate(value, index, collection2)) {
                result2.push(value);
              }
            });
            return result2;
          }
          function baseFlatten(array, depth, predicate, isStrict, result2) {
            var index = -1, length = array.length;
            predicate || (predicate = isFlattenable);
            result2 || (result2 = []);
            while (++index < length) {
              var value = array[index];
              if (depth > 0 && predicate(value)) {
                if (depth > 1) {
                  baseFlatten(value, depth - 1, predicate, isStrict, result2);
                } else {
                  arrayPush(result2, value);
                }
              } else if (!isStrict) {
                result2[result2.length] = value;
              }
            }
            return result2;
          }
          var baseFor = createBaseFor();
          var baseForRight = createBaseFor(true);
          function baseForOwn(object, iteratee2) {
            return object && baseFor(object, iteratee2, keys);
          }
          function baseForOwnRight(object, iteratee2) {
            return object && baseForRight(object, iteratee2, keys);
          }
          function baseFunctions(object, props) {
            return arrayFilter(props, function(key) {
              return isFunction(object[key]);
            });
          }
          function baseGet(object, path) {
            path = castPath(path, object);
            var index = 0, length = path.length;
            while (object != null && index < length) {
              object = object[toKey(path[index++])];
            }
            return index && index == length ? object : undefined2;
          }
          function baseGetAllKeys(object, keysFunc, symbolsFunc) {
            var result2 = keysFunc(object);
            return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
          }
          function baseGetTag(value) {
            if (value == null) {
              return value === undefined2 ? undefinedTag : nullTag;
            }
            return symToStringTag && symToStringTag in Object2(value) ? getRawTag(value) : objectToString(value);
          }
          function baseGt(value, other) {
            return value > other;
          }
          function baseHas(object, key) {
            return object != null && hasOwnProperty.call(object, key);
          }
          function baseHasIn(object, key) {
            return object != null && key in Object2(object);
          }
          function baseInRange(number, start4, end) {
            return number >= nativeMin(start4, end) && number < nativeMax(start4, end);
          }
          function baseIntersection(arrays, iteratee2, comparator) {
            var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
            while (othIndex--) {
              var array = arrays[othIndex];
              if (othIndex && iteratee2) {
                array = arrayMap(array, baseUnary(iteratee2));
              }
              maxLength = nativeMin(array.length, maxLength);
              caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined2;
            }
            array = arrays[0];
            var index = -1, seen = caches[0];
            outer:
              while (++index < length && result2.length < maxLength) {
                var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
                value = comparator || value !== 0 ? value : 0;
                if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
                  othIndex = othLength;
                  while (--othIndex) {
                    var cache2 = caches[othIndex];
                    if (!(cache2 ? cacheHas(cache2, computed) : includes2(arrays[othIndex], computed, comparator))) {
                      continue outer;
                    }
                  }
                  if (seen) {
                    seen.push(computed);
                  }
                  result2.push(value);
                }
              }
            return result2;
          }
          function baseInverter(object, setter, iteratee2, accumulator) {
            baseForOwn(object, function(value, key, object2) {
              setter(accumulator, iteratee2(value), key, object2);
            });
            return accumulator;
          }
          function baseInvoke(object, path, args) {
            path = castPath(path, object);
            object = parent(object, path);
            var func = object == null ? object : object[toKey(last(path))];
            return func == null ? undefined2 : apply(func, object, args);
          }
          function baseIsArguments(value) {
            return isObjectLike(value) && baseGetTag(value) == argsTag;
          }
          function baseIsArrayBuffer(value) {
            return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
          }
          function baseIsDate(value) {
            return isObjectLike(value) && baseGetTag(value) == dateTag;
          }
          function baseIsEqual(value, other, bitmask, customizer, stack) {
            if (value === other) {
              return true;
            }
            if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
              return value !== value && other !== other;
            }
            return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
          }
          function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
            var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
            objTag = objTag == argsTag ? objectTag : objTag;
            othTag = othTag == argsTag ? objectTag : othTag;
            var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
            if (isSameTag && isBuffer(object)) {
              if (!isBuffer(other)) {
                return false;
              }
              objIsArr = true;
              objIsObj = false;
            }
            if (isSameTag && !objIsObj) {
              stack || (stack = new Stack());
              return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
            }
            if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
              var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
              if (objIsWrapped || othIsWrapped) {
                var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
                stack || (stack = new Stack());
                return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
              }
            }
            if (!isSameTag) {
              return false;
            }
            stack || (stack = new Stack());
            return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
          }
          function baseIsMap(value) {
            return isObjectLike(value) && getTag(value) == mapTag;
          }
          function baseIsMatch(object, source, matchData, customizer) {
            var index = matchData.length, length = index, noCustomizer = !customizer;
            if (object == null) {
              return !length;
            }
            object = Object2(object);
            while (index--) {
              var data = matchData[index];
              if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
                return false;
              }
            }
            while (++index < length) {
              data = matchData[index];
              var key = data[0], objValue = object[key], srcValue = data[1];
              if (noCustomizer && data[2]) {
                if (objValue === undefined2 && !(key in object)) {
                  return false;
                }
              } else {
                var stack = new Stack();
                if (customizer) {
                  var result2 = customizer(objValue, srcValue, key, object, source, stack);
                }
                if (!(result2 === undefined2 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
                  return false;
                }
              }
            }
            return true;
          }
          function baseIsNative(value) {
            if (!isObject(value) || isMasked(value)) {
              return false;
            }
            var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
            return pattern.test(toSource(value));
          }
          function baseIsRegExp(value) {
            return isObjectLike(value) && baseGetTag(value) == regexpTag;
          }
          function baseIsSet(value) {
            return isObjectLike(value) && getTag(value) == setTag;
          }
          function baseIsTypedArray(value) {
            return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
          }
          function baseIteratee(value) {
            if (typeof value == "function") {
              return value;
            }
            if (value == null) {
              return identity;
            }
            if (typeof value == "object") {
              return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
            }
            return property(value);
          }
          function baseKeys(object) {
            if (!isPrototype(object)) {
              return nativeKeys(object);
            }
            var result2 = [];
            for (var key in Object2(object)) {
              if (hasOwnProperty.call(object, key) && key != "constructor") {
                result2.push(key);
              }
            }
            return result2;
          }
          function baseKeysIn(object) {
            if (!isObject(object)) {
              return nativeKeysIn(object);
            }
            var isProto = isPrototype(object), result2 = [];
            for (var key in object) {
              if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
                result2.push(key);
              }
            }
            return result2;
          }
          function baseLt(value, other) {
            return value < other;
          }
          function baseMap(collection, iteratee2) {
            var index = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
            baseEach(collection, function(value, key, collection2) {
              result2[++index] = iteratee2(value, key, collection2);
            });
            return result2;
          }
          function baseMatches(source) {
            var matchData = getMatchData(source);
            if (matchData.length == 1 && matchData[0][2]) {
              return matchesStrictComparable(matchData[0][0], matchData[0][1]);
            }
            return function(object) {
              return object === source || baseIsMatch(object, source, matchData);
            };
          }
          function baseMatchesProperty(path, srcValue) {
            if (isKey(path) && isStrictComparable(srcValue)) {
              return matchesStrictComparable(toKey(path), srcValue);
            }
            return function(object) {
              var objValue = get(object, path);
              return objValue === undefined2 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
            };
          }
          function baseMerge(object, source, srcIndex, customizer, stack) {
            if (object === source) {
              return;
            }
            baseFor(source, function(srcValue, key) {
              stack || (stack = new Stack());
              if (isObject(srcValue)) {
                baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
              } else {
                var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined2;
                if (newValue === undefined2) {
                  newValue = srcValue;
                }
                assignMergeValue(object, key, newValue);
              }
            }, keysIn);
          }
          function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
            var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
            if (stacked) {
              assignMergeValue(object, key, stacked);
              return;
            }
            var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined2;
            var isCommon = newValue === undefined2;
            if (isCommon) {
              var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
              newValue = srcValue;
              if (isArr || isBuff || isTyped) {
                if (isArray(objValue)) {
                  newValue = objValue;
                } else if (isArrayLikeObject(objValue)) {
                  newValue = copyArray(objValue);
                } else if (isBuff) {
                  isCommon = false;
                  newValue = cloneBuffer(srcValue, true);
                } else if (isTyped) {
                  isCommon = false;
                  newValue = cloneTypedArray(srcValue, true);
                } else {
                  newValue = [];
                }
              } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                newValue = objValue;
                if (isArguments(objValue)) {
                  newValue = toPlainObject(objValue);
                } else if (!isObject(objValue) || isFunction(objValue)) {
                  newValue = initCloneObject(srcValue);
                }
              } else {
                isCommon = false;
              }
            }
            if (isCommon) {
              stack.set(srcValue, newValue);
              mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
              stack["delete"](srcValue);
            }
            assignMergeValue(object, key, newValue);
          }
          function baseNth(array, n2) {
            var length = array.length;
            if (!length) {
              return;
            }
            n2 += n2 < 0 ? length : 0;
            return isIndex(n2, length) ? array[n2] : undefined2;
          }
          function baseOrderBy(collection, iteratees, orders) {
            if (iteratees.length) {
              iteratees = arrayMap(iteratees, function(iteratee2) {
                if (isArray(iteratee2)) {
                  return function(value) {
                    return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
                  };
                }
                return iteratee2;
              });
            } else {
              iteratees = [identity];
            }
            var index = -1;
            iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
            var result2 = baseMap(collection, function(value, key, collection2) {
              var criteria = arrayMap(iteratees, function(iteratee2) {
                return iteratee2(value);
              });
              return { "criteria": criteria, "index": ++index, "value": value };
            });
            return baseSortBy(result2, function(object, other) {
              return compareMultiple(object, other, orders);
            });
          }
          function basePick(object, paths) {
            return basePickBy(object, paths, function(value, path) {
              return hasIn(object, path);
            });
          }
          function basePickBy(object, paths, predicate) {
            var index = -1, length = paths.length, result2 = {};
            while (++index < length) {
              var path = paths[index], value = baseGet(object, path);
              if (predicate(value, path)) {
                baseSet(result2, castPath(path, object), value);
              }
            }
            return result2;
          }
          function basePropertyDeep(path) {
            return function(object) {
              return baseGet(object, path);
            };
          }
          function basePullAll(array, values2, iteratee2, comparator) {
            var indexOf4 = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array;
            if (array === values2) {
              values2 = copyArray(values2);
            }
            if (iteratee2) {
              seen = arrayMap(array, baseUnary(iteratee2));
            }
            while (++index < length) {
              var fromIndex = 0, value = values2[index], computed = iteratee2 ? iteratee2(value) : value;
              while ((fromIndex = indexOf4(seen, computed, fromIndex, comparator)) > -1) {
                if (seen !== array) {
                  splice.call(seen, fromIndex, 1);
                }
                splice.call(array, fromIndex, 1);
              }
            }
            return array;
          }
          function basePullAt(array, indexes) {
            var length = array ? indexes.length : 0, lastIndex = length - 1;
            while (length--) {
              var index = indexes[length];
              if (length == lastIndex || index !== previous) {
                var previous = index;
                if (isIndex(index)) {
                  splice.call(array, index, 1);
                } else {
                  baseUnset(array, index);
                }
              }
            }
            return array;
          }
          function baseRandom(lower, upper) {
            return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
          }
          function baseRange(start4, end, step, fromRight) {
            var index = -1, length = nativeMax(nativeCeil((end - start4) / (step || 1)), 0), result2 = Array2(length);
            while (length--) {
              result2[fromRight ? length : ++index] = start4;
              start4 += step;
            }
            return result2;
          }
          function baseRepeat(string, n2) {
            var result2 = "";
            if (!string || n2 < 1 || n2 > MAX_SAFE_INTEGER) {
              return result2;
            }
            do {
              if (n2 % 2) {
                result2 += string;
              }
              n2 = nativeFloor(n2 / 2);
              if (n2) {
                string += string;
              }
            } while (n2);
            return result2;
          }
          function baseRest(func, start4) {
            return setToString(overRest(func, start4, identity), func + "");
          }
          function baseSample(collection) {
            return arraySample(values(collection));
          }
          function baseSampleSize(collection, n2) {
            var array = values(collection);
            return shuffleSelf(array, baseClamp(n2, 0, array.length));
          }
          function baseSet(object, path, value, customizer) {
            if (!isObject(object)) {
              return object;
            }
            path = castPath(path, object);
            var index = -1, length = path.length, lastIndex = length - 1, nested = object;
            while (nested != null && ++index < length) {
              var key = toKey(path[index]), newValue = value;
              if (key === "__proto__" || key === "constructor" || key === "prototype") {
                return object;
              }
              if (index != lastIndex) {
                var objValue = nested[key];
                newValue = customizer ? customizer(objValue, key, nested) : undefined2;
                if (newValue === undefined2) {
                  newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
                }
              }
              assignValue(nested, key, newValue);
              nested = nested[key];
            }
            return object;
          }
          var baseSetData = !metaMap ? identity : function(func, data) {
            metaMap.set(func, data);
            return func;
          };
          var baseSetToString = !defineProperty ? identity : function(func, string) {
            return defineProperty(func, "toString", {
              "configurable": true,
              "enumerable": false,
              "value": constant(string),
              "writable": true
            });
          };
          function baseShuffle(collection) {
            return shuffleSelf(values(collection));
          }
          function baseSlice(array, start4, end) {
            var index = -1, length = array.length;
            if (start4 < 0) {
              start4 = -start4 > length ? 0 : length + start4;
            }
            end = end > length ? length : end;
            if (end < 0) {
              end += length;
            }
            length = start4 > end ? 0 : end - start4 >>> 0;
            start4 >>>= 0;
            var result2 = Array2(length);
            while (++index < length) {
              result2[index] = array[index + start4];
            }
            return result2;
          }
          function baseSome(collection, predicate) {
            var result2;
            baseEach(collection, function(value, index, collection2) {
              result2 = predicate(value, index, collection2);
              return !result2;
            });
            return !!result2;
          }
          function baseSortedIndex(array, value, retHighest) {
            var low = 0, high = array == null ? low : array.length;
            if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
              while (low < high) {
                var mid = low + high >>> 1, computed = array[mid];
                if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
                  low = mid + 1;
                } else {
                  high = mid;
                }
              }
              return high;
            }
            return baseSortedIndexBy(array, value, identity, retHighest);
          }
          function baseSortedIndexBy(array, value, iteratee2, retHighest) {
            var low = 0, high = array == null ? 0 : array.length;
            if (high === 0) {
              return 0;
            }
            value = iteratee2(value);
            var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined2;
            while (low < high) {
              var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined2, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
              if (valIsNaN) {
                var setLow = retHighest || othIsReflexive;
              } else if (valIsUndefined) {
                setLow = othIsReflexive && (retHighest || othIsDefined);
              } else if (valIsNull) {
                setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
              } else if (valIsSymbol) {
                setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
              } else if (othIsNull || othIsSymbol) {
                setLow = false;
              } else {
                setLow = retHighest ? computed <= value : computed < value;
              }
              if (setLow) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return nativeMin(high, MAX_ARRAY_INDEX);
          }
          function baseSortedUniq(array, iteratee2) {
            var index = -1, length = array.length, resIndex = 0, result2 = [];
            while (++index < length) {
              var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
              if (!index || !eq(computed, seen)) {
                var seen = computed;
                result2[resIndex++] = value === 0 ? 0 : value;
              }
            }
            return result2;
          }
          function baseToNumber(value) {
            if (typeof value == "number") {
              return value;
            }
            if (isSymbol(value)) {
              return NAN;
            }
            return +value;
          }
          function baseToString(value) {
            if (typeof value == "string") {
              return value;
            }
            if (isArray(value)) {
              return arrayMap(value, baseToString) + "";
            }
            if (isSymbol(value)) {
              return symbolToString ? symbolToString.call(value) : "";
            }
            var result2 = value + "";
            return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
          }
          function baseUniq(array, iteratee2, comparator) {
            var index = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
            if (comparator) {
              isCommon = false;
              includes2 = arrayIncludesWith;
            } else if (length >= LARGE_ARRAY_SIZE) {
              var set2 = iteratee2 ? null : createSet(array);
              if (set2) {
                return setToArray(set2);
              }
              isCommon = false;
              includes2 = cacheHas;
              seen = new SetCache();
            } else {
              seen = iteratee2 ? [] : result2;
            }
            outer:
              while (++index < length) {
                var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
                value = comparator || value !== 0 ? value : 0;
                if (isCommon && computed === computed) {
                  var seenIndex = seen.length;
                  while (seenIndex--) {
                    if (seen[seenIndex] === computed) {
                      continue outer;
                    }
                  }
                  if (iteratee2) {
                    seen.push(computed);
                  }
                  result2.push(value);
                } else if (!includes2(seen, computed, comparator)) {
                  if (seen !== result2) {
                    seen.push(computed);
                  }
                  result2.push(value);
                }
              }
            return result2;
          }
          function baseUnset(object, path) {
            path = castPath(path, object);
            object = parent(object, path);
            return object == null || delete object[toKey(last(path))];
          }
          function baseUpdate(object, path, updater, customizer) {
            return baseSet(object, path, updater(baseGet(object, path)), customizer);
          }
          function baseWhile(array, predicate, isDrop, fromRight) {
            var length = array.length, index = fromRight ? length : -1;
            while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {
            }
            return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
          }
          function baseWrapperValue(value, actions) {
            var result2 = value;
            if (result2 instanceof LazyWrapper) {
              result2 = result2.value();
            }
            return arrayReduce(actions, function(result3, action) {
              return action.func.apply(action.thisArg, arrayPush([result3], action.args));
            }, result2);
          }
          function baseXor(arrays, iteratee2, comparator) {
            var length = arrays.length;
            if (length < 2) {
              return length ? baseUniq(arrays[0]) : [];
            }
            var index = -1, result2 = Array2(length);
            while (++index < length) {
              var array = arrays[index], othIndex = -1;
              while (++othIndex < length) {
                if (othIndex != index) {
                  result2[index] = baseDifference(result2[index] || array, arrays[othIndex], iteratee2, comparator);
                }
              }
            }
            return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
          }
          function baseZipObject(props, values2, assignFunc) {
            var index = -1, length = props.length, valsLength = values2.length, result2 = {};
            while (++index < length) {
              var value = index < valsLength ? values2[index] : undefined2;
              assignFunc(result2, props[index], value);
            }
            return result2;
          }
          function castArrayLikeObject(value) {
            return isArrayLikeObject(value) ? value : [];
          }
          function castFunction(value) {
            return typeof value == "function" ? value : identity;
          }
          function castPath(value, object) {
            if (isArray(value)) {
              return value;
            }
            return isKey(value, object) ? [value] : stringToPath(toString(value));
          }
          var castRest = baseRest;
          function castSlice(array, start4, end) {
            var length = array.length;
            end = end === undefined2 ? length : end;
            return !start4 && end >= length ? array : baseSlice(array, start4, end);
          }
          var clearTimeout2 = ctxClearTimeout || function(id3) {
            return root.clearTimeout(id3);
          };
          function cloneBuffer(buffer, isDeep) {
            if (isDeep) {
              return buffer.slice();
            }
            var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
            buffer.copy(result2);
            return result2;
          }
          function cloneArrayBuffer(arrayBuffer) {
            var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
            new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
            return result2;
          }
          function cloneDataView(dataView, isDeep) {
            var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
            return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
          }
          function cloneRegExp(regexp) {
            var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
            result2.lastIndex = regexp.lastIndex;
            return result2;
          }
          function cloneSymbol(symbol) {
            return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
          }
          function cloneTypedArray(typedArray, isDeep) {
            var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
            return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
          }
          function compareAscending(value, other) {
            if (value !== other) {
              var valIsDefined = value !== undefined2, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
              var othIsDefined = other !== undefined2, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
              if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
                return 1;
              }
              if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
                return -1;
              }
            }
            return 0;
          }
          function compareMultiple(object, other, orders) {
            var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
            while (++index < length) {
              var result2 = compareAscending(objCriteria[index], othCriteria[index]);
              if (result2) {
                if (index >= ordersLength) {
                  return result2;
                }
                var order = orders[index];
                return result2 * (order == "desc" ? -1 : 1);
              }
            }
            return object.index - other.index;
          }
          function composeArgs(args, partials, holders, isCurried) {
            var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
            while (++leftIndex < leftLength) {
              result2[leftIndex] = partials[leftIndex];
            }
            while (++argsIndex < holdersLength) {
              if (isUncurried || argsIndex < argsLength) {
                result2[holders[argsIndex]] = args[argsIndex];
              }
            }
            while (rangeLength--) {
              result2[leftIndex++] = args[argsIndex++];
            }
            return result2;
          }
          function composeArgsRight(args, partials, holders, isCurried) {
            var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
            while (++argsIndex < rangeLength) {
              result2[argsIndex] = args[argsIndex];
            }
            var offset = argsIndex;
            while (++rightIndex < rightLength) {
              result2[offset + rightIndex] = partials[rightIndex];
            }
            while (++holdersIndex < holdersLength) {
              if (isUncurried || argsIndex < argsLength) {
                result2[offset + holders[holdersIndex]] = args[argsIndex++];
              }
            }
            return result2;
          }
          function copyArray(source, array) {
            var index = -1, length = source.length;
            array || (array = Array2(length));
            while (++index < length) {
              array[index] = source[index];
            }
            return array;
          }
          function copyObject(source, props, object, customizer) {
            var isNew = !object;
            object || (object = {});
            var index = -1, length = props.length;
            while (++index < length) {
              var key = props[index];
              var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined2;
              if (newValue === undefined2) {
                newValue = source[key];
              }
              if (isNew) {
                baseAssignValue(object, key, newValue);
              } else {
                assignValue(object, key, newValue);
              }
            }
            return object;
          }
          function copySymbols(source, object) {
            return copyObject(source, getSymbols(source), object);
          }
          function copySymbolsIn(source, object) {
            return copyObject(source, getSymbolsIn(source), object);
          }
          function createAggregator(setter, initializer) {
            return function(collection, iteratee2) {
              var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
              return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
            };
          }
          function createAssigner(assigner) {
            return baseRest(function(object, sources) {
              var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined2, guard = length > 2 ? sources[2] : undefined2;
              customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined2;
              if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                customizer = length < 3 ? undefined2 : customizer;
                length = 1;
              }
              object = Object2(object);
              while (++index < length) {
                var source = sources[index];
                if (source) {
                  assigner(object, source, index, customizer);
                }
              }
              return object;
            });
          }
          function createBaseEach(eachFunc, fromRight) {
            return function(collection, iteratee2) {
              if (collection == null) {
                return collection;
              }
              if (!isArrayLike(collection)) {
                return eachFunc(collection, iteratee2);
              }
              var length = collection.length, index = fromRight ? length : -1, iterable = Object2(collection);
              while (fromRight ? index-- : ++index < length) {
                if (iteratee2(iterable[index], index, iterable) === false) {
                  break;
                }
              }
              return collection;
            };
          }
          function createBaseFor(fromRight) {
            return function(object, iteratee2, keysFunc) {
              var index = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
              while (length--) {
                var key = props[fromRight ? length : ++index];
                if (iteratee2(iterable[key], key, iterable) === false) {
                  break;
                }
              }
              return object;
            };
          }
          function createBind(func, bitmask, thisArg) {
            var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
            function wrapper() {
              var fn2 = this && this !== root && this instanceof wrapper ? Ctor : func;
              return fn2.apply(isBind ? thisArg : this, arguments);
            }
            return wrapper;
          }
          function createCaseFirst(methodName) {
            return function(string) {
              string = toString(string);
              var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined2;
              var chr = strSymbols ? strSymbols[0] : string.charAt(0);
              var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
              return chr[methodName]() + trailing;
            };
          }
          function createCompounder(callback) {
            return function(string) {
              return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
            };
          }
          function createCtor(Ctor) {
            return function() {
              var args = arguments;
              switch (args.length) {
                case 0:
                  return new Ctor();
                case 1:
                  return new Ctor(args[0]);
                case 2:
                  return new Ctor(args[0], args[1]);
                case 3:
                  return new Ctor(args[0], args[1], args[2]);
                case 4:
                  return new Ctor(args[0], args[1], args[2], args[3]);
                case 5:
                  return new Ctor(args[0], args[1], args[2], args[3], args[4]);
                case 6:
                  return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
                case 7:
                  return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
              }
              var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
              return isObject(result2) ? result2 : thisBinding;
            };
          }
          function createCurry(func, bitmask, arity) {
            var Ctor = createCtor(func);
            function wrapper() {
              var length = arguments.length, args = Array2(length), index = length, placeholder = getHolder(wrapper);
              while (index--) {
                args[index] = arguments[index];
              }
              var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
              length -= holders.length;
              if (length < arity) {
                return createRecurry(
                  func,
                  bitmask,
                  createHybrid,
                  wrapper.placeholder,
                  undefined2,
                  args,
                  holders,
                  undefined2,
                  undefined2,
                  arity - length
                );
              }
              var fn2 = this && this !== root && this instanceof wrapper ? Ctor : func;
              return apply(fn2, this, args);
            }
            return wrapper;
          }
          function createFind(findIndexFunc) {
            return function(collection, predicate, fromIndex) {
              var iterable = Object2(collection);
              if (!isArrayLike(collection)) {
                var iteratee2 = getIteratee(predicate, 3);
                collection = keys(collection);
                predicate = function(key) {
                  return iteratee2(iterable[key], key, iterable);
                };
              }
              var index = findIndexFunc(collection, predicate, fromIndex);
              return index > -1 ? iterable[iteratee2 ? collection[index] : index] : undefined2;
            };
          }
          function createFlow(fromRight) {
            return flatRest(function(funcs) {
              var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
              if (fromRight) {
                funcs.reverse();
              }
              while (index--) {
                var func = funcs[index];
                if (typeof func != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                if (prereq && !wrapper && getFuncName(func) == "wrapper") {
                  var wrapper = new LodashWrapper([], true);
                }
              }
              index = wrapper ? index : length;
              while (++index < length) {
                func = funcs[index];
                var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined2;
                if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
                  wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
                } else {
                  wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
                }
              }
              return function() {
                var args = arguments, value = args[0];
                if (wrapper && args.length == 1 && isArray(value)) {
                  return wrapper.plant(value).value();
                }
                var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
                while (++index2 < length) {
                  result2 = funcs[index2].call(this, result2);
                }
                return result2;
              };
            });
          }
          function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
            var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined2 : createCtor(func);
            function wrapper() {
              var length = arguments.length, args = Array2(length), index = length;
              while (index--) {
                args[index] = arguments[index];
              }
              if (isCurried) {
                var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
              }
              if (partials) {
                args = composeArgs(args, partials, holders, isCurried);
              }
              if (partialsRight) {
                args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
              }
              length -= holdersCount;
              if (isCurried && length < arity) {
                var newHolders = replaceHolders(args, placeholder);
                return createRecurry(
                  func,
                  bitmask,
                  createHybrid,
                  wrapper.placeholder,
                  thisArg,
                  args,
                  newHolders,
                  argPos,
                  ary2,
                  arity - length
                );
              }
              var thisBinding = isBind ? thisArg : this, fn2 = isBindKey ? thisBinding[func] : func;
              length = args.length;
              if (argPos) {
                args = reorder(args, argPos);
              } else if (isFlip && length > 1) {
                args.reverse();
              }
              if (isAry && ary2 < length) {
                args.length = ary2;
              }
              if (this && this !== root && this instanceof wrapper) {
                fn2 = Ctor || createCtor(fn2);
              }
              return fn2.apply(thisBinding, args);
            }
            return wrapper;
          }
          function createInverter(setter, toIteratee) {
            return function(object, iteratee2) {
              return baseInverter(object, setter, toIteratee(iteratee2), {});
            };
          }
          function createMathOperation(operator, defaultValue) {
            return function(value, other) {
              var result2;
              if (value === undefined2 && other === undefined2) {
                return defaultValue;
              }
              if (value !== undefined2) {
                result2 = value;
              }
              if (other !== undefined2) {
                if (result2 === undefined2) {
                  return other;
                }
                if (typeof value == "string" || typeof other == "string") {
                  value = baseToString(value);
                  other = baseToString(other);
                } else {
                  value = baseToNumber(value);
                  other = baseToNumber(other);
                }
                result2 = operator(value, other);
              }
              return result2;
            };
          }
          function createOver(arrayFunc) {
            return flatRest(function(iteratees) {
              iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
              return baseRest(function(args) {
                var thisArg = this;
                return arrayFunc(iteratees, function(iteratee2) {
                  return apply(iteratee2, thisArg, args);
                });
              });
            });
          }
          function createPadding(length, chars) {
            chars = chars === undefined2 ? " " : baseToString(chars);
            var charsLength = chars.length;
            if (charsLength < 2) {
              return charsLength ? baseRepeat(chars, length) : chars;
            }
            var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
            return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
          }
          function createPartial(func, bitmask, thisArg, partials) {
            var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
            function wrapper() {
              var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn2 = this && this !== root && this instanceof wrapper ? Ctor : func;
              while (++leftIndex < leftLength) {
                args[leftIndex] = partials[leftIndex];
              }
              while (argsLength--) {
                args[leftIndex++] = arguments[++argsIndex];
              }
              return apply(fn2, isBind ? thisArg : this, args);
            }
            return wrapper;
          }
          function createRange(fromRight) {
            return function(start4, end, step) {
              if (step && typeof step != "number" && isIterateeCall(start4, end, step)) {
                end = step = undefined2;
              }
              start4 = toFinite(start4);
              if (end === undefined2) {
                end = start4;
                start4 = 0;
              } else {
                end = toFinite(end);
              }
              step = step === undefined2 ? start4 < end ? 1 : -1 : toFinite(step);
              return baseRange(start4, end, step, fromRight);
            };
          }
          function createRelationalOperation(operator) {
            return function(value, other) {
              if (!(typeof value == "string" && typeof other == "string")) {
                value = toNumber(value);
                other = toNumber(other);
              }
              return operator(value, other);
            };
          }
          function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
            var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined2, newHoldersRight = isCurry ? undefined2 : holders, newPartials = isCurry ? partials : undefined2, newPartialsRight = isCurry ? undefined2 : partials;
            bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
            bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
            if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
              bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
            }
            var newData = [
              func,
              bitmask,
              thisArg,
              newPartials,
              newHolders,
              newPartialsRight,
              newHoldersRight,
              argPos,
              ary2,
              arity
            ];
            var result2 = wrapFunc.apply(undefined2, newData);
            if (isLaziable(func)) {
              setData(result2, newData);
            }
            result2.placeholder = placeholder;
            return setWrapToString(result2, func, bitmask);
          }
          function createRound(methodName) {
            var func = Math2[methodName];
            return function(number, precision) {
              number = toNumber(number);
              precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
              if (precision && nativeIsFinite(number)) {
                var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
                pair = (toString(value) + "e").split("e");
                return +(pair[0] + "e" + (+pair[1] - precision));
              }
              return func(number);
            };
          }
          var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values2) {
            return new Set2(values2);
          };
          function createToPairs(keysFunc) {
            return function(object) {
              var tag = getTag(object);
              if (tag == mapTag) {
                return mapToArray(object);
              }
              if (tag == setTag) {
                return setToPairs(object);
              }
              return baseToPairs(object, keysFunc(object));
            };
          }
          function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
            var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
            if (!isBindKey && typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            var length = partials ? partials.length : 0;
            if (!length) {
              bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
              partials = holders = undefined2;
            }
            ary2 = ary2 === undefined2 ? ary2 : nativeMax(toInteger(ary2), 0);
            arity = arity === undefined2 ? arity : toInteger(arity);
            length -= holders ? holders.length : 0;
            if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
              var partialsRight = partials, holdersRight = holders;
              partials = holders = undefined2;
            }
            var data = isBindKey ? undefined2 : getData(func);
            var newData = [
              func,
              bitmask,
              thisArg,
              partials,
              holders,
              partialsRight,
              holdersRight,
              argPos,
              ary2,
              arity
            ];
            if (data) {
              mergeData(newData, data);
            }
            func = newData[0];
            bitmask = newData[1];
            thisArg = newData[2];
            partials = newData[3];
            holders = newData[4];
            arity = newData[9] = newData[9] === undefined2 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
            if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
              bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
            }
            if (!bitmask || bitmask == WRAP_BIND_FLAG) {
              var result2 = createBind(func, bitmask, thisArg);
            } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
              result2 = createCurry(func, bitmask, arity);
            } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
              result2 = createPartial(func, bitmask, thisArg, partials);
            } else {
              result2 = createHybrid.apply(undefined2, newData);
            }
            var setter = data ? baseSetData : setData;
            return setWrapToString(setter(result2, newData), func, bitmask);
          }
          function customDefaultsAssignIn(objValue, srcValue, key, object) {
            if (objValue === undefined2 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
              return srcValue;
            }
            return objValue;
          }
          function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
            if (isObject(objValue) && isObject(srcValue)) {
              stack.set(srcValue, objValue);
              baseMerge(objValue, srcValue, undefined2, customDefaultsMerge, stack);
              stack["delete"](srcValue);
            }
            return objValue;
          }
          function customOmitClone(value) {
            return isPlainObject(value) ? undefined2 : value;
          }
          function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
            if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
              return false;
            }
            var arrStacked = stack.get(array);
            var othStacked = stack.get(other);
            if (arrStacked && othStacked) {
              return arrStacked == other && othStacked == array;
            }
            var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined2;
            stack.set(array, other);
            stack.set(other, array);
            while (++index < arrLength) {
              var arrValue = array[index], othValue = other[index];
              if (customizer) {
                var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
              }
              if (compared !== undefined2) {
                if (compared) {
                  continue;
                }
                result2 = false;
                break;
              }
              if (seen) {
                if (!arraySome(other, function(othValue2, othIndex) {
                  if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                    return seen.push(othIndex);
                  }
                })) {
                  result2 = false;
                  break;
                }
              } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                result2 = false;
                break;
              }
            }
            stack["delete"](array);
            stack["delete"](other);
            return result2;
          }
          function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
            switch (tag) {
              case dataViewTag:
                if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                  return false;
                }
                object = object.buffer;
                other = other.buffer;
              case arrayBufferTag:
                if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
                  return false;
                }
                return true;
              case boolTag:
              case dateTag:
              case numberTag:
                return eq(+object, +other);
              case errorTag:
                return object.name == other.name && object.message == other.message;
              case regexpTag:
              case stringTag:
                return object == other + "";
              case mapTag:
                var convert = mapToArray;
              case setTag:
                var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
                convert || (convert = setToArray);
                if (object.size != other.size && !isPartial) {
                  return false;
                }
                var stacked = stack.get(object);
                if (stacked) {
                  return stacked == other;
                }
                bitmask |= COMPARE_UNORDERED_FLAG;
                stack.set(object, other);
                var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
                stack["delete"](object);
                return result2;
              case symbolTag:
                if (symbolValueOf) {
                  return symbolValueOf.call(object) == symbolValueOf.call(other);
                }
            }
            return false;
          }
          function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
            if (objLength != othLength && !isPartial) {
              return false;
            }
            var index = objLength;
            while (index--) {
              var key = objProps[index];
              if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
                return false;
              }
            }
            var objStacked = stack.get(object);
            var othStacked = stack.get(other);
            if (objStacked && othStacked) {
              return objStacked == other && othStacked == object;
            }
            var result2 = true;
            stack.set(object, other);
            stack.set(other, object);
            var skipCtor = isPartial;
            while (++index < objLength) {
              key = objProps[index];
              var objValue = object[key], othValue = other[key];
              if (customizer) {
                var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
              }
              if (!(compared === undefined2 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
                result2 = false;
                break;
              }
              skipCtor || (skipCtor = key == "constructor");
            }
            if (result2 && !skipCtor) {
              var objCtor = object.constructor, othCtor = other.constructor;
              if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
                result2 = false;
              }
            }
            stack["delete"](object);
            stack["delete"](other);
            return result2;
          }
          function flatRest(func) {
            return setToString(overRest(func, undefined2, flatten), func + "");
          }
          function getAllKeys(object) {
            return baseGetAllKeys(object, keys, getSymbols);
          }
          function getAllKeysIn(object) {
            return baseGetAllKeys(object, keysIn, getSymbolsIn);
          }
          var getData = !metaMap ? noop : function(func) {
            return metaMap.get(func);
          };
          function getFuncName(func) {
            var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty.call(realNames, result2) ? array.length : 0;
            while (length--) {
              var data = array[length], otherFunc = data.func;
              if (otherFunc == null || otherFunc == func) {
                return data.name;
              }
            }
            return result2;
          }
          function getHolder(func) {
            var object = hasOwnProperty.call(lodash, "placeholder") ? lodash : func;
            return object.placeholder;
          }
          function getIteratee() {
            var result2 = lodash.iteratee || iteratee;
            result2 = result2 === iteratee ? baseIteratee : result2;
            return arguments.length ? result2(arguments[0], arguments[1]) : result2;
          }
          function getMapData(map2, key) {
            var data = map2.__data__;
            return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
          }
          function getMatchData(object) {
            var result2 = keys(object), length = result2.length;
            while (length--) {
              var key = result2[length], value = object[key];
              result2[length] = [key, value, isStrictComparable(value)];
            }
            return result2;
          }
          function getNative(object, key) {
            var value = getValue(object, key);
            return baseIsNative(value) ? value : undefined2;
          }
          function getRawTag(value) {
            var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
            try {
              value[symToStringTag] = undefined2;
              var unmasked = true;
            } catch (e2) {
            }
            var result2 = nativeObjectToString.call(value);
            if (unmasked) {
              if (isOwn) {
                value[symToStringTag] = tag;
              } else {
                delete value[symToStringTag];
              }
            }
            return result2;
          }
          var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
            if (object == null) {
              return [];
            }
            object = Object2(object);
            return arrayFilter(nativeGetSymbols(object), function(symbol) {
              return propertyIsEnumerable.call(object, symbol);
            });
          };
          var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
            var result2 = [];
            while (object) {
              arrayPush(result2, getSymbols(object));
              object = getPrototype(object);
            }
            return result2;
          };
          var getTag = baseGetTag;
          if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
            getTag = function(value) {
              var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined2, ctorString = Ctor ? toSource(Ctor) : "";
              if (ctorString) {
                switch (ctorString) {
                  case dataViewCtorString:
                    return dataViewTag;
                  case mapCtorString:
                    return mapTag;
                  case promiseCtorString:
                    return promiseTag;
                  case setCtorString:
                    return setTag;
                  case weakMapCtorString:
                    return weakMapTag;
                }
              }
              return result2;
            };
          }
          function getView(start4, end, transforms) {
            var index = -1, length = transforms.length;
            while (++index < length) {
              var data = transforms[index], size2 = data.size;
              switch (data.type) {
                case "drop":
                  start4 += size2;
                  break;
                case "dropRight":
                  end -= size2;
                  break;
                case "take":
                  end = nativeMin(end, start4 + size2);
                  break;
                case "takeRight":
                  start4 = nativeMax(start4, end - size2);
                  break;
              }
            }
            return { "start": start4, "end": end };
          }
          function getWrapDetails(source) {
            var match = source.match(reWrapDetails);
            return match ? match[1].split(reSplitDetails) : [];
          }
          function hasPath(object, path, hasFunc) {
            path = castPath(path, object);
            var index = -1, length = path.length, result2 = false;
            while (++index < length) {
              var key = toKey(path[index]);
              if (!(result2 = object != null && hasFunc(object, key))) {
                break;
              }
              object = object[key];
            }
            if (result2 || ++index != length) {
              return result2;
            }
            length = object == null ? 0 : object.length;
            return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
          }
          function initCloneArray(array) {
            var length = array.length, result2 = new array.constructor(length);
            if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
              result2.index = array.index;
              result2.input = array.input;
            }
            return result2;
          }
          function initCloneObject(object) {
            return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
          }
          function initCloneByTag(object, tag, isDeep) {
            var Ctor = object.constructor;
            switch (tag) {
              case arrayBufferTag:
                return cloneArrayBuffer(object);
              case boolTag:
              case dateTag:
                return new Ctor(+object);
              case dataViewTag:
                return cloneDataView(object, isDeep);
              case float32Tag:
              case float64Tag:
              case int8Tag:
              case int16Tag:
              case int32Tag:
              case uint8Tag:
              case uint8ClampedTag:
              case uint16Tag:
              case uint32Tag:
                return cloneTypedArray(object, isDeep);
              case mapTag:
                return new Ctor();
              case numberTag:
              case stringTag:
                return new Ctor(object);
              case regexpTag:
                return cloneRegExp(object);
              case setTag:
                return new Ctor();
              case symbolTag:
                return cloneSymbol(object);
            }
          }
          function insertWrapDetails(source, details) {
            var length = details.length;
            if (!length) {
              return source;
            }
            var lastIndex = length - 1;
            details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
            details = details.join(length > 2 ? ", " : " ");
            return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
          }
          function isFlattenable(value) {
            return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
          }
          function isIndex(value, length) {
            var type = typeof value;
            length = length == null ? MAX_SAFE_INTEGER : length;
            return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
          }
          function isIterateeCall(value, index, object) {
            if (!isObject(object)) {
              return false;
            }
            var type = typeof index;
            if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
              return eq(object[index], value);
            }
            return false;
          }
          function isKey(value, object) {
            if (isArray(value)) {
              return false;
            }
            var type = typeof value;
            if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
              return true;
            }
            return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
          }
          function isKeyable(value) {
            var type = typeof value;
            return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
          }
          function isLaziable(func) {
            var funcName = getFuncName(func), other = lodash[funcName];
            if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
              return false;
            }
            if (func === other) {
              return true;
            }
            var data = getData(other);
            return !!data && func === data[0];
          }
          function isMasked(func) {
            return !!maskSrcKey && maskSrcKey in func;
          }
          var isMaskable = coreJsData ? isFunction : stubFalse;
          function isPrototype(value) {
            var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
            return value === proto;
          }
          function isStrictComparable(value) {
            return value === value && !isObject(value);
          }
          function matchesStrictComparable(key, srcValue) {
            return function(object) {
              if (object == null) {
                return false;
              }
              return object[key] === srcValue && (srcValue !== undefined2 || key in Object2(object));
            };
          }
          function memoizeCapped(func) {
            var result2 = memoize(func, function(key) {
              if (cache2.size === MAX_MEMOIZE_SIZE) {
                cache2.clear();
              }
              return key;
            });
            var cache2 = result2.cache;
            return result2;
          }
          function mergeData(data, source) {
            var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
            var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
            if (!(isCommon || isCombo)) {
              return data;
            }
            if (srcBitmask & WRAP_BIND_FLAG) {
              data[2] = source[2];
              newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
            }
            var value = source[3];
            if (value) {
              var partials = data[3];
              data[3] = partials ? composeArgs(partials, value, source[4]) : value;
              data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
            }
            value = source[5];
            if (value) {
              partials = data[5];
              data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
              data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
            }
            value = source[7];
            if (value) {
              data[7] = value;
            }
            if (srcBitmask & WRAP_ARY_FLAG) {
              data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
            }
            if (data[9] == null) {
              data[9] = source[9];
            }
            data[0] = source[0];
            data[1] = newBitmask;
            return data;
          }
          function nativeKeysIn(object) {
            var result2 = [];
            if (object != null) {
              for (var key in Object2(object)) {
                result2.push(key);
              }
            }
            return result2;
          }
          function objectToString(value) {
            return nativeObjectToString.call(value);
          }
          function overRest(func, start4, transform2) {
            start4 = nativeMax(start4 === undefined2 ? func.length - 1 : start4, 0);
            return function() {
              var args = arguments, index = -1, length = nativeMax(args.length - start4, 0), array = Array2(length);
              while (++index < length) {
                array[index] = args[start4 + index];
              }
              index = -1;
              var otherArgs = Array2(start4 + 1);
              while (++index < start4) {
                otherArgs[index] = args[index];
              }
              otherArgs[start4] = transform2(array);
              return apply(func, this, otherArgs);
            };
          }
          function parent(object, path) {
            return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
          }
          function reorder(array, indexes) {
            var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
            while (length--) {
              var index = indexes[length];
              array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined2;
            }
            return array;
          }
          function safeGet(object, key) {
            if (key === "constructor" && typeof object[key] === "function") {
              return;
            }
            if (key == "__proto__") {
              return;
            }
            return object[key];
          }
          var setData = shortOut(baseSetData);
          var setTimeout2 = ctxSetTimeout || function(func, wait) {
            return root.setTimeout(func, wait);
          };
          var setToString = shortOut(baseSetToString);
          function setWrapToString(wrapper, reference, bitmask) {
            var source = reference + "";
            return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
          }
          function shortOut(func) {
            var count = 0, lastCalled = 0;
            return function() {
              var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
              lastCalled = stamp;
              if (remaining > 0) {
                if (++count >= HOT_COUNT) {
                  return arguments[0];
                }
              } else {
                count = 0;
              }
              return func.apply(undefined2, arguments);
            };
          }
          function shuffleSelf(array, size2) {
            var index = -1, length = array.length, lastIndex = length - 1;
            size2 = size2 === undefined2 ? length : size2;
            while (++index < size2) {
              var rand = baseRandom(index, lastIndex), value = array[rand];
              array[rand] = array[index];
              array[index] = value;
            }
            array.length = size2;
            return array;
          }
          var stringToPath = memoizeCapped(function(string) {
            var result2 = [];
            if (string.charCodeAt(0) === 46) {
              result2.push("");
            }
            string.replace(rePropName, function(match, number, quote, subString) {
              result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
            });
            return result2;
          });
          function toKey(value) {
            if (typeof value == "string" || isSymbol(value)) {
              return value;
            }
            var result2 = value + "";
            return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
          }
          function toSource(func) {
            if (func != null) {
              try {
                return funcToString.call(func);
              } catch (e2) {
              }
              try {
                return func + "";
              } catch (e2) {
              }
            }
            return "";
          }
          function updateWrapDetails(details, bitmask) {
            arrayEach(wrapFlags, function(pair) {
              var value = "_." + pair[0];
              if (bitmask & pair[1] && !arrayIncludes(details, value)) {
                details.push(value);
              }
            });
            return details.sort();
          }
          function wrapperClone(wrapper) {
            if (wrapper instanceof LazyWrapper) {
              return wrapper.clone();
            }
            var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
            result2.__actions__ = copyArray(wrapper.__actions__);
            result2.__index__ = wrapper.__index__;
            result2.__values__ = wrapper.__values__;
            return result2;
          }
          function chunk(array, size2, guard) {
            if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined2) {
              size2 = 1;
            } else {
              size2 = nativeMax(toInteger(size2), 0);
            }
            var length = array == null ? 0 : array.length;
            if (!length || size2 < 1) {
              return [];
            }
            var index = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
            while (index < length) {
              result2[resIndex++] = baseSlice(array, index, index += size2);
            }
            return result2;
          }
          function compact(array) {
            var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
            while (++index < length) {
              var value = array[index];
              if (value) {
                result2[resIndex++] = value;
              }
            }
            return result2;
          }
          function concat() {
            var length = arguments.length;
            if (!length) {
              return [];
            }
            var args = Array2(length - 1), array = arguments[0], index = length;
            while (index--) {
              args[index - 1] = arguments[index];
            }
            return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
          }
          var difference = baseRest(function(array, values2) {
            return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
          });
          var differenceBy = baseRest(function(array, values2) {
            var iteratee2 = last(values2);
            if (isArrayLikeObject(iteratee2)) {
              iteratee2 = undefined2;
            }
            return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
          });
          var differenceWith = baseRest(function(array, values2) {
            var comparator = last(values2);
            if (isArrayLikeObject(comparator)) {
              comparator = undefined2;
            }
            return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined2, comparator) : [];
          });
          function drop(array, n2, guard) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            n2 = guard || n2 === undefined2 ? 1 : toInteger(n2);
            return baseSlice(array, n2 < 0 ? 0 : n2, length);
          }
          function dropRight(array, n2, guard) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            n2 = guard || n2 === undefined2 ? 1 : toInteger(n2);
            n2 = length - n2;
            return baseSlice(array, 0, n2 < 0 ? 0 : n2);
          }
          function dropRightWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
          }
          function dropWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
          }
          function fill(array, value, start4, end) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            if (start4 && typeof start4 != "number" && isIterateeCall(array, value, start4)) {
              start4 = 0;
              end = length;
            }
            return baseFill(array, value, start4, end);
          }
          function findIndex(array, predicate, fromIndex) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return -1;
            }
            var index = fromIndex == null ? 0 : toInteger(fromIndex);
            if (index < 0) {
              index = nativeMax(length + index, 0);
            }
            return baseFindIndex(array, getIteratee(predicate, 3), index);
          }
          function findLastIndex(array, predicate, fromIndex) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return -1;
            }
            var index = length - 1;
            if (fromIndex !== undefined2) {
              index = toInteger(fromIndex);
              index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
            }
            return baseFindIndex(array, getIteratee(predicate, 3), index, true);
          }
          function flatten(array) {
            var length = array == null ? 0 : array.length;
            return length ? baseFlatten(array, 1) : [];
          }
          function flattenDeep(array) {
            var length = array == null ? 0 : array.length;
            return length ? baseFlatten(array, INFINITY) : [];
          }
          function flattenDepth(array, depth) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            depth = depth === undefined2 ? 1 : toInteger(depth);
            return baseFlatten(array, depth);
          }
          function fromPairs(pairs) {
            var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
            while (++index < length) {
              var pair = pairs[index];
              result2[pair[0]] = pair[1];
            }
            return result2;
          }
          function head(array) {
            return array && array.length ? array[0] : undefined2;
          }
          function indexOf3(array, value, fromIndex) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return -1;
            }
            var index = fromIndex == null ? 0 : toInteger(fromIndex);
            if (index < 0) {
              index = nativeMax(length + index, 0);
            }
            return baseIndexOf(array, value, index);
          }
          function initial(array) {
            var length = array == null ? 0 : array.length;
            return length ? baseSlice(array, 0, -1) : [];
          }
          var intersection = baseRest(function(arrays) {
            var mapped = arrayMap(arrays, castArrayLikeObject);
            return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
          });
          var intersectionBy = baseRest(function(arrays) {
            var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
            if (iteratee2 === last(mapped)) {
              iteratee2 = undefined2;
            } else {
              mapped.pop();
            }
            return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
          });
          var intersectionWith = baseRest(function(arrays) {
            var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
            comparator = typeof comparator == "function" ? comparator : undefined2;
            if (comparator) {
              mapped.pop();
            }
            return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined2, comparator) : [];
          });
          function join(array, separator) {
            return array == null ? "" : nativeJoin.call(array, separator);
          }
          function last(array) {
            var length = array == null ? 0 : array.length;
            return length ? array[length - 1] : undefined2;
          }
          function lastIndexOf(array, value, fromIndex) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return -1;
            }
            var index = length;
            if (fromIndex !== undefined2) {
              index = toInteger(fromIndex);
              index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
            }
            return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
          }
          function nth(array, n2) {
            return array && array.length ? baseNth(array, toInteger(n2)) : undefined2;
          }
          var pull = baseRest(pullAll);
          function pullAll(array, values2) {
            return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
          }
          function pullAllBy(array, values2, iteratee2) {
            return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
          }
          function pullAllWith(array, values2, comparator) {
            return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined2, comparator) : array;
          }
          var pullAt = flatRest(function(array, indexes) {
            var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
            basePullAt(array, arrayMap(indexes, function(index) {
              return isIndex(index, length) ? +index : index;
            }).sort(compareAscending));
            return result2;
          });
          function remove(array, predicate) {
            var result2 = [];
            if (!(array && array.length)) {
              return result2;
            }
            var index = -1, indexes = [], length = array.length;
            predicate = getIteratee(predicate, 3);
            while (++index < length) {
              var value = array[index];
              if (predicate(value, index, array)) {
                result2.push(value);
                indexes.push(index);
              }
            }
            basePullAt(array, indexes);
            return result2;
          }
          function reverse(array) {
            return array == null ? array : nativeReverse.call(array);
          }
          function slice(array, start4, end) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            if (end && typeof end != "number" && isIterateeCall(array, start4, end)) {
              start4 = 0;
              end = length;
            } else {
              start4 = start4 == null ? 0 : toInteger(start4);
              end = end === undefined2 ? length : toInteger(end);
            }
            return baseSlice(array, start4, end);
          }
          function sortedIndex(array, value) {
            return baseSortedIndex(array, value);
          }
          function sortedIndexBy(array, value, iteratee2) {
            return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
          }
          function sortedIndexOf(array, value) {
            var length = array == null ? 0 : array.length;
            if (length) {
              var index = baseSortedIndex(array, value);
              if (index < length && eq(array[index], value)) {
                return index;
              }
            }
            return -1;
          }
          function sortedLastIndex(array, value) {
            return baseSortedIndex(array, value, true);
          }
          function sortedLastIndexBy(array, value, iteratee2) {
            return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
          }
          function sortedLastIndexOf(array, value) {
            var length = array == null ? 0 : array.length;
            if (length) {
              var index = baseSortedIndex(array, value, true) - 1;
              if (eq(array[index], value)) {
                return index;
              }
            }
            return -1;
          }
          function sortedUniq(array) {
            return array && array.length ? baseSortedUniq(array) : [];
          }
          function sortedUniqBy(array, iteratee2) {
            return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
          }
          function tail(array) {
            var length = array == null ? 0 : array.length;
            return length ? baseSlice(array, 1, length) : [];
          }
          function take(array, n2, guard) {
            if (!(array && array.length)) {
              return [];
            }
            n2 = guard || n2 === undefined2 ? 1 : toInteger(n2);
            return baseSlice(array, 0, n2 < 0 ? 0 : n2);
          }
          function takeRight(array, n2, guard) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            n2 = guard || n2 === undefined2 ? 1 : toInteger(n2);
            n2 = length - n2;
            return baseSlice(array, n2 < 0 ? 0 : n2, length);
          }
          function takeRightWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
          }
          function takeWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
          }
          var union = baseRest(function(arrays) {
            return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
          });
          var unionBy = baseRest(function(arrays) {
            var iteratee2 = last(arrays);
            if (isArrayLikeObject(iteratee2)) {
              iteratee2 = undefined2;
            }
            return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
          });
          var unionWith = baseRest(function(arrays) {
            var comparator = last(arrays);
            comparator = typeof comparator == "function" ? comparator : undefined2;
            return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined2, comparator);
          });
          function uniq(array) {
            return array && array.length ? baseUniq(array) : [];
          }
          function uniqBy(array, iteratee2) {
            return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
          }
          function uniqWith(array, comparator) {
            comparator = typeof comparator == "function" ? comparator : undefined2;
            return array && array.length ? baseUniq(array, undefined2, comparator) : [];
          }
          function unzip(array) {
            if (!(array && array.length)) {
              return [];
            }
            var length = 0;
            array = arrayFilter(array, function(group) {
              if (isArrayLikeObject(group)) {
                length = nativeMax(group.length, length);
                return true;
              }
            });
            return baseTimes(length, function(index) {
              return arrayMap(array, baseProperty(index));
            });
          }
          function unzipWith(array, iteratee2) {
            if (!(array && array.length)) {
              return [];
            }
            var result2 = unzip(array);
            if (iteratee2 == null) {
              return result2;
            }
            return arrayMap(result2, function(group) {
              return apply(iteratee2, undefined2, group);
            });
          }
          var without = baseRest(function(array, values2) {
            return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
          });
          var xor = baseRest(function(arrays) {
            return baseXor(arrayFilter(arrays, isArrayLikeObject));
          });
          var xorBy = baseRest(function(arrays) {
            var iteratee2 = last(arrays);
            if (isArrayLikeObject(iteratee2)) {
              iteratee2 = undefined2;
            }
            return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
          });
          var xorWith = baseRest(function(arrays) {
            var comparator = last(arrays);
            comparator = typeof comparator == "function" ? comparator : undefined2;
            return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined2, comparator);
          });
          var zip2 = baseRest(unzip);
          function zipObject(props, values2) {
            return baseZipObject(props || [], values2 || [], assignValue);
          }
          function zipObjectDeep(props, values2) {
            return baseZipObject(props || [], values2 || [], baseSet);
          }
          var zipWith = baseRest(function(arrays) {
            var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined2;
            iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined2;
            return unzipWith(arrays, iteratee2);
          });
          function chain(value) {
            var result2 = lodash(value);
            result2.__chain__ = true;
            return result2;
          }
          function tap(value, interceptor) {
            interceptor(value);
            return value;
          }
          function thru(value, interceptor) {
            return interceptor(value);
          }
          var wrapperAt = flatRest(function(paths) {
            var length = paths.length, start4 = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
              return baseAt(object, paths);
            };
            if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start4)) {
              return this.thru(interceptor);
            }
            value = value.slice(start4, +start4 + (length ? 1 : 0));
            value.__actions__.push({
              "func": thru,
              "args": [interceptor],
              "thisArg": undefined2
            });
            return new LodashWrapper(value, this.__chain__).thru(function(array) {
              if (length && !array.length) {
                array.push(undefined2);
              }
              return array;
            });
          });
          function wrapperChain() {
            return chain(this);
          }
          function wrapperCommit() {
            return new LodashWrapper(this.value(), this.__chain__);
          }
          function wrapperNext() {
            if (this.__values__ === undefined2) {
              this.__values__ = toArray3(this.value());
            }
            var done = this.__index__ >= this.__values__.length, value = done ? undefined2 : this.__values__[this.__index__++];
            return { "done": done, "value": value };
          }
          function wrapperToIterator() {
            return this;
          }
          function wrapperPlant(value) {
            var result2, parent2 = this;
            while (parent2 instanceof baseLodash) {
              var clone2 = wrapperClone(parent2);
              clone2.__index__ = 0;
              clone2.__values__ = undefined2;
              if (result2) {
                previous.__wrapped__ = clone2;
              } else {
                result2 = clone2;
              }
              var previous = clone2;
              parent2 = parent2.__wrapped__;
            }
            previous.__wrapped__ = value;
            return result2;
          }
          function wrapperReverse() {
            var value = this.__wrapped__;
            if (value instanceof LazyWrapper) {
              var wrapped = value;
              if (this.__actions__.length) {
                wrapped = new LazyWrapper(this);
              }
              wrapped = wrapped.reverse();
              wrapped.__actions__.push({
                "func": thru,
                "args": [reverse],
                "thisArg": undefined2
              });
              return new LodashWrapper(wrapped, this.__chain__);
            }
            return this.thru(reverse);
          }
          function wrapperValue() {
            return baseWrapperValue(this.__wrapped__, this.__actions__);
          }
          var countBy = createAggregator(function(result2, value, key) {
            if (hasOwnProperty.call(result2, key)) {
              ++result2[key];
            } else {
              baseAssignValue(result2, key, 1);
            }
          });
          function every(collection, predicate, guard) {
            var func = isArray(collection) ? arrayEvery : baseEvery;
            if (guard && isIterateeCall(collection, predicate, guard)) {
              predicate = undefined2;
            }
            return func(collection, getIteratee(predicate, 3));
          }
          function filter(collection, predicate) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            return func(collection, getIteratee(predicate, 3));
          }
          var find = createFind(findIndex);
          var findLast = createFind(findLastIndex);
          function flatMap(collection, iteratee2) {
            return baseFlatten(map(collection, iteratee2), 1);
          }
          function flatMapDeep(collection, iteratee2) {
            return baseFlatten(map(collection, iteratee2), INFINITY);
          }
          function flatMapDepth(collection, iteratee2, depth) {
            depth = depth === undefined2 ? 1 : toInteger(depth);
            return baseFlatten(map(collection, iteratee2), depth);
          }
          function forEach(collection, iteratee2) {
            var func = isArray(collection) ? arrayEach : baseEach;
            return func(collection, getIteratee(iteratee2, 3));
          }
          function forEachRight(collection, iteratee2) {
            var func = isArray(collection) ? arrayEachRight : baseEachRight;
            return func(collection, getIteratee(iteratee2, 3));
          }
          var groupBy = createAggregator(function(result2, value, key) {
            if (hasOwnProperty.call(result2, key)) {
              result2[key].push(value);
            } else {
              baseAssignValue(result2, key, [value]);
            }
          });
          function includes(collection, value, fromIndex, guard) {
            collection = isArrayLike(collection) ? collection : values(collection);
            fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
            var length = collection.length;
            if (fromIndex < 0) {
              fromIndex = nativeMax(length + fromIndex, 0);
            }
            return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
          }
          var invokeMap = baseRest(function(collection, path, args) {
            var index = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
            baseEach(collection, function(value) {
              result2[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
            });
            return result2;
          });
          var keyBy = createAggregator(function(result2, value, key) {
            baseAssignValue(result2, key, value);
          });
          function map(collection, iteratee2) {
            var func = isArray(collection) ? arrayMap : baseMap;
            return func(collection, getIteratee(iteratee2, 3));
          }
          function orderBy(collection, iteratees, orders, guard) {
            if (collection == null) {
              return [];
            }
            if (!isArray(iteratees)) {
              iteratees = iteratees == null ? [] : [iteratees];
            }
            orders = guard ? undefined2 : orders;
            if (!isArray(orders)) {
              orders = orders == null ? [] : [orders];
            }
            return baseOrderBy(collection, iteratees, orders);
          }
          var partition = createAggregator(function(result2, value, key) {
            result2[key ? 0 : 1].push(value);
          }, function() {
            return [[], []];
          });
          function reduce(collection, iteratee2, accumulator) {
            var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
            return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
          }
          function reduceRight(collection, iteratee2, accumulator) {
            var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
            return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
          }
          function reject(collection, predicate) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            return func(collection, negate(getIteratee(predicate, 3)));
          }
          function sample(collection) {
            var func = isArray(collection) ? arraySample : baseSample;
            return func(collection);
          }
          function sampleSize(collection, n2, guard) {
            if (guard ? isIterateeCall(collection, n2, guard) : n2 === undefined2) {
              n2 = 1;
            } else {
              n2 = toInteger(n2);
            }
            var func = isArray(collection) ? arraySampleSize : baseSampleSize;
            return func(collection, n2);
          }
          function shuffle(collection) {
            var func = isArray(collection) ? arrayShuffle : baseShuffle;
            return func(collection);
          }
          function size(collection) {
            if (collection == null) {
              return 0;
            }
            if (isArrayLike(collection)) {
              return isString(collection) ? stringSize(collection) : collection.length;
            }
            var tag = getTag(collection);
            if (tag == mapTag || tag == setTag) {
              return collection.size;
            }
            return baseKeys(collection).length;
          }
          function some(collection, predicate, guard) {
            var func = isArray(collection) ? arraySome : baseSome;
            if (guard && isIterateeCall(collection, predicate, guard)) {
              predicate = undefined2;
            }
            return func(collection, getIteratee(predicate, 3));
          }
          var sortBy = baseRest(function(collection, iteratees) {
            if (collection == null) {
              return [];
            }
            var length = iteratees.length;
            if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
              iteratees = [];
            } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
              iteratees = [iteratees[0]];
            }
            return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
          });
          var now3 = ctxNow || function() {
            return root.Date.now();
          };
          function after(n2, func) {
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            n2 = toInteger(n2);
            return function() {
              if (--n2 < 1) {
                return func.apply(this, arguments);
              }
            };
          }
          function ary(func, n2, guard) {
            n2 = guard ? undefined2 : n2;
            n2 = func && n2 == null ? func.length : n2;
            return createWrap(func, WRAP_ARY_FLAG, undefined2, undefined2, undefined2, undefined2, n2);
          }
          function before(n2, func) {
            var result2;
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            n2 = toInteger(n2);
            return function() {
              if (--n2 > 0) {
                result2 = func.apply(this, arguments);
              }
              if (n2 <= 1) {
                func = undefined2;
              }
              return result2;
            };
          }
          var bind = baseRest(function(func, thisArg, partials) {
            var bitmask = WRAP_BIND_FLAG;
            if (partials.length) {
              var holders = replaceHolders(partials, getHolder(bind));
              bitmask |= WRAP_PARTIAL_FLAG;
            }
            return createWrap(func, bitmask, thisArg, partials, holders);
          });
          var bindKey = baseRest(function(object, key, partials) {
            var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
            if (partials.length) {
              var holders = replaceHolders(partials, getHolder(bindKey));
              bitmask |= WRAP_PARTIAL_FLAG;
            }
            return createWrap(key, bitmask, object, partials, holders);
          });
          function curry(func, arity, guard) {
            arity = guard ? undefined2 : arity;
            var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
            result2.placeholder = curry.placeholder;
            return result2;
          }
          function curryRight(func, arity, guard) {
            arity = guard ? undefined2 : arity;
            var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
            result2.placeholder = curryRight.placeholder;
            return result2;
          }
          function debounce4(func, wait, options) {
            var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            wait = toNumber(wait) || 0;
            if (isObject(options)) {
              leading = !!options.leading;
              maxing = "maxWait" in options;
              maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
              trailing = "trailing" in options ? !!options.trailing : trailing;
            }
            function invokeFunc(time) {
              var args = lastArgs, thisArg = lastThis;
              lastArgs = lastThis = undefined2;
              lastInvokeTime = time;
              result2 = func.apply(thisArg, args);
              return result2;
            }
            function leadingEdge(time) {
              lastInvokeTime = time;
              timerId = setTimeout2(timerExpired, wait);
              return leading ? invokeFunc(time) : result2;
            }
            function remainingWait(time) {
              var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
              return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
            }
            function shouldInvoke(time) {
              var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
              return lastCallTime === undefined2 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
            }
            function timerExpired() {
              var time = now3();
              if (shouldInvoke(time)) {
                return trailingEdge(time);
              }
              timerId = setTimeout2(timerExpired, remainingWait(time));
            }
            function trailingEdge(time) {
              timerId = undefined2;
              if (trailing && lastArgs) {
                return invokeFunc(time);
              }
              lastArgs = lastThis = undefined2;
              return result2;
            }
            function cancel() {
              if (timerId !== undefined2) {
                clearTimeout2(timerId);
              }
              lastInvokeTime = 0;
              lastArgs = lastCallTime = lastThis = timerId = undefined2;
            }
            function flush() {
              return timerId === undefined2 ? result2 : trailingEdge(now3());
            }
            function debounced() {
              var time = now3(), isInvoking = shouldInvoke(time);
              lastArgs = arguments;
              lastThis = this;
              lastCallTime = time;
              if (isInvoking) {
                if (timerId === undefined2) {
                  return leadingEdge(lastCallTime);
                }
                if (maxing) {
                  clearTimeout2(timerId);
                  timerId = setTimeout2(timerExpired, wait);
                  return invokeFunc(lastCallTime);
                }
              }
              if (timerId === undefined2) {
                timerId = setTimeout2(timerExpired, wait);
              }
              return result2;
            }
            debounced.cancel = cancel;
            debounced.flush = flush;
            return debounced;
          }
          var defer = baseRest(function(func, args) {
            return baseDelay(func, 1, args);
          });
          var delay = baseRest(function(func, wait, args) {
            return baseDelay(func, toNumber(wait) || 0, args);
          });
          function flip(func) {
            return createWrap(func, WRAP_FLIP_FLAG);
          }
          function memoize(func, resolver) {
            if (typeof func != "function" || resolver != null && typeof resolver != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            var memoized = function() {
              var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache2 = memoized.cache;
              if (cache2.has(key)) {
                return cache2.get(key);
              }
              var result2 = func.apply(this, args);
              memoized.cache = cache2.set(key, result2) || cache2;
              return result2;
            };
            memoized.cache = new (memoize.Cache || MapCache)();
            return memoized;
          }
          memoize.Cache = MapCache;
          function negate(predicate) {
            if (typeof predicate != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            return function() {
              var args = arguments;
              switch (args.length) {
                case 0:
                  return !predicate.call(this);
                case 1:
                  return !predicate.call(this, args[0]);
                case 2:
                  return !predicate.call(this, args[0], args[1]);
                case 3:
                  return !predicate.call(this, args[0], args[1], args[2]);
              }
              return !predicate.apply(this, args);
            };
          }
          function once(func) {
            return before(2, func);
          }
          var overArgs = castRest(function(func, transforms) {
            transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
            var funcsLength = transforms.length;
            return baseRest(function(args) {
              var index = -1, length = nativeMin(args.length, funcsLength);
              while (++index < length) {
                args[index] = transforms[index].call(this, args[index]);
              }
              return apply(func, this, args);
            });
          });
          var partial = baseRest(function(func, partials) {
            var holders = replaceHolders(partials, getHolder(partial));
            return createWrap(func, WRAP_PARTIAL_FLAG, undefined2, partials, holders);
          });
          var partialRight = baseRest(function(func, partials) {
            var holders = replaceHolders(partials, getHolder(partialRight));
            return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined2, partials, holders);
          });
          var rearg = flatRest(function(func, indexes) {
            return createWrap(func, WRAP_REARG_FLAG, undefined2, undefined2, undefined2, indexes);
          });
          function rest(func, start4) {
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            start4 = start4 === undefined2 ? start4 : toInteger(start4);
            return baseRest(func, start4);
          }
          function spread(func, start4) {
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            start4 = start4 == null ? 0 : nativeMax(toInteger(start4), 0);
            return baseRest(function(args) {
              var array = args[start4], otherArgs = castSlice(args, 0, start4);
              if (array) {
                arrayPush(otherArgs, array);
              }
              return apply(func, this, otherArgs);
            });
          }
          function throttle(func, wait, options) {
            var leading = true, trailing = true;
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            if (isObject(options)) {
              leading = "leading" in options ? !!options.leading : leading;
              trailing = "trailing" in options ? !!options.trailing : trailing;
            }
            return debounce4(func, wait, {
              "leading": leading,
              "maxWait": wait,
              "trailing": trailing
            });
          }
          function unary(func) {
            return ary(func, 1);
          }
          function wrap(value, wrapper) {
            return partial(castFunction(wrapper), value);
          }
          function castArray() {
            if (!arguments.length) {
              return [];
            }
            var value = arguments[0];
            return isArray(value) ? value : [value];
          }
          function clone(value) {
            return baseClone(value, CLONE_SYMBOLS_FLAG);
          }
          function cloneWith(value, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
          }
          function cloneDeep(value) {
            return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
          }
          function cloneDeepWith(value, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
          }
          function conformsTo(object, source) {
            return source == null || baseConformsTo(object, source, keys(source));
          }
          function eq(value, other) {
            return value === other || value !== value && other !== other;
          }
          var gt2 = createRelationalOperation(baseGt);
          var gte = createRelationalOperation(function(value, other) {
            return value >= other;
          });
          var isArguments = baseIsArguments(/* @__PURE__ */ (function() {
            return arguments;
          })()) ? baseIsArguments : function(value) {
            return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
          };
          var isArray = Array2.isArray;
          var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
          function isArrayLike(value) {
            return value != null && isLength(value.length) && !isFunction(value);
          }
          function isArrayLikeObject(value) {
            return isObjectLike(value) && isArrayLike(value);
          }
          function isBoolean(value) {
            return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
          }
          var isBuffer = nativeIsBuffer || stubFalse;
          var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
          function isElement(value) {
            return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
          }
          function isEmpty(value) {
            if (value == null) {
              return true;
            }
            if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
              return !value.length;
            }
            var tag = getTag(value);
            if (tag == mapTag || tag == setTag) {
              return !value.size;
            }
            if (isPrototype(value)) {
              return !baseKeys(value).length;
            }
            for (var key in value) {
              if (hasOwnProperty.call(value, key)) {
                return false;
              }
            }
            return true;
          }
          function isEqual(value, other) {
            return baseIsEqual(value, other);
          }
          function isEqualWith(value, other, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            var result2 = customizer ? customizer(value, other) : undefined2;
            return result2 === undefined2 ? baseIsEqual(value, other, undefined2, customizer) : !!result2;
          }
          function isError(value) {
            if (!isObjectLike(value)) {
              return false;
            }
            var tag = baseGetTag(value);
            return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
          }
          function isFinite(value) {
            return typeof value == "number" && nativeIsFinite(value);
          }
          function isFunction(value) {
            if (!isObject(value)) {
              return false;
            }
            var tag = baseGetTag(value);
            return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
          }
          function isInteger(value) {
            return typeof value == "number" && value == toInteger(value);
          }
          function isLength(value) {
            return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
          }
          function isObject(value) {
            var type = typeof value;
            return value != null && (type == "object" || type == "function");
          }
          function isObjectLike(value) {
            return value != null && typeof value == "object";
          }
          var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
          function isMatch(object, source) {
            return object === source || baseIsMatch(object, source, getMatchData(source));
          }
          function isMatchWith(object, source, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            return baseIsMatch(object, source, getMatchData(source), customizer);
          }
          function isNaN(value) {
            return isNumber(value) && value != +value;
          }
          function isNative(value) {
            if (isMaskable(value)) {
              throw new Error2(CORE_ERROR_TEXT);
            }
            return baseIsNative(value);
          }
          function isNull(value) {
            return value === null;
          }
          function isNil(value) {
            return value == null;
          }
          function isNumber(value) {
            return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
          }
          function isPlainObject(value) {
            if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
              return false;
            }
            var proto = getPrototype(value);
            if (proto === null) {
              return true;
            }
            var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
            return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
          }
          var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
          function isSafeInteger(value) {
            return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
          }
          var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
          function isString(value) {
            return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
          }
          function isSymbol(value) {
            return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
          }
          var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
          function isUndefined(value) {
            return value === undefined2;
          }
          function isWeakMap(value) {
            return isObjectLike(value) && getTag(value) == weakMapTag;
          }
          function isWeakSet(value) {
            return isObjectLike(value) && baseGetTag(value) == weakSetTag;
          }
          var lt2 = createRelationalOperation(baseLt);
          var lte = createRelationalOperation(function(value, other) {
            return value <= other;
          });
          function toArray3(value) {
            if (!value) {
              return [];
            }
            if (isArrayLike(value)) {
              return isString(value) ? stringToArray(value) : copyArray(value);
            }
            if (symIterator && value[symIterator]) {
              return iteratorToArray(value[symIterator]());
            }
            var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
            return func(value);
          }
          function toFinite(value) {
            if (!value) {
              return value === 0 ? value : 0;
            }
            value = toNumber(value);
            if (value === INFINITY || value === -INFINITY) {
              var sign = value < 0 ? -1 : 1;
              return sign * MAX_INTEGER;
            }
            return value === value ? value : 0;
          }
          function toInteger(value) {
            var result2 = toFinite(value), remainder = result2 % 1;
            return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
          }
          function toLength(value) {
            return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
          }
          function toNumber(value) {
            if (typeof value == "number") {
              return value;
            }
            if (isSymbol(value)) {
              return NAN;
            }
            if (isObject(value)) {
              var other = typeof value.valueOf == "function" ? value.valueOf() : value;
              value = isObject(other) ? other + "" : other;
            }
            if (typeof value != "string") {
              return value === 0 ? value : +value;
            }
            value = baseTrim(value);
            var isBinary = reIsBinary.test(value);
            return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
          }
          function toPlainObject(value) {
            return copyObject(value, keysIn(value));
          }
          function toSafeInteger(value) {
            return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
          }
          function toString(value) {
            return value == null ? "" : baseToString(value);
          }
          var assign = createAssigner(function(object, source) {
            if (isPrototype(source) || isArrayLike(source)) {
              copyObject(source, keys(source), object);
              return;
            }
            for (var key in source) {
              if (hasOwnProperty.call(source, key)) {
                assignValue(object, key, source[key]);
              }
            }
          });
          var assignIn = createAssigner(function(object, source) {
            copyObject(source, keysIn(source), object);
          });
          var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
            copyObject(source, keysIn(source), object, customizer);
          });
          var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
            copyObject(source, keys(source), object, customizer);
          });
          var at2 = flatRest(baseAt);
          function create(prototype, properties) {
            var result2 = baseCreate(prototype);
            return properties == null ? result2 : baseAssign(result2, properties);
          }
          var defaults = baseRest(function(object, sources) {
            object = Object2(object);
            var index = -1;
            var length = sources.length;
            var guard = length > 2 ? sources[2] : undefined2;
            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
              length = 1;
            }
            while (++index < length) {
              var source = sources[index];
              var props = keysIn(source);
              var propsIndex = -1;
              var propsLength = props.length;
              while (++propsIndex < propsLength) {
                var key = props[propsIndex];
                var value = object[key];
                if (value === undefined2 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
                  object[key] = source[key];
                }
              }
            }
            return object;
          });
          var defaultsDeep = baseRest(function(args) {
            args.push(undefined2, customDefaultsMerge);
            return apply(mergeWith, undefined2, args);
          });
          function findKey(object, predicate) {
            return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
          }
          function findLastKey(object, predicate) {
            return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
          }
          function forIn(object, iteratee2) {
            return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
          }
          function forInRight(object, iteratee2) {
            return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
          }
          function forOwn(object, iteratee2) {
            return object && baseForOwn(object, getIteratee(iteratee2, 3));
          }
          function forOwnRight(object, iteratee2) {
            return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
          }
          function functions(object) {
            return object == null ? [] : baseFunctions(object, keys(object));
          }
          function functionsIn(object) {
            return object == null ? [] : baseFunctions(object, keysIn(object));
          }
          function get(object, path, defaultValue) {
            var result2 = object == null ? undefined2 : baseGet(object, path);
            return result2 === undefined2 ? defaultValue : result2;
          }
          function has(object, path) {
            return object != null && hasPath(object, path, baseHas);
          }
          function hasIn(object, path) {
            return object != null && hasPath(object, path, baseHasIn);
          }
          var invert = createInverter(function(result2, value, key) {
            if (value != null && typeof value.toString != "function") {
              value = nativeObjectToString.call(value);
            }
            result2[value] = key;
          }, constant(identity));
          var invertBy = createInverter(function(result2, value, key) {
            if (value != null && typeof value.toString != "function") {
              value = nativeObjectToString.call(value);
            }
            if (hasOwnProperty.call(result2, value)) {
              result2[value].push(key);
            } else {
              result2[value] = [key];
            }
          }, getIteratee);
          var invoke = baseRest(baseInvoke);
          function keys(object) {
            return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
          }
          function keysIn(object) {
            return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
          }
          function mapKeys(object, iteratee2) {
            var result2 = {};
            iteratee2 = getIteratee(iteratee2, 3);
            baseForOwn(object, function(value, key, object2) {
              baseAssignValue(result2, iteratee2(value, key, object2), value);
            });
            return result2;
          }
          function mapValues(object, iteratee2) {
            var result2 = {};
            iteratee2 = getIteratee(iteratee2, 3);
            baseForOwn(object, function(value, key, object2) {
              baseAssignValue(result2, key, iteratee2(value, key, object2));
            });
            return result2;
          }
          var merge = createAssigner(function(object, source, srcIndex) {
            baseMerge(object, source, srcIndex);
          });
          var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
            baseMerge(object, source, srcIndex, customizer);
          });
          var omit = flatRest(function(object, paths) {
            var result2 = {};
            if (object == null) {
              return result2;
            }
            var isDeep = false;
            paths = arrayMap(paths, function(path) {
              path = castPath(path, object);
              isDeep || (isDeep = path.length > 1);
              return path;
            });
            copyObject(object, getAllKeysIn(object), result2);
            if (isDeep) {
              result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
            }
            var length = paths.length;
            while (length--) {
              baseUnset(result2, paths[length]);
            }
            return result2;
          });
          function omitBy(object, predicate) {
            return pickBy(object, negate(getIteratee(predicate)));
          }
          var pick = flatRest(function(object, paths) {
            return object == null ? {} : basePick(object, paths);
          });
          function pickBy(object, predicate) {
            if (object == null) {
              return {};
            }
            var props = arrayMap(getAllKeysIn(object), function(prop) {
              return [prop];
            });
            predicate = getIteratee(predicate);
            return basePickBy(object, props, function(value, path) {
              return predicate(value, path[0]);
            });
          }
          function result(object, path, defaultValue) {
            path = castPath(path, object);
            var index = -1, length = path.length;
            if (!length) {
              length = 1;
              object = undefined2;
            }
            while (++index < length) {
              var value = object == null ? undefined2 : object[toKey(path[index])];
              if (value === undefined2) {
                index = length;
                value = defaultValue;
              }
              object = isFunction(value) ? value.call(object) : value;
            }
            return object;
          }
          function set(object, path, value) {
            return object == null ? object : baseSet(object, path, value);
          }
          function setWith(object, path, value, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            return object == null ? object : baseSet(object, path, value, customizer);
          }
          var toPairs = createToPairs(keys);
          var toPairsIn = createToPairs(keysIn);
          function transform(object, iteratee2, accumulator) {
            var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
            iteratee2 = getIteratee(iteratee2, 4);
            if (accumulator == null) {
              var Ctor = object && object.constructor;
              if (isArrLike) {
                accumulator = isArr ? new Ctor() : [];
              } else if (isObject(object)) {
                accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
              } else {
                accumulator = {};
              }
            }
            (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
              return iteratee2(accumulator, value, index, object2);
            });
            return accumulator;
          }
          function unset(object, path) {
            return object == null ? true : baseUnset(object, path);
          }
          function update(object, path, updater) {
            return object == null ? object : baseUpdate(object, path, castFunction(updater));
          }
          function updateWith(object, path, updater, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
          }
          function values(object) {
            return object == null ? [] : baseValues(object, keys(object));
          }
          function valuesIn(object) {
            return object == null ? [] : baseValues(object, keysIn(object));
          }
          function clamp(number, lower, upper) {
            if (upper === undefined2) {
              upper = lower;
              lower = undefined2;
            }
            if (upper !== undefined2) {
              upper = toNumber(upper);
              upper = upper === upper ? upper : 0;
            }
            if (lower !== undefined2) {
              lower = toNumber(lower);
              lower = lower === lower ? lower : 0;
            }
            return baseClamp(toNumber(number), lower, upper);
          }
          function inRange(number, start4, end) {
            start4 = toFinite(start4);
            if (end === undefined2) {
              end = start4;
              start4 = 0;
            } else {
              end = toFinite(end);
            }
            number = toNumber(number);
            return baseInRange(number, start4, end);
          }
          function random(lower, upper, floating) {
            if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
              upper = floating = undefined2;
            }
            if (floating === undefined2) {
              if (typeof upper == "boolean") {
                floating = upper;
                upper = undefined2;
              } else if (typeof lower == "boolean") {
                floating = lower;
                lower = undefined2;
              }
            }
            if (lower === undefined2 && upper === undefined2) {
              lower = 0;
              upper = 1;
            } else {
              lower = toFinite(lower);
              if (upper === undefined2) {
                upper = lower;
                lower = 0;
              } else {
                upper = toFinite(upper);
              }
            }
            if (lower > upper) {
              var temp = lower;
              lower = upper;
              upper = temp;
            }
            if (floating || lower % 1 || upper % 1) {
              var rand = nativeRandom();
              return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
            }
            return baseRandom(lower, upper);
          }
          var camelCase = createCompounder(function(result2, word, index) {
            word = word.toLowerCase();
            return result2 + (index ? capitalize2(word) : word);
          });
          function capitalize2(string) {
            return upperFirst(toString(string).toLowerCase());
          }
          function deburr(string) {
            string = toString(string);
            return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
          }
          function endsWith(string, target, position) {
            string = toString(string);
            target = baseToString(target);
            var length = string.length;
            position = position === undefined2 ? length : baseClamp(toInteger(position), 0, length);
            var end = position;
            position -= target.length;
            return position >= 0 && string.slice(position, end) == target;
          }
          function escape(string) {
            string = toString(string);
            return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
          }
          function escapeRegExp(string) {
            string = toString(string);
            return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
          }
          var kebabCase = createCompounder(function(result2, word, index) {
            return result2 + (index ? "-" : "") + word.toLowerCase();
          });
          var lowerCase = createCompounder(function(result2, word, index) {
            return result2 + (index ? " " : "") + word.toLowerCase();
          });
          var lowerFirst = createCaseFirst("toLowerCase");
          function pad(string, length, chars) {
            string = toString(string);
            length = toInteger(length);
            var strLength = length ? stringSize(string) : 0;
            if (!length || strLength >= length) {
              return string;
            }
            var mid = (length - strLength) / 2;
            return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
          }
          function padEnd(string, length, chars) {
            string = toString(string);
            length = toInteger(length);
            var strLength = length ? stringSize(string) : 0;
            return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
          }
          function padStart(string, length, chars) {
            string = toString(string);
            length = toInteger(length);
            var strLength = length ? stringSize(string) : 0;
            return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
          }
          function parseInt2(string, radix, guard) {
            if (guard || radix == null) {
              radix = 0;
            } else if (radix) {
              radix = +radix;
            }
            return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
          }
          function repeat(string, n2, guard) {
            if (guard ? isIterateeCall(string, n2, guard) : n2 === undefined2) {
              n2 = 1;
            } else {
              n2 = toInteger(n2);
            }
            return baseRepeat(toString(string), n2);
          }
          function replace() {
            var args = arguments, string = toString(args[0]);
            return args.length < 3 ? string : string.replace(args[1], args[2]);
          }
          var snakeCase = createCompounder(function(result2, word, index) {
            return result2 + (index ? "_" : "") + word.toLowerCase();
          });
          function split(string, separator, limit) {
            if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
              separator = limit = undefined2;
            }
            limit = limit === undefined2 ? MAX_ARRAY_LENGTH : limit >>> 0;
            if (!limit) {
              return [];
            }
            string = toString(string);
            if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
              separator = baseToString(separator);
              if (!separator && hasUnicode(string)) {
                return castSlice(stringToArray(string), 0, limit);
              }
            }
            return string.split(separator, limit);
          }
          var startCase = createCompounder(function(result2, word, index) {
            return result2 + (index ? " " : "") + upperFirst(word);
          });
          function startsWith(string, target, position) {
            string = toString(string);
            position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
            target = baseToString(target);
            return string.slice(position, position + target.length) == target;
          }
          function template(string, options, guard) {
            var settings = lodash.templateSettings;
            if (guard && isIterateeCall(string, options, guard)) {
              options = undefined2;
            }
            string = toString(string);
            options = assignInWith({}, options, settings, customDefaultsAssignIn);
            var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
            var isEscaping, isEvaluating, index = 0, interpolate2 = options.interpolate || reNoMatch, source = "__p += '";
            var reDelimiters = RegExp2(
              (options.escape || reNoMatch).source + "|" + interpolate2.source + "|" + (interpolate2 === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$",
              "g"
            );
            var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
            string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
              interpolateValue || (interpolateValue = esTemplateValue);
              source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
              if (escapeValue) {
                isEscaping = true;
                source += "' +\n__e(" + escapeValue + ") +\n'";
              }
              if (evaluateValue) {
                isEvaluating = true;
                source += "';\n" + evaluateValue + ";\n__p += '";
              }
              if (interpolateValue) {
                source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
              }
              index = offset + match.length;
              return match;
            });
            source += "';\n";
            var variable = hasOwnProperty.call(options, "variable") && options.variable;
            if (!variable) {
              source = "with (obj) {\n" + source + "\n}\n";
            } else if (reForbiddenIdentifierChars.test(variable)) {
              throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
            }
            source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
            source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
            var result2 = attempt(function() {
              return Function2(importsKeys, sourceURL + "return " + source).apply(undefined2, importsValues);
            });
            result2.source = source;
            if (isError(result2)) {
              throw result2;
            }
            return result2;
          }
          function toLower(value) {
            return toString(value).toLowerCase();
          }
          function toUpper(value) {
            return toString(value).toUpperCase();
          }
          function trim(string, chars, guard) {
            string = toString(string);
            if (string && (guard || chars === undefined2)) {
              return baseTrim(string);
            }
            if (!string || !(chars = baseToString(chars))) {
              return string;
            }
            var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start4 = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
            return castSlice(strSymbols, start4, end).join("");
          }
          function trimEnd(string, chars, guard) {
            string = toString(string);
            if (string && (guard || chars === undefined2)) {
              return string.slice(0, trimmedEndIndex(string) + 1);
            }
            if (!string || !(chars = baseToString(chars))) {
              return string;
            }
            var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
            return castSlice(strSymbols, 0, end).join("");
          }
          function trimStart(string, chars, guard) {
            string = toString(string);
            if (string && (guard || chars === undefined2)) {
              return string.replace(reTrimStart, "");
            }
            if (!string || !(chars = baseToString(chars))) {
              return string;
            }
            var strSymbols = stringToArray(string), start4 = charsStartIndex(strSymbols, stringToArray(chars));
            return castSlice(strSymbols, start4).join("");
          }
          function truncate(string, options) {
            var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
            if (isObject(options)) {
              var separator = "separator" in options ? options.separator : separator;
              length = "length" in options ? toInteger(options.length) : length;
              omission = "omission" in options ? baseToString(options.omission) : omission;
            }
            string = toString(string);
            var strLength = string.length;
            if (hasUnicode(string)) {
              var strSymbols = stringToArray(string);
              strLength = strSymbols.length;
            }
            if (length >= strLength) {
              return string;
            }
            var end = length - stringSize(omission);
            if (end < 1) {
              return omission;
            }
            var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
            if (separator === undefined2) {
              return result2 + omission;
            }
            if (strSymbols) {
              end += result2.length - end;
            }
            if (isRegExp(separator)) {
              if (string.slice(end).search(separator)) {
                var match, substring = result2;
                if (!separator.global) {
                  separator = RegExp2(separator.source, toString(reFlags.exec(separator)) + "g");
                }
                separator.lastIndex = 0;
                while (match = separator.exec(substring)) {
                  var newEnd = match.index;
                }
                result2 = result2.slice(0, newEnd === undefined2 ? end : newEnd);
              }
            } else if (string.indexOf(baseToString(separator), end) != end) {
              var index = result2.lastIndexOf(separator);
              if (index > -1) {
                result2 = result2.slice(0, index);
              }
            }
            return result2 + omission;
          }
          function unescape2(string) {
            string = toString(string);
            return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
          }
          var upperCase = createCompounder(function(result2, word, index) {
            return result2 + (index ? " " : "") + word.toUpperCase();
          });
          var upperFirst = createCaseFirst("toUpperCase");
          function words(string, pattern, guard) {
            string = toString(string);
            pattern = guard ? undefined2 : pattern;
            if (pattern === undefined2) {
              return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
            }
            return string.match(pattern) || [];
          }
          var attempt = baseRest(function(func, args) {
            try {
              return apply(func, undefined2, args);
            } catch (e2) {
              return isError(e2) ? e2 : new Error2(e2);
            }
          });
          var bindAll = flatRest(function(object, methodNames) {
            arrayEach(methodNames, function(key) {
              key = toKey(key);
              baseAssignValue(object, key, bind(object[key], object));
            });
            return object;
          });
          function cond(pairs) {
            var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
            pairs = !length ? [] : arrayMap(pairs, function(pair) {
              if (typeof pair[1] != "function") {
                throw new TypeError2(FUNC_ERROR_TEXT);
              }
              return [toIteratee(pair[0]), pair[1]];
            });
            return baseRest(function(args) {
              var index = -1;
              while (++index < length) {
                var pair = pairs[index];
                if (apply(pair[0], this, args)) {
                  return apply(pair[1], this, args);
                }
              }
            });
          }
          function conforms(source) {
            return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
          }
          function constant(value) {
            return function() {
              return value;
            };
          }
          function defaultTo(value, defaultValue) {
            return value == null || value !== value ? defaultValue : value;
          }
          var flow = createFlow();
          var flowRight = createFlow(true);
          function identity(value) {
            return value;
          }
          function iteratee(func) {
            return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
          }
          function matches(source) {
            return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
          }
          function matchesProperty(path, srcValue) {
            return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
          }
          var method = baseRest(function(path, args) {
            return function(object) {
              return baseInvoke(object, path, args);
            };
          });
          var methodOf = baseRest(function(object, args) {
            return function(path) {
              return baseInvoke(object, path, args);
            };
          });
          function mixin(object, source, options) {
            var props = keys(source), methodNames = baseFunctions(source, props);
            if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
              options = source;
              source = object;
              object = this;
              methodNames = baseFunctions(source, keys(source));
            }
            var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
            arrayEach(methodNames, function(methodName) {
              var func = source[methodName];
              object[methodName] = func;
              if (isFunc) {
                object.prototype[methodName] = function() {
                  var chainAll = this.__chain__;
                  if (chain2 || chainAll) {
                    var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                    actions.push({ "func": func, "args": arguments, "thisArg": object });
                    result2.__chain__ = chainAll;
                    return result2;
                  }
                  return func.apply(object, arrayPush([this.value()], arguments));
                };
              }
            });
            return object;
          }
          function noConflict() {
            if (root._ === this) {
              root._ = oldDash;
            }
            return this;
          }
          function noop() {
          }
          function nthArg(n2) {
            n2 = toInteger(n2);
            return baseRest(function(args) {
              return baseNth(args, n2);
            });
          }
          var over = createOver(arrayMap);
          var overEvery = createOver(arrayEvery);
          var overSome = createOver(arraySome);
          function property(path) {
            return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
          }
          function propertyOf(object) {
            return function(path) {
              return object == null ? undefined2 : baseGet(object, path);
            };
          }
          var range = createRange();
          var rangeRight = createRange(true);
          function stubArray() {
            return [];
          }
          function stubFalse() {
            return false;
          }
          function stubObject() {
            return {};
          }
          function stubString() {
            return "";
          }
          function stubTrue() {
            return true;
          }
          function times(n2, iteratee2) {
            n2 = toInteger(n2);
            if (n2 < 1 || n2 > MAX_SAFE_INTEGER) {
              return [];
            }
            var index = MAX_ARRAY_LENGTH, length = nativeMin(n2, MAX_ARRAY_LENGTH);
            iteratee2 = getIteratee(iteratee2);
            n2 -= MAX_ARRAY_LENGTH;
            var result2 = baseTimes(length, iteratee2);
            while (++index < n2) {
              iteratee2(index);
            }
            return result2;
          }
          function toPath(value) {
            if (isArray(value)) {
              return arrayMap(value, toKey);
            }
            return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
          }
          function uniqueId(prefix) {
            var id3 = ++idCounter;
            return toString(prefix) + id3;
          }
          var add2 = createMathOperation(function(augend, addend) {
            return augend + addend;
          }, 0);
          var ceil = createRound("ceil");
          var divide = createMathOperation(function(dividend, divisor) {
            return dividend / divisor;
          }, 1);
          var floor = createRound("floor");
          function max(array) {
            return array && array.length ? baseExtremum(array, identity, baseGt) : undefined2;
          }
          function maxBy(array, iteratee2) {
            return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined2;
          }
          function mean(array) {
            return baseMean(array, identity);
          }
          function meanBy(array, iteratee2) {
            return baseMean(array, getIteratee(iteratee2, 2));
          }
          function min(array) {
            return array && array.length ? baseExtremum(array, identity, baseLt) : undefined2;
          }
          function minBy(array, iteratee2) {
            return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined2;
          }
          var multiply = createMathOperation(function(multiplier, multiplicand) {
            return multiplier * multiplicand;
          }, 1);
          var round = createRound("round");
          var subtract = createMathOperation(function(minuend, subtrahend) {
            return minuend - subtrahend;
          }, 0);
          function sum(array) {
            return array && array.length ? baseSum(array, identity) : 0;
          }
          function sumBy(array, iteratee2) {
            return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
          }
          lodash.after = after;
          lodash.ary = ary;
          lodash.assign = assign;
          lodash.assignIn = assignIn;
          lodash.assignInWith = assignInWith;
          lodash.assignWith = assignWith;
          lodash.at = at2;
          lodash.before = before;
          lodash.bind = bind;
          lodash.bindAll = bindAll;
          lodash.bindKey = bindKey;
          lodash.castArray = castArray;
          lodash.chain = chain;
          lodash.chunk = chunk;
          lodash.compact = compact;
          lodash.concat = concat;
          lodash.cond = cond;
          lodash.conforms = conforms;
          lodash.constant = constant;
          lodash.countBy = countBy;
          lodash.create = create;
          lodash.curry = curry;
          lodash.curryRight = curryRight;
          lodash.debounce = debounce4;
          lodash.defaults = defaults;
          lodash.defaultsDeep = defaultsDeep;
          lodash.defer = defer;
          lodash.delay = delay;
          lodash.difference = difference;
          lodash.differenceBy = differenceBy;
          lodash.differenceWith = differenceWith;
          lodash.drop = drop;
          lodash.dropRight = dropRight;
          lodash.dropRightWhile = dropRightWhile;
          lodash.dropWhile = dropWhile;
          lodash.fill = fill;
          lodash.filter = filter;
          lodash.flatMap = flatMap;
          lodash.flatMapDeep = flatMapDeep;
          lodash.flatMapDepth = flatMapDepth;
          lodash.flatten = flatten;
          lodash.flattenDeep = flattenDeep;
          lodash.flattenDepth = flattenDepth;
          lodash.flip = flip;
          lodash.flow = flow;
          lodash.flowRight = flowRight;
          lodash.fromPairs = fromPairs;
          lodash.functions = functions;
          lodash.functionsIn = functionsIn;
          lodash.groupBy = groupBy;
          lodash.initial = initial;
          lodash.intersection = intersection;
          lodash.intersectionBy = intersectionBy;
          lodash.intersectionWith = intersectionWith;
          lodash.invert = invert;
          lodash.invertBy = invertBy;
          lodash.invokeMap = invokeMap;
          lodash.iteratee = iteratee;
          lodash.keyBy = keyBy;
          lodash.keys = keys;
          lodash.keysIn = keysIn;
          lodash.map = map;
          lodash.mapKeys = mapKeys;
          lodash.mapValues = mapValues;
          lodash.matches = matches;
          lodash.matchesProperty = matchesProperty;
          lodash.memoize = memoize;
          lodash.merge = merge;
          lodash.mergeWith = mergeWith;
          lodash.method = method;
          lodash.methodOf = methodOf;
          lodash.mixin = mixin;
          lodash.negate = negate;
          lodash.nthArg = nthArg;
          lodash.omit = omit;
          lodash.omitBy = omitBy;
          lodash.once = once;
          lodash.orderBy = orderBy;
          lodash.over = over;
          lodash.overArgs = overArgs;
          lodash.overEvery = overEvery;
          lodash.overSome = overSome;
          lodash.partial = partial;
          lodash.partialRight = partialRight;
          lodash.partition = partition;
          lodash.pick = pick;
          lodash.pickBy = pickBy;
          lodash.property = property;
          lodash.propertyOf = propertyOf;
          lodash.pull = pull;
          lodash.pullAll = pullAll;
          lodash.pullAllBy = pullAllBy;
          lodash.pullAllWith = pullAllWith;
          lodash.pullAt = pullAt;
          lodash.range = range;
          lodash.rangeRight = rangeRight;
          lodash.rearg = rearg;
          lodash.reject = reject;
          lodash.remove = remove;
          lodash.rest = rest;
          lodash.reverse = reverse;
          lodash.sampleSize = sampleSize;
          lodash.set = set;
          lodash.setWith = setWith;
          lodash.shuffle = shuffle;
          lodash.slice = slice;
          lodash.sortBy = sortBy;
          lodash.sortedUniq = sortedUniq;
          lodash.sortedUniqBy = sortedUniqBy;
          lodash.split = split;
          lodash.spread = spread;
          lodash.tail = tail;
          lodash.take = take;
          lodash.takeRight = takeRight;
          lodash.takeRightWhile = takeRightWhile;
          lodash.takeWhile = takeWhile;
          lodash.tap = tap;
          lodash.throttle = throttle;
          lodash.thru = thru;
          lodash.toArray = toArray3;
          lodash.toPairs = toPairs;
          lodash.toPairsIn = toPairsIn;
          lodash.toPath = toPath;
          lodash.toPlainObject = toPlainObject;
          lodash.transform = transform;
          lodash.unary = unary;
          lodash.union = union;
          lodash.unionBy = unionBy;
          lodash.unionWith = unionWith;
          lodash.uniq = uniq;
          lodash.uniqBy = uniqBy;
          lodash.uniqWith = uniqWith;
          lodash.unset = unset;
          lodash.unzip = unzip;
          lodash.unzipWith = unzipWith;
          lodash.update = update;
          lodash.updateWith = updateWith;
          lodash.values = values;
          lodash.valuesIn = valuesIn;
          lodash.without = without;
          lodash.words = words;
          lodash.wrap = wrap;
          lodash.xor = xor;
          lodash.xorBy = xorBy;
          lodash.xorWith = xorWith;
          lodash.zip = zip2;
          lodash.zipObject = zipObject;
          lodash.zipObjectDeep = zipObjectDeep;
          lodash.zipWith = zipWith;
          lodash.entries = toPairs;
          lodash.entriesIn = toPairsIn;
          lodash.extend = assignIn;
          lodash.extendWith = assignInWith;
          mixin(lodash, lodash);
          lodash.add = add2;
          lodash.attempt = attempt;
          lodash.camelCase = camelCase;
          lodash.capitalize = capitalize2;
          lodash.ceil = ceil;
          lodash.clamp = clamp;
          lodash.clone = clone;
          lodash.cloneDeep = cloneDeep;
          lodash.cloneDeepWith = cloneDeepWith;
          lodash.cloneWith = cloneWith;
          lodash.conformsTo = conformsTo;
          lodash.deburr = deburr;
          lodash.defaultTo = defaultTo;
          lodash.divide = divide;
          lodash.endsWith = endsWith;
          lodash.eq = eq;
          lodash.escape = escape;
          lodash.escapeRegExp = escapeRegExp;
          lodash.every = every;
          lodash.find = find;
          lodash.findIndex = findIndex;
          lodash.findKey = findKey;
          lodash.findLast = findLast;
          lodash.findLastIndex = findLastIndex;
          lodash.findLastKey = findLastKey;
          lodash.floor = floor;
          lodash.forEach = forEach;
          lodash.forEachRight = forEachRight;
          lodash.forIn = forIn;
          lodash.forInRight = forInRight;
          lodash.forOwn = forOwn;
          lodash.forOwnRight = forOwnRight;
          lodash.get = get;
          lodash.gt = gt2;
          lodash.gte = gte;
          lodash.has = has;
          lodash.hasIn = hasIn;
          lodash.head = head;
          lodash.identity = identity;
          lodash.includes = includes;
          lodash.indexOf = indexOf3;
          lodash.inRange = inRange;
          lodash.invoke = invoke;
          lodash.isArguments = isArguments;
          lodash.isArray = isArray;
          lodash.isArrayBuffer = isArrayBuffer;
          lodash.isArrayLike = isArrayLike;
          lodash.isArrayLikeObject = isArrayLikeObject;
          lodash.isBoolean = isBoolean;
          lodash.isBuffer = isBuffer;
          lodash.isDate = isDate;
          lodash.isElement = isElement;
          lodash.isEmpty = isEmpty;
          lodash.isEqual = isEqual;
          lodash.isEqualWith = isEqualWith;
          lodash.isError = isError;
          lodash.isFinite = isFinite;
          lodash.isFunction = isFunction;
          lodash.isInteger = isInteger;
          lodash.isLength = isLength;
          lodash.isMap = isMap;
          lodash.isMatch = isMatch;
          lodash.isMatchWith = isMatchWith;
          lodash.isNaN = isNaN;
          lodash.isNative = isNative;
          lodash.isNil = isNil;
          lodash.isNull = isNull;
          lodash.isNumber = isNumber;
          lodash.isObject = isObject;
          lodash.isObjectLike = isObjectLike;
          lodash.isPlainObject = isPlainObject;
          lodash.isRegExp = isRegExp;
          lodash.isSafeInteger = isSafeInteger;
          lodash.isSet = isSet;
          lodash.isString = isString;
          lodash.isSymbol = isSymbol;
          lodash.isTypedArray = isTypedArray;
          lodash.isUndefined = isUndefined;
          lodash.isWeakMap = isWeakMap;
          lodash.isWeakSet = isWeakSet;
          lodash.join = join;
          lodash.kebabCase = kebabCase;
          lodash.last = last;
          lodash.lastIndexOf = lastIndexOf;
          lodash.lowerCase = lowerCase;
          lodash.lowerFirst = lowerFirst;
          lodash.lt = lt2;
          lodash.lte = lte;
          lodash.max = max;
          lodash.maxBy = maxBy;
          lodash.mean = mean;
          lodash.meanBy = meanBy;
          lodash.min = min;
          lodash.minBy = minBy;
          lodash.stubArray = stubArray;
          lodash.stubFalse = stubFalse;
          lodash.stubObject = stubObject;
          lodash.stubString = stubString;
          lodash.stubTrue = stubTrue;
          lodash.multiply = multiply;
          lodash.nth = nth;
          lodash.noConflict = noConflict;
          lodash.noop = noop;
          lodash.now = now3;
          lodash.pad = pad;
          lodash.padEnd = padEnd;
          lodash.padStart = padStart;
          lodash.parseInt = parseInt2;
          lodash.random = random;
          lodash.reduce = reduce;
          lodash.reduceRight = reduceRight;
          lodash.repeat = repeat;
          lodash.replace = replace;
          lodash.result = result;
          lodash.round = round;
          lodash.runInContext = runInContext2;
          lodash.sample = sample;
          lodash.size = size;
          lodash.snakeCase = snakeCase;
          lodash.some = some;
          lodash.sortedIndex = sortedIndex;
          lodash.sortedIndexBy = sortedIndexBy;
          lodash.sortedIndexOf = sortedIndexOf;
          lodash.sortedLastIndex = sortedLastIndex;
          lodash.sortedLastIndexBy = sortedLastIndexBy;
          lodash.sortedLastIndexOf = sortedLastIndexOf;
          lodash.startCase = startCase;
          lodash.startsWith = startsWith;
          lodash.subtract = subtract;
          lodash.sum = sum;
          lodash.sumBy = sumBy;
          lodash.template = template;
          lodash.times = times;
          lodash.toFinite = toFinite;
          lodash.toInteger = toInteger;
          lodash.toLength = toLength;
          lodash.toLower = toLower;
          lodash.toNumber = toNumber;
          lodash.toSafeInteger = toSafeInteger;
          lodash.toString = toString;
          lodash.toUpper = toUpper;
          lodash.trim = trim;
          lodash.trimEnd = trimEnd;
          lodash.trimStart = trimStart;
          lodash.truncate = truncate;
          lodash.unescape = unescape2;
          lodash.uniqueId = uniqueId;
          lodash.upperCase = upperCase;
          lodash.upperFirst = upperFirst;
          lodash.each = forEach;
          lodash.eachRight = forEachRight;
          lodash.first = head;
          mixin(lodash, (function() {
            var source = {};
            baseForOwn(lodash, function(func, methodName) {
              if (!hasOwnProperty.call(lodash.prototype, methodName)) {
                source[methodName] = func;
              }
            });
            return source;
          })(), { "chain": false });
          lodash.VERSION = VERSION;
          arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
            lodash[methodName].placeholder = lodash;
          });
          arrayEach(["drop", "take"], function(methodName, index) {
            LazyWrapper.prototype[methodName] = function(n2) {
              n2 = n2 === undefined2 ? 1 : nativeMax(toInteger(n2), 0);
              var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
              if (result2.__filtered__) {
                result2.__takeCount__ = nativeMin(n2, result2.__takeCount__);
              } else {
                result2.__views__.push({
                  "size": nativeMin(n2, MAX_ARRAY_LENGTH),
                  "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
                });
              }
              return result2;
            };
            LazyWrapper.prototype[methodName + "Right"] = function(n2) {
              return this.reverse()[methodName](n2).reverse();
            };
          });
          arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
            var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
            LazyWrapper.prototype[methodName] = function(iteratee2) {
              var result2 = this.clone();
              result2.__iteratees__.push({
                "iteratee": getIteratee(iteratee2, 3),
                "type": type
              });
              result2.__filtered__ = result2.__filtered__ || isFilter;
              return result2;
            };
          });
          arrayEach(["head", "last"], function(methodName, index) {
            var takeName = "take" + (index ? "Right" : "");
            LazyWrapper.prototype[methodName] = function() {
              return this[takeName](1).value()[0];
            };
          });
          arrayEach(["initial", "tail"], function(methodName, index) {
            var dropName = "drop" + (index ? "" : "Right");
            LazyWrapper.prototype[methodName] = function() {
              return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
            };
          });
          LazyWrapper.prototype.compact = function() {
            return this.filter(identity);
          };
          LazyWrapper.prototype.find = function(predicate) {
            return this.filter(predicate).head();
          };
          LazyWrapper.prototype.findLast = function(predicate) {
            return this.reverse().find(predicate);
          };
          LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
            if (typeof path == "function") {
              return new LazyWrapper(this);
            }
            return this.map(function(value) {
              return baseInvoke(value, path, args);
            });
          });
          LazyWrapper.prototype.reject = function(predicate) {
            return this.filter(negate(getIteratee(predicate)));
          };
          LazyWrapper.prototype.slice = function(start4, end) {
            start4 = toInteger(start4);
            var result2 = this;
            if (result2.__filtered__ && (start4 > 0 || end < 0)) {
              return new LazyWrapper(result2);
            }
            if (start4 < 0) {
              result2 = result2.takeRight(-start4);
            } else if (start4) {
              result2 = result2.drop(start4);
            }
            if (end !== undefined2) {
              end = toInteger(end);
              result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start4);
            }
            return result2;
          };
          LazyWrapper.prototype.takeRightWhile = function(predicate) {
            return this.reverse().takeWhile(predicate).reverse();
          };
          LazyWrapper.prototype.toArray = function() {
            return this.take(MAX_ARRAY_LENGTH);
          };
          baseForOwn(LazyWrapper.prototype, function(func, methodName) {
            var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
            if (!lodashFunc) {
              return;
            }
            lodash.prototype[methodName] = function() {
              var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value);
              var interceptor = function(value2) {
                var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
                return isTaker && chainAll ? result3[0] : result3;
              };
              if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
                isLazy = useLazy = false;
              }
              var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
              if (!retUnwrapped && useLazy) {
                value = onlyLazy ? value : new LazyWrapper(this);
                var result2 = func.apply(value, args);
                result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": undefined2 });
                return new LodashWrapper(result2, chainAll);
              }
              if (isUnwrapped && onlyLazy) {
                return func.apply(this, args);
              }
              result2 = this.thru(interceptor);
              return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
            };
          });
          arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
            var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
            lodash.prototype[methodName] = function() {
              var args = arguments;
              if (retUnwrapped && !this.__chain__) {
                var value = this.value();
                return func.apply(isArray(value) ? value : [], args);
              }
              return this[chainName](function(value2) {
                return func.apply(isArray(value2) ? value2 : [], args);
              });
            };
          });
          baseForOwn(LazyWrapper.prototype, function(func, methodName) {
            var lodashFunc = lodash[methodName];
            if (lodashFunc) {
              var key = lodashFunc.name + "";
              if (!hasOwnProperty.call(realNames, key)) {
                realNames[key] = [];
              }
              realNames[key].push({ "name": methodName, "func": lodashFunc });
            }
          });
          realNames[createHybrid(undefined2, WRAP_BIND_KEY_FLAG).name] = [{
            "name": "wrapper",
            "func": undefined2
          }];
          LazyWrapper.prototype.clone = lazyClone;
          LazyWrapper.prototype.reverse = lazyReverse;
          LazyWrapper.prototype.value = lazyValue;
          lodash.prototype.at = wrapperAt;
          lodash.prototype.chain = wrapperChain;
          lodash.prototype.commit = wrapperCommit;
          lodash.prototype.next = wrapperNext;
          lodash.prototype.plant = wrapperPlant;
          lodash.prototype.reverse = wrapperReverse;
          lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
          lodash.prototype.first = lodash.prototype.head;
          if (symIterator) {
            lodash.prototype[symIterator] = wrapperToIterator;
          }
          return lodash;
        });
        var _2 = runInContext();
        if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
          root._ = _2;
          define(function() {
            return _2;
          });
        } else if (freeModule) {
          (freeModule.exports = _2)._ = _2;
          freeExports._ = _2;
        } else {
          root._ = _2;
        }
      }).call(exports);
    }
  });

  // ../../node_modules/@rails/ujs/lib/assets/compiled/rails-ujs.js
  var require_rails_ujs = __commonJS({
    "../../node_modules/@rails/ujs/lib/assets/compiled/rails-ujs.js"(exports, module) {
      (function() {
        var context = this;
        (function() {
          (function() {
            this.Rails = {
              linkClickSelector: "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]",
              buttonClickSelector: {
                selector: "button[data-remote]:not([form]), button[data-confirm]:not([form])",
                exclude: "form button"
              },
              inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
              formSubmitSelector: "form:not([data-turbo=true])",
              formInputClickSelector: "form:not([data-turbo=true]) input[type=submit], form:not([data-turbo=true]) input[type=image], form:not([data-turbo=true]) button[type=submit], form:not([data-turbo=true]) button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
              formDisableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
              formEnableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
              fileInputSelector: "input[name][type=file]:not([disabled])",
              linkDisableSelector: "a[data-disable-with], a[data-disable]",
              buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]"
            };
          }).call(this);
        }).call(context);
        var Rails2 = context.Rails;
        (function() {
          (function() {
            var nonce;
            nonce = null;
            Rails2.loadCSPNonce = function() {
              var ref;
              return nonce = (ref = document.querySelector("meta[name=csp-nonce]")) != null ? ref.content : void 0;
            };
            Rails2.cspNonce = function() {
              return nonce != null ? nonce : Rails2.loadCSPNonce();
            };
          }).call(this);
          (function() {
            var expando, m2;
            m2 = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;
            Rails2.matches = function(element, selector) {
              if (selector.exclude != null) {
                return m2.call(element, selector.selector) && !m2.call(element, selector.exclude);
              } else {
                return m2.call(element, selector);
              }
            };
            expando = "_ujsData";
            Rails2.getData = function(element, key) {
              var ref;
              return (ref = element[expando]) != null ? ref[key] : void 0;
            };
            Rails2.setData = function(element, key, value) {
              if (element[expando] == null) {
                element[expando] = {};
              }
              return element[expando][key] = value;
            };
            Rails2.isContentEditable = function(element) {
              var isEditable;
              isEditable = false;
              while (true) {
                if (element.isContentEditable) {
                  isEditable = true;
                  break;
                }
                element = element.parentElement;
                if (!element) {
                  break;
                }
              }
              return isEditable;
            };
            Rails2.$ = function(selector) {
              return Array.prototype.slice.call(document.querySelectorAll(selector));
            };
          }).call(this);
          (function() {
            var $2, csrfParam, csrfToken;
            $2 = Rails2.$;
            csrfToken = Rails2.csrfToken = function() {
              var meta;
              meta = document.querySelector("meta[name=csrf-token]");
              return meta && meta.content;
            };
            csrfParam = Rails2.csrfParam = function() {
              var meta;
              meta = document.querySelector("meta[name=csrf-param]");
              return meta && meta.content;
            };
            Rails2.CSRFProtection = function(xhr) {
              var token;
              token = csrfToken();
              if (token != null) {
                return xhr.setRequestHeader("X-CSRF-Token", token);
              }
            };
            Rails2.refreshCSRFTokens = function() {
              var param, token;
              token = csrfToken();
              param = csrfParam();
              if (token != null && param != null) {
                return $2('form input[name="' + param + '"]').forEach(function(input) {
                  return input.value = token;
                });
              }
            };
          }).call(this);
          (function() {
            var CustomEvent2, fire2, matches, preventDefault;
            matches = Rails2.matches;
            CustomEvent2 = window.CustomEvent;
            if (typeof CustomEvent2 !== "function") {
              CustomEvent2 = function(event, params) {
                var evt;
                evt = document.createEvent("CustomEvent");
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
              };
              CustomEvent2.prototype = window.Event.prototype;
              preventDefault = CustomEvent2.prototype.preventDefault;
              CustomEvent2.prototype.preventDefault = function() {
                var result;
                result = preventDefault.call(this);
                if (this.cancelable && !this.defaultPrevented) {
                  Object.defineProperty(this, "defaultPrevented", {
                    get: function() {
                      return true;
                    }
                  });
                }
                return result;
              };
            }
            fire2 = Rails2.fire = function(obj, name, data) {
              var event;
              event = new CustomEvent2(name, {
                bubbles: true,
                cancelable: true,
                detail: data
              });
              obj.dispatchEvent(event);
              return !event.defaultPrevented;
            };
            Rails2.stopEverything = function(e2) {
              fire2(e2.target, "ujs:everythingStopped");
              e2.preventDefault();
              e2.stopPropagation();
              return e2.stopImmediatePropagation();
            };
            Rails2.delegate = function(element, selector, eventType, handler) {
              return element.addEventListener(eventType, function(e2) {
                var target;
                target = e2.target;
                while (!(!(target instanceof Element) || matches(target, selector))) {
                  target = target.parentNode;
                }
                if (target instanceof Element && handler.call(target, e2) === false) {
                  e2.preventDefault();
                  return e2.stopPropagation();
                }
              });
            };
          }).call(this);
          (function() {
            var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire2, prepareOptions, processResponse;
            cspNonce = Rails2.cspNonce, CSRFProtection = Rails2.CSRFProtection, fire2 = Rails2.fire;
            AcceptHeaders = {
              "*": "*/*",
              text: "text/plain",
              html: "text/html",
              xml: "application/xml, text/xml",
              json: "application/json, text/javascript",
              script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            };
            Rails2.ajax = function(options) {
              var xhr;
              options = prepareOptions(options);
              xhr = createXHR(options, function() {
                var ref, response;
                response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader("Content-Type"));
                if (Math.floor(xhr.status / 100) === 2) {
                  if (typeof options.success === "function") {
                    options.success(response, xhr.statusText, xhr);
                  }
                } else {
                  if (typeof options.error === "function") {
                    options.error(response, xhr.statusText, xhr);
                  }
                }
                return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
              });
              if (options.beforeSend != null && !options.beforeSend(xhr, options)) {
                return false;
              }
              if (xhr.readyState === XMLHttpRequest.OPENED) {
                return xhr.send(options.data);
              }
            };
            prepareOptions = function(options) {
              options.url = options.url || location.href;
              options.type = options.type.toUpperCase();
              if (options.type === "GET" && options.data) {
                if (options.url.indexOf("?") < 0) {
                  options.url += "?" + options.data;
                } else {
                  options.url += "&" + options.data;
                }
              }
              if (AcceptHeaders[options.dataType] == null) {
                options.dataType = "*";
              }
              options.accept = AcceptHeaders[options.dataType];
              if (options.dataType !== "*") {
                options.accept += ", */*; q=0.01";
              }
              return options;
            };
            createXHR = function(options, done) {
              var xhr;
              xhr = new XMLHttpRequest();
              xhr.open(options.type, options.url, true);
              xhr.setRequestHeader("Accept", options.accept);
              if (typeof options.data === "string") {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
              }
              if (!options.crossDomain) {
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                CSRFProtection(xhr);
              }
              xhr.withCredentials = !!options.withCredentials;
              xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                  return done(xhr);
                }
              };
              return xhr;
            };
            processResponse = function(response, type) {
              var parser, script;
              if (typeof response === "string" && typeof type === "string") {
                if (type.match(/\bjson\b/)) {
                  try {
                    response = JSON.parse(response);
                  } catch (error2) {
                  }
                } else if (type.match(/\b(?:java|ecma)script\b/)) {
                  script = document.createElement("script");
                  script.setAttribute("nonce", cspNonce());
                  script.text = response;
                  document.head.appendChild(script).parentNode.removeChild(script);
                } else if (type.match(/\b(xml|html|svg)\b/)) {
                  parser = new DOMParser();
                  type = type.replace(/;.+/, "");
                  try {
                    response = parser.parseFromString(response, type);
                  } catch (error2) {
                  }
                }
              }
              return response;
            };
            Rails2.href = function(element) {
              return element.href;
            };
            Rails2.isCrossDomain = function(url) {
              var e2, originAnchor, urlAnchor;
              originAnchor = document.createElement("a");
              originAnchor.href = location.href;
              urlAnchor = document.createElement("a");
              try {
                urlAnchor.href = url;
                return !((!urlAnchor.protocol || urlAnchor.protocol === ":") && !urlAnchor.host || originAnchor.protocol + "//" + originAnchor.host === urlAnchor.protocol + "//" + urlAnchor.host);
              } catch (error2) {
                e2 = error2;
                return true;
              }
            };
          }).call(this);
          (function() {
            var matches, toArray3;
            matches = Rails2.matches;
            toArray3 = function(e2) {
              return Array.prototype.slice.call(e2);
            };
            Rails2.serializeElement = function(element, additionalParam) {
              var inputs, params;
              inputs = [element];
              if (matches(element, "form")) {
                inputs = toArray3(element.elements);
              }
              params = [];
              inputs.forEach(function(input) {
                if (!input.name || input.disabled) {
                  return;
                }
                if (matches(input, "fieldset[disabled] *")) {
                  return;
                }
                if (matches(input, "select")) {
                  return toArray3(input.options).forEach(function(option) {
                    if (option.selected) {
                      return params.push({
                        name: input.name,
                        value: option.value
                      });
                    }
                  });
                } else if (input.checked || ["radio", "checkbox", "submit"].indexOf(input.type) === -1) {
                  return params.push({
                    name: input.name,
                    value: input.value
                  });
                }
              });
              if (additionalParam) {
                params.push(additionalParam);
              }
              return params.map(function(param) {
                if (param.name != null) {
                  return encodeURIComponent(param.name) + "=" + encodeURIComponent(param.value);
                } else {
                  return param;
                }
              }).join("&");
            };
            Rails2.formElements = function(form, selector) {
              if (matches(form, "form")) {
                return toArray3(form.elements).filter(function(el) {
                  return matches(el, selector);
                });
              } else {
                return toArray3(form.querySelectorAll(selector));
              }
            };
          }).call(this);
          (function() {
            var allowAction, fire2, stopEverything;
            fire2 = Rails2.fire, stopEverything = Rails2.stopEverything;
            Rails2.handleConfirm = function(e2) {
              if (!allowAction(this)) {
                return stopEverything(e2);
              }
            };
            Rails2.confirm = function(message, element) {
              return confirm(message);
            };
            allowAction = function(element) {
              var answer, callback, message;
              message = element.getAttribute("data-confirm");
              if (!message) {
                return true;
              }
              answer = false;
              if (fire2(element, "confirm")) {
                try {
                  answer = Rails2.confirm(message, element);
                } catch (error2) {
                }
                callback = fire2(element, "confirm:complete", [answer]);
              }
              return answer && callback;
            };
          }).call(this);
          (function() {
            var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, isContentEditable, isXhrRedirect, matches, setData, stopEverything;
            matches = Rails2.matches, getData = Rails2.getData, setData = Rails2.setData, stopEverything = Rails2.stopEverything, formElements = Rails2.formElements, isContentEditable = Rails2.isContentEditable;
            Rails2.handleDisabledElement = function(e2) {
              var element;
              element = this;
              if (element.disabled) {
                return stopEverything(e2);
              }
            };
            Rails2.enableElement = function(e2) {
              var element;
              if (e2 instanceof Event) {
                if (isXhrRedirect(e2)) {
                  return;
                }
                element = e2.target;
              } else {
                element = e2;
              }
              if (isContentEditable(element)) {
                return;
              }
              if (matches(element, Rails2.linkDisableSelector)) {
                return enableLinkElement(element);
              } else if (matches(element, Rails2.buttonDisableSelector) || matches(element, Rails2.formEnableSelector)) {
                return enableFormElement(element);
              } else if (matches(element, Rails2.formSubmitSelector)) {
                return enableFormElements(element);
              }
            };
            Rails2.disableElement = function(e2) {
              var element;
              element = e2 instanceof Event ? e2.target : e2;
              if (isContentEditable(element)) {
                return;
              }
              if (matches(element, Rails2.linkDisableSelector)) {
                return disableLinkElement(element);
              } else if (matches(element, Rails2.buttonDisableSelector) || matches(element, Rails2.formDisableSelector)) {
                return disableFormElement(element);
              } else if (matches(element, Rails2.formSubmitSelector)) {
                return disableFormElements(element);
              }
            };
            disableLinkElement = function(element) {
              var replacement;
              if (getData(element, "ujs:disabled")) {
                return;
              }
              replacement = element.getAttribute("data-disable-with");
              if (replacement != null) {
                setData(element, "ujs:enable-with", element.innerHTML);
                element.innerHTML = replacement;
              }
              element.addEventListener("click", stopEverything);
              return setData(element, "ujs:disabled", true);
            };
            enableLinkElement = function(element) {
              var originalText;
              originalText = getData(element, "ujs:enable-with");
              if (originalText != null) {
                element.innerHTML = originalText;
                setData(element, "ujs:enable-with", null);
              }
              element.removeEventListener("click", stopEverything);
              return setData(element, "ujs:disabled", null);
            };
            disableFormElements = function(form) {
              return formElements(form, Rails2.formDisableSelector).forEach(disableFormElement);
            };
            disableFormElement = function(element) {
              var replacement;
              if (getData(element, "ujs:disabled")) {
                return;
              }
              replacement = element.getAttribute("data-disable-with");
              if (replacement != null) {
                if (matches(element, "button")) {
                  setData(element, "ujs:enable-with", element.innerHTML);
                  element.innerHTML = replacement;
                } else {
                  setData(element, "ujs:enable-with", element.value);
                  element.value = replacement;
                }
              }
              element.disabled = true;
              return setData(element, "ujs:disabled", true);
            };
            enableFormElements = function(form) {
              return formElements(form, Rails2.formEnableSelector).forEach(enableFormElement);
            };
            enableFormElement = function(element) {
              var originalText;
              originalText = getData(element, "ujs:enable-with");
              if (originalText != null) {
                if (matches(element, "button")) {
                  element.innerHTML = originalText;
                } else {
                  element.value = originalText;
                }
                setData(element, "ujs:enable-with", null);
              }
              element.disabled = false;
              return setData(element, "ujs:disabled", null);
            };
            isXhrRedirect = function(event) {
              var ref, xhr;
              xhr = (ref = event.detail) != null ? ref[0] : void 0;
              return (xhr != null ? xhr.getResponseHeader("X-Xhr-Redirect") : void 0) != null;
            };
          }).call(this);
          (function() {
            var isContentEditable, stopEverything;
            stopEverything = Rails2.stopEverything;
            isContentEditable = Rails2.isContentEditable;
            Rails2.handleMethod = function(e2) {
              var csrfParam, csrfToken, form, formContent, href, link, method;
              link = this;
              method = link.getAttribute("data-method");
              if (!method) {
                return;
              }
              if (isContentEditable(this)) {
                return;
              }
              href = Rails2.href(link);
              csrfToken = Rails2.csrfToken();
              csrfParam = Rails2.csrfParam();
              form = document.createElement("form");
              formContent = "<input name='_method' value='" + method + "' type='hidden' />";
              if (csrfParam != null && csrfToken != null && !Rails2.isCrossDomain(href)) {
                formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
              }
              formContent += '<input type="submit" />';
              form.method = "post";
              form.action = href;
              form.target = link.target;
              form.innerHTML = formContent;
              form.style.display = "none";
              document.body.appendChild(form);
              form.querySelector('[type="submit"]').click();
              return stopEverything(e2);
            };
          }).call(this);
          (function() {
            var ajax, fire2, getData, isContentEditable, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything, slice = [].slice;
            matches = Rails2.matches, getData = Rails2.getData, setData = Rails2.setData, fire2 = Rails2.fire, stopEverything = Rails2.stopEverything, ajax = Rails2.ajax, isCrossDomain = Rails2.isCrossDomain, serializeElement = Rails2.serializeElement, isContentEditable = Rails2.isContentEditable;
            isRemote = function(element) {
              var value;
              value = element.getAttribute("data-remote");
              return value != null && value !== "false";
            };
            Rails2.handleRemote = function(e2) {
              var button, data, dataType, element, method, url, withCredentials;
              element = this;
              if (!isRemote(element)) {
                return true;
              }
              if (!fire2(element, "ajax:before")) {
                fire2(element, "ajax:stopped");
                return false;
              }
              if (isContentEditable(element)) {
                fire2(element, "ajax:stopped");
                return false;
              }
              withCredentials = element.getAttribute("data-with-credentials");
              dataType = element.getAttribute("data-type") || "script";
              if (matches(element, Rails2.formSubmitSelector)) {
                button = getData(element, "ujs:submit-button");
                method = getData(element, "ujs:submit-button-formmethod") || element.method;
                url = getData(element, "ujs:submit-button-formaction") || element.getAttribute("action") || location.href;
                if (method.toUpperCase() === "GET") {
                  url = url.replace(/\?.*$/, "");
                }
                if (element.enctype === "multipart/form-data") {
                  data = new FormData(element);
                  if (button != null) {
                    data.append(button.name, button.value);
                  }
                } else {
                  data = serializeElement(element, button);
                }
                setData(element, "ujs:submit-button", null);
                setData(element, "ujs:submit-button-formmethod", null);
                setData(element, "ujs:submit-button-formaction", null);
              } else if (matches(element, Rails2.buttonClickSelector) || matches(element, Rails2.inputChangeSelector)) {
                method = element.getAttribute("data-method");
                url = element.getAttribute("data-url");
                data = serializeElement(element, element.getAttribute("data-params"));
              } else {
                method = element.getAttribute("data-method");
                url = Rails2.href(element);
                data = element.getAttribute("data-params");
              }
              ajax({
                type: method || "GET",
                url,
                data,
                dataType,
                beforeSend: function(xhr, options) {
                  if (fire2(element, "ajax:beforeSend", [xhr, options])) {
                    return fire2(element, "ajax:send", [xhr]);
                  } else {
                    fire2(element, "ajax:stopped");
                    return false;
                  }
                },
                success: function() {
                  var args;
                  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                  return fire2(element, "ajax:success", args);
                },
                error: function() {
                  var args;
                  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                  return fire2(element, "ajax:error", args);
                },
                complete: function() {
                  var args;
                  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                  return fire2(element, "ajax:complete", args);
                },
                crossDomain: isCrossDomain(url),
                withCredentials: withCredentials != null && withCredentials !== "false"
              });
              return stopEverything(e2);
            };
            Rails2.formSubmitButtonClick = function(e2) {
              var button, form;
              button = this;
              form = button.form;
              if (!form) {
                return;
              }
              if (button.name) {
                setData(form, "ujs:submit-button", {
                  name: button.name,
                  value: button.value
                });
              }
              setData(form, "ujs:formnovalidate-button", button.formNoValidate);
              setData(form, "ujs:submit-button-formaction", button.getAttribute("formaction"));
              return setData(form, "ujs:submit-button-formmethod", button.getAttribute("formmethod"));
            };
            Rails2.preventInsignificantClick = function(e2) {
              var data, insignificantMetaClick, link, metaClick, method, nonPrimaryMouseClick;
              link = this;
              method = (link.getAttribute("data-method") || "GET").toUpperCase();
              data = link.getAttribute("data-params");
              metaClick = e2.metaKey || e2.ctrlKey;
              insignificantMetaClick = metaClick && method === "GET" && !data;
              nonPrimaryMouseClick = e2.button != null && e2.button !== 0;
              if (nonPrimaryMouseClick || insignificantMetaClick) {
                return e2.stopImmediatePropagation();
              }
            };
          }).call(this);
          (function() {
            var $2, CSRFProtection, delegate, disableElement, enableElement, fire2, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMethod, handleRemote, loadCSPNonce, preventInsignificantClick, refreshCSRFTokens;
            fire2 = Rails2.fire, delegate = Rails2.delegate, getData = Rails2.getData, $2 = Rails2.$, refreshCSRFTokens = Rails2.refreshCSRFTokens, CSRFProtection = Rails2.CSRFProtection, loadCSPNonce = Rails2.loadCSPNonce, enableElement = Rails2.enableElement, disableElement = Rails2.disableElement, handleDisabledElement = Rails2.handleDisabledElement, handleConfirm = Rails2.handleConfirm, preventInsignificantClick = Rails2.preventInsignificantClick, handleRemote = Rails2.handleRemote, formSubmitButtonClick = Rails2.formSubmitButtonClick, handleMethod = Rails2.handleMethod;
            if (typeof jQuery !== "undefined" && jQuery !== null && jQuery.ajax != null) {
              if (jQuery.rails) {
                throw new Error("If you load both jquery_ujs and rails-ujs, use rails-ujs only.");
              }
              jQuery.rails = Rails2;
              jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
                if (!options.crossDomain) {
                  return CSRFProtection(xhr);
                }
              });
            }
            Rails2.start = function() {
              if (window._rails_loaded) {
                throw new Error("rails-ujs has already been loaded!");
              }
              window.addEventListener("pageshow", function() {
                $2(Rails2.formEnableSelector).forEach(function(el) {
                  if (getData(el, "ujs:disabled")) {
                    return enableElement(el);
                  }
                });
                return $2(Rails2.linkDisableSelector).forEach(function(el) {
                  if (getData(el, "ujs:disabled")) {
                    return enableElement(el);
                  }
                });
              });
              delegate(document, Rails2.linkDisableSelector, "ajax:complete", enableElement);
              delegate(document, Rails2.linkDisableSelector, "ajax:stopped", enableElement);
              delegate(document, Rails2.buttonDisableSelector, "ajax:complete", enableElement);
              delegate(document, Rails2.buttonDisableSelector, "ajax:stopped", enableElement);
              delegate(document, Rails2.linkClickSelector, "click", preventInsignificantClick);
              delegate(document, Rails2.linkClickSelector, "click", handleDisabledElement);
              delegate(document, Rails2.linkClickSelector, "click", handleConfirm);
              delegate(document, Rails2.linkClickSelector, "click", disableElement);
              delegate(document, Rails2.linkClickSelector, "click", handleRemote);
              delegate(document, Rails2.linkClickSelector, "click", handleMethod);
              delegate(document, Rails2.buttonClickSelector, "click", preventInsignificantClick);
              delegate(document, Rails2.buttonClickSelector, "click", handleDisabledElement);
              delegate(document, Rails2.buttonClickSelector, "click", handleConfirm);
              delegate(document, Rails2.buttonClickSelector, "click", disableElement);
              delegate(document, Rails2.buttonClickSelector, "click", handleRemote);
              delegate(document, Rails2.inputChangeSelector, "change", handleDisabledElement);
              delegate(document, Rails2.inputChangeSelector, "change", handleConfirm);
              delegate(document, Rails2.inputChangeSelector, "change", handleRemote);
              delegate(document, Rails2.formSubmitSelector, "submit", handleDisabledElement);
              delegate(document, Rails2.formSubmitSelector, "submit", handleConfirm);
              delegate(document, Rails2.formSubmitSelector, "submit", handleRemote);
              delegate(document, Rails2.formSubmitSelector, "submit", function(e2) {
                return setTimeout((function() {
                  return disableElement(e2);
                }), 13);
              });
              delegate(document, Rails2.formSubmitSelector, "ajax:send", disableElement);
              delegate(document, Rails2.formSubmitSelector, "ajax:complete", enableElement);
              delegate(document, Rails2.formInputClickSelector, "click", preventInsignificantClick);
              delegate(document, Rails2.formInputClickSelector, "click", handleDisabledElement);
              delegate(document, Rails2.formInputClickSelector, "click", handleConfirm);
              delegate(document, Rails2.formInputClickSelector, "click", formSubmitButtonClick);
              document.addEventListener("DOMContentLoaded", refreshCSRFTokens);
              document.addEventListener("DOMContentLoaded", loadCSPNonce);
              return window._rails_loaded = true;
            };
            if (window.Rails === Rails2 && fire2(document, "rails:attachBindings")) {
              Rails2.start();
            }
          }).call(this);
        }).call(this);
        if (typeof module === "object" && module.exports) {
          module.exports = Rails2;
        } else if (typeof define === "function" && define.amd) {
          define(Rails2);
        }
      }).call(exports);
    }
  });

  // ../../node_modules/@rails/actioncable/app/assets/javascripts/actioncable.esm.js
  var adapters = {
    logger: typeof console !== "undefined" ? console : void 0,
    WebSocket: typeof WebSocket !== "undefined" ? WebSocket : void 0
  };
  var logger = {
    log(...messages) {
      if (this.enabled) {
        messages.push(Date.now());
        adapters.logger.log("[ActionCable]", ...messages);
      }
    }
  };
  var now = () => (/* @__PURE__ */ new Date()).getTime();
  var secondsSince = (time) => (now() - time) / 1e3;
  var ConnectionMonitor = class {
    constructor(connection) {
      this.visibilityDidChange = this.visibilityDidChange.bind(this);
      this.connection = connection;
      this.reconnectAttempts = 0;
    }
    start() {
      if (!this.isRunning()) {
        this.startedAt = now();
        delete this.stoppedAt;
        this.startPolling();
        addEventListener("visibilitychange", this.visibilityDidChange);
        logger.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
      }
    }
    stop() {
      if (this.isRunning()) {
        this.stoppedAt = now();
        this.stopPolling();
        removeEventListener("visibilitychange", this.visibilityDidChange);
        logger.log("ConnectionMonitor stopped");
      }
    }
    isRunning() {
      return this.startedAt && !this.stoppedAt;
    }
    recordMessage() {
      this.pingedAt = now();
    }
    recordConnect() {
      this.reconnectAttempts = 0;
      delete this.disconnectedAt;
      logger.log("ConnectionMonitor recorded connect");
    }
    recordDisconnect() {
      this.disconnectedAt = now();
      logger.log("ConnectionMonitor recorded disconnect");
    }
    startPolling() {
      this.stopPolling();
      this.poll();
    }
    stopPolling() {
      clearTimeout(this.pollTimeout);
    }
    poll() {
      this.pollTimeout = setTimeout((() => {
        this.reconnectIfStale();
        this.poll();
      }), this.getPollInterval());
    }
    getPollInterval() {
      const { staleThreshold, reconnectionBackoffRate } = this.constructor;
      const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
      const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
      const jitter = jitterMax * Math.random();
      return staleThreshold * 1e3 * backoff * (1 + jitter);
    }
    reconnectIfStale() {
      if (this.connectionIsStale()) {
        logger.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
        this.reconnectAttempts++;
        if (this.disconnectedRecently()) {
          logger.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
        } else {
          logger.log("ConnectionMonitor reopening");
          this.connection.reopen();
        }
      }
    }
    get refreshedAt() {
      return this.pingedAt ? this.pingedAt : this.startedAt;
    }
    connectionIsStale() {
      return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
    }
    disconnectedRecently() {
      return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
    }
    visibilityDidChange() {
      if (document.visibilityState === "visible") {
        setTimeout((() => {
          if (this.connectionIsStale() || !this.connection.isOpen()) {
            logger.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
            this.connection.reopen();
          }
        }), 200);
      }
    }
  };
  ConnectionMonitor.staleThreshold = 6;
  ConnectionMonitor.reconnectionBackoffRate = 0.15;
  var INTERNAL = {
    message_types: {
      welcome: "welcome",
      disconnect: "disconnect",
      ping: "ping",
      confirmation: "confirm_subscription",
      rejection: "reject_subscription"
    },
    disconnect_reasons: {
      unauthorized: "unauthorized",
      invalid_request: "invalid_request",
      server_restart: "server_restart",
      remote: "remote"
    },
    default_mount_path: "/cable",
    protocols: ["actioncable-v1-json", "actioncable-unsupported"]
  };
  var { message_types, protocols } = INTERNAL;
  var supportedProtocols = protocols.slice(0, protocols.length - 1);
  var indexOf = [].indexOf;
  var Connection = class {
    constructor(consumer2) {
      this.open = this.open.bind(this);
      this.consumer = consumer2;
      this.subscriptions = this.consumer.subscriptions;
      this.monitor = new ConnectionMonitor(this);
      this.disconnected = true;
    }
    send(data) {
      if (this.isOpen()) {
        this.webSocket.send(JSON.stringify(data));
        return true;
      } else {
        return false;
      }
    }
    open() {
      if (this.isActive()) {
        logger.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
        return false;
      } else {
        const socketProtocols = [...protocols, ...this.consumer.subprotocols || []];
        logger.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${socketProtocols}`);
        if (this.webSocket) {
          this.uninstallEventHandlers();
        }
        this.webSocket = new adapters.WebSocket(this.consumer.url, socketProtocols);
        this.installEventHandlers();
        this.monitor.start();
        return true;
      }
    }
    close({ allowReconnect } = {
      allowReconnect: true
    }) {
      if (!allowReconnect) {
        this.monitor.stop();
      }
      if (this.isOpen()) {
        return this.webSocket.close();
      }
    }
    reopen() {
      logger.log(`Reopening WebSocket, current state is ${this.getState()}`);
      if (this.isActive()) {
        try {
          return this.close();
        } catch (error2) {
          logger.log("Failed to reopen WebSocket", error2);
        } finally {
          logger.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
          setTimeout(this.open, this.constructor.reopenDelay);
        }
      } else {
        return this.open();
      }
    }
    getProtocol() {
      if (this.webSocket) {
        return this.webSocket.protocol;
      }
    }
    isOpen() {
      return this.isState("open");
    }
    isActive() {
      return this.isState("open", "connecting");
    }
    triedToReconnect() {
      return this.monitor.reconnectAttempts > 0;
    }
    isProtocolSupported() {
      return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
    }
    isState(...states) {
      return indexOf.call(states, this.getState()) >= 0;
    }
    getState() {
      if (this.webSocket) {
        for (let state in adapters.WebSocket) {
          if (adapters.WebSocket[state] === this.webSocket.readyState) {
            return state.toLowerCase();
          }
        }
      }
      return null;
    }
    installEventHandlers() {
      for (let eventName in this.events) {
        const handler = this.events[eventName].bind(this);
        this.webSocket[`on${eventName}`] = handler;
      }
    }
    uninstallEventHandlers() {
      for (let eventName in this.events) {
        this.webSocket[`on${eventName}`] = function() {
        };
      }
    }
  };
  Connection.reopenDelay = 500;
  Connection.prototype.events = {
    message(event) {
      if (!this.isProtocolSupported()) {
        return;
      }
      const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
      this.monitor.recordMessage();
      switch (type) {
        case message_types.welcome:
          if (this.triedToReconnect()) {
            this.reconnectAttempted = true;
          }
          this.monitor.recordConnect();
          return this.subscriptions.reload();
        case message_types.disconnect:
          logger.log(`Disconnecting. Reason: ${reason}`);
          return this.close({
            allowReconnect: reconnect
          });
        case message_types.ping:
          return null;
        case message_types.confirmation:
          this.subscriptions.confirmSubscription(identifier);
          if (this.reconnectAttempted) {
            this.reconnectAttempted = false;
            return this.subscriptions.notify(identifier, "connected", {
              reconnected: true
            });
          } else {
            return this.subscriptions.notify(identifier, "connected", {
              reconnected: false
            });
          }
        case message_types.rejection:
          return this.subscriptions.reject(identifier);
        default:
          return this.subscriptions.notify(identifier, "received", message);
      }
    },
    open() {
      logger.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
      this.disconnected = false;
      if (!this.isProtocolSupported()) {
        logger.log("Protocol is unsupported. Stopping monitor and disconnecting.");
        return this.close({
          allowReconnect: false
        });
      }
    },
    close(event) {
      logger.log("WebSocket onclose event");
      if (this.disconnected) {
        return;
      }
      this.disconnected = true;
      this.monitor.recordDisconnect();
      return this.subscriptions.notifyAll("disconnected", {
        willAttemptReconnect: this.monitor.isRunning()
      });
    },
    error() {
      logger.log("WebSocket onerror event");
    }
  };

  // ../../node_modules/@rails/activestorage/app/assets/javascripts/activestorage.esm.js
  var sparkMd5 = {
    exports: {}
  };
  (function(module, exports) {
    (function(factory) {
      {
        module.exports = factory();
      }
    })((function(undefined$1) {
      var hex_chr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      function md5cycle(x2, k2) {
        var a2 = x2[0], b2 = x2[1], c2 = x2[2], d2 = x2[3];
        a2 += (b2 & c2 | ~b2 & d2) + k2[0] - 680876936 | 0;
        a2 = (a2 << 7 | a2 >>> 25) + b2 | 0;
        d2 += (a2 & b2 | ~a2 & c2) + k2[1] - 389564586 | 0;
        d2 = (d2 << 12 | d2 >>> 20) + a2 | 0;
        c2 += (d2 & a2 | ~d2 & b2) + k2[2] + 606105819 | 0;
        c2 = (c2 << 17 | c2 >>> 15) + d2 | 0;
        b2 += (c2 & d2 | ~c2 & a2) + k2[3] - 1044525330 | 0;
        b2 = (b2 << 22 | b2 >>> 10) + c2 | 0;
        a2 += (b2 & c2 | ~b2 & d2) + k2[4] - 176418897 | 0;
        a2 = (a2 << 7 | a2 >>> 25) + b2 | 0;
        d2 += (a2 & b2 | ~a2 & c2) + k2[5] + 1200080426 | 0;
        d2 = (d2 << 12 | d2 >>> 20) + a2 | 0;
        c2 += (d2 & a2 | ~d2 & b2) + k2[6] - 1473231341 | 0;
        c2 = (c2 << 17 | c2 >>> 15) + d2 | 0;
        b2 += (c2 & d2 | ~c2 & a2) + k2[7] - 45705983 | 0;
        b2 = (b2 << 22 | b2 >>> 10) + c2 | 0;
        a2 += (b2 & c2 | ~b2 & d2) + k2[8] + 1770035416 | 0;
        a2 = (a2 << 7 | a2 >>> 25) + b2 | 0;
        d2 += (a2 & b2 | ~a2 & c2) + k2[9] - 1958414417 | 0;
        d2 = (d2 << 12 | d2 >>> 20) + a2 | 0;
        c2 += (d2 & a2 | ~d2 & b2) + k2[10] - 42063 | 0;
        c2 = (c2 << 17 | c2 >>> 15) + d2 | 0;
        b2 += (c2 & d2 | ~c2 & a2) + k2[11] - 1990404162 | 0;
        b2 = (b2 << 22 | b2 >>> 10) + c2 | 0;
        a2 += (b2 & c2 | ~b2 & d2) + k2[12] + 1804603682 | 0;
        a2 = (a2 << 7 | a2 >>> 25) + b2 | 0;
        d2 += (a2 & b2 | ~a2 & c2) + k2[13] - 40341101 | 0;
        d2 = (d2 << 12 | d2 >>> 20) + a2 | 0;
        c2 += (d2 & a2 | ~d2 & b2) + k2[14] - 1502002290 | 0;
        c2 = (c2 << 17 | c2 >>> 15) + d2 | 0;
        b2 += (c2 & d2 | ~c2 & a2) + k2[15] + 1236535329 | 0;
        b2 = (b2 << 22 | b2 >>> 10) + c2 | 0;
        a2 += (b2 & d2 | c2 & ~d2) + k2[1] - 165796510 | 0;
        a2 = (a2 << 5 | a2 >>> 27) + b2 | 0;
        d2 += (a2 & c2 | b2 & ~c2) + k2[6] - 1069501632 | 0;
        d2 = (d2 << 9 | d2 >>> 23) + a2 | 0;
        c2 += (d2 & b2 | a2 & ~b2) + k2[11] + 643717713 | 0;
        c2 = (c2 << 14 | c2 >>> 18) + d2 | 0;
        b2 += (c2 & a2 | d2 & ~a2) + k2[0] - 373897302 | 0;
        b2 = (b2 << 20 | b2 >>> 12) + c2 | 0;
        a2 += (b2 & d2 | c2 & ~d2) + k2[5] - 701558691 | 0;
        a2 = (a2 << 5 | a2 >>> 27) + b2 | 0;
        d2 += (a2 & c2 | b2 & ~c2) + k2[10] + 38016083 | 0;
        d2 = (d2 << 9 | d2 >>> 23) + a2 | 0;
        c2 += (d2 & b2 | a2 & ~b2) + k2[15] - 660478335 | 0;
        c2 = (c2 << 14 | c2 >>> 18) + d2 | 0;
        b2 += (c2 & a2 | d2 & ~a2) + k2[4] - 405537848 | 0;
        b2 = (b2 << 20 | b2 >>> 12) + c2 | 0;
        a2 += (b2 & d2 | c2 & ~d2) + k2[9] + 568446438 | 0;
        a2 = (a2 << 5 | a2 >>> 27) + b2 | 0;
        d2 += (a2 & c2 | b2 & ~c2) + k2[14] - 1019803690 | 0;
        d2 = (d2 << 9 | d2 >>> 23) + a2 | 0;
        c2 += (d2 & b2 | a2 & ~b2) + k2[3] - 187363961 | 0;
        c2 = (c2 << 14 | c2 >>> 18) + d2 | 0;
        b2 += (c2 & a2 | d2 & ~a2) + k2[8] + 1163531501 | 0;
        b2 = (b2 << 20 | b2 >>> 12) + c2 | 0;
        a2 += (b2 & d2 | c2 & ~d2) + k2[13] - 1444681467 | 0;
        a2 = (a2 << 5 | a2 >>> 27) + b2 | 0;
        d2 += (a2 & c2 | b2 & ~c2) + k2[2] - 51403784 | 0;
        d2 = (d2 << 9 | d2 >>> 23) + a2 | 0;
        c2 += (d2 & b2 | a2 & ~b2) + k2[7] + 1735328473 | 0;
        c2 = (c2 << 14 | c2 >>> 18) + d2 | 0;
        b2 += (c2 & a2 | d2 & ~a2) + k2[12] - 1926607734 | 0;
        b2 = (b2 << 20 | b2 >>> 12) + c2 | 0;
        a2 += (b2 ^ c2 ^ d2) + k2[5] - 378558 | 0;
        a2 = (a2 << 4 | a2 >>> 28) + b2 | 0;
        d2 += (a2 ^ b2 ^ c2) + k2[8] - 2022574463 | 0;
        d2 = (d2 << 11 | d2 >>> 21) + a2 | 0;
        c2 += (d2 ^ a2 ^ b2) + k2[11] + 1839030562 | 0;
        c2 = (c2 << 16 | c2 >>> 16) + d2 | 0;
        b2 += (c2 ^ d2 ^ a2) + k2[14] - 35309556 | 0;
        b2 = (b2 << 23 | b2 >>> 9) + c2 | 0;
        a2 += (b2 ^ c2 ^ d2) + k2[1] - 1530992060 | 0;
        a2 = (a2 << 4 | a2 >>> 28) + b2 | 0;
        d2 += (a2 ^ b2 ^ c2) + k2[4] + 1272893353 | 0;
        d2 = (d2 << 11 | d2 >>> 21) + a2 | 0;
        c2 += (d2 ^ a2 ^ b2) + k2[7] - 155497632 | 0;
        c2 = (c2 << 16 | c2 >>> 16) + d2 | 0;
        b2 += (c2 ^ d2 ^ a2) + k2[10] - 1094730640 | 0;
        b2 = (b2 << 23 | b2 >>> 9) + c2 | 0;
        a2 += (b2 ^ c2 ^ d2) + k2[13] + 681279174 | 0;
        a2 = (a2 << 4 | a2 >>> 28) + b2 | 0;
        d2 += (a2 ^ b2 ^ c2) + k2[0] - 358537222 | 0;
        d2 = (d2 << 11 | d2 >>> 21) + a2 | 0;
        c2 += (d2 ^ a2 ^ b2) + k2[3] - 722521979 | 0;
        c2 = (c2 << 16 | c2 >>> 16) + d2 | 0;
        b2 += (c2 ^ d2 ^ a2) + k2[6] + 76029189 | 0;
        b2 = (b2 << 23 | b2 >>> 9) + c2 | 0;
        a2 += (b2 ^ c2 ^ d2) + k2[9] - 640364487 | 0;
        a2 = (a2 << 4 | a2 >>> 28) + b2 | 0;
        d2 += (a2 ^ b2 ^ c2) + k2[12] - 421815835 | 0;
        d2 = (d2 << 11 | d2 >>> 21) + a2 | 0;
        c2 += (d2 ^ a2 ^ b2) + k2[15] + 530742520 | 0;
        c2 = (c2 << 16 | c2 >>> 16) + d2 | 0;
        b2 += (c2 ^ d2 ^ a2) + k2[2] - 995338651 | 0;
        b2 = (b2 << 23 | b2 >>> 9) + c2 | 0;
        a2 += (c2 ^ (b2 | ~d2)) + k2[0] - 198630844 | 0;
        a2 = (a2 << 6 | a2 >>> 26) + b2 | 0;
        d2 += (b2 ^ (a2 | ~c2)) + k2[7] + 1126891415 | 0;
        d2 = (d2 << 10 | d2 >>> 22) + a2 | 0;
        c2 += (a2 ^ (d2 | ~b2)) + k2[14] - 1416354905 | 0;
        c2 = (c2 << 15 | c2 >>> 17) + d2 | 0;
        b2 += (d2 ^ (c2 | ~a2)) + k2[5] - 57434055 | 0;
        b2 = (b2 << 21 | b2 >>> 11) + c2 | 0;
        a2 += (c2 ^ (b2 | ~d2)) + k2[12] + 1700485571 | 0;
        a2 = (a2 << 6 | a2 >>> 26) + b2 | 0;
        d2 += (b2 ^ (a2 | ~c2)) + k2[3] - 1894986606 | 0;
        d2 = (d2 << 10 | d2 >>> 22) + a2 | 0;
        c2 += (a2 ^ (d2 | ~b2)) + k2[10] - 1051523 | 0;
        c2 = (c2 << 15 | c2 >>> 17) + d2 | 0;
        b2 += (d2 ^ (c2 | ~a2)) + k2[1] - 2054922799 | 0;
        b2 = (b2 << 21 | b2 >>> 11) + c2 | 0;
        a2 += (c2 ^ (b2 | ~d2)) + k2[8] + 1873313359 | 0;
        a2 = (a2 << 6 | a2 >>> 26) + b2 | 0;
        d2 += (b2 ^ (a2 | ~c2)) + k2[15] - 30611744 | 0;
        d2 = (d2 << 10 | d2 >>> 22) + a2 | 0;
        c2 += (a2 ^ (d2 | ~b2)) + k2[6] - 1560198380 | 0;
        c2 = (c2 << 15 | c2 >>> 17) + d2 | 0;
        b2 += (d2 ^ (c2 | ~a2)) + k2[13] + 1309151649 | 0;
        b2 = (b2 << 21 | b2 >>> 11) + c2 | 0;
        a2 += (c2 ^ (b2 | ~d2)) + k2[4] - 145523070 | 0;
        a2 = (a2 << 6 | a2 >>> 26) + b2 | 0;
        d2 += (b2 ^ (a2 | ~c2)) + k2[11] - 1120210379 | 0;
        d2 = (d2 << 10 | d2 >>> 22) + a2 | 0;
        c2 += (a2 ^ (d2 | ~b2)) + k2[2] + 718787259 | 0;
        c2 = (c2 << 15 | c2 >>> 17) + d2 | 0;
        b2 += (d2 ^ (c2 | ~a2)) + k2[9] - 343485551 | 0;
        b2 = (b2 << 21 | b2 >>> 11) + c2 | 0;
        x2[0] = a2 + x2[0] | 0;
        x2[1] = b2 + x2[1] | 0;
        x2[2] = c2 + x2[2] | 0;
        x2[3] = d2 + x2[3] | 0;
      }
      function md5blk(s2) {
        var md5blks = [], i2;
        for (i2 = 0; i2 < 64; i2 += 4) {
          md5blks[i2 >> 2] = s2.charCodeAt(i2) + (s2.charCodeAt(i2 + 1) << 8) + (s2.charCodeAt(i2 + 2) << 16) + (s2.charCodeAt(i2 + 3) << 24);
        }
        return md5blks;
      }
      function md5blk_array(a2) {
        var md5blks = [], i2;
        for (i2 = 0; i2 < 64; i2 += 4) {
          md5blks[i2 >> 2] = a2[i2] + (a2[i2 + 1] << 8) + (a2[i2 + 2] << 16) + (a2[i2 + 3] << 24);
        }
        return md5blks;
      }
      function md51(s2) {
        var n2 = s2.length, state = [1732584193, -271733879, -1732584194, 271733878], i2, length, tail, tmp, lo, hi2;
        for (i2 = 64; i2 <= n2; i2 += 64) {
          md5cycle(state, md5blk(s2.substring(i2 - 64, i2)));
        }
        s2 = s2.substring(i2 - 64);
        length = s2.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i2 = 0; i2 < length; i2 += 1) {
          tail[i2 >> 2] |= s2.charCodeAt(i2) << (i2 % 4 << 3);
        }
        tail[i2 >> 2] |= 128 << (i2 % 4 << 3);
        if (i2 > 55) {
          md5cycle(state, tail);
          for (i2 = 0; i2 < 16; i2 += 1) {
            tail[i2] = 0;
          }
        }
        tmp = n2 * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi2 = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi2;
        md5cycle(state, tail);
        return state;
      }
      function md51_array(a2) {
        var n2 = a2.length, state = [1732584193, -271733879, -1732584194, 271733878], i2, length, tail, tmp, lo, hi2;
        for (i2 = 64; i2 <= n2; i2 += 64) {
          md5cycle(state, md5blk_array(a2.subarray(i2 - 64, i2)));
        }
        a2 = i2 - 64 < n2 ? a2.subarray(i2 - 64) : new Uint8Array(0);
        length = a2.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i2 = 0; i2 < length; i2 += 1) {
          tail[i2 >> 2] |= a2[i2] << (i2 % 4 << 3);
        }
        tail[i2 >> 2] |= 128 << (i2 % 4 << 3);
        if (i2 > 55) {
          md5cycle(state, tail);
          for (i2 = 0; i2 < 16; i2 += 1) {
            tail[i2] = 0;
          }
        }
        tmp = n2 * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi2 = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi2;
        md5cycle(state, tail);
        return state;
      }
      function rhex(n2) {
        var s2 = "", j2;
        for (j2 = 0; j2 < 4; j2 += 1) {
          s2 += hex_chr[n2 >> j2 * 8 + 4 & 15] + hex_chr[n2 >> j2 * 8 & 15];
        }
        return s2;
      }
      function hex(x2) {
        var i2;
        for (i2 = 0; i2 < x2.length; i2 += 1) {
          x2[i2] = rhex(x2[i2]);
        }
        return x2.join("");
      }
      if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") ;
      if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
        (function() {
          function clamp(val, length) {
            val = val | 0 || 0;
            if (val < 0) {
              return Math.max(val + length, 0);
            }
            return Math.min(val, length);
          }
          ArrayBuffer.prototype.slice = function(from, to2) {
            var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
            if (to2 !== undefined$1) {
              end = clamp(to2, length);
            }
            if (begin > end) {
              return new ArrayBuffer(0);
            }
            num = end - begin;
            target = new ArrayBuffer(num);
            targetArray = new Uint8Array(target);
            sourceArray = new Uint8Array(this, begin, num);
            targetArray.set(sourceArray);
            return target;
          };
        })();
      }
      function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
          str = unescape(encodeURIComponent(str));
        }
        return str;
      }
      function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i2;
        for (i2 = 0; i2 < length; i2 += 1) {
          arr[i2] = str.charCodeAt(i2);
        }
        return returnUInt8Array ? arr : buff;
      }
      function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
      }
      function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);
        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);
        return returnUInt8Array ? result : result.buffer;
      }
      function hexToBinaryString(hex2) {
        var bytes = [], length = hex2.length, x2;
        for (x2 = 0; x2 < length - 1; x2 += 2) {
          bytes.push(parseInt(hex2.substr(x2, 2), 16));
        }
        return String.fromCharCode.apply(String, bytes);
      }
      function SparkMD53() {
        this.reset();
      }
      SparkMD53.prototype.append = function(str) {
        this.appendBinary(toUtf8(str));
        return this;
      };
      SparkMD53.prototype.appendBinary = function(contents) {
        this._buff += contents;
        this._length += contents.length;
        var length = this._buff.length, i2;
        for (i2 = 64; i2 <= length; i2 += 64) {
          md5cycle(this._hash, md5blk(this._buff.substring(i2 - 64, i2)));
        }
        this._buff = this._buff.substring(i2 - 64);
        return this;
      };
      SparkMD53.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, i2, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ret;
        for (i2 = 0; i2 < length; i2 += 1) {
          tail[i2 >> 2] |= buff.charCodeAt(i2) << (i2 % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD53.prototype.reset = function() {
        this._buff = "";
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
        return this;
      };
      SparkMD53.prototype.getState = function() {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash.slice()
        };
      };
      SparkMD53.prototype.setState = function(state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;
        return this;
      };
      SparkMD53.prototype.destroy = function() {
        delete this._hash;
        delete this._buff;
        delete this._length;
      };
      SparkMD53.prototype._finish = function(tail, length) {
        var i2 = length, tmp, lo, hi2;
        tail[i2 >> 2] |= 128 << (i2 % 4 << 3);
        if (i2 > 55) {
          md5cycle(this._hash, tail);
          for (i2 = 0; i2 < 16; i2 += 1) {
            tail[i2] = 0;
          }
        }
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi2 = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi2;
        md5cycle(this._hash, tail);
      };
      SparkMD53.hash = function(str, raw) {
        return SparkMD53.hashBinary(toUtf8(str), raw);
      };
      SparkMD53.hashBinary = function(content, raw) {
        var hash = md51(content), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      SparkMD53.ArrayBuffer = function() {
        this.reset();
      };
      SparkMD53.ArrayBuffer.prototype.append = function(arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i2;
        this._length += arr.byteLength;
        for (i2 = 64; i2 <= length; i2 += 64) {
          md5cycle(this._hash, md5blk_array(buff.subarray(i2 - 64, i2)));
        }
        this._buff = i2 - 64 < length ? new Uint8Array(buff.buffer.slice(i2 - 64)) : new Uint8Array(0);
        return this;
      };
      SparkMD53.ArrayBuffer.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i2, ret;
        for (i2 = 0; i2 < length; i2 += 1) {
          tail[i2 >> 2] |= buff[i2] << (i2 % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD53.ArrayBuffer.prototype.reset = function() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
        return this;
      };
      SparkMD53.ArrayBuffer.prototype.getState = function() {
        var state = SparkMD53.prototype.getState.call(this);
        state.buff = arrayBuffer2Utf8Str(state.buff);
        return state;
      };
      SparkMD53.ArrayBuffer.prototype.setState = function(state) {
        state.buff = utf8Str2ArrayBuffer(state.buff, true);
        return SparkMD53.prototype.setState.call(this, state);
      };
      SparkMD53.ArrayBuffer.prototype.destroy = SparkMD53.prototype.destroy;
      SparkMD53.ArrayBuffer.prototype._finish = SparkMD53.prototype._finish;
      SparkMD53.ArrayBuffer.hash = function(arr, raw) {
        var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      return SparkMD53;
    }));
  })(sparkMd5);
  var SparkMD5 = sparkMd5.exports;
  var fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  var FileChecksum = class _FileChecksum {
    static create(file, callback) {
      const instance = new _FileChecksum(file);
      instance.create(callback);
    }
    constructor(file) {
      this.file = file;
      this.chunkSize = 2097152;
      this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
      this.chunkIndex = 0;
    }
    create(callback) {
      this.callback = callback;
      this.md5Buffer = new SparkMD5.ArrayBuffer();
      this.fileReader = new FileReader();
      this.fileReader.addEventListener("load", ((event) => this.fileReaderDidLoad(event)));
      this.fileReader.addEventListener("error", ((event) => this.fileReaderDidError(event)));
      this.readNextChunk();
    }
    fileReaderDidLoad(event) {
      this.md5Buffer.append(event.target.result);
      if (!this.readNextChunk()) {
        const binaryDigest = this.md5Buffer.end(true);
        const base64digest = btoa(binaryDigest);
        this.callback(null, base64digest);
      }
    }
    fileReaderDidError(event) {
      this.callback(`Error reading ${this.file.name}`);
    }
    readNextChunk() {
      if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
        const start4 = this.chunkIndex * this.chunkSize;
        const end = Math.min(start4 + this.chunkSize, this.file.size);
        const bytes = fileSlice.call(this.file, start4, end);
        this.fileReader.readAsArrayBuffer(bytes);
        this.chunkIndex++;
        return true;
      } else {
        return false;
      }
    }
  };
  function getMetaValue(name) {
    const element = findElement(document.head, `meta[name="${name}"]`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  function findElements(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    const elements = root.querySelectorAll(selector);
    return toArray(elements);
  }
  function findElement(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    return root.querySelector(selector);
  }
  function dispatchEvent2(element, type, eventInit = {}) {
    const { disabled } = element;
    const { bubbles, cancelable, detail } = eventInit;
    const event = document.createEvent("Event");
    event.initEvent(type, bubbles || true, cancelable || true);
    event.detail = detail || {};
    try {
      element.disabled = false;
      element.dispatchEvent(event);
    } finally {
      element.disabled = disabled;
    }
    return event;
  }
  function toArray(value) {
    if (Array.isArray(value)) {
      return value;
    } else if (Array.from) {
      return Array.from(value);
    } else {
      return [].slice.call(value);
    }
  }
  var BlobRecord = class {
    constructor(file, checksum, url, customHeaders = {}) {
      this.file = file;
      this.attributes = {
        filename: file.name,
        content_type: file.type || "application/octet-stream",
        byte_size: file.size,
        checksum
      };
      this.xhr = new XMLHttpRequest();
      this.xhr.open("POST", url, true);
      this.xhr.responseType = "json";
      this.xhr.setRequestHeader("Content-Type", "application/json");
      this.xhr.setRequestHeader("Accept", "application/json");
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      Object.keys(customHeaders).forEach(((headerKey) => {
        this.xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
      }));
      const csrfToken = getMetaValue("csrf-token");
      if (csrfToken != void 0) {
        this.xhr.setRequestHeader("X-CSRF-Token", csrfToken);
      }
      this.xhr.addEventListener("load", ((event) => this.requestDidLoad(event)));
      this.xhr.addEventListener("error", ((event) => this.requestDidError(event)));
    }
    get status() {
      return this.xhr.status;
    }
    get response() {
      const { responseType, response } = this.xhr;
      if (responseType == "json") {
        return response;
      } else {
        return JSON.parse(response);
      }
    }
    create(callback) {
      this.callback = callback;
      this.xhr.send(JSON.stringify({
        blob: this.attributes
      }));
    }
    requestDidLoad(event) {
      if (this.status >= 200 && this.status < 300) {
        const { response } = this;
        const { direct_upload } = response;
        delete response.direct_upload;
        this.attributes = response;
        this.directUploadData = direct_upload;
        this.callback(null, this.toJSON());
      } else {
        this.requestDidError(event);
      }
    }
    requestDidError(event) {
      this.callback(`Error creating Blob for "${this.file.name}". Status: ${this.status}`);
    }
    toJSON() {
      const result = {};
      for (const key in this.attributes) {
        result[key] = this.attributes[key];
      }
      return result;
    }
  };
  var BlobUpload = class {
    constructor(blob) {
      this.blob = blob;
      this.file = blob.file;
      const { url, headers } = blob.directUploadData;
      this.xhr = new XMLHttpRequest();
      this.xhr.open("PUT", url, true);
      this.xhr.responseType = "text";
      for (const key in headers) {
        this.xhr.setRequestHeader(key, headers[key]);
      }
      this.xhr.addEventListener("load", ((event) => this.requestDidLoad(event)));
      this.xhr.addEventListener("error", ((event) => this.requestDidError(event)));
    }
    create(callback) {
      this.callback = callback;
      this.xhr.send(this.file.slice());
    }
    requestDidLoad(event) {
      const { status, response } = this.xhr;
      if (status >= 200 && status < 300) {
        this.callback(null, response);
      } else {
        this.requestDidError(event);
      }
    }
    requestDidError(event) {
      this.callback(`Error storing "${this.file.name}". Status: ${this.xhr.status}`);
    }
  };
  var id = 0;
  var DirectUpload = class {
    constructor(file, url, delegate, customHeaders = {}) {
      this.id = ++id;
      this.file = file;
      this.url = url;
      this.delegate = delegate;
      this.customHeaders = customHeaders;
    }
    create(callback) {
      FileChecksum.create(this.file, ((error2, checksum) => {
        if (error2) {
          callback(error2);
          return;
        }
        const blob = new BlobRecord(this.file, checksum, this.url, this.customHeaders);
        notify(this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
        blob.create(((error3) => {
          if (error3) {
            callback(error3);
          } else {
            const upload = new BlobUpload(blob);
            notify(this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
            upload.create(((error4) => {
              if (error4) {
                callback(error4);
              } else {
                callback(null, blob.toJSON());
              }
            }));
          }
        }));
      }));
    }
  };
  function notify(object, methodName, ...messages) {
    if (object && typeof object[methodName] == "function") {
      return object[methodName](...messages);
    }
  }
  var DirectUploadController = class {
    constructor(input, file) {
      this.input = input;
      this.file = file;
      this.directUpload = new DirectUpload(this.file, this.url, this);
      this.dispatch("initialize");
    }
    start(callback) {
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = this.input.name;
      this.input.insertAdjacentElement("beforebegin", hiddenInput);
      this.dispatch("start");
      this.directUpload.create(((error2, attributes) => {
        if (error2) {
          hiddenInput.parentNode.removeChild(hiddenInput);
          this.dispatchError(error2);
        } else {
          hiddenInput.value = attributes.signed_id;
        }
        this.dispatch("end");
        callback(error2);
      }));
    }
    uploadRequestDidProgress(event) {
      const progress = event.loaded / event.total * 90;
      if (progress) {
        this.dispatch("progress", {
          progress
        });
      }
    }
    get url() {
      return this.input.getAttribute("data-direct-upload-url");
    }
    dispatch(name, detail = {}) {
      detail.file = this.file;
      detail.id = this.directUpload.id;
      return dispatchEvent2(this.input, `direct-upload:${name}`, {
        detail
      });
    }
    dispatchError(error2) {
      const event = this.dispatch("error", {
        error: error2
      });
      if (!event.defaultPrevented) {
        alert(error2);
      }
    }
    directUploadWillCreateBlobWithXHR(xhr) {
      this.dispatch("before-blob-request", {
        xhr
      });
    }
    directUploadWillStoreFileWithXHR(xhr) {
      this.dispatch("before-storage-request", {
        xhr
      });
      xhr.upload.addEventListener("progress", ((event) => this.uploadRequestDidProgress(event)));
      xhr.upload.addEventListener("loadend", (() => {
        this.simulateResponseProgress(xhr);
      }));
    }
    simulateResponseProgress(xhr) {
      let progress = 90;
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const estimatedResponseTime = this.estimateResponseTime();
        const responseProgress = Math.min(elapsed / estimatedResponseTime, 1);
        progress = 90 + responseProgress * 9;
        this.dispatch("progress", {
          progress
        });
        if (xhr.readyState !== XMLHttpRequest.DONE && progress < 99) {
          requestAnimationFrame(updateProgress);
        }
      };
      xhr.addEventListener("loadend", (() => {
        this.dispatch("progress", {
          progress: 100
        });
      }));
      requestAnimationFrame(updateProgress);
    }
    estimateResponseTime() {
      const fileSize = this.file.size;
      const MB = 1024 * 1024;
      if (fileSize < MB) {
        return 1e3;
      } else if (fileSize < 10 * MB) {
        return 2e3;
      } else {
        return 3e3 + fileSize / MB * 50;
      }
    }
  };
  var inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
  var DirectUploadsController = class {
    constructor(form) {
      this.form = form;
      this.inputs = findElements(form, inputSelector).filter(((input) => input.files.length));
    }
    start(callback) {
      const controllers = this.createDirectUploadControllers();
      const startNextController = () => {
        const controller = controllers.shift();
        if (controller) {
          controller.start(((error2) => {
            if (error2) {
              callback(error2);
              this.dispatch("end");
            } else {
              startNextController();
            }
          }));
        } else {
          callback();
          this.dispatch("end");
        }
      };
      this.dispatch("start");
      startNextController();
    }
    createDirectUploadControllers() {
      const controllers = [];
      this.inputs.forEach(((input) => {
        toArray(input.files).forEach(((file) => {
          const controller = new DirectUploadController(input, file);
          controllers.push(controller);
        }));
      }));
      return controllers;
    }
    dispatch(name, detail = {}) {
      return dispatchEvent2(this.form, `direct-uploads:${name}`, {
        detail
      });
    }
  };
  var processingAttribute = "data-direct-uploads-processing";
  var submitButtonsByForm = /* @__PURE__ */ new WeakMap();
  var started = false;
  function start() {
    if (!started) {
      started = true;
      document.addEventListener("click", didClick, true);
      document.addEventListener("submit", didSubmitForm, true);
      document.addEventListener("ajax:before", didSubmitRemoteElement);
    }
  }
  function didClick(event) {
    const button = event.target.closest("button, input");
    if (button && button.type === "submit" && button.form) {
      submitButtonsByForm.set(button.form, button);
    }
  }
  function didSubmitForm(event) {
    handleFormSubmissionEvent(event);
  }
  function didSubmitRemoteElement(event) {
    if (event.target.tagName == "FORM") {
      handleFormSubmissionEvent(event);
    }
  }
  function handleFormSubmissionEvent(event) {
    const form = event.target;
    if (form.hasAttribute(processingAttribute)) {
      event.preventDefault();
      return;
    }
    const controller = new DirectUploadsController(form);
    const { inputs } = controller;
    if (inputs.length) {
      event.preventDefault();
      form.setAttribute(processingAttribute, "");
      inputs.forEach(disable);
      controller.start(((error2) => {
        form.removeAttribute(processingAttribute);
        if (error2) {
          inputs.forEach(enable);
        } else {
          submitForm(form);
        }
      }));
    }
  }
  function submitForm(form) {
    let button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
    if (button) {
      const { disabled } = button;
      button.disabled = false;
      button.focus();
      button.click();
      button.disabled = disabled;
    } else {
      button = document.createElement("input");
      button.type = "submit";
      button.style.display = "none";
      form.appendChild(button);
      button.click();
      form.removeChild(button);
    }
    submitButtonsByForm.delete(form);
  }
  function disable(input) {
    input.disabled = true;
  }
  function enable(input) {
    input.disabled = false;
  }
  function autostart() {
    if (window.ActiveStorage) {
      start();
    }
  }
  setTimeout(autostart, 1);

  // ../../node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  var turbo_es2017_esm_exports = {};
  __export(turbo_es2017_esm_exports, {
    FetchEnctype: () => FetchEnctype,
    FetchMethod: () => FetchMethod,
    FetchRequest: () => FetchRequest,
    FetchResponse: () => FetchResponse,
    FrameElement: () => FrameElement,
    FrameLoadingStyle: () => FrameLoadingStyle,
    FrameRenderer: () => FrameRenderer,
    PageRenderer: () => PageRenderer,
    PageSnapshot: () => PageSnapshot,
    StreamActions: () => StreamActions,
    StreamElement: () => StreamElement,
    StreamSourceElement: () => StreamSourceElement,
    cache: () => cache,
    clearCache: () => clearCache,
    config: () => config,
    connectStreamSource: () => connectStreamSource,
    disconnectStreamSource: () => disconnectStreamSource,
    fetch: () => fetchWithTurboHeaders,
    fetchEnctypeFromString: () => fetchEnctypeFromString,
    fetchMethodFromString: () => fetchMethodFromString,
    isSafe: () => isSafe,
    morphBodyElements: () => morphBodyElements,
    morphChildren: () => morphChildren,
    morphElements: () => morphElements,
    morphTurboFrameElements: () => morphTurboFrameElements,
    navigator: () => navigator$1,
    registerAdapter: () => registerAdapter,
    renderStreamMessage: () => renderStreamMessage,
    session: () => session,
    setConfirmMethod: () => setConfirmMethod,
    setFormMode: () => setFormMode,
    setProgressBarDelay: () => setProgressBarDelay,
    start: () => start2,
    visit: () => visit
  });
  (function(prototype) {
    if (typeof prototype.requestSubmit == "function") return;
    prototype.requestSubmit = function(submitter2) {
      if (submitter2) {
        validateSubmitter(submitter2, this);
        submitter2.click();
      } else {
        submitter2 = document.createElement("input");
        submitter2.type = "submit";
        submitter2.hidden = true;
        this.appendChild(submitter2);
        submitter2.click();
        this.removeChild(submitter2);
      }
    };
    function validateSubmitter(submitter2, form) {
      submitter2 instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
      submitter2.type == "submit" || raise(TypeError, "The specified element is not a submit button");
      submitter2.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
    }
    function raise(errorConstructor, message, name) {
      throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
    }
  })(HTMLFormElement.prototype);
  var submittersByForm = /* @__PURE__ */ new WeakMap();
  function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return candidate?.type == "submit" ? candidate : null;
  }
  function clickCaptured(event) {
    const submitter2 = findSubmitterFromClickTarget(event.target);
    if (submitter2 && submitter2.form) {
      submittersByForm.set(submitter2.form, submitter2);
    }
  }
  (function() {
    if ("submitter" in Event.prototype) return;
    let prototype = window.Event.prototype;
    if ("SubmitEvent" in window) {
      const prototypeOfSubmitEvent = window.SubmitEvent.prototype;
      if (/Apple Computer/.test(navigator.vendor) && !("submitter" in prototypeOfSubmitEvent)) {
        prototype = prototypeOfSubmitEvent;
      } else {
        return;
      }
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
      get() {
        if (this.type == "submit" && this.target instanceof HTMLFormElement) {
          return submittersByForm.get(this.target);
        }
      }
    });
  })();
  var FrameLoadingStyle = {
    eager: "eager",
    lazy: "lazy"
  };
  var FrameElement = class _FrameElement extends HTMLElement {
    static delegateConstructor = void 0;
    loaded = Promise.resolve();
    static get observedAttributes() {
      return ["disabled", "loading", "src"];
    }
    constructor() {
      super();
      this.delegate = new _FrameElement.delegateConstructor(this);
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      return this.delegate.sourceURLReloaded();
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else if (name == "disabled") {
        this.delegate.disabledChanged();
      }
    }
    /**
     * Gets the URL to lazily load source HTML from
     */
    get src() {
      return this.getAttribute("src");
    }
    /**
     * Sets the URL to lazily load source HTML from
     */
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    /**
     * Gets the refresh mode for the frame.
     */
    get refresh() {
      return this.getAttribute("refresh");
    }
    /**
     * Sets the refresh mode for the frame.
     */
    set refresh(value) {
      if (value) {
        this.setAttribute("refresh", value);
      } else {
        this.removeAttribute("refresh");
      }
    }
    get shouldReloadWithMorph() {
      return this.src && this.refresh === "morph";
    }
    /**
     * Determines if the element is loading
     */
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    /**
     * Sets the value of if the element is loading
     */
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    /**
     * Gets the disabled state of the frame.
     *
     * If disabled, no requests will be intercepted by the frame.
     */
    get disabled() {
      return this.hasAttribute("disabled");
    }
    /**
     * Sets the disabled state of the frame.
     *
     * If disabled, no requests will be intercepted by the frame.
     */
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    /**
     * Gets the autoscroll state of the frame.
     *
     * If true, the frame will be scrolled into view automatically on update.
     */
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    /**
     * Sets the autoscroll state of the frame.
     *
     * If true, the frame will be scrolled into view automatically on update.
     */
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    /**
     * Determines if the element has finished loading
     */
    get complete() {
      return !this.delegate.isLoading;
    }
    /**
     * Gets the active state of the frame.
     *
     * If inactive, source changes will not be observed.
     */
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    /**
     * Sets the active state of the frame.
     *
     * If inactive, source changes will not be observed.
     */
    get isPreview() {
      return this.ownerDocument?.documentElement?.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  var drive = {
    enabled: true,
    progressBarDelay: 500,
    unvisitableExtensions: /* @__PURE__ */ new Set(
      [
        ".7z",
        ".aac",
        ".apk",
        ".avi",
        ".bmp",
        ".bz2",
        ".css",
        ".csv",
        ".deb",
        ".dmg",
        ".doc",
        ".docx",
        ".exe",
        ".gif",
        ".gz",
        ".heic",
        ".heif",
        ".ico",
        ".iso",
        ".jpeg",
        ".jpg",
        ".js",
        ".json",
        ".m4a",
        ".mkv",
        ".mov",
        ".mp3",
        ".mp4",
        ".mpeg",
        ".mpg",
        ".msi",
        ".ogg",
        ".ogv",
        ".pdf",
        ".pkg",
        ".png",
        ".ppt",
        ".pptx",
        ".rar",
        ".rtf",
        ".svg",
        ".tar",
        ".tif",
        ".tiff",
        ".txt",
        ".wav",
        ".webm",
        ".webp",
        ".wma",
        ".wmv",
        ".xls",
        ".xlsx",
        ".xml",
        ".zip"
      ]
    )
  };
  function activateScriptElement(element) {
    if (element.getAttribute("data-turbo-eval") == "false") {
      return element;
    } else {
      const createdScriptElement = document.createElement("script");
      const cspNonce = getCspNonce();
      if (cspNonce) {
        createdScriptElement.nonce = cspNonce;
      }
      createdScriptElement.textContent = element.textContent;
      createdScriptElement.async = false;
      copyElementAttributes(createdScriptElement, element);
      return createdScriptElement;
    }
  }
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of sourceElement.attributes) {
      destinationElement.setAttribute(name, value);
    }
  }
  function createDocumentFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
  }
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, {
      cancelable,
      bubbles: true,
      composed: true,
      detail
    });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function cancelEvent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  function nextRepaint() {
    if (document.visibilityState === "hidden") {
      return nextEventLoopTick();
    } else {
      return nextAnimationFrame();
    }
  }
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  }
  function nextMicrotask() {
    return Promise.resolve();
  }
  function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string, i2) => {
      const value = values[i2] == void 0 ? "" : values[i2];
      return result + string + value;
    }, "");
  }
  function uuid() {
    return Array.from({ length: 36 }).map((_2, i2) => {
      if (i2 == 8 || i2 == 13 || i2 == 18 || i2 == 23) {
        return "-";
      } else if (i2 == 14) {
        return "4";
      } else if (i2 == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 15).toString(16);
      }
    }).join("");
  }
  function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element?.getAttribute(attributeName))) {
      if (typeof value == "string") return value;
    }
    return null;
  }
  function hasAttribute(attributeName, ...elements) {
    return elements.some((element) => element && element.hasAttribute(attributeName));
  }
  function markAsBusy(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.setAttribute("busy", "");
      }
      element.setAttribute("aria-busy", "true");
    }
  }
  function clearBusyState(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.removeAttribute("busy");
      }
      element.removeAttribute("aria-busy");
    }
  }
  function waitForLoad(element, timeoutInMilliseconds = 2e3) {
    return new Promise((resolve) => {
      const onComplete = () => {
        element.removeEventListener("error", onComplete);
        element.removeEventListener("load", onComplete);
        resolve();
      };
      element.addEventListener("load", onComplete, { once: true });
      element.addEventListener("error", onComplete, { once: true });
      setTimeout(resolve, timeoutInMilliseconds);
    });
  }
  function getHistoryMethodForAction(action) {
    switch (action) {
      case "replace":
        return history.replaceState;
      case "advance":
      case "restore":
        return history.pushState;
    }
  }
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  function getVisitAction(...elements) {
    const action = getAttribute("data-turbo-action", ...elements);
    return isAction(action) ? action : null;
  }
  function getMetaElement(name) {
    return document.querySelector(`meta[name="${name}"]`);
  }
  function getMetaContent(name) {
    const element = getMetaElement(name);
    return element && element.content;
  }
  function getCspNonce() {
    const element = getMetaElement("csp-nonce");
    if (element) {
      const { nonce, content } = element;
      return nonce == "" ? content : nonce;
    }
  }
  function setMetaContent(name, content) {
    let element = getMetaElement(name);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
    return element;
  }
  function findClosestRecursively(element, selector) {
    if (element instanceof Element) {
      return element.closest(selector) || findClosestRecursively(element.assignedSlot || element.getRootNode()?.host, selector);
    }
  }
  function elementIsFocusable(element) {
    const inertDisabledOrHidden = "[inert], :disabled, [hidden], details:not([open]), dialog:not([open])";
    return !!element && element.closest(inertDisabledOrHidden) == null && typeof element.focus == "function";
  }
  function queryAutofocusableElement(elementOrDocumentFragment) {
    return Array.from(elementOrDocumentFragment.querySelectorAll("[autofocus]")).find(elementIsFocusable);
  }
  async function around(callback, reader) {
    const before = reader();
    callback();
    await nextAnimationFrame();
    const after = reader();
    return [before, after];
  }
  function doesNotTargetIFrame(name) {
    if (name === "_blank") {
      return false;
    } else if (name) {
      for (const element of document.getElementsByName(name)) {
        if (element instanceof HTMLIFrameElement) return false;
      }
      return true;
    } else {
      return true;
    }
  }
  function findLinkFromClickTarget(target) {
    const link = findClosestRecursively(target, "a[href], a[xlink\\:href]");
    if (!link) return null;
    if (link.hasAttribute("download")) return null;
    if (link.hasAttribute("target") && link.target !== "_self") return null;
    return link;
  }
  function getLocationForLink(link) {
    return expandURL(link.getAttribute("href") || "");
  }
  function debounce(fn2, delay) {
    let timeoutId = null;
    return (...args) => {
      const callback = () => fn2.apply(this, args);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
  }
  var submitter = {
    "aria-disabled": {
      beforeSubmit: (submitter2) => {
        submitter2.setAttribute("aria-disabled", "true");
        submitter2.addEventListener("click", cancelEvent);
      },
      afterSubmit: (submitter2) => {
        submitter2.removeAttribute("aria-disabled");
        submitter2.removeEventListener("click", cancelEvent);
      }
    },
    "disabled": {
      beforeSubmit: (submitter2) => submitter2.disabled = true,
      afterSubmit: (submitter2) => submitter2.disabled = false
    }
  };
  var Config = class {
    #submitter = null;
    constructor(config2) {
      Object.assign(this, config2);
    }
    get submitter() {
      return this.#submitter;
    }
    set submitter(value) {
      this.#submitter = submitter[value] || value;
    }
  };
  var forms = new Config({
    mode: "on",
    submitter: "disabled"
  });
  var config = {
    drive,
    forms
  };
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
      return url.hash.slice(1);
    } else if (anchorMatch = url.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getAction$1(form, submitter2) {
    const action = submitter2?.getAttribute("formaction") || form.getAttribute("action") || form.action;
    return expandURL(action);
  }
  function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isPrefixedBy(baseURL, url) {
    const prefix = addTrailingSlash(url.origin + url.pathname);
    return addTrailingSlash(baseURL.href) === prefix || baseURL.href.startsWith(prefix);
  }
  function locationIsVisitable(location2, rootLocation) {
    return isPrefixedBy(location2, rootLocation) && !config.drive.unvisitableExtensions.has(getExtension(location2));
  }
  function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
  }
  function toCacheKey(url) {
    return getRequestURL(url);
  }
  function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
  }
  function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  var LimitedSet = class extends Set {
    constructor(maxSize) {
      super();
      this.maxSize = maxSize;
    }
    add(value) {
      if (this.size >= this.maxSize) {
        const iterator = this.values();
        const oldestValue = iterator.next().value;
        this.delete(oldestValue);
      }
      super.add(value);
    }
  };
  var recentRequests = new LimitedSet(20);
  function fetchWithTurboHeaders(url, options = {}) {
    const modifiedHeaders = new Headers(options.headers || {});
    const requestUID = uuid();
    recentRequests.add(requestUID);
    modifiedHeaders.append("X-Turbo-Request-Id", requestUID);
    return window.fetch(url, {
      ...options,
      headers: modifiedHeaders
    });
  }
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchMethod = {
    get: "get",
    post: "post",
    put: "put",
    patch: "patch",
    delete: "delete"
  };
  function fetchEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FetchEnctype.multipart:
        return FetchEnctype.multipart;
      case FetchEnctype.plain:
        return FetchEnctype.plain;
      default:
        return FetchEnctype.urlEncoded;
    }
  }
  var FetchEnctype = {
    urlEncoded: "application/x-www-form-urlencoded",
    multipart: "multipart/form-data",
    plain: "text/plain"
  };
  var FetchRequest = class {
    abortController = new AbortController();
    #resolveRequestPromise = (_value) => {
    };
    constructor(delegate, method, location2, requestBody = new URLSearchParams(), target = null, enctype = FetchEnctype.urlEncoded) {
      const [url, body] = buildResourceAndBody(expandURL(location2), method, requestBody, enctype);
      this.delegate = delegate;
      this.url = url;
      this.target = target;
      this.fetchOptions = {
        credentials: "same-origin",
        redirect: "follow",
        method: method.toUpperCase(),
        headers: { ...this.defaultHeaders },
        body,
        signal: this.abortSignal,
        referrer: this.delegate.referrer?.href
      };
      this.enctype = enctype;
    }
    get method() {
      return this.fetchOptions.method;
    }
    set method(value) {
      const fetchBody = this.isSafe ? this.url.searchParams : this.fetchOptions.body || new FormData();
      const fetchMethod = fetchMethodFromString(value) || FetchMethod.get;
      this.url.search = "";
      const [url, body] = buildResourceAndBody(this.url, fetchMethod, fetchBody, this.enctype);
      this.url = url;
      this.fetchOptions.body = body;
      this.fetchOptions.method = fetchMethod.toUpperCase();
    }
    get headers() {
      return this.fetchOptions.headers;
    }
    set headers(value) {
      this.fetchOptions.headers = value;
    }
    get body() {
      if (this.isSafe) {
        return this.url.searchParams;
      } else {
        return this.fetchOptions.body;
      }
    }
    set body(value) {
      this.fetchOptions.body = value;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      const { fetchOptions } = this;
      this.delegate.prepareRequest(this);
      const event = await this.#allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        if (event.detail.fetchRequest) {
          this.response = event.detail.fetchRequest.response;
        } else {
          this.response = fetchWithTurboHeaders(this.url.href, fetchOptions);
        }
        const response = await this.response;
        return await this.receive(response);
      } catch (error2) {
        if (error2.name !== "AbortError") {
          if (this.#willDelegateErrorHandling(error2)) {
            this.delegate.requestErrored(this, error2);
          }
          throw error2;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", {
        cancelable: true,
        detail: { fetchResponse },
        target: this.target
      });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get defaultHeaders() {
      return {
        Accept: "text/html, application/xhtml+xml"
      };
    }
    get isSafe() {
      return isSafe(this.method);
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    acceptResponseType(mimeType) {
      this.headers["Accept"] = [mimeType, this.headers["Accept"]].join(", ");
    }
    async #allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve) => this.#resolveRequestPromise = resolve);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url,
          resume: this.#resolveRequestPromise
        },
        target: this.target
      });
      this.url = event.detail.url;
      if (event.defaultPrevented) await requestInterception;
      return event;
    }
    #willDelegateErrorHandling(error2) {
      const event = dispatch("turbo:fetch-request-error", {
        target: this.target,
        cancelable: true,
        detail: { request: this, error: error2 }
      });
      return !event.defaultPrevented;
    }
  };
  function isSafe(fetchMethod) {
    return fetchMethodFromString(fetchMethod) == FetchMethod.get;
  }
  function buildResourceAndBody(resource, method, requestBody, enctype) {
    const searchParams = Array.from(requestBody).length > 0 ? new URLSearchParams(entriesExcludingFiles(requestBody)) : resource.searchParams;
    if (isSafe(method)) {
      return [mergeIntoURLSearchParams(resource, searchParams), null];
    } else if (enctype == FetchEnctype.urlEncoded) {
      return [resource, searchParams];
    } else {
      return [resource, requestBody];
    }
  }
  function entriesExcludingFiles(requestBody) {
    const entries = [];
    for (const [name, value] of requestBody) {
      if (value instanceof File) continue;
      else entries.push([name, value]);
    }
    return entries;
  }
  function mergeIntoURLSearchParams(url, requestBody) {
    const searchParams = new URLSearchParams(entriesExcludingFiles(requestBody));
    url.search = searchParams.toString();
    return url;
  }
  var AppearanceObserver = class {
    started = false;
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
    intersect = (entries) => {
      const lastEntry = entries.slice(-1)[0];
      if (lastEntry?.isIntersecting) {
        this.delegate.elementAppearedInViewport(this.element);
      }
    };
  };
  var StreamMessage = class {
    static contentType = "text/vnd.turbo-stream.html";
    static wrap(message) {
      if (typeof message == "string") {
        return new this(createDocumentFragment(message));
      } else {
        return message;
      }
    }
    constructor(fragment) {
      this.fragment = importStreamElements(fragment);
    }
  };
  function importStreamElements(fragment) {
    for (const element of fragment.querySelectorAll("turbo-stream")) {
      const streamElement = document.importNode(element, true);
      for (const inertScriptElement of streamElement.templateElement.content.querySelectorAll("script")) {
        inertScriptElement.replaceWith(activateScriptElement(inertScriptElement));
      }
      element.replaceWith(streamElement);
    }
    return fragment;
  }
  var PREFETCH_DELAY = 100;
  var PrefetchCache = class {
    #prefetchTimeout = null;
    #prefetched = null;
    get(url) {
      if (this.#prefetched && this.#prefetched.url === url && this.#prefetched.expire > Date.now()) {
        return this.#prefetched.request;
      }
    }
    setLater(url, request, ttl) {
      this.clear();
      this.#prefetchTimeout = setTimeout(() => {
        request.perform();
        this.set(url, request, ttl);
        this.#prefetchTimeout = null;
      }, PREFETCH_DELAY);
    }
    set(url, request, ttl) {
      this.#prefetched = { url, request, expire: new Date((/* @__PURE__ */ new Date()).getTime() + ttl) };
    }
    clear() {
      if (this.#prefetchTimeout) clearTimeout(this.#prefetchTimeout);
      this.#prefetched = null;
    }
  };
  var cacheTtl = 10 * 1e3;
  var prefetchCache = new PrefetchCache();
  var FormSubmissionState = {
    initialized: "initialized",
    requesting: "requesting",
    waiting: "waiting",
    receiving: "receiving",
    stopping: "stopping",
    stopped: "stopped"
  };
  var FormSubmission = class _FormSubmission {
    state = FormSubmissionState.initialized;
    static confirmMethod(message) {
      return Promise.resolve(confirm(message));
    }
    constructor(delegate, formElement, submitter2, mustRedirect = false) {
      const method = getMethod(formElement, submitter2);
      const action = getAction(getFormAction(formElement, submitter2), method);
      const body = buildFormData(formElement, submitter2);
      const enctype = getEnctype(formElement, submitter2);
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter2;
      this.fetchRequest = new FetchRequest(this, method, action, body, formElement, enctype);
      this.mustRedirect = mustRedirect;
    }
    get method() {
      return this.fetchRequest.method;
    }
    set method(value) {
      this.fetchRequest.method = value;
    }
    get action() {
      return this.fetchRequest.url.toString();
    }
    set action(value) {
      this.fetchRequest.url = expandURL(value);
    }
    get body() {
      return this.fetchRequest.body;
    }
    get enctype() {
      return this.fetchRequest.enctype;
    }
    get isSafe() {
      return this.fetchRequest.isSafe;
    }
    get location() {
      return this.fetchRequest.url;
    }
    // The submission process
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      const confirmationMessage = getAttribute("data-turbo-confirm", this.submitter, this.formElement);
      if (typeof confirmationMessage === "string") {
        const confirmMethod = typeof config.forms.confirm === "function" ? config.forms.confirm : _FormSubmission.confirmMethod;
        const answer = await confirmMethod(confirmationMessage, this.formElement, this.submitter);
        if (!answer) {
          return;
        }
      }
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    // Fetch request delegate
    prepareRequest(request) {
      if (!request.isSafe) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          request.headers["X-CSRF-Token"] = token;
        }
      }
      if (this.requestAcceptsTurboStreamResponse(request)) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      this.state = FormSubmissionState.waiting;
      if (this.submitter) config.forms.submitter.beforeSubmit(this.submitter);
      this.setSubmitsWith();
      markAsBusy(this.formElement);
      dispatch("turbo:submit-start", {
        target: this.formElement,
        detail: { formSubmission: this }
      });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
      prefetchCache.clear();
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
        return;
      }
      prefetchCache.clear();
      if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
        const error2 = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error2);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error2) {
      this.result = { success: false, error: error2 };
      this.delegate.formSubmissionErrored(this, error2);
    }
    requestFinished(_request) {
      this.state = FormSubmissionState.stopped;
      if (this.submitter) config.forms.submitter.afterSubmit(this.submitter);
      this.resetSubmitterText();
      clearBusyState(this.formElement);
      dispatch("turbo:submit-end", {
        target: this.formElement,
        detail: { formSubmission: this, ...this.result }
      });
      this.delegate.formSubmissionFinished(this);
    }
    // Private
    setSubmitsWith() {
      if (!this.submitter || !this.submitsWith) return;
      if (this.submitter.matches("button")) {
        this.originalSubmitText = this.submitter.innerHTML;
        this.submitter.innerHTML = this.submitsWith;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        this.originalSubmitText = input.value;
        input.value = this.submitsWith;
      }
    }
    resetSubmitterText() {
      if (!this.submitter || !this.originalSubmitText) return;
      if (this.submitter.matches("button")) {
        this.submitter.innerHTML = this.originalSubmitText;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        input.value = this.originalSubmitText;
      }
    }
    requestMustRedirect(request) {
      return !request.isSafe && this.mustRedirect;
    }
    requestAcceptsTurboStreamResponse(request) {
      return !request.isSafe || hasAttribute("data-turbo-stream", this.submitter, this.formElement);
    }
    get submitsWith() {
      return this.submitter?.getAttribute("data-turbo-submits-with");
    }
  };
  function buildFormData(formElement, submitter2) {
    const formData = new FormData(formElement);
    const name = submitter2?.getAttribute("name");
    const value = submitter2?.getAttribute("value");
    if (name) {
      formData.append(name, value || "");
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  function getFormAction(formElement, submitter2) {
    const formElementAction = typeof formElement.action === "string" ? formElement.action : null;
    if (submitter2?.hasAttribute("formaction")) {
      return submitter2.getAttribute("formaction") || "";
    } else {
      return formElement.getAttribute("action") || formElementAction || "";
    }
  }
  function getAction(formAction, fetchMethod) {
    const action = expandURL(formAction);
    if (isSafe(fetchMethod)) {
      action.search = "";
    }
    return action;
  }
  function getMethod(formElement, submitter2) {
    const method = submitter2?.getAttribute("formmethod") || formElement.getAttribute("method") || "";
    return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
  }
  function getEnctype(formElement, submitter2) {
    return fetchEnctypeFromString(submitter2?.getAttribute("formenctype") || formElement.enctype);
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get activeElement() {
      return this.element.ownerDocument.activeElement;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      return queryAutofocusableElement(this.element);
    }
    get permanentElements() {
      return queryPermanentElementsAll(this.element);
    }
    getPermanentElementById(id3) {
      return getPermanentElementById(this.element, id3);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id: id3 } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id3);
        if (newPermanentElement) {
          permanentElementMap[id3] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  function getPermanentElementById(node, id3) {
    return node.querySelector(`#${id3}[data-turbo-permanent]`);
  }
  function queryPermanentElementsAll(node) {
    return node.querySelectorAll("[id][data-turbo-permanent]");
  }
  var FormSubmitObserver = class {
    started = false;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
    submitCaptured = () => {
      this.eventTarget.removeEventListener("submit", this.submitBubbled, false);
      this.eventTarget.addEventListener("submit", this.submitBubbled, false);
    };
    submitBubbled = (event) => {
      if (!event.defaultPrevented) {
        const form = event.target instanceof HTMLFormElement ? event.target : void 0;
        const submitter2 = event.submitter || void 0;
        if (form && submissionDoesNotDismissDialog(form, submitter2) && submissionDoesNotTargetIFrame(form, submitter2) && this.delegate.willSubmitForm(form, submitter2)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.delegate.formSubmitted(form, submitter2);
        }
      }
    };
  };
  function submissionDoesNotDismissDialog(form, submitter2) {
    const method = submitter2?.getAttribute("formmethod") || form.getAttribute("method");
    return method != "dialog";
  }
  function submissionDoesNotTargetIFrame(form, submitter2) {
    const target = submitter2?.getAttribute("formtarget") || form.getAttribute("target");
    return doesNotTargetIFrame(target);
  }
  var View = class {
    #resolveRenderPromise = (_value) => {
    };
    #resolveInterceptionPromise = (_value) => {
    };
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
    }
    // Scrolling
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.focusElement(element);
        this.scrollToElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x: x2, y: y2 }) {
      this.scrollRoot.scrollTo(x2, y2);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    // Rendering
    async render(renderer) {
      const { isPreview, shouldRender, willRender, newSnapshot: snapshot } = renderer;
      const shouldInvalidate = willRender;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve) => this.#resolveRenderPromise = resolve);
          this.renderer = renderer;
          await this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve) => this.#resolveInterceptionPromise = resolve);
          const options = { resume: this.#resolveInterceptionPromise, render: this.renderer.renderElement, renderMethod: this.renderer.renderMethod };
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, options);
          if (!immediateRender) await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview, this.renderer.renderMethod);
          this.delegate.preloadOnLoadLinksForView(this.element);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.#resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else if (shouldInvalidate) {
        this.invalidate(renderer.reloadReason);
      }
    }
    invalidate(reason) {
      this.delegate.viewInvalidated(reason);
    }
    async prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      await renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    markVisitDirection(direction) {
      this.element.setAttribute("data-turbo-visit-direction", direction);
    }
    unmarkVisitDirection() {
      this.element.removeAttribute("data-turbo-visit-direction");
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    missing() {
      this.element.innerHTML = `<strong class="turbo-frame-error">Content missing</strong>`;
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    clickBubbled = (event) => {
      if (this.clickEventIsSignificant(event)) {
        this.clickEvent = event;
      } else {
        delete this.clickEvent;
      }
    };
    linkClicked = (event) => {
      if (this.clickEvent && this.clickEventIsSignificant(event)) {
        if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url, event.detail.originalEvent)) {
          this.clickEvent.preventDefault();
          event.preventDefault();
          this.delegate.linkClickIntercepted(event.target, event.detail.url, event.detail.originalEvent);
        }
      }
      delete this.clickEvent;
    };
    willVisit = (_event) => {
      delete this.clickEvent;
    };
    clickEventIsSignificant(event) {
      const target = event.composed ? event.target?.parentElement : event.target;
      const element = findLinkFromClickTarget(target) || target;
      return element instanceof Element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var LinkClickObserver = class {
    started = false;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickCaptured = () => {
      this.eventTarget.removeEventListener("click", this.clickBubbled, false);
      this.eventTarget.addEventListener("click", this.clickBubbled, false);
    };
    clickBubbled = (event) => {
      if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
        const target = event.composedPath && event.composedPath()[0] || event.target;
        const link = findLinkFromClickTarget(target);
        if (link && doesNotTargetIFrame(link.target)) {
          const location2 = getLocationForLink(link);
          if (this.delegate.willFollowLinkToLocation(link, location2, event)) {
            event.preventDefault();
            this.delegate.followedLinkToLocation(link, location2);
          }
        }
      }
    };
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
  };
  var FormLinkClickObserver = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.linkInterceptor = new LinkClickObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
    }
    // Link hover observer delegate
    canPrefetchRequestToLocation(link, location2) {
      return false;
    }
    prefetchAndCacheRequestToLocation(link, location2) {
      return;
    }
    // Link click observer delegate
    willFollowLinkToLocation(link, location2, originalEvent) {
      return this.delegate.willSubmitFormLinkToLocation(link, location2, originalEvent) && (link.hasAttribute("data-turbo-method") || link.hasAttribute("data-turbo-stream"));
    }
    followedLinkToLocation(link, location2) {
      const form = document.createElement("form");
      const type = "hidden";
      for (const [name, value] of location2.searchParams) {
        form.append(Object.assign(document.createElement("input"), { type, name, value }));
      }
      const action = Object.assign(location2, { search: "" });
      form.setAttribute("data-turbo", "true");
      form.setAttribute("action", action.href);
      form.setAttribute("hidden", "");
      const method = link.getAttribute("data-turbo-method");
      if (method) form.setAttribute("method", method);
      const turboFrame = link.getAttribute("data-turbo-frame");
      if (turboFrame) form.setAttribute("data-turbo-frame", turboFrame);
      const turboAction = getVisitAction(link);
      if (turboAction) form.setAttribute("data-turbo-action", turboAction);
      const turboConfirm = link.getAttribute("data-turbo-confirm");
      if (turboConfirm) form.setAttribute("data-turbo-confirm", turboConfirm);
      const turboStream = link.hasAttribute("data-turbo-stream");
      if (turboStream) form.setAttribute("data-turbo-stream", "");
      this.delegate.submittedFormLinkToLocation(link, location2, form);
      document.body.appendChild(form);
      form.addEventListener("turbo:submit-end", () => form.remove(), { once: true });
      requestAnimationFrame(() => form.requestSubmit());
    }
  };
  var Bardo = class {
    static async preservingPermanentElements(delegate, permanentElementMap, callback) {
      const bardo = new this(delegate, permanentElementMap);
      bardo.enter();
      await callback();
      bardo.leave();
    }
    constructor(delegate, permanentElementMap) {
      this.delegate = delegate;
      this.permanentElementMap = permanentElementMap;
    }
    enter() {
      for (const id3 in this.permanentElementMap) {
        const [currentPermanentElement, newPermanentElement] = this.permanentElementMap[id3];
        this.delegate.enteringBardo(currentPermanentElement, newPermanentElement);
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id3 in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id3];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
        this.delegate.leavingBardo(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder?.replaceWith(permanentElement);
    }
    getPlaceholderById(id3) {
      return this.placeholders.find((element) => element.content == id3);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    #activeElement = null;
    static renderElement(currentElement, newElement) {
    }
    constructor(currentSnapshot, newSnapshot, isPreview, willRender = true) {
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.willRender = willRender;
      this.renderElement = this.constructor.renderElement;
      this.promise = new Promise((resolve, reject) => this.resolvingFunctions = { resolve, reject });
    }
    get shouldRender() {
      return true;
    }
    get shouldAutofocus() {
      return true;
    }
    get reloadReason() {
      return;
    }
    prepareToRender() {
      return;
    }
    render() {
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    async preservingPermanentElements(callback) {
      await Bardo.preservingPermanentElements(this, this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      if (this.shouldAutofocus) {
        const element = this.connectedSnapshot.firstAutofocusableElement;
        if (element) {
          element.focus();
        }
      }
    }
    // Bardo delegate
    enteringBardo(currentPermanentElement) {
      if (this.#activeElement) return;
      if (currentPermanentElement.contains(this.currentSnapshot.activeElement)) {
        this.#activeElement = this.currentSnapshot.activeElement;
      }
    }
    leavingBardo(currentPermanentElement) {
      if (currentPermanentElement.contains(this.#activeElement) && this.#activeElement instanceof HTMLElement) {
        this.#activeElement.focus();
        this.#activeElement = null;
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
    get renderMethod() {
      return "replace";
    }
  };
  var FrameRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(currentElement);
      destinationRange.deleteContents();
      const frameElement = newElement;
      const sourceRange = frameElement.ownerDocument?.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        currentElement.appendChild(sourceRange.extractContents());
      }
    }
    constructor(delegate, currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      super(currentSnapshot, newSnapshot, renderElement, isPreview, willRender);
      this.delegate = delegate;
    }
    get shouldRender() {
      return true;
    }
    async render() {
      await nextRepaint();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextRepaint();
      this.focusFirstAutofocusableElement();
      await nextRepaint();
      this.activateScriptElements();
    }
    loadFrameElement() {
      this.delegate.willRenderFrame(this.currentElement, this.newElement);
      this.renderElement(this.currentElement, this.newElement);
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        const behavior = readScrollBehavior(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
        if (element) {
          element.scrollIntoView({ block, behavior });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  function readScrollBehavior(value, defaultValue) {
    if (value == "auto" || value == "smooth") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var Idiomorph = (function() {
    const noOp = () => {
    };
    const defaults = {
      morphStyle: "outerHTML",
      callbacks: {
        beforeNodeAdded: noOp,
        afterNodeAdded: noOp,
        beforeNodeMorphed: noOp,
        afterNodeMorphed: noOp,
        beforeNodeRemoved: noOp,
        afterNodeRemoved: noOp,
        beforeAttributeUpdated: noOp
      },
      head: {
        style: "merge",
        shouldPreserve: (elt) => elt.getAttribute("im-preserve") === "true",
        shouldReAppend: (elt) => elt.getAttribute("im-re-append") === "true",
        shouldRemove: noOp,
        afterHeadMorphed: noOp
      },
      restoreFocus: true
    };
    function morph(oldNode, newContent, config2 = {}) {
      oldNode = normalizeElement(oldNode);
      const newNode = normalizeParent(newContent);
      const ctx = createMorphContext(oldNode, newNode, config2);
      const morphedNodes = saveAndRestoreFocus(ctx, () => {
        return withHeadBlocking(
          ctx,
          oldNode,
          newNode,
          /** @param {MorphContext} ctx */
          (ctx2) => {
            if (ctx2.morphStyle === "innerHTML") {
              morphChildren2(ctx2, oldNode, newNode);
              return Array.from(oldNode.childNodes);
            } else {
              return morphOuterHTML(ctx2, oldNode, newNode);
            }
          }
        );
      });
      ctx.pantry.remove();
      return morphedNodes;
    }
    function morphOuterHTML(ctx, oldNode, newNode) {
      const oldParent = normalizeParent(oldNode);
      morphChildren2(
        ctx,
        oldParent,
        newNode,
        // these two optional params are the secret sauce
        oldNode,
        // start point for iteration
        oldNode.nextSibling
        // end point for iteration
      );
      return Array.from(oldParent.childNodes);
    }
    function saveAndRestoreFocus(ctx, fn2) {
      if (!ctx.config.restoreFocus) return fn2();
      let activeElement = (
        /** @type {HTMLInputElement|HTMLTextAreaElement|null} */
        document.activeElement
      );
      if (!(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
        return fn2();
      }
      const { id: activeElementId, selectionStart, selectionEnd } = activeElement;
      const results = fn2();
      if (activeElementId && activeElementId !== document.activeElement?.getAttribute("id")) {
        activeElement = ctx.target.querySelector(`[id="${activeElementId}"]`);
        activeElement?.focus();
      }
      if (activeElement && !activeElement.selectionEnd && selectionEnd) {
        activeElement.setSelectionRange(selectionStart, selectionEnd);
      }
      return results;
    }
    const morphChildren2 = /* @__PURE__ */ (function() {
      function morphChildren3(ctx, oldParent, newParent, insertionPoint = null, endPoint = null) {
        if (oldParent instanceof HTMLTemplateElement && newParent instanceof HTMLTemplateElement) {
          oldParent = oldParent.content;
          newParent = newParent.content;
        }
        insertionPoint ||= oldParent.firstChild;
        for (const newChild of newParent.childNodes) {
          if (insertionPoint && insertionPoint != endPoint) {
            const bestMatch = findBestMatch(
              ctx,
              newChild,
              insertionPoint,
              endPoint
            );
            if (bestMatch) {
              if (bestMatch !== insertionPoint) {
                removeNodesBetween(ctx, insertionPoint, bestMatch);
              }
              morphNode(bestMatch, newChild, ctx);
              insertionPoint = bestMatch.nextSibling;
              continue;
            }
          }
          if (newChild instanceof Element) {
            const newChildId = (
              /** @type {String} */
              newChild.getAttribute("id")
            );
            if (ctx.persistentIds.has(newChildId)) {
              const movedChild = moveBeforeById(
                oldParent,
                newChildId,
                insertionPoint,
                ctx
              );
              morphNode(movedChild, newChild, ctx);
              insertionPoint = movedChild.nextSibling;
              continue;
            }
          }
          const insertedNode = createNode(
            oldParent,
            newChild,
            insertionPoint,
            ctx
          );
          if (insertedNode) {
            insertionPoint = insertedNode.nextSibling;
          }
        }
        while (insertionPoint && insertionPoint != endPoint) {
          const tempNode = insertionPoint;
          insertionPoint = insertionPoint.nextSibling;
          removeNode(ctx, tempNode);
        }
      }
      function createNode(oldParent, newChild, insertionPoint, ctx) {
        if (ctx.callbacks.beforeNodeAdded(newChild) === false) return null;
        if (ctx.idMap.has(newChild)) {
          const newEmptyChild = document.createElement(
            /** @type {Element} */
            newChild.tagName
          );
          oldParent.insertBefore(newEmptyChild, insertionPoint);
          morphNode(newEmptyChild, newChild, ctx);
          ctx.callbacks.afterNodeAdded(newEmptyChild);
          return newEmptyChild;
        } else {
          const newClonedChild = document.importNode(newChild, true);
          oldParent.insertBefore(newClonedChild, insertionPoint);
          ctx.callbacks.afterNodeAdded(newClonedChild);
          return newClonedChild;
        }
      }
      const findBestMatch = /* @__PURE__ */ (function() {
        function findBestMatch2(ctx, node, startPoint, endPoint) {
          let softMatch = null;
          let nextSibling = node.nextSibling;
          let siblingSoftMatchCount = 0;
          let cursor = startPoint;
          while (cursor && cursor != endPoint) {
            if (isSoftMatch(cursor, node)) {
              if (isIdSetMatch(ctx, cursor, node)) {
                return cursor;
              }
              if (softMatch === null) {
                if (!ctx.idMap.has(cursor)) {
                  softMatch = cursor;
                }
              }
            }
            if (softMatch === null && nextSibling && isSoftMatch(cursor, nextSibling)) {
              siblingSoftMatchCount++;
              nextSibling = nextSibling.nextSibling;
              if (siblingSoftMatchCount >= 2) {
                softMatch = void 0;
              }
            }
            if (ctx.activeElementAndParents.includes(cursor)) break;
            cursor = cursor.nextSibling;
          }
          return softMatch || null;
        }
        function isIdSetMatch(ctx, oldNode, newNode) {
          let oldSet = ctx.idMap.get(oldNode);
          let newSet = ctx.idMap.get(newNode);
          if (!newSet || !oldSet) return false;
          for (const id3 of oldSet) {
            if (newSet.has(id3)) {
              return true;
            }
          }
          return false;
        }
        function isSoftMatch(oldNode, newNode) {
          const oldElt = (
            /** @type {Element} */
            oldNode
          );
          const newElt = (
            /** @type {Element} */
            newNode
          );
          return oldElt.nodeType === newElt.nodeType && oldElt.tagName === newElt.tagName && // If oldElt has an `id` with possible state and it doesn't match newElt.id then avoid morphing.
          // We'll still match an anonymous node with an IDed newElt, though, because if it got this far,
          // its not persistent, and new nodes can't have any hidden state.
          // We can't use .id because of form input shadowing, and we can't count on .getAttribute's presence because it could be a document-fragment
          (!oldElt.getAttribute?.("id") || oldElt.getAttribute?.("id") === newElt.getAttribute?.("id"));
        }
        return findBestMatch2;
      })();
      function removeNode(ctx, node) {
        if (ctx.idMap.has(node)) {
          moveBefore(ctx.pantry, node, null);
        } else {
          if (ctx.callbacks.beforeNodeRemoved(node) === false) return;
          node.parentNode?.removeChild(node);
          ctx.callbacks.afterNodeRemoved(node);
        }
      }
      function removeNodesBetween(ctx, startInclusive, endExclusive) {
        let cursor = startInclusive;
        while (cursor && cursor !== endExclusive) {
          let tempNode = (
            /** @type {Node} */
            cursor
          );
          cursor = cursor.nextSibling;
          removeNode(ctx, tempNode);
        }
        return cursor;
      }
      function moveBeforeById(parentNode, id3, after, ctx) {
        const target = (
          /** @type {Element} - will always be found */
          // ctx.target.id unsafe because of form input shadowing
          // ctx.target could be a document fragment which doesn't have `getAttribute`
          ctx.target.getAttribute?.("id") === id3 && ctx.target || ctx.target.querySelector(`[id="${id3}"]`) || ctx.pantry.querySelector(`[id="${id3}"]`)
        );
        removeElementFromAncestorsIdMaps(target, ctx);
        moveBefore(parentNode, target, after);
        return target;
      }
      function removeElementFromAncestorsIdMaps(element, ctx) {
        const id3 = (
          /** @type {String} */
          element.getAttribute("id")
        );
        while (element = element.parentNode) {
          let idSet = ctx.idMap.get(element);
          if (idSet) {
            idSet.delete(id3);
            if (!idSet.size) {
              ctx.idMap.delete(element);
            }
          }
        }
      }
      function moveBefore(parentNode, element, after) {
        if (parentNode.moveBefore) {
          try {
            parentNode.moveBefore(element, after);
          } catch (e2) {
            parentNode.insertBefore(element, after);
          }
        } else {
          parentNode.insertBefore(element, after);
        }
      }
      return morphChildren3;
    })();
    const morphNode = /* @__PURE__ */ (function() {
      function morphNode2(oldNode, newContent, ctx) {
        if (ctx.ignoreActive && oldNode === document.activeElement) {
          return null;
        }
        if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false) {
          return oldNode;
        }
        if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) ;
        else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
          handleHeadElement(
            oldNode,
            /** @type {HTMLHeadElement} */
            newContent,
            ctx
          );
        } else {
          morphAttributes(oldNode, newContent, ctx);
          if (!ignoreValueOfActiveElement(oldNode, ctx)) {
            morphChildren2(ctx, oldNode, newContent);
          }
        }
        ctx.callbacks.afterNodeMorphed(oldNode, newContent);
        return oldNode;
      }
      function morphAttributes(oldNode, newNode, ctx) {
        let type = newNode.nodeType;
        if (type === 1) {
          const oldElt = (
            /** @type {Element} */
            oldNode
          );
          const newElt = (
            /** @type {Element} */
            newNode
          );
          const oldAttributes = oldElt.attributes;
          const newAttributes = newElt.attributes;
          for (const newAttribute of newAttributes) {
            if (ignoreAttribute(newAttribute.name, oldElt, "update", ctx)) {
              continue;
            }
            if (oldElt.getAttribute(newAttribute.name) !== newAttribute.value) {
              oldElt.setAttribute(newAttribute.name, newAttribute.value);
            }
          }
          for (let i2 = oldAttributes.length - 1; 0 <= i2; i2--) {
            const oldAttribute = oldAttributes[i2];
            if (!oldAttribute) continue;
            if (!newElt.hasAttribute(oldAttribute.name)) {
              if (ignoreAttribute(oldAttribute.name, oldElt, "remove", ctx)) {
                continue;
              }
              oldElt.removeAttribute(oldAttribute.name);
            }
          }
          if (!ignoreValueOfActiveElement(oldElt, ctx)) {
            syncInputValue(oldElt, newElt, ctx);
          }
        }
        if (type === 8 || type === 3) {
          if (oldNode.nodeValue !== newNode.nodeValue) {
            oldNode.nodeValue = newNode.nodeValue;
          }
        }
      }
      function syncInputValue(oldElement, newElement, ctx) {
        if (oldElement instanceof HTMLInputElement && newElement instanceof HTMLInputElement && newElement.type !== "file") {
          let newValue = newElement.value;
          let oldValue = oldElement.value;
          syncBooleanAttribute(oldElement, newElement, "checked", ctx);
          syncBooleanAttribute(oldElement, newElement, "disabled", ctx);
          if (!newElement.hasAttribute("value")) {
            if (!ignoreAttribute("value", oldElement, "remove", ctx)) {
              oldElement.value = "";
              oldElement.removeAttribute("value");
            }
          } else if (oldValue !== newValue) {
            if (!ignoreAttribute("value", oldElement, "update", ctx)) {
              oldElement.setAttribute("value", newValue);
              oldElement.value = newValue;
            }
          }
        } else if (oldElement instanceof HTMLOptionElement && newElement instanceof HTMLOptionElement) {
          syncBooleanAttribute(oldElement, newElement, "selected", ctx);
        } else if (oldElement instanceof HTMLTextAreaElement && newElement instanceof HTMLTextAreaElement) {
          let newValue = newElement.value;
          let oldValue = oldElement.value;
          if (ignoreAttribute("value", oldElement, "update", ctx)) {
            return;
          }
          if (newValue !== oldValue) {
            oldElement.value = newValue;
          }
          if (oldElement.firstChild && oldElement.firstChild.nodeValue !== newValue) {
            oldElement.firstChild.nodeValue = newValue;
          }
        }
      }
      function syncBooleanAttribute(oldElement, newElement, attributeName, ctx) {
        const newLiveValue = newElement[attributeName], oldLiveValue = oldElement[attributeName];
        if (newLiveValue !== oldLiveValue) {
          const ignoreUpdate = ignoreAttribute(
            attributeName,
            oldElement,
            "update",
            ctx
          );
          if (!ignoreUpdate) {
            oldElement[attributeName] = newElement[attributeName];
          }
          if (newLiveValue) {
            if (!ignoreUpdate) {
              oldElement.setAttribute(attributeName, "");
            }
          } else {
            if (!ignoreAttribute(attributeName, oldElement, "remove", ctx)) {
              oldElement.removeAttribute(attributeName);
            }
          }
        }
      }
      function ignoreAttribute(attr, element, updateType, ctx) {
        if (attr === "value" && ctx.ignoreActiveValue && element === document.activeElement) {
          return true;
        }
        return ctx.callbacks.beforeAttributeUpdated(attr, element, updateType) === false;
      }
      function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
        return !!ctx.ignoreActiveValue && possibleActiveElement === document.activeElement && possibleActiveElement !== document.body;
      }
      return morphNode2;
    })();
    function withHeadBlocking(ctx, oldNode, newNode, callback) {
      if (ctx.head.block) {
        const oldHead = oldNode.querySelector("head");
        const newHead = newNode.querySelector("head");
        if (oldHead && newHead) {
          const promises = handleHeadElement(oldHead, newHead, ctx);
          return Promise.all(promises).then(() => {
            const newCtx = Object.assign(ctx, {
              head: {
                block: false,
                ignore: true
              }
            });
            return callback(newCtx);
          });
        }
      }
      return callback(ctx);
    }
    function handleHeadElement(oldHead, newHead, ctx) {
      let added = [];
      let removed = [];
      let preserved = [];
      let nodesToAppend = [];
      let srcToNewHeadNodes = /* @__PURE__ */ new Map();
      for (const newHeadChild of newHead.children) {
        srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
      }
      for (const currentHeadElt of oldHead.children) {
        let inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
        let isReAppended = ctx.head.shouldReAppend(currentHeadElt);
        let isPreserved = ctx.head.shouldPreserve(currentHeadElt);
        if (inNewContent || isPreserved) {
          if (isReAppended) {
            removed.push(currentHeadElt);
          } else {
            srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
            preserved.push(currentHeadElt);
          }
        } else {
          if (ctx.head.style === "append") {
            if (isReAppended) {
              removed.push(currentHeadElt);
              nodesToAppend.push(currentHeadElt);
            }
          } else {
            if (ctx.head.shouldRemove(currentHeadElt) !== false) {
              removed.push(currentHeadElt);
            }
          }
        }
      }
      nodesToAppend.push(...srcToNewHeadNodes.values());
      let promises = [];
      for (const newNode of nodesToAppend) {
        let newElt = (
          /** @type {ChildNode} */
          document.createRange().createContextualFragment(newNode.outerHTML).firstChild
        );
        if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
          if ("href" in newElt && newElt.href || "src" in newElt && newElt.src) {
            let resolve;
            let promise = new Promise(function(_resolve) {
              resolve = _resolve;
            });
            newElt.addEventListener("load", function() {
              resolve();
            });
            promises.push(promise);
          }
          oldHead.appendChild(newElt);
          ctx.callbacks.afterNodeAdded(newElt);
          added.push(newElt);
        }
      }
      for (const removedElement of removed) {
        if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
          oldHead.removeChild(removedElement);
          ctx.callbacks.afterNodeRemoved(removedElement);
        }
      }
      ctx.head.afterHeadMorphed(oldHead, {
        added,
        kept: preserved,
        removed
      });
      return promises;
    }
    const createMorphContext = /* @__PURE__ */ (function() {
      function createMorphContext2(oldNode, newContent, config2) {
        const { persistentIds, idMap } = createIdMaps(oldNode, newContent);
        const mergedConfig = mergeDefaults(config2);
        const morphStyle = mergedConfig.morphStyle || "outerHTML";
        if (!["innerHTML", "outerHTML"].includes(morphStyle)) {
          throw `Do not understand how to morph style ${morphStyle}`;
        }
        return {
          target: oldNode,
          newContent,
          config: mergedConfig,
          morphStyle,
          ignoreActive: mergedConfig.ignoreActive,
          ignoreActiveValue: mergedConfig.ignoreActiveValue,
          restoreFocus: mergedConfig.restoreFocus,
          idMap,
          persistentIds,
          pantry: createPantry(),
          activeElementAndParents: createActiveElementAndParents(oldNode),
          callbacks: mergedConfig.callbacks,
          head: mergedConfig.head
        };
      }
      function mergeDefaults(config2) {
        let finalConfig = Object.assign({}, defaults);
        Object.assign(finalConfig, config2);
        finalConfig.callbacks = Object.assign(
          {},
          defaults.callbacks,
          config2.callbacks
        );
        finalConfig.head = Object.assign({}, defaults.head, config2.head);
        return finalConfig;
      }
      function createPantry() {
        const pantry = document.createElement("div");
        pantry.hidden = true;
        document.body.insertAdjacentElement("afterend", pantry);
        return pantry;
      }
      function createActiveElementAndParents(oldNode) {
        let activeElementAndParents = [];
        let elt = document.activeElement;
        if (elt?.tagName !== "BODY" && oldNode.contains(elt)) {
          while (elt) {
            activeElementAndParents.push(elt);
            if (elt === oldNode) break;
            elt = elt.parentElement;
          }
        }
        return activeElementAndParents;
      }
      function findIdElements(root) {
        let elements = Array.from(root.querySelectorAll("[id]"));
        if (root.getAttribute?.("id")) {
          elements.push(root);
        }
        return elements;
      }
      function populateIdMapWithTree(idMap, persistentIds, root, elements) {
        for (const elt of elements) {
          const id3 = (
            /** @type {String} */
            elt.getAttribute("id")
          );
          if (persistentIds.has(id3)) {
            let current = elt;
            while (current) {
              let idSet = idMap.get(current);
              if (idSet == null) {
                idSet = /* @__PURE__ */ new Set();
                idMap.set(current, idSet);
              }
              idSet.add(id3);
              if (current === root) break;
              current = current.parentElement;
            }
          }
        }
      }
      function createIdMaps(oldContent, newContent) {
        const oldIdElements = findIdElements(oldContent);
        const newIdElements = findIdElements(newContent);
        const persistentIds = createPersistentIds(oldIdElements, newIdElements);
        let idMap = /* @__PURE__ */ new Map();
        populateIdMapWithTree(idMap, persistentIds, oldContent, oldIdElements);
        const newRoot = newContent.__idiomorphRoot || newContent;
        populateIdMapWithTree(idMap, persistentIds, newRoot, newIdElements);
        return { persistentIds, idMap };
      }
      function createPersistentIds(oldIdElements, newIdElements) {
        let duplicateIds = /* @__PURE__ */ new Set();
        let oldIdTagNameMap = /* @__PURE__ */ new Map();
        for (const { id: id3, tagName } of oldIdElements) {
          if (oldIdTagNameMap.has(id3)) {
            duplicateIds.add(id3);
          } else {
            oldIdTagNameMap.set(id3, tagName);
          }
        }
        let persistentIds = /* @__PURE__ */ new Set();
        for (const { id: id3, tagName } of newIdElements) {
          if (persistentIds.has(id3)) {
            duplicateIds.add(id3);
          } else if (oldIdTagNameMap.get(id3) === tagName) {
            persistentIds.add(id3);
          }
        }
        for (const id3 of duplicateIds) {
          persistentIds.delete(id3);
        }
        return persistentIds;
      }
      return createMorphContext2;
    })();
    const { normalizeElement, normalizeParent } = /* @__PURE__ */ (function() {
      const generatedByIdiomorph = /* @__PURE__ */ new WeakSet();
      function normalizeElement2(content) {
        if (content instanceof Document) {
          return content.documentElement;
        } else {
          return content;
        }
      }
      function normalizeParent2(newContent) {
        if (newContent == null) {
          return document.createElement("div");
        } else if (typeof newContent === "string") {
          return normalizeParent2(parseContent(newContent));
        } else if (generatedByIdiomorph.has(
          /** @type {Element} */
          newContent
        )) {
          return (
            /** @type {Element} */
            newContent
          );
        } else if (newContent instanceof Node) {
          if (newContent.parentNode) {
            return (
              /** @type {any} */
              new SlicedParentNode(newContent)
            );
          } else {
            const dummyParent = document.createElement("div");
            dummyParent.append(newContent);
            return dummyParent;
          }
        } else {
          const dummyParent = document.createElement("div");
          for (const elt of [...newContent]) {
            dummyParent.append(elt);
          }
          return dummyParent;
        }
      }
      class SlicedParentNode {
        /** @param {Node} node */
        constructor(node) {
          this.originalNode = node;
          this.realParentNode = /** @type {Element} */
          node.parentNode;
          this.previousSibling = node.previousSibling;
          this.nextSibling = node.nextSibling;
        }
        /** @returns {Node[]} */
        get childNodes() {
          const nodes = [];
          let cursor = this.previousSibling ? this.previousSibling.nextSibling : this.realParentNode.firstChild;
          while (cursor && cursor != this.nextSibling) {
            nodes.push(cursor);
            cursor = cursor.nextSibling;
          }
          return nodes;
        }
        /**
         * @param {string} selector
         * @returns {Element[]}
         */
        querySelectorAll(selector) {
          return this.childNodes.reduce(
            (results, node) => {
              if (node instanceof Element) {
                if (node.matches(selector)) results.push(node);
                const nodeList = node.querySelectorAll(selector);
                for (let i2 = 0; i2 < nodeList.length; i2++) {
                  results.push(nodeList[i2]);
                }
              }
              return results;
            },
            /** @type {Element[]} */
            []
          );
        }
        /**
         * @param {Node} node
         * @param {Node} referenceNode
         * @returns {Node}
         */
        insertBefore(node, referenceNode) {
          return this.realParentNode.insertBefore(node, referenceNode);
        }
        /**
         * @param {Node} node
         * @param {Node} referenceNode
         * @returns {Node}
         */
        moveBefore(node, referenceNode) {
          return this.realParentNode.moveBefore(node, referenceNode);
        }
        /**
         * for later use with populateIdMapWithTree to halt upwards iteration
         * @returns {Node}
         */
        get __idiomorphRoot() {
          return this.originalNode;
        }
      }
      function parseContent(newContent) {
        let parser = new DOMParser();
        let contentWithSvgsRemoved = newContent.replace(
          /<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,
          ""
        );
        if (contentWithSvgsRemoved.match(/<\/html>/) || contentWithSvgsRemoved.match(/<\/head>/) || contentWithSvgsRemoved.match(/<\/body>/)) {
          let content = parser.parseFromString(newContent, "text/html");
          if (contentWithSvgsRemoved.match(/<\/html>/)) {
            generatedByIdiomorph.add(content);
            return content;
          } else {
            let htmlElement = content.firstChild;
            if (htmlElement) {
              generatedByIdiomorph.add(htmlElement);
            }
            return htmlElement;
          }
        } else {
          let responseDoc = parser.parseFromString(
            "<body><template>" + newContent + "</template></body>",
            "text/html"
          );
          let content = (
            /** @type {HTMLTemplateElement} */
            responseDoc.body.querySelector("template").content
          );
          generatedByIdiomorph.add(content);
          return content;
        }
      }
      return { normalizeElement: normalizeElement2, normalizeParent: normalizeParent2 };
    })();
    return {
      morph,
      defaults
    };
  })();
  function morphElements(currentElement, newElement, { callbacks, ...options } = {}) {
    Idiomorph.morph(currentElement, newElement, {
      ...options,
      callbacks: new DefaultIdiomorphCallbacks(callbacks)
    });
  }
  function morphChildren(currentElement, newElement, options = {}) {
    morphElements(currentElement, newElement.childNodes, {
      ...options,
      morphStyle: "innerHTML"
    });
  }
  function shouldRefreshFrameWithMorphing(currentFrame, newFrame) {
    return currentFrame instanceof FrameElement && currentFrame.shouldReloadWithMorph && (!newFrame || areFramesCompatibleForRefreshing(currentFrame, newFrame)) && !currentFrame.closest("[data-turbo-permanent]");
  }
  function areFramesCompatibleForRefreshing(currentFrame, newFrame) {
    return newFrame instanceof Element && newFrame.nodeName === "TURBO-FRAME" && currentFrame.id === newFrame.id && (!newFrame.getAttribute("src") || urlsAreEqual(currentFrame.src, newFrame.getAttribute("src")));
  }
  function closestFrameReloadableWithMorphing(node) {
    return node.parentElement.closest("turbo-frame[src][refresh=morph]");
  }
  var DefaultIdiomorphCallbacks = class {
    #beforeNodeMorphed;
    constructor({ beforeNodeMorphed } = {}) {
      this.#beforeNodeMorphed = beforeNodeMorphed || (() => true);
    }
    beforeNodeAdded = (node) => {
      return !(node.id && node.hasAttribute("data-turbo-permanent") && document.getElementById(node.id));
    };
    beforeNodeMorphed = (currentElement, newElement) => {
      if (currentElement instanceof Element) {
        if (!currentElement.hasAttribute("data-turbo-permanent") && this.#beforeNodeMorphed(currentElement, newElement)) {
          const event = dispatch("turbo:before-morph-element", {
            cancelable: true,
            target: currentElement,
            detail: { currentElement, newElement }
          });
          return !event.defaultPrevented;
        } else {
          return false;
        }
      }
    };
    beforeAttributeUpdated = (attributeName, target, mutationType) => {
      const event = dispatch("turbo:before-morph-attribute", {
        cancelable: true,
        target,
        detail: { attributeName, mutationType }
      });
      return !event.defaultPrevented;
    };
    beforeNodeRemoved = (node) => {
      return this.beforeNodeMorphed(node);
    };
    afterNodeMorphed = (currentElement, newElement) => {
      if (currentElement instanceof Element) {
        dispatch("turbo:morph-element", {
          target: currentElement,
          detail: { currentElement, newElement }
        });
      }
    };
  };
  var MorphingFrameRenderer = class extends FrameRenderer {
    static renderElement(currentElement, newElement) {
      dispatch("turbo:before-frame-morph", {
        target: currentElement,
        detail: { currentElement, newElement }
      });
      morphChildren(currentElement, newElement, {
        callbacks: {
          beforeNodeMorphed: (node, newNode) => {
            if (shouldRefreshFrameWithMorphing(node, newNode) && closestFrameReloadableWithMorphing(node) === currentElement) {
              node.reload();
              return false;
            }
            return true;
          }
        }
      });
    }
    async preservingPermanentElements(callback) {
      return await callback();
    }
  };
  var ProgressBar = class _ProgressBar {
    static animationDuration = 300;
    /*ms*/
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${_ProgressBar.animationDuration}ms ease-out,
          opacity ${_ProgressBar.animationDuration / 2}ms ${_ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    hiding = false;
    value = 0;
    visible = false;
    constructor() {
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    // Private
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, _ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, _ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    trickle = () => {
      this.setValue(this.value + Math.random() / 100);
    };
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = _ProgressBar.defaultCSS;
      const cspNonce = getCspNonce();
      if (cspNonce) {
        element.nonce = cspNonce;
      }
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
  };
  var HeadSnapshot = class extends Snapshot {
    detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result, element) => {
      const { outerHTML } = element;
      const details = outerHTML in result ? result[outerHTML] : {
        type: elementType(element),
        tracked: elementIsTracked(element),
        elements: []
      };
      return {
        ...result,
        [outerHTML]: {
          ...details,
          elements: [...details.elements, element]
        }
      };
    }, {});
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result, ...elements];
        } else if (elements.length > 1) {
          return [...result, ...elements.slice(1)];
        } else {
          return result;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const {
          elements: [element]
        } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, void 0 | void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName = element.localName;
    return tagName == "script";
  }
  function elementIsNoscript(element) {
    const tagName = element.localName;
    return tagName == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName = element.localName;
    return tagName == "style" || tagName == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName = element.localName;
    return tagName == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class _PageSnapshot extends Snapshot {
    static fromHTMLString(html = "") {
      return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ documentElement, body, head }) {
      return new this(documentElement, body, new HeadSnapshot(head));
    }
    constructor(documentElement, body, headSnapshot) {
      super(body);
      this.documentElement = documentElement;
      this.headSnapshot = headSnapshot;
    }
    clone() {
      const clonedElement = this.element.cloneNode(true);
      const selectElements = this.element.querySelectorAll("select");
      const clonedSelectElements = clonedElement.querySelectorAll("select");
      for (const [index, source] of selectElements.entries()) {
        const clone = clonedSelectElements[index];
        for (const option of clone.selectedOptions) option.selected = false;
        for (const option of source.selectedOptions) clone.options[option.index].selected = true;
      }
      for (const clonedPasswordInput of clonedElement.querySelectorAll('input[type="password"]')) {
        clonedPasswordInput.value = "";
      }
      return new _PageSnapshot(this.documentElement, clonedElement, this.headSnapshot);
    }
    get lang() {
      return this.documentElement.getAttribute("lang");
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      const root = this.getSetting("root") ?? "/";
      return expandURL(root);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    get prefersViewTransitions() {
      const viewTransitionEnabled = this.getSetting("view-transition") === "true" || this.headSnapshot.getMetaValue("view-transition") === "same-origin";
      return viewTransitionEnabled && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    get shouldMorphPage() {
      return this.getSetting("refresh-method") === "morph";
    }
    get shouldPreserveScrollPosition() {
      return this.getSetting("refresh-scroll") === "preserve";
    }
    // Private
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var ViewTransitioner = class {
    #viewTransitionStarted = false;
    #lastOperation = Promise.resolve();
    renderChange(useViewTransition, render) {
      if (useViewTransition && this.viewTransitionsAvailable && !this.#viewTransitionStarted) {
        this.#viewTransitionStarted = true;
        this.#lastOperation = this.#lastOperation.then(async () => {
          await document.startViewTransition(render).finished;
        });
      } else {
        this.#lastOperation = this.#lastOperation.then(render);
      }
      return this.#lastOperation;
    }
    get viewTransitionsAvailable() {
      return document.startViewTransition;
    }
  };
  var defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => {
    },
    willRender: true,
    updateHistory: true,
    shouldCacheSnapshot: true,
    acceptsStreamResponse: false
  };
  var TimingMetric = {
    visitStart: "visitStart",
    requestStart: "requestStart",
    requestEnd: "requestEnd",
    visitEnd: "visitEnd"
  };
  var VisitState = {
    initialized: "initialized",
    started: "started",
    canceled: "canceled",
    failed: "failed",
    completed: "completed"
  };
  var SystemStatusCode = {
    networkFailure: 0,
    timeoutFailure: -1,
    contentTypeMismatch: -2
  };
  var Direction = {
    advance: "forward",
    restore: "back",
    replace: "none"
  };
  var Visit = class {
    identifier = uuid();
    // Required by turbo-ios
    timingMetrics = {};
    followedRedirect = false;
    historyChanged = false;
    scrolled = false;
    shouldCacheSnapshot = true;
    acceptsStreamResponse = false;
    snapshotCached = false;
    state = VisitState.initialized;
    viewTransitioner = new ViewTransitioner();
    constructor(delegate, location2, restorationIdentifier, options = {}) {
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const {
        action,
        historyChanged,
        referrer,
        snapshot,
        snapshotHTML,
        response,
        visitCachedSnapshot,
        willRender,
        updateHistory,
        shouldCacheSnapshot,
        acceptsStreamResponse,
        direction
      } = {
        ...defaultOptions,
        ...options
      };
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshot = snapshot;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
      this.isPageRefresh = this.view.isPageRefresh(this);
      this.visitCachedSnapshot = visitCachedSnapshot;
      this.willRender = willRender;
      this.updateHistory = updateHistory;
      this.scrolled = !willRender;
      this.shouldCacheSnapshot = shouldCacheSnapshot;
      this.acceptsStreamResponse = acceptsStreamResponse;
      this.direction = direction || Direction[action];
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
      return this.isSamePage;
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.adapter.visitCompleted(this);
        this.state = VisitState.completed;
        this.followRedirect();
        if (!this.followedRedirect) {
          this.delegate.visitCompleted(this);
        }
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
        this.delegate.visitCompleted(this);
      }
    }
    changeHistory() {
      if (!this.historyChanged && this.updateHistory) {
        const actionForHistory = this.location.href === this.referrer?.href ? "replace" : this.action;
        const method = getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          if (this.shouldCacheSnapshot) this.cacheSnapshot();
          if (this.view.renderPromise) await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            const snapshot = PageSnapshot.fromHTMLString(responseHTML);
            await this.renderPageSnapshot(snapshot, false);
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this);
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isSamePage || this.isPageRefresh) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise) await this.view.renderPromise;
            await this.renderPageSnapshot(snapshot, isPreview);
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      if (this.redirectedToLocation && !this.followedRedirect && this.response?.redirected) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response,
          shouldCacheSnapshot: false,
          willRender: false
        });
        this.followedRedirect = true;
      }
    }
    goToSamePageAnchor() {
      if (this.isSamePage) {
        this.render(async () => {
          this.cacheSnapshot();
          this.performScroll();
          this.changeHistory();
          this.adapter.visitRendered(this);
        });
      }
    }
    // Fetch request delegate
    prepareRequest(request) {
      if (this.acceptsStreamResponse) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(_request, _response) {
    }
    async requestSucceededWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    async requestFailedWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    requestErrored(_request, _error) {
      this.recordResponse({
        statusCode: SystemStatusCode.networkFailure,
        redirected: false
      });
    }
    requestFinished() {
      this.finishRequest();
    }
    // Scrolling
    performScroll() {
      if (!this.scrolled && !this.view.forceReloaded && !this.view.shouldPreserveScrollPosition(this)) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        if (this.isSamePage) {
          this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    // Instrumentation
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = (/* @__PURE__ */ new Date()).getTime();
    }
    getTimingMetrics() {
      return { ...this.timingMetrics };
    }
    // Private
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.isSamePage) {
        return false;
      } else if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return this.willRender;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot(this.snapshot).then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      await new Promise((resolve) => {
        this.frame = document.visibilityState === "hidden" ? setTimeout(() => resolve(), 0) : requestAnimationFrame(() => resolve());
      });
      await callback();
      delete this.frame;
    }
    async renderPageSnapshot(snapshot, isPreview) {
      await this.viewTransitioner.renderChange(this.view.shouldTransitionTo(snapshot), async () => {
        await this.view.renderPage(snapshot, isPreview, this.willRender, this);
        this.performScroll();
      });
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    progressBar = new ProgressBar();
    constructor(session2) {
      this.session = session2;
    }
    visitProposedToLocation(location2, options) {
      if (locationIsVisitable(location2, this.navigator.rootLocation)) {
        this.navigator.startVisit(location2, options?.restorationIdentifier || uuid(), options);
      } else {
        window.location.href = location2.toString();
      }
    }
    visitStarted(visit2) {
      this.location = visit2.location;
      this.redirectedToLocation = null;
      visit2.loadCachedSnapshot();
      visit2.issueRequest();
      visit2.goToSamePageAnchor();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
      if (visit2.response.redirected) {
        this.redirectedToLocation = visit2.redirectedToLocation;
      }
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload({
            reason: "request_failed",
            context: {
              statusCode
            }
          });
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(_visit) {
    }
    visitCompleted(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    pageInvalidated(reason) {
      this.reload(reason);
    }
    visitFailed(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitRendered(_visit) {
    }
    // Link prefetching
    linkPrefetchingIsEnabledForLocation(location2) {
      return true;
    }
    // Form Submission Delegate
    formSubmissionStarted(_formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(_formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    // Private
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    showProgressBar = () => {
      this.progressBar.show();
    };
    reload(reason) {
      dispatch("turbo:reload", { detail: reason });
      window.location.href = (this.redirectedToLocation || this.location)?.toString() || window.location.href;
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    selector = "[data-turbo-temporary]";
    deprecatedSelector = "[data-turbo-cache=false]";
    started = false;
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    removeTemporaryElements = (_event) => {
      for (const element of this.temporaryElements) {
        element.remove();
      }
    };
    get temporaryElements() {
      return [...document.querySelectorAll(this.selector), ...this.temporaryElementsWithDeprecation];
    }
    get temporaryElementsWithDeprecation() {
      const elements = document.querySelectorAll(this.deprecatedSelector);
      if (elements.length) {
        console.warn(
          `The ${this.deprecatedSelector} selector is deprecated and will be removed in a future version. Use ${this.selector} instead.`
        );
      }
      return [...elements];
    }
  };
  var FrameRedirector = class {
    constructor(session2, element) {
      this.session = session2;
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formSubmitObserver = new FormSubmitObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formSubmitObserver.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formSubmitObserver.stop();
    }
    // Link interceptor delegate
    shouldInterceptLinkClick(element, _location, _event) {
      return this.#shouldRedirect(element);
    }
    linkClickIntercepted(element, url, event) {
      const frame = this.#findFrameElement(element);
      if (frame) {
        frame.delegate.linkClickIntercepted(element, url, event);
      }
    }
    // Form submit observer delegate
    willSubmitForm(element, submitter2) {
      return element.closest("turbo-frame") == null && this.#shouldSubmit(element, submitter2) && this.#shouldRedirect(element, submitter2);
    }
    formSubmitted(element, submitter2) {
      const frame = this.#findFrameElement(element, submitter2);
      if (frame) {
        frame.delegate.formSubmitted(element, submitter2);
      }
    }
    #shouldSubmit(form, submitter2) {
      const action = getAction$1(form, submitter2);
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const rootLocation = expandURL(meta?.content ?? "/");
      return this.#shouldRedirect(form, submitter2) && locationIsVisitable(action, rootLocation);
    }
    #shouldRedirect(element, submitter2) {
      const isNavigatable = element instanceof HTMLFormElement ? this.session.submissionIsNavigatable(element, submitter2) : this.session.elementIsNavigatable(element);
      if (isNavigatable) {
        const frame = this.#findFrameElement(element, submitter2);
        return frame ? frame != element.closest("turbo-frame") : false;
      } else {
        return false;
      }
    }
    #findFrameElement(element, submitter2) {
      const id3 = submitter2?.getAttribute("data-turbo-frame") || element.getAttribute("data-turbo-frame");
      if (id3 && id3 != "_top") {
        const frame = this.element.querySelector(`#${id3}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    location;
    restorationIdentifier = uuid();
    restorationData = {};
    started = false;
    pageLoaded = false;
    currentIndex = 0;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        addEventListener("load", this.onPageLoad, false);
        this.currentIndex = history.state?.turbo?.restorationIndex || 0;
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        removeEventListener("load", this.onPageLoad, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      if (method === history.pushState) ++this.currentIndex;
      const state = { turbo: { restorationIdentifier, restorationIndex: this.currentIndex } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    // Restoration data
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = {
        ...restorationData,
        ...additionalData
      };
    }
    // Scroll restoration
    assumeControlOfScrollRestoration() {
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = history.scrollRestoration ?? "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    // Event handlers
    onPopState = (event) => {
      if (this.shouldHandlePopState()) {
        const { turbo } = event.state || {};
        if (turbo) {
          this.location = new URL(window.location.href);
          const { restorationIdentifier, restorationIndex } = turbo;
          this.restorationIdentifier = restorationIdentifier;
          const direction = restorationIndex > this.currentIndex ? "forward" : "back";
          this.delegate.historyPoppedToLocationWithRestorationIdentifierAndDirection(this.location, restorationIdentifier, direction);
          this.currentIndex = restorationIndex;
        }
      }
    };
    onPageLoad = async (_event) => {
      await nextMicrotask();
      this.pageLoaded = true;
    };
    // Private
    shouldHandlePopState() {
      return this.pageIsLoaded();
    }
    pageIsLoaded() {
      return this.pageLoaded || document.readyState == "complete";
    }
  };
  var LinkPrefetchObserver = class {
    started = false;
    #prefetchedLink = null;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (this.started) return;
      if (this.eventTarget.readyState === "loading") {
        this.eventTarget.addEventListener("DOMContentLoaded", this.#enable, { once: true });
      } else {
        this.#enable();
      }
    }
    stop() {
      if (!this.started) return;
      this.eventTarget.removeEventListener("mouseenter", this.#tryToPrefetchRequest, {
        capture: true,
        passive: true
      });
      this.eventTarget.removeEventListener("mouseleave", this.#cancelRequestIfObsolete, {
        capture: true,
        passive: true
      });
      this.eventTarget.removeEventListener("turbo:before-fetch-request", this.#tryToUsePrefetchedRequest, true);
      this.started = false;
    }
    #enable = () => {
      this.eventTarget.addEventListener("mouseenter", this.#tryToPrefetchRequest, {
        capture: true,
        passive: true
      });
      this.eventTarget.addEventListener("mouseleave", this.#cancelRequestIfObsolete, {
        capture: true,
        passive: true
      });
      this.eventTarget.addEventListener("turbo:before-fetch-request", this.#tryToUsePrefetchedRequest, true);
      this.started = true;
    };
    #tryToPrefetchRequest = (event) => {
      if (getMetaContent("turbo-prefetch") === "false") return;
      const target = event.target;
      const isLink = target.matches && target.matches("a[href]:not([target^=_]):not([download])");
      if (isLink && this.#isPrefetchable(target)) {
        const link = target;
        const location2 = getLocationForLink(link);
        if (this.delegate.canPrefetchRequestToLocation(link, location2)) {
          this.#prefetchedLink = link;
          const fetchRequest = new FetchRequest(
            this,
            FetchMethod.get,
            location2,
            new URLSearchParams(),
            target
          );
          fetchRequest.fetchOptions.priority = "low";
          prefetchCache.setLater(location2.toString(), fetchRequest, this.#cacheTtl);
        }
      }
    };
    #cancelRequestIfObsolete = (event) => {
      if (event.target === this.#prefetchedLink) this.#cancelPrefetchRequest();
    };
    #cancelPrefetchRequest = () => {
      prefetchCache.clear();
      this.#prefetchedLink = null;
    };
    #tryToUsePrefetchedRequest = (event) => {
      if (event.target.tagName !== "FORM" && event.detail.fetchOptions.method === "GET") {
        const cached = prefetchCache.get(event.detail.url.toString());
        if (cached) {
          event.detail.fetchRequest = cached;
        }
        prefetchCache.clear();
      }
    };
    prepareRequest(request) {
      const link = request.target;
      request.headers["X-Sec-Purpose"] = "prefetch";
      const turboFrame = link.closest("turbo-frame");
      const turboFrameTarget = link.getAttribute("data-turbo-frame") || turboFrame?.getAttribute("target") || turboFrame?.id;
      if (turboFrameTarget && turboFrameTarget !== "_top") {
        request.headers["Turbo-Frame"] = turboFrameTarget;
      }
    }
    // Fetch request interface
    requestSucceededWithResponse() {
    }
    requestStarted(fetchRequest) {
    }
    requestErrored(fetchRequest) {
    }
    requestFinished(fetchRequest) {
    }
    requestPreventedHandlingResponse(fetchRequest, fetchResponse) {
    }
    requestFailedWithResponse(fetchRequest, fetchResponse) {
    }
    get #cacheTtl() {
      return Number(getMetaContent("turbo-prefetch-cache-time")) || cacheTtl;
    }
    #isPrefetchable(link) {
      const href = link.getAttribute("href");
      if (!href) return false;
      if (unfetchableLink(link)) return false;
      if (linkToTheSamePage(link)) return false;
      if (linkOptsOut(link)) return false;
      if (nonSafeLink(link)) return false;
      if (eventPrevented(link)) return false;
      return true;
    }
  };
  var unfetchableLink = (link) => {
    return link.origin !== document.location.origin || !["http:", "https:"].includes(link.protocol) || link.hasAttribute("target");
  };
  var linkToTheSamePage = (link) => {
    return link.pathname + link.search === document.location.pathname + document.location.search || link.href.startsWith("#");
  };
  var linkOptsOut = (link) => {
    if (link.getAttribute("data-turbo-prefetch") === "false") return true;
    if (link.getAttribute("data-turbo") === "false") return true;
    const turboPrefetchParent = findClosestRecursively(link, "[data-turbo-prefetch]");
    if (turboPrefetchParent && turboPrefetchParent.getAttribute("data-turbo-prefetch") === "false") return true;
    return false;
  };
  var nonSafeLink = (link) => {
    const turboMethod = link.getAttribute("data-turbo-method");
    if (turboMethod && turboMethod.toLowerCase() !== "get") return true;
    if (isUJS(link)) return true;
    if (link.hasAttribute("data-turbo-confirm")) return true;
    if (link.hasAttribute("data-turbo-stream")) return true;
    return false;
  };
  var isUJS = (link) => {
    return link.hasAttribute("data-remote") || link.hasAttribute("data-behavior") || link.hasAttribute("data-confirm") || link.hasAttribute("data-method");
  };
  var eventPrevented = (link) => {
    const event = dispatch("turbo:before-prefetch", { target: link, cancelable: true });
    return event.defaultPrevented;
  };
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options.action)) {
        this.delegate.visitProposedToLocation(location2, options);
      }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, {
        referrer: this.location,
        ...options
      });
      this.currentVisit.start();
    }
    submitForm(form, submitter2) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter2, true);
      this.formSubmission.start();
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get rootLocation() {
      return this.view.snapshot.rootLocation;
    }
    get history() {
      return this.delegate.history;
    }
    // Form submission delegate
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          const shouldCacheSnapshot = formSubmission.isSafe;
          if (!shouldCacheSnapshot) {
            this.view.clearSnapshotCache();
          }
          const { statusCode, redirected } = fetchResponse;
          const action = this.#getActionForFormSubmission(formSubmission, fetchResponse);
          const visitOptions = {
            action,
            shouldCacheSnapshot,
            response: { statusCode, responseHTML, redirected }
          };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot, this.currentVisit);
        } else {
          await this.view.renderPage(snapshot, false, true, this.currentVisit);
        }
        if (!snapshot.shouldPreserveScrollPosition) {
          this.view.scrollToTop();
        }
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    // Link prefetching
    linkPrefetchingIsEnabledForLocation(location2) {
      if (typeof this.adapter.linkPrefetchingIsEnabledForLocation === "function") {
        return this.adapter.linkPrefetchingIsEnabledForLocation(location2);
      }
      return true;
    }
    // Visit delegate
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
      delete this.currentVisit;
    }
    locationWithActionIsSamePage(location2, action) {
      const anchor = getAnchor(location2);
      const currentAnchor = getAnchor(this.view.lastRenderedLocation);
      const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
      return action !== "replace" && getRequestURL(location2) === getRequestURL(this.view.lastRenderedLocation) && (isRestorationToTop || anchor != null && anchor !== currentAnchor);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    // Visits
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    #getActionForFormSubmission(formSubmission, fetchResponse) {
      const { submitter: submitter2, formElement } = formSubmission;
      return getVisitAction(submitter2, formElement) || this.#getDefaultAction(fetchResponse);
    }
    #getDefaultAction(fetchResponse) {
      const sameLocationRedirect = fetchResponse.redirected && fetchResponse.location.href === this.location?.href;
      return sameLocationRedirect ? "replace" : "advance";
    }
  };
  var PageStage = {
    initial: 0,
    loading: 1,
    interactive: 2,
    complete: 3
  };
  var PageObserver = class {
    stage = PageStage.initial;
    started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    interpretReadyState = () => {
      const { readyState } = this;
      if (readyState == "interactive") {
        this.pageIsInteractive();
      } else if (readyState == "complete") {
        this.pageIsComplete();
      }
    };
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    pageWillUnload = () => {
      this.delegate.pageWillUnload();
    };
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    onScroll = () => {
      this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
    };
    // Private
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamMessageRenderer = class {
    render({ fragment }) {
      Bardo.preservingPermanentElements(this, getPermanentElementMapForFragment(fragment), () => {
        withAutofocusFromFragment(fragment, () => {
          withPreservedFocus(() => {
            document.documentElement.appendChild(fragment);
          });
        });
      });
    }
    // Bardo delegate
    enteringBardo(currentPermanentElement, newPermanentElement) {
      newPermanentElement.replaceWith(currentPermanentElement.cloneNode(true));
    }
    leavingBardo() {
    }
  };
  function getPermanentElementMapForFragment(fragment) {
    const permanentElementsInDocument = queryPermanentElementsAll(document.documentElement);
    const permanentElementMap = {};
    for (const permanentElementInDocument of permanentElementsInDocument) {
      const { id: id3 } = permanentElementInDocument;
      for (const streamElement of fragment.querySelectorAll("turbo-stream")) {
        const elementInStream = getPermanentElementById(streamElement.templateElement.content, id3);
        if (elementInStream) {
          permanentElementMap[id3] = [permanentElementInDocument, elementInStream];
        }
      }
    }
    return permanentElementMap;
  }
  async function withAutofocusFromFragment(fragment, callback) {
    const generatedID = `turbo-stream-autofocus-${uuid()}`;
    const turboStreams = fragment.querySelectorAll("turbo-stream");
    const elementWithAutofocus = firstAutofocusableElementInStreams(turboStreams);
    let willAutofocusId = null;
    if (elementWithAutofocus) {
      if (elementWithAutofocus.id) {
        willAutofocusId = elementWithAutofocus.id;
      } else {
        willAutofocusId = generatedID;
      }
      elementWithAutofocus.id = willAutofocusId;
    }
    callback();
    await nextRepaint();
    const hasNoActiveElement = document.activeElement == null || document.activeElement == document.body;
    if (hasNoActiveElement && willAutofocusId) {
      const elementToAutofocus = document.getElementById(willAutofocusId);
      if (elementIsFocusable(elementToAutofocus)) {
        elementToAutofocus.focus();
      }
      if (elementToAutofocus && elementToAutofocus.id == generatedID) {
        elementToAutofocus.removeAttribute("id");
      }
    }
  }
  async function withPreservedFocus(callback) {
    const [activeElementBeforeRender, activeElementAfterRender] = await around(callback, () => document.activeElement);
    const restoreFocusTo = activeElementBeforeRender && activeElementBeforeRender.id;
    if (restoreFocusTo) {
      const elementToFocus = document.getElementById(restoreFocusTo);
      if (elementIsFocusable(elementToFocus) && elementToFocus != activeElementAfterRender) {
        elementToFocus.focus();
      }
    }
  }
  function firstAutofocusableElementInStreams(nodeListOfStreamElements) {
    for (const streamElement of nodeListOfStreamElements) {
      const elementWithAutofocus = queryAutofocusableElement(streamElement.templateElement.content);
      if (elementWithAutofocus) return elementWithAutofocus;
    }
    return null;
  }
  var StreamObserver = class {
    sources = /* @__PURE__ */ new Set();
    #started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.#started) {
        this.#started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.#started) {
        this.#started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    inspectFetchResponse = (event) => {
      const response = fetchResponseFromEvent(event);
      if (response && fetchResponseIsStream(response)) {
        event.preventDefault();
        this.receiveMessageResponse(response);
      }
    };
    receiveMessageEvent = (event) => {
      if (this.#started && typeof event.data == "string") {
        this.receiveMessageHTML(event.data);
      }
    };
    async receiveMessageResponse(response) {
      const html = await response.responseHTML;
      if (html) {
        this.receiveMessageHTML(html);
      }
    }
    receiveMessageHTML(html) {
      this.delegate.receivedMessageFromStream(StreamMessage.wrap(html));
    }
  };
  function fetchResponseFromEvent(event) {
    const fetchResponse = event.detail?.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    const contentType = response.contentType ?? "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const { documentElement, body } = document;
      documentElement.replaceChild(newElement, body);
    }
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head } = document;
      documentElement.replaceChild(this.newHead, head);
      this.renderElement(this.currentElement, this.newElement);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode = replaceableElement.parentNode;
        if (parentNode) {
          const element = activateScriptElement(replaceableElement);
          parentNode.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return document.documentElement.querySelectorAll("script");
    }
  };
  var PageRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      if (document.body && newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(newElement);
      } else {
        document.documentElement.appendChild(newElement);
      }
    }
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    get reloadReason() {
      if (!this.newSnapshot.isVisitable) {
        return {
          reason: "turbo_visit_control_is_reload"
        };
      }
      if (!this.trackedElementsAreIdentical) {
        return {
          reason: "tracked_element_mismatch"
        };
      }
    }
    async prepareToRender() {
      this.#setLanguage();
      await this.mergeHead();
    }
    async render() {
      if (this.willRender) {
        await this.replaceBody();
      }
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    #setLanguage() {
      const { documentElement } = this.currentSnapshot;
      const { lang } = this.newSnapshot;
      if (lang) {
        documentElement.setAttribute("lang", lang);
      } else {
        documentElement.removeAttribute("lang");
      }
    }
    async mergeHead() {
      const mergedHeadElements = this.mergeProvisionalElements();
      const newStylesheetElements = this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      await mergedHeadElements;
      await newStylesheetElements;
      if (this.willRender) {
        this.removeUnusedDynamicStylesheetElements();
      }
    }
    async replaceBody() {
      await this.preservingPermanentElements(async () => {
        this.activateNewBody();
        await this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    async copyNewHeadStylesheetElements() {
      const loadingElements = [];
      for (const element of this.newHeadStylesheetElements) {
        loadingElements.push(waitForLoad(element));
        document.head.appendChild(element);
      }
      await Promise.all(loadingElements);
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(activateScriptElement(element));
      }
    }
    removeUnusedDynamicStylesheetElements() {
      for (const element of this.unusedDynamicStylesheetElements) {
        document.head.removeChild(element);
      }
    }
    async mergeProvisionalElements() {
      const newHeadElements = [...this.newHeadProvisionalElements];
      for (const element of this.currentHeadProvisionalElements) {
        if (!this.isCurrentElementInElementList(element, newHeadElements)) {
          document.head.removeChild(element);
        }
      }
      for (const element of newHeadElements) {
        document.head.appendChild(element);
      }
    }
    isCurrentElementInElementList(element, elementList) {
      for (const [index, newElement] of elementList.entries()) {
        if (element.tagName == "TITLE") {
          if (newElement.tagName != "TITLE") {
            continue;
          }
          if (element.innerHTML == newElement.innerHTML) {
            elementList.splice(index, 1);
            return true;
          }
        }
        if (newElement.isEqualNode(element)) {
          elementList.splice(index, 1);
          return true;
        }
      }
      return false;
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    async assignNewBody() {
      await this.renderElement(this.currentElement, this.newElement);
    }
    get unusedDynamicStylesheetElements() {
      return this.oldHeadStylesheetElements.filter((element) => {
        return element.getAttribute("data-turbo-track") === "dynamic";
      });
    }
    get oldHeadStylesheetElements() {
      return this.currentHeadSnapshot.getStylesheetElementsNotInSnapshot(this.newHeadSnapshot);
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var MorphingPageRenderer = class extends PageRenderer {
    static renderElement(currentElement, newElement) {
      morphElements(currentElement, newElement, {
        callbacks: {
          beforeNodeMorphed: (node, newNode) => {
            if (shouldRefreshFrameWithMorphing(node, newNode) && !closestFrameReloadableWithMorphing(node)) {
              node.reload();
              return false;
            }
            return true;
          }
        }
      });
      dispatch("turbo:morph", { detail: { currentElement, newElement } });
    }
    async preservingPermanentElements(callback) {
      return await callback();
    }
    get renderMethod() {
      return "morph";
    }
    get shouldAutofocus() {
      return false;
    }
  };
  var SnapshotCache = class {
    keys = [];
    snapshots = {};
    constructor(size) {
      this.size = size;
    }
    has(location2) {
      return toCacheKey(location2) in this.snapshots;
    }
    get(location2) {
      if (this.has(location2)) {
        const snapshot = this.read(location2);
        this.touch(location2);
        return snapshot;
      }
    }
    put(location2, snapshot) {
      this.write(location2, snapshot);
      this.touch(location2);
      return snapshot;
    }
    clear() {
      this.snapshots = {};
    }
    // Private
    read(location2) {
      return this.snapshots[toCacheKey(location2)];
    }
    write(location2, snapshot) {
      this.snapshots[toCacheKey(location2)] = snapshot;
    }
    touch(location2) {
      const key = toCacheKey(location2);
      const index = this.keys.indexOf(key);
      if (index > -1) this.keys.splice(index, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        delete this.snapshots[key];
      }
    }
  };
  var PageView = class extends View {
    snapshotCache = new SnapshotCache(10);
    lastRenderedLocation = new URL(location.href);
    forceReloaded = false;
    shouldTransitionTo(newSnapshot) {
      return this.snapshot.prefersViewTransitions && newSnapshot.prefersViewTransitions;
    }
    renderPage(snapshot, isPreview = false, willRender = true, visit2) {
      const shouldMorphPage = this.isPageRefresh(visit2) && this.snapshot.shouldMorphPage;
      const rendererClass = shouldMorphPage ? MorphingPageRenderer : PageRenderer;
      const renderer = new rendererClass(this.snapshot, snapshot, isPreview, willRender);
      if (!renderer.shouldRender) {
        this.forceReloaded = true;
      } else {
        visit2?.changeHistory();
      }
      return this.render(renderer);
    }
    renderError(snapshot, visit2) {
      visit2?.changeHistory();
      const renderer = new ErrorRenderer(this.snapshot, snapshot, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot(snapshot = this.snapshot) {
      if (snapshot.isCacheable) {
        this.delegate.viewWillCacheSnapshot();
        const { lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        const cachedSnapshot = snapshot.clone();
        this.snapshotCache.put(location2, cachedSnapshot);
        return cachedSnapshot;
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    isPageRefresh(visit2) {
      return !visit2 || this.lastRenderedLocation.pathname === visit2.location.pathname && visit2.action === "replace";
    }
    shouldPreserveScrollPosition(visit2) {
      return this.isPageRefresh(visit2) && this.snapshot.shouldPreserveScrollPosition;
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
  };
  var Preloader = class {
    selector = "a[data-turbo-preload]";
    constructor(delegate, snapshotCache) {
      this.delegate = delegate;
      this.snapshotCache = snapshotCache;
    }
    start() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", this.#preloadAll);
      } else {
        this.preloadOnLoadLinksForView(document.body);
      }
    }
    stop() {
      document.removeEventListener("DOMContentLoaded", this.#preloadAll);
    }
    preloadOnLoadLinksForView(element) {
      for (const link of element.querySelectorAll(this.selector)) {
        if (this.delegate.shouldPreloadLink(link)) {
          this.preloadURL(link);
        }
      }
    }
    async preloadURL(link) {
      const location2 = new URL(link.href);
      if (this.snapshotCache.has(location2)) {
        return;
      }
      const fetchRequest = new FetchRequest(this, FetchMethod.get, location2, new URLSearchParams(), link);
      await fetchRequest.perform();
    }
    // Fetch request delegate
    prepareRequest(fetchRequest) {
      fetchRequest.headers["X-Sec-Purpose"] = "prefetch";
    }
    async requestSucceededWithResponse(fetchRequest, fetchResponse) {
      try {
        const responseHTML = await fetchResponse.responseHTML;
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        this.snapshotCache.put(fetchRequest.url, snapshot);
      } catch (_2) {
      }
    }
    requestStarted(fetchRequest) {
    }
    requestErrored(fetchRequest) {
    }
    requestFinished(fetchRequest) {
    }
    requestPreventedHandlingResponse(fetchRequest, fetchResponse) {
    }
    requestFailedWithResponse(fetchRequest, fetchResponse) {
    }
    #preloadAll = () => {
      this.preloadOnLoadLinksForView(document.body);
    };
  };
  var Cache = class {
    constructor(session2) {
      this.session = session2;
    }
    clear() {
      this.session.clearCache();
    }
    resetCacheControl() {
      this.#setCacheControl("");
    }
    exemptPageFromCache() {
      this.#setCacheControl("no-cache");
    }
    exemptPageFromPreview() {
      this.#setCacheControl("no-preview");
    }
    #setCacheControl(value) {
      setMetaContent("turbo-cache-control", value);
    }
  };
  var Session = class {
    navigator = new Navigator(this);
    history = new History(this);
    view = new PageView(this, document.documentElement);
    adapter = new BrowserAdapter(this);
    pageObserver = new PageObserver(this);
    cacheObserver = new CacheObserver();
    linkPrefetchObserver = new LinkPrefetchObserver(this, document);
    linkClickObserver = new LinkClickObserver(this, window);
    formSubmitObserver = new FormSubmitObserver(this, document);
    scrollObserver = new ScrollObserver(this);
    streamObserver = new StreamObserver(this);
    formLinkClickObserver = new FormLinkClickObserver(this, document.documentElement);
    frameRedirector = new FrameRedirector(this, document.documentElement);
    streamMessageRenderer = new StreamMessageRenderer();
    cache = new Cache(this);
    enabled = true;
    started = false;
    #pageRefreshDebouncePeriod = 150;
    constructor(recentRequests2) {
      this.recentRequests = recentRequests2;
      this.preloader = new Preloader(this, this.view.snapshotCache);
      this.debouncedRefresh = this.refresh;
      this.pageRefreshDebouncePeriod = this.pageRefreshDebouncePeriod;
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.linkPrefetchObserver.start();
        this.formLinkClickObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.preloader.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.linkPrefetchObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.preloader.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options = {}) {
      const frameElement = options.frame ? document.getElementById(options.frame) : null;
      if (frameElement instanceof FrameElement) {
        const action = options.action || getVisitAction(frameElement);
        frameElement.delegate.proposeVisitIfNavigatedWithAction(frameElement, action);
        frameElement.src = location2.toString();
      } else {
        this.navigator.proposeVisit(expandURL(location2), options);
      }
    }
    refresh(url, requestId) {
      const isRecentRequest = requestId && this.recentRequests.has(requestId);
      const isCurrentUrl = url === document.baseURI;
      if (!isRecentRequest && !this.navigator.currentVisit && isCurrentUrl) {
        this.visit(url, { action: "replace", shouldCacheSnapshot: false });
      }
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      this.streamMessageRenderer.render(StreamMessage.wrap(message));
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      console.warn(
        "Please replace `session.setProgressBarDelay(delay)` with `session.progressBarDelay = delay`. The function is deprecated and will be removed in a future version of Turbo.`"
      );
      this.progressBarDelay = delay;
    }
    set progressBarDelay(delay) {
      config.drive.progressBarDelay = delay;
    }
    get progressBarDelay() {
      return config.drive.progressBarDelay;
    }
    set drive(value) {
      config.drive.enabled = value;
    }
    get drive() {
      return config.drive.enabled;
    }
    set formMode(value) {
      config.forms.mode = value;
    }
    get formMode() {
      return config.forms.mode;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    get pageRefreshDebouncePeriod() {
      return this.#pageRefreshDebouncePeriod;
    }
    set pageRefreshDebouncePeriod(value) {
      this.refresh = debounce(this.debouncedRefresh.bind(this), value);
      this.#pageRefreshDebouncePeriod = value;
    }
    // Preloader delegate
    shouldPreloadLink(element) {
      const isUnsafe = element.hasAttribute("data-turbo-method");
      const isStream = element.hasAttribute("data-turbo-stream");
      const frameTarget = element.getAttribute("data-turbo-frame");
      const frame = frameTarget == "_top" ? null : document.getElementById(frameTarget) || findClosestRecursively(element, "turbo-frame:not([disabled])");
      if (isUnsafe || isStream || frame instanceof FrameElement) {
        return false;
      } else {
        const location2 = new URL(element.href);
        return this.elementIsNavigatable(element) && locationIsVisitable(location2, this.snapshot.rootLocation);
      }
    }
    // History delegate
    historyPoppedToLocationWithRestorationIdentifierAndDirection(location2, restorationIdentifier, direction) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, {
          action: "restore",
          historyChanged: true,
          direction
        });
      } else {
        this.adapter.pageInvalidated({
          reason: "turbo_disabled"
        });
      }
    }
    // Scroll observer delegate
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    // Form click observer delegate
    willSubmitFormLinkToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation);
    }
    submittedFormLinkToLocation() {
    }
    // Link hover observer delegate
    canPrefetchRequestToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.navigator.linkPrefetchingIsEnabledForLocation(location2);
    }
    // Link click observer delegate
    willFollowLinkToLocation(link, location2, event) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(link, location2, event);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      const acceptsStreamResponse = link.hasAttribute("data-turbo-stream");
      this.visit(location2.href, { action, acceptsStreamResponse });
    }
    // Navigator delegate
    allowsVisitingLocationWithAction(location2, action) {
      return this.locationWithActionIsSamePage(location2, action) || this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options);
    }
    // Visit delegate
    visitStarted(visit2) {
      if (!visit2.acceptsStreamResponse) {
        markAsBusy(document.documentElement);
        this.view.markVisitDirection(visit2.direction);
      }
      extendURLWithDeprecatedProperties(visit2.location);
      if (!visit2.silent) {
        this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
      }
    }
    visitCompleted(visit2) {
      this.view.unmarkVisitDirection();
      clearBusyState(document.documentElement);
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    locationWithActionIsSamePage(location2, action) {
      return this.navigator.locationWithActionIsSamePage(location2, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    // Form submit observer delegate
    willSubmitForm(form, submitter2) {
      const action = getAction$1(form, submitter2);
      return this.submissionIsNavigatable(form, submitter2) && locationIsVisitable(expandURL(action), this.snapshot.rootLocation);
    }
    formSubmitted(form, submitter2) {
      this.navigator.submitForm(form, submitter2);
    }
    // Page observer delegate
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    // Stream observer delegate
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    // Page view delegate
    viewWillCacheSnapshot() {
      if (!this.navigator.currentVisit?.silent) {
        this.notifyApplicationBeforeCachingSnapshot();
      }
    }
    allowsImmediateRender({ element }, options) {
      const event = this.notifyApplicationBeforeRender(element, options);
      const {
        defaultPrevented,
        detail: { render }
      } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview, renderMethod) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender(renderMethod);
    }
    preloadOnLoadLinksForView(element) {
      this.preloader.preloadOnLoadLinksForView(element);
    }
    viewInvalidated(reason) {
      this.adapter.pageInvalidated(reason);
    }
    // Frame element
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    // Application events
    applicationAllowsFollowingLinkToLocation(link, location2, ev) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2, ev);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2, event) {
      return dispatch("turbo:click", {
        target: link,
        detail: { url: location2.href, originalEvent: event },
        cancelable: true
      });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", {
        detail: { url: location2.href },
        cancelable: true
      });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, options) {
      return dispatch("turbo:before-render", {
        detail: { newBody, ...options },
        cancelable: true
      });
    }
    notifyApplicationAfterRender(renderMethod) {
      return dispatch("turbo:render", { detail: { renderMethod } });
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      return dispatch("turbo:load", {
        detail: { url: this.location.href, timing }
      });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
      dispatchEvent(
        new HashChangeEvent("hashchange", {
          oldURL: oldURL.toString(),
          newURL: newURL.toString()
        })
      );
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", {
        detail: { fetchResponse },
        target: frame,
        cancelable: true
      });
    }
    // Helpers
    submissionIsNavigatable(form, submitter2) {
      if (config.forms.mode == "off") {
        return false;
      } else {
        const submitterIsNavigatable = submitter2 ? this.elementIsNavigatable(submitter2) : true;
        if (config.forms.mode == "optin") {
          return submitterIsNavigatable && form.closest('[data-turbo="true"]') != null;
        } else {
          return submitterIsNavigatable && this.elementIsNavigatable(form);
        }
      }
    }
    elementIsNavigatable(element) {
      const container = findClosestRecursively(element, "[data-turbo]");
      const withinFrame = findClosestRecursively(element, "turbo-frame");
      if (config.drive.enabled || withinFrame) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    // Private
    getActionForLink(link) {
      return getVisitAction(link) || "advance";
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var session = new Session(recentRequests);
  var { cache, navigator: navigator$1 } = session;
  function start2() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options) {
    session.visit(location2, options);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function clearCache() {
    console.warn(
      "Please replace `Turbo.clearCache()` with `Turbo.cache.clear()`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    session.clearCache();
  }
  function setProgressBarDelay(delay) {
    console.warn(
      "Please replace `Turbo.setProgressBarDelay(delay)` with `Turbo.config.drive.progressBarDelay = delay`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    config.drive.progressBarDelay = delay;
  }
  function setConfirmMethod(confirmMethod) {
    console.warn(
      "Please replace `Turbo.setConfirmMethod(confirmMethod)` with `Turbo.config.forms.confirm = confirmMethod`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    config.forms.confirm = confirmMethod;
  }
  function setFormMode(mode) {
    console.warn(
      "Please replace `Turbo.setFormMode(mode)` with `Turbo.config.forms.mode = mode`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    config.forms.mode = mode;
  }
  function morphBodyElements(currentBody, newBody) {
    MorphingPageRenderer.renderElement(currentBody, newBody);
  }
  function morphTurboFrameElements(currentFrame, newFrame) {
    MorphingFrameRenderer.renderElement(currentFrame, newFrame);
  }
  var Turbo = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session,
    cache,
    PageRenderer,
    PageSnapshot,
    FrameRenderer,
    fetch: fetchWithTurboHeaders,
    config,
    start: start2,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    clearCache,
    setProgressBarDelay,
    setConfirmMethod,
    setFormMode,
    morphBodyElements,
    morphTurboFrameElements,
    morphChildren,
    morphElements
  });
  var TurboFrameMissingError = class extends Error {
  };
  var FrameController = class {
    fetchResponseLoaded = (_fetchResponse) => Promise.resolve();
    #currentFetchRequest = null;
    #resolveVisitPromise = () => {
    };
    #connected = false;
    #hasBeenLoaded = false;
    #ignoredAttributes = /* @__PURE__ */ new Set();
    #shouldMorphFrame = false;
    action = null;
    constructor(element) {
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.formLinkClickObserver = new FormLinkClickObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.restorationIdentifier = uuid();
      this.formSubmitObserver = new FormSubmitObserver(this, this.element);
    }
    // Frame delegate
    connect() {
      if (!this.#connected) {
        this.#connected = true;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        } else {
          this.#loadSourceURL();
        }
        this.formLinkClickObserver.start();
        this.linkInterceptor.start();
        this.formSubmitObserver.start();
      }
    }
    disconnect() {
      if (this.#connected) {
        this.#connected = false;
        this.appearanceObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkInterceptor.stop();
        this.formSubmitObserver.stop();
      }
    }
    disabledChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.#loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.#isIgnoringChangesTo("src")) return;
      if (this.element.isConnected) {
        this.complete = false;
      }
      if (this.loadingStyle == FrameLoadingStyle.eager || this.#hasBeenLoaded) {
        this.#loadSourceURL();
      }
    }
    sourceURLReloaded() {
      const { refresh, src } = this.element;
      this.#shouldMorphFrame = src && refresh === "morph";
      this.element.removeAttribute("complete");
      this.element.src = null;
      this.element.src = src;
      return this.element.loaded;
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.#loadSourceURL();
      }
    }
    async #loadSourceURL() {
      if (this.enabled && this.isActive && !this.complete && this.sourceURL) {
        this.element.loaded = this.#visit(expandURL(this.sourceURL));
        this.appearanceObserver.stop();
        await this.element.loaded;
        this.#hasBeenLoaded = true;
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected || fetchResponse.succeeded && fetchResponse.isHTML) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html = await fetchResponse.responseHTML;
        if (html) {
          const document2 = parseHTMLDocument(html);
          const pageSnapshot = PageSnapshot.fromDocument(document2);
          if (pageSnapshot.isVisitable) {
            await this.#loadFrameResponse(fetchResponse, document2);
          } else {
            await this.#handleUnvisitableFrameResponse(fetchResponse);
          }
        }
      } finally {
        this.#shouldMorphFrame = false;
        this.fetchResponseLoaded = () => Promise.resolve();
      }
    }
    // Appearance observer delegate
    elementAppearedInViewport(element) {
      this.proposeVisitIfNavigatedWithAction(element, getVisitAction(element));
      this.#loadSourceURL();
    }
    // Form link click observer delegate
    willSubmitFormLinkToLocation(link) {
      return this.#shouldInterceptNavigation(link);
    }
    submittedFormLinkToLocation(link, _location, form) {
      const frame = this.#findFrameElement(link);
      if (frame) form.setAttribute("data-turbo-frame", frame.id);
    }
    // Link interceptor delegate
    shouldInterceptLinkClick(element, _location, _event) {
      return this.#shouldInterceptNavigation(element);
    }
    linkClickIntercepted(element, location2) {
      this.#navigateFrame(element, location2);
    }
    // Form submit observer delegate
    willSubmitForm(element, submitter2) {
      return element.closest("turbo-frame") == this.element && this.#shouldInterceptNavigation(element, submitter2);
    }
    formSubmitted(element, submitter2) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.formSubmission = new FormSubmission(this, element, submitter2);
      const { fetchRequest } = this.formSubmission;
      this.prepareRequest(fetchRequest);
      this.formSubmission.start();
    }
    // Fetch request delegate
    prepareRequest(request) {
      request.headers["Turbo-Frame"] = this.id;
      if (this.currentNavigationElement?.hasAttribute("data-turbo-stream")) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(_request, _response) {
      this.#resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
      await this.loadResponse(response);
      this.#resolveVisitPromise();
    }
    async requestFailedWithResponse(request, response) {
      await this.loadResponse(response);
      this.#resolveVisitPromise();
    }
    requestErrored(request, error2) {
      console.error(error2);
      this.#resolveVisitPromise();
    }
    requestFinished(_request) {
      clearBusyState(this.element);
    }
    // Form submission delegate
    formSubmissionStarted({ formElement }) {
      markAsBusy(formElement, this.#findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.#findFrameElement(formSubmission.formElement, formSubmission.submitter);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, getVisitAction(formSubmission.submitter, formSubmission.formElement, frame));
      frame.delegate.loadResponse(response);
      if (!formSubmission.isSafe) {
        session.clearCache();
      }
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
      session.clearCache();
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished({ formElement }) {
      clearBusyState(formElement, this.#findFrameElement(formElement));
    }
    // View delegate
    allowsImmediateRender({ element: newFrame }, options) {
      const event = dispatch("turbo:before-frame-render", {
        target: this.element,
        detail: { newFrame, ...options },
        cancelable: true
      });
      const {
        defaultPrevented,
        detail: { render }
      } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview, _renderMethod) {
    }
    preloadOnLoadLinksForView(element) {
      session.preloadOnLoadLinksForView(element);
    }
    viewInvalidated() {
    }
    // Frame renderer delegate
    willRenderFrame(currentElement, _newElement) {
      this.previousFrameElement = currentElement.cloneNode(true);
    }
    visitCachedSnapshot = ({ element }) => {
      const frame = element.querySelector("#" + this.element.id);
      if (frame && this.previousFrameElement) {
        frame.replaceChildren(...this.previousFrameElement.children);
      }
      delete this.previousFrameElement;
    };
    // Private
    async #loadFrameResponse(fetchResponse, document2) {
      const newFrameElement = await this.extractForeignFrameElement(document2.body);
      const rendererClass = this.#shouldMorphFrame ? MorphingFrameRenderer : FrameRenderer;
      if (newFrameElement) {
        const snapshot = new Snapshot(newFrameElement);
        const renderer = new rendererClass(this, this.view.snapshot, snapshot, false, false);
        if (this.view.renderPromise) await this.view.renderPromise;
        this.changeHistory();
        await this.view.render(renderer);
        this.complete = true;
        session.frameRendered(fetchResponse, this.element);
        session.frameLoaded(this.element);
        await this.fetchResponseLoaded(fetchResponse);
      } else if (this.#willHandleFrameMissingFromResponse(fetchResponse)) {
        this.#handleFrameMissingFromResponse(fetchResponse);
      }
    }
    async #visit(url) {
      const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
      this.#currentFetchRequest?.cancel();
      this.#currentFetchRequest = request;
      return new Promise((resolve) => {
        this.#resolveVisitPromise = () => {
          this.#resolveVisitPromise = () => {
          };
          this.#currentFetchRequest = null;
          resolve();
        };
        request.perform();
      });
    }
    #navigateFrame(element, url, submitter2) {
      const frame = this.#findFrameElement(element, submitter2);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, getVisitAction(submitter2, element, frame));
      this.#withCurrentNavigationElement(element, () => {
        frame.src = url;
      });
    }
    proposeVisitIfNavigatedWithAction(frame, action = null) {
      this.action = action;
      if (this.action) {
        const pageSnapshot = PageSnapshot.fromElement(frame).clone();
        const { visitCachedSnapshot } = frame.delegate;
        frame.delegate.fetchResponseLoaded = async (fetchResponse) => {
          if (frame.src) {
            const { statusCode, redirected } = fetchResponse;
            const responseHTML = await fetchResponse.responseHTML;
            const response = { statusCode, redirected, responseHTML };
            const options = {
              response,
              visitCachedSnapshot,
              willRender: false,
              updateHistory: false,
              restorationIdentifier: this.restorationIdentifier,
              snapshot: pageSnapshot
            };
            if (this.action) options.action = this.action;
            session.visit(frame.src, options);
          }
        };
      }
    }
    changeHistory() {
      if (this.action) {
        const method = getHistoryMethodForAction(this.action);
        session.history.update(method, expandURL(this.element.src || ""), this.restorationIdentifier);
      }
    }
    async #handleUnvisitableFrameResponse(fetchResponse) {
      console.warn(
        `The response (${fetchResponse.statusCode}) from <turbo-frame id="${this.element.id}"> is performing a full page visit due to turbo-visit-control.`
      );
      await this.#visitResponse(fetchResponse.response);
    }
    #willHandleFrameMissingFromResponse(fetchResponse) {
      this.element.setAttribute("complete", "");
      const response = fetchResponse.response;
      const visit2 = async (url, options) => {
        if (url instanceof Response) {
          this.#visitResponse(url);
        } else {
          session.visit(url, options);
        }
      };
      const event = dispatch("turbo:frame-missing", {
        target: this.element,
        detail: { response, visit: visit2 },
        cancelable: true
      });
      return !event.defaultPrevented;
    }
    #handleFrameMissingFromResponse(fetchResponse) {
      this.view.missing();
      this.#throwFrameMissingError(fetchResponse);
    }
    #throwFrameMissingError(fetchResponse) {
      const message = `The response (${fetchResponse.statusCode}) did not contain the expected <turbo-frame id="${this.element.id}"> and will be ignored. To perform a full page visit instead, set turbo-visit-control to reload.`;
      throw new TurboFrameMissingError(message);
    }
    async #visitResponse(response) {
      const wrapped = new FetchResponse(response);
      const responseHTML = await wrapped.responseHTML;
      const { location: location2, redirected, statusCode } = wrapped;
      return session.visit(location2, { response: { redirected, statusCode, responseHTML } });
    }
    #findFrameElement(element, submitter2) {
      const id3 = getAttribute("data-turbo-frame", submitter2, element) || this.element.getAttribute("target");
      return getFrameElementById(id3) ?? this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id3 = CSS.escape(this.id);
      try {
        element = activateElement(container.querySelector(`turbo-frame#${id3}`), this.sourceURL);
        if (element) {
          return element;
        }
        element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id3}]`), this.sourceURL);
        if (element) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
      } catch (error2) {
        console.error(error2);
        return new FrameElement();
      }
      return null;
    }
    #formActionIsVisitable(form, submitter2) {
      const action = getAction$1(form, submitter2);
      return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    #shouldInterceptNavigation(element, submitter2) {
      const id3 = getAttribute("data-turbo-frame", submitter2, element) || this.element.getAttribute("target");
      if (element instanceof HTMLFormElement && !this.#formActionIsVisitable(element, submitter2)) {
        return false;
      }
      if (!this.enabled || id3 == "_top") {
        return false;
      }
      if (id3) {
        const frameElement = getFrameElementById(id3);
        if (frameElement) {
          return !frameElement.disabled;
        }
      }
      if (!session.elementIsNavigatable(element)) {
        return false;
      }
      if (submitter2 && !session.elementIsNavigatable(submitter2)) {
        return false;
      }
      return true;
    }
    // Computed properties
    get id() {
      return this.element.id;
    }
    get enabled() {
      return !this.element.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    set sourceURL(sourceURL) {
      this.#ignoringChangesToAttribute("src", () => {
        this.element.src = sourceURL ?? null;
      });
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.#resolveVisitPromise() !== void 0;
    }
    get complete() {
      return this.element.hasAttribute("complete");
    }
    set complete(value) {
      if (value) {
        this.element.setAttribute("complete", "");
      } else {
        this.element.removeAttribute("complete");
      }
    }
    get isActive() {
      return this.element.isActive && this.#connected;
    }
    get rootLocation() {
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const root = meta?.content ?? "/";
      return expandURL(root);
    }
    #isIgnoringChangesTo(attributeName) {
      return this.#ignoredAttributes.has(attributeName);
    }
    #ignoringChangesToAttribute(attributeName, callback) {
      this.#ignoredAttributes.add(attributeName);
      callback();
      this.#ignoredAttributes.delete(attributeName);
    }
    #withCurrentNavigationElement(element, callback) {
      this.currentNavigationElement = element;
      callback();
      delete this.currentNavigationElement;
    }
  };
  function getFrameElementById(id3) {
    if (id3 != null) {
      const element = document.getElementById(id3);
      if (element instanceof FrameElement) {
        return element;
      }
    }
  }
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        element.disconnectedCallback();
        return element;
      }
    }
  }
  var StreamActions = {
    after() {
      this.targetElements.forEach((e2) => e2.parentElement?.insertBefore(this.templateContent, e2.nextSibling));
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e2) => e2.append(this.templateContent));
    },
    before() {
      this.targetElements.forEach((e2) => e2.parentElement?.insertBefore(this.templateContent, e2));
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e2) => e2.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e2) => e2.remove());
    },
    replace() {
      const method = this.getAttribute("method");
      this.targetElements.forEach((targetElement) => {
        if (method === "morph") {
          morphElements(targetElement, this.templateContent);
        } else {
          targetElement.replaceWith(this.templateContent);
        }
      });
    },
    update() {
      const method = this.getAttribute("method");
      this.targetElements.forEach((targetElement) => {
        if (method === "morph") {
          morphChildren(targetElement, this.templateContent);
        } else {
          targetElement.innerHTML = "";
          targetElement.append(this.templateContent);
        }
      });
    },
    refresh() {
      session.refresh(this.baseURI, this.requestId);
    }
  };
  var StreamElement = class _StreamElement extends HTMLElement {
    static async renderElement(newElement) {
      await newElement.performAction();
    }
    async connectedCallback() {
      try {
        await this.render();
      } catch (error2) {
        console.error(error2);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      return this.renderPromise ??= (async () => {
        const event = this.beforeRenderEvent;
        if (this.dispatchEvent(event)) {
          await nextRepaint();
          await event.detail.render(this);
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch {
      }
    }
    /**
     * Removes duplicate children (by ID)
     */
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c2) => c2.remove());
    }
    /**
     * Gets the list of duplicate children (i.e. those with the same ID)
     */
    get duplicateChildren() {
      const existingChildren = this.targetElements.flatMap((e2) => [...e2.children]).filter((c2) => !!c2.getAttribute("id"));
      const newChildrenIds = [...this.templateContent?.children || []].filter((c2) => !!c2.getAttribute("id")).map((c2) => c2.getAttribute("id"));
      return existingChildren.filter((c2) => newChildrenIds.includes(c2.getAttribute("id")));
    }
    /**
     * Gets the action function to be performed.
     */
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.#raise("unknown action");
      }
      this.#raise("action attribute is missing");
    }
    /**
     * Gets the target elements which the template will be rendered to.
     */
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.#raise("target or targets attribute is missing");
      }
    }
    /**
     * Gets the contents of the main `<template>`.
     */
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    /**
     * Gets the main `<template>` used for rendering
     */
    get templateElement() {
      if (this.firstElementChild === null) {
        const template = this.ownerDocument.createElement("template");
        this.appendChild(template);
        return template;
      } else if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.#raise("first child element must be a <template> element");
    }
    /**
     * Gets the current action.
     */
    get action() {
      return this.getAttribute("action");
    }
    /**
     * Gets the current target (an element ID) to which the result will
     * be rendered.
     */
    get target() {
      return this.getAttribute("target");
    }
    /**
     * Gets the current "targets" selector (a CSS selector)
     */
    get targets() {
      return this.getAttribute("targets");
    }
    /**
     * Reads the request-id attribute
     */
    get requestId() {
      return this.getAttribute("request-id");
    }
    #raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      return (this.outerHTML.match(/<[^>]+>/) ?? [])[0] ?? "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", {
        bubbles: true,
        cancelable: true,
        detail: { newStream: this, render: _StreamElement.renderElement }
      });
    }
    get targetElementsById() {
      const element = this.ownerDocument?.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      const elements = this.ownerDocument?.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  var StreamSourceElement = class extends HTMLElement {
    streamSource = null;
    connectedCallback() {
      this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src);
      connectStreamSource(this.streamSource);
    }
    disconnectedCallback() {
      if (this.streamSource) {
        this.streamSource.close();
        disconnectStreamSource(this.streamSource);
      }
    }
    get src() {
      return this.getAttribute("src") || "";
    }
  };
  FrameElement.delegateConstructor = FrameController;
  if (customElements.get("turbo-frame") === void 0) {
    customElements.define("turbo-frame", FrameElement);
  }
  if (customElements.get("turbo-stream") === void 0) {
    customElements.define("turbo-stream", StreamElement);
  }
  if (customElements.get("turbo-stream-source") === void 0) {
    customElements.define("turbo-stream-source", StreamSourceElement);
  }
  (() => {
    let element = document.currentScript;
    if (!element) return;
    if (element.hasAttribute("data-turbo-suppress-warning")) return;
    element = element.parentElement;
    while (element) {
      if (element == document.body) {
        return console.warn(
          unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `,
          element.outerHTML
        );
      }
      element = element.parentElement;
    }
  })();
  window.Turbo = { ...Turbo, StreamActions };
  start2();

  // ../../node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable.js
  var consumer;
  async function getConsumer() {
    return consumer || setConsumer(createConsumer2().then(setConsumer));
  }
  function setConsumer(newConsumer) {
    return consumer = newConsumer;
  }
  async function createConsumer2() {
    const { createConsumer: createConsumer3 } = await Promise.resolve().then(() => (init_src(), src_exports));
    return createConsumer3();
  }
  async function subscribeTo(channel, mixin) {
    const { subscriptions } = await getConsumer();
    return subscriptions.create(channel, mixin);
  }

  // ../../node_modules/@hotwired/turbo-rails/app/javascript/turbo/snakeize.js
  function walk(obj) {
    if (!obj || typeof obj !== "object") return obj;
    if (obj instanceof Date || obj instanceof RegExp) return obj;
    if (Array.isArray(obj)) return obj.map(walk);
    return Object.keys(obj).reduce(function(acc, key) {
      var camel = key[0].toLowerCase() + key.slice(1).replace(/([A-Z]+)/g, function(m2, x2) {
        return "_" + x2.toLowerCase();
      });
      acc[camel] = walk(obj[key]);
      return acc;
    }, {});
  }

  // ../../node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable_stream_source_element.js
  var TurboCableStreamSourceElement = class extends HTMLElement {
    static observedAttributes = ["channel", "signed-stream-name"];
    async connectedCallback() {
      connectStreamSource(this);
      this.subscription = await subscribeTo(this.channel, {
        received: this.dispatchMessageEvent.bind(this),
        connected: this.subscriptionConnected.bind(this),
        disconnected: this.subscriptionDisconnected.bind(this)
      });
    }
    disconnectedCallback() {
      disconnectStreamSource(this);
      if (this.subscription) this.subscription.unsubscribe();
      this.subscriptionDisconnected();
    }
    attributeChangedCallback() {
      if (this.subscription) {
        this.disconnectedCallback();
        this.connectedCallback();
      }
    }
    dispatchMessageEvent(data) {
      const event = new MessageEvent("message", { data });
      return this.dispatchEvent(event);
    }
    subscriptionConnected() {
      this.setAttribute("connected", "");
    }
    subscriptionDisconnected() {
      this.removeAttribute("connected");
    }
    get channel() {
      const channel = this.getAttribute("channel");
      const signed_stream_name = this.getAttribute("signed-stream-name");
      return { channel, signed_stream_name, ...walk({ ...this.dataset }) };
    }
  };
  if (customElements.get("turbo-cable-stream-source") === void 0) {
    customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement);
  }

  // ../../node_modules/@hotwired/turbo-rails/app/javascript/turbo/fetch_requests.js
  function encodeMethodIntoRequestBody(event) {
    if (event.target instanceof HTMLFormElement) {
      const { target: form, detail: { fetchOptions } } = event;
      form.addEventListener("turbo:submit-start", ({ detail: { formSubmission: { submitter: submitter2 } } }) => {
        const body = isBodyInit(fetchOptions.body) ? fetchOptions.body : new URLSearchParams();
        const method = determineFetchMethod(submitter2, body, form);
        if (!/get/i.test(method)) {
          if (/post/i.test(method)) {
            body.delete("_method");
          } else {
            body.set("_method", method);
          }
          fetchOptions.method = "post";
        }
      }, { once: true });
    }
  }
  function determineFetchMethod(submitter2, body, form) {
    const formMethod = determineFormMethod(submitter2);
    const overrideMethod = body.get("_method");
    const method = form.getAttribute("method") || "get";
    if (typeof formMethod == "string") {
      return formMethod;
    } else if (typeof overrideMethod == "string") {
      return overrideMethod;
    } else {
      return method;
    }
  }
  function determineFormMethod(submitter2) {
    if (submitter2 instanceof HTMLButtonElement || submitter2 instanceof HTMLInputElement) {
      if (submitter2.name === "_method") {
        return submitter2.value;
      } else if (submitter2.hasAttribute("formmethod")) {
        return submitter2.formMethod;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  function isBodyInit(body) {
    return body instanceof FormData || body instanceof URLSearchParams;
  }

  // ../../node_modules/@hotwired/turbo-rails/app/javascript/turbo/index.js
  window.Turbo = turbo_es2017_esm_exports;
  addEventListener("turbo:before-fetch-request", encodeMethodIntoRequestBody);

  // ../../node_modules/trix/dist/trix.esm.min.js
  var t = "2.1.15";
  var e = "[data-trix-attachment]";
  var i = { preview: { presentation: "gallery", caption: { name: true, size: true } }, file: { caption: { size: true } } };
  var n = { default: { tagName: "div", parse: false }, quote: { tagName: "blockquote", nestable: true }, heading1: { tagName: "h1", terminal: true, breakOnReturn: true, group: false }, code: { tagName: "pre", terminal: true, htmlAttributes: ["language"], text: { plaintext: true } }, bulletList: { tagName: "ul", parse: false }, bullet: { tagName: "li", listAttribute: "bulletList", group: false, nestable: true, test(t3) {
    return r(t3.parentNode) === n[this.listAttribute].tagName;
  } }, numberList: { tagName: "ol", parse: false }, number: { tagName: "li", listAttribute: "numberList", group: false, nestable: true, test(t3) {
    return r(t3.parentNode) === n[this.listAttribute].tagName;
  } }, attachmentGallery: { tagName: "div", exclusive: true, terminal: true, parse: false, group: false } };
  var r = (t3) => {
    var e2;
    return null == t3 || null === (e2 = t3.tagName) || void 0 === e2 ? void 0 : e2.toLowerCase();
  };
  var o = navigator.userAgent.match(/android\s([0-9]+.*Chrome)/i);
  var s = o && parseInt(o[1]);
  var a = { composesExistingText: /Android.*Chrome/.test(navigator.userAgent), recentAndroid: s && s > 12, samsungAndroid: s && navigator.userAgent.match(/Android.*SM-/), forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent), supportsInputEvents: "undefined" != typeof InputEvent && ["data", "getTargetRanges", "inputType"].every(((t3) => t3 in InputEvent.prototype)) };
  var l = { ADD_ATTR: ["language"], SAFE_FOR_XML: false, RETURN_DOM: true };
  var c = { attachFiles: "Attach Files", bold: "Bold", bullets: "Bullets", byte: "Byte", bytes: "Bytes", captionPlaceholder: "Add a caption\u2026", code: "Code", heading1: "Heading", indent: "Increase Level", italic: "Italic", link: "Link", numbers: "Numbers", outdent: "Decrease Level", quote: "Quote", redo: "Redo", remove: "Remove", strike: "Strikethrough", undo: "Undo", unlink: "Unlink", url: "URL", urlPlaceholder: "Enter a URL\u2026", GB: "GB", KB: "KB", MB: "MB", PB: "PB", TB: "TB" };
  var u = [c.bytes, c.KB, c.MB, c.GB, c.TB, c.PB];
  var h = { prefix: "IEC", precision: 2, formatter(t3) {
    switch (t3) {
      case 0:
        return "0 ".concat(c.bytes);
      case 1:
        return "1 ".concat(c.byte);
      default:
        let e2;
        "SI" === this.prefix ? e2 = 1e3 : "IEC" === this.prefix && (e2 = 1024);
        const i2 = Math.floor(Math.log(t3) / Math.log(e2)), n2 = (t3 / Math.pow(e2, i2)).toFixed(this.precision).replace(/0*$/, "").replace(/\.$/, "");
        return "".concat(n2, " ").concat(u[i2]);
    }
  } };
  var d = "\uFEFF";
  var g = "\xA0";
  var m = function(t3) {
    for (const e2 in t3) {
      const i2 = t3[e2];
      this[e2] = i2;
    }
    return this;
  };
  var p = document.documentElement;
  var f = p.matches;
  var b = function(t3) {
    let { onElement: e2, matchingSelector: i2, withCallback: n2, inPhase: r3, preventDefault: o2, times: s2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    const a2 = e2 || p, l3 = i2, c2 = "capturing" === r3, u2 = function(t4) {
      null != s2 && 0 == --s2 && u2.destroy();
      const e3 = y(t4.target, { matchingSelector: l3 });
      null != e3 && (null == n2 || n2.call(e3, t4, e3), o2 && t4.preventDefault());
    };
    return u2.destroy = () => a2.removeEventListener(t3, u2, c2), a2.addEventListener(t3, u2, c2), u2;
  };
  var v = function(t3) {
    let { onElement: e2, bubbles: i2, cancelable: n2, attributes: r3 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    const o2 = null != e2 ? e2 : p;
    i2 = false !== i2, n2 = false !== n2;
    const s2 = document.createEvent("Events");
    return s2.initEvent(t3, i2, n2), null != r3 && m.call(s2, r3), o2.dispatchEvent(s2);
  };
  var A = function(t3, e2) {
    if (1 === (null == t3 ? void 0 : t3.nodeType)) return f.call(t3, e2);
  };
  var y = function(t3) {
    let { matchingSelector: e2, untilNode: i2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    for (; t3 && t3.nodeType !== Node.ELEMENT_NODE; ) t3 = t3.parentNode;
    if (null != t3) {
      if (null == e2) return t3;
      if (t3.closest && null == i2) return t3.closest(e2);
      for (; t3 && t3 !== i2; ) {
        if (A(t3, e2)) return t3;
        t3 = t3.parentNode;
      }
    }
  };
  var x = (t3) => document.activeElement !== t3 && C(t3, document.activeElement);
  var C = function(t3, e2) {
    if (t3 && e2) for (; e2; ) {
      if (e2 === t3) return true;
      e2 = e2.parentNode;
    }
  };
  var E = function(t3) {
    var e2;
    if (null === (e2 = t3) || void 0 === e2 || !e2.parentNode) return;
    let i2 = 0;
    for (t3 = t3.previousSibling; t3; ) i2++, t3 = t3.previousSibling;
    return i2;
  };
  var S = (t3) => {
    var e2;
    return null == t3 || null === (e2 = t3.parentNode) || void 0 === e2 ? void 0 : e2.removeChild(t3);
  };
  var R = function(t3) {
    let { onlyNodesOfType: e2, usingFilter: i2, expandEntityReferences: n2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    const r3 = (() => {
      switch (e2) {
        case "element":
          return NodeFilter.SHOW_ELEMENT;
        case "text":
          return NodeFilter.SHOW_TEXT;
        case "comment":
          return NodeFilter.SHOW_COMMENT;
        default:
          return NodeFilter.SHOW_ALL;
      }
    })();
    return document.createTreeWalker(t3, r3, null != i2 ? i2 : null, true === n2);
  };
  var k = (t3) => {
    var e2;
    return null == t3 || null === (e2 = t3.tagName) || void 0 === e2 ? void 0 : e2.toLowerCase();
  };
  var T = function(t3) {
    let e2, i2, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    "object" == typeof t3 ? (n2 = t3, t3 = n2.tagName) : n2 = { attributes: n2 };
    const r3 = document.createElement(t3);
    if (null != n2.editable && (null == n2.attributes && (n2.attributes = {}), n2.attributes.contenteditable = n2.editable), n2.attributes) for (e2 in n2.attributes) i2 = n2.attributes[e2], r3.setAttribute(e2, i2);
    if (n2.style) for (e2 in n2.style) i2 = n2.style[e2], r3.style[e2] = i2;
    if (n2.data) for (e2 in n2.data) i2 = n2.data[e2], r3.dataset[e2] = i2;
    return n2.className && n2.className.split(" ").forEach(((t4) => {
      r3.classList.add(t4);
    })), n2.textContent && (r3.textContent = n2.textContent), n2.childNodes && [].concat(n2.childNodes).forEach(((t4) => {
      r3.appendChild(t4);
    })), r3;
  };
  var w;
  var L = function() {
    if (null != w) return w;
    w = [];
    for (const t3 in n) {
      const e2 = n[t3];
      e2.tagName && w.push(e2.tagName);
    }
    return w;
  };
  var D = (t3) => I(null == t3 ? void 0 : t3.firstChild);
  var N = function(t3) {
    let { strict: e2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { strict: true };
    return e2 ? I(t3) : I(t3) || !I(t3.firstChild) && (function(t4) {
      return L().includes(k(t4)) && !L().includes(k(t4.firstChild));
    })(t3);
  };
  var I = (t3) => O(t3) && "block" === (null == t3 ? void 0 : t3.data);
  var O = (t3) => (null == t3 ? void 0 : t3.nodeType) === Node.COMMENT_NODE;
  var F = function(t3) {
    let { name: e2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    if (t3) return B(t3) ? t3.data === d ? !e2 || t3.parentNode.dataset.trixCursorTarget === e2 : void 0 : F(t3.firstChild);
  };
  var P = (t3) => A(t3, e);
  var M = (t3) => B(t3) && "" === (null == t3 ? void 0 : t3.data);
  var B = (t3) => (null == t3 ? void 0 : t3.nodeType) === Node.TEXT_NODE;
  var _ = { level2Enabled: true, getLevel() {
    return this.level2Enabled && a.supportsInputEvents ? 2 : 0;
  }, pickFiles(t3) {
    const e2 = T("input", { type: "file", multiple: true, hidden: true, id: this.fileInputId });
    e2.addEventListener("change", (() => {
      t3(e2.files), S(e2);
    })), S(document.getElementById(this.fileInputId)), document.body.appendChild(e2), e2.click();
  } };
  var j = { removeBlankTableCells: false, tableCellSeparator: " | ", tableRowSeparator: "\n" };
  var W = { bold: { tagName: "strong", inheritable: true, parser(t3) {
    const e2 = window.getComputedStyle(t3);
    return "bold" === e2.fontWeight || e2.fontWeight >= 600;
  } }, italic: { tagName: "em", inheritable: true, parser: (t3) => "italic" === window.getComputedStyle(t3).fontStyle }, href: { groupTagName: "a", parser(t3) {
    const i2 = "a:not(".concat(e, ")"), n2 = t3.closest(i2);
    if (n2) return n2.getAttribute("href");
  } }, strike: { tagName: "del", inheritable: true }, frozen: { style: { backgroundColor: "highlight" } } };
  var U = { getDefaultHTML: () => '<div class="trix-button-row">\n      <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="'.concat(c.bold, '" tabindex="-1">').concat(c.bold, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="').concat(c.italic, '" tabindex="-1">').concat(c.italic, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="').concat(c.strike, '" tabindex="-1">').concat(c.strike, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="').concat(c.link, '" tabindex="-1">').concat(c.link, '</button>\n      </span>\n\n      <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="').concat(c.heading1, '" tabindex="-1">').concat(c.heading1, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="').concat(c.quote, '" tabindex="-1">').concat(c.quote, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="').concat(c.code, '" tabindex="-1">').concat(c.code, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="').concat(c.bullets, '" tabindex="-1">').concat(c.bullets, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="').concat(c.numbers, '" tabindex="-1">').concat(c.numbers, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="').concat(c.outdent, '" tabindex="-1">').concat(c.outdent, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="').concat(c.indent, '" tabindex="-1">').concat(c.indent, '</button>\n      </span>\n\n      <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="').concat(c.attachFiles, '" tabindex="-1">').concat(c.attachFiles, '</button>\n      </span>\n\n      <span class="trix-button-group-spacer"></span>\n\n      <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="').concat(c.undo, '" tabindex="-1">').concat(c.undo, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="').concat(c.redo, '" tabindex="-1">').concat(c.redo, '</button>\n      </span>\n    </div>\n\n    <div class="trix-dialogs" data-trix-dialogs>\n      <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">\n        <div class="trix-dialog__link-fields">\n          <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="').concat(c.urlPlaceholder, '" aria-label="').concat(c.url, '" data-trix-validate-href required data-trix-input>\n          <div class="trix-button-group">\n            <input type="button" class="trix-button trix-button--dialog" value="').concat(c.link, '" data-trix-method="setAttribute">\n            <input type="button" class="trix-button trix-button--dialog" value="').concat(c.unlink, '" data-trix-method="removeAttribute">\n          </div>\n        </div>\n      </div>\n    </div>') };
  var V = { interval: 5e3 };
  var z = Object.freeze({ __proto__: null, attachments: i, blockAttributes: n, browser: a, css: { attachment: "attachment", attachmentCaption: "attachment__caption", attachmentCaptionEditor: "attachment__caption-editor", attachmentMetadata: "attachment__metadata", attachmentMetadataContainer: "attachment__metadata-container", attachmentName: "attachment__name", attachmentProgress: "attachment__progress", attachmentSize: "attachment__size", attachmentToolbar: "attachment__toolbar", attachmentGallery: "attachment-gallery" }, dompurify: l, fileSize: h, input: _, keyNames: { 8: "backspace", 9: "tab", 13: "return", 27: "escape", 37: "left", 39: "right", 46: "delete", 68: "d", 72: "h", 79: "o" }, lang: c, parser: j, textAttributes: W, toolbar: U, undo: V });
  var q = class {
    static proxyMethod(t3) {
      const { name: e2, toMethod: i2, toProperty: n2, optional: r3 } = H(t3);
      this.prototype[e2] = function() {
        let t4, o2;
        var s2, a2;
        i2 ? o2 = r3 ? null === (s2 = this[i2]) || void 0 === s2 ? void 0 : s2.call(this) : this[i2]() : n2 && (o2 = this[n2]);
        return r3 ? (t4 = null === (a2 = o2) || void 0 === a2 ? void 0 : a2[e2], t4 ? J.call(t4, o2, arguments) : void 0) : (t4 = o2[e2], J.call(t4, o2, arguments));
      };
    }
  };
  var H = function(t3) {
    const e2 = t3.match(K);
    if (!e2) throw new Error("can't parse @proxyMethod expression: ".concat(t3));
    const i2 = { name: e2[4] };
    return null != e2[2] ? i2.toMethod = e2[1] : i2.toProperty = e2[1], null != e2[3] && (i2.optional = true), i2;
  };
  var { apply: J } = Function.prototype;
  var K = new RegExp("^(.+?)(\\(\\))?(\\?)?\\.(.+?)$");
  var G;
  var Y;
  var X;
  var $ = class extends q {
    static box() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
      return t3 instanceof this ? t3 : this.fromUCS2String(null == t3 ? void 0 : t3.toString());
    }
    static fromUCS2String(t3) {
      return new this(t3, et(t3));
    }
    static fromCodepoints(t3) {
      return new this(it(t3), t3);
    }
    constructor(t3, e2) {
      super(...arguments), this.ucs2String = t3, this.codepoints = e2, this.length = this.codepoints.length, this.ucs2Length = this.ucs2String.length;
    }
    offsetToUCS2Offset(t3) {
      return it(this.codepoints.slice(0, Math.max(0, t3))).length;
    }
    offsetFromUCS2Offset(t3) {
      return et(this.ucs2String.slice(0, Math.max(0, t3))).length;
    }
    slice() {
      return this.constructor.fromCodepoints(this.codepoints.slice(...arguments));
    }
    charAt(t3) {
      return this.slice(t3, t3 + 1);
    }
    isEqualTo(t3) {
      return this.constructor.box(t3).ucs2String === this.ucs2String;
    }
    toJSON() {
      return this.ucs2String;
    }
    getCacheKey() {
      return this.ucs2String;
    }
    toString() {
      return this.ucs2String;
    }
  };
  var Z = 1 === (null === (G = Array.from) || void 0 === G ? void 0 : G.call(Array, "\u{1F47C}").length);
  var Q = null != (null === (Y = " ".codePointAt) || void 0 === Y ? void 0 : Y.call(" ", 0));
  var tt = " \u{1F47C}" === (null === (X = String.fromCodePoint) || void 0 === X ? void 0 : X.call(String, 32, 128124));
  var et;
  var it;
  et = Z && Q ? (t3) => Array.from(t3).map(((t4) => t4.codePointAt(0))) : function(t3) {
    const e2 = [];
    let i2 = 0;
    const { length: n2 } = t3;
    for (; i2 < n2; ) {
      let r3 = t3.charCodeAt(i2++);
      if (55296 <= r3 && r3 <= 56319 && i2 < n2) {
        const e3 = t3.charCodeAt(i2++);
        56320 == (64512 & e3) ? r3 = ((1023 & r3) << 10) + (1023 & e3) + 65536 : i2--;
      }
      e2.push(r3);
    }
    return e2;
  }, it = tt ? (t3) => String.fromCodePoint(...Array.from(t3 || [])) : function(t3) {
    return (() => {
      const e2 = [];
      return Array.from(t3).forEach(((t4) => {
        let i2 = "";
        t4 > 65535 && (t4 -= 65536, i2 += String.fromCharCode(t4 >>> 10 & 1023 | 55296), t4 = 56320 | 1023 & t4), e2.push(i2 + String.fromCharCode(t4));
      })), e2;
    })().join("");
  };
  var nt = 0;
  var rt = class extends q {
    static fromJSONString(t3) {
      return this.fromJSON(JSON.parse(t3));
    }
    constructor() {
      super(...arguments), this.id = ++nt;
    }
    hasSameConstructorAs(t3) {
      return this.constructor === (null == t3 ? void 0 : t3.constructor);
    }
    isEqualTo(t3) {
      return this === t3;
    }
    inspect() {
      const t3 = [], e2 = this.contentsForInspection() || {};
      for (const i2 in e2) {
        const n2 = e2[i2];
        t3.push("".concat(i2, "=").concat(n2));
      }
      return "#<".concat(this.constructor.name, ":").concat(this.id).concat(t3.length ? " ".concat(t3.join(", ")) : "", ">");
    }
    contentsForInspection() {
    }
    toJSONString() {
      return JSON.stringify(this);
    }
    toUTF16String() {
      return $.box(this);
    }
    getCacheKey() {
      return this.id.toString();
    }
  };
  var ot = function() {
    let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
    if (t3.length !== e2.length) return false;
    for (let i2 = 0; i2 < t3.length; i2++) {
      if (t3[i2] !== e2[i2]) return false;
    }
    return true;
  };
  var st = function(t3) {
    const e2 = t3.slice(0);
    for (var i2 = arguments.length, n2 = new Array(i2 > 1 ? i2 - 1 : 0), r3 = 1; r3 < i2; r3++) n2[r3 - 1] = arguments[r3];
    return e2.splice(...n2), e2;
  };
  var at = /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/;
  var lt = (function() {
    const t3 = T("input", { dir: "auto", name: "x", dirName: "x.dir" }), e2 = T("textarea", { dir: "auto", name: "y", dirName: "y.dir" }), i2 = T("form");
    i2.appendChild(t3), i2.appendChild(e2);
    const n2 = (function() {
      try {
        return new FormData(i2).has(e2.dirName);
      } catch (t4) {
        return false;
      }
    })(), r3 = (function() {
      try {
        return t3.matches(":dir(ltr),:dir(rtl)");
      } catch (t4) {
        return false;
      }
    })();
    return n2 ? function(t4) {
      return e2.value = t4, new FormData(i2).get(e2.dirName);
    } : r3 ? function(e3) {
      return t3.value = e3, t3.matches(":dir(rtl)") ? "rtl" : "ltr";
    } : function(t4) {
      const e3 = t4.trim().charAt(0);
      return at.test(e3) ? "rtl" : "ltr";
    };
  })();
  var ct = null;
  var ut = null;
  var ht = null;
  var dt = null;
  var gt = () => (ct || (ct = bt().concat(pt())), ct);
  var mt = (t3) => n[t3];
  var pt = () => (ut || (ut = Object.keys(n)), ut);
  var ft = (t3) => W[t3];
  var bt = () => (ht || (ht = Object.keys(W)), ht);
  var vt = function(t3, e2) {
    At(t3).textContent = e2.replace(/%t/g, t3);
  };
  var At = function(t3) {
    const e2 = document.createElement("style");
    e2.setAttribute("type", "text/css"), e2.setAttribute("data-tag-name", t3.toLowerCase());
    const i2 = yt();
    return i2 && e2.setAttribute("nonce", i2), document.head.insertBefore(e2, document.head.firstChild), e2;
  };
  var yt = function() {
    const t3 = xt("trix-csp-nonce") || xt("csp-nonce");
    if (t3) {
      const { nonce: e2, content: i2 } = t3;
      return "" == e2 ? i2 : e2;
    }
  };
  var xt = (t3) => document.head.querySelector("meta[name=".concat(t3, "]"));
  var Ct = { "application/x-trix-feature-detection": "test" };
  var Et = function(t3) {
    const e2 = t3.getData("text/plain"), i2 = t3.getData("text/html");
    if (!e2 || !i2) return null == e2 ? void 0 : e2.length;
    {
      const { body: t4 } = new DOMParser().parseFromString(i2, "text/html");
      if (t4.textContent === e2) return !t4.querySelector("*");
    }
  };
  var St = /Mac|^iP/.test(navigator.platform) ? (t3) => t3.metaKey : (t3) => t3.ctrlKey;
  var Rt = (t3) => setTimeout(t3, 1);
  var kt = function() {
    let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    const e2 = {};
    for (const i2 in t3) {
      const n2 = t3[i2];
      e2[i2] = n2;
    }
    return e2;
  };
  var Tt = function() {
    let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    if (Object.keys(t3).length !== Object.keys(e2).length) return false;
    for (const i2 in t3) {
      if (t3[i2] !== e2[i2]) return false;
    }
    return true;
  };
  var wt = function(t3) {
    if (null != t3) return Array.isArray(t3) || (t3 = [t3, t3]), [Nt(t3[0]), Nt(null != t3[1] ? t3[1] : t3[0])];
  };
  var Lt = function(t3) {
    if (null == t3) return;
    const [e2, i2] = wt(t3);
    return It(e2, i2);
  };
  var Dt = function(t3, e2) {
    if (null == t3 || null == e2) return;
    const [i2, n2] = wt(t3), [r3, o2] = wt(e2);
    return It(i2, r3) && It(n2, o2);
  };
  var Nt = function(t3) {
    return "number" == typeof t3 ? t3 : kt(t3);
  };
  var It = function(t3, e2) {
    return "number" == typeof t3 ? t3 === e2 : Tt(t3, e2);
  };
  var Ot = class extends q {
    constructor() {
      super(...arguments), this.update = this.update.bind(this), this.selectionManagers = [];
    }
    start() {
      this.started || (this.started = true, document.addEventListener("selectionchange", this.update, true));
    }
    stop() {
      if (this.started) return this.started = false, document.removeEventListener("selectionchange", this.update, true);
    }
    registerSelectionManager(t3) {
      if (!this.selectionManagers.includes(t3)) return this.selectionManagers.push(t3), this.start();
    }
    unregisterSelectionManager(t3) {
      if (this.selectionManagers = this.selectionManagers.filter(((e2) => e2 !== t3)), 0 === this.selectionManagers.length) return this.stop();
    }
    notifySelectionManagersOfSelectionChange() {
      return this.selectionManagers.map(((t3) => t3.selectionDidChange()));
    }
    update() {
      this.notifySelectionManagersOfSelectionChange();
    }
    reset() {
      this.update();
    }
  };
  var Ft = new Ot();
  var Pt = function() {
    const t3 = window.getSelection();
    if (t3.rangeCount > 0) return t3;
  };
  var Mt = function() {
    var t3;
    const e2 = null === (t3 = Pt()) || void 0 === t3 ? void 0 : t3.getRangeAt(0);
    if (e2 && !_t(e2)) return e2;
  };
  var Bt = function(t3) {
    const e2 = window.getSelection();
    return e2.removeAllRanges(), e2.addRange(t3), Ft.update();
  };
  var _t = (t3) => jt(t3.startContainer) || jt(t3.endContainer);
  var jt = (t3) => !Object.getPrototypeOf(t3);
  var Wt = (t3) => t3.replace(new RegExp("".concat(d), "g"), "").replace(new RegExp("".concat(g), "g"), " ");
  var Ut = new RegExp("[^\\S".concat(g, "]"));
  var Vt = (t3) => t3.replace(new RegExp("".concat(Ut.source), "g"), " ").replace(/\ {2,}/g, " ");
  var zt = function(t3, e2) {
    if (t3.isEqualTo(e2)) return ["", ""];
    const i2 = qt(t3, e2), { length: n2 } = i2.utf16String;
    let r3;
    if (n2) {
      const { offset: o2 } = i2, s2 = t3.codepoints.slice(0, o2).concat(t3.codepoints.slice(o2 + n2));
      r3 = qt(e2, $.fromCodepoints(s2));
    } else r3 = qt(e2, t3);
    return [i2.utf16String.toString(), r3.utf16String.toString()];
  };
  var qt = function(t3, e2) {
    let i2 = 0, n2 = t3.length, r3 = e2.length;
    for (; i2 < n2 && t3.charAt(i2).isEqualTo(e2.charAt(i2)); ) i2++;
    for (; n2 > i2 + 1 && t3.charAt(n2 - 1).isEqualTo(e2.charAt(r3 - 1)); ) n2--, r3--;
    return { utf16String: t3.slice(i2, n2), offset: i2 };
  };
  var Ht = class _Ht extends rt {
    static fromCommonAttributesOfObjects() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
      if (!t3.length) return new this();
      let e2 = Yt(t3[0]), i2 = e2.getKeys();
      return t3.slice(1).forEach(((t4) => {
        i2 = e2.getKeysCommonToHash(Yt(t4)), e2 = e2.slice(i2);
      })), e2;
    }
    static box(t3) {
      return Yt(t3);
    }
    constructor() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      super(...arguments), this.values = Gt(t3);
    }
    add(t3, e2) {
      return this.merge(Jt(t3, e2));
    }
    remove(t3) {
      return new _Ht(Gt(this.values, t3));
    }
    get(t3) {
      return this.values[t3];
    }
    has(t3) {
      return t3 in this.values;
    }
    merge(t3) {
      return new _Ht(Kt(this.values, Xt(t3)));
    }
    slice(t3) {
      const e2 = {};
      return Array.from(t3).forEach(((t4) => {
        this.has(t4) && (e2[t4] = this.values[t4]);
      })), new _Ht(e2);
    }
    getKeys() {
      return Object.keys(this.values);
    }
    getKeysCommonToHash(t3) {
      return t3 = Yt(t3), this.getKeys().filter(((e2) => this.values[e2] === t3.values[e2]));
    }
    isEqualTo(t3) {
      return ot(this.toArray(), Yt(t3).toArray());
    }
    isEmpty() {
      return 0 === this.getKeys().length;
    }
    toArray() {
      if (!this.array) {
        const t3 = [];
        for (const e2 in this.values) {
          const i2 = this.values[e2];
          t3.push(t3.push(e2, i2));
        }
        this.array = t3.slice(0);
      }
      return this.array;
    }
    toObject() {
      return Gt(this.values);
    }
    toJSON() {
      return this.toObject();
    }
    contentsForInspection() {
      return { values: JSON.stringify(this.values) };
    }
  };
  var Jt = function(t3, e2) {
    const i2 = {};
    return i2[t3] = e2, i2;
  };
  var Kt = function(t3, e2) {
    const i2 = Gt(t3);
    for (const t4 in e2) {
      const n2 = e2[t4];
      i2[t4] = n2;
    }
    return i2;
  };
  var Gt = function(t3, e2) {
    const i2 = {};
    return Object.keys(t3).sort().forEach(((n2) => {
      n2 !== e2 && (i2[n2] = t3[n2]);
    })), i2;
  };
  var Yt = function(t3) {
    return t3 instanceof Ht ? t3 : new Ht(t3);
  };
  var Xt = function(t3) {
    return t3 instanceof Ht ? t3.values : t3;
  };
  var $t = class {
    static groupObjects() {
      let t3, e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], { depth: i2, asTree: n2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      n2 && null == i2 && (i2 = 0);
      const r3 = [];
      return Array.from(e2).forEach(((e3) => {
        var o2;
        if (t3) {
          var s2, a2, l3;
          if (null !== (s2 = e3.canBeGrouped) && void 0 !== s2 && s2.call(e3, i2) && null !== (a2 = (l3 = t3[t3.length - 1]).canBeGroupedWith) && void 0 !== a2 && a2.call(l3, e3, i2)) return void t3.push(e3);
          r3.push(new this(t3, { depth: i2, asTree: n2 })), t3 = null;
        }
        null !== (o2 = e3.canBeGrouped) && void 0 !== o2 && o2.call(e3, i2) ? t3 = [e3] : r3.push(e3);
      })), t3 && r3.push(new this(t3, { depth: i2, asTree: n2 })), r3;
    }
    constructor() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], { depth: e2, asTree: i2 } = arguments.length > 1 ? arguments[1] : void 0;
      this.objects = t3, i2 && (this.depth = e2, this.objects = this.constructor.groupObjects(this.objects, { asTree: i2, depth: this.depth + 1 }));
    }
    getObjects() {
      return this.objects;
    }
    getDepth() {
      return this.depth;
    }
    getCacheKey() {
      const t3 = ["objectGroup"];
      return Array.from(this.getObjects()).forEach(((e2) => {
        t3.push(e2.getCacheKey());
      })), t3.join("/");
    }
  };
  var Zt = class extends q {
    constructor() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
      super(...arguments), this.objects = {}, Array.from(t3).forEach(((t4) => {
        const e2 = JSON.stringify(t4);
        null == this.objects[e2] && (this.objects[e2] = t4);
      }));
    }
    find(t3) {
      const e2 = JSON.stringify(t3);
      return this.objects[e2];
    }
  };
  var Qt = class {
    constructor(t3) {
      this.reset(t3);
    }
    add(t3) {
      const e2 = te(t3);
      this.elements[e2] = t3;
    }
    remove(t3) {
      const e2 = te(t3), i2 = this.elements[e2];
      if (i2) return delete this.elements[e2], i2;
    }
    reset() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
      return this.elements = {}, Array.from(t3).forEach(((t4) => {
        this.add(t4);
      })), t3;
    }
  };
  var te = (t3) => t3.dataset.trixStoreKey;
  var ee = class extends q {
    isPerforming() {
      return true === this.performing;
    }
    hasPerformed() {
      return true === this.performed;
    }
    hasSucceeded() {
      return this.performed && this.succeeded;
    }
    hasFailed() {
      return this.performed && !this.succeeded;
    }
    getPromise() {
      return this.promise || (this.promise = new Promise(((t3, e2) => (this.performing = true, this.perform(((i2, n2) => {
        this.succeeded = i2, this.performing = false, this.performed = true, this.succeeded ? t3(n2) : e2(n2);
      })))))), this.promise;
    }
    perform(t3) {
      return t3(false);
    }
    release() {
      var t3, e2;
      null === (t3 = this.promise) || void 0 === t3 || null === (e2 = t3.cancel) || void 0 === e2 || e2.call(t3), this.promise = null, this.performing = null, this.performed = null, this.succeeded = null;
    }
  };
  ee.proxyMethod("getPromise().then"), ee.proxyMethod("getPromise().catch");
  var ie = class extends q {
    constructor(t3) {
      let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      super(...arguments), this.object = t3, this.options = e2, this.childViews = [], this.rootView = this;
    }
    getNodes() {
      return this.nodes || (this.nodes = this.createNodes()), this.nodes.map(((t3) => t3.cloneNode(true)));
    }
    invalidate() {
      var t3;
      return this.nodes = null, this.childViews = [], null === (t3 = this.parentView) || void 0 === t3 ? void 0 : t3.invalidate();
    }
    invalidateViewForObject(t3) {
      var e2;
      return null === (e2 = this.findViewForObject(t3)) || void 0 === e2 ? void 0 : e2.invalidate();
    }
    findOrCreateCachedChildView(t3, e2, i2) {
      let n2 = this.getCachedViewForObject(e2);
      return n2 ? this.recordChildView(n2) : (n2 = this.createChildView(...arguments), this.cacheViewForObject(n2, e2)), n2;
    }
    createChildView(t3, e2) {
      let i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      e2 instanceof $t && (i2.viewClass = t3, t3 = ne);
      const n2 = new t3(e2, i2);
      return this.recordChildView(n2);
    }
    recordChildView(t3) {
      return t3.parentView = this, t3.rootView = this.rootView, this.childViews.push(t3), t3;
    }
    getAllChildViews() {
      let t3 = [];
      return this.childViews.forEach(((e2) => {
        t3.push(e2), t3 = t3.concat(e2.getAllChildViews());
      })), t3;
    }
    findElement() {
      return this.findElementForObject(this.object);
    }
    findElementForObject(t3) {
      const e2 = null == t3 ? void 0 : t3.id;
      if (e2) return this.rootView.element.querySelector("[data-trix-id='".concat(e2, "']"));
    }
    findViewForObject(t3) {
      for (const e2 of this.getAllChildViews()) if (e2.object === t3) return e2;
    }
    getViewCache() {
      return this.rootView !== this ? this.rootView.getViewCache() : this.isViewCachingEnabled() ? (this.viewCache || (this.viewCache = {}), this.viewCache) : void 0;
    }
    isViewCachingEnabled() {
      return false !== this.shouldCacheViews;
    }
    enableViewCaching() {
      this.shouldCacheViews = true;
    }
    disableViewCaching() {
      this.shouldCacheViews = false;
    }
    getCachedViewForObject(t3) {
      var e2;
      return null === (e2 = this.getViewCache()) || void 0 === e2 ? void 0 : e2[t3.getCacheKey()];
    }
    cacheViewForObject(t3, e2) {
      const i2 = this.getViewCache();
      i2 && (i2[e2.getCacheKey()] = t3);
    }
    garbageCollectCachedViews() {
      const t3 = this.getViewCache();
      if (t3) {
        const e2 = this.getAllChildViews().concat(this).map(((t4) => t4.object.getCacheKey()));
        for (const i2 in t3) e2.includes(i2) || delete t3[i2];
      }
    }
  };
  var ne = class extends ie {
    constructor() {
      super(...arguments), this.objectGroup = this.object, this.viewClass = this.options.viewClass, delete this.options.viewClass;
    }
    getChildViews() {
      return this.childViews.length || Array.from(this.objectGroup.getObjects()).forEach(((t3) => {
        this.findOrCreateCachedChildView(this.viewClass, t3, this.options);
      })), this.childViews;
    }
    createNodes() {
      const t3 = this.createContainerElement();
      return this.getChildViews().forEach(((e2) => {
        Array.from(e2.getNodes()).forEach(((e3) => {
          t3.appendChild(e3);
        }));
      })), [t3];
    }
    createContainerElement() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.objectGroup.getDepth();
      return this.getChildViews()[0].createContainerElement(t3);
    }
  };
  var { entries: re, setPrototypeOf: oe, isFrozen: se, getPrototypeOf: ae, getOwnPropertyDescriptor: le } = Object;
  var { freeze: ce, seal: ue, create: he } = Object;
  var { apply: de, construct: ge } = "undefined" != typeof Reflect && Reflect;
  ce || (ce = function(t3) {
    return t3;
  }), ue || (ue = function(t3) {
    return t3;
  }), de || (de = function(t3, e2, i2) {
    return t3.apply(e2, i2);
  }), ge || (ge = function(t3, e2) {
    return new t3(...e2);
  });
  var me = Le(Array.prototype.forEach);
  var pe = Le(Array.prototype.lastIndexOf);
  var fe = Le(Array.prototype.pop);
  var be = Le(Array.prototype.push);
  var ve = Le(Array.prototype.splice);
  var Ae = Le(String.prototype.toLowerCase);
  var ye = Le(String.prototype.toString);
  var xe = Le(String.prototype.match);
  var Ce = Le(String.prototype.replace);
  var Ee = Le(String.prototype.indexOf);
  var Se = Le(String.prototype.trim);
  var Re = Le(Object.prototype.hasOwnProperty);
  var ke = Le(RegExp.prototype.test);
  var Te = (we = TypeError, function() {
    for (var t3 = arguments.length, e2 = new Array(t3), i2 = 0; i2 < t3; i2++) e2[i2] = arguments[i2];
    return ge(we, e2);
  });
  var we;
  function Le(t3) {
    return function(e2) {
      e2 instanceof RegExp && (e2.lastIndex = 0);
      for (var i2 = arguments.length, n2 = new Array(i2 > 1 ? i2 - 1 : 0), r3 = 1; r3 < i2; r3++) n2[r3 - 1] = arguments[r3];
      return de(t3, e2, n2);
    };
  }
  function De(t3, e2) {
    let i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Ae;
    oe && oe(t3, null);
    let n2 = e2.length;
    for (; n2--; ) {
      let r3 = e2[n2];
      if ("string" == typeof r3) {
        const t4 = i2(r3);
        t4 !== r3 && (se(e2) || (e2[n2] = t4), r3 = t4);
      }
      t3[r3] = true;
    }
    return t3;
  }
  function Ne(t3) {
    for (let e2 = 0; e2 < t3.length; e2++) {
      Re(t3, e2) || (t3[e2] = null);
    }
    return t3;
  }
  function Ie(t3) {
    const e2 = he(null);
    for (const [i2, n2] of re(t3)) {
      Re(t3, i2) && (Array.isArray(n2) ? e2[i2] = Ne(n2) : n2 && "object" == typeof n2 && n2.constructor === Object ? e2[i2] = Ie(n2) : e2[i2] = n2);
    }
    return e2;
  }
  function Oe(t3, e2) {
    for (; null !== t3; ) {
      const i2 = le(t3, e2);
      if (i2) {
        if (i2.get) return Le(i2.get);
        if ("function" == typeof i2.value) return Le(i2.value);
      }
      t3 = ae(t3);
    }
    return function() {
      return null;
    };
  }
  var Fe = ce(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
  var Pe = ce(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
  var Me = ce(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
  var Be = ce(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
  var _e = ce(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
  var je = ce(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
  var We = ce(["#text"]);
  var Ue = ce(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
  var Ve = ce(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
  var ze = ce(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
  var qe = ce(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
  var He = ue(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
  var Je = ue(/<%[\w\W]*|[\w\W]*%>/gm);
  var Ke = ue(/\$\{[\w\W]*/gm);
  var Ge = ue(/^data-[\-\w.\u00B7-\uFFFF]+$/);
  var Ye = ue(/^aria-[\-\w]+$/);
  var Xe = ue(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
  var $e = ue(/^(?:\w+script|data):/i);
  var Ze = ue(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
  var Qe = ue(/^html$/i);
  var ti = ue(/^[a-z][.\w]*(-[.\w]+)+$/i);
  var ei = Object.freeze({ __proto__: null, ARIA_ATTR: Ye, ATTR_WHITESPACE: Ze, CUSTOM_ELEMENT: ti, DATA_ATTR: Ge, DOCTYPE_NAME: Qe, ERB_EXPR: Je, IS_ALLOWED_URI: Xe, IS_SCRIPT_OR_DATA: $e, MUSTACHE_EXPR: He, TMPLIT_EXPR: Ke });
  var ii = 1;
  var ni = 3;
  var ri = 7;
  var oi = 8;
  var si = 9;
  var ai = function() {
    return "undefined" == typeof window ? null : window;
  };
  var li = (function t2() {
    let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ai();
    const i2 = (e3) => t2(e3);
    if (i2.version = "3.2.5", i2.removed = [], !e2 || !e2.document || e2.document.nodeType !== si || !e2.Element) return i2.isSupported = false, i2;
    let { document: n2 } = e2;
    const r3 = n2, o2 = r3.currentScript, { DocumentFragment: s2, HTMLTemplateElement: a2, Node: l3, Element: c2, NodeFilter: u2, NamedNodeMap: h2 = e2.NamedNodeMap || e2.MozNamedAttrMap, HTMLFormElement: d2, DOMParser: g2, trustedTypes: m2 } = e2, p2 = c2.prototype, f2 = Oe(p2, "cloneNode"), b2 = Oe(p2, "remove"), v2 = Oe(p2, "nextSibling"), A2 = Oe(p2, "childNodes"), y2 = Oe(p2, "parentNode");
    if ("function" == typeof a2) {
      const t3 = n2.createElement("template");
      t3.content && t3.content.ownerDocument && (n2 = t3.content.ownerDocument);
    }
    let x2, C2 = "";
    const { implementation: E2, createNodeIterator: S2, createDocumentFragment: R2, getElementsByTagName: k2 } = n2, { importNode: T2 } = r3;
    let w2 = { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
    i2.isSupported = "function" == typeof re && "function" == typeof y2 && E2 && void 0 !== E2.createHTMLDocument;
    const { MUSTACHE_EXPR: L2, ERB_EXPR: D2, TMPLIT_EXPR: N2, DATA_ATTR: I2, ARIA_ATTR: O2, IS_SCRIPT_OR_DATA: F2, ATTR_WHITESPACE: P2, CUSTOM_ELEMENT: M2 } = ei;
    let { IS_ALLOWED_URI: B2 } = ei, _2 = null;
    const j2 = De({}, [...Fe, ...Pe, ...Me, ..._e, ...We]);
    let W2 = null;
    const U2 = De({}, [...Ue, ...Ve, ...ze, ...qe]);
    let V2 = Object.seal(he(null, { tagNameCheck: { writable: true, configurable: false, enumerable: true, value: null }, attributeNameCheck: { writable: true, configurable: false, enumerable: true, value: null }, allowCustomizedBuiltInElements: { writable: true, configurable: false, enumerable: true, value: false } })), z2 = null, q2 = null, H2 = true, J2 = true, K2 = false, G2 = true, Y2 = false, X2 = true, $2 = false, Z2 = false, Q2 = false, tt2 = false, et2 = false, it2 = false, nt2 = true, rt2 = false, ot2 = true, st2 = false, at2 = {}, lt2 = null;
    const ct2 = De({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
    let ut2 = null;
    const ht2 = De({}, ["audio", "video", "img", "source", "image", "track"]);
    let dt2 = null;
    const gt2 = De({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), mt2 = "http://www.w3.org/1998/Math/MathML", pt2 = "http://www.w3.org/2000/svg", ft2 = "http://www.w3.org/1999/xhtml";
    let bt2 = ft2, vt2 = false, At2 = null;
    const yt2 = De({}, [mt2, pt2, ft2], ye);
    let xt2 = De({}, ["mi", "mo", "mn", "ms", "mtext"]), Ct2 = De({}, ["annotation-xml"]);
    const Et2 = De({}, ["title", "style", "font", "a", "script"]);
    let St2 = null;
    const Rt2 = ["application/xhtml+xml", "text/html"];
    let kt2 = null, Tt2 = null;
    const wt2 = n2.createElement("form"), Lt2 = function(t3) {
      return t3 instanceof RegExp || t3 instanceof Function;
    }, Dt2 = function() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      if (!Tt2 || Tt2 !== t3) {
        if (t3 && "object" == typeof t3 || (t3 = {}), t3 = Ie(t3), St2 = -1 === Rt2.indexOf(t3.PARSER_MEDIA_TYPE) ? "text/html" : t3.PARSER_MEDIA_TYPE, kt2 = "application/xhtml+xml" === St2 ? ye : Ae, _2 = Re(t3, "ALLOWED_TAGS") ? De({}, t3.ALLOWED_TAGS, kt2) : j2, W2 = Re(t3, "ALLOWED_ATTR") ? De({}, t3.ALLOWED_ATTR, kt2) : U2, At2 = Re(t3, "ALLOWED_NAMESPACES") ? De({}, t3.ALLOWED_NAMESPACES, ye) : yt2, dt2 = Re(t3, "ADD_URI_SAFE_ATTR") ? De(Ie(gt2), t3.ADD_URI_SAFE_ATTR, kt2) : gt2, ut2 = Re(t3, "ADD_DATA_URI_TAGS") ? De(Ie(ht2), t3.ADD_DATA_URI_TAGS, kt2) : ht2, lt2 = Re(t3, "FORBID_CONTENTS") ? De({}, t3.FORBID_CONTENTS, kt2) : ct2, z2 = Re(t3, "FORBID_TAGS") ? De({}, t3.FORBID_TAGS, kt2) : {}, q2 = Re(t3, "FORBID_ATTR") ? De({}, t3.FORBID_ATTR, kt2) : {}, at2 = !!Re(t3, "USE_PROFILES") && t3.USE_PROFILES, H2 = false !== t3.ALLOW_ARIA_ATTR, J2 = false !== t3.ALLOW_DATA_ATTR, K2 = t3.ALLOW_UNKNOWN_PROTOCOLS || false, G2 = false !== t3.ALLOW_SELF_CLOSE_IN_ATTR, Y2 = t3.SAFE_FOR_TEMPLATES || false, X2 = false !== t3.SAFE_FOR_XML, $2 = t3.WHOLE_DOCUMENT || false, tt2 = t3.RETURN_DOM || false, et2 = t3.RETURN_DOM_FRAGMENT || false, it2 = t3.RETURN_TRUSTED_TYPE || false, Q2 = t3.FORCE_BODY || false, nt2 = false !== t3.SANITIZE_DOM, rt2 = t3.SANITIZE_NAMED_PROPS || false, ot2 = false !== t3.KEEP_CONTENT, st2 = t3.IN_PLACE || false, B2 = t3.ALLOWED_URI_REGEXP || Xe, bt2 = t3.NAMESPACE || ft2, xt2 = t3.MATHML_TEXT_INTEGRATION_POINTS || xt2, Ct2 = t3.HTML_INTEGRATION_POINTS || Ct2, V2 = t3.CUSTOM_ELEMENT_HANDLING || {}, t3.CUSTOM_ELEMENT_HANDLING && Lt2(t3.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (V2.tagNameCheck = t3.CUSTOM_ELEMENT_HANDLING.tagNameCheck), t3.CUSTOM_ELEMENT_HANDLING && Lt2(t3.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (V2.attributeNameCheck = t3.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), t3.CUSTOM_ELEMENT_HANDLING && "boolean" == typeof t3.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (V2.allowCustomizedBuiltInElements = t3.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Y2 && (J2 = false), et2 && (tt2 = true), at2 && (_2 = De({}, We), W2 = [], true === at2.html && (De(_2, Fe), De(W2, Ue)), true === at2.svg && (De(_2, Pe), De(W2, Ve), De(W2, qe)), true === at2.svgFilters && (De(_2, Me), De(W2, Ve), De(W2, qe)), true === at2.mathMl && (De(_2, _e), De(W2, ze), De(W2, qe))), t3.ADD_TAGS && (_2 === j2 && (_2 = Ie(_2)), De(_2, t3.ADD_TAGS, kt2)), t3.ADD_ATTR && (W2 === U2 && (W2 = Ie(W2)), De(W2, t3.ADD_ATTR, kt2)), t3.ADD_URI_SAFE_ATTR && De(dt2, t3.ADD_URI_SAFE_ATTR, kt2), t3.FORBID_CONTENTS && (lt2 === ct2 && (lt2 = Ie(lt2)), De(lt2, t3.FORBID_CONTENTS, kt2)), ot2 && (_2["#text"] = true), $2 && De(_2, ["html", "head", "body"]), _2.table && (De(_2, ["tbody"]), delete z2.tbody), t3.TRUSTED_TYPES_POLICY) {
          if ("function" != typeof t3.TRUSTED_TYPES_POLICY.createHTML) throw Te('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
          if ("function" != typeof t3.TRUSTED_TYPES_POLICY.createScriptURL) throw Te('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
          x2 = t3.TRUSTED_TYPES_POLICY, C2 = x2.createHTML("");
        } else void 0 === x2 && (x2 = (function(t4, e3) {
          if ("object" != typeof t4 || "function" != typeof t4.createPolicy) return null;
          let i3 = null;
          const n3 = "data-tt-policy-suffix";
          e3 && e3.hasAttribute(n3) && (i3 = e3.getAttribute(n3));
          const r4 = "dompurify" + (i3 ? "#" + i3 : "");
          try {
            return t4.createPolicy(r4, { createHTML: (t5) => t5, createScriptURL: (t5) => t5 });
          } catch (t5) {
            return console.warn("TrustedTypes policy " + r4 + " could not be created."), null;
          }
        })(m2, o2)), null !== x2 && "string" == typeof C2 && (C2 = x2.createHTML(""));
        ce && ce(t3), Tt2 = t3;
      }
    }, Nt2 = De({}, [...Pe, ...Me, ...Be]), It2 = De({}, [..._e, ...je]), Ot2 = function(t3) {
      be(i2.removed, { element: t3 });
      try {
        y2(t3).removeChild(t3);
      } catch (e3) {
        b2(t3);
      }
    }, Ft2 = function(t3, e3) {
      try {
        be(i2.removed, { attribute: e3.getAttributeNode(t3), from: e3 });
      } catch (t4) {
        be(i2.removed, { attribute: null, from: e3 });
      }
      if (e3.removeAttribute(t3), "is" === t3) if (tt2 || et2) try {
        Ot2(e3);
      } catch (t4) {
      }
      else try {
        e3.setAttribute(t3, "");
      } catch (t4) {
      }
    }, Pt2 = function(t3) {
      let e3 = null, i3 = null;
      if (Q2) t3 = "<remove></remove>" + t3;
      else {
        const e4 = xe(t3, /^[\r\n\t ]+/);
        i3 = e4 && e4[0];
      }
      "application/xhtml+xml" === St2 && bt2 === ft2 && (t3 = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + t3 + "</body></html>");
      const r4 = x2 ? x2.createHTML(t3) : t3;
      if (bt2 === ft2) try {
        e3 = new g2().parseFromString(r4, St2);
      } catch (t4) {
      }
      if (!e3 || !e3.documentElement) {
        e3 = E2.createDocument(bt2, "template", null);
        try {
          e3.documentElement.innerHTML = vt2 ? C2 : r4;
        } catch (t4) {
        }
      }
      const o3 = e3.body || e3.documentElement;
      return t3 && i3 && o3.insertBefore(n2.createTextNode(i3), o3.childNodes[0] || null), bt2 === ft2 ? k2.call(e3, $2 ? "html" : "body")[0] : $2 ? e3.documentElement : o3;
    }, Mt2 = function(t3) {
      return S2.call(t3.ownerDocument || t3, t3, u2.SHOW_ELEMENT | u2.SHOW_COMMENT | u2.SHOW_TEXT | u2.SHOW_PROCESSING_INSTRUCTION | u2.SHOW_CDATA_SECTION, null);
    }, Bt2 = function(t3) {
      return t3 instanceof d2 && ("string" != typeof t3.nodeName || "string" != typeof t3.textContent || "function" != typeof t3.removeChild || !(t3.attributes instanceof h2) || "function" != typeof t3.removeAttribute || "function" != typeof t3.setAttribute || "string" != typeof t3.namespaceURI || "function" != typeof t3.insertBefore || "function" != typeof t3.hasChildNodes);
    }, _t2 = function(t3) {
      return "function" == typeof l3 && t3 instanceof l3;
    };
    function jt2(t3, e3, n3) {
      me(t3, ((t4) => {
        t4.call(i2, e3, n3, Tt2);
      }));
    }
    const Wt2 = function(t3) {
      let e3 = null;
      if (jt2(w2.beforeSanitizeElements, t3, null), Bt2(t3)) return Ot2(t3), true;
      const n3 = kt2(t3.nodeName);
      if (jt2(w2.uponSanitizeElement, t3, { tagName: n3, allowedTags: _2 }), t3.hasChildNodes() && !_t2(t3.firstElementChild) && ke(/<[/\w!]/g, t3.innerHTML) && ke(/<[/\w!]/g, t3.textContent)) return Ot2(t3), true;
      if (t3.nodeType === ri) return Ot2(t3), true;
      if (X2 && t3.nodeType === oi && ke(/<[/\w]/g, t3.data)) return Ot2(t3), true;
      if (!_2[n3] || z2[n3]) {
        if (!z2[n3] && Vt2(n3)) {
          if (V2.tagNameCheck instanceof RegExp && ke(V2.tagNameCheck, n3)) return false;
          if (V2.tagNameCheck instanceof Function && V2.tagNameCheck(n3)) return false;
        }
        if (ot2 && !lt2[n3]) {
          const e4 = y2(t3) || t3.parentNode, i3 = A2(t3) || t3.childNodes;
          if (i3 && e4) {
            for (let n4 = i3.length - 1; n4 >= 0; --n4) {
              const r4 = f2(i3[n4], true);
              r4.__removalCount = (t3.__removalCount || 0) + 1, e4.insertBefore(r4, v2(t3));
            }
          }
        }
        return Ot2(t3), true;
      }
      return t3 instanceof c2 && !(function(t4) {
        let e4 = y2(t4);
        e4 && e4.tagName || (e4 = { namespaceURI: bt2, tagName: "template" });
        const i3 = Ae(t4.tagName), n4 = Ae(e4.tagName);
        return !!At2[t4.namespaceURI] && (t4.namespaceURI === pt2 ? e4.namespaceURI === ft2 ? "svg" === i3 : e4.namespaceURI === mt2 ? "svg" === i3 && ("annotation-xml" === n4 || xt2[n4]) : Boolean(Nt2[i3]) : t4.namespaceURI === mt2 ? e4.namespaceURI === ft2 ? "math" === i3 : e4.namespaceURI === pt2 ? "math" === i3 && Ct2[n4] : Boolean(It2[i3]) : t4.namespaceURI === ft2 ? !(e4.namespaceURI === pt2 && !Ct2[n4]) && !(e4.namespaceURI === mt2 && !xt2[n4]) && !It2[i3] && (Et2[i3] || !Nt2[i3]) : !("application/xhtml+xml" !== St2 || !At2[t4.namespaceURI]));
      })(t3) ? (Ot2(t3), true) : "noscript" !== n3 && "noembed" !== n3 && "noframes" !== n3 || !ke(/<\/no(script|embed|frames)/i, t3.innerHTML) ? (Y2 && t3.nodeType === ni && (e3 = t3.textContent, me([L2, D2, N2], ((t4) => {
        e3 = Ce(e3, t4, " ");
      })), t3.textContent !== e3 && (be(i2.removed, { element: t3.cloneNode() }), t3.textContent = e3)), jt2(w2.afterSanitizeElements, t3, null), false) : (Ot2(t3), true);
    }, Ut2 = function(t3, e3, i3) {
      if (nt2 && ("id" === e3 || "name" === e3) && (i3 in n2 || i3 in wt2)) return false;
      if (J2 && !q2[e3] && ke(I2, e3)) ;
      else if (H2 && ke(O2, e3)) ;
      else if (!W2[e3] || q2[e3]) {
        if (!(Vt2(t3) && (V2.tagNameCheck instanceof RegExp && ke(V2.tagNameCheck, t3) || V2.tagNameCheck instanceof Function && V2.tagNameCheck(t3)) && (V2.attributeNameCheck instanceof RegExp && ke(V2.attributeNameCheck, e3) || V2.attributeNameCheck instanceof Function && V2.attributeNameCheck(e3)) || "is" === e3 && V2.allowCustomizedBuiltInElements && (V2.tagNameCheck instanceof RegExp && ke(V2.tagNameCheck, i3) || V2.tagNameCheck instanceof Function && V2.tagNameCheck(i3)))) return false;
      } else if (dt2[e3]) ;
      else if (ke(B2, Ce(i3, P2, ""))) ;
      else if ("src" !== e3 && "xlink:href" !== e3 && "href" !== e3 || "script" === t3 || 0 !== Ee(i3, "data:") || !ut2[t3]) {
        if (K2 && !ke(F2, Ce(i3, P2, ""))) ;
        else if (i3) return false;
      } else ;
      return true;
    }, Vt2 = function(t3) {
      return "annotation-xml" !== t3 && xe(t3, M2);
    }, zt2 = function(t3) {
      jt2(w2.beforeSanitizeAttributes, t3, null);
      const { attributes: e3 } = t3;
      if (!e3 || Bt2(t3)) return;
      const n3 = { attrName: "", attrValue: "", keepAttr: true, allowedAttributes: W2, forceKeepAttr: void 0 };
      let r4 = e3.length;
      for (; r4--; ) {
        const o3 = e3[r4], { name: s3, namespaceURI: a3, value: l4 } = o3, c3 = kt2(s3);
        let u3 = "value" === s3 ? l4 : Se(l4);
        if (n3.attrName = c3, n3.attrValue = u3, n3.keepAttr = true, n3.forceKeepAttr = void 0, jt2(w2.uponSanitizeAttribute, t3, n3), u3 = n3.attrValue, !rt2 || "id" !== c3 && "name" !== c3 || (Ft2(s3, t3), u3 = "user-content-" + u3), X2 && ke(/((--!?|])>)|<\/(style|title)/i, u3)) {
          Ft2(s3, t3);
          continue;
        }
        if (n3.forceKeepAttr) continue;
        if (Ft2(s3, t3), !n3.keepAttr) continue;
        if (!G2 && ke(/\/>/i, u3)) {
          Ft2(s3, t3);
          continue;
        }
        Y2 && me([L2, D2, N2], ((t4) => {
          u3 = Ce(u3, t4, " ");
        }));
        const h3 = kt2(t3.nodeName);
        if (Ut2(h3, c3, u3)) {
          if (x2 && "object" == typeof m2 && "function" == typeof m2.getAttributeType) if (a3) ;
          else switch (m2.getAttributeType(h3, c3)) {
            case "TrustedHTML":
              u3 = x2.createHTML(u3);
              break;
            case "TrustedScriptURL":
              u3 = x2.createScriptURL(u3);
          }
          try {
            a3 ? t3.setAttributeNS(a3, s3, u3) : t3.setAttribute(s3, u3), Bt2(t3) ? Ot2(t3) : fe(i2.removed);
          } catch (t4) {
          }
        }
      }
      jt2(w2.afterSanitizeAttributes, t3, null);
    }, qt2 = function t3(e3) {
      let i3 = null;
      const n3 = Mt2(e3);
      for (jt2(w2.beforeSanitizeShadowDOM, e3, null); i3 = n3.nextNode(); ) jt2(w2.uponSanitizeShadowNode, i3, null), Wt2(i3), zt2(i3), i3.content instanceof s2 && t3(i3.content);
      jt2(w2.afterSanitizeShadowDOM, e3, null);
    };
    return i2.sanitize = function(t3) {
      let e3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n3 = null, o3 = null, a3 = null, c3 = null;
      if (vt2 = !t3, vt2 && (t3 = "<!-->"), "string" != typeof t3 && !_t2(t3)) {
        if ("function" != typeof t3.toString) throw Te("toString is not a function");
        if ("string" != typeof (t3 = t3.toString())) throw Te("dirty is not a string, aborting");
      }
      if (!i2.isSupported) return t3;
      if (Z2 || Dt2(e3), i2.removed = [], "string" == typeof t3 && (st2 = false), st2) {
        if (t3.nodeName) {
          const e4 = kt2(t3.nodeName);
          if (!_2[e4] || z2[e4]) throw Te("root node is forbidden and cannot be sanitized in-place");
        }
      } else if (t3 instanceof l3) n3 = Pt2("<!---->"), o3 = n3.ownerDocument.importNode(t3, true), o3.nodeType === ii && "BODY" === o3.nodeName || "HTML" === o3.nodeName ? n3 = o3 : n3.appendChild(o3);
      else {
        if (!tt2 && !Y2 && !$2 && -1 === t3.indexOf("<")) return x2 && it2 ? x2.createHTML(t3) : t3;
        if (n3 = Pt2(t3), !n3) return tt2 ? null : it2 ? C2 : "";
      }
      n3 && Q2 && Ot2(n3.firstChild);
      const u3 = Mt2(st2 ? t3 : n3);
      for (; a3 = u3.nextNode(); ) Wt2(a3), zt2(a3), a3.content instanceof s2 && qt2(a3.content);
      if (st2) return t3;
      if (tt2) {
        if (et2) for (c3 = R2.call(n3.ownerDocument); n3.firstChild; ) c3.appendChild(n3.firstChild);
        else c3 = n3;
        return (W2.shadowroot || W2.shadowrootmode) && (c3 = T2.call(r3, c3, true)), c3;
      }
      let h3 = $2 ? n3.outerHTML : n3.innerHTML;
      return $2 && _2["!doctype"] && n3.ownerDocument && n3.ownerDocument.doctype && n3.ownerDocument.doctype.name && ke(Qe, n3.ownerDocument.doctype.name) && (h3 = "<!DOCTYPE " + n3.ownerDocument.doctype.name + ">\n" + h3), Y2 && me([L2, D2, N2], ((t4) => {
        h3 = Ce(h3, t4, " ");
      })), x2 && it2 ? x2.createHTML(h3) : h3;
    }, i2.setConfig = function() {
      Dt2(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}), Z2 = true;
    }, i2.clearConfig = function() {
      Tt2 = null, Z2 = false;
    }, i2.isValidAttribute = function(t3, e3, i3) {
      Tt2 || Dt2({});
      const n3 = kt2(t3), r4 = kt2(e3);
      return Ut2(n3, r4, i3);
    }, i2.addHook = function(t3, e3) {
      "function" == typeof e3 && be(w2[t3], e3);
    }, i2.removeHook = function(t3, e3) {
      if (void 0 !== e3) {
        const i3 = pe(w2[t3], e3);
        return -1 === i3 ? void 0 : ve(w2[t3], i3, 1)[0];
      }
      return fe(w2[t3]);
    }, i2.removeHooks = function(t3) {
      w2[t3] = [];
    }, i2.removeAllHooks = function() {
      w2 = { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
    }, i2;
  })();
  li.addHook("uponSanitizeAttribute", (function(t3, e2) {
    /^data-trix-/.test(e2.attrName) && (e2.forceKeepAttr = true);
  }));
  var ci = "style href src width height language class".split(" ");
  var ui = "javascript:".split(" ");
  var hi = "script iframe form noscript".split(" ");
  var di = class extends q {
    static setHTML(t3, e2, i2) {
      const n2 = new this(e2, i2).sanitize(), r3 = n2.getHTML ? n2.getHTML() : n2.outerHTML;
      t3.innerHTML = r3;
    }
    static sanitize(t3, e2) {
      const i2 = new this(t3, e2);
      return i2.sanitize(), i2;
    }
    constructor(t3) {
      let { allowedAttributes: e2, forbiddenProtocols: i2, forbiddenElements: n2, purifyOptions: r3 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      super(...arguments), this.allowedAttributes = e2 || ci, this.forbiddenProtocols = i2 || ui, this.forbiddenElements = n2 || hi, this.purifyOptions = r3 || {}, this.body = gi(t3);
    }
    sanitize() {
      this.sanitizeElements(), this.normalizeListElementNesting();
      const t3 = Object.assign({}, l, this.purifyOptions);
      return li.setConfig(t3), this.body = li.sanitize(this.body), this.body;
    }
    getHTML() {
      return this.body.innerHTML;
    }
    getBody() {
      return this.body;
    }
    sanitizeElements() {
      const t3 = R(this.body), e2 = [];
      for (; t3.nextNode(); ) {
        const i2 = t3.currentNode;
        switch (i2.nodeType) {
          case Node.ELEMENT_NODE:
            this.elementIsRemovable(i2) ? e2.push(i2) : this.sanitizeElement(i2);
            break;
          case Node.COMMENT_NODE:
            e2.push(i2);
        }
      }
      return e2.forEach(((t4) => S(t4))), this.body;
    }
    sanitizeElement(t3) {
      return t3.hasAttribute("href") && this.forbiddenProtocols.includes(t3.protocol) && t3.removeAttribute("href"), Array.from(t3.attributes).forEach(((e2) => {
        let { name: i2 } = e2;
        this.allowedAttributes.includes(i2) || 0 === i2.indexOf("data-trix") || t3.removeAttribute(i2);
      })), t3;
    }
    normalizeListElementNesting() {
      return Array.from(this.body.querySelectorAll("ul,ol")).forEach(((t3) => {
        const e2 = t3.previousElementSibling;
        e2 && "li" === k(e2) && e2.appendChild(t3);
      })), this.body;
    }
    elementIsRemovable(t3) {
      if ((null == t3 ? void 0 : t3.nodeType) === Node.ELEMENT_NODE) return this.elementIsForbidden(t3) || this.elementIsntSerializable(t3);
    }
    elementIsForbidden(t3) {
      return this.forbiddenElements.includes(k(t3));
    }
    elementIsntSerializable(t3) {
      return "false" === t3.getAttribute("data-trix-serialize") && !P(t3);
    }
  };
  var gi = function() {
    let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
    t3 = t3.replace(/<\/html[^>]*>[^]*$/i, "</html>");
    const e2 = document.implementation.createHTMLDocument("");
    return e2.documentElement.innerHTML = t3, Array.from(e2.head.querySelectorAll("style")).forEach(((t4) => {
      e2.body.appendChild(t4);
    })), e2.body;
  };
  var { css: mi } = z;
  var pi = class extends ie {
    constructor() {
      super(...arguments), this.attachment = this.object, this.attachment.uploadProgressDelegate = this, this.attachmentPiece = this.options.piece;
    }
    createContentNodes() {
      return [];
    }
    createNodes() {
      let t3;
      const e2 = t3 = T({ tagName: "figure", className: this.getClassName(), data: this.getData(), editable: false }), i2 = this.getHref();
      return i2 && (t3 = T({ tagName: "a", editable: false, attributes: { href: i2, tabindex: -1 } }), e2.appendChild(t3)), this.attachment.hasContent() ? di.setHTML(t3, this.attachment.getContent()) : this.createContentNodes().forEach(((e3) => {
        t3.appendChild(e3);
      })), t3.appendChild(this.createCaptionElement()), this.attachment.isPending() && (this.progressElement = T({ tagName: "progress", attributes: { class: mi.attachmentProgress, value: this.attachment.getUploadProgress(), max: 100 }, data: { trixMutable: true, trixStoreKey: ["progressElement", this.attachment.id].join("/") } }), e2.appendChild(this.progressElement)), [fi("left"), e2, fi("right")];
    }
    createCaptionElement() {
      const t3 = T({ tagName: "figcaption", className: mi.attachmentCaption }), e2 = this.attachmentPiece.getCaption();
      if (e2) t3.classList.add("".concat(mi.attachmentCaption, "--edited")), t3.textContent = e2;
      else {
        let e3, i2;
        const n2 = this.getCaptionConfig();
        if (n2.name && (e3 = this.attachment.getFilename()), n2.size && (i2 = this.attachment.getFormattedFilesize()), e3) {
          const i3 = T({ tagName: "span", className: mi.attachmentName, textContent: e3 });
          t3.appendChild(i3);
        }
        if (i2) {
          e3 && t3.appendChild(document.createTextNode(" "));
          const n3 = T({ tagName: "span", className: mi.attachmentSize, textContent: i2 });
          t3.appendChild(n3);
        }
      }
      return t3;
    }
    getClassName() {
      const t3 = [mi.attachment, "".concat(mi.attachment, "--").concat(this.attachment.getType())], e2 = this.attachment.getExtension();
      return e2 && t3.push("".concat(mi.attachment, "--").concat(e2)), t3.join(" ");
    }
    getData() {
      const t3 = { trixAttachment: JSON.stringify(this.attachment), trixContentType: this.attachment.getContentType(), trixId: this.attachment.id }, { attributes: e2 } = this.attachmentPiece;
      return e2.isEmpty() || (t3.trixAttributes = JSON.stringify(e2)), this.attachment.isPending() && (t3.trixSerialize = false), t3;
    }
    getHref() {
      if (!bi(this.attachment.getContent(), "a")) return this.attachment.getHref();
    }
    getCaptionConfig() {
      var t3;
      const e2 = this.attachment.getType(), n2 = kt(null === (t3 = i[e2]) || void 0 === t3 ? void 0 : t3.caption);
      return "file" === e2 && (n2.name = true), n2;
    }
    findProgressElement() {
      var t3;
      return null === (t3 = this.findElement()) || void 0 === t3 ? void 0 : t3.querySelector("progress");
    }
    attachmentDidChangeUploadProgress() {
      const t3 = this.attachment.getUploadProgress(), e2 = this.findProgressElement();
      e2 && (e2.value = t3);
    }
  };
  var fi = (t3) => T({ tagName: "span", textContent: d, data: { trixCursorTarget: t3, trixSerialize: false } });
  var bi = function(t3, e2) {
    const i2 = T("div");
    return di.setHTML(i2, t3 || ""), i2.querySelector(e2);
  };
  var vi = class extends pi {
    constructor() {
      super(...arguments), this.attachment.previewDelegate = this;
    }
    createContentNodes() {
      return this.image = T({ tagName: "img", attributes: { src: "" }, data: { trixMutable: true } }), this.refresh(this.image), [this.image];
    }
    createCaptionElement() {
      const t3 = super.createCaptionElement(...arguments);
      return t3.textContent || t3.setAttribute("data-trix-placeholder", c.captionPlaceholder), t3;
    }
    refresh(t3) {
      var e2;
      t3 || (t3 = null === (e2 = this.findElement()) || void 0 === e2 ? void 0 : e2.querySelector("img"));
      if (t3) return this.updateAttributesForImage(t3);
    }
    updateAttributesForImage(t3) {
      const e2 = this.attachment.getURL(), i2 = this.attachment.getPreviewURL();
      if (t3.src = i2 || e2, i2 === e2) t3.removeAttribute("data-trix-serialized-attributes");
      else {
        const i3 = JSON.stringify({ src: e2 });
        t3.setAttribute("data-trix-serialized-attributes", i3);
      }
      const n2 = this.attachment.getWidth(), r3 = this.attachment.getHeight();
      null != n2 && (t3.width = n2), null != r3 && (t3.height = r3);
      const o2 = ["imageElement", this.attachment.id, t3.src, t3.width, t3.height].join("/");
      t3.dataset.trixStoreKey = o2;
    }
    attachmentDidChangeAttributes() {
      return this.refresh(this.image), this.refresh();
    }
  };
  var Ai = class extends ie {
    constructor() {
      super(...arguments), this.piece = this.object, this.attributes = this.piece.getAttributes(), this.textConfig = this.options.textConfig, this.context = this.options.context, this.piece.attachment ? this.attachment = this.piece.attachment : this.string = this.piece.toString();
    }
    createNodes() {
      let t3 = this.attachment ? this.createAttachmentNodes() : this.createStringNodes();
      const e2 = this.createElement();
      if (e2) {
        const i2 = (function(t4) {
          for (; null !== (e3 = t4) && void 0 !== e3 && e3.firstElementChild; ) {
            var e3;
            t4 = t4.firstElementChild;
          }
          return t4;
        })(e2);
        Array.from(t3).forEach(((t4) => {
          i2.appendChild(t4);
        })), t3 = [e2];
      }
      return t3;
    }
    createAttachmentNodes() {
      const t3 = this.attachment.isPreviewable() ? vi : pi;
      return this.createChildView(t3, this.piece.attachment, { piece: this.piece }).getNodes();
    }
    createStringNodes() {
      var t3;
      if (null !== (t3 = this.textConfig) && void 0 !== t3 && t3.plaintext) return [document.createTextNode(this.string)];
      {
        const t4 = [], e2 = this.string.split("\n");
        for (let i2 = 0; i2 < e2.length; i2++) {
          const n2 = e2[i2];
          if (i2 > 0) {
            const e3 = T("br");
            t4.push(e3);
          }
          if (n2.length) {
            const e3 = document.createTextNode(this.preserveSpaces(n2));
            t4.push(e3);
          }
        }
        return t4;
      }
    }
    createElement() {
      let t3, e2, i2;
      const n2 = {};
      for (e2 in this.attributes) {
        i2 = this.attributes[e2];
        const o2 = ft(e2);
        if (o2) {
          if (o2.tagName) {
            var r3;
            const e3 = T(o2.tagName);
            r3 ? (r3.appendChild(e3), r3 = e3) : t3 = r3 = e3;
          }
          if (o2.styleProperty && (n2[o2.styleProperty] = i2), o2.style) for (e2 in o2.style) i2 = o2.style[e2], n2[e2] = i2;
        }
      }
      if (Object.keys(n2).length) for (e2 in t3 || (t3 = T("span")), n2) i2 = n2[e2], t3.style[e2] = i2;
      return t3;
    }
    createContainerElement() {
      for (const t3 in this.attributes) {
        const e2 = this.attributes[t3], i2 = ft(t3);
        if (i2 && i2.groupTagName) {
          const n2 = {};
          return n2[t3] = e2, T(i2.groupTagName, n2);
        }
      }
    }
    preserveSpaces(t3) {
      return this.context.isLast && (t3 = t3.replace(/\ $/, g)), t3 = t3.replace(/(\S)\ {3}(\S)/g, "$1 ".concat(g, " $2")).replace(/\ {2}/g, "".concat(g, " ")).replace(/\ {2}/g, " ".concat(g)), (this.context.isFirst || this.context.followsWhitespace) && (t3 = t3.replace(/^\ /, g)), t3;
    }
  };
  var yi = class extends ie {
    constructor() {
      super(...arguments), this.text = this.object, this.textConfig = this.options.textConfig;
    }
    createNodes() {
      const t3 = [], e2 = $t.groupObjects(this.getPieces()), i2 = e2.length - 1;
      for (let r3 = 0; r3 < e2.length; r3++) {
        const o2 = e2[r3], s2 = {};
        0 === r3 && (s2.isFirst = true), r3 === i2 && (s2.isLast = true), xi(n2) && (s2.followsWhitespace = true);
        const a2 = this.findOrCreateCachedChildView(Ai, o2, { textConfig: this.textConfig, context: s2 });
        t3.push(...Array.from(a2.getNodes() || []));
        var n2 = o2;
      }
      return t3;
    }
    getPieces() {
      return Array.from(this.text.getPieces()).filter(((t3) => !t3.hasAttribute("blockBreak")));
    }
  };
  var xi = (t3) => /\s$/.test(null == t3 ? void 0 : t3.toString());
  var { css: Ci } = z;
  var Ei = class extends ie {
    constructor() {
      super(...arguments), this.block = this.object, this.attributes = this.block.getAttributes();
    }
    createNodes() {
      const t3 = [document.createComment("block")];
      if (this.block.isEmpty()) t3.push(T("br"));
      else {
        var e2;
        const i2 = null === (e2 = mt(this.block.getLastAttribute())) || void 0 === e2 ? void 0 : e2.text, n2 = this.findOrCreateCachedChildView(yi, this.block.text, { textConfig: i2 });
        t3.push(...Array.from(n2.getNodes() || [])), this.shouldAddExtraNewlineElement() && t3.push(T("br"));
      }
      if (this.attributes.length) return t3;
      {
        let e3;
        const { tagName: i2 } = n.default;
        this.block.isRTL() && (e3 = { dir: "rtl" });
        const r3 = T({ tagName: i2, attributes: e3 });
        return t3.forEach(((t4) => r3.appendChild(t4))), [r3];
      }
    }
    createContainerElement(t3) {
      const e2 = {};
      let i2;
      const n2 = this.attributes[t3], { tagName: r3, htmlAttributes: o2 = [] } = mt(n2);
      if (0 === t3 && this.block.isRTL() && Object.assign(e2, { dir: "rtl" }), "attachmentGallery" === n2) {
        const t4 = this.block.getBlockBreakPosition();
        i2 = "".concat(Ci.attachmentGallery, " ").concat(Ci.attachmentGallery, "--").concat(t4);
      }
      return Object.entries(this.block.htmlAttributes).forEach(((t4) => {
        let [i3, n3] = t4;
        o2.includes(i3) && (e2[i3] = n3);
      })), T({ tagName: r3, className: i2, attributes: e2 });
    }
    shouldAddExtraNewlineElement() {
      return /\n\n$/.test(this.block.toString());
    }
  };
  var Si = class extends ie {
    static render(t3) {
      const e2 = T("div"), i2 = new this(t3, { element: e2 });
      return i2.render(), i2.sync(), e2;
    }
    constructor() {
      super(...arguments), this.element = this.options.element, this.elementStore = new Qt(), this.setDocument(this.object);
    }
    setDocument(t3) {
      t3.isEqualTo(this.document) || (this.document = this.object = t3);
    }
    render() {
      if (this.childViews = [], this.shadowElement = T("div"), !this.document.isEmpty()) {
        const t3 = $t.groupObjects(this.document.getBlocks(), { asTree: true });
        Array.from(t3).forEach(((t4) => {
          const e2 = this.findOrCreateCachedChildView(Ei, t4);
          Array.from(e2.getNodes()).map(((t5) => this.shadowElement.appendChild(t5)));
        }));
      }
    }
    isSynced() {
      return ki(this.shadowElement, this.element);
    }
    sync() {
      const t3 = this.createDocumentFragmentForSync();
      for (; this.element.lastChild; ) this.element.removeChild(this.element.lastChild);
      return this.element.appendChild(t3), this.didSync();
    }
    didSync() {
      return this.elementStore.reset(Ri(this.element)), Rt((() => this.garbageCollectCachedViews()));
    }
    createDocumentFragmentForSync() {
      const t3 = document.createDocumentFragment();
      return Array.from(this.shadowElement.childNodes).forEach(((e2) => {
        t3.appendChild(e2.cloneNode(true));
      })), Array.from(Ri(t3)).forEach(((t4) => {
        const e2 = this.elementStore.remove(t4);
        e2 && t4.parentNode.replaceChild(e2, t4);
      })), t3;
    }
  };
  var Ri = (t3) => t3.querySelectorAll("[data-trix-store-key]");
  var ki = (t3, e2) => Ti(t3.innerHTML) === Ti(e2.innerHTML);
  var Ti = (t3) => t3.replace(/&nbsp;/g, " ");
  function wi(t3) {
    var e2, i2;
    function n2(e3, i3) {
      try {
        var o2 = t3[e3](i3), s2 = o2.value, a2 = s2 instanceof Li;
        Promise.resolve(a2 ? s2.v : s2).then((function(i4) {
          if (a2) {
            var l3 = "return" === e3 ? "return" : "next";
            if (!s2.k || i4.done) return n2(l3, i4);
            i4 = t3[l3](i4).value;
          }
          r3(o2.done ? "return" : "normal", i4);
        }), (function(t4) {
          n2("throw", t4);
        }));
      } catch (t4) {
        r3("throw", t4);
      }
    }
    function r3(t4, r4) {
      switch (t4) {
        case "return":
          e2.resolve({ value: r4, done: true });
          break;
        case "throw":
          e2.reject(r4);
          break;
        default:
          e2.resolve({ value: r4, done: false });
      }
      (e2 = e2.next) ? n2(e2.key, e2.arg) : i2 = null;
    }
    this._invoke = function(t4, r4) {
      return new Promise((function(o2, s2) {
        var a2 = { key: t4, arg: r4, resolve: o2, reject: s2, next: null };
        i2 ? i2 = i2.next = a2 : (e2 = i2 = a2, n2(t4, r4));
      }));
    }, "function" != typeof t3.return && (this.return = void 0);
  }
  function Li(t3, e2) {
    this.v = t3, this.k = e2;
  }
  function Di(t3, e2, i2) {
    return (e2 = Ni(e2)) in t3 ? Object.defineProperty(t3, e2, { value: i2, enumerable: true, configurable: true, writable: true }) : t3[e2] = i2, t3;
  }
  function Ni(t3) {
    var e2 = (function(t4, e3) {
      if ("object" != typeof t4 || null === t4) return t4;
      var i2 = t4[Symbol.toPrimitive];
      if (void 0 !== i2) {
        var n2 = i2.call(t4, e3 || "default");
        if ("object" != typeof n2) return n2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e3 ? String : Number)(t4);
    })(t3, "string");
    return "symbol" == typeof e2 ? e2 : String(e2);
  }
  wi.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
    return this;
  }, wi.prototype.next = function(t3) {
    return this._invoke("next", t3);
  }, wi.prototype.throw = function(t3) {
    return this._invoke("throw", t3);
  }, wi.prototype.return = function(t3) {
    return this._invoke("return", t3);
  };
  function Ii(t3, e2) {
    return Pi(t3, Fi(t3, e2, "get"));
  }
  function Oi(t3, e2, i2) {
    return Mi(t3, Fi(t3, e2, "set"), i2), i2;
  }
  function Fi(t3, e2, i2) {
    if (!e2.has(t3)) throw new TypeError("attempted to " + i2 + " private field on non-instance");
    return e2.get(t3);
  }
  function Pi(t3, e2) {
    return e2.get ? e2.get.call(t3) : e2.value;
  }
  function Mi(t3, e2, i2) {
    if (e2.set) e2.set.call(t3, i2);
    else {
      if (!e2.writable) throw new TypeError("attempted to set read only private field");
      e2.value = i2;
    }
  }
  function Bi(t3, e2, i2) {
    if (!e2.has(t3)) throw new TypeError("attempted to get private field on non-instance");
    return i2;
  }
  function _i(t3, e2) {
    if (e2.has(t3)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function ji(t3, e2, i2) {
    _i(t3, e2), e2.set(t3, i2);
  }
  var Wi = class extends rt {
    static registerType(t3, e2) {
      e2.type = t3, this.types[t3] = e2;
    }
    static fromJSON(t3) {
      const e2 = this.types[t3.type];
      if (e2) return e2.fromJSON(t3);
    }
    constructor(t3) {
      let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      super(...arguments), this.attributes = Ht.box(e2);
    }
    copyWithAttributes(t3) {
      return new this.constructor(this.getValue(), t3);
    }
    copyWithAdditionalAttributes(t3) {
      return this.copyWithAttributes(this.attributes.merge(t3));
    }
    copyWithoutAttribute(t3) {
      return this.copyWithAttributes(this.attributes.remove(t3));
    }
    copy() {
      return this.copyWithAttributes(this.attributes);
    }
    getAttribute(t3) {
      return this.attributes.get(t3);
    }
    getAttributesHash() {
      return this.attributes;
    }
    getAttributes() {
      return this.attributes.toObject();
    }
    hasAttribute(t3) {
      return this.attributes.has(t3);
    }
    hasSameStringValueAsPiece(t3) {
      return t3 && this.toString() === t3.toString();
    }
    hasSameAttributesAsPiece(t3) {
      return t3 && (this.attributes === t3.attributes || this.attributes.isEqualTo(t3.attributes));
    }
    isBlockBreak() {
      return false;
    }
    isEqualTo(t3) {
      return super.isEqualTo(...arguments) || this.hasSameConstructorAs(t3) && this.hasSameStringValueAsPiece(t3) && this.hasSameAttributesAsPiece(t3);
    }
    isEmpty() {
      return 0 === this.length;
    }
    isSerializable() {
      return true;
    }
    toJSON() {
      return { type: this.constructor.type, attributes: this.getAttributes() };
    }
    contentsForInspection() {
      return { type: this.constructor.type, attributes: this.attributes.inspect() };
    }
    canBeGrouped() {
      return this.hasAttribute("href");
    }
    canBeGroupedWith(t3) {
      return this.getAttribute("href") === t3.getAttribute("href");
    }
    getLength() {
      return this.length;
    }
    canBeConsolidatedWith(t3) {
      return false;
    }
  };
  Di(Wi, "types", {});
  var Ui = class extends ee {
    constructor(t3) {
      super(...arguments), this.url = t3;
    }
    perform(t3) {
      const e2 = new Image();
      e2.onload = () => (e2.width = this.width = e2.naturalWidth, e2.height = this.height = e2.naturalHeight, t3(true, e2)), e2.onerror = () => t3(false), e2.src = this.url;
    }
  };
  var Vi = class _Vi extends rt {
    static attachmentForFile(t3) {
      const e2 = new this(this.attributesForFile(t3));
      return e2.setFile(t3), e2;
    }
    static attributesForFile(t3) {
      return new Ht({ filename: t3.name, filesize: t3.size, contentType: t3.type });
    }
    static fromJSON(t3) {
      return new this(t3);
    }
    constructor() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      super(t3), this.releaseFile = this.releaseFile.bind(this), this.attributes = Ht.box(t3), this.didChangeAttributes();
    }
    getAttribute(t3) {
      return this.attributes.get(t3);
    }
    hasAttribute(t3) {
      return this.attributes.has(t3);
    }
    getAttributes() {
      return this.attributes.toObject();
    }
    setAttributes() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      const e2 = this.attributes.merge(t3);
      var i2, n2, r3, o2;
      if (!this.attributes.isEqualTo(e2)) return this.attributes = e2, this.didChangeAttributes(), null === (i2 = this.previewDelegate) || void 0 === i2 || null === (n2 = i2.attachmentDidChangeAttributes) || void 0 === n2 || n2.call(i2, this), null === (r3 = this.delegate) || void 0 === r3 || null === (o2 = r3.attachmentDidChangeAttributes) || void 0 === o2 ? void 0 : o2.call(r3, this);
    }
    didChangeAttributes() {
      if (this.isPreviewable()) return this.preloadURL();
    }
    isPending() {
      return null != this.file && !(this.getURL() || this.getHref());
    }
    isPreviewable() {
      return this.attributes.has("previewable") ? this.attributes.get("previewable") : _Vi.previewablePattern.test(this.getContentType());
    }
    getType() {
      return this.hasContent() ? "content" : this.isPreviewable() ? "preview" : "file";
    }
    getURL() {
      return this.attributes.get("url");
    }
    getHref() {
      return this.attributes.get("href");
    }
    getFilename() {
      return this.attributes.get("filename") || "";
    }
    getFilesize() {
      return this.attributes.get("filesize");
    }
    getFormattedFilesize() {
      const t3 = this.attributes.get("filesize");
      return "number" == typeof t3 ? h.formatter(t3) : "";
    }
    getExtension() {
      var t3;
      return null === (t3 = this.getFilename().match(/\.(\w+)$/)) || void 0 === t3 ? void 0 : t3[1].toLowerCase();
    }
    getContentType() {
      return this.attributes.get("contentType");
    }
    hasContent() {
      return this.attributes.has("content");
    }
    getContent() {
      return this.attributes.get("content");
    }
    getWidth() {
      return this.attributes.get("width");
    }
    getHeight() {
      return this.attributes.get("height");
    }
    getFile() {
      return this.file;
    }
    setFile(t3) {
      if (this.file = t3, this.isPreviewable()) return this.preloadFile();
    }
    releaseFile() {
      this.releasePreloadedFile(), this.file = null;
    }
    getUploadProgress() {
      return null != this.uploadProgress ? this.uploadProgress : 0;
    }
    setUploadProgress(t3) {
      var e2, i2;
      if (this.uploadProgress !== t3) return this.uploadProgress = t3, null === (e2 = this.uploadProgressDelegate) || void 0 === e2 || null === (i2 = e2.attachmentDidChangeUploadProgress) || void 0 === i2 ? void 0 : i2.call(e2, this);
    }
    toJSON() {
      return this.getAttributes();
    }
    getCacheKey() {
      return [super.getCacheKey(...arguments), this.attributes.getCacheKey(), this.getPreviewURL()].join("/");
    }
    getPreviewURL() {
      return this.previewURL || this.preloadingURL;
    }
    setPreviewURL(t3) {
      var e2, i2, n2, r3;
      if (t3 !== this.getPreviewURL()) return this.previewURL = t3, null === (e2 = this.previewDelegate) || void 0 === e2 || null === (i2 = e2.attachmentDidChangeAttributes) || void 0 === i2 || i2.call(e2, this), null === (n2 = this.delegate) || void 0 === n2 || null === (r3 = n2.attachmentDidChangePreviewURL) || void 0 === r3 ? void 0 : r3.call(n2, this);
    }
    preloadURL() {
      return this.preload(this.getURL(), this.releaseFile);
    }
    preloadFile() {
      if (this.file) return this.fileObjectURL = URL.createObjectURL(this.file), this.preload(this.fileObjectURL);
    }
    releasePreloadedFile() {
      this.fileObjectURL && (URL.revokeObjectURL(this.fileObjectURL), this.fileObjectURL = null);
    }
    preload(t3, e2) {
      if (t3 && t3 !== this.getPreviewURL()) {
        this.preloadingURL = t3;
        return new Ui(t3).then(((i2) => {
          let { width: n2, height: r3 } = i2;
          return this.getWidth() && this.getHeight() || this.setAttributes({ width: n2, height: r3 }), this.preloadingURL = null, this.setPreviewURL(t3), null == e2 ? void 0 : e2();
        })).catch((() => (this.preloadingURL = null, null == e2 ? void 0 : e2())));
      }
    }
  };
  Di(Vi, "previewablePattern", /^image(\/(gif|png|webp|jpe?g)|$)/);
  var zi = class _zi extends Wi {
    static fromJSON(t3) {
      return new this(Vi.fromJSON(t3.attachment), t3.attributes);
    }
    constructor(t3) {
      super(...arguments), this.attachment = t3, this.length = 1, this.ensureAttachmentExclusivelyHasAttribute("href"), this.attachment.hasContent() || this.removeProhibitedAttributes();
    }
    ensureAttachmentExclusivelyHasAttribute(t3) {
      this.hasAttribute(t3) && (this.attachment.hasAttribute(t3) || this.attachment.setAttributes(this.attributes.slice([t3])), this.attributes = this.attributes.remove(t3));
    }
    removeProhibitedAttributes() {
      const t3 = this.attributes.slice(_zi.permittedAttributes);
      t3.isEqualTo(this.attributes) || (this.attributes = t3);
    }
    getValue() {
      return this.attachment;
    }
    isSerializable() {
      return !this.attachment.isPending();
    }
    getCaption() {
      return this.attributes.get("caption") || "";
    }
    isEqualTo(t3) {
      var e2;
      return super.isEqualTo(t3) && this.attachment.id === (null == t3 || null === (e2 = t3.attachment) || void 0 === e2 ? void 0 : e2.id);
    }
    toString() {
      return "\uFFFC";
    }
    toJSON() {
      const t3 = super.toJSON(...arguments);
      return t3.attachment = this.attachment, t3;
    }
    getCacheKey() {
      return [super.getCacheKey(...arguments), this.attachment.getCacheKey()].join("/");
    }
    toConsole() {
      return JSON.stringify(this.toString());
    }
  };
  Di(zi, "permittedAttributes", ["caption", "presentation"]), Wi.registerType("attachment", zi);
  var qi = class extends Wi {
    static fromJSON(t3) {
      return new this(t3.string, t3.attributes);
    }
    constructor(t3) {
      super(...arguments), this.string = ((t4) => t4.replace(/\r\n?/g, "\n"))(t3), this.length = this.string.length;
    }
    getValue() {
      return this.string;
    }
    toString() {
      return this.string.toString();
    }
    isBlockBreak() {
      return "\n" === this.toString() && true === this.getAttribute("blockBreak");
    }
    toJSON() {
      const t3 = super.toJSON(...arguments);
      return t3.string = this.string, t3;
    }
    canBeConsolidatedWith(t3) {
      return t3 && this.hasSameConstructorAs(t3) && this.hasSameAttributesAsPiece(t3);
    }
    consolidateWith(t3) {
      return new this.constructor(this.toString() + t3.toString(), this.attributes);
    }
    splitAtOffset(t3) {
      let e2, i2;
      return 0 === t3 ? (e2 = null, i2 = this) : t3 === this.length ? (e2 = this, i2 = null) : (e2 = new this.constructor(this.string.slice(0, t3), this.attributes), i2 = new this.constructor(this.string.slice(t3), this.attributes)), [e2, i2];
    }
    toConsole() {
      let { string: t3 } = this;
      return t3.length > 15 && (t3 = t3.slice(0, 14) + "\u2026"), JSON.stringify(t3.toString());
    }
  };
  Wi.registerType("string", qi);
  var Hi = class extends rt {
    static box(t3) {
      return t3 instanceof this ? t3 : new this(t3);
    }
    constructor() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
      super(...arguments), this.objects = t3.slice(0), this.length = this.objects.length;
    }
    indexOf(t3) {
      return this.objects.indexOf(t3);
    }
    splice() {
      for (var t3 = arguments.length, e2 = new Array(t3), i2 = 0; i2 < t3; i2++) e2[i2] = arguments[i2];
      return new this.constructor(st(this.objects, ...e2));
    }
    eachObject(t3) {
      return this.objects.map(((e2, i2) => t3(e2, i2)));
    }
    insertObjectAtIndex(t3, e2) {
      return this.splice(e2, 0, t3);
    }
    insertSplittableListAtIndex(t3, e2) {
      return this.splice(e2, 0, ...t3.objects);
    }
    insertSplittableListAtPosition(t3, e2) {
      const [i2, n2] = this.splitObjectAtPosition(e2);
      return new this.constructor(i2).insertSplittableListAtIndex(t3, n2);
    }
    editObjectAtIndex(t3, e2) {
      return this.replaceObjectAtIndex(e2(this.objects[t3]), t3);
    }
    replaceObjectAtIndex(t3, e2) {
      return this.splice(e2, 1, t3);
    }
    removeObjectAtIndex(t3) {
      return this.splice(t3, 1);
    }
    getObjectAtIndex(t3) {
      return this.objects[t3];
    }
    getSplittableListInRange(t3) {
      const [e2, i2, n2] = this.splitObjectsAtRange(t3);
      return new this.constructor(e2.slice(i2, n2 + 1));
    }
    selectSplittableList(t3) {
      const e2 = this.objects.filter(((e3) => t3(e3)));
      return new this.constructor(e2);
    }
    removeObjectsInRange(t3) {
      const [e2, i2, n2] = this.splitObjectsAtRange(t3);
      return new this.constructor(e2).splice(i2, n2 - i2 + 1);
    }
    transformObjectsInRange(t3, e2) {
      const [i2, n2, r3] = this.splitObjectsAtRange(t3), o2 = i2.map(((t4, i3) => n2 <= i3 && i3 <= r3 ? e2(t4) : t4));
      return new this.constructor(o2);
    }
    splitObjectsAtRange(t3) {
      let e2, [i2, n2, r3] = this.splitObjectAtPosition(Ki(t3));
      return [i2, e2] = new this.constructor(i2).splitObjectAtPosition(Gi(t3) + r3), [i2, n2, e2 - 1];
    }
    getObjectAtPosition(t3) {
      const { index: e2 } = this.findIndexAndOffsetAtPosition(t3);
      return this.objects[e2];
    }
    splitObjectAtPosition(t3) {
      let e2, i2;
      const { index: n2, offset: r3 } = this.findIndexAndOffsetAtPosition(t3), o2 = this.objects.slice(0);
      if (null != n2) if (0 === r3) e2 = n2, i2 = 0;
      else {
        const t4 = this.getObjectAtIndex(n2), [s2, a2] = t4.splitAtOffset(r3);
        o2.splice(n2, 1, s2, a2), e2 = n2 + 1, i2 = s2.getLength() - r3;
      }
      else e2 = o2.length, i2 = 0;
      return [o2, e2, i2];
    }
    consolidate() {
      const t3 = [];
      let e2 = this.objects[0];
      return this.objects.slice(1).forEach(((i2) => {
        var n2, r3;
        null !== (n2 = (r3 = e2).canBeConsolidatedWith) && void 0 !== n2 && n2.call(r3, i2) ? e2 = e2.consolidateWith(i2) : (t3.push(e2), e2 = i2);
      })), e2 && t3.push(e2), new this.constructor(t3);
    }
    consolidateFromIndexToIndex(t3, e2) {
      const i2 = this.objects.slice(0).slice(t3, e2 + 1), n2 = new this.constructor(i2).consolidate().toArray();
      return this.splice(t3, i2.length, ...n2);
    }
    findIndexAndOffsetAtPosition(t3) {
      let e2, i2 = 0;
      for (e2 = 0; e2 < this.objects.length; e2++) {
        const n2 = i2 + this.objects[e2].getLength();
        if (i2 <= t3 && t3 < n2) return { index: e2, offset: t3 - i2 };
        i2 = n2;
      }
      return { index: null, offset: null };
    }
    findPositionAtIndexAndOffset(t3, e2) {
      let i2 = 0;
      for (let n2 = 0; n2 < this.objects.length; n2++) {
        const r3 = this.objects[n2];
        if (n2 < t3) i2 += r3.getLength();
        else if (n2 === t3) {
          i2 += e2;
          break;
        }
      }
      return i2;
    }
    getEndPosition() {
      return null == this.endPosition && (this.endPosition = 0, this.objects.forEach(((t3) => this.endPosition += t3.getLength()))), this.endPosition;
    }
    toString() {
      return this.objects.join("");
    }
    toArray() {
      return this.objects.slice(0);
    }
    toJSON() {
      return this.toArray();
    }
    isEqualTo(t3) {
      return super.isEqualTo(...arguments) || Ji(this.objects, null == t3 ? void 0 : t3.objects);
    }
    contentsForInspection() {
      return { objects: "[".concat(this.objects.map(((t3) => t3.inspect())).join(", "), "]") };
    }
  };
  var Ji = function(t3) {
    let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
    if (t3.length !== e2.length) return false;
    let i2 = true;
    for (let n2 = 0; n2 < t3.length; n2++) {
      const r3 = t3[n2];
      i2 && !r3.isEqualTo(e2[n2]) && (i2 = false);
    }
    return i2;
  };
  var Ki = (t3) => t3[0];
  var Gi = (t3) => t3[1];
  var Yi = class extends rt {
    static textForAttachmentWithAttributes(t3, e2) {
      return new this([new zi(t3, e2)]);
    }
    static textForStringWithAttributes(t3, e2) {
      return new this([new qi(t3, e2)]);
    }
    static fromJSON(t3) {
      return new this(Array.from(t3).map(((t4) => Wi.fromJSON(t4))));
    }
    constructor() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
      super(...arguments);
      const e2 = t3.filter(((t4) => !t4.isEmpty()));
      this.pieceList = new Hi(e2);
    }
    copy() {
      return this.copyWithPieceList(this.pieceList);
    }
    copyWithPieceList(t3) {
      return new this.constructor(t3.consolidate().toArray());
    }
    copyUsingObjectMap(t3) {
      const e2 = this.getPieces().map(((e3) => t3.find(e3) || e3));
      return new this.constructor(e2);
    }
    appendText(t3) {
      return this.insertTextAtPosition(t3, this.getLength());
    }
    insertTextAtPosition(t3, e2) {
      return this.copyWithPieceList(this.pieceList.insertSplittableListAtPosition(t3.pieceList, e2));
    }
    removeTextAtRange(t3) {
      return this.copyWithPieceList(this.pieceList.removeObjectsInRange(t3));
    }
    replaceTextAtRange(t3, e2) {
      return this.removeTextAtRange(e2).insertTextAtPosition(t3, e2[0]);
    }
    moveTextFromRangeToPosition(t3, e2) {
      if (t3[0] <= e2 && e2 <= t3[1]) return;
      const i2 = this.getTextAtRange(t3), n2 = i2.getLength();
      return t3[0] < e2 && (e2 -= n2), this.removeTextAtRange(t3).insertTextAtPosition(i2, e2);
    }
    addAttributeAtRange(t3, e2, i2) {
      const n2 = {};
      return n2[t3] = e2, this.addAttributesAtRange(n2, i2);
    }
    addAttributesAtRange(t3, e2) {
      return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e2, ((e3) => e3.copyWithAdditionalAttributes(t3))));
    }
    removeAttributeAtRange(t3, e2) {
      return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e2, ((e3) => e3.copyWithoutAttribute(t3))));
    }
    setAttributesAtRange(t3, e2) {
      return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e2, ((e3) => e3.copyWithAttributes(t3))));
    }
    getAttributesAtPosition(t3) {
      var e2;
      return (null === (e2 = this.pieceList.getObjectAtPosition(t3)) || void 0 === e2 ? void 0 : e2.getAttributes()) || {};
    }
    getCommonAttributes() {
      const t3 = Array.from(this.pieceList.toArray()).map(((t4) => t4.getAttributes()));
      return Ht.fromCommonAttributesOfObjects(t3).toObject();
    }
    getCommonAttributesAtRange(t3) {
      return this.getTextAtRange(t3).getCommonAttributes() || {};
    }
    getExpandedRangeForAttributeAtOffset(t3, e2) {
      let i2, n2 = i2 = e2;
      const r3 = this.getLength();
      for (; n2 > 0 && this.getCommonAttributesAtRange([n2 - 1, i2])[t3]; ) n2--;
      for (; i2 < r3 && this.getCommonAttributesAtRange([e2, i2 + 1])[t3]; ) i2++;
      return [n2, i2];
    }
    getTextAtRange(t3) {
      return this.copyWithPieceList(this.pieceList.getSplittableListInRange(t3));
    }
    getStringAtRange(t3) {
      return this.pieceList.getSplittableListInRange(t3).toString();
    }
    getStringAtPosition(t3) {
      return this.getStringAtRange([t3, t3 + 1]);
    }
    startsWithString(t3) {
      return this.getStringAtRange([0, t3.length]) === t3;
    }
    endsWithString(t3) {
      const e2 = this.getLength();
      return this.getStringAtRange([e2 - t3.length, e2]) === t3;
    }
    getAttachmentPieces() {
      return this.pieceList.toArray().filter(((t3) => !!t3.attachment));
    }
    getAttachments() {
      return this.getAttachmentPieces().map(((t3) => t3.attachment));
    }
    getAttachmentAndPositionById(t3) {
      let e2 = 0;
      for (const n2 of this.pieceList.toArray()) {
        var i2;
        if ((null === (i2 = n2.attachment) || void 0 === i2 ? void 0 : i2.id) === t3) return { attachment: n2.attachment, position: e2 };
        e2 += n2.length;
      }
      return { attachment: null, position: null };
    }
    getAttachmentById(t3) {
      const { attachment: e2 } = this.getAttachmentAndPositionById(t3);
      return e2;
    }
    getRangeOfAttachment(t3) {
      const e2 = this.getAttachmentAndPositionById(t3.id), i2 = e2.position;
      if (t3 = e2.attachment) return [i2, i2 + 1];
    }
    updateAttributesForAttachment(t3, e2) {
      const i2 = this.getRangeOfAttachment(e2);
      return i2 ? this.addAttributesAtRange(t3, i2) : this;
    }
    getLength() {
      return this.pieceList.getEndPosition();
    }
    isEmpty() {
      return 0 === this.getLength();
    }
    isEqualTo(t3) {
      var e2;
      return super.isEqualTo(t3) || (null == t3 || null === (e2 = t3.pieceList) || void 0 === e2 ? void 0 : e2.isEqualTo(this.pieceList));
    }
    isBlockBreak() {
      return 1 === this.getLength() && this.pieceList.getObjectAtIndex(0).isBlockBreak();
    }
    eachPiece(t3) {
      return this.pieceList.eachObject(t3);
    }
    getPieces() {
      return this.pieceList.toArray();
    }
    getPieceAtPosition(t3) {
      return this.pieceList.getObjectAtPosition(t3);
    }
    contentsForInspection() {
      return { pieceList: this.pieceList.inspect() };
    }
    toSerializableText() {
      const t3 = this.pieceList.selectSplittableList(((t4) => t4.isSerializable()));
      return this.copyWithPieceList(t3);
    }
    toString() {
      return this.pieceList.toString();
    }
    toJSON() {
      return this.pieceList.toJSON();
    }
    toConsole() {
      return JSON.stringify(this.pieceList.toArray().map(((t3) => JSON.parse(t3.toConsole()))));
    }
    getDirection() {
      return lt(this.toString());
    }
    isRTL() {
      return "rtl" === this.getDirection();
    }
  };
  var Xi = class _Xi extends rt {
    static fromJSON(t3) {
      return new this(Yi.fromJSON(t3.text), t3.attributes, t3.htmlAttributes);
    }
    constructor(t3, e2, i2) {
      super(...arguments), this.text = $i(t3 || new Yi()), this.attributes = e2 || [], this.htmlAttributes = i2 || {};
    }
    isEmpty() {
      return this.text.isBlockBreak();
    }
    isEqualTo(t3) {
      return !!super.isEqualTo(t3) || this.text.isEqualTo(null == t3 ? void 0 : t3.text) && ot(this.attributes, null == t3 ? void 0 : t3.attributes) && Tt(this.htmlAttributes, null == t3 ? void 0 : t3.htmlAttributes);
    }
    copyWithText(t3) {
      return new _Xi(t3, this.attributes, this.htmlAttributes);
    }
    copyWithoutText() {
      return this.copyWithText(null);
    }
    copyWithAttributes(t3) {
      return new _Xi(this.text, t3, this.htmlAttributes);
    }
    copyWithoutAttributes() {
      return this.copyWithAttributes(null);
    }
    copyUsingObjectMap(t3) {
      const e2 = t3.find(this.text);
      return e2 ? this.copyWithText(e2) : this.copyWithText(this.text.copyUsingObjectMap(t3));
    }
    addAttribute(t3) {
      const e2 = this.attributes.concat(rn(t3));
      return this.copyWithAttributes(e2);
    }
    addHTMLAttribute(t3, e2) {
      const i2 = Object.assign({}, this.htmlAttributes, { [t3]: e2 });
      return new _Xi(this.text, this.attributes, i2);
    }
    removeAttribute(t3) {
      const { listAttribute: e2 } = mt(t3), i2 = sn(sn(this.attributes, t3), e2);
      return this.copyWithAttributes(i2);
    }
    removeLastAttribute() {
      return this.removeAttribute(this.getLastAttribute());
    }
    getLastAttribute() {
      return on(this.attributes);
    }
    getAttributes() {
      return this.attributes.slice(0);
    }
    getAttributeLevel() {
      return this.attributes.length;
    }
    getAttributeAtLevel(t3) {
      return this.attributes[t3 - 1];
    }
    hasAttribute(t3) {
      return this.attributes.includes(t3);
    }
    hasAttributes() {
      return this.getAttributeLevel() > 0;
    }
    getLastNestableAttribute() {
      return on(this.getNestableAttributes());
    }
    getNestableAttributes() {
      return this.attributes.filter(((t3) => mt(t3).nestable));
    }
    getNestingLevel() {
      return this.getNestableAttributes().length;
    }
    decreaseNestingLevel() {
      const t3 = this.getLastNestableAttribute();
      return t3 ? this.removeAttribute(t3) : this;
    }
    increaseNestingLevel() {
      const t3 = this.getLastNestableAttribute();
      if (t3) {
        const e2 = this.attributes.lastIndexOf(t3), i2 = st(this.attributes, e2 + 1, 0, ...rn(t3));
        return this.copyWithAttributes(i2);
      }
      return this;
    }
    getListItemAttributes() {
      return this.attributes.filter(((t3) => mt(t3).listAttribute));
    }
    isListItem() {
      var t3;
      return null === (t3 = mt(this.getLastAttribute())) || void 0 === t3 ? void 0 : t3.listAttribute;
    }
    isTerminalBlock() {
      var t3;
      return null === (t3 = mt(this.getLastAttribute())) || void 0 === t3 ? void 0 : t3.terminal;
    }
    breaksOnReturn() {
      var t3;
      return null === (t3 = mt(this.getLastAttribute())) || void 0 === t3 ? void 0 : t3.breakOnReturn;
    }
    findLineBreakInDirectionFromPosition(t3, e2) {
      const i2 = this.toString();
      let n2;
      switch (t3) {
        case "forward":
          n2 = i2.indexOf("\n", e2);
          break;
        case "backward":
          n2 = i2.slice(0, e2).lastIndexOf("\n");
      }
      if (-1 !== n2) return n2;
    }
    contentsForInspection() {
      return { text: this.text.inspect(), attributes: this.attributes };
    }
    toString() {
      return this.text.toString();
    }
    toJSON() {
      return { text: this.text, attributes: this.attributes, htmlAttributes: this.htmlAttributes };
    }
    getDirection() {
      return this.text.getDirection();
    }
    isRTL() {
      return this.text.isRTL();
    }
    getLength() {
      return this.text.getLength();
    }
    canBeConsolidatedWith(t3) {
      return !this.hasAttributes() && !t3.hasAttributes() && this.getDirection() === t3.getDirection();
    }
    consolidateWith(t3) {
      const e2 = Yi.textForStringWithAttributes("\n"), i2 = this.getTextWithoutBlockBreak().appendText(e2);
      return this.copyWithText(i2.appendText(t3.text));
    }
    splitAtOffset(t3) {
      let e2, i2;
      return 0 === t3 ? (e2 = null, i2 = this) : t3 === this.getLength() ? (e2 = this, i2 = null) : (e2 = this.copyWithText(this.text.getTextAtRange([0, t3])), i2 = this.copyWithText(this.text.getTextAtRange([t3, this.getLength()]))), [e2, i2];
    }
    getBlockBreakPosition() {
      return this.text.getLength() - 1;
    }
    getTextWithoutBlockBreak() {
      return en(this.text) ? this.text.getTextAtRange([0, this.getBlockBreakPosition()]) : this.text.copy();
    }
    canBeGrouped(t3) {
      return this.attributes[t3];
    }
    canBeGroupedWith(t3, e2) {
      const i2 = t3.getAttributes(), r3 = i2[e2], o2 = this.attributes[e2];
      return o2 === r3 && !(false === mt(o2).group && !(() => {
        if (!dt) {
          dt = [];
          for (const t4 in n) {
            const { listAttribute: e3 } = n[t4];
            null != e3 && dt.push(e3);
          }
        }
        return dt;
      })().includes(i2[e2 + 1])) && (this.getDirection() === t3.getDirection() || t3.isEmpty());
    }
  };
  var $i = function(t3) {
    return t3 = Zi(t3), t3 = tn(t3);
  };
  var Zi = function(t3) {
    let e2 = false;
    const i2 = t3.getPieces();
    let n2 = i2.slice(0, i2.length - 1);
    const r3 = i2[i2.length - 1];
    return r3 ? (n2 = n2.map(((t4) => t4.isBlockBreak() ? (e2 = true, nn(t4)) : t4)), e2 ? new Yi([...n2, r3]) : t3) : t3;
  };
  var Qi = Yi.textForStringWithAttributes("\n", { blockBreak: true });
  var tn = function(t3) {
    return en(t3) ? t3 : t3.appendText(Qi);
  };
  var en = function(t3) {
    const e2 = t3.getLength();
    if (0 === e2) return false;
    return t3.getTextAtRange([e2 - 1, e2]).isBlockBreak();
  };
  var nn = (t3) => t3.copyWithoutAttribute("blockBreak");
  var rn = function(t3) {
    const { listAttribute: e2 } = mt(t3);
    return e2 ? [e2, t3] : [t3];
  };
  var on = (t3) => t3.slice(-1)[0];
  var sn = function(t3, e2) {
    const i2 = t3.lastIndexOf(e2);
    return -1 === i2 ? t3 : st(t3, i2, 1);
  };
  var an = class extends rt {
    static fromJSON(t3) {
      return new this(Array.from(t3).map(((t4) => Xi.fromJSON(t4))));
    }
    static fromString(t3, e2) {
      const i2 = Yi.textForStringWithAttributes(t3, e2);
      return new this([new Xi(i2)]);
    }
    constructor() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
      super(...arguments), 0 === t3.length && (t3 = [new Xi()]), this.blockList = Hi.box(t3);
    }
    isEmpty() {
      const t3 = this.getBlockAtIndex(0);
      return 1 === this.blockList.length && t3.isEmpty() && !t3.hasAttributes();
    }
    copy() {
      const t3 = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).consolidateBlocks ? this.blockList.consolidate().toArray() : this.blockList.toArray();
      return new this.constructor(t3);
    }
    copyUsingObjectsFromDocument(t3) {
      const e2 = new Zt(t3.getObjects());
      return this.copyUsingObjectMap(e2);
    }
    copyUsingObjectMap(t3) {
      const e2 = this.getBlocks().map(((e3) => t3.find(e3) || e3.copyUsingObjectMap(t3)));
      return new this.constructor(e2);
    }
    copyWithBaseBlockAttributes() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
      const e2 = this.getBlocks().map(((e3) => {
        const i2 = t3.concat(e3.getAttributes());
        return e3.copyWithAttributes(i2);
      }));
      return new this.constructor(e2);
    }
    replaceBlock(t3, e2) {
      const i2 = this.blockList.indexOf(t3);
      return -1 === i2 ? this : new this.constructor(this.blockList.replaceObjectAtIndex(e2, i2));
    }
    insertDocumentAtRange(t3, e2) {
      const { blockList: i2 } = t3;
      e2 = wt(e2);
      let [n2] = e2;
      const { index: r3, offset: o2 } = this.locationFromPosition(n2);
      let s2 = this;
      const a2 = this.getBlockAtPosition(n2);
      return Lt(e2) && a2.isEmpty() && !a2.hasAttributes() ? s2 = new this.constructor(s2.blockList.removeObjectAtIndex(r3)) : a2.getBlockBreakPosition() === o2 && n2++, s2 = s2.removeTextAtRange(e2), new this.constructor(s2.blockList.insertSplittableListAtPosition(i2, n2));
    }
    mergeDocumentAtRange(t3, e2) {
      let i2, n2;
      e2 = wt(e2);
      const [r3] = e2, o2 = this.locationFromPosition(r3), s2 = this.getBlockAtIndex(o2.index).getAttributes(), a2 = t3.getBaseBlockAttributes(), l3 = s2.slice(-a2.length);
      if (ot(a2, l3)) {
        const e3 = s2.slice(0, -a2.length);
        i2 = t3.copyWithBaseBlockAttributes(e3);
      } else i2 = t3.copy({ consolidateBlocks: true }).copyWithBaseBlockAttributes(s2);
      const c2 = i2.getBlockCount(), u2 = i2.getBlockAtIndex(0);
      if (ot(s2, u2.getAttributes())) {
        const t4 = u2.getTextWithoutBlockBreak();
        if (n2 = this.insertTextAtRange(t4, e2), c2 > 1) {
          i2 = new this.constructor(i2.getBlocks().slice(1));
          const e3 = r3 + t4.getLength();
          n2 = n2.insertDocumentAtRange(i2, e3);
        }
      } else n2 = this.insertDocumentAtRange(i2, e2);
      return n2;
    }
    insertTextAtRange(t3, e2) {
      e2 = wt(e2);
      const [i2] = e2, { index: n2, offset: r3 } = this.locationFromPosition(i2), o2 = this.removeTextAtRange(e2);
      return new this.constructor(o2.blockList.editObjectAtIndex(n2, ((e3) => e3.copyWithText(e3.text.insertTextAtPosition(t3, r3)))));
    }
    removeTextAtRange(t3) {
      let e2;
      t3 = wt(t3);
      const [i2, n2] = t3;
      if (Lt(t3)) return this;
      const [r3, o2] = Array.from(this.locationRangeFromRange(t3)), s2 = r3.index, a2 = r3.offset, l3 = this.getBlockAtIndex(s2), c2 = o2.index, u2 = o2.offset, h2 = this.getBlockAtIndex(c2);
      if (n2 - i2 == 1 && l3.getBlockBreakPosition() === a2 && h2.getBlockBreakPosition() !== u2 && "\n" === h2.text.getStringAtPosition(u2)) e2 = this.blockList.editObjectAtIndex(c2, ((t4) => t4.copyWithText(t4.text.removeTextAtRange([u2, u2 + 1]))));
      else {
        let t4;
        const i3 = l3.text.getTextAtRange([0, a2]), n3 = h2.text.getTextAtRange([u2, h2.getLength()]), r4 = i3.appendText(n3);
        t4 = s2 !== c2 && 0 === a2 && l3.getAttributeLevel() >= h2.getAttributeLevel() ? h2.copyWithText(r4) : l3.copyWithText(r4);
        const o3 = c2 + 1 - s2;
        e2 = this.blockList.splice(s2, o3, t4);
      }
      return new this.constructor(e2);
    }
    moveTextFromRangeToPosition(t3, e2) {
      let i2;
      t3 = wt(t3);
      const [n2, r3] = t3;
      if (n2 <= e2 && e2 <= r3) return this;
      let o2 = this.getDocumentAtRange(t3), s2 = this.removeTextAtRange(t3);
      const a2 = n2 < e2;
      a2 && (e2 -= o2.getLength());
      const [l3, ...c2] = o2.getBlocks();
      return 0 === c2.length ? (i2 = l3.getTextWithoutBlockBreak(), a2 && (e2 += 1)) : i2 = l3.text, s2 = s2.insertTextAtRange(i2, e2), 0 === c2.length ? s2 : (o2 = new this.constructor(c2), e2 += i2.getLength(), s2.insertDocumentAtRange(o2, e2));
    }
    addAttributeAtRange(t3, e2, i2) {
      let { blockList: n2 } = this;
      return this.eachBlockAtRange(i2, ((i3, r3, o2) => n2 = n2.editObjectAtIndex(o2, (function() {
        return mt(t3) ? i3.addAttribute(t3, e2) : r3[0] === r3[1] ? i3 : i3.copyWithText(i3.text.addAttributeAtRange(t3, e2, r3));
      })))), new this.constructor(n2);
    }
    addAttribute(t3, e2) {
      let { blockList: i2 } = this;
      return this.eachBlock(((n2, r3) => i2 = i2.editObjectAtIndex(r3, (() => n2.addAttribute(t3, e2))))), new this.constructor(i2);
    }
    removeAttributeAtRange(t3, e2) {
      let { blockList: i2 } = this;
      return this.eachBlockAtRange(e2, (function(e3, n2, r3) {
        mt(t3) ? i2 = i2.editObjectAtIndex(r3, (() => e3.removeAttribute(t3))) : n2[0] !== n2[1] && (i2 = i2.editObjectAtIndex(r3, (() => e3.copyWithText(e3.text.removeAttributeAtRange(t3, n2)))));
      })), new this.constructor(i2);
    }
    updateAttributesForAttachment(t3, e2) {
      const i2 = this.getRangeOfAttachment(e2), [n2] = Array.from(i2), { index: r3 } = this.locationFromPosition(n2), o2 = this.getTextAtIndex(r3);
      return new this.constructor(this.blockList.editObjectAtIndex(r3, ((i3) => i3.copyWithText(o2.updateAttributesForAttachment(t3, e2)))));
    }
    removeAttributeForAttachment(t3, e2) {
      const i2 = this.getRangeOfAttachment(e2);
      return this.removeAttributeAtRange(t3, i2);
    }
    setHTMLAttributeAtPosition(t3, e2, i2) {
      const n2 = this.getBlockAtPosition(t3), r3 = n2.addHTMLAttribute(e2, i2);
      return this.replaceBlock(n2, r3);
    }
    insertBlockBreakAtRange(t3) {
      let e2;
      t3 = wt(t3);
      const [i2] = t3, { offset: n2 } = this.locationFromPosition(i2), r3 = this.removeTextAtRange(t3);
      return 0 === n2 && (e2 = [new Xi()]), new this.constructor(r3.blockList.insertSplittableListAtPosition(new Hi(e2), i2));
    }
    applyBlockAttributeAtRange(t3, e2, i2) {
      const n2 = this.expandRangeToLineBreaksAndSplitBlocks(i2);
      let r3 = n2.document;
      i2 = n2.range;
      const o2 = mt(t3);
      if (o2.listAttribute) {
        r3 = r3.removeLastListAttributeAtRange(i2, { exceptAttributeName: t3 });
        const e3 = r3.convertLineBreaksToBlockBreaksInRange(i2);
        r3 = e3.document, i2 = e3.range;
      } else r3 = o2.exclusive ? r3.removeBlockAttributesAtRange(i2) : o2.terminal ? r3.removeLastTerminalAttributeAtRange(i2) : r3.consolidateBlocksAtRange(i2);
      return r3.addAttributeAtRange(t3, e2, i2);
    }
    removeLastListAttributeAtRange(t3) {
      let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, { blockList: i2 } = this;
      return this.eachBlockAtRange(t3, (function(t4, n2, r3) {
        const o2 = t4.getLastAttribute();
        o2 && mt(o2).listAttribute && o2 !== e2.exceptAttributeName && (i2 = i2.editObjectAtIndex(r3, (() => t4.removeAttribute(o2))));
      })), new this.constructor(i2);
    }
    removeLastTerminalAttributeAtRange(t3) {
      let { blockList: e2 } = this;
      return this.eachBlockAtRange(t3, (function(t4, i2, n2) {
        const r3 = t4.getLastAttribute();
        r3 && mt(r3).terminal && (e2 = e2.editObjectAtIndex(n2, (() => t4.removeAttribute(r3))));
      })), new this.constructor(e2);
    }
    removeBlockAttributesAtRange(t3) {
      let { blockList: e2 } = this;
      return this.eachBlockAtRange(t3, (function(t4, i2, n2) {
        t4.hasAttributes() && (e2 = e2.editObjectAtIndex(n2, (() => t4.copyWithoutAttributes())));
      })), new this.constructor(e2);
    }
    expandRangeToLineBreaksAndSplitBlocks(t3) {
      let e2;
      t3 = wt(t3);
      let [i2, n2] = t3;
      const r3 = this.locationFromPosition(i2), o2 = this.locationFromPosition(n2);
      let s2 = this;
      const a2 = s2.getBlockAtIndex(r3.index);
      if (r3.offset = a2.findLineBreakInDirectionFromPosition("backward", r3.offset), null != r3.offset && (e2 = s2.positionFromLocation(r3), s2 = s2.insertBlockBreakAtRange([e2, e2 + 1]), o2.index += 1, o2.offset -= s2.getBlockAtIndex(r3.index).getLength(), r3.index += 1), r3.offset = 0, 0 === o2.offset && o2.index > r3.index) o2.index -= 1, o2.offset = s2.getBlockAtIndex(o2.index).getBlockBreakPosition();
      else {
        const t4 = s2.getBlockAtIndex(o2.index);
        "\n" === t4.text.getStringAtRange([o2.offset - 1, o2.offset]) ? o2.offset -= 1 : o2.offset = t4.findLineBreakInDirectionFromPosition("forward", o2.offset), o2.offset !== t4.getBlockBreakPosition() && (e2 = s2.positionFromLocation(o2), s2 = s2.insertBlockBreakAtRange([e2, e2 + 1]));
      }
      return i2 = s2.positionFromLocation(r3), n2 = s2.positionFromLocation(o2), { document: s2, range: t3 = wt([i2, n2]) };
    }
    convertLineBreaksToBlockBreaksInRange(t3) {
      t3 = wt(t3);
      let [e2] = t3;
      const i2 = this.getStringAtRange(t3).slice(0, -1);
      let n2 = this;
      return i2.replace(/.*?\n/g, (function(t4) {
        e2 += t4.length, n2 = n2.insertBlockBreakAtRange([e2 - 1, e2]);
      })), { document: n2, range: t3 };
    }
    consolidateBlocksAtRange(t3) {
      t3 = wt(t3);
      const [e2, i2] = t3, n2 = this.locationFromPosition(e2).index, r3 = this.locationFromPosition(i2).index;
      return new this.constructor(this.blockList.consolidateFromIndexToIndex(n2, r3));
    }
    getDocumentAtRange(t3) {
      t3 = wt(t3);
      const e2 = this.blockList.getSplittableListInRange(t3).toArray();
      return new this.constructor(e2);
    }
    getStringAtRange(t3) {
      let e2;
      const i2 = t3 = wt(t3);
      return i2[i2.length - 1] !== this.getLength() && (e2 = -1), this.getDocumentAtRange(t3).toString().slice(0, e2);
    }
    getBlockAtIndex(t3) {
      return this.blockList.getObjectAtIndex(t3);
    }
    getBlockAtPosition(t3) {
      const { index: e2 } = this.locationFromPosition(t3);
      return this.getBlockAtIndex(e2);
    }
    getTextAtIndex(t3) {
      var e2;
      return null === (e2 = this.getBlockAtIndex(t3)) || void 0 === e2 ? void 0 : e2.text;
    }
    getTextAtPosition(t3) {
      const { index: e2 } = this.locationFromPosition(t3);
      return this.getTextAtIndex(e2);
    }
    getPieceAtPosition(t3) {
      const { index: e2, offset: i2 } = this.locationFromPosition(t3);
      return this.getTextAtIndex(e2).getPieceAtPosition(i2);
    }
    getCharacterAtPosition(t3) {
      const { index: e2, offset: i2 } = this.locationFromPosition(t3);
      return this.getTextAtIndex(e2).getStringAtRange([i2, i2 + 1]);
    }
    getLength() {
      return this.blockList.getEndPosition();
    }
    getBlocks() {
      return this.blockList.toArray();
    }
    getBlockCount() {
      return this.blockList.length;
    }
    getEditCount() {
      return this.editCount;
    }
    eachBlock(t3) {
      return this.blockList.eachObject(t3);
    }
    eachBlockAtRange(t3, e2) {
      let i2, n2;
      t3 = wt(t3);
      const [r3, o2] = t3, s2 = this.locationFromPosition(r3), a2 = this.locationFromPosition(o2);
      if (s2.index === a2.index) return i2 = this.getBlockAtIndex(s2.index), n2 = [s2.offset, a2.offset], e2(i2, n2, s2.index);
      for (let t4 = s2.index; t4 <= a2.index; t4++) if (i2 = this.getBlockAtIndex(t4), i2) {
        switch (t4) {
          case s2.index:
            n2 = [s2.offset, i2.text.getLength()];
            break;
          case a2.index:
            n2 = [0, a2.offset];
            break;
          default:
            n2 = [0, i2.text.getLength()];
        }
        e2(i2, n2, t4);
      }
    }
    getCommonAttributesAtRange(t3) {
      t3 = wt(t3);
      const [e2] = t3;
      if (Lt(t3)) return this.getCommonAttributesAtPosition(e2);
      {
        const e3 = [], i2 = [];
        return this.eachBlockAtRange(t3, (function(t4, n2) {
          if (n2[0] !== n2[1]) return e3.push(t4.text.getCommonAttributesAtRange(n2)), i2.push(ln(t4));
        })), Ht.fromCommonAttributesOfObjects(e3).merge(Ht.fromCommonAttributesOfObjects(i2)).toObject();
      }
    }
    getCommonAttributesAtPosition(t3) {
      let e2, i2;
      const { index: n2, offset: r3 } = this.locationFromPosition(t3), o2 = this.getBlockAtIndex(n2);
      if (!o2) return {};
      const s2 = ln(o2), a2 = o2.text.getAttributesAtPosition(r3), l3 = o2.text.getAttributesAtPosition(r3 - 1), c2 = Object.keys(W).filter(((t4) => W[t4].inheritable));
      for (e2 in l3) i2 = l3[e2], (i2 === a2[e2] || c2.includes(e2)) && (s2[e2] = i2);
      return s2;
    }
    getRangeOfCommonAttributeAtPosition(t3, e2) {
      const { index: i2, offset: n2 } = this.locationFromPosition(e2), r3 = this.getTextAtIndex(i2), [o2, s2] = Array.from(r3.getExpandedRangeForAttributeAtOffset(t3, n2)), a2 = this.positionFromLocation({ index: i2, offset: o2 }), l3 = this.positionFromLocation({ index: i2, offset: s2 });
      return wt([a2, l3]);
    }
    getBaseBlockAttributes() {
      let t3 = this.getBlockAtIndex(0).getAttributes();
      for (let e2 = 1; e2 < this.getBlockCount(); e2++) {
        const i2 = this.getBlockAtIndex(e2).getAttributes(), n2 = Math.min(t3.length, i2.length);
        t3 = (() => {
          const e3 = [];
          for (let r3 = 0; r3 < n2 && i2[r3] === t3[r3]; r3++) e3.push(i2[r3]);
          return e3;
        })();
      }
      return t3;
    }
    getAttachmentById(t3) {
      for (const e2 of this.getAttachments()) if (e2.id === t3) return e2;
    }
    getAttachmentPieces() {
      let t3 = [];
      return this.blockList.eachObject(((e2) => {
        let { text: i2 } = e2;
        return t3 = t3.concat(i2.getAttachmentPieces());
      })), t3;
    }
    getAttachments() {
      return this.getAttachmentPieces().map(((t3) => t3.attachment));
    }
    getRangeOfAttachment(t3) {
      let e2 = 0;
      const i2 = this.blockList.toArray();
      for (let n2 = 0; n2 < i2.length; n2++) {
        const { text: r3 } = i2[n2], o2 = r3.getRangeOfAttachment(t3);
        if (o2) return wt([e2 + o2[0], e2 + o2[1]]);
        e2 += r3.getLength();
      }
    }
    getLocationRangeOfAttachment(t3) {
      const e2 = this.getRangeOfAttachment(t3);
      return this.locationRangeFromRange(e2);
    }
    getAttachmentPieceForAttachment(t3) {
      for (const e2 of this.getAttachmentPieces()) if (e2.attachment === t3) return e2;
    }
    findRangesForBlockAttribute(t3) {
      let e2 = 0;
      const i2 = [];
      return this.getBlocks().forEach(((n2) => {
        const r3 = n2.getLength();
        n2.hasAttribute(t3) && i2.push([e2, e2 + r3]), e2 += r3;
      })), i2;
    }
    findRangesForTextAttribute(t3) {
      let { withValue: e2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, i2 = 0, n2 = [];
      const r3 = [];
      return this.getPieces().forEach(((o2) => {
        const s2 = o2.getLength();
        (function(i3) {
          return e2 ? i3.getAttribute(t3) === e2 : i3.hasAttribute(t3);
        })(o2) && (n2[1] === i2 ? n2[1] = i2 + s2 : r3.push(n2 = [i2, i2 + s2])), i2 += s2;
      })), r3;
    }
    locationFromPosition(t3) {
      const e2 = this.blockList.findIndexAndOffsetAtPosition(Math.max(0, t3));
      if (null != e2.index) return e2;
      {
        const t4 = this.getBlocks();
        return { index: t4.length - 1, offset: t4[t4.length - 1].getLength() };
      }
    }
    positionFromLocation(t3) {
      return this.blockList.findPositionAtIndexAndOffset(t3.index, t3.offset);
    }
    locationRangeFromPosition(t3) {
      return wt(this.locationFromPosition(t3));
    }
    locationRangeFromRange(t3) {
      if (!(t3 = wt(t3))) return;
      const [e2, i2] = Array.from(t3), n2 = this.locationFromPosition(e2), r3 = this.locationFromPosition(i2);
      return wt([n2, r3]);
    }
    rangeFromLocationRange(t3) {
      let e2;
      t3 = wt(t3);
      const i2 = this.positionFromLocation(t3[0]);
      return Lt(t3) || (e2 = this.positionFromLocation(t3[1])), wt([i2, e2]);
    }
    isEqualTo(t3) {
      return this.blockList.isEqualTo(null == t3 ? void 0 : t3.blockList);
    }
    getTexts() {
      return this.getBlocks().map(((t3) => t3.text));
    }
    getPieces() {
      const t3 = [];
      return Array.from(this.getTexts()).forEach(((e2) => {
        t3.push(...Array.from(e2.getPieces() || []));
      })), t3;
    }
    getObjects() {
      return this.getBlocks().concat(this.getTexts()).concat(this.getPieces());
    }
    toSerializableDocument() {
      const t3 = [];
      return this.blockList.eachObject(((e2) => t3.push(e2.copyWithText(e2.text.toSerializableText())))), new this.constructor(t3);
    }
    toString() {
      return this.blockList.toString();
    }
    toJSON() {
      return this.blockList.toJSON();
    }
    toConsole() {
      return JSON.stringify(this.blockList.toArray().map(((t3) => JSON.parse(t3.text.toConsole()))));
    }
  };
  var ln = function(t3) {
    const e2 = {}, i2 = t3.getLastAttribute();
    return i2 && (e2[i2] = true), e2;
  };
  var cn = function(t3) {
    let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    return { string: t3 = Wt(t3), attributes: e2, type: "string" };
  };
  var un = (t3, e2) => {
    try {
      return JSON.parse(t3.getAttribute("data-trix-".concat(e2)));
    } catch (t4) {
      return {};
    }
  };
  var hn = class extends q {
    static parse(t3, e2) {
      const i2 = new this(t3, e2);
      return i2.parse(), i2;
    }
    constructor(t3) {
      let { referenceElement: e2, purifyOptions: i2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      super(...arguments), this.html = t3, this.referenceElement = e2, this.purifyOptions = i2, this.blocks = [], this.blockElements = [], this.processedElements = [];
    }
    getDocument() {
      return an.fromJSON(this.blocks);
    }
    parse() {
      try {
        this.createHiddenContainer(), di.setHTML(this.containerElement, this.html, { purifyOptions: this.purifyOptions });
        const t3 = R(this.containerElement, { usingFilter: pn });
        for (; t3.nextNode(); ) this.processNode(t3.currentNode);
        return this.translateBlockElementMarginsToNewlines();
      } finally {
        this.removeHiddenContainer();
      }
    }
    createHiddenContainer() {
      return this.referenceElement ? (this.containerElement = this.referenceElement.cloneNode(false), this.containerElement.removeAttribute("id"), this.containerElement.setAttribute("data-trix-internal", ""), this.containerElement.style.display = "none", this.referenceElement.parentNode.insertBefore(this.containerElement, this.referenceElement.nextSibling)) : (this.containerElement = T({ tagName: "div", style: { display: "none" } }), document.body.appendChild(this.containerElement));
    }
    removeHiddenContainer() {
      return S(this.containerElement);
    }
    processNode(t3) {
      switch (t3.nodeType) {
        case Node.TEXT_NODE:
          if (!this.isInsignificantTextNode(t3)) return this.appendBlockForTextNode(t3), this.processTextNode(t3);
          break;
        case Node.ELEMENT_NODE:
          return this.appendBlockForElement(t3), this.processElement(t3);
      }
    }
    appendBlockForTextNode(t3) {
      const e2 = t3.parentNode;
      if (e2 === this.currentBlockElement && this.isBlockElement(t3.previousSibling)) return this.appendStringWithAttributes("\n");
      if (e2 === this.containerElement || this.isBlockElement(e2)) {
        var i2;
        const t4 = this.getBlockAttributes(e2), n2 = this.getBlockHTMLAttributes(e2);
        ot(t4, null === (i2 = this.currentBlock) || void 0 === i2 ? void 0 : i2.attributes) || (this.currentBlock = this.appendBlockForAttributesWithElement(t4, e2, n2), this.currentBlockElement = e2);
      }
    }
    appendBlockForElement(t3) {
      const e2 = this.isBlockElement(t3), i2 = C(this.currentBlockElement, t3);
      if (e2 && !this.isBlockElement(t3.firstChild)) {
        if (!this.isInsignificantTextNode(t3.firstChild) || !this.isBlockElement(t3.firstElementChild)) {
          const e3 = this.getBlockAttributes(t3), n2 = this.getBlockHTMLAttributes(t3);
          if (t3.firstChild) {
            if (i2 && ot(e3, this.currentBlock.attributes)) return this.appendStringWithAttributes("\n");
            this.currentBlock = this.appendBlockForAttributesWithElement(e3, t3, n2), this.currentBlockElement = t3;
          }
        }
      } else if (this.currentBlockElement && !i2 && !e2) {
        const e3 = this.findParentBlockElement(t3);
        if (e3) return this.appendBlockForElement(e3);
        this.currentBlock = this.appendEmptyBlock(), this.currentBlockElement = null;
      }
    }
    findParentBlockElement(t3) {
      let { parentElement: e2 } = t3;
      for (; e2 && e2 !== this.containerElement; ) {
        if (this.isBlockElement(e2) && this.blockElements.includes(e2)) return e2;
        e2 = e2.parentElement;
      }
      return null;
    }
    processTextNode(t3) {
      let e2 = t3.data;
      var i2;
      dn(t3.parentNode) || (e2 = Vt(e2), vn(null === (i2 = t3.previousSibling) || void 0 === i2 ? void 0 : i2.textContent) && (e2 = fn(e2)));
      return this.appendStringWithAttributes(e2, this.getTextAttributes(t3.parentNode));
    }
    processElement(t3) {
      let e2;
      if (P(t3)) {
        if (e2 = un(t3, "attachment"), Object.keys(e2).length) {
          const i2 = this.getTextAttributes(t3);
          this.appendAttachmentWithAttributes(e2, i2), t3.innerHTML = "";
        }
        return this.processedElements.push(t3);
      }
      switch (k(t3)) {
        case "br":
          return this.isExtraBR(t3) || this.isBlockElement(t3.nextSibling) || this.appendStringWithAttributes("\n", this.getTextAttributes(t3)), this.processedElements.push(t3);
        case "img":
          e2 = { url: t3.getAttribute("src"), contentType: "image" };
          const i2 = ((t4) => {
            const e3 = t4.getAttribute("width"), i3 = t4.getAttribute("height"), n2 = {};
            return e3 && (n2.width = parseInt(e3, 10)), i3 && (n2.height = parseInt(i3, 10)), n2;
          })(t3);
          for (const t4 in i2) {
            const n2 = i2[t4];
            e2[t4] = n2;
          }
          return this.appendAttachmentWithAttributes(e2, this.getTextAttributes(t3)), this.processedElements.push(t3);
        case "tr":
          if (this.needsTableSeparator(t3)) return this.appendStringWithAttributes(j.tableRowSeparator);
          break;
        case "td":
          if (this.needsTableSeparator(t3)) return this.appendStringWithAttributes(j.tableCellSeparator);
      }
    }
    appendBlockForAttributesWithElement(t3, e2) {
      let i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      this.blockElements.push(e2);
      const n2 = (function() {
        return { text: [], attributes: arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, htmlAttributes: arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {} };
      })(t3, i2);
      return this.blocks.push(n2), n2;
    }
    appendEmptyBlock() {
      return this.appendBlockForAttributesWithElement([], null);
    }
    appendStringWithAttributes(t3, e2) {
      return this.appendPiece(cn(t3, e2));
    }
    appendAttachmentWithAttributes(t3, e2) {
      return this.appendPiece((function(t4) {
        return { attachment: t4, attributes: arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, type: "attachment" };
      })(t3, e2));
    }
    appendPiece(t3) {
      return 0 === this.blocks.length && this.appendEmptyBlock(), this.blocks[this.blocks.length - 1].text.push(t3);
    }
    appendStringToTextAtIndex(t3, e2) {
      const { text: i2 } = this.blocks[e2], n2 = i2[i2.length - 1];
      if ("string" !== (null == n2 ? void 0 : n2.type)) return i2.push(cn(t3));
      n2.string += t3;
    }
    prependStringToTextAtIndex(t3, e2) {
      const { text: i2 } = this.blocks[e2], n2 = i2[0];
      if ("string" !== (null == n2 ? void 0 : n2.type)) return i2.unshift(cn(t3));
      n2.string = t3 + n2.string;
    }
    getTextAttributes(t3) {
      let e2;
      const i2 = {};
      for (const n2 in W) {
        const r3 = W[n2];
        if (r3.tagName && y(t3, { matchingSelector: r3.tagName, untilNode: this.containerElement })) i2[n2] = true;
        else if (r3.parser) {
          if (e2 = r3.parser(t3), e2) {
            let o2 = false;
            for (const i3 of this.findBlockElementAncestors(t3)) if (r3.parser(i3) === e2) {
              o2 = true;
              break;
            }
            o2 || (i2[n2] = e2);
          }
        } else r3.styleProperty && (e2 = t3.style[r3.styleProperty], e2 && (i2[n2] = e2));
      }
      if (P(t3)) {
        const n2 = un(t3, "attributes");
        for (const t4 in n2) e2 = n2[t4], i2[t4] = e2;
      }
      return i2;
    }
    getBlockAttributes(t3) {
      const e2 = [];
      for (; t3 && t3 !== this.containerElement; ) {
        for (const r3 in n) {
          const o2 = n[r3];
          var i2;
          if (false !== o2.parse) {
            if (k(t3) === o2.tagName) (null !== (i2 = o2.test) && void 0 !== i2 && i2.call(o2, t3) || !o2.test) && (e2.push(r3), o2.listAttribute && e2.push(o2.listAttribute));
          }
        }
        t3 = t3.parentNode;
      }
      return e2.reverse();
    }
    getBlockHTMLAttributes(t3) {
      const e2 = {}, i2 = Object.values(n).find(((e3) => e3.tagName === k(t3)));
      return ((null == i2 ? void 0 : i2.htmlAttributes) || []).forEach(((i3) => {
        t3.hasAttribute(i3) && (e2[i3] = t3.getAttribute(i3));
      })), e2;
    }
    findBlockElementAncestors(t3) {
      const e2 = [];
      for (; t3 && t3 !== this.containerElement; ) {
        const i2 = k(t3);
        L().includes(i2) && e2.push(t3), t3 = t3.parentNode;
      }
      return e2;
    }
    isBlockElement(t3) {
      if ((null == t3 ? void 0 : t3.nodeType) === Node.ELEMENT_NODE && !P(t3) && !y(t3, { matchingSelector: "td", untilNode: this.containerElement })) return L().includes(k(t3)) || "block" === window.getComputedStyle(t3).display;
    }
    isInsignificantTextNode(t3) {
      if ((null == t3 ? void 0 : t3.nodeType) !== Node.TEXT_NODE) return;
      if (!bn(t3.data)) return;
      const { parentNode: e2, previousSibling: i2, nextSibling: n2 } = t3;
      return gn(e2.previousSibling) && !this.isBlockElement(e2.previousSibling) || dn(e2) ? void 0 : !i2 || this.isBlockElement(i2) || !n2 || this.isBlockElement(n2);
    }
    isExtraBR(t3) {
      return "br" === k(t3) && this.isBlockElement(t3.parentNode) && t3.parentNode.lastChild === t3;
    }
    needsTableSeparator(t3) {
      if (j.removeBlankTableCells) {
        var e2;
        const i2 = null === (e2 = t3.previousSibling) || void 0 === e2 ? void 0 : e2.textContent;
        return i2 && /\S/.test(i2);
      }
      return t3.previousSibling;
    }
    translateBlockElementMarginsToNewlines() {
      const t3 = this.getMarginOfDefaultBlockElement();
      for (let e2 = 0; e2 < this.blocks.length; e2++) {
        const i2 = this.getMarginOfBlockElementAtIndex(e2);
        i2 && (i2.top > 2 * t3.top && this.prependStringToTextAtIndex("\n", e2), i2.bottom > 2 * t3.bottom && this.appendStringToTextAtIndex("\n", e2));
      }
    }
    getMarginOfBlockElementAtIndex(t3) {
      const e2 = this.blockElements[t3];
      if (e2 && e2.textContent && !L().includes(k(e2)) && !this.processedElements.includes(e2)) return mn(e2);
    }
    getMarginOfDefaultBlockElement() {
      const t3 = T(n.default.tagName);
      return this.containerElement.appendChild(t3), mn(t3);
    }
  };
  var dn = function(t3) {
    const { whiteSpace: e2 } = window.getComputedStyle(t3);
    return ["pre", "pre-wrap", "pre-line"].includes(e2);
  };
  var gn = (t3) => t3 && !vn(t3.textContent);
  var mn = function(t3) {
    const e2 = window.getComputedStyle(t3);
    if ("block" === e2.display) return { top: parseInt(e2.marginTop), bottom: parseInt(e2.marginBottom) };
  };
  var pn = function(t3) {
    return "style" === k(t3) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
  };
  var fn = (t3) => t3.replace(new RegExp("^".concat(Ut.source, "+")), "");
  var bn = (t3) => new RegExp("^".concat(Ut.source, "*$")).test(t3);
  var vn = (t3) => /\s$/.test(t3);
  var An = ["contenteditable", "data-trix-id", "data-trix-store-key", "data-trix-mutable", "data-trix-placeholder", "tabindex"];
  var yn = "data-trix-serialized-attributes";
  var xn = "[".concat(yn, "]");
  var Cn = new RegExp("<!--block-->", "g");
  var En = { "application/json": function(t3) {
    let e2;
    if (t3 instanceof an) e2 = t3;
    else {
      if (!(t3 instanceof HTMLElement)) throw new Error("unserializable object");
      e2 = hn.parse(t3.innerHTML).getDocument();
    }
    return e2.toSerializableDocument().toJSONString();
  }, "text/html": function(t3) {
    let e2;
    if (t3 instanceof an) e2 = Si.render(t3);
    else {
      if (!(t3 instanceof HTMLElement)) throw new Error("unserializable object");
      e2 = t3.cloneNode(true);
    }
    return Array.from(e2.querySelectorAll("[data-trix-serialize=false]")).forEach(((t4) => {
      S(t4);
    })), An.forEach(((t4) => {
      Array.from(e2.querySelectorAll("[".concat(t4, "]"))).forEach(((e3) => {
        e3.removeAttribute(t4);
      }));
    })), Array.from(e2.querySelectorAll(xn)).forEach(((t4) => {
      try {
        const e3 = JSON.parse(t4.getAttribute(yn));
        t4.removeAttribute(yn);
        for (const i2 in e3) {
          const n2 = e3[i2];
          t4.setAttribute(i2, n2);
        }
      } catch (t5) {
      }
    })), e2.innerHTML.replace(Cn, "");
  } };
  var Sn = Object.freeze({ __proto__: null });
  var Rn = class extends q {
    constructor(t3, e2) {
      super(...arguments), this.attachmentManager = t3, this.attachment = e2, this.id = this.attachment.id, this.file = this.attachment.file;
    }
    remove() {
      return this.attachmentManager.requestRemovalOfAttachment(this.attachment);
    }
  };
  Rn.proxyMethod("attachment.getAttribute"), Rn.proxyMethod("attachment.hasAttribute"), Rn.proxyMethod("attachment.setAttribute"), Rn.proxyMethod("attachment.getAttributes"), Rn.proxyMethod("attachment.setAttributes"), Rn.proxyMethod("attachment.isPending"), Rn.proxyMethod("attachment.isPreviewable"), Rn.proxyMethod("attachment.getURL"), Rn.proxyMethod("attachment.getHref"), Rn.proxyMethod("attachment.getFilename"), Rn.proxyMethod("attachment.getFilesize"), Rn.proxyMethod("attachment.getFormattedFilesize"), Rn.proxyMethod("attachment.getExtension"), Rn.proxyMethod("attachment.getContentType"), Rn.proxyMethod("attachment.getFile"), Rn.proxyMethod("attachment.setFile"), Rn.proxyMethod("attachment.releaseFile"), Rn.proxyMethod("attachment.getUploadProgress"), Rn.proxyMethod("attachment.setUploadProgress");
  var kn = class extends q {
    constructor() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
      super(...arguments), this.managedAttachments = {}, Array.from(t3).forEach(((t4) => {
        this.manageAttachment(t4);
      }));
    }
    getAttachments() {
      const t3 = [];
      for (const e2 in this.managedAttachments) {
        const i2 = this.managedAttachments[e2];
        t3.push(i2);
      }
      return t3;
    }
    manageAttachment(t3) {
      return this.managedAttachments[t3.id] || (this.managedAttachments[t3.id] = new Rn(this, t3)), this.managedAttachments[t3.id];
    }
    attachmentIsManaged(t3) {
      return t3.id in this.managedAttachments;
    }
    requestRemovalOfAttachment(t3) {
      var e2, i2;
      if (this.attachmentIsManaged(t3)) return null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.attachmentManagerDidRequestRemovalOfAttachment) || void 0 === i2 ? void 0 : i2.call(e2, t3);
    }
    unmanageAttachment(t3) {
      const e2 = this.managedAttachments[t3.id];
      return delete this.managedAttachments[t3.id], e2;
    }
  };
  var Tn = class {
    constructor(t3) {
      this.composition = t3, this.document = this.composition.document;
      const e2 = this.composition.getSelectedRange();
      this.startPosition = e2[0], this.endPosition = e2[1], this.startLocation = this.document.locationFromPosition(this.startPosition), this.endLocation = this.document.locationFromPosition(this.endPosition), this.block = this.document.getBlockAtIndex(this.endLocation.index), this.breaksOnReturn = this.block.breaksOnReturn(), this.previousCharacter = this.block.text.getStringAtPosition(this.endLocation.offset - 1), this.nextCharacter = this.block.text.getStringAtPosition(this.endLocation.offset);
    }
    shouldInsertBlockBreak() {
      return this.block.hasAttributes() && this.block.isListItem() && !this.block.isEmpty() ? 0 !== this.startLocation.offset : this.breaksOnReturn && "\n" !== this.nextCharacter;
    }
    shouldBreakFormattedBlock() {
      return this.block.hasAttributes() && !this.block.isListItem() && (this.breaksOnReturn && "\n" === this.nextCharacter || "\n" === this.previousCharacter);
    }
    shouldDecreaseListLevel() {
      return this.block.hasAttributes() && this.block.isListItem() && this.block.isEmpty();
    }
    shouldPrependListItem() {
      return this.block.isListItem() && 0 === this.startLocation.offset && !this.block.isEmpty();
    }
    shouldRemoveLastBlockAttribute() {
      return this.block.hasAttributes() && !this.block.isListItem() && this.block.isEmpty();
    }
  };
  var wn = class extends q {
    constructor() {
      super(...arguments), this.document = new an(), this.attachments = [], this.currentAttributes = {}, this.revision = 0;
    }
    setDocument(t3) {
      var e2, i2;
      if (!t3.isEqualTo(this.document)) return this.document = t3, this.refreshAttachments(), this.revision++, null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.compositionDidChangeDocument) || void 0 === i2 ? void 0 : i2.call(e2, t3);
    }
    getSnapshot() {
      return { document: this.document, selectedRange: this.getSelectedRange() };
    }
    loadSnapshot(t3) {
      var e2, i2, n2, r3;
      let { document: o2, selectedRange: s2 } = t3;
      return null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.compositionWillLoadSnapshot) || void 0 === i2 || i2.call(e2), this.setDocument(null != o2 ? o2 : new an()), this.setSelection(null != s2 ? s2 : [0, 0]), null === (n2 = this.delegate) || void 0 === n2 || null === (r3 = n2.compositionDidLoadSnapshot) || void 0 === r3 ? void 0 : r3.call(n2);
    }
    insertText(t3) {
      let { updatePosition: e2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { updatePosition: true };
      const i2 = this.getSelectedRange();
      this.setDocument(this.document.insertTextAtRange(t3, i2));
      const n2 = i2[0], r3 = n2 + t3.getLength();
      return e2 && this.setSelection(r3), this.notifyDelegateOfInsertionAtRange([n2, r3]);
    }
    insertBlock() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : new Xi();
      const e2 = new an([t3]);
      return this.insertDocument(e2);
    }
    insertDocument() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : new an();
      const e2 = this.getSelectedRange();
      this.setDocument(this.document.insertDocumentAtRange(t3, e2));
      const i2 = e2[0], n2 = i2 + t3.getLength();
      return this.setSelection(n2), this.notifyDelegateOfInsertionAtRange([i2, n2]);
    }
    insertString(t3, e2) {
      const i2 = this.getCurrentTextAttributes(), n2 = Yi.textForStringWithAttributes(t3, i2);
      return this.insertText(n2, e2);
    }
    insertBlockBreak() {
      const t3 = this.getSelectedRange();
      this.setDocument(this.document.insertBlockBreakAtRange(t3));
      const e2 = t3[0], i2 = e2 + 1;
      return this.setSelection(i2), this.notifyDelegateOfInsertionAtRange([e2, i2]);
    }
    insertLineBreak() {
      const t3 = new Tn(this);
      if (t3.shouldDecreaseListLevel()) return this.decreaseListLevel(), this.setSelection(t3.startPosition);
      if (t3.shouldPrependListItem()) {
        const e2 = new an([t3.block.copyWithoutText()]);
        return this.insertDocument(e2);
      }
      return t3.shouldInsertBlockBreak() ? this.insertBlockBreak() : t3.shouldRemoveLastBlockAttribute() ? this.removeLastBlockAttribute() : t3.shouldBreakFormattedBlock() ? this.breakFormattedBlock(t3) : this.insertString("\n");
    }
    insertHTML(t3) {
      const e2 = hn.parse(t3, { purifyOptions: { SAFE_FOR_XML: true } }).getDocument(), i2 = this.getSelectedRange();
      this.setDocument(this.document.mergeDocumentAtRange(e2, i2));
      const n2 = i2[0], r3 = n2 + e2.getLength() - 1;
      return this.setSelection(r3), this.notifyDelegateOfInsertionAtRange([n2, r3]);
    }
    replaceHTML(t3) {
      const e2 = hn.parse(t3).getDocument().copyUsingObjectsFromDocument(this.document), i2 = this.getLocationRange({ strict: false }), n2 = this.document.rangeFromLocationRange(i2);
      return this.setDocument(e2), this.setSelection(n2);
    }
    insertFile(t3) {
      return this.insertFiles([t3]);
    }
    insertFiles(t3) {
      const e2 = [];
      return Array.from(t3).forEach(((t4) => {
        var i2;
        if (null !== (i2 = this.delegate) && void 0 !== i2 && i2.compositionShouldAcceptFile(t4)) {
          const i3 = Vi.attachmentForFile(t4);
          e2.push(i3);
        }
      })), this.insertAttachments(e2);
    }
    insertAttachment(t3) {
      return this.insertAttachments([t3]);
    }
    insertAttachments(t3) {
      let e2 = new Yi();
      return Array.from(t3).forEach(((t4) => {
        var n2;
        const r3 = t4.getType(), o2 = null === (n2 = i[r3]) || void 0 === n2 ? void 0 : n2.presentation, s2 = this.getCurrentTextAttributes();
        o2 && (s2.presentation = o2);
        const a2 = Yi.textForAttachmentWithAttributes(t4, s2);
        e2 = e2.appendText(a2);
      })), this.insertText(e2);
    }
    shouldManageDeletingInDirection(t3) {
      const e2 = this.getLocationRange();
      if (Lt(e2)) {
        if ("backward" === t3 && 0 === e2[0].offset) return true;
        if (this.shouldManageMovingCursorInDirection(t3)) return true;
      } else if (e2[0].index !== e2[1].index) return true;
      return false;
    }
    deleteInDirection(t3) {
      let e2, i2, n2, { length: r3 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      const o2 = this.getLocationRange();
      let s2 = this.getSelectedRange();
      const a2 = Lt(s2);
      if (a2 ? i2 = "backward" === t3 && 0 === o2[0].offset : n2 = o2[0].index !== o2[1].index, i2 && this.canDecreaseBlockAttributeLevel()) {
        const t4 = this.getBlock();
        if (t4.isListItem() ? this.decreaseListLevel() : this.decreaseBlockAttributeLevel(), this.setSelection(s2[0]), t4.isEmpty()) return false;
      }
      return a2 && (s2 = this.getExpandedRangeInDirection(t3, { length: r3 }), "backward" === t3 && (e2 = this.getAttachmentAtRange(s2))), e2 ? (this.editAttachment(e2), false) : (this.setDocument(this.document.removeTextAtRange(s2)), this.setSelection(s2[0]), !i2 && !n2 && void 0);
    }
    moveTextFromRange(t3) {
      const [e2] = Array.from(this.getSelectedRange());
      return this.setDocument(this.document.moveTextFromRangeToPosition(t3, e2)), this.setSelection(e2);
    }
    removeAttachment(t3) {
      const e2 = this.document.getRangeOfAttachment(t3);
      if (e2) return this.stopEditingAttachment(), this.setDocument(this.document.removeTextAtRange(e2)), this.setSelection(e2[0]);
    }
    removeLastBlockAttribute() {
      const [t3, e2] = Array.from(this.getSelectedRange()), i2 = this.document.getBlockAtPosition(e2);
      return this.removeCurrentAttribute(i2.getLastAttribute()), this.setSelection(t3);
    }
    insertPlaceholder() {
      return this.placeholderPosition = this.getPosition(), this.insertString(" ");
    }
    selectPlaceholder() {
      if (null != this.placeholderPosition) return this.setSelectedRange([this.placeholderPosition, this.placeholderPosition + 1]), this.getSelectedRange();
    }
    forgetPlaceholder() {
      this.placeholderPosition = null;
    }
    hasCurrentAttribute(t3) {
      const e2 = this.currentAttributes[t3];
      return null != e2 && false !== e2;
    }
    toggleCurrentAttribute(t3) {
      const e2 = !this.currentAttributes[t3];
      return e2 ? this.setCurrentAttribute(t3, e2) : this.removeCurrentAttribute(t3);
    }
    canSetCurrentAttribute(t3) {
      return mt(t3) ? this.canSetCurrentBlockAttribute(t3) : this.canSetCurrentTextAttribute(t3);
    }
    canSetCurrentTextAttribute(t3) {
      const e2 = this.getSelectedDocument();
      if (e2) {
        for (const t4 of Array.from(e2.getAttachments())) if (!t4.hasContent()) return false;
        return true;
      }
    }
    canSetCurrentBlockAttribute(t3) {
      const e2 = this.getBlock();
      if (e2) return !e2.isTerminalBlock();
    }
    setCurrentAttribute(t3, e2) {
      return mt(t3) ? this.setBlockAttribute(t3, e2) : (this.setTextAttribute(t3, e2), this.currentAttributes[t3] = e2, this.notifyDelegateOfCurrentAttributesChange());
    }
    setHTMLAtributeAtPosition(t3, e2, i2) {
      var n2;
      const r3 = this.document.getBlockAtPosition(t3), o2 = null === (n2 = mt(r3.getLastAttribute())) || void 0 === n2 ? void 0 : n2.htmlAttributes;
      if (r3 && null != o2 && o2.includes(e2)) {
        const n3 = this.document.setHTMLAttributeAtPosition(t3, e2, i2);
        this.setDocument(n3);
      }
    }
    setTextAttribute(t3, e2) {
      const i2 = this.getSelectedRange();
      if (!i2) return;
      const [n2, r3] = Array.from(i2);
      if (n2 !== r3) return this.setDocument(this.document.addAttributeAtRange(t3, e2, i2));
      if ("href" === t3) {
        const t4 = Yi.textForStringWithAttributes(e2, { href: e2 });
        return this.insertText(t4);
      }
    }
    setBlockAttribute(t3, e2) {
      const i2 = this.getSelectedRange();
      if (this.canSetCurrentAttribute(t3)) return this.setDocument(this.document.applyBlockAttributeAtRange(t3, e2, i2)), this.setSelection(i2);
    }
    removeCurrentAttribute(t3) {
      return mt(t3) ? (this.removeBlockAttribute(t3), this.updateCurrentAttributes()) : (this.removeTextAttribute(t3), delete this.currentAttributes[t3], this.notifyDelegateOfCurrentAttributesChange());
    }
    removeTextAttribute(t3) {
      const e2 = this.getSelectedRange();
      if (e2) return this.setDocument(this.document.removeAttributeAtRange(t3, e2));
    }
    removeBlockAttribute(t3) {
      const e2 = this.getSelectedRange();
      if (e2) return this.setDocument(this.document.removeAttributeAtRange(t3, e2));
    }
    canDecreaseNestingLevel() {
      var t3;
      return (null === (t3 = this.getBlock()) || void 0 === t3 ? void 0 : t3.getNestingLevel()) > 0;
    }
    canIncreaseNestingLevel() {
      var t3;
      const e2 = this.getBlock();
      if (e2) {
        if (null === (t3 = mt(e2.getLastNestableAttribute())) || void 0 === t3 || !t3.listAttribute) return e2.getNestingLevel() > 0;
        {
          const t4 = this.getPreviousBlock();
          if (t4) return (function() {
            let t5 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
            return ot((arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []).slice(0, t5.length), t5);
          })(t4.getListItemAttributes(), e2.getListItemAttributes());
        }
      }
    }
    decreaseNestingLevel() {
      const t3 = this.getBlock();
      if (t3) return this.setDocument(this.document.replaceBlock(t3, t3.decreaseNestingLevel()));
    }
    increaseNestingLevel() {
      const t3 = this.getBlock();
      if (t3) return this.setDocument(this.document.replaceBlock(t3, t3.increaseNestingLevel()));
    }
    canDecreaseBlockAttributeLevel() {
      var t3;
      return (null === (t3 = this.getBlock()) || void 0 === t3 ? void 0 : t3.getAttributeLevel()) > 0;
    }
    decreaseBlockAttributeLevel() {
      var t3;
      const e2 = null === (t3 = this.getBlock()) || void 0 === t3 ? void 0 : t3.getLastAttribute();
      if (e2) return this.removeCurrentAttribute(e2);
    }
    decreaseListLevel() {
      let [t3] = Array.from(this.getSelectedRange());
      const { index: e2 } = this.document.locationFromPosition(t3);
      let i2 = e2;
      const n2 = this.getBlock().getAttributeLevel();
      let r3 = this.document.getBlockAtIndex(i2 + 1);
      for (; r3 && r3.isListItem() && !(r3.getAttributeLevel() <= n2); ) i2++, r3 = this.document.getBlockAtIndex(i2 + 1);
      t3 = this.document.positionFromLocation({ index: e2, offset: 0 });
      const o2 = this.document.positionFromLocation({ index: i2, offset: 0 });
      return this.setDocument(this.document.removeLastListAttributeAtRange([t3, o2]));
    }
    updateCurrentAttributes() {
      const t3 = this.getSelectedRange({ ignoreLock: true });
      if (t3) {
        const e2 = this.document.getCommonAttributesAtRange(t3);
        if (Array.from(gt()).forEach(((t4) => {
          e2[t4] || this.canSetCurrentAttribute(t4) || (e2[t4] = false);
        })), !Tt(e2, this.currentAttributes)) return this.currentAttributes = e2, this.notifyDelegateOfCurrentAttributesChange();
      }
    }
    getCurrentAttributes() {
      return m.call({}, this.currentAttributes);
    }
    getCurrentTextAttributes() {
      const t3 = {};
      for (const e2 in this.currentAttributes) {
        const i2 = this.currentAttributes[e2];
        false !== i2 && ft(e2) && (t3[e2] = i2);
      }
      return t3;
    }
    freezeSelection() {
      return this.setCurrentAttribute("frozen", true);
    }
    thawSelection() {
      return this.removeCurrentAttribute("frozen");
    }
    hasFrozenSelection() {
      return this.hasCurrentAttribute("frozen");
    }
    setSelection(t3) {
      var e2;
      const i2 = this.document.locationRangeFromRange(t3);
      return null === (e2 = this.delegate) || void 0 === e2 ? void 0 : e2.compositionDidRequestChangingSelectionToLocationRange(i2);
    }
    getSelectedRange() {
      const t3 = this.getLocationRange();
      if (t3) return this.document.rangeFromLocationRange(t3);
    }
    setSelectedRange(t3) {
      const e2 = this.document.locationRangeFromRange(t3);
      return this.getSelectionManager().setLocationRange(e2);
    }
    getPosition() {
      const t3 = this.getLocationRange();
      if (t3) return this.document.positionFromLocation(t3[0]);
    }
    getLocationRange(t3) {
      return this.targetLocationRange ? this.targetLocationRange : this.getSelectionManager().getLocationRange(t3) || wt({ index: 0, offset: 0 });
    }
    withTargetLocationRange(t3, e2) {
      let i2;
      this.targetLocationRange = t3;
      try {
        i2 = e2();
      } finally {
        this.targetLocationRange = null;
      }
      return i2;
    }
    withTargetRange(t3, e2) {
      const i2 = this.document.locationRangeFromRange(t3);
      return this.withTargetLocationRange(i2, e2);
    }
    withTargetDOMRange(t3, e2) {
      const i2 = this.createLocationRangeFromDOMRange(t3, { strict: false });
      return this.withTargetLocationRange(i2, e2);
    }
    getExpandedRangeInDirection(t3) {
      let { length: e2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, [i2, n2] = Array.from(this.getSelectedRange());
      return "backward" === t3 ? e2 ? i2 -= e2 : i2 = this.translateUTF16PositionFromOffset(i2, -1) : e2 ? n2 += e2 : n2 = this.translateUTF16PositionFromOffset(n2, 1), wt([i2, n2]);
    }
    shouldManageMovingCursorInDirection(t3) {
      if (this.editingAttachment) return true;
      const e2 = this.getExpandedRangeInDirection(t3);
      return null != this.getAttachmentAtRange(e2);
    }
    moveCursorInDirection(t3) {
      let e2, i2;
      if (this.editingAttachment) i2 = this.document.getRangeOfAttachment(this.editingAttachment);
      else {
        const n2 = this.getSelectedRange();
        i2 = this.getExpandedRangeInDirection(t3), e2 = !Dt(n2, i2);
      }
      if ("backward" === t3 ? this.setSelectedRange(i2[0]) : this.setSelectedRange(i2[1]), e2) {
        const t4 = this.getAttachmentAtRange(i2);
        if (t4) return this.editAttachment(t4);
      }
    }
    expandSelectionInDirection(t3) {
      let { length: e2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      const i2 = this.getExpandedRangeInDirection(t3, { length: e2 });
      return this.setSelectedRange(i2);
    }
    expandSelectionForEditing() {
      if (this.hasCurrentAttribute("href")) return this.expandSelectionAroundCommonAttribute("href");
    }
    expandSelectionAroundCommonAttribute(t3) {
      const e2 = this.getPosition(), i2 = this.document.getRangeOfCommonAttributeAtPosition(t3, e2);
      return this.setSelectedRange(i2);
    }
    selectionContainsAttachments() {
      var t3;
      return (null === (t3 = this.getSelectedAttachments()) || void 0 === t3 ? void 0 : t3.length) > 0;
    }
    selectionIsInCursorTarget() {
      return this.editingAttachment || this.positionIsCursorTarget(this.getPosition());
    }
    positionIsCursorTarget(t3) {
      const e2 = this.document.locationFromPosition(t3);
      if (e2) return this.locationIsCursorTarget(e2);
    }
    positionIsBlockBreak(t3) {
      var e2;
      return null === (e2 = this.document.getPieceAtPosition(t3)) || void 0 === e2 ? void 0 : e2.isBlockBreak();
    }
    getSelectedDocument() {
      const t3 = this.getSelectedRange();
      if (t3) return this.document.getDocumentAtRange(t3);
    }
    getSelectedAttachments() {
      var t3;
      return null === (t3 = this.getSelectedDocument()) || void 0 === t3 ? void 0 : t3.getAttachments();
    }
    getAttachments() {
      return this.attachments.slice(0);
    }
    refreshAttachments() {
      const t3 = this.document.getAttachments(), { added: e2, removed: i2 } = (function() {
        let t4 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], e3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
        const i3 = [], n2 = [], r3 = /* @__PURE__ */ new Set();
        t4.forEach(((t5) => {
          r3.add(t5);
        }));
        const o2 = /* @__PURE__ */ new Set();
        return e3.forEach(((t5) => {
          o2.add(t5), r3.has(t5) || i3.push(t5);
        })), t4.forEach(((t5) => {
          o2.has(t5) || n2.push(t5);
        })), { added: i3, removed: n2 };
      })(this.attachments, t3);
      return this.attachments = t3, Array.from(i2).forEach(((t4) => {
        var e3, i3;
        t4.delegate = null, null === (e3 = this.delegate) || void 0 === e3 || null === (i3 = e3.compositionDidRemoveAttachment) || void 0 === i3 || i3.call(e3, t4);
      })), (() => {
        const t4 = [];
        return Array.from(e2).forEach(((e3) => {
          var i3, n2;
          e3.delegate = this, t4.push(null === (i3 = this.delegate) || void 0 === i3 || null === (n2 = i3.compositionDidAddAttachment) || void 0 === n2 ? void 0 : n2.call(i3, e3));
        })), t4;
      })();
    }
    attachmentDidChangeAttributes(t3) {
      var e2, i2;
      return this.revision++, null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.compositionDidEditAttachment) || void 0 === i2 ? void 0 : i2.call(e2, t3);
    }
    attachmentDidChangePreviewURL(t3) {
      var e2, i2;
      return this.revision++, null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.compositionDidChangeAttachmentPreviewURL) || void 0 === i2 ? void 0 : i2.call(e2, t3);
    }
    editAttachment(t3, e2) {
      var i2, n2;
      if (t3 !== this.editingAttachment) return this.stopEditingAttachment(), this.editingAttachment = t3, null === (i2 = this.delegate) || void 0 === i2 || null === (n2 = i2.compositionDidStartEditingAttachment) || void 0 === n2 ? void 0 : n2.call(i2, this.editingAttachment, e2);
    }
    stopEditingAttachment() {
      var t3, e2;
      this.editingAttachment && (null === (t3 = this.delegate) || void 0 === t3 || null === (e2 = t3.compositionDidStopEditingAttachment) || void 0 === e2 || e2.call(t3, this.editingAttachment), this.editingAttachment = null);
    }
    updateAttributesForAttachment(t3, e2) {
      return this.setDocument(this.document.updateAttributesForAttachment(t3, e2));
    }
    removeAttributeForAttachment(t3, e2) {
      return this.setDocument(this.document.removeAttributeForAttachment(t3, e2));
    }
    breakFormattedBlock(t3) {
      let { document: e2 } = t3;
      const { block: i2 } = t3;
      let n2 = t3.startPosition, r3 = [n2 - 1, n2];
      i2.getBlockBreakPosition() === t3.startLocation.offset ? (i2.breaksOnReturn() && "\n" === t3.nextCharacter ? n2 += 1 : e2 = e2.removeTextAtRange(r3), r3 = [n2, n2]) : "\n" === t3.nextCharacter ? "\n" === t3.previousCharacter ? r3 = [n2 - 1, n2 + 1] : (r3 = [n2, n2 + 1], n2 += 1) : t3.startLocation.offset - 1 != 0 && (n2 += 1);
      const o2 = new an([i2.removeLastAttribute().copyWithoutText()]);
      return this.setDocument(e2.insertDocumentAtRange(o2, r3)), this.setSelection(n2);
    }
    getPreviousBlock() {
      const t3 = this.getLocationRange();
      if (t3) {
        const { index: e2 } = t3[0];
        if (e2 > 0) return this.document.getBlockAtIndex(e2 - 1);
      }
    }
    getBlock() {
      const t3 = this.getLocationRange();
      if (t3) return this.document.getBlockAtIndex(t3[0].index);
    }
    getAttachmentAtRange(t3) {
      const e2 = this.document.getDocumentAtRange(t3);
      if (e2.toString() === "".concat("\uFFFC", "\n")) return e2.getAttachments()[0];
    }
    notifyDelegateOfCurrentAttributesChange() {
      var t3, e2;
      return null === (t3 = this.delegate) || void 0 === t3 || null === (e2 = t3.compositionDidChangeCurrentAttributes) || void 0 === e2 ? void 0 : e2.call(t3, this.currentAttributes);
    }
    notifyDelegateOfInsertionAtRange(t3) {
      var e2, i2;
      return null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.compositionDidPerformInsertionAtRange) || void 0 === i2 ? void 0 : i2.call(e2, t3);
    }
    translateUTF16PositionFromOffset(t3, e2) {
      const i2 = this.document.toUTF16String(), n2 = i2.offsetFromUCS2Offset(t3);
      return i2.offsetToUCS2Offset(n2 + e2);
    }
  };
  wn.proxyMethod("getSelectionManager().getPointRange"), wn.proxyMethod("getSelectionManager().setLocationRangeFromPointRange"), wn.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange"), wn.proxyMethod("getSelectionManager().locationIsCursorTarget"), wn.proxyMethod("getSelectionManager().selectionIsExpanded"), wn.proxyMethod("delegate?.getSelectionManager");
  var Ln = class extends q {
    constructor(t3) {
      super(...arguments), this.composition = t3, this.undoEntries = [], this.redoEntries = [];
    }
    recordUndoEntry(t3) {
      let { context: e2, consolidatable: i2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      const n2 = this.undoEntries.slice(-1)[0];
      if (!i2 || !Dn(n2, t3, e2)) {
        const i3 = this.createEntry({ description: t3, context: e2 });
        this.undoEntries.push(i3), this.redoEntries = [];
      }
    }
    undo() {
      const t3 = this.undoEntries.pop();
      if (t3) {
        const e2 = this.createEntry(t3);
        return this.redoEntries.push(e2), this.composition.loadSnapshot(t3.snapshot);
      }
    }
    redo() {
      const t3 = this.redoEntries.pop();
      if (t3) {
        const e2 = this.createEntry(t3);
        return this.undoEntries.push(e2), this.composition.loadSnapshot(t3.snapshot);
      }
    }
    canUndo() {
      return this.undoEntries.length > 0;
    }
    canRedo() {
      return this.redoEntries.length > 0;
    }
    createEntry() {
      let { description: t3, context: e2 } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      return { description: null == t3 ? void 0 : t3.toString(), context: JSON.stringify(e2), snapshot: this.composition.getSnapshot() };
    }
  };
  var Dn = (t3, e2, i2) => (null == t3 ? void 0 : t3.description) === (null == e2 ? void 0 : e2.toString()) && (null == t3 ? void 0 : t3.context) === JSON.stringify(i2);
  var Nn = "attachmentGallery";
  var In = class {
    constructor(t3) {
      this.document = t3.document, this.selectedRange = t3.selectedRange;
    }
    perform() {
      return this.removeBlockAttribute(), this.applyBlockAttribute();
    }
    getSnapshot() {
      return { document: this.document, selectedRange: this.selectedRange };
    }
    removeBlockAttribute() {
      return this.findRangesOfBlocks().map(((t3) => this.document = this.document.removeAttributeAtRange(Nn, t3)));
    }
    applyBlockAttribute() {
      let t3 = 0;
      this.findRangesOfPieces().forEach(((e2) => {
        e2[1] - e2[0] > 1 && (e2[0] += t3, e2[1] += t3, "\n" !== this.document.getCharacterAtPosition(e2[1]) && (this.document = this.document.insertBlockBreakAtRange(e2[1]), e2[1] < this.selectedRange[1] && this.moveSelectedRangeForward(), e2[1]++, t3++), 0 !== e2[0] && "\n" !== this.document.getCharacterAtPosition(e2[0] - 1) && (this.document = this.document.insertBlockBreakAtRange(e2[0]), e2[0] < this.selectedRange[0] && this.moveSelectedRangeForward(), e2[0]++, t3++), this.document = this.document.applyBlockAttributeAtRange(Nn, true, e2));
      }));
    }
    findRangesOfBlocks() {
      return this.document.findRangesForBlockAttribute(Nn);
    }
    findRangesOfPieces() {
      return this.document.findRangesForTextAttribute("presentation", { withValue: "gallery" });
    }
    moveSelectedRangeForward() {
      this.selectedRange[0] += 1, this.selectedRange[1] += 1;
    }
  };
  var On = function(t3) {
    const e2 = new In(t3);
    return e2.perform(), e2.getSnapshot();
  };
  var Fn = [On];
  var Pn = class {
    constructor(t3, e2, i2) {
      this.insertFiles = this.insertFiles.bind(this), this.composition = t3, this.selectionManager = e2, this.element = i2, this.undoManager = new Ln(this.composition), this.filters = Fn.slice(0);
    }
    loadDocument(t3) {
      return this.loadSnapshot({ document: t3, selectedRange: [0, 0] });
    }
    loadHTML() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
      const e2 = hn.parse(t3, { referenceElement: this.element }).getDocument();
      return this.loadDocument(e2);
    }
    loadJSON(t3) {
      let { document: e2, selectedRange: i2 } = t3;
      return e2 = an.fromJSON(e2), this.loadSnapshot({ document: e2, selectedRange: i2 });
    }
    loadSnapshot(t3) {
      return this.undoManager = new Ln(this.composition), this.composition.loadSnapshot(t3);
    }
    getDocument() {
      return this.composition.document;
    }
    getSelectedDocument() {
      return this.composition.getSelectedDocument();
    }
    getSnapshot() {
      return this.composition.getSnapshot();
    }
    toJSON() {
      return this.getSnapshot();
    }
    deleteInDirection(t3) {
      return this.composition.deleteInDirection(t3);
    }
    insertAttachment(t3) {
      return this.composition.insertAttachment(t3);
    }
    insertAttachments(t3) {
      return this.composition.insertAttachments(t3);
    }
    insertDocument(t3) {
      return this.composition.insertDocument(t3);
    }
    insertFile(t3) {
      return this.composition.insertFile(t3);
    }
    insertFiles(t3) {
      return this.composition.insertFiles(t3);
    }
    insertHTML(t3) {
      return this.composition.insertHTML(t3);
    }
    insertString(t3) {
      return this.composition.insertString(t3);
    }
    insertText(t3) {
      return this.composition.insertText(t3);
    }
    insertLineBreak() {
      return this.composition.insertLineBreak();
    }
    getSelectedRange() {
      return this.composition.getSelectedRange();
    }
    getPosition() {
      return this.composition.getPosition();
    }
    getClientRectAtPosition(t3) {
      const e2 = this.getDocument().locationRangeFromRange([t3, t3 + 1]);
      return this.selectionManager.getClientRectAtLocationRange(e2);
    }
    expandSelectionInDirection(t3) {
      return this.composition.expandSelectionInDirection(t3);
    }
    moveCursorInDirection(t3) {
      return this.composition.moveCursorInDirection(t3);
    }
    setSelectedRange(t3) {
      return this.composition.setSelectedRange(t3);
    }
    activateAttribute(t3) {
      let e2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      return this.composition.setCurrentAttribute(t3, e2);
    }
    attributeIsActive(t3) {
      return this.composition.hasCurrentAttribute(t3);
    }
    canActivateAttribute(t3) {
      return this.composition.canSetCurrentAttribute(t3);
    }
    deactivateAttribute(t3) {
      return this.composition.removeCurrentAttribute(t3);
    }
    setHTMLAtributeAtPosition(t3, e2, i2) {
      this.composition.setHTMLAtributeAtPosition(t3, e2, i2);
    }
    canDecreaseNestingLevel() {
      return this.composition.canDecreaseNestingLevel();
    }
    canIncreaseNestingLevel() {
      return this.composition.canIncreaseNestingLevel();
    }
    decreaseNestingLevel() {
      if (this.canDecreaseNestingLevel()) return this.composition.decreaseNestingLevel();
    }
    increaseNestingLevel() {
      if (this.canIncreaseNestingLevel()) return this.composition.increaseNestingLevel();
    }
    canRedo() {
      return this.undoManager.canRedo();
    }
    canUndo() {
      return this.undoManager.canUndo();
    }
    recordUndoEntry(t3) {
      let { context: e2, consolidatable: i2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      return this.undoManager.recordUndoEntry(t3, { context: e2, consolidatable: i2 });
    }
    redo() {
      if (this.canRedo()) return this.undoManager.redo();
    }
    undo() {
      if (this.canUndo()) return this.undoManager.undo();
    }
  };
  var Mn = class {
    constructor(t3) {
      this.element = t3;
    }
    findLocationFromContainerAndOffset(t3, e2) {
      let { strict: i2 } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : { strict: true }, n2 = 0, r3 = false;
      const o2 = { index: 0, offset: 0 }, s2 = this.findAttachmentElementParentForNode(t3);
      s2 && (t3 = s2.parentNode, e2 = E(s2));
      const a2 = R(this.element, { usingFilter: Wn });
      for (; a2.nextNode(); ) {
        const s3 = a2.currentNode;
        if (s3 === t3 && B(t3)) {
          F(s3) || (o2.offset += e2);
          break;
        }
        if (s3.parentNode === t3) {
          if (n2++ === e2) break;
        } else if (!C(t3, s3) && n2 > 0) break;
        N(s3, { strict: i2 }) ? (r3 && o2.index++, o2.offset = 0, r3 = true) : o2.offset += Bn(s3);
      }
      return o2;
    }
    findContainerAndOffsetFromLocation(t3) {
      let e2, i2;
      if (0 === t3.index && 0 === t3.offset) {
        for (e2 = this.element, i2 = 0; e2.firstChild; ) if (e2 = e2.firstChild, D(e2)) {
          i2 = 1;
          break;
        }
        return [e2, i2];
      }
      let [n2, r3] = this.findNodeAndOffsetFromLocation(t3);
      if (n2) {
        if (B(n2)) 0 === Bn(n2) ? (e2 = n2.parentNode.parentNode, i2 = E(n2.parentNode), F(n2, { name: "right" }) && i2++) : (e2 = n2, i2 = t3.offset - r3);
        else {
          if (e2 = n2.parentNode, !N(n2.previousSibling) && !D(e2)) for (; n2 === e2.lastChild && (n2 = e2, e2 = e2.parentNode, !D(e2)); ) ;
          i2 = E(n2), 0 !== t3.offset && i2++;
        }
        return [e2, i2];
      }
    }
    findNodeAndOffsetFromLocation(t3) {
      let e2, i2, n2 = 0;
      for (const r3 of this.getSignificantNodesForIndex(t3.index)) {
        const o2 = Bn(r3);
        if (t3.offset <= n2 + o2) if (B(r3)) {
          if (e2 = r3, i2 = n2, t3.offset === i2 && F(e2)) break;
        } else e2 || (e2 = r3, i2 = n2);
        if (n2 += o2, n2 > t3.offset) break;
      }
      return [e2, i2];
    }
    findAttachmentElementParentForNode(t3) {
      for (; t3 && t3 !== this.element; ) {
        if (P(t3)) return t3;
        t3 = t3.parentNode;
      }
    }
    getSignificantNodesForIndex(t3) {
      const e2 = [], i2 = R(this.element, { usingFilter: _n });
      let n2 = false;
      for (; i2.nextNode(); ) {
        const o2 = i2.currentNode;
        var r3;
        if (I(o2)) {
          if (null != r3 ? r3++ : r3 = 0, r3 === t3) n2 = true;
          else if (n2) break;
        } else n2 && e2.push(o2);
      }
      return e2;
    }
  };
  var Bn = function(t3) {
    if (t3.nodeType === Node.TEXT_NODE) {
      if (F(t3)) return 0;
      return t3.textContent.length;
    }
    return "br" === k(t3) || P(t3) ? 1 : 0;
  };
  var _n = function(t3) {
    return jn(t3) === NodeFilter.FILTER_ACCEPT ? Wn(t3) : NodeFilter.FILTER_REJECT;
  };
  var jn = function(t3) {
    return M(t3) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
  };
  var Wn = function(t3) {
    return P(t3.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
  };
  var Un = class {
    createDOMRangeFromPoint(t3) {
      let e2, { x: i2, y: n2 } = t3;
      if (document.caretPositionFromPoint) {
        const { offsetNode: t4, offset: r3 } = document.caretPositionFromPoint(i2, n2);
        return e2 = document.createRange(), e2.setStart(t4, r3), e2;
      }
      if (document.caretRangeFromPoint) return document.caretRangeFromPoint(i2, n2);
      if (document.body.createTextRange) {
        const t4 = Mt();
        try {
          const t5 = document.body.createTextRange();
          t5.moveToPoint(i2, n2), t5.select();
        } catch (t5) {
        }
        return e2 = Mt(), Bt(t4), e2;
      }
    }
    getClientRectsForDOMRange(t3) {
      const e2 = Array.from(t3.getClientRects());
      return [e2[0], e2[e2.length - 1]];
    }
  };
  var Vn = class extends q {
    constructor(t3) {
      super(...arguments), this.didMouseDown = this.didMouseDown.bind(this), this.selectionDidChange = this.selectionDidChange.bind(this), this.element = t3, this.locationMapper = new Mn(this.element), this.pointMapper = new Un(), this.lockCount = 0, b("mousedown", { onElement: this.element, withCallback: this.didMouseDown });
    }
    getLocationRange() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      return false === t3.strict ? this.createLocationRangeFromDOMRange(Mt()) : t3.ignoreLock ? this.currentLocationRange : this.lockedLocationRange ? this.lockedLocationRange : this.currentLocationRange;
    }
    setLocationRange(t3) {
      if (this.lockedLocationRange) return;
      t3 = wt(t3);
      const e2 = this.createDOMRangeFromLocationRange(t3);
      e2 && (Bt(e2), this.updateCurrentLocationRange(t3));
    }
    setLocationRangeFromPointRange(t3) {
      t3 = wt(t3);
      const e2 = this.getLocationAtPoint(t3[0]), i2 = this.getLocationAtPoint(t3[1]);
      this.setLocationRange([e2, i2]);
    }
    getClientRectAtLocationRange(t3) {
      const e2 = this.createDOMRangeFromLocationRange(t3);
      if (e2) return this.getClientRectsForDOMRange(e2)[1];
    }
    locationIsCursorTarget(t3) {
      const e2 = Array.from(this.findNodeAndOffsetFromLocation(t3))[0];
      return F(e2);
    }
    lock() {
      0 == this.lockCount++ && (this.updateCurrentLocationRange(), this.lockedLocationRange = this.getLocationRange());
    }
    unlock() {
      if (0 == --this.lockCount) {
        const { lockedLocationRange: t3 } = this;
        if (this.lockedLocationRange = null, null != t3) return this.setLocationRange(t3);
      }
    }
    clearSelection() {
      var t3;
      return null === (t3 = Pt()) || void 0 === t3 ? void 0 : t3.removeAllRanges();
    }
    selectionIsCollapsed() {
      var t3;
      return true === (null === (t3 = Mt()) || void 0 === t3 ? void 0 : t3.collapsed);
    }
    selectionIsExpanded() {
      return !this.selectionIsCollapsed();
    }
    createLocationRangeFromDOMRange(t3, e2) {
      if (null == t3 || !this.domRangeWithinElement(t3)) return;
      const i2 = this.findLocationFromContainerAndOffset(t3.startContainer, t3.startOffset, e2);
      if (!i2) return;
      const n2 = t3.collapsed ? void 0 : this.findLocationFromContainerAndOffset(t3.endContainer, t3.endOffset, e2);
      return wt([i2, n2]);
    }
    didMouseDown() {
      return this.pauseTemporarily();
    }
    pauseTemporarily() {
      let t3;
      this.paused = true;
      const e2 = () => {
        if (this.paused = false, clearTimeout(i2), Array.from(t3).forEach(((t4) => {
          t4.destroy();
        })), C(document, this.element)) return this.selectionDidChange();
      }, i2 = setTimeout(e2, 200);
      t3 = ["mousemove", "keydown"].map(((t4) => b(t4, { onElement: document, withCallback: e2 })));
    }
    selectionDidChange() {
      if (!this.paused && !x(this.element)) return this.updateCurrentLocationRange();
    }
    updateCurrentLocationRange(t3) {
      var e2, i2;
      if ((null != t3 ? t3 : t3 = this.createLocationRangeFromDOMRange(Mt())) && !Dt(t3, this.currentLocationRange)) return this.currentLocationRange = t3, null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.locationRangeDidChange) || void 0 === i2 ? void 0 : i2.call(e2, this.currentLocationRange.slice(0));
    }
    createDOMRangeFromLocationRange(t3) {
      const e2 = this.findContainerAndOffsetFromLocation(t3[0]), i2 = Lt(t3) ? e2 : this.findContainerAndOffsetFromLocation(t3[1]) || e2;
      if (null != e2 && null != i2) {
        const t4 = document.createRange();
        return t4.setStart(...Array.from(e2 || [])), t4.setEnd(...Array.from(i2 || [])), t4;
      }
    }
    getLocationAtPoint(t3) {
      const e2 = this.createDOMRangeFromPoint(t3);
      var i2;
      if (e2) return null === (i2 = this.createLocationRangeFromDOMRange(e2)) || void 0 === i2 ? void 0 : i2[0];
    }
    domRangeWithinElement(t3) {
      return t3.collapsed ? C(this.element, t3.startContainer) : C(this.element, t3.startContainer) && C(this.element, t3.endContainer);
    }
  };
  Vn.proxyMethod("locationMapper.findLocationFromContainerAndOffset"), Vn.proxyMethod("locationMapper.findContainerAndOffsetFromLocation"), Vn.proxyMethod("locationMapper.findNodeAndOffsetFromLocation"), Vn.proxyMethod("pointMapper.createDOMRangeFromPoint"), Vn.proxyMethod("pointMapper.getClientRectsForDOMRange");
  var zn = Object.freeze({ __proto__: null, Attachment: Vi, AttachmentManager: kn, AttachmentPiece: zi, Block: Xi, Composition: wn, Document: an, Editor: Pn, HTMLParser: hn, HTMLSanitizer: di, LineBreakInsertion: Tn, LocationMapper: Mn, ManagedAttachment: Rn, Piece: Wi, PointMapper: Un, SelectionManager: Vn, SplittableList: Hi, StringPiece: qi, Text: Yi, UndoManager: Ln });
  var qn = Object.freeze({ __proto__: null, ObjectView: ie, AttachmentView: pi, BlockView: Ei, DocumentView: Si, PieceView: Ai, PreviewableAttachmentView: vi, TextView: yi });
  var { lang: Hn, css: Jn, keyNames: Kn } = z;
  var Gn = function(t3) {
    return function() {
      const e2 = t3.apply(this, arguments);
      e2.do(), this.undos || (this.undos = []), this.undos.push(e2.undo);
    };
  };
  var Yn = class extends q {
    constructor(t3, e2, i2) {
      let n2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
      super(...arguments), Di(this, "makeElementMutable", Gn((() => ({ do: () => {
        this.element.dataset.trixMutable = true;
      }, undo: () => delete this.element.dataset.trixMutable })))), Di(this, "addToolbar", Gn((() => {
        const t4 = T({ tagName: "div", className: Jn.attachmentToolbar, data: { trixMutable: true }, childNodes: T({ tagName: "div", className: "trix-button-row", childNodes: T({ tagName: "span", className: "trix-button-group trix-button-group--actions", childNodes: T({ tagName: "button", className: "trix-button trix-button--remove", textContent: Hn.remove, attributes: { title: Hn.remove }, data: { trixAction: "remove" } }) }) }) });
        return this.attachment.isPreviewable() && t4.appendChild(T({ tagName: "div", className: Jn.attachmentMetadataContainer, childNodes: T({ tagName: "span", className: Jn.attachmentMetadata, childNodes: [T({ tagName: "span", className: Jn.attachmentName, textContent: this.attachment.getFilename(), attributes: { title: this.attachment.getFilename() } }), T({ tagName: "span", className: Jn.attachmentSize, textContent: this.attachment.getFormattedFilesize() })] }) })), b("click", { onElement: t4, withCallback: this.didClickToolbar }), b("click", { onElement: t4, matchingSelector: "[data-trix-action]", withCallback: this.didClickActionButton }), v("trix-attachment-before-toolbar", { onElement: this.element, attributes: { toolbar: t4, attachment: this.attachment } }), { do: () => this.element.appendChild(t4), undo: () => S(t4) };
      }))), Di(this, "installCaptionEditor", Gn((() => {
        const t4 = T({ tagName: "textarea", className: Jn.attachmentCaptionEditor, attributes: { placeholder: Hn.captionPlaceholder }, data: { trixMutable: true } });
        t4.value = this.attachmentPiece.getCaption();
        const e3 = t4.cloneNode();
        e3.classList.add("trix-autoresize-clone"), e3.tabIndex = -1;
        const i3 = function() {
          e3.value = t4.value, t4.style.height = e3.scrollHeight + "px";
        };
        b("input", { onElement: t4, withCallback: i3 }), b("input", { onElement: t4, withCallback: this.didInputCaption }), b("keydown", { onElement: t4, withCallback: this.didKeyDownCaption }), b("change", { onElement: t4, withCallback: this.didChangeCaption }), b("blur", { onElement: t4, withCallback: this.didBlurCaption });
        const n3 = this.element.querySelector("figcaption"), r3 = n3.cloneNode();
        return { do: () => {
          if (n3.style.display = "none", r3.appendChild(t4), r3.appendChild(e3), r3.classList.add("".concat(Jn.attachmentCaption, "--editing")), n3.parentElement.insertBefore(r3, n3), i3(), this.options.editCaption) return Rt((() => t4.focus()));
        }, undo() {
          S(r3), n3.style.display = null;
        } };
      }))), this.didClickToolbar = this.didClickToolbar.bind(this), this.didClickActionButton = this.didClickActionButton.bind(this), this.didKeyDownCaption = this.didKeyDownCaption.bind(this), this.didInputCaption = this.didInputCaption.bind(this), this.didChangeCaption = this.didChangeCaption.bind(this), this.didBlurCaption = this.didBlurCaption.bind(this), this.attachmentPiece = t3, this.element = e2, this.container = i2, this.options = n2, this.attachment = this.attachmentPiece.attachment, "a" === k(this.element) && (this.element = this.element.firstChild), this.install();
    }
    install() {
      this.makeElementMutable(), this.addToolbar(), this.attachment.isPreviewable() && this.installCaptionEditor();
    }
    uninstall() {
      var t3;
      let e2 = this.undos.pop();
      for (this.savePendingCaption(); e2; ) e2(), e2 = this.undos.pop();
      null === (t3 = this.delegate) || void 0 === t3 || t3.didUninstallAttachmentEditor(this);
    }
    savePendingCaption() {
      if (null != this.pendingCaption) {
        const r3 = this.pendingCaption;
        var t3, e2, i2, n2;
        if (this.pendingCaption = null, r3) null === (t3 = this.delegate) || void 0 === t3 || null === (e2 = t3.attachmentEditorDidRequestUpdatingAttributesForAttachment) || void 0 === e2 || e2.call(t3, { caption: r3 }, this.attachment);
        else null === (i2 = this.delegate) || void 0 === i2 || null === (n2 = i2.attachmentEditorDidRequestRemovingAttributeForAttachment) || void 0 === n2 || n2.call(i2, "caption", this.attachment);
      }
    }
    didClickToolbar(t3) {
      return t3.preventDefault(), t3.stopPropagation();
    }
    didClickActionButton(t3) {
      var e2;
      if ("remove" === t3.target.getAttribute("data-trix-action")) return null === (e2 = this.delegate) || void 0 === e2 ? void 0 : e2.attachmentEditorDidRequestRemovalOfAttachment(this.attachment);
    }
    didKeyDownCaption(t3) {
      var e2, i2;
      if ("return" === Kn[t3.keyCode]) return t3.preventDefault(), this.savePendingCaption(), null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.attachmentEditorDidRequestDeselectingAttachment) || void 0 === i2 ? void 0 : i2.call(e2, this.attachment);
    }
    didInputCaption(t3) {
      this.pendingCaption = t3.target.value.replace(/\s/g, " ").trim();
    }
    didChangeCaption(t3) {
      return this.savePendingCaption();
    }
    didBlurCaption(t3) {
      return this.savePendingCaption();
    }
  };
  var Xn = class extends q {
    constructor(t3, i2) {
      super(...arguments), this.didFocus = this.didFocus.bind(this), this.didBlur = this.didBlur.bind(this), this.didClickAttachment = this.didClickAttachment.bind(this), this.element = t3, this.composition = i2, this.documentView = new Si(this.composition.document, { element: this.element }), b("focus", { onElement: this.element, withCallback: this.didFocus }), b("blur", { onElement: this.element, withCallback: this.didBlur }), b("click", { onElement: this.element, matchingSelector: "a[contenteditable=false]", preventDefault: true }), b("mousedown", { onElement: this.element, matchingSelector: e, withCallback: this.didClickAttachment }), b("click", { onElement: this.element, matchingSelector: "a".concat(e), preventDefault: true });
    }
    didFocus(t3) {
      var e2;
      const i2 = () => {
        var t4, e3;
        if (!this.focused) return this.focused = true, null === (t4 = this.delegate) || void 0 === t4 || null === (e3 = t4.compositionControllerDidFocus) || void 0 === e3 ? void 0 : e3.call(t4);
      };
      return (null === (e2 = this.blurPromise) || void 0 === e2 ? void 0 : e2.then(i2)) || i2();
    }
    didBlur(t3) {
      this.blurPromise = new Promise(((t4) => Rt((() => {
        var e2, i2;
        x(this.element) || (this.focused = null, null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.compositionControllerDidBlur) || void 0 === i2 || i2.call(e2));
        return this.blurPromise = null, t4();
      }))));
    }
    didClickAttachment(t3, e2) {
      var i2, n2;
      const r3 = this.findAttachmentForElement(e2), o2 = !!y(t3.target, { matchingSelector: "figcaption" });
      return null === (i2 = this.delegate) || void 0 === i2 || null === (n2 = i2.compositionControllerDidSelectAttachment) || void 0 === n2 ? void 0 : n2.call(i2, r3, { editCaption: o2 });
    }
    getSerializableElement() {
      return this.isEditingAttachment() ? this.documentView.shadowElement : this.element;
    }
    render() {
      var t3, e2, i2, n2, r3, o2;
      (this.revision !== this.composition.revision && (this.documentView.setDocument(this.composition.document), this.documentView.render(), this.revision = this.composition.revision), this.canSyncDocumentView() && !this.documentView.isSynced()) && (null === (i2 = this.delegate) || void 0 === i2 || null === (n2 = i2.compositionControllerWillSyncDocumentView) || void 0 === n2 || n2.call(i2), this.documentView.sync(), null === (r3 = this.delegate) || void 0 === r3 || null === (o2 = r3.compositionControllerDidSyncDocumentView) || void 0 === o2 || o2.call(r3));
      return null === (t3 = this.delegate) || void 0 === t3 || null === (e2 = t3.compositionControllerDidRender) || void 0 === e2 ? void 0 : e2.call(t3);
    }
    rerenderViewForObject(t3) {
      return this.invalidateViewForObject(t3), this.render();
    }
    invalidateViewForObject(t3) {
      return this.documentView.invalidateViewForObject(t3);
    }
    isViewCachingEnabled() {
      return this.documentView.isViewCachingEnabled();
    }
    enableViewCaching() {
      return this.documentView.enableViewCaching();
    }
    disableViewCaching() {
      return this.documentView.disableViewCaching();
    }
    refreshViewCache() {
      return this.documentView.garbageCollectCachedViews();
    }
    isEditingAttachment() {
      return !!this.attachmentEditor;
    }
    installAttachmentEditorForAttachment(t3, e2) {
      var i2;
      if ((null === (i2 = this.attachmentEditor) || void 0 === i2 ? void 0 : i2.attachment) === t3) return;
      const n2 = this.documentView.findElementForObject(t3);
      if (!n2) return;
      this.uninstallAttachmentEditor();
      const r3 = this.composition.document.getAttachmentPieceForAttachment(t3);
      this.attachmentEditor = new Yn(r3, n2, this.element, e2), this.attachmentEditor.delegate = this;
    }
    uninstallAttachmentEditor() {
      var t3;
      return null === (t3 = this.attachmentEditor) || void 0 === t3 ? void 0 : t3.uninstall();
    }
    didUninstallAttachmentEditor() {
      return this.attachmentEditor = null, this.render();
    }
    attachmentEditorDidRequestUpdatingAttributesForAttachment(t3, e2) {
      var i2, n2;
      return null === (i2 = this.delegate) || void 0 === i2 || null === (n2 = i2.compositionControllerWillUpdateAttachment) || void 0 === n2 || n2.call(i2, e2), this.composition.updateAttributesForAttachment(t3, e2);
    }
    attachmentEditorDidRequestRemovingAttributeForAttachment(t3, e2) {
      var i2, n2;
      return null === (i2 = this.delegate) || void 0 === i2 || null === (n2 = i2.compositionControllerWillUpdateAttachment) || void 0 === n2 || n2.call(i2, e2), this.composition.removeAttributeForAttachment(t3, e2);
    }
    attachmentEditorDidRequestRemovalOfAttachment(t3) {
      var e2, i2;
      return null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.compositionControllerDidRequestRemovalOfAttachment) || void 0 === i2 ? void 0 : i2.call(e2, t3);
    }
    attachmentEditorDidRequestDeselectingAttachment(t3) {
      var e2, i2;
      return null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.compositionControllerDidRequestDeselectingAttachment) || void 0 === i2 ? void 0 : i2.call(e2, t3);
    }
    canSyncDocumentView() {
      return !this.isEditingAttachment();
    }
    findAttachmentForElement(t3) {
      return this.composition.document.getAttachmentById(parseInt(t3.dataset.trixId, 10));
    }
  };
  var $n = class extends q {
  };
  var Zn = "data-trix-mutable";
  var Qn = "[".concat(Zn, "]");
  var tr = { attributes: true, childList: true, characterData: true, characterDataOldValue: true, subtree: true };
  var er = class extends q {
    constructor(t3) {
      super(t3), this.didMutate = this.didMutate.bind(this), this.element = t3, this.observer = new window.MutationObserver(this.didMutate), this.start();
    }
    start() {
      return this.reset(), this.observer.observe(this.element, tr);
    }
    stop() {
      return this.observer.disconnect();
    }
    didMutate(t3) {
      var e2, i2;
      if (this.mutations.push(...Array.from(this.findSignificantMutations(t3) || [])), this.mutations.length) return null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.elementDidMutate) || void 0 === i2 || i2.call(e2, this.getMutationSummary()), this.reset();
    }
    reset() {
      this.mutations = [];
    }
    findSignificantMutations(t3) {
      return t3.filter(((t4) => this.mutationIsSignificant(t4)));
    }
    mutationIsSignificant(t3) {
      if (this.nodeIsMutable(t3.target)) return false;
      for (const e2 of Array.from(this.nodesModifiedByMutation(t3))) if (this.nodeIsSignificant(e2)) return true;
      return false;
    }
    nodeIsSignificant(t3) {
      return t3 !== this.element && !this.nodeIsMutable(t3) && !M(t3);
    }
    nodeIsMutable(t3) {
      return y(t3, { matchingSelector: Qn });
    }
    nodesModifiedByMutation(t3) {
      const e2 = [];
      switch (t3.type) {
        case "attributes":
          t3.attributeName !== Zn && e2.push(t3.target);
          break;
        case "characterData":
          e2.push(t3.target.parentNode), e2.push(t3.target);
          break;
        case "childList":
          e2.push(...Array.from(t3.addedNodes || [])), e2.push(...Array.from(t3.removedNodes || []));
      }
      return e2;
    }
    getMutationSummary() {
      return this.getTextMutationSummary();
    }
    getTextMutationSummary() {
      const { additions: t3, deletions: e2 } = this.getTextChangesFromCharacterData(), i2 = this.getTextChangesFromChildList();
      Array.from(i2.additions).forEach(((e3) => {
        Array.from(t3).includes(e3) || t3.push(e3);
      })), e2.push(...Array.from(i2.deletions || []));
      const n2 = {}, r3 = t3.join("");
      r3 && (n2.textAdded = r3);
      const o2 = e2.join("");
      return o2 && (n2.textDeleted = o2), n2;
    }
    getMutationsByType(t3) {
      return Array.from(this.mutations).filter(((e2) => e2.type === t3));
    }
    getTextChangesFromChildList() {
      let t3, e2;
      const i2 = [], n2 = [];
      Array.from(this.getMutationsByType("childList")).forEach(((t4) => {
        i2.push(...Array.from(t4.addedNodes || [])), n2.push(...Array.from(t4.removedNodes || []));
      }));
      0 === i2.length && 1 === n2.length && I(n2[0]) ? (t3 = [], e2 = ["\n"]) : (t3 = ir(i2), e2 = ir(n2));
      const r3 = t3.filter(((t4, i3) => t4 !== e2[i3])).map(Wt), o2 = e2.filter(((e3, i3) => e3 !== t3[i3])).map(Wt);
      return { additions: r3, deletions: o2 };
    }
    getTextChangesFromCharacterData() {
      let t3, e2;
      const i2 = this.getMutationsByType("characterData");
      if (i2.length) {
        const n2 = i2[0], r3 = i2[i2.length - 1], o2 = (function(t4, e3) {
          let i3, n3;
          return t4 = $.box(t4), (e3 = $.box(e3)).length < t4.length ? [n3, i3] = zt(t4, e3) : [i3, n3] = zt(e3, t4), { added: i3, removed: n3 };
        })(Wt(n2.oldValue), Wt(r3.target.data));
        t3 = o2.added, e2 = o2.removed;
      }
      return { additions: t3 ? [t3] : [], deletions: e2 ? [e2] : [] };
    }
  };
  var ir = function() {
    let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
    const e2 = [];
    for (const i2 of Array.from(t3)) switch (i2.nodeType) {
      case Node.TEXT_NODE:
        e2.push(i2.data);
        break;
      case Node.ELEMENT_NODE:
        "br" === k(i2) ? e2.push("\n") : e2.push(...Array.from(ir(i2.childNodes) || []));
    }
    return e2;
  };
  var nr = class extends ee {
    constructor(t3) {
      super(...arguments), this.file = t3;
    }
    perform(t3) {
      const e2 = new FileReader();
      return e2.onerror = () => t3(false), e2.onload = () => {
        e2.onerror = null;
        try {
          e2.abort();
        } catch (t4) {
        }
        return t3(true, this.file);
      }, e2.readAsArrayBuffer(this.file);
    }
  };
  var rr = class {
    constructor(t3) {
      this.element = t3;
    }
    shouldIgnore(t3) {
      return !!a.samsungAndroid && (this.previousEvent = this.event, this.event = t3, this.checkSamsungKeyboardBuggyModeStart(), this.checkSamsungKeyboardBuggyModeEnd(), this.buggyMode);
    }
    checkSamsungKeyboardBuggyModeStart() {
      this.insertingLongTextAfterUnidentifiedChar() && or(this.element.innerText, this.event.data) && (this.buggyMode = true, this.event.preventDefault());
    }
    checkSamsungKeyboardBuggyModeEnd() {
      this.buggyMode && "insertText" !== this.event.inputType && (this.buggyMode = false);
    }
    insertingLongTextAfterUnidentifiedChar() {
      var t3;
      return this.isBeforeInputInsertText() && this.previousEventWasUnidentifiedKeydown() && (null === (t3 = this.event.data) || void 0 === t3 ? void 0 : t3.length) > 50;
    }
    isBeforeInputInsertText() {
      return "beforeinput" === this.event.type && "insertText" === this.event.inputType;
    }
    previousEventWasUnidentifiedKeydown() {
      var t3, e2;
      return "keydown" === (null === (t3 = this.previousEvent) || void 0 === t3 ? void 0 : t3.type) && "Unidentified" === (null === (e2 = this.previousEvent) || void 0 === e2 ? void 0 : e2.key);
    }
  };
  var or = (t3, e2) => ar(t3) === ar(e2);
  var sr = new RegExp("(".concat("\uFFFC", "|").concat(d, "|").concat(g, "|\\s)+"), "g");
  var ar = (t3) => t3.replace(sr, " ").trim();
  var lr = class extends q {
    constructor(t3) {
      super(...arguments), this.element = t3, this.mutationObserver = new er(this.element), this.mutationObserver.delegate = this, this.flakyKeyboardDetector = new rr(this.element);
      for (const t4 in this.constructor.events) b(t4, { onElement: this.element, withCallback: this.handlerFor(t4) });
    }
    elementDidMutate(t3) {
    }
    editorWillSyncDocumentView() {
      return this.mutationObserver.stop();
    }
    editorDidSyncDocumentView() {
      return this.mutationObserver.start();
    }
    requestRender() {
      var t3, e2;
      return null === (t3 = this.delegate) || void 0 === t3 || null === (e2 = t3.inputControllerDidRequestRender) || void 0 === e2 ? void 0 : e2.call(t3);
    }
    requestReparse() {
      var t3, e2;
      return null === (t3 = this.delegate) || void 0 === t3 || null === (e2 = t3.inputControllerDidRequestReparse) || void 0 === e2 || e2.call(t3), this.requestRender();
    }
    attachFiles(t3) {
      const e2 = Array.from(t3).map(((t4) => new nr(t4)));
      return Promise.all(e2).then(((t4) => {
        this.handleInput((function() {
          var e3, i2;
          return null === (e3 = this.delegate) || void 0 === e3 || e3.inputControllerWillAttachFiles(), null === (i2 = this.responder) || void 0 === i2 || i2.insertFiles(t4), this.requestRender();
        }));
      }));
    }
    handlerFor(t3) {
      return (e2) => {
        e2.defaultPrevented || this.handleInput((() => {
          if (!x(this.element)) {
            if (this.flakyKeyboardDetector.shouldIgnore(e2)) return;
            this.eventName = t3, this.constructor.events[t3].call(this, e2);
          }
        }));
      };
    }
    handleInput(t3) {
      try {
        var e2;
        null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillHandleInput(), t3.call(this);
      } finally {
        var i2;
        null === (i2 = this.delegate) || void 0 === i2 || i2.inputControllerDidHandleInput();
      }
    }
    createLinkHTML(t3, e2) {
      const i2 = document.createElement("a");
      return i2.href = t3, i2.textContent = e2 || t3, i2.outerHTML;
    }
  };
  var cr;
  Di(lr, "events", {});
  var { browser: ur, keyNames: hr } = z;
  var dr = 0;
  var gr = class extends lr {
    constructor() {
      super(...arguments), this.resetInputSummary();
    }
    setInputSummary() {
      let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      this.inputSummary.eventName = this.eventName;
      for (const e2 in t3) {
        const i2 = t3[e2];
        this.inputSummary[e2] = i2;
      }
      return this.inputSummary;
    }
    resetInputSummary() {
      this.inputSummary = {};
    }
    reset() {
      return this.resetInputSummary(), Ft.reset();
    }
    elementDidMutate(t3) {
      var e2, i2;
      return this.isComposing() ? null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.inputControllerDidAllowUnhandledInput) || void 0 === i2 ? void 0 : i2.call(e2) : this.handleInput((function() {
        return this.mutationIsSignificant(t3) && (this.mutationIsExpected(t3) ? this.requestRender() : this.requestReparse()), this.reset();
      }));
    }
    mutationIsExpected(t3) {
      let { textAdded: e2, textDeleted: i2 } = t3;
      if (this.inputSummary.preferDocument) return true;
      const n2 = null != e2 ? e2 === this.inputSummary.textAdded : !this.inputSummary.textAdded, r3 = null != i2 ? this.inputSummary.didDelete : !this.inputSummary.didDelete, o2 = ["\n", " \n"].includes(e2) && !n2, s2 = "\n" === i2 && !r3;
      if (o2 && !s2 || s2 && !o2) {
        const t4 = this.getSelectedRange();
        if (t4) {
          var a2;
          const i3 = o2 ? e2.replace(/\n$/, "").length || -1 : (null == e2 ? void 0 : e2.length) || 1;
          if (null !== (a2 = this.responder) && void 0 !== a2 && a2.positionIsBlockBreak(t4[1] + i3)) return true;
        }
      }
      return n2 && r3;
    }
    mutationIsSignificant(t3) {
      var e2;
      const i2 = Object.keys(t3).length > 0, n2 = "" === (null === (e2 = this.compositionInput) || void 0 === e2 ? void 0 : e2.getEndData());
      return i2 || !n2;
    }
    getCompositionInput() {
      if (this.isComposing()) return this.compositionInput;
      this.compositionInput = new vr(this);
    }
    isComposing() {
      return this.compositionInput && !this.compositionInput.isEnded();
    }
    deleteInDirection(t3, e2) {
      var i2;
      return false !== (null === (i2 = this.responder) || void 0 === i2 ? void 0 : i2.deleteInDirection(t3)) ? this.setInputSummary({ didDelete: true }) : e2 ? (e2.preventDefault(), this.requestRender()) : void 0;
    }
    serializeSelectionToDataTransfer(t3) {
      var e2;
      if (!(function(t4) {
        if (null == t4 || !t4.setData) return false;
        for (const e3 in Ct) {
          const i3 = Ct[e3];
          try {
            if (t4.setData(e3, i3), !t4.getData(e3) === i3) return false;
          } catch (t5) {
            return false;
          }
        }
        return true;
      })(t3)) return;
      const i2 = null === (e2 = this.responder) || void 0 === e2 ? void 0 : e2.getSelectedDocument().toSerializableDocument();
      return t3.setData("application/x-trix-document", JSON.stringify(i2)), t3.setData("text/html", Si.render(i2).innerHTML), t3.setData("text/plain", i2.toString().replace(/\n$/, "")), true;
    }
    canAcceptDataTransfer(t3) {
      const e2 = {};
      return Array.from((null == t3 ? void 0 : t3.types) || []).forEach(((t4) => {
        e2[t4] = true;
      })), e2.Files || e2["application/x-trix-document"] || e2["text/html"] || e2["text/plain"];
    }
    getPastedHTMLUsingHiddenElement(t3) {
      const e2 = this.getSelectedRange(), i2 = { position: "absolute", left: "".concat(window.pageXOffset, "px"), top: "".concat(window.pageYOffset, "px"), opacity: 0 }, n2 = T({ style: i2, tagName: "div", editable: true });
      return document.body.appendChild(n2), n2.focus(), requestAnimationFrame((() => {
        const i3 = n2.innerHTML;
        return S(n2), this.setSelectedRange(e2), t3(i3);
      }));
    }
  };
  Di(gr, "events", { keydown(t3) {
    this.isComposing() || this.resetInputSummary(), this.inputSummary.didInput = true;
    const e2 = hr[t3.keyCode];
    if (e2) {
      var i2;
      let n3 = this.keys;
      ["ctrl", "alt", "shift", "meta"].forEach(((e3) => {
        var i3;
        t3["".concat(e3, "Key")] && ("ctrl" === e3 && (e3 = "control"), n3 = null === (i3 = n3) || void 0 === i3 ? void 0 : i3[e3]);
      })), null != (null === (i2 = n3) || void 0 === i2 ? void 0 : i2[e2]) && (this.setInputSummary({ keyName: e2 }), Ft.reset(), n3[e2].call(this, t3));
    }
    if (St(t3)) {
      const e3 = String.fromCharCode(t3.keyCode).toLowerCase();
      if (e3) {
        var n2;
        const i3 = ["alt", "shift"].map(((e4) => {
          if (t3["".concat(e4, "Key")]) return e4;
        })).filter(((t4) => t4));
        i3.push(e3), null !== (n2 = this.delegate) && void 0 !== n2 && n2.inputControllerDidReceiveKeyboardCommand(i3) && t3.preventDefault();
      }
    }
  }, keypress(t3) {
    if (null != this.inputSummary.eventName) return;
    if (t3.metaKey) return;
    if (t3.ctrlKey && !t3.altKey) return;
    const e2 = fr(t3);
    var i2, n2;
    return e2 ? (null === (i2 = this.delegate) || void 0 === i2 || i2.inputControllerWillPerformTyping(), null === (n2 = this.responder) || void 0 === n2 || n2.insertString(e2), this.setInputSummary({ textAdded: e2, didDelete: this.selectionIsExpanded() })) : void 0;
  }, textInput(t3) {
    const { data: e2 } = t3, { textAdded: i2 } = this.inputSummary;
    if (i2 && i2 !== e2 && i2.toUpperCase() === e2) {
      var n2;
      const t4 = this.getSelectedRange();
      return this.setSelectedRange([t4[0], t4[1] + i2.length]), null === (n2 = this.responder) || void 0 === n2 || n2.insertString(e2), this.setInputSummary({ textAdded: e2 }), this.setSelectedRange(t4);
    }
  }, dragenter(t3) {
    t3.preventDefault();
  }, dragstart(t3) {
    var e2, i2;
    return this.serializeSelectionToDataTransfer(t3.dataTransfer), this.draggedRange = this.getSelectedRange(), null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.inputControllerDidStartDrag) || void 0 === i2 ? void 0 : i2.call(e2);
  }, dragover(t3) {
    if (this.draggedRange || this.canAcceptDataTransfer(t3.dataTransfer)) {
      t3.preventDefault();
      const n2 = { x: t3.clientX, y: t3.clientY };
      var e2, i2;
      if (!Tt(n2, this.draggingPoint)) return this.draggingPoint = n2, null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.inputControllerDidReceiveDragOverPoint) || void 0 === i2 ? void 0 : i2.call(e2, this.draggingPoint);
    }
  }, dragend(t3) {
    var e2, i2;
    null === (e2 = this.delegate) || void 0 === e2 || null === (i2 = e2.inputControllerDidCancelDrag) || void 0 === i2 || i2.call(e2), this.draggedRange = null, this.draggingPoint = null;
  }, drop(t3) {
    var e2, i2;
    t3.preventDefault();
    const n2 = null === (e2 = t3.dataTransfer) || void 0 === e2 ? void 0 : e2.files, r3 = t3.dataTransfer.getData("application/x-trix-document"), o2 = { x: t3.clientX, y: t3.clientY };
    if (null === (i2 = this.responder) || void 0 === i2 || i2.setLocationRangeFromPointRange(o2), null != n2 && n2.length) this.attachFiles(n2);
    else if (this.draggedRange) {
      var s2, a2;
      null === (s2 = this.delegate) || void 0 === s2 || s2.inputControllerWillMoveText(), null === (a2 = this.responder) || void 0 === a2 || a2.moveTextFromRange(this.draggedRange), this.draggedRange = null, this.requestRender();
    } else if (r3) {
      var l3;
      const t4 = an.fromJSONString(r3);
      null === (l3 = this.responder) || void 0 === l3 || l3.insertDocument(t4), this.requestRender();
    }
    this.draggedRange = null, this.draggingPoint = null;
  }, cut(t3) {
    var e2, i2;
    if (null !== (e2 = this.responder) && void 0 !== e2 && e2.selectionIsExpanded() && (this.serializeSelectionToDataTransfer(t3.clipboardData) && t3.preventDefault(), null === (i2 = this.delegate) || void 0 === i2 || i2.inputControllerWillCutText(), this.deleteInDirection("backward"), t3.defaultPrevented)) return this.requestRender();
  }, copy(t3) {
    var e2;
    null !== (e2 = this.responder) && void 0 !== e2 && e2.selectionIsExpanded() && this.serializeSelectionToDataTransfer(t3.clipboardData) && t3.preventDefault();
  }, paste(t3) {
    const e2 = t3.clipboardData || t3.testClipboardData, i2 = { clipboard: e2 };
    if (!e2 || br(t3)) return void this.getPastedHTMLUsingHiddenElement(((t4) => {
      var e3, n3, r4;
      return i2.type = "text/html", i2.html = t4, null === (e3 = this.delegate) || void 0 === e3 || e3.inputControllerWillPaste(i2), null === (n3 = this.responder) || void 0 === n3 || n3.insertHTML(i2.html), this.requestRender(), null === (r4 = this.delegate) || void 0 === r4 ? void 0 : r4.inputControllerDidPaste(i2);
    }));
    const n2 = e2.getData("URL"), r3 = e2.getData("text/html"), o2 = e2.getData("public.url-name");
    if (n2) {
      var s2, a2, l3;
      let t4;
      i2.type = "text/html", t4 = o2 ? Vt(o2).trim() : n2, i2.html = this.createLinkHTML(n2, t4), null === (s2 = this.delegate) || void 0 === s2 || s2.inputControllerWillPaste(i2), this.setInputSummary({ textAdded: t4, didDelete: this.selectionIsExpanded() }), null === (a2 = this.responder) || void 0 === a2 || a2.insertHTML(i2.html), this.requestRender(), null === (l3 = this.delegate) || void 0 === l3 || l3.inputControllerDidPaste(i2);
    } else if (Et(e2)) {
      var c2, u2, h2;
      i2.type = "text/plain", i2.string = e2.getData("text/plain"), null === (c2 = this.delegate) || void 0 === c2 || c2.inputControllerWillPaste(i2), this.setInputSummary({ textAdded: i2.string, didDelete: this.selectionIsExpanded() }), null === (u2 = this.responder) || void 0 === u2 || u2.insertString(i2.string), this.requestRender(), null === (h2 = this.delegate) || void 0 === h2 || h2.inputControllerDidPaste(i2);
    } else if (r3) {
      var d2, g2, m2;
      i2.type = "text/html", i2.html = r3, null === (d2 = this.delegate) || void 0 === d2 || d2.inputControllerWillPaste(i2), null === (g2 = this.responder) || void 0 === g2 || g2.insertHTML(i2.html), this.requestRender(), null === (m2 = this.delegate) || void 0 === m2 || m2.inputControllerDidPaste(i2);
    } else if (Array.from(e2.types).includes("Files")) {
      var p2, f2;
      const t4 = null === (p2 = e2.items) || void 0 === p2 || null === (p2 = p2[0]) || void 0 === p2 || null === (f2 = p2.getAsFile) || void 0 === f2 ? void 0 : f2.call(p2);
      if (t4) {
        var b2, v2, A2;
        const e3 = mr(t4);
        !t4.name && e3 && (t4.name = "pasted-file-".concat(++dr, ".").concat(e3)), i2.type = "File", i2.file = t4, null === (b2 = this.delegate) || void 0 === b2 || b2.inputControllerWillAttachFiles(), null === (v2 = this.responder) || void 0 === v2 || v2.insertFile(i2.file), this.requestRender(), null === (A2 = this.delegate) || void 0 === A2 || A2.inputControllerDidPaste(i2);
      }
    }
    t3.preventDefault();
  }, compositionstart(t3) {
    return this.getCompositionInput().start(t3.data);
  }, compositionupdate(t3) {
    return this.getCompositionInput().update(t3.data);
  }, compositionend(t3) {
    return this.getCompositionInput().end(t3.data);
  }, beforeinput(t3) {
    this.inputSummary.didInput = true;
  }, input(t3) {
    return this.inputSummary.didInput = true, t3.stopPropagation();
  } }), Di(gr, "keys", { backspace(t3) {
    var e2;
    return null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillPerformTyping(), this.deleteInDirection("backward", t3);
  }, delete(t3) {
    var e2;
    return null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillPerformTyping(), this.deleteInDirection("forward", t3);
  }, return(t3) {
    var e2, i2;
    return this.setInputSummary({ preferDocument: true }), null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillPerformTyping(), null === (i2 = this.responder) || void 0 === i2 ? void 0 : i2.insertLineBreak();
  }, tab(t3) {
    var e2, i2;
    null !== (e2 = this.responder) && void 0 !== e2 && e2.canIncreaseNestingLevel() && (null === (i2 = this.responder) || void 0 === i2 || i2.increaseNestingLevel(), this.requestRender(), t3.preventDefault());
  }, left(t3) {
    var e2;
    if (this.selectionIsInCursorTarget()) return t3.preventDefault(), null === (e2 = this.responder) || void 0 === e2 ? void 0 : e2.moveCursorInDirection("backward");
  }, right(t3) {
    var e2;
    if (this.selectionIsInCursorTarget()) return t3.preventDefault(), null === (e2 = this.responder) || void 0 === e2 ? void 0 : e2.moveCursorInDirection("forward");
  }, control: { d(t3) {
    var e2;
    return null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillPerformTyping(), this.deleteInDirection("forward", t3);
  }, h(t3) {
    var e2;
    return null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillPerformTyping(), this.deleteInDirection("backward", t3);
  }, o(t3) {
    var e2, i2;
    return t3.preventDefault(), null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillPerformTyping(), null === (i2 = this.responder) || void 0 === i2 || i2.insertString("\n", { updatePosition: false }), this.requestRender();
  } }, shift: { return(t3) {
    var e2, i2;
    null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillPerformTyping(), null === (i2 = this.responder) || void 0 === i2 || i2.insertString("\n"), this.requestRender(), t3.preventDefault();
  }, tab(t3) {
    var e2, i2;
    null !== (e2 = this.responder) && void 0 !== e2 && e2.canDecreaseNestingLevel() && (null === (i2 = this.responder) || void 0 === i2 || i2.decreaseNestingLevel(), this.requestRender(), t3.preventDefault());
  }, left(t3) {
    if (this.selectionIsInCursorTarget()) return t3.preventDefault(), this.expandSelectionInDirection("backward");
  }, right(t3) {
    if (this.selectionIsInCursorTarget()) return t3.preventDefault(), this.expandSelectionInDirection("forward");
  } }, alt: { backspace(t3) {
    var e2;
    return this.setInputSummary({ preferDocument: false }), null === (e2 = this.delegate) || void 0 === e2 ? void 0 : e2.inputControllerWillPerformTyping();
  } }, meta: { backspace(t3) {
    var e2;
    return this.setInputSummary({ preferDocument: false }), null === (e2 = this.delegate) || void 0 === e2 ? void 0 : e2.inputControllerWillPerformTyping();
  } } }), gr.proxyMethod("responder?.getSelectedRange"), gr.proxyMethod("responder?.setSelectedRange"), gr.proxyMethod("responder?.expandSelectionInDirection"), gr.proxyMethod("responder?.selectionIsInCursorTarget"), gr.proxyMethod("responder?.selectionIsExpanded");
  var mr = (t3) => {
    var e2;
    return null === (e2 = t3.type) || void 0 === e2 || null === (e2 = e2.match(/\/(\w+)$/)) || void 0 === e2 ? void 0 : e2[1];
  };
  var pr = !(null === (cr = " ".codePointAt) || void 0 === cr || !cr.call(" ", 0));
  var fr = function(t3) {
    if (t3.key && pr && t3.key.codePointAt(0) === t3.keyCode) return t3.key;
    {
      let e2;
      if (null === t3.which ? e2 = t3.keyCode : 0 !== t3.which && 0 !== t3.charCode && (e2 = t3.charCode), null != e2 && "escape" !== hr[e2]) return $.fromCodepoints([e2]).toString();
    }
  };
  var br = function(t3) {
    const e2 = t3.clipboardData;
    if (e2) {
      if (e2.types.includes("text/html")) {
        for (const t4 of e2.types) {
          const i2 = /^CorePasteboardFlavorType/.test(t4), n2 = /^dyn\./.test(t4) && e2.getData(t4);
          if (i2 || n2) return true;
        }
        return false;
      }
      {
        const t4 = e2.types.includes("com.apple.webarchive"), i2 = e2.types.includes("com.apple.flat-rtfd");
        return t4 || i2;
      }
    }
  };
  var vr = class extends q {
    constructor(t3) {
      super(...arguments), this.inputController = t3, this.responder = this.inputController.responder, this.delegate = this.inputController.delegate, this.inputSummary = this.inputController.inputSummary, this.data = {};
    }
    start(t3) {
      if (this.data.start = t3, this.isSignificant()) {
        var e2, i2;
        if ("keypress" === this.inputSummary.eventName && this.inputSummary.textAdded) null === (i2 = this.responder) || void 0 === i2 || i2.deleteInDirection("left");
        this.selectionIsExpanded() || (this.insertPlaceholder(), this.requestRender()), this.range = null === (e2 = this.responder) || void 0 === e2 ? void 0 : e2.getSelectedRange();
      }
    }
    update(t3) {
      if (this.data.update = t3, this.isSignificant()) {
        const t4 = this.selectPlaceholder();
        t4 && (this.forgetPlaceholder(), this.range = t4);
      }
    }
    end(t3) {
      return this.data.end = t3, this.isSignificant() ? (this.forgetPlaceholder(), this.canApplyToDocument() ? (this.setInputSummary({ preferDocument: true, didInput: false }), null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillPerformTyping(), null === (i2 = this.responder) || void 0 === i2 || i2.setSelectedRange(this.range), null === (n2 = this.responder) || void 0 === n2 || n2.insertString(this.data.end), null === (r3 = this.responder) || void 0 === r3 ? void 0 : r3.setSelectedRange(this.range[0] + this.data.end.length)) : null != this.data.start || null != this.data.update ? (this.requestReparse(), this.inputController.reset()) : void 0) : this.inputController.reset();
      var e2, i2, n2, r3;
    }
    getEndData() {
      return this.data.end;
    }
    isEnded() {
      return null != this.getEndData();
    }
    isSignificant() {
      return !ur.composesExistingText || this.inputSummary.didInput;
    }
    canApplyToDocument() {
      var t3, e2;
      return 0 === (null === (t3 = this.data.start) || void 0 === t3 ? void 0 : t3.length) && (null === (e2 = this.data.end) || void 0 === e2 ? void 0 : e2.length) > 0 && this.range;
    }
  };
  vr.proxyMethod("inputController.setInputSummary"), vr.proxyMethod("inputController.requestRender"), vr.proxyMethod("inputController.requestReparse"), vr.proxyMethod("responder?.selectionIsExpanded"), vr.proxyMethod("responder?.insertPlaceholder"), vr.proxyMethod("responder?.selectPlaceholder"), vr.proxyMethod("responder?.forgetPlaceholder");
  var Ar = class extends lr {
    constructor() {
      super(...arguments), this.render = this.render.bind(this);
    }
    elementDidMutate() {
      return this.scheduledRender ? this.composing ? null === (t3 = this.delegate) || void 0 === t3 || null === (e2 = t3.inputControllerDidAllowUnhandledInput) || void 0 === e2 ? void 0 : e2.call(t3) : void 0 : this.reparse();
      var t3, e2;
    }
    scheduleRender() {
      return this.scheduledRender ? this.scheduledRender : this.scheduledRender = requestAnimationFrame(this.render);
    }
    render() {
      var t3, e2;
      (cancelAnimationFrame(this.scheduledRender), this.scheduledRender = null, this.composing) || (null === (e2 = this.delegate) || void 0 === e2 || e2.render());
      null === (t3 = this.afterRender) || void 0 === t3 || t3.call(this), this.afterRender = null;
    }
    reparse() {
      var t3;
      return null === (t3 = this.delegate) || void 0 === t3 ? void 0 : t3.reparse();
    }
    insertString() {
      var t3;
      let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", i2 = arguments.length > 1 ? arguments[1] : void 0;
      return null === (t3 = this.delegate) || void 0 === t3 || t3.inputControllerWillPerformTyping(), this.withTargetDOMRange((function() {
        var t4;
        return null === (t4 = this.responder) || void 0 === t4 ? void 0 : t4.insertString(e2, i2);
      }));
    }
    toggleAttributeIfSupported(t3) {
      var e2;
      if (gt().includes(t3)) return null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillPerformFormatting(t3), this.withTargetDOMRange((function() {
        var e3;
        return null === (e3 = this.responder) || void 0 === e3 ? void 0 : e3.toggleCurrentAttribute(t3);
      }));
    }
    activateAttributeIfSupported(t3, e2) {
      var i2;
      if (gt().includes(t3)) return null === (i2 = this.delegate) || void 0 === i2 || i2.inputControllerWillPerformFormatting(t3), this.withTargetDOMRange((function() {
        var i3;
        return null === (i3 = this.responder) || void 0 === i3 ? void 0 : i3.setCurrentAttribute(t3, e2);
      }));
    }
    deleteInDirection(t3) {
      let { recordUndoEntry: e2 } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { recordUndoEntry: true };
      var i2;
      e2 && (null === (i2 = this.delegate) || void 0 === i2 || i2.inputControllerWillPerformTyping());
      const n2 = () => {
        var e3;
        return null === (e3 = this.responder) || void 0 === e3 ? void 0 : e3.deleteInDirection(t3);
      }, r3 = this.getTargetDOMRange({ minLength: this.composing ? 1 : 2 });
      return r3 ? this.withTargetDOMRange(r3, n2) : n2();
    }
    withTargetDOMRange(t3, e2) {
      var i2;
      return "function" == typeof t3 && (e2 = t3, t3 = this.getTargetDOMRange()), t3 ? null === (i2 = this.responder) || void 0 === i2 ? void 0 : i2.withTargetDOMRange(t3, e2.bind(this)) : (Ft.reset(), e2.call(this));
    }
    getTargetDOMRange() {
      var t3, e2;
      let { minLength: i2 } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : { minLength: 0 };
      const n2 = null === (t3 = (e2 = this.event).getTargetRanges) || void 0 === t3 ? void 0 : t3.call(e2);
      if (n2 && n2.length) {
        const t4 = yr(n2[0]);
        if (0 === i2 || t4.toString().length >= i2) return t4;
      }
    }
    withEvent(t3, e2) {
      let i2;
      this.event = t3;
      try {
        i2 = e2.call(this);
      } finally {
        this.event = null;
      }
      return i2;
    }
  };
  Di(Ar, "events", { keydown(t3) {
    if (St(t3)) {
      var e2;
      const i2 = Rr(t3);
      null !== (e2 = this.delegate) && void 0 !== e2 && e2.inputControllerDidReceiveKeyboardCommand(i2) && t3.preventDefault();
    } else {
      let e3 = t3.key;
      t3.altKey && (e3 += "+Alt"), t3.shiftKey && (e3 += "+Shift");
      const i2 = this.constructor.keys[e3];
      if (i2) return this.withEvent(t3, i2);
    }
  }, paste(t3) {
    var e2;
    let i2;
    const n2 = null === (e2 = t3.clipboardData) || void 0 === e2 ? void 0 : e2.getData("URL");
    return Er(t3) ? (t3.preventDefault(), this.attachFiles(t3.clipboardData.files)) : Sr(t3) ? (t3.preventDefault(), i2 = { type: "text/plain", string: t3.clipboardData.getData("text/plain") }, null === (r3 = this.delegate) || void 0 === r3 || r3.inputControllerWillPaste(i2), null === (o2 = this.responder) || void 0 === o2 || o2.insertString(i2.string), this.render(), null === (s2 = this.delegate) || void 0 === s2 ? void 0 : s2.inputControllerDidPaste(i2)) : n2 ? (t3.preventDefault(), i2 = { type: "text/html", html: this.createLinkHTML(n2) }, null === (a2 = this.delegate) || void 0 === a2 || a2.inputControllerWillPaste(i2), null === (l3 = this.responder) || void 0 === l3 || l3.insertHTML(i2.html), this.render(), null === (c2 = this.delegate) || void 0 === c2 ? void 0 : c2.inputControllerDidPaste(i2)) : void 0;
    var r3, o2, s2, a2, l3, c2;
  }, beforeinput(t3) {
    const e2 = this.constructor.inputTypes[t3.inputType], i2 = (n2 = t3, !(!/iPhone|iPad/.test(navigator.userAgent) || n2.inputType && "insertParagraph" !== n2.inputType));
    var n2;
    e2 && (this.withEvent(t3, e2), i2 || this.scheduleRender()), i2 && this.render();
  }, input(t3) {
    Ft.reset();
  }, dragstart(t3) {
    var e2, i2;
    null !== (e2 = this.responder) && void 0 !== e2 && e2.selectionContainsAttachments() && (t3.dataTransfer.setData("application/x-trix-dragging", true), this.dragging = { range: null === (i2 = this.responder) || void 0 === i2 ? void 0 : i2.getSelectedRange(), point: kr(t3) });
  }, dragenter(t3) {
    xr(t3) && t3.preventDefault();
  }, dragover(t3) {
    if (this.dragging) {
      t3.preventDefault();
      const i2 = kr(t3);
      var e2;
      if (!Tt(i2, this.dragging.point)) return this.dragging.point = i2, null === (e2 = this.responder) || void 0 === e2 ? void 0 : e2.setLocationRangeFromPointRange(i2);
    } else xr(t3) && t3.preventDefault();
  }, drop(t3) {
    var e2, i2;
    if (this.dragging) return t3.preventDefault(), null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillMoveText(), null === (i2 = this.responder) || void 0 === i2 || i2.moveTextFromRange(this.dragging.range), this.dragging = null, this.scheduleRender();
    if (xr(t3)) {
      var n2;
      t3.preventDefault();
      const e3 = kr(t3);
      return null === (n2 = this.responder) || void 0 === n2 || n2.setLocationRangeFromPointRange(e3), this.attachFiles(t3.dataTransfer.files);
    }
  }, dragend() {
    var t3;
    this.dragging && (null === (t3 = this.responder) || void 0 === t3 || t3.setSelectedRange(this.dragging.range), this.dragging = null);
  }, compositionend(t3) {
    this.composing && (this.composing = false, a.recentAndroid || this.scheduleRender());
  } }), Di(Ar, "keys", { ArrowLeft() {
    var t3, e2;
    if (null !== (t3 = this.responder) && void 0 !== t3 && t3.shouldManageMovingCursorInDirection("backward")) return this.event.preventDefault(), null === (e2 = this.responder) || void 0 === e2 ? void 0 : e2.moveCursorInDirection("backward");
  }, ArrowRight() {
    var t3, e2;
    if (null !== (t3 = this.responder) && void 0 !== t3 && t3.shouldManageMovingCursorInDirection("forward")) return this.event.preventDefault(), null === (e2 = this.responder) || void 0 === e2 ? void 0 : e2.moveCursorInDirection("forward");
  }, Backspace() {
    var t3, e2, i2;
    if (null !== (t3 = this.responder) && void 0 !== t3 && t3.shouldManageDeletingInDirection("backward")) return this.event.preventDefault(), null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillPerformTyping(), null === (i2 = this.responder) || void 0 === i2 || i2.deleteInDirection("backward"), this.render();
  }, Tab() {
    var t3, e2;
    if (null !== (t3 = this.responder) && void 0 !== t3 && t3.canIncreaseNestingLevel()) return this.event.preventDefault(), null === (e2 = this.responder) || void 0 === e2 || e2.increaseNestingLevel(), this.render();
  }, "Tab+Shift"() {
    var t3, e2;
    if (null !== (t3 = this.responder) && void 0 !== t3 && t3.canDecreaseNestingLevel()) return this.event.preventDefault(), null === (e2 = this.responder) || void 0 === e2 || e2.decreaseNestingLevel(), this.render();
  } }), Di(Ar, "inputTypes", { deleteByComposition() {
    return this.deleteInDirection("backward", { recordUndoEntry: false });
  }, deleteByCut() {
    return this.deleteInDirection("backward");
  }, deleteByDrag() {
    return this.event.preventDefault(), this.withTargetDOMRange((function() {
      var t3;
      this.deleteByDragRange = null === (t3 = this.responder) || void 0 === t3 ? void 0 : t3.getSelectedRange();
    }));
  }, deleteCompositionText() {
    return this.deleteInDirection("backward", { recordUndoEntry: false });
  }, deleteContent() {
    return this.deleteInDirection("backward");
  }, deleteContentBackward() {
    return this.deleteInDirection("backward");
  }, deleteContentForward() {
    return this.deleteInDirection("forward");
  }, deleteEntireSoftLine() {
    return this.deleteInDirection("forward");
  }, deleteHardLineBackward() {
    return this.deleteInDirection("backward");
  }, deleteHardLineForward() {
    return this.deleteInDirection("forward");
  }, deleteSoftLineBackward() {
    return this.deleteInDirection("backward");
  }, deleteSoftLineForward() {
    return this.deleteInDirection("forward");
  }, deleteWordBackward() {
    return this.deleteInDirection("backward");
  }, deleteWordForward() {
    return this.deleteInDirection("forward");
  }, formatBackColor() {
    return this.activateAttributeIfSupported("backgroundColor", this.event.data);
  }, formatBold() {
    return this.toggleAttributeIfSupported("bold");
  }, formatFontColor() {
    return this.activateAttributeIfSupported("color", this.event.data);
  }, formatFontName() {
    return this.activateAttributeIfSupported("font", this.event.data);
  }, formatIndent() {
    var t3;
    if (null !== (t3 = this.responder) && void 0 !== t3 && t3.canIncreaseNestingLevel()) return this.withTargetDOMRange((function() {
      var t4;
      return null === (t4 = this.responder) || void 0 === t4 ? void 0 : t4.increaseNestingLevel();
    }));
  }, formatItalic() {
    return this.toggleAttributeIfSupported("italic");
  }, formatJustifyCenter() {
    return this.toggleAttributeIfSupported("justifyCenter");
  }, formatJustifyFull() {
    return this.toggleAttributeIfSupported("justifyFull");
  }, formatJustifyLeft() {
    return this.toggleAttributeIfSupported("justifyLeft");
  }, formatJustifyRight() {
    return this.toggleAttributeIfSupported("justifyRight");
  }, formatOutdent() {
    var t3;
    if (null !== (t3 = this.responder) && void 0 !== t3 && t3.canDecreaseNestingLevel()) return this.withTargetDOMRange((function() {
      var t4;
      return null === (t4 = this.responder) || void 0 === t4 ? void 0 : t4.decreaseNestingLevel();
    }));
  }, formatRemove() {
    this.withTargetDOMRange((function() {
      for (const i2 in null === (t3 = this.responder) || void 0 === t3 ? void 0 : t3.getCurrentAttributes()) {
        var t3, e2;
        null === (e2 = this.responder) || void 0 === e2 || e2.removeCurrentAttribute(i2);
      }
    }));
  }, formatSetBlockTextDirection() {
    return this.activateAttributeIfSupported("blockDir", this.event.data);
  }, formatSetInlineTextDirection() {
    return this.activateAttributeIfSupported("textDir", this.event.data);
  }, formatStrikeThrough() {
    return this.toggleAttributeIfSupported("strike");
  }, formatSubscript() {
    return this.toggleAttributeIfSupported("sub");
  }, formatSuperscript() {
    return this.toggleAttributeIfSupported("sup");
  }, formatUnderline() {
    return this.toggleAttributeIfSupported("underline");
  }, historyRedo() {
    var t3;
    return null === (t3 = this.delegate) || void 0 === t3 ? void 0 : t3.inputControllerWillPerformRedo();
  }, historyUndo() {
    var t3;
    return null === (t3 = this.delegate) || void 0 === t3 ? void 0 : t3.inputControllerWillPerformUndo();
  }, insertCompositionText() {
    return this.composing = true, this.insertString(this.event.data);
  }, insertFromComposition() {
    return this.composing = false, this.insertString(this.event.data);
  }, insertFromDrop() {
    const t3 = this.deleteByDragRange;
    var e2;
    if (t3) return this.deleteByDragRange = null, null === (e2 = this.delegate) || void 0 === e2 || e2.inputControllerWillMoveText(), this.withTargetDOMRange((function() {
      var e3;
      return null === (e3 = this.responder) || void 0 === e3 ? void 0 : e3.moveTextFromRange(t3);
    }));
  }, insertFromPaste() {
    const { dataTransfer: t3 } = this.event, e2 = { dataTransfer: t3 }, i2 = t3.getData("URL"), n2 = t3.getData("text/html");
    if (i2) {
      var r3;
      let n3;
      this.event.preventDefault(), e2.type = "text/html";
      const o3 = t3.getData("public.url-name");
      n3 = o3 ? Vt(o3).trim() : i2, e2.html = this.createLinkHTML(i2, n3), null === (r3 = this.delegate) || void 0 === r3 || r3.inputControllerWillPaste(e2), this.withTargetDOMRange((function() {
        var t4;
        return null === (t4 = this.responder) || void 0 === t4 ? void 0 : t4.insertHTML(e2.html);
      })), this.afterRender = () => {
        var t4;
        return null === (t4 = this.delegate) || void 0 === t4 ? void 0 : t4.inputControllerDidPaste(e2);
      };
    } else if (Et(t3)) {
      var o2;
      e2.type = "text/plain", e2.string = t3.getData("text/plain"), null === (o2 = this.delegate) || void 0 === o2 || o2.inputControllerWillPaste(e2), this.withTargetDOMRange((function() {
        var t4;
        return null === (t4 = this.responder) || void 0 === t4 ? void 0 : t4.insertString(e2.string);
      })), this.afterRender = () => {
        var t4;
        return null === (t4 = this.delegate) || void 0 === t4 ? void 0 : t4.inputControllerDidPaste(e2);
      };
    } else if (Cr(this.event)) {
      var s2;
      e2.type = "File", e2.file = t3.files[0], null === (s2 = this.delegate) || void 0 === s2 || s2.inputControllerWillPaste(e2), this.withTargetDOMRange((function() {
        var t4;
        return null === (t4 = this.responder) || void 0 === t4 ? void 0 : t4.insertFile(e2.file);
      })), this.afterRender = () => {
        var t4;
        return null === (t4 = this.delegate) || void 0 === t4 ? void 0 : t4.inputControllerDidPaste(e2);
      };
    } else if (n2) {
      var a2;
      this.event.preventDefault(), e2.type = "text/html", e2.html = n2, null === (a2 = this.delegate) || void 0 === a2 || a2.inputControllerWillPaste(e2), this.withTargetDOMRange((function() {
        var t4;
        return null === (t4 = this.responder) || void 0 === t4 ? void 0 : t4.insertHTML(e2.html);
      })), this.afterRender = () => {
        var t4;
        return null === (t4 = this.delegate) || void 0 === t4 ? void 0 : t4.inputControllerDidPaste(e2);
      };
    }
  }, insertFromYank() {
    return this.insertString(this.event.data);
  }, insertLineBreak() {
    return this.insertString("\n");
  }, insertLink() {
    return this.activateAttributeIfSupported("href", this.event.data);
  }, insertOrderedList() {
    return this.toggleAttributeIfSupported("number");
  }, insertParagraph() {
    var t3;
    return null === (t3 = this.delegate) || void 0 === t3 || t3.inputControllerWillPerformTyping(), this.withTargetDOMRange((function() {
      var t4;
      return null === (t4 = this.responder) || void 0 === t4 ? void 0 : t4.insertLineBreak();
    }));
  }, insertReplacementText() {
    const t3 = this.event.dataTransfer.getData("text/plain"), e2 = this.event.getTargetRanges()[0];
    this.withTargetDOMRange(e2, (() => {
      this.insertString(t3, { updatePosition: false });
    }));
  }, insertText() {
    var t3;
    return this.insertString(this.event.data || (null === (t3 = this.event.dataTransfer) || void 0 === t3 ? void 0 : t3.getData("text/plain")));
  }, insertTranspose() {
    return this.insertString(this.event.data);
  }, insertUnorderedList() {
    return this.toggleAttributeIfSupported("bullet");
  } });
  var yr = function(t3) {
    const e2 = document.createRange();
    return e2.setStart(t3.startContainer, t3.startOffset), e2.setEnd(t3.endContainer, t3.endOffset), e2;
  };
  var xr = (t3) => {
    var e2;
    return Array.from((null === (e2 = t3.dataTransfer) || void 0 === e2 ? void 0 : e2.types) || []).includes("Files");
  };
  var Cr = (t3) => {
    var e2;
    return (null === (e2 = t3.dataTransfer.files) || void 0 === e2 ? void 0 : e2[0]) && !Er(t3) && !((t4) => {
      let { dataTransfer: e3 } = t4;
      return e3.types.includes("Files") && e3.types.includes("text/html") && e3.getData("text/html").includes("urn:schemas-microsoft-com:office:office");
    })(t3);
  };
  var Er = function(t3) {
    const e2 = t3.clipboardData;
    if (e2) {
      return Array.from(e2.types).filter(((t4) => t4.match(/file/i))).length === e2.types.length && e2.files.length >= 1;
    }
  };
  var Sr = function(t3) {
    const e2 = t3.clipboardData;
    if (e2) return e2.types.includes("text/plain") && 1 === e2.types.length;
  };
  var Rr = function(t3) {
    const e2 = [];
    return t3.altKey && e2.push("alt"), t3.shiftKey && e2.push("shift"), e2.push(t3.key), e2;
  };
  var kr = (t3) => ({ x: t3.clientX, y: t3.clientY });
  var Tr = "[data-trix-attribute]";
  var wr = "[data-trix-action]";
  var Lr = "".concat(Tr, ", ").concat(wr);
  var Dr = "[data-trix-dialog]";
  var Nr = "".concat(Dr, "[data-trix-active]");
  var Ir = "".concat(Dr, " [data-trix-method]");
  var Or = "".concat(Dr, " [data-trix-input]");
  var Fr = (t3, e2) => (e2 || (e2 = Mr(t3)), t3.querySelector("[data-trix-input][name='".concat(e2, "']")));
  var Pr = (t3) => t3.getAttribute("data-trix-action");
  var Mr = (t3) => t3.getAttribute("data-trix-attribute") || t3.getAttribute("data-trix-dialog-attribute");
  var Br = class extends q {
    constructor(t3) {
      super(t3), this.didClickActionButton = this.didClickActionButton.bind(this), this.didClickAttributeButton = this.didClickAttributeButton.bind(this), this.didClickDialogButton = this.didClickDialogButton.bind(this), this.didKeyDownDialogInput = this.didKeyDownDialogInput.bind(this), this.element = t3, this.attributes = {}, this.actions = {}, this.resetDialogInputs(), b("mousedown", { onElement: this.element, matchingSelector: wr, withCallback: this.didClickActionButton }), b("mousedown", { onElement: this.element, matchingSelector: Tr, withCallback: this.didClickAttributeButton }), b("click", { onElement: this.element, matchingSelector: Lr, preventDefault: true }), b("click", { onElement: this.element, matchingSelector: Ir, withCallback: this.didClickDialogButton }), b("keydown", { onElement: this.element, matchingSelector: Or, withCallback: this.didKeyDownDialogInput });
    }
    didClickActionButton(t3, e2) {
      var i2;
      null === (i2 = this.delegate) || void 0 === i2 || i2.toolbarDidClickButton(), t3.preventDefault();
      const n2 = Pr(e2);
      return this.getDialog(n2) ? this.toggleDialog(n2) : null === (r3 = this.delegate) || void 0 === r3 ? void 0 : r3.toolbarDidInvokeAction(n2, e2);
      var r3;
    }
    didClickAttributeButton(t3, e2) {
      var i2;
      null === (i2 = this.delegate) || void 0 === i2 || i2.toolbarDidClickButton(), t3.preventDefault();
      const n2 = Mr(e2);
      var r3;
      this.getDialog(n2) ? this.toggleDialog(n2) : null === (r3 = this.delegate) || void 0 === r3 || r3.toolbarDidToggleAttribute(n2);
      return this.refreshAttributeButtons();
    }
    didClickDialogButton(t3, e2) {
      const i2 = y(e2, { matchingSelector: Dr });
      return this[e2.getAttribute("data-trix-method")].call(this, i2);
    }
    didKeyDownDialogInput(t3, e2) {
      if (13 === t3.keyCode) {
        t3.preventDefault();
        const i2 = e2.getAttribute("name"), n2 = this.getDialog(i2);
        this.setAttribute(n2);
      }
      if (27 === t3.keyCode) return t3.preventDefault(), this.hideDialog();
    }
    updateActions(t3) {
      return this.actions = t3, this.refreshActionButtons();
    }
    refreshActionButtons() {
      return this.eachActionButton(((t3, e2) => {
        t3.disabled = false === this.actions[e2];
      }));
    }
    eachActionButton(t3) {
      return Array.from(this.element.querySelectorAll(wr)).map(((e2) => t3(e2, Pr(e2))));
    }
    updateAttributes(t3) {
      return this.attributes = t3, this.refreshAttributeButtons();
    }
    refreshAttributeButtons() {
      return this.eachAttributeButton(((t3, e2) => (t3.disabled = false === this.attributes[e2], this.attributes[e2] || this.dialogIsVisible(e2) ? (t3.setAttribute("data-trix-active", ""), t3.classList.add("trix-active")) : (t3.removeAttribute("data-trix-active"), t3.classList.remove("trix-active")))));
    }
    eachAttributeButton(t3) {
      return Array.from(this.element.querySelectorAll(Tr)).map(((e2) => t3(e2, Mr(e2))));
    }
    applyKeyboardCommand(t3) {
      const e2 = JSON.stringify(t3.sort());
      for (const t4 of Array.from(this.element.querySelectorAll("[data-trix-key]"))) {
        const i2 = t4.getAttribute("data-trix-key").split("+");
        if (JSON.stringify(i2.sort()) === e2) return v("mousedown", { onElement: t4 }), true;
      }
      return false;
    }
    dialogIsVisible(t3) {
      const e2 = this.getDialog(t3);
      if (e2) return e2.hasAttribute("data-trix-active");
    }
    toggleDialog(t3) {
      return this.dialogIsVisible(t3) ? this.hideDialog() : this.showDialog(t3);
    }
    showDialog(t3) {
      var e2, i2;
      this.hideDialog(), null === (e2 = this.delegate) || void 0 === e2 || e2.toolbarWillShowDialog();
      const n2 = this.getDialog(t3);
      n2.setAttribute("data-trix-active", ""), n2.classList.add("trix-active"), Array.from(n2.querySelectorAll("input[disabled]")).forEach(((t4) => {
        t4.removeAttribute("disabled");
      }));
      const r3 = Mr(n2);
      if (r3) {
        const e3 = Fr(n2, t3);
        e3 && (e3.value = this.attributes[r3] || "", e3.select());
      }
      return null === (i2 = this.delegate) || void 0 === i2 ? void 0 : i2.toolbarDidShowDialog(t3);
    }
    setAttribute(t3) {
      var e2;
      const i2 = Mr(t3), n2 = Fr(t3, i2);
      return !n2.willValidate || (n2.setCustomValidity(""), n2.checkValidity() && this.isSafeAttribute(n2)) ? (null === (e2 = this.delegate) || void 0 === e2 || e2.toolbarDidUpdateAttribute(i2, n2.value), this.hideDialog()) : (n2.setCustomValidity("Invalid value"), n2.setAttribute("data-trix-validate", ""), n2.classList.add("trix-validate"), n2.focus());
    }
    isSafeAttribute(t3) {
      return !t3.hasAttribute("data-trix-validate-href") || li.isValidAttribute("a", "href", t3.value);
    }
    removeAttribute(t3) {
      var e2;
      const i2 = Mr(t3);
      return null === (e2 = this.delegate) || void 0 === e2 || e2.toolbarDidRemoveAttribute(i2), this.hideDialog();
    }
    hideDialog() {
      const t3 = this.element.querySelector(Nr);
      var e2;
      if (t3) return t3.removeAttribute("data-trix-active"), t3.classList.remove("trix-active"), this.resetDialogInputs(), null === (e2 = this.delegate) || void 0 === e2 ? void 0 : e2.toolbarDidHideDialog(((t4) => t4.getAttribute("data-trix-dialog"))(t3));
    }
    resetDialogInputs() {
      Array.from(this.element.querySelectorAll(Or)).forEach(((t3) => {
        t3.setAttribute("disabled", "disabled"), t3.removeAttribute("data-trix-validate"), t3.classList.remove("trix-validate");
      }));
    }
    getDialog(t3) {
      return this.element.querySelector("[data-trix-dialog=".concat(t3, "]"));
    }
  };
  var _r = class extends $n {
    constructor(t3) {
      let { editorElement: e2, document: i2, html: n2 } = t3;
      super(...arguments), this.editorElement = e2, this.selectionManager = new Vn(this.editorElement), this.selectionManager.delegate = this, this.composition = new wn(), this.composition.delegate = this, this.attachmentManager = new kn(this.composition.getAttachments()), this.attachmentManager.delegate = this, this.inputController = 2 === _.getLevel() ? new Ar(this.editorElement) : new gr(this.editorElement), this.inputController.delegate = this, this.inputController.responder = this.composition, this.compositionController = new Xn(this.editorElement, this.composition), this.compositionController.delegate = this, this.toolbarController = new Br(this.editorElement.toolbarElement), this.toolbarController.delegate = this, this.editor = new Pn(this.composition, this.selectionManager, this.editorElement), i2 ? this.editor.loadDocument(i2) : this.editor.loadHTML(n2);
    }
    registerSelectionManager() {
      return Ft.registerSelectionManager(this.selectionManager);
    }
    unregisterSelectionManager() {
      return Ft.unregisterSelectionManager(this.selectionManager);
    }
    render() {
      return this.compositionController.render();
    }
    reparse() {
      return this.composition.replaceHTML(this.editorElement.innerHTML);
    }
    compositionDidChangeDocument(t3) {
      if (this.notifyEditorElement("document-change"), !this.handlingInput) return this.render();
    }
    compositionDidChangeCurrentAttributes(t3) {
      return this.currentAttributes = t3, this.toolbarController.updateAttributes(this.currentAttributes), this.updateCurrentActions(), this.notifyEditorElement("attributes-change", { attributes: this.currentAttributes });
    }
    compositionDidPerformInsertionAtRange(t3) {
      this.pasting && (this.pastedRange = t3);
    }
    compositionShouldAcceptFile(t3) {
      return this.notifyEditorElement("file-accept", { file: t3 });
    }
    compositionDidAddAttachment(t3) {
      const e2 = this.attachmentManager.manageAttachment(t3);
      return this.notifyEditorElement("attachment-add", { attachment: e2 });
    }
    compositionDidEditAttachment(t3) {
      this.compositionController.rerenderViewForObject(t3);
      const e2 = this.attachmentManager.manageAttachment(t3);
      return this.notifyEditorElement("attachment-edit", { attachment: e2 }), this.notifyEditorElement("change");
    }
    compositionDidChangeAttachmentPreviewURL(t3) {
      return this.compositionController.invalidateViewForObject(t3), this.notifyEditorElement("change");
    }
    compositionDidRemoveAttachment(t3) {
      const e2 = this.attachmentManager.unmanageAttachment(t3);
      return this.notifyEditorElement("attachment-remove", { attachment: e2 });
    }
    compositionDidStartEditingAttachment(t3, e2) {
      return this.attachmentLocationRange = this.composition.document.getLocationRangeOfAttachment(t3), this.compositionController.installAttachmentEditorForAttachment(t3, e2), this.selectionManager.setLocationRange(this.attachmentLocationRange);
    }
    compositionDidStopEditingAttachment(t3) {
      this.compositionController.uninstallAttachmentEditor(), this.attachmentLocationRange = null;
    }
    compositionDidRequestChangingSelectionToLocationRange(t3) {
      if (!this.loadingSnapshot || this.isFocused()) return this.requestedLocationRange = t3, this.compositionRevisionWhenLocationRangeRequested = this.composition.revision, this.handlingInput ? void 0 : this.render();
    }
    compositionWillLoadSnapshot() {
      this.loadingSnapshot = true;
    }
    compositionDidLoadSnapshot() {
      this.compositionController.refreshViewCache(), this.render(), this.loadingSnapshot = false;
    }
    getSelectionManager() {
      return this.selectionManager;
    }
    attachmentManagerDidRequestRemovalOfAttachment(t3) {
      return this.removeAttachment(t3);
    }
    compositionControllerWillSyncDocumentView() {
      return this.inputController.editorWillSyncDocumentView(), this.selectionManager.lock(), this.selectionManager.clearSelection();
    }
    compositionControllerDidSyncDocumentView() {
      return this.inputController.editorDidSyncDocumentView(), this.selectionManager.unlock(), this.updateCurrentActions(), this.notifyEditorElement("sync");
    }
    compositionControllerDidRender() {
      this.requestedLocationRange && (this.compositionRevisionWhenLocationRangeRequested === this.composition.revision && this.selectionManager.setLocationRange(this.requestedLocationRange), this.requestedLocationRange = null, this.compositionRevisionWhenLocationRangeRequested = null), this.renderedCompositionRevision !== this.composition.revision && (this.runEditorFilters(), this.composition.updateCurrentAttributes(), this.notifyEditorElement("render")), this.renderedCompositionRevision = this.composition.revision;
    }
    compositionControllerDidFocus() {
      return this.isFocusedInvisibly() && this.setLocationRange({ index: 0, offset: 0 }), this.toolbarController.hideDialog(), this.notifyEditorElement("focus");
    }
    compositionControllerDidBlur() {
      return this.notifyEditorElement("blur");
    }
    compositionControllerDidSelectAttachment(t3, e2) {
      return this.toolbarController.hideDialog(), this.composition.editAttachment(t3, e2);
    }
    compositionControllerDidRequestDeselectingAttachment(t3) {
      const e2 = this.attachmentLocationRange || this.composition.document.getLocationRangeOfAttachment(t3);
      return this.selectionManager.setLocationRange(e2[1]);
    }
    compositionControllerWillUpdateAttachment(t3) {
      return this.editor.recordUndoEntry("Edit Attachment", { context: t3.id, consolidatable: true });
    }
    compositionControllerDidRequestRemovalOfAttachment(t3) {
      return this.removeAttachment(t3);
    }
    inputControllerWillHandleInput() {
      this.handlingInput = true, this.requestedRender = false;
    }
    inputControllerDidRequestRender() {
      this.requestedRender = true;
    }
    inputControllerDidHandleInput() {
      if (this.handlingInput = false, this.requestedRender) return this.requestedRender = false, this.render();
    }
    inputControllerDidAllowUnhandledInput() {
      return this.notifyEditorElement("change");
    }
    inputControllerDidRequestReparse() {
      return this.reparse();
    }
    inputControllerWillPerformTyping() {
      return this.recordTypingUndoEntry();
    }
    inputControllerWillPerformFormatting(t3) {
      return this.recordFormattingUndoEntry(t3);
    }
    inputControllerWillCutText() {
      return this.editor.recordUndoEntry("Cut");
    }
    inputControllerWillPaste(t3) {
      return this.editor.recordUndoEntry("Paste"), this.pasting = true, this.notifyEditorElement("before-paste", { paste: t3 });
    }
    inputControllerDidPaste(t3) {
      return t3.range = this.pastedRange, this.pastedRange = null, this.pasting = null, this.notifyEditorElement("paste", { paste: t3 });
    }
    inputControllerWillMoveText() {
      return this.editor.recordUndoEntry("Move");
    }
    inputControllerWillAttachFiles() {
      return this.editor.recordUndoEntry("Drop Files");
    }
    inputControllerWillPerformUndo() {
      return this.editor.undo();
    }
    inputControllerWillPerformRedo() {
      return this.editor.redo();
    }
    inputControllerDidReceiveKeyboardCommand(t3) {
      return this.toolbarController.applyKeyboardCommand(t3);
    }
    inputControllerDidStartDrag() {
      this.locationRangeBeforeDrag = this.selectionManager.getLocationRange();
    }
    inputControllerDidReceiveDragOverPoint(t3) {
      return this.selectionManager.setLocationRangeFromPointRange(t3);
    }
    inputControllerDidCancelDrag() {
      this.selectionManager.setLocationRange(this.locationRangeBeforeDrag), this.locationRangeBeforeDrag = null;
    }
    locationRangeDidChange(t3) {
      return this.composition.updateCurrentAttributes(), this.updateCurrentActions(), this.attachmentLocationRange && !Dt(this.attachmentLocationRange, t3) && this.composition.stopEditingAttachment(), this.notifyEditorElement("selection-change");
    }
    toolbarDidClickButton() {
      if (!this.getLocationRange()) return this.setLocationRange({ index: 0, offset: 0 });
    }
    toolbarDidInvokeAction(t3, e2) {
      return this.invokeAction(t3, e2);
    }
    toolbarDidToggleAttribute(t3) {
      if (this.recordFormattingUndoEntry(t3), this.composition.toggleCurrentAttribute(t3), this.render(), !this.selectionFrozen) return this.editorElement.focus();
    }
    toolbarDidUpdateAttribute(t3, e2) {
      if (this.recordFormattingUndoEntry(t3), this.composition.setCurrentAttribute(t3, e2), this.render(), !this.selectionFrozen) return this.editorElement.focus();
    }
    toolbarDidRemoveAttribute(t3) {
      if (this.recordFormattingUndoEntry(t3), this.composition.removeCurrentAttribute(t3), this.render(), !this.selectionFrozen) return this.editorElement.focus();
    }
    toolbarWillShowDialog(t3) {
      return this.composition.expandSelectionForEditing(), this.freezeSelection();
    }
    toolbarDidShowDialog(t3) {
      return this.notifyEditorElement("toolbar-dialog-show", { dialogName: t3 });
    }
    toolbarDidHideDialog(t3) {
      return this.thawSelection(), this.editorElement.focus(), this.notifyEditorElement("toolbar-dialog-hide", { dialogName: t3 });
    }
    freezeSelection() {
      if (!this.selectionFrozen) return this.selectionManager.lock(), this.composition.freezeSelection(), this.selectionFrozen = true, this.render();
    }
    thawSelection() {
      if (this.selectionFrozen) return this.composition.thawSelection(), this.selectionManager.unlock(), this.selectionFrozen = false, this.render();
    }
    canInvokeAction(t3) {
      return !!this.actionIsExternal(t3) || !(null === (e2 = this.actions[t3]) || void 0 === e2 || null === (e2 = e2.test) || void 0 === e2 || !e2.call(this));
      var e2;
    }
    invokeAction(t3, e2) {
      return this.actionIsExternal(t3) ? this.notifyEditorElement("action-invoke", { actionName: t3, invokingElement: e2 }) : null === (i2 = this.actions[t3]) || void 0 === i2 || null === (i2 = i2.perform) || void 0 === i2 ? void 0 : i2.call(this);
      var i2;
    }
    actionIsExternal(t3) {
      return /^x-./.test(t3);
    }
    getCurrentActions() {
      const t3 = {};
      for (const e2 in this.actions) t3[e2] = this.canInvokeAction(e2);
      return t3;
    }
    updateCurrentActions() {
      const t3 = this.getCurrentActions();
      if (!Tt(t3, this.currentActions)) return this.currentActions = t3, this.toolbarController.updateActions(this.currentActions), this.notifyEditorElement("actions-change", { actions: this.currentActions });
    }
    runEditorFilters() {
      let t3 = this.composition.getSnapshot();
      if (Array.from(this.editor.filters).forEach(((e3) => {
        const { document: i3, selectedRange: n2 } = t3;
        t3 = e3.call(this.editor, t3) || {}, t3.document || (t3.document = i3), t3.selectedRange || (t3.selectedRange = n2);
      })), e2 = t3, i2 = this.composition.getSnapshot(), !Dt(e2.selectedRange, i2.selectedRange) || !e2.document.isEqualTo(i2.document)) return this.composition.loadSnapshot(t3);
      var e2, i2;
    }
    updateInputElement() {
      const t3 = (function(t4, e2) {
        const i2 = En[e2];
        if (i2) return i2(t4);
        throw new Error("unknown content type: ".concat(e2));
      })(this.compositionController.getSerializableElement(), "text/html");
      return this.editorElement.setFormValue(t3);
    }
    notifyEditorElement(t3, e2) {
      switch (t3) {
        case "document-change":
          this.documentChangedSinceLastRender = true;
          break;
        case "render":
          this.documentChangedSinceLastRender && (this.documentChangedSinceLastRender = false, this.notifyEditorElement("change"));
          break;
        case "change":
        case "attachment-add":
        case "attachment-edit":
        case "attachment-remove":
          this.updateInputElement();
      }
      return this.editorElement.notify(t3, e2);
    }
    removeAttachment(t3) {
      return this.editor.recordUndoEntry("Delete Attachment"), this.composition.removeAttachment(t3), this.render();
    }
    recordFormattingUndoEntry(t3) {
      const e2 = mt(t3), i2 = this.selectionManager.getLocationRange();
      if (e2 || !Lt(i2)) return this.editor.recordUndoEntry("Formatting", { context: this.getUndoContext(), consolidatable: true });
    }
    recordTypingUndoEntry() {
      return this.editor.recordUndoEntry("Typing", { context: this.getUndoContext(this.currentAttributes), consolidatable: true });
    }
    getUndoContext() {
      for (var t3 = arguments.length, e2 = new Array(t3), i2 = 0; i2 < t3; i2++) e2[i2] = arguments[i2];
      return [this.getLocationContext(), this.getTimeContext(), ...Array.from(e2)];
    }
    getLocationContext() {
      const t3 = this.selectionManager.getLocationRange();
      return Lt(t3) ? t3[0].index : t3;
    }
    getTimeContext() {
      return V.interval > 0 ? Math.floor((/* @__PURE__ */ new Date()).getTime() / V.interval) : 0;
    }
    isFocused() {
      var t3;
      return this.editorElement === (null === (t3 = this.editorElement.ownerDocument) || void 0 === t3 ? void 0 : t3.activeElement);
    }
    isFocusedInvisibly() {
      return this.isFocused() && !this.getLocationRange();
    }
    get actions() {
      return this.constructor.actions;
    }
  };
  Di(_r, "actions", { undo: { test() {
    return this.editor.canUndo();
  }, perform() {
    return this.editor.undo();
  } }, redo: { test() {
    return this.editor.canRedo();
  }, perform() {
    return this.editor.redo();
  } }, link: { test() {
    return this.editor.canActivateAttribute("href");
  } }, increaseNestingLevel: { test() {
    return this.editor.canIncreaseNestingLevel();
  }, perform() {
    return this.editor.increaseNestingLevel() && this.render();
  } }, decreaseNestingLevel: { test() {
    return this.editor.canDecreaseNestingLevel();
  }, perform() {
    return this.editor.decreaseNestingLevel() && this.render();
  } }, attachFiles: { test: () => true, perform() {
    return _.pickFiles(this.editor.insertFiles);
  } } }), _r.proxyMethod("getSelectionManager().setLocationRange"), _r.proxyMethod("getSelectionManager().getLocationRange");
  var jr = Object.freeze({ __proto__: null, AttachmentEditorController: Yn, CompositionController: Xn, Controller: $n, EditorController: _r, InputController: lr, Level0InputController: gr, Level2InputController: Ar, ToolbarController: Br });
  var Wr = Object.freeze({ __proto__: null, MutationObserver: er, SelectionChangeObserver: Ot });
  var Ur = Object.freeze({ __proto__: null, FileVerificationOperation: nr, ImagePreloadOperation: Ui });
  vt("trix-toolbar", "%t {\n  display: block;\n}\n\n%t {\n  white-space: nowrap;\n}\n\n%t [data-trix-dialog] {\n  display: none;\n}\n\n%t [data-trix-dialog][data-trix-active] {\n  display: block;\n}\n\n%t [data-trix-dialog] [data-trix-validate]:invalid {\n  background-color: #ffdddd;\n}");
  var Vr = class extends HTMLElement {
    connectedCallback() {
      "" === this.innerHTML && (this.innerHTML = U.getDefaultHTML());
    }
  };
  var zr = 0;
  var qr = function(t3) {
    if (!t3.hasAttribute("contenteditable")) return t3.setAttribute("contenteditable", ""), (function(t4) {
      let e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      return e2.times = 1, b(t4, e2);
    })("focus", { onElement: t3, withCallback: () => Hr(t3) });
  };
  var Hr = function(t3) {
    return Jr(t3), Kr(t3);
  };
  var Jr = function(t3) {
    var e2, i2;
    if (null !== (e2 = (i2 = document).queryCommandSupported) && void 0 !== e2 && e2.call(i2, "enableObjectResizing")) return document.execCommand("enableObjectResizing", false, false), b("mscontrolselect", { onElement: t3, preventDefault: true });
  };
  var Kr = function(t3) {
    var e2, i2;
    if (null !== (e2 = (i2 = document).queryCommandSupported) && void 0 !== e2 && e2.call(i2, "DefaultParagraphSeparator")) {
      const { tagName: t4 } = n.default;
      if (["div", "p"].includes(t4)) return document.execCommand("DefaultParagraphSeparator", false, t4);
    }
  };
  var Gr = a.forcesObjectResizing ? { display: "inline", width: "auto" } : { display: "inline-block", width: "1px" };
  vt("trix-editor", "%t {\n    display: block;\n}\n\n%t:empty::before {\n    content: attr(placeholder);\n    color: graytext;\n    cursor: text;\n    pointer-events: none;\n    white-space: pre-line;\n}\n\n%t a[contenteditable=false] {\n    cursor: text;\n}\n\n%t img {\n    max-width: 100%;\n    height: auto;\n}\n\n%t ".concat(e, " figcaption textarea {\n    resize: none;\n}\n\n%t ").concat(e, " figcaption textarea.trix-autoresize-clone {\n    position: absolute;\n    left: -9999px;\n    max-height: 0px;\n}\n\n%t ").concat(e, " figcaption[data-trix-placeholder]:empty::before {\n    content: attr(data-trix-placeholder);\n    color: graytext;\n}\n\n%t [data-trix-cursor-target] {\n    display: ").concat(Gr.display, " !important;\n    width: ").concat(Gr.width, " !important;\n    padding: 0 !important;\n    margin: 0 !important;\n    border: none !important;\n}\n\n%t [data-trix-cursor-target=left] {\n    vertical-align: top !important;\n    margin-left: -1px !important;\n}\n\n%t [data-trix-cursor-target=right] {\n    vertical-align: bottom !important;\n    margin-right: -1px !important;\n}"));
  var Yr = /* @__PURE__ */ new WeakMap();
  var Xr = /* @__PURE__ */ new WeakSet();
  var $r = class {
    constructor(t3) {
      var e2, i2;
      _i(e2 = this, i2 = Xr), i2.add(e2), ji(this, Yr, { writable: true, value: void 0 }), this.element = t3, Oi(this, Yr, t3.attachInternals());
    }
    connectedCallback() {
      Bi(this, Xr, Zr).call(this);
    }
    disconnectedCallback() {
    }
    get labels() {
      return Ii(this, Yr).labels;
    }
    get disabled() {
      var t3;
      return null === (t3 = this.element.inputElement) || void 0 === t3 ? void 0 : t3.disabled;
    }
    set disabled(t3) {
      this.element.toggleAttribute("disabled", t3);
    }
    get required() {
      return this.element.hasAttribute("required");
    }
    set required(t3) {
      this.element.toggleAttribute("required", t3), Bi(this, Xr, Zr).call(this);
    }
    get validity() {
      return Ii(this, Yr).validity;
    }
    get validationMessage() {
      return Ii(this, Yr).validationMessage;
    }
    get willValidate() {
      return Ii(this, Yr).willValidate;
    }
    setFormValue(t3) {
      Bi(this, Xr, Zr).call(this);
    }
    checkValidity() {
      return Ii(this, Yr).checkValidity();
    }
    reportValidity() {
      return Ii(this, Yr).reportValidity();
    }
    setCustomValidity(t3) {
      Bi(this, Xr, Zr).call(this, t3);
    }
  };
  function Zr() {
    let t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
    const { required: e2, value: i2 } = this.element, n2 = e2 && !i2, r3 = !!t3, o2 = T("input", { required: e2 }), s2 = t3 || o2.validationMessage;
    Ii(this, Yr).setValidity({ valueMissing: n2, customError: r3 }, s2);
  }
  var Qr = /* @__PURE__ */ new WeakMap();
  var to = /* @__PURE__ */ new WeakMap();
  var eo = /* @__PURE__ */ new WeakMap();
  var io = class {
    constructor(t3) {
      ji(this, Qr, { writable: true, value: void 0 }), ji(this, to, { writable: true, value: (t4) => {
        t4.defaultPrevented || t4.target === this.element.form && this.element.reset();
      } }), ji(this, eo, { writable: true, value: (t4) => {
        if (t4.defaultPrevented) return;
        if (this.element.contains(t4.target)) return;
        const e2 = y(t4.target, { matchingSelector: "label" });
        e2 && Array.from(this.labels).includes(e2) && this.element.focus();
      } }), this.element = t3;
    }
    connectedCallback() {
      Oi(this, Qr, (function(t3) {
        if (t3.hasAttribute("aria-label") || t3.hasAttribute("aria-labelledby")) return;
        const e2 = function() {
          const e3 = Array.from(t3.labels).map(((e4) => {
            if (!e4.contains(t3)) return e4.textContent;
          })).filter(((t4) => t4)), i2 = e3.join(" ");
          return i2 ? t3.setAttribute("aria-label", i2) : t3.removeAttribute("aria-label");
        };
        return e2(), b("focus", { onElement: t3, withCallback: e2 });
      })(this.element)), window.addEventListener("reset", Ii(this, to), false), window.addEventListener("click", Ii(this, eo), false);
    }
    disconnectedCallback() {
      var t3;
      null === (t3 = Ii(this, Qr)) || void 0 === t3 || t3.destroy(), window.removeEventListener("reset", Ii(this, to), false), window.removeEventListener("click", Ii(this, eo), false);
    }
    get labels() {
      const t3 = [];
      this.element.id && this.element.ownerDocument && t3.push(...Array.from(this.element.ownerDocument.querySelectorAll("label[for='".concat(this.element.id, "']")) || []));
      const e2 = y(this.element, { matchingSelector: "label" });
      return e2 && [this.element, null].includes(e2.control) && t3.push(e2), t3;
    }
    get disabled() {
      return console.warn("This browser does not support the [disabled] attribute for trix-editor elements."), false;
    }
    set disabled(t3) {
      console.warn("This browser does not support the [disabled] attribute for trix-editor elements.");
    }
    get required() {
      return console.warn("This browser does not support the [required] attribute for trix-editor elements."), false;
    }
    set required(t3) {
      console.warn("This browser does not support the [required] attribute for trix-editor elements.");
    }
    get validity() {
      return console.warn("This browser does not support the validity property for trix-editor elements."), null;
    }
    get validationMessage() {
      return console.warn("This browser does not support the validationMessage property for trix-editor elements."), "";
    }
    get willValidate() {
      return console.warn("This browser does not support the willValidate property for trix-editor elements."), false;
    }
    setFormValue(t3) {
    }
    checkValidity() {
      return console.warn("This browser does not support checkValidity() for trix-editor elements."), true;
    }
    reportValidity() {
      return console.warn("This browser does not support reportValidity() for trix-editor elements."), true;
    }
    setCustomValidity(t3) {
      console.warn("This browser does not support setCustomValidity(validationMessage) for trix-editor elements.");
    }
  };
  var no = /* @__PURE__ */ new WeakMap();
  var ro = class extends HTMLElement {
    constructor() {
      super(), ji(this, no, { writable: true, value: void 0 }), Oi(this, no, this.constructor.formAssociated ? new $r(this) : new io(this));
    }
    get trixId() {
      return this.hasAttribute("trix-id") ? this.getAttribute("trix-id") : (this.setAttribute("trix-id", ++zr), this.trixId);
    }
    get labels() {
      return Ii(this, no).labels;
    }
    get disabled() {
      return Ii(this, no).disabled;
    }
    set disabled(t3) {
      Ii(this, no).disabled = t3;
    }
    get required() {
      return Ii(this, no).required;
    }
    set required(t3) {
      Ii(this, no).required = t3;
    }
    get validity() {
      return Ii(this, no).validity;
    }
    get validationMessage() {
      return Ii(this, no).validationMessage;
    }
    get willValidate() {
      return Ii(this, no).willValidate;
    }
    get type() {
      return this.localName;
    }
    get toolbarElement() {
      var t3;
      if (this.hasAttribute("toolbar")) return null === (t3 = this.ownerDocument) || void 0 === t3 ? void 0 : t3.getElementById(this.getAttribute("toolbar"));
      if (this.parentNode) {
        const t4 = "trix-toolbar-".concat(this.trixId);
        return this.setAttribute("toolbar", t4), this.internalToolbar = T("trix-toolbar", { id: t4 }), this.parentNode.insertBefore(this.internalToolbar, this), this.internalToolbar;
      }
    }
    get form() {
      var t3;
      return null === (t3 = this.inputElement) || void 0 === t3 ? void 0 : t3.form;
    }
    get inputElement() {
      var t3;
      if (this.hasAttribute("input")) return null === (t3 = this.ownerDocument) || void 0 === t3 ? void 0 : t3.getElementById(this.getAttribute("input"));
      if (this.parentNode) {
        const t4 = "trix-input-".concat(this.trixId);
        this.setAttribute("input", t4);
        const e2 = T("input", { type: "hidden", id: t4 });
        return this.parentNode.insertBefore(e2, this.nextElementSibling), e2;
      }
    }
    get editor() {
      var t3;
      return null === (t3 = this.editorController) || void 0 === t3 ? void 0 : t3.editor;
    }
    get name() {
      var t3;
      return null === (t3 = this.inputElement) || void 0 === t3 ? void 0 : t3.name;
    }
    get value() {
      var t3;
      return null === (t3 = this.inputElement) || void 0 === t3 ? void 0 : t3.value;
    }
    set value(t3) {
      var e2;
      this.defaultValue = t3, null === (e2 = this.editor) || void 0 === e2 || e2.loadHTML(this.defaultValue);
    }
    attributeChangedCallback(t3, e2, i2) {
      "connected" === t3 && this.isConnected && null != e2 && e2 !== i2 && requestAnimationFrame((() => this.reconnect()));
    }
    notify(t3, e2) {
      if (this.editorController) return v("trix-".concat(t3), { onElement: this, attributes: e2 });
    }
    setFormValue(t3) {
      this.inputElement && (this.inputElement.value = t3, Ii(this, no).setFormValue(t3));
    }
    connectedCallback() {
      this.hasAttribute("data-trix-internal") || (qr(this), (function(t3) {
        if (!t3.hasAttribute("role")) t3.setAttribute("role", "textbox");
      })(this), this.editorController || (v("trix-before-initialize", { onElement: this }), this.editorController = new _r({ editorElement: this, html: this.defaultValue = this.value }), requestAnimationFrame((() => v("trix-initialize", { onElement: this })))), this.editorController.registerSelectionManager(), Ii(this, no).connectedCallback(), this.toggleAttribute("connected", true), (function(t3) {
        if (!document.querySelector(":focus") && t3.hasAttribute("autofocus") && document.querySelector("[autofocus]") === t3) t3.focus();
      })(this));
    }
    disconnectedCallback() {
      var t3;
      null === (t3 = this.editorController) || void 0 === t3 || t3.unregisterSelectionManager(), Ii(this, no).disconnectedCallback(), this.toggleAttribute("connected", false);
    }
    reconnect() {
      this.removeInternalToolbar(), this.disconnectedCallback(), this.connectedCallback();
    }
    removeInternalToolbar() {
      var t3;
      null === (t3 = this.internalToolbar) || void 0 === t3 || t3.remove(), this.internalToolbar = null;
    }
    checkValidity() {
      return Ii(this, no).checkValidity();
    }
    reportValidity() {
      return Ii(this, no).reportValidity();
    }
    setCustomValidity(t3) {
      Ii(this, no).setCustomValidity(t3);
    }
    formDisabledCallback(t3) {
      this.inputElement && (this.inputElement.disabled = t3), this.toggleAttribute("contenteditable", !t3);
    }
    formResetCallback() {
      this.reset();
    }
    reset() {
      this.value = this.defaultValue;
    }
  };
  Di(ro, "formAssociated", "ElementInternals" in window), Di(ro, "observedAttributes", ["connected"]);
  var oo = { VERSION: t, config: z, core: Sn, models: zn, views: qn, controllers: jr, observers: Wr, operations: Ur, elements: Object.freeze({ __proto__: null, TrixEditorElement: ro, TrixToolbarElement: Vr }), filters: Object.freeze({ __proto__: null, Filter: In, attachmentGalleryFilter: On }) };
  Object.assign(oo, zn), window.Trix = oo, setTimeout((function() {
    customElements.get("trix-toolbar") || customElements.define("trix-toolbar", Vr), customElements.get("trix-editor") || customElements.define("trix-editor", ro);
  }), 0);

  // ../../node_modules/@rails/actiontext/app/assets/javascripts/actiontext.esm.js
  var sparkMd52 = {
    exports: {}
  };
  (function(module, exports) {
    (function(factory) {
      {
        module.exports = factory();
      }
    })((function(undefined$1) {
      var hex_chr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      function md5cycle(x2, k2) {
        var a2 = x2[0], b2 = x2[1], c2 = x2[2], d2 = x2[3];
        a2 += (b2 & c2 | ~b2 & d2) + k2[0] - 680876936 | 0;
        a2 = (a2 << 7 | a2 >>> 25) + b2 | 0;
        d2 += (a2 & b2 | ~a2 & c2) + k2[1] - 389564586 | 0;
        d2 = (d2 << 12 | d2 >>> 20) + a2 | 0;
        c2 += (d2 & a2 | ~d2 & b2) + k2[2] + 606105819 | 0;
        c2 = (c2 << 17 | c2 >>> 15) + d2 | 0;
        b2 += (c2 & d2 | ~c2 & a2) + k2[3] - 1044525330 | 0;
        b2 = (b2 << 22 | b2 >>> 10) + c2 | 0;
        a2 += (b2 & c2 | ~b2 & d2) + k2[4] - 176418897 | 0;
        a2 = (a2 << 7 | a2 >>> 25) + b2 | 0;
        d2 += (a2 & b2 | ~a2 & c2) + k2[5] + 1200080426 | 0;
        d2 = (d2 << 12 | d2 >>> 20) + a2 | 0;
        c2 += (d2 & a2 | ~d2 & b2) + k2[6] - 1473231341 | 0;
        c2 = (c2 << 17 | c2 >>> 15) + d2 | 0;
        b2 += (c2 & d2 | ~c2 & a2) + k2[7] - 45705983 | 0;
        b2 = (b2 << 22 | b2 >>> 10) + c2 | 0;
        a2 += (b2 & c2 | ~b2 & d2) + k2[8] + 1770035416 | 0;
        a2 = (a2 << 7 | a2 >>> 25) + b2 | 0;
        d2 += (a2 & b2 | ~a2 & c2) + k2[9] - 1958414417 | 0;
        d2 = (d2 << 12 | d2 >>> 20) + a2 | 0;
        c2 += (d2 & a2 | ~d2 & b2) + k2[10] - 42063 | 0;
        c2 = (c2 << 17 | c2 >>> 15) + d2 | 0;
        b2 += (c2 & d2 | ~c2 & a2) + k2[11] - 1990404162 | 0;
        b2 = (b2 << 22 | b2 >>> 10) + c2 | 0;
        a2 += (b2 & c2 | ~b2 & d2) + k2[12] + 1804603682 | 0;
        a2 = (a2 << 7 | a2 >>> 25) + b2 | 0;
        d2 += (a2 & b2 | ~a2 & c2) + k2[13] - 40341101 | 0;
        d2 = (d2 << 12 | d2 >>> 20) + a2 | 0;
        c2 += (d2 & a2 | ~d2 & b2) + k2[14] - 1502002290 | 0;
        c2 = (c2 << 17 | c2 >>> 15) + d2 | 0;
        b2 += (c2 & d2 | ~c2 & a2) + k2[15] + 1236535329 | 0;
        b2 = (b2 << 22 | b2 >>> 10) + c2 | 0;
        a2 += (b2 & d2 | c2 & ~d2) + k2[1] - 165796510 | 0;
        a2 = (a2 << 5 | a2 >>> 27) + b2 | 0;
        d2 += (a2 & c2 | b2 & ~c2) + k2[6] - 1069501632 | 0;
        d2 = (d2 << 9 | d2 >>> 23) + a2 | 0;
        c2 += (d2 & b2 | a2 & ~b2) + k2[11] + 643717713 | 0;
        c2 = (c2 << 14 | c2 >>> 18) + d2 | 0;
        b2 += (c2 & a2 | d2 & ~a2) + k2[0] - 373897302 | 0;
        b2 = (b2 << 20 | b2 >>> 12) + c2 | 0;
        a2 += (b2 & d2 | c2 & ~d2) + k2[5] - 701558691 | 0;
        a2 = (a2 << 5 | a2 >>> 27) + b2 | 0;
        d2 += (a2 & c2 | b2 & ~c2) + k2[10] + 38016083 | 0;
        d2 = (d2 << 9 | d2 >>> 23) + a2 | 0;
        c2 += (d2 & b2 | a2 & ~b2) + k2[15] - 660478335 | 0;
        c2 = (c2 << 14 | c2 >>> 18) + d2 | 0;
        b2 += (c2 & a2 | d2 & ~a2) + k2[4] - 405537848 | 0;
        b2 = (b2 << 20 | b2 >>> 12) + c2 | 0;
        a2 += (b2 & d2 | c2 & ~d2) + k2[9] + 568446438 | 0;
        a2 = (a2 << 5 | a2 >>> 27) + b2 | 0;
        d2 += (a2 & c2 | b2 & ~c2) + k2[14] - 1019803690 | 0;
        d2 = (d2 << 9 | d2 >>> 23) + a2 | 0;
        c2 += (d2 & b2 | a2 & ~b2) + k2[3] - 187363961 | 0;
        c2 = (c2 << 14 | c2 >>> 18) + d2 | 0;
        b2 += (c2 & a2 | d2 & ~a2) + k2[8] + 1163531501 | 0;
        b2 = (b2 << 20 | b2 >>> 12) + c2 | 0;
        a2 += (b2 & d2 | c2 & ~d2) + k2[13] - 1444681467 | 0;
        a2 = (a2 << 5 | a2 >>> 27) + b2 | 0;
        d2 += (a2 & c2 | b2 & ~c2) + k2[2] - 51403784 | 0;
        d2 = (d2 << 9 | d2 >>> 23) + a2 | 0;
        c2 += (d2 & b2 | a2 & ~b2) + k2[7] + 1735328473 | 0;
        c2 = (c2 << 14 | c2 >>> 18) + d2 | 0;
        b2 += (c2 & a2 | d2 & ~a2) + k2[12] - 1926607734 | 0;
        b2 = (b2 << 20 | b2 >>> 12) + c2 | 0;
        a2 += (b2 ^ c2 ^ d2) + k2[5] - 378558 | 0;
        a2 = (a2 << 4 | a2 >>> 28) + b2 | 0;
        d2 += (a2 ^ b2 ^ c2) + k2[8] - 2022574463 | 0;
        d2 = (d2 << 11 | d2 >>> 21) + a2 | 0;
        c2 += (d2 ^ a2 ^ b2) + k2[11] + 1839030562 | 0;
        c2 = (c2 << 16 | c2 >>> 16) + d2 | 0;
        b2 += (c2 ^ d2 ^ a2) + k2[14] - 35309556 | 0;
        b2 = (b2 << 23 | b2 >>> 9) + c2 | 0;
        a2 += (b2 ^ c2 ^ d2) + k2[1] - 1530992060 | 0;
        a2 = (a2 << 4 | a2 >>> 28) + b2 | 0;
        d2 += (a2 ^ b2 ^ c2) + k2[4] + 1272893353 | 0;
        d2 = (d2 << 11 | d2 >>> 21) + a2 | 0;
        c2 += (d2 ^ a2 ^ b2) + k2[7] - 155497632 | 0;
        c2 = (c2 << 16 | c2 >>> 16) + d2 | 0;
        b2 += (c2 ^ d2 ^ a2) + k2[10] - 1094730640 | 0;
        b2 = (b2 << 23 | b2 >>> 9) + c2 | 0;
        a2 += (b2 ^ c2 ^ d2) + k2[13] + 681279174 | 0;
        a2 = (a2 << 4 | a2 >>> 28) + b2 | 0;
        d2 += (a2 ^ b2 ^ c2) + k2[0] - 358537222 | 0;
        d2 = (d2 << 11 | d2 >>> 21) + a2 | 0;
        c2 += (d2 ^ a2 ^ b2) + k2[3] - 722521979 | 0;
        c2 = (c2 << 16 | c2 >>> 16) + d2 | 0;
        b2 += (c2 ^ d2 ^ a2) + k2[6] + 76029189 | 0;
        b2 = (b2 << 23 | b2 >>> 9) + c2 | 0;
        a2 += (b2 ^ c2 ^ d2) + k2[9] - 640364487 | 0;
        a2 = (a2 << 4 | a2 >>> 28) + b2 | 0;
        d2 += (a2 ^ b2 ^ c2) + k2[12] - 421815835 | 0;
        d2 = (d2 << 11 | d2 >>> 21) + a2 | 0;
        c2 += (d2 ^ a2 ^ b2) + k2[15] + 530742520 | 0;
        c2 = (c2 << 16 | c2 >>> 16) + d2 | 0;
        b2 += (c2 ^ d2 ^ a2) + k2[2] - 995338651 | 0;
        b2 = (b2 << 23 | b2 >>> 9) + c2 | 0;
        a2 += (c2 ^ (b2 | ~d2)) + k2[0] - 198630844 | 0;
        a2 = (a2 << 6 | a2 >>> 26) + b2 | 0;
        d2 += (b2 ^ (a2 | ~c2)) + k2[7] + 1126891415 | 0;
        d2 = (d2 << 10 | d2 >>> 22) + a2 | 0;
        c2 += (a2 ^ (d2 | ~b2)) + k2[14] - 1416354905 | 0;
        c2 = (c2 << 15 | c2 >>> 17) + d2 | 0;
        b2 += (d2 ^ (c2 | ~a2)) + k2[5] - 57434055 | 0;
        b2 = (b2 << 21 | b2 >>> 11) + c2 | 0;
        a2 += (c2 ^ (b2 | ~d2)) + k2[12] + 1700485571 | 0;
        a2 = (a2 << 6 | a2 >>> 26) + b2 | 0;
        d2 += (b2 ^ (a2 | ~c2)) + k2[3] - 1894986606 | 0;
        d2 = (d2 << 10 | d2 >>> 22) + a2 | 0;
        c2 += (a2 ^ (d2 | ~b2)) + k2[10] - 1051523 | 0;
        c2 = (c2 << 15 | c2 >>> 17) + d2 | 0;
        b2 += (d2 ^ (c2 | ~a2)) + k2[1] - 2054922799 | 0;
        b2 = (b2 << 21 | b2 >>> 11) + c2 | 0;
        a2 += (c2 ^ (b2 | ~d2)) + k2[8] + 1873313359 | 0;
        a2 = (a2 << 6 | a2 >>> 26) + b2 | 0;
        d2 += (b2 ^ (a2 | ~c2)) + k2[15] - 30611744 | 0;
        d2 = (d2 << 10 | d2 >>> 22) + a2 | 0;
        c2 += (a2 ^ (d2 | ~b2)) + k2[6] - 1560198380 | 0;
        c2 = (c2 << 15 | c2 >>> 17) + d2 | 0;
        b2 += (d2 ^ (c2 | ~a2)) + k2[13] + 1309151649 | 0;
        b2 = (b2 << 21 | b2 >>> 11) + c2 | 0;
        a2 += (c2 ^ (b2 | ~d2)) + k2[4] - 145523070 | 0;
        a2 = (a2 << 6 | a2 >>> 26) + b2 | 0;
        d2 += (b2 ^ (a2 | ~c2)) + k2[11] - 1120210379 | 0;
        d2 = (d2 << 10 | d2 >>> 22) + a2 | 0;
        c2 += (a2 ^ (d2 | ~b2)) + k2[2] + 718787259 | 0;
        c2 = (c2 << 15 | c2 >>> 17) + d2 | 0;
        b2 += (d2 ^ (c2 | ~a2)) + k2[9] - 343485551 | 0;
        b2 = (b2 << 21 | b2 >>> 11) + c2 | 0;
        x2[0] = a2 + x2[0] | 0;
        x2[1] = b2 + x2[1] | 0;
        x2[2] = c2 + x2[2] | 0;
        x2[3] = d2 + x2[3] | 0;
      }
      function md5blk(s2) {
        var md5blks = [], i2;
        for (i2 = 0; i2 < 64; i2 += 4) {
          md5blks[i2 >> 2] = s2.charCodeAt(i2) + (s2.charCodeAt(i2 + 1) << 8) + (s2.charCodeAt(i2 + 2) << 16) + (s2.charCodeAt(i2 + 3) << 24);
        }
        return md5blks;
      }
      function md5blk_array(a2) {
        var md5blks = [], i2;
        for (i2 = 0; i2 < 64; i2 += 4) {
          md5blks[i2 >> 2] = a2[i2] + (a2[i2 + 1] << 8) + (a2[i2 + 2] << 16) + (a2[i2 + 3] << 24);
        }
        return md5blks;
      }
      function md51(s2) {
        var n2 = s2.length, state = [1732584193, -271733879, -1732584194, 271733878], i2, length, tail, tmp, lo, hi2;
        for (i2 = 64; i2 <= n2; i2 += 64) {
          md5cycle(state, md5blk(s2.substring(i2 - 64, i2)));
        }
        s2 = s2.substring(i2 - 64);
        length = s2.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i2 = 0; i2 < length; i2 += 1) {
          tail[i2 >> 2] |= s2.charCodeAt(i2) << (i2 % 4 << 3);
        }
        tail[i2 >> 2] |= 128 << (i2 % 4 << 3);
        if (i2 > 55) {
          md5cycle(state, tail);
          for (i2 = 0; i2 < 16; i2 += 1) {
            tail[i2] = 0;
          }
        }
        tmp = n2 * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi2 = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi2;
        md5cycle(state, tail);
        return state;
      }
      function md51_array(a2) {
        var n2 = a2.length, state = [1732584193, -271733879, -1732584194, 271733878], i2, length, tail, tmp, lo, hi2;
        for (i2 = 64; i2 <= n2; i2 += 64) {
          md5cycle(state, md5blk_array(a2.subarray(i2 - 64, i2)));
        }
        a2 = i2 - 64 < n2 ? a2.subarray(i2 - 64) : new Uint8Array(0);
        length = a2.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i2 = 0; i2 < length; i2 += 1) {
          tail[i2 >> 2] |= a2[i2] << (i2 % 4 << 3);
        }
        tail[i2 >> 2] |= 128 << (i2 % 4 << 3);
        if (i2 > 55) {
          md5cycle(state, tail);
          for (i2 = 0; i2 < 16; i2 += 1) {
            tail[i2] = 0;
          }
        }
        tmp = n2 * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi2 = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi2;
        md5cycle(state, tail);
        return state;
      }
      function rhex(n2) {
        var s2 = "", j2;
        for (j2 = 0; j2 < 4; j2 += 1) {
          s2 += hex_chr[n2 >> j2 * 8 + 4 & 15] + hex_chr[n2 >> j2 * 8 & 15];
        }
        return s2;
      }
      function hex(x2) {
        var i2;
        for (i2 = 0; i2 < x2.length; i2 += 1) {
          x2[i2] = rhex(x2[i2]);
        }
        return x2.join("");
      }
      if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") ;
      if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
        (function() {
          function clamp(val, length) {
            val = val | 0 || 0;
            if (val < 0) {
              return Math.max(val + length, 0);
            }
            return Math.min(val, length);
          }
          ArrayBuffer.prototype.slice = function(from, to2) {
            var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
            if (to2 !== undefined$1) {
              end = clamp(to2, length);
            }
            if (begin > end) {
              return new ArrayBuffer(0);
            }
            num = end - begin;
            target = new ArrayBuffer(num);
            targetArray = new Uint8Array(target);
            sourceArray = new Uint8Array(this, begin, num);
            targetArray.set(sourceArray);
            return target;
          };
        })();
      }
      function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
          str = unescape(encodeURIComponent(str));
        }
        return str;
      }
      function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i2;
        for (i2 = 0; i2 < length; i2 += 1) {
          arr[i2] = str.charCodeAt(i2);
        }
        return returnUInt8Array ? arr : buff;
      }
      function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
      }
      function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);
        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);
        return returnUInt8Array ? result : result.buffer;
      }
      function hexToBinaryString(hex2) {
        var bytes = [], length = hex2.length, x2;
        for (x2 = 0; x2 < length - 1; x2 += 2) {
          bytes.push(parseInt(hex2.substr(x2, 2), 16));
        }
        return String.fromCharCode.apply(String, bytes);
      }
      function SparkMD53() {
        this.reset();
      }
      SparkMD53.prototype.append = function(str) {
        this.appendBinary(toUtf8(str));
        return this;
      };
      SparkMD53.prototype.appendBinary = function(contents) {
        this._buff += contents;
        this._length += contents.length;
        var length = this._buff.length, i2;
        for (i2 = 64; i2 <= length; i2 += 64) {
          md5cycle(this._hash, md5blk(this._buff.substring(i2 - 64, i2)));
        }
        this._buff = this._buff.substring(i2 - 64);
        return this;
      };
      SparkMD53.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, i2, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ret;
        for (i2 = 0; i2 < length; i2 += 1) {
          tail[i2 >> 2] |= buff.charCodeAt(i2) << (i2 % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD53.prototype.reset = function() {
        this._buff = "";
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
        return this;
      };
      SparkMD53.prototype.getState = function() {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash.slice()
        };
      };
      SparkMD53.prototype.setState = function(state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;
        return this;
      };
      SparkMD53.prototype.destroy = function() {
        delete this._hash;
        delete this._buff;
        delete this._length;
      };
      SparkMD53.prototype._finish = function(tail, length) {
        var i2 = length, tmp, lo, hi2;
        tail[i2 >> 2] |= 128 << (i2 % 4 << 3);
        if (i2 > 55) {
          md5cycle(this._hash, tail);
          for (i2 = 0; i2 < 16; i2 += 1) {
            tail[i2] = 0;
          }
        }
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi2 = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi2;
        md5cycle(this._hash, tail);
      };
      SparkMD53.hash = function(str, raw) {
        return SparkMD53.hashBinary(toUtf8(str), raw);
      };
      SparkMD53.hashBinary = function(content, raw) {
        var hash = md51(content), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      SparkMD53.ArrayBuffer = function() {
        this.reset();
      };
      SparkMD53.ArrayBuffer.prototype.append = function(arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i2;
        this._length += arr.byteLength;
        for (i2 = 64; i2 <= length; i2 += 64) {
          md5cycle(this._hash, md5blk_array(buff.subarray(i2 - 64, i2)));
        }
        this._buff = i2 - 64 < length ? new Uint8Array(buff.buffer.slice(i2 - 64)) : new Uint8Array(0);
        return this;
      };
      SparkMD53.ArrayBuffer.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i2, ret;
        for (i2 = 0; i2 < length; i2 += 1) {
          tail[i2 >> 2] |= buff[i2] << (i2 % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD53.ArrayBuffer.prototype.reset = function() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
        return this;
      };
      SparkMD53.ArrayBuffer.prototype.getState = function() {
        var state = SparkMD53.prototype.getState.call(this);
        state.buff = arrayBuffer2Utf8Str(state.buff);
        return state;
      };
      SparkMD53.ArrayBuffer.prototype.setState = function(state) {
        state.buff = utf8Str2ArrayBuffer(state.buff, true);
        return SparkMD53.prototype.setState.call(this, state);
      };
      SparkMD53.ArrayBuffer.prototype.destroy = SparkMD53.prototype.destroy;
      SparkMD53.ArrayBuffer.prototype._finish = SparkMD53.prototype._finish;
      SparkMD53.ArrayBuffer.hash = function(arr, raw) {
        var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      return SparkMD53;
    }));
  })(sparkMd52);
  var SparkMD52 = sparkMd52.exports;
  var fileSlice2 = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  var FileChecksum2 = class _FileChecksum {
    static create(file, callback) {
      const instance = new _FileChecksum(file);
      instance.create(callback);
    }
    constructor(file) {
      this.file = file;
      this.chunkSize = 2097152;
      this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
      this.chunkIndex = 0;
    }
    create(callback) {
      this.callback = callback;
      this.md5Buffer = new SparkMD52.ArrayBuffer();
      this.fileReader = new FileReader();
      this.fileReader.addEventListener("load", ((event) => this.fileReaderDidLoad(event)));
      this.fileReader.addEventListener("error", ((event) => this.fileReaderDidError(event)));
      this.readNextChunk();
    }
    fileReaderDidLoad(event) {
      this.md5Buffer.append(event.target.result);
      if (!this.readNextChunk()) {
        const binaryDigest = this.md5Buffer.end(true);
        const base64digest = btoa(binaryDigest);
        this.callback(null, base64digest);
      }
    }
    fileReaderDidError(event) {
      this.callback(`Error reading ${this.file.name}`);
    }
    readNextChunk() {
      if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
        const start4 = this.chunkIndex * this.chunkSize;
        const end = Math.min(start4 + this.chunkSize, this.file.size);
        const bytes = fileSlice2.call(this.file, start4, end);
        this.fileReader.readAsArrayBuffer(bytes);
        this.chunkIndex++;
        return true;
      } else {
        return false;
      }
    }
  };
  function getMetaValue2(name) {
    const element = findElement2(document.head, `meta[name="${name}"]`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  function findElements2(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    const elements = root.querySelectorAll(selector);
    return toArray2(elements);
  }
  function findElement2(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    return root.querySelector(selector);
  }
  function dispatchEvent3(element, type, eventInit = {}) {
    const { disabled } = element;
    const { bubbles, cancelable, detail } = eventInit;
    const event = document.createEvent("Event");
    event.initEvent(type, bubbles || true, cancelable || true);
    event.detail = detail || {};
    try {
      element.disabled = false;
      element.dispatchEvent(event);
    } finally {
      element.disabled = disabled;
    }
    return event;
  }
  function toArray2(value) {
    if (Array.isArray(value)) {
      return value;
    } else if (Array.from) {
      return Array.from(value);
    } else {
      return [].slice.call(value);
    }
  }
  var BlobRecord2 = class {
    constructor(file, checksum, url, customHeaders = {}) {
      this.file = file;
      this.attributes = {
        filename: file.name,
        content_type: file.type || "application/octet-stream",
        byte_size: file.size,
        checksum
      };
      this.xhr = new XMLHttpRequest();
      this.xhr.open("POST", url, true);
      this.xhr.responseType = "json";
      this.xhr.setRequestHeader("Content-Type", "application/json");
      this.xhr.setRequestHeader("Accept", "application/json");
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      Object.keys(customHeaders).forEach(((headerKey) => {
        this.xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
      }));
      const csrfToken = getMetaValue2("csrf-token");
      if (csrfToken != void 0) {
        this.xhr.setRequestHeader("X-CSRF-Token", csrfToken);
      }
      this.xhr.addEventListener("load", ((event) => this.requestDidLoad(event)));
      this.xhr.addEventListener("error", ((event) => this.requestDidError(event)));
    }
    get status() {
      return this.xhr.status;
    }
    get response() {
      const { responseType, response } = this.xhr;
      if (responseType == "json") {
        return response;
      } else {
        return JSON.parse(response);
      }
    }
    create(callback) {
      this.callback = callback;
      this.xhr.send(JSON.stringify({
        blob: this.attributes
      }));
    }
    requestDidLoad(event) {
      if (this.status >= 200 && this.status < 300) {
        const { response } = this;
        const { direct_upload } = response;
        delete response.direct_upload;
        this.attributes = response;
        this.directUploadData = direct_upload;
        this.callback(null, this.toJSON());
      } else {
        this.requestDidError(event);
      }
    }
    requestDidError(event) {
      this.callback(`Error creating Blob for "${this.file.name}". Status: ${this.status}`);
    }
    toJSON() {
      const result = {};
      for (const key in this.attributes) {
        result[key] = this.attributes[key];
      }
      return result;
    }
  };
  var BlobUpload2 = class {
    constructor(blob) {
      this.blob = blob;
      this.file = blob.file;
      const { url, headers } = blob.directUploadData;
      this.xhr = new XMLHttpRequest();
      this.xhr.open("PUT", url, true);
      this.xhr.responseType = "text";
      for (const key in headers) {
        this.xhr.setRequestHeader(key, headers[key]);
      }
      this.xhr.addEventListener("load", ((event) => this.requestDidLoad(event)));
      this.xhr.addEventListener("error", ((event) => this.requestDidError(event)));
    }
    create(callback) {
      this.callback = callback;
      this.xhr.send(this.file.slice());
    }
    requestDidLoad(event) {
      const { status, response } = this.xhr;
      if (status >= 200 && status < 300) {
        this.callback(null, response);
      } else {
        this.requestDidError(event);
      }
    }
    requestDidError(event) {
      this.callback(`Error storing "${this.file.name}". Status: ${this.xhr.status}`);
    }
  };
  var id2 = 0;
  var DirectUpload2 = class {
    constructor(file, url, delegate, customHeaders = {}) {
      this.id = ++id2;
      this.file = file;
      this.url = url;
      this.delegate = delegate;
      this.customHeaders = customHeaders;
    }
    create(callback) {
      FileChecksum2.create(this.file, ((error2, checksum) => {
        if (error2) {
          callback(error2);
          return;
        }
        const blob = new BlobRecord2(this.file, checksum, this.url, this.customHeaders);
        notify2(this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
        blob.create(((error3) => {
          if (error3) {
            callback(error3);
          } else {
            const upload = new BlobUpload2(blob);
            notify2(this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
            upload.create(((error4) => {
              if (error4) {
                callback(error4);
              } else {
                callback(null, blob.toJSON());
              }
            }));
          }
        }));
      }));
    }
  };
  function notify2(object, methodName, ...messages) {
    if (object && typeof object[methodName] == "function") {
      return object[methodName](...messages);
    }
  }
  var DirectUploadController2 = class {
    constructor(input, file) {
      this.input = input;
      this.file = file;
      this.directUpload = new DirectUpload2(this.file, this.url, this);
      this.dispatch("initialize");
    }
    start(callback) {
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = this.input.name;
      this.input.insertAdjacentElement("beforebegin", hiddenInput);
      this.dispatch("start");
      this.directUpload.create(((error2, attributes) => {
        if (error2) {
          hiddenInput.parentNode.removeChild(hiddenInput);
          this.dispatchError(error2);
        } else {
          hiddenInput.value = attributes.signed_id;
        }
        this.dispatch("end");
        callback(error2);
      }));
    }
    uploadRequestDidProgress(event) {
      const progress = event.loaded / event.total * 90;
      if (progress) {
        this.dispatch("progress", {
          progress
        });
      }
    }
    get url() {
      return this.input.getAttribute("data-direct-upload-url");
    }
    dispatch(name, detail = {}) {
      detail.file = this.file;
      detail.id = this.directUpload.id;
      return dispatchEvent3(this.input, `direct-upload:${name}`, {
        detail
      });
    }
    dispatchError(error2) {
      const event = this.dispatch("error", {
        error: error2
      });
      if (!event.defaultPrevented) {
        alert(error2);
      }
    }
    directUploadWillCreateBlobWithXHR(xhr) {
      this.dispatch("before-blob-request", {
        xhr
      });
    }
    directUploadWillStoreFileWithXHR(xhr) {
      this.dispatch("before-storage-request", {
        xhr
      });
      xhr.upload.addEventListener("progress", ((event) => this.uploadRequestDidProgress(event)));
      xhr.upload.addEventListener("loadend", (() => {
        this.simulateResponseProgress(xhr);
      }));
    }
    simulateResponseProgress(xhr) {
      let progress = 90;
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const estimatedResponseTime = this.estimateResponseTime();
        const responseProgress = Math.min(elapsed / estimatedResponseTime, 1);
        progress = 90 + responseProgress * 9;
        this.dispatch("progress", {
          progress
        });
        if (xhr.readyState !== XMLHttpRequest.DONE && progress < 99) {
          requestAnimationFrame(updateProgress);
        }
      };
      xhr.addEventListener("loadend", (() => {
        this.dispatch("progress", {
          progress: 100
        });
      }));
      requestAnimationFrame(updateProgress);
    }
    estimateResponseTime() {
      const fileSize = this.file.size;
      const MB = 1024 * 1024;
      if (fileSize < MB) {
        return 1e3;
      } else if (fileSize < 10 * MB) {
        return 2e3;
      } else {
        return 3e3 + fileSize / MB * 50;
      }
    }
  };
  var inputSelector2 = "input[type=file][data-direct-upload-url]:not([disabled])";
  var DirectUploadsController2 = class {
    constructor(form) {
      this.form = form;
      this.inputs = findElements2(form, inputSelector2).filter(((input) => input.files.length));
    }
    start(callback) {
      const controllers = this.createDirectUploadControllers();
      const startNextController = () => {
        const controller = controllers.shift();
        if (controller) {
          controller.start(((error2) => {
            if (error2) {
              callback(error2);
              this.dispatch("end");
            } else {
              startNextController();
            }
          }));
        } else {
          callback();
          this.dispatch("end");
        }
      };
      this.dispatch("start");
      startNextController();
    }
    createDirectUploadControllers() {
      const controllers = [];
      this.inputs.forEach(((input) => {
        toArray2(input.files).forEach(((file) => {
          const controller = new DirectUploadController2(input, file);
          controllers.push(controller);
        }));
      }));
      return controllers;
    }
    dispatch(name, detail = {}) {
      return dispatchEvent3(this.form, `direct-uploads:${name}`, {
        detail
      });
    }
  };
  var processingAttribute2 = "data-direct-uploads-processing";
  var submitButtonsByForm2 = /* @__PURE__ */ new WeakMap();
  var started2 = false;
  function start3() {
    if (!started2) {
      started2 = true;
      document.addEventListener("click", didClick2, true);
      document.addEventListener("submit", didSubmitForm2, true);
      document.addEventListener("ajax:before", didSubmitRemoteElement2);
    }
  }
  function didClick2(event) {
    const button = event.target.closest("button, input");
    if (button && button.type === "submit" && button.form) {
      submitButtonsByForm2.set(button.form, button);
    }
  }
  function didSubmitForm2(event) {
    handleFormSubmissionEvent2(event);
  }
  function didSubmitRemoteElement2(event) {
    if (event.target.tagName == "FORM") {
      handleFormSubmissionEvent2(event);
    }
  }
  function handleFormSubmissionEvent2(event) {
    const form = event.target;
    if (form.hasAttribute(processingAttribute2)) {
      event.preventDefault();
      return;
    }
    const controller = new DirectUploadsController2(form);
    const { inputs } = controller;
    if (inputs.length) {
      event.preventDefault();
      form.setAttribute(processingAttribute2, "");
      inputs.forEach(disable2);
      controller.start(((error2) => {
        form.removeAttribute(processingAttribute2);
        if (error2) {
          inputs.forEach(enable2);
        } else {
          submitForm2(form);
        }
      }));
    }
  }
  function submitForm2(form) {
    let button = submitButtonsByForm2.get(form) || findElement2(form, "input[type=submit], button[type=submit]");
    if (button) {
      const { disabled } = button;
      button.disabled = false;
      button.focus();
      button.click();
      button.disabled = disabled;
    } else {
      button = document.createElement("input");
      button.type = "submit";
      button.style.display = "none";
      form.appendChild(button);
      button.click();
      form.removeChild(button);
    }
    submitButtonsByForm2.delete(form);
  }
  function disable2(input) {
    input.disabled = true;
  }
  function enable2(input) {
    input.disabled = false;
  }
  function autostart2() {
    if (window.ActiveStorage) {
      start3();
    }
  }
  setTimeout(autostart2, 1);
  var AttachmentUpload = class {
    constructor(attachment, element, file = attachment.file) {
      this.attachment = attachment;
      this.element = element;
      this.directUpload = new DirectUpload2(file, this.directUploadUrl, this);
      this.file = file;
    }
    start() {
      return new Promise(((resolve, reject) => {
        this.directUpload.create(((error2, attributes) => this.directUploadDidComplete(error2, attributes, resolve, reject)));
        this.dispatch("start");
      }));
    }
    directUploadWillStoreFileWithXHR(xhr) {
      xhr.upload.addEventListener("progress", ((event) => {
        const progress = event.loaded / event.total * 90;
        if (progress) {
          this.dispatch("progress", {
            progress
          });
        }
      }));
      xhr.upload.addEventListener("loadend", (() => {
        this.simulateResponseProgress(xhr);
      }));
    }
    simulateResponseProgress(xhr) {
      let progress = 90;
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const estimatedResponseTime = this.estimateResponseTime();
        const responseProgress = Math.min(elapsed / estimatedResponseTime, 1);
        progress = 90 + responseProgress * 9;
        this.dispatch("progress", {
          progress
        });
        if (xhr.readyState !== XMLHttpRequest.DONE && progress < 99) {
          requestAnimationFrame(updateProgress);
        }
      };
      xhr.addEventListener("loadend", (() => {
        this.dispatch("progress", {
          progress: 100
        });
      }));
      requestAnimationFrame(updateProgress);
    }
    estimateResponseTime() {
      const fileSize = this.file.size;
      const MB = 1024 * 1024;
      if (fileSize < MB) {
        return 1e3;
      } else if (fileSize < 10 * MB) {
        return 2e3;
      } else {
        return 3e3 + fileSize / MB * 50;
      }
    }
    directUploadDidComplete(error2, attributes, resolve, reject) {
      if (error2) {
        this.dispatchError(error2, reject);
      } else {
        resolve({
          sgid: attributes.attachable_sgid,
          url: this.createBlobUrl(attributes.signed_id, attributes.filename)
        });
        this.dispatch("end");
      }
    }
    createBlobUrl(signedId, filename) {
      return this.blobUrlTemplate.replace(":signed_id", signedId).replace(":filename", encodeURIComponent(filename));
    }
    dispatch(name, detail = {}) {
      detail.attachment = this.attachment;
      return dispatchEvent3(this.element, `direct-upload:${name}`, {
        detail
      });
    }
    dispatchError(error2, reject) {
      const event = this.dispatch("error", {
        error: error2
      });
      if (!event.defaultPrevented) {
        reject(error2);
      }
    }
    get directUploadUrl() {
      return this.element.dataset.directUploadUrl;
    }
    get blobUrlTemplate() {
      return this.element.dataset.blobUrlTemplate;
    }
  };
  addEventListener("trix-attachment-add", ((event) => {
    const { attachment, target } = event;
    if (attachment.file) {
      const upload = new AttachmentUpload(attachment, target, attachment.file);
      const onProgress = (event2) => attachment.setUploadProgress(event2.detail.progress);
      target.addEventListener("direct-upload:progress", onProgress);
      upload.start().then(((attributes) => attachment.setAttributes(attributes))).catch(((error2) => alert(error2))).finally((() => target.removeEventListener("direct-upload:progress", onProgress)));
    }
  }));

  // ../../node_modules/@hotwired/stimulus/dist/stimulus.js
  var EventListener = class {
    constructor(eventTarget, eventName, eventOptions) {
      this.eventTarget = eventTarget;
      this.eventName = eventName;
      this.eventOptions = eventOptions;
      this.unorderedBindings = /* @__PURE__ */ new Set();
    }
    connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
      this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
      const extendedEvent = extendEvent(event);
      for (const binding of this.bindings) {
        if (extendedEvent.immediatePropagationStopped) {
          break;
        } else {
          binding.handleEvent(extendedEvent);
        }
      }
    }
    hasBindings() {
      return this.unorderedBindings.size > 0;
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((left, right) => {
        const leftIndex = left.index, rightIndex = right.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  };
  function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
      return event;
    } else {
      const { stopImmediatePropagation } = event;
      return Object.assign(event, {
        immediatePropagationStopped: false,
        stopImmediatePropagation() {
          this.immediatePropagationStopped = true;
          stopImmediatePropagation.call(this);
        }
      });
    }
  }
  var Dispatcher = class {
    constructor(application2) {
      this.application = application2;
      this.eventListenerMaps = /* @__PURE__ */ new Map();
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach((eventListener) => eventListener.connect());
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach((eventListener) => eventListener.disconnect());
      }
    }
    get eventListeners() {
      return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding, clearEventListeners = false) {
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
      if (clearEventListeners)
        this.clearEventListenersForBinding(binding);
    }
    handleError(error2, message, detail = {}) {
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    clearEventListenersForBinding(binding) {
      const eventListener = this.fetchEventListenerForBinding(binding);
      if (!eventListener.hasBindings()) {
        eventListener.disconnect();
        this.removeMappedEventListenerFor(binding);
      }
    }
    removeMappedEventListenerFor(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      eventListenerMap.delete(cacheKey);
      if (eventListenerMap.size == 0)
        this.eventListenerMaps.delete(eventTarget);
    }
    fetchEventListenerForBinding(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      let eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
      const eventListener = new EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
      let eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = /* @__PURE__ */ new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
      const parts = [eventName];
      Object.keys(eventOptions).sort().forEach((key) => {
        parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
      });
      return parts.join(":");
    }
  };
  var defaultActionDescriptorFilters = {
    stop({ event, value }) {
      if (value)
        event.stopPropagation();
      return true;
    },
    prevent({ event, value }) {
      if (value)
        event.preventDefault();
      return true;
    },
    self({ event, value, element }) {
      if (value) {
        return element === event.target;
      } else {
        return true;
      }
    }
  };
  var descriptorPattern = /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
  function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    let eventName = matches[2];
    let keyFilter = matches[3];
    if (keyFilter && !["keydown", "keyup", "keypress"].includes(eventName)) {
      eventName += `.${keyFilter}`;
      keyFilter = "";
    }
    return {
      eventTarget: parseEventTarget(matches[4]),
      eventName,
      eventOptions: matches[7] ? parseEventOptions(matches[7]) : {},
      identifier: matches[5],
      methodName: matches[6],
      keyFilter: matches[1] || keyFilter
    };
  }
  function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
      return window;
    } else if (eventTargetName == "document") {
      return document;
    }
  }
  function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
  }
  function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
      return "window";
    } else if (eventTarget == document) {
      return "document";
    }
  }
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_2, char) => char.toUpperCase());
  }
  function namespaceCamelize(value) {
    return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_2, char) => `-${char.toLowerCase()}`);
  }
  function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
  }
  function isSomething(object) {
    return object !== null && object !== void 0;
  }
  function hasProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  var allModifiers = ["meta", "ctrl", "alt", "shift"];
  var Action = class {
    constructor(element, index, descriptor, schema) {
      this.element = element;
      this.index = index;
      this.eventTarget = descriptor.eventTarget || element;
      this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
      this.eventOptions = descriptor.eventOptions || {};
      this.identifier = descriptor.identifier || error("missing identifier");
      this.methodName = descriptor.methodName || error("missing method name");
      this.keyFilter = descriptor.keyFilter || "";
      this.schema = schema;
    }
    static forToken(token, schema) {
      return new this(token.element, token.index, parseActionDescriptorString(token.content), schema);
    }
    toString() {
      const eventFilter = this.keyFilter ? `.${this.keyFilter}` : "";
      const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : "";
      return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`;
    }
    shouldIgnoreKeyboardEvent(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filters = this.keyFilter.split("+");
      if (this.keyFilterDissatisfied(event, filters)) {
        return true;
      }
      const standardFilter = filters.filter((key) => !allModifiers.includes(key))[0];
      if (!standardFilter) {
        return false;
      }
      if (!hasProperty(this.keyMappings, standardFilter)) {
        error(`contains unknown key filter: ${this.keyFilter}`);
      }
      return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase();
    }
    shouldIgnoreMouseEvent(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filters = [this.keyFilter];
      if (this.keyFilterDissatisfied(event, filters)) {
        return true;
      }
      return false;
    }
    get params() {
      const params = {};
      const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
      for (const { name, value } of Array.from(this.element.attributes)) {
        const match = name.match(pattern);
        const key = match && match[1];
        if (key) {
          params[camelize(key)] = typecast(value);
        }
      }
      return params;
    }
    get eventTargetName() {
      return stringifyEventTarget(this.eventTarget);
    }
    get keyMappings() {
      return this.schema.keyMappings;
    }
    keyFilterDissatisfied(event, filters) {
      const [meta, ctrl, alt, shift] = allModifiers.map((modifier) => filters.includes(modifier));
      return event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift;
    }
  };
  var defaultEventNames = {
    a: () => "click",
    button: () => "click",
    form: () => "submit",
    details: () => "toggle",
    input: (e2) => e2.getAttribute("type") == "submit" ? "click" : "input",
    select: () => "change",
    textarea: () => "input"
  };
  function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
      return defaultEventNames[tagName](element);
    }
  }
  function error(message) {
    throw new Error(message);
  }
  function typecast(value) {
    try {
      return JSON.parse(value);
    } catch (o_O) {
      return value;
    }
  }
  var Binding = class {
    constructor(context, action) {
      this.context = context;
      this.action = action;
    }
    get index() {
      return this.action.index;
    }
    get eventTarget() {
      return this.action.eventTarget;
    }
    get eventOptions() {
      return this.action.eventOptions;
    }
    get identifier() {
      return this.context.identifier;
    }
    handleEvent(event) {
      const actionEvent = this.prepareActionEvent(event);
      if (this.willBeInvokedByEvent(event) && this.applyEventModifiers(actionEvent)) {
        this.invokeWithEvent(actionEvent);
      }
    }
    get eventName() {
      return this.action.eventName;
    }
    get method() {
      const method = this.controller[this.methodName];
      if (typeof method == "function") {
        return method;
      }
      throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    applyEventModifiers(event) {
      const { element } = this.action;
      const { actionDescriptorFilters } = this.context.application;
      const { controller } = this.context;
      let passes = true;
      for (const [name, value] of Object.entries(this.eventOptions)) {
        if (name in actionDescriptorFilters) {
          const filter = actionDescriptorFilters[name];
          passes = passes && filter({ name, value, event, element, controller });
        } else {
          continue;
        }
      }
      return passes;
    }
    prepareActionEvent(event) {
      return Object.assign(event, { params: this.action.params });
    }
    invokeWithEvent(event) {
      const { target, currentTarget } = event;
      try {
        this.method.call(this.controller, event);
        this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
      } catch (error2) {
        const { identifier, controller, element, index } = this;
        const detail = { identifier, controller, element, index, event };
        this.context.handleError(error2, `invoking action "${this.action}"`, detail);
      }
    }
    willBeInvokedByEvent(event) {
      const eventTarget = event.target;
      if (event instanceof KeyboardEvent && this.action.shouldIgnoreKeyboardEvent(event)) {
        return false;
      }
      if (event instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(event)) {
        return false;
      }
      if (this.element === eventTarget) {
        return true;
      } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
        return this.scope.containsElement(eventTarget);
      } else {
        return this.scope.containsElement(this.action.element);
      }
    }
    get controller() {
      return this.context.controller;
    }
    get methodName() {
      return this.action.methodName;
    }
    get element() {
      return this.scope.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var ElementObserver = class {
    constructor(element, delegate) {
      this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
      this.element = element;
      this.started = false;
      this.delegate = delegate;
      this.elements = /* @__PURE__ */ new Set();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
    pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        const matches = new Set(this.matchElementsInTree());
        for (const element of Array.from(this.elements)) {
          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }
        for (const element of Array.from(matches)) {
          this.addElement(element);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
    processAttributeChange(element, attributeName) {
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
    processRemovedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
    processAddedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }
    matchElement(element) {
      return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
      return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
    elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
    elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }
    addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
    removeElement(element) {
      if (this.elements.has(element)) {
        this.elements.delete(element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  };
  var AttributeObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeName = attributeName;
      this.delegate = delegate;
      this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
      return this.elementObserver.element;
    }
    get selector() {
      return `[${this.attributeName}]`;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get started() {
      return this.elementObserver.started;
    }
    matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
      const match = this.matchElement(tree) ? [tree] : [];
      const matches = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches);
    }
    elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
    elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
    elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  };
  function add(map, key, value) {
    fetch2(map, key).add(value);
  }
  function del(map, key, value) {
    fetch2(map, key).delete(value);
    prune(map, key);
  }
  function fetch2(map, key) {
    let values = map.get(key);
    if (!values) {
      values = /* @__PURE__ */ new Set();
      map.set(key, values);
    }
    return values;
  }
  function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
      map.delete(key);
    }
  }
  var Multimap = class {
    constructor() {
      this.valuesByKey = /* @__PURE__ */ new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
      add(this.valuesByKey, key, value);
    }
    delete(key, value) {
      del(this.valuesByKey, key, value);
    }
    has(key, value) {
      const values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
    hasKey(key) {
      return this.valuesByKey.has(key);
    }
    hasValue(value) {
      const sets = Array.from(this.valuesByKey.values());
      return sets.some((set) => set.has(value));
    }
    getValuesForKey(key) {
      const values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(([_key, values]) => values.has(value)).map(([key, _values]) => key);
    }
  };
  var SelectorObserver = class {
    constructor(element, selector, delegate, details) {
      this._selector = selector;
      this.details = details;
      this.elementObserver = new ElementObserver(element, this);
      this.delegate = delegate;
      this.matchesByElement = new Multimap();
    }
    get started() {
      return this.elementObserver.started;
    }
    get selector() {
      return this._selector;
    }
    set selector(selector) {
      this._selector = selector;
      this.refresh();
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get element() {
      return this.elementObserver.element;
    }
    matchElement(element) {
      const { selector } = this;
      if (selector) {
        const matches = element.matches(selector);
        if (this.delegate.selectorMatchElement) {
          return matches && this.delegate.selectorMatchElement(element, this.details);
        }
        return matches;
      } else {
        return false;
      }
    }
    matchElementsInTree(tree) {
      const { selector } = this;
      if (selector) {
        const match = this.matchElement(tree) ? [tree] : [];
        const matches = Array.from(tree.querySelectorAll(selector)).filter((match2) => this.matchElement(match2));
        return match.concat(matches);
      } else {
        return [];
      }
    }
    elementMatched(element) {
      const { selector } = this;
      if (selector) {
        this.selectorMatched(element, selector);
      }
    }
    elementUnmatched(element) {
      const selectors = this.matchesByElement.getKeysForValue(element);
      for (const selector of selectors) {
        this.selectorUnmatched(element, selector);
      }
    }
    elementAttributeChanged(element, _attributeName) {
      const { selector } = this;
      if (selector) {
        const matches = this.matchElement(element);
        const matchedBefore = this.matchesByElement.has(selector, element);
        if (matches && !matchedBefore) {
          this.selectorMatched(element, selector);
        } else if (!matches && matchedBefore) {
          this.selectorUnmatched(element, selector);
        }
      }
    }
    selectorMatched(element, selector) {
      this.delegate.selectorMatched(element, selector, this.details);
      this.matchesByElement.add(selector, element);
    }
    selectorUnmatched(element, selector) {
      this.delegate.selectorUnmatched(element, selector, this.details);
      this.matchesByElement.delete(selector, element);
    }
  };
  var StringMapObserver = class {
    constructor(element, delegate) {
      this.element = element;
      this.delegate = delegate;
      this.started = false;
      this.stringMap = /* @__PURE__ */ new Map();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
        this.refresh();
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        for (const attributeName of this.knownAttributeNames) {
          this.refreshAttribute(attributeName, null);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      const attributeName = mutation.attributeName;
      if (attributeName) {
        this.refreshAttribute(attributeName, mutation.oldValue);
      }
    }
    refreshAttribute(attributeName, oldValue) {
      const key = this.delegate.getStringMapKeyForAttribute(attributeName);
      if (key != null) {
        if (!this.stringMap.has(attributeName)) {
          this.stringMapKeyAdded(key, attributeName);
        }
        const value = this.element.getAttribute(attributeName);
        if (this.stringMap.get(attributeName) != value) {
          this.stringMapValueChanged(value, key, oldValue);
        }
        if (value == null) {
          const oldValue2 = this.stringMap.get(attributeName);
          this.stringMap.delete(attributeName);
          if (oldValue2)
            this.stringMapKeyRemoved(key, attributeName, oldValue2);
        } else {
          this.stringMap.set(attributeName, value);
        }
      }
    }
    stringMapKeyAdded(key, attributeName) {
      if (this.delegate.stringMapKeyAdded) {
        this.delegate.stringMapKeyAdded(key, attributeName);
      }
    }
    stringMapValueChanged(value, key, oldValue) {
      if (this.delegate.stringMapValueChanged) {
        this.delegate.stringMapValueChanged(value, key, oldValue);
      }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      if (this.delegate.stringMapKeyRemoved) {
        this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
      }
    }
    get knownAttributeNames() {
      return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
      return Array.from(this.element.attributes).map((attribute) => attribute.name);
    }
    get recordedAttributeNames() {
      return Array.from(this.stringMap.keys());
    }
  };
  var TokenListObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeObserver = new AttributeObserver(element, attributeName, this);
      this.delegate = delegate;
      this.tokensByElement = new Multimap();
    }
    get started() {
      return this.attributeObserver.started;
    }
    start() {
      this.attributeObserver.start();
    }
    pause(callback) {
      this.attributeObserver.pause(callback);
    }
    stop() {
      this.attributeObserver.stop();
    }
    refresh() {
      this.attributeObserver.refresh();
    }
    get element() {
      return this.attributeObserver.element;
    }
    get attributeName() {
      return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
      const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
      tokens.forEach((token) => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
      tokens.forEach((token) => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
      const previousTokens = this.tokensByElement.getValuesForKey(element);
      const currentTokens = this.readTokensForElement(element);
      const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
    readTokensForElement(element) {
      const attributeName = this.attributeName;
      const tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  };
  function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content) => content.length).map((content, index) => ({ element, attributeName, content, index }));
  }
  function zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_2, index) => [left[index], right[index]]);
  }
  function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
  }
  var ValueListObserver = class {
    constructor(element, attributeName, delegate) {
      this.tokenListObserver = new TokenListObserver(element, attributeName, this);
      this.delegate = delegate;
      this.parseResultsByToken = /* @__PURE__ */ new WeakMap();
      this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
    }
    get started() {
      return this.tokenListObserver.started;
    }
    start() {
      this.tokenListObserver.start();
    }
    stop() {
      this.tokenListObserver.stop();
    }
    refresh() {
      this.tokenListObserver.refresh();
    }
    get element() {
      return this.tokenListObserver.element;
    }
    get attributeName() {
      return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
    tokenUnmatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).delete(token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
    fetchParseResultForToken(token) {
      let parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
    fetchValuesByTokenForElement(element) {
      let valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = /* @__PURE__ */ new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
    parseToken(token) {
      try {
        const value = this.delegate.parseValueForToken(token);
        return { value };
      } catch (error2) {
        return { error: error2 };
      }
    }
  };
  var BindingObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.bindingsByAction = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.valueListObserver) {
        this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
        this.valueListObserver.start();
      }
    }
    stop() {
      if (this.valueListObserver) {
        this.valueListObserver.stop();
        delete this.valueListObserver;
        this.disconnectAllActions();
      }
    }
    get element() {
      return this.context.element;
    }
    get identifier() {
      return this.context.identifier;
    }
    get actionAttribute() {
      return this.schema.actionAttribute;
    }
    get schema() {
      return this.context.schema;
    }
    get bindings() {
      return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
      const binding = new Binding(this.context, action);
      this.bindingsByAction.set(action, binding);
      this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
      const binding = this.bindingsByAction.get(action);
      if (binding) {
        this.bindingsByAction.delete(action);
        this.delegate.bindingDisconnected(binding);
      }
    }
    disconnectAllActions() {
      this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding, true));
      this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
      const action = Action.forToken(token, this.schema);
      if (action.identifier == this.identifier) {
        return action;
      }
    }
    elementMatchedValue(element, action) {
      this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
      this.disconnectAction(action);
    }
  };
  var ValueObserver = class {
    constructor(context, receiver) {
      this.context = context;
      this.receiver = receiver;
      this.stringMapObserver = new StringMapObserver(this.element, this);
      this.valueDescriptorMap = this.controller.valueDescriptorMap;
    }
    start() {
      this.stringMapObserver.start();
      this.invokeChangedCallbacksForDefaultValues();
    }
    stop() {
      this.stringMapObserver.stop();
    }
    get element() {
      return this.context.element;
    }
    get controller() {
      return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
      if (attributeName in this.valueDescriptorMap) {
        return this.valueDescriptorMap[attributeName].name;
      }
    }
    stringMapKeyAdded(key, attributeName) {
      const descriptor = this.valueDescriptorMap[attributeName];
      if (!this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
      }
    }
    stringMapValueChanged(value, name, oldValue) {
      const descriptor = this.valueDescriptorNameMap[name];
      if (value === null)
        return;
      if (oldValue === null) {
        oldValue = descriptor.writer(descriptor.defaultValue);
      }
      this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      const descriptor = this.valueDescriptorNameMap[key];
      if (this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
      } else {
        this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
      }
    }
    invokeChangedCallbacksForDefaultValues() {
      for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
        if (defaultValue != void 0 && !this.controller.data.has(key)) {
          this.invokeChangedCallback(name, writer(defaultValue), void 0);
        }
      }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
      const changedMethodName = `${name}Changed`;
      const changedMethod = this.receiver[changedMethodName];
      if (typeof changedMethod == "function") {
        const descriptor = this.valueDescriptorNameMap[name];
        try {
          const value = descriptor.reader(rawValue);
          let oldValue = rawOldValue;
          if (rawOldValue) {
            oldValue = descriptor.reader(rawOldValue);
          }
          changedMethod.call(this.receiver, value, oldValue);
        } catch (error2) {
          if (error2 instanceof TypeError) {
            error2.message = `Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error2.message}`;
          }
          throw error2;
        }
      }
    }
    get valueDescriptors() {
      const { valueDescriptorMap } = this;
      return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
      const descriptors = {};
      Object.keys(this.valueDescriptorMap).forEach((key) => {
        const descriptor = this.valueDescriptorMap[key];
        descriptors[descriptor.name] = descriptor;
      });
      return descriptors;
    }
    hasValue(attributeName) {
      const descriptor = this.valueDescriptorNameMap[attributeName];
      const hasMethodName = `has${capitalize(descriptor.name)}`;
      return this.receiver[hasMethodName];
    }
  };
  var TargetObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.targetsByName = new Multimap();
    }
    start() {
      if (!this.tokenListObserver) {
        this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
        this.tokenListObserver.start();
      }
    }
    stop() {
      if (this.tokenListObserver) {
        this.disconnectAllTargets();
        this.tokenListObserver.stop();
        delete this.tokenListObserver;
      }
    }
    tokenMatched({ element, content: name }) {
      if (this.scope.containsElement(element)) {
        this.connectTarget(element, name);
      }
    }
    tokenUnmatched({ element, content: name }) {
      this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
      var _a;
      if (!this.targetsByName.has(name, element)) {
        this.targetsByName.add(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
      }
    }
    disconnectTarget(element, name) {
      var _a;
      if (this.targetsByName.has(name, element)) {
        this.targetsByName.delete(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
      }
    }
    disconnectAllTargets() {
      for (const name of this.targetsByName.keys) {
        for (const element of this.targetsByName.getValuesForKey(name)) {
          this.disconnectTarget(element, name);
        }
      }
    }
    get attributeName() {
      return `data-${this.context.identifier}-target`;
    }
    get element() {
      return this.context.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, /* @__PURE__ */ new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  var OutletObserver = class {
    constructor(context, delegate) {
      this.started = false;
      this.context = context;
      this.delegate = delegate;
      this.outletsByName = new Multimap();
      this.outletElementsByName = new Multimap();
      this.selectorObserverMap = /* @__PURE__ */ new Map();
      this.attributeObserverMap = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.started) {
        this.outletDefinitions.forEach((outletName) => {
          this.setupSelectorObserverForOutlet(outletName);
          this.setupAttributeObserverForOutlet(outletName);
        });
        this.started = true;
        this.dependentContexts.forEach((context) => context.refresh());
      }
    }
    refresh() {
      this.selectorObserverMap.forEach((observer) => observer.refresh());
      this.attributeObserverMap.forEach((observer) => observer.refresh());
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.disconnectAllOutlets();
        this.stopSelectorObservers();
        this.stopAttributeObservers();
      }
    }
    stopSelectorObservers() {
      if (this.selectorObserverMap.size > 0) {
        this.selectorObserverMap.forEach((observer) => observer.stop());
        this.selectorObserverMap.clear();
      }
    }
    stopAttributeObservers() {
      if (this.attributeObserverMap.size > 0) {
        this.attributeObserverMap.forEach((observer) => observer.stop());
        this.attributeObserverMap.clear();
      }
    }
    selectorMatched(element, _selector, { outletName }) {
      const outlet = this.getOutlet(element, outletName);
      if (outlet) {
        this.connectOutlet(outlet, element, outletName);
      }
    }
    selectorUnmatched(element, _selector, { outletName }) {
      const outlet = this.getOutletFromMap(element, outletName);
      if (outlet) {
        this.disconnectOutlet(outlet, element, outletName);
      }
    }
    selectorMatchElement(element, { outletName }) {
      const selector = this.selector(outletName);
      const hasOutlet = this.hasOutlet(element, outletName);
      const hasOutletController = element.matches(`[${this.schema.controllerAttribute}~=${outletName}]`);
      if (selector) {
        return hasOutlet && hasOutletController && element.matches(selector);
      } else {
        return false;
      }
    }
    elementMatchedAttribute(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    elementAttributeValueChanged(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    elementUnmatchedAttribute(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    connectOutlet(outlet, element, outletName) {
      var _a;
      if (!this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.add(outletName, outlet);
        this.outletElementsByName.add(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletConnected(outlet, element, outletName));
      }
    }
    disconnectOutlet(outlet, element, outletName) {
      var _a;
      if (this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.delete(outletName, outlet);
        this.outletElementsByName.delete(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletDisconnected(outlet, element, outletName));
      }
    }
    disconnectAllOutlets() {
      for (const outletName of this.outletElementsByName.keys) {
        for (const element of this.outletElementsByName.getValuesForKey(outletName)) {
          for (const outlet of this.outletsByName.getValuesForKey(outletName)) {
            this.disconnectOutlet(outlet, element, outletName);
          }
        }
      }
    }
    updateSelectorObserverForOutlet(outletName) {
      const observer = this.selectorObserverMap.get(outletName);
      if (observer) {
        observer.selector = this.selector(outletName);
      }
    }
    setupSelectorObserverForOutlet(outletName) {
      const selector = this.selector(outletName);
      const selectorObserver = new SelectorObserver(document.body, selector, this, { outletName });
      this.selectorObserverMap.set(outletName, selectorObserver);
      selectorObserver.start();
    }
    setupAttributeObserverForOutlet(outletName) {
      const attributeName = this.attributeNameForOutletName(outletName);
      const attributeObserver = new AttributeObserver(this.scope.element, attributeName, this);
      this.attributeObserverMap.set(outletName, attributeObserver);
      attributeObserver.start();
    }
    selector(outletName) {
      return this.scope.outlets.getSelectorForOutletName(outletName);
    }
    attributeNameForOutletName(outletName) {
      return this.scope.schema.outletAttributeForScope(this.identifier, outletName);
    }
    getOutletNameFromOutletAttributeName(attributeName) {
      return this.outletDefinitions.find((outletName) => this.attributeNameForOutletName(outletName) === attributeName);
    }
    get outletDependencies() {
      const dependencies = new Multimap();
      this.router.modules.forEach((module) => {
        const constructor = module.definition.controllerConstructor;
        const outlets = readInheritableStaticArrayValues(constructor, "outlets");
        outlets.forEach((outlet) => dependencies.add(outlet, module.identifier));
      });
      return dependencies;
    }
    get outletDefinitions() {
      return this.outletDependencies.getKeysForValue(this.identifier);
    }
    get dependentControllerIdentifiers() {
      return this.outletDependencies.getValuesForKey(this.identifier);
    }
    get dependentContexts() {
      const identifiers = this.dependentControllerIdentifiers;
      return this.router.contexts.filter((context) => identifiers.includes(context.identifier));
    }
    hasOutlet(element, outletName) {
      return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName);
    }
    getOutlet(element, outletName) {
      return this.application.getControllerForElementAndIdentifier(element, outletName);
    }
    getOutletFromMap(element, outletName) {
      return this.outletsByName.getValuesForKey(outletName).find((outlet) => outlet.element === element);
    }
    get scope() {
      return this.context.scope;
    }
    get schema() {
      return this.context.schema;
    }
    get identifier() {
      return this.context.identifier;
    }
    get application() {
      return this.context.application;
    }
    get router() {
      return this.application.router;
    }
  };
  var Context = class {
    constructor(module, scope) {
      this.logDebugActivity = (functionName, detail = {}) => {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.logDebugActivity(this.identifier, functionName, detail);
      };
      this.module = module;
      this.scope = scope;
      this.controller = new module.controllerConstructor(this);
      this.bindingObserver = new BindingObserver(this, this.dispatcher);
      this.valueObserver = new ValueObserver(this, this.controller);
      this.targetObserver = new TargetObserver(this, this);
      this.outletObserver = new OutletObserver(this, this);
      try {
        this.controller.initialize();
        this.logDebugActivity("initialize");
      } catch (error2) {
        this.handleError(error2, "initializing controller");
      }
    }
    connect() {
      this.bindingObserver.start();
      this.valueObserver.start();
      this.targetObserver.start();
      this.outletObserver.start();
      try {
        this.controller.connect();
        this.logDebugActivity("connect");
      } catch (error2) {
        this.handleError(error2, "connecting controller");
      }
    }
    refresh() {
      this.outletObserver.refresh();
    }
    disconnect() {
      try {
        this.controller.disconnect();
        this.logDebugActivity("disconnect");
      } catch (error2) {
        this.handleError(error2, "disconnecting controller");
      }
      this.outletObserver.stop();
      this.targetObserver.stop();
      this.valueObserver.stop();
      this.bindingObserver.stop();
    }
    get application() {
      return this.module.application;
    }
    get identifier() {
      return this.module.identifier;
    }
    get schema() {
      return this.application.schema;
    }
    get dispatcher() {
      return this.application.dispatcher;
    }
    get element() {
      return this.scope.element;
    }
    get parentElement() {
      return this.element.parentElement;
    }
    handleError(error2, message, detail = {}) {
      const { identifier, controller, element } = this;
      detail = Object.assign({ identifier, controller, element }, detail);
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
      this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
      this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    outletConnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletConnected`, outlet, element);
    }
    outletDisconnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletDisconnected`, outlet, element);
    }
    invokeControllerMethod(methodName, ...args) {
      const controller = this.controller;
      if (typeof controller[methodName] == "function") {
        controller[methodName](...args);
      }
    }
  };
  function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
  }
  function shadow(constructor, properties) {
    const shadowConstructor = extend2(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
  }
  function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
      const properties = blessing(constructor);
      for (const key in properties) {
        const descriptor = blessedProperties[key] || {};
        blessedProperties[key] = Object.assign(descriptor, properties[key]);
      }
      return blessedProperties;
    }, {});
  }
  function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
      const descriptor = getShadowedDescriptor(prototype, properties, key);
      if (descriptor) {
        Object.assign(shadowProperties, { [key]: descriptor });
      }
      return shadowProperties;
    }, {});
  }
  function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
      const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
      if (shadowingDescriptor) {
        descriptor.get = shadowingDescriptor.get || descriptor.get;
        descriptor.set = shadowingDescriptor.set || descriptor.set;
      }
      return descriptor;
    }
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend2 = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a2 = function() {
        this.a.call(this);
      };
      const b2 = extendWithReflect(a2);
      b2.prototype.a = function() {
      };
      return new b2();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error2) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function blessDefinition(definition) {
    return {
      identifier: definition.identifier,
      controllerConstructor: bless(definition.controllerConstructor)
    };
  }
  var Module = class {
    constructor(application2, definition) {
      this.application = application2;
      this.definition = blessDefinition(definition);
      this.contextsByScope = /* @__PURE__ */ new WeakMap();
      this.connectedContexts = /* @__PURE__ */ new Set();
    }
    get identifier() {
      return this.definition.identifier;
    }
    get controllerConstructor() {
      return this.definition.controllerConstructor;
    }
    get contexts() {
      return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
      const context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
    disconnectContextForScope(scope) {
      const context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts.delete(context);
        context.disconnect();
      }
    }
    fetchContextForScope(scope) {
      let context = this.contextsByScope.get(scope);
      if (!context) {
        context = new Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  };
  var ClassMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    has(name) {
      return this.data.has(this.getDataKey(name));
    }
    get(name) {
      return this.getAll(name)[0];
    }
    getAll(name) {
      const tokenString = this.data.get(this.getDataKey(name)) || "";
      return tokenize(tokenString);
    }
    getAttributeName(name) {
      return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
      return `${name}-class`;
    }
    get data() {
      return this.scope.data;
    }
  };
  var DataMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.getAttribute(name);
    }
    set(key, value) {
      const name = this.getAttributeNameForKey(key);
      this.element.setAttribute(name, value);
      return this.get(key);
    }
    has(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.hasAttribute(name);
    }
    delete(key) {
      if (this.has(key)) {
        const name = this.getAttributeNameForKey(key);
        this.element.removeAttribute(name);
        return true;
      } else {
        return false;
      }
    }
    getAttributeNameForKey(key) {
      return `data-${this.identifier}-${dasherize(key)}`;
    }
  };
  var Guide = class {
    constructor(logger2) {
      this.warnedKeysByObject = /* @__PURE__ */ new WeakMap();
      this.logger = logger2;
    }
    warn(object, key, message) {
      let warnedKeys = this.warnedKeysByObject.get(object);
      if (!warnedKeys) {
        warnedKeys = /* @__PURE__ */ new Set();
        this.warnedKeysByObject.set(object, warnedKeys);
      }
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        this.logger.warn(message, object);
      }
    }
  };
  function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
  }
  var TargetSet = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(targetName) {
      return this.find(targetName) != null;
    }
    find(...targetNames) {
      return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
    }
    findAll(...targetNames) {
      return targetNames.reduce((targets, targetName) => [
        ...targets,
        ...this.findAllTargets(targetName),
        ...this.findAllLegacyTargets(targetName)
      ], []);
    }
    findTarget(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
      const attributeName = this.schema.targetAttributeForScope(this.identifier);
      return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
      const targetDescriptor = `${this.identifier}.${targetName}`;
      return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
      if (element) {
        const { identifier } = this;
        const attributeName = this.schema.targetAttribute;
        const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
        this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
      }
      return element;
    }
    get guide() {
      return this.scope.guide;
    }
  };
  var OutletSet = class {
    constructor(scope, controllerElement) {
      this.scope = scope;
      this.controllerElement = controllerElement;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(outletName) {
      return this.find(outletName) != null;
    }
    find(...outletNames) {
      return outletNames.reduce((outlet, outletName) => outlet || this.findOutlet(outletName), void 0);
    }
    findAll(...outletNames) {
      return outletNames.reduce((outlets, outletName) => [...outlets, ...this.findAllOutlets(outletName)], []);
    }
    getSelectorForOutletName(outletName) {
      const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName);
      return this.controllerElement.getAttribute(attributeName);
    }
    findOutlet(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      if (selector)
        return this.findElement(selector, outletName);
    }
    findAllOutlets(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      return selector ? this.findAllElements(selector, outletName) : [];
    }
    findElement(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName))[0];
    }
    findAllElements(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName));
    }
    matchesElement(element, selector, outletName) {
      const controllerAttribute = element.getAttribute(this.scope.schema.controllerAttribute) || "";
      return element.matches(selector) && controllerAttribute.split(" ").includes(outletName);
    }
  };
  var Scope = class _Scope {
    constructor(schema, element, identifier, logger2) {
      this.targets = new TargetSet(this);
      this.classes = new ClassMap(this);
      this.data = new DataMap(this);
      this.containsElement = (element2) => {
        return element2.closest(this.controllerSelector) === this.element;
      };
      this.schema = schema;
      this.element = element;
      this.identifier = identifier;
      this.guide = new Guide(logger2);
      this.outlets = new OutletSet(this.documentScope, element);
    }
    findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
      return [
        ...this.element.matches(selector) ? [this.element] : [],
        ...this.queryElements(selector).filter(this.containsElement)
      ];
    }
    queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
      return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
    get isDocumentScope() {
      return this.element === document.documentElement;
    }
    get documentScope() {
      return this.isDocumentScope ? this : new _Scope(this.schema, document.documentElement, this.identifier, this.guide.logger);
    }
  };
  var ScopeObserver = class {
    constructor(element, schema, delegate) {
      this.element = element;
      this.schema = schema;
      this.delegate = delegate;
      this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
      this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap();
      this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
    }
    start() {
      this.valueListObserver.start();
    }
    stop() {
      this.valueListObserver.stop();
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
      const { element, content: identifier } = token;
      return this.parseValueForElementAndIdentifier(element, identifier);
    }
    parseValueForElementAndIdentifier(element, identifier) {
      const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      let scope = scopesByIdentifier.get(identifier);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }
      return scope;
    }
    elementMatchedValue(element, value) {
      const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
    elementUnmatchedValue(element, value) {
      const referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
    fetchScopesByIdentifierForElement(element) {
      let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = /* @__PURE__ */ new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  };
  var Router = class {
    constructor(application2) {
      this.application = application2;
      this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
      this.scopesByIdentifier = new Multimap();
      this.modulesByIdentifier = /* @__PURE__ */ new Map();
    }
    get element() {
      return this.application.element;
    }
    get schema() {
      return this.application.schema;
    }
    get logger() {
      return this.application.logger;
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    get modules() {
      return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
      return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
    }
    start() {
      this.scopeObserver.start();
    }
    stop() {
      this.scopeObserver.stop();
    }
    loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      const module = new Module(this.application, definition);
      this.connectModule(module);
      const afterLoad = definition.controllerConstructor.afterLoad;
      if (afterLoad) {
        afterLoad.call(definition.controllerConstructor, definition.identifier, this.application);
      }
    }
    unloadIdentifier(identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        this.disconnectModule(module);
      }
    }
    getContextForElementAndIdentifier(element, identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        return module.contexts.find((context) => context.element == element);
      }
    }
    proposeToConnectScopeForElementAndIdentifier(element, identifier) {
      const scope = this.scopeObserver.parseValueForElementAndIdentifier(element, identifier);
      if (scope) {
        this.scopeObserver.elementMatchedValue(scope.element, scope);
      } else {
        console.error(`Couldn't find or create scope for identifier: "${identifier}" and element:`, element);
      }
    }
    handleError(error2, message, detail) {
      this.application.handleError(error2, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
      return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.connectContextForScope(scope);
      }
    }
    scopeDisconnected(scope) {
      this.scopesByIdentifier.delete(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.disconnectContextForScope(scope);
      }
    }
    connectModule(module) {
      this.modulesByIdentifier.set(module.identifier, module);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.connectContextForScope(scope));
    }
    disconnectModule(module) {
      this.modulesByIdentifier.delete(module.identifier);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.disconnectContextForScope(scope));
    }
  };
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`,
    outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
    keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End", page_up: "PageUp", page_down: "PageDown" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c2) => [c2, c2]))), objectFromEntries("0123456789".split("").map((n2) => [n2, n2])))
  };
  function objectFromEntries(array) {
    return array.reduce((memo, [k2, v2]) => Object.assign(Object.assign({}, memo), { [k2]: v2 }), {});
  }
  var Application = class {
    constructor(element = document.documentElement, schema = defaultSchema) {
      this.logger = console;
      this.debug = false;
      this.logDebugActivity = (identifier, functionName, detail = {}) => {
        if (this.debug) {
          this.logFormattedMessage(identifier, functionName, detail);
        }
      };
      this.element = element;
      this.schema = schema;
      this.dispatcher = new Dispatcher(this);
      this.router = new Router(this);
      this.actionDescriptorFilters = Object.assign({}, defaultActionDescriptorFilters);
    }
    static start(element, schema) {
      const application2 = new this(element, schema);
      application2.start();
      return application2;
    }
    async start() {
      await domReady();
      this.logDebugActivity("application", "starting");
      this.dispatcher.start();
      this.router.start();
      this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping");
      this.dispatcher.stop();
      this.router.stop();
      this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
      this.load({ identifier, controllerConstructor });
    }
    registerActionOption(name, filter) {
      this.actionDescriptorFilters[name] = filter;
    }
    load(head, ...rest) {
      const definitions = Array.isArray(head) ? head : [head, ...rest];
      definitions.forEach((definition) => {
        if (definition.controllerConstructor.shouldLoad) {
          this.router.loadDefinition(definition);
        }
      });
    }
    unload(head, ...rest) {
      const identifiers = Array.isArray(head) ? head : [head, ...rest];
      identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
      return this.router.contexts.map((context) => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
      const context = this.router.getContextForElementAndIdentifier(element, identifier);
      return context ? context.controller : null;
    }
    handleError(error2, message, detail) {
      var _a;
      this.logger.error(`%s

%o

%o`, message, error2, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error2);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
      detail = Object.assign({ application: this }, detail);
      this.logger.groupCollapsed(`${identifier} #${functionName}`);
      this.logger.log("details:", Object.assign({}, detail));
      this.logger.groupEnd();
    }
  };
  function domReady() {
    return new Promise((resolve) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function OutletPropertiesBlessing(constructor) {
    const outlets = readInheritableStaticArrayValues(constructor, "outlets");
    return outlets.reduce((properties, outletDefinition) => {
      return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
    }, {});
  }
  function getOutletController(controller, element, identifier) {
    return controller.application.getControllerForElementAndIdentifier(element, identifier);
  }
  function getControllerAndEnsureConnectedScope(controller, element, outletName) {
    let outletController = getOutletController(controller, element, outletName);
    if (outletController)
      return outletController;
    controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
    outletController = getOutletController(controller, element, outletName);
    if (outletController)
      return outletController;
  }
  function propertiesForOutletDefinition(name) {
    const camelizedName = namespaceCamelize(name);
    return {
      [`${camelizedName}Outlet`]: {
        get() {
          const outletElement = this.outlets.find(name);
          const selector = this.outlets.getSelectorForOutletName(name);
          if (outletElement) {
            const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
            if (outletController)
              return outletController;
            throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
          }
          throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
        }
      },
      [`${camelizedName}Outlets`]: {
        get() {
          const outlets = this.outlets.findAll(name);
          if (outlets.length > 0) {
            return outlets.map((outletElement) => {
              const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
              if (outletController)
                return outletController;
              console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
            }).filter((controller) => controller);
          }
          return [];
        }
      },
      [`${camelizedName}OutletElement`]: {
        get() {
          const outletElement = this.outlets.find(name);
          const selector = this.outlets.getSelectorForOutletName(name);
          if (outletElement) {
            return outletElement;
          } else {
            throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
          }
        }
      },
      [`${camelizedName}OutletElements`]: {
        get() {
          return this.outlets.findAll(name);
        }
      },
      [`has${capitalize(camelizedName)}Outlet`]: {
        get() {
          return this.outlets.has(name);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition], controller) {
    return valueDescriptorForTokenAndTypeDefinition({
      controller,
      token,
      typeDefinition
    });
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(payload) {
    const { controller, token, typeObject } = payload;
    const hasType = isSomething(typeObject.type);
    const hasDefault = isSomething(typeObject.default);
    const fullObject = hasType && hasDefault;
    const onlyType = hasType && !hasDefault;
    const onlyDefault = !hasType && hasDefault;
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default);
    if (onlyType)
      return typeFromObject;
    if (onlyDefault)
      return typeFromDefaultValue;
    if (typeFromObject !== typeFromDefaultValue) {
      const propertyPath = controller ? `${controller}.${token}` : token;
      throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
    }
    if (fullObject)
      return typeFromObject;
  }
  function parseValueTypeDefinition(payload) {
    const { controller, token, typeDefinition } = payload;
    const typeObject = { controller, token, typeObject: typeDefinition };
    const typeFromObject = parseValueTypeObject(typeObject);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
    throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const hasDefault = hasProperty(typeDefinition, "default");
    const hasType = hasProperty(typeDefinition, "type");
    const typeObject = typeDefinition;
    if (hasDefault)
      return typeObject.default;
    if (hasType) {
      const { type } = typeObject;
      const constantFromType = parseValueTypeConstant(type);
      if (constantFromType)
        return defaultValuesByType[constantFromType];
    }
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(payload) {
    const { token, typeDefinition } = payload;
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(payload);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number(value) {
      return Number(value.replace(/_/g, ""));
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    static afterLoad(_identifier, _application) {
      return;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get outlets() {
      return this.scope.outlets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [
    ClassPropertiesBlessing,
    TargetPropertiesBlessing,
    ValuePropertiesBlessing,
    OutletPropertiesBlessing
  ];
  Controller.targets = [];
  Controller.outlets = [];
  Controller.values = {};

  // ../../node_modules/stimulus-autocomplete/src/autocomplete.js
  var optionSelector = "[role='option']:not([aria-disabled])";
  var activeSelector = "[aria-selected='true']";
  var Autocomplete = class _Autocomplete extends Controller {
    static targets = ["input", "hidden", "results"];
    static classes = ["selected"];
    static values = {
      ready: Boolean,
      submitOnEnter: Boolean,
      url: String,
      minLength: Number,
      delay: { type: Number, default: 300 },
      queryParam: { type: String, default: "q" }
    };
    static uniqOptionId = 0;
    connect() {
      this.close();
      if (!this.inputTarget.hasAttribute("autocomplete")) this.inputTarget.setAttribute("autocomplete", "off");
      this.inputTarget.setAttribute("spellcheck", "false");
      this.mouseDown = false;
      this.onInputChange = debounce2(this.onInputChange, this.delayValue);
      this.inputTarget.addEventListener("keydown", this.onKeydown);
      this.inputTarget.addEventListener("blur", this.onInputBlur);
      this.inputTarget.addEventListener("input", this.onInputChange);
      this.resultsTarget.addEventListener("mousedown", this.onResultsMouseDown);
      this.resultsTarget.addEventListener("click", this.onResultsClick);
      if (this.inputTarget.hasAttribute("autofocus")) {
        this.inputTarget.focus();
      }
      this.readyValue = true;
    }
    disconnect() {
      if (this.hasInputTarget) {
        this.inputTarget.removeEventListener("keydown", this.onKeydown);
        this.inputTarget.removeEventListener("blur", this.onInputBlur);
        this.inputTarget.removeEventListener("input", this.onInputChange);
      }
      if (this.hasResultsTarget) {
        this.resultsTarget.removeEventListener("mousedown", this.onResultsMouseDown);
        this.resultsTarget.removeEventListener("click", this.onResultsClick);
      }
    }
    sibling(next) {
      const options = this.options;
      const selected = this.selectedOption;
      const index = options.indexOf(selected);
      const sibling = next ? options[index + 1] : options[index - 1];
      const def = next ? options[0] : options[options.length - 1];
      return sibling || def;
    }
    select(target) {
      const previouslySelected = this.selectedOption;
      if (previouslySelected) {
        previouslySelected.removeAttribute("aria-selected");
        previouslySelected.classList.remove(...this.selectedClassesOrDefault);
      }
      target.setAttribute("aria-selected", "true");
      target.classList.add(...this.selectedClassesOrDefault);
      this.inputTarget.setAttribute("aria-activedescendant", target.id);
      target.scrollIntoView({ behavior: "auto", block: "nearest" });
    }
    onKeydown = (event) => {
      const handler = this[`on${event.key}Keydown`];
      if (handler) handler(event);
    };
    onEscapeKeydown = (event) => {
      if (!this.resultsShown) return;
      this.hideAndRemoveOptions();
      event.stopPropagation();
      event.preventDefault();
    };
    onArrowDownKeydown = (event) => {
      const item = this.sibling(true);
      if (item) this.select(item);
      event.preventDefault();
    };
    onArrowUpKeydown = (event) => {
      const item = this.sibling(false);
      if (item) this.select(item);
      event.preventDefault();
    };
    onTabKeydown = (event) => {
      const selected = this.selectedOption;
      if (selected) this.commit(selected);
    };
    onEnterKeydown = (event) => {
      const selected = this.selectedOption;
      if (selected && this.resultsShown) {
        this.commit(selected);
        if (!this.hasSubmitOnEnterValue) {
          event.preventDefault();
        }
      }
    };
    onInputBlur = () => {
      if (this.mouseDown) return;
      this.close();
    };
    commit(selected) {
      if (selected.getAttribute("aria-disabled") === "true") return;
      if (selected instanceof HTMLAnchorElement) {
        selected.click();
        this.close();
        return;
      }
      const textValue = selected.getAttribute("data-autocomplete-label") || selected.textContent.trim();
      const value = selected.getAttribute("data-autocomplete-value") || textValue;
      this.inputTarget.value = textValue;
      if (this.hasHiddenTarget) {
        this.hiddenTarget.value = value;
        this.hiddenTarget.dispatchEvent(new Event("input"));
        this.hiddenTarget.dispatchEvent(new Event("change"));
      } else {
        this.inputTarget.value = value;
      }
      this.inputTarget.focus();
      this.hideAndRemoveOptions();
      this.element.dispatchEvent(
        new CustomEvent("autocomplete.change", {
          bubbles: true,
          detail: { value, textValue, selected }
        })
      );
    }
    clear() {
      this.inputTarget.value = "";
      if (this.hasHiddenTarget) this.hiddenTarget.value = "";
    }
    onResultsClick = (event) => {
      if (!(event.target instanceof Element)) return;
      const selected = event.target.closest(optionSelector);
      if (selected) this.commit(selected);
    };
    onResultsMouseDown = () => {
      this.mouseDown = true;
      this.resultsTarget.addEventListener("mouseup", () => {
        this.mouseDown = false;
      }, { once: true });
    };
    onInputChange = () => {
      if (this.hasHiddenTarget) this.hiddenTarget.value = "";
      const query = this.inputTarget.value.trim();
      if (query && query.length >= this.minLengthValue) {
        this.fetchResults(query);
      } else {
        this.hideAndRemoveOptions();
      }
    };
    identifyOptions() {
      const prefix = this.resultsTarget.id || "stimulus-autocomplete";
      const optionsWithoutId = this.resultsTarget.querySelectorAll(`${optionSelector}:not([id])`);
      optionsWithoutId.forEach((el) => el.id = `${prefix}-option-${_Autocomplete.uniqOptionId++}`);
    }
    hideAndRemoveOptions() {
      this.close();
      this.resultsTarget.innerHTML = null;
    }
    fetchResults = async (query) => {
      if (!this.hasUrlValue) return;
      const url = this.buildURL(query);
      try {
        this.element.dispatchEvent(new CustomEvent("loadstart"));
        const html = await this.doFetch(url);
        this.replaceResults(html);
        this.element.dispatchEvent(new CustomEvent("load"));
        this.element.dispatchEvent(new CustomEvent("loadend"));
      } catch (error2) {
        this.element.dispatchEvent(new CustomEvent("error"));
        this.element.dispatchEvent(new CustomEvent("loadend"));
        throw error2;
      }
    };
    buildURL(query) {
      const url = new URL(this.urlValue, window.location.href);
      const params = new URLSearchParams(url.search.slice(1));
      params.append(this.queryParamValue, query);
      url.search = params.toString();
      return url.toString();
    }
    doFetch = async (url) => {
      const response = await fetch(url, this.optionsForFetch());
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const html = await response.text();
      return html;
    };
    replaceResults(html) {
      this.resultsTarget.innerHTML = html;
      this.identifyOptions();
      if (!!this.options) {
        this.open();
      } else {
        this.close();
      }
    }
    open() {
      if (this.resultsShown) return;
      this.resultsShown = true;
      this.element.setAttribute("aria-expanded", "true");
      this.element.dispatchEvent(
        new CustomEvent("toggle", {
          detail: { action: "open", inputTarget: this.inputTarget, resultsTarget: this.resultsTarget }
        })
      );
    }
    close() {
      if (!this.resultsShown) return;
      this.resultsShown = false;
      this.inputTarget.removeAttribute("aria-activedescendant");
      this.element.setAttribute("aria-expanded", "false");
      this.element.dispatchEvent(
        new CustomEvent("toggle", {
          detail: { action: "close", inputTarget: this.inputTarget, resultsTarget: this.resultsTarget }
        })
      );
    }
    get resultsShown() {
      return !this.resultsTarget.hidden;
    }
    set resultsShown(value) {
      this.resultsTarget.hidden = !value;
    }
    get options() {
      return Array.from(this.resultsTarget.querySelectorAll(optionSelector));
    }
    get selectedOption() {
      return this.resultsTarget.querySelector(activeSelector);
    }
    get selectedClassesOrDefault() {
      return this.hasSelectedClass ? this.selectedClasses : ["active"];
    }
    optionsForFetch() {
      return { headers: { "X-Requested-With": "XMLHttpRequest" } };
    }
  };
  var debounce2 = (fn2, delay = 10) => {
    let timeoutId = null;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fn2, delay);
    };
  };

  // ../../node_modules/@stimulus-components/scroll-to/dist/stimulus-scroll-to.mjs
  var _ScrollTo = class _ScrollTo2 extends Controller {
    initialize() {
      this.scroll = this.scroll.bind(this);
    }
    connect() {
      this.element.addEventListener("click", this.scroll);
    }
    disconnect() {
      this.element.removeEventListener("click", this.scroll);
    }
    scroll(event) {
      event.preventDefault();
      const id3 = this.element.hash.replace(/^#/, ""), target = document.getElementById(id3);
      if (!target) {
        console.warn(`[stimulus-scroll-to] The element with the id: "${id3}" does not exist on the page.`);
        return;
      }
      const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - this.offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: this.behavior
      });
    }
    get offset() {
      return this.hasOffsetValue ? this.offsetValue : this.defaultOptions.offset !== void 0 ? this.defaultOptions.offset : 10;
    }
    get behavior() {
      return this.behaviorValue || this.defaultOptions.behavior || "smooth";
    }
    get defaultOptions() {
      return {};
    }
  };
  _ScrollTo.values = {
    offset: Number,
    behavior: String
  };
  var ScrollTo = _ScrollTo;

  // ../../node_modules/stimulus-textarea-autogrow/dist/stimulus-textarea-autogrow.mjs
  function r2(t3, e2) {
    let i2;
    return (...o2) => {
      const s2 = this;
      clearTimeout(i2), i2 = setTimeout(() => t3.apply(s2, o2), e2);
    };
  }
  var l2 = class extends Controller {
    initialize() {
      this.autogrow = this.autogrow.bind(this);
    }
    connect() {
      this.element.style.overflow = "hidden";
      const e2 = this.resizeDebounceDelayValue;
      this.onResize = e2 > 0 ? r2(this.autogrow, e2) : this.autogrow, this.autogrow(), this.element.addEventListener("input", this.autogrow), window.addEventListener("resize", this.onResize);
    }
    disconnect() {
      window.removeEventListener("resize", this.onResize);
    }
    autogrow() {
      this.element.style.height = "auto", this.element.style.height = `${this.element.scrollHeight}px`;
    }
  };
  l2.values = {
    resizeDebounceDelay: {
      type: Number,
      default: 100
    }
  };

  // ../../engines/graphemica/app/javascript/graphemica/controllers/application.js
  var application = Application.start();
  application.register("autocomplete", Autocomplete);
  application.register("scroll-to", ScrollTo);
  application.register("textarea-autogrow", l2);
  application.debug = false;
  window.Stimulus = application;

  // ../../engines/graphemica/app/javascript/graphemica/controllers/autosave_controller.js
  var import_lodash = __toESM(require_lodash());
  var Rails = __toESM(require_rails_ujs());
  var autosave_controller_default = class extends Controller {
    static values = {
      delay: { type: Number, default: 1e3 }
    };
    initialize() {
      this.save = this.save.bind(this);
    }
    connect() {
      if (this.delayValue > 0) {
        this.save = (0, import_lodash.debounce)(this.save, this.delayValue);
      }
      window.Console.log("Autosave enabled.");
    }
    save(event) {
      if (!window._rails_loaded) return;
      Rails.fire(this.element, "submit");
      window.Console.log("Autosaved.");
    }
  };

  // ../../engines/graphemica/app/javascript/graphemica/controllers/filter_controller.js
  var filter_controller_default = class extends Controller {
    static targets = ["form"];
    connect() {
      window.Console.log(`filter controller connected (${this})`);
    }
    search() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        window.Console.log("filter form submitted");
        this.formTarget.requestSubmit();
      }, 100);
    }
  };

  // ../../engines/graphemica/app/javascript/graphemica/controllers/hello_controller.js
  var hello_controller_default = class extends Controller {
    connect() {
      this.element.textContent = "Hello World!";
    }
  };

  // ../../engines/graphemica/app/javascript/graphemica/controllers/margin_nav_controller.js
  var PAGE_CONFIGS = [
    {
      test: () => window.location.pathname.match(/^\/U\+[0-9A-Fa-f]+$/),
      hasLeft: () => {
        const match = window.location.pathname.match(/^\/U\+([0-9A-Fa-f]+)$/);
        if (!match) return false;
        const codepoint = parseInt(match[1], 16);
        return codepoint > 0;
      },
      hasRight: () => {
        const match = window.location.pathname.match(/^\/U\+([0-9A-Fa-f]+)$/);
        if (!match) return false;
        const codepoint = parseInt(match[1], 16);
        return codepoint < 1114111;
      },
      goLeft: () => {
        const match = window.location.pathname.match(/^\/U\+([0-9A-Fa-f]+)$/);
        if (match) {
          const codepoint = parseInt(match[1], 16);
          if (codepoint > 0) {
            window.location.href = `/U+${(codepoint - 1).toString(16).toUpperCase()}`;
          }
        }
      },
      goRight: () => {
        const match = window.location.pathname.match(/^\/U\+([0-9A-Fa-f]+)$/);
        if (match) {
          const codepoint = parseInt(match[1], 16);
          if (codepoint < 1114111) {
            window.location.href = `/U+${(codepoint + 1).toString(16).toUpperCase()}`;
          }
        }
      }
    },
    {
      test: () => window.location.pathname.startsWith("/unicode/characters"),
      hasLeft: () => {
        const url = new URL(window.location.href);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        return page > 1;
      },
      hasRight: () => {
        const LAST_PAGE = 288;
        const url = new URL(window.location.href);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        return page < LAST_PAGE;
      },
      goLeft: () => {
        const url = new URL(window.location.href);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        if (page > 1) {
          url.searchParams.set("page", page - 1);
          window.location.href = url.toString();
        }
      },
      goRight: () => {
        const LAST_PAGE = 288;
        const url = new URL(window.location.href);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        if (page < LAST_PAGE) {
          url.searchParams.set("page", page + 1);
          window.location.href = url.toString();
        }
      }
    }
  ];
  function setMarginState(margin, enabled) {
    margin.style.pointerEvents = enabled ? "auto" : "none";
    margin.style.cursor = enabled ? "pointer" : "default";
    margin.style.background = enabled ? "rgba(0,0,0,0)" : "rgba(0,0,0,0)";
  }
  function getHeaderBottom() {
    const siteHeader = document.querySelector(".site-header");
    if (siteHeader) {
      return siteHeader.getBoundingClientRect().bottom;
    }
    return 0;
  }
  var margin_nav_controller_default = class extends Controller {
    connect() {
      this.activeConfig = PAGE_CONFIGS.find((config2) => config2.test());
      if (!this.activeConfig) return;
      this.leftMargin = document.createElement("div");
      this.leftMargin.style.position = "fixed";
      this.leftMargin.style.left = "0";
      this.leftMargin.style.width = "60px";
      this.leftMargin.style.zIndex = "1000";
      this.leftMargin.style.background = "rgba(0,0,0,0)";
      this.leftMargin.addEventListener("click", this.goLeft.bind(this));
      document.body.appendChild(this.leftMargin);
      this.rightMargin = document.createElement("div");
      this.rightMargin.style.position = "fixed";
      this.rightMargin.style.right = "0";
      this.rightMargin.style.width = "60px";
      this.rightMargin.style.zIndex = "1000";
      this.rightMargin.style.background = "rgba(0,0,0,0)";
      this.rightMargin.addEventListener("click", this.goRight.bind(this));
      document.body.appendChild(this.rightMargin);
      this.updateMarginPositions();
      this.updateMargins();
      this._resizeHandler = () => {
        this.updateMarginPositions();
      };
      window.addEventListener("resize", this._resizeHandler);
      setTimeout(() => this.updateMarginPositions(), 1);
      window.Console.log(`margin_nav controller connected (v3)`);
    }
    updateMarginPositions() {
      const headerBottom = getHeaderBottom();
      const topPx = `${headerBottom}px`;
      const heightCalc = `calc(100vh - ${headerBottom}px)`;
      if (this.leftMargin) {
        this.leftMargin.style.top = topPx;
        this.leftMargin.style.height = heightCalc;
      }
      if (this.rightMargin) {
        this.rightMargin.style.top = topPx;
        this.rightMargin.style.height = heightCalc;
      }
    }
    goLeft() {
      if (this.activeConfig && typeof this.activeConfig.goLeft === "function" && this.activeConfig.hasLeft()) {
        this.activeConfig.goLeft();
      }
    }
    goRight() {
      if (this.activeConfig && typeof this.activeConfig.goRight === "function" && this.activeConfig.hasRight()) {
        this.activeConfig.goRight();
      }
    }
    updateMargins() {
      setMarginState(this.leftMargin, this.activeConfig.hasLeft());
      setMarginState(this.rightMargin, this.activeConfig.hasRight());
    }
    disconnect() {
      if (this.leftMargin && this.leftMargin.parentNode) document.body.removeChild(this.leftMargin);
      if (this.rightMargin && this.rightMargin.parentNode) document.body.removeChild(this.rightMargin);
      window.removeEventListener("resize", this._resizeHandler);
    }
  };

  // ../../engines/graphemica/app/javascript/graphemica/controllers/picker_controller.js
  var picker_controller_default = class extends Controller {
    static targets = ["output", "search", "grid", "loadMore", "spinner"];
    connect() {
      const urlParams = new URLSearchParams(window.location.search);
      const savedText = urlParams.get("text");
      if (savedText && this.hasOutputTarget) {
        this.outputTarget.value = savedText;
      }
      this.searchTimeout = null;
      this.currentQuery = "";
      if (this.hasOutputTarget) {
        this.outputTarget.addEventListener("input", () => this.updateUrl());
      }
    }
    addCharacter(event) {
      event.preventDefault();
      const charElement = event.target.closest(".picker-char");
      if (!charElement) return;
      const char = charElement.dataset.char;
      if (this.hasOutputTarget && char) {
        const output = this.outputTarget;
        const start4 = output.selectionStart;
        const end = output.selectionEnd;
        const currentValue = output.value;
        output.value = currentValue.substring(0, start4) + char + currentValue.substring(end);
        const newPosition = start4 + char.length;
        output.setSelectionRange(newPosition, newPosition);
        output.focus();
        this.updateUrl();
      }
    }
    stopPropagation(event) {
      event.stopPropagation();
    }
    search(event) {
      const query = event.target.value.trim();
      this.currentQuery = query;
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.showSpinner();
        this.performSearch(query, 1, true);
      }, 300);
    }
    async performSearch(query, page = 1, replace = true) {
      if (!this.hasGridTarget) return;
      try {
        const url = new URL("/picker/search", window.location.origin);
        if (query) {
          url.searchParams.set("q", query);
        }
        url.searchParams.set("page", page.toString());
        const response = await fetch(url.toString(), {
          headers: {
            "Accept": "text/html",
            "X-Requested-With": "XMLHttpRequest"
          }
        });
        if (response.ok) {
          const html = await response.text();
          if (replace) {
            this.gridTarget.innerHTML = html;
          } else {
            const pickerGrid = this.gridTarget.querySelector(".picker-grid");
            if (pickerGrid) {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = html;
              const newChars = tempDiv.querySelectorAll(".picker-char");
              newChars.forEach((char) => pickerGrid.appendChild(char));
            }
          }
          this.updateLoadMoreButton(query, page);
        }
      } catch (error2) {
        console.error("Search failed:", error2);
      } finally {
        this.hideSpinner();
      }
    }
    async updateLoadMoreButton(query, currentPage) {
      try {
        const url = new URL("/picker/search", window.location.origin);
        if (query) {
          url.searchParams.set("q", query);
        }
        url.searchParams.set("page", currentPage.toString());
        const response = await fetch(url.toString(), {
          headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (this.hasLoadMoreTarget) {
            if (data.has_more) {
              this.loadMoreTarget.style.display = "block";
              const btn = this.loadMoreTarget.querySelector(".load-more-btn");
              if (btn) {
                btn.dataset.page = data.next_page;
                btn.classList.remove("loading");
              }
            } else {
              this.loadMoreTarget.style.display = "none";
            }
          }
        }
      } catch (error2) {
        console.error("Failed to update load more:", error2);
      }
    }
    async loadMore(event) {
      event.preventDefault();
      const btn = event.target.closest(".load-more-btn");
      if (!btn || btn.classList.contains("loading")) return;
      btn.classList.add("loading");
      const page = parseInt(btn.dataset.page) || 2;
      await this.performSearch(this.currentQuery, page, false);
    }
    updateUrl() {
      if (!this.hasOutputTarget) return;
      const text = this.outputTarget.value;
      const url = new URL(window.location.href);
      if (text && text.trim() !== "") {
        url.searchParams.set("text", text);
      } else {
        url.searchParams.delete("text");
      }
      window.history.replaceState({}, "", url.toString());
    }
    copyToClipboard(event) {
      event.preventDefault();
      if (!this.hasOutputTarget) return;
      const text = this.outputTarget.value;
      if (!text || text.trim() === "") return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showCopySuccess();
        }).catch(() => {
          this.fallbackCopy(text);
        });
      } else {
        this.fallbackCopy(text);
      }
    }
    fallbackCopy(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        this.showCopySuccess();
      } catch (err) {
        this.outputTarget.select();
        this.outputTarget.setSelectionRange(0, text.length);
      }
      document.body.removeChild(textArea);
    }
    showCopySuccess() {
      const copyBtn = document.getElementById("copy-btn");
      const copySuccess = document.getElementById("copy-success");
      if (copyBtn && copySuccess) {
        copyBtn.style.display = "none";
        copySuccess.style.display = "inline-block";
        setTimeout(() => {
          copySuccess.style.display = "none";
          copyBtn.style.display = "inline-block";
        }, 1200);
      }
    }
    clearOutput(event) {
      event.preventDefault();
      if (this.hasOutputTarget) {
        this.outputTarget.value = "";
        this.outputTarget.focus();
        this.updateUrl();
      }
    }
    shareUrl(event) {
      event.preventDefault();
      if (!this.hasOutputTarget) return;
      const text = this.outputTarget.value;
      if (!text || text.trim() === "") return;
      const url = new URL(window.location.href);
      url.searchParams.set("text", text);
      const shareableUrl = url.toString();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareableUrl).then(() => {
          this.showShareSuccess();
        }).catch(() => {
          this.fallbackShareCopy(shareableUrl);
        });
      } else {
        this.fallbackShareCopy(shareableUrl);
      }
    }
    fallbackShareCopy(url) {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        this.showShareSuccess();
      } catch (err) {
        window.prompt("Copy this URL:", url);
      }
      document.body.removeChild(textArea);
    }
    showShareSuccess() {
      const shareBtn = document.getElementById("share-btn");
      if (shareBtn) {
        const originalContent = shareBtn.innerHTML;
        shareBtn.textContent = "\u2713 Copied!";
        setTimeout(() => {
          shareBtn.innerHTML = originalContent;
        }, 1500);
      }
    }
    showSpinner() {
      if (this.hasSpinnerTarget) {
        this.spinnerTarget.style.display = "flex";
      }
    }
    hideSpinner() {
      if (this.hasSpinnerTarget) {
        this.spinnerTarget.style.display = "none";
      }
    }
  };

  // ../../engines/graphemica/app/javascript/graphemica/controllers/remote_load_controller.js
  var remote_load_controller_default = class extends Controller {
    static values = { path: String };
    connect() {
      fetch(this.pathValue, {
        headers: {
          Accept: "text/html; turbo-stream, text/html, application/xhtml+xml"
        }
      }).then((response) => response.text()).then((body) => {
        this.htmlToElements(body).forEach((element) => {
          this.element.appendChild(element);
        });
      });
    }
    /**
     * https://stackoverflow.com/a/35385518
     * @param {String} HTML representing any number of sibling elements
     * @return {NodeList}
     */
    static htmlToElements(html) {
      const template = document.createElement("template");
      template.innerHTML = html.trim();
      return template.content.childNodes;
    }
  };

  // ../../engines/graphemica/app/javascript/graphemica/controllers/remote_load_count_controller.js
  var remote_load_count_controller_default = class extends Controller {
    static values = {
      formattedCount: String,
      identifier: String
    };
    connect() {
      window.Console.log("connecting remote_load_count_controller");
      window.Console.log(`this.formattedCountValue: ${this.formattedCountValue}`);
      window.Console.log(`this.identifierValue: ${this.identifierValue}`);
      if (this.identifierValue) {
        const targetFrame = document.getElementById(this.identifierValue);
        if (targetFrame) {
          targetFrame.innerHTML = this.formattedCountValue;
          window.Console.log(`${this.identifierValue} updated to:
${this.formattedCountValue}`);
        }
      }
      window.Console.log("remote_load_count_controller connected");
    }
  };

  // ../../engines/graphemica/app/javascript/graphemica/controllers/index.js
  application.register("autosave", autosave_controller_default);
  application.register("filter", filter_controller_default);
  application.register("hello", hello_controller_default);
  application.register("margin-nav", margin_nav_controller_default);
  application.register("picker", picker_controller_default);
  application.register("remote-load", remote_load_controller_default);
  application.register("remote-load-count", remote_load_count_controller_default);

  // ../../engines/graphemica/app/javascript/graphemica/sprinkles/mobile-browser-check.js
  (($2, window2, document2) => {
    document2.addEventListener("turbo:load", () => {
      window2.mobileAndTabletCheck = () => {
        let check = false;
        ((a2) => {
          if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a2) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a2.substr(0, 4))) {
            check = true;
          }
        })(navigator.userAgent || navigator.vendor || window2.opera);
        return check;
      };
      window2.Console.log("mobile-browser-check loaded");
    });
  })(jQuery, window, document);

  // ../../engines/graphemica/app/javascript/graphemica/sprinkles/using-mouse.js
  document.addEventListener("mousedown", () => {
    document.body.classList.add("using-mouse");
  });
  document.addEventListener("keydown", (event) => {
    if (event.keyCode === 9) {
      document.body.classList.remove("using-mouse");
    }
  });

  // ../../engines/graphemica/app/javascript/graphemica/application.js
  if (window.location.hostname.match(/\.dev$|\.test$/)) {
    window.Console = console;
  } else {
    window.Console = { log: () => {
    } };
  }
  start();
})();
/*! Bundled license information:

lodash/lodash.js:
  (**
   * @license
   * Lodash <https://lodash.com/>
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)

@hotwired/turbo/dist/turbo.es2017-esm.js:
  (*!
  Turbo 8.0.19
  Copyright © 2025 37signals LLC
   *)

trix/dist/trix.esm.min.js:
  (*! @license DOMPurify 3.2.5 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.5/LICENSE *)
*/
;
