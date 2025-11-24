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
  data: RoomType["items"];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  lastPage: number;
  currentPage: number;
}

export type RoomType = {
   items: {
        id: number;
        name: string;
        seat_map: string[][];
        total_seats: number;
        status: {
            code: string;
            label: string;
        };
        created_at: string;
        updated_at: string;
    }[];
};

type RoomItem = RoomType["items"][number];

const createColumns = (
  router: ReturnType<typeof useRouter>,
  deleteRoom: (id: number) => void,
  isPending: boolean
): ColumnDef<RoomItem>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên phòng",
    cell: ({ row }) => (
    <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "total_seats",
    header: "Tổng số ghế",
    cell: ({ row }) => (
      <div className="capitalize ">{row.getValue("total_seats")}</div>
    ),
  },
  {
    accessorKey: "status.label",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.status?.label}</div>
    ),
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
      const room = row.original;

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
                navigator.clipboard.writeText(room.id.toString());
                toast.success(
                  `Đã sao chép ID ${room.id} rạp chiếu phim vào clipboard`
                );
              }}
            >
              Sao chép ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(redirectConfig.roomDetail(room.id));
              }}
            >
              Chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={redirectConfig.roomUpdate(room.id)}>Sửa phòng chiếu</Link>
            </DropdownMenuItem>
             <DropdownMenuItem
                          onSelect={() => {
                          if (confirm("Bạn chắc chắn muốn xóa phim này?")) {
                            deleteRoom(room.id);
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

export function RoomTable({
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
