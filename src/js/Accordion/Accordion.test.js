import Accordion from './Accordion';

describe('testing Accordion', () => {
  document.body.innerHTML = '<div class="accordion">'
    + '  <details id="1">'
    + '   <summary></summary>'
    + '  </details>'
    + '  <details id="2"></details>'
    + '</div>';

  const accordion = new Accordion('.accordion');

  it('expect to close other details', () => {
    document.getElementById('1').open = true;
    document.getElementById('2').open = true;
    setTimeout(() => {
      expect(document.getElementById('2').open).toBe(true);
      expect(document.getElementById('1').open).toBe(false);
    }, 0);
  });
});
