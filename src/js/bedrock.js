import {
    Menubar,
    Accordion
} from './index';
import Placeholder from './Placeholder/Placeholder';



function update_prototype(el, target) {
    el.style.height = "";
    el.style.height = el.scrollHeight + "px";
    el.style.width = "";
    el.style.width = el.scrollWidth + "px";

    target.innerHTML = el.value;
}

document.addEventListener("DOMContentLoaded", () => {
    // placeholder detection
    var placeholder = new Placeholder('.placeholder');
    
    // accordion
    var accordion = new Accordion('.accordion');

    // prototype
    [].forEach.call(document.getElementsByClassName('prototype'), (el) => {
        const target_id = el.getAttribute('data-target');
        const target = document.getElementById(target_id);
        if (target) {
            update_prototype(el, target)
            el.addEventListener('input', _ => update_prototype(el, target));
        }
    });


    var menubar = new Menubar(document.getElementById('menubar'));
    menubar.init();
});
