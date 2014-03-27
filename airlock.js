/* ---------------------------------------------------------------------------
         d8888 8888888 8888888b.  888      .d88888b.   .d8888b.  888    d8P
        d88888   888   888   Y88b 888     d88P" "Y88b d88P  Y88b 888   d8P
       d88P888   888   888    888 888     888     888 888    888 888  d8P
      d88P 888   888   888   d88P 888     888     888 888        888d88K
     d88P  888   888   8888888P"  888     888     888 888        8888888b
    d88P   888   888   888 T88b   888     888     888 888    888 888  Y88b
   d8888888888   888   888  T88b  888     Y88b. .d88P Y88b  d88P 888   Y88b
  d88P     888 8888888 888   T88b 88888888 "Y88888P"   "Y8888P"  888    Y88b
------------------------------------------------------------------------------
Airlock v1.0.2
(c) 2013 by Search Discovery <http://searchdiscovery.com/>

airlock.js may be freely distributed under the MIT license.

For all details and documentation: http://www.searchdiscovery.com/airlock
----------------------------------------------------------------------------*/
(function (window, document, undefined) {
  'use strict';

  var Airlock = {};
  Airlock.settings = window._airlock || {};
  Airlock.settings.dimensionMap = Airlock.settings.dimensionMap || {};

  // First thing's first; load the new hotness.
  (function(a, i, r, l, o, c, k) {
    if (a.GoogleAnalyticsObject && a[a.GoogleAnalyticsObject]) { return; }
    a.GoogleAnalyticsObject = o;
    a[o] = a[o] || (function() {
      (a[o].q = a[o].q || []).push(arguments);
    });
    if (Airlock.settings.loadUA === false) { return; }
    a[o].l = 1 * (new Date());
    c = i.createElement(r);
    k = i.getElementsByTagName(r)[0];
    c.async = 1;
    c.src = l;
    k.parentNode.insertBefore(c, k);
  })(window, document, 'script', '//www.google-analytics.com/analytics' + (Airlock.settings.debug ? '_debug' : '') + '.js', Airlock.settings.gaNamespace || 'ga');

  // We're pretty loopy here, so this makes our lives easier.
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
      for (var i = 0, len = this.length; i < len; ++i) {
        if (i in this) {
          fn.call(scope, this[i], i, this);
        }
      }
    };
  }

  // Convenience functions
  function returnArg (arg) { return arg; }
  function bind (func, context) {
    var args = [].slice.call(arguments, 2);
    return function () {
      return func.apply(context, [].concat.apply(args, arguments));
    };
  }

  var _gaq = window._gaq,
      rx = {
        actions: /^([\w\d_-]+)?\.?(_track(Event|Pageview|Trans|Social|Timing)|_add(Item|Trans)|_set(CustomVar|Account|DomainName|AllowLinker|SampleRate|CookiePath|SiteSpeedSampleRate)?|_link|_require)$/,
        setupActions: /^(.+\.)?_(set(Account|CustomVar|DomainName|AllowLinker|SampleRate|CookiePath|SiteSpeedSampleRate)?)$/,
        ecommerceActions: /^(.+\.)?_(add(Trans|Item)|trackTrans)$/,
        writeableSet: /^page|title$/
      };

  function Store () {
    this._contents = {};
    this._defaultKey = 't0';
  }
  Store.prototype.get = function (key) {
    key = key || this._defaultKey;
    return this._contents[key];
  };
  Store.prototype.set = function (key, val) {
    key = key || this._defaultKey;
    this._contents[key] = val;
    return this;
  };
  Store.prototype.has = function (key) {
    key = key || this._defaultKey;
    return !!this._contents[key];
  };
  Store.prototype.forEach = function (func, context) {
    for (var key in this._contents) {
      if (this._contents.hasOwnProperty(key)) {
        func.call(context, this._contents[key], key, this._contents);
      }
    }
  };

  // Each spaceship represents a tracker namespace.
  var SpaceShip = function (namespace, account) {
    if (typeof namespace === 'object') {
      var tracker = namespace;
      namespace = tracker.get('name');
      account = tracker.get('trackingId');
      return new SpaceShip(namespace, account).initialize();
    }
    this.settings = {};
    this._settings = {};
    this.namespace = namespace;
    this.account = account;
    this.setupQueue = [];
    this.initialized = false;
    this.settings.name = this.namespace;
  };

  SpaceShip.prototype.setAccount = function (uaCode) {
    this.account = uaCode;
    return this;
  };

  SpaceShip.prototype.initialize = function () {
    this.setupQueue.forEach(function (qItem) { qItem(); });
    this.initialized = true;
    return this;
  };

  Airlock.spaceships = new Store();

  Airlock.readAction = function (actionName) {
    var match = actionName.match(rx.actions);
    if (!match) { return null; }
    return {
      namespace: match[1],
      action: match[2]
    };
  };

  Airlock.initialize = function () {
    var newQ = [], ga = window[window.GoogleAnalyticsObject];

    // loop through uninitialized ga to see if users have implemented a
    // custom "create". If so, add a function to the queue to fire directly
    // after the queue item has been processed.
    if (ga.q) {
      var tempQ = [].concat(ga.q),
          j = 0;

      ga.q.forEach(function (qItem, i) {
        if (typeof qItem[0] !== 'string' || qItem[0] !== 'create') { return; }
        j = j + i + 1;
        tempQ.splice(j, 0, [function () {
          var ga = window[window.GoogleAnalyticsObject],
              settings = qItem[qItem.length - 1],
              namespace = typeof settings === 'object' && settings.name ? settings.name : 't0',
              tracker = ga.getByName(namespace),
              spaceship = new SpaceShip(tracker);

          Airlock.dock(spaceship);
        }]);
      });
      ga.q = tempQ;
    }

    // loop through initialized ga to see if users have implemented a
    // custom "create"
    if (ga.P) {
      ga.P.forEach(function (tracker) {
        var spaceship = new SpaceShip(tracker);
        this.dock(spaceship);
      }, this);
    }

    // loop through _gaq to strip out setup calls
    _gaq.forEach(function (qItem) {
      if (typeof qItem === 'function') {
        Airlock.open(null, qItem);
        return;
      }

      var action = Airlock.readAction(qItem[0]);

      if (!action) { return; }

      if (rx.setupActions.test(action.action)) {
        // If we find a tracker we have not yet initialized, set it up
        if (!this.spaceships.has(action.namespace)) {
          this.dock(new SpaceShip(action.namespace));
        }
        this.pressurize(qItem, this.spaceships.get(action.namespace));
        return;
      }
      newQ.push(qItem);
    }, this);

    Array.prototype.splice.apply(_gaq, [0, _gaq.length].concat(newQ));

    this.spaceships.forEach(function (spaceship) {
      Airlock.open(spaceship, [
        'create',
        spaceship.account,
        spaceship.settings
      ]);
    });

    // No need to do anything fancy here. Setting an instance method
    // `push()` on the global `_gaq` variable will intercept any calls
    // to `_gaq.prototype.push()`
    _gaq.push = function (args) {
      if (typeof args === 'function') {
        return Airlock.open(null, args);
      }

      var action = Airlock.readAction(args[0]);

      if (!action) { return; }

      // If the user is trying to setup/send an ecommerce action
      if (rx.ecommerceActions.test(action.action) && !Airlock.ecommerceInitialized) {
        Airlock.ecommerceInitialized = true;
        Airlock._open(['require', 'ecommerce', 'ecommerce.js']);
      }
      var spaceship = Airlock.spaceships.get(action.namespace);

      if (!spaceship) { return; }

      args = Airlock.pressurize(args, spaceship);
      Airlock.open(spaceship, args);
    };
    _gaq.forEach(bind(_gaq.push, _gaq));
  };

  // Add tracker to Airlock, push settings to ga
  Airlock.dock = function (spaceship) {
    this.spaceships.set(spaceship.namespace, spaceship);
  };

  // Once our arguments are "pressurized", execute them.
  Airlock.open = function (spaceship, args) {
    if (typeof args === 'function') {
      return Airlock._open([args]);
    }
    if (!spaceship || !spaceship.account) { return; }
    var create = args[0] === 'create';
    if (args) {
      args[0] = !spaceship.namespace || create ?
        args[0] :
        [spaceship.namespace, args[0]].join('.');

      Airlock._open(args);
      if (create) { spaceship.initialize(); }
    }
  };

  Airlock._open = function (args) {
    return window[window.GoogleAnalyticsObject].apply(window, args);
  };

  Airlock.pressurize = function (args, spaceship) {
    var conversion = Airlock.conversions[args.splice(0,1)[0].replace(rx.actions, '$2')];

    if (!conversion) { return; }

    if (typeof conversion === 'function') {
      return conversion.apply(spaceship, args);
    }

    var index = {}, out = [],
        i = 0, ln = args.length < conversion.input.length ?
          args.length :
          conversion.input.length;

    // build an index to match input labels to input values
    for (; i < ln; i++) {
      index[conversion.input[i]] = args[i];
    }

    // loop through outputs and permute values as necessary
    i = 0; ln = conversion.output.length;
    conversion.output.forEach(function (output) {
      var val = permute(output, index);
      if (val) {
        out.push(val);
      }
    });
    return out;
  };

  var permute = function (template, data) {
    if (typeof template === 'function') {
      return template(data);
    }
    var templMatch = template.match(/\[\[([a-zA-Z_]+)\]\]/);
    if (templMatch) {
      if (!data[templMatch[1]]) { return; }
      // if there is no input value corresponding to the template identifier
      // (i.e., if this is an optional value), this will return undefined
      // and will be ignored.
      return template.replace(templMatch[0], data[templMatch[1]]);
    }
    return template;
  };

  Airlock.conversions = {
    // Setup actions
    _setAccount: function (uaCode) {
      this.setAccount(uaCode);
    },
    _setSampleRate: function (rate) {
      this.settings.sampleRate = rate;
    },
    _setSiteSpeedSampleRate: function (rate) {
      this.settings.siteSpeedSampleRate = rate;
    },
    _setCookiePath: function (path) {
      this.settings.cookiePath = path;
    },
    _set: function (key, val) {
      this.settings[key.replace('ua', 'cookie')] = val;

      if (rx.writeableSet.test(key)) {
        return ['set', key, val];
      }
    },
    _setDomainName: function (domainName) {
      this._settings.domainName = domainName;
    },
    _setAllowLinker: function (allow) {
      var that = this;
      this.settings.allowLinker = allow;
      this.setupQueue.push(function () {
        Airlock._open(['require', 'linker']);
        Airlock.open(that, ['linker:autoLink', that._settings.domainName]);
      });
    },
    // Enhanced Link Attribution
    _require: function (type){
      if (type === 'inpage_linkid') {
        return ['require','linkid','linkid.js'];
      }
    },

    // Custom Variables
    _setCustomVar: function (slot, name, value) {
      var dimensionMap = Airlock.settings.dimensionMap, args;
      slot = dimensionMap[slot] || dimensionMap[name] || slot;
      args = ['set', 'dimension' + slot, value];

      if (this.initialized) { return args; }
      this.setupQueue.push(bind(Airlock.open, Airlock, this, args));
    },

    // Tracking actions
    _trackEvent: {
      input: ['eventCategory', 'eventAction', 'eventLabel', 'eventValue', 'nonInteraction'],
      output: ['send', 'event', returnArg]
    },
    _trackPageview: {
      input: ['pagePath'],
      output: ['send', 'pageview', '[[pagePath]]']
    },
    _trackTiming: {
      input: ['timingCategory', 'timingVar', 'timingValue', 'timingLabel'],
      output: ['send', 'timing', returnArg]
    },
    _trackSocial: {
      input: ['socialNetwork', 'socialAction', 'socialTarget', 'page'],
      output: ['send', 'social', returnArg]
    },

    // Ecommerce
    _addTrans: {
      input: ['id', 'affiliation', 'revenue', 'tax', 'shipping'],
      output: ['ecommerce:addTransaction', returnArg]
    },
    _addItem: {
      input: ['id', 'sku', 'name', 'category', 'price', 'quantity'],
      output: ['ecommerce:addItem', returnArg]
    },
    _trackTrans: {
      input: [],
      output: ['ecommerce:send']
    }
  };

  if (Airlock.settings.conversions) {
    var conversions = Airlock.settings.conversions;
    for (var key in conversions) {
      if (conversions.hasOwnProperty(key)) {
        Airlock.conversions[key] = conversions[key];
      }
    }
  }

  if (Airlock.settings.autoInit !== false) {
    Airlock.initialize();
  }
  if (Airlock.settings.autoInit === false || Airlock.settings.expose) {
    window.Airlock = Airlock;
  }

  if (typeof define === 'function' && define.amd) {
    define('airlock', [], function() {
        return Airlock;
    });
  }
})(window, document);
