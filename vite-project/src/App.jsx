import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import Registration from "./pages/Registration";
import Footer from "./component/Footer/Footer";
import CustomerDashboard from "./pages/CustomerDashboard";
import ChangePassword from "./pages/ChangePassword";
import { AuthProvider } from "./context/AuthContext";
import Product from "./pages/Product";
import SearchResults from "./component/SearchResults/SearchResults";
import { SearchProvider } from "./context/SearchContext";

import Searchbar from './component/Searchbar/Searchbar';

import FilterMenu from './component/Filter/FilterMenu';





function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Registration />} />
            <Route path="customer" element={<CustomerDashboard />} />
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
