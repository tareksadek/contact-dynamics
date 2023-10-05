import React from 'react';
import parse from 'html-react-parser';
import { Widget } from '@typeform/embed-react';

interface CustomFormProps {
  formType: 'google' | 'microsoft' | 'typeform' | 'jotform';
  embedCode: string;
}

const CustomForm: React.FC<CustomFormProps> = ({ formType, embedCode }) => {
  switch (formType) {
    case 'google':
    case 'microsoft':
    case 'jotform':
      return <div>{parse(embedCode)}</div>;
    case 'typeform':
      return <Widget id={embedCode} style={{ width: '100%' }} />;
    default:
      return null;
  }
};

export default CustomForm;
