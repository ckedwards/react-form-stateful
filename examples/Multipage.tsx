import { FC, createElement } from "react";
import { Pages } from "./pages/Pages";
import PageOne from "./pages/PageOne";
import PageTwo from "./pages/PageTwo";
import PageThree from "./pages/PageThree";

const Mulitpage: FC = () => {
  return (
    <Pages
      pages={[PageOne, PageTwo, PageThree]}
      onSubmit={values => {
        console.log(values);
      }}
    />
  );
};

export default Mulitpage;
