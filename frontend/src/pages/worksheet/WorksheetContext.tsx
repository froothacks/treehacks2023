import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";

type TWorksheetContextState = {};

const DEFAULT_STATE: TWorksheetContextState = {};

const WorksheetContext: React.Context<TWorksheetContextState> =
  createContext(DEFAULT_STATE);

export const useWorksheetContext = () => useContext(WorksheetContext);

const UUID = 1231314152141;

export const WorksheetContextProvider: React.FC<any> = ({ children }) => {
  const [worksheetID, setWorksheetID] = useState<number | undefined>();

  return (
    <WorksheetContext.Provider value={{}}>{children}</WorksheetContext.Provider>
  );
};
