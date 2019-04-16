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
        // Create the array of toggle elements for the accordion group
        var triggers = Array.prototype.slice.call(accordion.querySelectorAll('.accordion-trigger'));
        var panels = Array.prototype.slice.call(accordion.querySelectorAll('.accordion-panel'));

});