function pgm_call_ajax(url, data, handler_function, formdata){
    data.screenWidth = $(window).innerWidth();
    if(formdata){
        var _p = {
            url: url,
            data: data,
            type: 'POST',
            contentType: false,
            processData: false
        }
    }else{
        var _p = {
            url: url,
            data: data,
            type: 'POST'
        }
    }
	

    $.ajax(_p).done(function(response){
        
        //console.log(response)

      	var response = JSON.parse(response);
		
        if(response === false || typeof(response.status) == "undefined" || typeof(response.statustext) == "undefined" || typeof(response.data) == "undefined"){
            var response = {status:"error", data:"Η υπηρεσία διεκπεραίωσης αιτημάτων αναφέρει μη έγκυρα δεδομένα"};
        }else{
            if(response.statustext == "redirect"){
                _handle_response(response, handler_function);
                window.top.location = response.data;
                return false;
            }
        }

        _handle_response(response, handler_function);

	}).error(function(i, e){

        console.log(i);
        console.log(e);

        if(i.status == 404){
            var data = "Η υπηρεσία διεκπεραίωσης αιτημάτων δε βρέθηκε.";
        }else{
            var data = i.statusText;
        }

        var params = {status:"error", data:data};

        _handle_response(params, handler_function);
    });
}

function _handle_response(response, handler_function){
    if( typeof(handler_function) === "undefined" ){
        return false;
    }

    if (typeof(handler_function) === "function"){
        handler_function(response);
    }else{
        if(typeof(handler_function) == "string"){
            var fn = window[handler_function];
            if(typeof(fn) == "function"){
                fn(response);
            }else{
                alert("Unkown" + handler_function);
            }
        }else{
            alert("Unkown" + handler_function);
        }
    }
}


function getAjaxData(params, handler_function, target){
    

    pgm_call_ajax(target, params, handler_function, false);
}
function getAjaxFormData(params, handler_function, target){
    if( (typeof(target) == "undefined") || target === null){
        if(typeof(__base_folder !== "")){
            target = __base_folder+"/operations.php";
        }else{
            target = "/operations.php";
        }
    }

    pgm_call_ajax(target, params, handler_function, true);
}