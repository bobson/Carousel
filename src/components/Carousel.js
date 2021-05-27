import React, { useState, useEffect, useRef } from "react";

import "./Carousel.css";

const Carousel = (props) => {
  const { children, infinite } = props;
  const show = props.show || 1;

  const [index, setIndex] = useState(infinite ? show : 0);
  const [length, setLength] = useState(children.length);
  const [looping, setLooping] = useState(infinite && children.length > show);
  const [transition, setTransition] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [width, setWidth] = useState(null);
  const [canISlide, setCanISlide] = useState(true);

  const slideRef = useRef();

  useEffect(() => {
    setLength(children.length);
    setLooping(infinite && children.length > show);
  }, [children, infinite, show]);

  useEffect(() => {
    if (looping) {
      if (index === show || index === length) {
        setTransition(true);
      }
    }
  }, [index, looping, show, length]);

  function nextSlide() {
    // if (canISlide) {
    if (looping || index < length - show) {
      setIndex((prevState) => prevState + 1);
    }
    // }
    // setCanISlide(false);
    // sets the index to next if you are not on the last slide
  }

  function prevSlide() {
    // if (canISlide) {
    if (looping || index > 0) {
      setIndex((prevState) => prevState - 1);
    }
    // }
    // setCanISlide(false);
    // sets the index to be the previous if you are further than first slide
  }

  function handleSwipeStart(e) {
    setTouchStart(e.touches[0].clientX);
    setWidth(slideRef.current.children[0].width);
    console.log(slideRef.current.children[0].width);
  }

  function handleSwipeEnd(e) {
    const touchDown = touchStart;

    if (touchDown === null) return;

    const currentTouch = e.changedTouches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) nextSlide();
    if (diff < 5) prevSlide();

    setTouchStart(0);
  }

  function handleTransitionEnd() {
    if (looping) {
      if (index == 0) {
        setTransition(false);
        setIndex(length);
      } else if (index === length + show) {
        setTransition(false);
        setIndex(show);
      }
    }
    setCanISlide(true);
  }

  function renderExtraPrev() {
    let output = [];
    for (let i = 0; i < show; i++) {
      output.push(children[length - 1 - i]);
    }
    output.reverse();
    return output;
  }

  function renderExtraNext() {
    let output = [];
    for (let i = 0; i < show; i++) {
      output.push(children[i]);
    }
    return output;
  }

  function rnederNavigation() {
    /* Navigation buttons depending on lenght and show*/
    const output = [];
    for (let i = 0; i <= Math.ceil(length - show); i++) {
      output.push(
        <button
          onClick={() => setIndex(i)}
          className={i === index ? "slide-selector active" : "slide-selector"}
          key={i}
        />
      );
    }
    return output;
  }

  return (
    <div className="carousel">
      <div className="carousel-container">
        <div
          className="slides-wrapper"
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
        >
          <div
            className={`slides-content show-${show}`}
            style={{
              transform: `translateX(-${
                index * (show != 2 ? 100 / show : 100)
              }%)`,
              transition: !transition ? "none" : undefined,
            }}
            onTransitionEnd={() => handleTransitionEnd()}
            ref={slideRef}
          >
            {length > show && looping && renderExtraPrev()}
            {children}
            {length > show && looping && renderExtraNext()}
          </div>
        </div>
        {(looping || index > 0) && (
          <button className="prev" onClick={prevSlide}>
            <i className="fas fa-caret-left" />
          </button>
        )}
        {(looping || index < length - show) && (
          <button className="next" onClick={nextSlide}>
            <i className="fas fa-caret-right" />
          </button>
        )}
        {!looping && <div className="navigation">{rnederNavigation()}</div>}
      </div>
    </div>
  );
};

export default Carousel;
