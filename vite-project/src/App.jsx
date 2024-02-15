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
import { SellerAuthProvider } from "./context/SellerAuthContext";
import Product from "./pages/Product";
import SearchResults from "./component/SearchResults/SearchResults";
import { SearchProvider } from "./context/SearchContext";
import Wishlist from "./pages/Wishlist";
import AddProduct from "./component/AddProducts/AddProduct";

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
            <Route
              path="/customer/change_password"
              element={<ChangePassword />}
            />

            {/* Routes for Seller Side */}
           
              <Route path="/sellerside" element={<SellerSide />} />
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/addproduct" element={<AddProduct />} />
          

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
