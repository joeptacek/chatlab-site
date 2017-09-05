var at_top = true;

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
