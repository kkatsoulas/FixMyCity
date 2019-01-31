

// Initialize Firebase
	var config = {
	apiKey: "AIzaSyCtpxz0FKuEy6uD3n5S6W0HHKRqUrWZF80",
	authDomain: "photomap-1539897361984.firebaseapp.com",
	databaseURL: "https://photomap-1539897361984.firebaseio.com/",
	projectId: "photomap-1539897361984",
	storageBucket: "photomap-1539897361984.appspot.com",
	messagingSenderId: "1085984212904"
	};

const app = firebase.initializeApp(config);
const database = firebase.database();

var dbObjRef = firebase.database().ref(); // Cloud DB reference
var routeName = "Posts";
var routeRef = firebase.database().ref().child(routeName);

var params;

var data_t = [];

GetAll();

function GetAll() {


	var myObj = new Object();

	routeRef.once("value")
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
					var date_txt = childData["RequestDate"];
					var yyyy = date_txt.substring(5, 10);
					var mm = date_txt.substring(3, 5);
					var dd = date_txt.substring(0, 2);
					var date = new Date(dd, mm, yyyy);
					
					gridLine["RequestDate"] = date
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
                        { field: "RequestDate", headerText: 'RequestDate', validationRules: { required: true, minlength: 3 }, width: 90 },
                        { field: "Category", headerText: 'Category', editType: ej.Grid.EditingType.Dropdown, textAlign: ej.TextAlign.Right, width: 80 },
                        { field: "SubCategory", headerText: 'SubCategory', textAlign: ej.TextAlign.Right, width: 80 },
                        { field: "Address", headerText: 'Address', width: 150 },
                        { field: "Status", headerText: 'Status', editType: ej.Grid.EditingType.Dropdown, width: 90 }
                ]
            });
        });
	});

}



/*
window.gridData=[
{RequestID:10248,RequestDate:new Date(8364186e5),Category:"ΦΩΤΙΣΜΟΣ",SubCategory:"Καμμένος Λαμπτήρας",Address:"59 rue de l'Abbaye",Status:"Επιλύθηκε"},
{RequestID:10249,RequestDate:new Date(836505e6),Category:"ΔΡΟΜΟΙ",SubCategory:"Λακκούβα",Address:"Luisenstr. 48",Status:"Σε αναμονή"},
{RequestID:10250,RequestDate:new Date(8367642e5),Category:"ΠΑΙΔΙΚΕΣ ΧΑΡΕΣ",SubCategory:"Ελλειπής Φωτισμός",Address:"Rua do PaÃ§o, 67",Status:"Σε αναμονή"},
{RequestID:10251,RequestDate:new Date(8367642e5),Category:"ΠΕΖΟΔΡΟΜΙΑ",SubCategory:"Ολισθηρό Έδαφος",Address:"2, rue du Commerce",Status:"Υποβλήθηκε"}]
*/

