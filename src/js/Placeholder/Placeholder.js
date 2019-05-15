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

export default Placeholder;
