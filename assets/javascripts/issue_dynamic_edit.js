var cssId = 'fontAwesome';
	if (!document.getElementById(cssId))
	{
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.id   = cssId;
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
		link.media = 'all';
		head.appendChild(link);
	}
	  
if($('#statusListDropdown').length > 0) {
	var htmlCopy = $('#statusListDropdown').get(0).outerHTML;
	$('#statusListDropdown').remove();
	$('.details .attributes .status.attribute .value').html(htmlCopy);
}
	  
if($('#usersListDropdown').length > 0) {
	var htmlCopy = $('#usersListDropdown').get(0).outerHTML;
	$('#usersListDropdown').remove();
	$('.details .attributes .assigned-to.attribute .value').html(htmlCopy);
}
	  
if($('#prioritiesListDropdown').length > 0) {
	var htmlCopy = $('#prioritiesListDropdown').get(0).outerHTML;
	$('#prioritiesListDropdown').remove();
	$('.details .attributes .priority.attribute .value').html(htmlCopy);
}
	  
function updateDataIssue(field_name, field_value, cssClass) {
	$('.details .attributes .' + cssClass + '.attribute .value').append(' <i class="fa fa-refresh fa-spin fa-fw"></i>');
	ticketData = '<?xml version="1.0" encoding="UTF-8"?>';
	ticketData += '<issue>';
	ticketData += '<id>' + _ISSUE_ID + '</id>';
	ticketData += '<' + field_name + '>'+ field_value +'</' + field_name + '>';
	ticketData += '</issue>';
	jQuery.ajax({
	    type: 'PUT',
	    url: '/issues/' + _ISSUE_ID + '.xml',
	    crossDomain: true,
	    async: false,
	    contentType: "application/xml",
	    data: ticketData,
	    beforeSend: function(xhr) {
	        xhr.setRequestHeader("X-Redmine-API-Key", _USER_API_KEY);
	    },
	    success: function(msg) {
			setTimeout(function(){
				$('.details .attributes .' + cssClass + '.attribute .value i.fa-spin').remove();
				$('.details .attributes .' + cssClass + '.attribute .value').append(' <i class="fa fa-check"></i>');
				setTimeout(function(){
					$('.details .attributes .' + cssClass + '.attribute .value i.fa-check').remove();
				}, 2000);
			}, 500);
		},
	    error: function(xhr, msg, error) {}
	 });
 } /* end function updateDataIssue */
	  
 var domSelectStatus = $('body').find('#statusListDropdown select');
 domSelectStatus.on('change', function(e){ 
 	updateDataIssue('status_id', domSelectStatus.val(), 'status');
 }); /* end on change domSelectStatus */
	  
 var domSelectPriorities = $('body').find('#prioritiesListDropdown select');
 domSelectPriorities.on('change', function(e){
 	updateDataIssue('priority_id', domSelectPriorities.val(), 'priority');
 }); /* end on change domSelectPriorities */
	  
 var domSelectUsers = $('body').find('#usersListDropdown select');
 domSelectUsers.on('change', function(e){
 	updateDataIssue('assigned_to_id', domSelectUsers.val(), 'assigned-to');
 }); /* end on change domSelectUsers */
	  
 $('.details .attributes .attribute .value').on({
	mouseenter: function () {
	  $(this).find('.fa-pencil').removeClass('fa-pencil').addClass('fa-angle-down');
	},
	mouseleave: function () {
	  $(this).find('.fa-angle-down').removeClass('fa-angle-down').addClass('fa-pencil');
	}
 });