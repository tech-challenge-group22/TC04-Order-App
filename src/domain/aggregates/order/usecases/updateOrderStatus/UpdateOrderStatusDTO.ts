export interface UpdateOrderStatusDTO {
  hasError: boolean;
  orderId: number;
  message?: string;
  httpCode?: number;
}

export interface UpdateOrderStatusParams {
  order_id: number;
  status: number;
}
