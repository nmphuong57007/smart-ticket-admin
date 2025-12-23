"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useUser } from "@/api/hooks/use-user";
import UserTable from "./user-table";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Spinner } from "@/components/ui/spinner";
import Search from "@/components/search";

const per_page = 10;
export default function UserContainer() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");


  const {
    data: users,
    isError,
    isLoading,
    refetch: refetchUsers,
  } = useUser(per_page, page, search);

  if (isError) toast.error("Đã có lỗi xảy ra khi tải danh sách người dùng.");

  console.log(users);

  return (
    <CardWrapperTable title="Quản lý Người dùng" actions={null}>
      <div className="space-y-6">
          <Search
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            loading={isLoading}
          />

          {isLoading ? (
            <Spinner className="size-10 mx-auto" />
          ) : (
            <UserTable
              data={users?.data.users || []}
              setPage={setPage}
              lastPage={users?.data.pagination.last_page || 1}
              currentPage={page}
              refetchUsers={refetchUsers}
            />
          )}
        </div>
    </CardWrapperTable>
  );
}
