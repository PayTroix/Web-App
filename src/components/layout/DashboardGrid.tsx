const DashboardGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 p-4 md:p-6">
      {children}
    </div>
  );
};

export default DashboardGrid;