function component_qTB() {
    const qTB = document.createElement('div');
    qTB.id = 'quickTranslateButton';
    qTB.textContent = '🌐';
    applyStyles(qTB, {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5em',
        width: '2.5em',
        height: '2.5em',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        border: '1px solid #ffffff',
        color: 'white',
        zIndex: '10000',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    });
    return qTB;
}

function component_menu() {
    const menu = document.createElement('div');
    menu.id = 'contextMenu';
    applyStyles(menu, {
        position: 'absolute',
        backgroundColor: '#ffffff',
        border: '1px solid #ccc',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
        display: 'none',
        zIndex: '10001'
    });
    return menu;
}

function component_resetItem() {
    const resetItem = document.createElement('div');
    resetItem.textContent = 'Reset Position';
    applyStyles(resetItem, {
        padding: '10px',
        cursor: 'pointer',
    });
    return resetItem;
}

function component_colorPicker() {
    const colorPicker = document.createElement('div');
    colorPicker.textContent = 'Change Color';
    applyStyles(colorPicker, {
        padding: '10px',
        cursor: 'pointer',
    });
    return colorPicker;
}

function component_refreshItem() {
    const refreshItem = document.createElement('div');
    refreshItem.textContent = 'Refresh';
    applyStyles(refreshItem, {
        padding: '10px',
        cursor: 'pointer',
    });
    return refreshItem;
}

function component_closeItem() {
    const closeItem = document.createElement('div');
    closeItem.textContent = 'Close';
    applyStyles(closeItem, {
        padding: '10px',
        cursor: 'pointer',
    });
    return closeItem;
}

function component_container () {
    const container = document.createElement('div');
    applyStyles(container, {
        position: 'fixed',
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '20em',
        backgroundColor: '#ffffff',
        border: '1px solid #ccc',
        padding: '1em',
        zIndex: '10000',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease-in-out',
        maxHeight: '80vh',
        overflow: 'auto'
    });
    return container;
}

function component_selectContainer() {
    const selectContainer = document.createElement('div');
    applyStyles(selectContainer, {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
    });
    return selectContainer;
}

function component_select() {
    const select = document.createElement('select');
        applyStyles(select, {
            width: '100%',
            padding: '0.5em',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            appearance: 'none',
            cursor: 'pointer'
        });
    return select;
    }

function component_arrow() {
    const arrow = document.createElement('div');
        applyStyles(arrow, {
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            fontSize: '0.8em',
            color: '#555'
        });
        arrow.textContent = '▼';
    return arrow;
}

function component_input() {
    const input = document.createElement('textarea');

    applyStyles(input, {
        width: '100%',
        height: '50px',
        marginTop: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        padding: '0.5em',
        boxSizing: 'border-box',
        resize: 'vertical',
        maxHeight: '200px'
    });
    return input;
}

function component_result (){
    const result = document.createElement('textarea');
    applyStyles(result, {
        width: '100%',
        height: '50px',
        marginTop: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        padding: '0.5em',
        boxSizing: 'border-box',
        backgroundColor: '#f1f1f1',
        color: '#000000',
        resize: 'vertical',
        maxHeight: '200px'
    });
    return result;
}