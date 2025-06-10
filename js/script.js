/**
 * CSS Visual Editor Pro - Responsive JavaScript
 * Advanced CSS property manipulation with live preview and code generation
 */

$(document).ready(function() {
    // Load saved state first
    loadFromLocalStorage();
    
    // Initialize the application
    initializeApp();
});

// Global state management
const AppState = {
    currentCategory: 'flexbox',
    activeSection: 'categories', // For mobile navigation
    properties: {
        flexbox: {
            'justify-content': 'flex-start',
            'align-items': 'stretch',
            'flex-direction': 'row',
            'flex-wrap': 'nowrap',
            'gap': '20'
        },
        grid: {
            'grid-template-columns': 'repeat(3, 1fr)',
            'grid-template-rows': 'auto',
            'gap': '20',
            'justify-items': 'stretch',
            'align-items': 'stretch'
        },
        boxshadow: {
            'box-shadow-x': '0',
            'box-shadow-y': '4',
            'box-shadow-blur': '15',
            'box-shadow-spread': '0',
            'box-shadow-color': '#000000',
            'box-shadow-opacity': '0.1'
        },
        transform: {
            'transform-rotate': '0',
            'transform-scale': '1',
            'transform-translateX': '0',
            'transform-translateY': '0',
            'transform-skewX': '0',
            'transform-skewY': '0'
        },
        border: {
            'border-radius': '0',
            'border-width': '0',
            'border-style': 'solid',
            'border-color': '#000000'
        },
        typography: {
            'font-size': '16',
            'font-weight': '400',
            'text-align': 'left',
            'line-height': '1.5',
            'letter-spacing': '0',
            'text-transform': 'none'
        },
        background: {
            'background-color': '#ffffff',
            'background-type': 'solid'
        },
        layout: {
            'position': 'static',
            'display': 'block',
            'z-index': '0',
            'top': '0',
            'left': '0',
            'width': 'auto',
            'height': 'auto'
        }
    },
    darkMode: localStorage.getItem('darkMode') === 'true',
    isMobile: window.innerWidth < 992,
    touchStartX: 0,
    touchStartY: 0,
    isInitialized: false
};

// Property definitions for dynamic control generation
const PropertyDefinitions = {
    flexbox: {
        'justify-content': {
            type: 'radio',
            label: 'Justify Content',
            icon: 'fas fa-arrows-alt-h',
            options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
            tooltip: 'Defines how flex items are aligned along the main axis'
        },
        'align-items': {
            type: 'radio',
            label: 'Align Items',
            icon: 'fas fa-arrows-alt-v',
            options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
            tooltip: 'Defines how flex items are aligned along the cross axis'
        },
        'flex-direction': {
            type: 'radio',
            label: 'Flex Direction',
            icon: 'fas fa-exchange-alt',
            options: ['row', 'row-reverse', 'column', 'column-reverse'],
            tooltip: 'Defines the direction of the main axis'
        },
        'flex-wrap': {
            type: 'radio',
            label: 'Flex Wrap',
            icon: 'fas fa-layer-group',
            options: ['nowrap', 'wrap', 'wrap-reverse'],
            tooltip: 'Defines whether flex items should wrap'
        },
        'gap': {
            type: 'range',
            label: 'Gap',
            icon: 'fas fa-grip-lines',
            min: 0,
            max: 50,
            unit: 'px',
            tooltip: 'Space between flex items'
        }
    },
    grid: {
        'grid-template-columns': {
            type: 'select',
            label: 'Grid Columns',
            icon: 'fas fa-columns',
            options: {
                'repeat(1, 1fr)': '1 Column',
                'repeat(2, 1fr)': '2 Columns',
                'repeat(3, 1fr)': '3 Columns',
                'repeat(4, 1fr)': '4 Columns',
                '200px 1fr': '200px + Auto',
                '1fr 200px': 'Auto + 200px'
            },
            tooltip: 'Defines the grid column structure'
        },
        'grid-template-rows': {
            type: 'select',
            label: 'Grid Rows',
            icon: 'fas fa-bars',
            options: {
                'auto': 'Auto',
                'repeat(2, 1fr)': '2 Equal Rows',
                'repeat(3, 1fr)': '3 Equal Rows',
                '100px auto': '100px + Auto'
            },
            tooltip: 'Defines the grid row structure'
        },
        'gap': {
            type: 'range',
            label: 'Gap',
            icon: 'fas fa-grip-lines',
            min: 0,
            max: 50,
            unit: 'px',
            tooltip: 'Space between grid items'
        },
        'justify-items': {
            type: 'radio',
            label: 'Justify Items',
            icon: 'fas fa-arrows-alt-h',
            options: ['stretch', 'start', 'center', 'end'],
            tooltip: 'Aligns grid items along the row axis'
        },
        'align-items': {
            type: 'radio',
            label: 'Align Items',
            icon: 'fas fa-arrows-alt-v',
            options: ['stretch', 'start', 'center', 'end'],
            tooltip: 'Aligns grid items along the column axis'
        }
    },
    boxshadow: {
        'box-shadow-x': {
            type: 'range',
            label: 'Horizontal Offset',
            icon: 'fas fa-arrows-alt-h',
            min: -50,
            max: 50,
            unit: 'px',
            tooltip: 'Horizontal shadow offset'
        },
        'box-shadow-y': {
            type: 'range',
            label: 'Vertical Offset',
            icon: 'fas fa-arrows-alt-v',
            min: -50,
            max: 50,
            unit: 'px',
            tooltip: 'Vertical shadow offset'
        },
        'box-shadow-blur': {
            type: 'range',
            label: 'Blur Radius',
            icon: 'fas fa-circle',
            min: 0,
            max: 100,
            unit: 'px',
            tooltip: 'Shadow blur amount'
        },
        'box-shadow-spread': {
            type: 'range',
            label: 'Spread Radius',
            icon: 'fas fa-expand',
            min: -50,
            max: 50,
            unit: 'px',
            tooltip: 'Shadow spread amount'
        },
        'box-shadow-color': {
            type: 'color',
            label: 'Shadow Color',
            icon: 'fas fa-palette',
            tooltip: 'Shadow color'
        },
        'box-shadow-opacity': {
            type: 'range',
            label: 'Opacity',
            icon: 'fas fa-adjust',
            min: 0,
            max: 1,
            step: 0.1,
            tooltip: 'Shadow opacity'
        }
    },
    transform: {
        'transform-rotate': {
            type: 'range',
            label: 'Rotate',
            icon: 'fas fa-sync-alt',
            min: -180,
            max: 180,
            unit: 'deg',
            tooltip: 'Rotation angle'
        },
        'transform-scale': {
            type: 'range',
            label: 'Scale',
            icon: 'fas fa-expand-arrows-alt',
            min: 0.1,
            max: 3,
            step: 0.1,
            tooltip: 'Scale factor'
        },
        'transform-translateX': {
            type: 'range',
            label: 'Translate X',
            icon: 'fas fa-arrows-alt-h',
            min: -100,
            max: 100,
            unit: 'px',
            tooltip: 'Horizontal translation'
        },
        'transform-translateY': {
            type: 'range',
            label: 'Translate Y',
            icon: 'fas fa-arrows-alt-v',
            min: -100,
            max: 100,
            unit: 'px',
            tooltip: 'Vertical translation'
        },
        'transform-skewX': {
            type: 'range',
            label: 'Skew X',
            icon: 'fas fa-italic',
            min: -45,
            max: 45,
            unit: 'deg',
            tooltip: 'Horizontal skew'
        },
        'transform-skewY': {
            type: 'range',
            label: 'Skew Y',
            icon: 'fas fa-italic',
            min: -45,
            max: 45,
            unit: 'deg',
            tooltip: 'Vertical skew'
        }
    },
    border: {
        'border-radius': {
            type: 'range',
            label: 'Border Radius',
            icon: 'fas fa-square',
            min: 0,
            max: 50,
            unit: 'px',
            tooltip: 'Corner roundness'
        },
        'border-width': {
            type: 'range',
            label: 'Border Width',
            icon: 'fas fa-border-style',
            min: 0,
            max: 20,
            unit: 'px',
            tooltip: 'Border thickness'
        },
        'border-style': {
            type: 'select',
            label: 'Border Style',
            icon: 'fas fa-minus',
            options: {
                'solid': 'Solid',
                'dashed': 'Dashed',
                'dotted': 'Dotted',
                'double': 'Double',
                'groove': 'Groove',
                'ridge': 'Ridge',
                'inset': 'Inset',
                'outset': 'Outset'
            },
            tooltip: 'Border line style'
        },
        'border-color': {
            type: 'color',
            label: 'Border Color',
            icon: 'fas fa-palette',
            tooltip: 'Border color'
        }
    },
    typography: {
        'font-size': {
            type: 'range',
            label: 'Font Size',
            icon: 'fas fa-text-height',
            min: 8,
            max: 72,
            unit: 'px',
            tooltip: 'Text size'
        },
        'font-weight': {
            type: 'select',
            label: 'Font Weight',
            icon: 'fas fa-bold',
            options: {
                '100': 'Thin (100)',
                '200': 'Extra Light (200)',
                '300': 'Light (300)',
                '400': 'Normal (400)',
                '500': 'Medium (500)',
                '600': 'Semi Bold (600)',
                '700': 'Bold (700)',
                '800': 'Extra Bold (800)',
                '900': 'Black (900)'
            },
            tooltip: 'Text weight'
        },
        'text-align': {
            type: 'radio',
            label: 'Text Align',
            icon: 'fas fa-align-left',
            options: ['left', 'center', 'right', 'justify'],
            tooltip: 'Text alignment'
        },
        'line-height': {
            type: 'range',
            label: 'Line Height',
            icon: 'fas fa-text-height',
            min: 0.8,
            max: 3,
            step: 0.1,
            tooltip: 'Line spacing'
        },
        'letter-spacing': {
            type: 'range',
            label: 'Letter Spacing',
            icon: 'fas fa-text-width',
            min: -5,
            max: 10,
            unit: 'px',
            tooltip: 'Character spacing'
        },
        'text-transform': {
            type: 'select',
            label: 'Text Transform',
            icon: 'fas fa-font',
            options: {
                'none': 'None',
                'uppercase': 'UPPERCASE',
                'lowercase': 'lowercase',
                'capitalize': 'Capitalize'
            },
            tooltip: 'Text case transformation'
        }
    },
    background: {
        'background-color': {
            type: 'color',
            label: 'Background Color',
            icon: 'fas fa-fill-drip',
            tooltip: 'Background color'
        },
        'background-type': {
            type: 'radio',
            label: 'Background Type',
            icon: 'fas fa-palette',
            options: ['solid', 'gradient'],
            tooltip: 'Background fill type'
        }
    },
    layout: {
        'position': {
            type: 'select',
            label: 'Position',
            icon: 'fas fa-crosshairs',
            options: {
                'static': 'Static',
                'relative': 'Relative',
                'absolute': 'Absolute',
                'fixed': 'Fixed',
                'sticky': 'Sticky'
            },
            tooltip: 'Element positioning method'
        },
        'display': {
            type: 'select',
            label: 'Display',
            icon: 'fas fa-eye',
            options: {
                'block': 'Block',
                'inline': 'Inline',
                'inline-block': 'Inline Block',
                'flex': 'Flex',
                'grid': 'Grid',
                'none': 'None'
            },
            tooltip: 'Element display type'
        },
        'z-index': {
            type: 'range',
            label: 'Z-Index',
            icon: 'fas fa-layer-group',
            min: -10,
            max: 100,
            tooltip: 'Stacking order'
        }
    }
};

/**
 * Initialize the application
 */
function initializeApp() {
    try {
        // Prevent double initialization
        if (AppState.isInitialized) {
            return;
        }
        
        // Check if mobile
        checkMobileState();
        
        // Set initial dark mode
        applyDarkModeSettings();
        
        // Bind event handlers
        bindEventHandlers();
        
        // Load initial category
        loadCategoryControls('flexbox');
        
        // Initialize tooltips
        initializeTooltips();
        
        // Set initial mobile section
        if (AppState.isMobile) {
            showMobileSection('categories');
        }
        
        // Show welcome animation
        showWelcomeAnimation();
        
        // Mark as initialized
        AppState.isInitialized = true;
        
        console.log('CSS Visual Editor Pro initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showToast('Failed to initialize application. Please refresh the page.');
    }
}

/**
 * Apply dark mode settings
 */
function applyDarkModeSettings() {
    if (AppState.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        $('#darkModeToggle i').removeClass('fa-moon').addClass('fa-sun');
    } else {
        document.documentElement.removeAttribute('data-theme');
        $('#darkModeToggle i').removeClass('fa-sun').addClass('fa-moon');
    }
}

/**
 * Check mobile state and update accordingly
 */
function checkMobileState() {
    const wasMobile = AppState.isMobile;
    AppState.isMobile = window.innerWidth < 992;
    
    if (AppState.isMobile) {
        $('body').addClass('mobile-view');
        $('.mobile-tabs').show();
    } else {
        $('body').removeClass('mobile-view');
        $('.mobile-tabs').hide();
        // Show all sections on desktop
        $('.sidebar-wrapper, .controls-wrapper, .preview-wrapper').removeClass('active').show();
    }
    
    return wasMobile !== AppState.isMobile;
}

/**
 * Bind all event handlers
 */
function bindEventHandlers() {
    // Unbind existing handlers to prevent duplicates
    $(window).off('resize.cssEditor');
    $(document).off('keydown.cssEditor');
    
    // Window resize handler
    $(window).on('resize.cssEditor', debounce(handleWindowResize, 250));
    
    // Mobile tab navigation
    $('.mobile-tab-btn').off('click.cssEditor').on('click.cssEditor', handleMobileTabClick);
    
    // Mobile menu toggle
    $('#mobileMenuToggle').off('click.cssEditor').on('click.cssEditor', toggleMobileMenu);
    
    // Mobile overlay
    $('#mobileOverlay').off('click.cssEditor').on('click.cssEditor', closeMobileMenu);
    
    // Category selection
    $('.category-item').off('click.cssEditor').on('click.cssEditor', handleCategorySelection);
    
    // Dark mode toggle
    $('#darkModeToggle').off('click.cssEditor').on('click.cssEditor', toggleDarkMode);
    
    // Show code modal
    $('#showCodeBtn').off('click.cssEditor').on('click.cssEditor', showCodeModal);
    
    // Reset button
    $('#resetBtn').off('click.cssEditor').on('click.cssEditor', resetCurrentCategory);
    
    // Download code
    $('#downloadCodeBtn').off('click.cssEditor').on('click.cssEditor', downloadCode);
    
    // Keyboard navigation
    $(document).on('keydown.cssEditor', handleKeyboardNavigation);
    
    // Touch events for better mobile experience
    if ('ontouchstart' in window) {
        bindTouchEvents();
    }
    
    // Modal events
    $('#codeModal').off('shown.bs.modal.cssEditor').on('shown.bs.modal.cssEditor', function() {
        // Trigger syntax highlighting when modal is shown
        if (window.Prism) {
            setTimeout(() => Prism.highlightAll(), 100);
        }
    });
}

/**
 * Handle window resize
 */
function handleWindowResize() {
    try {
        const layoutChanged = checkMobileState();
        
        // If switched from mobile to desktop or vice versa
        if (layoutChanged) {
            if (AppState.isMobile) {
                showMobileSection(AppState.activeSection);
            } else {
                $('.sidebar-wrapper, .controls-wrapper, .preview-wrapper').removeClass('active').show();
            }
            
            // Reinitialize tooltips
            initializeTooltips();
            
            // Update preview
            updatePreview();
        }
    } catch (error) {
        console.error('Error handling window resize:', error);
    }
}

/**
 * Handle mobile tab clicks
 */
function handleMobileTabClick() {
    try {
        const tab = $(this).data('tab');
        
        // Update active tab
        $('.mobile-tab-btn').removeClass('active');
        $(this).addClass('active');
        
        // Show corresponding section
        showMobileSection(tab);
        
        // Add haptic feedback on supported devices
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    } catch (error) {
        console.error('Error handling mobile tab click:', error);
    }
}

/**
 * Show mobile section
 */
function showMobileSection(section) {
    try {
        AppState.activeSection = section;
        
        // Hide all sections
        $('.sidebar-wrapper, .controls-wrapper, .preview-wrapper').removeClass('active');
        
        // Show selected section
        switch (section) {
            case 'categories':
                $('.sidebar-wrapper').addClass('active');
                break;
            case 'controls':
                $('.controls-wrapper').addClass('active');
                break;
            case 'preview':
                $('.preview-wrapper').addClass('active');
                break;
            default:
                console.warn('Unknown section:', section);
                return;
        }
        
        // Update mobile tab
        $('.mobile-tab-btn').removeClass('active');
        $(`.mobile-tab-btn[data-tab="${section}"]`).addClass('active');
    } catch (error) {
        console.error('Error showing mobile section:', error);
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    try {
        const $sidebar = $('.sidebar-wrapper');
        const $overlay = $('#mobileOverlay');
        
        if ($sidebar.hasClass('mobile-menu-open')) {
            closeMobileMenu();
        } else {
            $sidebar.addClass('mobile-menu-open');
            $overlay.addClass('show');
            $('body').addClass('mobile-menu-active');
        }
    } catch (error) {
        console.error('Error toggling mobile menu:', error);
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    $('.sidebar-wrapper').removeClass('mobile-menu-open');
    $('#mobileOverlay').removeClass('show');
    $('body').removeClass('mobile-menu-active');
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(e) {
    try {
        // Escape key to close mobile menu and modals
        if (e.key === 'Escape') {
            closeMobileMenu();
            if ($('#codeModal').hasClass('show')) {
                $('#codeModal').modal('hide');
            }
            return;
        }
        
        // Arrow keys for mobile tab navigation
        if (AppState.isMobile && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            const tabs = ['categories', 'controls', 'preview'];
            const currentIndex = tabs.indexOf(AppState.activeSection);
            let newIndex;
            
            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            } else {
                newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            }
            
            showMobileSection(tabs[newIndex]);
            e.preventDefault();
        }
        
        // Number keys for quick category selection (1-8)
        if (e.key >= '1' && e.key <= '8' && !e.ctrlKey && !e.altKey) {
            const categories = ['flexbox', 'grid', 'boxshadow', 'transform', 'border', 'typography', 'background', 'layout'];
            const index = parseInt(e.key) - 1;
            if (categories[index]) {
                const $categoryItem = $(`.category-item[data-category="${categories[index]}"]`);
                if ($categoryItem.length) {
                    $categoryItem.click();
                    e.preventDefault();
                }
            }
        }
    } catch (error) {
        console.error('Error handling keyboard navigation:', error);
    }
}

/**
 * Bind touch events for better mobile experience
 */
function bindTouchEvents() {
    let startX = 0, startY = 0;
    
    // Swipe navigation for mobile
    $('.main-content').off('touchstart.cssEditor touchend.cssEditor')
        .on('touchstart.cssEditor', function(e) {
            if (!AppState.isMobile) return;
            
            const touch = e.originalEvent.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            AppState.touchStartX = startX;
            AppState.touchStartY = startY;
        })
        .on('touchend.cssEditor', function(e) {
            if (!AppState.isMobile || !startX || !startY) return;
            
            const touch = e.originalEvent.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            // Only trigger if horizontal swipe is significant and not vertical scroll
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                const tabs = ['categories', 'controls', 'preview'];
                const currentIndex = tabs.indexOf(AppState.activeSection);
                
                if (deltaX > 0 && currentIndex > 0) {
                    // Swipe right - previous tab
                    showMobileSection(tabs[currentIndex - 1]);
                    e.preventDefault();
                } else if (deltaX < 0 && currentIndex < tabs.length - 1) {
                    // Swipe left - next tab
                    showMobileSection(tabs[currentIndex + 1]);
                    e.preventDefault();
                }
            }
            
            startX = startY = 0;
        });
}

/**
 * Handle category selection
 */
function handleCategorySelection() {
    try {
        const category = $(this).data('category');
        
        if (!category || !PropertyDefinitions[category]) {
            console.error('Invalid category:', category);
            return;
        }
        
        // Update active state
        $('.category-item').removeClass('active');
        $(this).addClass('active');
        
        // Update current category
        AppState.currentCategory = category;
        const categoryName = $(this).find('span').text().trim();
        $('#currentCategory').text(categoryName);
        
        // Load category controls with animation
        loadCategoryControls(category);
        
        // Update preview
        updatePreview();
        
        // Add selection animation
        $(this).addClass('animate-property');
        setTimeout(() => $(this).removeClass('animate-property'), 600);
        
        // On mobile, auto-switch to controls
        if (AppState.isMobile) {
            setTimeout(() => {
                showMobileSection('controls');
            }, 300);
        }
        
        // Close mobile menu if open
        closeMobileMenu();
        
        // Save current category
        localStorage.setItem('currentCategory', category);
    } catch (error) {
        console.error('Error handling category selection:', error);
        showToast('Error loading category');
    }
}

/**
 * Load controls for a specific category
 */
function loadCategoryControls(category) {
    const $container = $('#propertyControls');
    const definitions = PropertyDefinitions[category];
    
    if (!definitions) {
        console.error(`No definitions found for category: ${category}`);
        $container.html('<div class="alert alert-warning">Category not found</div>');
        return;
    }
    
    try {
        // Add loading state
        $container.addClass('loading').empty();
        
        setTimeout(() => {
            let html = '';
            
            Object.keys(definitions).forEach((property, index) => {
                const def = definitions[property];
                const currentValue = AppState.properties[category][property] || '';
                
                html += generatePropertyControl(property, def, currentValue, index);
            });
            
            $container.html(html).removeClass('loading');
            
            // Bind property change handlers
            bindPropertyHandlers();
            
            // Initialize color pickers
            initializeColorPickers();
            
            // Add entrance animation
            $('.property-group').each((index, element) => {
                setTimeout(() => {
                    $(element).addClass('animate-property');
                    setTimeout(() => $(element).removeClass('animate-property'), 600);
                }, index * 100);
            });
            
            // Reinitialize tooltips
            initializeTooltips();
        }, 200);
    } catch (error) {
        console.error('Error loading category controls:', error);
        $container.removeClass('loading').html('<div class="alert alert-danger">Error loading controls</div>');
    }
}

/**
 * Generate HTML for a property control
 */
function generatePropertyControl(property, definition, currentValue, index) {
    try {
        const { type, label, icon, options, min, max, step, unit, tooltip } = definition;
        
        let html = `
            <div class="property-group" data-property="${property}" style="animation-delay: ${index * 0.1}s">
                <div class="property-label">
                    <i class="${icon || 'fas fa-cog'}"></i>
                    ${escapeHtml(label)}
                    <i class="fas fa-info-circle tooltip-icon ms-auto" 
                       data-bs-toggle="tooltip" 
                       data-bs-placement="top" 
                       title="${escapeHtml(tooltip || '')}"></i>
                </div>
        `;
        
        switch (type) {
            case 'radio':
                html += generateRadioControl(property, options, currentValue);
                break;
            case 'range':
                html += generateRangeControl(property, min, max, step, unit, currentValue);
                break;
            case 'select':
                html += generateSelectControl(property, options, currentValue);
                break;
            case 'color':
                html += generateColorControl(property, currentValue);
                break;
            default:
                console.warn('Unknown control type:', type);
                html += '<div class="alert alert-warning">Unknown control type</div>';
        }
        
        html += '</div>';
        return html;
    } catch (error) {
        console.error('Error generating property control:', error);
        return '<div class="alert alert-danger">Error generating control</div>';
    }
}

/**
 * Generate radio button control
 */
function generateRadioControl(property, options, currentValue) {
    if (!Array.isArray(options)) {
        console.error('Radio options must be an array');
        return '<div class="alert alert-warning">Invalid radio options</div>';
    }
    
    let html = '<div class="property-options">';
    
    options.forEach((option, index) => {
        const checked = option === currentValue ? 'checked' : '';
        const id = `${property}-${option}-${Date.now()}-${index}`;
        const safeOption = escapeHtml(option);
        
        html += `
            <div class="form-check form-check-inline">
                <input class="form-check-input property-input" 
                       type="radio" 
                       name="${escapeHtml(property)}" 
                       id="${id}" 
                       value="${safeOption}" 
                       ${checked}>
                <label class="form-check-label" for="${id}">
                    ${formatOptionLabel(option)}
                </label>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Generate range slider control
 */
function generateRangeControl(property, min, max, step, unit, currentValue) {
    const stepAttr = step ? `step="${step}"` : '';
    const unitDisplay = unit || '';
    const safeProperty = escapeHtml(property);
    const safeMin = escapeHtml(String(min || 0));
    const safeMax = escapeHtml(String(max || 100));
    const safeValue = escapeHtml(String(currentValue || 0));
    
    return `
        <div class="range-control">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <small class="text-muted">${safeMin}${unitDisplay}</small>
                <span class="badge bg-primary" id="${safeProperty}-value">
                    ${safeValue}${unitDisplay}
                </span>
                <small class="text-muted">${safeMax}${unitDisplay}</small>
            </div>
            <input type="range" 
                   class="form-range property-input" 
                   name="${safeProperty}"
                   min="${safeMin}" 
                   max="${safeMax}" 
                   ${stepAttr}
                   value="${safeValue}">
        </div>
    `;
}

/**
 * Generate select dropdown control
 */
function generateSelectControl(property, options, currentValue) {
    if (typeof options !== 'object' || options === null) {
        console.error('Select options must be an object');
        return '<div class="alert alert-warning">Invalid select options</div>';
    }
    
    const safeProperty = escapeHtml(property);
    let html = `<select class="form-select property-input" name="${safeProperty}">`;
    
    Object.keys(options).forEach(value => {
        const selected = value === currentValue ? 'selected' : '';
        const label = options[value];
        const safeValue = escapeHtml(value);
        const safeLabel = escapeHtml(label);
        
        html += `<option value="${safeValue}" ${selected}>${safeLabel}</option>`;
    });
    
    html += '</select>';
    return html;
}

/**
 * Generate color picker control
 */
function generateColorControl(property, currentValue) {
    const safeProperty = escapeHtml(property);
    const safeValue = escapeHtml(currentValue || '#000000');
    
    return `
        <div class="color-input-group">
            <input type="color" 
                   class="form-control form-control-color property-input" 
                   name="${safeProperty}"
                   value="${safeValue}">
            <input type="text" 
                   class="form-control property-input" 
                   name="${safeProperty}-text"
                   value="${safeValue}"
                   placeholder="#000000"
                   pattern="^#[0-9A-Fa-f]{6}$">
            <div class="color-preview" 
                 style="background-color: ${safeValue}"></div>
        </div>
    `;
}

/**
 * Bind property change handlers
 */
function bindPropertyHandlers() {
    $('.property-input').off('input.cssEditor change.cssEditor').on('input.cssEditor change.cssEditor', function() {
        try {
            const property = $(this).attr('name');
            const value = $(this).val();
            const category = AppState.currentCategory;
            
            if (!property || !category) {
                console.warn('Missing property or category');
                return;
            }
            
            // Validate color inputs
            if ($(this).attr('type') === 'color' || property.endsWith('-text')) {
                if (property.endsWith('-text') && value && !isValidColor(value)) {
                    $(this).addClass('is-invalid');
                    return;
                } else {
                    $(this).removeClass('is-invalid');
                }
            }
            
            // Update state
            if (property.endsWith('-text')) {
                const actualProperty = property.replace('-text', '');
                if (isValidColor(value)) {
                    AppState.properties[category][actualProperty] = value;
                    
                    // Update color picker
                    $(`input[name="${actualProperty}"][type="color"]`).val(value);
                    $('.color-preview').css('background-color', value);
                }
            } else {
                AppState.properties[category][property] = value;
                
                // Update range value display
                if ($(this).attr('type') === 'range') {
                    const unit = PropertyDefinitions[category][property]?.unit || '';
                    $(`#${property}-value`).text(value + unit);
                }
                
                // Update color text input
                if ($(this).attr('type') === 'color') {
                    $(`input[name="${property}-text"]`).val(value);
                    $('.color-preview').css('background-color', value);
                }
            }
            
            // Update preview with animation
            updatePreview();
            
            // Add visual feedback
            $(this).closest('.property-group').addClass('animate-property');
            setTimeout(() => {
                $(this).closest('.property-group').removeClass('animate-property');
            }, 600);
            
            // Save to localStorage (debounced)
            debouncedSave();
            
            // Auto-switch to preview on mobile after change
            if (AppState.isMobile && AppState.activeSection === 'controls') {
                setTimeout(() => {
                    showMobileSection('preview');
                }, 500);
            }
        } catch (error) {
            console.error('Error handling property change:', error);
        }
    });
}

/**
 * Initialize color pickers
 */
function initializeColorPickers() {
    $('.color-preview').off('click.cssEditor').on('click.cssEditor', function() {
        const $colorInput = $(this).siblings('input[type="color"]');
        if ($colorInput.length) {
            $colorInput.click();
        }
    });
}

/**
 * Update the preview area
 */
function updatePreview() {
    try {
        const category = AppState.currentCategory;
        const properties = AppState.properties[category];
        const $container = $('#previewContainer');
        
        if (!properties || !$container.length) {
            console.warn('Missing properties or container for preview update');
            return;
        }
        
        // Remove existing classes and styles
        $container.removeClass().addClass('preview-container');
        $container.find('.preview-item').attr('style', '');
        
        // Apply category-specific updates
        switch (category) {
            case 'flexbox':
                updateFlexboxPreview($container, properties);
                break;
            case 'grid':
                updateGridPreview($container, properties);
                break;
            case 'boxshadow':
                updateBoxShadowPreview($container, properties);
                break;
            case 'transform':
                updateTransformPreview($container, properties);
                break;
            case 'border':
                updateBorderPreview($container, properties);
                break;
            case 'typography':
                updateTypographyPreview($container, properties);
                break;
            case 'background':
                updateBackgroundPreview($container, properties);
                break;
            case 'layout':
                updateLayoutPreview($container, properties);
                break;
            default:
                console.warn('Unknown category for preview:', category);
        }
        
        // Add animation class
        $container.addClass('animate-property');
        setTimeout(() => $container.removeClass('animate-property'), 600);
    } catch (error) {
        console.error('Error updating preview:', error);
    }
}

/**
 * Update flexbox preview
 */
function updateFlexboxPreview($container, properties) {
    const styles = {
        'display': 'flex',
        'justify-content': properties['justify-content'] || 'flex-start',
        'align-items': properties['align-items'] || 'stretch',
        'flex-direction': properties['flex-direction'] || 'row',
        'flex-wrap': properties['flex-wrap'] || 'nowrap',
        'gap': (properties['gap'] || '20') + 'px'
    };
    
    $container.css(styles);
}

/**
 * Update grid preview
 */
function updateGridPreview($container, properties) {
    $container.addClass('grid-preview');
    
    const styles = {
        'display': 'grid',
        'grid-template-columns': properties['grid-template-columns'] || 'repeat(3, 1fr)',
        'grid-template-rows': properties['grid-template-rows'] || 'auto',
        'gap': (properties['gap'] || '20') + 'px',
        'justify-items': properties['justify-items'] || 'stretch',
        'align-items': properties['align-items'] || 'stretch'
    };
    
    $container.css(styles);
}

/**
 * Update box shadow preview
 */
function updateBoxShadowPreview($container, properties) {
    const x = properties['box-shadow-x'] || '0';
    const y = properties['box-shadow-y'] || '4';
    const blur = properties['box-shadow-blur'] || '15';
    const spread = properties['box-shadow-spread'] || '0';
    const color = properties['box-shadow-color'] || '#000000';
    const opacity = properties['box-shadow-opacity'] || '0.1';
    
    const shadow = `${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;
    
    $container.find('.preview-item').css('box-shadow', shadow);
}

/**
 * Update transform preview
 */
function updateTransformPreview($container, properties) {
    const rotate = properties['transform-rotate'] || '0';
    const scale = properties['transform-scale'] || '1';
    const translateX = properties['transform-translateX'] || '0';
    const translateY = properties['transform-translateY'] || '0';
    const skewX = properties['transform-skewX'] || '0';
    const skewY = properties['transform-skewY'] || '0';
    
    const transform = `
        rotate(${rotate}deg) 
        scale(${scale}) 
        translateX(${translateX}px) 
        translateY(${translateY}px) 
        skewX(${skewX}deg) 
        skewY(${skewY}deg)
    `.replace(/\s+/g, ' ').trim();
    
    $container.find('.preview-item').css('transform', transform);
}

/**
 * Update border preview
 */
function updateBorderPreview($container, properties) {
    const styles = {
        'border-radius': (properties['border-radius'] || '0') + 'px',
        'border': `${properties['border-width'] || '0'}px ${properties['border-style'] || 'solid'} ${properties['border-color'] || '#000000'}`
    };
    
    $container.find('.preview-item').css(styles);
}

/**
 * Update typography preview
 */
function updateTypographyPreview($container, properties) {
    // Add text content to preview items
    $container.find('.preview-item').each(function(index) {
        $(this).text(`Text ${index + 1}`);
    });
    
    const styles = {
        'font-size': (properties['font-size'] || '16') + 'px',
        'font-weight': properties['font-weight'] || '400',
        'text-align': properties['text-align'] || 'left',
        'line-height': properties['line-height'] || '1.5',
        'letter-spacing': (properties['letter-spacing'] || '0') + 'px',
        'text-transform': properties['text-transform'] || 'none'
    };
    
    $container.find('.preview-item').css(styles);
}

/**
 * Update background preview
 */
function updateBackgroundPreview($container, properties) {
    let background = properties['background-color'] || '#ffffff';
    
    if (properties['background-type'] === 'gradient') {
        background = `linear-gradient(135deg, ${background}, #667eea)`;
    }
    
    $container.find('.preview-item').css('background', background);
}

/**
 * Update layout preview
 */
function updateLayoutPreview($container, properties) {
    const styles = {
        'position': properties['position'] || 'static',
        'display': properties['display'] || 'block',
        'z-index': properties['z-index'] || '0'
    };
    
    $container.css(styles);
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    try {
        AppState.darkMode = !AppState.darkMode;
        applyDarkModeSettings();
        localStorage.setItem('darkMode', AppState.darkMode.toString());
        showToast('Theme updated successfully!');
    } catch (error) {
        console.error('Error toggling dark mode:', error);
        showToast('Error updating theme');
    }
}

/**
 * Show code generation modal
 */
function showCodeModal() {
    try {
        const { html, css, bootstrap } = generateCode();
        
        // Update modal content
        $('#htmlCode').text(html);
        $('#cssCode').text(css);
        $('#bootstrapCode').text(bootstrap);
        
        // Show modal
        $('#codeModal').modal('show');
    } catch (error) {
        console.error('Error showing code modal:', error);
        showToast('Error generating code');
    }
}

/**
 * Generate code for current configuration
 */
function generateCode() {
    try {
        const category = AppState.currentCategory;
        const properties = AppState.properties[category];
        
        if (!properties) {
            throw new Error('No properties found for category: ' + category);
        }
        
        let html = '';
        let css = '';
        let bootstrap = '';
        
        switch (category) {
            case 'flexbox':
                ({ html, css, bootstrap } = generateFlexboxCode(properties));
                break;
            case 'grid':
                ({ html, css, bootstrap } = generateGridCode(properties));
                break;
            case 'boxshadow':
                ({ html, css, bootstrap } = generateBoxShadowCode(properties));
                break;
            case 'transform':
                ({ html, css, bootstrap } = generateTransformCode(properties));
                break;
            case 'border':
                ({ html, css, bootstrap } = generateBorderCode(properties));
                break;
            case 'typography':
                ({ html, css, bootstrap } = generateTypographyCode(properties));
                break;
            case 'background':
                ({ html, css, bootstrap } = generateBackgroundCode(properties));
                break;
            case 'layout':
                ({ html, css, bootstrap } = generateLayoutCode(properties));
                break;
            default:
                throw new Error('Unknown category: ' + category);
        }
        
        return { html, css, bootstrap };
    } catch (error) {
        console.error('Error generating code:', error);
        return {
            html: '<!-- Error generating HTML -->',
            css: '/* Error generating CSS */',
            bootstrap: '<!-- Error generating Bootstrap -->'
        };
    }
}

/**
 * Generate flexbox code
 */
function generateFlexboxCode(properties) {
    const html = `<div class="flex-container">
    <div class="flex-item">Item 1</div>
    <div class="flex-item">Item 2</div>
    <div class="flex-item">Item 3</div>
</div>`;
    
    const css = `.flex-container {
    display: flex;
    justify-content: ${properties['justify-content'] || 'flex-start'};
    align-items: ${properties['align-items'] || 'stretch'};
    flex-direction: ${properties['flex-direction'] || 'row'};
    flex-wrap: ${properties['flex-wrap'] || 'nowrap'};
    gap: ${properties['gap'] || '20'}px;
}

.flex-item {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
}`;
    
    // Convert to Bootstrap classes
    const bootstrapClasses = [
        'd-flex',
        getBootstrapJustifyClass(properties['justify-content']),
        getBootstrapAlignClass(properties['align-items']),
        getBootstrapDirectionClass(properties['flex-direction']),
        properties['flex-wrap'] !== 'nowrap' ? 'flex-wrap' : ''
    ].filter(Boolean).join(' ');
    
    const bootstrap = `<div class="${bootstrapClasses}">
    <div class="flex-item">Item 1</div>
    <div class="flex-item">Item 2</div>
    <div class="flex-item">Item 3</div>
</div>`;
    
    return { html, css, bootstrap };
}

/**
 * Generate grid code
 */
function generateGridCode(properties) {
    const html = `<div class="grid-container">
    <div class="grid-item">Item 1</div>
    <div class="grid-item">Item 2</div>
    <div class="grid-item">Item 3</div>
</div>`;
    
    const css = `.grid-container {
    display: grid;
    grid-template-columns: ${properties['grid-template-columns'] || 'repeat(3, 1fr)'};
    grid-template-rows: ${properties['grid-template-rows'] || 'auto'};
    gap: ${properties['gap'] || '20'}px;
    justify-items: ${properties['justify-items'] || 'stretch'};
    align-items: ${properties['align-items'] || 'stretch'};
}

.grid-item {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 8px;
    padding: 20px;
    color: white;
    font-weight: bold;
    text-align: center;
}`;
    
    const bootstrap = `<!-- Bootstrap doesn't have native grid classes, use CSS Grid -->
<div class="grid-container">
    <div class="grid-item">Item 1</div>
    <div class="grid-item">Item 2</div>
    <div class="grid-item">Item 3</div>
</div>`;
    
    return { html, css, bootstrap };
}

/**
 * Generate box shadow code
 */
function generateBoxShadowCode(properties) {
    const x = properties['box-shadow-x'] || '0';
    const y = properties['box-shadow-y'] || '4';
    const blur = properties['box-shadow-blur'] || '15';
    const spread = properties['box-shadow-spread'] || '0';
    const color = properties['box-shadow-color'] || '#000000';
    const opacity = properties['box-shadow-opacity'] || '0.1';
    
    const shadow = `${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;
    
    const html = `<div class="shadow-box">
    <p>Box with custom shadow</p>
</div>`;
    
    const css = `.shadow-box {
    width: 200px;
    height: 150px;
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: ${shadow};
}`;
    
    const bootstrap = `<div class="shadow-custom p-4 bg-white rounded">
    <p>Box with custom shadow</p>
</div>

<style>
.shadow-custom {
    box-shadow: ${shadow};
}
</style>`;
    
    return { html, css, bootstrap };
}

/**
 * Generate transform code
 */
function generateTransformCode(properties) {
    const rotate = properties['transform-rotate'] || '0';
    const scale = properties['transform-scale'] || '1';
    const translateX = properties['transform-translateX'] || '0';
    const translateY = properties['transform-translateY'] || '0';
    const skewX = properties['transform-skewX'] || '0';
    const skewY = properties['transform-skewY'] || '0';
    
    const transform = `rotate(${rotate}deg) scale(${scale}) translateX(${translateX}px) translateY(${translateY}px) skewX(${skewX}deg) skewY(${skewY}deg)`;
    
    const html = `<div class="transform-box">
    <p>Transformed Element</p>
</div>`;
    
    const css = `.transform-box {
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    transform: ${transform};
}`;
    
    const bootstrap = `<div class="transform-custom d-flex align-items-center justify-content-center bg-primary text-white rounded">
    <p>Transformed Element</p>
</div>

<style>
.transform-custom {
    width: 150px;
    height: 150px;
    transform: ${transform};
}
</style>`;
    
    return { html, css, bootstrap };
}

/**
 * Generate border code
 */
function generateBorderCode(properties) {
    const html = `<div class="border-box">
    <p>Element with custom border</p>
</div>`;
    
    const css = `.border-box {
    width: 200px;
    height: 150px;
    background: white;
    padding: 20px;
    border-radius: ${properties['border-radius'] || '0'}px;
    border: ${properties['border-width'] || '0'}px ${properties['border-style'] || 'solid'} ${properties['border-color'] || '#000000'};
}`;
    
    const bootstrap = `<div class="border-custom p-4 bg-white">
    <p>Element with custom border</p>
</div>

<style>
.border-custom {
    border-radius: ${properties['border-radius'] || '0'}px;
    border: ${properties['border-width'] || '0'}px ${properties['border-style'] || 'solid'} ${properties['border-color'] || '#000000'};
}
</style>`;
    
    return { html, css, bootstrap };
}

/**
 * Generate typography code
 */
function generateTypographyCode(properties) {
    const html = `<div class="typography-demo">
    <h2>Typography Example</h2>
    <p>This is a paragraph with custom typography styles applied.</p>
</div>`;
    
    const css = `.typography-demo {
    font-size: ${properties['font-size'] || '16'}px;
    font-weight: ${properties['font-weight'] || '400'};
    text-align: ${properties['text-align'] || 'left'};
    line-height: ${properties['line-height'] || '1.5'};
    letter-spacing: ${properties['letter-spacing'] || '0'}px;
    text-transform: ${properties['text-transform'] || 'none'};
}`;
    
    const bootstrap = `<div class="typography-custom">
    <h2>Typography Example</h2>
    <p>This is a paragraph with custom typography styles applied.</p>
</div>

<style>
.typography-custom {
    font-size: ${properties['font-size'] || '16'}px;
    font-weight: ${properties['font-weight'] || '400'};
    text-align: ${properties['text-align'] || 'left'};
    line-height: ${properties['line-height'] || '1.5'};
    letter-spacing: ${properties['letter-spacing'] || '0'}px;
    text-transform: ${properties['text-transform'] || 'none'};
}
</style>`;
    
    return { html, css, bootstrap };
}

/**
 * Generate background code
 */
function generateBackgroundCode(properties) {
    let background = properties['background-color'] || '#ffffff';
    
    if (properties['background-type'] === 'gradient') {
        background = `linear-gradient(135deg, ${background}, #667eea)`;
    }
    
    const html = `<div class="background-demo">
    <p>Element with custom background</p>
</div>`;
    
    const css = `.background-demo {
    width: 300px;
    height: 200px;
    background: ${background};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
}`;
    
    const bootstrap = `<div class="background-custom d-flex align-items-center justify-content-center text-white rounded">
    <p>Element with custom background</p>
</div>

<style>
.background-custom {
    width: 300px;
    height: 200px;
    background: ${background};
}
</style>`;
    
    return { html, css, bootstrap };
}

/**
 * Generate layout code
 */
function generateLayoutCode(properties) {
    const html = `<div class="layout-container">
    <div class="layout-item">Positioned Element</div>
</div>`;
    
    const css = `.layout-container {
    position: relative;
    width: 400px;
    height: 300px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
}

.layout-item {
    position: ${properties['position'] || 'static'};
    display: ${properties['display'] || 'block'};
    z-index: ${properties['z-index'] || '0'};
    width: 150px;
    height: 100px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}`;
    
    const bootstrap = `<div class="position-relative bg-light border" style="width: 400px; height: 300px;">
    <div class="layout-custom d-flex align-items-center justify-content-center text-white rounded">
        Positioned Element
    </div>
</div>

<style>
.layout-custom {
    position: ${properties['position'] || 'static'};
    display: ${properties['display'] || 'block'};
    z-index: ${properties['z-index'] || '0'};
    width: 150px;
    height: 100px;
    background: linear-gradient(135deg, #667eea, #764ba2);
}
</style>`;
    
    return { html, css, bootstrap };
}

/**
 * Reset current category to defaults
 */
function resetCurrentCategory() {
    try {
        const category = AppState.currentCategory;
        const defaults = getDefaultProperties(category);
        
        // Update state
        AppState.properties[category] = { ...defaults };
        
        // Reload controls
        loadCategoryControls(category);
        
        // Update preview
        updatePreview();
        
        // Show feedback
        showToast(`${formatCategoryName(category)} properties reset to default!`);
    } catch (error) {
        console.error('Error resetting category:', error);
        showToast('Error resetting properties');
    }
}

/**
 * Get default properties for a category
 */
function getDefaultProperties(category) {
    const defaults = {
        flexbox: {
            'justify-content': 'flex-start',
            'align-items': 'stretch',
            'flex-direction': 'row',
            'flex-wrap': 'nowrap',
            'gap': '20'
        },
        grid: {
            'grid-template-columns': 'repeat(3, 1fr)',
            'grid-template-rows': 'auto',
            'gap': '20',
            'justify-items': 'stretch',
            'align-items': 'stretch'
        },
        boxshadow: {
            'box-shadow-x': '0',
            'box-shadow-y': '4',
            'box-shadow-blur': '15',
            'box-shadow-spread': '0',
            'box-shadow-color': '#000000',
            'box-shadow-opacity': '0.1'
        },
        transform: {
            'transform-rotate': '0',
            'transform-scale': '1',
            'transform-translateX': '0',
            'transform-translateY': '0',
            'transform-skewX': '0',
            'transform-skewY': '0'
        },
        border: {
            'border-radius': '0',
            'border-width': '0',
            'border-style': 'solid',
            'border-color': '#000000'
        },
        typography: {
            'font-size': '16',
            'font-weight': '400',
            'text-align': 'left',
            'line-height': '1.5',
            'letter-spacing': '0',
            'text-transform': 'none'
        },
        background: {
            'background-color': '#ffffff',
            'background-type': 'solid'
        },
        layout: {
            'position': 'static',
            'display': 'block',
            'z-index': '0'
        }
    };
    
    return defaults[category] || {};
}

/**
 * Download generated code as files
 */
function downloadCode() {
    try {
        const { html, css, bootstrap } = generateCode();
        const category = AppState.currentCategory;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        
        // Create and download HTML file
        downloadFile(`${category}-example-${timestamp}.html`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formatCategoryName(category)} Example</title>
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
</body>
</html>`);
        
        showToast('Code files downloaded successfully!');
    } catch (error) {
        console.error('Error downloading code:', error);
        showToast('Error downloading files');
    }
}

/**
 * Download file helper
 */
function downloadFile(filename, content) {
    try {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    } catch (error) {
        console.error('Error downloading file:', error);
        showToast('Error downloading file');
    }
}

/**
 * Copy code to clipboard
 */
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        showToast('Element not found');
        return;
    }
    
    const text = element.textContent || element.innerText;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Code copied to clipboard!');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyTextToClipboard(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Code copied to clipboard!');
        } else {
            showToast('Failed to copy code');
        }
        
        document.body.removeChild(textArea);
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showToast('Failed to copy code');
    }
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    try {
        // Dispose existing tooltips
        const existingTooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        existingTooltips.forEach(el => {
            const tooltip = bootstrap.Tooltip.getInstance(el);
            if (tooltip) {
                tooltip.dispose();
            }
        });
        
        // Initialize new tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                trigger: AppState.isMobile ? 'click' : 'hover',
                placement: 'top',
                fallbackPlacements: ['bottom', 'left', 'right']
            });
        });
    } catch (error) {
        console.warn('Error initializing tooltips:', error);
    }
}

/**
 * Show welcome animation
 */
function showWelcomeAnimation() {
    try {
        if (AppState.isMobile) {
            // Simple fade-in for mobile
            $('.main-content').css('opacity', '0');
            setTimeout(() => {
                $('.main-content').css('opacity', '1');
            }, 100);
        } else {
            // Original animation for desktop
            const $sidebar = $('.sidebar-wrapper');
            const $controls = $('.controls-wrapper');
            const $preview = $('.preview-wrapper');
            
            $sidebar.css('transform', 'translateX(-100%)');
            $controls.css('transform', 'translateY(-100%)');
            $preview.css('transform', 'translateX(100%)');
            
            setTimeout(() => {
                $sidebar.css('transform', 'translateX(0)');
            }, 100);
            
            setTimeout(() => {
                $controls.css('transform', 'translateY(0)');
            }, 200);
            
            setTimeout(() => {
                $preview.css('transform', 'translateX(0)');
            }, 300);
        }
    } catch (error) {
        console.warn('Error in welcome animation:', error);
    }
}

/**
 * Show toast notification
 */
function showToast(message) {
    try {
        const $toastMessage = $('#toastMessage');
        const $toast = $('#liveToast');
        
        if ($toastMessage.length && $toast.length) {
            $toastMessage.text(message);
            const toast = new bootstrap.Toast($toast[0], {
                delay: 3000
            });
            toast.show();
        } else {
            // Fallback to console if toast elements not found
            console.log('Toast:', message);
        }
    } catch (error) {
        console.error('Error showing toast:', error);
    }
}

/**
 * Save current state to localStorage (debounced)
 */
const debouncedSave = debounce(saveToLocalStorage, 1000);

function saveToLocalStorage() {
    try {
        const stateToSave = {
            properties: AppState.properties,
            currentCategory: AppState.currentCategory,
            darkMode: AppState.darkMode,
            activeSection: AppState.activeSection
        };
        localStorage.setItem('cssEditorState', JSON.stringify(stateToSave));
    } catch (e) {
        console.warn('Failed to save state to localStorage:', e);
    }
}

/**
 * Load state from localStorage
 */
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('cssEditorState');
        if (saved) {
            const parsedState = JSON.parse(saved);
            
            // Merge saved properties with defaults
            if (parsedState.properties) {
                Object.keys(parsedState.properties).forEach(category => {
                    if (AppState.properties[category]) {
                        AppState.properties[category] = {
                            ...AppState.properties[category],
                            ...parsedState.properties[category]
                        };
                    }
                });
            }
            
            // Load other state
            if (parsedState.currentCategory && PropertyDefinitions[parsedState.currentCategory]) {
                AppState.currentCategory = parsedState.currentCategory;
            }
            
            if (typeof parsedState.darkMode === 'boolean') {
                AppState.darkMode = parsedState.darkMode;
            }
            
            if (parsedState.activeSection) {
                AppState.activeSection = parsedState.activeSection;
            }
        }
    } catch (e) {
        console.warn('Failed to load saved state:', e);
    }
}

// Utility functions

/**
 * Debounce function to limit rapid function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Convert hex color to rgba with opacity
 */
function hexToRgba(hex, opacity) {
    try {
        if (!hex || typeof hex !== 'string') {
            return 'rgba(0, 0, 0, 0.1)';
        }
        
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Convert 3-digit hex to 6-digit
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        if (hex.length !== 6) {
            return 'rgba(0, 0, 0, 0.1)';
        }
        
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = Math.max(0, Math.min(1, parseFloat(opacity) || 0.1));
        
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    } catch (error) {
        console.warn('Error converting hex to rgba:', error);
        return 'rgba(0, 0, 0, 0.1)';
    }
}

/**
 * Format option labels for display
 */
function formatOptionLabel(option) {
    if (typeof option !== 'string') {
        return String(option);
    }
    
    return option
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Format category names for display
 */
function formatCategoryName(category) {
    const names = {
        'flexbox': 'Flexbox',
        'grid': 'Grid',
        'boxshadow': 'Box Shadow',
        'transform': 'Transform',
        'border': 'Border',
        'typography': 'Typography',
        'background': 'Background',
        'layout': 'Layout'
    };
    return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Get Bootstrap justify-content class
 */
function getBootstrapJustifyClass(value) {
    const map = {
        'flex-start': 'justify-content-start',
        'center': 'justify-content-center',
        'flex-end': 'justify-content-end',
        'space-between': 'justify-content-between',
        'space-around': 'justify-content-around',
        'space-evenly': 'justify-content-evenly'
    };
    return map[value] || '';
}

/**
 * Get Bootstrap align-items class
 */
function getBootstrapAlignClass(value) {
    const map = {
        'stretch': 'align-items-stretch',
        'flex-start': 'align-items-start',
        'center': 'align-items-center',
        'flex-end': 'align-items-end',
        'baseline': 'align-items-baseline'
    };
    return map[value] || '';
}

/**
 * Get Bootstrap flex-direction class
 */
function getBootstrapDirectionClass(value) {
    const map = {
        'row': 'flex-row',
        'row-reverse': 'flex-row-reverse',
        'column': 'flex-column',
        'column-reverse': 'flex-column-reverse'
    };
    return map[value] || '';
}

/**
 * Validate color format
 */
function isValidColor(color) {
    if (!color || typeof color !== 'string') {
        return false;
    }
    
    // Check hex format
    const hexPattern = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    if (hexPattern.test(color)) {
        return true;
    }
    
    // Check rgb/rgba format
    const rgbPattern = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*(0|1|0?\.\d+))?\s*\)$/;
    if (rgbPattern.test(color)) {
        return true;
    }
    
    // Check named colors (basic set)
    const namedColors = ['red', 'green', 'blue', 'white', 'black', 'yellow', 'orange', 'purple', 'pink', 'gray', 'grey'];
    if (namedColors.includes(color.toLowerCase())) {
        return true;
    }
    
    return false;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return '';
    }
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Performance monitoring (optional - for development)
 */
if (typeof window !== 'undefined' && window.performance) {
    const performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 16) { // More than one frame at 60fps
                console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
            }
        }
    });
    
    try {
        performanceObserver.observe({ entryTypes: ['measure'] });
    } catch (e) {
        // Performance observer not supported
    }
}

// Initialize app when DOM is ready
$(document).ready(function() {
    // Add performance mark
    if (window.performance && window.performance.mark) {
        performance.mark('app-init-start');
    }
    
    try {
        // Load saved state first
        loadFromLocalStorage();
        
        // Initialize the application
        initializeApp();
        
        // Performance mark
        if (window.performance && window.performance.mark && window.performance.measure) {
            performance.mark('app-init-end');
            performance.measure('app-initialization', 'app-init-start', 'app-init-end');
        }
    } catch (error) {
        console.error('Fatal error during initialization:', error);
        
        // Show fallback error message
        $('body').html(`
            <div class="container-fluid d-flex align-items-center justify-content-center min-vh-100">
                <div class="alert alert-danger text-center">
                    <h4><i class="fas fa-exclamation-triangle me-2"></i>Application Error</h4>
                    <p>Failed to initialize the CSS Visual Editor. Please refresh the page and try again.</p>
                    <button class="btn btn-danger" onclick="location.reload()">
                        <i class="fas fa-refresh me-1"></i>Refresh Page
                    </button>
                </div>
            </div>
        `);
    }
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    // Don't show toast for every error, but log them
    if (typeof showToast === 'function') {
        showToast('An error occurred. Check console for details.');
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});
