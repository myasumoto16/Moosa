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

import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';
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
const storage = new Storage(client);

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
        // Get the current account from Appwrite
        const currentAccount = await account.get();
        
        // Check if the current account exists
        if (!currentAccount) {
            throw new Error('No current account found');
        }
        console.log('currentAccount id', currentAccount.$id)
        // Query the database for the user document
        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        // Check if the documents array is not empty
        if (!currentUser.documents || currentUser.documents.length === 0) {
            throw new Error('No user document found for the current account');
        }

        // Log the retrieved user and return the first document
        console.log('Current user:', currentUser.documents[0]);
        return currentUser.documents[0];
    } catch (error) {
        console.error('Error fetching current user:', error.message); // Log the error message
        return null; // Return null in case of an error
    }
};


export const getAllPosts = async () => {

    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')] // order by desc
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

export const searchPosts = async (query) => {

  try {
      const posts = await databases.listDocuments(
          databaseId,
          videoCollectionId,
          [Query.search('title', query)] // order by desc
      )
      return posts.documents
  }
  catch (error) {
      throw new Error(error);
  }
}


export const getUserPosts = async (userId) => {
  console.log('userId in getPosts: ' + userId)
  try {
      const posts = await databases.listDocuments(
          databaseId,
          videoCollectionId,
          [Query.equal('users', userId)] // order by desc
      )
      return posts.documents
  }
  catch (error) {
      throw new Error(error);
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');
    return session
  } catch (error) {
    throw new Error(error)
  }
}

export const getFilePreview = async(fileId, type) => {
  let fileUrl;
  console.log('fileId in getFilePreview: ' + fileId)
  try {
    if (type == 'video') {
       fileUrl = storage.getFileView(storageId, fileId);
       console.log('video fileUrl: ' + fileUrl)
    }
    else if (type == 'image')
    {
      fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
      console.log('image fileUrl: ' + fileUrl)
    }
    else
    {
      throw new Error('Invalid file type: ' +  type)
    }
    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

export const uploadFile = async (file, type) => {
  if (!file) return;

  // const { mimeType, ...rest} = file;
  // const asset = { type: mimeType, ...rest};
  console.log('File: ' + file.fileName);
  const asset = {
    name: file.fileName,
    size: file.fileSize,
    uri: file.uri,
    type: file.mimeType
  }

  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), asset);
    console.log('uploadedFile: ' + uploadedFile.name);

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    console.log('fileUrl: ' + fileUrl)
    return fileUrl; 
  } catch (error) {
    throw new Error(error)
  }
}

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video')
    ])
    console.log('thumbnailUrl: ' + thumbnailUrl)
    console.log('videoUrl: ' + videoUrl)

  const newPost = await databases.createDocument(databaseId, videoCollectionId, ID.unique(), 
  {
    title: form.title,
    thumbnail: thumbnailUrl,
    video: videoUrl,
    prompt: form.prompt,
    users: form.userId
  })

  console.log('newPost: ' + newPost.title)

  return newPost
  } catch (error) {
    throw new Error(error)
  }
}