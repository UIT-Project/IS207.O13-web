import { useState } from "react";
import './infoProduct2.css';

const slideStyles = {
  paddingLeft: "20px",
  width: "26.875em",
  height: "26.875em",
  borderRadius: "10px",
  backgroundSize: "cover",
  backgroundPosition: "center",

};
const containerStyles = {
  width: "530px",
  height: "280px",
  margin: "0 auto",
};
const rightArrowStyles = {
  position: "absolute",
  top: "75%",
  transform: "translate(0, -50%)",
  right: "85px",
  fontSize: "30px",
  color: "#686868",
  zIndex: 1,
  cursor: "pointer",
  border: "1px solid #DCDCDC",
  borderRadius: "50%",
  padding: "1px 12px"
};

const leftArrowStyles = {
  position: "absolute",
  top: "75%",
  transform: "translate(-50%, -50%)",
  left: "0px",
  fontSize: "30px",
  color: "#686868",
  zIndex: 1,
  cursor: "pointer",
  border: "1px solid #DCDCDC",
  borderRadius: "50%",
  padding: "1px 12px"
};

const sliderStyles = {

  position: "relative",
  height: "100%",
  justifyContent: "center",
};

const dotsContainerStyles = {
  marginLeft: "150px",
  display: "flex",

};

const dotStyle = {

  margin: "0 3px",
  cursor: "pointer",
  fontSize: "20px",
};

const ImageSlider = ({ slides }, {renderReview}) => {
  const [slide, setSlide] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  const slideStylesWidthBackground = {
    ...slideStyles,
    backgroundImage: `url(${slides[currentIndex].imgURL})`,
  };

  return (
 
      <div className="product_image">
        <div class="product_image__list_mini_image" id="style-7">
          {
            slides.map((slide, slideIndex) => (
            <div class="product_image__list_mini_image__item" >
              <img src={slide.imgURL} alt="" class="product_image__list_mini_image__item__img" onClick={() => goToSlide(slideIndex)}/>
            </div>
            ))
          }
        </div>
        <div class="product_image__main_image" style={containerStyles}>
          <div style={sliderStyles} >
            <div>
              <div onClick={goToPrevious} style={leftArrowStyles}>
                ❰
              </div>
              <div onClick={goToNext} style={rightArrowStyles}>
                ❱
              </div>
            </div>
            <div style={slideStylesWidthBackground} onClick={() => setSlide(slides[currentIndex])}></div>
            <div style={dotsContainerStyles}>
              {slides.map((slide, slideIndex) => (
                <div
                  style={dotStyle}
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                >
                  ●
                </div>
              ))}
            </div>
            <div className="popup-media" style={{ display: slide ? 'block' : 'none' }}>
              <span onClick={() => setSlide(null)}>&times;</span>
              <img src={slide?.imgURL} />
            </div>
          </div>
        </div> 
      </div> 

  );
};

export default ImageSlider;