// @ts-nocheck
"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function CarouselSlider({
  children,
  slidesToShow,
  itemLg,
  itemMd,
  itemSm,
  slidesToScroll,
  scrollLg,
  scrollMd,
  scrollSm,
  breakMd,
  autoplay,
  autoplaySpeed,
}) {
  var settings = {
    infinite: true,
    speed: 500,
    autoplaySpeed: autoplaySpeed || 2000,
    autoplay: autoplay,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: itemLg,
          slidesToScroll: scrollLg,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: breakMd,
        settings: {
          slidesToShow: itemMd,
          slidesToScroll: scrollMd,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings}>{children} </Slider>
    </div>
  );
}
