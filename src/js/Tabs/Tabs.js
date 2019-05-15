/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

function deleteTab(event) {
  const target = event.target;
  const panel = document.getElementById(target.getAttribute('aria-controls'));

  target.parentElement.removeChild(target);
  panel.parentElement.removeChild(panel);
}

export default class Tabs {
  constructor(domNode) {
    this.tablist = domNode.querySelectorAll('[role="tablist"]')[0];
    this.domNode = domNode;

    this.keys = {
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      delete: 46,
      enter: 13,
      space: 32,
    };

    this.direction = {
      37: -1,
      38: -1,
      39: 1,
      40: 1,
    };
    this.generateArrays();
  }

  init() {
    for (let i = 0; i < this.tabs.length; i += 1) {
      this.addListeners(i);
    }
  }

  generateArrays() {
    this.tabs = this.domNode.querySelectorAll('[role="tab"]');
    this.panels = this.domNode.querySelectorAll('[role="tabpanel"]');
  }

  addListeners(index) {
    this.tabs[index].addEventListener('click', this.clickEventListener.bind(this));
    this.tabs[index].addEventListener('keydown', this.keydownEventListener.bind(this));
    this.tabs[index].addEventListener('keyup', this.keyupEventListener.bind(this));

    // Build an array with all this.tabs (<button>s) in it
    this.tabs[index].index = index;
  }

  clickEventListener(event) {
    const tab = event.target;
    this.activateTab(tab, false);
  }

  keydownEventListener(event) {
    const key = event.keyCode;

    switch (key) {
      case this.keys.end:
        event.preventDefault();
        // Activate last tab
        this.focusLastTab();
        break;
      case this.keys.home:
        event.preventDefault();
        // Activate first tab
        this.focusFirstTab();
        break;

      // Up and down are in keydown
      // because we need to prevent page scroll >:)
      case this.keys.up:
      case this.keys.down:
        this.determineOrientation(event);
        break;
      default:
        break;
    }
  }

  keyupEventListener(event) {
    const key = event.keyCode;

    switch (key) {
      case this.keys.left:
      case this.keys.right:
        this.determineOrientation(event);
        break;
      case this.keys.delete:
        this.determineDeletable(event);
        break;
      case this.keys.enter:
      case this.keys.space:
        this.activateTab(event.target);
        break;
      default:
        break;
    }
  }

  determineOrientation(event) {
    const key = event.keyCode;
    const vertical = this.tablist.getAttribute('aria-orientation') === 'vertical';
    let proceed = false;

    if (vertical) {
      if (key === this.keys.up || key === this.keys.down) {
        event.preventDefault();
        proceed = true;
      }
    } else if (key === this.keys.left || key === this.keys.right) {
      proceed = true;
    }

    if (proceed) {
      this.switchTabOnArrowPress(event);
    }
  }

  switchTabOnArrowPress(event) {
    const pressed = event.keyCode;

    if (this.direction[pressed]) {
      const target = event.target;
      if (target.index !== undefined) {
        if (this.tabs[target.index + this.direction[pressed]]) {
          this.tabs[target.index + this.direction[pressed]].focus();
        } else if (pressed === this.keys.left || pressed === this.keys.up) {
          this.focusLastTab();
        } else if (pressed === this.keys.right || pressed === this.keys.down) {
          this.focusFirstTab();
        }
      }
    }
  }

  activateTab(tab, setFocusP) {
    const setFocus = setFocusP || true;
    // Deactivate all other tabs
    this.deactivateTabs();

    // Remove tabindex attribute
    tab.removeAttribute('tabindex');

    // Set the tab as selected
    tab.setAttribute('aria-selected', 'true');

    // Get the value of aria-controls (which is an ID)
    const controls = tab.getAttribute('aria-controls');

    // Remove hidden attribute from tab panel to make it visible
    document.getElementById(controls).removeAttribute('hidden');

    // Set focus when required
    if (setFocus) {
      tab.focus();
    }
  }

  deactivateTabs() {
    for (let t = 0; t < this.tabs.length; t += 1) {
      this.tabs[t].setAttribute('tabindex', '-1');
      this.tabs[t].setAttribute('aria-selected', 'false');
    }

    for (let p = 0; p < this.panels.length; p += 1) {
      this.panels[p].setAttribute('hidden', 'hidden');
    }
  }

  focusFirstTab() {
    this.tabs[0].focus();
  }

  // Make a guess
  focusLastTab() {
    this.tabs[this.tabs.length - 1].focus();
  }

  // Detect if a tab is deletable
  determineDeletable(event) {
    const target = event.target;

    if (target.getAttribute('data-deletable') !== null) {
      // Delete target tab
      deleteTab(event, target);

      // Update arrays related to tabs widget
      this.generateArrays();

      // Activate the closest tab to the one that was just deleted
      if (target.index - 1 < 0) {
        this.activateTab(this.tabs[0]);
      } else {
        this.activateTab(this.tabs[target.index - 1]);
      }
    }
  }

  // Deletes a tab and its panel


  // Determine whether there should be a delay
  // when user navigates with the arrow keys
  determineDelay() {
    const hasDelay = this.tablist.hasAttribute('data-delay');
    let delay = 0;

    if (hasDelay) {
      const delayValue = this.tablist.getAttribute('data-delay');
      if (delayValue) {
        delay = delayValue;
      } else {
        // If no value is specified, default to 300ms
        delay = 300;
      }
    }

    return delay;
  }
}
