import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import env from "@/config";

type AuthContextData = {
  token: string | null;
  tokenExpiration: string | null;
  isTokenValid: boolean;
  loading: boolean;
  saveToken: (newToken: string) => void;
  removeToken: () => void;
  checkTokenValidity: () => boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

function decodedToken(token: string) {
  const [, payload] = token.split(".");
  return JSON.parse(atob(payload));
}

export async function customFetch({
  endpoint,
  options = {},
}: {
  endpoint: string;
  options: RequestInit;
}): Promise<Response> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(env.VITE_API_URL + endpoint, fetchOptions);

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiration");
    window.location.href = "/";
  }

  return response;
}

// AuthProvider will be used to store the token and expiration date on localStorage
// it will also have a function to check if the token is still valid
// it will also have a function to remove the token from localStorage and context
// it will be used by the Login component to store the token
// it will be used by the ProtectedRoute component to check if the token is still valid
// it will be used by the ProtectedRoute component to remove the token
// it's main goal is to be able to:
// redirect to the login page while trying to access a protected route without a valid token
// redirect to the protected route while trying to access the login page with a valid token
export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiration, setTokenExpiration] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // validateToken will be used to check if the token is still valid
  // it will receive the stored token and expiration date from localStorage
  // if there is no token or expiration date, it will return false
  // then it will compare the expiration date with the current date
  // it is used in the useEffect that only runs once when the component (AuthProvider) mounts to check if the token is still valid
  // and it is also used by checkTokenValidity to check if the token is still valid by the ProtectedRoute component
  function validateToken(storedToken: string, storedExpiration: string) {
    if (!storedToken || !storedExpiration) return false;

    const expirationDate = new Date(storedExpiration);
    const now = new Date();
    return expirationDate > now;
  }

  // this useEffect will check if there is a token and expiration on localStorage
  // if there is, it will validate the token and set the context states
  // if the token is not valid, it will remove the token from localStorage
  // this useEffect is only called once, when the component (AuthProvider) is mounted
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedExpiration = localStorage.getItem("token_expiration");

    if (storedToken && storedExpiration) {
      if (validateToken(storedToken, storedExpiration)) {
        setToken(storedToken);
        setTokenExpiration(storedExpiration);
        setIsTokenValid(true);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiration");
      }
    }

    setLoading(false);
  }, []);

  // checkTokenValidity will be use by the ProtectedRoute component to check if the token is still valid
  // if the token is not valid, it will remove the token from localStorage and context and return false
  // the navigation to the Login should be done by the ProtectedRoute component
  // if the token is valid, it will set the isTokenValid state to true and return true
  function checkTokenValidity() {
    if (token && tokenExpiration) {
      const valid = validateToken(token, tokenExpiration);

      if (!valid) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiration");
        setToken(null);
        setTokenExpiration(null);
        setIsTokenValid(false);
        return false;
      }

      setIsTokenValid(true);
      return true;
    }

    return false;
  }

  // saveToken will be use by the Login component to only store the token on localStorage and context
  // the navigation to the ProtectedRoute should be done by the Login component
  function saveToken(newToken: string) {
    const { exp } = decodedToken(newToken);
    const expiresAt = new Date(exp * 1000).toISOString();

    localStorage.setItem("token", newToken);
    localStorage.setItem("token_expiration", expiresAt);

    setToken(newToken);
    setTokenExpiration(expiresAt);
    setIsTokenValid(true);
  }

  // removeToken will be use by the ProtectedRoute component to remove the token from localStorage and context
  // the navigation to the Login should be done by the ProtectedRoute component
  // this could also be used in a logout button, but for this app we don't have one
  function removeToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiration");

    setToken(null);
    setTokenExpiration(null);
    setIsTokenValid(false);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        tokenExpiration,
        isTokenValid,
        loading,
        saveToken,
        removeToken,
        checkTokenValidity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
