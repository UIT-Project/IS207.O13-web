import "../AdminLayout/Assets/adminLayout.css"
// import "../AdminLayout/Assets/vendor/jquery/jquery.min.js"
// import "../AdminLayout/Assets/vendor/bootstrap/js/bootstrap.bundle.js"
// import "../AdminLayout/Assets/vendor/jquery-easing/jquery.easing.min.js"
// import "../AdminLayout/Assets/js/sb-admin-2.min.js"

import SideBar from "./Sidebar/sidebar";
import NavigateAdmin from "./NavigateTop/navigateTopAdmin.js"

function AdminLayout({children}){
    return (
        <div class="container-fluid">
            <div className="row">
                <SideBar/>
                <div class="col-sm-10">
                    {/* <NavigateAdmin/> */}
                    <div className="kjkjkuu">
                        {children}
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default AdminLayout;