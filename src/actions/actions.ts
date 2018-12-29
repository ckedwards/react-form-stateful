import { action } from './actionFactory';
import { ValueType, ValidationType, State } from '../types';
import { NO_DEFAULT } from '../consts';

type ControlType = {
  defaultValue: ValueType | NO_DEFAULT;
  value: ValueType;
  validation?: ValidationType;
};

export type ErrorType = { hasError: boolean; errorMessage?: string | null; async?: boolean };

export const AddAction = 'sfc/control/add';
export function add<T extends string>(name: string, data: ControlType) {
  return action(AddAction, { name, data });
}
export type add = typeof add;

export const RemoveAction = 'sfc/control/remove';
export function remove<T extends string>(name: string) {
  return action(RemoveAction, { name });
}
export type remove = typeof remove;

export const UpdateValidationsAction = 'sfc/updateValidations';
export function updateValidations<T extends string>(payload: State['validations']) {
  return action(UpdateValidationsAction, payload);
}
export type updateValidations = typeof updateValidations;

export const ErrorAction = 'sfc/control/error';
export function error<T extends string>(name: string, data: ErrorType) {
  return action(ErrorAction, { name, data });
}
export type error = typeof error;

export const ErrorsAction = 'sfc/control/errors';
export function errors<T extends string>(payload: State['errors']) {
  return action(ErrorsAction, payload);
}
export type errors = typeof errors;

export const AsyncErrorAction = 'sfc/control/asyncError';
export function asyncError<T extends string>(name: string) {
  return action(AsyncErrorAction, name);
}
export type asyncError = typeof asyncError;

export const ErrorBatchAction = 'sfc/control/errorsBatch';
export function batchErrors<T extends string>(errors: (ReturnType<error> | ReturnType<asyncError>)[]) {
  return action(ErrorBatchAction, errors);
}
export type batchErrors = typeof batchErrors;

export const TouchAction = 'sfc/control/touch';
export function touch<T extends string>(name: string) {
  return action(TouchAction, { name });
}
export type touch = typeof touch;

export const ValueAction = 'sfc/control/value';
export function value<T extends string>(name: string, data: ValueType) {
  return action(ValueAction, { name, data });
}
export type value = typeof value;

export const SubmittingAction = 'sfc/submitting';
export function submitting<T extends string>(isSubmitting: boolean) {
  return action(SubmittingAction, isSubmitting);
}
export type submitting = typeof submitting;

export const ResetAction = 'sfc/reset';
export function reset<T extends string>() {
  return action(ResetAction);
}
export type reset = typeof reset;

export const TouchAllAction = 'sfc/touchall';
export function touchAll<T extends string>() {
  return action(TouchAllAction);
}
export type touchAll = typeof touchAll;

export const ClearValidationsNeeded = 'sfc/clearValidationsNeeded';
export function clearValidationsNeeded<T extends string>() {
  return action(ClearValidationsNeeded);
}
export type clearValidationsNeeded = typeof clearValidationsNeeded;

export type SFActions =
  | ReturnType<add>
  | ReturnType<remove>
  | ReturnType<updateValidations>
  | ReturnType<error>
  | ReturnType<asyncError>
  | ReturnType<errors>
  | ReturnType<batchErrors>
  | ReturnType<touch>
  | ReturnType<submitting>
  | ReturnType<value>
  | ReturnType<reset>
  | ReturnType<touchAll>
  | ReturnType<clearValidationsNeeded>;
