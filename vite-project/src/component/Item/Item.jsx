import './Item.css'
import image from '../assets/logo_full_big.png'
import Star from '../Star/Star'
import Heart from '../Heart/Heart'
const Item = (props) => {
  return (
    <div className='item'>
      {(props.photo===null || props.photo===undefined)? <img src={image} className="item__image" alt=""/> : <img src={props.photo} className="image"alt=""/>}
      <br/><br/>
      <div className='name'>{props.name}</div>
        <div className="price">৳{props.price}
      </div>
       <Star rating={4.8}/>
       <Heart/>
    </div>
  )
}

export default Item
