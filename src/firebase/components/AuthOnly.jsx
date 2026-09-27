import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useEffect } from "react";
import  useStore  from "../../store/store";

export default function AuthOnly({ children }) {
  const [user, loading] = useAuthState(auth);
  const { subscribeToData } = useStore((state) => state.actions);

  useEffect(() => {
    const unsubscribe = subscribeToData();
    return () => unsubscribe();
  }, [subscribeToData]);

  if (loading) {
    return null;
  }

  if (user) {
    return <>{children}</>;
  }
}
