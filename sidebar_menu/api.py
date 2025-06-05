import frappe
from collections import defaultdict

@frappe.whitelist()
def get_sidebar_menu():
    menus = frappe.get_all(
        "Sidebar Menu",
        filters={"is_hidden": 0},
        fields=["label", "name", "icon", "type", "link_type", "link_to", "external_link", "parent_menu", "category", "sequence_id"],
        order_by="sequence_id asc"
    )

    categories = frappe.get_all(
        "Sidebar Menu Category",
        filters={"is_hidden": 0},
        fields=["name", "label", "sequence_id"],
        order_by="sequence_id asc"
    )

    category_sequence_map = {cat.name: cat.sequence_id for cat in categories}
    category_label_map = {cat.name: cat.label for cat in categories}

    menu_map = {}
    for m in menus:
        if m.type == "Custom Link":
            route = m.external_link or "#"
        elif m.type == "Link" and m.link_to:
            slug = m.link_to.lower().replace(" ", "-")
            if m.link_type == "DocType":
                route = f"/app/{slug}"
            elif m.link_type == "Report":
                route = f"/app/query-report/{slug}"
            elif m.link_type in ["Page", "Workspace"]:
                route = f"/app/{slug}"
            else:
                route = "#"
        else:
            route = "#"

        menu_map[m.name] = {
            "label": m.label,
            "name": m.name,
            "icon": m.icon or "octicon-file-directory",
            "route": route,
            "children": [],
            "parent_menu": m.parent_menu,
            "category": m.category
        }

    root_items = []
    for m in menu_map.values():
        if m["parent_menu"] and m["parent_menu"] in menu_map:
            menu_map[m["parent_menu"]]["children"].append(m)
        else:
            root_items.append(m)

    categorized = defaultdict(list)
    for item in root_items:
        cat = item.get("category") or "Custom Menu"
        categorized[cat].append(item)

    result = []

    for cat in sorted(categories, key=lambda x: x.sequence_id or 0):
        result.append({
            "category": category_label_map[cat.name],
            "items": categorized.get(cat.name, [])
        })

    if "Custom Menu" in categorized:
        result.append({
            "category": "Custom Menu",
            "items": categorized["Custom Menu"]
        })

    return result
