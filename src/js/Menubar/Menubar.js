/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */
import MenubarItem from './MenubarItem';

class Menubar {
  constructor(domNode, menubar) {
    // const elementChildren;
    const msgPrefix = 'Menubar constructor argument menubarNode ';

    // Check whether menubarNode is a DOM element
    if (!(domNode instanceof Element)) {
      throw new TypeError(`${msgPrefix}is not a DOM Element.`);
    }

    // Check whether menubarNode has descendant elements
    if (domNode.childElementCount === 0) {
      throw new Error(`${msgPrefix}has no element children.`);
    }

    // Check whether menubarNode has A elements
    let e = domNode.firstElementChild;
    while (e) {
      const menubarItem = e.firstElementChild;
      if (e && menubarItem && menubarItem.tagName !== 'A') {
        throw new Error(`${msgPrefix}has child elements are not A elements.`);
      }
      e = e.nextElementSibling;
    }

    this.isMenubar = true;

    this.domNode = domNode;

    this.menubar = menubar || domNode.classList.contains('menubar');

    this.menubarItems = []; // See Menubar init method
    this.firstChars = []; // See Menubar init method

    this.firstItem = null; // See Menubar init method
    this.lastItem = null; // See Menubar init method

    this.hasFocus = false; // See MenubarItem handleFocus, handleBlur
    this.hasHover = false; // See Menubar handleMouseover, handleMouseout
  }

  /*
   *   @method init
   *
   *   @desc
   *       Adds ARIA role to the menubar node
   *       Traverse menubar children for A elements to configure each A element as a ARIA menuitem
   *       and populate menuitems array. Initialize firstItem and lastItem properties.
   */
  init() {
    // const childElement;

    // Traverse the element children of menubarNode: configure each with
    // menuitem role behavior and store reference in menuitems array.
    let elem = this.domNode.firstElementChild;

    while (elem) {
      const menuElement = elem.firstElementChild;

      if (elem && menuElement && menuElement.tagName === 'A') {
        const menubarItem = new MenubarItem(menuElement, this, this.menubar);
        menubarItem.init();
        this.menubarItems.push(menubarItem);
        const textContent = menuElement.textContent.trim();
        this.firstChars.push(textContent.substring(0, 1).toLowerCase());
      }

      elem = elem.nextElementSibling;
    }

    // Use populated menuitems array to initialize firstItem and lastItem.
    const numItems = this.menubarItems.length;
    if (numItems > 0) {
      this.firstItem = this.menubarItems[0];
      this.lastItem = this.menubarItems[numItems - 1];
    }
    this.firstItem.domNode.tabIndex = 0;
  }

  /* FOCUS MANAGEMENT METHODS */

  setFocusToItem(newItemParam) {
    const newItem = newItemParam;
    let flag = false;

    for (let i = 0; i < this.menubarItems.length; i += 1) {
      const mbi = this.menubarItems[i];

      if (mbi.domNode.tabIndex === 0) {
        flag = mbi.domNode.getAttribute('aria-expanded') === 'true';
      }

      mbi.domNode.tabIndex = -1;
      if (mbi.popupMenu) {
        mbi.popupMenu.close();
      }
    }

    newItem.domNode.focus();
    newItem.domNode.tabIndex = 0;

    if (flag && newItem.popupMenu) {
      newItem.popupMenu.open();
    }
  }

  setFocusToFirstItem() {
    this.setFocusToItem(this.firstItem);
  }

  setFocusToLastItem() {
    this.setFocusToItem(this.lastItem);
  }

  setFocusToPreviousItem(currentItem) {
    let newItem;

    if (currentItem === this.firstItem) {
      newItem = this.lastItem;
    } else {
      const index = this.menubarItems.indexOf(currentItem);
      newItem = this.menubarItems[index - 1];
    }

    this.setFocusToItem(newItem);
  }

  setFocusToNextItem(currentItem) {
    let newItem;

    if (currentItem === this.lastItem) {
      newItem = this.firstItem;
    } else {
      const index = this.menubarItems.indexOf(currentItem);
      newItem = this.menubarItems[index + 1];
    }

    this.setFocusToItem(newItem);
  }

  setFocusByFirstCharacter(currentItem, charParam) {
    const char = charParam.toLowerCase();
    // const flag = currentItem.domNode.getAttribute('aria-expanded') === 'true';

    // Get start index for search based on position of currentItem
    let start = this.menubarItems.indexOf(currentItem) + 1;
    if (start === this.menubarItems.length) {
      start = 0;
    }

    // Check remaining slots in the menu
    let index = this.getIndexFirstChars(start, char);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = this.getIndexFirstChars(0, char);
    }

    // If match was found...
    if (index > -1) {
      this.setFocusToItem(this.menubarItems[index]);
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
}

export default Menubar;
