import Menubar from './Menubar/MenubarLinks';

function fill_placeholder(el) {
    let wordcount = parseInt(el.getAttribute('wordcount')) || 15;
    var buffer = '';
    for (var i = 0; i < wordcount; i++) {
        let r = (Math.sin(i + wordcount) + 2) * 10000;
        let wordlength = Math.floor(r / 8000);
        buffer += '&#x2501;'.repeat(wordlength) + ' ';
    }
    el.innerHTML = buffer;
}

function update_prototype(el, target) {
    el.style.height = "";
    el.style.height = el.scrollHeight + "px";
    el.style.width = "";
    el.style.width = el.scrollWidth + "px";

    target.innerHTML = el.value;
}

document.addEventListener("DOMContentLoaded", () => {
    // placeholder detection
    [].forEach.call(document.getElementsByClassName('placeholder'), fill_placeholder);
    // accordion
    [].slice.call(document.querySelectorAll('.accordion')).forEach((accordion) => {
        let detail_elems = Array.prototype.slice.call(accordion.querySelectorAll('details'));
        [].slice.call(detail_elems).forEach( (details) => {
            details.addEventListener("toggle", (event) => {
                if (details.open) {
                    [].slice.call(detail_elems).forEach( (other_details) => {
                        if (other_details !== details) {
                            other_details.open = false;
                        }
                    } ) 

                }
            });
        });
    });    
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

