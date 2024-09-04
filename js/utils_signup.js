import { signOut } from 'aws-amplify/auth';
import { signUp } from 'aws-amplify/auth';
import { confirmSignUp } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { signIn } from 'aws-amplify/auth';
 
import { getCurrentUser } from 'aws-amplify/auth';

  
console.log("Amplify needs to be  configured")
 
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: '45s8ejltunhfm9q7das7famvgm', 
      userPoolId: 'eu-north-1_dUZyXlXvS',
    
    }
  }
});
console.log("Amplify was  configured")
 

export async function getUserAuthOld() {
    try {
        // Verifică dacă există un utilizator autentificat
        
        const {
          username,
          signInDetails
        } =  await  getCurrentUser();
        console.log('User is authenticated**:',username, signInDetails);
        return {
          username,
          signInDetails
        }
        // Afișează butonul de "Log Out" dacă utilizatorul este autentificat
 
         
    } 
    catch (error) {
            console.error('Error getting user authenticated:', error);
        } 

}
export async function getUserAuth() {
  try {
      const { username, signInDetails } = await getCurrentUser();
      console.log('User is authenticated**:', username, signInDetails);
      return { username, signInDetails };
  } catch (error) {
      if (error.name === 'UserUnAuthenticatedException') {
          console.log('User is not authenticated.');
          return null; // Return null if the user is not authenticated
      } else {
          console.error('Error getting user authenticated:', error);
          throw error; // Re-throw other unexpected errors
      }
  }
}

 

export async function signOutHandler() {

    // check if is user is log in  getUserAuth() 
    const result = await getUserAuth();

    console.log(result);
    if (result){
        try {
            await signOut();
            console.log('Sign out successful');
            window.location.href = 'index.html'; 
        } catch (error) {
            console.error('Error signing out:', error);
        }

    }else{
        console.log('User not authenticated');
    }
  
}



export async function handleSignUp({ username, password, email }) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
         
        },
        
        autoSignIn: true 
      }
    });

    console.log(userId);
  } catch (error) {
    console.log('error signing up ***:', error);
  }
}




// const handleConfirmSignUp = async ({
//   username,
//   confirmationCode
// })=> {
//   const {
//     isSignUpComplete,
//     userId,
//     nextStep
//   } = await confirmSignUp({
//     username,
//     confirmationCode
//   });
// }


export async function handleConfirmSignUp({ username, confirmationCode }){
  const {
    isSignUpComplete,
    userId,
    nextStep
  } = await confirmSignUp({
    username,
    confirmationCode
  });
  return { isSignUpComplete, userId, nextStep };


}



export async function handleLogIn({ username, password, email }) {

 
  const result = await getUserAuth();
  console.log("!!!!", result, result?.signInDetails, result?.signInDetails.loginId == username);

  if (result && result?.signInDetails.loginId==username){
    console.log("!!!! Same user logged in")
    
    return result
  }
  else if (result && result?.signInDetails.loginId!=username){
    const result = await signOutHandler();
    console.log('logging out previous user',result)
  }
  else{
    try {
        console.log(username)
         
     
        const {
          isSignedIn,
          nextStep
        } = await signIn({ username, password });
        console.log("User ID:", nextStep,isSignedIn);
        return {  isSignedIn,
          nextStep}
    
        
      } catch (error) {
        console.log('****Error login:', error);
      }

  }
  

}