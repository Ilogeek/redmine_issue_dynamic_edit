# redmine_issue_dynamic_edit

Add new elements on detailed issue page to dynamically update issue's title, status, assignee, priority, start and due dates, ratio and estimated time fields, directly in the details block of the issue without any page refresh (JIRA style).

### Example

![Gif that represents dynamic edition of field from the detailled issue's view](/doc/edit.gif)

### Installation

* Clone repo into plugins directory : `git clone https://github.com/Ilogeek/redmine_issue_dynamic_edit.git` (be sure that the parent folder is called `redmine_issue_dynamic_edit`)
* Restart your Redmine instance

### Customization

Feel free to edit `assets/stylesheets/issue_dynamic_edit.css` to update the look of your fields depending on your current Redmine Theme. 

This plugin uses [FontAwesome icons](http://fontawesome.io/)

### Changelog

* **v 0.4.8** : fixed Github issues #15 and #16
* **v 0.4.7** : if error on dynamic update, put back old values in details block (fixed Github issue #8)
* **v 0.4.6** : description is now dynamically editable (edit field appears if there's already a description written) (Github request #14)
* **v 0.4.5** : fixed Github issue #13 : CSS display for custom attributes, added Title dynamic edition (Github request #14)
* **v 0.4.4** : fixed Github issues #6, #12 : User can't update status until all required field are filled for this step of the issue
* **v 0.4.3** : partially fixed Github issue #12 : Read only attributes can't be edited anymore. Dynamic refresh for read only attributes when status changes
* **v 0.4.2** : fixed Github issue #10 : History list updated after modification
* **v 0.4.1** : fixed Github issue #7 : update status list to follow Redmine workflow
* **v 0.4.0** : fixed Github issues #2, #4, #9. Edited dropdown display
* **v 0.3.0** : start date, due date, ratio and estimated time fields are now dynamically editable. Translation files added (en, fr). Log added in console when AJAX fails
* **v 0.2.0** : fixed "conflict" when trying to add a note after an update from dropdowns. New method used, REST API is not required anymore
* **v 0.1.0** : initial commit