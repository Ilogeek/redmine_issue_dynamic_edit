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

  def view_issues_show_details_bottom(context)
    content = "<script>\n"
    content << " var _TXT_CONFLICT_TITLE = \"" + l(:ide_txt_notice_conflict_title) + "\";\n"
    content << " var _TXT_CONFLICT_TXT = \"" + l(:ide_txt_notice_conflict_text) + "\";\n"
    content << "</script>\n"
    content << "<style>/* PRINT MEDIAQUERY */\n"
    content << "@media print {\n" 
    content << "body.controller-issues.action-show div.issue.details .subject .refreshData,\n"
    content << "body.controller-issues.action-show div.issue.details .iconEdit,\n"
    content << "body.controller-issues.action-show .dynamicEditField {\n"
    content << "display : none !important;\n"
    content << "height: 0;\n"
    content << "width: 0;\n"
    content << "overflow: hidden;\n"
    content << "padding : 0;\n"
    content << "margin: 0;\n"
    content << "}\n"
    content << "}</style>\n"
    return content.html_safe
  end

end
