import React, { createContext, useState, useCallback, useEffect } from "react";

// Define types directly in this file if you still want type checking
interface Transaction {
  id: number;
  type: "deposit" | "withdrawal";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed"; // Example statuses
}

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

// Define WalletContextType - you can adjust this based on your needs
interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  deposit: (amount: number, cardDetails: CardDetails) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
}

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
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Start with empty transactions

  // Function to fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    try {
      // Simulate API call to fetch transactions
      // Replace 'YOUR_API_ENDPOINT/transactions' with your actual API endpoint
      const response = await fetch('/api/transactions'); // Example API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Transaction[] = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Handle error appropriately, e.g., display an error message to the user
    }
  }, []);

  // Fetch transactions when component mounts
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const deposit = useCallback(
    async (amount: number, cardDetails: CardDetails) => {
      // In a real app, you would send the cardDetails to a payment gateway/backend API
      console.log("Processing deposit with card details:", cardDetails);

      try {
        // Simulate API call for deposit
        // Replace 'YOUR_API_ENDPOINT/deposit' with your actual deposit API endpoint
        const response = await fetch('/api/deposit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount, cardDetails }), // Send amount and card details to API
        });

        if (!response.ok) {
          throw new Error(`Deposit failed: HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json(); // Assuming API returns updated balance and transaction
        setBalance(responseData.balance); // Update balance from API response
        fetchTransactions(); // Re-fetch transactions to update the list
      } catch (error) {
        console.error("Error during deposit:", error);
        // Handle deposit error, e.g., display error message
        throw error; // Re-throw to let the component using this context handle it if needed
      }
    },
    [fetchTransactions],
  ); // Add fetchTransactions as dependency

  const withdraw = useCallback(async (amount: number) => {
    if (balance >= amount) {
      try {
        // Simulate API call for withdrawal
        // Replace 'YOUR_API_ENDPOINT/withdraw' with your actual withdraw API endpoint
        const response = await fetch('/api/withdraw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }), // Send withdrawal amount to API
        });

        if (!response.ok) {
          throw new Error(`Withdrawal failed: HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json(); // Assuming API returns updated balance and transaction
        setBalance(responseData.balance); // Update balance from API response
        fetchTransactions(); // Re-fetch transactions to update the list
      } catch (error) {
        console.error("Error during withdrawal:", error);
        // Handle withdrawal error
        throw error; // Re-throw to let the component using this context handle it if needed
      }
    } else {
      throw new Error("Insufficient funds");
    }
  }, [balance, fetchTransactions]); // Add balance and fetchTransactions as dependencies

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