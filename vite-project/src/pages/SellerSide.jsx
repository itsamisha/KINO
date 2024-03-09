import Footer from "../component/Footer/Footer";
import NavbarSeller from "../component/NavbarSeller/NavbarSeller"
import SellerReg from "../component/SellerReg/SellerReg"
import { useSellerAuth } from "../context/SellerAuthContext"
function SellerSide(){ 
    const {isLoggedIn} = useSellerAuth();
    if(isLoggedIn){
        window.location.href = "/seller"
    }
    return <div>
        <NavbarSeller />
        <br />
        <br />
        <SellerReg/>
        <Footer/>
    </div>
}

export default SellerSide