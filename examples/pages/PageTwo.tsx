import { createElement } from 'react';
import { Page } from './Pages';
import { FC } from 'react';
import { SFSelect } from 'react-stateful-form';
import NextButton from './NextButton';
import PreviousButton from './PreviousButton';
import Logger from './Logger';

const PageTwo: FC = () => {
  return (
    <Page>
      <label>
        Reason for complaint:
        <SFSelect
          name="two/reason"
          defaultEntry={'Please select a reason'}
          values={['Bug', 'Typo', 'Feature Request', 'Other']}
        />
      </label>
      <div>
        <PreviousButton />
        <NextButton />
      </div>
      <Logger />
    </Page>
  );
};

export default PageTwo;
