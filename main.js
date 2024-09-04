import './style.css'
 
import { Amplify } from 'aws-amplify';
 
 
console.log("Amplify needs to be  configured")
 
// Amplify.configure(amplifyconfig);
 
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: '45s8ejltunhfm9q7das7famvgm', 
      userPoolId: 'eu-north-1_dUZyXlXvS',
    
    }
  }
});

console.log("Amplify was configured")
 