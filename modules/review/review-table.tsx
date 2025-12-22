import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
// import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteReview } from "@/api/hooks/use-review-delete";
import { useApproveReview } from "@/api/hooks/use-review-approve";
import { useRejectReview } from "@/api/hooks/use-review-reject";

interface ReviewTableProps {
  data: ReviewType["data"];
}

export type ReviewType = {
   data: {
        id: number;
        user_id: number;
        movie_id: number;
        rating: number;
        comment: string;
        status: string;
        created_at: string;
        updated_at: string;
        user: {
            id: number;
            fullname: string;
        };
        movie: {
            id: number;
            title: string;
        };
    }[];
};

type ReviewItem = ReviewType["data"][number];

  const STATUS: Record<string, string> = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
  };

  const STATUS_CLASS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};


const createColumns = (
  router: ReturnType<typeof useRouter>,
  deleteReview: (id: number) => void,
  isPending: boolean,
  approveReview: (id: number) => void,
  approving: boolean,
  rejectReview: (id: number) => void,
  rejecting: boolean
): ColumnDef<ReviewItem>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "user.fullname",
    header: "Tên Người Dùng",
    cell: ({ row }) => (
    <div className="capitalize">{row.original.user?.fullname}</div>
    ),
  },
  {
    accessorKey: "movie.title",
    header: "Tên Phim",
    cell: ({ row }) => (
    <div className="capitalize">{row.original.movie?.title}</div>
    ),
  },
  {
    accessorKey: "comment",
    header: "Nội Dung Đánh Giá",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          <div className="capitalize text-center line-clamp-1 w-48">
            {row.getValue("comment")}
          </div>
        </TooltipTrigger>
      
        <TooltipContent>
          <p>{row.getValue("comment")}</p>
        </TooltipContent>
      </Tooltip>
    ),
  },
{
accessorKey: "status",
header: "Trạng Thái",
cell: ({ row }) => {
    const status = row.getValue("status") as string;

    return (
    <span
        className={`px-2 py-1 rounded text-xs font-medium ${
        STATUS_CLASS[status] ?? "bg-gray-100 text-gray-600"
        }`}
    >
        {STATUS[status] ?? "Không xác định"}
    </span>
        );
    },
},
  // {
  //   accessorKey: "rating",
  //   header: "Đánh Giá ",
  //   cell: ({ row }) => (
  //   <div className="capitalize">{row.getValue("rating")}⭐</div>
  //   ),
  // },


{
  id: "actions",
  enableHiding: false,
  header: "Hành Động",
  cell: ({ row }) => {
    const review = row.original;

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
          <DropdownMenuSeparator />

          {/* ========== PENDING ========== */}
          {review.status === "pending" && (
            <>
              <DropdownMenuItem
                onSelect={() => approveReview(review.id)}
                disabled={approving}
                className="text-green-600 focus:text-green-700"
              >
                {approving ? "Đang duyệt..." : "Duyệt đánh giá"}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => rejectReview(review.id)}
                disabled={rejecting}
                className="text-yellow-600 focus:text-yellow-700"
              >
                {rejecting ? "Đang xử lý..." : "Từ chối đánh giá"}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          {/* ========== APPROVED ========== */}
          {review.status === "approved" && (
            <>
              <DropdownMenuItem
                disabled
                className="text-green-600 opacity-60 cursor-not-allowed"
              >
                Đã duyệt
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          {/* ========== REJECTED ========== */}
          {review.status === "rejected" && (
            <>
              <DropdownMenuItem
                disabled
                className="text-yellow-600 opacity-60 cursor-not-allowed"
              >
                Đã từ chối
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          {/* ========== DELETE (ALWAYS) ========== */}
          <DropdownMenuItem
            onSelect={() => {
              if (confirm("Bạn chắc chắn muốn xóa đánh giá này?")) {
                deleteReview(review.id);
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

export function ReviewTable({
  data,
}: ReviewTableProps) {
  const router = useRouter();
  const { mutate: deleteReview, isPending } = useDeleteReview();
  const { mutate: approveReview, isPending: approving } = useApproveReview();
  const { mutate: rejectReview, isPending: rejecting } = useRejectReview();
  
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(() => createColumns(router,deleteReview,isPending,approveReview,approving,rejectReview,rejecting), [router,deleteReview,isPending,approveReview,approving,rejectReview,rejecting]);


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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

    </div>
  );
}
