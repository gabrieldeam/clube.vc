// app/layout.tsx
import "./globals.css";
import { UserFlowProvider } from "../context/UserFlowContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body>
        <UserFlowProvider>
          {children}
        </UserFlowProvider>
      </body>
    </html>
  );
}
