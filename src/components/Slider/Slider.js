import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";

import "./Slider.css";

function getElementDimensions(ref) {
  const width = ref.current.clientWidth;
  const height = ref.current.clientHeight;
  return { width, height };
}

const Slider = (props) => {
  const { children, infinite } = props;
  const show = props.show || 1;

  const [currentIndex, setCurrnetIndex] = useState(infinite ? show : 0);

  const dimensions = useRef({ width: 0, height: 0 });
  const isDraging =
    useRef(false); /* Usefull when onMouseMove trigers only when draging */
  const startPos = useRef(0);
  const endPosition = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationRef = useRef(null);
  const sliderRef = useRef();
  const navRef = useRef();
  const canISlide =
    useRef(true); /* Ensures that extraPrev and extraNext are rendered */

  const setPositionByIndex = useCallback(
    (width = dimensions.current.width) => {
      currentTranslate.current = currentIndex * -width;
      prevTranslate.current = currentTranslate.current;
      setSliderPosition();
    },
    [dimensions.current, currentIndex]
  );

  function transitionOn() {
    sliderRef.current.style.transition = "transform 0.3s ease-out";
  }

  function transitionOff() {
    sliderRef.current.style.transition = "none";
  }

  // Set with on first render depending on show
  // Set postion by startIndex
  // No animation on startIndex
  useLayoutEffect(() => {
    sliderRef.current.style.width = `calc(100% / ${show})`;
    dimensions.current = getElementDimensions(sliderRef);

    setPositionByIndex(getElementDimensions(sliderRef).width);
  }, [setPositionByIndex]);

  // Add resize event listener
  useEffect(() => {
    function handleResize() {
      transitionOff();
      const { width, height } = getElementDimensions(sliderRef);
      dimensions.current = { width, height };
      setPositionByIndex(width);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setPositionByIndex]);

  function nextSlide() {
    if (canISlide.current) {
      if (infinite || currentIndex < children.length - show) {
        transitionOn();
        setCurrnetIndex((prevIndex) => (prevIndex += 1));
        setPositionByIndex();
      }
    }
    canISlide.current = false;
  }

  function prevSlide() {
    if (canISlide.current) {
      if (infinite || currentIndex > 0) {
        transitionOn();
        setCurrnetIndex((prevIndex) => (prevIndex -= 1));
        setPositionByIndex();
      }
    }
    canISlide.current = false;
  }

  function touchStart(e) {
    transitionOn();
    startPos.current = getPositionX(e);
    isDraging.current = true;
    animationRef.current = requestAnimationFrame(animation);
    sliderRef.current.style.cursor = "grabbing";
  }

  function touchMove(e) {
    if (isDraging.current) {
      transitionOff();
      const currentPos = getPositionX(e);
      currentTranslate.current =
        prevTranslate.current + currentPos - startPos.current;
    }
  }

  function touchEnd(e) {
    if (isDraging.current) {
      cancelAnimationFrame(animationRef.current);
      transitionOn();
      isDraging.current = false;

      const movedBy = currentTranslate.current - prevTranslate.current;

      if (movedBy < -100) nextSlide();

      if (movedBy > 100) prevSlide();

      setPositionByIndex();
      sliderRef.current.style.cursor = "grab";
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
    sliderRef.current.style.transform = `translate(${currentTranslate.current}px)`;
  }

  /* Render navigation buttons depending on lenght and show*/
  function rnederNavigation() {
    const output = [];
    for (let i = 0; i <= Math.ceil(children.length - show); i++) {
      output.push(
        <button
          onClick={() => {
            setCurrnetIndex(i);
            transitionOn();
            setPositionByIndex();
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
    for (let i = 0; i <= show; i++) {
      output.push(children[children.length - 1 - i]);
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

  function handleTransitionEnd() {
    if (infinite) {
      if (currentIndex == 0) {
        transitionOff();
        setCurrnetIndex(children.length);
      } else if (currentIndex == children.length + show) {
        transitionOff();
        setCurrnetIndex(show);
      }
    }
    canISlide.current = true;
  }

  // renderExtraPrev();

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
      >
        {infinite &&
          renderExtraPrev().map((element, i) => (
            <div className="slides" key={i}>
              {element}
            </div>
          ))}

        {children.map((child, index) => (
          <div className="slides" key={index}>
            {child}
          </div>
        ))}

        {infinite &&
          renderExtraNext().map((element, i) => (
            <div className="slides" key={i}>
              {element}
            </div>
          ))}
      </div>
      {(infinite || currentIndex > 0) && (
        <button className="prev" onClick={prevSlide}>
          <i className="fas fa-caret-left" />
        </button>
      )}
      {(infinite || currentIndex < children.length - show) && (
        <button className="next" onClick={nextSlide}>
          <i className="fas fa-caret-right" />
        </button>
      )}

      {!infinite && (
        <div ref={navRef} className="navigation">
          {rnederNavigation()}
        </div>
      )}
    </div>
  );
};

export default Slider;
