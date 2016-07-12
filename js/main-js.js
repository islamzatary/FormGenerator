function formValidator(frm){

	($('#server_msg_paragraph').length)?$('#server_msg_paragraph').addClass('hide'):null;
	
	// VALIDATES ALL FORM ELEMENTS WITHIN A FORM USING THE validInput CHECK ON SUBMIT OF THE FORM
	// CHECK if We need to pass lang and pgSec
	var isValid = true;
	switch($(document.body).attr('id')) {
		case "ar" :
			var errMsg = "<strong>هناك بعض الأخطاء في ارسال بيانات هذه الصفحة:</strong> الرجاء مراجعة المُدخلات المشار اليها بلون مختلف.";
		break
		case "fr" :
			var errMsg = "<strong>Une erreur s'est produite lors de la soumission du formulaire:</strong> Veuillez vérifier les champs ci-dessous.";
		break
		default :
			var errMsg = "<strong>There was a problem submitting this form:</strong> Please review the highlighted fields below and try submitting again.";
	}
	if (document.getElementById("remove_email")){
		var remove_email = document.getElementById("remove_email").value;
	} else {
		var remove_email = 1
	}
	cleanupInput(remove_email);
	var eleTypArr = new Array("select","input","textarea"); // array of all elements to validate
	for (var x = 0; x < 3; x++){
		var theElements = $(frm).find(eleTypArr[x]); // run through elements array in the form
		for (var i = theElements.length -1; i >= 0; i--){
			if ($(theElements[i]).attr('tagName') != "SELECT" && $(theElements[i]).attr('type') != "checkbox" && 
					$(theElements[i]).attr('type') != "radio" && $(theElements[i]).attr('type') != "file" ) $(theElements[i]).val($.trim(theElements[i].value)); // ie trims select elements as well
					if (!validInput(theElements[i])) isValid = false; // the validation function
		}
	}
	if (!isValid) {
		$('#submit-alert-message').addClass('alert');
		$('#submit-alert-message').html(errMsg);
		$("#submit-alert-message").slideDown('slow').delay(4500).slideUp('slow');
		return false;
	}
	return true;
}

function cleanupInput(remove_email){
	var elementsTypeArray = new Array("input","textarea"); // array of all elements to cleanup
	for (var i = 0; i < elementsTypeArray.length; i++){
		var theElements = document.getElementById("content").getElementsByTagName(elementsTypeArray[i]); // run through elements array in the form
		for (var j = 0; j < theElements.length; j++){
			if($(theElements[j]).attr('type')!="file")	{
				$(theElements[j]).attr('value', $(theElements[j]).attr('value').replace(/<script.*?>([\s\S]*?)<\/script>|<(\S)* (on.{2,})>|javascript(.)?:/gim,"")); 
			}
			if( $(theElements[j]).attr('tagName') != "INPUT"  && remove_email == 1 )	{
				$(theElements[j]).attr('value', $(theElements[j]).attr('value').replace(/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}|\w+@[a-zA-Z_]{2,6}/gim,"")); 
			}
		}
	}
}

function validInput(theElement){
	// CHECKS IF A FORM ELEMENT IS VALID ACCORDING TO THE FOLLOWING VALUES IN THE FORM ELEMENT CLASS ATTRIBUTE
	// 	req = required field
	// 	alpha = alpha-numeric field (no spaces, punctuation, etc.)
	// 	number = numeric field
	// 	mutiNumber = numeric fields sperated by spaces or carriage return
	//		min-n = minumum number of characters is n (where n is a specified number)
	//		max-n = string: maximum number of characters is n (where n is a specified number)
	//		max-n = multiselect: maximum number of selections is n (where n is a specified number)
	//		email = email field - searches for "@" and "."
	//		match-elementname = checks if the current field and the field in "elementname" are equal (for confirm password)
	// ALL REQUIRE <span class="error" id="err-elementname"></span> IN THE FORM, WHERE "elementname" IS THE NAME OF THE ELEMENT
	var lang = $(document.body).attr('id'),
	pass = true,
	ErrMsg = "",
	theString = $.trim(theElement.value),
	theClasses = $(theElement).attr('class').split(" "),
	errHldr = $('#err-' + $(theElement).attr('name')),
	msgReqEn = "This field is required.<br />",
	msgReqAr = "",
	msgAlphEn = "This field may contain numbers and letters only (with no spaces).<br />",
	msgAlphAr = "",
	msgNumEn = "This field may contain numbers only.<br />",
	msgNumAr = "",
	msgEmEn = "This field must be a valid email address.<br />",
	msgEmAr = "",
	msgEmDomEn = "The email address, <b>1s</b>, contains an invalid domain. Only the following email domain is allowed: <span dir=\"ltr\"><b>@2s</b></span>.<br />",
	msgEmDomAr = "",
	msgMxEn = "This field cannot exceed :x: characters.<br />",
	msgMxAr = "",
	msgMnEn = "This field must contain at least :x: characters.<br />",
	msgMnAr = "",
	msgMatEn = "This field does not confirm.<br />",
	msgMatAr = "",
	msgMxSelEn = "Too many selections: :y: options are selected out of a limit of :x:.<br />",
	msgMxSelAr = "",
	msgDatDNotExEn = "This date field is incomplete or incorrect.<br />",
	msgDatDNotExAr = "This date field is incomplete or incorrect.<br />",
	msgDatMatEn = "End date should be greater than start date.<br />",
	msgDatMatAr = "",
	msgDatMxEn = "This date should not be greater than today's date.<br />",
	msgDatMxAr = "",
	msgDatMnEn = "This date should be greater than today's date.<br />",
	msgDatMnAr = "",
	msgMxValEn = "This field should be less than or equal to :x:.<br />",
	msgMxValAr = "This field should be less than or equal to :x:.<br />",
	msgAtLeastNumEn = "Must contain at least 1 number.<br />",
	msgAtLeastNumAr = "",
	msgAtLeastAlphEn = "Must contain at least 1 letter.<br />",
	msgAtLeastAlphAr = "",
	msgAlphaPeriodEn = "This field may contain numbers, letters, underscore, and period only (with no spaces).<br />",
	msgAlphaPeriodAr = "This field may contain numbers, letters, underscore, and period only (with no spaces).<br />" ,
	msgPatternEn = "Please follow the given format",
	msgPatternAr = "Please follow the given format";
	
	// search into the array of classes to find "locked" class,  if its found then nothing should done here, the validation criteria should be skipped.
	if ($(theElement).attr('class') == 'invalid') {
		ErrMsg = $('err-' + theElement.name).html();
		return false;
	}
	// run through the form element classes to decide how to validate
	for (var i = 0;i < theClasses.length; i++){
		var thisClass = theClasses[i];
		switch(thisClass) {	
		case "alpha" :
			if (theString != "" && !(/^[a-zA-Z0-9_]+$/.test(theString))) { 
				pass = false;
				ErrMsg = (lang == "ar") ? msgAlphAr : msgAlphEn;
			}
			break;
		case "date" :
			// detect all date fields by getting the base name and then submitting to checkDate
			var baseName = theElement.name.slice(0,theElement.name.lastIndexOf("_")),
			datArr   = new Array($("#id-"+baseName+"_year"),$("#id-" + baseName + "_month"),$("#id-" + baseName + "_day"));
			errHldr =  $("#err-" + baseName + "_month");
			if (!checkDate(baseName)){
				pass = false;
				ErrMsg = (lang == "ar") ? msgDatDNotExAr : msgDatDNotExEn;
			}
			for (var i = 0; i < 3; i++){
				if (eval(datArr[i])){
					eval(datArr[i]).css({"background":(!pass)?"#fff9f9":"#fff","borderColor":(!pass)?"#b00":""});
				}
			}
			break;
		case "email" :
			var filter = /^[0-9a-zA-Z!#$%&'*+/=?^_`{|}~-]+(\.[0-9a-zA-Z!#$%&'*+/=?^_`{|}~-]+)*@((((([a-zA-Z0-9]{1}[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]{1})|[a-zA-Z])\.)+[a-zA-Z]{2,6})|(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?)$/;
			if (theString != "" && !(filter.test(theString))) {
				pass = false;
				ErrMsg = (lang == "ar") ? msgEmAr : msgEmEn;
			}
			break;
		case "number" :
			if (theString != "" && !(/^([0-9]*)$/.test(theString))) { 
				pass = false;
				ErrMsg = (lang == "ar") ? msgNumAr : msgNumEn;
			}
			break;
		case "multinumber" :
			if (theString != "" && !(/^([0-9]*\s*)*$/.test(theString))) { 
				pass = false;
				ErrMsg = (lang == "ar") ? msgNumAr : msgNumEn;
			}
			break;	
		case "float" :
			var flArr = new Array ("(",")","-","+"," ");
			for (var i = 0;i < 5; i++) {
				theString = theString.replace(flArr[i],"");
			}
			$(theElement).val(theString);
			if (isNaN(theString)){
				pass = false;
				ErrMsg = (lang == "ar") ? msgNumAr : msgNumEn;
			}
			break;
		case "req" :
			if ($(theElement)[0].tagName == 'SELECT') {
				if ($(theElement).attr("multiple")) {
					if ($(theElement).attr('selectedIndex') < 0) pass = false;
				} else if ($(theElement).attr('selectedIndex') == 0) pass = false;
			} else if ($(theElement).hasClass("radio") || $(theElement).hasClass("checkbox") ) {
				if (!$("input[name="+theElement.name+"]").is(":checked")) pass = false;
			} else {
				if (isWhitespace(removeHtmlTags(theString))) pass = false;
			}
			if (!pass) ErrMsg = (lang == "ar") ? msgReqAr : msgReqEn;
			break;
		case "alpha_period" :
			if (theString != "" && !(/^[a-zA-Z0-9_.]+$/.test(theString))) { 
				pass = false;
				ErrMsg = (lang == "ar") ? msgAlphaPeriodAr : msgAlphaPeriodEn;
			}
			break;
		default :
			if ($(theElement)[0].tagName == 'SELECT') {
				theString = '';
				if ($(theElement).val() != null) theString = $(theElement).val();
			}
			// dual-value classes (creating a name and value by splitting the class from "-")
			if (thisClass.split("-").length > 1 && !isWhitespace(theString)){
				var checkType = thisClass.split("-")[0];
				var checkVal = thisClass.split("-").slice(1).join("-");
				
				switch (checkType) {
				case "min" :
					if (theString.length < checkVal){
						pass = false;
						ErrMsg = (lang == "ar") ? msgMnAr.replace(":x:",checkVal) : msgMnEn.replace(":x:",checkVal);
					}
					break;
				case "maxval" :
					if (parseInt(theString) >  parseInt(checkVal)){
						pass = false;
						ErrMsg = (lang == "ar") ? msgMxValAr.replace(":x:",checkVal) : msgMxValEn.replace(":x:",checkVal);
					}
					break;
				case "max" :
					if ($(theElement)[0].tagName == "SELECT"){
						var ctr = $(theElement).val().length;
						if ( ctr > checkVal) {
							pass = false;
							ErrMsg = (lang == "ar") ? msgMxSelAr.replace(":x:",checkVal).replace(":y:",ctr) : msgMxSelEn.replace(":x:",checkVal).replace(":y:",ctr);
						}
					} else if (theString.length+theString.split("\n").length-1 > checkVal) {
						pass = false;
						ErrMsg = (lang == "ar") ? msgMxAr : msgMxEn.replace(":x:",checkVal);
					}
					break;
				case "datemax" :
					var baseName = $(theElement).attr('name').slice(0,theElement.name.lastIndexOf("_"));
					var day = ($("#id-" + baseName + "_day").length) ? $("#id-" + baseName + "_day").val() : '00';
					var enteredDate = parseInt($("#id-" + baseName + "_year").val() + $("#id-" + baseName + "_month").val() + day);
					if (enteredDate > parseInt(checkVal)){
						pass = false;
						ErrMsg = (lang == "ar") ? msgDatMxAr : msgDatMxEn;
					}
					break;
				case "datemin" :
					var baseName = $(theElement).attr('name').slice(0,theElement.name.lastIndexOf("_"));
					var day = ($("#id-" + baseName + "_day").length) ? $("#id-" + baseName + "_day").val() : '00';
					var enteredDate = parseInt($("#id-" + baseName + "_year").val() + $("#id-" + baseName + "_month").val() + day);
					if (enteredDate < parseInt(checkVal)){
						pass = false;
						ErrMsg = (lang == "ar") ? msgDatMnAr : msgDatMnEn;					
					}
					break;
				case "match" :
					if ($.trim($(theElement).val()) != $.trim($('[name='+checkVal+']').val())){
						pass = false;
						ErrMsg = (lang == "ar") ? msgMatAr : msgMatEn;
					}
					break;
				case "datematch" :
					// make sure month is not 'Present' (or any other non numerical string) before doing the check
					if (!isNaN($(theElement).val())) {
						
						var baseName = $(theElement).attr('name').slice(0,theElement.name.lastIndexOf("_")),
						startDay = ($("#id-" + checkVal + "_day").length) ? $("#id-" + checkVal + "_day").val() : '00',
						endDay = ($("#id-" + baseName + "_day").length) ? $("#id-" + baseName + "_day").val() : '00',
						startDate = $("#id-" + checkVal + "_year").val() + $("#id-" + checkVal + "_month").val() + startDay,
						endDate = $("#id-" + baseName + "_year").val() + $("#id-" + baseName + "_month").val() + endDay;
						
						if (startDate > endDate){
							pass = false;
							ErrMsg = (lang == "ar") ? msgDatMatAr : msgDatMatEn;
						}
					}
					break;
				case "emailDomain" :
					// check the email domain validation
					if (ErrMsg=="") {
						var usrEmDom = theString.split('@')[1].toLowerCase(),
						valDomArr = checkVal.split(','),
						valFg=0; // valFg = 1 => the Domain is valid , else invalid 
						for (var count=valDomArr.length-1 ; count>=0 ; count--) {
							if (valDomArr[count].toLowerCase()==usrEmDom){
								// valid domain
								valFg=1
								break;
							}
						}
						if (valFg==0) {
							pass = false;
							ErrMsg = (lang == "ar") ? msgEmDomAr : msgEmDomEn;
							ErrMsg = ErrMsg.replace('1s',theString);
							var orOptr = (lang == "ar") ? ' أو ' : ' or ';
							ErrMsg = ErrMsg.replace('2s',valDomArr.join('</b> '+orOptr+'<b>@'));
						}
					}
					break;
				case "hasNum" :
					if (theString.search(/[0-9]/g) == -1 || theString.match(/[0-9]/g).length < checkVal) {
						pass = false;
						ErrMsg = (lang == "ar") ? msgAtLeastNumAr : msgAtLeastNumEn;
					}
					break;
				case "hasAlpha" :
					if (theString.search(/[A-Za-z]/g) == -1 || theString.match(/[A-Za-z]/g).length < checkVal) {
						pass = false;
						ErrMsg = (lang == "ar") ? msgAtLeastAlphAr : msgAtLeastAlphEn;
					}
					break;
				case "pattern" :
					checkVal = new RegExp(checkVal);
					if(!checkVal.test(theString)) {
						pass = false;
						ErrMsg = (lang == "ar") ? msgPatternAr : msgPatternEn;
					}
					break;
				}
			}
		}
	}
	// insert the error message in its relative <span> location
	if (errHldr){
		var inrHTMLTxt = (!pass) ? ErrMsg : "";
		$("#err-" + theElement.name).html(inrHTMLTxt);
		if (ErrMsg.search(msgDatDNotExEn)!=-1 || ErrMsg.search(msgDatDNotExAr)!=-1) {
			$("[name="+theElement.name+"]").parent().children().each(function(){
				if (($(this).attr("id").search("day") >-1 || $(this).attr("id").search("month") >-1) && $(this).hasClass("error") ){
					$(this).hide();
				}
			});
		}
		else {
			if (theElement.name.search("day")!=-1){
				$("[name="+theElement.name+"]").parent().children().each(function(){
					if (($(this).attr("id").search("day") >-1 || $(this).attr("id").search("month") >-1) && $(this).hasClass("error") ){
						$(this).show();
					}
				});
			}
		}
		$(theElement).css({"background":(!pass) ? "#fff9f9" : "#fff","borderColor":(!pass) ? "#b00" : ""}); 
	}
	// clear the default text for elements with class "cleartext"
	if ($(theElement).attr('class').match("cleartext") && $(theElement).val() == $(theElement)[0].defaultValue) $(theElement).val("");
	return pass;
}

function checkDate(baseName){
	var pass = true,lnCom = 8,monEx=$("#id-" + baseName + "_month"),yrEx=$("#id-" + baseName + "_year"),dayEx=$("#id-" + baseName + "_day");
	// make sure month is not 'Present' before doing the check
	if(!isNaN($("#id-" + baseName + "_month").val())) {
		var day = (dayEx)?dayEx.val():"",
		month = (monEx)?monEx.val():"",
		year = (yrEx)?yrEx.val():"",
		monLen = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
		if (year/4 == parseInt(year/4)) monLen[1] = 29;
		if (day > monLen[month-1]) pass = false;
		lnCom = (yrEx.length) ? lnCom : lnCom - 4;
		lnCom = (monEx.length) ? lnCom : lnCom - 2;
		lnCom = (dayEx.length) ? lnCom : lnCom - 2;
		if ((year + month + day).length > 0 && (year + month + day).length < lnCom ) pass = false;
	}
	return pass;
}

// USED IN END DATE: WHEN MONTH = PRESENT, HIDE THE YEAR AND DON'T CHECK IT FOR VALIDITY
function checkPresent(datNm){
	var dat = datNm;
	
	for (i = 4; i >= 1; i--) {
		if ($("#id-" + dat + "_month").length) {
			if ($("#id-" + dat + "_month").val() == "Present"){
				$("#id-" + dat + "_year").val("");
				$("#id-" + dat + "_year").attr('class','hide');
			} else {
				$("#id-" + dat + "_year").attr('class','req');
			}
			// NOT TO GO THROUGH NEEDLES LOOPS
			if (dat == datNm) break; else dat = "end"+i;
		} else {
			dat = "end"+i;
		}
	}
}


//FORM VALIDATOR FUNCTIONS//
function isWhitespace(s){
	return (!/[^\s+]/.test(s));
}

function clearText(element, className){
	if ($(element).val() == $(element)[0].defaultValue) {
		$(element).removeClass(className);
		$(element).val("");
	}
}

function returnText(element, className){
	if ( $(element).val() == "" ) {
		$(element).val(element.defaultValue);
		$(element).addClass(className);
	}
}
function removeHtmlTags(string){
	return string.replace(/(<([^>]*)>)/ig,"");
}