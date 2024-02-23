import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      const discountedPrice = item.product.price.toNumber() * (1 - item.product.discount / 100);
      return orderSum + (discountedPrice * item.quantity  );
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};