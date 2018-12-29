import { useContext, useCallback, useLayoutEffect, useRef } from 'react';
import { SFContext } from './contexts';
import { ValueType, ValidationType } from './types';
import * as actions from './actions';
import { NO_DEFAULT } from './consts';

export type ValidateType = string | Promise<string | undefined> | undefined;

/**
 * Used to register a value to the form state. If `state.preserveData` === false (default) then it also handles de-registers
 * on unmount.
 *
 * `initialValue`, `defaultValue` and `validate` are only set if the form has not already been registered.
 *
 * @param name name of the field
 * @param initialValue initial value
 * @param defaultValue default value
 * @param validate validate function
 *
 * @returns the stateful value and a function to update it.
 */
export function useSFValue<T extends ValueType>(
  name: string,
  initialValue: T,
  defaultValue?: T | NO_DEFAULT,
  validate?: ValidationType<T>
): [T, (value: T) => void] {
  const ctx = useContext(SFContext);
  if (!ctx) {
    throw new Error('SF context not found. Use SF hooks inside StatefulFormComponent');
  }
  const ivRef = useRef<{ initialValue: T } | undefined>({ initialValue: initialValue });
  if (ctx.stateRef.current.preserveData && name in ctx.stateRef.current.defaultValues) {
    ivRef.current = undefined;
  }

  useLayoutEffect(() => {
    ivRef.current = undefined;
    if (ctx.stateRef.current.registered[name]) {
      throw new Error('Default value already set');
    }
    ctx.dispatch(
      actions.add(name, {
        validation: validate as ValidationType,
        defaultValue: defaultValue,
        value: initialValue,
      })
    );
    return () => {
      ctx.dispatch(actions.remove(name));
    };
  }, []);

  const setValue = useCallback((value: T) => {
    ctx.dispatch(actions.value(name, value));
  }, []);

  return [ivRef.current ? ivRef.current.initialValue : (ctx.stateRef.current.values[name] as T), setValue];
}

/**
 * Returns a stateful touched value and a function to set it to true.
 * @param name field name
 */
export function useSFTouched(name: string): [boolean, () => void] {
  const ctx = useContext(SFContext);
  if (!ctx) {
    throw new Error('SF context not found. Use SF hooks inside StatefulForm Component');
  }

  const touchCb = useCallback(() => {
    if (ctx.stateRef.current.touched[name]) {
      return;
    }
    ctx.dispatch(actions.touch(name));
  }, []);

  return [ctx.stateRef.current.touched[name] || false, touchCb];
}

/**
 * Returns a stateful error message and a function to set it.
 * @param name field name.
 */
export function useSFError(name: string): [string | null | undefined, (error: string | null | undefined) => void] {
  const ctx = useContext(SFContext);
  if (!ctx) {
    throw new Error('SF context not found. Use SF hooks inside StatefulForm Component');
  }
  const errorCb = useCallback((errorMessage: string | null | undefined) => {
    const hasError = !!errorMessage;
    ctx.dispatch(actions.error(name, { hasError, errorMessage }));
  }, []);
  const error = ctx.stateRef.current.errors[name];
  return [error ? error.errorMessage : null, errorCb];
}

/**
 * Combines `useSFValue` with `useSFTouched` and `useSFError` for convenience.
 *
 * If you are creating a custom field, then this is probably the hook you want to use.
 *
 */
export function useSFControl<T extends ValueType>(
  name: string,
  initialValue: T,
  defaultValue?: T,
  validate?: ValidationType<T>
) {
  const [value, setValue] = useSFValue(name, initialValue, defaultValue, validate);
  const [touched, touch] = useSFTouched(name);
  let [error] = useSFError(name);
  if (!touched) {
    error = undefined;
  }
  return { value, setValue, touched, touch, error };
}

export function useSFSubmitState() {
  const ctx = useContext(SFContext);
  if (!ctx) {
    throw new Error('SF context not found. Use SF hooks inside StatefulForm Component');
  }
  const { submitable, isSubmitting } = ctx.stateRef.current;
  const submit = useCallback(() => {
    ctx.dispatch(actions.submitting(true));
  }, []);
  return { submitable, isSubmitting, submit };
}

export function useSFReset() {
  const ctx = useContext(SFContext);
  if (!ctx) {
    throw new Error('SF context not found. Use SF hooks inside useSFReset');
  }
  return () => {
    ctx.dispatch(actions.reset());
  };
}
