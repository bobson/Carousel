# react touch drag carousel component

- Touch finger-following animated swipes on mobile
- Works for any HTML content
- Responsive to viewport resizing
- Mouse drag and scrolling to a selected slide
- Supports infinite option
- Supports multiple slides on the screen
- Using Parcel for bundling - zero configuration out of the box

## Instal dependendencies

```bash
git clone https://github.com/bobson/Carousel.git
 ... go to cloned file and run...
npm i
  or
yarn
```

## Run development server

```bash
npm run dev
  or
yarn dev
```

## Go to demo page

```bash
https://carousel-finger-folow.netlify.app/

On the demo page you can set the props dinamcly but on development
you can add infinite and show props on Slider component
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
    <Slider>
      {carouselImages.map((image, i) => (
        <img src={image} key={i} alt="slide" />
      ))}
    </Slider>
    // or
    <Slider infinite show={2}>
      {carouselImages.map((image, i) => (
        <img src={image} key={i} alt="slide" />
      ))}
    </Slider>
  );
};

render(<App />, document.getElementById("App"));
```

## Available Props

| Prop     | Type    | Default | Description                                                  |
| -------- | ------- | ------- | ------------------------------------------------------------ |
| infinite | boolean | false   | Going after the last item will move back to the first slide. |
| show     | number  | 1       | Number of slides to be shown on the screen                   |
