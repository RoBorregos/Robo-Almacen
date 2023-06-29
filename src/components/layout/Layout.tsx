import Head from "next/head";
import NavBar from "./NavBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Head>
        <title>Almacén-IoT</title>
        <meta name="description" content="IoT Warehouse - RoBorregos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar routes={[{name: "Home", path:"/"}, {name:"About", path:"/about"}, {name: "Dashboard", path:"/dashboard"}]} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 font-mono text-white">
        {children}
      </main>
    </>
  );
};

export default Layout;
