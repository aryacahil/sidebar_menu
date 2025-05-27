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

def get_app_from_module(module_name):
    module_def = frappe.db.get_value("Module Def", module_name, "app_name")
    return module_def or None

@frappe.whitelist() # MASIH BELUM JADI
def create_workspace_from_label(label):
    original_label = label

    if frappe.db.exists("Workspace", {"label": label}):
        return {"exists": True, "label": label}

    items = get_sidebar_menu_items()
    
    link_type = None
    link_to_name = None
    app_name = None
    
    dt_match = next((d for d in items["doctypes"] if d["name"] == original_label), None)
    if dt_match:
        link_type = "DocType"
        link_to_name = dt_match["name"]
        dt = frappe.get_doc("DocType", link_to_name)
        module_name = dt.module or module_name
        app_name = get_app_from_module(module_name)
    else:
        pg_match = next((p for p in items["pages"] if p["name"] == original_label), None)
        if pg_match:
            link_type = "Page"
            link_to_name = pg_match["name"]
            pg = frappe.get_doc("Page", link_to_name)
            module_name = pg.module or module_name
            app_name = get_app_from_module(module_name)
        else:
            rp_match = next((r for r in items["reports"] if r["name"] == original_label), None)
            if rp_match:
                link_type = "Report"
                link_to_name = rp_match["name"]
                rp = frappe.get_doc("Report", link_to_name)
                module_name = rp.module or module_name
                app_name = get_app_from_module(module_name)
            else:
                frappe.throw(f"Label '{original_label}' Doctype, Page, atau Report not valid.")

    workspace_label = f"{original_label} Workspace"
    if frappe.db.exists("Workspace", {"label": workspace_label}):
        return {"exists": True, "label": workspace_label}

    default_content = [{"type": "header", "data": {"text": workspace_label}}]

    new_workspace = frappe.new_doc("Workspace")
    new_workspace.label = workspace_label
    new_workspace.title = original_label
    new_workspace.module = module_name
    new_workspace.public = 1
    new_workspace.sequence_id = 0
    new_workspace.content = frappe.as_json(default_content)
    new_workspace.app = app_name or ""
    new_workspace.type = "Link"
    new_workspace.link_type = link_type
    new_workspace.link_to = link_to_name

    new_workspace.append("links", {
        "label": original_label,
        "type": "Link",
        "link_type": link_type,
        "link_to": link_to_name
    })

    new_workspace.insert(ignore_permissions=True)

    return {"exists": False, "name": new_workspace.name, "label": workspace_label}

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

@frappe.whitelist() # MASIH BELUM JADI
def update_menu_item(name, title, icon, public, type=None, link_type=None, link_to=None, external_link=None):
    public = frappe.parse_json(public)
    doc = frappe.get_doc("Workspace", name)

    if not doc.get("public") and doc.get("for_user") != frappe.session.user and not frappe.has_role("Workspace Manager"):
        frappe.throw(_("Need Workspace Manager role to edit private workspace of other users"), frappe.PermissionError)

    child_docs = frappe.get_all("Workspace", filters={"parent_page": doc.label, "public": doc.public})

    doc.title = title
    doc.icon = icon

    if type is not None:
        doc.type = type
    if link_type is not None:
        doc.link_type = link_type
    if link_to is not None:
        doc.link_to = link_to
    if external_link is not None:
        doc.external_link = external_link

    if doc.public != public:
        doc.sequence_id = frappe.db.count("Workspace", {"public": public}, cache=True)
        doc.public = public

    doc.for_user = "" if public else doc.for_user or frappe.session.user

    doc.save(ignore_permissions=True)

    for child in child_docs:
        child_doc = frappe.get_doc("Workspace", child.name)
        child_doc.parent_page = doc.label  
        if child_doc.public != public:
            child_doc.public = public
        child_doc.for_user = "" if public else child_doc.for_user or frappe.session.user
        child_doc.save(ignore_permissions=True)

    frappe.clear_cache(doctype="Workspace")

    return {
        "status": "updated",
        "name": name,
        "label": doc.label,
        "title": title,
        "icon": icon,
        "public": public,
        "type": type,
        "link_type": link_type,
        "link_to": link_to,
        "external_link": external_link,
        "route": f"app/{doc.label}"
    }

@frappe.whitelist() # MASIH BELUM JADI
def get_workspace_info(name):
    doc = frappe.get_doc("Workspace", name)
    return {
        "name": doc.name,
        "title": doc.title,
        "icon": doc.icon,
        "public": doc.public,
        "type": doc.type,
        "link_type": doc.link_type,
        "link_to": doc.link_to,
        "external_link": doc.external_link,
    }
    
@frappe.whitelist()
def get_hidden_sidebar_menu_items():
    hidden_items = frappe.get_all(
        "Sidebar Menu",
        filters={"is_hidden": 1},
        fields=["name", "label", "icon", "sequence_id", "type", "link_type", "link_to"]
    )
    return hidden_items

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
        frappe.throw(_("Expected a list of menu item names."))

    for name in item_names:
        if frappe.db.exists("Sidebar Menu", name):
            frappe.db.set_value("Sidebar Menu", name, "is_hidden", 0)

    frappe.db.commit()
    return {"status": "success", "message": _("Menu items restored to structure.")}


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
def hide_all_menu_items():
    frappe.db.sql("""UPDATE `tabWorkspace` SET is_hidden = 1""")
    frappe.clear_cache(doctype="Workspace")
    return {"status": "all_hidden"}

@frappe.whitelist()
def remove_all_menu_items():
    menu_items = frappe.get_all(
        "Workspace",
        filters={
            "is_hidden": 0
        },
        pluck="name"
    )
    
    for name in menu_items:
        frappe.delete_doc("Workspace", name, force=True)

    return {"status": "visible_deleted", "count": len(menu_items)}

@frappe.whitelist()
def update_menu_category_bulk(items, category):
    import json
    items = json.loads(items) if isinstance(items, str) else items

    for name in items:
        if frappe.db.exists('Sidebar Menu', name):
            frappe.db.set_value('Sidebar Menu', name, 'category', category)
    
    frappe.db.commit()
