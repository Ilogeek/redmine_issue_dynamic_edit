/*
 * OPTIONS DEFINED FROM CONFIGURATION FILE
 */
var _CONF_FORCE_HTTPS = _CONF_FORCE_HTTPS || false;
var _CONF_DISPLAY_EDIT_ICON = _CONF_DISPLAY_EDIT_ICON || "single";
var _CONF_LISTENER_TYPE_VALUE = _CONF_LISTENER_TYPE_VALUE || "click";
var _CONF_LISTENER_TYPE_ICON = _CONF_LISTENER_TYPE_ICON || "none";
var _CONF_LISTENER_TARGET = _CONF_LISTENER_TARGET || "value";
var _CONF_EXCLUDED_FIELD_ID = _CONF_EXCLUDED_FIELD_ID || [];
var _CONF_CHECK_ISSUE_UPDATE_CONFLICT = _CONF_CHECK_ISSUE_UPDATE_CONFLICT || false;

_CONF_LISTENER_TARGET = _CONF_LISTENER_TARGET === "all" ? "*" : _CONF_LISTENER_TARGET;

/*
 *	SVG ICONS
 *  Source : https://www.iconfinder.com/iconsets/glyphs
 */

var SVG_EDIT = '<svg style="width: 1em; height: 1em;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g class="svg_edit"><path d="m2 20c0 1.1.9 2 2 2h2.6l-4.6-4.6z"/><path d="m21.6 5.6-3.2-3.2c-.8-.8-2-.8-2.8 0l-.2.2c-.4.4-.4 1 0 1.4l4.6 4.6c.4.4 1 .4 1.4 0l.2-.2c.8-.8.8-2 0-2.8z"/><path d="m14 5.4c-.4-.4-1-.4-1.4 0l-9.1 9.1c-.5.5-.5 1.1-.1 1.5l4.6 4.6c.4.4 1 .4 1.4 0l9.1-9.1c.4-.4.4-1 0-1.4z"/></g></svg>';
var SVG_VALID = '<svg style="width: 1em; height: 1em; fill:white;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><path d="M10,18c-0.5,0-1-0.2-1.4-0.6l-4-4c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2.1-0.8,2.8,0l2.6,2.6l6.6-6.6   c0.8-0.8,2-0.8,2.8,0c0.8,0.8,0.8,2,0,2.8l-8,8C11,17.8,10.5,18,10,18z" class="svg_check"/></g></svg>';
var SVG_CANCEL = '<svg style="width: 1em; height: 1em;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><path d="M14.8,12l3.6-3.6c0.8-0.8,0.8-2,0-2.8c-0.8-0.8-2-0.8-2.8,0L12,9.2L8.4,5.6c-0.8-0.8-2-0.8-2.8,0   c-0.8,0.8-0.8,2,0,2.8L9.2,12l-3.6,3.6c-0.8,0.8-0.8,2,0,2.8C6,18.8,6.5,19,7,19s1-0.2,1.4-0.6l3.6-3.6l3.6,3.6   C16,18.8,16.5,19,17,19s1-0.2,1.4-0.6c0.8-0.8,0.8-2,0-2.8L14.8,12z" class="svg_cancel"/></g></svg>';

/*
 * Allow inclusion from other page
 * See https://github.com/Ilogeek/redmine_issue_dynamic_edit/commit/26684a2dd9b12dcc7377afd79e9fe5c142d26ebd for more info
 */
var LOCATION_HREF = typeof custom_location_href !== 'undefined' ? custom_location_href : window.location.href;

if (_CONF_FORCE_HTTPS) {
	LOCATION_HREF = LOCATION_HREF.replace(/^http:\/\//i, 'https://');
}

/* Check if admin want to display all editable fields when hovering the whole details block 
 * or if user has to hover every element to discover if (s)he can edit it
 */
if (_CONF_DISPLAY_EDIT_ICON === "block"){
	$('body.controller-issues.action-show .issue.details').addClass('showPencils');
}

var token = $("meta[name=csrf-token]").attr('content');
$('#new-relation-form').append('<input type="hidden" name="authenticity_token" value="'+token+'">');

/* Generate edit block */
var getEditFormHTML = function(attribute){
	var formElement = $('#issue_' + attribute + "_id");
	formElement = formElement.length ? formElement : $('#issue_' + attribute);
	formElement = formElement.length ? formElement : $('#' + attribute);

	// Checkbox specific case
	var is_checkboxes = false;
	let is_file = false;
	let is_list = false;
	let CF_ID = false;
	if(!formElement.length && attribute.startsWith("custom_field_values_")){
		CF_ID = attribute.split("custom_field_values_")[1];
		/* Is it a checkbox block ? */
		formElement = $('#issue_custom_field_values_' + CF_ID);
		if(formElement.length){
			formElement = formElement.parents('.check_box_group');
			is_checkboxes = CF_ID;
		} else {
			/* Is it a file block ? */
			formElement = $('#issue_custom_field_values_' + CF_ID + '_blank');
			if(formElement.length){
				formElement = formElement.parents('p');
				formElement.find('label').remove();
				is_file = CF_ID;
			} else {
				/* Is it a checkbox/radio group ? */
				formElement = $('#issue-form .cf_' + CF_ID + '.check_box_group');
				is_list = CF_ID;
			}
		}
	}
	
	if(formElement.length){
		var clone = formElement.clone();
		if(clone.is('select') && !clone.prop('multiple')) clone.on('change', function(e){sendData($(this).serializeArray());});
		if(is_checkboxes || is_file || is_list) {
			clone.prop('id', "issue_custom_field_values_" + CF_ID + "_dynamic");
		} else {
			clone.prop('id', formElement.prop('id') + "_dynamic");
		}
		var wrapper = $("<div/>").addClass('dynamicEditField');
		wrapper.append(clone);
		if(!clone.is('select') || clone.prop('multiple')) wrapper.append("<button class='action valid'><!--&check;-->" + SVG_VALID + "</button>");
		wrapper.append("<button class='action refuse'><!--&#x2715;-->" + SVG_CANCEL + "</button>");
		return wrapper;
	}

	return null;
}

/* Loop over all form attribute and clone them into details part */
var cloneEditForm = function(){
	$('.issue.details .subject').append('<button class="refreshData">&#10227;</button>');
	$(".issue.details ").wrap("<form id='fakeDynamicForm'>");

	$('div.issue.details .attribute').each(function(){
		var classList = $(this).attr('class').split(/\s+/);
		
		var attributes = classList.filter(function(elem) { return elem != "attribute"; });
		// Specific case : all "-" are replaced by "_" into form id
		attributes = attributes.map(attr => attr.replaceAll('-', '_'));
		
		let custom_field = false;
		attributes.forEach(function(part, index, arr) {
		  if(arr[index] === "progress") arr[index] = "done_ratio";
		  if(arr[index].startsWith('cf_')) {
		  	arr[index] = arr[index].replace('cf', 'custom_field_values');
		  	custom_field = arr[index];
		  }
		});
		
		attributes = attributes.join(" ");

		let selected_elt = custom_field ? custom_field : attributes;
		if(attributes && !_CONF_EXCLUDED_FIELD_ID.includes(selected_elt)){
			let dynamicEditField = getEditFormHTML(selected_elt);
			if(dynamicEditField) $(this).find('.value').append("&nbsp;<span class='iconEdit'><!--&#9998;-->" + SVG_EDIT + "</span>").append(dynamicEditField);
		}
  	});

  	// Specific Case : Description field
  	if(!_CONF_EXCLUDED_FIELD_ID.includes("description") && document.querySelectorAll('div.issue.details .description').length){
  		$('div.issue.details .description > p').first().find('strong').after("&nbsp;<span class='iconEdit'><!--&#9998;-->" + SVG_EDIT + "</span>");
  		var formDescription = getEditFormHTML("description");
  		formDescription.find("#issue_description_dynamic").removeAttr('data-tribute');
  		$('div.issue.details .description').append(formDescription);

  		if (
				typeof(CKEDITOR) === "object" &&
				typeof(CKEDITOR.instances['issue_description'] !== "undefined") &&
				typeof(CKEDITOR.instances['issue_description'].getData) === typeof(Function)
		) {
			var cfg = CKEDITOR.instances['issue_description'].config;
			cfg.height = 100;
			CKEDITOR.replace("issue_description_dynamic", cfg)
		}else if (typeof(jsToolBar) === typeof(Function)) {
			var wikiToolbar = new jsToolBar(document.getElementById('issue_description_dynamic')); wikiToolbar.draw();
		}
  	}

  	// Specific Case : Title field
  	if(!_CONF_EXCLUDED_FIELD_ID.includes("subject")){
  		$('div.issue.details .subject h3').append("&nbsp;<span class='iconEdit'><!--&#9998;-->" + SVG_EDIT + "</span>");
  		var formTitle = getEditFormHTML("issue_subject");
  		$('div.issue.details .subject').append(formTitle);
  	}
}

/* Perform action on .value (display edit form) */ 
$('body').on(_CONF_LISTENER_TYPE_VALUE,
	'div.issue.details .attributes .attribute .' + _CONF_LISTENER_TARGET + ', div.issue.details div.description > p, div.issue.details div.subject',
 	function(e){
 		if($(e.target).closest('.dynamicEditField').length) return; /* We're already into a dynamic field, ignore */
 		$('.dynamicEditField').each(function(e){ $(this).removeClass('open'); });
		if(!$(e.target).closest('a').length && !$(e.target).closest('button').length){
			if($(this).parent().hasClass('description')){
				$(this).parent().find('.dynamicEditField').addClass('open');
			} else {
				$(this).find('.dynamicEditField').addClass('open');
			}
		}
});

/* Perform action on .iconEdit (display edit form) */
$('body').on(_CONF_LISTENER_TYPE_ICON, 
	'div.issue.details .iconEdit', function(e){
	$('.dynamicEditField').each(function(e){ $(this).removeClass('open'); });
	$(this).parent().find('.dynamicEditField').addClass('open');
});

/* Perform data update when clicking on valid button from edit form */
$('body').on('click', '.dynamicEditField .action.valid', function(e){
	e.preventDefault();
	var input = $(this).parents('.dynamicEditField').find(':input');
	sendData(input.serializeArray());
	$(this).parents('.dynamicEditField').removeClass('open');
});

/* Hide edit form when clicking on cancel button */
$('body').on('click', '.dynamicEditField .action.refuse', function(e){
	e.preventDefault();
	$(this).parents('.dynamicEditField').removeClass('open');
});

/* Update whole .details block + history + form with global refresh button */
$('body').on('click', '.refreshData', function(e){
	sendData();
});

/* Listen on esc key press to close opened dialog box */
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        $('.dynamicEditField').each(function(e){ $(this).removeClass('open'); });
    }
};

let checkVersion = function(callback){
	jQuery.ajax({
					type: 'GET',
					url: LOCATION_HREF,
					crossDomain: true,
					global: false,
					success: function(msg) {
						let parsed = $.parseHTML(msg);
						let current_version = $(parsed).find('#issue_lock_version').val();
						
						if(current_version !== $('#issue_lock_version').val()){
							if(!$('#content .conflict').length){
								$('#content').prepend(`
								<div class="conflict">
								   	${_TXT_CONFLICT_TITLE}
								    <div class="conflict-details">
								      <div class="conflict-journal">
								      <p>${_TXT_CONFLICT_TXT}</p>
								      </div>
								    </div>
								</div>`);
							}
						} else {
							$('#content .conflict').remove();
						}

						if(callback) callback(current_version);
					}
				});
}

let checkVersionInterval = false;
let setCheckVersionInterval = function(activate){
	if(!_CONF_CHECK_ISSUE_UPDATE_CONFLICT) return false;
	if(activate && !checkVersionInterval){
		checkVersionInterval = window.setInterval(function(){ checkVersion(); }, 5000);
	} else {
		clearInterval(checkVersionInterval);
		checkVersionInterval = false;
	}
}

setCheckVersionInterval(true);

/* Global function to perform AJAX call */
var sendData = function(serialized_data){

	let updateIssue = function(serialized_data){
		setCheckVersionInterval(false);
		var token = $("meta[name=csrf-token]").attr('content');
		var params = serialized_data || [];
		params.push({name: '_method', value: "patch"});
		params.push({name: 'authenticity_token', value: token})

		jQuery.ajax({
			type: 'POST',
			url: LOCATION_HREF,
			data: $.param(params),
			success: function(msg) {
				/* get result page content (updated issue detail page with new status) */
				$('#ajax-indicator').css('display', 'none');

				var parsed = $.parseHTML(msg);

				var error = $(parsed).find("#errorExplanation");
				if (error.length) {

					if ($('html').find("#errorExplanation").length == 0) {
						$('.issue.details').before("<div id='errorExplanation'>" + error.html() + "</div>");

						$([document.documentElement, document.body]).animate({
					        scrollTop: $("#errorExplanation").offset().top
					    }, 500);
					} else {
						$('html').find("#errorExplanation").html(error.html());
					}

					jQuery.ajax({
						type: 'GET',
						url: LOCATION_HREF,
						data: { "authenticity_token" : token },
						crossDomain: true,
						async: false,
						success: function(msg) {
							parsed = $.parseHTML(msg);
						}
					});
				} else {
					/* removing error div if exists */
					$('html').find("#errorExplanation").remove();
				}

				/* we update form*/
				$('form#issue-form').html( $(parsed).find('form#issue-form').html() );

				/* we update issue properties edit block */
				$('#all_attributes').html( $(parsed).find('#all_attributes').html() );

				/* we update the details block */
				$('div.issue.details').html( $(parsed).find('div.issue.details').html() );

				/* we update the history list */
				$('#tab-content-history').append($(parsed).find('#history .journal.has-details:last-child'));

				/* we init edit fields */
				cloneEditForm();

				//set datepicker fallback for input type date
				if (
					$('body').find('input[type=date]').length &&
					$('body').find('input[type=date]').datepickerFallback instanceof Function &&
					typeof datepickerOptions !== 'undefined'
				) {
					$('body').find('input[type=date]').datepickerFallback(datepickerOptions);
				}

				setCheckVersionInterval(true);
			},
			error: function(xhr, msg, error) {
				setCheckVersionInterval(true);
				$('#ajax-indicator').css('display', 'none');

				/* error and no update, info logged into console */
				console.groupCollapsed('%c -------- Error while updating the issue attribute dynamically -------- ', 'background: #ff0000; color: white; font-weight:900');
				console.log("POST " + LOCATION_HREF);
				console.table(params);
				console.log('%c xhr data: ', 'background: black; color: white;');
				console.log(xhr);
				console.log('%c msg data: ', 'background: black; color: white;');
				console.log(msg);
				console.log('%c error data: ', 'background: black; color: white;');;
				console.log(error);
				console.groupEnd();
			}
		});
	};

	if(_CONF_CHECK_ISSUE_UPDATE_CONFLICT){
		checkVersion(function(current_version){
			if(current_version == $('#issue_lock_version').val()){
				updateIssue(serialized_data);
			} else {
				$([document.documentElement, document.body]).animate({
			        scrollTop: $("#content .conflict").offset().top
			    }, 500);
			}
		});
	} else {
		updateIssue(serialized_data);
	}
}

// Init plugin
cloneEditForm();