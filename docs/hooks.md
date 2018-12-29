# hooks

## Example

```tsx
import { useSFControl } from './hooks';

export const Input: FC<{ name: string }> = props => {
  const { touch, value, setValue, error } = useSFControl(props.name, '');
  return <input className={props.className} onBlur={touch} value={value} onChange={e => setValue(e.target.value)} />;
};
```

### useSFValue<T extends ValueType>(name: string, initialValue: T, defaultValue?: T | NO_DEFAULT, validate?: ValidationType<T>)

Used to register a value to the form state. If `state.preserveData` === false (_default_) then it also handles de-registers on unmount.
**Returns:** a stateful field value and a function to set it.

### useSFTouched(name: string): [boolean, () => void]

Get the touched state for a field by name.
**Returns:** a stateful touched value and a function to set it to true.

### useSFError(name: string): [string | null | undefined, (error: string | null | undefined) => void]

Get the error state for a field by name.
**Returns:** a stateful error message and a function to set it.

### useSFControl<T extends ValueType>(name: string, initialValue: T, defaultValue?: T | NO_DEFAULT, validate?: ValidationType<T>)

Combines `useSFValue` with `useSFTouched` and `useSFError` for convenience.
**If you are creating a custom field, then this is probably the hook you want to use.**

**Returns:** an object of the following values:

- `value:T` - stateful value
- `setValue:(value:T)=>void` - function to set value
- `touched:boolean` - stateful value for if field touched
- `touch:()=>void` - function to set touched to true
- `error:string | null | undefined` - error value, undefined if touched === false (for convenience)

### useSFSubmitState()

**Returns:** an object of the following values:

- `submitable:boolean`- stateful value of if the form is submitable
- `isSubmitting:boolean` stateful value of if the form is submitting
- `submit:()=>void` fires a submit action that sets isSubmitting to true if submitable is true

### useSFReset():()=>void

**Returns:** a function that resets the form to it's default values when called.
