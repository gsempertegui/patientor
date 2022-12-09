import React from "react";
import { Entry, Diagnose } from "../types";
import { useStateValue } from "../state";
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

const OccupationalHealthcareEntry = (entry: Entry) => {
  
  const [{ diagnoses }, ] = useStateValue();

  return(
    <div key={entry.id}>
      {/* <div>{entry.type}</div> */}
      <div>{entry.date}<MedicalInformationIcon /></div>
      <div><em>{entry.description}</em></div>
      <div>
        {entry.type==='OccupationalHealthcare'?`employer: ${entry.employerName.trim()}`:''}
        {entry.type==='OccupationalHealthcare' && entry.sickLeave?`.   Sick-leave: ${entry.sickLeave.startDate} - ${entry?.sickLeave?.endDate} `:''}
      </div>
      <div>{entry.specialist?`diagnose by ${entry.specialist}`:''}</div>
      <ul>
        {entry?.diagnosisCodes?.map((code) =>
            (<li key={code} id={code}>{code} {Object.values(diagnoses).find((diagnose:Diagnose)=> diagnose.code===code)?.name}</li>)
        )}
      </ul>
    </div>
  );
};
export default OccupationalHealthcareEntry;