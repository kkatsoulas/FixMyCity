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
        center: { lat: 38.1749073299669, lng: 20.5875115656067 },
        zoom: 10,
        mapTypeId: 'terrain'
        
    });

    $.ajax({
        method: 'post',
        url: api_url,
        data: { op: 'get', item: 'fmc-oria-dimou' },
        dataType: 'json',
        success: function (response) {
            var resize_map = function () {
                $('#map-container').css('height', '500px');
                $("#stoixeia-katagrafis-map").css("height", "550px");
                $("#stoixeia-katagrafis-map").css("width", "100%");
            }
            resize_map();
            window.removeEventListener("resize", resize_map);
            window.addEventListener("resize", resize_map);
            var center = false;
            
            var boundbox = new google.maps.LatLngBounds();
            if (response.status === 'success') {
                data = response.data;
                $.each(data, function (i, d) {
                    var markers = [];
                    $.each(d, function (ii, o) {
                        var m = new google.maps.LatLng(o.lat, o.lng);
                        markers[ii] = m;
                        boundbox.extend(m);
                    });
                    var surface = new google.maps.Polygon({
                        paths: markers,
                        geodesic: true,
                        fillColor: '#ef662f',
                        fillOpacity: 0.2,
                        strokeWeight: 2,
                        strokeColor: '#ef662f',
                        strokeOpacity: 0.4,

                    });
                    surface.setMap(map);
                    surfaces[i] = surface;
                    google.maps.event.addListener(surface, 'click', function (event) {

                        placeMarker(event.latLng);

                    });
                });
                map.fitBounds(boundbox);
                map.setCenter(boundbox.getCenter());
                initAutocomplete();
            }
        }
    });


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
    resize_map();
    getAjaxData({
            op: 'get',
            item: 'fmc-typoi-anaforas'
        }, function (response) {
            var html_input = "";
            var html_selects = "";
            $.each(response.data, function (index, option) {
                html_input += "     <option value='" + option.aID + "'>" + option.name + "</option>";
                html_selects += "   <div class='form-group subcategory_div' id='subcategory_div" + option.aID + "'>";
                html_selects += "       <label class=''>*Υποκατηγορία</label>";
                html_selects += "       <select id='subcategory" + option.aID + "' class='form-control'>";
                html_selects += "           <option value=''></option>";
                $.each(option.eidi, function (index2, eidos) {
                    html_selects += "       <option value='" + eidos.eID + "'>" + eidos.text + "</option>";
                });
                html_selects += "       </select>";
                html_selects += "   </div>";
            });
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
        }, api_url);
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
    $.each(surfaces, function (i, surface) {
        if (google.maps.geometry.poly.containsLocation(location, surface)) {
            in_municipality = true;
        }
    });
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        latLng: location,
        language: 'gr'
    }, function (responses) {
        if (responses && responses.length > 0) {
            address = responses[0].formatted_address;
            if (in_municipality) {
                $('#address_container').removeClass('alert-danger').addClass('alert-success');
                $('#address_container').html(address);
                $('#address_container').show();
            }
            else {
                $('#address_container').removeClass('alert-success').addClass('alert-danger');
                $('#address_container').html(address + "<hr />" + "<b>Πρέπει να επιλέξετε σημείο εντός των ορίων του δήμου</b>");
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
    if (in_municipality) {
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
