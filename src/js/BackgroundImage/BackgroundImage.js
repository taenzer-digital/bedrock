class BackgroundImage {
  constructor(domNode) {
    this.domNode = domNode;
  }

  init() {
    [].slice.call(document.querySelectorAll(this.domNode)).forEach((bgImgP) => {
      const bgImg = bgImgP;
      const url = bgImg.getAttribute('data-url');
      const focal = bgImg.getAttribute('data-focal');

      const img = document.createElement('div');
      img.classList.add('backdrop');

      if (focal) {
        img.style.backgroundPosition = focal;
      }

      const imgDownload = new Image();

      imgDownload.onload = () => {
        img.style.backgroundImage = `url(${imgDownload.src})`;
        bgImg.appendChild(img);
        bgImg.style.backgroundColor = 'transparent';
      };

      imgDownload.src = url;
    });
  }
}

export default BackgroundImage;
