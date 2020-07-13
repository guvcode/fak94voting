import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import Router, { useRouter } from "next/router";

const AuthContext = createContext({});
export const AuthProvider = ({ serverUrl, children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get("token");
      if (token) {
        console.log("Got a token in the cookies, let's see if it is valid");
        //api.defaults.headers.Authorization = `Bearer ${token}`
        const { data  } = await fetch(`${origin}/api/member`, {
          headers: { cookie: token },
        });
        if (user) setUser(user);
      }
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const loginWithCode = async (userCode) => {
    const { data: token } = fetch(`${serverUrl}/api/loginwithcode`, {
      method: "POST",
      body: JSON.stringify({
        usercode: userCode,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (token) {
      console.log("Got token");
      Cookies.set("token", token, { expires: 60 });
      const { data: user } = await fetch(`${origin}/api/member`, {
        headers: { cookie: token },
      });
      setUser(user);
      console.log("Got user", user);
    }
  };

  const logout = (email, password) => {
    Cookies.remove("token");
    setUser(null);
    window.location.pathname = "/";
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, loginWithCode, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.getInitialProps = async ({ req, query }) => {
  const { origin } = absoluteUrl(req);

  return {
    serverUrl: origin,
  };
};

export default function useAuth() {
  const context = useContext(AuthContext);
  return context;
}


export function ProtectRoute(Component) {
  return () => {
      const { user, isAuthenticated, loading } = useAuth();
      const router = useRouter()
      useEffect(() => {
          if (!isAuthenticated && !loading) Router.push('/')
      }, [loading, isAuthenticated])

      return (<Component {...arguments} />)
  }
}