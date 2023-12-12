
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { email } = await req.json();

  console.log(email)



  const subscriber = await prismadb.subscriber.create({
    data: {
      storeId: params.storeId,
      name: email,    
    }
  });




  return NextResponse.json({ url: `${process.env.FRONTEND_STORE_URL}/?success` }, {
    headers: corsHeaders
  });
};