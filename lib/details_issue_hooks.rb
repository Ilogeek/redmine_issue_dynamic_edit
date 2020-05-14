class DetailsIssueHooks < Redmine::Hook::ViewListener
  def protect_against_forgery?
    false
  end

  def current_is_detail_page(context)
    # check if we see an issue but not creating a new one or on the specific edit page
    ret = context[:controller] && context[:controller].is_a?(IssuesController) && context[:request].original_url.rindex(/\/issues\/\S+/) && !context[:request].original_url.rindex(/\/issues\/new/) && !context[:request].original_url.rindex(/\/issues\/\d+\/edit/)
  end

  def view_layouts_base_html_head(context)
    return unless current_is_detail_page(context)

    if User.current.allowed_to?(:edit_issues, context[:project])
      stylesheet_link_tag('issue_dynamic_edit.css', :plugin => :redmine_issue_dynamic_edit)
    end
  end

  def view_layouts_base_body_bottom(context)
    return unless current_is_detail_page(context)

    if User.current.allowed_to?(:edit_issues, context[:project])
      javascript_include_tag('issue_dynamic_edit_configuration_file.js', 'issue_dynamic_edit.js', :plugin => :redmine_issue_dynamic_edit)
    end
  end

  def view_issues_show_details_bottom(context = {})
    project = context[:project]
    request = context[:request]
    issue_id = request.path_parameters[:id]
    back = request.env['HTTP_REFERER']

    o = ''

    if issue_id
      issue = Issue.find(issue_id)
      readOnlyAttributes = issue.read_only_attribute_names(User.current)
      requiredAttributes = issue.required_attribute_names(User.current) & issue.safe_attribute_names(User.current)

      # o << requiredAttributes.to_json

      allRequiredFieldsFilled = true
      requiredAttributes.each do |attr|
        if issue.read_attribute(attr).to_s.empty?
          allRequiredFieldsFilled = false
        end
      end

      if issue
        if User.current.allowed_to?(:edit_issues, project)
          # if there's a JS error, we hide the generated values
          o << '<div style="display:none">'

          # Status dropdown
          statuses = issue.new_statuses_allowed_to(User.current)
          if (
            !statuses.empty? &&
            !readOnlyAttributes.include?('status_id') &&
            allRequiredFieldsFilled
          )
            o << "<span class='dynamicEdit' id='statusListDropdown'>"
            o << "<select data-issue='#{issue_id}'>"
            o << "<option disabled='disabled' selected> </option>"
            statuses.each do |s|
              if (s != issue.status)
                o << "<option value='#{s.id}'>#{s.name}</option>"
              else
                o << "<option value='#{s.id}' selected>#{s.name}</option>"
              end
            end

            o << "</select>"
            o << " <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
            o << "</span>"
          end

          # Users dropdown
          assignables = project.assignable_users
          if (
            !assignables.empty? &&
            !readOnlyAttributes.include?('assigned_to_id')
          )
            o << "<span class='dynamicEdit' id='usersListDropdown'>"
            o << "<select data-issue='#{issue_id}'>"
            o << "<option disabled='disabled' selected> </option>"

            assignables.each do |u|
              if (u != issue.assigned_to)
                o << "<option value='#{u.id}'>#{u.name}</option>"
              else
                o << "<option value='#{u.id}' selected>#{u.name}</option>"
              end
            end

            o << "</select>"
            o << " <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
            o << "</span>"
          end

          # Priorities dropdown
          priorities = IssuePriority.all

          if !priorities.empty? && !(readOnlyAttributes.include? 'priority_id')
            o << "<span class='dynamicEdit' id='prioritiesListDropdown'>"
            o << "<select data-issue='#{issue_id}'>"
            o << "<option disabled='disabled' selected> </option>"

            priorities.each do |p|
              if (p != issue.priority)
                o << "<option value='#{p.id}'>#{p.name}</option>"
              else
                o << "<option value='#{p.id}' selected>#{p.name}</option>"
              end
            end

            o << "</select>"
            o << "  <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
            o << "</span>"
          end

          # Categories dropdown
          categories = project.issue_categories

          if !categories.empty? && !(readOnlyAttributes.include? 'category_id')
            o << "<span class='dynamicEdit' id='categoriesListDropdown'>"
            o << "<select data-issue='#{issue_id}'>"
            o << "<option value='' selected> </option>"

            categories.each do |c|
              if (c != issue.category)
                o << "<option value='#{c.id}'>#{c.name}</option>"
              else
                o << "<option value='#{c.id}' selected>#{c.name}</option>"
              end
            end

            o << "</select>"
            o << "  <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
            o << "</span>"
          end

          # %done dropdown
          if ! readOnlyAttributes.include?('done_ratio')
            percent = 0
            o << "<span class='dynamicEdit' id='doneRatioListDropdown'>"
            o << "<select data-issue='#{issue_id}'>"
            o << "<option disabled='disabled' selected> </option>"

            loop do
              if percent == issue.done_ratio
                o << "<option value='#{percent}' selected>#{percent}%</option>"
              else
                o << "<option value='#{percent}'>#{percent}%</option>"
              end
              percent += 10

              break if percent == 110
            end

            o << "</select>"
            o << "  <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
            o << "</span>"
          end

          # Estimated_time dropdown
          if ! readOnlyAttributes.include?('estimated_hours')
            o << "<span class='dynamicEdit' id='EstimatedTimeInput'>"
            o << "  <input type='text' value='#{issue.estimated_hours}' size='6'/>"
            o << "<a href='#' class='btn btn-primary validate' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
            o << "  <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
            o << "</span>"
          end

          # Start date
          if ! readOnlyAttributes.include?('start_date')
            o << "<span class='dynamicEdit' id='StartDateInput'>"
            o << "  <input size=\"10\" value=\"#{issue.start_date}\" type=\"date\" max=\"#{issue.due_date}\">"
            o << " <a href='#' class='btn btn-primary validate' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
            o << " <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
            o << "</span>"
            o << "<script>"
            o << "//<![CDATA[\n"
            o << "  if(typeof datepickerOptions !== 'undefined'){\n"
            o << "    $(function() { $('#StartDateInput input').addClass('date').datepickerFallback(datepickerOptions); });\n"
            o << "  }\n"
            o << "//]]>\n"
            o << "</script>"
          end

          # Due date
          if ! readOnlyAttributes.include?('due_date')
            o << "<span class='dynamicEdit' id='DueDateInput'>"
            o << "  <input size=\"10\" value=\"#{issue.due_date}\" type=\"date\" min=\"#{issue.start_date}\">"
            o << " <a href='#' class='btn btn-primary validate' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
            o << " <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
            o << "</span>"
            o << "<script>"
            o << "//<![CDATA[\n"
            o << "  if(typeof datepickerOptions !== 'undefined'){\n"
            o << "    $(function() { $('#DueDateInput input').addClass('date').datepickerFallback(datepickerOptions); });\n"
            o << "  }\n"
            o << "//]]>\n"
            o << "</script>"
          end

          # Title
          # Make quotings in subject! (PP)
          clonesubject = issue.subject.gsub('"','&quot;')
          o << "<span class='dynamicEdit' id='TitleInput'>"
          o << "	<input size=\"50\" value=\"#{clonesubject}\" type=\"text\">"
          o << " <a href='#' class='btn btn-primary validate' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
          o << " <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a>"
          o << "<script>"
          o << "//<![CDATA[\n"
          o << "  function resizeTitleInput() {\n"
          o << "    $('#TitleInput input')[0].size = Math.max(50, Math.floor(window.innerWidth / 11));\n"
          o << "  }\n"
          o << "  resizeTitleInput();\n"
          o << "  window.addEventListener('resize', resizeTitleInput);\n"
          o << "//]]>\n"
          o << "</script>"
          o << "</span>"

          # Description
          o << "<span class='dynamicEdit' id='DescriptionInput'>"
          o << "  <textarea name='description' id='description_textarea' cols='60' rows='10' style='width:calc(100\% - 10px)'>#{issue.description}</textarea>"
          o << " <div style='display:block; text-align:right; margin-top:10px;'><a href='#' class='btn btn-primary validate' aria-label='" + l(:ide_txt_validation_btn) + "'><i class='fa fa-check fa-fw' aria-hidden='true'></i></a>"
          o << " <a href='#' class='btn btn-primary close' aria-label='" + l(:ide_txt_cancel_btn) + "'><i class='fa fa-times fa-fw' aria-hidden='true'></i></a></div>"
          o << "</span>"

          # JS Part at the end of the edit block
          o << "<script>"

          o << " var CF_VALUE_JSON = " + issue.editable_custom_field_values(User.current).to_json + ";\n"

          o << " var _ISSUE_ID = \"#{issue_id}\";\n"
          o << " var _USER_API_KEY = \"#{User.current.api_key}\";\n"
          o << " var _BASE_REDMINE_PATH = \"#{Redmine::Utils.relative_url_root}\";\n"

          # Translations text
          o << " var _TXT_VALIDATION_BTN = \"" + l(:ide_txt_validation_btn) + "\";\n"
          o << " var _TXT_CANCEL_BTN = \"" + l(:ide_txt_cancel_btn) + "\";\n"
          o << " var _TXT_ERROR_POSITIVE_NUMBER = \"" + l(:ide_txt_error_positive_number) + "\";\n"
          o << " var _TXT_ERROR_START_DATE = \"" + l(:ide_txt_error_start_date) + "\";\n"
          o << " var _TXT_ERROR_DUE_DATE = \"" + l(:ide_txt_error_due_date) + "\";\n"
          o << " var _TXT_ERROR_AJAX_CALL = \"" + l(:ide_txt_error_ajax_call) + "\";\n"
          o << " var _TXT_REQUIRED_FIELD = \"" + l(:ide_txt_required_field) + "\";\n"
          o << "</script>\n"

          o << "<div style='display:none' id='required_field_array'>#{requiredAttributes.to_json}</div>\n"

          # closing the display none div parent
          o << "</div>"
        end
      end

      return o

    end
  end
end
