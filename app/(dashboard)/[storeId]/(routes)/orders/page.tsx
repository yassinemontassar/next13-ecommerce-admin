import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatTND } from "@/lib/utils";

import { OrderColumn } from "./components/columns"
import { OrderClient } from "./components/client";
import { Suspense } from "react";
import Skeleton from "@/components/skelton";


const OrdersPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => {
      return `${orderItem.product.name} (Qt: ${orderItem.quantity},T: ${orderItem.size} )`;
    }).join(' | '),
    totalPrice: formatTND(item.orderItems.reduce((total, orderItem) => {
      const discountedPrice = Number(orderItem.product.price) * (1 - orderItem.product.discount / 100);
      return total + discountedPrice * orderItem.quantity;
    }, 0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
      <Suspense fallback={<Skeleton/>}>
        <OrderClient data={formattedOrders} />
        </Suspense>
      </div>
    </div>
  );
};

export default OrdersPage;