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
import { useDisableDiscount } from "@/api/hooks/use-discount-disable";
import { DiscountDisableResInterface } from "@/api/interfaces/discount-interface";
import { useQueryClient } from "@tanstack/react-query";


interface RoomTableProps {
  data: DiscountType[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  lastPage: number;
  currentPage: number;
}

export type DiscountType = {
     id: number;
        code: string;
        type: string;
        discount_percent: null;
        discount_amount: number;
        max_discount_amount: number;
        usage_limit: number;
        used_count: number;
        remaining: number;
        movie_id: number;
        apply_for_all_movies: boolean;
        min_order_amount: number;
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
   disableDiscountFn: (
    id: number,
    options?: {
      onSuccess?: (res: DiscountDisableResInterface) => void;
      onError?: (err: unknown) => void;
    }
  ) => void,
  isDisabling : boolean,
  queryClient: ReturnType<typeof useQueryClient>
): ColumnDef<DiscontItem>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "code",
    header: "Tên Mã Giảm Giá",
    cell: ({ row }) => (
    <div className="capitalize">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại Mã",
    cell: ({ row }) => (
    <div className="capitalize">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "discount_amount",
    header: "Số Tiền Giảm",
    cell: ({ row }) => (
      <div className="capitalize ">{row.getValue("discount_amount")}</div>
    ),
  },
  {
    accessorKey: "discount_percent",
    header: "Phần Trăm Giảm Giá",
    cell: ({ row }) => (
      <div className="capitalize ">{row.getValue("discount_percent")}</div>
    ),
  },
  {
    accessorKey: "usage_limit",
    header: "Số Lần Sử Dụng",
    cell: ({ row }) => (
      <div className="capitalize ">{row.getValue("usage_limit")}</div>
    ),
  },
  {
    accessorKey: "used_count",
    header: "Đã Sử Dụng",
    cell: ({ row }) => (
      <div className="capitalize ">{row.getValue("used_count")}</div>
    ),
  },
  {
    accessorKey: "status_label",
    header: "Trạng Thái",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status_label")}</div>
    ),
  },
// {
//   accessorKey: "start_date",
//   header: "Ngày Bắt Đầu",
//   cell: ({ row }) => {
//     const raw = row.getValue("start_date") as string | undefined;
//     return (
//       <div className="capitalize">
//         {raw ? moment(raw).format("DD-MM-YYYY") : "-"}
//       </div>
//     );
//   },
// },
// {
//   accessorKey: "end_date",
//   header: "Ngày Kết Thúc",
//   cell: ({ row }) => {
//     const raw = row.getValue("end_date") as string | undefined;
//     return (
//       <div className="capitalize">
//         {raw ? moment(raw).format("DD-MM-YYYY") : "-"}
//       </div>
//     );
//   },
// },



 {
  id: "actions",
  enableHiding: false,
  header: "Hành Động",
  cell: ({ row }) => {
    const discount = row.original;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(discount.id.toString());
              toast.success(`Đã sao chép ID ${discount.id}`);
            }}
          >
            Sao chép ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Sửa */}
          <DropdownMenuItem>
            <Link href={redirectConfig.discountUpdate(discount.id)}>
              Sửa mã giảm giá
            </Link>
          </DropdownMenuItem>

          {/* Vô hiệu hóa */}
          <DropdownMenuItem
                onSelect={() => {
                    if (discount.status !== "active") {
                    toast.error("Chỉ có thể vô hiệu hóa mã đang hoạt động.");
                    return;
                    }

                    if (!confirm("Bạn có chắc muốn vô hiệu hóa mã này?")) return;

                    disableDiscountFn(discount.id, {
                    onSuccess: (res) => {
                        toast.success(res?.message || "Đã vô hiệu hóa mã.");
                        queryClient.invalidateQueries({ queryKey: ["getDiscount"], exact: false });
                       
                    },
                    onError: () => {
                        toast.error("Vô hiệu hóa thất bại!");
                    },
                    });
                }}
                disabled={isDisabling}
                className="text-yellow-600 focus:text-yellow-700"
                >
                {isDisabling ? "Đang xử lý..." : "Vô hiệu hóa"}
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
  const queryClient = useQueryClient();
  const { mutate: disableDiscountFn, isPending: isDisabling } = useDisableDiscount();

  // ---- FILTER TRẠNG THÁI ----
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

 const filteredData = React.useMemo(() => {
  if (statusFilter === "all") return data;

  return data.filter((item) => item.status === statusFilter);
}, [data, statusFilter]);


  // ----------------------------
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(
    () => createColumns(router, disableDiscountFn, isDisabling, queryClient),
    [router, disableDiscountFn, isDisabling, queryClient]
  );

  const table = useReactTable({
    data: filteredData,
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

  // Pagination
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, lastPage));
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full">
      {/* Bộ lọc trạng thái */}
      <div className="flex items-center gap-4 py-4">
        <select
          className="border rounded-md px-3 h-9"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="expired">Ngừng hoạt động</option>
        </select>

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
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bảng */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
}

