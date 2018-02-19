// classList doesn't work in ie < 10

// DOM manipulation OK here because this isn't executed until immediately before final </body>

// Stuff that happens on scroll (nav-page sticky, nav-page-jumpup lowered)
var navPage = document.getElementById("nav-page");
var navPageJumpUp = document.getElementById("nav-page-jumpup");
var atTop = true;

// TODO: TRIGGER BASED ON POSITION OF ELEMENT NOT PAGE

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

// if there are any toggle panels
if (togglePanels = document.getElementsByClassName("toggle-panel")) {
  // event handlers for different tp-types
  var opening, clickedButton, localToggleTarget, toggleCount;
  var drawerIncrementalToggleMax = 10;
  var drawerIncrementalInitVisible = 3;
  function toggleMenu() {
    clickedButton = this;
    clickedButton.blur(); // get rid of css button outline the accesible way
    localToggleTarget = clickedButton.parentNode.getElementsByClassName("toggle-target")[0]; // if multiple toggle-targets, will only grab the first one

    opening = localToggleTarget.classList.contains("tp-no-display");
    localToggleTarget.classList.toggle("tp-no-display");
    if (opening) {
      clickedButton.getElementsByTagName("use")[0].setAttribute("xlink:href", "#icon-close");
    } else {
      // closing
      clickedButton.getElementsByTagName("use")[0].setAttribute("xlink:href", "#icon-menu");
    }
  }

  function toggleDrawer() {
    clickedButton = this;
    clickedButton.blur(); // get rid of css button outline the accesible way
    localToggleTarget = clickedButton.parentNode.getElementsByClassName("toggle-target")[0]; // if multiple toggle-targets, will only grab the first one

    opening = localToggleTarget.classList.contains("tp-no-display");
    localToggleTarget.classList.toggle("tp-no-display");
    if (opening) {
      clickedButton.getElementsByTagName("use")[0].setAttribute("xlink:href", "#icon-chevron-up");
    } else {
      // closing
      clickedButton.getElementsByTagName("use")[0].setAttribute("xlink:href", "#icon-chevron-down");
    }
  }

  function toggleDrawerIncremental() {
    clickedButton = this;
    clickedButton.blur(); // get rid of css button outline the accesible way
    localToggleTarget = clickedButton.parentNode.getElementsByClassName("toggle-target")[0]; // if multiple toggle-targets, will only grab the first one
    drawerItems = localToggleTarget.children;
    toggleCount = 0;
    for (var i = drawerIncrementalInitVisible; i < drawerItems.length; i++) {
      thisDrawerItem = drawerItems[i];
      if (thisDrawerItem.classList.contains("tp-no-display")) {
        if (toggleCount < drawerIncrementalToggleMax) {
          thisDrawerItem.classList.remove("tp-no-display");
          toggleCount++;
          if (i == drawerItems.length - 1) {
            // just toggled on final drawer drawer
            clickedButton.classList.add("no-display"); // not tp-no-display (otherwise will display: block at non-mobile breakpoints if toggle-panel is tp-mobile-only)
            localToggleTarget.classList.remove("tp-target-partial");
            break;
          }
        } else {
          break;
        }
      }
    }
  }

  // add buttons (button > svg > use) to toggle-panels based on tp-type
  var newButton, newSVG, newUse, thisTogglePanel, thisToggleTarget, drawerItems, thisDrawerItem;
  var svgns = "http://www.w3.org/2000/svg";
  var xlinkns = "http://www.w3.org/1999/xlink";
  for (var i = 0; i < togglePanels.length; i++) {
    thisTogglePanel = togglePanels[i];
    thisToggleTarget = thisTogglePanel.getElementsByClassName("toggle-target")[0]; // if multiple toggle-targets, will only grab the first one

    // only add buttons etc. if toggle-panel has a toggle-target (not the case for page nav when sections <= 1)
    if (thisToggleTarget) {
      newButton = document.createElement("button");
      newButton.setAttribute("type", "button");

      newSVG = document.createElementNS(svgns, "svg"); // need to use createElementNS for SVG elements
      newButton.appendChild(newSVG);

      newUse = document.createElementNS(svgns, "use");

      // add event handler / initialize tp state according to tp-type
      if (thisTogglePanel.classList.contains("tp-type-menu")) {
        newButton.addEventListener("click", toggleMenu);

        // initialize tp state
        newUse.setAttributeNS(xlinkns, "xlink:href", "#icon-menu"); // need to use setAttributeNS for xlink attributes
        thisToggleTarget.classList.toggle("tp-no-display");

      } else if (thisTogglePanel.classList.contains("tp-type-drawer")) {
        newButton.addEventListener("click", toggleDrawer);

        // initialize tp state
        newUse.setAttributeNS(xlinkns, "xlink:href", "#icon-chevron-down");
        thisToggleTarget.classList.toggle("tp-no-display");

      } else if (thisTogglePanel.classList.contains("tp-type-drawer-incremental")) {
        newButton.addEventListener("click", toggleDrawerIncremental);

        // initialize tp state (add new function for drawer-incremental)
        newUse.setAttributeNS(xlinkns, "xlink:href", "#icon-chevron-down");
        thisToggleTarget.classList.add("tp-target-partial");
        drawerItems = thisToggleTarget.children;
        for (var j = drawerIncrementalInitVisible; j < drawerItems.length; j++) {
          thisDrawerItem = drawerItems[j];
          thisDrawerItem.classList.add("tp-no-display");
        }
      }

      newSVG.appendChild(newUse);
      thisTogglePanel.appendChild(newButton);
    }
  }
}

// Stuff for filtering
var filterButtons = document.getElementsByName("filter-button");
var allTargetElements = document.getElementsByClassName("filter-target");
if (filterButtons && allTargetElements) {
  // If page has at least one filter-button and filter-target
  var filterButton, targetClass;
  for (var i = 0; i < filterButtons.length; i++) {
    filterButton = filterButtons[i];
    filterButton.addEventListener("click", function () {
      // Filter target determined by the value of the button's "value" attribute (target a class, or for show-all, use "filter-button")
      targetClass = this.value;
      for (var j = 0; j < allTargetElements.length; j++) {
        if (allTargetElements[j].classList.contains(targetClass)) {
          allTargetElements[j].classList.remove("no-display");
        } else {
          allTargetElements[j].classList.add("no-display");
        }
      }
      this.blur();
    });
  }
}
