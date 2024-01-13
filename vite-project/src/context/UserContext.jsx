import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
       user_id: "",
       email: "",
        password: "",
        name: "Guest",
        phone_number: "",
        user_type: "",
        registration_date: "",
        preferred_payment_method: ""
  });
  
  useEffect(() => {
    setUser({ 
      user_id: "",
      email: "",
       password: "",
       name: "MEOW",
       phone_number: "",
       user_type: "",
       registration_date: "",
       preferred_payment_method: ""});
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

