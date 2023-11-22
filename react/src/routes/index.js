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
import UpdateProduct2 from "../pages/Admin/UpdateProduct/updateProduct2";

import DefaultLayout from "../components/Layouts/DefaultLayout";
import AdminLayout from "../components/Layouts/AdminLayout/adminLayout";

const publicRoutes = [

    // trước khi xử lý thì phải import component cần hiển thị
    //config.routes: đường link trỏ đến. những giá trị này sẽ nằm ở file routes.js trong folder config nển cần import config from "../config"
    //component: chứa giao diện để hiển thị ra.
    //layout: nếu thêm một trang cho người dùng thì dùng DefaultLayout, và admin thì dùng DefaultLayout

    {path: config.routes.home, component: Home, layout: DefaultLayout},
    {path: config.routes.nam, component: Home, layout: DefaultLayout},
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
    {path: config.routes.updateProduct2, component: UpdateProduct2, layout: AdminLayout},
];

const privateRoutes = [];

export {publicRoutes, privateRoutes};

