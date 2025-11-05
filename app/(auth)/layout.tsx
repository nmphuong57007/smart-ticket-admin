interface AuthLayoutProps {
  readonly children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full max-w-sm flex items-center justify-center mx-auto h-screen">
      {children}
    </div>
  );
}
