var e = require("react"),
  t = require("react-intersection-observer"),
  r = require("unionize");
function n(e) {
  return e && "object" == typeof e && "default" in e ? e : { default: e };
}
var o = /*#__PURE__*/ n(e),
  a = /*#__PURE__*/ n(t);
function i(e, t) {
  return (
    (i = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function(e, t) {
          return (e.__proto__ = t), e;
        }),
    i(e, t)
  );
}
function c(e, t) {
  if (null == e) return {};
  var r,
    n,
    o = {},
    a = Object.keys(e);
  for (n = 0; n < a.length; n++) t.indexOf((r = a[n])) >= 0 || (o[r] = e[r]);
  return o;
}
var u,
  s = [
    "children",
    "loadEagerly",
    "observerProps",
    "experimentalDecode",
    "debounceDurationMs",
    "debugActions"
  ];
(exports.ImageState = void 0),
  ((u = exports.ImageState || (exports.ImageState = {})).NotAsked = "NotAsked"),
  (u.Loading = "Loading"),
  (u.LoadSuccess = "LoadSuccess"),
  (u.LoadError = "LoadError");
var d = r.unionize({
    NotAsked: {},
    Buffering: {},
    Loading: {},
    LoadSuccess: {},
    LoadError: r.ofType()
  }),
  f = r.unionize({
    ViewChanged: r.ofType(),
    BufferingEnded: {},
    LoadSuccess: {},
    LoadError: r.ofType()
  }),
  p = function(e, t) {
    return function(r) {
      var n = S(m(e, t));
      n.promise
        .then(function(e) {
          return r.update(f.LoadSuccess({}));
        })
        .catch(function(e) {
          e.isCanceled || r.update(f.LoadError({ msg: "Failed to load" }));
        }),
        (r.promiseCache.loading = n);
    };
  },
  g = function(e) {
    e.promiseCache.buffering.cancel();
  },
  l = /*#__PURE__*/ (function(e) {
    var t, r;
    function n(t) {
      var r;
      return (
        ((r = e.call(this, t) || this).promiseCache = {}),
        (r.initialState = d.NotAsked()),
        (r.state = r.initialState),
        (r.update = r.update.bind(
          (function(e) {
            if (void 0 === e)
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            return e;
          })(r)
        )),
        r
      );
    }
    (r = e),
      ((t = n).prototype = Object.create(r.prototype)),
      (t.prototype.constructor = t),
      i(t, r),
      (n.reducer = function(e, t, r) {
        return f.match(e, {
          ViewChanged: function(e) {
            return !0 === e.inView
              ? r.src
                ? d.match(t, {
                    NotAsked: function() {
                      return r.debounceDurationMs
                        ? {
                            nextState: d.Buffering(),
                            cmd:
                              ((e = r.debounceDurationMs),
                              function(t) {
                                var r = S(h(e));
                                r.promise
                                  .then(function() {
                                    return t.update(f.BufferingEnded());
                                  })
                                  .catch(function(e) {}),
                                  (t.promiseCache.buffering = r);
                              })
                          }
                        : {
                            nextState: d.Loading(),
                            cmd: p(r, r.experimentalDecode)
                          };
                      var e;
                    },
                    default: function() {
                      return { nextState: t };
                    }
                  })
                : { nextState: d.LoadSuccess() }
              : d.match(t, {
                  Buffering: function() {
                    return { nextState: d.NotAsked(), cmd: g };
                  },
                  default: function() {
                    return { nextState: t };
                  }
                });
          },
          BufferingEnded: function() {
            return { nextState: d.Loading(), cmd: p(r, r.experimentalDecode) };
          },
          LoadSuccess: function() {
            return { nextState: d.LoadSuccess() };
          },
          LoadError: function(e) {
            return { nextState: d.LoadError(e) };
          }
        });
      });
    var u = n.prototype;
    return (
      (u.update = function(e) {
        var t = this,
          r = n.reducer(e, this.state, this.props),
          o = r.nextState,
          a = r.cmd;
        this.props.debugActions &&
          ("production" === process.env.NODE_ENV &&
            console.warn(
              'You are running LazyImage with debugActions="true" in production. This might have performance implications.'
            ),
          console.log({ action: e, prevState: this.state, nextState: o })),
          this.setState(o, function() {
            return a && a(t);
          });
      }),
      (u.componentWillUnmount = function() {
        this.promiseCache.loading && this.promiseCache.loading.cancel(),
          this.promiseCache.buffering && this.promiseCache.buffering.cancel(),
          (this.promiseCache = {});
      }),
      (u.render = function() {
        var e = this,
          t = this.props,
          r = t.children,
          n = t.loadEagerly,
          i = t.observerProps,
          u = c(t, s);
        return n
          ? r({ imageState: d.LoadSuccess().tag, imageProps: u })
          : o.default.createElement(
              a.default,
              Object.assign({ rootMargin: "50px 0px", threshold: 0.01 }, i, {
                onChange: function(t) {
                  return e.update(f.ViewChanged({ inView: t }));
                }
              }),
              function(t) {
                return r({
                  imageState:
                    "Buffering" === e.state.tag
                      ? exports.ImageState.Loading
                      : e.state.tag,
                  imageProps: u,
                  ref: t.ref
                });
              }
            );
      }),
      n
    );
  })(o.default.Component);
l.displayName = "LazyImageFull";
var m = function(e, t) {
    var r = e.src,
      n = e.srcSet,
      o = e.alt,
      a = e.sizes;
    return (
      void 0 === t && (t = !1),
      new Promise(function(e, i) {
        var c = new Image();
        if (
          (n && (c.srcset = n),
          o && (c.alt = o),
          a && (c.sizes = a),
          (c.src = r),
          t && "decode" in c)
        )
          return c
            .decode()
            .then(function() {
              return e(c);
            })
            .catch(function(e) {
              return i(e);
            });
        (c.onload = e), (c.onerror = i);
      })
    );
  },
  h = function(e) {
    return new Promise(function(t) {
      return setTimeout(t, e);
    });
  },
  S = function(e) {
    var t = !1;
    return {
      promise: new Promise(function(r, n) {
        e.then(function(e) {
          return t ? n({ isCanceled: !0 }) : r(e);
        }),
          e.catch(function(e) {
            return n(t ? { isCanceled: !0 } : e);
          });
      }),
      cancel: function() {
        t = !0;
      }
    };
  },
  L = ["actual", "placeholder", "loading", "error"],
  v = function(e) {
    var t = e.actual,
      r = e.placeholder,
      n = e.loading,
      a = e.error,
      i = c(e, L);
    return o.default.createElement(l, Object.assign({}, i), function(e) {
      var o = e.imageProps,
        i = e.ref;
      switch (e.imageState) {
        case exports.ImageState.NotAsked:
          return !!r && r({ imageProps: o, ref: i });
        case exports.ImageState.Loading:
          return n ? n() : !!r && r({ imageProps: o, ref: i });
        case exports.ImageState.LoadSuccess:
          return t({ imageProps: o });
        case exports.ImageState.LoadError:
          return a ? a() : t({ imageProps: o });
      }
    });
  };
(v.displayName = "LazyImage"),
  (exports.LazyImage = v),
  (exports.LazyImageFull = l);
//# sourceMappingURL=react-lazy-images.js.map
