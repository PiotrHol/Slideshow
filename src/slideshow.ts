const slideshowContainerClass = "slideshow-container";

type slideshowElement = {
  element: HTMLElement;
  height: number;
  width: number;
};

interface Slideshow {
  init: () => void;
}

class SlideshowSlider implements Slideshow {
  private slideshowNode;
  private isInit: boolean;
  private slideshowElements: slideshowElement[];
  private maxHeight: number;

  constructor(slideshowNode: HTMLElement) {
    this.slideshowNode = slideshowNode;
    this.isInit = false;
    this.slideshowElements = [];
    this.maxHeight = 0;
  }

  init() {
    if (!this.isInit) {
      this.isInit = true;
      document.addEventListener("DOMContentLoaded", () => {
        if (this.slideshowNode.dataset.maxWidth) {
          this.slideshowNode.style.maxWidth = `${Number(
            this.slideshowNode.dataset.maxWidth
          )}px`;
        }

        const slideshowChildren = Array.from(
          this.slideshowNode.children
        ) as HTMLElement[];

        for (const slideshowChild of slideshowChildren) {
          const slideshowChildData = {
            element: slideshowChild,
            height: slideshowChild.offsetHeight,
            width: slideshowChild.offsetWidth,
          };
          this.slideshowElements.push(slideshowChildData);
          if (slideshowChildData.height > this.maxHeight) {
            this.maxHeight = slideshowChildData.height;
          }
        }

        if (this.maxHeight && this.maxHeight > 0) {
          this.slideshowNode.style.height = `${this.maxHeight}px`;
        }
      });
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
