import React from "react";
import { Grid, Button } from "@material-ui/core";
//import {
  // Select,
  // FormControl,
  // MenuItem,
  // TextField as TextFieldMUI,
  // Typography,
  // InputLabel,
//} from "@material-ui/core";

import { Field, Formik, Form } from "formik";
// import { FieldProps } from "formik";

//import { TextField, SelectField, DiagnosisSelection } from "./FormField";
import { DiagnosisSelection, TypeOption, HealthCheckRatingOption } from "./FormField";
import { TextField, SelectField } from "./FormField";
//import { EntryWithNoId, Type, HealthCheckRating } from "../types";
import { EntryForm, Type, HealthCheckRating } from "../types";
//import { Entry } from "../types";
import { useStateValue } from "../state";

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
//export type EntryFormValues = Omit<Entry, "id">;

interface Props {
  onSubmit: (values: EntryForm) => void;
  //onSubmit: (values: EntryWithNoId) => void;
  //onSubmit: (values: Entry) => void;
  onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: Type.Hospital, label: "Hospital" },
  { value: Type.HealthCheck, label: "HealthCheck" },
  { value: Type.OccupationalHealthcare, label: "OccupationalHealthcare" },
];

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
  { value: HealthCheckRating.CriticalRisk, label: "CriticalRisk" },
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.HighRisk, label: "HighRisk" },
  { value: HealthCheckRating.LowRisk, label: "LowRisk" },
];

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses } ] = useStateValue();

  function validOptionalDate(dateString: string) {
    if (!dateString)
      return;
    const error = isValidDate(dateString);
    return error;
  }

  //const formik = useFormikContext();
  function isValidDate(dateString: string) {
    //console.log('isValidDate => dateString=', dateString);
    let error;
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) 
      error = 'Invalid date!';  // Invalid format
    else {
      const d = new Date(dateString);
      const dNum = d.getTime();
      if(!dNum && dNum !== 0) 
        error = 'Invalid date!'; // NaN value, Invalid date
      else {
        //return d.toISOString().slice(0,10) === dateString;
        //console.log('d.toISOString().slice(0,10): ', d.toISOString().slice(0,10));
        const dateConfirm = d.toISOString().slice(0,10);
        console.log('dateConfirm: ', dateConfirm);
        if(dateConfirm !== dateString)
          error = 'Invalid date!';
      }
    }
    return error;
  }

  function validEmployerName(employer: string) {
    if (employer)
      return;
    const error = 'Employer name required';
    return error;
  }


  return (
    <Formik
      enableReinitialize={true}
      initialValues= 
      {{
        type: "Hospital",
        description: "",
        date: "",
        specialist: "",
        discharge: {date: "", criteria: ""},
        diagnosisCodes: [],
        healthCheckRating: HealthCheckRating.Healthy,
        sickLeave: {startDate: "", endDate: ""},
        employerName: ""
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.name = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, ...props }) => {
        return (
          <Form className="form ui">
            {/* <Field
              label="Type"
              placeholder="Type"
              name="type"
              component={TextField} // dfd temporarily
            /> */}
            <SelectField 
              label="Type" 
              name="type" 
              placeholder="Type"
              defaultValue="Hospital"
              options={typeOptions} 
            />

            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            
            <Field
              label="Entry date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
              validate={isValidDate}
              />
            
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />

            <DiagnosisSelection
              diagnoses={Object.values(diagnoses)}
            />

            {(props.values.type === "Hospital")
              && (
                  <Field
                    label="Discharge date"
                    placeholder="YYYY-MM-DD"
                    name="discharge.date"
                    component={TextField}
                    validate={validOptionalDate}
                  />
              )
            }
            {(props.values.type === "Hospital")
              && (<Field
                  label="Discharge criteria"
                  placeholder="Discharge criteria"
                  name="discharge.criteria"
                  component={TextField}
                />)
            }
            {(props.values.type === "HealthCheck")
              && (<SelectField 
                  label="HealthCheckRating" 
                  name="healthCheckRating"
                  placeholder="Health Check Rating"
                  defaultValue="Healthy"
                  options={healthCheckRatingOptions}
                />)
            }
            {(props.values.type === "OccupationalHealthcare")
              && (<Field
                label="Employer name"
                placeholder="Employer name"
                name="employerName"
                component={TextField}
                validate={validEmployerName}
              />)
            }
            {(props.values.type === "OccupationalHealthcare")
              && (<Field
                label="Start date"
                placeholder="Start date"
                name="sickLeave.startDate"
                component={TextField}
                validate={validOptionalDate}
              />)
            }
            {(props.values.type === "OccupationalHealthcare")
              && (<Field
                label="End date"
                placeholder="End date"
                name="sickLeave.endDate"
                component={TextField}
                validate={validOptionalDate}
              />)
            }
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;