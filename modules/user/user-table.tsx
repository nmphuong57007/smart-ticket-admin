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
import { useDeleteUser } from "@/api/hooks/use-user-delete";
import { Spinner } from "@/components/ui/spinner";

interface UserTableProps {
  data: UserType[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  lastPage: number;
  currentPage: number;
  refetchUsers: () => void;
}

export type UserType = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  address: null;
  gender: null;
  avatar: string;
  role: string;
  points: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function UserTable({ data, refetchUsers }: UserTableProps) {
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleDeleteUser = (userID: number) => {
    deleteUser(userID, {
      onSuccess: () => {
        refetchUsers();
        toast.success("Xóa người dùng thành công.");
      },

      onError: () => {
        toast.error("Lỗi khi xóa người dùng.");
      },
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
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
            <TableCell>{user.status}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete User
                {isDeleting && <Spinner className="ml-2 size-4" />}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
