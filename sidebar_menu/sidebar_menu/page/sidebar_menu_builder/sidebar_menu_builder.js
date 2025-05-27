frappe.pages['sidebar-menu-builder'].on_page_load = function (wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Sidebar Menu Builder',
        single_column: true
    });

    $(`<style>
		.sub-menu-container {
        	min-height: 30px;
        	transition: background-color 0.2s ease;
    	}
    	.sub-menu-container.drag-over {
    	}
        .toggle-submenu { cursor: pointer; margin-right: 8px; }
        .collapsed > .sub-menu-container { display: none; }
    </style>`).appendTo('head');

    $(page.body).html(`
  	    <div class="page-container my-4">
    	  <div class="container-fluid">
     	    <div class="row">
        	  <div class="col-md-4">
         	   <div class="card p-3 mb-4 h-100" style="overflow-x: hidden;">
        	    <div class="d-flex justify-content-between align-items-center mb-3">
                  <h4 class="mb-0">Sidebar Menu Items</h4>
                  <div class="dropdown">
                    <span data-toggle="dropdown" style="cursor: pointer;">
                      <i class="fa fa-ellipsis-h"></i>
                    </span>
                    <div class="dropdown-menu dropdown-menu-right">
                  	  <a class="dropdown-item" href="#" id="refresh-sidebar-menu-items">
                        <i class="fa fa-refresh mr-2"></i> Refresh Sidebar Menu Items
                      </a>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label class="mb-0">Filter by Type:</label>
                  <select id="menu-item-filter" class="form-control form-control-sm w-50">
                    <option value="All">All</option>
                    <option value="Doctype">Doctype</option>
                    <option value="Page">Page</option>
                    <option value="Report">Report</option>
                    <option value="Workspace">Workspace</option>
                  </select>
                </div>
                <input type="text" id="menu-search" class="form-control mb-3" placeholder="Search Menu Items">
                <div id="menu-items" class="mb-3 px-2" style="max-height: 250px; overflow-y: auto; padding-top: 8px;"></div>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="select-all-menu">
                    <label class="form-check-label" for="select-all-menu">Select All</label>
                  </div>
                  <button class="btn btn-primary btn-sm" id="submit-menu-selection">Add to Menu Structure</button>
                </div>

                <div id="hidden-menu-items-container" class="mt-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0">Hidden Sidebar Menu Items</h4>
                    <div class="dropdown">
                      <span data-toggle="dropdown" style="cursor: pointer;">
                        <i class="fa fa-ellipsis-h"></i>
                      </span>
                      <div class="dropdown-menu dropdown-menu-right">
                        <a class="dropdown-item" href="#" id="refresh-hidden-sidebar-menu-items">
                          <i class="fa fa-refresh mr-2"></i> Refresh Hidden Menu Items
                        </a>
                      </div>
                    </div>
                  </div>
                  <input type="text" id="hidden-menu-search" class="form-control mb-3" placeholder="Search Hidden Menu Items">
                  <div id="hidden-menu-items" class="mb-3 px-2" style="max-height: 150px; overflow-y: auto; padding-top: 8px;"></div>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="select-all-hidden-menu">
                      <label class="form-check-label" for="select-all-hidden-menu">Select All</label>
                    </div>
                    <button class="btn btn-primary btn-sm" id="restore-hidden-menu">Add to Menu Structure</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-8">
              <div class="card p-3 mb-4 h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h4 class="mb-0">Menu Structure</h4>
                  <div class="dropdown">
                    <span data-toggle="dropdown" style="cursor: pointer;">
                      <i class="fa fa-ellipsis-h"></i>
                    </span>
                    <div class="dropdown-menu dropdown-menu-right">
                      <a class="dropdown-item" href="#" id="refresh-menu-structure">
                        <i class="fa fa-refresh mr-2"></i> Refresh Menu Structure
                      </a>
                      <a class="dropdown-item" href="#" id="hide-all-menu">
                        <i class="fa fa-eye-slash mr-2"></i> Hide All Menu
                      </a>
                    </div>
                  </div>
                </div>
                <div id="menu-structure" class="border p-3 bg-light" style="min-height: 540px;"></div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <button class="btn btn-danger" id="delete-all-menu">Delete All</button>
                  <button class="btn btn-primary" id="save-menu">Save Menu Structure</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
   
    function loadSidebarMenuItems() {
    	frappe.call({
        	method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.get_sidebar_menu_items',
        	callback: function (response) {
            	if (response.message) {
                	const selectedFilter = $('#menu-item-filter').val(); 
                	const searchTerm = $('#menu-search').val()?.toLowerCase() || '';

                	$('#menu-items').empty();

                	let items = [];

                	response.message.doctypes.forEach(d => {
                    	items.push({ title: d.name, label: d.name, source_type: "Doctype" });
                	});

                	response.message.pages.forEach(p => {
                    	items.push({ title: p.name, label: p.name, source_type: "Page" });
                	});

                	response.message.reports.forEach(r => {
                    	items.push({
                        	title: r.name,
                        	label: r.name,
                        	source_type: "Report",
                        	ref_doctype: r.ref_doctype
                    	});
                	});

                	response.message.workspaces.forEach(w => {
                    	items.push({
                        	title: w.title || w.name,
                        	label: w.name,
                        	source_type: "Workspace"
                    	});
                	});

                	if (selectedFilter !== 'All') {
                    	items = items.filter(item => item.source_type === selectedFilter);
                	}

                	if (searchTerm) {
                    	items = items.filter(item =>
                        	item.title.toLowerCase().includes(searchTerm)
                    	);
                	}

                	const sortedItems = items.sort((a, b) => a.title.localeCompare(b.title));

                	sortedItems.forEach(item => {
                    	$('#menu-items').append(`
                        	<div class="menu-item btn btn-light mb-2 w-100 text-left" 
                             	data-name="${item.label}" 
                             	data-type="${item.source_type}" 
                             	data-ref-doctype="${item.ref_doctype || ''}">
                            	<input type="checkbox" class="menu-item-checkbox mr-2"> 
                            	${item.title} <span class="text-muted small ml-2">(${item.source_type})</span>
                        	</div>
                    	`);
                	});
            	}
        	}
    	});
	}

    function loadHiddenSidebarMenuItems() {
    frappe.call({
        method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.get_hidden_sidebar_menu_items',
        callback: function (response) {
            if (response.message) {
                $('#hidden-menu-items').empty();

                const sortedItems = response.message.sort((a, b) => {
                    const titleA = (a.title || a.label || '').toLowerCase();
                    const titleB = (b.title || b.label || '').toLowerCase();
                    return titleA.localeCompare(titleB);
                });

                sortedItems.forEach(item => {
                    $('#hidden-menu-items').append(`
                        <div class="menu-item btn btn-light mb-2 w-100 text-left" data-name="${item.name}">
                            <input type="checkbox" class="menu-item-checkbox mr-2"> ${item.title || item.label}
                        </div>
                        `);
                    });
                }
            }
        });
    }

function loadWorkspaceItems() {
    const $container = $('#menu-structure');

    $container.fadeOut(150, function () {
        $container.empty();

        const $spinner = $(`
            <div class="text-center my-4" id="workspace-loading-spinner">
                <i class="fa fa-spinner fa-spin fa-2x text-muted"></i>
            </div>
        `);
        $container.append($spinner).fadeIn(150);

        frappe.call({
            method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.get_menu_structure_items',
            callback: function (response) {
                if (response.message) {
                    const items = response.message;

                    const itemMap = {};
                    const allElements = [];

                    items.forEach(item => {
                        let $element;

                        if (item.is_category) {
                            $element = $(`
                                <div class="structure-item category-item bg-white" data-name="${item.name}" data-category="1"
                                     style="font-weight: bold; border: 1px solid #ddd; padding: 15px; border-radius: 6px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <span class="collapse-toggle mr-2" style="cursor: pointer;"><i class="fa fa-chevron-down"></i></span>
                                            ${item.label} <span style="font-weight: bold; margin-left: 5px;">(CATEGORY)</span>
                                        </div>
                                        <div class="dropdown">
                                            <span data-toggle="dropdown" style="cursor: pointer;">
                                                <i class="fa fa-ellipsis-h"></i>
                                            </span>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item edit-category" href="#"><i class="fa fa-edit mr-2"></i> Edit</a>
                                                <a class="dropdown-item remove-category" href="#"><i class="fa fa-trash mr-2"></i> Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="sub-menu-container mt-2 ml-3" style="margin-left: 20px; border-left: 2px solid #ccc; padding-left: 15px; margin-top: 10px;"></div>
                                </div>
                            `);
                        } else {
                            $element = $(`
                                <div class="structure-item workspace-item bg-white" data-name="${item.name}" data-type="Sidebar Menu" data-parent_menu="${item.parent_menu || ''}" data-category="${item.category || ''}"
                                    style="border: 1px solid #ddd; padding: 15px; border-radius: 6px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: none; font-weight: normal;">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <span class="collapse-toggle mr-2" style="cursor: pointer;"><i class="fa fa-chevron-down"></i></span>
                                            <span class="menu-title">${item.label}</span>
                                        </div>
                                        <div class="dropdown">
                                            <span data-toggle="dropdown" style="cursor: pointer;">
                                                <i class="fa fa-ellipsis-h"></i>
                                            </span>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item edit-item" href="#"><i class="fa fa-edit mr-2"></i> Edit</a>
                                                <a class="dropdown-item hide-item" href="#"><i class="fa fa-eye-slash mr-2"></i> Hide</a>
                                                <a class="dropdown-item remove-item" href="#"><i class="fa fa-trash mr-2"></i> Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="sub-menu-container" style="margin-left: 20px; border-left: 2px solid #ccc; padding-left: 15px; margin-top: 10px;"></div>
                                </div>
                            `);
                        }

                        allElements.push({ item, $element });
                        itemMap[item.name] = $element;
                    });

                    $('#menu-structure').empty();

                    allElements.forEach(({ item, $element }) => {
                        const parent = item.parent_menu;
                        const category = item.category;

                        if (parent && itemMap[parent] && !itemMap[parent].hasClass('category-item')) {
                            itemMap[parent].find('.sub-menu-container').first().append($element);
                        } else if (category && itemMap[category] && itemMap[category].hasClass('category-item')) {
                            itemMap[category].find('.sub-menu-container').first().append($element);
                        } else {
                            $('#menu-structure').append($element);
                        }

                        $element.fadeIn(150);
                    });

                    makeSortable();
                    enableSubmenuSortables();
                }
            }
        });
    });
}

    $('#menu-structure').on('click', '.collapse-toggle', function () {
        const $icon = $(this).find('i');
        const $submenu = $(this).closest('.structure-item').find('.sub-menu-container').first();
        $submenu.slideToggle(150);
        $icon.toggleClass('fa-chevron-down fa-chevron-right');
    });

function makeSortable() {
    new Sortable(document.getElementById('menu-structure'), {
        group: {
            name: 'shared',
            pull: true,
            put: function (to, from, draggedEl) {
                return $(draggedEl).hasClass('category-item') ? to === document.getElementById('menu-structure') : true;
            }
        },
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.90,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onAdd: evt => {
            const $item = $(evt.item);
            const $target = $(evt.to).closest('.structure-item');

            if ($target.hasClass('category-item')) {
                const newCategory = $target.data('name');
                $item.data('category', newCategory).attr('data-category', newCategory);
                $item.data('parent_menu', '').attr('data-parent_menu', '');

                $item.find('.structure-item').each(function () {
                    $(this)
                        .data('category', newCategory)
                        .attr('data-category', newCategory);
                });

                frappe.call({
                    method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.update_menu_category_bulk',
                    args: {
                        items: [$item.data('name')].concat(
                            $item.find('.structure-item').map(function () {
                                return $(this).data('name');
                            }).get()
                        ),
                        category: newCategory
                    },
                    callback: function () {
                        frappe.show_alert(`Item dan anak-anaknya dipindah ke kategori "${newCategory}"`);
                    }
                });
            }

            handleDrop($item);
            enableSubmenuSortables();
        }
    });
}

function enableSubmenuSortables() {
    $('.sub-menu-container').each(function () {
        if (!Sortable.get(this)) {
            Sortable.create(this, {
                group: {
                    name: 'shared',
                    pull: true,
                    put: function (to, from, draggedEl) {
                        return !$(draggedEl).hasClass('category-item');
                    }
                },
                animation: 150,
                fallbackOnBody: true,
                swapThreshold: 0.65,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                onAdd: function (evt) {
                    const $item = $(evt.item);
                    const $parent = $(this).closest('.structure-item');
                    const parentId = $parent.data('name');
                    const parentCategory = $parent.data('category');

                    $item
                        .data('parent_menu', parentId)
                        .attr('data-parent_menu', parentId)
                        .data('category', parentCategory)
                        .attr('data-category', parentCategory);

                    enableSubmenuSortables(); 
                }
            });
        }
    });
}

function handleDrop(droppedItem) {
    const $item = $(droppedItem);
    const $categoryWrapper = $item.closest('.category-item');

    if ($categoryWrapper.length) {
        const categoryName = $categoryWrapper.data('name');

        $item
            .attr('data-category', categoryName)
            .data('category', categoryName)
            .attr('data-parent_menu', '')
            .data('parent_menu', null);
    } else {
        const $parentItem = $item.parent().closest('.structure-item');
        const parentId = $parentItem.length ? $parentItem.data('name') : null;

        $item
            .attr('data-parent_menu', parentId || '')
            .data('parent_menu', parentId || null)
            .attr('data-category', '')
            .data('category', '');
    }
}

    $('#menu-structure').on('click', '.toggle-submenu', function () {
        const $icon = $(this);
        const $submenu = $icon.closest('.structure-item').find('.sub-menu-container').first();

        $submenu.slideToggle(150, function () {
            if ($submenu.is(':visible')) {
                $submenu.attr('aria-hidden', 'false');
            } else {
                $submenu.attr('aria-hidden', 'true');
            }
        });

        $icon.toggleClass('octicon-chevron-down octicon-chevron-right');
    });

    function filterAndSortMenu(containerSelector, searchInputSelector) {
    	$(searchInputSelector).on('input', function () {
        	const searchTerm = $(this).val().toLowerCase().trim();
        	const $container = $(containerSelector);
        	const $items = $container.find('.menu-item');

        	if (!searchTerm) {
            	$items.show();
            	return;
        	}

        	let exactMatches = [];
        	let partialMatches = [];

        	$items.each(function () {
            	const $item = $(this);
            	const menuTitle = $item.clone()
                	.children()
                	.remove()
                	.end()
                	.text()
                	.toLowerCase()
                	.trim();

            	const index = menuTitle.indexOf(searchTerm);

            	if (index === 0) {
                	exactMatches.push($item); 
            	} else if (index > 0) {
                	partialMatches.push({ element: $item, matchIndex: index });
            	} else {
                	$item.hide(); 
            	}
        	});
			
        	partialMatches.sort((a, b) => a.matchIndex - b.matchIndex);

        	$container.find('.menu-item').hide(); 

        	exactMatches.forEach($item => {
            	$item.show().appendTo($container);
        	});

        	partialMatches.forEach(match => {
            	match.element.show().appendTo($container);
        	});
    	});
	}

    filterAndSortMenu('#menu-items', '#menu-search');
    filterAndSortMenu('#hidden-menu-items', '#hidden-menu-search');

    $('#submit-menu-selection').click(async function () {
    let selectedMenus = [];
    $('#menu-items .menu-item-checkbox:checked').each(function () {
        let name = $(this).closest('.menu-item').data('name');
        selectedMenus.push(name);
    });

    if (selectedMenus.length === 0) {
        frappe.msgprint('No menu items selected.');
        return;
    }

    let added = [];
    let skipped = [];

    for (const name of selectedMenus) {
        await frappe.call({
            method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.create_workspace_from_label',
            args: { label: name },
            callback: function (r) {
                if (r.message && r.message.exists) {
                    skipped.push(name);
                } else {
                    added.push(name);
                }
            }
        });
    }

    if (added.length > 0) {
        frappe.show_alert({
            message: `Added to menu: <strong>${added.join(', ')}</strong>`,
            indicator: 'green'
        });
    }

    if (skipped.length > 0) {
        frappe.msgprint({
            title: 'Skipped Items',
            message: `These items already exist and were skipped: <strong>${skipped.join(', ')}</strong>`,
            indicator: 'orange'
        });
    }

    setTimeout(() => {
        $('#menu-structure').fadeOut(200, function () {
            $(this).empty();
            loadWorkspaceItems(); 
            $(this).fadeIn(200);
        });
        $('#menu-items .menu-item-checkbox').prop('checked', false);
        $('#select-all-menu').prop('checked', false);
        }, 300);
    });

    $('#restore-hidden-menu').click(async function () {
    let selectedMenus = [];

    $('#hidden-menu-items .menu-item-checkbox:checked').each(function () {
    let el = $(this).closest('.menu-item');
    let name = el.data('name');
    if (name) {
        selectedMenus.push(name);
        }
    });

    if (selectedMenus.length === 0) {
        frappe.msgprint('No hidden menu items selected.');
        return;
    }

    await frappe.call({
        method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.unhide_sidebar_menu_items',
        args: {
            item_names: JSON.stringify(selectedMenus)
        },
        callback: function (r) {
            frappe.show_alert(r.message, 3);
        }
    });

    setTimeout(() => {
        $('#menu-structure').fadeOut(200, function () {
            $(this).empty();
            loadWorkspaceItems();    
            $(this).fadeIn(200);
        });

        loadHiddenSidebarMenuItems();   
        $('#hidden-menu-items .menu-item-checkbox').prop('checked', false);
        $('#select-all-hidden-menu').prop('checked', false);
        }, 300);
    });

$('#menu-structure').on('click', '.remove-item', function (e) {
    e.preventDefault(); 
    e.stopPropagation();

    const $item = $(this).closest('.structure-item');
    const name = $item.data('name');
    const type = $item.data('type');

    if (type === 'Sidebar Menu') {
        frappe.confirm(`Are you sure you want to delete "${name}"?`, () => {
            frappe.call({
                method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.remove_menu_item',
                args: { name: name },
                callback: function () {
                    frappe.msgprint(`Menu "${name}" has been deleted.`);
                    $item.fadeOut(200, function () {
                        $item.remove();
                    });
                }
            });
        });
    }
});

    $('#menu-structure').on('click', '.hide-item', function (e) {
    	e.stopPropagation();
    	const $item = $(this).closest('.structure-item');
    	const name = $item.data('name');

    	frappe.call({
        	method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.hide_menu_item',
        	args: { name: name },
        	callback: function () {
            	frappe.show_alert(`Menu "${name}" has been hidden.`, 3);
            	$item.fadeOut(200); 
            	loadHiddenSidebarMenuItems(); 
        	}
    	});
	});

    $('#menu-structure').on('click', '.edit-item', function () {
    const $item = $(this).closest('.structure-item');
    const currentName = $item.data('name');

    frappe.call({
        method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.get_workspace_info',
        args: { name: currentName },
        callback: function (res) {
            if (!res.exc) {
                const data = res.message;

                const dialog = new frappe.ui.Dialog({
                    title: 'Edit Menu Item',
                    fields: [
                        { label: 'Title', fieldname: 'title', fieldtype: 'Data', reqd: 1, default: data.title },
                        { label: 'Icon', fieldname: 'icon', fieldtype: 'Icon', default: data.icon },
                        { label: 'Public', fieldname: 'public', fieldtype: 'Check', default: data.public ? 1 : 0 },
                        {
                            label: 'Type',
                            fieldname: 'type',
                            fieldtype: 'Select',
                            options: ['Workspace', 'Link', 'URL'],
                            default: data.type || 'Link'
                        },
                        {
                            label: 'Link Type',
                            fieldname: 'link_type',
                            fieldtype: 'Select',
                            options: ['DocType', 'Page', 'Report'],
                            default: data.link_type || 'DocType',
                            depends_on: 'eval:doc.type === "Link"'
                        },
                        {
                            label: 'Link To',
                            fieldname: 'link_to',
                            fieldtype: 'Dynamic Link',
                            options: 'link_type',
                            default: data.link_to || '',
                            depends_on: 'eval:doc.type === "Link"'
                        },
                        {
                            label: 'External Link',
                            fieldname: 'external_link',
                            fieldtype: 'Data',
                            default: data.external_link || '',
                            depends_on: 'eval:doc.type === "URL"'
                        }
                    ],
                    primary_action(values) {
                        const newTitle = values.title.trim();

                        frappe.call({
                            method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.update_menu_item',
                            args: {
                                name: data.name,
                                title: newTitle,
                                icon: values.icon || "",
                                public: values.public ? 1 : 0,
                                type: values.type,
                                link_type: values.link_type || null,
                                link_to: values.link_to || null,
                                external_link: values.external_link || null,
                            },
                            callback: function (r) {
                                if (!r.exc) {
                                    const updated = r.message;
                                    const newName = updated.name;

                                    $item.find('> .d-flex .menu-title').text(updated.title);
                                    $item.attr('data-name', newName).data('name', newName);
                                    $item.attr('data-icon', updated.icon).data('icon', updated.icon);
                                    $item.attr('data-public', updated.public).data('public', updated.public);
                                    $item.attr('data-type', updated.type).data('type', updated.type);
                                    $item.attr('data-link_type', updated.link_type).data('link_type', updated.link_type);
                                    $item.attr('data-link_to', updated.link_to).data('link_to', updated.link_to);
                                    $item.attr('data-external_link', updated.external_link).data('external_link', updated.external_link);

                                    $(`[data-parent_page="${data.name}"]`).each(function () {
                                        const $child = $(this);
                                        $child.attr('data-parent_page', newName).data('parent_page', newName);
                                        const newParent = $(`[data-name="${newName}"]`);
                                        const submenuContainer = newParent.find('.sub-menu-container').first();
                                        submenuContainer.append($child);
                                    });

                                    $('.sub-menu-container').each(function () {
                                        if (this.sortable) {
                                            this.sortable.destroy();
                                            this.sortable = null;
                                        }
                                    });
                                    enableSubmenuSortables();

                                    frappe.show_alert({
                                        message: `Menu "<strong>${updated.title}</strong>" has been updated.`,
                                        indicator: 'green'
                                    });

                                    setTimeout(() => dialog.hide(), 200);
                                }
                            }
                        });
                    }
                });

                dialog.show();
            }
        }
    });
});

$('#save-menu').click(function () {
    const structure = [];

    function buildStructure($container, parent = null) {
        $container.children('.category-item').each(function (index) {
            let $category = $(this);
            let name = $category.data('name');

            structure.push({
                name: name,
                doctype: 'Sidebar Menu Category',
                sequence_id: index + 1
            });

            let $items = $category.children('.sub-menu-container');
            if ($items.length) {
                buildStructure($items, null);
            }
        });

        $container.children('.structure-item').each(function (index) {
            let $menu = $(this);
            let menuName = $menu.data('name') || $menu.attr('data-name');
            let type = $menu.data('type') || $menu.attr('data-type');

            let parentMenu = parent !== null ? parent : ($menu.data('parent_menu') || $menu.attr('data-parent_menu'));
            let category = $menu.data('category') || $menu.attr('data-category');

            if ($menu.closest('.category-item').length) {
                category = $menu.closest('.category-item').data('name');

                const immediateParent = $menu.parent().closest('.structure-item');
                if (immediateParent.hasClass('category-item')) {
                    parentMenu = null;
                }
            }

            let item = {
                name: menuName,
                type: type,
                parent_menu: parentMenu,
                category: category,
                sequence_id: index + 1,
                doctype: 'Sidebar Menu'
            };

            structure.push(item);

            let $submenu = $menu.children('.sub-menu-container');
            if ($submenu.length) {
                buildStructure($submenu, menuName);
            }
        });
    }

    buildStructure($('#menu-structure'));

    frappe.call({
        method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.save_menu_structure',
        args: {
            structure: structure
        },
        callback: function (r) {
            if (!r.exc) {
                frappe.msgprint('Menu structure saved!');
            } else {
                frappe.msgprint(__('Failed to save menu structure'));
            }
        }
    });
});

    $('#hide-all-menu').on('click', function (e) {
    e.preventDefault();

    let allMenuNames = [];
    $('.structure-item').each(function () {
        const type = $(this).data('type');
        if (type === 'workspace') {
            allMenuNames.push($(this).data('name'));
        }
    });

    if (allMenuNames.length === 0) {
        frappe.msgprint('No menu items to hide.');
        return;
    }

    frappe.call({
        method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.hide_all_menu_items',
        args: { names: JSON.stringify(allMenuNames) },
        callback: function () {
            $('#menu-structure').fadeOut(200, function () {
                $(this).empty();
                loadWorkspaceItems();
                $(this).fadeIn(200);
            });
            loadHiddenSidebarMenuItems();
            frappe.show_alert('All menu items have been hidden.', 3);
            }
        });
    });

    $('#delete-all-menu').click(function () {
        frappe.confirm('Are you sure you want to delete all menu items?', () => {
            let items = [];
            $('#menu-structure .structure-item').each(function () {
                const type = $(this).data('type');
                if (type === 'workspace') {
                    items.push($(this).data('name'));
                }
            });

            if (items.length) {
                frappe.call({
                    method: 'sidebar_menu.sidebar_menu.page.sidebar_menu_builder.sidebar_menu_builder.remove_all_menu_items',
                    args: {
                        items: items
                    },
                    callback: function () {
                        $('#menu-structure').empty();
                        frappe.msgprint('All menu items have been deleted.');
                    }
                });
            } else {
                $('#menu-structure').empty();
            }
        });
    });

    loadSidebarMenuItems();
    loadWorkspaceItems();
    loadHiddenSidebarMenuItems();

    $(document).on('change', '#select-all-menu', function () {
        const isChecked = $(this).prop('checked');
        $('#menu-items .menu-item-checkbox').each(function () {
            $(this).prop('checked', isChecked);
        });
    });

    $('#select-all-hidden-menu').change(function () {
    $('#hidden-menu-items .menu-item-checkbox').prop('checked', this.checked);
    });

    $(document).on('change', '#menu-items .menu-item-checkbox', function () {
        const total = $('#menu-items .menu-item-checkbox').length;
        const checked = $('#menu-items .menu-item-checkbox:checked').length;
        $('#select-all-menu').prop('checked', total === checked);
    });

    $('#refresh-menu-structure').on('click', function (e) {
        e.preventDefault();
    $('#menu-structure').fadeOut(200, function () {
        $(this).empty();
        loadWorkspaceItems(); 
        $(this).fadeIn(200);
        });
    });

    $('#refresh-sidebar-menu-items').on('click', function(e) {
        e.preventDefault();
    $('#menu-items').fadeOut(200, function() {
        loadSidebarMenuItems();
        $(this).fadeIn(200);
        });
    });

    $('#refresh-hidden-sidebar-menu-items').on('click', function(e) {
        e.preventDefault();
    $('#hidden-menu-items').fadeOut(200, function() {
        loadHiddenSidebarMenuItems();
        $(this).fadeIn(200);
        });
    });

	$(document).on('change', '#menu-item-filter', function () {
    loadSidebarMenuItems();
});

};