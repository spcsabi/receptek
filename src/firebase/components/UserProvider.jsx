import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import useStore from "../store/store";
import { UserContext } from "./UserContext";

export default function UserProvider({ children }) {
  const [user, loading] = useAuthState(auth);
  const subscribeToData = useStore((state) => state.actions.subscribeToData);

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = subscribeToData(user.uid);
      return () => unsubscribe();
    }
  }, [user?.uid, subscribeToData]);

  if (loading || typeof user === "undefined") {
    return null;
  }
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
