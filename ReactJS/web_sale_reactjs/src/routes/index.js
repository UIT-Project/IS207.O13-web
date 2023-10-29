import config from "../config"
import Home from "../pages/Home"
import Login from "../pages/Login";
import Test from "../pages/Test/test";
import SearchProduct from "../pages/SearchProduct";
import InfoProduct from "../pages/InfoProduct/infoProduct";
import CartTest from "../pages/Cart/cart";
import DefaultLayout from "../components/Layouts/DefaultLayout";
import Cart from "../pages/Cart/cart";
import Payment from "../pages/Payment/payment";

const publicRoutes = [
    {path: config.routes.home, component: Home, layout: DefaultLayout},
    {path: config.routes.nam, component: Home, layout: DefaultLayout},
    {path: config.routes.login, component: Login, layout: null},  
    {path: config.routes.test, component: Test, layout: null},
    {path: config.routes.infoProduct, component: InfoProduct, layout: DefaultLayout},
    {path: config.routes.searchProduct, component: SearchProduct, layout: DefaultLayout},
    {path: config.routes.cart_test, component: CartTest, layout: DefaultLayout},
    {path: config.routes.cart, component: Cart, layout: DefaultLayout},
    {path: config.routes.payment, component: Payment, layout: DefaultLayout },
];

const privateRoutes = [];

export {publicRoutes, privateRoutes};

