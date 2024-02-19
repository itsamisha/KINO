import './Receipt.css';

const Receipt = ({ name, price, quantity }) => {
  const truncateName = name => {
    const words = name.split(' ');
    if (words.length > 5) {
      return words.slice(0, 5).join(' ') + '...';
    }
    return name;
  };

  return (
    <div className='receipt-cont'>
      <div className="receipt-name">{truncateName(name)}</div>
      <div className="receipt-price"> ৳ ({price} X {quantity}) = ৳ {(price * quantity).toFixed(2)}</div>
    </div>
  );
};

export default Receipt;
