import React, { createContext, useState, useEffect, useContext } from "react";

const SellerAuthContext = createContext();

export function useSellerAuth() {
  const context = useContext(SellerAuthContext);
  if (!context) {
    throw new Error("useSellerAuth must be used within a SellerAuthProvider");
  }
  return context;
}

export function SellerAuthProvider(props) {
  const initialAuthUser = JSON.parse(localStorage.getItem("authUser")) || {
    user_id: "",
    email: "",
    password: "",
    name: "Guest",
    phone_number: "",
    user_type: "",
    registration_date: "",
  };

  const [authUser, setAuthUser] = useState(initialAuthUser);
  const [isLoggedIn, setIsLoggedIn] = useState(
    initialAuthUser.user_id && initialAuthUser.user_type === 'seller'
  );

  useEffect(() => {
    localStorage.setItem("authUser", JSON.stringify(authUser));
    setIsLoggedIn(authUser.user_id && authUser.user_type === 'seller');
  }, [authUser]);

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <SellerAuthContext.Provider value={value}>
      {props.children}
    </SellerAuthContext.Provider>
  );
}
