import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Shop from "./pages/Shop";
 import SellerSide from "./SellerSide";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import Registration from "./pages/Registration";
import Footer from "./component/Footer/Footer";
import CustomerDashboard from "./pages/CustomerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import ChangePassword from "./pages/ChangePassword";
import { AuthProvider } from "./context/AuthContext";
import Product from "./pages/Product";
import SearchResults from "./component/SearchResults/SearchResults";
import { SearchProvider } from "./context/SearchContext";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/sellerside" element={<SellerSide />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/wishlist" element={<Wishlist/>} />
            <Route
              path="/customer/change_password"
              element={<ChangePassword />}
            />
           
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/product" element={<Product />}>
              <Route path=":productId" element={<Product />} />
            </Route>
          </Routes>
          <Footer/>
        </BrowserRouter>
      </SearchProvider>
      
    </AuthProvider>
  );
}

export default App;
