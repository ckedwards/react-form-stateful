import { FC, createElement } from 'react';
import { StatefulForm, SFInput, SFSelect, SFTextArea } from 'react-stateful-form';
import * as yup from 'yup';

const ValidationScheme: FC = () => {
  return (
    <StatefulForm
      validationSchema={yup.object().shape({
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
        Reason for comlaint:
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

export default ValidationScheme;
