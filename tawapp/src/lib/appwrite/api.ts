import { ID, Query } from 'appwrite';
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from './config';

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw new Error("Failed to create new account.");

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.error("Error in createUserAccount:", error);
        throw error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );

        return newUser;
    } catch (error) {
        console.error("Error in saveUserToDB:", error);
        throw error;
    }
}

export async function signInAccount(user: { email: string; password: string; }) {
    try {
        console.log("Attempting to sign in:", user); // Log the attempt to sign in

        const session = await account.createEmailPasswordSession(user.email, user.password);

        console.log("Session created:", session); // Log the created session

        return session;
    } catch (error) {
        console.error("Error in signInAccount:", error);
        throw error;
    }
}

export async function getAccount() {
    try {
        const currentAccount = await account.get();
        return currentAccount;
    } catch (error) {
        console.error("Error in getAccount:", error);
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw new Error("No current account found.");

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser.documents.length) throw new Error("No user found with the given accountId.");

        return currentUser.documents[0];
    } catch (error) {
        console.error("Error in getCurrentUser:", error);
        return null;
    }
}
