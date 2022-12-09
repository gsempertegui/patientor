import React from 'react';
import { Entry } from '../types';
import HospitalEntry from './HospitalEntry';
import HealthCheckEntry from './HealthCheckEntry';
import OccupationalHealthcareEntry from './OccupationalHealthcareEntry';

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };  
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntry {...entry}/>;
    case "Hospital":
      return <HospitalEntry {...entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry {...entry}/>;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;