import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContentsPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Nội dung</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung quản lý nội dung sẽ được phát triển ở đây</p>
        </CardContent>
      </Card>
    </div>
  );
}