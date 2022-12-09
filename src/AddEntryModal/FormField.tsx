import React, { useState } from "react";
import { ErrorMessage, Field, FieldProps } from "formik";
import {
  FormControl,
  MenuItem,
  TextField as TextFieldMUI,
  Typography,
} from "@material-ui/core";
import { Select } from "@material-ui/core";

import { Diagnose, Gender, HealthCheckRating, Type } from "../types";
import { InputLabel } from "@material-ui/core";
// import Input from '@material-ui/core/Input';

// structure of a single option
export type GenderOption = {
  value: Gender;
  label: string;
};

// structure of types option
export type TypeOption = {
  value: Type;
  label: string;
};

// structure of healthCheckRating option
export type HealthCheckRatingOption = {
  value: HealthCheckRating;
  label: string;
};
// props for select field component
type SelectFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  options: GenderOption[]|TypeOption[]|HealthCheckRatingOption[];
};

const FormikSelect = ({ field, ...props }: FieldProps) => {
  console.log('FormikSelect => field:', field);
  console.log('FormikSelect => props:', props);
  return(<Select {...field} {...props} />);
};

export const SelectField = ({ name, label, placeholder, defaultValue, options }: SelectFieldProps) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Field
      fullWidth
      style={{ marginBottom: "0.5em" }}
      label={label}
      placeholder={placeholder}
      component={FormikSelect}
      defaultValue={defaultValue}
      name={name}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label || option.value}
        </MenuItem>
      ))}
    </Field>
  </>
);

interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
}

export const TextField = ({ field, label, placeholder }: TextProps) => {
  console.log('TextField => field: ', field);
  //console.log('TextField => errors: ', props);
  //console.log('TextField => errors: ', errors);
  return(
    <div>
      <div style={{ marginBottom: "1em" }}>
        <TextFieldMUI
          fullWidth
          label={label}
          placeholder={placeholder}
          {...field}
        />
        <Typography variant="subtitle2" style={{ color: "red" }}>
          {/* {errors.name && touched.name ? (
              <div>{errors.name}</div>
            ) : null}         */}
          <ErrorMessage name={field.name} />
        </Typography>
      </div>
    </div>
  );
};

/*
  for exercises 9.24.-
*/
interface NumberProps extends FieldProps {
  label: string;
  min: number;
  max: number;
}

export const NumberField = ({ field, label, min, max }: NumberProps) => {
  const [value, setValue] = useState<number>();

  return (
    <div style={{ marginBottom: "1em" }}>
      <TextFieldMUI
        fullWidth
        label={label}
        placeholder={String(min)}
        type="number"
        {...field}
        value={value}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (value === undefined) return;
          if (value > max) setValue(max);
          else if (value <= min) setValue(min);
          else setValue(Math.floor(value));
      }}
      />
      <Typography variant="subtitle2" style={{ color: "red" }}>
        <ErrorMessage name={field.name} />
      </Typography>
    </div>
  );
};

// export const DiagnosisSelection = ({
//   diagnoses,
//   setFieldValue,
//   setFieldTouched,
// }: {
//   diagnoses: Diagnose[];
//   setFieldValue: FormikProps<{ diagnosisCodes: string[] }>["setFieldValue"];
//   setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>["setFieldTouched"];
// }) => {
//   // let selectedData: string[];
//   const [selectedDiagnoses, setDiagnoses] = useState<string[]>([]);
//   const field = "diagnosisCodes";
//   const onChange = (data: string[]) => {    
//     console.log('DiagnosisSelection => data: ', data);
//     setDiagnoses(data);
//     // selectedData = [...data];
//     console.log('DiagnosisSelection => selectedDiagnoses: ', selectedDiagnoses);
//     setFieldTouched(field, true);
//     setFieldValue(field, selectedDiagnoses);
//   };

//   const stateOptions = diagnoses.map((diagnosis) => ({
//     key: diagnosis.code,
//     text: `${diagnosis.name} (${diagnosis.code})`,
//     value: diagnosis.code,
//   }));
  
//   return (
//     <FormControl style={{ width: 552, marginBottom: '30px' }}>
//       <InputLabel>Diagnoses</InputLabel>
//       <Select multiple value={selectedDiagnoses} onChange={(e) => onChange(e.target.value as string[])} input={<Input />}>
//         {stateOptions.map((option) => (
//           <MenuItem key={option.key} value={option.value}>
//             {option.text}
//           </MenuItem>
//         ))}
//       </Select>
//       <ErrorMessage name={field} />
//     </FormControl>
//   );
// };

export const DiagnosisSelection = ({
  diagnoses,
  }: {
    diagnoses: Diagnose[];
  }) => {

    const FormikSelect = ({ field, ...props }: FieldProps) => {
    console.log('FormikSelect => field:', field);
    console.log('FormikSelect => props:', props);
    return(<Select {...field} {...props} />);
  };

  return (
    <FormControl style={{ width: 552, marginBottom: '30px' }}>
      <InputLabel htmlFor="diagnosisCodes">
        Diagnoses
      </InputLabel>
      <Field as="select" 
        fullWidth
        label="Diagnoses"
        placeholder="Diagnoses"
        name="diagnosisCodes"
        component={FormikSelect}
        multiple
      >
        {diagnoses && diagnoses.map((diagnose) => (
            <MenuItem key={diagnose.code} value={diagnose.code}>
              {diagnose.name}
            </MenuItem>
        ))}
      </Field>
    </FormControl>
  );
};