import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "VedaAI Console",
  description: "Next-Generation Academic Assessment Architecture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-neutral-50 text-neutral-900">
        <AuthProvider>
          {/* ✅ Renders page nodes safely without polluting global layout shells */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}