import frappe
from frappe import _

@frappe.whitelist()
def get_sidebar_menu_items():
    return {
        "doctypes": frappe.get_all("DocType", filters={"istable": 0}, fields=["name"]),
        "pages": frappe.get_all("Page", fields=["name"]),
        "reports": frappe.get_all("Report", fields=["name", "ref_doctype"]),
        "workspaces": frappe.get_all("Workspace", fields=["name", "title", "icon"])
    }

@frappe.whitelist()
def create_sidebar_menu_from_label(label):
    if frappe.db.exists("Sidebar Menu", {"label": label}):
        return {"exists": True, "label": label}

    items = get_sidebar_menu_items()

    link_type = None
    link_to = None
    icon = None

    dt_match = next((d for d in items.get("doctypes", []) if d.get("name") == label), None)
    if dt_match:
        link_type = "DocType"
        link_to = dt_match["name"]
        icon = "file"  
    else:
        pg_match = next((p for p in items.get("pages", []) if p.get("name") == label), None)
        if pg_match:
            link_type = "Page"
            link_to = pg_match["name"]
            icon = "file"  
        else:
            rp_match = next((r for r in items.get("reports", []) if r.get("name") == label), None)
            if rp_match:
                link_type = "Report"
                link_to = rp_match["name"]
                icon = "file"  
            else:
                ws_match = next((w for w in items.get("workspaces", []) if w.get("name") == label), None)
                if ws_match:
                    link_type = "Workspace"
                    link_to = ws_match["name"]
                    icon = ws_match.get("icon") or "star"
                else:
                    frappe.throw(f"Label '{label}' Not Found in DocType, Page, Report, or Workspace.")

    new_menu = frappe.new_doc("Sidebar Menu")
    new_menu.label = label
    new_menu.type = "Link"
    new_menu.link_type = link_type
    new_menu.link_to = link_to
    new_menu.icon = icon

    new_menu.insert(ignore_permissions=True)

    return {"exists": False, "name": new_menu.name, "label": label}

@frappe.whitelist()
def get_menu_structure_items():
    menu_items = frappe.get_all(
        'Sidebar Menu',
        filters={"is_hidden": 0},
        fields=[
            'name', 'label', 'type', 'link_type', 'link_to', 'external_link',
            'parent_menu', 'category', 'sequence_id', 'icon'
        ],
        order_by='sequence_id asc'
    )

    menu_categories = frappe.get_all(
        'Sidebar Menu Category',
        filters={"is_hidden": 0},
        fields=['name', 'label', 'sequence_id'],
        order_by='sequence_id asc'
    )

    for item in menu_items:
        item["is_category"] = False

    for category in menu_categories:
        menu_items.append({
            "name": category.name,
            "label": category.label,
            "is_category": True,
            "type": "Category"
        })

    return menu_items

@frappe.whitelist()
def create_menu_item(label, icon=None, type=None, link_type=None, link_to=None, external_link=None):
    if not label:
        frappe.throw("Label is required")

    new_doc = frappe.new_doc("Sidebar Menu")
    new_doc.label = label
    new_doc.icon = icon or ""
    new_doc.type = type or ""
    new_doc.link_type = link_type or ""
    new_doc.link_to = link_to or ""
    new_doc.external_link = external_link or ""
    new_doc.public = 1
    new_doc.insert(ignore_permissions=True)
    return new_doc

@frappe.whitelist()
def create_menu_category(label):
    if not label:
        frappe.throw("Label is required")

    new_doc = frappe.new_doc("Sidebar Menu Category")
    new_doc.label = label
    new_doc.public = 1
    new_doc.insert(ignore_permissions=True)
    return new_doc

@frappe.whitelist()
def update_menu_item(name, label, icon, type=None, link_type=None, link_to=None, external_link=None, parent_menu=None, category=None):
    doc = frappe.get_doc("Sidebar Menu", name)

    if label != doc.label:
        if frappe.db.exists("Sidebar Menu", label):
            frappe.throw(f'Label "{label}" Already used by other menus.')
        else:
            name = frappe.rename_doc("Sidebar Menu", doc.name, label)
            doc = frappe.get_doc("Sidebar Menu", name)

    doc.label = label
    doc.icon = icon

    if type is not None:
        doc.type = type
    if link_type is not None:
        doc.link_type = link_type
    if link_to is not None:
        doc.link_to = link_to
    if external_link is not None:
        doc.external_link = external_link
    if parent_menu is not None:
        doc.parent_menu = parent_menu
    if category is not None:
        doc.category = category

    doc.save(ignore_permissions=True)

    return {
        "status": "updated",
        "name": doc.name,
        "label": doc.label,
        "icon": doc.icon,
        "type": doc.type,
        "link_type": doc.link_type,
        "link_to": doc.link_to,
        "external_link": doc.external_link,
        "parent_menu": doc.parent_menu,
        "category": doc.category
    }

@frappe.whitelist()
def get_sidebar_menu_info(name):
    doc = frappe.get_doc("Sidebar Menu", name)
    return {
        "name": doc.name,
        "label": doc.label,
        "icon": doc.icon,
        "type": doc.type,
        "link_type": doc.link_type,
        "link_to": doc.link_to,
        "external_link": doc.external_link,
        "parent_menu": doc.parent_menu,
        "category": doc.category,
        "sequence_id": doc.sequence_id,
        "is_hidden": doc.is_hidden,
    }

@frappe.whitelist()
def update_sidebar_menu_category(name, new_name):
    if name == new_name:
        return {"status": "unchanged", "name": name}

    if frappe.db.exists("Sidebar Menu Category", new_name):
        frappe.throw(_("Category with label <strong>{0}</strong> already exists").format(new_name))

    frappe.flags.ignore_permissions = True
    try:
        frappe.rename_doc("Sidebar Menu Category", name, new_name)
    finally:
        frappe.flags.ignore_permissions = False

    frappe.db.set_value("Sidebar Menu", {"category": name}, "category", new_name, update_modified=False)

    return {"status": "renamed", "old_name": name, "new_name": new_name}

@frappe.whitelist()
def hide_sidebar_menu_category(name):
    frappe.db.set_value("Sidebar Menu Category", name, "is_hidden", 1)

    frappe.db.set_value("Sidebar Menu", {"category": name}, "category", None, update_modified=False)

    frappe.db.commit()
    return {"status": "success"}

@frappe.whitelist()
def delete_sidebar_menu_category(name):
    if not frappe.db.exists("Sidebar Menu Category", name):
        frappe.throw(_("Category {0} not found").format(name))

    frappe.db.set_value("Sidebar Menu", {"category": name}, "category", None, update_modified=False)

    frappe.delete_doc("Sidebar Menu Category", name, ignore_permissions=True)

    return {"status": "deleted", "category": name}

@frappe.whitelist()
def get_hidden_sidebar_menu_items_and_categories():
    hidden_menus = frappe.get_all(
        "Sidebar Menu",
        filters={"is_hidden": 1},
        fields=["name", "label", "icon", "sequence_id", "type", "link_type", "link_to"]
    )
    
    hidden_categories = frappe.get_all(
        "Sidebar Menu Category",
        filters={"is_hidden": 1},
        fields=["name", "label", "sequence_id"]
    )
    
    return {
        "hidden_menus": hidden_menus,
        "hidden_categories": hidden_categories
    }

@frappe.whitelist()
def save_menu_structure(structure):
    import json
    structure = json.loads(structure)

    for item in structure:
        name = item.get('name')
        parent = item.get('parent_menu') or ''
        category = item.get('category') or ''
        idx = item.get('sequence_id') or 0

        if item.get('doctype') == 'Sidebar Menu Category':
            if frappe.db.exists('Sidebar Menu Category', name):
                try:
                    frappe.db.set_value('Sidebar Menu Category', name, {
                        'sequence_id': idx
                    })
                except Exception as e:
                    frappe.log_error(str(e), 'Sidebar Menu Category Update Error')
        else:
            if frappe.db.exists('Sidebar Menu', name):
                try:
                    frappe.db.set_value('Sidebar Menu', name, {
                        'parent_menu': parent,
                        'category': category,
                        'sequence_id': idx
                    })
                except Exception as e:
                    frappe.log_error(str(e), 'Sidebar Menu Update Error')

    frappe.db.commit()
    return {'status': 'ok'}

@frappe.whitelist()
def unhide_sidebar_menu_items(item_names):
    import json

    try:
        item_names = json.loads(item_names)
    except Exception:
        frappe.throw(_("Invalid input format."))

    if not isinstance(item_names, list):
        frappe.throw(_("Expected a list of item names."))

    for name in item_names:
        if frappe.db.exists("Sidebar Menu", name):
            frappe.db.set_value("Sidebar Menu", name, "is_hidden", 0, update_modified=False)
        elif frappe.db.exists("Sidebar Menu Category", name):
            frappe.db.set_value("Sidebar Menu Category", name, "is_hidden", 0, update_modified=False)

    frappe.db.commit()
    return {"status": "success", "message": _("Selected Menu have been restored.")}

@frappe.whitelist()
def hide_menu_item(name: str):
    if not name:
        frappe.throw("Menu name is required")

    if not frappe.db.exists("Sidebar Menu", name):
        frappe.throw(f"Sidebar Menu '{name}' not found")

    child_menus = frappe.get_all(
        "Sidebar Menu",
        filters={"parent_menu": name},
        pluck="name"
    )

    for child in child_menus:
        frappe.db.set_value("Sidebar Menu", child, "is_hidden", 1)

    frappe.db.set_value("Sidebar Menu", name, "is_hidden", 1)

    frappe.clear_cache(doctype="Sidebar Menu")

    return {
        "status": "hidden",
        "name": name,
        "children_hidden": child_menus,
    }

@frappe.whitelist()
def remove_menu_item(name: str):
    if not name:
        frappe.throw("Menu name is required")

    if not frappe.db.exists("Sidebar Menu", name):
        frappe.throw(f"Sidebar Menu '{name}' not found")

    child_menus = frappe.get_all(
        "Sidebar Menu",
        filters={"parent_menu": name},
        pluck="name"
    )

    for child in child_menus:
        frappe.delete_doc("Sidebar Menu", child, force=True)

    frappe.delete_doc("Sidebar Menu", name, force=True)

    return {
        "status": "deleted",
        "name": name,
        "children_deleted": child_menus,
    }

@frappe.whitelist()
def hide_all_menu_items_and_categories():
    frappe.db.sql("""UPDATE `tabSidebar Menu` SET is_hidden = 1""")
    frappe.db.sql("""UPDATE `tabSidebar Menu Category` SET is_hidden = 1""")
    frappe.clear_cache(doctype="Sidebar Menu")
    frappe.clear_cache(doctype="Sidebar Menu Category")
    return {"status": "all_hidden"}

@frappe.whitelist()
def remove_all_menu_items():
    menu_items = frappe.get_all(
        "Sidebar Menu",
        filters={
            "is_hidden": 0
        },
        pluck="name"
    )

    for name in menu_items:
        frappe.delete_doc("Sidebar Menu", name, force=True)

    categories = frappe.get_all(
        "Sidebar Menu Category",
        pluck="name"
    )

    for category in categories:
        frappe.delete_doc("Sidebar Menu Category", category, force=True)

    return {
        "status": "visible_sidebar_and_categories_deleted",
        "sidebar_menu_deleted": len(menu_items),
        "categories_deleted": len(categories),
    }

@frappe.whitelist()
def update_menu_category_bulk(items, category):
    import json
    items = json.loads(items) if isinstance(items, str) else items

    for name in items:
        if frappe.db.exists('Sidebar Menu', name):
            frappe.db.set_value('Sidebar Menu', name, 'category', category)
    
    frappe.db.commit()
