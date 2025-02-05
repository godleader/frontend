import React, { createContext, useState, useCallback } from "react";
import { WalletContextType, Transaction, CardDetails } from "../types";

const initialTransactions: Transaction[] = [
  {
    id: 1,
    type: "deposit",
    amount: 100,
    date: "2023-10-27",
    status: "completed",
  },
  {
    id: 2,
    type: "withdrawal",
    amount: 25,
    date: "2023-10-26",
    status: "completed",
  },
];

export const WalletContext = createContext<WalletContextType>(
  {} as WalletContextType,
);

export const WalletProvider: React.FC<any> = ({ children }) => {
  const [balance, setBalance] = useState<number>(1000); // Initial balance
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialTransactions,
  );

  const deposit = useCallback(
    async (amount: number, cardDetails: CardDetails) => {
      // In a real app, you would send the cardDetails to a payment gateway
      console.log("Processing deposit with card details:", cardDetails);

      // Simulate an API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update balance and transactions after successful deposit
      setBalance((prevBalance) => prevBalance + amount);
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        {
          id: prevTransactions.length + 1,
          type: "deposit",
          amount,
          date: new Date().toLocaleDateString(),
          status: "completed",
        },
      ]);
    },
    [],
  );

  const withdraw = useCallback(async (amount: number) => {
    if (balance >= amount) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBalance((prevBalance) => prevBalance - amount);
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        {
          id: prevTransactions.length + 1,
          type: "withdrawal",
          amount,
          date: new Date().toLocaleDateString(),
          status: "completed",
        },
      ]);
    } else {
      throw new Error("Insufficient funds");
    }
  }, [balance]);

  const value = {
    balance,
    transactions,
    deposit,
    withdraw,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};