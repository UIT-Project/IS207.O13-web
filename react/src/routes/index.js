import config from "../config"
import Home from "../pages/Home"
import Login from "../pages/Login";
import Test from "../pages/Test/test";
import SearchProduct from "../pages/SearchProduct";
import InfoProduct from "../pages/InfoProduct/infoProduct";
import CartTest from "../pages/Cart/cart";
import Cart from "../pages/Cart/cart";
import Payment from "../pages/Payment/payment";
import AddProduct from "../pages/Admin/AddProduct/addProduct";
import PaymentResult from "../pages/PaymentResult/paymentResult";
import MyOrder from "../pages/MyOrder/myorder"
import ManageOrder from "../pages/Admin/ManageOrder/manageOrder"; 
import ManageProduct from "../pages/Admin/ManageProduct/manageProduct";
import UpdateProduct from "../pages/Admin/UpdateProduct/updateProduct"; 
import InfoAccount from "../pages/InfoAccount/infoAccount";
import PrintOrder from "../pages/Admin/PrintOrder/printOrder";
import SearchOrder from "../pages/Admin/SearchOrder/searchOrder";
import SearchProductAdmin from "../pages/Admin/SearchProductAdmin/searchProductAdmin";
import AdminLogin from "../pages/Admin/AdminLogin/AdminLogin";
import ManageAccountStaff from "../pages/Admin/ManageAccountStaff/ManageAccountStaff";
import ManageAccountCustomer from "../pages/Admin/ManageAccountCustomer/ManageAccountCustomer";
import AddVoucher from "../pages/Admin/AddVoucher/AddVoucher";
import ManageVoucher from "../pages/Admin/ManageVoucher/ManageVoucher";
import SearchVoucher from "../pages/Admin/SearchVoucher/SearchVoucher";
import ReviewProduct from "../pages/ReviewProduct/ReviewProduct";
import Statistic from "../pages/Admin/Statistic/Statistic";

import DefaultLayout from "../components/Layouts/DefaultLayout";
import AdminLayout from "../components/Layouts/AdminLayout/adminLayout";
import Collection from "../pages/Collection/collection";
import SetData from "../pages/Admin/SetData/SetData";

const publicRoutes = [

    // trước khi xử lý thì phải import component cần hiển thị
    //config.routes: đường link trỏ đến. những giá trị này sẽ nằm ở file routes.js trong folder config nển cần import config from "../config"
    //component: chứa giao diện để hiển thị ra.
    //layout: nếu thêm một trang cho người dùng thì dùng DefaultLayout, và admin thì dùng DefaultLayout

    {path: config.routes.home, component: Home, layout: DefaultLayout}, 
    {path: config.routes.login, component: Login, layout: null},  
    {path: config.routes.test, component: Test, layout: null},
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
    {path: config.routes.updateProduct, component: UpdateProduct, layout: AdminLayout}, 
    {path: config.routes.infoAccount, component: InfoAccount, layout: DefaultLayout},
    {path: config.routes.printOrder, component: PrintOrder, layout: AdminLayout},
    {path: config.routes.searchOrder, component: SearchOrder, layout: AdminLayout},
    {path: config.routes.searchProductAdmin, component: SearchProductAdmin, layout: AdminLayout},
    {path: config.routes.adminLogin, component: AdminLogin, layout: null},
    {path: config.routes.manageAccountStaff, component: ManageAccountStaff, layout: AdminLayout},
    {path: config.routes.manageAccountCustomer, component: ManageAccountCustomer, layout: AdminLayout},
    {path: config.routes.addVoucher, component: AddVoucher, layout: AdminLayout},
    {path: config.routes.manageVoucher, component: ManageVoucher, layout: AdminLayout},
    {path: config.routes.searchVoucher, component: SearchVoucher, layout: AdminLayout},
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

