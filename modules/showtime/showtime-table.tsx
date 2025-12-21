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
import moment from "moment";
import { useDeleteShowTime } from "@/api/hooks/use-showtime-delete";


interface ShowTimeTableProps {
  data: ShowTimeType["items"];
  rooms: {
    id: number;
    name: string;
  }[];
  roomId: number | null;
  setRoomId: React.Dispatch<React.SetStateAction<number | null>>;

  setPage: React.Dispatch<React.SetStateAction<number>>;
  lastPage: number;
  currentPage: number;
}


export type ShowTimeType = {
   items: {
            id: number;
            movie_id: number;
            room_id: number;
            movie: {
                id: number;
                title: string;
                poster: string;
                duration: number;
                release_date: string;
            };
            room: {
                id: number;
                name: string;
            };
            show_date: string;
            show_time: string;
            end_time: string;
            format: string;
            language_type: string;
            price: number;
            created_at: string;
            updated_at: string;
        }[];
};

type RoomItem = ShowTimeType["items"][number];

const createColumns = (
  router: ReturnType<typeof useRouter>,
  deleteShowTime: (id: number) => void,
  isPending: boolean
): ColumnDef<RoomItem>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "room.name",
    header: "Tên Phòng Chiếu",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.room?.name}</div>
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
    accessorKey: "format",
    header: "Định Dạng",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("format")}</div>
    ),
  },
  {
    accessorKey: "show_date",
    header: "Ngày Chiếu",
    cell: ({ row }) => {
      const raw = row.getValue("show_date") as string | undefined;
      return (
        <div className="capitalize">
          {raw ? moment(raw).format("DD-MM-YYYY") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "show_time",
    header: "Giờ Chiếu",
    cell: ({ row }) => {
      const raw = row.getValue("show_time") as string | undefined;
      return <div>{raw ? moment(raw, "HH:mm").format("HH:mm") : "-"}</div>;
    },
  },
  {
    accessorKey: "end_time",
    header: "Giờ Kết Thúc",
    cell: ({ row }) => {
      const raw = row.getValue("end_time") as string | undefined;
      return <div>{raw ? moment(raw, "HH:mm").format("HH:mm") : "-"}</div>;
    },
  },

  // ==============================
  // ACTION COLUMN
  // ==============================
  {
    id: "actions",
    enableHiding: false,
    header: "Hành Động",
    cell: ({ row }) => {
      const showtime = row.original;

      // ==== TÍNH TRẠNG THÁI KHÓA ====
      const now = new Date();
      const start = new Date(`${showtime.show_date}T${showtime.show_time}`);
      const isLocked = now >= start; // nếu muốn chỉ khóa khi chiếu xong: now > end

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

            {/* COPY ID */}
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(showtime.id.toString());
                toast.success(`Đã sao chép ID ${showtime.id} vào clipboard`);
              }}
            >
              Sao chép ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* DETAIL */}
            <DropdownMenuItem
              onClick={() =>
                router.push(redirectConfig.showtimeDetail(showtime.id))
              }
            >
              Chi tiết
            </DropdownMenuItem>

            {/* UPDATE (DISABLED IF LOCKED) */}
            <DropdownMenuItem
              disabled={isLocked}
              className={isLocked ? "opacity-50 cursor-not-allowed" : ""}
              onClick={() => {
                if (!isLocked)
                  router.push(redirectConfig.showtimeUpdate(showtime.id));
              }}
            >
              Sửa suất chiếu
            </DropdownMenuItem>

            {/* DELETE */}
            <DropdownMenuItem
              onClick={() => {
                if (confirm("Bạn chắc chắn muốn xóa suất chiếu này?")) {
                  deleteShowTime(showtime.id);
                }
              }}
              disabled={isPending}
              className="text-red-500"
            >
              {isPending ? "Đang xóa..." : "Xóa"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ShowTimeTable({
  data,
  rooms,
  roomId,
  setRoomId,
  setPage,
  lastPage,
  currentPage,
}: ShowTimeTableProps) {

  const router = useRouter();
  const { mutate: deleteShowTime, isPending } = useDeleteShowTime();
  
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(() => createColumns(router,deleteShowTime,isPending), [router,deleteShowTime,isPending]);


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
      {/* FILTER */}
      <div className="flex items-center gap-4 py-4">
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={roomId ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            setRoomId(v ? Number(v) : null);
            setPage(1);
          }}
        >
          <option value="">Tất cả phòng</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
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
              table.getRowModel().rows.map((row) => {
                const st = row.original;

                // ====== XÁC ĐỊNH TÌNH TRẠNG SUẤT CHIẾU ======
                const now = new Date();
                const start = new Date(`${st.show_date}T${st.show_time}`);

                // true = đã chiếu hoặc đang chiếu
                const isLocked = now >= start;

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={isLocked ? "bg-gray-200 text-gray-600" : ""}
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
                );
              })
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
