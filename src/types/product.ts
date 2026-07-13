

export interface Product {

    id: number;
    title: string;
    price: number;
    category_id?: number; // optional
    currency: string;
    description?: string; // optional

    }

export interface ProductProps {

    title: string;
    description?: string; // optional
    price: number;
    currency: string;


    }


export interface ProductUpdateProps {

    owner_username: string;
    new_title?: string;
    new_description?: string;
    new_price?: number;
    new_currency?: string;



    }