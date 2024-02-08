import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import './Heart.css'
export default function Heart({onClick,onRemoveClick,isFilledInit}) {
  console.log(`inside heart `+ isFilledInit)
  const [isFilled, setIsFilled] = useState(isFilledInit);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    setIsFilled(!isFilled);
    if (isFilled && onRemoveClick) {
      onRemoveClick();
    } else if (!isFilled && onClick) {
      onClick();
    }
  };
  const heartColor = isFilled ? '#E2323F' : '#b6b2ac';

  const heartStyle = {
    color: heartColor,
    cursor: 'pointer',
    padding: '5px', 
    transition: 'color 0.5s ease',
    animation: isHovered && !isFilled ? 'fillHeart 1s forwards' : 'none'
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };


  return (
    <FaHeart style={heartStyle} onClick={handleClick} onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}/>
  );
}
