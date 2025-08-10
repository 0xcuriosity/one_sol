import { createContext, useState } from "react";
import MainContent from "./Components/MainContent";
interface ActiveTabContextType {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}
export const ActiveTabContext = createContext<ActiveTabContextType>(
  {} as ActiveTabContextType
);
function App() {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <>
      <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
        <MainContent />
      </ActiveTabContext.Provider>
    </>
  );
}

export default App;
