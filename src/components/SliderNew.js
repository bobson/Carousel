import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";

import "./slider.css";

function getElementDimensions(ref) {
  const width = ref.current.clientWidth;
  const height = ref.current.clientHeight;
  return { width, height };
}

const SliderNew = (props) => {
  const { children } = props;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentIndex, setCurrnetIndex] = useState(0);

  const isDraging = useRef(false);
  const startPos = useRef(0);
  const currentPosition = useRef(0);
  const prevPosition = useRef(0);
  const animationRef = useRef(null);
  // const currentIndex = useRef(0);
  const sliderRef = useRef();
  const navRef = useRef();

  console.log("new render");

  const setPositionByIndex = useCallback(
    (width = dimensions.width) => {
      currentPosition.current = currentIndex * -width;
      prevPosition.current = currentPosition.current;

      setSliderPosition();
    },
    [dimensions.width, currentIndex]
  );

  function transitionOn() {
    sliderRef.current.style.transition = "transform 0.3s ease-out";
  }

  function transitionOff() {
    sliderRef.current.style.transition = "none";
  }

  // Set with on first render
  // Set postion by startIndex
  // No animation on startIndex
  useLayoutEffect(() => {
    setDimensions(getElementDimensions(sliderRef));

    setPositionByIndex(getElementDimensions(sliderRef).width);
  }, [setPositionByIndex]);

  // Add resize event listener
  useEffect(() => {
    function handleResize() {
      transitionOff();
      const { width, height } = getElementDimensions(sliderRef);
      setDimensions({ width, height });
      setPositionByIndex(width);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setPositionByIndex]);

  function touchStart(index) {
    return (e) => {
      transitionOn();
      // currentIndex.current = index;
      setCurrnetIndex(index);
      startPos.current = getPositionX(e);
      isDraging.current = true;
      animationRef.current = requestAnimationFrame(animation);
      sliderRef.current.style.cursor = "grabbing";
    };
  }

  function touchMove(e) {
    if (isDraging.current) {
      const currentPos = getPositionX(e);
      currentPosition.current =
        prevPosition.current + currentPos - startPos.current;
    }
  }

  function touchEnd() {
    if (isDraging.current) {
      transitionOn();
      cancelAnimationFrame(animationRef.current);
      isDraging.current = false;

      const movedBy = currentPosition.current - prevPosition.current;

      if (movedBy <= -100) {
        if (currentIndex < children.length - 1) {
          // currentIndex.current += 1;
          setCurrnetIndex((prevIndex) => (prevIndex += 1));
        } else {
          transitionOff();
          // currentIndex.current = 0;
          setCurrnetIndex(0);
        }
      }

      if (movedBy > 100 && currentIndex > 0) {
        // currentIndex.current -= 1;
        setCurrnetIndex((prevIndex) => (prevIndex -= 1));
      }

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
    sliderRef.current.style.transform = `translate(${currentPosition.current}px)`;
  }

  /* Render navigation buttons depending on lenght and show*/
  function rnederNavigation() {
    const output = [];
    for (let i = 0; i <= children.length - 1; i++) {
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

  return (
    <div className="slider">
      <div className="slider-container" ref={sliderRef}>
        {children.map((child, index) => (
          <div
            className="slides"
            onDragStart={(e) => e.preventDefault()}
            onMouseDown={touchStart(index)}
            onMouseMove={touchMove}
            onMouseUp={touchEnd}
            onMouseLeave={touchEnd}
            onTouchStart={touchStart(index)}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
            key={index}
          >
            {child}
          </div>
        ))}
      </div>
      <div ref={navRef} className="navigation">
        {rnederNavigation()}
      </div>
    </div>
  );
};

export default SliderNew;
