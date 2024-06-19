import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase_config";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const Registeration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isListener, setIsListener] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      await updateProfile(userCredential.user, { displayName });

      await setDoc(doc(db, "userChats", userId), {});

      if (isListener) {
        await setDoc(doc(db, "listeners", userId), {
          uid: userId,
          email,
          displayName,
          active: false,
        });
      }

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    return <div>You are already signed in as {user.email}</div>;
  }

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Display Name:
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group checkbox-group">
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              style={{ width: "50px", paddingLeft: "0px" }}
              type="checkbox"
              checked={isListener}
              onChange={(e) => setIsListener(e.target.checked)}
            />
            <h3>Register as a Listener</h3>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
      <div className="register-link">
        Already have an account? <a href="/login">Log In</a>
      </div>
    </div>
  );
};

export default Registeration;
