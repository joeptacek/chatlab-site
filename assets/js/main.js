document.getElementById("nav-site-main").classList.add("hidden");

var at_top = true;
var menu_visible = false;

window.addEventListener("scroll", function() {
  var scroll_Y = window.pageYOffset;

  if (at_top) {
    if (scroll_Y > 227) {
      at_top = false;
      // Only fires once when crossing from low to high
      document.getElementById("nav-page").classList.add("scrolled");
    }
  } else {
    if (scroll_Y < 228) {
      at_top = true;
      // Only fires once when crossing from high to low
      document.getElementById("nav-page").classList.remove("scrolled");
    }
  }
});

document.getElementById("nav-site-toggle-button").addEventListener("click", function() {
  if (menu_visible) {
    menu_visible = false;
    document.getElementById("nav-site-main").classList.add("hidden")
  } else {
    menu_visible = true;
    document.getElementById("nav-site-main").classList.remove("hidden")
  }
});
