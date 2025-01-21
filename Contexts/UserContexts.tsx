import React, { createContext, useState, ReactNode } from "react";
interface Card {
  code: string;
  image: string;
  images: object;
  suit: string;
  value: string;
}
export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  hand: any;
}
interface UserContextType {
  user: User | null;
  setUser: (user: User | any) => void;
}
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
interface UserProviderProps {
  children: ReactNode;
}
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};