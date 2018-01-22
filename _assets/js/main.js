// DOM manipulation OK here because this isn't executed until immediately before final </body>

// Stuff that happens on scroll (nav-page sticky, nav-page-jumpup lowered)
var navPage = document.getElementById("nav-page");
var navPageJumpUp = document.getElementById("nav-page-jumpup");
var atTop = true;

window.addEventListener("scroll", function () {
  var scrollY = window.pageYOffset;

  if (atTop) {
    if (scrollY > 261) {
      atTop = false;
      // Only fires once when crossing from low to high
      navPage.classList.add("nav-page-fancy-fixed");
      navPageJumpUp.classList.add("nav-page-jumpup-lowered");
    }
  } else {
    if (scrollY < 262) {
      atTop = true;
      // Only fires once when crossing from high to low
      navPage.classList.remove("nav-page-fancy-fixed");
      navPageJumpUp.classList.remove("nav-page-jumpup-lowered");
    }
  }
});

// Stuff for showing / hiding SITE links
var navSiteLinks = document.getElementById("nav-site-links");
var navSiteToggleButton = document.getElementById("nav-site-toggle-button");
var navSiteToggleSVGUse = document.getElementById("nav-site-toggle-svg");

// Hide site links (html without js should show site links)
navSiteLinks.classList.add("hidden-def-flex-sm");
navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-menu");
var siteLinksVisible = false;

navSiteToggleButton.addEventListener("click", function () {
  if (!siteLinksVisible) {
    // Opening
    navSiteLinks.classList.remove("hidden-def-flex-sm");
    navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-close");
    siteLinksVisible = true;
  } else {
    // Closing
    navSiteLinks.classList.add("hidden-def-flex-sm");
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
  var navPageLinks = document.getElementById("nav-page-links");
  var navPageToggleButton = document.getElementById("nav-page-toggle-button");
  var navPageToggleSVGUse = document.getElementById("nav-page-toggle-svg")

  // Hide page links (html without js should show page links)
  navPageLinks.classList.add("hidden-def-flex-sm");
  navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-down");
  var pageLinksVisible = false;

  navPageToggleButton.addEventListener("click", function () {
    if (!pageLinksVisible) {
      // Opening
      navPageLinks.classList.remove("hidden-def-flex-sm");
      navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-up");
      pageLinksVisible = true;
    } else {
      // Closing
      navPageLinks.classList.add("hidden-def-flex-sm");
      navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-down");
      pageLinksVisible = false;
    }
    navPageToggleButton.blur();
  });
}
