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
      <Heading title={`Commandes (${data.length})`} description="Gérez les commandes de votre magasin" />
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API calls for orders" />
        <Separator />
        <ApiList 
        entityName="checkout"
        entityIdName="orderId"
        />
    </>
  );
};