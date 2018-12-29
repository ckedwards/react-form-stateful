import { createElement } from 'react';
import { Page } from './Pages';
import { FC } from 'react';
import * as yup from 'yup';
import { SFInput, SFTextArea } from 'react-stateful-form';
import NextButton from './NextButton';
import PreviousButton from './PreviousButton';
import Logger from './Logger';

const PageOne: FC = () => {
  return (
    <Page
      validationSchema={yup.object().shape({
        'three/desc': yup.string().max(256, 'Please keep your description short!'),
        'three/complaint': yup
          .string()
          .required('Complaint required')
          .max(10000, 'Max complaint size: 10,000 characters.'),
      })}
    >
      <label>
        Short Description:
        <SFInput name="three/desc" />
      </label>
      <label>
        Complaint:
        <SFTextArea name="three/complaint" />
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
