# redmine_issue_dynamic_edit

Add new dropdowns elements on detailed issue page to dynamically update issue's status, assignee and priority directly in the details block of the issue
**You have to enable Redmine REST API** (`Administration` > `Settings` > `API` > check **Enable REST web service**)

### Example

![Gif that represents dynamic edition of field from the detailled issue's view](/doc/edit.gif)

### Installation

* Enable REST API
* Clone repo into plugins directory : `git clone https://github.com/Ilogeek/redmine_issue_dynamic_edit.git`
* Restart your Redmine instance

### Customization

Feel free to edit `assets/stylesheets/issue_dynamic_edit.css` to update the look of your fields depending on your current Redmine Theme
This plugin uses [FontAwesome icons](http://fontawesome.io/)