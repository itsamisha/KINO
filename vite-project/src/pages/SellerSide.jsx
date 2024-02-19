import Mascot from "../component/Mascot/Mascot"
import NavbarSeller from "../component/NavbarSeller/NavbarSeller"
import SellerReg from "../component/SellerReg/SellerReg"
import Footer from "../component/Footer/Footer"

function SellerSide(){
   
    // updateSearchOption('product')
    // updateSearchValue('')
    return <div>
        <NavbarSeller />
        <SellerReg/>
    </div>
}

export default SellerSide