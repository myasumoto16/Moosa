export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.masa.moosa',
    projectId: '66f48cab0039770f9922',
    databaseId: '66f48e22001ea53f209a',
    userCollectionId: '66f48e380001470f70aa',
    videoCollectionId: '66f48e4a002a2f250300',
    storageId: '66f48f32002f4bc62d39',
}

 const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = config

import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);
        const newUser = await databases.createDocument(config.databaseId, 
                                    config.userCollectionId, ID.unique(), 
                                    {
                                        accountId: newAccount.$id,
                                        email,
                                        username,
                                        avatar: avatarUrl,
                                    })
        return newUser
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

const deleteSession = async () => {
  try {
    const activeSessions = await account.listSessions();
    if (activeSessions.total > 0) {
      await account.deleteSession("current")    
    }
  } catch (error) {
    console.log("No session available.");
  }
}

export const signIn = async (email, password) => {
    try {
        
      // Check if there is already an active session
      const currentSession = await account.getSession('current');
      if (currentSession) {
        return currentSession; // Return the existing session
      }
    } catch (error) {
      // If there's no active session, proceed to create a new one
      console.log('No active session, proceeding with login');
    }
  
    try {
      // Create a new session if no session is active
      console.log("creating a session")
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw new Error(error);
    }
  };
  


export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;
        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
    }
}

export const getAllPosts = async () => {

    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )
        return posts.documents
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {

  try {
      const posts = await databases.listDocuments(
          databaseId,
          videoCollectionId,
          [Query.orderDesc('$createdAt', Query.limit(7))] // order by desc
      )
      return posts.documents
  }
  catch (error) {
      throw new Error(error);
  }
}

