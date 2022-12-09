import { State } from "./state";
import { Diagnose, Patient, Entry } from "../types";
//import { memo } from "react";

type AddEntry = {
  entry: Entry;
  patientId: string;
};

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_ENTRY";
      payload: AddEntry;
    }
  | {
      type: "SET_PATIENT_FULL_DATA"
      payload: Patient;
    }
    | {
      type: "SET_DIAGNOSE_LIST";
      payload: Diagnose[];
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST": {
      //console.log('action.payload: ', action.payload);
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    }
    case "SET_DIAGNOSE_LIST": {
      //console.log('action.payload: ', action.payload);
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnose) => ({ ...memo, [diagnose.code]: diagnose }),
            {}
          ),
          ...state.diagnoses
        }
      };
    }
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_ENTRY": {
      const patientsExtracted = Object.values(state.patients);
      const patientsTmp = patientsExtracted.map((patient) => {
        let uPatient = patient;
        if (uPatient.id === action.payload.patientId) {
          if (uPatient.entries === undefined)
            uPatient.entries = [action.payload.entry];
          else
            uPatient.entries.push(action.payload.entry);
        } else {
          uPatient = patient;
        }
        return uPatient;
      });
      const patientsUpdated = patientsTmp.reduce((memo, patient) => 
        ({ ...memo, [patient.id]: patient }),{});
      return { 
        diagnoses: state.diagnoses,
        patients: patientsUpdated
      };
    }
    case "SET_PATIENT_FULL_DATA": {
      // console.log('reducer => state.patients:', state.patients);
      // console.log('reducer => action.payload', action.payload);
      // console.log('reducer => Object.values(state.patients)', Object.values(state.patients));
      return {
        ...state,
        patients: 
          Object.values(state.patients).reduce(
            (memo, patient) => ((patient.id === action.payload.id)
            ? {...memo, [action.payload.id]: action.payload}
            : {...memo, [patient.id]: patient}), 
            {} 
          )
      };
    }
    default:
      return state;
  }
};

export const setPatientList = (patientList: Patient[]) => {
  return <Action> {type: "SET_PATIENT_LIST", payload: patientList };
};

export const addPatient = (patient: Patient) => {
  return <Action> {type: "ADD_PATIENT", payload: patient };
};

export const addEntry = (patientEntry: AddEntry) => {
  return <Action> {type: "ADD_ENTRY", payload: patientEntry };
};

export const setPatientFullData = (patient: Patient) => {
  return <Action> {type: "SET_PATIENT_FULL_DATA", payload: patient };
};

export const setDiagnoseList = (diagnoseList: Diagnose[]) => {
  return <Action> {type: "SET_DIAGNOSE_LIST", payload: diagnoseList };
};