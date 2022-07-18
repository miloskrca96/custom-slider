document.addEventListener("DOMContentLoaded", () => {
  // SWIPER PARAMS
  const AUTOPLAY = 0; // 0 - disabled 1 - enabled
  const ARROWS = 1; // 0 - disabled 1 - enabled

  const swiperContainer = document.querySelectorAll(".slider__container")[0];
  const slidesWrapper = document.querySelectorAll(".slider__wrapper")[0];
  const swiperPagantion = document.querySelectorAll(".slider__pagination")[0];
  const swiperSlides = document.querySelectorAll(".slide");
  const arrowRight = document.querySelector(".arrow-right");
  const arrowLeft = document.querySelector(".arrow-left");
  const numOfSlides = swiperSlides.length;
  const num = swiperContainer.offsetWidth * numOfSlides;

  // HELPER VARIABLES FOR MOUSE, TOUCH SWIPE
  let isDown = false;
  let mousePosition;
  let offset = 0;
  let distanceSwiped;

  let sliderPaginationIndicator = document.querySelectorAll(
    ".slider__pagination-indicator"
  )[0];
  let messageBox = document.querySelectorAll(".slider__message-box")[0];
  let swipeInterval =
    AUTOPLAY == 1 ? setInterval(changeSlideAutoplay, 1800) : null;
  slidesWrapper.style.setProperty("width", `${num}px`);

  setPaginationIndicator(numOfSlides, 1, sliderPaginationIndicator);
  setHeight(messageBox);

  // INITIAL STATE FOR ARROWS
  if (ARROWS === 1) {
    arrowRight.addEventListener("click", () => {
      swipeAndResetInterval(
        numOfSlides,
        sliderPaginationIndicator,
        messageBox,
        slidesWrapper,
        swiperContainer,
        slideRight
      );
    });

    arrowLeft.addEventListener("click", () => {
      swipeAndResetInterval(
        numOfSlides,
        sliderPaginationIndicator,
        messageBox,
        slidesWrapper,
        swiperContainer,
        slideLeft
      );
    });
    arrowLeft.classList.add("hidden");
  } else {
    arrowLeft.classList.add("hidden");
    arrowRight.classList.add("hidden");
  }

  // Adding swipe behavior, and setting width of slides
  swiperSlides.forEach((elem) => {
    // Initial first slide is current
    if (elem.dataset.slideIndex == 0) {
      elem.classList.add("current-slide");
    }

    // Setting width of slides
    elem.style.setProperty("width", `${swiperContainer.offsetWidth}px`);

    // Mouse events for descktop, and touch events for mobile
    ["mousedown", "touchstart"].forEach((eventN) => {
      elem.addEventListener(`${eventN}`, (event) => {
        if (event.cancelable) event.preventDefault();
        isDown = true;
        distanceSwiped = 0;
        slidesWrapper.style.setProperty("transition-duration", "0ms");
        offset =
          eventN === "mousedown" ? event.clientX : event.touches[0].clientX;
      });
    });

    ["mouseup", "touchend"].forEach((eventN) => {
      elem.addEventListener(`${eventN}`, (event) => {
        if (event.cancelable) event.preventDefault();

        isDown = false;
        slidesWrapper.style.setProperty("transition-duration", "800ms");

        if (distanceSwiped > 100) {
          swipeAndResetInterval(
            numOfSlides,
            sliderPaginationIndicator,
            messageBox,
            slidesWrapper,
            swiperContainer,
            slideRight
          );
        } else if (distanceSwiped < -100) {
          swipeAndResetInterval(
            numOfSlides,
            sliderPaginationIndicator,
            messageBox,
            slidesWrapper,
            swiperContainer,
            slideLeft
          );
        } else {
          const finalNum =
            parseInt(elem.dataset.slideIndex) * swiperContainer.offsetWidth;
          slidesWrapper.style.setProperty(
            "transform",
            `translate3d(${-finalNum}px, 0, 0)`
          );
        }

        slidesWrapper.style.setProperty("transition-duration", "0");
      });
    });

    ["mousemove", "touchmove"].forEach((eventN) => {
      elem.addEventListener(`${eventN}`, (event) => {
        if (event.cancelable) event.preventDefault();
        if (isDown) {
          mousePosition =
            eventN === "mousemove" ? event.clientX : event.touches[0].clientX;

          distanceSwiped = offset - mousePosition;
          const finalNum =
            parseInt(elem.dataset.slideIndex) * swiperContainer.offsetWidth +
            distanceSwiped;
          slidesWrapper.style.setProperty(
            "transform",
            `translate3d(${-finalNum}px, 0, 0)`
          );

          // Trigger event when mouse is outside of container
          if (
            swiperContainer.getBoundingClientRect().left >=
              mousePosition - 20 ||
            swiperContainer.getBoundingClientRect().right <= mousePosition + 20
          ) {
            const ev = new Event("mouseup");
            elem.dispatchEvent(ev);
          }
        }
      });

      messageBox.addEventListener(`${eventN}`, (event) => {
        if (event.cancelable) event.preventDefault();
        if (isDown) {
          const ev = new Event("mouseup");
          elem.dispatchEvent(ev);
          isDown = false;
        }
      });
    });
  });

  // Adding bullets dynamically width classes and behaviors
  for (let i = 0; i < numOfSlides; i++) {
    // Classes
    const classes =
      i == 0 ? ["pagination__bullet", "active-bullet"] : ["pagination__bullet"];
    let elem = document.createElement("span");

    elem.classList.add(...classes);
    elem.dataset.index = i;

    // Behavior
    elem.addEventListener("click", () => {
      const currentSlide = document.querySelectorAll(
        `[data-slide-index="${i}"]`
      )[0];

      if (AUTOPLAY == 1) clearInterval(swipeInterval);
      changeSlide(
        currentSlide,
        elem,
        numOfSlides,
        sliderPaginationIndicator,
        messageBox,
        slidesWrapper,
        swiperContainer
      );
      if (AUTOPLAY == 1) swipeInterval = setInterval(changeSlideAutoplay, 1800);
    });

    // Append element to parent
    swiperPagantion.appendChild(elem);
  }

  //----------------------------------------------------------------------------------------------
  // HELPER FUNCTION
  //----------------------------------------------------------------------------------------------

  // AUTOPLAY FUNCTION
  function changeSlideAutoplay() {
    // Autoplay function that is called at intervals to change slides when autoplay is enabled, always slide to right
    slideRight(
      numOfSlides,
      sliderPaginationIndicator,
      messageBox,
      slidesWrapper,
      swiperContainer
    );
  }

  // FUNCTION TO SLIDE LEFT
  function slideLeft(
    numOfSlides,
    sliderPaginationIndicator,
    messageBox,
    slidesWrapper,
    swiperContainer
  ) {
    // Getting the next active slide, in this case the previous one
    const previousSlide =
      document.querySelectorAll(".current-slide")[0].previousElementSibling;
    // Getting the next active bullet, in this case the previous one
    const previousBullet =
      document.querySelectorAll(".active-bullet")[0].previousElementSibling;

    // Function which change active slide, bullet, pagination indicator and text in text box
    changeSlide(
      previousSlide,
      previousBullet,
      numOfSlides,
      sliderPaginationIndicator,
      messageBox,
      slidesWrapper,
      swiperContainer
    );
  }

  // FUNCTION TO SLIDE RIGHT
  function slideRight(
    numOfSlides,
    sliderPaginationIndicator,
    messageBox,
    slidesWrapper,
    swiperContainer
  ) {
    // Getting the next active slide, in this case the next one
    const nextSlide =
      document.querySelectorAll(".current-slide")[0].nextElementSibling;
    // Getting the next active bullet, in this case the next one
    const nextBullet =
      document.querySelectorAll(".active-bullet")[0].nextElementSibling;

    // Function which change active slide, bullet, pagination indicator and text in text box
    changeSlide(
      nextSlide,
      nextBullet,
      numOfSlides,
      sliderPaginationIndicator,
      messageBox,
      slidesWrapper,
      swiperContainer
    );
  }

  // When autoplay is enabled, it is necessary to reset the interval when the slides are changed mechanically
  function swipeAndResetInterval(
    numOfSlides,
    sliderPaginationIndicator,
    messageBox,
    slidesWrapper,
    swiperContainer,
    swipeFunc
  ) {
    // Stop interval
    if (AUTOPLAY == 1) clearInterval(swipeInterval);
    // Call function which is send as parameter
    swipeFunc(
      numOfSlides,
      sliderPaginationIndicator,
      messageBox,
      slidesWrapper,
      swiperContainer
    );
    // Start interval
    if (AUTOPLAY == 1) swipeInterval = setInterval(changeSlideAutoplay, 1800);
  }

  function changeSlide(
    slideToShow,
    bulletToActive,
    numOfSlides,
    sliderPaginationIndDiv,
    messageBoxDiv,
    sliderWrapperDiv,
    swiperContainerDiv
  ) {
    if (slideToShow == null) {
      if (AUTOPLAY == 0) {
        /* If autoplay is disabled when end is reached it is not posible to go right, also if first
                slide is active it is not posible to go left */
        slideToShow = document.querySelectorAll(".current-slide")[0];
        bulletToActive = document.querySelectorAll(".active-bullet")[0];
      } else {
        // If autoplay is enabled when the last slide is reached the next slide will be the first
        slideToShow = document.querySelectorAll(".slide")[0];
        bulletToActive = document.querySelectorAll(".pagination__bullet")[0];
      }
    }

    // Show / Hide arrows, based on current slide index
    if (ARROWS == 1) {
      if (parseInt(slideToShow.dataset.slideIndex) === 0) {
        arrowLeft.classList.add("hidden");
        if (arrowRight.classList.contains("hidden"))
          arrowRight.classList.remove("hidden");
      } else if (parseInt(slideToShow.dataset.slideIndex) === numOfSlides - 1) {
        arrowRight.classList.add("hidden");
        if (arrowLeft.classList.contains("hidden"))
          arrowLeft.classList.remove("hidden");
      } else {
        if (arrowLeft.classList.contains("hidden"))
          arrowLeft.classList.remove("hidden");
        if (arrowRight.classList.contains("hidden"))
          arrowRight.classList.remove("hidden");
      }
    }

    // Number that indicates how much slider wrapper need to be translated
    const num = slideToShow.dataset.slideIndex * swiperContainerDiv.offsetWidth;

    if (slideToShow !== document.querySelectorAll(".current-slide")[0]) {
      // HELPER FUNCTIONS CALLS
      changeActiveState(slideToShow, "current-slide");
      changeActiveState(bulletToActive, "active-bullet");
      setPaginationIndicator(
        numOfSlides,
        parseInt(slideToShow.dataset.slideIndex) + 1,
        sliderPaginationIndDiv
      );
      changeBoxText(messageBoxDiv, slideToShow);
    }

    // Transition that allows the slides to move naturally
    sliderWrapperDiv.style.setProperty("transition-duration", "800ms");
    sliderWrapperDiv.style.setProperty(
      "transform",
      `translate3d(${-num}px, 0, 0)`
    );
    sliderWrapperDiv.style.setProperty("transition-duration", "0");
  }

  // Function that set active state for slide and pagination bullets
  function changeActiveState(elem, className) {
    if (!elem.classList.contains(`${className}`)) {
      const currEl = document.querySelectorAll(`.${className}`)[0];
      // Remove from current
      currEl.classList.remove(`${className}`);

      // Set to new element
      elem.classList.add(`${className}`);
    }
  }

  // Function that set height of box with message and change text with animation
  function changeBoxText(elem, currentSlide) {
    // Getting text from data-text parameter
    const newText = currentSlide.dataset.text;
    elem.children[0].style.setProperty("opacity", 0);

    // New text and new height of elem
    setTimeout(() => {
      elem.children[0].innerText = newText;
      setHeight(elem);
    }, 800);

    setTimeout(() => {
      elem.children[0].style.setProperty("opacity", 1);
    }, 1000);
  }

  // Function that set height of message box container based on padding and text inside
  function setHeight(elem) {
    // PADDING TOP AND BOTTOM 20px
    const num = 2 * 20 + elem.children[0].offsetHeight;
    elem.style.setProperty("height", `${num}px`);
  }

  // A function that sets a value in the part that refers to the sequence number of the current slide
  function setPaginationIndicator(num, current, el) {
    const currentStr = current < 10 ? "0" + current : current;
    const finalStr = num < 10 ? "0" + num : num;
    el.innerText = `${currentStr} / ${finalStr}`;
  }
});
