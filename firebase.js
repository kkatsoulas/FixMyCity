	
	// Initialize Firebase
	var config = {
	apiKey: "AIzaSyConz2-f4oLKr09_VklR009osOYOdW7Huk",
	authDomain: "photomap-de5ad.firebaseapp.com",
	databaseURL: "https://photomap-de5ad.firebaseio.com",
	projectId: "photomap-de5ad",
	storageBucket: "photomap-de5ad.appspot.com",
	messagingSenderId: "198881779510"
	};


	const app = firebase.initializeApp(config);
	
	var routeName = "route";
	var PostsRootName = "Posts";
	var dbObjRef = firebase.database().ref(); // Cloud DB reference
	var routeRef = firebase.database().ref().child("route");
	var routeRef2 = firebase.database().ref().child(PostsRootName);
	var global_user;
	
	var params;

	var data_t = [];
	  
	/*$( document ).ready(function() {
	//$("#welcome").hide();
	//$(".upload-group").hide();
	const database = firebase.database();
	
	//document.getElementById("upload").addEventListener('change', handleFileSelect, false);
	});*/
	
	 //window.onload = function() {
     // initApp();
    //};

	function handleFileSelect(event) {
		$(".upload-group").show();
		selectedFile = event.target.files[0];
	};

    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    function initApp() {
      // Listening for auth state changes.
      // [START authstatelistener]
      //$("#quickstart-account-details").hide();
	  
		//firebase.database.enableLogging(true);

		//firebase.auth.Auth.Persistence.LOCAL;
	  
	  app.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
	
	  app.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
	  app.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        //document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
		  global_user = user;
		  window.user = user;
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE]
          //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in as ' + email;
          document.getElementById('quickstart-sign-in').textContent = 'Signed in as ' + email;
          //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
          if (!emailVerified) {
            //document.getElementById('quickstart-verify-email').disabled = false;
			  displayTable('block');
          }else{
			  GetAll();
			  displayTable('allow');
		  }
		  
          // [END_EXCLUDE]
        }	 else {
          // User is signed out.
          // [START_EXCLUDE]
		  global_user = null;
		  displayTable('block');
          //document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
          //document.getElementById('quickstart-sign-in').textContent = 'Sign in';
          //document.getElementById('quickstart-account-details').textContent = 'null';
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        //document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
	  });
      // [END authstatelistener]
      //document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
      //document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
      //document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
      //document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
    }
	
    /**
     * Handles the sign in button press.
     */
    function toggleSignIn() {
      if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
      } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        
        // [END authwithemail]
		
	  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
	  .then(function() {
		// Existing and future Auth states are now persisted in the current
		// session only. Closing the window would clear any existing state even
		// if a user forgets to sign out.
		// ...
		// New sign-in will be persisted with session persistence.
		return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });
      }
	  )
	  }
      document.getElementById('quickstart-sign-in').disabled = true;
    }
    /**
     * Handles the sign up button press.
     */
    function handleSignUp() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START createwithemail]
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } elseif(errorMessage != null){
          alert(errorMessage);
        } else{
			sendEmailVerification();
		}
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END createwithemail]
    }
    /**
     * Sends an email verification to the user.
     */
    function sendEmailVerification() {
      // [START sendemailverification]
      firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
      });
      // [END sendemailverification]
    }
    function sendPasswordReset() {
      var email = document.getElementById('email').value;
      // [START sendpasswordemail]
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END sendpasswordemail];
    }
	
	


  function displayTable(y){
	var x = document.getElementById("myTable");
	if( y == 'block'){
		x.style.display = "block";
		x.style.visibility = "hidden";
		}else{x.style.display = "";
		x.style.visibility = "none";}
	//if (x.style.display === "none") {} 
  }



