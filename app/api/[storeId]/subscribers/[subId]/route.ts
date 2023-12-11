import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET (
    req: Request, 
    {params} : {params: { subId: string}}
    ) {
    try {
   

    if (!params.subId) {
        return new NextResponse("Subscriber ID is required!", {status: 400});
    }

    const subscriber = await prismadb.subscriber.findUnique({
        where: {
            id: params.subId,
        },
    });
    
    return NextResponse.json(subscriber);
    
    } catch (error) {
        console.log('[SUBSCRIBER_GET]', error);
        return new NextResponse("Internal error", {status: 500});
        
    }
    
    };

export async function PATCH (
req: Request, 
{params} : {params: {storeId: string, subId: string}}
) {
try {
const { userId } = auth();
const body = await req.json();

const {name} = body;

if (!userId) {
    return new NextResponse("Unauthenticated!", {status: 401});
}
    
if (!name) {
    return new NextResponse("Name is required!", {status: 400});
}



if (!params.subId) {
    return new NextResponse("Subscriber ID is required!", {status: 400});
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


const subscriber = await prismadb.subscriber.updateMany({
    where: {
        id: params.subId,
    },
    data: {
        name,
    }
});

return NextResponse.json(subscriber);

} catch (error) {
    console.log('[SUBSCRIBER_PATCH]', error);
    return new NextResponse("Internal error", {status: 500});
    
}

};



export async function DELETE (
    req: Request, 
    {params} : {params: {storeId: string, subId: string}}
    ) {
    try {
    const { userId } = auth();
   

    
    if (!userId) {
        return new NextResponse("Unauthenticated!", {status: 401});
    }
        
   
    
    if (!params.subId) {
        return new NextResponse("Subscriber ID is required!", {status: 400});
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
    
    
    const subscriber = await prismadb.subscriber.deleteMany({
        where: {
            id: params.subId,
        },
    });
    
    return NextResponse.json(subscriber);
    
    } catch (error) {
        console.log('[SUBSCRIBER_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
        
    }
    
    };


    