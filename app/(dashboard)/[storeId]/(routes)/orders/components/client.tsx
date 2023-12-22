"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";

import { columns, OrderColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({
  data
}) => {
  return (
    <>
      <Heading title={`Orders (${data.length})`} description="Manage orders for your store" />
      <Separator />
      <DataTable searchKey="phone" columns={columns} data={data} />
      <Heading title="API" description="API calls for orders" />
        <Separator />
        <ApiList 
        entityName="checkout"
        entityIdName="orderId"
        />
    </>
  );
};