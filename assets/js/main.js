// grab elements
var navSiteLinks = document.getElementById("nav-site-links");
var navSiteToggleButton = document.getElementById("nav-site-toggle-button");
var navSiteToggleSVGUse = document.getElementById("nav-site-toggle-svg");
var navPageOuter = document.getElementById("nav-page-outer");
var navPageLinks = document.getElementById("nav-page-links");
var showPageLinksButton = document.getElementById("show-page-links-button");

// close menu on load (html without js displays open menu)
navSiteLinks.classList.add("menu-closed");
navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-menu");

// initialize booleans
var atTop = true;
var menuVisible = false;

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
    navSiteLinks.classList.remove("menu-closed");
    navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-close");
    menuVisible = true;
  } else {
    // if closing
    navSiteLinks.classList.add("menu-closed");
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

showPageLinksButton.addEventListener("click", function () {
  navPageOuter.classList.add("show-page-links");
});
