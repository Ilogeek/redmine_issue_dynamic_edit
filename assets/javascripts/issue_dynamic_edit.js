/*
 * OPTIONS DEFINED FROM CONFIGURATION FILE
 */
var _CONF_FORCE_HTTPS = _CONF_FORCE_HTTPS || false;
var _CONF_LISTENER_TYPE = _CONF_LISTENER_TYPE || "click";
var _CONF_LISTENER_TARGET = _CONF_LISTENER_TARGET || "value";
var _CONF_EXCLUDED_FIELD_ID = _CONF_EXCLUDED_FIELD_ID || [];

/*
 * Allow inclusion from other page
 * See https://github.com/Ilogeek/redmine_issue_dynamic_edit/commit/26684a2dd9b12dcc7377afd79e9fe5c142d26ebd for more info
 */
var LOCATION_HREF = typeof custom_location_href !== 'undefined' ? custom_location_href : window.location.href;

if (_CONF_FORCE_HTTPS) {
	LOCATION_HREF = LOCATION_HREF.replace(/^http:\/\//i, 'https://');
}


/* FontAwesome inclusion */
var cssId = 'fontAwesome';

if (!document.getElementById(cssId)) {
	var head   = document.getElementsByTagName('head')[0];
	var link   = document.createElement('link');
	link.id    = cssId;
	link.rel   = 'stylesheet';
	link.type  = 'text/css';
	link.href  = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
	link.media = 'all';
	head.appendChild(link);
}

$(document).on(_CONF_LISTENER_TYPE, function(e) {
	if (!$(e.target).hasClass('date')) {
		$('.issue .attributes .attribute .value').removeClass('edited');
	}

	if ($(e.target).closest('a').length) { return; }
	if ($(e.target).closest('.' + _CONF_LISTENER_TARGET).length) {
		// avoid text selection if dblclick
		var sel = window.getSelection ? window.getSelection() : document.selection;
		var activeElement = document.activeElement;
		var inputs = ['input', 'select', 'button', 'textarea'];

		if (sel && inputs.indexOf(activeElement.tagName.toLowerCase()) === -1) {
			if (sel.removeAllRanges) {
				sel.removeAllRanges();
			} else if (sel.empty) {
				sel.empty();
			}
		}

		// we show the edit box
		$(e.target).closest('.value').addClass('edited');
	}
});

function isExcluded(elmt_id) {
	return _CONF_EXCLUDED_FIELD_ID.indexOf(elmt_id) > -1;
}

function initEditFields() {
	/* Put new dropdown lists in the detailed info block */
	if ($('#statusListDropdown').length > 0 && !isExcluded('statusListDropdown')) {
		var htmlCopy = $('#statusListDropdown').get(0).outerHTML;
		$('#statusListDropdown').remove();
		$('.details .attributes .status.attribute .value').html(
			'<span class="showValue">' +
			$('.details .attributes .status.attribute .value').html() +
			'</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
			htmlCopy
		);
	}

	if ($('#prioritiesListDropdown').length > 0 && !isExcluded('prioritiesListDropdown')) {
		var htmlCopy = $('#prioritiesListDropdown').get(0).outerHTML;
		$('#prioritiesListDropdown').remove();
		$('.details .attributes .priority.attribute .value').html(
			'<span class="showValue">' +
			$('.details .attributes .priority.attribute .value').html() +
			'</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
			htmlCopy
		);
	}

	if ($('#categoriesListDropdown').length > 0 && !isExcluded('categoriesListDropdown')) {
		var htmlCopy = $('#categoriesListDropdown').get(0).outerHTML;
		$('#categoriesListDropdown').remove();
		$('.details .attributes .category.attribute .value').html(
			'<span class="showValue">' +
			$('.details .attributes .category.attribute .value').html() +
			'</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
			htmlCopy
		);
	}

	if ($('#doneRatioListDropdown').length > 0 && !isExcluded('doneRatioListDropdown')) {
		var htmlCopy = $('#doneRatioListDropdown').get(0).outerHTML;
		$('#doneRatioListDropdown').remove();
		$('.details .attributes .progress.attribute .value').html('<span class="showValue">' +
			$('.details .attributes .progress.attribute .value').html() + '</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
			htmlCopy);
	}

	if ($('#EstimatedTimeInput').length > 0 && !isExcluded('EstimatedTimeInput')) {
		var htmlCopy = $('#EstimatedTimeInput').get(0).outerHTML;
		$('#EstimatedTimeInput').remove();
		$('.details .attributes .estimated-hours.attribute .value').html(
			'<span class="showValue">' +
			$('.details .attributes .estimated-hours.attribute .value').html() +
			'</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
			htmlCopy
		);
	}

	if ($('#StartDateInput').length > 0 && !isExcluded('StartDateInput')) {
		var htmlCopy = $('#StartDateInput').get(0).outerHTML;
		$('#StartDateInput').remove();
		$('.details .attributes .start-date.attribute .value').html(
			'<span class="showValue">' +
			$('.details .attributes .start-date.attribute .value').html() +
			'</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
			htmlCopy
		);
	}

	if ($('#DueDateInput').length > 0 && !isExcluded('DueDateInput')) {
		var htmlCopy = $('#DueDateInput').get(0).outerHTML;
		$('#DueDateInput').remove();
		$('.details .attributes .due-date.attribute .value').html(
			'<span class="showValue">' +
			$('.details .attributes .due-date.attribute .value').html() +
			'</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
			htmlCopy
		);
	}

	if ($('#TitleInput').length > 0 && !isExcluded('TitleInput')) {
		var htmlCopy = $('#TitleInput').get(0).outerHTML;
		$('#TitleInput').remove();
		$('.subject h3').html('<span class="showValue">' + $('.subject h3').html() + '</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
			htmlCopy).addClass('value');
	}

	if ($('#DescriptionInput').length > 0 && !isExcluded('DescriptionInput')) {
		var htmlCopy = $('#DescriptionInput').get(0).outerHTML;
		$('#DescriptionInput').remove();
		$('div.description .wiki').html(
			' <i class="fa fa-pencil fa-fw" aria-hidden="true" style="float:right;"></i><span class="showValue">' +
			$('div.description .wiki').html() + '</span>' +
			htmlCopy
		).addClass('value');
	}

	if ($('select#issue_assigned_to_id').length > 0 && !isExcluded('issue_assigned_to_id')) {
		var htmlCopy = $('select#issue_assigned_to_id').get(0).outerHTML;
		// 2 technics with simple or double quote (safety first)
		htmlCopy = htmlCopy.replace(/id="/g, 'id="dynamic_').replace(/id='/g, "id='dynamic_");

		var editHTML = "<span class='dynamicEdit' id='dynamic_edit_assigned_to_id'>";
		editHTML += htmlCopy;
		editHTML += " <a href='#' class='btn btn-primary close' aria-label='" + _TXT_CANCEL_BTN + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>";
		editHTML += "</span>";

		$('.details .attributes .assigned-to.attribute .value').html(
			'<span class="showValue">' +
			$('.details .attributes .assigned-to.attribute .value').html() +
			'</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
			editHTML
		);
	}

	if ($('select#issue_fixed_version_id').length > 0 && !isExcluded('issue_fixed_version_id')) {
		var htmlCopy = $('select#issue_fixed_version_id').get(0).outerHTML;
		// 2 technics with simple or double quote (safety first)
		htmlCopy = htmlCopy.replace(/id="/g, 'id="dynamic_').replace(/id='/g, "id='dynamic_");

		var editHTML = "<span class='dynamicEdit' id='dynamic_edit_fixed_version'>";
		editHTML += htmlCopy;
		editHTML += " <a href='#' class='btn btn-primary close' aria-label='" + _TXT_CANCEL_BTN + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>";
		editHTML += "</span>";

		$('.details .attributes .fixed-version.attribute .value').html(
			'<span class="showValue">' +
			$('.details .attributes .fixed-version.attribute .value').html() +
			'</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
			editHTML
		);
	}

	for (var i = 0 ; i < CF_VALUE_JSON.length ; i++) {
		var info = CF_VALUE_JSON[i].custom_field;
		var value = CF_VALUE_JSON[i].value;

		if (info.visible && info.editable && !isExcluded("issue_custom_field_values_" + info.id)) {
			if (
				$('.details .attributes .cf_' + info.id + '.attribute .value').length &&
				(
					$('#issue_custom_field_values_' + info.id).length ||
					$('input[name=issue\\[custom_field_values\\]\\[' + info.id + '\\]\\[\\]]').length
				)
			) {
				// if single input first case, else checkboxes second case
				if($('#issue_custom_field_values_' + info.id).length) {
					var htmlCopy = $('#issue_custom_field_values_' + info.id).get(0).outerHTML;
				} else {
					var htmlCopy = $('input[name=issue\\[custom_field_values\\]\\[' + info.id + '\\]\\[\\]]').parents('.check_box_group').get(0).outerHTML;
				}

				// 2 technics with simple or double quote (safety first)
				htmlCopy = htmlCopy.replace(/id="/g, 'id="dynamic_').replace(/id='/g, "id='dynamic_");
				htmlCopy = htmlCopy.replace(/class="/g, 'class="cf_' + info.id + ' ').replace(/class='/g, "class='cf_" + info.id + " ");

				var editHTML = "<span class='dynamicEdit " + info.field_format + "' id='dynamic_edit_cf_" + info.id + "'>";

				editHTML += htmlCopy;
				editHTML += " <a href='#' class='btn btn-primary validate' aria-label='" + _TXT_VALIDATION_BTN + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>";
				editHTML += " <a href='#' class='btn btn-primary close' aria-label='" + _TXT_CANCEL_BTN + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>";
				editHTML += "</span>";

				$('.details .attributes .cf_' + info.id + '.attribute .value').html(
					'<span class="showValue">' +
					$('.details .attributes .cf_' + info.id + '.attribute .value').html() +
					'</span> <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>' +
					editHTML
				);

				if (info.field_format == "date") {
					if (
						$('body').find('#dynamic_issue_custom_field_values_' + info.id).length &&
						$('body').find('#dynamic_issue_custom_field_values_' + info.id).datepickerFallback instanceof Function &&
						typeof datepickerOptions !== 'undefined'
					) {
						$('body').find('#dynamic_issue_custom_field_values_' + info.id).datepickerFallback(datepickerOptions);
					}
				}

				cf_datetime = $('body').find('#dynamic_issue_custom_field_values_' + info.id);
				if (info.field_format == "datetime") {
					if (
						cf_datetime.length &&
						typeof datetimepickerOptions !== 'undefined'
					) {
						cf_datetime.datetimepicker(datetimepickerOptions);
					}
				}
			}
		}
	}
}

initEditFields();

/* Add required style to attributes */
function updateRequiredFields(reqFieldsArray) {
	for (var i = 0; i < reqFieldsArray.length; i++) {
		var htmlLabel = reqFieldsArray[i].replace(/_/g, '-');
		$('.issue.details .attribute.' + htmlLabel + ' .label').html(
			'<span title=\"' + _TXT_REQUIRED_FIELD + '\" class=\"field-description\">' +
			$('.issue.details .attribute.' + htmlLabel + ' .label').html() +
			'</span> <span class=\"required\"> *</span>'
		);
	}
}

if ($('#required_field_array').length) {
	updateRequiredFields(JSON.parse($('#required_field_array').html()));
}

$('body.controller-issues.action-show').on('click', '.btn.close', function(e) {
	e.preventDefault();
	$(e.target).closest('.value').removeClass('edited');
	return false;
});

function getLastLockVersion() {
	var token = $("meta[name=csrf-token]").attr('content');
	var lock_version = $('#issue_lock_version').val();


	jQuery.ajax({
		type: 'GET',
		url: LOCATION_HREF,
		data: { "authenticity_token" : token },
		crossDomain: true,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("authenticity_token", token);
		},
		success: function(msg) {
			parsed = $.parseHTML(msg);
			lock_version = $(parsed).find('#issue_lock_version').val();
		}
	});
	return lock_version;
}

function issueDynamicUpdate(field_name, field_value, type, cssClass) {
	/* hide edit field */
	$('.details .' + cssClass + ' .value').removeClass('edited');

	/* add spin notification */
	$('.details .' + cssClass + ' .value').append(' <i class="fa fa-refresh fa-spin fa-fw"></i>');

	/* update value displayed */
	$('.details .' + cssClass + ' .showValue').html(function() {
		if (type == "select") {
			return $('.details .' + cssClass + ' .value select option:selected').html()
		} else if (type == "input") {
			return $('.details .' + cssClass + ' .value input').val()
		} else if (type == "textarea") {
			return $('.details .' + cssClass + ' .value textarea').val()
		} else if (type == "date") {
			return "XXXX/XX/XX";
		}
	});

	/* lost focus on element */
	if (type != "select") {
		$('.details .' + cssClass + ' .value input').blur();
	}

	var token = $("meta[name=csrf-token]").attr('content');

	$('#issue-form').find("#issue_" + field_name).val(field_value).css({"display": "inline-block"});
	// avoid conflict revision
	var lastLockVersion = getLastLockVersion();
	$('#issue_lock_version').val(lastLockVersion);
	var formData = "";
	
	// If checkbox we have to uncheck everything in the issue-form and get data from dynamic edit
	if(type == "checkbox"){
		formData = field_value + "&";
		var cf_id = field_name.replace(/\D/g,'');
		$('input[name=issue\\[custom_field_values\\]\\[' + cf_id + '\\]\\[\\]]').each(function(){
			$(this).prop('checked', false);
		});
	}

	formData += $('#issue-form').serialize();


	jQuery.ajax({
		type: 'POST',
		url: LOCATION_HREF,
		data: formData,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("authenticity_token", token);
		},
		success: function(msg) {
			/* get result page content (updated issue detail page with new status) */

			var parsed = $.parseHTML(msg);

			var error = $(parsed).find("#errorExplanation");

			if (error.length) {
				if ($('html').find("#errorExplanation").length == 0) {
					$('.issue.details').before("<div id='errorExplanation'>" + error.html() + "</div>");
				} else {
					$('html').find("#errorExplanation").html(error.html());
				}

				/* data updated, remove spin and add success icon for 2sec */
				setTimeout(function() {
					$('.details .' + cssClass + ' i.fa-spin').removeClass('fa-refresh fa-spin').addClass('fa-times statusKo');
					setTimeout(function() {
						$('.details .' + cssClass + ' i.fa-times.statusKo').remove();
					}, 2000);
				}, 500);


				jQuery.ajax({
					type: 'GET',
					url: LOCATION_HREF,
					data: { "authenticity_token" : token },
					crossDomain: true,
					async: false,
					beforeSend: function(xhr) {
						xhr.setRequestHeader("authenticity_token", token);
					},
					success: function(msg) {
						parsed = $.parseHTML(msg);
					}
				});
			} else {
				/* removing error div if exists */
				$('html').find("#errorExplanation").remove();
			}

			/* we update the details block */
			$('div.issue.details').html( $(parsed).find('div.issue.details').html() );
			$('body').find('.details .' + cssClass + ' .value').append(' <i class="fa fa-refresh fa-spin fa-fw"></i>');

			/* we update form*/
			$('form#issue-form').html( $(parsed).find('form#issue-form').html() );

			/* we update issue properties edit block */
			$('#all_attributes').html( $(parsed).find('#all_attributes').html() );

			/* we init edit fields */
			initEditFields();
			initEditFieldListeners();

			if ($(parsed).find('#required_field_array').length) {
				updateRequiredFields(JSON.parse($(parsed).find('#required_field_array').html()));
			}

			/* we update the history list */
			$('#history').append($(parsed).find('#history .journal.has-details:last-child'));

			/* data updated, remove spin and add success icon for 2sec */
			setTimeout(function(){
				$('.details .' + cssClass + ' i.fa-spin').removeClass('fa-refresh fa-spin').addClass('fa-check statusOk');
				setTimeout(function(){
					$('.details .' + cssClass + ' i.fa-check.statusOk').remove();
				}, 2000);
			}, 500);

			//set datepicker fallback for input type date
			if (
				$('body').find('input[type=date]').length &&
				$('body').find('input[type=date]').datepickerFallback instanceof Function &&
				typeof datepickerOptions !== 'undefined'
			) {
				$('body').find('input[type=date]').datepickerFallback(datepickerOptions);
			}
		},
		error: function(xhr, msg, error) {
			/* error and no update, info logged into console */
			console.log('%c -------- Error while updating the issue attribute dynamically -------- ', 'background: #ff0000; color: white; font-weight:900');
			console.log('%c xhr data: ', 'background: black; color: white;');
			console.log(xhr);
			console.log('%c msg data: ', 'background: black; color: white;');
			console.log(msg);
			console.log('%c error data: ', 'background: black; color: white;');;
			console.log(error);
			console.log('%c ---------------------------------------------------------- ', 'background: #ff0000; color: white; font-weight:900');

			$('.details .' + cssClass + ' i.fa-spin').removeClass('fa-refresh fa-spin').addClass('fa-times').html(" " + _TXT_ERROR_AJAX_CALL);
			setTimeout(function(){
				$('.details .' + cssClass + ' i.fa-times').remove();
			}, 2000);
		}
	});
};

/* Listeners foreach attribute */
function initEditFieldListeners() {
	var domSelectStatus = $('body').find('#statusListDropdown select');
	domSelectStatus.on('change', function(e) {
		issueDynamicUpdate('status_id', domSelectStatus.val(), 'select', 'status');

		/* update the classes status from */
		$("#content > div.issue").removeClass(function (index, className) {
			return (className.match (/(^|\s)status-\S+/g) || []).join(' ');
		}).addClass('status-' + domSelectStatus.val());
	}); /* end on change domSelectStatus */

	var domSelectPriorities = $('body').find('#prioritiesListDropdown select');
	domSelectPriorities.on('change', function(e){
		issueDynamicUpdate('priority_id', domSelectPriorities.val(), 'select', 'priority');

		/* update the classes priority from */
		$("#content > div.issue").removeClass(function (index, className) {
			return (className.match (/(^|\s)priority-\S+/g) || []).join(' ');
		}).addClass('priority-' + domSelectPriorities.val());
	}); /* end on change domSelectPriorities */

	var domSelectCategories = $('body').find('#categoriesListDropdown select');
	domSelectCategories.on('change', function(e){
		issueDynamicUpdate('category_id', domSelectCategories.val(), 'select', 'category');

		/* update the classes priority from */
		$("#content > div.issue").removeClass(function (index, className) {
			return (className.match (/(^|\s)priority-\S+/g) || []).join(' ');
		}).addClass('category-' + domSelectPriorities.val());
	}); /* end on change domSelectCategories */

	var domSelectUsers = $('body').find('#usersListDropdown select');
	domSelectUsers.on('change', function(e){
		issueDynamicUpdate('assigned_to_id', domSelectUsers.val(), 'select', 'assigned-to');
	}); /* end on change domSelectUsers */

	var domSelectRatio = $('body').find('#doneRatioListDropdown select');
	domSelectRatio.on('change', function(e){
		issueDynamicUpdate('done_ratio', domSelectRatio.val(), 'progress', 'progress');
	}); /* end on change domSelectRatio */

	var domInputEstimatedTime = $('body').find('#EstimatedTimeInput input');
	$('#EstimatedTimeInput a.btn.validate').on('click', function(e) {
		e.preventDefault();
		$('.estimated-hours .value .error').remove();
		var estimatedTime = parseFloat(domInputEstimatedTime.val());

		if (estimatedTime >= 0) {
			issueDynamicUpdate('estimated_hours', estimatedTime, 'input', 'estimated-hours');
		} else {
			/* estimated time must be > 0 */
			$('.estimated-hours .value').append('<span class="error"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + _TXT_ERROR_POSITIVE_NUMBER + '</span>');
		}

		return false;
	});

	domInputEstimatedTime.on('keyup', function(e){
		$('.details .attributes .estimated-hours.attribute .selectedValue span').html(
			$('.details .attributes .estimated-hours.attribute .value input').val()
		);

		if (e.keyCode == 13) {
			$('#EstimatedTimeInput a.btn.validate').click();
		}
	});/* end EstimatedTime */

	var domInputStartDate = $('body').find('#StartDateInput input');
	$('#StartDateInput a.btn.validate').on('click', function(e) {
		e.preventDefault();
		$('.start-date .value .error').remove();
		if (new Date(domInputStartDate.val()).getTime() <= new Date($('body').find('#DueDateInput input').val()).getTime() || $('body').find('#DueDateInput input').val() == "")
		{
			issueDynamicUpdate('start_date', domInputStartDate.val(), 'date', 'start-date');
		} else {
			/* start date must be < due date */
			$('.start-date .value').append('<span class="error"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + _TXT_ERROR_START_DATE + '</span>');
		}

		return false;
	});

	domInputStartDate.on('keyup', function(e){
		if (e.keyCode == 13) {
			$('#StartDateInput a.btn.validate').click();
		}
	});/* end StartDate */

	var domInputDueDate = $('body').find('#DueDateInput input');
	$('#DueDateInput a.btn.validate').on('click', function(e) {
		e.preventDefault();
		$('.due-date .value .error').remove();

		if(new Date($('body').find('#StartDateInput input').val()).getTime() <= new Date(domInputDueDate.val()).getTime() || $('body').find('#StartDateInput input').val() == "" )
		{
			issueDynamicUpdate('due_date', domInputDueDate.val(), 'date', 'due-date');
		} else {
			/* start date must be < due date */
			$('.due-date .value').append('<span class="error"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + _TXT_ERROR_DUE_DATE + '</span>');
		}
		return false;
	});

	domInputDueDate.on('keyup', function(e){
		if (e.keyCode == 13) {
			$('#DueDateInput a.btn.validate').click();
		}
	});/* end StartDate */

	var domInputTitle = $('body').find('#TitleInput input');
	$('#TitleInput a.btn.validate').on('click', function(e) {
		e.preventDefault();
		issueDynamicUpdate('subject', domInputTitle.val(), 'input', 'subject');

		return false;
	});

	domInputTitle.on('keyup', function(e){
		if (e.keyCode == 13) {
			$('#TitleInput a.btn.validate').click();
		}
	});/* end Title */

	var domInputDescription = $('body').find('#DescriptionInput textarea');

	if(domInputDescription.length) {

		if (
				typeof(CKEDITOR) === "object" &&
				typeof(CKEDITOR.instances['issue_description'].getData) === typeof(Function)
		) {
			var cfg = CKEDITOR.instances['issue_description'].config;
			cfg.height = 100;
			CKEDITOR.replace("description_textarea", cfg)
		}else if (typeof(jsToolBar) === typeof(Function)) {
			var wikiToolbar = new jsToolBar(document.getElementById('description_textarea')); wikiToolbar.draw();
		}

	 	$('#DescriptionInput a.btn.validate').on('click', function(e) {
			e.preventDefault();
			var new_value = domInputDescription.val();

			if (
				typeof(CKEDITOR) === "object" &&
				typeof(CKEDITOR.instances['description_textarea'].getData) === typeof(Function)
			) {
				new_value = CKEDITOR.instances['description_textarea'].getData();
			}

			issueDynamicUpdate('description', new_value, 'textarea', 'description');

			return false;
		});
	}

	var dynamic_edit_assigned_to_id = $('body').find('#dynamic_edit_assigned_to_id select');

	if (dynamic_edit_assigned_to_id.length) {
	 	dynamic_edit_assigned_to_id.on('change', function(e){
			issueDynamicUpdate('assigned_to_id', dynamic_edit_assigned_to_id.val(), 'select', 'assigned-to');
		});
	}

	var dynamic_edit_fixed_version = $('body').find('#dynamic_edit_fixed_version select');

	if (dynamic_edit_fixed_version.length) {
	 	dynamic_edit_fixed_version.on('change', function(e){
			issueDynamicUpdate('fixed_version_id', dynamic_edit_fixed_version.val(), 'select', 'fixed-version');
		});
	}

	/* end Description */

	/* Custom fields */
	for (var i = 0 ; i < CF_VALUE_JSON.length ; i++) {
		(
			function() {
				var info = CF_VALUE_JSON[i].custom_field;
				var value = CF_VALUE_JSON[i].value;

				if (info.visible && info.editable) {
					var inputType = "input";
					switch (info.field_format) {
						case "bool":
						case "user":
						case "list":
						case "enumeration":
						case "version":
							inputType = "select";
							break;
						case "text":
							inputType = "textarea";
							break;
					}

					if(info.format_store.edit_tag_style == "check_box"){
						inputType = "checkbox";
					}

					var domInputField = $('body').find('#dynamic_issue_custom_field_values_' + info.id);
				 	$('body').find('#dynamic_edit_cf_' + info.id + ' a.btn.validate').on('click', function(e) {
				 		var new_value = domInputField.val();

				 		// Specific case with checkboxes
				 		if(typeof new_value === 'undefined'){
			 				var new_value = $('body').find('#dynamic_edit_cf_' + info.id + " :input").serialize();
				 		}

						issueDynamicUpdate('custom_field_values_' + info.id , new_value, inputType, 'cf_' + info.id);

						return false;
				 	});

				 	domInputField.on('keyup', function(e) {
						if (e.keyCode == 13 && inputType != "textarea") {
							$('body').find('#dynamic_edit_cf_' + info.id + ' a.btn.validate').click();
						}
					});
				}
			}()
		); // closure FTW
	}
}

initEditFieldListeners();
