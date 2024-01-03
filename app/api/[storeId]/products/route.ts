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
                    from: 'sawthegamer70@gmail.com',
                    to: subscriberNames,
                    subject: 'RoundaStore News',
                    html: `<h1>You're recieving this mail because you're a subscriber to RoundaStore</h1>
                           <h1>New product ${name} worth ${price} TND has been added </h1>
                           <a href="${process.env.FRONTEND_STORE_URL}/product/${producitId}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Check it out now!</a>`,
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
                        isArchived: false
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