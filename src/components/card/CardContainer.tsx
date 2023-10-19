export  const CardContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col md:flex-row space-x-8">{children}</div>;
};
