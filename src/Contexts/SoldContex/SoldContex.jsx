import React, { createContext, useContext, useEffect, useState } from "react";

const SoldContext = createContext();

export const SoldProvider = ({ children }) => {
  const [soldProducts, setsoldProducts] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const res = await fetch("http://localhost:3000/soldProducts");
  //       if (!res.ok) throw new Error("Serverda xatolik!");

  //       const data = await res.json();
  //       setsoldProducts(data);
  //       setIsPending(false);
  //     } catch (err) {
  //       setError(err.message);
  //       setIsPending(false);
  //     }
  //   };

  //   getData();
  // }, []);

  return (
    <SoldContext.Provider value={{ soldProducts, setsoldProducts, isPending, error }}>
      {children}
    </SoldContext.Provider>
  );
};

export const useSold = () => useContext(SoldContext);
