import { useState } from 'react';
import photo from '../assets/continue-shopping.png'; 
import newPhoto from '../assets/continue-shopping-2.png';
import './ContinueShopping.css' 

const ContinueShopping = () => {
  const [currentPhoto, setCurrentPhoto] = useState(photo);

  const goToHome = () => {
    window.location.href = '/';
  };

  const changePhotoEntry = () => {
  
    setCurrentPhoto(newPhoto);
  };

  const changePhotoExit = () => {
   
    setCurrentPhoto(photo);
  };

  return (
    <div>
      <div className="nothing-to-show" >There's nothing to show</div>
      <br /><br />
      <div className="continue-shopping-image" onClick={goToHome}>
      <img src={currentPhoto} alt="" onMouseEnter={changePhotoEntry} onMouseLeave={changePhotoExit} />
      </div> 
    </div>
    
  );
}

export default ContinueShopping;
