import "@/public/assets/css/bootstrap.min.css";
import "@/public/assets/css/icons.min.css";
import "@/public/assets/css/app.min.css";
import "@/public/assets/css/custom.min.css";
import AuthGuard from "./utils/AuthGuard";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	
  return (
    <html lang="en" data-layout="vertical" data-topbar="light" data-sidebar="light" data-sidebar-size="lg" data-sidebar-image="none" data-preloader="disable">
      <body className="bg-light">
        <AuthProvider>
          <AuthGuard>
              {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
