import { createElement, useContext } from 'react';
import { FC } from 'react';
import { SFContext } from 'react-stateful-form';

const Logger: FC = () => {
  const sfCtx = useContext(SFContext);
  if (!sfCtx) {
    throw new Error('context not found');
  }
  const currentState = sfCtx.stateRef.current;
  return (
    <div>
      <div>isSubmitting:{currentState.isSubmitting + ''}</div>
      <div>Submitable:{currentState.submitable + ''}</div>
      <div>Error data:</div>
      <pre>{JSON.stringify(sfCtx.stateRef.current.errors, null, 2)}</pre>
    </div>
  );
};

export default Logger;
