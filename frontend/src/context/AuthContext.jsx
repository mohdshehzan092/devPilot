import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = (data) => {
    localStorage.setItem(
      "accessToken",
      data.tokens.accessToken
    );

    localStorage.setItem(
      "refreshToken",
      data.tokens.refreshToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "sessionId",
      data.sessionId
    );

    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("sessionId");

  setUser(null);
};
export const useAuth = () =>
  useContext(AuthContext);