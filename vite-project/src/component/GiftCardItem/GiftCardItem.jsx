const GiftCardItem = (props) => {
      return (
        <div className='wishlist-container' >
          <img src={props.photo} alt="" className='wishlist-image' />
          <div className='wishlist-item'>
            <div className='wishlist-item-name'>{props.name}</div>
            <br/> <br />
          </div>
        </div>
      )
}

export default GiftCardItem
