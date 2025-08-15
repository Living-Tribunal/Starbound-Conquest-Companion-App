import React, { createContext, useContext, useState } from "react";

const DiceContext = createContext();

export const DiceProvider = ({ children }) => {
  const [disableDiceModifiers, setDisableDiceModifiers] = useState(true);
  return (
    <DiceContext.Provider
      value={{
        disableDiceModifiers,
        setDisableDiceModifiers,
      }}
    >
      {children}
    </DiceContext.Provider>
  );
};

export const useDiceContext = () => useContext(DiceContext);
