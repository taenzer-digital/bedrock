class PopupMenu {
  constructor(domNode, controllerObj, isMenubar) {
    // const elementChildren,
    const msgPrefix = 'PopupMenu constructor argument domNode ';

    // Check whether domNode is a DOM element
    if (!(domNode instanceof Element)) {
      throw new TypeError(`${msgPrefix}is not a DOM Element.`);
    }
    // Check whether domNode has child elements
    if (domNode.childElementCount === 0) {
      throw new Error(`${msgPrefix}has no element children.`);
    }
    // Check whether domNode descendant elements have A elements
    let childElement = domNode.firstElementChild;
    while (childElement) {
      const menuitem = childElement.firstElementChild;
      if (menuitem && menuitem === 'A') {
        throw new Error(
          `${msgPrefix}has descendant elements that are not A elements.`,
        );
      }
      childElement = childElement.nextElementSibling;
    }

    this.isMenubar = false;

    this.menubar = isMenubar;
    this.domNode = domNode;
    this.controller = controllerObj;

    this.menuitems = []; // See PopupMenu init method
    this.firstChars = []; // See PopupMenu init method

    this.firstItem = null; // See PopupMenu init method
    this.lastItem = null; // See PopupMenu init method

    this.hasFocus = false; // See MenuItem handleFocus, handleBlur
    this.hasHover = false; // See PopupMenu handleMouseover, handleMouseout
  }

  /*
   *   @method init
   *
   *   @desc
   *       Add domNode event listeners for mouseover and mouseout. Traverse
   *       domNode children to configure each menuitem and populate menuitems
   *       array. Initialize firstItem and lastItem properties.
   */
  init() {
    // const childElement, menuElement, menuItem, textContent, numItems, label;

    // Configure the domNode itself

    this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
    this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

    // Traverse the element children of domNode: configure each with
    // menuitem role behavior and store reference in menuitems array.
    let childElement = this.domNode.firstElementChild;

    while (childElement) {
      const menuElement = childElement.firstElementChild;

      if (menuElement && menuElement.tagName === 'A') {
        const menuItem = new PopupMenuItem(menuElement, this, this.menubar, false);
        menuItem.init();
        this.menuitems.push(menuItem);
        const textContent = menuElement.textContent.trim();
        this.firstChars.push(textContent.substring(0, 1).toLowerCase());
      }
      childElement = childElement.nextElementSibling;
    }

    // Use populated menuitems array to initialize firstItem and lastItem.
    const numItems = this.menuitems.length;
    if (numItems > 0) {
      this.firstItem = this.menuitems[0];
      this.lastItem = this.menuitems[numItems - 1];
    }
  }

  /* EVENT HANDLERS */

  handleMouseover() {
    this.hasHover = true;
  }

  handleMouseout() {
    this.hasHover = false;
    setTimeout(this.close.bind(this, false), 1);
  }

  /* FOCUS MANAGEMENT METHODS */

  setFocusToController(commandParam, flag) {
    let command = commandParam;
    if (typeof command !== 'string') {
      command = '';
    }

    function setFocusToMenubarItem(controllerParam, close) {
      let controller = controllerParam;
      while (controller) {
        if (controller.isMenubarItem) {
          controller.domNode.focus();
          return controller;
        }

        if (close) {
          controller.menu.close(true);
        }
        controller.hasFocus = false;

        controller = controller.menu.controller;
      }
      return false;
    }

    if (command === '') {
      if (this.controller && this.controller.domNode) {
        this.controller.domNode.focus();
      }
      return;
    }

    if (!this.controller.isMenubarItem) {
      this.controller.domNode.focus();
      this.close();

      if (command === 'next') {
        const menubarItem = setFocusToMenubarItem(this.controller, false);
        if (menubarItem) {
          menubarItem.menu.setFocusToNextItem(menubarItem, flag);
        }
      }
    } else if (command === 'previous') {
      this.controller.menu.setFocusToPreviousItem(this.controller, flag);
    } else if (command === 'next') {
      this.controller.menu.setFocusToNextItem(this.controller, flag);
    }
  }

  setFocusToFirstItem() {
    this.firstItem.domNode.focus();
  }

  setFocusToLastItem() {
    this.lastItem.domNode.focus();
  }

  setFocusToPreviousItem(currentItem) {
    // const index;

    if (currentItem === this.firstItem) {
      this.lastItem.domNode.focus();
    } else {
      const index = this.menuitems.indexOf(currentItem);
      this.menuitems[index - 1].domNode.focus();
    }
  }

  setFocusToNextItem(currentItem) {
    // const index;

    if (currentItem === this.lastItem) {
      this.firstItem.domNode.focus();
    } else {
      const index = this.menuitems.indexOf(currentItem);
      this.menuitems[index + 1].domNode.focus();
    }
  }

  setFocusByFirstCharacter(currentItem, charParam) {
    let { start, index } = charParam.toLowerCase();
    const char = charParam.toLowerCase();

    // Get start index for search based on position of currentItem
    start = this.menuitems.indexOf(currentItem) + 1;
    if (start === this.menuitems.length) {
      start = 0;
    }

    // Check remaining slots in the menu
    index = this.getIndexFirstChars(start, char);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = this.getIndexFirstChars(0, char);
    }

    // If match was found...
    if (index > -1) {
      this.menuitems[index].domNode.focus();
    }
  }

  getIndexFirstChars(startIndex, char) {
    for (let i = startIndex; i < this.firstChars.length; i += 1) {
      if (char === this.firstChars[i]) {
        return i;
      }
    }
    return -1;
  }

  /* MENU DISPLAY METHODS */

  open() {

    // Get position and bounding rectangle of controller object's DOM node
    const rect = this.controller.domNode.getBoundingClientRect();
    // Set CSS properties
    if (!this.menubar) {
      return;
    }

    if (!this.controller.isMenubarItem) {
      this.domNode.style.left = `${rect.width}px`;
      this.domNode.style.top = 0;
    } else {
      this.domNode.style.top = '100%';
    }

    this.domNode.parentNode.style.position = 'relative';
    this.domNode.style.display = 'block';
    this.domNode.style.position = 'absolute';
    this.domNode.style.zIndex = 100;

    this.controller.setExpanded(true);
  }

  close(force) {
    let controllerHasHover = this.controller.hasHover;

    let hasFocus = this.hasFocus;

    for (let i = 0; i < this.menuitems.length; i += 1) {
      const mi = this.menuitems[i];
      if (mi.popupMenu) {
        hasFocus = hasFocus || mi.popupMenu.hasFocus;
      }
    }

    if (!this.controller.isMenubarItem) {
      controllerHasHover = false;
    }

    if (!this.menubar) {
      return;
    }

    if (force || (!hasFocus && !this.hasHover && !controllerHasHover)) {
      this.domNode.style.display = 'none';
      this.domNode.style.zIndex = 0;
      this.controller.setExpanded(false);
    }
  }
}

class PopupMenuItem {
  constructor(domNode, menuObj, menubar = false) {
    // if (typeof popupObj !== 'object') {
    //   popupObj = false;
    // }
    this.menubar = menubar;
    this.domNode = domNode;
    this.menu = menuObj;
    this.popupMenu = false;
    this.isMenubarItem = false;

    this.keyCode = Object.freeze({
      TAB: 9,
      RETURN: 13,
      ESC: 27,
      SPACE: 32,
      PAGEUP: 33,
      PAGEDOWN: 34,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
    });
  }

  init() {
    this.domNode.tabIndex = -1;

    this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
    this.domNode.addEventListener('click', this.handleClick.bind(this));
    this.domNode.addEventListener('focus', this.handleFocus.bind(this));
    this.domNode.addEventListener('blur', this.handleBlur.bind(this));
    this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
    this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

    // Initialize flyout menu

    var nextElement = this.domNode.nextElementSibling;

    if (nextElement && nextElement.tagName === 'UL') {
      this.popupMenu = new PopupMenu(nextElement, this, this.menubar);
      this.popupMenu.init();
    }
  }

  isExpanded() {
    return this.domNode.getAttribute('aria-expanded') === 'true';
  }

  handleKeydown(event) {
    var tgt = event.currentTarget,
      char = event.key,
      flag = false,
      clickEvent;

    function isPrintableCharacter(str) {
      return str.length === 1 && str.match(/\S/);
    }

    switch (event.keyCode) {
      case this.keyCode.SPACE:
      case this.keyCode.RETURN:
        if (this.popupMenu) {
          this.popupMenu.open();
          this.popupMenu.setFocusToFirstItem();
        } else {
          // Create simulated mouse event to mimic the behavior of ATs
          // and let the event handler handleClick do the housekeeping.
          try {
            clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true,
            });
          } catch (err) {
            if (document.createEvent) {
              // DOM Level 3 for IE 9+
              clickEvent = document.createEvent('MouseEvents');
              clickEvent.initEvent('click', true, true);
            }
          }
          tgt.dispatchEvent(clickEvent);
        }

        flag = true;
        break;

      case this.keyCode.UP:
        this.menu.setFocusToPreviousItem(this);
        flag = true;
        break;

      case this.keyCode.DOWN:
        this.menu.setFocusToNextItem(this);
        flag = true;
        break;

      case this.keyCode.LEFT:
        this.menu.setFocusToController('previous', true);
        this.menu.close(true);
        flag = true;
        break;

      case this.keyCode.RIGHT:
        if (this.popupMenu) {
          this.popupMenu.open();
          this.popupMenu.setFocusToFirstItem();
        } else {
          this.menu.setFocusToController('next', true);
          this.menu.close(true);
        }
        flag = true;
        break;

      case this.keyCode.HOME:
      case this.keyCode.PAGEUP:
        this.menu.setFocusToFirstItem();
        flag = true;
        break;

      case this.keyCode.END:
      case this.keyCode.PAGEDOWN:
        this.menu.setFocusToLastItem();
        flag = true;
        break;

      case this.keyCode.ESC:
        this.menu.setFocusToController();
        this.menu.close(true);
        flag = true;
        break;

      case this.keyCode.TAB:
        this.menu.setFocusToController();
        break;

      default:
        if (isPrintableCharacter(char)) {
          this.menu.setFocusByFirstCharacter(this, char);
          flag = true;
        }
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  setExpanded(value) {
    if (value) {
      this.domNode.setAttribute('aria-expanded', 'true');
    } else {
      this.domNode.setAttribute('aria-expanded', 'false');
    }
  }

  handleClick() {
    this.menu.setFocusToController();
    this.menu.close(true);
  }

  handleFocus() {
    this.menu.hasFocus = true;
  }

  handleBlur() {
    this.menu.hasFocus = false;
    setTimeout(this.menu.close.bind(this.menu, false), 300);
  }

  handleMouseover() {
    this.menu.hasHover = true;
    this.menu.open();
    if (this.popupMenu) {
      this.popupMenu.hasHover = true;
      this.popupMenu.open();
    }
  }

  handleMouseout() {
    if (this.popupMenu) {
      this.popupMenu.hasHover = false;
      this.popupMenu.close(true);
    }

    this.menu.hasHover = false;
    setTimeout(this.menu.close.bind(this.menu, false), 300);
  }
}

export default PopupMenu;
