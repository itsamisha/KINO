import "./Searchbar.css";
import search from "../assets/search.png";

const Searchbar = () => {
  
  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <div className="custom-dropdown">
          <select className="search-options" id="search-options"  >
            <option value="product" className="option">
              Product
            </option>
            <option value="category">Category</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <input type="text" placeholder="Search" className="search-input" />
        <button className="search-button">
          <img src={search} />
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
