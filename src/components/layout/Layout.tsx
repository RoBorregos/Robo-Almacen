import Head from "next/head";

const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Head>
        <title>Almacen-IoT</title>
        <meta name="description" content="IoT Warehouse - RoBorregos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="flex min-h-screen flex-col items-center justify-center bg-slate-900 font-mono text-white 
      "
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
