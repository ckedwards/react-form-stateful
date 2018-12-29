# <StatefulForm>

`<StatefulForm>` is the main component used to build forms. Components can be built using the `render` prop or `children`. If `render` is defined then `children` are ignored. `render` is useful if you want to use the state functions inline.

## Example

```tsx
<StatefulForm>
  <div>Feedback form:</div>
  <label>
    Email:
    <SFInput name="email" />
  </label>
</StatefulForm>
```

## Props

- [validationSchema?: Schema | undefined](#validationScheme)
- [validations?: { [key: string]: ValidationType<any> }](#validations)
- [initialValues?: [key: string]: ValueType ](#initialValues)
- [defaultValues?: [key: string]: ValueType | NO_DEFAULT ](#defaultValues)
- [onSubmit?: (values: State['values']) => Promise<any> | void](#onSubmit)
- [render?: () => ReactElement<any>](#render)
- [preserveData?: boolean](#preserveData)

### validationScheme

Takes a [Yup Schema](https://github.com/jquense/yup). Use a scheme to validate the whole component. Overrides validations and validations set on individual components. Basically this is treated as a global override.

### validations

A map of validations of name to validation. Overrides component validations.

### initialValues

A map of initialValues of name to initialValues. Overrides component(useSFValue) initialValue.

### defaultValues

A map of defaultValues of name to defaultValues. Overrides component(useSFValue) defaultValues.
`NO_DEFAULT` is a special const. When this value is set field will not be reset on a reset action.

### onSubmit

Submit function. Return a promise for async submissions. Will only be triggered when a form is submitable and a submit action is triggered.

### preserveData

**Default**: false
If preserveData is true, then the data for a field is not removed when the field is unmounted. This can be useful for implementing forms with multiple pages, but you will need to remove field data manually if you want to remove them using the remove action.
