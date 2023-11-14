import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
  ) {
    try {
      if (!params.productId) {
        return new NextResponse("Product id is required", { status: 400 });
      }
  
      const product = await prismadb.product.findUnique({
        where: {
          id: params.productId
        },
        include: {
          images: true,
          category: true,
          size: true,
          color: true,
        }
      });
    
      return NextResponse.json(product);
    } catch (error) {
      console.log('[PRODUCT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };

export async function PATCH (
req: Request, 
{params} : {params: {storeId: string, productId: string}}
) {
try {
const { userId } = auth();
const body = await req.json();

const { 
    name,
    price, 
    categoryId,
    colorId, 
    sizeId,
    images, 
    isFeatured, 
    isArchived
 } = body;  

if (!userId) {
    return new NextResponse("Unauthenticated!", {status: 401});
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

if (!params.productId) {
    return new NextResponse("Product ID is required!", {status: 400});
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


await prismadb.product.update({
    where: {
      id: params.productId
    },
    data: {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images: {
        deleteMany: {},
      },
      isFeatured,
      isArchived,
    },
  });

  const product = await prismadb.product.update({
    where: {
      id: params.productId
    },
    data: {
      images: {
        createMany: {
          data: [
            ...images.map((image: { url: string }) => image),
          ],
        },
      },
    },
  })

  return NextResponse.json(product);

} catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", {status: 500});
    
}

};



export async function DELETE (
    req: Request, 
    {params} : {params: {storeId: string, productId: string}}
    ) {
    try {
    const { userId } = auth();
   

    
    if (!userId) {
        return new NextResponse("Unauthenticated!", {status: 401});
    }
        
   
    
    if (!params.productId) {
        return new NextResponse("Product ID is required!", {status: 400});
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
    
    
    const product = await prismadb.product.deleteMany({
        where: {
            id: params.productId,
        },
    });
    
    return NextResponse.json(product);
    
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
        
    }
    
    };


    