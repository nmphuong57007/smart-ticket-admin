import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { User, UserStatus } from "@/api/interfaces/user-toggle-status.interface";
import { useUserToggleStatus } from "@/api/hooks/use-user-toggle-status";
import { useState } from "react";


interface UserTableProps {
  data: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  lastPage: number;
  currentPage: number;
}



export default function UserTable({
  data,
  setPage,
  lastPage,
  currentPage,
}: UserTableProps) {
const { mutate: toggleStatus} = useUserToggleStatus();
const [loadingUserId, setLoadingUserId] = useState<number | null>(null);


const handleToggleStatus = (user: User) => {
  const newStatus: UserStatus =
    user.status === "active" ? "blocked" : "active";

  setLoadingUserId(user.id);

  toggleStatus(
    { userId: user.id, status: newStatus },
    {
      onSuccess: (res) => {
        toast.success(res.message);

        //update UI tại chỗ, KHÔNG refetch
        user.status = newStatus;
      },
      onError: () => {
        toast.error("Cập nhật trạng thái thất bại");
      },
      onSettled: () => {
        setLoadingUserId(null);
      },
    }
  );
};


  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, lastPage));
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên Người Dùng</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Số Điện Thoại</TableHead>
            <TableHead>Vai Trò</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead>Hành Động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.fullname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.role}</TableCell>

              <TableCell>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status === "active" ? "Hoạt động" : "Đã khóa"}
                </span>
              </TableCell>

              <TableCell>
                <Button
                  size="sm"
                  className="min-w-[90px]"
                  variant={user.status === "active" ? "destructive" : "default"}
                  onClick={() => handleToggleStatus(user)}
                  disabled={loadingUserId === user.id}
                >
                  {user.status === "active" ? "Khóa" : "Mở khóa"}
                  {loadingUserId === user.id && (
                    <Spinner className="ml-2 size-4" />
                  )}
                </Button>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
