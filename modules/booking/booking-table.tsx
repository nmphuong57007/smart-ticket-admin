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
import { toast } from "sonner";

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
import Link from "next/link";
import { redirectConfig } from "@/helpers/redirect-config";


// =========================
// TYPES
// =========================
export type BookingType = {
  id: number;
  booking_code: string;
  email: string;
  movie_title: string;
  cinema: string;
  booking_date: string;
  payment_method: string;
  transaction_code: string;
  total_amount: number;
};

interface BookingTableProps {
  data: BookingType[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  lastPage: number;
  currentPage: number;
}


// =========================
// COLUMNS
// =========================
const createColumns = (
  router: ReturnType<typeof useRouter>,
  deleteBooking: (id: number) => void,
  isPending: boolean
): ColumnDef<BookingType>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="text-sm">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "booking_code",
    header: "Mã ĐH",
    cell: ({ row }) => (
      <div className="line-clamp-1 w-40 text-sm font-medium text-gray-700">
        {row.getValue("booking_code")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="line-clamp-1 w-40 text-sm text-gray-700">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "movie_title",
    header: "Phim",
    cell: ({ row }) => (
      <div className="line-clamp-1 w-40 text-sm">{row.getValue("movie_title")}</div>
    ),
  },
  {
    accessorKey: "cinema",
    header: "Rạp",
    cell: ({ row }) => (
      <div className="line-clamp-1 text-sm">{row.getValue("cinema")}</div>
    ),
  },
  {
    accessorKey: "booking_date",
    header: "Ngày đặt",
    cell: ({ row }) => (
      <div className="line-clamp-1 text-sm">{row.getValue("booking_date")}</div>
    ),
  },
  {
    accessorKey: "payment_method",
    header: "Thanh toán",
    cell: ({ row }) => (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
        {row.getValue("payment_method")}
      </span>
    ),
  },
  {
    accessorKey: "transaction_code",
    header: "Mã Code",
    cell: ({ row }) => (
      <div className="text-center font-semibold text-sm text-gray-700">
        {row.getValue("transaction_code")}
      </div>
    ),
  },
  {
    accessorKey: "total_amount",
    header: "Tổng tiền",
    cell: ({ row }) => (
      <div className="font-medium text-gray-800">{row.getValue("total_amount")}đ</div>
    ),
  },

  // ACTION MENU
  {
    id: "actions",
    enableHiding: false,
    header: "Hành động",
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition"
            >
              <MoreHorizontal className="text-gray-600" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(booking.id.toString());
                toast.success(`Đã sao chép ID ${booking.id}`);
              }}
            >
              Sao chép ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                router.push(redirectConfig.bookingDetail(booking.id));
              }}
            >
              Xem chi tiết
            </DropdownMenuItem>

            {/* <DropdownMenuItem>
              <Link href={redirectConfig.movieUpdate(booking.id)}>Sửa đơn</Link>
            </DropdownMenuItem> */}

            <DropdownMenuItem
              onSelect={() => {
                if (confirm("Bạn chắc chắn muốn xóa đơn này?")) {
                  deleteBooking(booking.id);
                }
              }}
              disabled={isPending}
              className="text-red-500 focus:text-red-600"
            >
              {isPending ? "Đang xóa..." : "Xóa"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


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

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(
    () => createColumns(router, deleteBooking, isPending),
    [router, deleteBooking, isPending]
  );

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

  // Pagination logic
  const handleNextPage = () => setPage((p) => Math.min(p + 1, lastPage));
  const handlePreviousPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className="w-full">

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
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-gray-700 font-semibold text-sm py-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 text-sm text-gray-700"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-500 text-sm"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-end space-x-3 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Trang trước
        </Button>

        <span className="text-sm text-gray-600">
          Trang <b>{currentPage}</b> / {lastPage}
        </span>

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
  );
}
