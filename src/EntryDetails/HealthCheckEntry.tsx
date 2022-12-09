import React from "react";
import { Entry, Diagnose } from "../types";
import { useStateValue } from "../state";
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { green, yellow, red } from "@mui/material/colors";
import { SvgIcon, SvgIconProps } from "@mui/material";
//import { IconContainerProps } from "@material-ui/lab";

const HealthCheckEntry = (entry: Entry) => {

  const [{ diagnoses }, ] = useStateValue();

  function FavoriteIcon(props: SvgIconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </SvgIcon>
    );
  }
  
  return(
    <div key={entry.id}>
      {/* <div>{entry.type}</div> */}
      <div>{entry.date} <HealthAndSafetyIcon /></div>
      <div><em>{entry.description}</em></div>
      {entry.type==='HealthCheck'
        ?(entry.healthCheckRating===0)
          ?<FavoriteIcon sx={{ color: green[700] }} />
        :(entry.healthCheckRating===1)
          ?<FavoriteIcon sx={{ color: green[200] }} />
        :(entry.healthCheckRating===2)
          ?<FavoriteIcon sx={{ color: yellow[700] }} />
        :(entry.healthCheckRating===3)
          ?<FavoriteIcon sx={{ color: red[700] }} />
        :<></>:<></>
      }
      <div>{entry.specialist?`diagnose by ${entry.specialist}`:''}</div>
      <ul>
        {entry?.diagnosisCodes?.map((code) =>
            (<li key={code} id={code}>{code} {Object.values(diagnoses).find((diagnose:Diagnose)=> diagnose.code===code)?.name}</li>)
        )}
      </ul>
    </div>
  );
};
export default HealthCheckEntry;