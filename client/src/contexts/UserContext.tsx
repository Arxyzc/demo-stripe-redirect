import React, { createContext, useContext } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default user - no authentication required
const DEFAULT_USER: User = {
  id: "demo-user-001",
  name: "Demo User",
  email: "demo@stripe-demo.local",
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserContext.Provider value={{ user: DEFAULT_USER }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
