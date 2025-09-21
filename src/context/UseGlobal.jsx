import { useContext } from "react";
import { GlobalContext } from "./GlobalContext";

export const useGlobal = () => useContext(GlobalContext);
