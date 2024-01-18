import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
  });
  

export async function DELETE (
  req: Request, 
  {params} : {params: {publicId: string}}
  ) {
  try {
  const { userId } = auth();
 

  
  if (!userId) {
      return new NextResponse("Unauthenticated!", {status: 401});
  }
      
 
  
  if (!params.publicId) {
      return new NextResponse("public ID is required!", {status: 400});
  }


  const result = cloudinary.uploader.destroy(params.publicId);
    console.log(params.publicId)
  return NextResponse.json(result);
  
  } catch (error) {
      console.log('[IMAGE_DELETE]', error);
      return new NextResponse("Internal error", {status: 500});
      
  }
  
  };
