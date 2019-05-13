import Menubar from './Menubar';

describe('testing Menubar', () => {
  document.body.innerHTML = '<ul id="menubar" class="menubar" role="menubar" aria-label="Menubar Test >'
    + '  <li role="none">'
    + '    <a id="1" role="menuitem" aria-haspopup="true" aria-expanded="false" href="#basics" tabindex="0"> Basics </a>'
    + '    <ul id="submenu" role="menu" aria-haspopup="true" aria-expanded="false" href="#basics" tabindex="0">'
    + '     <li role="none">'
    + '       <a id="1-1" role="menuitem" aria-haspopup="true" aria-expanded="false" href="#basics" tabindex="-1"> Basics </a>'
    + '     </li>'
  + '       <li role="none">'
    + '       <a id="1-2" role="menuitem" aria-haspopup="true" aria-expanded="false" href="#basics" tabindex="-1"> Basics </a>'
    + '     </li>'
    + '    </ul>'
    + '  </li>'
    + '  <li role="none">'
    + '    <a id="2" role="menuitem" aria-haspopup="true" aria-expanded="false" href="#basics" tabindex="0"> Basics </a>'
    + '  </li>'
    + '</ul>';

  const menubar = new Menubar(document.getElementById('menubar'));
  menubar.init();

  it('sub menu opens on RETURN', () => {
    document.getElementById('1').focus();
    document.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':13, 'which':13}));
    setTimeout(() => {
      expect(document.getElementById('submenu').style.display).toBe('block');
    }, 0 );
  });

  it('submenu closes on ESC', () => {
    document.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':27, 'which':27}));
      setTimeout(() => {
        expect(document.getElementById('submenu').style.display).toBe('none');
      }, 0 );
  });

  it('submenu closes on SPACE', () => {
    document.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':32, 'which':32}));
      setTimeout(() => {
        expect(document.getElementById('submenu').style.display).toBe('block');
      }, 0 );
  });

  it('focus next upper menu element', () => {
    document.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':39, 'which':39}));
      setTimeout(() => {
        expect(document.activeElement === document.getElementById('2')).toBe(true);
      }, 0 );
  });

});


// TAB: 9,
// RETURN: 13,
// ESC: 27,
// SPACE: 32,
// PAGEUP: 33,
// PAGEDOWN: 34,
// END: 35,
// HOME: 36,
// LEFT: 37,
// UP: 38,
// RIGHT: 39,
// DOWN: 40,