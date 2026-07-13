import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type {CartData} from '../types/cart.ts';
import { getSessionFromToken } from '../utilities/tokenDecoder.ts';


export function useCart(targetUsername?: string) {

    const navigate = useNavigate();
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const currentUser = getSessionFromToken();
    const activeCartOwner = targetUsername || currentUser.username;

    const canManageCart = currentUser.role === 'admin' || currentUser.username === activeCartOwner;

    const loadCartContent = async () => {

        try {
            setLoading(true);
            setError('');
            setCart(null);

            const url = activeCartOwner !== currentUser.username ? `/cart/other?username=${encodeURIComponent(activeCartOwner)}` : '/cart/items';

            const response = await api.get(url);
            setCart(response.data)


            } catch (err: any) {

                const detail = err.response?.data?.detail;
                setError(Array.isArray(detail) ? detail[0]?.msg || 'Validation error' : detail || 'Failed to load shopping cart.');


                } finally {

                    setLoading(false);

                    }


        };

    useEffect(() => {

        loadCartContent();

        }, [activeCartOwner]);


    const handleRemoveItem = async (productId: number) => {

        try {

            await api.delete('/cart/delete', {
                data: {
                    owner_username: activeCartOwner,
                    product_id: productId
                    }

                });

            loadCartContent();


            } catch (err: any) {

                alert(err.response?.data?.detail || 'Failed to remove cart item.');

                }


        };


    const handleClearCart = async () => {

        try {

            await api.delete('/cart/clear', {

                data: {
                    owner_username: activeCartOwner

                    }

                })

            loadCartContent();

            } catch (err: any) {

                alert(err.response?.data?.detail || 'Failed to clear shopping cart');


                }


        };


    return {

        cart,
        loading,
        error,
        navigate,
        canManageCart,
        cartOwner: activeCartOwner,
        handleRemoveItem,
        handleClearCart


        };




    }

