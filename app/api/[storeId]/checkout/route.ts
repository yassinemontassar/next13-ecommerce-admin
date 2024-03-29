
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
export async function GET(
  req: Request, 
  {params} : {params: { storeId: string}}
  ) {

      try {

          if (!params.storeId) {
              return new NextResponse("Store ID is required", {status: 400});
          }

          const orders = await prismadb.order.findMany({
              where: {
                  storeId: params.storeId,
              },
          });
          return NextResponse.json(orders);
      } catch (error) {
          console.log('[ORDERS_GET', error);
          return new NextResponse("Internal error", {status: 500});
      }
  }



export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds, name, address, phoneNumber, quantity, taille } = await req.json();
  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product IDs are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      name: name,
      phone: phoneNumber,
      address: address,
      orderItems: {
        create: productIds.map((productId: string, index: number) => ({
          product: {
            connect: {
              id: productId
            }
          },
          quantity: quantity[index],
          size: taille[index]

        })),

        
        
      }
    }
  });




  return NextResponse.json({ url: `${process.env.FRONTEND_STORE_URL}/cart?success` }, {
    headers: corsHeaders
  });
};