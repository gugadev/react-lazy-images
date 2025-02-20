import e from "react";
import t from "react-intersection-observer";
import { unionize as n, ofType as r } from "unionize";
function o(e, t) {
  return (
    (o = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function(e, t) {
          return (e.__proto__ = t), e;
        }),
    o(e, t)
  );
}
function a(e, t) {
  if (null == e) return {};
  var n,
    r,
    o = {},
    a = Object.keys(e);
  for (r = 0; r < a.length; r++) t.indexOf((n = a[r])) >= 0 || (o[n] = e[n]);
  return o;
}
var i,
  c = [
    "children",
    "loadEagerly",
    "observerProps",
    "experimentalDecode",
    "debounceDurationMs",
    "debugActions"
  ];
!(function(e) {
  (e.NotAsked = "NotAsked"),
    (e.Loading = "Loading"),
    (e.LoadSuccess = "LoadSuccess"),
    (e.LoadError = "LoadError");
})(i || (i = {}));
var u = n({
    NotAsked: {},
    Buffering: {},
    Loading: {},
    LoadSuccess: {},
    LoadError: r()
  }),
  s = n({
    ViewChanged: r(),
    BufferingEnded: {},
    LoadSuccess: {},
    LoadError: r()
  }),
  d = function(e, t) {
    return function(n) {
      var r = l(m(e, t));
      r.promise
        .then(function(e) {
          return n.update(s.LoadSuccess({}));
        })
        .catch(function(e) {
          e.isCanceled || n.update(s.LoadError({ msg: "Failed to load" }));
        }),
        (n.promiseCache.loading = r);
    };
  },
  f = function(e) {
    e.promiseCache.buffering.cancel();
  },
  p = /*#__PURE__*/ (function(n) {
    var r, p;
    function m(e) {
      var t;
      return (
        ((t = n.call(this, e) || this).promiseCache = {}),
        (t.initialState = u.NotAsked()),
        (t.state = t.initialState),
        (t.update = t.update.bind(
          (function(e) {
            if (void 0 === e)
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            return e;
          })(t)
        )),
        t
      );
    }
    (p = n),
      ((r = m).prototype = Object.create(p.prototype)),
      (r.prototype.constructor = r),
      o(r, p),
      (m.reducer = function(e, t, n) {
        return s.match(e, {
          ViewChanged: function(e) {
            return !0 === e.inView
              ? n.src
                ? u.match(t, {
                    NotAsked: function() {
                      return n.debounceDurationMs
                        ? {
                            nextState: u.Buffering(),
                            cmd:
                              ((e = n.debounceDurationMs),
                              function(t) {
                                var n = l(g(e));
                                n.promise
                                  .then(function() {
                                    return t.update(s.BufferingEnded());
                                  })
                                  .catch(function(e) {}),
                                  (t.promiseCache.buffering = n);
                              })
                          }
                        : {
                            nextState: u.Loading(),
                            cmd: d(n, n.experimentalDecode)
                          };
                      var e;
                    },
                    default: function() {
                      return { nextState: t };
                    }
                  })
                : { nextState: u.LoadSuccess() }
              : u.match(t, {
                  Buffering: function() {
                    return { nextState: u.NotAsked(), cmd: f };
                  },
                  default: function() {
                    return { nextState: t };
                  }
                });
          },
          BufferingEnded: function() {
            return { nextState: u.Loading(), cmd: d(n, n.experimentalDecode) };
          },
          LoadSuccess: function() {
            return { nextState: u.LoadSuccess() };
          },
          LoadError: function(e) {
            return { nextState: u.LoadError(e) };
          }
        });
      });
    var h = m.prototype;
    return (
      (h.update = function(e) {
        var t = this,
          n = m.reducer(e, this.state, this.props),
          r = n.nextState,
          o = n.cmd;
        this.props.debugActions &&
          ("production" === process.env.NODE_ENV &&
            console.warn(
              'You are running LazyImage with debugActions="true" in production. This might have performance implications.'
            ),
          console.log({ action: e, prevState: this.state, nextState: r })),
          this.setState(r, function() {
            return o && o(t);
          });
      }),
      (h.componentWillUnmount = function() {
        this.promiseCache.loading && this.promiseCache.loading.cancel(),
          this.promiseCache.buffering && this.promiseCache.buffering.cancel(),
          (this.promiseCache = {});
      }),
      (h.render = function() {
        var n = this,
          r = this.props,
          o = r.children,
          d = r.loadEagerly,
          f = r.observerProps,
          p = a(r, c);
        return d
          ? o({ imageState: u.LoadSuccess().tag, imageProps: p })
          : e.createElement(
              t,
              Object.assign({ rootMargin: "50px 0px", threshold: 0.01 }, f, {
                onChange: function(e) {
                  return n.update(s.ViewChanged({ inView: e }));
                }
              }),
              function(e) {
                return o({
                  imageState:
                    "Buffering" === n.state.tag ? i.Loading : n.state.tag,
                  imageProps: p,
                  ref: e.ref
                });
              }
            );
      }),
      m
    );
  })(e.Component);
p.displayName = "LazyImageFull";
var m = function(e, t) {
    var n = e.src,
      r = e.srcSet,
      o = e.alt,
      a = e.sizes;
    return (
      void 0 === t && (t = !1),
      new Promise(function(e, i) {
        var c = new Image();
        if (
          (r && (c.srcset = r),
          o && (c.alt = o),
          a && (c.sizes = a),
          (c.src = n),
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
  g = function(e) {
    return new Promise(function(t) {
      return setTimeout(t, e);
    });
  },
  l = function(e) {
    var t = !1;
    return {
      promise: new Promise(function(n, r) {
        e.then(function(e) {
          return t ? r({ isCanceled: !0 }) : n(e);
        }),
          e.catch(function(e) {
            return r(t ? { isCanceled: !0 } : e);
          });
      }),
      cancel: function() {
        t = !0;
      }
    };
  },
  h = ["actual", "placeholder", "loading", "error"],
  S = function(t) {
    var n = t.actual,
      r = t.placeholder,
      o = t.loading,
      c = t.error,
      u = a(t, h);
    return e.createElement(p, Object.assign({}, u), function(e) {
      var t = e.imageProps,
        a = e.ref;
      switch (e.imageState) {
        case i.NotAsked:
          return !!r && r({ imageProps: t, ref: a });
        case i.Loading:
          return o ? o() : !!r && r({ imageProps: t, ref: a });
        case i.LoadSuccess:
          return n({ imageProps: t });
        case i.LoadError:
          return c ? c() : n({ imageProps: t });
      }
    });
  };
S.displayName = "LazyImage";
export { i as ImageState, S as LazyImage, p as LazyImageFull };
//# sourceMappingURL=react-lazy-images.es.js.map
