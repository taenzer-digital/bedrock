class BackgroundImage {
  constructor(domNode) {
    this.domNode = domNode;

    [].slice.call(document.querySelectorAll(this.domNode)).forEach((bgImg) => {
      const url = bgImg.getAttribute('data-url');
      const focal = bgImg.getAttribute('data-focal');

      const img = document.createElement('div');
      img.classList.add('backdrop');

      if (focal) {
        img.style.backgroundPosition = focal;
      }

      var imgDownload = new Image();
      imgDownload.onload = function() {
        img.style.backgroundImage = `url(${this.src})`;
        bgImg.appendChild(img);
        bgImg.style.backgroundColor = 'transparent';
      }

      imgDownload.src = url;
    });

  }
}

export default BackgroundImage;
