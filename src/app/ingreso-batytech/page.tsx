import type { Metadata } from "next";
import AdminLoginPage from "@/app/admin/login/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function OwnerAccessPage() {
  return <AdminLoginPage />;
}
