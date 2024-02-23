"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string
  price: string
  size: string
  category: string
  color: string 
  isFeatured: boolean 
  isArchived: boolean 
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "isArchived",
    header: "Archivé",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
         {row.original.isArchived ? "Oui" : "Non"}
      </div>
    )
  },
  {
    accessorKey: "isFeatured",
    header: "Recommandé",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
         {row.original.isFeatured ? "Oui" : "Non"}
      </div>
    )
  },
  {
    accessorKey: "price",
    header: "Prix",
  },
  {
    accessorKey: "category",
    header: "Catégorie",
  },
  {
    accessorKey: "size",
    header: "Taille",
  },
  {
    accessorKey: "color",
    header: "Coleur",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
        {/* {row.original.color} */}
        <div 
        className="h-6 w-6 rounded-full border"
        style={{ backgroundColor: row.original.color}}
        />
      </div>
    )
  },
  
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]
