import { DataFlowContext } from "lib/contexts";
import { useContext } from "react";

const RuleName = () => {
  const { ruleName } = useContext(DataFlowContext);

  return <div className="px-3 py-1.5">{ruleName}</div>;
};

export default RuleName;
