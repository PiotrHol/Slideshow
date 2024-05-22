const slideshowContainerClass = "slideshow-container";

type slideshowElement = {
  element: HTMLElement;
  height: number;
  width: number;
};

interface Slideshow {
  init: () => void;
  reloadMaxHeight: () => void;
  nextSlide: () => void;
}

class SlideshowSlider implements Slideshow {
  private slideshowNode: HTMLElement;
  private isInit: boolean;
  private slideshowElements: slideshowElement[];
  private maxHeight: number;
  private currentSlide: number;
  private slideshowDiv: HTMLElement;

  constructor(slideshowNode: HTMLElement) {
    this.slideshowNode = slideshowNode;
    this.isInit = false;
    this.slideshowElements = [];
    this.maxHeight = 0;
    this.currentSlide = 0;
    this.slideshowDiv = document.createElement("div");
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
          this.slideshowDiv.appendChild(slideshowChild);
        }

        this.slideshowNode.appendChild(this.slideshowDiv);

        if (this.maxHeight && this.maxHeight > 0) {
          this.slideshowDiv.style.height = `${this.maxHeight}px`;
        }
      });

      window.addEventListener("resize", () => this.reloadMaxHeight());
    }
  }

  reloadMaxHeight() {
    let tempMaxHeight = 0;
    for (const slideshowChild of this.slideshowElements) {
      if (slideshowChild.element.offsetHeight > tempMaxHeight) {
        tempMaxHeight = slideshowChild.element.offsetHeight;
      }
    }
    this.maxHeight = tempMaxHeight;
    this.slideshowDiv.style.height = `${this.maxHeight}px`;
  }

  nextSlide() {
    this.slideshowDiv.style.transform = `translateX(-${
      this.slideshowElements[this.currentSlide + 1].width
    }px)`;
    this.currentSlide += 1;
  }
}

const nodeSlideshowsContainers: NodeListOf<HTMLElement> =
  document.querySelectorAll(`.${slideshowContainerClass}`);

const slideshowsContainers: SlideshowSlider[] = [];

for (let i = 0; i < nodeSlideshowsContainers.length; i++) {
  slideshowsContainers.push(new SlideshowSlider(nodeSlideshowsContainers[i]));
  slideshowsContainers[slideshowsContainers.length - 1].init();
}
