"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  name: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produits",
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "phone",
    header: "Telephone",
  },
  {
    accessorKey: "address",
    header: "Addresse",
  },
  {
    accessorKey: "totalPrice",
    header: "Prix Total",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
];