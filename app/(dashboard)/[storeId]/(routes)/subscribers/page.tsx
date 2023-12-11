import prismadb from "@/lib/prismadb";
import { SubscriberClient } from "./components/client";
import { SubColumn } from "./components/columns";
import {format} from "date-fns";
import { Suspense } from "react";
import Skeleton from "@/components/skelton";
const SizesPage = async ({
    params 
}: {
    params: {storeId: string}
}) => {
    const subscriber = await prismadb.subscriber.findMany({
        where: {
            storeId: params.storeId
        }, 
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSubscribers: SubColumn[] = subscriber.map((item) => ({
        id: item.id, 
        name: item.name,
        createdAt: format(item.createdAt, "MMM do, yyyy")
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <Suspense fallback={<Skeleton/>}>
                <SubscriberClient data={formattedSubscribers} />
                </Suspense>
            </div>
        </div>
    );
};

export default SizesPage;
