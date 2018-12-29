import { FC, createElement, Fragment } from 'react';
import { useSFControl } from './hooks';

type SFControlProps<T = string> = {
  name: string;
  className?: string;
  errorClassName?: string;
  initialValue?: T;
  defaultValue?: T;
};

export const SFInput: FC<SFControlProps> = props => {
  const { touch, value, setValue, error } = useSFControl(props.name, props.initialValue, props.defaultValue);
  return (
    <Fragment>
      <input className={props.className} onBlur={touch} value={value || ''} onChange={e => setValue(e.target.value)} />
      <div className={props.errorClassName}>{error}</div>
    </Fragment>
  );
};

export const SFTextArea: FC<SFControlProps> = props => {
  const { touch, value, setValue, error } = useSFControl(props.name, props.initialValue, props.defaultValue);

  return (
    <Fragment>
      <textarea className={props.className} onBlur={touch} value={value} onChange={e => setValue(e.target.value)} />
      <div className={props.errorClassName}>{error}</div>
    </Fragment>
  );
};

type SFSelectProps = {
  values: string[];
  defaultEntry?: string;
} & SFControlProps;

export const SFSelect: FC<SFSelectProps> = props => {
  const { touch, value, setValue, error } = useSFControl(props.name, props.initialValue, props.defaultValue);

  const options = props.values.map(optValue => {
    return (
      <option key={optValue} value={optValue}>
        {optValue}
      </option>
    );
  });

  return (
    <Fragment>
      <select
        className={props.className}
        onBlur={touch}
        value={value || ''}
        onChange={e => setValue(e.target.value)}
        defaultValue={value}
      >
        {props.defaultEntry ? <option key={'@@defaultEntry'}>{props.defaultEntry}</option> : null}
        {options}
      </select>
      <div className={props.errorClassName}>{error}</div>
    </Fragment>
  );
};
