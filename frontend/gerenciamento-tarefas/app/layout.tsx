import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/authContext";
import { ThemeProvider } from "./_components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manager Tasks",
  description: "manage your tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider 
        attribute="class"
        defaultTheme="system"
        themes={['light', 'dark', 'dark-green', 'green', 'rose', 'dark-rose']}
        //enableSystem
        //disableTransitionOnChange
        >
          <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        </ThemeProvider>
       
        
      </body>
    </html>
  );
}
