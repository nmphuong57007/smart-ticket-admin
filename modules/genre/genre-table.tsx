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
import { toast } from "sonner";
import { redirectConfig } from "@/helpers/redirect-config";
import Link from "next/link";
import { useDeleteRoom } from "@/api/hooks/use-room-delete";
import moment from "moment";


interface GenreTableProps {
  data: GenreType["data"];
}

export type GenreType = {
   data: {
        id: number;
        name: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
    }[];
};

type RoomItem = GenreType["data"][number];

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
    header: "Tên Phòng",
    cell: ({ row }) => (
    <div className="capitalize">{row.getValue("name")}</div>
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
    header: "Hành Động",
    cell: ({ row }) => {
      const genre = row.original;

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
                navigator.clipboard.writeText(genre.id.toString());
                toast.success(
                  `Đã sao chép ID ${genre.id} rạp chiếu phim vào clipboard`
                );
              }}
            >
              Sao chép ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={redirectConfig.genreUpdate(genre.id)}>Sửa thể loại</Link>
            </DropdownMenuItem>
             <DropdownMenuItem
                          onSelect={() => {
                          if (confirm("Bạn chắc chắn muốn xóa thể loại phim này?")) {
                            deleteRoom(genre.id);
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

export function GenreTable({
  data,
}: GenreTableProps) {
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
