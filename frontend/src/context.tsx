import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { backend_url } from "./constant";
export const con = createContext<any | null>(null);
const Context = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", image: "" });
  const [check, setCheck] = useState(false);
  useEffect(() => {
    const isUserLoggedIn = async () => {
      try {
        const res = await axios.get(backend_url + "/isLoggedIn", {
          withCredentials: true,
        });
        if (res.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUser({
            name: res.data.name,
            email: res.data.email,
            image: res.data.image,
          });
        } else {
          setUser({ name: "", email: "", image: "" });
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    isUserLoggedIn();
  }, []);
  return (
    <con.Provider
      value={{ isLoggedIn, check, setCheck, user, setUser, setIsLoggedIn }}
    >
      {children}
    </con.Provider>
  );
};

export default Context;
