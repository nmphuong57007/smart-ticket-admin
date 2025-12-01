"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";
import Search from "@/components/search";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useContentPosts } from "@/api/hooks/use-post";
import { NewTable } from "./post-new-table";
import { PromotionTable } from "./post-promotion-table";

const per_page = 10;

export default function PostContainerTabs() {
  // Tab state
  const [tab, setTab] = useState<"news" | "promotions">("news");

  // State riêng cho từng tab
  const [pageNews, setPageNews] = useState(1);
  const [pagePromo, setPagePromo] = useState(1);

  const [searchNews, setSearchNews] = useState("");
  const [searchPromo, setSearchPromo] = useState("");

  // Fetch both news & promotions
  const { news, promotions, isError } = useContentPosts(
    per_page,
    tab === "news" ? pageNews : pagePromo,
    tab === "news" ? searchNews : searchPromo
  );

  if (isError) toast.error("Lỗi tải danh sách dữ liệu");

  return (
    <CardWrapperTable
      title="Quản lý Nội dung"
      actions={
        <Fragment>
          <Button asChild>
            <Link href={redirectConfig.createContents}>Thêm mới</Link>
          </Button>
        </Fragment>
      }
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as "news" | "promotions")}>
        <TabsList className="mb-4">
          <TabsTrigger value="news">Tin tức</TabsTrigger>
          <TabsTrigger value="promotions">Khuyến mãi</TabsTrigger>
        </TabsList>

        {/* 🔵 TAB 1: NEWS */}
        <TabsContent value="news">
          <Search
            value={searchNews}
            onChange={(v) => {
              setSearchNews(v);
              setPageNews(1);
            }}
            onSearch={(v) => {
              setSearchNews(v);
              setPageNews(1);
            }}
          />

          {!news ? (
            <Spinner className="size-10 mx-auto" />
          ) : (
            <NewTable
              data={news.data.items}
              setPage={setPageNews}
              lastPage={news.data.pagination.last_page}
              currentPage={pageNews}
            />
          )}
        </TabsContent>

        {/* 🔴 TAB 2: PROMOTIONS */}
        <TabsContent value="promotions">
          <Search
            value={searchPromo}
            onChange={(v) => {
              setSearchPromo(v);
              setPagePromo(1);
            }}
            onSearch={(v) => {
              setSearchPromo(v);
              setPagePromo(1);
            }}
          />

          {!promotions ? (
            <Spinner className="size-10 mx-auto" />
          ) : (
            <PromotionTable
              data={promotions.data.items}
              setPage={setPagePromo}
              lastPage={promotions.data.pagination.last_page}
              currentPage={pagePromo}
            />
          )}
        </TabsContent>
      </Tabs>
    </CardWrapperTable>
  );
}
