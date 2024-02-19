import Mascot from "./component/Mascot/Mascot"

import NavbarSeller from "./component/NavbarSeller/NavbarSeller"
import SellerReg from "./component/SellerReg/SellerReg"
import Footer from "./component/Footer/Footer"



const containerStyles = {
    width: "75rem",
    height: "30.5rem",
    margin : "0 auto",
};

const urls = [
    'https://images.unsplash.com/photo-1530128118208-89f6ce02b37b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1529521251356-ca145f9cd4d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1615012553971-f7251c225e01?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
]

function SellerSide(){
   
    // updateSearchOption('product')
    // updateSearchValue('')
    return <div>
        <NavbarSeller />
        <SellerReg/>
        
        
      
    </div>
}

export default SellerSide