import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container } from "@material-ui/core";
//import Box from '@mui/material/Box';

import { apiBaseUrl } from "./constants";
import { useStateValue, setPatientList, setDiagnoseList } from "./state";
import { Patient, Diagnose } from "./types";

import PatientListPage from "./PatientListPage";
import { Typography } from "@material-ui/core";
import PatientFullInfoPage from "./PatientFullInfoPage";

const App = () => {
  const [state, dispatch] = useStateValue();
  React.useEffect(() => {
    console.log('apiBaseUrl: ', apiBaseUrl);
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        //dispatch({ type: "SET_PATIENT_LIST", payload: patientListFromApi });
        dispatch(setPatientList(patientListFromApi));
        console.log('patients => state:', state);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatientList();

    const fetchDiagnoseList = async () => {
      try {
        const { data: diagnoseListFromApi } = await axios.get<Diagnose[]>(
          `${apiBaseUrl}/diagnoses`
        );
        //dispatch({ type: "SET_PATIENT_LIST", payload: patientListFromApi });
        dispatch(setDiagnoseList(diagnoseListFromApi));
        console.log('diagnoses => state:', state);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchDiagnoseList();
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route path="/:id" element={<PatientFullInfoPage />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
