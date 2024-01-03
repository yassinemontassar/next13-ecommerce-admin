import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import {format} from "date-fns";
import { formatTND } from "@/lib/utils";
import { Suspense } from "react";
import Skeleton from "@/components/skelton";
const ProductsPage = async ({
    params 
}: {
    params: {storeId: string}
}) => {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        }, 
        include: {
            category: true,
            size:true,
            color: true,
        }, 
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id, 
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price:  formatTND(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name, 
        color: item.color.value,
        createdAt: format(item.createdAt, "MMM do, yyyy")
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <Suspense fallback={<Skeleton/>}>
                <ProductClient data={formattedProducts} />
                </Suspense>
            </div>
        </div>
    );
};

export default ProductsPage;
