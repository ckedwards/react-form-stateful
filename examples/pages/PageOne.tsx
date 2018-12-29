import { createElement } from 'react';
import { Page } from './Pages';
import { FC } from 'react';
import * as yup from 'yup';
import { SFInput } from 'react-stateful-form';
import NextButton from './NextButton';
import PreviousButton from './PreviousButton';
import Logger from './Logger';

const PageOne: FC = () => {
  return (
    <Page
      validationSchema={yup.object().shape({
        'one/email': yup
          .string()
          .required('Email required')
          .email('Invalid email address'),
      })}
    >
      <label>
        Email:
        <SFInput name="one/email" />
      </label>
      <div>
        <PreviousButton />
        <NextButton />
      </div>
      <Logger />
    </Page>
  );
};

export default PageOne;
