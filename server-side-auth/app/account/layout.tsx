import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import {
  createSessionClient,
} from "@/app/lib/server/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech Interpretations",
  description: "user account",
};

async function signOut() {
  "use server";

  const { account } = await createSessionClient();

  cookies().delete("my-custom-session");
  await account.deleteSession("current");

  redirect("/signin");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={inter.className}>
            <div className="max-w-3xl mx-auto text-slate-800">
                <header className="p-6 border-b flex items-center justify-between bg-blue-500 rounded-bl-lg rounded-br-lg">
                    <Link className="text-2xl font-bold text-white" href={"/"}>Tech Interpretations</Link>
                    <div className="flex space-x-2">
                      <Link className="bg-slate-100 grid place-items-center py-2 px-4 rounded-full font-bold shadow-md" href={"/account/create"}>Add New</Link>
                      <form action={signOut}>
                        <button className="bg-red-100 grid place-items-center py-2 text-red-600 px-4 rounded-full font-bold shadow-md" type="submit">Sign out</button>
                      </form>
                    </div>
                </header>
                <main className="p-4 text-lg">{children}</main>
            </div>
        </body>
    </html>
  );
}
