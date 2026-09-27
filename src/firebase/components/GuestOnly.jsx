import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function GuestOnly({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return null;
  }

  if (!user) {
    return <>{children}</>;
  }
}
