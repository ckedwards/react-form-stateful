import { State } from './types';
import {
  SFActions,
  AddAction,
  RemoveAction,
  ErrorAction,
  ValueAction,
  TouchAction,
  SubmittingAction,
  ResetAction,
  TouchAllAction,
  ErrorsAction,
  ErrorBatchAction,
  ClearValidationsNeeded,
  AsyncErrorAction,
  UpdateValidationsAction,
} from './actions';
import shallowEqual from './utils/shallowEqual';
import { NO_DEFAULT } from './consts';

function mutateProperty<S, K extends keyof S>(state: S, key: K, value: S[K]) {
  if (key in state && state[key] === value) {
    return state;
  }
  const newState = {
    ...state,
  };
  newState[key] = value;
  return newState;
}

function deleteProperty<S, K extends keyof S>(state: S, key: K) {
  if (!(key in state)) {
    return state;
  }
  const newState = {
    ...state,
  };
  delete newState[key];
  return newState;
}

function addArrayItem<S extends Array<any>, K extends keyof S>(state: S | undefined, value: S[K]) {
  if (state) {
    return state.concat(value);
  }
  return [value];
}

function updateGlobalState(state: State) {
  let submittable = !state.isSubmitting;
  let hasErrors = false;
  for (const key of Object.keys(state.errors)) {
    const error = state.errors[key];
    if (!error) {
      continue;
    }
    submittable = submittable && !error.async && !error.hasError;
    hasErrors = hasErrors || error.hasError;
  }
  state.hasErrors = hasErrors;
  state.submitable = submittable;
}

export function reducer(prevState: State, action: SFActions): State {
  switch (action.type) {
    case AddAction: {
      const data = action.payload.data;
      const name = action.payload.name;
      const state = { ...prevState };
      state.registered = mutateProperty(state.registered, name, true);
      if (state.preserveData && name in state.defaultValues) {
        return state;
      }
      state.defaultValues = mutateProperty(state.defaultValues, name, data.defaultValue);
      state.values = mutateProperty(state.values, name, data.value);
      if (!state.validations[name]) {
        state.validations = mutateProperty(state.validations, name, data.validation);
      }
      state.validationsNeeded = addArrayItem(state.validationsNeeded, name);
      return state;
    }
    case RemoveAction: {
      const name = action.payload.name;
      const state = { ...prevState };
      state.registered = deleteProperty(state.registered, name);
      if (state.preserveData) {
        return state;
      }
      state.defaultValues = deleteProperty(state.defaultValues, name);
      state.values = deleteProperty(state.values, name);
      state.errors = deleteProperty(state.errors, name);
      state.touched = deleteProperty(state.touched, name);
      //FIXME: remove validation if added by AddAction
      updateGlobalState(state);
      return state;
    }
    case UpdateValidationsAction: {
      const state = { ...prevState };
      state.validations = {
        ...state.validations,
        ...action.payload,
      };
      return state;
    }
    case ErrorAction: {
      const name = action.payload.name;
      const nextError = action.payload.data;
      const prevError = prevState.errors[name];
      if (prevError && shallowEqual(prevError, nextError)) {
        return prevState;
      }
      const state = { ...prevState };
      state.errors = mutateProperty(state.errors, name, nextError);
      updateGlobalState(state);
      return state;
    }
    case ErrorBatchAction: {
      let errors: State['errors'] | undefined;
      for (const errorAction of action.payload) {
        switch (errorAction.type) {
          case ErrorAction: {
            const name = errorAction.payload.name;
            if (shallowEqual(prevState.errors[name], errorAction.payload.data)) {
              continue;
            }
            if (!errors) {
              errors = {};
            }
            errors[errorAction.payload.name] = errorAction.payload.data;
            break;
          }
          case AsyncErrorAction: {
            const oldError = prevState.errors[name];
            if (oldError && oldError.async) {
              continue;
            }
            if (!errors) {
              errors = {};
            }
            errors[errorAction.payload] = {
              hasError: false,
              ...oldError,
              async: true,
            };
          }
        }
      }
      if (!errors) {
        return prevState;
      }
      const state = { ...prevState };
      state.errors = {
        ...state.errors,
        ...errors,
      };
      updateGlobalState(state);
      return state;
    }
    case ErrorsAction: {
      if (shallowEqual(prevState.errors, action.payload)) {
        return prevState;
      }
      const state = { ...prevState };
      state.errors = action.payload;
      updateGlobalState(state);
      return state;
    }
    case ValueAction: {
      const payload = action.payload;
      const values = mutateProperty(prevState.values, payload.name, payload.data);
      if (values === prevState.values) {
        return prevState;
      }
      const state = { ...prevState };
      state.values = values;
      state.validationsNeeded = addArrayItem(state.validationsNeeded, payload.name);
      return state;
    }
    case TouchAction: {
      const payload = action.payload;
      const touched = mutateProperty(prevState.touched, payload.name, true);
      if (touched === prevState.touched) {
        return prevState;
      }
      const state = { ...prevState };
      state.touched = touched;
      return state;
    }
    case SubmittingAction: {
      const subAction = prevState.submitable && action.payload;
      if (prevState.isSubmitting === subAction) {
        return prevState;
      }
      const state = { ...prevState };
      state.isSubmitting = action.payload;
      updateGlobalState(state);
      return state;
    }
    case ResetAction: {
      const state = { ...prevState };
      state.values = { ...state.defaultValues } as State['values'];
      // Restore values where NO_DEFAULT is set for the defaultValue
      for (const key of Object.keys(state.values)) {
        if (state.values[key] === NO_DEFAULT) {
          state.values[key] = prevState.values[key];
        }
      }
      state.touched = {};
      state.validationsNeeded = Object.keys(state.values);
      return state;
    }
    case TouchAllAction: {
      const state = { ...prevState };
      const touched: { [key: string]: boolean | undefined } = {};
      for (const key in Object.keys(state.values)) {
        touched[key] = true;
      }
      state.touched = touched;
      return state;
    }
    case ClearValidationsNeeded: {
      if (!prevState.validationsNeeded) {
        return prevState;
      }
      const state = { ...prevState };
      state.validationsNeeded = undefined;
      return state;
    }
  }
  return prevState;
}
