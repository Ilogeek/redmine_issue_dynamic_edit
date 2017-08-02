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
          statuses = issue.new_statuses_allowed_to(User.current)
          if (!statuses.empty?)
		    o << "<span class='dynamicEditSelect' id='statusListDropdown'><select data-issue='#{issue_id}'>"
			statuses.each do |s|
				if (s != issue.status)
					o << "<option value='#{s.id}'>#{s.name}</option>"
				else
					o << "<option value='#{s.id}' selected>#{s.name}</option>"
				end
			end
			o << "</select><i class=\"fa fa-pencil fa-fw dropdown\" aria-hidden=\"true\"></i></span>"
          end
		  assignables = project.assignable_users
		  if (!assignables.empty?)
			o << "<span class='dynamicEditSelect' id='usersListDropdown'><select data-issue='#{issue_id}'>"
			assignables.each do |u|
				if (u != issue.assigned_to)
					o << "<option value='#{u.id}'>#{u.name}</option>"
				else
					o << "<option value='#{u.id}' selected>#{u.name}</option>"
				end
			end
			o << "</select><i class=\"fa fa-pencil fa-fw dropdown\" aria-hidden=\"true\"></i></span>"
          end
		  
		  priorities = IssuePriority.all
		  if(!priorities.empty?)
			o << "<span class='dynamicEditSelect' id='prioritiesListDropdown'><select data-issue='#{issue_id}'>"
			priorities.each do |p|
				if (p != issue.priority)
					o << "<option value='#{p.id}'>#{p.name}</option>"
				else
					o << "<option value='#{p.id}' selected>#{p.name}</option>"
				end
			end
			o << "</select><i class=\"fa fa-pencil fa-fw dropdown\" aria-hidden=\"true\"></i></span>"
		  end
		end
	  end
	  
	  o << "<script>"
	  
	  o << " var _ISSUE_ID = \"#{issue_id}\";"
	  o << " var _USER_API_KEY = \"#{User.current.api_key}\";"
	  
	  o << "</script>"
	  return o
    end
  end

end
