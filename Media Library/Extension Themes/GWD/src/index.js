import "./gwdpage_style.css";
import "./gwdpagedeck_style.css";
import "./gwdgooglead_style.css";
import "./gwdimage_style.css";
import "./gwdtaparea_style.css";
import "./styles.css";
import "./googbase_min.js";
import "./gwd_webcomponents_v1_min.js";
import "./Enabler.js";
import "./gwd-events-support.1.0.js";
import "./gwdpage_min.js";
import "./gwdpagedeck_min.js";
// import "./gwdgooglead_min.js";
// import "./gwdimage_min.js";
// import "./gwdtaparea_min.js";

console.log("DINAH");

gwd.auto_Button_1Click = function(event) {
  // GWD Predefined Function
gwd.actions.gwdPagedeck = document.getElementById('pagedeck');
gwd.actions.gwdPagedeck.goToNextPage('pagedeck', false, 'none', 1000, 'ease-in-out', 'top');
};
gwd.auto_Button_2Click1 = function(event) {
  // GWD Predefined Function
gwd.actions.gwdPagedeck = document.getElementById('pagedeck');
gwd.actions.gwdPagedeck.goToPage('pagedeck', 'page1_2', 'none', 1000, 'ease-in-out', 'top');
};
gwd.auto_Button_3Click = function(event) {
  // GWD Predefined Function
gwd.actions.gwdPagedeck = document.getElementById('pagedeck');
gwd.actions.gwdPagedeck.goToPage('pagedeck', 'page1', 'none', 1000, 'ease-in-out', 'top');
};
// Support code for event handling in Google Web Designer
// This script block is auto-generated. Please do not edit!
gwd.actions.events.registerEventHandlers = function(event) {
  gwd.actions.events.addHandler('button_1', 'click', gwd.auto_Button_1Click, false);
  gwd.actions.events.addHandler('button_2', 'click', gwd.auto_Button_2Click1, false);
  gwd.actions.events.addHandler('button_3', 'click', gwd.auto_Button_3Click, false);
};
gwd.actions.events.deregisterEventHandlers = function(event) {
  gwd.actions.events.removeHandler('button_1', 'click', gwd.auto_Button_1Click, false);
  gwd.actions.events.removeHandler('button_2', 'click', gwd.auto_Button_2Click1, false);
  gwd.actions.events.removeHandler('button_3', 'click', gwd.auto_Button_3Click, false);
};
document.addEventListener("DOMContentLoaded", gwd.actions.events.registerEventHandlers);
document.addEventListener("unload", gwd.actions.events.deregisterEventHandlers);

    (function() {
      document.body.style.opacity = "0";
      var pageDeck = document.getElementById('pagedeck');
      /**
       * Handles the DOMContentLoaded event. The DOMContentLoaded event is
       * fired when the document has been completely loaded and parsed.
       */

      function handleDomContentLoaded(event) {}

      /**
       * Handles the WebComponentsReady event. This event is fired when all
       * custom elements have been registered and upgraded.
       */
      function handleWebComponentsReady(event) {
        document.body.style.opacity = "";
        setTimeout(function() {
          pageDeck.goToPage(pageDeck.getDefaultPage().id);
        }, 0);
      }

      window.addEventListener('DOMContentLoaded',
        handleDomContentLoaded, false);
      window.addEventListener('WebComponentsReady',
        handleWebComponentsReady, false);
    })();