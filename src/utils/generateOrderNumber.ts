import Order from "../models/Order";

export const generateOrderNumber = async (): Promise<string> => {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastOrder && lastOrder.orderNumber) {
    const match = lastOrder.orderNumber.match(/ORD-(\d+)/);

    if (match && match[1]) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  const orderNumber = `ORD-${String(nextNumber).padStart(4, "0")}`;
  return orderNumber;
};
