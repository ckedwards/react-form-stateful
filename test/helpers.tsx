import { createElement, useContext, Fragment, FC } from 'react';
import { render } from 'react-testing-library';

import {
  StatefulForm,
  SFContext,
  useSFControl,
  useSFError,
  useSFTouched,
  useSFSubmitState,
  useSFValue,
  useSFReset,
  SFActions,
} from '../src';
import 'jest';
import { State, ValidationType, ValueType } from '../src/types';
import { noDefault } from '../src/consts';

export let sfCtx: { stateRef: { current: State }; dispatch: (action: SFActions) => void } | undefined;
export let data: { [key: string]: DataItem | undefined } = {};

export type TestFormProps = {
  name: string;
  type?: 'value' | 'control';
  validateFn?: ValidationType<ValueType>;
  values?: { initialValue: ValueType; defaultValue: ValueType | noDefault };
};
export const TestForm: FC<TestFormProps> = props => {
  sfCtx = useContext(SFContext)!;
  const item = createDataItem();
  item.validationFn = jest.fn(() => 'Invalid');
  if (props.type === 'value') {
    item.useSFValue = useSFValue<ValueType>(props.name, 'value', 'value2', item.validationFn);
  } else {
    item.useSFControl = useSFControl<ValueType>(props.name, 'value', 'value2', item.validationFn);
  }

  item.useSFReset = useSFReset();
  item.useSFError = useSFError(props.name);
  item.useSFError = useSFError(props.name);
  item.useSFTouched = useSFTouched(props.name);
  item.useSFSubmitState = useSFSubmitState();
  data[props.name] = item;
  return <Fragment />;
};

export function renderForm(testForms: TestFormProps[]) {
  sfCtx = undefined;
  data = {};
  const items = testForms.map(value => <TestForm key={value.name} {...value} />);
  return {
    ...render(<StatefulForm>{items}</StatefulForm>),
  };
}

export function createDataItem() {
  const item: DataItem = {
    validationFn: undefined,
    useSFValue: undefined,
    useSFReset: undefined,
    useSFControl: undefined,
    useSFError: undefined,
    useSFTouched: undefined,
    useSFSubmitState: undefined,
  };
  return item;
}

export interface DataItem {
  validationFn: ValidationType<ValueType> | undefined;
  useSFValue: ReturnType<typeof useSFValue> | undefined;
  useSFReset: ReturnType<typeof useSFReset> | undefined;
  useSFControl: ReturnType<typeof useSFControl> | undefined;
  useSFError: ReturnType<typeof useSFError> | undefined;
  useSFTouched: ReturnType<typeof useSFTouched> | undefined;
  useSFSubmitState: ReturnType<typeof useSFSubmitState> | undefined;
}

export function cleanupState() {
  sfCtx = undefined;
  data = {};
}
