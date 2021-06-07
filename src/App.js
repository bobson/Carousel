import React, { useState, useContext } from "react";
import { render } from "react-dom";

import Slider from "./components/Slider/Slider";

import img1 from "./images/0.jpg";
import img2 from "./images/1.jpg";
import img3 from "./images/2.jpg";
import img4 from "./images/3.jpg";
import img5 from "./images/4.jpg";

import "./App.css";

import PropsContextProvider from "./components/Slider/SliderContext";
import { SliderContext } from "./components/Slider/SliderContext";

const carouselImages = [img1, img2, img3, img4, img5];

const App = () => {
  const sliderCtx = useContext(SliderContext);
  const { infinite, autoPlay, infiniteHandler, showHandler, autoPlayHandler } =
    sliderCtx;

  return (
    <>
      <h1>Carousel component made by Slobodan</h1>
      <Slider>
        {carouselImages.map((image, i) => (
          <img src={image} key={i} alt="slide" />
        ))}
      </Slider>
      <div className="slider-props">
        <div className="infinite-prop">
          <button onClick={infiniteHandler} disabled={autoPlay}>
            {infinite ? "Not Infinite Loop" : "Infinite Loop"}
          </button>
        </div>
        <div className="infinite-prop">
          <button onClick={autoPlayHandler}>
            {autoPlay ? "Stop Auto Play" : "Auto Play"}
          </button>
        </div>
        <div className="show-prop">
          <h3>Slides to show</h3>
          <select onChange={(e) => showHandler(parseInt(e.target.value))}>
            {carouselImages.map(
              (option, i) =>
                i < carouselImages.length - 1 && (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
            )}
          </select>
        </div>
      </div>
    </>
  );
};

render(
  <PropsContextProvider>
    <App />
  </PropsContextProvider>,
  document.getElementById("App")
);
