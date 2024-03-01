import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Shop from "./pages/Shop";
import SellerSide from "./pages/SellerSide";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import Registration from "./pages/Registration";
import Footer from "./component/Footer/Footer";
import CustomerDashboard from "./pages/CustomerDashboard";
// import ChangePassword from "./pages/ChangePassword";
import { AuthProvider } from "./context/AuthContext";
import { SellerAuthProvider } from "./context/SellerAuthContext";
import Product from "./pages/Product";
import SellerProduct from "./pages/SellerProduct";
import SearchResults from "./component/SearchResults/SearchResults";
import { SearchProvider } from "./context/SearchContext";
import Wishlist from "./pages/Wishlist";
import Inventory from "./pages/Inventory";
import SellerReviewsPage from "./pages/SellerReviewsPage";
import Orders from "./pages/Orders";
import SellerOrders from "./pages/SellerOrders"
import AddProduct from "./component/AddProducts/AddProduct";
import SellerDashboard from "./pages/SellerDashboard"
import GiftCard from "./pages/GiftCard";
import GiftCardPurchase from "./component/GiftCardPurchase/GiftCardPurchase";
import GiftCardCustomer from "./pages/GiftCardCustomer";
import AnalyticsPage from "./pages/Analytics";

function App() {
  return (
    <SellerAuthProvider>
         <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders/>} />
            <Route path="/gift-cards" element={<GiftCard/>} />
            <Route path="/gift-card-purchase" element={<GiftCardPurchase/>} />
            <Route path="/giftcard" element={<GiftCardCustomer/>} />
            {/* <Route
              path="/customer/change_password"
              element={<ChangePassword />}
            /> */}

            {/* Routes for Seller Side */}
           
              <Route path="/sellerside" element={<SellerSide />} />
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sellerreviews" element={<SellerReviewsPage />} />
              <Route path="/seller/:productId" element={<SellerProduct />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/sellerorders" element={<SellerOrders />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
            
            </Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
      </SellerAuthProvider>
      
  );
}

export default App;
