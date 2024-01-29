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
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(initialAuthUser.user_id));

  useEffect(() => {
    localStorage.setItem("authUser", JSON.stringify(authUser));
    setIsLoggedIn(Boolean(authUser.user_id));
  }, [authUser]);

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
}
