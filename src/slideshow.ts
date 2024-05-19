const slideshowContainerClass = "slideshow-container";

interface Slideshow {
  init: () => void;
}

class SlideshowSlider implements Slideshow {
  private slideshowSelector;
  private isInit: boolean;

  constructor(slideshowSelector: HTMLElement) {
    this.slideshowSelector = slideshowSelector;
    this.isInit = false;
  }

  init() {
    if (!this.isInit) {
      this.isInit = true;
    }
  }
}

const nodeSlideshowsContainers: NodeListOf<HTMLElement> =
  document.querySelectorAll(`.${slideshowContainerClass}`);

const slideshowsContainers: SlideshowSlider[] = [];

for (let i = 0; i < nodeSlideshowsContainers.length; i++) {
  slideshowsContainers.push(new SlideshowSlider(nodeSlideshowsContainers[i]));
  slideshowsContainers[slideshowsContainers.length - 1].init();
}
