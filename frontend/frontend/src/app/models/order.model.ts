export interface OrderItem {
    barcode: string;
    name: string;
    quantity: number;
    mrp: number;
    total: number;
}

export interface Order {
    id: string;
    customer: string;
    customerEmail?: string;
    customerPhone?: string;
    date: string;
    time: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
}

export interface OrderData {
    id: number;
    time: string;
    items: OrderItem[];
}

export interface BulkOrderItemData {
    orderId: string;
    successList: OrderItem[];
    failureList: OrderItem[];
} 