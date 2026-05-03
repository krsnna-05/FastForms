import { appwriteConfig } from "@/config";
import { Client, Storage } from "node-appwrite";

const client = new Client()
  .setProject(appwriteConfig.appwrite_project_id)
  .setEndpoint(appwriteConfig.appwrite_endpoint)
  .setKey(appwriteConfig.appwrite_api_key);

const storage = new Storage(client);

export { storage, client };
