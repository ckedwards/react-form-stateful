import { FC, useContext, createElement } from 'react';
import { PagesContext } from './Pages';
import { useSFSubmitState } from 'react-stateful-form';

const NextButton: FC = () => {
  const ctx = useContext(PagesContext);
  if (!ctx) {
    throw new Error('context not found.');
  }
  const { submitable, submit } = useSFSubmitState();
  return (
    <button
      disabled={!ctx.navigation.forward && !submitable}
      onClick={() => (ctx.navigation.forward ? ctx.navigate() : submit())}
    >
      {ctx.navigation.forward ? 'Next' : 'Submit'}
    </button>
  );
};

export default NextButton;
