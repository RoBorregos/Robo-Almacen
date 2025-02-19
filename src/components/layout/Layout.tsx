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
          { name: "About", path: "/about" },
          { name: "Celdas", path: "/manage" },
          { name: "Items", path: "/manage/items" },
          { name: "Users", path: "/manage/users", roles: ["admin"]},
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
