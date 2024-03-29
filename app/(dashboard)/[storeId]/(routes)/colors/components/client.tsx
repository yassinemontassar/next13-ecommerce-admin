"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/header";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ColorsClientProps {
    data: ColorColumn[]
}

export const ColorsClient: React.FC<ColorsClientProps> =({
data 
}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
        <div className="flex items-center justify-between">
        <Heading
        title={`Couleurs (${data.length})`}
        description="Gérez les couleurs de votre magasin"
        />
        <Button  onClick={() => router.push(`/${params.storeId}/colors/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New 
        </Button>
        </div>  
        <Separator />
        <DataTable columns={columns} data={data} searchKey="name" />
        <Heading title="API" description="API calls for colors" />
        <Separator />
        <ApiList 
        entityName="colors"
        entityIdName="colorId"
        />
        </>
    )
}