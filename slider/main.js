'use strict';

let slideItems    = document.querySelectorAll('.slides .slide'),
    indContainer  = document.querySelector('.indicators'),
    indItems      = document.querySelectorAll('.indicators-item'),
    currentSlide  = 0;

const LEFT_ARROW  = 37,
      RIGHT_ARROW = 39,
      SPACE       = 32,
      FA_PAUSE    = '<i class="far fa-play-circle"></i>',
      FA_PLAY     = '<i class="far fa-pause-circle"></i>';

indContainer.style.display = 'flex';
document.querySelector('.controls').style.display = 'flex'; 

let gotoSlide = (n) => {
  slideItems[currentSlide].classList.toggle('active');
  indItems[currentSlide].classList.toggle('active');
  currentSlide = (n + slideItems.length) % slideItems.length;
  slideItems[currentSlide].classList.toggle('active');
  indItems[currentSlide].classList.toggle('active');
};

let nextSlide = () => {
  gotoSlide(currentSlide + 1);
};

let previousSlide = () => {
  gotoSlide(currentSlide - 1);
};

let pauseSlideShow = () => {
  pauseBtn.innerHTML = FA_PAUSE;
  playbackStatus = false;
  clearInterval(slideInterval);
};

let playSlideShow = () => {
  pauseBtn.innerHTML = FA_PLAY;
  playbackStatus = true;
  slideInterval = setInterval(nextSlide, 2000);
};

let slideInterval = setInterval(nextSlide, 2000);

let playbackStatus = true,
    pauseBtn = document.querySelector('#pause'),
    nextBtn  = document.querySelector('#next'),
    prevBtn  = document.querySelector('#previous');

let pauseClickHandler = () => {
  playbackStatus ? pauseSlideShow() : playSlideShow();
};

let nextClickHandler = () => {
  pauseSlideShow();
  nextSlide();
};

let prevClickHandler = () => {
  pauseSlideShow();
  previousSlide();
};

pauseBtn.addEventListener('click', pauseClickHandler);
nextBtn.addEventListener('click', nextClickHandler);
prevBtn.addEventListener('click', prevClickHandler);


let indClickHandler = (e) => {
  let target = e.target;

  if ( target.classList.contains('indicators-item') ) {
    let n = +target.getAttribute('data-slide-to');
    pauseSlideShow();
    gotoSlide(n);
  }
};

indContainer.addEventListener('click', indClickHandler);

let keyControlHandler = (e) => {
  if (e.keyCode === LEFT_ARROW) { prevClickHandler(); }
  if (e.keyCode === RIGHT_ARROW) { nextClickHandler(); }
  if (e.keyCode === SPACE) { pauseClickHandler(); }
};

document.addEventListener('keydown', keyControlHandler)