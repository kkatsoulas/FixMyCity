function checkURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

var map = null;
var routes = [];
var points = [];
var surfaces = [];
var point_groups = [];
var ajax_data = null;
var marker;
var address = '';
var markersDB = [];

var categs = [];
var subcategs = [];

var categs2 = [];
var subcategs2 = [];

categs2.push({"id": 119, "text": "ΦΩΤΙΣΜΟΣ" });
categs2.push({"id": 126, "text": "ΠΡΑΣΙΝΟΙ ΚΑΔΟΙ" });
categs2.push({"id": 131, "text": "ΜΠΛΕ ΚΑΔΟΙ"});
categs2.push({"id": 136, "text": "ΠΡΑΣΙΝΟ"});
categs2.push({"id": 144, "text": "ΔΡΟΜΟΙ"});
categs2.push({"id": 149, "text": "ΣΗΜΑΝΣΗ"});
categs2.push({"id": 155, "text": "ΠΕΖΟΔΡΟΜΙΑ"});
categs2.push({"id": 160, "text": "ΦΡΕΑΤΙΑ"});
categs2.push({"id": 165, "text": "ΣΧΟΛΕΙΑ"});
categs2.push({"id": 172, "text": "ΠΛΑΤΕΙΕΣ"});
categs2.push({"id": 179, "text": "ΠΑΙΔΙΚΕΣ ΧΑΡΕΣ"});
categs2.push({"id": 185, "text": "ΜΑΡΙΝΕΣ"});


subcategs2.push({"cat": 119, "id": 120 , "text": "Καμμένος Λαμπτήρας" });
subcategs2.push({"cat": 119, "id": 121 , "text": "Σπασμένο Φωτιστικό" });
subcategs2.push({"cat": 119, "id": 122 , "text": "Σπασμένος Βραχίωνας" });
subcategs2.push({"cat": 119, "id": 123 , "text": "Επικίνδυνη Κολώνα" });
subcategs2.push({"cat": 119, "id": 124 , "text": "Ανεπαρκής Φωτισμός" });
subcategs2.push({"cat": 119, "id": 125 , "text": "Άλλο" });

subcategs2.push({"cat": 126, "id": 127 , "text": "Χαλασμένος Πράσινος Κάδος" });
subcategs2.push({"cat": 126, "id": 128 , "text": "Γεμάτος Πράσινος Κάδος" });
subcategs2.push({"cat": 126, "id": 129 , "text": "Έλλειψη Πράσινου Κάδου" });
subcategs2.push({"cat": 126, "id": 130 , "text": "Άλλο" });

subcategs2.push({"cat": 131, "id": 132 , "text": "Χαλασμένος Μπλε Κάδος" });
subcategs2.push({"cat": 131, "id": 133 , "text": "Γεμάτος Μπλε Κάδος" });
subcategs2.push({"cat": 131, "id": 134 , "text": "Έλλειψη Μπλε Κάδου" });
subcategs2.push({"cat": 131, "id": 135 , "text": "Άλλο" });

subcategs2.push({"cat": 136, "id": 137 , "text": "Κομμένο Δέντρο" });
subcategs2.push({"cat": 136, "id": 138 , "text": "Επικίνδυνο Δέντρο" });
subcategs2.push({"cat": 136, "id": 139 , "text": "Κατεστραμμένος Χλοοτάπητας" });
subcategs2.push({"cat": 136, "id": 140 , "text": "Κατεστραμμένα Άνθη" });
subcategs2.push({"cat": 136, "id": 141 , "text": "Ανάγκη Κλαδέματος" });
subcategs2.push({"cat": 136, "id": 142 , "text": "Ανάγκη Ψεκασμού" });
subcategs2.push({"cat": 136, "id": 143 , "text": "Άλλο" });

subcategs2.push({"cat": 144, "id": 145 , "text": "Λακκούβα" });
subcategs2.push({"cat": 144, "id": 146 , "text": "Ολισθηρό Έδαφος" });
subcategs2.push({"cat": 144, "id": 147 ,"text":  "Αντικείμενο που Εμποδίζει" });
subcategs2.push({"cat": 144, "id": 148 , "text": "Άλλο" });

subcategs2.push({"cat": 149, "id": 150 , "text": "Σπασμένη Πινακίδα" });
subcategs2.push({"cat": 149, "id": 151 , "text": "Φθαρμένη Πινακίδα" });
subcategs2.push({"cat": 149, "id": 152 , "text": "Μη Ευδιάκριτη Πινακίδα" });
subcategs2.push({"cat": 149, "id": 153 , "text": "Έλλειψη Πινακίδας" });
subcategs2.push({"cat": 149, "id": 154 , "text": "Άλλο" });

subcategs2.push({"cat": 155, "id": 156 , "text": "Ολισθηρό Έδαφος" });
subcategs2.push({"cat": 155, "id": 157 , "text": "Σπασμένες Πλάκες" });
subcategs2.push({"cat": 155, "id": 158 , "text": "Αντικείμενο που Εμποδίζει" });
subcategs2.push({"cat": 155, "id": 159 , "text": "Άλλο" });

subcategs2.push({"cat": 160, "id": 161 , "text": "Σπασμένο Φρεάτιο" });
subcategs2.push({"cat": 160, "id": 162 , "text": "Βουλωμένο Φρεάτιο" });
subcategs2.push({"cat": 160, "id": 163 , "text": "Φρεάτιο με Οσμές" });
subcategs2.push({"cat": 160, "id": 164 , "text": "Άλλο" });

subcategs2.push({"cat": 165, "id": 166 , "text": "Κατεστραμμένα Κάγκελα" });
subcategs2.push({"cat": 165, "id": 167 , "text": "Σπασμένο Τζάμι" });
subcategs2.push({"cat": 165, "id": 168 , "text": "Ελλειπής Φωτισμός" });
subcategs2.push({"cat": 165, "id": 169 , "text": "Ακατάλληλος Προαύλιος Χώρος" });
subcategs2.push({"cat": 165, "id": 170 , "text": "Άλλο" });

subcategs2.push({"cat": 172, "id": 171 , "text": "Υδραυλικά" });
subcategs2.push({"cat": 172, "id": 173 , "text": "Σπασμένο Παγκάκι" });
subcategs2.push({"cat": 172, "id": 174 , "text": "Κατεστραμμένο Κάγκελο" });
subcategs2.push({"cat": 172, "id": 175 , "text": "Φθαρμένο Έδαφος" });
subcategs2.push({"cat": 172, "id": 176 , "text": "Ελλειπής Φωτισμός" });
subcategs2.push({"cat": 172, "id": 177 , "text": "Άλλο" });

subcategs2.push({"cat": 179, "id": 178 , "text": "Σπασμένο Όργανο Γυμναστικής" });
subcategs2.push({"cat": 179, "id": 180 , "text": "Σπασμένο Όργανο" });
subcategs2.push({"cat": 179, "id": 181 , "text": "Κατεστραμμένη Περίφραξη" });
subcategs2.push({"cat": 179, "id": 182 , "text": "Φθαρμένο Έδαφος" });
subcategs2.push({"cat": 179, "id": 183 , "text": "Ελλειπής Φωτισμός" });
subcategs2.push({"cat": 179, "id": 184 , "text": "Άλλο" });

subcategs2.push({"cat": 185, "id": 186 , "text": "Φθαρμένα Σημεία Πρόσδεσης" });
subcategs2.push({"cat": 185, "id": 187 , "text": "Έλλειψη Νερού" });
subcategs2.push({"cat": 185, "id": 188 , "text": "Έλλειψη Ηλεκτρικού Ρεύματος" });
subcategs2.push({"cat": 185, "id": 189 , "text": "Άλλο" });


function initAutocomplete() {
            
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });
        searchBox.addListener('places_changed', function() {
            places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                        
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                    

            // Create a marker for each place.
                
                placeMarker(place.geometry.location)
                    
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

function open_modal(data, address) {
    var content = "";
    content += "<table class='table table-responsive table-hover'>";
    content += "<tbody>";
    content += "<tr><th>Διεύθυνση</th><td>" + address + "</td></tr>";
    if (typeof data !== 'undefined') {
        $.each(data, function (index, d) {
            if (d.type === 'text_box') {
                content += "<tr><th>" + d.name + "</th><td>" + d.data + "</td></tr>";
            }
            if (d.type === 'text') {
                content += "<tr><th>" + d.name + "</th><td>" + d.data + "</td></tr>";
            }
            if (d.type === 'files') {
                content += "<tr><th>" + d.name + "</th><td>";
                if (d.data.length == 1 && checkURL(d.data[0].path)) {
                    content += "<img src='" + d.data[0].path + "' width='80%'>";
                }
                $.each(d.data, function (i, f) {

                    if (typeof f.original === "undefined") {
                        content += "<a class='btn-xs btn btn-primary' download  href='" + f.path + "' target='_blank' style='white-space: normal;'>Μεταφόρτωση " + f.pID + "</a> ";
                    }
                    else {
                        content += "<a class='btn-xs btn btn-primary' download  href='" + f.path + "' target='_blank' style='white-space: normal;'>" + f.original + "</a> ";
                    }
                });
                content += "</td></tr>";
            }
        });
    }
    content += "</tbody>";
    content += "</table>";
    $('#modal_content').html(content);

    $('#myModal').modal('show');
}


function signin (data, address){
	var content = "";
    content += "<table class='table table-responsive table-hover'>";
    content += "<tbody>";
    content += "<tr><th>Διεύθυνση</th><td>" + address + "</td></tr>";
    if (typeof data !== 'undefined') {
        $.each(data, function (index, d) {
            if (d.type === 'text_box') {
                content += "<tr><th>" + d.name + "</th><td>" + d.data + "</td></tr>";
            }
            if (d.type === 'text') {
                content += "<tr><th>" + d.name + "</th><td>" + d.data + "</td></tr>";
            }
            if (d.type === 'files') {
                content += "<tr><th>" + d.name + "</th><td>";
                if (d.data.length == 1 && checkURL(d.data[0].path)) {
                    content += "<img src='" + d.data[0].path + "' width='80%'>";
                }
                $.each(d.data, function (i, f) {

                    if (typeof f.original === "undefined") {
                        content += "<a class='btn-xs btn btn-primary' download  href='" + f.path + "' target='_blank' style='white-space: normal;'>Μεταφόρτωση " + f.pID + "</a> ";
                    }
                    else {
                        content += "<a class='btn-xs btn btn-primary' download  href='" + f.path + "' target='_blank' style='white-space: normal;'>" + f.original + "</a> ";
                    }
                });
                content += "</td></tr>";
            }
        });
    }
    content += "</tbody>";
    content += "</table>";
    $('#modal_content').html(content);

    $('#myModal').modal('show');
}



function open_modal_group(files, title, info) {
    var content = "";
    content += "<table class='table table-responsive table-hover'>";
    content += "<tbody>";
    content += "<tr><th>Ονομασία</th><td>" + title + "</td></tr>";
    content += "<tr><th>Περιγραφή</th><td>" + info + "</td></tr>";
    content += "<tr><th>Αρχεία</th><td>";
    if (files.length == 1 && checkURL(files[0].path)) {
        content += "<img src='" + files[0].path + "' width='80%'>";
    }
    $.each(files, function (i, f) {
        if (typeof f.original === "undefined") {
            content += "<a class='btn-xs btn btn-primary' download  href='" + f.path + "' target='_blank' style='white-space: normal;'>Μεταφόρτωση " + f.pID + "</a> ";
        }
        else {
            content += "<a class='btn-xs btn btn-primary' download  href='" + f.path + "' target='_blank' style='white-space: normal;'>" + f.original + "</a> ";
        }
    });
    content += "</td></tr>";
    content += "</tbody>";
    content += "</table>";
    $('#modal_content').html(content);

    $('#myModal').modal('show');
}

function _initMap()
{
    map = new google.maps.Map(document.getElementById('stoixeia-katagrafis-map'), {
        center: { lat: 38.042953961480585, lng: 23.773469924926758 },
        zoom: 10,
        mapTypeId: 'terrain'
        
    });



	
	//kkats
	
	var resize_map = function () {
                $('#map-container').css('height', '500px');
                $("#stoixeia-katagrafis-map").css("height", "550px");
                $("#stoixeia-katagrafis-map").css("width", "100%");
            }
	resize_map();
	window.removeEventListener("resize", resize_map);
	window.addEventListener("resize", resize_map);
	
	google.maps.event.addListener( map, 'click', function (event) {
		placeMarker(event.latLng);
	});
	

	initAutocomplete();
	
    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        $('body').trigger('myMapsLoaded');
    });
}


function initMap() {
    var resize_map = function () {
        $('#mapContainer').css('height', '550px');
        $("#stoixeia-katagrafis-map").css("height", "550px");
        $("#stoixeia-katagrafis-map").css("width", "100%");
    }
	var subcategs_itm;
    resize_map();
	var html_input = "";
	var html_selects = "";
	for(var i=0;i<categs2.length;i++){
		subcategs_itm = { 'id': categs2[i].id,
						  'text': categs2[i].text };
			categs.push(subcategs_itm);
		html_input += "     <option value='" + categs2[i].id + "'>" + categs2[i].text + "</option>";
		html_selects += "   <div class='form-group subcategory_div' id='subcategory_div" + categs2[i].id + "'>";
		html_selects += "       <label class=''>*Υποκατηγορία</label>";
		html_selects += "       <select id='subcategory" + categs2[i].id + "' class='form-control'>";
		html_selects += "           <option value=''></option>";
		for(var j=0;j<subcategs2.length;j++){
			if (subcategs2[j].cat == categs2[i].id){
				subcategs_itm = { 'id': subcategs2[j].id,
				'text': subcategs2[j].text };
				subcategs.push(subcategs_itm);
				html_selects += "       <option value='" + subcategs2[j].id + "'>" + subcategs2[j].text + "</option>";
		
			}
		}
		html_selects += "       </select>";
		html_selects += "   </div>";
	}
	/*$.each(response.data, function (index, option) {
		$.each(option.eidi, function (index2, eidos) {
			});
		
	});*/
	$('#fmc_category').html(html_input);
	$('#subcategories').html(html_selects);
	$('.subcategory_div').hide();
	$('#fmc_category').change(function () {
		$('.subcategory_div').hide();
		$('#subcategory_div' + $(this).val()).show();
	});
	$('#fmc_category').change();
	$('.submit-container input').attr('disabled', 'disabled');
	$('.submit-container select').attr('disabled', 'disabled');
	$('.submit-container button').attr('disabled', 'disabled');
		
		google.maps.event.addListener(map, 'click', function (event) {
			placeMarker(event.latLng);
		});
		
};


function placeMarker(location) {
    var icon = {
        url: "/img/mine.png", // url
        scaledSize: new google.maps.Size(25, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(12.5, 29) // anchor
    };
    var in_municipality = false;
    /*$.each(surfaces, function (i, surface) {
        if (google.maps.geometry.poly.containsLocation(location, surface)) {
            in_municipality = true;
        }
    });*/
	var in_municipality = true;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        latLng: location,
        language: 'gr'
    }, function (responses) {
        if (responses && responses.length > 0) {
            address = responses[0].formatted_address;
            if (firebase.auth().currentUser) {
                $('#address_container').removeClass('alert-danger').addClass('alert-success');
                $('#address_container').html(address);
                $('#address_container').show();
            }
            else {
                $('#address_container').removeClass('alert-success').addClass('alert-danger');
                $('#address_container').html(address + "<hr />" + "<b>Πρέπει να συνδεθείται</b>");
                $('#address_container').show();
            }
        } else {
            address = 'Απροσδιόριστη Διεύθυνση';
        }
    });
    if (marker == null) {
        marker = new google.maps.Marker({
            position: location,
            draggable: true,
            //icon: icon,
            map: map
        });
        google.maps.event.addListener(marker, 'dragend', function (event) {
            placeMarker(marker.getPosition());
        });
    } else { marker.setPosition(location); }
    if (in_municipality && firebase.auth().currentUser)  {
        $('.submit-container input').attr('disabled', null);
        $('.submit-container select').attr('disabled', null);
        $('.submit-container button').attr('disabled', null);
    }
    else {
        $('.img_uploaded').hide();
        $('.submit-container input').attr('disabled', 'disabled');
        $('.submit-container select').attr('disabled', 'disabled');
        $('.submit-container button').attr('disabled', 'disabled');
    }
    
}




function placeDbMarker(location) {
    var markerDB = null;
	var icon = {
        url: "/img/mine.png", // url
        scaledSize: new google.maps.Size(25, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(12.5, 29) // anchor
    };
    var in_municipality = false;
    /*$.each(surfaces, function (i, surface) {
        if (google.maps.geometry.poly.containsLocation(location, surface)) {
            in_municipality = true;
        }
    });*/
	var in_municipality = true;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        latLng: location,
        language: 'gr'
    }, function (responses) {
        if (responses && responses.length > 0) {
            address = responses[0].formatted_address;
            if (firebase.auth().currentUser) {
                $('#address_container').removeClass('alert-danger').addClass('alert-success');
                $('#address_container').html(address);
                $('#address_container').show();
            }
            else {
                $('#address_container').removeClass('alert-success').addClass('alert-danger');
                $('#address_container').html(address + "<hr />" + "<b>Πρέπει να συνδεθείται</b>");
                $('#address_container').show();
            }
        } else {
            address = 'Απροσδιόριστη Διεύθυνση';
        }
    });
    if (markerDB == null) {
        markerDB = new google.maps.Marker({
            position: location,
            draggable: false,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            map: map
        });
        google.maps.event.addListener(markerDB, 'dragend', function (event) {
            placeMarker(markerDB.getPosition());
        });
		markersDB.push(markerDB);
		
    } else { markerDB.setPosition(location); }
    if (in_municipality && firebase.auth().currentUser)  {
        $('.submit-container input').attr('disabled', null);
        $('.submit-container select').attr('disabled', null);
        $('.submit-container button').attr('disabled', null);
    }
    else {
        $('.img_uploaded').hide();
        $('.submit-container input').attr('disabled', 'disabled');
        $('.submit-container select').attr('disabled', 'disabled');
        $('.submit-container button').attr('disabled', 'disabled');
    }
    
}
$(document).ready(function () {
    $('.img_uploaded').hide();
    $('#address_container').hide();
    $('.submit-container input').attr('disabled', 'disabled');
    $('.submit-container select').attr('disabled', 'disabled');
    $('.submit-container button').attr('disabled', 'disabled');
    $('#success-message').hide();
    $('#error-message').hide();
    $('#modal-body2').hide();
	const database = firebase.database();
	initApp();
});
function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.img_uploaded').attr('src', e.target.result);
            $('.img_uploaded').show();
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#file_input").change(function () {
    readURL(this);
});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function checkPhone(phone) {
    var re = /^[0-9]{10}$/;
    return re.test(phone);
}
function fmc_submit(btn) {
    var formData = new FormData();
    if (!$('#fmc_category').val() || !$('#subcategory' + $('#fmc_category').val()).val()
        || !$('#fmc_name').val() || !$('#fmc_surname').val() || !$('#fmc_email').val()
        || !$('#fmc_phone').val()) {
        $('#error-message').html('Συμπληρώστε όλα τα απαραίτητα πεδία');
        $('#error-message').slideDown(500).delay(2500).slideUp(500);
        return false;
    }
    if (!validateEmail($('#fmc_email').val())) {
        $('#error-message').html('Το e-mail δεν είναι έγκυρο');
        $('#error-message').slideDown(500).delay(2500).slideUp(500);
        return false;
    }
    if (!checkPhone($('#fmc_phone').val())) {
        $('#error-message').html('Το τηλέφωνο δεν είναι έγκυρο');
        $('#error-message').slideDown(500).delay(2500).slideUp(500);
        return false;
    }

    $this = $(btn);
    $this.attr("disabled", "disabled");
	
	confirmUpload();

}

function signin_submit(btn) {
	
	var user = firebase.auth().currentUser;

        var email = $('#Sign_email').val();
		var password = document.getElementById('Sign_password').value;
		//var password = $('Sign_password').val();
        if (!validateEmail(email)) {
          alert('Please enter a correct email address.');
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
		})
	  
      //document.getElementById('quickstart-sign-in').disabled = true;
	  document.getElementById('quickstart-sign-in').textContent = 'Signed in as: ' + email;
	  hideModal();
	  $('#myModal2').modal('hide')
	  $('body').removeClass('modal-open');
	  $('.modal-backdrop').remove();
}	


function signup_submit(btn) {
	  var email = document.getElementById('Sign_email').value;
      var password = document.getElementById('Sign_password').value;
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
	  hideModal();
}

function signout_submit(btn) {
	if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
		document.getElementById('quickstart-sign-in').textContent = 'Sign in';
		alert('sign out.');
        // [END signout]
	} else {
	}

}

function submit(btn) {
    var formData = new FormData();
    if (!$('#fmc_category').val() || !$('#subcategory' + $('#fmc_category').val()).val()
        || !$('#fmc_name').val() || !$('#fmc_surname').val() || !$('#fmc_email').val()
        || !$('#fmc_phone').val()) {
        $('#error-message').html('Συμπληρώστε όλα τα απαραίτητα πεδία');
        $('#error-message').slideDown(500).delay(2500).slideUp(500);
        return false;
    }
    if (!validateEmail($('#fmc_email').val())) {
        $('#error-message').html('Το e-mail δεν είναι έγκυρο');
        $('#error-message').slideDown(500).delay(2500).slideUp(500);
        return false;
    }
    if (!checkPhone($('#fmc_phone').val())) {
        $('#error-message').html('Το τηλέφωνο δεν είναι έγκυρο');
        $('#error-message').slideDown(500).delay(2500).slideUp(500);
        return false;
    }
    var addr = address;
    formData.append("op", "add");
    formData.append('item', 'fmc-user-report');
    formData.append("typos", $('#fmc_category').val());
    formData.append("eidos", $('#subcategory' + $('#fmc_category').val()).val());
    formData.append("onoma", $('#fmc_name').val());
    formData.append("eponimo", $('#fmc_surname').val());
    formData.append("email", $('#fmc_email').val());
    formData.append("addr", addr);
    formData.append("tel", $('#fmc_phone').val());
    formData.append("minima", $('#fmc_comment').val());
    formData.append('lat', marker.getPosition().lat());
    formData.append('lng', marker.getPosition().lng());
    var files = $("#file_input").get(0).files;

    for (var i = 0; i < $("#file_input").get(0).files.length; i++) {
        formData.append('user_report_image', files[i]);
    }
    $this = $(btn);
    $this.attr("disabled", "disabled");

    getAjaxFormData(
        formData
        , function (response) {

            $this.attr("disabled", null);

            if (response.statustext == "error") {
                show_error(response.data);
                return false;
            } else {
                show_success(response.data.pID);
                return false;
            }
        }, api_url);
}

function show_error(text) {
    $('#error-message').html(text);
    $('#error-message').slideDown(500).delay(2500).slideUp(500);
}

function hideModal() {
    $('#modal-body2').hide(0, function () {
        $('#modal-body1').show(0);

        $('#submit_btn').show();
    });
}
function show_success(req_num) {
    $('#submit_btn').hide();
    $('#modal-body2').html("<div class='alert alert-success'>Η αίτηση καταχωρήθηκε επιτυχως με αριθμό αίτησης <span style='font-weight: bold;'>" + req_num + "</span>.<br/>Δώστε τον αριθμό αίτησης στον πολίτη.</div>");
    $('#modal-body1').slideUp(500, function () {
        $('#modal-body2').slideDown(500);
    });
    $('#file_input').val('');
    $('#file_input').change();
    $('#subcategory' + $('#fmc_category').val()).val('');
    $('#fmc_category').val('');
    $('#fmc_name').val('');
    $('#fmc_surname').val('');
    $('#fmc_email').val('');
    $('#fmc_phone').val('');
    $('#fmc_comment').val('');
    $('.img_uploaded').attr('src', '');
    $('.img_uploaded').hide();
    $('.submit-container select').val('');
}





function confirmUpload() {
		var currentDt = new Date();
		var mm = currentDt.getMonth() + 1;
		var dd = currentDt.getDate();
		var yyyy = currentDt.getFullYear();
		var s = currentDt.getSeconds();
		var m = currentDt.getMinutes();
		var h = currentDt.getHours();
		const image_name = mm + '-' + dd + '-' + yyyy+"-"+h+"-"+m+"-"+s;
		var metadata = {
			contentType: 'image',
			customMetadata: {
				'uploadedBy': global_user.uid,
				'latitude': marker.getPosition().lat(),
				'longitude': marker.getPosition().lng()
			},
		};

		
		var files = $("#file_input").get(0).files;

		for (var i = 0; i < $("#file_input").get(0).files.length; i++) {
			const fileRef = firebase.storage().ref().child('mapImages/' + image_name);
			var uploadTask = fileRef.put(files[i], metadata);
			break;
		}
		
		
		// Register three observers:
		// 1. 'state_changed' observer, called any time the state changes
		// 2. Error observer, called on failure
		// 3. Completion observer, called on successful completion
		
		uploadTask.on('state_changed', function(snapshot){
			// Observe state change events such as progress, pause, and resume
			// See below for more detail
		}, function(error) {
			// Handle unsuccessful uploads
		}, function() {
		var downloadURL = uploadTask.snapshot.downloadURL;
		var Category_txt = '';
		var SubCategory_txt = '';
		var SelCateg = $('#fmc_category').val();
		var SelSubCateg = $('#subcategory' + $('#fmc_category').val()).val()
		uploadTask.snapshot.ref.getDownloadURL().then(function (URL) {
	   //getting the publication time
			var dayObj = new Date();
			var day = dayObj.getDate();
			
			for (var i = 0; i < categs.length; i++){
				
				//console.log(categs[i]["id"], " ", categs[i]["text"]);
				if (categs[i]["id"] == SelCateg ){
					Category_txt = categs[i]["text"];
					
					//exit;
				}
			}
			for (var i = 0; i < subcategs.length; i++){
				console.log('categs2.push({"id":', subcategs[i]["id"], ", ", subcategs[i]["text"], '});');
				
				if (subcategs[i]["id"] == SelSubCateg){
					SubCategory_txt = subcategs[i]["text"];
				}
			}
			alert($('#fmc_category').val());
			dbObjRef.child(PostsRootName).push({
			CreatedBy: global_user.uid,
			//Points: totalPoints[0],
			lat: marker.getPosition().lat(),
			lng: marker.getPosition().lng(),
			ImageURL: URL,
			Category: Category_txt,
			SubCategory: SubCategory_txt,
			Comment: $('#fmc_comment').val(),
			Status: 'ΚΑΤΑΧΩΡΗΘΗΚΕ'
			});

			console.log('User post successfully added to realtime database');
		});
		
		// Handle successful uploads on complete
		// For instance, get the download URL: https://firebasestorage.googleapis.com/...
		//$(".upload-group")[0].before("Success!");
		//$(".upload-group").hide();
		//ConvertMarkerPreview();

		});

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
				var MapMarkerPosObj = new google.maps.LatLng(pos1lat,pos1lng);
				params = childData;
				placeDbMarker(MapMarkerPosObj);
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
				
				if (childData["Address"] === undefined){ gridLine["Address"] = '';}
				else{ gridLine["Address"] = childData["Address"]; }
				
				if (childData["Status"] === undefined){ gridLine["Status"] = '';}
				else{ gridLine["Status"] = childData["Status"]; }
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