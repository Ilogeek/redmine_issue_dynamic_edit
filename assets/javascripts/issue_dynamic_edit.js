/* FontAwesome inclusion */
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

/* Put new dropdown lists in the detailed info block */	
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

function issueDynamicUpdate(field_name, field_value, cssClass){
	$('.details .attributes .' + cssClass + '.attribute .value').append(' <i class="fa fa-refresh fa-spin fa-fw"></i>');
	var token = $("meta[name=csrf-token]").attr('content');
	jQuery.ajax({
	    type: 'POST',
	    url: '/issues/bulk_update?back_url=%2Fissues&amp;ids%5B%5D=' + _ISSUE_ID + '&amp;issue%5B' + field_name + '%5D=' + field_value,
	    data: { "authenticity_token" : token },
		crossDomain: true,
	    async: false,
	    beforeSend: function(xhr) {
	        xhr.setRequestHeader("authenticity_token", token);
	    },
	    success: function(msg) {
			setTimeout(function(){
				$('.details .attributes .' + cssClass + '.attribute .value .selectedValue span').html(
					$('.details .attributes .' + cssClass + '.attribute .value select option:selected').html()
				);
				$('.details .attributes .' + cssClass + '.attribute .value i.fa-spin').remove();
				$('.details .attributes .' + cssClass + '.attribute .value').append(' <i class="fa fa-check"></i>');
				setTimeout(function(){
					$('.details .attributes .' + cssClass + '.attribute .value i.fa-check').remove();
				}, 2000);
			}, 500);
			
			// update other fields to avoid conflict
			$('#issue_lock_version').val(parseInt($('#issue_lock_version').val()) + 1 );
			$('#last_journal_id').val(parseInt($('#last_journal_id').val()) + 1 );
			$('#issue_' + field_name + ' option').removeAttr('selected').filter('[value=' + field_value + ']').prop('selected', true);
		},
	    error: function(xhr, msg, error) {}
	 });
};

/* Listeners foreach dropdown */	  
 var domSelectStatus = $('body').find('#statusListDropdown select');
 domSelectStatus.on('change', function(e){ 
 	issueDynamicUpdate('status_id', domSelectStatus.val(), 'status');
 }); /* end on change domSelectStatus */
	  
 var domSelectPriorities = $('body').find('#prioritiesListDropdown select');
 domSelectPriorities.on('change', function(e){
 	issueDynamicUpdate('priority_id', domSelectPriorities.val(), 'priority');
 }); /* end on change domSelectPriorities */
	  
 var domSelectUsers = $('body').find('#usersListDropdown select');
 domSelectUsers.on('change', function(e){
 	issueDynamicUpdate('assigned_to_id', domSelectUsers.val(), 'assigned-to');
 }); /* end on change domSelectUsers */