import { createContext, useContext, useMemo, useState } from "react";

const RuleContext = createContext<{
  selectedRuleId: string;
  setSelectedRuleId: (ruleId: string) => void;
}>({
  selectedRuleId: "",
  setSelectedRuleId: (ruleId: string) => {},
});

export const RuleSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedRuleId, setSelectedRuleId] = useState("");

  const value = useMemo(
    () => ({ selectedRuleId, setSelectedRuleId }),
    [selectedRuleId, setSelectedRuleId]
  );

  return <RuleContext.Provider value={value}>{children}</RuleContext.Provider>;
};

export const useRuleSelectionContext = () => {
  const context = useContext(RuleContext);

  if (!context) {
    throw new Error("useRuleContext must be used within a RuleProvider");
  }

  return context;
};
