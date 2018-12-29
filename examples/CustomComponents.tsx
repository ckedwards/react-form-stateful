import { FC, useEffect, useRef, Fragment, CSSProperties, useState, createElement, useMemo } from 'react';
import {
  StatefulForm,
  SFInput,
  useSFControl,
  useSFError,
  useSFSubmitState,
  useSFReset,
  ASYNC_VALIDATION,
} from 'react-stateful-form';
// https://github.com/facebook/react/issues/5465#issuecomment-157888325
function makeCancelable<T>(promise: Promise<T>): { promise: Promise<T>; cancel: () => void } {
  let hasCanceled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(
      val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
}

/**
 * Debounce function that debounces against the arg parameter.
 *
 * Special case: if arg === undefined
 *
 * @param cb Callback fired after delay.
 * @param arg
 * @param delay
 */
function useDebounce<T>(cb: (arg: T) => (() => void) | void, arg: T, delay: number) {
  const cbRef = useRef(cb);
  const argRef = useRef(arg);
  const timeoutRef = useRef(0);
  const oldRequestCancel = useRef<(() => void) | void>(undefined);

  useEffect(
    () => {
      if (arg == undefined) {
        cancel();
      } else if (argRef.current !== arg) {
        cancel();
        timeoutRef.current = (setTimeout(() => {
          timeoutRef.current = 0;
          oldRequestCancel.current = undefined;
          oldRequestCancel.current = cbRef.current(argRef.current);
        }, delay) as unknown) as number; //Typings pulling in NodeJS.Timeout...
      }
      argRef.current = arg;

      function cancel() {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = 0;
        if (oldRequestCancel.current) {
          oldRequestCancel.current();
          oldRequestCancel.current = undefined;
        }
      }
      return cancel;
    },
    [arg]
  );
}

function fakeServerRequest<T extends Object = Object>(_values: any, timeout: number = 700, result?: T) {
  return makeCancelable(
    new Promise<T>(resolve => {
      setTimeout(() => resolve(result || ({} as any)), timeout);
    })
  );
}

const CustomComponents: FC = () => {
  return (
    <StatefulForm
      validations={{
        password: (value: string) => (!value || value.length < 3 || value.length > 256 ? 'Enter valid password' : null),
      }}
      onSubmit={values => {
        return fakeServerRequest(values).promise;
      }}
      render={() => {
        const reset = useSFReset();
        return (
          <Fragment>
            <div>Signup:</div>
            <label>
              Username:
              <UserNameField name="username" />
            </label>
            <label>
              Password:
              <SFInput name="password" />
            </label>
            <SubmitBtn />
            <button onClick={reset}>Reset</button>
          </Fragment>
        );
      }}
    />
  );
};

const UserNameField: FC<{ name: string }> = props => {
  const { error, setValue, value, touch, touched } = useSFControl<string>(props.name, '', '', () => ASYNC_VALIDATION);
  const [, setError] = useSFError(props.name);
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);

  const syncError = useMemo(
    () => {
      if (!value || value.length < 3 || value.length > 256) {
        setError('Invalid username');
        setChecking(false);
        return true;
      }
      if (touched) {
        setChecking(true);
      }
      return false;
    },
    [value, touched]
  );

  //Don't hit the server until the component has been touched.
  const checkValue = touched && !syncError ? value : undefined;
  useDebounce(
    value => {
      const rc = fakeServerRequest(
        value,
        undefined,
        // Fake server response
        value && value.startsWith('test') ? { error: undefined } : { error: 'username already taken' }
      );
      rc.promise.then(result => {
        setError(result.error);
        setChecked(true);
        setChecking(false);
      });
      return rc.cancel;
    },
    checkValue,
    250
  );

  const style: CSSProperties = {};
  if (checked && !error) {
    style.backgroundColor = 'green';
  }
  const message = checking ? 'Checking if username available' : error;
  return (
    <Fragment>
      <input style={style} name={props.name} onBlur={touch} value={value} onChange={e => setValue(e.target.value)} />
      <div>{message}</div>
    </Fragment>
  );
};

const SubmitBtn: FC = () => {
  const { submitable, isSubmitting, submit } = useSFSubmitState();
  const style: CSSProperties = {};
  if (!submitable) {
    style.backgroundColor = 'red';
  }
  return (
    <Fragment>
      <div>
        <button style={style} disabled={!submitable} onClick={submit}>
          Submit
        </button>
      </div>
      <div>{isSubmitting ? 'Submission in Progress' : null}</div>
    </Fragment>
  );
};

export default CustomComponents;
