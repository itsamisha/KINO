import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

export default function Heart() {
  const [isFilled, setIsFilled] = useState(false);

  const handleClick = () => {
    setIsFilled(!isFilled);
  };

  const heartColor = isFilled ? '#E2323F' : '#b6b2ac';

  const heartStyle = {
    color: heartColor,
    cursor: 'pointer',
    padding: '5px', 
  };

  return (
    <FaHeart style={heartStyle} onClick={handleClick} />
  );
}
