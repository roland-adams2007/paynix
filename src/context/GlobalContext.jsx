import { createContext, useState, useRef, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAlert } from "./AlertContext";
import { Cookies } from "react-cookie";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const cookies = new Cookies();
  const { showAlert } = useAlert();
  const [bankDetails, setBankDetails] = useState([]);
  const [isBankFetching, setIsBankFetching] = useState(false);
  const fetchRef = useRef(false);

  useEffect(() => {
    if (fetchRef.current) return;
    fetchRef.current = true;

    const token = cookies.get("paynix_tokenData");
    if (token) {
      fetchBankDetails();
    }
  }, []);

  function fetchBankDetails() {
    setIsBankFetching(true);
    axiosInstance
      .post("/account/me", { type: "me" })
      .then((response) => {
        const res = response.data;
        setBankDetails(res.data);
      })
      .catch((error) => {
        const errRes = error.response?.data || {};
        let message = errRes.message || "Something went wrong. Please try again.";
        showAlert(message, "error");
      })
      .finally(() => {
        setIsBankFetching(false);
      });
  }

  return (
    <GlobalContext.Provider
      value={{
        isBankFetching,
        bankDetails,
        fetchBankDetails
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext };
