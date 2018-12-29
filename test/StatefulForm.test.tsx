import { cleanup } from 'react-testing-library';
import { cleanupState, renderForm, sfCtx, data } from './helpers';

describe('<StatefulForm>', () => {
  afterEach(() => {
    cleanup();
    cleanupState();
  });

  it('should initialize StatefulForm with expected state for useSFControl', () => {
    renderForm([{ name: 'test' }]);

    const currentStateRef = sfCtx!.stateRef;
    expect(currentStateRef).toBeTruthy();
    expect(JSON.stringify(currentStateRef.current, undefined, 2)).toMatchSnapshot();

    const dataItem = data['test']!;
    expect(dataItem).toBeTruthy();

    expect(dataItem.useSFTouched![0]).toEqual(false);
    expect(dataItem.useSFTouched![1]).toBeInstanceOf(Function);

    expect(dataItem.useSFError![0]).toEqual('Invalid');
    expect(dataItem.useSFError![1]).toBeInstanceOf(Function);

    const { submit, ...restSubmit } = dataItem.useSFSubmitState!;
    expect(restSubmit).toEqual({ submitable: false, isSubmitting: false });
    expect(submit).toBeInstanceOf(Function);

    // Control case
    const { touch, setValue, ...restCtl } = dataItem.useSFControl!;
    expect(restCtl).toEqual({ value: 'value', touched: false, error: undefined });
    expect(touch).toBeInstanceOf(Function);
    expect(setValue).toBeInstanceOf(Function);
  });

  it('should initialize StatefulForm with expected state for useSFValue', () => {
    renderForm([{ name: 'test', type: 'value' }]);

    const currentStateRef = sfCtx!.stateRef;
    expect(currentStateRef).toBeTruthy();
    expect(JSON.stringify(currentStateRef.current, undefined, 2)).toMatchSnapshot();

    const dataItem = data['test']!;
    expect(dataItem).toBeTruthy();

    expect(dataItem.useSFTouched![0]).toEqual(false);
    expect(dataItem.useSFTouched![1]).toBeInstanceOf(Function);

    expect(dataItem.useSFError![0]).toEqual('Invalid');
    expect(dataItem.useSFError![1]).toBeInstanceOf(Function);

    const { submit, ...restSubmit } = dataItem.useSFSubmitState!;
    expect(restSubmit).toEqual({ submitable: false, isSubmitting: false });
    expect(submit).toBeInstanceOf(Function);

    //Value Case
    expect(dataItem.useSFValue![0]).toEqual('value');
    expect(dataItem.useSFValue![1]).toBeInstanceOf(Function);
  });
});
