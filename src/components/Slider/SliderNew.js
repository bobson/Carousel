import React, { useState, useEffect, useRef, useLayoutEffect } from "react";

import "./Slider.css";

const SliderNew = (props) => {
  const { children } = props;

  const [slider, setSlider] = useState();
  const [width, setWidth] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderRef = useRef();
  const directionRef = useRef();
  const startPos = useRef(0);
  const isDraging = useRef(false);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationRef = useRef(null);

  useLayoutEffect(() => {
    setSlider(sliderRef.current);
    setWidth(sliderRef.current.clientWidth);
  }, [sliderRef]);

  useEffect(() => {
    function handleSize() {
      setWidth(sliderRef.current.clientWidth);
    }
    window.addEventListener("resize", handleSize);

    return () => width.removeEventListiner("resize", handleSize);
  }, []);

  function transitionOn() {
    slider.style.transition = "transform 0.3s ease-out";
  }

  function transitionOff() {
    slider.style.transition = "none";
  }

  function nextSlide() {
    if (directionRef.current == 1) {
      slider.prepend(slider.lastElementChild);
    }

    directionRef.current = -1;
    transitionOn();
    setCurrentIndex((prevState) => (prevState += 1));
    slider.style.justifyContent = "flex-start";
    slider.style.transform = `translate(-${width}px)`;
  }

  function prevSlide() {
    if (directionRef.current == -1) {
      slider.appendChild(slider.firstElementChild);
    }

    directionRef.current = 1;
    transitionOn();
    setCurrentIndex((prevState) => (prevState -= 1));
    slider.style.justifyContent = "flex-end";
    slider.style.transform = `translate(${width}px)`;
  }

  function touchStart(e) {
    // transitionOff();
    startPos.current = getPositionX(e);
    isDraging.current = true;
    animationRef.current = requestAnimationFrame(animation);
    slider.style.cursor = "grabbing";
    prevTranslate.current = currentTranslate.current;
  }

  function touchMove(e) {
    transitionOff();
    if (isDraging.current) {
      const currentPos = getPositionX(e);
      currentTranslate.current =
        prevTranslate.current + currentPos - startPos.current;
    }
  }

  function touchEnd() {
    if (isDraging.current) {
      cancelAnimationFrame(animationRef.current);
      transitionOn();
      isDraging.current = false;

      const movedBy = currentTranslate.current - prevTranslate.current;

      console.log(movedBy);

      if (movedBy < -100) nextSlide();

      if (movedBy > 100) prevSlide();
    }
  }

  function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }

  function animation() {
    setSliderPosition();
    if (isDraging.current) requestAnimationFrame(animation);
  }

  function setSliderPosition() {
    slider.style.transform = `translate(${currentTranslate.current}px)`;
  }

  function handleTransitionEnd() {
    if (directionRef.current == -1) {
      slider.appendChild(slider.firstElementChild);
    } else if (directionRef.current == 1) {
      slider.prepend(slider.lastElementChild);
    }

    transitionOff();
    slider.style.transform = "translate(0)";
    setTimeout(() => {
      transitionOn();
    });
  }
  //   console.log(slider);
  console.log(width);
  return (
    <div className="slider">
      <div
        className="slider-container"
        onDragStart={(e) => e.preventDefault()}
        onMouseDown={touchStart}
        onMouseMove={touchMove}
        onMouseUp={touchEnd}
        onMouseLeave={touchEnd}
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
        onTransitionEnd={handleTransitionEnd}
        ref={sliderRef}
        // style={{ transform: `translateX(${-width}px)` }}
      >
        {children.map((child, index) => (
          <div className="slides" key={index}>
            {child}
          </div>
        ))}
      </div>
      <button className="prev" onClick={prevSlide}>
        <i className="fas fa-caret-left" />
      </button>

      <button className="next" onClick={nextSlide}>
        <i className="fas fa-caret-right" />
      </button>

      {/* <div className="navigation">{rnederNavigation()}</div> */}
    </div>
  );
};

export default SliderNew;
