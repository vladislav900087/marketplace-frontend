import { createBrowserRouter, Outlet } from 'react-router-dom';
import MarketplacePage from '../pages/MarketplacePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailsPage from '../pages/ProductPage';
import ProductUpdatePage from '../pages/ProductUpdatePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage'
import ProfileUpdatePage from '../pages/ProfileUpdatePage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailsPage from '../pages/OrderPage';
import CartPage from '../pages/CartPage';
// navbar
import Navbar from '../components/Navbar';


// shared skeleton layout

const Layout = () => (

    <>
      <Navbar />
      <Outlet />

    </>


    );

// router set up
export const router = createBrowserRouter([{

    path: '/',
    element: <Layout />,
    children: [
        // routes
        { index: true, element: <MarketplacePage /> },
        { path: 'login', element: <LoginPage />},
        { path: 'register', element: <RegisterPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'product/:id', element: <ProductDetailsPage />},
        { path: 'update_product/:id', element: <ProductUpdatePage />},
        { path: 'profile', element: <ProfilePage /> },
        { path: 'profile/update', element: <ProfileUpdatePage /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'order/:id', element: <OrderDetailsPage />},
        { path: 'cart', element: <CartPage /> },
        ],
    },
]);


