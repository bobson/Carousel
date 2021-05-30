# react touch drag carousel component

- Touch finger-following animated swipes on mobile
- Works for any HTML content
- Responsive to viewport resizing
- Supports mouse drag by default
- Supports infinite option
- Supports multiple slides on the screen
- Supports scrolling to a selected slide

## Instal dependendencies

```bash
npm i
or
yarn
```

## Run development

```bash
npm run dev
or
yarn dev
```

## Usage

```jsx
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

// here we are downloading some images
// but the Slider children can be an array of any HTML elements

const App = () => {
  return (
    <Slider infinite={infinite} show={2}>
      {carouselImages.map((image, i) => (
        <img src={image} key={i} alt="slide" />
      ))}
    </Slider>
  );
};

render(<App />, document.getElementById("App"));
```
