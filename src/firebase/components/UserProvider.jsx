import { createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading || typeof user === "undefined") {
    return <></>;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
