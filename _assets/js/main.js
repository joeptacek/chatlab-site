// Stuff for sticky page links nav
var navPage = document.getElementById("nav-page");
var atTop = true;

window.addEventListener("scroll", function () {
  var scrollY = window.pageYOffset;

  if (atTop) {
    if (scrollY > 261) {
      atTop = false;
      // Only fires once when crossing from low to high
      navPage.classList.add("scrolled");
    }
  } else {
    if (scrollY < 262) {
      atTop = true;
      // Only fires once when crossing from high to low
      navPage.classList.remove("scrolled");
    }
  }
});

// Stuff for showing / hiding SITE links
var navSite = document.getElementById("nav-site");
var navSiteToggleButton = document.getElementById("nav-site-toggle-button");
var navSiteToggleSVGUse = document.getElementById("nav-site-toggle-svg");

// Hide site links on load (html without js should show site links)
navSite.classList.add("nav-site-closed");
navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-menu");
var siteLinksVisible = false;

navSiteToggleButton.addEventListener("click", function () {
  if (!siteLinksVisible) {
    // Opening
    navSite.classList.remove("nav-site-closed");
    navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-close");
    siteLinksVisible = true;
  } else {
    // Closing
    navSite.classList.add("nav-site-closed");
    navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-menu");
    siteLinksVisible = false;
  }

  // After button click, button element gains focus and glows via CSS outline
  // property (looks weird). For accesibility, it's not a good idea to do
  // button:focus { outline: none; }. Instead, just blur immediately after
  // click event. Outline still visible when you :focus the button in other ways
  // (e.g., with tab).
  navSiteToggleButton.blur();
});

// Stuff for showing / hiding PAGE links
if (document.getElementById("nav-page-toggle-button")!=null) {
  var navPageMain = document.getElementById("nav-page-main");
  var navPageToggleButton = document.getElementById("nav-page-toggle-button");
  var navPageToggleSVGUse = document.getElementById("nav-page-toggle-svg")

  // Hide page links on load (html without js should show page links)
  navPageMain.classList.add("nav-page-closed");
  navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-down");
  var pageLinksVisible = false;

  navPageToggleButton.addEventListener("click", function () {
    if (!pageLinksVisible) {
      // Opening
      navPageMain.classList.remove("nav-page-closed");
      navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-up");
      pageLinksVisible = true;
    } else {
      // Closing
      navPageMain.classList.add("nav-page-closed");
      navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-down");
      pageLinksVisible = false;
    }
    navPageToggleButton.blur();
  });
}
