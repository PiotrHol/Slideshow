const slideshowHiddenClass = "slideshow-hidden";
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
  reloadMaxHeightAndWidths: () => void;
  checkSlide: (a: number) => void;
  setSlide: (a: number) => void;
  toggleArrow: () => void;
  autoplay: (a: number) => void;
}

class SlideshowSlider implements Slideshow {
  private slideshowNode: HTMLElement;
  private isInit: boolean;
  private slideshowElements: slideshowElement[];
  private maxHeight: number;
  private currentSlide: number;
  private slideshowDiv: HTMLElement;
  private isAutoplay: boolean;

  constructor(slideshowNode: HTMLElement) {
    this.slideshowNode = slideshowNode;
    this.isInit = false;
    this.slideshowElements = [];
    this.maxHeight = 0;
    this.currentSlide = 0;
    this.slideshowDiv = document.createElement("div");
    this.isAutoplay = false;
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
        this.toggleArrow();

        if (
          this.slideshowNode.dataset.autoplay &&
          this.slideshowNode.dataset.autoplay === "true"
        ) {
          this.isAutoplay = true;
        }
        let intervalTime = 0;
        if (this.slideshowNode.dataset.interval) {
          intervalTime = Number(this.slideshowNode.dataset.interval);
        }
        if (this.isAutoplay) {
          if (!Number.isNaN(intervalTime) && intervalTime > 0) {
            this.autoplay(intervalTime);
          } else {
            this.autoplay();
          }
        }
      });

      window.addEventListener("resize", () => this.reloadMaxHeightAndWidths());
      window.addEventListener("orientationchange", () =>
        this.reloadMaxHeightAndWidths()
      );
    }
  }

  reloadMaxHeightAndWidths() {
    let tempMaxHeight = 0;
    for (const slideshowChild of this.slideshowElements) {
      if (slideshowChild.element.offsetHeight > tempMaxHeight) {
        tempMaxHeight = slideshowChild.element.offsetHeight;
      }
    }
    this.maxHeight = tempMaxHeight;
    this.slideshowDiv.style.height = `${this.maxHeight}px`;
    for (const slideElement of this.slideshowElements) {
      slideElement.height = slideElement.element.offsetHeight;
      slideElement.width = slideElement.element.offsetWidth;
    }
    this.setSlide(this.currentSlide);
  }

  checkSlide(slideNumber: number) {
    if (
      slideNumber > this.currentSlide &&
      slideNumber < this.slideshowElements.length
    ) {
      return true;
    }
    if (slideNumber <= this.currentSlide && slideNumber >= 0) {
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
    this.toggleArrow();
  }

  toggleArrow() {
    const leftArrowElement = this.slideshowNode.querySelector(
      `.${slideshowLeftArrowClass}-js`
    );
    const rightArrowElement = this.slideshowNode.querySelector(
      `.${slideshowRightArrowClass}-js`
    );
    if (leftArrowElement && rightArrowElement) {
      if (this.currentSlide === 0) {
        leftArrowElement.classList.add(slideshowHiddenClass);
        rightArrowElement.classList.remove(slideshowHiddenClass);
        return;
      }
      if (this.currentSlide === this.slideshowElements.length - 1) {
        leftArrowElement.classList.remove(slideshowHiddenClass);
        rightArrowElement.classList.add(slideshowHiddenClass);
        return;
      }
      leftArrowElement.classList.remove(slideshowHiddenClass);
      rightArrowElement.classList.remove(slideshowHiddenClass);
    }
  }

  autoplay(time: number = 5000) {
    const intervalId = setInterval(() => {
      this.setSlide(this.currentSlide + 1);
    }, time);
  }
}

const nodeSlideshowsContainers: NodeListOf<HTMLElement> =
  document.querySelectorAll(`.${slideshowContainerClass}`);

const slideshowsContainers: SlideshowSlider[] = [];

for (let i = 0; i < nodeSlideshowsContainers.length; i++) {
  slideshowsContainers.push(new SlideshowSlider(nodeSlideshowsContainers[i]));
  slideshowsContainers[slideshowsContainers.length - 1].init();
}
