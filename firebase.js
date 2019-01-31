	
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
          }else{
			  GetAll();
		  }
		  
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]
		  global_user = null;
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
        } else {
          alert(errorMessage);
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
	
	
	function GetAll() {


	var myObj = new Object();

	routeRef2.once("value")
	  .then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			//if(childData.CreatedBy == global_user.uid ) {
			  //alert(JSON.stringify(childData));

				var pos1lat = childData.lat;
				var pos1lng = childData.lng;
				
				params = childData;
				
				var gridLine = {
							  RequestID:"",
							  RequestDate:"",
							  Category:"",
							  SubCategory:"",
							  Address:"",
							  Status:""
							};
							
				if (childData["RequestID"] === undefined){
					gridLine["RequestID"] = '';}
				else{
					gridLine["RequestID"] = childData["Category"];}
					
				if (childData["RequestDate"] === undefined){
					gridLine["RequestDate"] = '';}
				else{
					var date_txt = childData["RequestDate"];//12/01/2019
					/*var yyyy = date_txt.substring(5, 10);
					var mm = date_txt.substring(3, 5);
					var dd = date_txt.substring(0, 2);
					var date = new Date(dd, mm, yyyy);*/
					
					gridLine["RequestDate"] = date_txt;
				}
				
				if (childData["Category"] === undefined){ gridLine["Category"] = '';}
				else{ gridLine["Category"] = childData["Category"]; }
				
				if (childData["SubCategory"] === undefined){ gridLine["SubCategory"] = '';}
				else{ gridLine["SubCategory"] = childData["SubCategory"]; }
				
				data_t.push( gridLine);
			 
			//}

	  });
	  window.gridData = data_t;
	  $(function () {
            $("#Grid").ejGrid({
                // the datasource "window.gridData" is referred from jsondata.min.js
                dataSource: window.gridData,
                allowPaging: true,  
			//allowSorting: true,
			isResponsive: true,
			//allowFiltering: true,
			//filterSettings: {
			//    filterType: "menu"
			//},
			allowResizeToFit: true,
			//toolbarSettings: {
			//	showToolbar: true,
			//	toolbarItems: ["add","edit", "update", "cancel"],
			//},
			//editSettings: {
			//	allowEditing: true, allowAdding: true, allowDeleting: true, editMode: "dialog"
			//},				
                columns: [
                        { field: "RequestID", isPrimaryKey: true, headerText: "Request ID", textAlign: ej.TextAlign.Right, validationRules: { required: true, number: true }, width: 50 },
                        { field: "RequestDate", headerText: 'RequestDate', format: "{0:dd/MM/yyyy}", validationRules: { required: true, minlength: 3 }, width: 90 },
                        { field: "Category", headerText: 'Category', editType: ej.Grid.EditingType.Dropdown, textAlign: ej.TextAlign.Right, width: 80 },
                        { field: "SubCategory", headerText: 'SubCategory', textAlign: ej.TextAlign.Right, width: 80 },
                        { field: "Address", headerText: 'Address', width: 150 },
                        { field: "Status", headerText: 'Status', editType: ej.Grid.EditingType.Dropdown, width: 90 }
                ]
            });
        });
	});

}




