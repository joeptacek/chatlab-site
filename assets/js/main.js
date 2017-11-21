// grab elements
var navSite = document.getElementById("nav-site");
var navSiteToggleButton = document.getElementById("nav-site-toggle-button");
var navSiteToggleSVGUse = document.getElementById("nav-site-toggle-svg");
var navPageOuter = document.getElementById("nav-page-outer");
var navPage = document.getElementById("nav-page");
var navPageToggleButton = document.getElementById("nav-page-toggle-button");
var navPageToggleSVGUse = document.getElementById("nav-page-toggle-svg")

// close menu on load (html without js displays open menu)
navSite.classList.add("nav-site-closed");
navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-menu");

// hide page links on load (html without js shows page links)
navPage.classList.add("nav-page-closed");
navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-down");

// initialize booleans
var atTop = true;
var menuVisible = false;
var pageLinksVisible = false;

window.addEventListener("scroll", function () {
  var scrollY = window.pageYOffset;

  if (atTop) {
    if (scrollY > 261) {
      atTop = false;
      // Only fires once when crossing from low to high
      navPageOuter.classList.add("scrolled");
    }
  } else {
    if (scrollY < 262) {
      atTop = true;
      // Only fires once when crossing from high to low
      navPageOuter.classList.remove("scrolled");
    }
  }
});

navSiteToggleButton.addEventListener("click", function () {
  if (!menuVisible) {
    // if opening
    navSite.classList.remove("nav-site-closed");
    navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-close");
    menuVisible = true;
  } else {
    // if closing
    navSite.classList.add("nav-site-closed");
    navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-menu");
    menuVisible = false;
  }

  // After button click, button element gains focus and glows via CSS outline
  // property (looks weird). For accesibility, it's not a good idea to do
  // button:focus { outline: none; }. Instead, just blur immediately after
  // click event. Outline still visible when you :focus the button in other ways
  // (e.g., with tab).
  navSiteToggleButton.blur();
});

navPageToggleButton.addEventListener("click", function () {
  if (!pageLinksVisible) {
    navPage.classList.remove("nav-page-closed");
    navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-up");
    pageLinksVisible = true;
  } else {
    navPage.classList.add("nav-page-closed");
    navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-down");
    pageLinksVisible = false;
  }
  navPageToggleButton.blur();
});
