/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
(() => {
    // FUNCTIONS TO USE LATER
    const addClass = (el, className) => {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ` ${className}`;
        }
    };

    const removeClass = (el, className) => {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(
                new RegExp(
                    `(^|\\b)${className.split(" ").join("|")}(\\b|$)`,
                    "gi",
                ),
                " ",
            );
        }
    };

    const COUNTER = document.querySelector("#counter");
    const SLIDERS = document.querySelectorAll(".sliders-container .slider");
    const SLIDER_PAGINATE_BUTTONS = document.querySelectorAll(".slider-button");

    let currentSlide = 0;

    addClass(SLIDERS[currentSlide], "current");

    const previousSlide = () => {
        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = SLIDERS.length - 1;
        }

        const previousItem = () => {
            if (currentSlide <= 0) {
                return SLIDERS.length - 1;
            }

            if (currentSlide + 1 > SLIDERS.length - 1) {
                return 0;
            }

            return currentSlide + 1;
        };

        if (SLIDERS.length > 1) {
            addClass(SLIDERS[previousItem()], "previous");
            addClass(SLIDERS[previousItem()], "backward");
            if (previousItem() === SLIDERS.length - 1 && currentSlide === 0) {
                addClass(SLIDERS[1], "previous");
                addClass(SLIDERS[1], "backward");
            }
            addClass(SLIDERS[currentSlide], "backward");
            addClass(SLIDERS[currentSlide], "current");
        }
    };

    const nextSlide = () => {
        currentSlide++;

        if (currentSlide >= SLIDERS.length) {
            currentSlide = 0;
        }

        const previousItem =
            currentSlide <= 0 ? SLIDERS.length - 1 : currentSlide - 1;

        if (SLIDERS.length > 1) {
            addClass(SLIDERS[previousItem], "previous");
            addClass(SLIDERS[currentSlide], "current");
        }
    };

    document.addEventListener("keydown", ev => {
        if (ev.keyCode === 37 || ev.keyCode === 40) {
            document.querySelector(".paginate-left").click();
        }
        if (ev.keyCode === 38 || ev.keyCode === 39) {
            document.querySelector(".paginate-right").click();
        }
    });

    SLIDER_PAGINATE_BUTTONS.forEach(button => {
        button.addEventListener("click", el => {
            SLIDERS.forEach(slider => {
                removeClass(slider, "current");
                removeClass(slider, "previous");
                removeClass(slider, "backward");
            });

            if (el.currentTarget.classList.contains("paginate-left")) {
                previousSlide();
            }

            if (el.currentTarget.classList.contains("paginate-right")) {
                nextSlide();
            }

            COUNTER.innerText = `${currentSlide + 1}/${SLIDERS.length}`;
        });
    });

    COUNTER.innerText = `${currentSlide + 1}/${SLIDERS.length}`;
})();
