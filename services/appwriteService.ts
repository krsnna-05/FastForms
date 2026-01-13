import { tablesDB } from "@/providers/appwrite";
import { ID, Query } from "node-appwrite";

export type userType = {
  name: string;
  email: string;
  refreshToken: string;
  accessToken: string;
  profilePhotoUrl?: string;
};

class AppwriteService {
  private dbId: string = "69383e29001a811e9e49";
  private userTableId: string = "users";
  private formTableId: string = "forms";

  constructor() {}

  async createUser(user: userType) {
    return tablesDB.createRow({
      databaseId: this.dbId,
      tableId: this.userTableId,
      rowId: ID.unique(),
      data: user,
    });
  }

  async userExists(email: string) {
    try {
      const response = tablesDB.listRows({
        databaseId: this.dbId,
        tableId: this.userTableId,
        queries: [
          Query.equal("email", email),
          Query.limit(1),
          Query.select(["$id"]),
        ],
      });

      return response;
    } catch (error) {
      console.log("Error checking user existence:", error);
      return null;
    }
  }

  async updateUser(userId: string, data: Partial<userType>) {
    try {
      const res = await tablesDB.updateRow({
        databaseId: this.dbId,
        tableId: this.userTableId,
        rowId: userId,
        data: data,
      });
    } catch (error) {
      console.log("Error updating user:", error);
    }
  }

  async getUserById(userId: string) {
    try {
      console.log("Fetching user with ID:", userId);
      const res = await tablesDB.getRow({
        databaseId: this.dbId,
        tableId: this.userTableId,
        rowId: userId,
      });

      console.log("User fetched successfully.");
      return res;
    } catch (error) {
      console.log("Error fetching user by ID:", error);
      return null;
    }
  }

  async createForm(
    userId: string,
    formData: {
      createdByUserId: string;
      formTitle: string;
    }
  ) {
    try {
      const res = await tablesDB.createRow({
        databaseId: this.dbId,
        tableId: this.formTableId,
        rowId: ID.unique(),
        data: formData,
      });

      return res;
    } catch (error) {
      console.log("Error creating form:", error);
      return null;
    }
  }

  async getFormsByUserId(userId: string) {
    try {
      const res = await tablesDB.listRows({
        databaseId: this.dbId,
        tableId: this.formTableId,
        queries: [
          Query.equal("createdByUserId", userId),
          Query.select(["$id", "formTitle", "createdByUserId"]),
        ],
      });

      return res;
    } catch (error) {
      console.log("Error fetching forms by user ID:", error);
      return null;
    }
  }
}

export default new AppwriteService();
