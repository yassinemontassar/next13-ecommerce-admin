"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type SubColumn = {
  id: string
  name: string
  createdAt: string;
}

export const columns: ColumnDef<SubColumn>[] = [
  {
    accessorKey: "name",
    header: "Email",
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
