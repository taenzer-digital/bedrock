'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

let PopupMenu =
  /*#__PURE__*/
  (function() {
    function PopupMenu(domNode, controllerObj, isMenubar) {
      _classCallCheck(this, PopupMenu);

      // const elementChildren,
      const msgPrefix = 'PopupMenu constructor argument domNode '; // Check whether domNode is a DOM element

      if (!(domNode instanceof Element)) {
        throw new TypeError(`${msgPrefix}is not a DOM Element.`);
      } // Check whether domNode has child elements

      if (domNode.childElementCount === 0) {
        throw new Error(`${msgPrefix}has no element children.`);
      } // Check whether domNode descendant elements have A elements

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

    _createClass(PopupMenu, [
      {
        key: 'init',
        value: function init() {
          // const childElement, menuElement, menuItem, textContent, numItems, label;
          // Configure the domNode itself
          this.domNode.addEventListener(
            'mouseover',
            this.handleMouseover.bind(this),
          );
          this.domNode.addEventListener(
            'mouseout',
            this.handleMouseout.bind(this),
          ); // Traverse the element children of domNode: configure each with
          // menuitem role behavior and store reference in menuitems array.

          let childElement = this.domNode.firstElementChild;

          while (childElement) {
            const menuElement = childElement.firstElementChild;

            if (menuElement && menuElement.tagName === 'A') {
              const menuItem = new PopupMenuItem(
                menuElement,
                this,
                this.menubar,
                false,
              );
              menuItem.init();
              this.menuitems.push(menuItem);
              const textContent = menuElement.textContent.trim();
              this.firstChars.push(textContent.substring(0, 1).toLowerCase());
            }

            childElement = childElement.nextElementSibling;
          } // Use populated menuitems array to initialize firstItem and lastItem.

          const numItems = this.menuitems.length;

          if (numItems > 0) {
            this.firstItem = this.menuitems[0];
            this.lastItem = this.menuitems[numItems - 1];
          }
        },
        /* EVENT HANDLERS */
      },
      {
        key: 'handleMouseover',
        value: function handleMouseover() {
          this.hasHover = true;
        },
      },
      {
        key: 'handleMouseout',
        value: function handleMouseout() {
          this.hasHover = false;
          setTimeout(this.close.bind(this, false), 1);
        },
        /* FOCUS MANAGEMENT METHODS */
      },
      {
        key: 'setFocusToController',
        value: function setFocusToController(commandParam, flag) {
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
        },
      },
      {
        key: 'setFocusToFirstItem',
        value: function setFocusToFirstItem() {
          this.firstItem.domNode.focus();
        },
      },
      {
        key: 'setFocusToLastItem',
        value: function setFocusToLastItem() {
          this.lastItem.domNode.focus();
        },
      },
      {
        key: 'setFocusToPreviousItem',
        value: function setFocusToPreviousItem(currentItem) {
          // const index;
          if (currentItem === this.firstItem) {
            this.lastItem.domNode.focus();
          } else {
            const index = this.menuitems.indexOf(currentItem);
            this.menuitems[index - 1].domNode.focus();
          }
        },
      },
      {
        key: 'setFocusToNextItem',
        value: function setFocusToNextItem(currentItem) {
          // const index;
          if (currentItem === this.lastItem) {
            this.firstItem.domNode.focus();
          } else {
            const index = this.menuitems.indexOf(currentItem);
            this.menuitems[index + 1].domNode.focus();
          }
        },
      },
      {
        key: 'setFocusByFirstCharacter',
        value: function setFocusByFirstCharacter(currentItem, charParam) {
          let { start, index } = charParam.toLowerCase();
          const char = charParam.toLowerCase(); // Get start index for search based on position of currentItem

          start = this.menuitems.indexOf(currentItem) + 1;

          if (start === this.menuitems.length) {
            start = 0;
          } // Check remaining slots in the menu

          index = this.getIndexFirstChars(start, char); // If not found in remaining slots, check from beginning

          if (index === -1) {
            index = this.getIndexFirstChars(0, char);
          } // If match was found...

          if (index > -1) {
            this.menuitems[index].domNode.focus();
          }
        },
      },
      {
        key: 'getIndexFirstChars',
        value: function getIndexFirstChars(startIndex, char) {
          for (let i = startIndex; i < this.firstChars.length; i += 1) {
            if (char === this.firstChars[i]) {
              return i;
            }
          }

          return -1;
        },
        /* MENU DISPLAY METHODS */
      },
      {
        key: 'open',
        value: function open() {
          // Get position and bounding rectangle of controller object's DOM node
          const rect = this.controller.domNode.getBoundingClientRect(); // Set CSS properties

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
        },
      },
      {
        key: 'close',
        value: function close(force) {
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
        },
      },
    ]);

    return PopupMenu;
  })();

let PopupMenuItem =
  /*#__PURE__*/
  (function() {
    function PopupMenuItem(domNode, menuObj, menubar = false) {
      _classCallCheck(this, PopupMenuItem);

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

    _createClass(PopupMenuItem, [
      {
        key: 'init',
        value: function init() {
          this.domNode.tabIndex = -1;
          this.domNode.addEventListener(
            'keydown',
            this.handleKeydown.bind(this),
          );
          this.domNode.addEventListener('click', this.handleClick.bind(this));
          this.domNode.addEventListener('focus', this.handleFocus.bind(this));
          this.domNode.addEventListener('blur', this.handleBlur.bind(this));
          this.domNode.addEventListener(
            'mouseover',
            this.handleMouseover.bind(this),
          );
          this.domNode.addEventListener(
            'mouseout',
            this.handleMouseout.bind(this),
          ); // Initialize flyout menu

          const nextElement = this.domNode.nextElementSibling;

          if (nextElement && nextElement.tagName === 'UL') {
            this.popupMenu = new PopupMenu(nextElement, this, this.menubar);
            this.popupMenu.init();
          }
        },
      },
      {
        key: 'isExpanded',
        value: function isExpanded() {
          return this.domNode.getAttribute('aria-expanded') === 'true';
        },
      },
      {
        key: 'handleKeydown',
        value: function handleKeydown(event) {
          const tgt = event.currentTarget;
          const char = event.key;
          let flag = false;
          let clickEvent;

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
        },
      },
      {
        key: 'setExpanded',
        value: function setExpanded(value) {
          if (value) {
            this.domNode.setAttribute('aria-expanded', 'true');
          } else {
            this.domNode.setAttribute('aria-expanded', 'false');
          }
        },
      },
      {
        key: 'handleClick',
        value: function handleClick() {
          this.menu.setFocusToController();
          this.menu.close(true);
        },
      },
      {
        key: 'handleFocus',
        value: function handleFocus() {
          this.menu.hasFocus = true;
        },
      },
      {
        key: 'handleBlur',
        value: function handleBlur() {
          this.menu.hasFocus = false;
          setTimeout(this.menu.close.bind(this.menu, false), 300);
        },
      },
      {
        key: 'handleMouseover',
        value: function handleMouseover() {
          this.menu.hasHover = true;
          this.menu.open();

          if (this.popupMenu) {
            this.popupMenu.hasHover = true;
            this.popupMenu.open();
          }
        },
      },
      {
        key: 'handleMouseout',
        value: function handleMouseout() {
          if (this.popupMenu) {
            this.popupMenu.hasHover = false;
            this.popupMenu.close(true);
          }

          this.menu.hasHover = false;
          setTimeout(this.menu.close.bind(this.menu, false), 300);
        },
      },
    ]);

    return PopupMenuItem;
  })();

let MenubarItem =
  /*#__PURE__*/
  (function() {
    function MenubarItem(domNode, menuObj, menubar, menubarItem = true) {
      _classCallCheck(this, MenubarItem);

      this.menu = menuObj;
      this.domNode = domNode;
      this.popupMenu = false;
      this.hasFocus = false;
      this.hasHover = false;
      this.isMenubarItem = menubarItem;
      this.menubar = menubar;
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

    _createClass(MenubarItem, [
      {
        key: 'init',
        value: function init() {
          this.domNode.tabIndex = -1;
          this.domNode.addEventListener(
            'keydown',
            this.handleKeydown.bind(this),
          );
          this.domNode.addEventListener('focus', this.handleFocus.bind(this));
          this.domNode.addEventListener('blur', this.handleBlur.bind(this));
          this.domNode.addEventListener(
            'mouseover',
            this.handleMouseover.bind(this),
          );
          this.domNode.addEventListener(
            'mouseout',
            this.handleMouseout.bind(this),
          ); // Initialize pop up menus

          const nextElement = this.domNode.nextElementSibling;

          if (nextElement && nextElement.tagName === 'UL') {
            this.popupMenu = new PopupMenu(nextElement, this, this.menubar);
            this.popupMenu.init();
          }
        },
      },
      {
        key: 'handleKeydown',
        value: function handleKeydown(event) {
          const char = event.key;
          let flag = false;

          function isPrintableCharacter(str) {
            return str.length === 1 && str.match(/\S/);
          }

          switch (event.keyCode) {
            case this.keyCode.SPACE:
            case this.keyCode.RETURN:
            case this.keyCode.DOWN:
              if (this.popupMenu) {
                this.popupMenu.open();
                this.popupMenu.setFocusToFirstItem();
                flag = true;
              }

              break;

            case this.keyCode.LEFT:
              this.menu.setFocusToPreviousItem(this);
              flag = true;
              break;

            case this.keyCode.RIGHT:
              this.menu.setFocusToNextItem(this);
              flag = true;
              break;

            case this.keyCode.UP:
              if (this.popupMenu) {
                this.popupMenu.open();
                this.popupMenu.setFocusToLastItem();
                flag = true;
              }

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

            case this.keyCode.TAB:
              if (this.popupMenu) {
                this.popupMenu.close(true);
              }

              break;

            case this.keyCode.ESC:
              if (this.popupMenu) {
                this.popupMenu.close(true);
              }

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
        },
      },
      {
        key: 'setExpanded',
        value: function setExpanded(value) {
          if (value) {
            this.domNode.setAttribute('aria-expanded', 'true');
          } else {
            this.domNode.setAttribute('aria-expanded', 'false');
          }
        },
      },
      {
        key: 'handleFocus',
        value: function handleFocus() {
          this.menu.hasFocus = true;
        },
      },
      {
        key: 'handleBlur',
        value: function handleBlur() {
          this.menu.hasFocus = false;
        },
      },
      {
        key: 'handleMouseover',
        value: function handleMouseover() {
          this.hasHover = true;

          if (this.popupMenu) {
            this.popupMenu.open();
          }
        },
      },
      {
        key: 'handleMouseout',
        value: function handleMouseout() {
          this.hasHover = false;

          if (this.popupMenu) {
            setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
          }
        },
      },
    ]);

    return MenubarItem;
  })();

let Menubar =
  /*#__PURE__*/
  (function() {
    function Menubar(domNode, menubar) {
      _classCallCheck(this, Menubar);

      // const elementChildren;
      const msgPrefix = 'Menubar constructor argument menubarNode '; // Check whether menubarNode is a DOM element

      if (!(domNode instanceof Element)) {
        throw new TypeError(`${msgPrefix}is not a DOM Element.`);
      } // Check whether menubarNode has descendant elements

      if (domNode.childElementCount === 0) {
        throw new Error(`${msgPrefix}has no element children.`);
      } // Check whether menubarNode has A elements

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

    _createClass(Menubar, [
      {
        key: 'init',
        value: function init() {
          // const childElement;
          // Traverse the element children of menubarNode: configure each with
          // menuitem role behavior and store reference in menuitems array.
          let elem = this.domNode.firstElementChild;

          while (elem) {
            const menuElement = elem.firstElementChild;

            if (elem && menuElement && menuElement.tagName === 'A') {
              const menubarItem = new MenubarItem(
                menuElement,
                this,
                this.menubar,
              );
              menubarItem.init();
              this.menubarItems.push(menubarItem);
              const textContent = menuElement.textContent.trim();
              this.firstChars.push(textContent.substring(0, 1).toLowerCase());
            }

            elem = elem.nextElementSibling;
          } // Use populated menuitems array to initialize firstItem and lastItem.

          const numItems = this.menubarItems.length;

          if (numItems > 0) {
            this.firstItem = this.menubarItems[0];
            this.lastItem = this.menubarItems[numItems - 1];
          }

          this.firstItem.domNode.tabIndex = 0;
        },
        /* FOCUS MANAGEMENT METHODS */
      },
      {
        key: 'setFocusToItem',
        value: function setFocusToItem(newItemParam) {
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
        },
      },
      {
        key: 'setFocusToFirstItem',
        value: function setFocusToFirstItem() {
          this.setFocusToItem(this.firstItem);
        },
      },
      {
        key: 'setFocusToLastItem',
        value: function setFocusToLastItem() {
          this.setFocusToItem(this.lastItem);
        },
      },
      {
        key: 'setFocusToPreviousItem',
        value: function setFocusToPreviousItem(currentItem) {
          let newItem;

          if (currentItem === this.firstItem) {
            newItem = this.lastItem;
          } else {
            const index = this.menubarItems.indexOf(currentItem);
            newItem = this.menubarItems[index - 1];
          }

          this.setFocusToItem(newItem);
        },
      },
      {
        key: 'setFocusToNextItem',
        value: function setFocusToNextItem(currentItem) {
          let newItem;

          if (currentItem === this.lastItem) {
            newItem = this.firstItem;
          } else {
            const index = this.menubarItems.indexOf(currentItem);
            newItem = this.menubarItems[index + 1];
          }

          this.setFocusToItem(newItem);
        },
      },
      {
        key: 'setFocusByFirstCharacter',
        value: function setFocusByFirstCharacter(currentItem, charParam) {
          const char = charParam.toLowerCase(); // const flag = currentItem.domNode.getAttribute('aria-expanded') === 'true';
          // Get start index for search based on position of currentItem

          let start = this.menubarItems.indexOf(currentItem) + 1;

          if (start === this.menubarItems.length) {
            start = 0;
          } // Check remaining slots in the menu

          let index = this.getIndexFirstChars(start, char); // If not found in remaining slots, check from beginning

          if (index === -1) {
            index = this.getIndexFirstChars(0, char);
          } // If match was found...

          if (index > -1) {
            this.setFocusToItem(this.menubarItems[index]);
          }
        },
      },
      {
        key: 'getIndexFirstChars',
        value: function getIndexFirstChars(startIndex, char) {
          for (let i = startIndex; i < this.firstChars.length; i += 1) {
            if (char === this.firstChars[i]) {
              return i;
            }
          }

          return -1;
        },
      },
    ]);

    return Menubar;
  })();

let Accordion =
  /*#__PURE__*/
  (function() {
    function Accordion(domNode) {
      _classCallCheck(this, Accordion);

      this.domNode = domNode;
    }

    _createClass(Accordion, [
      {
        key: 'init',
        value: function init() {
          [].slice
            .call(document.querySelectorAll(this.domNode))
            .forEach((accordion) => {
              this.detailElements = Array.prototype.slice.call(
                accordion.querySelectorAll('details'),
              );
            });
          [].slice.call(this.detailElements).forEach((details) => {
            details.addEventListener('toggle', () => {
              this.open(details);
            });
          });
        },
      },
      {
        key: 'open',
        value: function open(details) {
          if (details.open) {
            [].slice.call(this.detailElements).forEach((otherDetailsP) => {
              const otherDetails = otherDetailsP;

              if (otherDetails !== details) {
                otherDetails.open = false;
              }
            });
          }
        },
      },
    ]);

    return Accordion;
  })();

let BackgroundImage =
  /*#__PURE__*/
  (function() {
    function BackgroundImage(domNode) {
      _classCallCheck(this, BackgroundImage);

      this.domNode = domNode;
    }

    _createClass(BackgroundImage, [
      {
        key: 'init',
        value: function init() {
          [].slice
            .call(document.querySelectorAll(this.domNode))
            .forEach((bgImgP) => {
              const bgImg = bgImgP;
              const url = bgImg.getAttribute('data-url');
              const focal = bgImg.getAttribute('data-focal');
              const img = document.createElement('div');
              img.classList.add('backdrop');

              if (focal) {
                img.style.backgroundPosition = focal;
              }

              const imgDownload = new Image();

              imgDownload.onload = () => {
                img.style.backgroundImage = `url(${imgDownload.src})`;
                bgImg.appendChild(img);
                bgImg.style.backgroundColor = 'transparent';
              };

              imgDownload.src = url;
            });
        },
      },
    ]);

    return BackgroundImage;
  })();

const Placeholder = (domNode) => {
  [].slice.call(document.querySelectorAll(domNode)).forEach((element) => {
    const el = element;
    const wordcount = parseInt(el.getAttribute('wordcount'), 10) || 15;
    let buffer = '';

    for (let i = 0; i < wordcount; i += 1) {
      const r = (Math.sin(i + wordcount) + 2) * 10000;
      const wordlength = Math.floor(r / 8000);
      buffer += `${'&#x2501;'.repeat(wordlength)} `;
    }

    el.innerHTML = buffer;
  });
};

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

let Tabs =
  /*#__PURE__*/
  (function() {
    function Tabs(domNode) {
      _classCallCheck(this, Tabs);

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

    _createClass(Tabs, [
      {
        key: 'init',
        value: function init() {
          for (let i = 0; i < this.tabs.length; i += 1) {
            this.addListeners(i);
          }
        },
      },
      {
        key: 'generateArrays',
        value: function generateArrays() {
          this.tabs = this.domNode.querySelectorAll('[role="tab"]');
          this.panels = this.domNode.querySelectorAll('[role="tabpanel"]');
        },
      },
      {
        key: 'addListeners',
        value: function addListeners(index) {
          this.tabs[index].addEventListener(
            'click',
            this.clickEventListener.bind(this),
          );
          this.tabs[index].addEventListener(
            'keydown',
            this.keydownEventListener.bind(this),
          );
          this.tabs[index].addEventListener(
            'keyup',
            this.keyupEventListener.bind(this),
          ); // Build an array with all this.tabs (<button>s) in it

          this.tabs[index].index = index;
        },
      },
      {
        key: 'clickEventListener',
        value: function clickEventListener(event) {
          const tab = event.target;
          this.activateTab(tab, false);
        },
      },
      {
        key: 'keydownEventListener',
        value: function keydownEventListener(event) {
          const key = event.keyCode;

          switch (key) {
            case this.keys.end:
              event.preventDefault(); // Activate last tab

              this.focusLastTab();
              break;

            case this.keys.home:
              event.preventDefault(); // Activate first tab

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
        },
      },
      {
        key: 'keyupEventListener',
        value: function keyupEventListener(event) {
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
        },
      },
      {
        key: 'determineOrientation',
        value: function determineOrientation(event) {
          const key = event.keyCode;
          const vertical =
            this.tablist.getAttribute('aria-orientation') === 'vertical';
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
        },
      },
      {
        key: 'switchTabOnArrowPress',
        value: function switchTabOnArrowPress(event) {
          const pressed = event.keyCode;

          if (this.direction[pressed]) {
            const target = event.target;

            if (target.index !== undefined) {
              if (this.tabs[target.index + this.direction[pressed]]) {
                this.tabs[target.index + this.direction[pressed]].focus();
              } else if (
                pressed === this.keys.left ||
                pressed === this.keys.up
              ) {
                this.focusLastTab();
              } else if (
                pressed === this.keys.right ||
                pressed === this.keys.down
              ) {
                this.focusFirstTab();
              }
            }
          }
        },
      },
      {
        key: 'activateTab',
        value: function activateTab(tab, setFocusP) {
          const setFocus = setFocusP || true; // Deactivate all other tabs

          this.deactivateTabs(); // Remove tabindex attribute

          tab.removeAttribute('tabindex'); // Set the tab as selected

          tab.setAttribute('aria-selected', 'true'); // Get the value of aria-controls (which is an ID)

          const controls = tab.getAttribute('aria-controls'); // Remove hidden attribute from tab panel to make it visible

          document.getElementById(controls).removeAttribute('hidden'); // Set focus when required

          if (setFocus) {
            tab.focus();
          }
        },
      },
      {
        key: 'deactivateTabs',
        value: function deactivateTabs() {
          for (let t = 0; t < this.tabs.length; t += 1) {
            this.tabs[t].setAttribute('tabindex', '-1');
            this.tabs[t].setAttribute('aria-selected', 'false');
          }

          for (let p = 0; p < this.panels.length; p += 1) {
            this.panels[p].setAttribute('hidden', 'hidden');
          }
        },
      },
      {
        key: 'focusFirstTab',
        value: function focusFirstTab() {
          this.tabs[0].focus();
        }, // Make a guess
      },
      {
        key: 'focusLastTab',
        value: function focusLastTab() {
          this.tabs[this.tabs.length - 1].focus();
        }, // Detect if a tab is deletable
      },
      {
        key: 'determineDeletable',
        value: function determineDeletable(event) {
          const target = event.target;

          if (target.getAttribute('data-deletable') !== null) {
            // Delete target tab
            deleteTab(event); // Update arrays related to tabs widget

            this.generateArrays(); // Activate the closest tab to the one that was just deleted

            if (target.index - 1 < 0) {
              this.activateTab(this.tabs[0]);
            } else {
              this.activateTab(this.tabs[target.index - 1]);
            }
          }
        }, // Deletes a tab and its panel
        // Determine whether there should be a delay
        // when user navigates with the arrow keys
      },
      {
        key: 'determineDelay',
        value: function determineDelay() {
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
        },
      },
    ]);

    return Tabs;
  })();

function updatePrototype(element, targetParam) {
  const el = element;
  el.style.height = '';
  el.style.height = `${el.scrollHeight}px`;
  el.style.width = '';
  el.style.width = `${el.scrollWidth}px`;
  const target = targetParam;
  target.innerHTML = el.value;
}

document.addEventListener('DOMContentLoaded', () => {
  // placeholder detection
  Placeholder('.placeholder'); // accordion

  const accordion = new Accordion('.accordion');
  accordion.init();
  const bg = new BackgroundImage('.bg-img');
  bg.init(); // prototype

  [].forEach.call(document.getElementsByClassName('prototype'), (el) => {
    const targetId = el.getAttribute('data-target');
    const target = document.getElementById(targetId);

    if (target) {
      updatePrototype(el, target);
      el.addEventListener('input', () => updatePrototype(el, target));
    }
  });
  const menubar = new Menubar(document.getElementById('menubar'));
  menubar.init();
  [].forEach.call(document.getElementsByClassName('tabs'), (el) => {
    const tabs = new Tabs(el);
    tabs.init();
  });
  [].forEach.call(document.getElementsByClassName('js-menu-toggle'), (el) => {
    el.addEventListener('click', (event) => {
      event.target.classList.toggle('menu-toggle--active');
      event.target.parentNode.classList.toggle('nav--active');

      if (event.target.getAttribute('aria-expanded')) {
        event.target.setAttribute('aria-expanded', 'true');
      } else {
        event.target.setAttribute('aria-expanded', 'false');
      }
    });
  });
});
