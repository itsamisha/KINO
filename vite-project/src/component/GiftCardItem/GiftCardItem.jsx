// import React, { useState } from "react";
// import Successful from "../Successful/Successful";
// import './GiftCardItem.css';

// const GiftCardItem = (props) => {
//   const [isCopied, setIsCopied] = useState(false);

//   const copyToClipboard = (text) => {
//     // Create a temporary textarea element
//     const textarea = document.createElement("textarea");
//     textarea.value = text;
//     document.body.appendChild(textarea);
//     textarea.select();
//     // Execute copy command
//     document.execCommand("copy");
//     // Remove the textarea element
//     document.body.removeChild(textarea);
//     // Set the state variable to true
//     setIsCopied(true);
//   };

//   return (
//     <div className="wishlist-container">
//       <img src={props.photo} alt="" className="giftcard-image" />
//       <div className="giftcard-item">
//         {props.selection === "received" ? (
//           <>
//             <div className="giftcard-text-large">
//               <i>"{props.message}"</i>
//             </div>
//             <div className="giftcard-text">-{props.name}</div>
//             <br />
//             <div className="amount-container">
//               <div className="giftcard-text-money">Amount: ৳{props.initial}</div>
//               <div className="giftcard-text-money">Remaining: ৳{props.amount}</div>
//               <div className="giftcardcode-container">
//                 <div className="giftcardcode-text">Gift Card Code: {props.gift_card_code}</div>
//                 <button className="copy-button" onClick={() => copyToClipboard(props.gift_card_code)}>
//                   Copy Code
//                 </button>
//               </div>
//               {isCopied && (
//                 <Successful message="Gift card code copied to clipboard!" onClose={() => setIsCopied(false)} />
//               )}
//             </div>
//           </>
//         ) : 
//         <>
//         <div className="giftcard-text-large">
//           <i>"{props.message}"</i>
//         </div>
//         <div className="giftcard-text">-{props.name}</div>
//         <br />
//         <div className="amount-container">
//           <div className="giftcard-text-money">Amount: ৳{props.initial}</div>
//         </div>
//       </>}
//       </div>
//     </div>
//   );
// };

// export default GiftCardItem;
import React, { useState } from "react";
import Successful from "../Successful/Successful";
import './GiftCardItem.css';

const GiftCardItem = (props) => {
  const [isCopied, setIsCopied] = useState(false);
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  }

  const copyToClipboard = (text) => {
    // Create a temporary textarea element
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    // Execute copy command
    document.execCommand("copy");
    // Remove the textarea element
    document.body.removeChild(textarea);
    // Set the state variable to true
    setIsCopied(true);
  };

  return (
    <div className="wishlist-container">
      <img src={props.photo} alt="" className="giftcard-image" />
      <div className="giftcard-item">
        <div className="giftcard-text">{formatDate(props.date)}</div>
      {props.selection === "sent" && !(props.amount>0) && (
            <div className="giftcardsent-text">Receipient:&nbsp;{props.name}</div>
          )}
        <div className="giftcard-text-large">
          <i>"{props.message}"</i>
        </div>
        
        {props.selection==="receieved" && <div className="giftcard-text">-{props.name}</div>}
        
        <br />
        <div className="amount-container">
          <div className={`giftcard-text-money ${props.amount === 0 ? 'gray-text' : ''}`}>
            Amount: ৳{props.initial}
          </div>
          {props.amount > 0 && (
            <div className={`giftcard-text-money ${props.amount === 0 ? 'gray-text' : ''}`}>
              Remaining: ৳{props.amount}
            </div>
          )}
          {props.selection === "received" && props.amount > 0 && (
            <div className="giftcardcode-container">
              <div className="giftcardcode-text">Gift Card Code: {props.gift_card_code}</div>
              <button className="copy-button" onClick={() => copyToClipboard(props.gift_card_code)}>
                Copy Code
              </button>
              {isCopied && (
                <Successful message="Gift card code copied to clipboard!" onClose={() => setIsCopied(false)} />
              )}
            </div>
          )}
          {props.selection === "received" && !(props.amount>0) && (
            <div className="giftcardcode-text">Redeemed</div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default GiftCardItem;

