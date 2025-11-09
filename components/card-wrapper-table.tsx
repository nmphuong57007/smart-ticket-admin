import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CardWrapperTableProps {
  readonly children: React.ReactNode;
  title?: string | React.ReactNode;
  actions?: React.ReactNode;
}

export default function CardWrapperTable({
  children,
  title,
  actions,
}: CardWrapperTableProps) {
  return (
    <div className="mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <p>{title}</p>

              <div className="flex items-center gap-3">{actions}</div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
