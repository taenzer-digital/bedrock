import { Menubar, Accordion } from './index';
import Placeholder from './Placeholder/Placeholder';

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
  Placeholder('.placeholder');

  // accordion
  Accordion('.accordion');

  // prototype
  [].forEach.call(document.getElementsByClassName('prototype'), el => {
    const targetId = el.getAttribute('data-target');
    const target = document.getElementById(targetId);
    if (target) {
      updatePrototype(el, target);
      el.addEventListener('input', () => updatePrototype(el, target));
    }
  });

  const menubar = new Menubar(document.getElementById('menubar'));
  menubar.init();
});
