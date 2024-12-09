import { createContext, ReactNode, useEffect, useState } from "react";
import Column from "~/interfaces/Column";
import ApiService from "~/services/ApiService";

interface ColumnsContextType {
  columns: Column[];
  setColumns: (columns: Column[]) => void;
  refetchColumns: () => Promise<void>;
}

const ColumnsContext = createContext<ColumnsContextType>(
  {} as ColumnsContextType
);

export default ColumnsContext;

export function ColumnsContextProvider({ children }: { children: ReactNode }) {
  const [columns, setColumns] = useState<Column[]>([]);

  async function fetchColumns() {
    const newColumns = await ApiService.getInstance().fetchColumns();
    setColumns(newColumns);
  }

  useEffect(() => {
    fetchColumns();
  }, []);

  return (
    <ColumnsContext.Provider
      value={{
        columns,
        setColumns,
        refetchColumns: fetchColumns,
      }}
    >
      {children}
    </ColumnsContext.Provider>
  );
}
