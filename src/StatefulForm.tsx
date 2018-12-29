import { createElement, FC, useReducer, useRef, Dispatch, useEffect, ReactElement, useMemo } from 'react';
import { State, isYupLikeSchema, ValidationType, isYupValidationError } from './types';
import { SFContext } from './contexts';
import { submitting, SFActions } from './actions';
import { reducer } from './reducer';
import * as actions from './actions';
import { asyncValidation } from './consts';

function processError(name: string, value: any) {
  if (value instanceof Error) {
    return actions.error(name, {
      hasError: true,
      errorMessage: value.message,
      async: false,
    });
  }
  return actions.error(name, {
    hasError: true,
    errorMessage: value.toString(),
    async: false,
  });
}

function validate(valueKeys: string[], dispatch: Dispatch<SFActions>, state: State) {
  if (state.validationSchema) {
    state.validationSchema
      .validate(state.values, { abortEarly: false })
      .then(() => {
        dispatch(actions.errors({}));
      })
      .catch(e => {
        if (!isYupValidationError(e)) {
          throw e;
        }
        const errors: State['errors'] = {};
        for (const error of e.inner) {
          errors[error.path] = { hasError: true, errorMessage: error.message };
        }
        dispatch(actions.errors(errors));
      });
  } else if (state.validations) {
    const promises: Promise<any>[] = [];
    const errors: (ReturnType<actions.error> | ReturnType<actions.asyncError>)[] = [];
    for (let key of valueKeys) {
      const validation = state.validations[key];
      if (!validation) {
        continue;
      }
      const value = state.values[key];
      const validationValue = typeof validation === 'function' ? validation(value) : validation;
      const rc = isYupLikeSchema(validationValue) ? validationValue.validate(value as {}) : validationValue;
      if (rc instanceof Promise) {
        promises.push(rc.then(() => dispatch(processError(key, ''))).catch(e => dispatch(processError(key, e))));
        errors.push(actions.asyncError(key));
      } else if (rc instanceof asyncValidation) {
        errors.push(actions.asyncError(key));
      } else if (typeof rc === 'boolean') {
        errors.push(actions.error(key, { hasError: rc }));
      } else {
        errors.push(actions.error(key, { hasError: !!rc, errorMessage: rc }));
      }
    }
    if (errors.length) {
      dispatch(actions.batchErrors(errors));
    }
  } else {
    const errors: ReturnType<actions.error>[] = [];
    for (const key of valueKeys) {
      errors.push(actions.error(key, { hasError: false }));
    }
    dispatch(actions.batchErrors(errors));
  }
}

export interface StatefulFormProps {
  preserveData?: boolean;
  validationSchema?: State['validationSchema'];
  validations?: { [key: string]: ValidationType<any> | undefined };
  initialValues?: State['values'];
  defaultValues?: State['values'];
  onSubmit?: (values: State['values']) => Promise<any> | void;
  render?: () => ReactElement<any>;
}

/**
 * `<StatefulForm>` is the main component used to build forms. Components can be built using the `render` prop or
 * children. `render` is useful if you want to use the state functions inline.
 */
export const StatefulForm: FC<StatefulFormProps> = props => {
  const [state, dispatch] = useReducer(reducer, {
    values: props.initialValues || {},
    defaultValues: props.defaultValues || props.initialValues || {},
    validations: props.validations || {},
    registered: {},
    validationSchema: props.validationSchema,
    errors: {},
    touched: {},
    submitable: false,
    isSubmitting: false,
    hasErrors: false,
    preserveData: !!props.preserveData,
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  //Side effects
  if (state.validationsNeeded) {
    validate(state.validationsNeeded, dispatch, state);
    dispatch(actions.clearValidationsNeeded());
  }

  const submitRef = useRef(false);
  if (state.isSubmitting && !submitRef.current) {
    if (!props.onSubmit) {
      dispatch(submitting(false));
    } else {
      const rc = props.onSubmit(state.values);
      if (rc) {
        submitRef.current = true;
        rc.then(() => {
          submitRef.current = false;
          dispatch(submitting(false));
        }).catch(e => {
          submitRef.current = false;
          dispatch(submitting(false));
          return e;
        });
      } else {
        dispatch(submitting(false));
      }
    }
  }

  useEffect(() => {
    validate(Object.keys(state.values), dispatch, state);
  }, []);

  const sfContextValue = useMemo(
    () => ({
      stateRef,
      dispatch,
    }),
    [stateRef.current, dispatch]
  );

  return (
    <form
      action=""
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <SFContext.Provider value={sfContextValue}>{props.render ? <props.render /> : props.children}</SFContext.Provider>
    </form>
  );
};
