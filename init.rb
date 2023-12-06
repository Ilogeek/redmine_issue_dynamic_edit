require 'redmine'

require_relative './lib/details_issue_hooks.rb'

Redmine::Plugin.register :redmine_issue_dynamic_edit do
  name 'Redmine Dynamic edit Issue plugin'
  author 'Hugo Zilliox'
  description 'Allows users to dynamically update issue attributes in detailed view without refreshing the page (JIRA style)'
  version '0.9.2'
  url 'https://github.com/ilogeek/redmine_issue_dynamic_edit'
  author_url 'https://hzilliox.fr'
end
