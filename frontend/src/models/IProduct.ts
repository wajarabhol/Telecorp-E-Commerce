export interface ProductsInterface {
    ID: number,
    Sku: string;
    Name: string;
    Picture: string;
    Price: number;
    Amount: number;
}
export interface CartsInterface {
    ID: number,
    Amount: number;
    Product: ProductsInterface;
}
export interface OrdersInterface {
    ID: number,
    TotalPrice: number;
    OrderNumber: string;

    OrderDetails: OrderDetailsInterface[];
}
export interface OrderDetailsInterface {
    ID: number,
    Name: string;
    Picture: string;
    Price: number;
    Amount: number;
    TotalPrice: number;
}