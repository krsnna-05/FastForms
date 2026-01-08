import { google } from "googleapis";

const getGoogleFormsProvider = (access_token: string) => {
  const credentials = {
    access_token: access_token,
  };

  console.log("credentials in getGoogleFormsProvider:", credentials);

  const auth = new google.auth.OAuth2();
  auth.setCredentials(credentials);

  const forms = google.forms({
    version: "v1",
    auth: auth,
  }).forms;

  return forms;
};

export default getGoogleFormsProvider;
