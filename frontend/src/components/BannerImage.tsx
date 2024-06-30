import { useState, useEffect } from 'react';
import number1 from '../assets/img/number1.jpg';
import number2 from '../assets/img/number2.jpg';
import number3 from '../assets/img/number3.jpg';
import number4 from '../assets/img/number4.jpg';
import number5 from '../assets/img/number5.jpg';
import './BannerImage.css';

const BannerImage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState<null | number>(null);

  const images = [number1, number2, number3, number4, number5];

  useEffect(() => {
    const startAutoScroll = () => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // 3 seconds interval
      setIntervalId(interval as unknown as number);
      return interval;
    };

    const interval = startAutoScroll();

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  const handlePrevClick = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNextClick = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="banner-container">
      <div className="banner-image-wrapper">
        <img src={images[currentIndex]} alt="Banner" className="banner-image" />
      </div>
      <div className="banner-controls">
        <button className="prev-btn c(#c3c3c3)" onClick={handlePrevClick}>
          <div className='font-size(48)'>{'<'}</div>
        </button>
        <button className="next-btn c(#c3c3c3)" onClick={handleNextClick}>
          <div className='font-size(48)'>{'>'}</div>
        </button>
      </div>
    </div>
  );
};

export default BannerImage;
