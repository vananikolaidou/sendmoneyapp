import React, { createContext, useContext, useState, ReactNode } from 'react';

type BalanceProviderProps = {
  children: ReactNode;
};

const BalanceContext = createContext({
  balance: 0,
  deductBalance: (amount: number) => { },
});

export const BalanceProvider = ({ children }: BalanceProviderProps) => {
  const [balance, setBalance] = useState(10000); 

  const deductBalance = (amount: number) => {
    setBalance((prev) => Math.max(prev - amount, 0)); 
  };

  return (
    <BalanceContext.Provider value={{ balance, deductBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);