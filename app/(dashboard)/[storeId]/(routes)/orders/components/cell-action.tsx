"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OrderColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash, Check, XCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: OrderColumn;
}


export const CellAction: React.FC<CellActionProps> = ({
    data 
}) => {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Order ID copied to the clipboard")
    };

    const onDelete = async () => {
        try {
          setLoading(true);
          await axios.delete(`/api/${params.storeId}/checkout/${data.id}`);
          router.refresh();
          toast.success("Order deleted!")
        } catch (error) {
          toast.error("Make sure you removed all products using this category first!");
        } finally {
          setLoading(false);
          setOpen(false);
        }
      };

      const UpdateStatus = async () => {
        try {
          const updateData = {isPaid: data.isPaid};
          setLoading(true);
          await axios.patch(`/api/${params.storeId}/checkout/${data.id}`, updateData);
          router.refresh();
          toast.success("Order updated!")
        } catch (error) {
          toast.error("Make sure you removed all products using this category first!");
        } finally {
          setLoading(false);
        }
      };


return (
    <>
    <AlertModal 
    isOpen={open}
    onClose={() => setOpen(false)}
    onConfirm={onDelete}
    loading={loading}
    />
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
    </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
        <DropdownMenuLabel>
            Actions
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
        </DropdownMenuItem>
        <DropdownMenuItem 
        onClick={() => setOpen(true)}
        >
            <Trash className="mr-2 h-4 w-4" />
            Delete
        </DropdownMenuItem>
        <DropdownMenuItem 
        onClick={UpdateStatus}
        >
         {data.isPaid==false ? (
  <>
    <Check className="mr-2 h-4 w-4 text-green-400" />
    Mark as paid
  </>
) : 
<>
<XCircleIcon className="mr-2 h-4 w-4 text-red-700" />
Mark as unpaid
</>
}
        </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  </>
);
};