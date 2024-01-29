import Mascot from "../component/Mascot/Mascot";
import Navbar from "../component/Navbar/Navbar";
import { useAuth } from "../context/AuthContext";
import "../css/CustomerDashboard.css";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import SignIn from "./SignIn";
import Sidebar from "../component/Sidebar/Sidebar";

function CustomerDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, authUser } = useAuth();
  if (!isLoggedIn) {
    navigate("/");
  }
  if (isLoggedIn) {
    console.log(authUser.registration_date);
  }

  function handleChangePassword() {
    navigate("/customer/change_password");
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-20${year}`;
  }

  function editProfile(){
    navigate('/customer/edit-profile')
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="customer-dashboard-container">
        <div className="user-info-parent">
          <h2 className="header">◧ PROFILE</h2>
          <FaUserEdit className="edit-icon" onClick={editProfile}/>
        </div>

        <div className="customer-info">
          <div className="info-row">
            <p className="info-label">Name</p>
            <p className="info-value">{authUser.name}</p>
          </div>
          <div className="info-row">
            <p className="info-label">Email</p>
            <p className="info-value">{authUser.email}</p>
          </div>
          <div className="info-row">
            <p className="info-label">Phone Number</p>
            <p className="info-value">{authUser.phone_number}</p>
          </div>
          <div className="info-row">
            <p className="info-label">Preferred Payment Type</p>
            <p className="info-value">{
            authUser.preferred_payment_method? authUser.preferred_payment_method : '---'}</p>
          </div>
          <div className="info-row">
            <p className="info-label">Member since</p>
            <p className="info-value">
              {formatDate(authUser.registration_date)}
            </p>
          </div>
          <button
            onClick={handleChangePassword}
            className="change-password-button"
          >
            Change Password
          </button>
          <br /><br />
        </div>
      </div>
    </>
  );
}

export default CustomerDashboard;
