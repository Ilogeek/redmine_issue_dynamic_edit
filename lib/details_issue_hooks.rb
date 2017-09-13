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

	o = ''
	
    if (issue_id)
      issue = Issue.find(issue_id)
	  if (issue)
		if (User.current.allowed_to?(:edit_issues, project))
		  
		  # if there's a JS error, we hide the generated values
		  o << '<div style="display:none">'
		  
		  # Status dropdown
		  statuses = issue.new_statuses_allowed_to(User.current)
          if (!statuses.empty?)
		    o << "<span class='dynamicEdit' id='statusListDropdown'>"
			o << "<select data-issue='#{issue_id}'><option disabled='disabled' selected> </option>"
			statuses.each do |s|
				if (s != issue.status)
					o << "<option value='#{s.id}'>#{s.name}</option>"
				else
					o << "<option value='#{s.id}' selected>#{s.name}</option>"
				end
			end
			o << "</select> <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a></span>"
          end
		  
		  # Users dropdown
		  assignables = project.assignable_users
		  o << assignables.to_json
		  if (!assignables.empty?)
			o << "<span class='dynamicEdit' id='usersListDropdown'>"
			o << "<select data-issue='#{issue_id}'><option disabled='disabled' selected> </option>"
			assignables.each do |u|
				if (u != issue.assigned_to)
					o << "<option value='#{u.id}'>#{u.name}</option>"
				else
					o << "<option value='#{u.id}' selected>#{u.name}</option>"
				end
			end
			o << "</select> <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a></span>"
          end
		  
		  # Priorities dropdown
		  priorities = IssuePriority.all
		  if(!priorities.empty?)
			o << "<span class='dynamicEdit' id='prioritiesListDropdown'>"
			o << "<select data-issue='#{issue_id}'><option disabled='disabled' selected> </option>"
			priorities.each do |p|
				if (p != issue.priority)
					o << "<option value='#{p.id}'>#{p.name}</option>"
				else
					o << "<option value='#{p.id}' selected>#{p.name}</option>"
				end
			end
			o << "</select>  <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a></span>"
		  end
		  
		  # %done dropdown
		  percent = 0
		  o << "<span class='dynamicEdit' id='doneRatioListDropdown'>"
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
		  o << "</select>  <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a></span>"
		  
		  # Estimated_time dropdown
		  o << "<span class='dynamicEdit' id='EstimatedTimeInput'>"
		  o << "	<input type='text' value='#{issue.estimated_hours}' size='6'/>"
		  o << "<a href='#' class='btn btn-primary validate' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
		  o << "  <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
		  o << "</span>"
		  
		  # Start date 
		  o << "<span class='dynamicEdit' id='StartDateInput'>"
		  o << "	<input size=\"10\" value=\"#{issue.start_date}\" type=\"date\" max=\"#{issue.due_date}\">"
		  o << " <a href='#' class='btn btn-primary validate' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
		  o << " <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
		  o << "</span>"
		  o << "<script>"
		  o << "//<![CDATA[\n"
		  o << "	$(function() { $('#StartDateInput input').addClass('date').datepickerFallback(datepickerOptions); });\n"
		  o << "//]]>\n"
		  o << "</script>"
		  
		  # Due date 
		  o << "<span class='dynamicEdit' id='DueDateInput'>"
		  o << "	<input size=\"10\" value=\"#{issue.due_date}\" type=\"date\" min=\"#{issue.start_date}\">"
		  o << " <a href='#' class='btn btn-primary validate' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
		  o << " <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
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
	  o << " var _BASE_REDMINE_PATH = \"#{Redmine::Utils.relative_url_root}\";\n"

	  # Translations text
	  o << " var _TXT_ERROR_POSITIVE_NUMBER = \"" + l(:ide_txt_error_positive_number) + "\";\n"
	  o << " var _TXT_ERROR_START_DATE = \"" + l(:ide_txt_error_start_date) + "\";\n"
	  o << " var _TXT_ERROR_DUE_DATE = \"" + l(:ide_txt_error_due_date) + "\";\n"
	  o << " var _TXT_ERROR_AJAX_CALL = \"" + l(:ide_txt_error_ajax_call) + "\";\n"
	  
	  o << "</script>"

	  # closing the display none div parent
	  o << "</div>"
	  return o
    end
  end

end
