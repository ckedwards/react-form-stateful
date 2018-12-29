import {
  FC,
  useState,
  useRef,
  useCallback,
  ComponentType,
  createContext,
  useEffect,
  useContext,
  createElement,
  Fragment,
  useMemo,
} from 'react';
import {
  SFActions,
  actions,
  StatefulFormProps,
  StatefulForm,
  useSFValue,
  SFContext,
  NO_DEFAULT,
  ASYNC_VALIDATION,
} from 'react-stateful-form';
import { ObjectSchema, ValidationError } from 'yup';

interface StatefulFormPagesProps {
  onSubmit: StatefulFormProps['onSubmit'];
  pages: ComponentType<any>[];
}

export const Pages: FC<StatefulFormPagesProps> = props => {
  return (
    <StatefulForm
      preserveData={true}
      onSubmit={values => {
        const { '@@pages': pages, ...rest } = values;
        if (props.onSubmit) {
          return props.onSubmit(rest);
        }
      }}
      render={() => {
        const valueState = useSFValue<number[]>(
          '@@pages',
          [0],
          NO_DEFAULT, // Don't get reset
          value => (props.pages.length !== value.length ? 'more pages exist' : null)
        );
        const valueStateRef = useRef(valueState);
        valueStateRef.current = valueState;

        const pageState = useState(0);
        const pageStateRef = useRef(pageState);
        pageStateRef.current = pageState;

        const setPageIndex = useCallback((index: number) => {
          if (index < 0 || index >= props.pages.length) {
            return;
          }
          pageStateRef.current[1](index);
          const value = valueStateRef.current[0];
          if (value.indexOf(index) !== -1) {
            return;
          }
          valueStateRef.current[1](value.concat(index));
        }, []);

        const navigate = useCallback((decrement: boolean = false) => {
          const newState = decrement ? pageStateRef.current[0] - 1 : pageStateRef.current[0] + 1;
          setPageIndex(newState);
        }, []);

        const pageIndex = pageStateRef.current[0];
        const pageProviderValue = useMemo(
          () => ({
            navigation: {
              forward: pageIndex !== props.pages.length - 1,
              backward: pageIndex !== 0,
              current: pageIndex,
              max: props.pages.length - 1,
            },
            navigate: navigate,
            setPageIndex: setPageIndex,
          }),
          [pageIndex]
        );
        const Page = props.pages[pageState[0]];
        return (
          <PagesContext.Provider value={pageProviderValue}>
            <Page />
          </PagesContext.Provider>
        );
      }}
    />
  );
};

interface PageProps {
  validationSchema?: ObjectSchema<{}>;
}

function flushErrorState(
  dispatch: (action: SFActions) => void,
  keys: string[],
  errors?: { path: string; message: string }[]
) {
  const errorActions: ReturnType<typeof actions.error>[] = [];
  const keysMap: { [key: string]: boolean } = {};
  if (errors) {
    for (const error of errors) {
      keysMap[error.path] = true;
      errorActions.push(
        actions.error(error.path, {
          hasError: true,
          errorMessage: error.message,
        })
      );
    }
  }
  for (const key of keys) {
    if (keysMap[key]) {
      continue;
    }
    errorActions.push(
      actions.error(key, {
        hasError: false,
      })
    );
  }
  dispatch(actions.batchErrors(errorActions));
}

export const Page: FC<PageProps> = props => {
  const sfCtx = useContext(SFContext);
  if (!sfCtx) {
    throw new Error('SFContext not found. Use Page inside Pages Component');
  }
  const validationRequested = useRef(false);

  useEffect(() => {
    const validationScheme = props.validationSchema;
    if (!validationScheme) {
      return;
    }
    const validations: { [key: string]: () => ASYNC_VALIDATION } = {};
    const validatefn = () => {
      if (!validationRequested.current) {
        validationRequested.current = true;
        requestAnimationFrame(() => {
          validationRequested.current = false;
          validationScheme
            .validate(sfCtx.stateRef.current.values, { abortEarly: false })
            .then(() => {
              flushErrorState(
                sfCtx.dispatch,
                // ObjectSchema has untyped fields
                Object.keys((props.validationSchema as any).fields)
              );
            })
            .catch(e => {
              if (e instanceof ValidationError) {
                flushErrorState(
                  sfCtx.dispatch,
                  // ObjectSchema has untyped fields
                  Object.keys((props.validationSchema as any).fields),
                  (e as ValidationError).inner
                );
              }
            });
        });
      }
      return ASYNC_VALIDATION;
    };
    // ObjectSchema has untyped fields
    for (const key of Object.keys((props.validationSchema as any).fields)) {
      validations[key] = validatefn;
    }
    sfCtx.dispatch(actions.updateValidations(validations));
  }, []);

  return <Fragment>{props.children}</Fragment>;
};

interface PagesContext {
  readonly navigation: Readonly<{
    forward: boolean;
    backward: boolean;
    current: number;
    max: number;
  }>;
  readonly navigate: (decrement?: boolean) => void;
  readonly setPageIndex: (index: number) => void;
}

export const PagesContext = createContext<PagesContext | null>(null);
