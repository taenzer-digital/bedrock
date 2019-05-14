import Menubar from './Menubar';

describe('testing Menubar', () => {
  document.body.innerHTML = '<ul id="menubar" class="menubar" role="menubar" aria-label="Menubar Test" >'
    + '  <li role="none">'
    + '    <a id="link-1" role="menuitem" aria-haspopup="true" aria-expanded="false" tabindex="0"> Basics </a>'
    + '     <ul id="submenu-1" role="menu" aria-label="Utilities">'
      + '    <li role="none">'
      + '        <a id="link-1-1" role="menuitem" tabindex="-1" href="#base_unit">The Base Unit</a>'
      + '    </li>'
    + '     </ul>'
    + '  </li>'
    + '  <li role="none">'
    + '    <a id="link-2" role="menuitem" tabindex="0"> Basics </a>'
    + '  </li>'
    + '  <li role="none">'
    + '    <a id="link-3" role="menuitem" tabindex="0"> Basics </a>'
    + '  </li>'
    + '</ul>';

  const menubar = new Menubar(document.getElementById('menubar'));
  menubar.init();

  let link = document.querySelector('#link-1');

  it('sub menu opens on RETURN', () => {
    link.focus();
    link.dispatchEvent (new KeyboardEvent('keydown', { keyCode: 13 }));
    expect(document.querySelector('#submenu-1').style.display).toBe('block');
  });

  it('submenu closes on ESC', () => {
    link = document.activeElement;
    link.dispatchEvent (new KeyboardEvent('keydown', { keyCode: 27 }));
    expect(document.getElementById('submenu-1').style.display).toBe('none');
  });

  it('submenu opens on SPACE', () => {
    link = document.querySelector('#link-1');
    link.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':32}));
    expect(document.getElementById('submenu-1').style.display).toBe('block');
  });

  it('focus next upper menu element with RIGHT', () => {
    link = document.activeElement;
    link.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':39}));
    expect(!!(document.activeElement === document.getElementById('link-2'))).toBe(true);
  });

  it('focus prev upper menu element WITH LEFT', () => {
    link = document.activeElement;
    link.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':37}));
    expect(!!(document.activeElement === document.getElementById('link-1'))).toBe(true);
  });

  it('focus first sub menu element with DOWN', () => {
    link = document.activeElement;
    link.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':40}));
    expect(!!(document.activeElement === document.getElementById('link-1-1'))).toBe(true);
  });

  it('close sub menu with ESC', () => {
    link = document.activeElement;
    link.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':27}));
    expect(!!(document.activeElement === document.getElementById('link-1'))).toBe(true);
    expect(document.getElementById('submenu-1').style.display).toBe('none');
  });

  it('jump to last element with PAGEDOWN', () => {
    link = document.activeElement;
    link.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':34}));
    expect(!!(document.activeElement === document.getElementById('link-3'))).toBe(true);
  });

  it('jump to last element with PAGEUP', () => {
    link = document.activeElement;
    link.dispatchEvent (new KeyboardEvent('keydown', {'keyCode':33}));
    expect(!!(document.activeElement === document.getElementById('link-1'))).toBe(true);
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
// DOWN: 40