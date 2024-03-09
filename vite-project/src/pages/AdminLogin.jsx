import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import Footer from "../component/Footer/Footer";
import "../css/SignIn.css";


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Check if email and password match your admin credentials
    if (email === 'admin@example.com' && password === 'adminpassword') {
      // If credentials match, navigate to the admin page
      navigate("/admin");
    } else {
      // If credentials don't match, display an alert or handle the error
      alert('Invalid email or password');
    }
  };

  return (
    <div>
    <div className="signInContainer">
      <h1 className="signin-h1">Login as Admin</h1>
      <Form className="signin-form">
        <Form.Group controlId="formBasicEmail">
          <Form.Label className="signin-label">Email address</Form.Label>
          <Form.Control 
            className="signin-input"
            type="email" 
            placeholder="Enter email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label className="signin-label">Password</Form.Label>
          <Form.Control 
            className="signin-input"
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </Form.Group>

        <Button className="btn" onClick={handleLogin}>
          Login
        </Button>
      </Form>
      
    </div>
    
    <Footer/>
    </div>
  );
};

export default AdminLogin;
