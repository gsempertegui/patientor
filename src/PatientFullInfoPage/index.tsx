import React, { useEffect } from "react";
import axios from "axios";
import { useMatch } from 'react-router-dom';
//import { useMatch, useNavigate } from 'react-router-dom';
import { PathMatch } from "react-router-dom";
//import { Box, Table, Button, TableHead, Typography } from "@material-ui/core";
import { Typography, Button } from "@material-ui/core";
import Box from '@mui/material/Box'; // Box from @material-ui/core, doesn't show border...
//import { Patient, Diagnose } from "../types";
//import { Patient, Entry, Gender, EntryWithNoId } from "../types";
import { Patient, Entry, Gender, EntryForm } from "../types";
import { apiBaseUrl } from "../constants";
import { setPatientFullData, useStateValue } from "../state";
//import { Patient } from "../types";
import { Alert } from "@material-ui/lab";
import { Rating } from "@material-ui/lab";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { withStyles } from "@material-ui/core";
import EntryDetails from "../EntryDetails";
//import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import { addEntry } from "../state";
//import AddPatientModal from "../AddPatientModal";
import AddEntryModal from "../AddEntryModal";

const PatientFullInfoPage = () => {

  const [{ patients }, dispatch] = useStateValue();
  //const [{ patients, diagnoses }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const StyledRating = withStyles({
    iconFilled: {
      color: "#000000",
    },
    iconHover: {
      color: "#ffffff",
    },
  })(Rating);

  // const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  // const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const match = useMatch('/:id');

  const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
  };

  //type TParams =  { id: string };

  const parseMatchId = (match: PathMatch|null): string => {
    //const matchR = typeof match === 'object' ? match : undefined;
    if (!match || !isString(match.params.id) ) {
      console.error("Unrecognized patient id");
      setError("Unrecognized patient id");
      throw new Error("Unrecognized patient id");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return match.params.id;
  };
  const id = parseMatchId(match);
  const patientFullData = 
    Object.values(patients).find((patient:Patient)=> patient.id===id);

  // interface Props {
  //   fontSize: FontSize
  // }  sx={{ color: red[700] }}

  const GenderIcon = () => {
    switch(patientFullData?.gender) {
      case Gender.Male: 
        return(<MaleIcon fontSize="inherit" />);
      case Gender.Female:
        return(<FemaleIcon fontSize="inherit" />);
      default:
        return(<TransgenderIcon fontSize="inherit" />);
    }
  };

  //const submitNewEntry = async (values: EntryWithNoId) => {
  const submitNewEntry = async (values: EntryForm) => { // TODOLIST: change EntryForm to EntryWithNoId
    console.log("submitNewEntry => values:", JSON.stringify(values));
    let copiedValues = JSON.parse(JSON.stringify(values)) as EntryForm;
    copiedValues = { ...copiedValues };
    // TODOLIST: delete optional fields with null values...
    if (copiedValues.type === "Hospital" 
      && ((copiedValues?.discharge?.date !== undefined && copiedValues.discharge.date === "")
        || (copiedValues?.discharge?.criteria !== undefined && copiedValues.discharge.criteria === ""))
    ) {
      delete copiedValues?.discharge?.date;
      delete copiedValues?.discharge?.criteria;
      delete copiedValues?.discharge;
    }
    if (copiedValues.type === "OccupationalHealthcare" 
      && ((copiedValues?.sickLeave?.startDate !== undefined && copiedValues.sickLeave.startDate === "")
        || (copiedValues?.sickLeave?.endDate !== undefined && copiedValues.sickLeave.endDate === ""))
    ) {
      delete copiedValues?.sickLeave?.startDate;
      delete copiedValues?.sickLeave?.endDate;
      delete copiedValues?.sickLeave;
    }
    if (copiedValues.type !== "HealthCheck") 
      delete copiedValues?.healthCheckRating;
    // if (values.type === "Hospital" && values?.discharge?.criteria !== undefined && values.discharge.criteria === "")
    //   delete values?.discharge?.criteria;
    console.log("submitNewEntry => copiedValues(II):", JSON.stringify(copiedValues));
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        copiedValues
      );
      //dispatch({ type: "ADD_PATIENT", payload: newPatient });
      const addEntryData = {entry: newEntry, patientId: id};
      console.log('PatientFullInfoPage=> addEntryData:', addEntryData);
      dispatch(addEntry(addEntryData));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  useEffect(() => {
    const patientFullData = async () => {
      try {
        const id: string = parseMatchId(match);
        // checking if all data is already in patients array....
        const patientDataTmp = Object.values(patients).find((patient) => patient.id === id);
        if (patientDataTmp && patientDataTmp.ssn !== undefined)
          return patientDataTmp;
        //console.log('url path: ', apiBaseUrl + '/patients/' + id);
        const { data: patientData } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        console.log('patient data: ', patientData);
        //dispatch({ type: "SET_PATIENT_FULL_DATA", payload: patientData });
        dispatch(setPatientFullData(patientData));
        return(patientData);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error(e?.response?.data || "Unrecognized axios error");
          setError(String(e?.response?.data?.error) || "Unrecognized axios error");
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
        //console.log('error: ', error);
        return(null);
      }
    };

    // set state for patient data...
    //console.log('patientFullData:', patientFullData());
    void patientFullData();
  }, [dispatch]);

  const commonStyles = {
    bgcolor: 'background.paper',
    m: 1,
    border: 1,
    borderColor: 'green',
    // width: '5rem',
    // height: '5rem',
  };

  //const fontSizeValue:FontSize = FontSize.Inherit;
  return(
    <div>
      {error
        ? <Alert severity="error">Error: {error}</Alert>
        : <div>
            <Box>
              <Typography align="left" style={{ fontWeight: "bold" }} variant="h5">
                <br />
                {patientFullData !== undefined ? patientFullData.name : <></>}
                <StyledRating
                  readOnly
                  value={1}
                  max={1}
                  icon={<GenderIcon />}
                />
                <br />
              </Typography>
              <label>occupation: {patientFullData?.occupation}</label>
              <br />
              <label>ssn: {patientFullData?.ssn}</label>
              <br />
              <br />
              <Typography align="left" style={{ fontWeight: "bold" }} variant="h6">entries</Typography>
              <br />
              {patientFullData?.entries?.map((entry) => 
                (
                  <div key={entry.id}>
                    {/* <div key={entry.id}>
                      <div>{entry.date} {entry.description}</div>
                      <ul>
                        {entry?.diagnosisCodes?.map((code) =>
                            (<li key={code} id={code}>{code} {Object.values(diagnoses).find((diagnose:Diagnose)=> diagnose.code===code)?.name}</li>)
                        )}
                      </ul>
                    </div> */}
                    <Box 
                      sx={{
                        ...commonStyles,
                        justifyContent: 'left', 
                        width: '700px', 
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        margin: '2px',
                        padding: '0px'
                      }}
                    >
                      <EntryDetails entry={entry} />
                    </Box>
                  </div>
                ))}
              <br />
            </Box>
            <AddEntryModal
              modalOpen={modalOpen}
              onSubmit={submitNewEntry}
              error={error}
              onClose={closeModal}
            />
            <Button variant="contained" onClick={() => openModal()}>
              {/*openModal()*/}
              Add New Entry
            </Button>
          </div>
      }
    </div>
  );
};

export default PatientFullInfoPage;