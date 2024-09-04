// import { Auth } from 'aws-amplify';
// import { Auth } from '@aws-amplify/auth';
import { signUp } from 'aws-amplify/auth';


export async function signup( first_name, last_name, password, email){
 console.log("merge");
  try {
    const { user } = await signUp({
        email,
      password,
      attributes: {
        email, // optional
        first_name,  // optional - E.164 number convention
        last_name
        // other custom attributes
      },
      autoSignIn: {
        // optional - enables auto sign in after user is confirmed
        enabled: true
      }
    });

    console.log(username);
  } 
  catch (error) {
    console.log('error signing up:', error);
  }
}