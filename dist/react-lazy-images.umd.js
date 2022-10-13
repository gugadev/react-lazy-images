!(function(e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(
        exports,
        require("react"),
        require("react-intersection-observer"),
        require("unionize")
      )
    : "function" == typeof define && define.amd
    ? define(["exports", "react", "react-intersection-observer", "unionize"], t)
    : t(
        ((e || self).reactLazyImages = {}),
        e.react,
        e.reactIntersectionObserver,
        e.unionize
      );
})(this, function(e, t, n, r) {
  function o(e) {
    return e && "object" == typeof e && "default" in e ? e : { default: e };
  }
  var a = /*#__PURE__*/ o(t),
    i = /*#__PURE__*/ o(n);
  function c(e, t) {
    return (
      (c = Object.setPrototypeOf
        ? Object.setPrototypeOf.bind()
        : function(e, t) {
            return (e.__proto__ = t), e;
          }),
      c(e, t)
    );
  }
  function u(e, t) {
    if (null == e) return {};
    var n,
      r,
      o = {},
      a = Object.keys(e);
    for (r = 0; r < a.length; r++) t.indexOf((n = a[r])) >= 0 || (o[n] = e[n]);
    return o;
  }
  var s,
    d = [
      "children",
      "loadEagerly",
      "observerProps",
      "experimentalDecode",
      "debounceDurationMs",
      "debugActions"
    ];
  (e.ImageState = void 0),
    ((s = e.ImageState || (e.ImageState = {})).NotAsked = "NotAsked"),
    (s.Loading = "Loading"),
    (s.LoadSuccess = "LoadSuccess"),
    (s.LoadError = "LoadError");
  var f = r.unionize({
      NotAsked: {},
      Buffering: {},
      Loading: {},
      LoadSuccess: {},
      LoadError: r.ofType()
    }),
    p = r.unionize({
      ViewChanged: r.ofType(),
      BufferingEnded: {},
      LoadSuccess: {},
      LoadError: r.ofType()
    }),
    l = function(e, t) {
      return function(n) {
        var r = L(h(e, t));
        r.promise
          .then(function(e) {
            return n.update(p.LoadSuccess({}));
          })
          .catch(function(e) {
            e.isCanceled || n.update(p.LoadError({ msg: "Failed to load" }));
          }),
          (n.promiseCache.loading = r);
      };
    },
    g = function(e) {
      e.promiseCache.buffering.cancel();
    },
    m = /*#__PURE__*/ (function(t) {
      var n, r;
      function o(e) {
        var n;
        return (
          ((n = t.call(this, e) || this).promiseCache = {}),
          (n.initialState = f.NotAsked()),
          (n.state = n.initialState),
          (n.update = n.update.bind(
            (function(e) {
              if (void 0 === e)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return e;
            })(n)
          )),
          n
        );
      }
      (r = t),
        ((n = o).prototype = Object.create(r.prototype)),
        (n.prototype.constructor = n),
        c(n, r),
        (o.reducer = function(e, t, n) {
          return p.match(e, {
            ViewChanged: function(e) {
              return !0 === e.inView
                ? n.src
                  ? f.match(t, {
                      NotAsked: function() {
                        return n.debounceDurationMs
                          ? {
                              nextState: f.Buffering(),
                              cmd:
                                ((e = n.debounceDurationMs),
                                function(t) {
                                  var n = L(S(e));
                                  n.promise
                                    .then(function() {
                                      return t.update(p.BufferingEnded());
                                    })
                                    .catch(function(e) {}),
                                    (t.promiseCache.buffering = n);
                                })
                            }
                          : {
                              nextState: f.Loading(),
                              cmd: l(n, n.experimentalDecode)
                            };
                        var e;
                      },
                      default: function() {
                        return { nextState: t };
                      }
                    })
                  : { nextState: f.LoadSuccess() }
                : f.match(t, {
                    Buffering: function() {
                      return { nextState: f.NotAsked(), cmd: g };
                    },
                    default: function() {
                      return { nextState: t };
                    }
                  });
            },
            BufferingEnded: function() {
              return {
                nextState: f.Loading(),
                cmd: l(n, n.experimentalDecode)
              };
            },
            LoadSuccess: function() {
              return { nextState: f.LoadSuccess() };
            },
            LoadError: function(e) {
              return { nextState: f.LoadError(e) };
            }
          });
        });
      var s = o.prototype;
      return (
        (s.update = function(e) {
          var t = this,
            n = o.reducer(e, this.state, this.props),
            r = n.nextState,
            a = n.cmd;
          this.props.debugActions &&
            ("production" === process.env.NODE_ENV &&
              console.warn(
                'You are running LazyImage with debugActions="true" in production. This might have performance implications.'
              ),
            console.log({ action: e, prevState: this.state, nextState: r })),
            this.setState(r, function() {
              return a && a(t);
            });
        }),
        (s.componentWillUnmount = function() {
          this.promiseCache.loading && this.promiseCache.loading.cancel(),
            this.promiseCache.buffering && this.promiseCache.buffering.cancel(),
            (this.promiseCache = {});
        }),
        (s.render = function() {
          var t = this,
            n = this.props,
            r = n.children,
            o = n.loadEagerly,
            c = n.observerProps,
            s = u(n, d);
          return o
            ? r({ imageState: f.LoadSuccess().tag, imageProps: s })
            : a.default.createElement(
                i.default,
                Object.assign({ rootMargin: "50px 0px", threshold: 0.01 }, c, {
                  onChange: function(e) {
                    return t.update(p.ViewChanged({ inView: e }));
                  }
                }),
                function(n) {
                  return r({
                    imageState:
                      "Buffering" === t.state.tag
                        ? e.ImageState.Loading
                        : t.state.tag,
                    imageProps: s,
                    ref: n.ref
                  });
                }
              );
        }),
        o
      );
    })(a.default.Component);
  m.displayName = "LazyImageFull";
  var h = function(e, t) {
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
    S = function(e) {
      return new Promise(function(t) {
        return setTimeout(t, e);
      });
    },
    L = function(e) {
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
    b = ["actual", "placeholder", "loading", "error"],
    v = function(t) {
      var n = t.actual,
        r = t.placeholder,
        o = t.loading,
        i = t.error,
        c = u(t, b);
      return a.default.createElement(m, Object.assign({}, c), function(t) {
        var a = t.imageProps,
          c = t.ref;
        switch (t.imageState) {
          case e.ImageState.NotAsked:
            return !!r && r({ imageProps: a, ref: c });
          case e.ImageState.Loading:
            return o ? o() : !!r && r({ imageProps: a, ref: c });
          case e.ImageState.LoadSuccess:
            return n({ imageProps: a });
          case e.ImageState.LoadError:
            return i ? i() : n({ imageProps: a });
        }
      });
    };
  (v.displayName = "LazyImage"), (e.LazyImage = v), (e.LazyImageFull = m);
});
//# sourceMappingURL=react-lazy-images.umd.js.map
