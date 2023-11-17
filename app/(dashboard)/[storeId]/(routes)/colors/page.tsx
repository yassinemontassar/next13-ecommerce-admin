import prismadb from "@/lib/prismadb";
import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";
import {format} from "date-fns";
import { Suspense } from "react";
import Skeleton from "@/components/skelton";
const ColorsPage = async ({
    params 
}: {
    params: {storeId: string}
}) => {
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        }, 
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedColors: ColorColumn[] = colors.map((item) => ({
        id: item.id, 
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMM do, yyyy")
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <Suspense fallback={<Skeleton/>}>
                <ColorsClient data={formattedColors} />
                </Suspense>
            </div>
        </div>
    );
};

export default ColorsPage;
