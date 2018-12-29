import { ErrorType } from './actions';
import { ASYNC_VALIDATION, NO_DEFAULT } from './consts';

export interface SFValues {
  [key: string]: ValueType | undefined;
}

export type ValueType =
  | boolean
  | boolean[]
  | number
  | number[]
  | string
  | string[]
  | {
      [key: string]: ValueType | undefined;
    }
  | undefined;

export interface State {
  values: { [key: string]: ValueType | undefined };
  defaultValues: { [key: string]: ValueType | NO_DEFAULT | undefined };
  validations: { [key: string]: ValidationType | undefined };
  validationSchema: YupLikeSchema | undefined;
  errors: { [key: string]: ErrorType | undefined };
  validationsNeeded?: string[];
  hasErrors: boolean;
  touched: { [key: string]: boolean | undefined };
  registered: { [key: string]: boolean | undefined };
  submitable: boolean;
  isSubmitting: boolean;
  preserveData: boolean;
}

export type SubmitCallbackType = (values: Readonly<State['values']>) => void | Promise<any>;

export function isYupLikeSchema(obj: any): obj is YupLikeSchema {
  return obj && obj.validate && typeof obj.validate === 'function';
}

export interface YupLikeSchema {
  validate: (value: {}, options?: any) => Promise<{}>;
}

export function isYupValidationError(obj: any): obj is YupValidationError {
  return 'inner' in obj && Array.isArray(obj.inner) && obj instanceof Error;
}

export interface YupValidationError {
  path: string;
  message: string;
  inner: YupValidationError[];
}

export type ValidationType<T = ValueType> =
  | boolean
  | YupLikeSchema
  | (() => YupLikeSchema)
  | ((value: T) => string | undefined | null)
  | ((value: T) => Promise<any>)
  | (() => boolean)
  | (() => ASYNC_VALIDATION)
  | undefined
  | null
  | void;
