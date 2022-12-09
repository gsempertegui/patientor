import React from "react";
import { Diagnose } from "../types";
import { useStateValue } from "../state";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Entry } from "../types";
//import Icon from '@mui/material/Icon';
//import { Box, } from "@material-ui/core";

const HospitalEntry = (entry:Entry) => {

  const [{ diagnoses }, ] = useStateValue();

  // const commonStyles = {
  //   bgcolor: 'background.paper',
  //   border: 1,
  //   borderColor: 'green',
  //   // width: '5rem',
  //   // height: '5rem',
  // };
  //console.log('HospitalEntry => entry: ', entry);
  return(
    <div key={entry.id}>
      {/* <div>{entry.type}</div> */}
      <div>{entry.date} <LocalHospitalIcon /></div>
      <div><em>{entry.description}</em></div>
      <div>
        {entry.type==='Hospital' && entry.discharge?`discharge: ${entry?.discharge?.date as string} `:''}
        {entry.type==='Hospital' && entry.discharge?`${entry?.discharge?.criteria as string} `:''}
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
export default HospitalEntry;