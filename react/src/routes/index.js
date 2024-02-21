import config from "../config"
import Home from "../pages/User/Home"
import Login from "../pages/User/Login"; 
import SearchProduct from "../pages/User/SearchProduct";
import InfoProduct from "../pages/User/InfoProduct/infoProduct";
import CartTest from "../pages/User/Cart/cart";
import Cart from "../pages/User/Cart/cart";
import Payment from "../pages/User/Payment/payment";
import AddProduct from "../pages/Admin/Product/AddProduct/addProduct";
import PaymentResult from "../pages/User/PaymentResult/paymentResult";
import MyOrder from "../pages/User/MyOrder/myorder"
import ManageOrder from "../pages/Admin/Order/ManageOrder/manageOrder"; 
import ManageProduct from "../pages/Admin/Product/ManageProduct/manageProduct";
import InfoAccount from "../pages/User/InfoAccount/infoAccount";
import PrintOrder from "../pages/Admin/Order/PrintOrder/printOrder";  
import AdminLogin from "../pages/Admin/AdminLogin/AdminLogin";
import ManageAccountStaff from "../pages/Admin/Account/ManageAccountStaff/ManageAccountStaff";
import ManageAccountCustomer from "../pages/Admin/Account/ManageAccountCustomer/ManageAccountCustomer";
import AddVoucher from "../pages/Admin/Voucher/AddVoucher/AddVoucher";
import ManageVoucher from "../pages/Admin/Voucher/ManageVoucher/ManageVoucher"; 
import ReviewProduct from "../pages/User/ReviewProduct/ReviewProduct";
import Statistic from "../pages/Admin/Statistic/Statistic";

import DefaultLayout from "../components/Layouts/DefaultLayout";
import AdminLayout from "../components/Layouts/AdminLayout/adminLayout";
import Collection from "../pages/User/Collection/collection";
import SetData from "../pages/Admin/ComponentUseInManyPage/SetData/SetData";

const publicRoutes = [

    // trước khi xử lý thì phải import component cần hiển thị
    //config.routes: đường link trỏ đến. những giá trị này sẽ nằm ở file routes.js trong folder config nển cần import config from "../config"
    //component: chứa giao diện để hiển thị ra.
    //layout: nếu thêm một trang cho người dùng thì dùng DefaultLayout, và admin thì dùng DefaultLayout

    {path: config.routes.home, component: Home, layout: DefaultLayout}, 
    {path: config.routes.login, component: Login, layout: null},   
    {path: config.routes.infoProduct, component: InfoProduct, layout: DefaultLayout},
    {path: config.routes.searchProduct, component: SearchProduct, layout: DefaultLayout},
    {path: config.routes.cart_test, component: CartTest, layout: DefaultLayout},
    {path: config.routes.cart, component: Cart, layout: DefaultLayout},
    {path: config.routes.payment, component: Payment, layout: DefaultLayout },
    {path: config.routes.addProduct, component: AddProduct, layout: AdminLayout},
    {path: config.routes.paymentResult, component: PaymentResult, layout: DefaultLayout},
    {path: config.routes.myOrder, component: MyOrder, layout: DefaultLayout},
    {path: config.routes.manageOrder, component: ManageOrder, layout: AdminLayout},
    {path: config.routes.manageProduct, component: ManageProduct, layout: AdminLayout}, 
    {path: config.routes.infoAccount, component: InfoAccount, layout: DefaultLayout},
    {path: config.routes.printOrder, component: PrintOrder, layout: AdminLayout},  
    {path: config.routes.adminLogin, component: AdminLogin, layout: null},
    {path: config.routes.manageAccountStaff, component: ManageAccountStaff, layout: AdminLayout},
    {path: config.routes.manageAccountCustomer, component: ManageAccountCustomer, layout: AdminLayout},
    {path: config.routes.addVoucher, component: AddVoucher, layout: AdminLayout},
    {path: config.routes.manageVoucher, component: ManageVoucher, layout: AdminLayout}, 
    {path: config.routes.reviewProduct, component: ReviewProduct, layout: DefaultLayout},
    {path: config.routes.statistic, component: Statistic, layout: AdminLayout},
    {path: config.routes.collection, component: Collection, layout: DefaultLayout},
    {path: config.routes.collection1, component: Collection, layout: DefaultLayout},
    {path: config.routes.collection2, component: Collection, layout: DefaultLayout},
    {path: config.routes.collection3, component: Collection, layout: DefaultLayout},
    {path: config.routes.setData, component: SetData, layout: DefaultLayout},
];

const privateRoutes = [];

export {publicRoutes, privateRoutes};

