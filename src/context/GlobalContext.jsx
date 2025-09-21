

import { createContext, useState, useRef, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAlert } from "./AlertContext";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const { showAlert } = useAlert();
  const [bankDetails, setBankDetails] = useState([]);
  const [isBankFetching, setIsBankFetching] = useState(true);
  const fetchRef = useRef(false);
  useEffect(() => {
    if (fetchRef.current == true) return;
    fetchRef.current = true;

    setIsBankFetching(true);
    axiosInstance.post("/account/me", { type: "me" })
      .then(response => {
        const res = response.data;
        setBankDetails(res.data);
      })
      .catch((error) => {
        const errRes = error.response?.data || {};
        let message =
          errRes.message || "Something went wrong. Please try again.";
        showAlert(message, "error");
      })
      .finally(() => {
        setIsBankFetching(false);
      });

  }, [])
  return (
    <GlobalContext.Provider
      value={{
        isBankFetching,
        bankDetails
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext };
