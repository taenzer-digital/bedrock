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
    // based on https://www.w3.org/TR/wai-aria-practices/examples/accordion/js/accordion.js
    [].slice.call(document.querySelectorAll('.accordion')).forEach((accordion) => {
        // Create the array of toggle elements for the accordion group
        var triggers = Array.prototype.slice.call(accordion.querySelectorAll('.accordion-trigger'));
        var panels = Array.prototype.slice.call(accordion.querySelectorAll('.accordion-panel'));

        accordion.addEventListener('click', (event) => {
            var target = event.target;

            if (target.classList.contains('accordion-trigger')) {
                // Check if the current toggle is expanded.
                var isExpanded = target.getAttribute('aria-expanded') == 'true';
                var active = accordion.querySelector('[aria-expanded="true"]');

                if (active && active !== target) {
                    // Set the expanded state on the triggering element
                    active.setAttribute('aria-expanded', 'false');
                    // Hide the accordion sections, using aria-controls to specify the desired section
                    document.getElementById(active.getAttribute('aria-controls')).setAttribute('hidden', '');
                }

                if (!isExpanded) {
                    // Set the expanded state on the triggering element
                    target.setAttribute('aria-expanded', 'true');
                    // Hide the accordion sections, using aria-controls to specify the desired section
                    document.getElementById(target.getAttribute('aria-controls')).removeAttribute('hidden');
                } else {
                    // Set the expanded state on the triggering element
                    target.setAttribute('aria-expanded', 'false');
                    // Hide the accordion sections, using aria-controls to specify the desired section
                    document.getElementById(target.getAttribute('aria-controls')).setAttribute('hidden', '');
                }

                event.preventDefault();
            }
        });

        // Bind keyboard behaviors on the main accordion container
        accordion.addEventListener('keydown', (event) => {
            var target = event.target;
            var key = event.which.toString();

            var isExpanded = target.getAttribute('aria-expanded') == 'true';

            // 33 = Page Up, 34 = Page Down
            var ctrlModifier = (event.ctrlKey && key.match(/33|34/));

            // Is this coming from an accordion header?
            if (target.classList.contains('accordion-trigger')) {
                // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
                // 38 = Up, 40 = Down
                if (key.match(/38|40/) || ctrlModifier) {
                    var index = triggers.indexOf(target);
                    var direction = (key.match(/34|40/)) ? 1 : -1;
                    var length = triggers.length;
                    var newIndex = (index + length + direction) % length;

                    triggers[newIndex].focus();

                    event.preventDefault();
                } else if (key.match(/35|36/)) {
                    // 35 = End, 36 = Home keyboard operations
                    switch (key) {
                        // Go to first accordion
                        case '36':
                            triggers[0].focus();
                            break;
                            // Go to last accordion
                        case '35':
                            triggers[triggers.length - 1].focus();
                            break;
                    }
                    event.preventDefault();

                }

            }
        });

        // These are used to style the accordion when one of the buttons has focus
        accordion.querySelectorAll('.Accordion-trigger').forEach((trigger) => {

            trigger.addEventListener('focus', (event) => {
                accordion.classList.add('focus');
            });

            trigger.addEventListener('blur', (event) => {
                accordion.classList.remove('focus');
            });

        });

    });
});