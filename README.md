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

![Screenshot 1](screenshots/screenshot-1.png)
![Screenshot 2](screenshots/screenshot-2.png)

---

## 🚀 Installation

```bash
# Inside your bench directory:
bench get-app sidebar_menu https://github.com/aryacahil/sidebar_menu
bench --site your-site install-app sidebar_menu
bench build
```

## 🛠️ Usage

1. Open **Sidebar Menu Builder** from the **AwesomeBar** or go to:  
   `/app/sidebar-menu-builder`
2. Drag & drop items from the **Sidebar Menu Items** panel into **Menu Structure**.
3. Use the three-dot dropdown on each item to **Edit**, **Hide**, or **Delete** it.
4. Click **Save Structure** to persist your changes.

> You can also create new **Sidebar Menu Items** and **Categories** directly from the builder interface.

---

## 🧩 Doctypes

- **Sidebar Menu**  
  Represents each individual menu item.

- **Sidebar Menu Category**  
  Represents menu sections/groups (categories).

### Supported Fields & Features

- `type`: `Link` or `Custom Link`
- `link_type`: `Workspace`, `Doctype`, `Report`, `Page`
- `link_to`: The target name of the linked object
- Visibility toggle (Show/Hide)
- Drag-and-drop hierarchy (Parent/Category)

---

## 🎨 Tech Stack

- [Frappe Framework](https://frappeframework.com/)
- jQuery & Bootstrap (Frappe native UI)
- [SortableJS](https://github.com/SortableJS/Sortable) for drag-and-drop interaction

---

## 📜 License

**MIT License**  
Feel free to modify, use, and distribute this app within your Frappe-based projects.

---

## 💡 Credits

- Created by **[Aryacahil]**
- Inspired by ERPNext's classic sidebar and modern UX needs.
