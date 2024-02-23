import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
export async function POST(
    req: Request, 
    {params} : {params: { storeId: string}}
    ) {

        try {
            const { userId } = auth();
            const body = await req.json();
            const { 
                name,
                price, 
                discount,
                categoryId,
                colorId, 
                sizeId,
                images, 
                isFeatured, 
                isArchived,
                isSent
             } = body;   

            if (!userId) {
                return new NextResponse("Unauthenticated", {status: 401});
            }

            if (!name) {
                return new NextResponse("name is required", {status: 400});
            }

            if (!price) {
                return new NextResponse("price is required", {status: 400});
            }

            if (!categoryId) {
                return new NextResponse("category is required", {status: 400});
            }
            if (!colorId) {
                return new NextResponse("color is required", {status: 400});
            }
            if (!sizeId) {
                return new NextResponse("size is required", {status: 400});
            }
            if (!images || !images.length) {
                return new NextResponse("images are required", {status: 400});
            }
    


            if (!params.storeId) {
                return new NextResponse("Store ID is required", {status: 400});
            }

            const storeByUserId = await prismadb.store.findFirst({
                where: {
                    id: params.storeId,
                    userId
                }
            });

            if (!storeByUserId) {
                return new NextResponse("Unauthorized", {status: 403});
            }

            
            const product = await prismadb.product.create({
                data: {
                    name, 
                    price,
                    discount,
                    isFeatured,
                    isArchived,
                    isSent,
                    categoryId,
                    colorId,
                    sizeId,
                    storeId: params.storeId,
                    images: {
                        createMany: {
                            data: [
                                ...images.map((image : {url: string }) => image)
                            ]
                        }
                    }
                }
            });


            if (isSent == true) {
                const producitId= product.id
                const subscribers = await prismadb.subscriber.findMany({
                    where: {
                      storeId: params.storeId
                    }
                  });
                  const subscriberNames = subscribers.map(subscriber => subscriber.name);
                  
                  const transporter = nodemailer.createTransport({
                    service: 'sawthegamer70@gmail.com',
                    auth: {
                      user: 'sawthegamer70@gmail.com',
                      pass: process.env.GMAIL_PASSWORD,
                    },
                  });
                  
                  const info = await transporter.sendMail({
                    from: 'RoundaStore',
                    to: subscriberNames,
                    subject: 'Découvrez les dernières nouveautés chez RoundaStore',
                    html: `
                      <div style="font-family: 'Arial', sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
                      <img src="https://res.cloudinary.com/dtquv74c5/image/upload/v1708723083/305225777_504878824974401_1233273048854658660_n_lf9wum.jpg" alt="RoundaStore Logo" style="max-width: 150px; border-radius: 50%; margin-bottom: 20px;">
                        <h2 style="color: #333;">Vous recevez cet e-mail car vous êtes abonné à RoundaStore</h2>
                        <div style="border-top: 2px solid #007bff; margin: 20px 0;"></div>
                        <h1 style="color: #007bff; margin-bottom: 10px;">🎉 Nouveauté chez RoundaStore ! 🎉</h1>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">
                          Nous avons ajouté un nouveau produit à notre collection :
                          <strong>${name}</strong> d'une valeur de <strong>${price} TND</strong>.
                        </p>
                        <a href="${process.env.FRONTEND_STORE_URL}/product/${producitId}"
                          style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                          Découvrez-le maintenant !
                        </a>
                        <div style="border-top: 2px solid #007bff; margin: 20px 0;"></div>
                        <p style="color: #777; font-size: 12px;">Merci de faire partie de la famille RoundaStore!</p>
                      </div>
                    `,
                  });
                  
            }


            return NextResponse.json(product);
        } catch (error) {
            console.log('[PRODUCTS_POST', error);
            return new NextResponse("Internal error", {status: 500});
        }
    }


    export async function GET(
        req: Request, 
        {params} : {params: { storeId: string}}
        ) {
    
            try {
                
             const {searchParams} = new URL(req.url);
             const categoryId= searchParams.get("categoryId") || undefined;
             const name = searchParams.get("name") || undefined;
             const price = searchParams.get("price") || undefined;
             const colorId= searchParams.get("colorId") || undefined;
             const sizeId= searchParams.get("sizeId") || undefined;
             const isFeatured= searchParams.get("isFeatured") ;
             const isNew = searchParams.get("isNew") || undefined;

    
                if (!params.storeId) {
                    return new NextResponse("Store ID is required", {status: 400});
                }
    
                const products = await prismadb.product.findMany({
                    where: {
                        storeId: params.storeId,
                        name: {
                            contains: name,
                            mode: 'insensitive', // Case-insensitive search
                        },
                        price: {
                            lte: price, // Less than or equal to the specified price
                        },
                        categoryId,
                        colorId,
                        sizeId,
                        isFeatured: isFeatured ? true : undefined,
                        isArchived: false,
                        updatedAt: isNew
                        ? {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                          }
                        : undefined,
                    },
                    include: {
                        images: true,
                        category: true,
                        color: true, 
                        size: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                return NextResponse.json(products);
               
            } catch (error) {
                console.log('[PRODUCTS_GET', error);
                return new NextResponse("Internal error", {status: 500});
            }
        }