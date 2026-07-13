


export interface Order {

    id: number;
    user_id: number;
    status: string;
    total_price: number;
    created_at: string;



    }


export interface OrderProps {

    order_id: number;
    action: 'pay' | 'cancel';

    };