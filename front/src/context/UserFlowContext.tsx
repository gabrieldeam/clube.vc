// context/UserFlowContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Flow = "clubs" | "profile" | null;

interface UserFlowContextType {
  flow: Flow;
  setFlow: (flow: Flow) => void;
}

const UserFlowContext = createContext<UserFlowContextType>({
  flow: null,
  setFlow: () => {},
});

export const useUserFlow = () => useContext(UserFlowContext);

export const UserFlowProvider = ({ children }: { children: ReactNode }) => {
  const [flow, setFlow] = useState<Flow>(null);

  return (
    <UserFlowContext.Provider value={{ flow, setFlow }}>
      {children}
    </UserFlowContext.Provider>
  );
};
