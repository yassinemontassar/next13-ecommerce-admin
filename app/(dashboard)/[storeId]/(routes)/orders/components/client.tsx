"use client";

import { Heading } from "@/components/ui/header";
import { OrderColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
    data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> =({
data 
}) => {

    return (
        <>
        <Heading
        title={`Orders (${data.length})`}
        description="Manage Orders for your store"
        /> 
        <Separator />
        <DataTable columns={columns} data={data} searchKey="product" />
        </>
    )
}