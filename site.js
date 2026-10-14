/* ===================================================================
   Carole Bègue — interactions
   =================================================================== */
(function () {
  "use strict";

  /* ---- Year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Nav: solid on scroll + mobile toggle ---- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function onScroll() {
    if (window.scrollY > 60) nav.classList.add("is-solid");
    else nav.classList.remove("is-solid");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    nav.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    navLinks.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(
    ".about__text, .about__stats, .work__head, .project, .contact__intro, .contact__cards"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Before / after sliders ---- */
  document.querySelectorAll(".ba").forEach(function (ba) {
    var before = ba.querySelector(".ba__before");
    var beforeImg = before.querySelector("img");
    var handle = ba.querySelector(".ba__handle");
    var range = ba.querySelector(".ba__range");

    function sync() {
      var pct = range.value;
      before.style.width = pct + "%";
      handle.style.left = pct + "%";
      // keep the before image aligned to the full frame width
      beforeImg.style.width = ba.clientWidth + "px";
    }
    range.addEventListener("input", sync);
    window.addEventListener("resize", sync);
    sync();
  });

  /* ---- Lightbox ---- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    var el = items[current];
    lbImg.src = el.getAttribute("href");
    lbImg.alt = el.querySelector("img").alt;
    lbCap.textContent = el.getAttribute("data-caption") || "";
  }
  function open(i) {
    show(i);
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  items.forEach(function (el, i) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      open(i);
    });
  });
  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbPrev").addEventListener("click", function () { show(current - 1); });
  document.getElementById("lbNext").addEventListener("click", function () { show(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });
})();
