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
import Image from "next/image";

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeleteMovie } from "@/api/hooks/use-movie-delete";


interface MovieTableProps {
  data: CinemaType[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  lastPage: number;
  currentPage: number;
}

export type CinemaType = {
  id: number;
  title: string;
  poster: string;
  trailer: string;
  description: string;
  genre: string;
  duration: number;
  format: string;
  language: string;
  release_date: string;
  end_date: null;
  status: string;
  created_at: string;
  updated_at: string;
};
const createColumns = (
  router: ReturnType<typeof useRouter>,
  deleteMovie: (id: number) => void,
  isPending: boolean
): ColumnDef<CinemaType>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },

  {
    accessorKey: "title",
    header: "Tên Phim",
    cell: ({ row }) => (
      <div className="capitalize line-clamp-1 w-48">{row.getValue("title")}</div>
    ),
  },

  {
    accessorKey: "poster",
    header: "Ảnh Poster",
    cell: ({ row }) => (
      <div className="capitalize w-[80px] h-[120px] relative overflow-hidden">
        <Image
          src={row.getValue("poster")}
          alt={`Poster of ${row.getValue("title")}`}
          
          fill
          className="object-cover"
        />
      </div>
    ),
  },

  {
    accessorKey: "trailer",
    header: "Trailer",
    cell: ({ row }) => (
      <div className="capitalize">
        <a
          href={row.getValue("trailer")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600"
        >
          Xem tại đây
        </a>
      </div>
    ),
  },

  {
    accessorKey: "description",
    header: "Mô Tả",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          <div className="capitalize text-center line-clamp-1 w-48">
            {row.getValue("description")}
          </div>
        </TooltipTrigger>
      
        <TooltipContent>
          <p>{row.getValue("description")}</p>
        </TooltipContent>
      </Tooltip>
    ),
  },

  {
    accessorKey: "duration",
    header: "Thời Lượng (phút)",
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("duration")}</div>
    ),
  },

  {
    accessorKey: "release_date",
    header: "Ngày Phát Hành",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("release_date")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    header: "Hành động",
    cell: ({ row }) => {
      const cinema = row.original;

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
                navigator.clipboard.writeText(cinema.id.toString());
                toast.success(
                  `Đã sao chép ID ${cinema.id} rạp chiếu phim vào clipboard`
                );
              }}
            >
              Sao chép ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(redirectConfig.movieDetail(cinema.id));
              }}
            >
              Chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
              if (confirm("Bạn chắc chắn muốn xóa phim này?")) {
                deleteMovie(cinema.id);
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

export function MovieTable({
  data,
  setPage,
  lastPage,
  currentPage,
}: MovieTableProps) {
  const router = useRouter();
  const { mutate: deleteMovie, isPending } = useDeleteMovie();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(() => createColumns(router,deleteMovie,isPending), [router,deleteMovie,isPending]);

  

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
        {/* <Input
          placeholder="Tìm kiếm tên phim..."
          className="max-w-sm"
        /> */}
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
