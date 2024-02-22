
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

  const confirmationLink = `${process.env.FRONTEND_STORE_URL}/?token=${token}&email=${email}`;
  const info = await transporter.sendMail({
    from: 'RoundaStore <your-email@example.com>', // Replace with your actual email address
    to: email,
    subject: 'Confirmation d\'abonnement à la Newsletter de RoundaStore',
    html: `
      <div style="font-family: 'Arial', sans-serif; color: #333; text-align: center;">
        <p style="font-size: 18px;">Bienvenue chez RoundaStore !</p>
        <p style="font-size: 16px;">Cliquez sur le bouton ci-dessous pour confirmer votre abonnement à notre newsletter :</p>
        <a href="${confirmationLink}" style="display: inline-block; margin: 10px 0; padding: 10px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Confirmer l'abonnement
        </a>
        <p style="font-size: 14px;">Si le bouton ne fonctionne pas, veuillez copier et coller ce lien dans votre navigateur :</p>
        <p style="font-size: 14px; color: #4CAF50;">${confirmationLink}</p>
        <p style="font-size: 14px;">Merci de faire partie de la communauté RoundaStore !</p>
      </div>
    `,
  });



  return NextResponse.json({ url: `${process.env.FRONTEND_STORE_URL}` }, {
    headers: corsHeaders
  });


};