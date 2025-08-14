import React, { createContext, useContext, useState } from "react";

const TurnContext = createContext();

export const TurnProvider = ({ children }) => {
  const [myTurn, setMyTurn] = useState(false);
  const [state, setState] = useState(null);
  return (
    <TurnContext.Provider
      value={{
        myTurn,
        setMyTurn,
        state,
        setState,
      }}
    >
      {children}
    </TurnContext.Provider>
  );
};

export const useTurnContext = () => useContext(TurnContext);
