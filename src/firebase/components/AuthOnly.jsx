import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function AuthOnly({ children }) {
  const [user, loading] = useAuthState(auth);


  if (user) {
    return <>{children}</>;
  }
}
