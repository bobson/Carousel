import React from "react";
import { render } from "react-dom";

import Carousel from "./components/Carousel";

const carouselImages = [
  "https://picsum.photos/400",
  "https://picsum.photos/401",
  "https://picsum.photos/402",
  "https://picsum.photos/403",
  "https://picsum.photos/404",
];

const App = () => {
  return (
    <Carousel show={3}>
      {carouselImages.map((image, i) => (
        <img src={image} key={i} alt="slide" />
      ))}
    </Carousel>
  );
};

render(<App />, document.getElementById("App"));
