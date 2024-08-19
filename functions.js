function applyStyles(element, styles) {
    Object.assign(element.style, styles);
}

function savePosition(id, x, y) {
    localStorage.setItem(id + '_pos', JSON.stringify({ x, y }));
}

function loadPosition(id) {
    const pos = localStorage.getItem(id + '_pos');
    return pos ? JSON.parse(pos) : null;
}

function adjustPosition(element) {
    const rect = element.getBoundingClientRect();
    const containerWidth = element.offsetWidth;
    const containerHeight = element.offsetHeight;

    if (rect.left < 0) {
        applyStyles(element, { left: '0px' });
    }
    if (rect.top < 0) {
        applyStyles(element, { top: '0px' });
    }
    if (rect.right > window.innerWidth) {
        applyStyles(element, { left: `${window.innerWidth - containerWidth}px` });
    }
    if (rect.bottom > window.innerHeight) {
        applyStyles(element, { top: `${window.innerHeight - containerHeight}px` });
    }
}

function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    function isElementTextArea(e) {
        console.log(e);
        const elementAtCursor = document.elementFromPoint(e.clientX, e.clientY);
        console.log(elementAtCursor);
        return elementAtCursor.tagName === 'TEXTAREA';
    }

    element.addEventListener('mousedown', (e) => {

        if (isElementTextArea(e)) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = parseInt(element.style.left || 0, 10);
        initialY = parseInt(element.style.top || 0, 10);
        document.body.style.userSelect = 'none';
        applyStyles(element, { transition: 'none' });
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newLeft = Math.max(0, Math.min(initialX + deltaX, window.innerWidth - element.offsetWidth));
        const newTop = Math.max(0, Math.min(initialY + deltaY, window.innerHeight - element.offsetHeight));

        applyStyles(element, {
            left: `${newLeft}px`,
            top: `${newTop}px`
        });
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = '';
        savePosition(element.id, element.style.left, element.style.top);
        applyStyles(element, { transition: 'all 0.3s ease-in-out' });
    }
}