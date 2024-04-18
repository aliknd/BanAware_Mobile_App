import { useContext } from "react";
import jwtDecode from "jwt-decode";
import AuthContext from "./context";
import authStorage from "../auth/storage";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = async (authToken) => {
    try {
      await authStorage.storeToken(authToken); // Wait for the token to be stored
      const user = jwtDecode(authToken);
      setUser(user);
    } catch (error) {
      console.log("Error logging in", error);
    }
  };

  const logOut = async () => {
    try {
      await authStorage.removeToken(); // Wait for the token to be removed
      setUser(null);
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return { user, logIn, logOut };
};

export default useAuth;
