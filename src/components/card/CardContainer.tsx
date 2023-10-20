export  const CardContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col md:flex-row flex-wrap justify-around">{children}</div>;
};
