# 📚 Sidebar Menu for Frappe

A modern and flexible Sidebar Menu Builder for Frappe/ERPNext. This app lets you create a **custom global sidebar menu** with drag-and-drop, category grouping, and visibility toggling — fully independent from Workspace.

---

## ✨ Features

- 🔧 **Drag & Drop Menu Builder** (powered by SortableJS)
- 🗂️ **Category Support**: Group menu items into collapsible sections
- 🧩 **Support for Links**: Doctype, Page, Report, Workspace, or Custom Link
- 👁️ **Hide/Show Menu Items** with a simple toggle
- 💾 **Auto Save & Persistent Structure**
- 🖼️ Fully integrated UI with the look and feel of Frappe

---

## 🖥️ Preview

| Sidebar Menu Builder Page | Menu Structure with Categories |
|---------------------------|-------------------------------|
| ![Builder Screenshot](./screenshot-builder.png) | ![Menu Screenshot](./screenshot-structure.png) |

> Replace `screenshot-builder.png` and `screenshot-structure.png` with your actual file names in the repo.

---

## 🚀 Installation

```bash
# Inside your bench directory:
bench get-app sidebar_menu https://github.com/your-username/sidebar_menu
bench --site your-site install-app sidebar_menu
bench build
🛠️ Usage
Open Sidebar Menu Builder from the AwesomeBar or via /app/sidebar-menu-builder.

Drag & drop items from "Sidebar Menu Items" to "Menu Structure".

Use the dropdown to edit, hide, or delete.

Click Save Structure to persist the changes.

You can also create new Sidebar Menu Items and Categories directly from the builder.

🧩 Doctypes
Sidebar Menu: Represents each individual menu item.

Sidebar Menu Category: Represents menu sections/groups.

Each item supports:

type: Link or Custom Link

link_type: Workspace, Doctype, Report, Page

link_to: The target name of the linked object

Visibility toggle

Drag hierarchy (parent, category)

🎨 Tech Stack
Frappe Framework

jQuery & Bootstrap (Frappe native)

SortableJS

📂 Folder Structure
cpp
Copy
Edit
sidebar_menu/
├── sidebar_menu/
│   ├── doctype/
│   ├── page/
│   │   └── sidebar_menu_builder/
│   ├── public/
│   │   └── js/
│   └── sidebar_menu/
├── README.md
└── screenshot-builder.png
📜 License
MIT License. Feel free to modify and use this app in your Frappe projects.

💡 Credits
Created by [Your Name]
Inspired by ERPNext’s legacy sidebar and modern UX needs.
