import { useCallback, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  const [signInWithGoogle, user, signInGoogleLoading] =
    useSignInWithGoogle(auth);

  const handleGoogleAuth = useCallback(() => {
    return signInWithGoogle();
  }, [signInWithGoogle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div >
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <p>{error}</p>}
        <button type="submit">
          {isRegistering ? "Register" : "Login"}
        </button>
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Already have an account? Log in"
            : "Need an account? Register"}
        </button>
      </form>
      <div>
        <div>
          <div />
        </div>
        <div>
          <span>Or continue with</span>
        </div>
      </div>

      <button disabled={!!signInGoogleLoading} onClick={handleGoogleAuth}>
        Continue with Google
      </button>
    </div>
  );
}
