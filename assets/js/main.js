document.getElementById("nav-site").classList.add("menu-closed");

var atTop = true;
var menuVisible = false;
var navSiteToggleButton = document.getElementById("nav-site-toggle-button");
var navSite = document.getElementById("nav-site");
var navPageOuter = document.getElementById("nav-page-outer");

window.addEventListener("scroll", function () {
  var scrollY = window.pageYOffset;
  console.log(scrollY);

  if (atTop) {
    if (scrollY > 229) {
      atTop = false;
      // Only fires once when crossing from low to high
      navPageOuter.classList.add("scrolled");
    }
  } else {
    if (scrollY < 230) {
      atTop = true;
      // Only fires once when crossing from high to low
      navPageOuter.classList.remove("scrolled");
    }
  }
});

navSiteToggleButton.addEventListener("click", function () {
  if (menuVisible) {
    menuVisible = false;
    navSite.classList.add("menu-closed");
  } else {
    menuVisible = true;
    navSite.classList.remove("menu-closed");
  }

  // After button click, button element gains focus and glows via CSS outline
  // property (looks weird). For accesibility, it's not a good idea to do
  // button:focus { outline: none; }. Instead, just blur immediately after
  // click event. Outline still visible when you :focus the button in other ways
  // (e.g., with tab).
  navSiteToggleButton.blur();
});
