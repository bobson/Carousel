import React, { useState } from "react";
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
  const [infinite, setInfinite] = useState(false);
  const [show, setShow] = useState(1);

  return (
    <>
      <h1>Carousel component made by Slobodan</h1>
      <Slider infinite={infinite} show={show}>
        {carouselImages.map((image, i) => (
          <img src={image} key={i} alt="slide" />
        ))}
      </Slider>
      <div className="slider-props">
        <div className="infinite-prop">
          <button onClick={() => setInfinite((prevState) => !prevState)}>
            {infinite ? "Click for NOT Infinite" : "Click for Infinite"}
          </button>
        </div>
        <div className="show-prop">
          <h3>Slides to show</h3>
          <select onChange={(e) => setShow(parseInt(e.target.value))}>
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

render(<App />, document.getElementById("App"));
