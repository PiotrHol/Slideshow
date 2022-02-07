const photos = document.querySelectorAll(".slide-show-box__image");
const circles = document.querySelectorAll(".slide-show-box__circle");

let intervalId = autoChangePicture();

function changeClass(toShow, photo, circle) {
    if (toShow) {
        photo.classList.remove("slide-show-box__image--dnone");
        circle.classList.add("slide-show-box__circle--active");
    }
    else {
        photo.classList.add("slide-show-box__image--dnone");
        circle.classList.remove("slide-show-box__circle--active");
    }
}

function autoChangePicture() {
    return setInterval(() => {
        for (let i = 0; i < photos.length; i++) {
            if (!(photos[i].classList.contains("slide-show-box__image--dnone"))) {
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