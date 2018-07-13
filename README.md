# redmine_issue_dynamic_edit

Add new elements on detailed issue page to **dynamically update issue's attributes and custom fields**, directly in the details block of the issue **without any page refresh** (*JIRA style*).


### 🔴  What info you should provide when opening an issue
>This plugin use JS a lot. Check your JS console from your web browser ( [HowTo](https://webmasters.stackexchange.com/a/77337) ) and try again to reproduce your issue. You'll see some information about what goes wrong. 
>
>Copy and paste the result that appears in your console in the Github issue and expand all possible object (error data for example). With this data, we can look if there's a problem with the ajax call the plugin performs to update the issue or if there's any JS error.

### Example

![Gif that represents dynamic edition of field from the detailled issue's view](/doc/edit.gif)

### Installation

* Clone repo into plugins directory : `git clone https://github.com/Ilogeek/redmine_issue_dynamic_edit.git` (be sure that the parent folder is called `redmine_issue_dynamic_edit`)
* Restart your Redmine instance

### Customization

Feel free to edit `assets/stylesheets/issue_dynamic_edit.css` to update the look of your fields depending on your current Redmine Theme. 

This plugin uses [FontAwesome icons](http://fontawesome.io/)

### Changelog

* **v.0.6.4** : version field with checkbox display is now supported (Github request #24)
* **v 0.6.3** : fixed Github issue #22 : DatepickerFallback raised an error
* **v 0.6.2** : fixed Github issue #22 : long description is now supported (no more 414 errors)
* **v 0.6.1** : fixed Github issue #20
* **v 0.6.0** : **NOW WITH CUSTOM FIELDS SUPPORT** ! (Github #19)
* **v 0.5.0** : fixed Github issue #18 : textarea fixed (jstoolbar or ckeditor)
* **v 0.4.9** : fixed Github issue #17 : Datepicker fallback added for date fields
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