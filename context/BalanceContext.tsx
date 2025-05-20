import React, { createContext, useContext, useState } from 'react';

const BalanceContext = createContext(null);

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(1000);

  const deductBalance = (amount: number) => {
    setBalance(prev => prev - amount);
  };

  return (
    <BalanceContext.Provider value={{ balance, deductBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);