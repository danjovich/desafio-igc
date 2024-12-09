import { useContext } from "react";
import ColumnsContext from "~/contexts/columns-context";

export default function useColumns() {
  return useContext(ColumnsContext);
}
