const slideshowContainerClass = "slideshow-container";
const slideshowLeftArrowClass = "slideshow-left-arrow";
const slideshowRightArrowClass = "slideshow-right-arrow";

type slideshowElement = {
  element: HTMLElement;
  height: number;
  width: number;
};

interface Slideshow {
  init: () => void;
  reloadMaxHeight: () => void;
  checkSlide: (a: number) => void;
  setSlide: (a: number) => void;
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

        const leftArrow = document.createElement("div");
        leftArrow.classList.add(
          slideshowLeftArrowClass,
          `${slideshowLeftArrowClass}-js`
        );
        this.slideshowNode.appendChild(leftArrow);
        const rightArrow = document.createElement("div");
        rightArrow.classList.add(
          slideshowRightArrowClass,
          `${slideshowRightArrowClass}-js`
        );
        this.slideshowNode.appendChild(rightArrow);

        const leftArrowElement = this.slideshowNode.querySelector(
          `.${slideshowLeftArrowClass}-js`
        );
        if (leftArrowElement) {
          leftArrowElement.addEventListener("click", () =>
            this.setSlide(this.currentSlide - 1)
          );
        }
        const rightArrowElement = this.slideshowNode.querySelector(
          `.${slideshowRightArrowClass}-js`
        );
        if (rightArrowElement) {
          rightArrowElement.addEventListener("click", () =>
            this.setSlide(this.currentSlide + 1)
          );
        }
      });

      window.addEventListener("resize", () => this.reloadMaxHeight());
      window.addEventListener("orientationchange", () =>
        this.reloadMaxHeight()
      );
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

  checkSlide(slideNumber: number) {
    if (
      slideNumber > this.currentSlide &&
      slideNumber < this.slideshowElements.length
    ) {
      return true;
    }
    if (slideNumber < this.currentSlide && slideNumber >= 0) {
      return true;
    }
    return false;
  }

  setSlide(slideNumber: number) {
    let newTranslateValue = 0;
    if (!this.checkSlide(slideNumber)) {
      return;
    }
    this.currentSlide = slideNumber;
    for (let i = 0; i < this.slideshowElements.length; i++) {
      if (i < this.currentSlide) {
        newTranslateValue += this.slideshowElements[i].width;
      }
    }
    this.slideshowDiv.style.transform = `translateX(-${newTranslateValue}px)`;
  }
}

const nodeSlideshowsContainers: NodeListOf<HTMLElement> =
  document.querySelectorAll(`.${slideshowContainerClass}`);

const slideshowsContainers: SlideshowSlider[] = [];

for (let i = 0; i < nodeSlideshowsContainers.length; i++) {
  slideshowsContainers.push(new SlideshowSlider(nodeSlideshowsContainers[i]));
  slideshowsContainers[slideshowsContainers.length - 1].init();
}
