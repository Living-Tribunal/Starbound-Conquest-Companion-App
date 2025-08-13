import React, { createContext, useContext, useState } from "react";

const TurnContext = createContext();

export const TurnProvider = ({ children }) => {
  const [myTurn, setMyTurn] = useState(false);
  return (
    <TurnContext.Provider
      value={{
        myTurn,
        setMyTurn,
      }}
    >
      {children}
    </TurnContext.Provider>
  );
};

export const useTurnContext = () => useContext(TurnContext);
