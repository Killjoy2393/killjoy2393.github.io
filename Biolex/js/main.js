$(document).ready(function () {

  $(window).on('load', function () {
    var preloader = $('.preloader');
    preloader.delay(3000).fadeOut(500);
  });

  $('.header-menu__hamburger').click(function () {
    $('.header-main').animate({
      height: '100%'
    }, 500);
    $('.header').animate({
      height: '100%'
    }, 500);
    $(this).toggleClass('active');
    $('.production-wrap').addClass('active');
  });

  $('.close-head').on('click', function() {
    $('.header-menu__hamburger').removeClass('active');
    $('.header').animate({
      height: '0'
    }, 500);
    $('.header-main').animate({
      height: '0'
    }, 500);
    $('.production-wrap').removeClass('active');
  });

  $('.open').on('click', shForm);

  function shForm() {
    $(this).toggleClass('active');
    $('.main-form').toggleClass('active');
  };

  $('.close').on('click', hForm)

  function hForm() {
    $('.main-form').removeClass('active');
    $('.open').removeClass('active');
  }

  $('.owl-carousel').owlCarousel({
    center: true,
    items: 1,
    dots: false, 
    navContainer: '.production-nav'
  });

});