import React, { useState, useEffect, useRef, useLayoutEffect } from "react";

import "./Slider.css";

const Slider = (props) => {
  const { children, infinite } = props;
  const show = props.show || 1; //Default show is 1 slide

  const [length, setLength] = useState(children.length);
  const [currentIndex, setCurrnetIndex] = useState(infinite ? show : 0);

  const width = useRef(0);
  const isDragging = useRef(false); /* onMouseMove trigers only when draging */
  const startPos = useRef(0);
  const startTime = useRef(0);
  const endTime = useRef(0);
  const direction = useRef(0);
  const currentPosition = useRef(0);
  const prevPosition = useRef(0);
  const animationRef = useRef(null);
  const sliderRef = useRef();
  const canISlide =
    useRef(true); /* Ensures that extraPrev and extraNext are rendered */

  // Set with on first render depending on show
  // Update position by index
  useLayoutEffect(() => {
    sliderRef.current.style.width = `calc(100% / ${show})`;
    width.current = sliderRef.current.clientWidth;
    updatePosByIndex();
  }, [updatePosByIndex]);

  // Update the index on props change
  useEffect(() => {
    setLength(children.length);
    setCurrnetIndex(infinite ? show : 0);
  }, [children, infinite, show]);

  // Add resize event listener
  useEffect(() => {
    function handleResize() {
      transitionOff();
      width.current = sliderRef.current.clientWidth;
      updatePosByIndex();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updatePosByIndex]);

  // Functions
  function transitionOn() {
    sliderRef.current.style.transition = "transform 0.3s ease-out";
  }

  function transitionOff() {
    sliderRef.current.style.transition = "none";
  }

  function nextSlide() {
    if (canISlide.current) {
      if (infinite || currentIndex < length - show) {
        transitionOn();
        setCurrnetIndex((prevIndex) => (prevIndex += 1));
      }
    }
    canISlide.current = false;
  }

  function prevSlide() {
    if (canISlide.current) {
      if (infinite || currentIndex > 0) {
        transitionOn();
        setCurrnetIndex((prevIndex) => (prevIndex -= 1));
      }
    }
    canISlide.current = false;
  }

  function touchStart(e) {
    transitionOff();

    startTime.current = Date.now();

    startPos.current = getPositionX(e);

    isDragging.current = true;

    animationRef.current = requestAnimationFrame(animation);

    prevPosition.current = currentPosition.current;

    sliderRef.current.style.cursor = "grabbing";
  }

  function touchMove(e) {
    if (isDragging.current) {
      const moveEndPos = getPositionX(e);
      currentPosition.current =
        prevPosition.current + moveEndPos - startPos.current;
    }
  }

  function touchEnd() {
    if (isDragging.current) {
      cancelAnimationFrame(animationRef.current);
      transitionOn();
      isDragging.current = false;

      endTime.current = Date.now();

      const distance = currentPosition.current - prevPosition.current;

      /* Go to the next or prev slide if the dragMove speed 
      is less then 0.3s */
      const speed = endTime.current - startTime.current;

      if (distance < 0) direction.current = -1;
      if (distance > 0) direction.current = 1;

      if (
        distance <= -width.current / 2 ||
        (direction.current == -1 && speed < 300) //
      )
        nextSlide();

      if (
        distance > width.current / 2 ||
        (direction.current == 1 && speed < 300)
      )
        prevSlide();

      updatePosByIndex();
      sliderRef.current.style.cursor = "grab";
    }
  }

  function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }

  function animation() {
    setSliderPosition();
    if (isDragging.current) requestAnimationFrame(animation);
  }

  function updatePosByIndex() {
    currentPosition.current = currentIndex * -width.current;
    setSliderPosition();
  }

  function setSliderPosition() {
    sliderRef.current.style.transform = `translateX(${currentPosition.current}px)`;
  }

  /* Cheks the index and disables animation on first and last slide and 
  update the index depending on extraPrev and extraNext */
  function handleTransitionEnd() {
    if (infinite) {
      if (currentIndex == 0) {
        transitionOff();
        setCurrnetIndex(length);
      } else if (currentIndex == length + show) {
        transitionOff();
        setCurrnetIndex(show);
      }
    }
    canISlide.current = true;
  }
  /* Render navigation buttons depending on lenght and show */
  function rnederNavigation() {
    //Update the buttons number depending on infinite and show
    const index = infinite ? show : 0;
    const slides = infinite ? 0 : show;
    const output = [];
    for (let i = index; i <= length - slides + (infinite ? show - 1 : 0); i++) {
      output.push(
        <button
          onClick={() => {
            setCurrnetIndex(i);
            transitionOn();
          }}
          className={
            i === currentIndex ? "slide-selector active" : "slide-selector"
          }
          key={i}
        />
      );
    }
    return output;
  }

  function renderExtraPrev() {
    const output = [];
    for (let i = 0; i < show; i++) {
      output.push(children[length - 1 - i]);
    }
    return output.reverse();
  }

  function renderExtraNext() {
    const output = [];
    for (let i = 0; i < show; i++) {
      output.push(children[i]);
    }
    return output;
  }

  return (
    <div className="container">
      <div className="slider">
        <div
          className="slider-content"
          onDragStart={(e) => e.preventDefault()}
          onMouseDown={touchStart}
          onMouseMove={touchMove}
          onMouseUp={touchEnd}
          onMouseLeave={() => {
            if (isDragging.current) touchEnd();
          }}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
          onTransitionEnd={handleTransitionEnd}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          ref={sliderRef}
        >
          {infinite && renderExtraPrev().map((element) => element)}

          {children.map((child) => child)}

          {infinite && renderExtraNext().map((element) => element)}
        </div>

        {(infinite || currentIndex > 0) && (
          <button className="prev" onClick={prevSlide}>
            <i className="fas fa-caret-left" />
          </button>
        )}

        {(infinite || currentIndex < length - 1) && (
          <button className="next" onClick={nextSlide}>
            <i className="fas fa-caret-right" />
          </button>
        )}
      </div>
      <div className="navigation">{rnederNavigation()}</div>
    </div>
  );
};

export default Slider;
