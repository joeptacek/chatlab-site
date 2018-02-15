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

// // Stuff for showing / hiding SITE links
// var navSiteLinks = document.getElementById("nav-site-links");
// var navSiteToggleButton = document.getElementById("nav-site-toggle-button");
// var navSiteToggleSVGUse = document.getElementById("nav-site-toggle-svg");
//
// // Hide site links (html without js should show site links)
// navSiteLinks.classList.add("no-display-only-mobile");
// navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-menu");
// var siteLinksVisible = false;
//
// navSiteToggleButton.addEventListener("click", function () {
//   if (!siteLinksVisible) {
//     // Opening
//     navSiteLinks.classList.remove("no-display-only-mobile");
//     navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-close");
//     siteLinksVisible = true;
//   } else {
//     // Closing
//     navSiteLinks.classList.add("no-display-only-mobile");
//     navSiteToggleSVGUse.setAttribute("xlink:href", "#icon-menu");
//     siteLinksVisible = false;
//   }
//
//   // After button click, button element gains focus and glows via CSS outline
//   // property (looks weird). For accesibility, it's not a good idea to do
//   // button:focus { outline: none; }. Instead, just blur immediately after
//   // click event. Outline still visible when you :focus the button in other ways
//   // (e.g., with tab).
//   this.blur();
// });

// Stuff for showing / hiding PAGE links
// var navPageToggleButton = document.getElementById("nav-page-toggle-button");
// if (navPageToggleButton) {
//   var navPageLinks = document.getElementById("nav-page-links");
//   var navPageToggleSVGUse = document.getElementById("nav-page-toggle-svg")
//
//   // Hide page links (html without js should show page links)
//   navPageLinks.classList.add("no-display-only-mobile");
//   navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-down");
//   var pageLinksVisible = false;
//
//   navPageToggleButton.addEventListener("click", function () {
//     if (!pageLinksVisible) {
//       // Opening
//       navPageLinks.classList.remove("no-display-only-mobile");
//       navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-up");
//       pageLinksVisible = true;
//     } else {
//       // Closing
//       navPageLinks.classList.add("no-display-only-mobile");
//       navPageToggleSVGUse.setAttribute("xlink:href", "#icon-chevron-down");
//       pageLinksVisible = false;
//     }
//     this.blur();
//   });
// }

// if there are any toggle panels
if (togglePanels = document.getElementsByClassName("toggle-panel")) {
  // event handler for toggle buttons
  // var thisToggleButton, buttonType, toggleTargets, sib, opening;
  // function toggleState() {
  //   thisToggleButton = this; // for functions used as event handlers `this` refers to the element the event was fired from (i.e., equivalent to passing `event` to function and using event.currentTarget)
  //
  //   // setup: gather local targets (siblings with class .toggle-target)
  //   // TODO: just grab first local target?
  //   toggleTargets = [];
  //   sib = thisToggleButton.parentNode.firstChild;
  //   do {
  //     // search button's siblings for every local toggle-target
  //     if (sib.nodeType == 1 && sib.classList.contains("toggle-target")) {
  //       // if sibling is an element type node (skip text nodes)
  //       toggleTargets.push(sib);
  //     }
  //   } while (sib = sib.nextSibling);
  //
  //   // do the toggle based on toggle type (button value) and current toggle state
  //   buttonType = thisToggleButton.value;
  //   for (var i = 0; i < toggleTargets.length; i++) {
  //     this.blur(); // get rid of css button outline the accesible way
  //
  //     // check current toggle state (for icon switching, below) and then toggle the state
  //     switch (buttonType) {
  //       case "menu":
  //       case "drawer":
  //         opening = toggleTargets[i].classList.contains("no-display");
  //         toggleTargets[i].classList.toggle("no-display");
  //         break;
  //       case "menu-only-mobile":
  //       case "drawer-only-mobile":
  //         opening = toggleTargets[i].classList.contains("no-display-only-mobile");
  //         toggleTargets[i].classList.toggle("no-display-only-mobile");
  //         break;
  //       case "drawer-incremental":
  //         break;
  //       case "drawer-incremental-only-mobile":
  //         break;
  //     }
  //
  //     // switch icon used based on toggle type and current toggle state
  //     switch (buttonType) {
  //       case "menu":
  //       case "menu-only-mobile":
  //         if (opening) {
  //           thisToggleButton.getElementsByTagName("use")[0].setAttribute("xlink:href", "#icon-close");
  //         } else {
  //           // closing
  //           thisToggleButton.getElementsByTagName("use")[0].setAttribute("xlink:href", "#icon-menu");
  //         }
  //         break;
  //       case "drawer":
  //       case "drawer-only-mobile":
  //       case "drawer-incremental":
  //       case "drawer-incremental-only-mobile":
  //         if (opening) {
  //           thisToggleButton.getElementsByTagName("use")[0].setAttribute("xlink:href", "#icon-chevron-up");
  //         } else {
  //           // closing
  //           thisToggleButton.getElementsByTagName("use")[0].setAttribute("xlink:href", "#icon-chevron-down");
  //         }
  //         break;
  //     }
  //   }
  // }

  // event handlers for different tp-types
  var opening, clickedButton, localToggleTarget;
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

    opening = localToggleTarget.classList.contains("tp-no-display");
    localToggleTarget.classList.toggle("tp-no-display");
    if (opening) {
      clickedButton.getElementsByTagName("use")[0].setAttribute("xlink:href", "#icon-chevron-up");
    } else {
      // closing
      clickedButton.getElementsByTagName("use")[0].setAttribute("xlink:href", "#icon-chevron-down");
    }
  }

  // add buttons (button > svg > use) to toggle-panels based on tp-type
  var newButton, newSVG, newUse, thisTogglePanel, thisToggleTarget;
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
        thisToggleTarget.classList.toggle("tp-no-display");
        newUse.setAttributeNS(xlinkns, "xlink:href", "#icon-menu"); // need to use setAttributeNS for xlink attributes

      } else if (thisTogglePanel.classList.contains("tp-type-drawer")) {
        newButton.addEventListener("click", toggleDrawer);

        // initialize tp state
        thisToggleTarget.classList.toggle("tp-no-display");
        newUse.setAttributeNS(xlinkns, "xlink:href", "#icon-chevron-down");

      } else if (thisTogglePanel.classList.contains("tp-type-drawer-incremental")) {
        newButton.addEventListener("click", toggleDrawerIncremental);

        // initialize tp state (add new function for drawer-incremental)
        thisToggleTarget.classList.toggle("tp-no-display");
        newUse.setAttributeNS(xlinkns, "xlink:href", "#icon-chevron-down");
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
