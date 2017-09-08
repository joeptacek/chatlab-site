document.getElementById("nav-site-main").classList.add("hidden");

var atTop = true;
var menuVisible = false;
var navSiteToggleButton = document.getElementById("nav-site-toggle-button");
var navSiteMain = document.getElementById("nav-site-main");
var navPage = document.getElementById("nav-page");

window.addEventListener("scroll", function () {
  var scrollY = window.pageYOffset;

  if (atTop) {
    if (scrollY > 227) {
      atTop = false;
      // Only fires once when crossing from low to high
      navPage.classList.add("scrolled");
    }
  } else {
    if (scrollY < 228) {
      atTop = true;
      // Only fires once when crossing from high to low
      navPage.classList.remove("scrolled");
    }
  }
});

navSiteToggleButton.addEventListener("click", function () {
  if (menuVisible) {
    menuVisible = false;
    navSiteMain.classList.add("hidden")
  } else {
    menuVisible = true;
    navSiteMain.classList.remove("hidden")
  }

  // After button click, button element gains focus and glows via CSS outline
  // property (looks weird). For accesibility, it's not a good idea to do
  // button:focus { outline: none; }. Instead, just blur immediately after
  // click event. Outline still visible when you :focus the button in other ways
  // (e.g., with tab).
  navSiteToggleButton.blur();
});

window.addEventListener("keypress", function (e) {
  switch (e.key) {
    case "j":
      console.log("j");
      increaseImgs();
      break;
    case "k":
      console.log("k");
      break;
  }
});
