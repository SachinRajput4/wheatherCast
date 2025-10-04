import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const url = import.meta.env.VITE_BACKEND_API_URL;
const user2Url = import.meta.env.VITE_USER_2_API_URL;

const StoreContextProvider = (props) => {
  const [user1Token, setUser1Token] = useState(localStorage.getItem("user1Token"));
  const [collections, setCollections] = useState([]);
  const [message, setMessage] = useState("");
  
    useEffect(() => {
      console.log("user1Token", user1Token);

    async function loadData() {
      if (localStorage.getItem("user1Token")) {
        setUser1Token(localStorage.getItem("user1Token"));
      }
    }
    loadData();
  }, []);


  const fetchCollections = async () => {
    try {
      const response = await fetch(`${url}/api/collection/get-user1-collections`, {
        method: "GET",  
        headers: {
          "Content-Type": "application/json",
          user1token: user1Token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch collections");
      }

      setCollections(data.collections);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  // useEffect(() => {
  //   fetchCollections();
  // }, [url, user1Token]);



  const contextValue = {
    // userData,
    // setUserData,
    // loadUserProfileData,

    url,
    user2Url,
    user1Token,
    setUser1Token,
    collections,
    fetchCollections,
    message,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
