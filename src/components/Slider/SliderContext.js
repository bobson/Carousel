import React, { useState, createContext } from "react";

export const SliderContext = createContext({
  infinite: false,
  show: 1,
  autoPlay: false,
  infiniteHandler: () => {},
  showHandler: (e) => {},
  autoPlayHandler: () => {},
});

const PropsContextProvider = ({ children }) => {
  const [toggleInfinite, setToggleInfinite] = useState(false);
  const [slidedToShow, setSlidedToShow] = useState(1);
  const [playAuto, setPlayAuto] = useState(false);

  const handleInfinite = () => setToggleInfinite((prevState) => !prevState);
  const handleSlidesToShow = (e) => setSlidedToShow(e);
  const handlePlayAuto = () => {
    setPlayAuto((prevState) => !prevState);
    // setTimeout(() => setToggleInfinite(playAuto));
  };

  const context = {
    infinite: toggleInfinite,
    show: slidedToShow,
    autoPlay: playAuto,
    infiniteHandler: handleInfinite,
    showHandler: handleSlidesToShow,
    autoPlayHandler: handlePlayAuto,
  };

  return (
    <SliderContext.Provider value={context}>{children}</SliderContext.Provider>
  );
};

export default PropsContextProvider;
