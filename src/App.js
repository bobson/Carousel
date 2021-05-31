import React, { useState } from "react";
import { render } from "react-dom";

import Slider from "./components/Slider/Slider";

import img1 from "./images/0.jpg";
import img2 from "./images/1.jpg";
import img3 from "./images/2.jpg";
import img4 from "./images/3.jpg";
import img5 from "./images/4.jpg";

import "./App.css";

const carouselImages = [img1, img2, img3, img4, img5];

const App = () => {
  const [infinite, setInfinite] = useState(false);
  const [show, setShow] = useState(1);

  return (
    <>
      <h1>Carousel component made by Slobodan</h1>
      <Slider infinite={infinite} show={show}>
        {carouselImages.map((image, i) => (
          <div key={image}>
            <h1 style={{ color: "magetnta" }}>Slide {i + 1}</h1>
            <img src={image} alt="slide" />
          </div>
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
