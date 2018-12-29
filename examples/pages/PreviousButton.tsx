import { FC, useContext, createElement } from "react";
import { PagesContext } from "./Pages";

const PreviousButton: FC = () => {
  const ctx = useContext(PagesContext);
  if (!ctx) {
    throw new Error("context not found.");
  }
  return (
    <button
      disabled={!ctx.navigation.backward}
      onClick={() => ctx.navigate(true)}
    >
      Previous
    </button>
  );
};

export default PreviousButton;
