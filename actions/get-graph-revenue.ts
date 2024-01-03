import prismadb from "@/lib/prismadb";
import {  BarChart} from "recharts";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string): Promise<GraphData[]> => {
  const currentYear = new Date().getFullYear(); 
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
      createdAt: {
        gte: new Date(`${currentYear}-01-01T00:00:00Z`), // Filter orders from the start of the current year
        lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`), // Filter orders until the start of the next year
      },
    },
    
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  // Grouping the orders by month and summing the revenue
  for (const order of paidOrders) {
    const month = order.createdAt.getMonth(); // 0 for Jan, 1 for Feb, ...
    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      const discountedPrice = item.product.price.toNumber() * (1 - item.product.discount / 100);
      revenueForOrder += discountedPrice * item.quantity;
    }

    // Adding the revenue for this order to the respective month
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  // Converting the grouped data into the format expected by the graph
  const graphData: GraphData[] = [
    { name: "Janv", total: 0 },
    { name: "Fév", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Avr", total: 0 },
    { name: "Mai", total: 0 },
    { name: "Juin", total: 0 },
    { name: "Juil", total: 0 },
    { name: "Août", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Déc", total: 0 },
    
  ];

  // Filling in the revenue data
  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};