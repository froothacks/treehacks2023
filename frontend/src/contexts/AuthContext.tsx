import React, { createContext, useContext, useMemo, useEffect } from "react";

type TAuthContextState = {
  isAuthenticated: boolean;
};

const DEFAULT_STATE: TAuthContextState = {
  isAuthenticated: false,
};

const AuthContext: React.Context<TAuthContextState> =
  createContext(DEFAULT_STATE);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider: React.FC<any> = ({ children }) => {
  /**
   * Build state
   */
  const userState: TAuthContextState = { isAuthenticated: true };

  return (
    <AuthContext.Provider value={userState}>{children}</AuthContext.Provider>
  );
};
