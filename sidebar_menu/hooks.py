app_name = "sidebar_menu"
app_title = "Sidebar Menu"
app_publisher = "aryacahil"
app_description = "Manage Your Menu"
app_email = "campgreget2@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "sidebar_menu",
# 		"logo": "/assets/sidebar_menu/logo.png",
# 		"title": "Sidebar Menu",
# 		"route": "/sidebar_menu",
# 		"has_permission": "sidebar_menu.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------
app_name = "sidebar_menu"
# include js, css files in header of desk.html
# app_include_css = "/assets/sidebar_menu/css/sidebar_menu.css"
app_include_js = "/assets/sidebar_menu/js/custom_sidebar.js"

# include js, css files in header of web template
# web_include_css = "/assets/sidebar_menu/css/sidebar_menu.css"
# web_include_js = "/assets/sidebar_menu/js/sidebar_menu.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "sidebar_menu/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "sidebar_menu/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "sidebar_menu.utils.jinja_methods",
# 	"filters": "sidebar_menu.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "sidebar_menu.install.before_install"
# after_install = "sidebar_menu.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "sidebar_menu.uninstall.before_uninstall"
# after_uninstall = "sidebar_menu.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "sidebar_menu.utils.before_app_install"
# after_app_install = "sidebar_menu.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "sidebar_menu.utils.before_app_uninstall"
# after_app_uninstall = "sidebar_menu.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "sidebar_menu.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {

# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"sidebar_menu.tasks.all"
# 	],
# 	"daily": [
# 		"sidebar_menu.tasks.daily"
# 	],
# 	"hourly": [
# 		"sidebar_menu.tasks.hourly"
# 	],
# 	"weekly": [
# 		"sidebar_menu.tasks.weekly"
# 	],
# 	"monthly": [
# 		"sidebar_menu.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "sidebar_menu.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "sidebar_menu.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "sidebar_menu.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["sidebar_menu.utils.before_request"]
# after_request = ["sidebar_menu.utils.after_request"]

# Job Events
# ----------
# before_job = ["sidebar_menu.utils.before_job"]
# after_job = ["sidebar_menu.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"sidebar_menu.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

