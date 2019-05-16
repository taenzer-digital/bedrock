class Accordion {
  constructor(domNode) {
    this.domNode = domNode;

    [].slice.call(document.querySelectorAll(this.domNode)).forEach((accordion) => {
      this.detailElements = Array.prototype.slice.call(
        accordion.querySelectorAll('details'),
      );
    });
    [].slice.call(this.detailElements).forEach((details) => {
      details.addEventListener('toggle', () => {
        this.open(details);
      });
    });
  }

  open(details) {
    if (details.open) {
      [].slice.call(this.detailElements).forEach((otherDetailsP) => {
        const otherDetails = otherDetailsP;
        if (otherDetails !== details) {
          otherDetails.open = false;
        }
      });
    }
  }
}

export default Accordion;
