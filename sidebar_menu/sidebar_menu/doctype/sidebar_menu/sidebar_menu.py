# Copyright (c) 2025, aryacahil and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class SidebarMenu(Document):
    def after_save(self):
        frappe.publish_realtime("custom_sidebar_menu_updated")
