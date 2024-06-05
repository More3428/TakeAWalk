import { ID, ImageGravity, Query } from 'appwrite';
import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';


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

        // Check for existing sessions
        const currentSession = await account.getSession('current').catch(() => null);

        if (currentSession) {
            // If a session exists, delete it
            await account.deleteSession('current');
            console.log("Existing session deleted.");
        }

        // Create a new session using email and password
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


export async function signOutAccount() {
    try{
        const session = await account.deleteSession("current");

        return session;
    } catch (error){
        console.log(error);

    }
}

export async function uploadFile(file: File) {
    try{
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
        
    } catch(error) {
        console.log(error); 
    }
}

export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
      if (!fileUrl) throw Error;
        return fileUrl;
    } catch(error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string){
    try{
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return { status: 'ok'}
    } catch(error){
        console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {
        // Upload image to storage
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw new Error("File upload failed");

        // Log the uploaded file details
        console.log("Uploaded File:", uploadedFile);

        // Get file URL
        const fileUrl = await getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw new Error("File preview URL generation failed");
        }

        // Log the file URL
        console.log("File URL:", fileUrl);

      

        // Convert tags into an array
        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        // Log the tags array
        console.log("Tags:", tags);

        // Prepare document data
        const documentData = {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags,
        };

        // Log the document data
        console.log("Document Data:", documentData);

        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            documentData
        );

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw new Error("Failed to create new post document");
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts(){
    try {
        const posts = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.postCollectionId,
          [Query.orderDesc("$createdAt"), Query.limit(20)]
        );
    
        if (!posts) throw Error;
    
        return posts;
      } catch (error) {
        console.log(error);
      }
    }