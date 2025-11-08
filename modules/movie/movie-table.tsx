"use client"
import Image from "next/image";
import * as React from "react"
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
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { redirectConfig } from "@/helpers/redirect-config";



interface MovieTableProps {
    data: MovieType[];
    setPage: React.Dispatch<React.SetStateAction<number>>;
    lastPage: number;
    currentPage?: number;
}

export type MovieType = {
    id: number;
    title: string;
    poster: string | null;
    trailer: string;
    description: string;
    genre: string;
    duration: number;
    format: string;
    language: string;
    release_date: string;
    end_date: string    | null;
    status: string;
    created_at: string;
    updated_at: string;
}


export const createColumns = (
  router: ReturnType<typeof useRouter>
): ColumnDef<MovieType>[] => [
  
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (<div className="capitalize">{row.getValue("id")}</div>),
  },
  {
    accessorKey: "title",
    header: "Tên Phim",
    cell: ({ row }) => (<div className="capitalize">{row.getValue("title")}</div>),
  },
   {
  accessorKey: "poster",
  header: "Ảnh Bìa",
  cell: ({ row }) => {
    const url = row.getValue("poster") as string;
    return (
      <div className="w-[80px] h-[120px] relative capitalize">
        <Image
          src={url}
          unoptimized
          alt="poster"
          fill
          className="object-cover rounded-md"
          priority
        />
      </div>
    );
  },
},
  {
  accessorKey: "trailer",
  header: "Trailer",
  cell: ({ row }) => {
    const url = row.getValue("trailer") as string;
        return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline capitalize"
        >
            Xem trailer
        </a>
        );
    },
    },

  {
    accessorKey: "description",
    header: "Mô Tả",
    cell: ({ row }) => (
    <div className="capitalize min-w-[100px] max-w-[150px] truncate capitalize" >{row.getValue("description")}</div>
),
  },
  {
    accessorKey: "genre",
    header: "Thể Loại",
    cell: ({ row }) => 
        (<div className="capitalize ">{row.getValue("genre")}</div>),
  },
  {
    accessorKey: "duration",
    header: "Thời Lượng (phút)",
    cell: ({ row }) => (<div className="capitalize text-center">{row.getValue("duration")}</div>),
  },
  {
    accessorKey: "format",
    header: "Hình Thức",
    cell: ({ row }) => (<div className="capitalize text-center">{row.getValue("format")}</div>),
  },
  {
    accessorKey: "language",
    header: "Ngôn Ngữ",
    cell: ({ row }) => {
      // Lấy giá trị language từ row
      const value = row.getValue<string>("language");

      // Map giá trị sang label tiếng Việt
      const languageMap: Record<string, string> = {
        sub: "Phụ đề",
        narrated: "Thuyết minh",
        dub: "Lồng tiếng",
      };

      return <div className="capitalize">{languageMap[value] ?? value}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
       // Lấy giá trị language từ row
      const value = row.getValue<string>("status");

      // Map giá trị sang label tiếng Việt
      const languageMap: Record<string, string> = {
        showing: "Đang chiếu",
        coming: "Sắp chiếu",
        stopped: "Ngừng chiếu",
      };

      return <div className="capitalize">{languageMap[value] ?? value}</div>;
    },
  },
  {
    id: "Hành Động",
    enableHiding: false,
    header: "Hành Động",
    cell: ({ row }) => {
      const movie = row.original

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
                navigator.clipboard.writeText(movie.id.toString());
                toast.success(
                  `Đã sao chép ID ${movie.id} phim vào clipboard`
                );

              }}
              
            >
              Sao chép ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                console.log(movie.id);
                console.log('Điều hướng đến:', redirectConfig.movieDetail(movie.id));
                router.push(redirectConfig.movieDetail(movie.id));
                
              }}
              >
              Chi tiết
              </DropdownMenuItem>
            
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function MovieTable({data,setPage,lastPage,currentPage}: MovieTableProps) {
  
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const router = useRouter();

  const columns = React.useMemo(() => createColumns(router), [router]);

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
        <Input
          placeholder="Tìm kiếm phim..."
          className="max-w-sm"
        />
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
                )
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
                  )
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

