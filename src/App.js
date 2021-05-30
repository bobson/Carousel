import React from "react";
import { render } from "react-dom";

import Slider from "./components/Slider/Slider";

import "./App.css";

const carouselImages = [
  "https://picsum.photos/400",
  "https://picsum.photos/401",
  "https://picsum.photos/402",
  "https://picsum.photos/403",
  "https://picsum.photos/404",
];

const App = () => {
  return (
    <>
      <h1>Carousel component made by Slobodan</h1>
      <Slider>
        {carouselImages.map((image, i) => (
          <img src={image} key={i} alt="slide" />
        ))}
      </Slider>
    </>
  );
};

render(<App />, document.getElementById("App"));
