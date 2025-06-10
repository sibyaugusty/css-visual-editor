/**
 * CSS Visual Editor Pro - JavaScript
 * Advanced CSS property manipulation with live preview and code generation
 */

$(document).ready(function() {
    // Initialize the application
    initializeApp();
});

// Global state management
const AppState = {
    currentCategory: 'flexbox',
    properties: {
        flexbox: {
            'justify-content': 'flex-start',
            'align-items': 'stretch',
            'flex-direction': 'row',
            'flex-wrap': 'nowrap',
            'gap': '20px'
        },
        grid: {
            'grid-template-columns': 'repeat(3, 1fr)',
            'grid-template-rows': 'auto',
            'gap': '20px',
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
    darkMode: localStorage.getItem('darkMode') === 'true'
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
    // Set initial dark mode
    if (AppState.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        $('#darkModeToggle i').removeClass('fa-moon').addClass('fa-sun');
    }
    
    // Bind event handlers
    bindEventHandlers();
    
    // Load initial category
    loadCategoryControls('flexbox');
    
    // Initialize tooltips
    initializeTooltips();
    
    // Show welcome animation
    showWelcomeAnimation();
    
    console.log('CSS Visual Editor Pro initialized successfully');
}

/**
 * Bind all event handlers
 */
function bindEventHandlers() {
    // Category selection
    $('.category-item').on('click', handleCategorySelection);
    
    // Dark mode toggle
    $('#darkModeToggle').on('click', toggleDarkMode);
    
    // Show code modal
    $('#showCodeBtn').on('click', showCodeModal);
    
    // Reset button
    $('#resetBtn').on('click', resetCurrentCategory);
    
    // Download code
    $('#downloadCodeBtn').on('click', downloadCode);
    
    // Dynamic property change handler will be bound when controls are created
}

/**
 * Handle category selection
 */
function handleCategorySelection() {
    const category = $(this).data('category');
    
    // Update active state
    $('.category-item').removeClass('active');
    $(this).addClass('active');
    
    // Update current category
    AppState.currentCategory = category;
    $('#currentCategory').text($(this).text().trim());
    
    // Load category controls with animation
    loadCategoryControls(category);
    
    // Update preview
    updatePreview();
    
    // Add selection animation
    $(this).addClass('animate-property');
    setTimeout(() => $(this).removeClass('animate-property'), 600);
}

/**
 * Load controls for a specific category
 */
function loadCategoryControls(category) {
    const $container = $('#propertyControls');
    const definitions = PropertyDefinitions[category];
    
    if (!definitions) {
        console.error(`No definitions found for category: ${category}`);
        return;
    }
    
    // Add loading state
    $container.addClass('loading').empty();
    
    setTimeout(() => {
        let html = '';
        
        Object.keys(definitions).forEach(property => {
            const def = definitions[property];
            const currentValue = AppState.properties[category][property];
            
            html += generatePropertyControl(property, def, currentValue);
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
    }, 300);
}

/**
 * Generate HTML for a property control
 */
function generatePropertyControl(property, definition, currentValue) {
    const { type, label, icon, options, min, max, step, unit, tooltip } = definition;
    
    let html = `
        <div class="property-group" data-property="${property}">
            <div class="property-label">
                <i class="${icon}"></i>
                ${label}
                <i class="fas fa-info-circle tooltip-icon ms-auto" 
                   data-bs-toggle="tooltip" 
                   data-bs-placement="top" 
                   title="${tooltip}"></i>
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
    }
    
    html += '</div>';
    return html;
}

/**
 * Generate radio button control
 */
function generateRadioControl(property, options, currentValue) {
    let html = '<div class="property-options">';
    
    options.forEach(option => {
        const checked = option === currentValue ? 'checked' : '';
        const id = `${property}-${option}`;
        
        html += `
            <div class="form-check form-check-inline">
                <input class="form-check-input property-input" 
                       type="radio" 
                       name="${property}" 
                       id="${id}" 
                       value="${option}" 
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
    
    return `
        <div class="range-control">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <small class="text-muted">${min}${unitDisplay}</small>
                <span class="badge bg-primary" id="${property}-value">
                    ${currentValue}${unitDisplay}
                </span>
                <small class="text-muted">${max}${unitDisplay}</small>
            </div>
            <input type="range" 
                   class="form-range property-input" 
                   name="${property}"
                   min="${min}" 
                   max="${max}" 
                   ${stepAttr}
                   value="${currentValue}">
        </div>
    `;
}

/**
 * Generate select dropdown control
 */
function generateSelectControl(property, options, currentValue) {
    let html = `<select class="form-select property-input" name="${property}">`;
    
    Object.keys(options).forEach(value => {
        const selected = value === currentValue ? 'selected' : '';
        const label = options[value];
        
        html += `<option value="${value}" ${selected}>${label}</option>`;
    });
    
    html += '</select>';
    return html;
}

/**
 * Generate color picker control
 */
function generateColorControl(property, currentValue) {
    return `
        <div class="color-input-group">
            <input type="color" 
                   class="form-control form-control-color property-input" 
                   name="${property}"
                   value="${currentValue}"
                   style="width: 50px;">
            <input type="text" 
                   class="form-control property-input" 
                   name="${property}-text"
                   value="${currentValue}"
                   placeholder="#000000">
            <div class="color-preview" 
                 style="background-color: ${currentValue}"></div>
        </div>
    `;
}

/**
 * Bind property change handlers
 */
function bindPropertyHandlers() {
    $('.property-input').off('input change').on('input change', function() {
        const property = $(this).attr('name');
        const value = $(this).val();
        const category = AppState.currentCategory;
        
        // Update state
        if (property.endsWith('-text')) {
            const actualProperty = property.replace('-text', '');
            AppState.properties[category][actualProperty] = value;
            
            // Update color picker
            $(`input[name="${actualProperty}"][type="color"]`).val(value);
            $('.color-preview').css('background-color', value);
        } else {
            AppState.properties[category][property] = value;
            
            // Update range value display
            if ($(this).attr('type') === 'range') {
                const unit = PropertyDefinitions[category][property].unit || '';
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
        
        // Save to localStorage
        saveToLocalStorage();
    });
}

/**
 * Initialize color pickers
 */
function initializeColorPickers() {
    $('.color-preview').off('click').on('click', function() {
        const $colorInput = $(this).siblings('input[type="color"]');
        $colorInput.click();
    });
}

/**
 * Update the preview area
 */
function updatePreview() {
    const category = AppState.currentCategory;
    const properties = AppState.properties[category];
    const $container = $('#previewContainer');
    
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
    }
    
    // Add animation class
    $container.addClass('animate-property');
    setTimeout(() => $container.removeClass('animate-property'), 600);
}

/**
 * Update flexbox preview
 */
function updateFlexboxPreview($container, properties) {
    const styles = {
        'display': 'flex',
        'justify-content': properties['justify-content'],
        'align-items': properties['align-items'],
        'flex-direction': properties['flex-direction'],
        'flex-wrap': properties['flex-wrap'],
        'gap': properties['gap'] + 'px'
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
        'grid-template-columns': properties['grid-template-columns'],
        'grid-template-rows': properties['grid-template-rows'],
        'gap': properties['gap'] + 'px',
        'justify-items': properties['justify-items'],
        'align-items': properties['align-items']
    };
    
    $container.css(styles);
}

/**
 * Update box shadow preview
 */
function updateBoxShadowPreview($container, properties) {
    const shadow = `${properties['box-shadow-x']}px ${properties['box-shadow-y']}px ${properties['box-shadow-blur']}px ${properties['box-shadow-spread']}px ${hexToRgba(properties['box-shadow-color'], properties['box-shadow-opacity'])}`;
    
    $container.find('.preview-item').css('box-shadow', shadow);
}

/**
 * Update transform preview
 */
function updateTransformPreview($container, properties) {
    const transform = `
        rotate(${properties['transform-rotate']}deg) 
        scale(${properties['transform-scale']}) 
        translateX(${properties['transform-translateX']}px) 
        translateY(${properties['transform-translateY']}px) 
        skewX(${properties['transform-skewX']}deg) 
        skewY(${properties['transform-skewY']}deg)
    `.replace(/\s+/g, ' ').trim();
    
    $container.find('.preview-item').css('transform', transform);
}

/**
 * Update border preview
 */
function updateBorderPreview($container, properties) {
    const styles = {
        'border-radius': properties['border-radius'] + 'px',
        'border': `${properties['border-width']}px ${properties['border-style']} ${properties['border-color']}`
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
        'font-size': properties['font-size'] + 'px',
        'font-weight': properties['font-weight'],
        'text-align': properties['text-align'],
        'line-height': properties['line-height'],
        'letter-spacing': properties['letter-spacing'] + 'px',
        'text-transform': properties['text-transform']
    };
    
    $container.find('.preview-item').css(styles);
}

/**
 * Update background preview
 */
function updateBackgroundPreview($container, properties) {
    let background = properties['background-color'];
    
    if (properties['background-type'] === 'gradient') {
        background = `linear-gradient(135deg, ${properties['background-color']}, #667eea)`;
    }
    
    $container.find('.preview-item').css('background', background);
}

/**
 * Update layout preview
 */
function updateLayoutPreview($container, properties) {
    const styles = {
        'position': properties['position'],
        'display': properties['display'],
        'z-index': properties['z-index']
    };
    
    $container.css(styles);
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    AppState.darkMode = !AppState.darkMode;
    
    if (AppState.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        $('#darkModeToggle i').removeClass('fa-moon').addClass('fa-sun');
    } else {
        document.documentElement.removeAttribute('data-theme');
        $('#darkModeToggle i').removeClass('fa-sun').addClass('fa-moon');
    }
    
    localStorage.setItem('darkMode', AppState.darkMode.toString());
    showToast('Theme updated successfully!');
}

/**
 * Show code generation modal
 */
function showCodeModal() {
    const { html, css, bootstrap } = generateCode();
    
    // Update modal content
    $('#htmlCode').text(html);
    $('#cssCode').text(css);
    $('#bootstrapCode').text(bootstrap);
    
    // Trigger syntax highlighting
    Prism.highlightAll();
    
    // Show modal
    $('#codeModal').modal('show');
}

/**
 * Generate code for current configuration
 */
function generateCode() {
    const category = AppState.currentCategory;
    const properties = AppState.properties[category];
    
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
    }
    
    return { html, css, bootstrap };
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
    justify-content: ${properties['justify-content']};
    align-items: ${properties['align-items']};
    flex-direction: ${properties['flex-direction']};
    flex-wrap: ${properties['flex-wrap']};
    gap: ${properties['gap']}px;
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
    grid-template-columns: ${properties['grid-template-columns']};
    grid-template-rows: ${properties['grid-template-rows']};
    gap: ${properties['gap']}px;
    justify-items: ${properties['justify-items']};
    align-items: ${properties['align-items']};
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
    const shadow = `${properties['box-shadow-x']}px ${properties['box-shadow-y']}px ${properties['box-shadow-blur']}px ${properties['box-shadow-spread']}px ${hexToRgba(properties['box-shadow-color'], properties['box-shadow-opacity'])}`;
    
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
    const transform = `rotate(${properties['transform-rotate']}deg) scale(${properties['transform-scale']}) translateX(${properties['transform-translateX']}px) translateY(${properties['transform-translateY']}px) skewX(${properties['transform-skewX']}deg) skewY(${properties['transform-skewY']}deg)`;
    
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
    border-radius: ${properties['border-radius']}px;
    border: ${properties['border-width']}px ${properties['border-style']} ${properties['border-color']};
}`;
    
    const bootstrap = `<div class="border-custom p-4 bg-white">
    <p>Element with custom border</p>
</div>

<style>
.border-custom {
    border-radius: ${properties['border-radius']}px;
    border: ${properties['border-width']}px ${properties['border-style']} ${properties['border-color']};
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
    font-size: ${properties['font-size']}px;
    font-weight: ${properties['font-weight']};
    text-align: ${properties['text-align']};
    line-height: ${properties['line-height']};
    letter-spacing: ${properties['letter-spacing']}px;
    text-transform: ${properties['text-transform']};
}`;
    
    const bootstrap = `<div class="typography-custom">
    <h2>Typography Example</h2>
    <p>This is a paragraph with custom typography styles applied.</p>
</div>

<style>
.typography-custom {
    font-size: ${properties['font-size']}px;
    font-weight: ${properties['font-weight']};
    text-align: ${properties['text-align']};
    line-height: ${properties['line-height']};
    letter-spacing: ${properties['letter-spacing']}px;
    text-transform: ${properties['text-transform']};
}
</style>`;
    
    return { html, css, bootstrap };
}

/**
 * Generate background code
 */
function generateBackgroundCode(properties) {
    let background = properties['background-color'];
    
    if (properties['background-type'] === 'gradient') {
        background = `linear-gradient(135deg, ${properties['background-color']}, #667eea)`;
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
    position: ${properties['position']};
    display: ${properties['display']};
    z-index: ${properties['z-index']};
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
    position: ${properties['position']};
    display: ${properties['display']};
    z-index: ${properties['z-index']};
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
}

/**
 * Download file helper
 */
function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Copy code to clipboard
 */
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Code copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Code copied to clipboard!');
    }
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Show welcome animation
 */
function showWelcomeAnimation() {
    const $sidebar = $('.sidebar');
    const $controls = $('.controls-section');
    const $preview = $('.preview-section');
    
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

/**
 * Show toast notification
 */
function showToast(message) {
    $('#toastMessage').text(message);
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    toast.show();
}

/**
 * Save current state to localStorage
 */
function saveToLocalStorage() {
    localStorage.setItem('cssEditorState', JSON.stringify(AppState.properties));
}

/**
 * Load state from localStorage
 */
function loadFromLocalStorage() {
    const saved = localStorage.getItem('cssEditorState');
    if (saved) {
        try {
            AppState.properties = { ...AppState.properties, ...JSON.parse(saved) };
        } catch (e) {
            console.error('Failed to load saved state:', e);
        }
    }
}

// Utility functions

/**
 * Convert hex color to rgba with opacity
 */
function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Format option labels
 */
function formatOptionLabel(option) {
    return option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format category names
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
    return names[category] || category;
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

// Initialize app when DOM is ready
$(document).ready(function() {
    // Load saved state
    loadFromLocalStorage();
    
    // Initialize the application
    initializeApp();
});
