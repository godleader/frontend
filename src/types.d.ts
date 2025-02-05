export interface Transaction {
    id: number;
    type: "deposit" | "withdrawal";
    amount: number;
    date: string; // Could be Date object if needed
    status: "completed" | "pending" | "failed";
  }
  
  export interface WalletContextType {
    balance: number;
    transactions: Transaction[];
    deposit: (amount: number, cardDetails: CardDetails) => Promise<void>;
    withdraw: (amount: number) => Promise<void>;
  }
  
  export interface CardDetails {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    name: string;
  }