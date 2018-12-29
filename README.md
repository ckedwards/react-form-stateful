# react-stateful-form

react-stateful-form a full featured, extensible form component for react using react hooks

> **NOTE:** this project requires the use of an alpha version of react to use.

## Getting Started

```
npm install --save react-stateful-form
```

## Examples

### Basic Usage

```tsx
import { FC } from 'react';
import { StatefulForm, SFInput, SFSelect, SFTextArea } from 'react-stateful-form';
import * as yup from 'yup';

const ValidationSchemeForm: FC = () => {
  return (
    <StatefulForm
      validationScheme={yup.object().shape({
        email: yup
          .string()
          .required('Email required')
          .email('Invalid email address'),
        desc: yup.string().max(256, 'Please keep your description short!'),
        complaint: yup
          .string()
          .required('Complaint required')
          .max(10000, 'Max complaint size: 10,000 characters.'),
      })}
    >
      <div>Feedback form:</div>
      <label>
        Email:
        <SFInput name="email" />
      </label>
      <label>
        Short Description:
        <SFInput name="desc" />
      </label>
      <label>
        Reason for complaint:
        <SFSelect
          name="reason"
          defaultEntry={'Please select a reason'}
          values={['Bug', 'Typo', 'Feature Request', 'Other']}
        />
      </label>
      <label>
        Complaint:
        <SFTextArea name="complaint" />
      </label>
    </StatefulForm>
  );
};
```

### Other examples

Other examples can be seen in the [examples folder](./examples). `ValidationScheme.tsx` is a simple form and the other two are more complex.

### Customizing Forms

Context is used to expose the state. This allows for helper hooks to be written. Several already exist, but more could easily be written. (Feel free to make a PR).

## Components

One of the components from (components)[./src/controls.tsx]:

```tsx
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
```

Example Usage

```tsx
import { FC, createElement } from 'react';
import { StatefulForm, SFInput } from 'react-stateful-form';

const Form: FC = () => {
  return (
    <StatefulForm>
      <SFInput name="item" />
    </StatefulForm>
  );
};
```

As you can see component that matches your application's look and feel, but basic components do exist for your convenience.

## Extending

While the internal reducer is not exposed, the dispatch and actions are exposed, which allows for extension through side effects.
An example of this can be seen in examples/pages/Pages.tsx.

## NO_DEFAULT and ASYNC_VALIDATION

There are two special constants that help with extending the functionality of react-stateful-form.

#### NO_DEFAULT

`NO_DEFAULT` prevents resets from affecting this value. Useful for hidden from values that are used to control validation.
This us used in the advanced example [examples/pages/Pages](examples/pages/Pages.tsx):

```tsx
const valueState = useSFValue<number[]>(
  '@@pages',
  [0],
  NO_DEFAULT, // Don't get reset
  value => (props.pages.length !== value.length ? 'more pages exist' : null)
);
```

#### ASYNC_VALIDATION

`ASYNC_VALIDATION` Is used to to defer the validation to some external process. This is useful when you want to defer the validation to a separate process. This could also be done with Promises, but there may be cases where `ASYNC_VALIDATION` is more convenient.

```tsx
const { error, setValue, value, touch, touched } = useSFControl<string>(props.name, '', '', () => ASYNC_VALIDATION);
```

Here when a validation is triggered, the error state is set to `{ async:true }`. The form is not submitable until this is resolved. One way to resolve this is to use the `useSFError` hook and set the error state for the component.

```tsx
const [, setError] = useSFError(props.name);
setError('Invalid username');
```

# Prior art

- [Formik](https://github.com/jaredpalmer/formik) (Obviously)
