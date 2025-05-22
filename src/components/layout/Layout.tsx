import Head from "next/head";
import NavBar from "./NavBar";

import { twMerge } from "tailwind-merge";

const Layout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <Head>
        <title>Almacén-IoT</title>
        <meta name="description" content="IoT Warehouse - RoBorregos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar
        routes={[
          { name: "Home", path: "/" },
          { name: "Celdas", path: "/manage" },
          { name: "Items", path: "/manage/items" },
          { name: "Users", path: "/manage/users", roles: ["ADMIN"] },
          { name: "Profile", path: "/profile", roles: ["ADMIN", "USER"] },
          { name: "Prestamos", path: "/prestamo", roles: ["RASPI"] },
          { name: "Admin", path: "/admin", roles: ["ADMIN"] },
          {
            name: "About",
            path: "https://github.com/RoBorregos/Robo-Almacen/blob/main/README.md",
          },
        ]}
      />
      <main
        className={twMerge(
          "flex min-h-screen flex-col items-center justify-center bg-slate-900 font-mono text-white",
          className
        )}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
