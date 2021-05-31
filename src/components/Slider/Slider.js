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
  const show = props.show || 1; //Default show is 1 slide

  const [length, setLength] = useState(children.length);

  const [currentIndex, setCurrnetIndex] = useState(infinite ? show : 0);

  const dimensions = useRef({ width: 0, height: 0 });
  const isDraging = useRef(false); /* onMouseMove trigers only when draging */
  const startPos = useRef(0);
  const startTime = useRef(0);
  const endTime = useRef(0);
  const direction = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationRef = useRef(null);
  const sliderRef = useRef();
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

  // Update the index depending on props
  useEffect(() => {
    setLength(children.length);
    setCurrnetIndex(infinite ? show : 0);
  }, [children, infinite, show]);

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
      if (infinite || currentIndex < length - show) {
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
    transitionOff();
    startTime.current = Date.now();
    startPos.current = getPositionX(e);
    isDraging.current = true;
    animationRef.current = requestAnimationFrame(animation);
    sliderRef.current.style.cursor = "grabbing";
  }

  function touchMove(e) {
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

      endTime.current = Date.now();

      const distance = currentTranslate.current - prevTranslate.current;

      /* Go to the next or prev slide if the dragMove speed 
      is less then 0.3s */
      const speed = endTime.current - startTime.current;

      if (distance < 0) direction.current = -1;
      if (distance > 0) direction.current = 1;

      if (
        distance < -dimensions.current.width / 2 ||
        (direction.current == -1 && speed < 300) //
      )
        nextSlide();

      if (
        distance > dimensions.current.width / 2 ||
        (direction.current == 1 && speed < 300)
      )
        prevSlide();

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
    sliderRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  }

  /* Cheks the index and disables animation on first and last slide and 
  update the index not to go outside the length */
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

      <div className="navigation">{rnederNavigation()}</div>
    </div>
  );
};

export default Slider;
