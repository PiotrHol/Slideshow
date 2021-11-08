const photos = document.querySelectorAll(".slideshowBox--image");
const circles = document.querySelectorAll(".slideshowBox--circle");

let intervalId = autoChangePicture();

function changeClass(toShow, photo, circle) {
    if (toShow) {
        photo.classList.remove("slideshowBox--image__dnone");
        circle.classList.add("slideshowBox--circle__active");
    }
    else {
        photo.classList.add("slideshowBox--image__dnone");
        circle.classList.remove("slideshowBox--circle__active");
    }
}

function autoChangePicture() {
    return setInterval(() => {
        for (let i = 0; i < photos.length; i++) {
            if (!(photos[i].classList.contains("slideshowBox--image__dnone"))) {
                changeClass(false, photos[i], circles[i]);
                let temp = i + 1;
                if (i === photos.length - 1) {
                    temp = 0;
                }
                changeClass(true, photos[temp], circles[temp]);
                break;
            }
        }
    }, 5000);
}

circles.forEach((item) => {
    item.addEventListener('click', () => {
        const id = item.dataset.id;
        for (let i = 0; i < photos.length; i++) {
            changeClass(false, photos[i], circles[i]);
            if (photos[i].dataset.id === id) {
                changeClass(true, photos[i], circles[i]);
            }
        }
        clearInterval(intervalId);
        intervalId = autoChangePicture();
    });
});