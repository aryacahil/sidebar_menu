function inject_custom_sidebar_menu() {
    const $sidebar = $(".desk-sidebar");

    if (!$sidebar.length || $sidebar.data("custom-menu-injected")) {
        console.log("Sidebar not ready or already injected.");
        return;
    }

    console.log("inject_custom_sidebar_menu: start injecting");
    $sidebar.data("custom-menu-injected", true);

    frappe.call({
        method: "sidebar_menu.api.get_sidebar_menu",
        callback: function (r) {
            if (!r.message || !r.message.length) return;

            r.message.forEach(categoryGroup => {
                const section_title = categoryGroup.category || "Custom Menu";

                const $section = $(`
                    <div class="standard-sidebar-section nested-container" data-title="${section_title}" data-custom-sidebar="1">
                        <button class="btn-reset standard-sidebar-label" aria-label="Toggle Section: ${section_title}" aria-expanded="true">
                            <span>
                            <svg class="es-icon es-line icon-xs" aria-hidden="true">
                                <use href="#es-line-down"></use>
                            </svg>
                        </span>
                        <span class="section-title">${section_title}</span>
                    </button>
                </div>
                `);

                $section.find(".standard-sidebar-label").on("click", function () {
                    const $btn = $(this);
                    const expanded = $btn.attr("aria-expanded") === "true";
                    $btn.attr("aria-expanded", !expanded);
                    $btn.find("svg").css({
                        transform: expanded ? "rotate(-90deg)" : "rotate(0deg)",
                        transformOrigin: "center"
                });

                $section.find(".sidebar-item-container").toggleClass("hidden", expanded);

                });

                categoryGroup.items.forEach(item => {
                    const $item = render_menu_item(item);  
                    $section.append($item);
                });

                $sidebar.append($section);
            
            });
        }
    });
}

window.reload_custom_sidebar_menu = function () {
    const $sidebar = $(".desk-sidebar");

    $sidebar.find(".standard-sidebar-section[data-custom-sidebar='1']").remove();

    $sidebar.removeData("custom-menu-injected");

    inject_custom_sidebar_menu();
}

frappe.realtime.on("custom_sidebar_menu_updated", () => {
    console.log("Sidebar Menu updated, reload sidebar");
    window.reload_custom_sidebar_menu();
});

frappe.after_ajax(() => {
    setTimeout(() => {
        const interval = setInterval(() => {
            if ($(".desk-sidebar").length) {
                clearInterval(interval);
                console.log("frappe.after_ajax + timeout: injecting sidebar");
                inject_custom_sidebar_menu();
            }
        }, 200);
    }, 500); 
});

frappe.router.on('change', () => {
    if (frappe.get_route()[0] === "desk") {
        window.reload_custom_sidebar_menu();
    }
});

function render_menu_item(item) {
    const has_children = item.children && item.children.length > 0;
    const icon = item.icon || "file";
    const href = item.route ? item.route : null;

    const link_html = href
        ? `
        <a href="${href}" class="item-anchor" title="${item.label}"
           style="display: flex; align-items: center; flex-grow: 1; gap: 8px; text-decoration: none; color: inherit;">
            <span class="sidebar-item-icon" item-icon="${icon}">
                <svg class="icon icon-md" aria-hidden="true">
                    <use href="#icon-${icon}"></use>
                </svg>
            </span>
            <span class="sidebar-item-label">${item.label}</span>
        </a>`
        : `
        <span class="item-anchor" title="${item.label}"
           style="display: flex; align-items: center; flex-grow: 1; gap: 8px; color: inherit; cursor: default;">
            <span class="sidebar-item-icon" item-icon="${icon}">
                <svg class="icon icon-md" aria-hidden="true">
                    <use href="#icon-${icon}"></use>
                </svg>
            </span>
            <span class="sidebar-item-label">${item.label}</span>
        </span>`;

    const $item = $(`<div class="sidebar-item-container" data-item-label="${item.label}" style="user-select: none;"></div>`);

    const $content = $(`
        <div class="sidebar-item-content" style="display: flex; align-items: center; justify-content: space-between; padding: 4px 8px;">
            ${link_html}
            ${has_children ? `
                <button class="btn-submenu-toggle" aria-expanded="true" style="border: none; background: none; cursor: pointer; padding: 0 6px;">
                    <svg class="icon icon-xs toggle-arrow" aria-hidden="true" style="transition: transform 0.3s;">
                        <use href="#icon-small-down"></use>
                    </svg>
                </button>` : ''}
        </div>
    `);

    $item.append($content);

    if (has_children) {
        const $toggleBtn = $content.find(".btn-submenu-toggle");
        const $children = $('<div class="sidebar-children" margin-top: 4px;"></div>');

        item.children.forEach(child => {
            $children.append(render_menu_item(child));
        });

        $item.append($children); 
        $children.show();

        $toggleBtn.off("click").on("click", (e) => {
            e.stopPropagation();
            const expanded = $toggleBtn.attr("aria-expanded") === "true";
            $toggleBtn.attr("aria-expanded", !expanded);
            $toggleBtn.find("svg.toggle-arrow").css({
                transform: !expanded ? "rotate(180deg)" : "rotate(0deg)",
                transformOrigin: "center"
            });
            $children.toggle(!expanded);
        });
    }

    if (href) {
        $content.find("a.item-anchor").off("click").on("click", function (e) {
            if (href.startsWith("http://") || href.startsWith("https://")) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            frappe.set_route(href.replace(/^\/app\//, ""));
        });
    }

    $item.find(".sidebar-item-content").on("mouseenter", function () {
        $(this).css({
            "background-color": "#f3f3f3",
            "border-radius": "6px"
        });
    });

    $item.find(".sidebar-item-content").on("mouseleave", function () {
        $(this).css({
            "background-color": "",
            "border-radius": ""
        });
    });

    return $item;
}
