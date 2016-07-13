(function( $ ){
	$.fn.FromGeneration = function(options){
		var settings = $.extend( {
		  'JsonName'         : 'default.json',
		  'ReqFieldMsg' : 'You Must Fill in All of Red Field.',
		  'AjaxErrorMsg' : 'Internal Server Error',
		  'AjaxSuccessMsg' : 'Success',
		}, options);
		
		return this.on("click", function(){
			var form_id = $(this).attr('class').replace("fg-","");
			var form_output = "<form id='"+form_id+"'>";
			$.getJSON(''+settings.JsonName+'', function (data) {
				 $.each(data, function (entryIndex, entry) {
					if (entry['label'] != "") {
						form_output += '<label>'+entry['label']+'</label>';
					}
					if (entry['element_type'] == "input") {
						if ( entry['ftype'] == "hidden" ) {
							form_output += '<input type="' + entry['ftype'] + '" name="' + entry['fname'] + '" />';
						} else {
							form_output += '<p><input type="' + entry['ftype'] + '" name="' + entry['fname'] + '" class="' + entry['class'] + ' ' + entry['req'] + '" placeholder="' + entry['placeholder_txt'] + '" /></p>';
						}
					} else if(entry['element_type'] == "textarea") {
						form_output += '<p><textarea name="'+entry['fname']+'" class="'+entry['class']+' '+entry['req']+'" placeholder="'+entry['placeholder_txt']+'"></textarea></p>';
					} else if(entry['element_type'] == "button") {
						form_output += '<p><button name="'+entry['fname']+'" class="'+entry['class']+'" type="'+entry['ftype']+'">'+entry['value']+'</button></p>';
					} else if(entry['element_type'] == "select") {
						form_output += '<p>'+getDropDown(entry['id'], entry['value'], entry['fname'], entry['class'], entry['default_value'])+'</p>';
					} else {
						form_output += '';
					}
				 });
			 form_output += '<p><button name="form_submit" class="fg-submit-'+ form_id +'" type="button">Submit</button></p>';
			 form_output += "</form>";
			 $("."+form_id+"").append(form_output);
			});
		});
	};
	function getDropDown(tableName, selectedVal, elemName, elemClass, defaultVal){
		var DropDown_html = "";
		if(tableName){
			$.ajaxSetup({
				async: false
			});
			$.getJSON(''+tableName+'.json', function (data) {
				DropDown_html += '<select name="'+elemName+'" class="'+elemClass+'">';
				if(defaultVal) {
					 DropDown_html += '<option vlaue=" ">' + defaultVal + '</option>';
				}
				$.each(data, function (entryIndex, entry) {	
					var selected = (entry['id_value'] == selectedVal) ? 'selected' : '';
					DropDown_html += '<option value="'+entry['id_value']+'" class="'+entry['class']+'" '+selected+'>'+entry['text']+'</option>';
				});
				DropDown_html += '</select>';
			});
			$.ajaxSetup({
				async: true
			});
		} else {
			DropDown_html += "You Must Parse Table Name";
		}
		return DropDown_html;
	}
})( jQuery );


function ajax_request(method,form_id){
	var data_serialize = $("#"+form_id+"").serialize();
	console.log(data_serialize);
	
	$("#loading").ajaxStart(function(){
	   $(this).show();
	 });
	 $("#loading").ajaxStop(function(){
	   $(this).hide();
	 });

	$.ajax({
		url: '/', // url of action 
		type: method, // post method 
		data: data_serialize, // data sending 
		error: function () {
			console.log("Internal Server Error");

		},
		success: function (data) {// if success
			console.log("Success");
		}
	});
}
$("button[class^='fg-submit-']").on("click",function(){
	var form_id = $(this).attr('class').replace("fg-submit-","");
	console.log(form_id);
	//check_valid();// this will be taken from main js file
	if(formValidator($("form#"+form_id+""))) {
		console.log("valid");
		ajax_request("post", form_id);
	} else {
		console.log("not valid");
	}
});