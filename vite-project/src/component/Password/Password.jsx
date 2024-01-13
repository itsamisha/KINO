import './Password.css'
import { useState } from 'react';
const Password = () => {
    const [show, setShow] = useState(false);

    const handleShow = () =>{
        setShow(!show)
    }
  return (
    <div className='container'>
      <input type={show? "text" :"password"}/>
      <label onClick={handleShow}>Show</label>
    </div>
  )
}

export default Password

