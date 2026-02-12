!(function () {
  var a,
    o,
    s,
    d,
    t,
    n,
    e,
    i,
    l,
    r,
    m,
    c,
    u = document.querySelector(".navbar-menu").innerHTML,
    g = 7,
    b = "en",
    y = localStorage.getItem("language");
  function p() {
    E(null === y ? b : y);
    var e = document.getElementsByClassName("language");
    e &&
      Array.from(e).forEach(function (t) {
        t.addEventListener("click", function (e) {
          E(t.getAttribute("data-lang"));
        });
      });
  }
  function E(e) {
    document.getElementById("header-lang-img") &&
      ("en" == e
        ? (document.getElementById("header-lang-img").src =
            "assets/images/flags/us.svg")
        : "sp" == e
          ? (document.getElementById("header-lang-img").src =
              "assets/images/flags/spain.svg")
          : "gr" == e
            ? (document.getElementById("header-lang-img").src =
                "assets/images/flags/germany.svg")
            : "it" == e
              ? (document.getElementById("header-lang-img").src =
                  "assets/images/flags/italy.svg")
              : "ru" == e
                ? (document.getElementById("header-lang-img").src =
                    "assets/images/flags/russia.svg")
                : "ch" == e
                  ? (document.getElementById("header-lang-img").src =
                      "assets/images/flags/china.svg")
                  : "fr" == e
                    ? (document.getElementById("header-lang-img").src =
                        "assets/images/flags/french.svg")
                    : "ar" == e &&
                      (document.getElementById("header-lang-img").src =
                        "assets/images/flags/ae.svg"),
      localStorage.setItem("language", e),
      null == (y = localStorage.getItem("language")) && E(b),
      (e = new XMLHttpRequest()).open("GET", "assets/lang/" + y + ".json"),
      (e.onreadystatechange = function () {
        var a;
        4 === this.readyState &&
          200 === this.status &&
          ((a = JSON.parse(this.responseText)),
          Object.keys(a).forEach(function (t) {
            var e = document.querySelectorAll("[data-key='" + t + "']");
            Array.from(e).forEach(function (e) {
              e.textContent = a[t];
            });
          }));
      }),
      e.send());
  }
  function f() {
    var e;
    document.querySelectorAll(".navbar-nav .collapse") &&
      ((e = document.querySelectorAll(".navbar-nav .collapse")),
      Array.from(e).forEach(function (t) {
        var a = new bootstrap.Collapse(t, { toggle: !1 });
        (t.addEventListener("show.bs.collapse", function (e) {
          e.stopPropagation();
          var e = t.parentElement.closest(".collapse");
          e
            ? ((e = e.querySelectorAll(".collapse")),
              Array.from(e).forEach(function (e) {
                e = bootstrap.Collapse.getInstance(e);
                e !== a && e.hide();
              }))
            : ((e = (function (e) {
                for (var t = [], a = e.parentNode.firstChild; a; )
                  (1 === a.nodeType && a !== e && t.push(a),
                    (a = a.nextSibling));
                return t;
              })(t.parentElement)),
              Array.from(e).forEach(function (e) {
                2 < e.childNodes.length &&
                  e.firstElementChild.setAttribute("aria-expanded", "false");
                e = e.querySelectorAll("*[id]");
                Array.from(e).forEach(function (e) {
                  (e.classList.remove("show"),
                    2 < e.childNodes.length &&
                      ((e = e.querySelectorAll("ul li a")),
                      Array.from(e).forEach(function (e) {
                        e.hasAttribute("aria-expanded") &&
                          e.setAttribute("aria-expanded", "false");
                      })));
                });
              }));
        }),
          t.addEventListener("hide.bs.collapse", function (e) {
            e.stopPropagation();
            e = t.querySelectorAll(".collapse");
            Array.from(e).forEach(function (e) {
              (childCollapseInstance =
                bootstrap.Collapse.getInstance(e)).hide();
            });
          }));
      }));
  }
  function h() {
    var o,
      e = document.documentElement.getAttribute("data-layout"),
      t = sessionStorage.getItem("defaultAttribute"),
      t = JSON.parse(t);
    !t ||
      ("twocolumn" != e && "twocolumn" != t["data-layout"]) ||
      (document.querySelector(".navbar-menu") &&
        (document.querySelector(".navbar-menu").innerHTML = u),
      ((o = document.createElement("ul")).innerHTML =
        '<a href="#" class="logo"><img src="assets/images/logo-sm.png" alt="" height="22"></a>'),
      Array.from(
        document.getElementById("navbar-nav").querySelectorAll(".menu-link"),
      ).forEach(function (e) {
        o.className = "twocolumn-iconview";
        var t = document.createElement("li"),
          a = e;
        (a.querySelectorAll("span").forEach(function (e) {
          e.classList.add("d-none");
        }),
          e.parentElement.classList.contains("twocolumn-item-show") &&
            e.classList.add("active"),
          t.appendChild(a),
          o.appendChild(t),
          a.classList.contains("nav-link") &&
            a.classList.replace("nav-link", "nav-icon"),
          a.classList.remove("collapsed", "menu-link"));
      }),
      (e = (e =
        "/" == location.pathname
          ? "index.html"
          : location.pathname.substring(1)).substring(
        e.lastIndexOf("/") + 1,
      )) &&
        (t = document
          .getElementById("navbar-nav")
          .querySelector('[href="' + e + '"]')) &&
        (e = t.closest(".collapse.menu-dropdown")) &&
        (e.classList.add("show"),
        e.parentElement.children[0].classList.add("active"),
        e.parentElement.children[0].setAttribute("aria-expanded", "true"),
        e.parentElement.closest(".collapse.menu-dropdown")) &&
        (e.parentElement.closest(".collapse").classList.add("show"),
        e.parentElement.closest(".collapse").previousElementSibling &&
          e.parentElement
            .closest(".collapse")
            .previousElementSibling.classList.add("active"),
        e.parentElement.parentElement.parentElement.parentElement.closest(
          ".collapse.menu-dropdown",
        )) &&
        (e.parentElement.parentElement.parentElement.parentElement
          .closest(".collapse")
          .classList.add("show"),
        e.parentElement.parentElement.parentElement.parentElement.closest(
          ".collapse",
        ).previousElementSibling) &&
        e.parentElement.parentElement.parentElement.parentElement
          .closest(".collapse")
          .previousElementSibling.classList.add("active"),
      (document.getElementById("two-column-menu").innerHTML = o.outerHTML),
      Array.from(
        document.querySelector("#two-column-menu ul").querySelectorAll("li a"),
      ).forEach(function (a) {
        var o = (o =
          "/" == location.pathname
            ? "index.html"
            : location.pathname.substring(1)).substring(o.lastIndexOf("/") + 1);
        (a.addEventListener("click", function (e) {
          var t;
          ((o != "/" + a.getAttribute("href") ||
            a.getAttribute("data-bs-toggle")) &&
            document.body.classList.contains("twocolumn-panel") &&
            document.body.classList.remove("twocolumn-panel"),
            document
              .getElementById("navbar-nav")
              .classList.remove("twocolumn-nav-hide"),
            document.querySelector(".hamburger-icon").classList.remove("open"),
            ((e.target && e.target.matches("a.nav-icon")) ||
              (e.target && e.target.matches("i"))) &&
              (null !==
                document.querySelector(
                  "#two-column-menu ul .nav-icon.active",
                ) &&
                document
                  .querySelector("#two-column-menu ul .nav-icon.active")
                  .classList.remove("active"),
              (e.target.matches("i")
                ? e.target.closest("a")
                : e.target
              ).classList.add("active"),
              0 <
                (t = document.getElementsByClassName("twocolumn-item-show"))
                  .length && t[0].classList.remove("twocolumn-item-show"),
              (t = (e.target.matches("i") ? e.target.closest("a") : e.target)
                .getAttribute("href")
                .slice(1)),
              document.getElementById(t)) &&
              document
                .getElementById(t)
                .parentElement.classList.add("twocolumn-item-show"));
        }),
          o != "/" + a.getAttribute("href") ||
            a.getAttribute("data-bs-toggle") ||
            (a.classList.add("active"),
            document
              .getElementById("navbar-nav")
              .classList.add("twocolumn-nav-hide"),
            document.querySelector(".hamburger-icon") &&
              document.querySelector(".hamburger-icon").classList.add("open")));
      }),
      "horizontal" !== document.documentElement.getAttribute("data-layout") &&
        ((t = new SimpleBar(document.getElementById("navbar-nav"))) &&
          t.getContentElement(),
        (e = new SimpleBar(
          document.getElementsByClassName("twocolumn-iconview")[0],
        ))) &&
        e.getContentElement());
  }
  function v(e) {
    if (e) {
      var t = e.offsetTop,
        a = e.offsetLeft,
        o = e.offsetWidth,
        n = e.offsetHeight;
      if (e.offsetParent)
        for (; e.offsetParent; )
          ((t += (e = e.offsetParent).offsetTop), (a += e.offsetLeft));
      return (
        t >= window.pageYOffset &&
        a >= window.pageXOffset &&
        t + n <= window.pageYOffset + window.innerHeight &&
        a + o <= window.pageXOffset + window.innerWidth
      );
    }
  }
  function S() {
    ("vertical" == document.documentElement.getAttribute("data-layout") &&
      ((document.getElementById("two-column-menu").innerHTML = ""),
      document.querySelector(".navbar-menu") &&
        (document.querySelector(".navbar-menu").innerHTML = u),
      document.getElementById("scrollbar").setAttribute("data-simplebar", ""),
      document.getElementById("navbar-nav").setAttribute("data-simplebar", ""),
      document.getElementById("scrollbar").classList.add("h-100")),
      "twocolumn" == document.documentElement.getAttribute("data-layout") &&
        (document.getElementById("scrollbar").removeAttribute("data-simplebar"),
        document.getElementById("scrollbar").classList.remove("h-100")),
      "horizontal" == document.documentElement.getAttribute("data-layout") &&
        B());
  }
  function I() {
    feather.replace();
    var e = document.documentElement.clientWidth,
      e =
        (e < 1025 && 767 < e
          ? (document.body.classList.remove("twocolumn-panel"),
            "twocolumn" == sessionStorage.getItem("data-layout") &&
              (document.documentElement.setAttribute(
                "data-layout",
                "twocolumn",
              ),
              document.getElementById("customizer-layout03") &&
                document.getElementById("customizer-layout03").click(),
              h(),
              A(),
              f()),
            "vertical" == sessionStorage.getItem("data-layout") &&
              document.documentElement.setAttribute("data-sidebar-size", "sm"),
            document.querySelector(".hamburger-icon") &&
              document.querySelector(".hamburger-icon").classList.add("open"))
          : 1025 <= e
            ? (document.body.classList.remove("twocolumn-panel"),
              "twocolumn" == sessionStorage.getItem("data-layout") &&
                (document.documentElement.setAttribute(
                  "data-layout",
                  "twocolumn",
                ),
                document.getElementById("customizer-layout03") &&
                  document.getElementById("customizer-layout03").click(),
                h(),
                A(),
                f()),
              "vertical" == sessionStorage.getItem("data-layout") &&
                document.documentElement.setAttribute(
                  "data-sidebar-size",
                  sessionStorage.getItem("data-sidebar-size"),
                ),
              document.querySelector(".hamburger-icon") &&
                document
                  .querySelector(".hamburger-icon")
                  .classList.remove("open"))
            : e <= 767 &&
              (document.body.classList.remove("vertical-sidebar-enable"),
              document.body.classList.add("twocolumn-panel"),
              "twocolumn" == sessionStorage.getItem("data-layout") &&
                (document.documentElement.setAttribute(
                  "data-layout",
                  "vertical",
                ),
                k("vertical"),
                f()),
              "horizontal" != sessionStorage.getItem("data-layout") &&
                document.documentElement.setAttribute(
                  "data-sidebar-size",
                  "lg",
                ),
              document.querySelector(".hamburger-icon")) &&
              document.querySelector(".hamburger-icon").classList.add("open"),
        document.querySelectorAll("#navbar-nav > li.nav-item"));
    Array.from(e).forEach(function (e) {
      (e.addEventListener("click", w.bind(this), !1),
        e.addEventListener("mouseover", w.bind(this), !1));
    });
  }
  function w(e) {
    if (e.target && e.target.matches("a.nav-link span"))
      if (0 == v(e.target.parentElement.nextElementSibling)) {
        (e.target.parentElement.nextElementSibling.classList.add(
          "dropdown-custom-right",
        ),
          e.target.parentElement.parentElement.parentElement.parentElement.classList.add(
            "dropdown-custom-right",
          ));
        var t = e.target.parentElement.nextElementSibling;
        Array.from(t.querySelectorAll(".menu-dropdown")).forEach(function (e) {
          e.classList.add("dropdown-custom-right");
        });
      } else if (
        1 == v(e.target.parentElement.nextElementSibling) &&
        1848 <= window.innerWidth
      )
        for (
          var a = document.getElementsByClassName("dropdown-custom-right");
          0 < a.length;
        )
          a[0].classList.remove("dropdown-custom-right");
    if (e.target && e.target.matches("a.nav-link"))
      if (0 == v(e.target.nextElementSibling)) {
        (e.target.nextElementSibling.classList.add("dropdown-custom-right"),
          e.target.parentElement.parentElement.parentElement.classList.add(
            "dropdown-custom-right",
          ));
        t = e.target.nextElementSibling;
        Array.from(t.querySelectorAll(".menu-dropdown")).forEach(function (e) {
          e.classList.add("dropdown-custom-right");
        });
      } else if (
        1 == v(e.target.nextElementSibling) &&
        1848 <= window.innerWidth
      )
        for (
          a = document.getElementsByClassName("dropdown-custom-right");
          0 < a.length;
        )
          a[0].classList.remove("dropdown-custom-right");
  }
  function M() {
    var e = document.documentElement.clientWidth;
    (767 < e &&
      document.querySelector(".hamburger-icon").classList.toggle("open"),
      "horizontal" === document.documentElement.getAttribute("data-layout") &&
        (document.body.classList.contains("menu")
          ? document.body.classList.remove("menu")
          : document.body.classList.add("menu")),
      "vertical" === document.documentElement.getAttribute("data-layout") &&
        (e < 1025 && 767 < e
          ? (document.body.classList.remove("vertical-sidebar-enable"),
            "sm" == document.documentElement.getAttribute("data-sidebar-size")
              ? document.documentElement.setAttribute("data-sidebar-size", "")
              : document.documentElement.setAttribute(
                  "data-sidebar-size",
                  "sm",
                ))
          : 1025 < e
            ? (document.body.classList.remove("vertical-sidebar-enable"),
              "lg" == document.documentElement.getAttribute("data-sidebar-size")
                ? document.documentElement.setAttribute(
                    "data-sidebar-size",
                    "sm",
                  )
                : document.documentElement.setAttribute(
                    "data-sidebar-size",
                    "lg",
                  ))
            : e <= 767 &&
              (document.body.classList.add("vertical-sidebar-enable"),
              document.documentElement.setAttribute(
                "data-sidebar-size",
                "lg",
              ))),
      "twocolumn" == document.documentElement.getAttribute("data-layout") &&
        (document.body.classList.contains("twocolumn-panel")
          ? document.body.classList.remove("twocolumn-panel")
          : document.body.classList.add("twocolumn-panel")));
  }
  function O() {
    (document.addEventListener("DOMContentLoaded", function () {
      var e = document.getElementsByClassName("code-switcher");
      (Array.from(e).forEach(function (a) {
        a.addEventListener("change", function () {
          var e = a.closest(".card"),
            t = e.querySelector(".live-preview"),
            e = e.querySelector(".code-view");
          a.checked
            ? (t.classList.add("d-none"), e.classList.remove("d-none"))
            : (t.classList.remove("d-none"), e.classList.add("d-none"));
        });
      }),
        feather.replace());
    }),
      window.addEventListener("resize", I),
      I(),
      Waves.init(),
      document.addEventListener("scroll", function () {
        var e;
        (e = document.getElementById("page-topbar")) &&
          (50 <= document.body.scrollTop ||
          50 <= document.documentElement.scrollTop
            ? e.classList.add("topbar-shadow")
            : e.classList.remove("topbar-shadow"));
      }),
      window.addEventListener("load", function () {
        var e;
        (("twocolumn" == document.documentElement.getAttribute("data-layout")
          ? A
          : L)(),
          (e = document.getElementsByClassName("vertical-overlay")) &&
            Array.from(e).forEach(function (e) {
              e.addEventListener("click", function () {
                (document.body.classList.remove("vertical-sidebar-enable"),
                  "twocolumn" == sessionStorage.getItem("data-layout")
                    ? document.body.classList.add("twocolumn-panel")
                    : document.documentElement.setAttribute(
                        "data-sidebar-size",
                        sessionStorage.getItem("data-sidebar-size"),
                      ));
              });
            }),
          q());
      }),
      document.getElementById("topnav-hamburger-icon") &&
        document
          .getElementById("topnav-hamburger-icon")
          .addEventListener("click", M));
    var e = sessionStorage.getItem("defaultAttribute"),
      e = JSON.parse(e),
      t = document.documentElement.clientWidth;
    "twocolumn" == e["data-layout"] &&
      t < 767 &&
      Array.from(
        document.getElementById("two-column-menu").querySelectorAll("li"),
      ).forEach(function (e) {
        e.addEventListener("click", function (e) {
          document.body.classList.remove("twocolumn-panel");
        });
      });
  }
  function A() {
    feather.replace();
    var e,
      t,
      a =
        "/" == location.pathname
          ? "index.html"
          : location.pathname.substring(1);
    (a = a.substring(a.lastIndexOf("/") + 1)) &&
      ("twocolumn-panel" == document.body.className &&
        document
          .getElementById("two-column-menu")
          .querySelector('[href="' + a + '"]')
          .classList.add("active"),
      (a = document
        .getElementById("navbar-nav")
        .querySelector('[href="' + a + '"]'))
        ? (a.classList.add("active"),
          (t = (
            (e = a.closest(".collapse.menu-dropdown")) &&
            e.parentElement.closest(".collapse.menu-dropdown")
              ? (e.classList.add("show"),
                e.parentElement.children[0].classList.add("active"),
                e.parentElement
                  .closest(".collapse.menu-dropdown")
                  .parentElement.classList.add("twocolumn-item-show"),
                e.parentElement.parentElement.parentElement.parentElement.closest(
                  ".collapse.menu-dropdown",
                ) &&
                  ((t =
                    e.parentElement.parentElement.parentElement.parentElement
                      .closest(".collapse.menu-dropdown")
                      .getAttribute("id")),
                  e.parentElement.parentElement.parentElement.parentElement
                    .closest(".collapse.menu-dropdown")
                    .parentElement.classList.add("twocolumn-item-show"),
                  e.parentElement
                    .closest(".collapse.menu-dropdown")
                    .parentElement.classList.remove("twocolumn-item-show"),
                  document
                    .getElementById("two-column-menu")
                    .querySelector('[href="#' + t + '"]')) &&
                  document
                    .getElementById("two-column-menu")
                    .querySelector('[href="#' + t + '"]')
                    .classList.add("active"),
                e.parentElement.closest(".collapse.menu-dropdown"))
              : (a
                  .closest(".collapse.menu-dropdown")
                  .parentElement.classList.add("twocolumn-item-show"),
                e)
          ).getAttribute("id")),
          document
            .getElementById("two-column-menu")
            .querySelector('[href="#' + t + '"]') &&
            document
              .getElementById("two-column-menu")
              .querySelector('[href="#' + t + '"]')
              .classList.add("active"))
        : document.body.classList.add("twocolumn-panel"));
  }
  function L() {
    var e =
      "/" == location.pathname ? "index.html" : location.pathname.substring(1);
    (e = e.substring(e.lastIndexOf("/") + 1)) &&
      (e = document
        .getElementById("navbar-nav")
        .querySelector('[href="' + e + '"]')) &&
      (e.classList.add("active"), (e = e.closest(".collapse.menu-dropdown"))) &&
      (e.classList.add("show"),
      e.parentElement.children[0].classList.add("active"),
      e.parentElement.children[0].setAttribute("aria-expanded", "true"),
      e.parentElement.closest(".collapse.menu-dropdown")) &&
      (e.parentElement.closest(".collapse").classList.add("show"),
      e.parentElement.closest(".collapse").previousElementSibling &&
        e.parentElement
          .closest(".collapse")
          .previousElementSibling.classList.add("active"),
      e.parentElement.parentElement.parentElement.parentElement.closest(
        ".collapse.menu-dropdown",
      )) &&
      (e.parentElement.parentElement.parentElement.parentElement
        .closest(".collapse")
        .classList.add("show"),
      e.parentElement.parentElement.parentElement.parentElement.closest(
        ".collapse",
      ).previousElementSibling) &&
      (e.parentElement.parentElement.parentElement.parentElement
        .closest(".collapse")
        .previousElementSibling.classList.add("active"),
      "horizontal" == document.documentElement.getAttribute("data-layout")) &&
      e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.closest(
        ".collapse",
      ) &&
      e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
        .closest(".collapse")
        .previousElementSibling.classList.add("active");
  }
  function v(e) {
    if (e) {
      var t = e.offsetTop,
        a = e.offsetLeft,
        o = e.offsetWidth,
        n = e.offsetHeight;
      if (e.offsetParent)
        for (; e.offsetParent; )
          ((t += (e = e.offsetParent).offsetTop), (a += e.offsetLeft));
      return (
        t >= window.pageYOffset &&
        a >= window.pageXOffset &&
        t + n <= window.pageYOffset + window.innerHeight &&
        a + o <= window.pageXOffset + window.innerWidth
      );
    }
  }
  function D() {
    var e = document.querySelectorAll(".counter-value");
    function s(e) {
      return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    e &&
      Array.from(e).forEach(function (n) {
        !(function e() {
          var t = +n.getAttribute("data-target"),
            a = +n.innerText,
            o = t / 250;
          (o < 1 && (o = 1),
            a < t
              ? ((n.innerText = (a + o).toFixed(0)), setTimeout(e, 1))
              : (n.innerText = s(t)),
            s(n.innerText));
        })();
      });
  }
  function B() {
    ((document.getElementById("two-column-menu").innerHTML = ""),
      document.querySelector(".navbar-menu") &&
        (document.querySelector(".navbar-menu").innerHTML = u),
      document.getElementById("scrollbar").removeAttribute("data-simplebar"),
      document.getElementById("navbar-nav").removeAttribute("data-simplebar"),
      document.getElementById("scrollbar").classList.remove("h-100"));
    var a = g,
      o = document.querySelectorAll("ul.navbar-nav > li.nav-item"),
      n = "",
      s = "";
    Array.from(o).forEach(function (e, t) {
      (t + 1 === a && (s = e),
        a < t + 1 && ((n += e.outerHTML), e.remove()),
        t + 1 === o.length &&
          s.insertAdjacentHTML &&
          s.insertAdjacentHTML(
            "afterend",
            '<li class="nav-item">\t\t\t\t\t\t<a class="nav-link" href="#sidebarMore" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarMore">\t\t\t\t\t\t\t<i class="ri-briefcase-2-line"></i> More\t\t\t\t\t\t</a>\t\t\t\t\t\t<div class="collapse menu-dropdown" id="sidebarMore"><ul class="nav nav-sm flex-column">' +
              n +
              "</ul></div>\t\t\t\t\t</li>",
          ));
    });
  }
  
})();