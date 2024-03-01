// import './GiftCardItem.css'
// const GiftCardItem = (props) => {
//   return (
//     <div className="wishlist-container">
//       <img src={props.photo} alt="" className="wishlist-image" />
//       <div className="wishlist-item">
//         {props.selection === "received" ? (
//           <>
//             <div className="wishlist-item-name">
//               <i>"{props.message}"</i>
//             </div>
//             <div className="giftcard-text">-{props.name}</div>
//             <br />
//             <div className="giftcard-text">Remaining: ৳{props.amount}</div>
//             <div className="giftcard-text">Amount: &nbsp;&nbsp;&nbsp;৳{props.initial}</div>
//           </>
//         ) : null}
//         <br /> <br />
//       </div>
//     </div>
//   );
// };

// export default GiftCardItem;
const GiftCardItem = (props) => {
  return (
    <div className="wishlist-container">
      <img src={props.photo} alt="" className="wishlist-image" />
      <div className="wishlist-item">
        {props.selection === "received" ? (
          <>
            <div className="wishlist-item-name">
              <i>"{props.message}"</i>
            </div>
            <div className="giftcard-text">-{props.name}</div>
            <br />
            <div className="amount-container">
              <div className="giftcard-text">Remaining: ৳{props.amount}</div>
              <div className="giftcard-text">Amount: ৳{props.initial}</div>
            </div>
          </>
        ) : null}
        <br /> <br />
      </div>
    </div>
  );
};

export default GiftCardItem;
