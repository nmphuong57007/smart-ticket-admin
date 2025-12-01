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
import moment from "moment";
import Image from "next/image";
import { ToggleBannerStatus } from "@/components/toggle-banner-status";
import {  useDeletePromotion } from "@/api/hooks/use-post-delete";
import { useUpdatePost } from "@/api/hooks/use-post-update";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";



interface PromotionTableProps {
  data: PromotionType["items"];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  lastPage: number;
  currentPage: number;
}

export type PromotionType = {
    items: {
            id: number;
            type: string;
            title: string;
            short_description: string;
            description: string;
            slug: string;
            image: string;
            is_published: boolean;
            published_at: string;
            unpublished_at: string;
            created_by: number;
            created_by_name: string;
            created_at: string;
            updated_at: string;
        }[];
};

type BannerItem = PromotionType["items"][number];

const createColumns = (
  router: ReturnType<typeof useRouter>,
  useDeletePromotion: (id: number) => void,
  deletePending: boolean,
  UpdatePost: (
    params: { id: number; data: FormData },
    options?: { onSuccess?: () => void; onError?: () => void }
  ) => void,
  updatePending: boolean
): ColumnDef<BannerItem>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
    {
      accessorKey: "image",
      header: "Ảnh",
      cell: ({ row }) => (
        <div className="capitalize w-[130px] h-[80px] relative overflow-hidden">
          <Image
            src={row.getValue("image")}
            alt={`Poster of ${row.getValue("image")}`}
            
            fill
            className="object-cover"
          />
        </div>
      ),
    },
  {
    accessorKey: "title",
    header: "Thông Tin",
    cell: ({ row }) => (
    <div className="capitalize">{row.getValue("title")}</div>
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
  accessorKey: "published_at",
  header: "Ngày Phát Hành",
  cell: ({ row }) => {
    const raw = row.getValue("published_at") as string | undefined;
    return (
      <div className="capitalize">
        {raw ? moment(raw).format("DD-MM-YYYY") : "-"}
      </div>
    );
  },
},
{
  accessorKey: "unpublished_at",
  header: "Ngày Kết Thúc",
  cell: ({ row }) => {
    const raw = row.getValue("unpublished_at") as string | undefined;
    return (
      <div className="capitalize">
        {raw ? moment(raw).format("DD-MM-YYYY") : "-"}
      </div>
    );
  },
},
{
  accessorKey: "is_published",
  header: "Trạng Thái",
  cell: ({ row }) => {
    const item = row.original;

    return (
      <ToggleBannerStatus
        id={item.id}
        value={item.is_published}
         queryKey="promoPosts"
        updateFn={UpdatePost}
        isPending={updatePending}
      />
    );
  },
},

  {
    id: "actions",
    enableHiding: false,
    header: "Hành Động",
    cell: ({ row }) => {
      const post = row.original;

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
                navigator.clipboard.writeText(post.id.toString());
                toast.success(
                  `Đã sao chép ID ${post.id} rạp chiếu phim vào clipboard`
                );
              }}
            >
              Sao chép ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={redirectConfig.contentsUpdate(post.id)}>Sửa bài viết</Link>
            </DropdownMenuItem>
             <DropdownMenuItem
                          onSelect={() => {
                          if (confirm("Bạn chắc chắn muốn xóa bài viết này?")) {
                            useDeletePromotion(post.id);
                          }
                          }}
                          disabled={deletePending}
                          className="text-red-500 focus:text-red-600"
                        >
                          {deletePending ? "Đang xóa..." : "Xóa"}
                        </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function PromotionTable({
  data,
  setPage,
  lastPage,
  currentPage,
  
}: PromotionTableProps) {
  const router = useRouter();
  const { mutate: deletePost, isPending: deletePending } = useDeletePromotion();
  const { mutate: updatePost, isPending: updatePending } = useUpdatePost();
  
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(() => createColumns(router,deletePost,deletePending,updatePost,updatePending), [router,deletePost,deletePending,updatePost,updatePending]);

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
