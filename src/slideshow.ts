const slideshowHiddenClass = "slideshow-hidden";
const slideshowContainerClass = "slideshow-container";
const slideshowBoxClass = "slideshow-box";
const slideshowLeftArrowClass = "slideshow-left-arrow";
const slideshowRightArrowClass = "slideshow-right-arrow";
const slideshowDotsClass = "slideshow-dots";
const activeDotsClass = "active-dot";

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
  toggleDots: () => void;
  autoplay: (a: number) => void;
  touchStartEventHandler: (e: TouchEvent) => void;
  touchEndEventHandler: (e: TouchEvent) => void;
}

class SlideshowSlider implements Slideshow {
  private slideshowNode: HTMLElement;
  private isInit: boolean;
  private slideshowElements: slideshowElement[];
  private maxHeight: number;
  private currentSlide: number;
  private slideshowDiv: HTMLElement;
  private isAutoplay: boolean;
  private isInfinity: boolean;
  private multipleElements: number;
  private multipleElementsMobile: number;
  private touchCoordinatesX: number;
  private isArrowNavigation: boolean;

  constructor(slideshowNode: HTMLElement) {
    this.slideshowNode = slideshowNode;
    this.isInit = false;
    this.slideshowElements = [];
    this.maxHeight = 0;
    this.currentSlide = 0;
    this.slideshowDiv = document.createElement("div");
    this.slideshowDiv.classList.add(slideshowBoxClass);
    this.isAutoplay = false;
    this.isInfinity = false;
    this.multipleElements = 1;
    this.multipleElementsMobile = 1;
    this.touchCoordinatesX = 0;
    this.isArrowNavigation = true;
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

        if (
          this.slideshowNode.dataset.multipleElements &&
          !Number.isNaN(Number(this.slideshowNode.dataset.multipleElements))
        ) {
          this.multipleElements = Number(
            this.slideshowNode.dataset.multipleElements
          );
        }

        if (
          this.slideshowNode.dataset.multipleElementsMobile &&
          !Number.isNaN(
            Number(this.slideshowNode.dataset.multipleElementsMobile)
          )
        ) {
          this.multipleElementsMobile = Number(
            this.slideshowNode.dataset.multipleElementsMobile
          );
        }

        if (
          this.slideshowNode.dataset.dotsNav &&
          this.slideshowNode.dataset.dotsNav === "true"
        ) {
          this.isArrowNavigation = false;
        }

        const slideshowChildren = Array.from(
          this.slideshowNode.children
        ) as HTMLElement[];

        const calcMultipleElements =
          window.innerWidth > 768
            ? this.multipleElements
            : this.multipleElementsMobile;

        if (this.multipleElements > 1 || this.multipleElementsMobile > 1) {
          slideshowChildren.forEach(
            (slide) =>
              (slide.style.width = `calc(100% / ${calcMultipleElements})`)
          );
        }

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

        if (this.isArrowNavigation) {
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
        } else {
          const dotsBox = document.createElement("div");
          dotsBox.classList.add(slideshowDotsClass, `${slideshowDotsClass}-js`);
          for (let i = 0; i < this.slideshowElements.length; i++) {
            const dotDiv = document.createElement("div");
            dotDiv.addEventListener("click", () => this.setSlide(i));
            dotsBox.appendChild(dotDiv);
          }
          this.slideshowNode.appendChild(dotsBox);
          this.toggleDots();
        }

        if (
          this.slideshowNode.dataset.infinity &&
          this.slideshowNode.dataset.infinity === "true"
        ) {
          this.isInfinity = true;
        }

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

        this.slideshowNode.addEventListener(
          "touchstart",
          this.touchStartEventHandler
        );
        this.slideshowNode.addEventListener(
          "touchend",
          this.touchEndEventHandler
        );
      });

      window.addEventListener("resize", () => this.reloadMaxHeightAndWidths());
      window.addEventListener("orientationchange", () =>
        this.reloadMaxHeightAndWidths()
      );
    }
  }

  reloadMaxHeightAndWidths() {
    let tempMaxHeight = 0;
    const calcMultipleElements =
      window.innerWidth > 768
        ? this.multipleElements
        : this.multipleElementsMobile;
    for (const slideshowChild of this.slideshowElements) {
      if (this.multipleElements > 1 || this.multipleElementsMobile > 1) {
        slideshowChild.element.style.width = `calc(100% / ${calcMultipleElements})`;
      }
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
    if (!this.isArrowNavigation) {
      this.toggleDots();
    }
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
    if (!this.checkSlide(slideNumber) && !this.isInfinity) {
      return;
    }
    let endNumberCondition = this.slideshowElements.length;
    const conditionMultipleElements =
      window.innerWidth > 768
        ? this.multipleElements
        : this.multipleElementsMobile;
    if (this.multipleElements > 1 || this.multipleElementsMobile > 1) {
      endNumberCondition = endNumberCondition - conditionMultipleElements + 1;
    }
    if (this.isInfinity && slideNumber >= endNumberCondition) {
      this.currentSlide = 0;
    } else if (this.isInfinity && slideNumber < 0) {
      this.currentSlide = endNumberCondition - 1;
    } else {
      this.currentSlide = slideNumber;
    }
    for (let i = 0; i < this.slideshowElements.length; i++) {
      if (i < this.currentSlide) {
        newTranslateValue += this.slideshowElements[i].width;
      }
    }
    this.slideshowDiv.style.transform = `translateX(-${newTranslateValue}px)`;
    if (this.isArrowNavigation) {
      this.toggleArrow();
    } else {
      this.toggleDots();
    }
  }

  toggleArrow() {
    const leftArrowElement = this.slideshowNode.querySelector(
      `.${slideshowLeftArrowClass}-js`
    );
    const rightArrowElement = this.slideshowNode.querySelector(
      `.${slideshowRightArrowClass}-js`
    );
    if (leftArrowElement && rightArrowElement) {
      if (this.currentSlide === 0 && !this.isInfinity) {
        leftArrowElement.classList.add(slideshowHiddenClass);
        rightArrowElement.classList.remove(slideshowHiddenClass);
        return;
      }
      if (
        this.currentSlide === this.slideshowElements.length - 1 &&
        !this.isInfinity
      ) {
        leftArrowElement.classList.remove(slideshowHiddenClass);
        rightArrowElement.classList.add(slideshowHiddenClass);
        return;
      }
      leftArrowElement.classList.remove(slideshowHiddenClass);
      rightArrowElement.classList.remove(slideshowHiddenClass);
    }
  }

  toggleDots() {
    const dotElements = this.slideshowNode.querySelector(
      `.${slideshowDotsClass}-js`
    )?.children;
    if (dotElements) {
      for (let i = 0; i < dotElements.length; i++) {
        if (this.currentSlide === i) {
          if (!dotElements[i].classList.contains(activeDotsClass)) {
            dotElements[i].classList.add(activeDotsClass);
          }
          continue;
        }
        dotElements[i].classList.remove(activeDotsClass);
      }
    }
  }

  autoplay(time: number = 5000) {
    const intervalId = setInterval(() => {
      this.setSlide(this.currentSlide + 1);
      if (
        !this.isInfinity &&
        this.currentSlide === this.slideshowElements.length - 1
      ) {
        clearInterval(intervalId);
      }
    }, time);
  }

  touchStartEventHandler = (event: TouchEvent) => {
    this.touchCoordinatesX = event.changedTouches[0].clientX;
  };

  touchEndEventHandler = (event: TouchEvent) => {
    const touchEndCoordinatesX = event.changedTouches[0].clientX;
    if (touchEndCoordinatesX > this.touchCoordinatesX + 60) {
      this.setSlide(this.currentSlide - 1);
    } else if (touchEndCoordinatesX + 60 < this.touchCoordinatesX) {
      this.setSlide(this.currentSlide + 1);
    }
  };
}

const nodeSlideshowsContainers: NodeListOf<HTMLElement> =
  document.querySelectorAll(`.${slideshowContainerClass}`);

const slideshowsContainers: SlideshowSlider[] = [];

for (let i = 0; i < nodeSlideshowsContainers.length; i++) {
  slideshowsContainers.push(new SlideshowSlider(nodeSlideshowsContainers[i]));
  slideshowsContainers[slideshowsContainers.length - 1].init();
}
