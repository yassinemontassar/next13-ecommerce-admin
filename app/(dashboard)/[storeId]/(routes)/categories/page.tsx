import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";
import {format} from "date-fns";
import { Suspense } from "react";
import Skeleton from "@/components/skelton";
const CategoriesPage = async ({
    params 
}: {
    params: {storeId: string}
}) => {
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        }, 
        include : {
            billboard: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id, 
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMM do, yyyy")
    }));

    return (
        <>
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Suspense fallback={<Skeleton/>}>
                <CategoryClient data={formattedCategories} />
                </Suspense>
            </div>
        </div>
        </>
    );
};

export default CategoriesPage;
