"use client";
import { useState } from "react";
import { account, ID } from "./appwrite";

interface LoggedInUser {
  $id: string;
  email: string;
  name?: string;  // Adjust according to actual data structure
  // Add other properties if needed
}

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      setLoggedInUser(await account.get());
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const register = async () => {
    try {
      await account.create(ID.unique(), email, password, name);
      login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setLoggedInUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loggedInUser) {
    return (
      <div>
        <p>Logged in as {loggedInUser.name || "User"}</p>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{"padding":"20px", "border":"1px solid white", "margin":"auto", "width":"50%"}}>
      <p>Not logged in</p>
      <form style={{"display":"flex", "flexDirection":"column", "gap":"10px"}}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          style={{"color":"black"}}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          style={{"color":"black"}}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          style={{"color":"black"}}
          onChange={(e) => setName(e.target.value)}
        />
        <div style={{"display":"flex", "justifyContent":"space-between"}}>
          <button type="button" onClick={() => login(email, password)}>
            Login
          </button>
          <button type="button" style={{"background":"green", }} onClick={register}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
