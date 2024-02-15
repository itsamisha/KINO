import React, { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider(props) {
  const initialAuthUser = JSON.parse(localStorage.getItem("authUser")) || {
    user_id: "",
    email: "",
    password: "",
    name: "Guest",
    phone_number: "",
    user_type: "",
    registration_date: "",
    preferred_payment_method: "",
  };

  const [authUser, setAuthUser] = useState(initialAuthUser);
  const [isLoggedIn, setIsLoggedIn] = useState(
    initialAuthUser.user_id && initialAuthUser.user_type !== 'seller' // Set isLoggedIn based on user_id and user_type
  );
  const [sellerLoggedIn, setSellerLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.setItem("authUser", JSON.stringify(authUser));
    setIsLoggedIn(
     authUser.user_type !== 'seller' // Update isLoggedIn based on user_id and user_type
    );
    setSellerLoggedIn(authUser.user_type === 'seller'); // Update sellerLoggedIn based on user_type
  }, [authUser]);

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
    sellerLoggedIn,
    setSellerLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
}
