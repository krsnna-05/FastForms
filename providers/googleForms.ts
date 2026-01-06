import { google } from "googleapis";

const getGoogleFormsProvider = () => {
  const forms = google.forms("v1").forms;

  return forms;
};

export default getGoogleFormsProvider;
