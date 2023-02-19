import { Navigate } from "react-router-dom";
import { useAuthContext } from "src/contexts/AuthContext";

export const ProtectedRoute: React.FC<any> = ({ children }) => {
  //   const { token } = useAuth();

  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};
