import FormLogin from "./form-login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginContainer() {

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Đăng nhập vào tài khoản của bạn</CardTitle>
        <CardDescription>
          Nhập thông tin đăng nhập của bạn để tiếp tục.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormLogin />
      </CardContent>
    </Card>
  );
}
