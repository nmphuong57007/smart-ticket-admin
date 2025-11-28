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

import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { redirectConfig } from "@/helpers/redirect-config";
import Link from "next/link";
import { useDeleteRoom } from "@/api/hooks/use-room-delete";
import moment from "moment";


interface RoomTableProps {
  data: DiscountType[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  lastPage: number;
  currentPage: number;
}

export type DiscountType = {
    id: number;
    code: string;
    discount_percent: number;
    start_date: string;
    end_date: string;
    status: string;
    status_label: string;
    is_valid: boolean;
    is_expired: boolean;
    created_at: string;
    updated_at: string;
};

type DiscontItem = DiscountType[][number];

const createColumns = (
  router: ReturnType<typeof useRouter>,
  deleteRoom: (id: number) => void,
  isPending: boolean
): ColumnDef<DiscontItem>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "code",
    header: "Tên mã giảm giá",
    cell: ({ row }) => (
    <div className="capitalize">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "discount_percent",
    header: "Phần trăm giảm giá",
    cell: ({ row }) => (
      <div className="capitalize ">{row.getValue("discount_percent")}</div>
    ),
  },
  {
    accessorKey: "status_label",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status_label")}</div>
    ),
  },
{
  accessorKey: "start_date",
  header: "Ngày Bắt Đầu",
  cell: ({ row }) => {
    const raw = row.getValue("start_date") as string | undefined;
    return (
      <div className="capitalize">
        {raw ? moment(raw).format("DD-MM-YYYY") : "-"}
      </div>
    );
  },
},
{
  accessorKey: "end_date",
  header: "Ngày Kết Thúc",
  cell: ({ row }) => {
    const raw = row.getValue("end_date") as string | undefined;
    return (
      <div className="capitalize">
        {raw ? moment(raw).format("DD-MM-YYYY") : "-"}
      </div>
    );
  },
},
{
  accessorKey: "created_at",
  header: "Ngày Tạo",
  cell: ({ row }) => {
    const raw = row.getValue("created_at") as string | undefined;
    return (
      <div className="capitalize">
        {raw ? moment(raw).format("DD-MM-YYYY") : "-"}
      </div>
    );
  },
},
{
  accessorKey: "updated_at",
  header: "Ngày Sửa Gần Nhất",
  cell: ({ row }) => {
    const raw = row.getValue("updated_at") as string | undefined;
    return (
      <div className="capitalize">
        {raw ? moment(raw).format("DD-MM-YYYY") : "-"}
      </div>
    );
  },
},


  {
    id: "actions",
    enableHiding: false,
    header: "Hành động",
    cell: ({ row }) => {
      const disconut = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(disconut.id.toString());
                toast.success(
                  `Đã sao chép ID ${disconut.id} rạp chiếu phim vào clipboard`
                );
              }}
            >
              Sao chép ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={redirectConfig.discountUpdate(disconut.id)}>Sửa mã giảm giá</Link>
            </DropdownMenuItem>
             <DropdownMenuItem
                          onSelect={() => {
                          if (confirm("Bạn chắc chắn muốn xóa mã giảm giá này này?")) {
                            deleteRoom(disconut.id);
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

export function DisconutTable({
  data,
  setPage,
  lastPage,
  currentPage,
}: RoomTableProps) {
  const router = useRouter();
  const { mutate: deleteRoom, isPending } = useDeleteRoom();
  
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(() => createColumns(router,deleteRoom,isPending), [router,deleteRoom,isPending]);

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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Ẩn / Hiện Cột <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
    </div>
  );
}
