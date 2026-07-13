


export interface CartItem {

    product_id: number
    title: string
    price: number
    quantity: number
    subtotal: number

    }


export interface CartData {

    items: CartItem[];
    total_price: number;


    }