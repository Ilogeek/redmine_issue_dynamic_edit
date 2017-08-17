class DetailsIssueHooks < Redmine::Hook::ViewListener
  
  def protect_against_forgery?
    false
  end 

  def view_layouts_base_html_head(context) 
	stylesheet_link_tag('issue_dynamic_edit.css', :plugin => :redmine_issue_dynamic_edit)
  end
  
  def view_layouts_base_body_bottom(context) 
	javascript_include_tag('issue_dynamic_edit.js', :plugin => :redmine_issue_dynamic_edit)
  end

  def view_issues_show_details_bottom(context = { })
    project = context[:project]
    request = context[:request]
    issue_id = request.path_parameters[:id]
	back = request.env['HTTP_REFERER']
	
    if (issue_id)
      issue = Issue.find(issue_id)
	  if (issue)
		if (User.current.allowed_to?(:edit_issues, project))
		  o = ''
		  # o << issue.to_json
		  
		  # Status dropdown
		  o << userCanChangeStatus.to_json
		  statuses = issue.new_statuses_allowed_to(User.current)
          if (userCanChangeStatus && !statuses.empty?)
		    o << "<span class='dynamicEditSelect' id='statusListDropdown'>"
			o << "<div class='selectedValue'><span class='transparent'>#{issue.status}</span> <i class=\"fa fa-pencil fa-fw\" aria-hidden=\"true\"></i></div> "
			o << "<select data-issue='#{issue_id}'><option disabled='disabled' selected> </option>"
			statuses.each do |s|
				if (s != issue.status)
					o << "<option value='#{s.id}'>#{s.name}</option>"
				else
					o << "<option value='#{s.id}' selected>#{s.name}</option>"
				end
			end
			o << "</select><i class=\"fa fa-angle-down fa-fw dropdown\" aria-hidden=\"true\"></i></span>"
          end
		  
		  # Users dropdown
		  # userCanChangeAssignee = User.current.allowed_to?(:edit_assigned_to, @project, :global => true)
		  assignables = project.assignable_users
		  if (!assignables.empty?)
			o << "<span class='dynamicEditSelect' id='usersListDropdown'>"
			o << "<div class='selectedValue'><span class='transparent'>#{issue.assigned_to}</span> <i class=\"fa fa-pencil fa-fw\" aria-hidden=\"true\"></i></div> "
			o << "<select data-issue='#{issue_id}'><option disabled='disabled' selected> </option>"
			assignables.each do |u|
				if (u != issue.assigned_to)
					o << "<option value='#{u.id}'>#{u.name}</option>"
				else
					o << "<option value='#{u.id}' selected>#{u.name}</option>"
				end
			end
			o << "</select><i class=\"fa fa-angle-down fa-fw dropdown\" aria-hidden=\"true\"></i></span>"
          end
		  
		  # Priorities dropdown
		  priorities = IssuePriority.all
		  if(!priorities.empty?)
			o << "<span class='dynamicEditSelect' id='prioritiesListDropdown'>"
			o << "<div class='selectedValue'><span class='transparent'>#{issue.priority}</span> <i class=\"fa fa-pencil fa-fw\" aria-hidden=\"true\"></i></div> "
			o << "<select data-issue='#{issue_id}'><option disabled='disabled' selected> </option>"
			priorities.each do |p|
				if (p != issue.priority)
					o << "<option value='#{p.id}'>#{p.name}</option>"
				else
					o << "<option value='#{p.id}' selected>#{p.name}</option>"
				end
			end
			o << "</select><i class=\"fa fa-angle-down fa-fw dropdown\" aria-hidden=\"true\"></i></span>"
		  end
		  
		  # %done dropdown
		  percent = 0
		  o << "<span class='dynamicEditSelect' id='doneRatioListDropdown'>"
		  o << "<div class='selectedValue'><span class='transparent'>#{issue.done_ratio}%</span> <i class=\"fa fa-pencil fa-fw\" aria-hidden=\"true\"></i></div> "
		  o << "<select data-issue='#{issue_id}'><option disabled='disabled' selected> </option>"
		  loop do
			if (percent == issue.done_ratio)
					o << "<option value='#{percent}' selected>#{percent}%</option>"
				else
					o << "<option value='#{percent}'>#{percent}%</option>"
				end
			percent += 10
			if percent == 110
				break
			end
		  end
		  o << "</select><i class=\"fa fa-angle-down fa-fw dropdown\" aria-hidden=\"true\"></i></span>"
		  
		  # Estimated_time dropdown
		  o << "<span class='dynamicEditInput' id='EstimatedTimeInput'>"
		  o << "	<div class='selectedValue'><span class='transparent'>#{issue.estimated_hours}</span> <i class=\"fa fa-pencil fa-fw\" aria-hidden=\"true\"></i></div> "
		  o << "	<input type='text' value='#{issue.estimated_hours}' size='6'/>"
		  o << "<a href='#' class='btn btn-primary' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
		  o << "</span>"
		  
		  # Start date 
		  o << "<span class='dynamicEditInput' id='StartDateInput'>"
		  o << "	<div class='selectedValue'><span class='transparent'>XXXX/XX/XX</span> <i class=\"fa fa-pencil fa-fw\" aria-hidden=\"true\"></i></div> "
		  o << "	<input size=\"10\" value=\"#{issue.start_date}\" type=\"date\" max=\"#{issue.due_date}\">"
		  o << "<a href='#' class='btn btn-primary' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
		  o << "</span>"
		  o << "<script>"
		  o << "//<![CDATA[\n"
		  o << "	$(function() { $('#StartDateInput input').addClass('date').datepickerFallback(datepickerOptions); });\n"
		  o << "//]]>\n"
		  o << "</script>"
		  
		  # Due date 
		  o << "<span class='dynamicEditInput' id='DueDateInput'>"
		  o << "	<div class='selectedValue'><span class='transparent'>XXXX/XX/XX</span> <i class=\"fa fa-pencil fa-fw\" aria-hidden=\"true\"></i></div> "
		  o << "	<input size=\"10\" value=\"#{issue.due_date}\" type=\"date\" min=\"#{issue.start_date}\">"
		  o << "<a href='#' class='btn btn-primary' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
		  o << "</span>"
		  o << "<script>"
		  o << "//<![CDATA[\n"
		  o << "	$(function() { $('#DueDateInput input').addClass('date').datepickerFallback(datepickerOptions); });\n"
		  o << "//]]>\n"
		  o << "</script>"
		  
		end
	  end
	  
	  o << "<script>"
	  
	  o << " var _ISSUE_ID = \"#{issue_id}\";\n"
	  o << " var _USER_API_KEY = \"#{User.current.api_key}\";\n"
	  o << " var _TXT_ERROR_POSITIVE_NUMBER = \"" + l(:ide_txt_error_positive_number) + "\";\n"
	  o << " var _TXT_ERROR_START_DATE = \"" + l(:ide_txt_error_start_date) + "\";\n"
	  o << " var _TXT_ERROR_DUE_DATE = \"" + l(:ide_txt_error_due_date) + "\";\n"
	  
	  o << "</script>"
	  return o
    end
  end

end
