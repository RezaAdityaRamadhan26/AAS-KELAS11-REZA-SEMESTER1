import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";

export const metadata = { title: "StarLib" };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
