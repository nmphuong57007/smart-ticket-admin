"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useDeleteBooking } from "@/api/hooks/use-booking-delete";
import { redirectConfig } from "@/helpers/redirect-config";

import { BookingListItem } from "@/api/interfaces/booking-interface";


// =========================
// TYPES
// =========================

export type BookingType = BookingListItem;


interface BookingTableProps {
  data: BookingType[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  lastPage: number;
  currentPage: number;
}
  
// =========================
// MAIN COMPONENT
// =========================
export function BookingTable({
  data,
  setPage,
  lastPage,
  currentPage,
}: BookingTableProps) {
  const router = useRouter();
  const { mutate: deleteBooking, isPending } = useDeleteBooking();

  // =========================
  // TABLE STATE
  // =========================
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // =========================
  // COLUMNS
  // =========================
  const columns = React.useMemo<ColumnDef<BookingType>[]>(() => [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "booking_code",
      header: "Mã ĐH",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "movie_title",
      header: "Phim",
    },
    {
      accessorKey: "payment_method",
      header: "Thanh toán",
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
          {row.original.payment_method}
        </span>
      ),
    },
    {
      accessorKey: "final_amount",
      header: "Tổng tiền",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.final_amount}đ</span>
      ),
    },
    {
      id: "checkin_status",
      header: "Check-in",
      cell: ({ row }) =>
        row.original.is_checked_in ? (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            Đã check-in
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-100 text-red-500 rounded text-xs">
            Chưa check-in
          </span>
        ),
    },
    {
      id: "actions",
      header: "Hành động",
      enableHiding: false,
      cell: ({ row }) => {
        const booking = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  router.push(redirectConfig.bookingDetail(booking.id))
                }
              >
                Xem chi tiết
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}

              {/* <DropdownMenuItem
                disabled={isPending}
                onClick={() => {
                  if (confirm("Bạn chắc chắn muốn xóa đơn này?")) {
                    deleteBooking(booking.id);
                  }
                }}
                className="text-red-500"
              >
                Xóa
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  ], [router, deleteBooking, isPending]);

  // =========================
  // TABLE INSTANCE
  // =========================
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

   // logic phân trang
  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, lastPage));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // =========================
  // RENDER
  // =========================
  return (
    <>
      {/* COLUMN CONTROL */}
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto flex gap-2">
              Ẩn / Hiện Cột <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {table.getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-10">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
     <div className="flex items-center justify-end space-x-2 py-4">
             <div className="space-x-2">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={handlePreviousPage}
                 disabled={currentPage === 1}
               >
                 Trang trước
               </Button>
     
               <Button
                 variant="outline"
                 size="sm"
                 onClick={handleNextPage}
                 disabled={currentPage === lastPage}
               >
                 Trang sau
               </Button>
             </div>
           </div>

    
  
    </>
  );
}
