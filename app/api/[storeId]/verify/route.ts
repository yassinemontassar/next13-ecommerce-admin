
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
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

  const { email, token } = await req.json();

  const subscribers = await prismadb.subscriber.findMany({
    where: {
        name: email,
    },
});

if (subscribers.length > 0) {
  return new NextResponse("Subscriber exists", {
    status: 200,
    headers: corsHeaders
  });
}


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sawthegamer70@gmail.com',
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: 'RoundaStore',
    to: email,
    subject: 'Confirmation d\'abonnement à la Newsletter de RoundaStore',
    html: `<p>Copiez le lien suivant pour confirmer votre abonnement à notre newsletter :</p>
           <h1> ${process.env.FRONTEND_STORE_URL}/?token=${token}&email=${email}</h1>`,
  });




  return NextResponse.json({ url: `${process.env.FRONTEND_STORE_URL}` }, {
    headers: corsHeaders
  });


};