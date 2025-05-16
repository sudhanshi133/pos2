export interface OrderItem {
    barcode: string;
    productName: string;
    mrp: number;
    quantity: number;
}

export interface OrderItemForm {
    barcode: string;
    quantity: number;
    sellingPrice: number;
}

export interface BulkOrderItemForm {
    orderItems: OrderItemForm[];
}

export interface BulkOrderItemData {
    orderId?: number;
    successList: { form: OrderItemForm; message: string }[];
    failureList: { form: OrderItemForm; message: string }[];
} 