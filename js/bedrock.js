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
});