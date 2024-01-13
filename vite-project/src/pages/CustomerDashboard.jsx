import Mascot from "../component/Mascot/Mascot";
import Navbar from "../component/Navbar/Navbar";
import { useAuth } from "../context/AuthContext";
import '../css/CustomerDashboard.css'
import { useNavigate } from "react-router-dom";


function CustomerDashboard() {
  const navigate = useNavigate()
  const { isLoggedIn, authUser, setAuthUser } = useAuth();
  if (!isLoggedIn) {
    navigate("/signin")
  }

    function handleChangePassword() {
      navigate("/customer/change_password")
    }

    return (
      <>
      <Navbar/>
      <Mascot/>
      <div className="customer-dashboard-container">
        <h2 className="header">User Info</h2>
        <div className="customer-info">
                <p>Name: {authUser.name}</p>
                <p>Email: {authUser.email}</p>
                <p>Phone Number: {authUser.phone_number}</p>
                <p>Preferred Payment Type: {authUser.preferred_payment_method}</p>
                <p>Registration Date: {Date(authUser.registration_date).toString()}</p>
          <button onClick={handleChangePassword}>Change Password</button>
      </div>
      </div>
     
      </>
    );
}

export default CustomerDashboard;
