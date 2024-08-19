if (!document.getElementById('quickTranslateButton')) {
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

        element.addEventListener('mousedown', (e) => {
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

    const qTBPos = loadPosition('quickTranslateButton');
    if (qTBPos) {
        applyStyles(qTB, { left: qTBPos.x, top: qTBPos.y });
    } else {
        applyStyles(qTB, { top: '1em', right: '1em' });
    }
    adjustPosition(qTB);

    qTB.addEventListener('click', () => {
        applyStyles(qTB, { opacity: '0', transform: 'scale(0.8)' });
        setTimeout(() => {
            qTB.style.display = 'none';
            applyStyles(container, { display: 'flex', opacity: '1', transform: 'translateY(0)' });
            container.querySelector('textarea').focus();
        }, 300);
    });

    function createContextMenu() {
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

        const resetItem = document.createElement('div');
        resetItem.textContent = 'Reset Position';
        applyStyles(resetItem, {
            padding: '10px',
            cursor: 'pointer',
        });
        resetItem.addEventListener('click', () => {
            const defaultPos = { top: '1em', right: '1em' };
            applyStyles(qTB, defaultPos);
            applyStyles(container, defaultPos);
            savePosition('quickTranslateButton', defaultPos.right, defaultPos.top);
            savePosition('translator-container', defaultPos.right, defaultPos.top);
            menu.style.display = 'none';
        });
        menu.appendChild(resetItem);

        const colorPicker = document.createElement('div');
        colorPicker.textContent = 'Change Color';
        applyStyles(colorPicker, {
            padding: '10px',
            cursor: 'pointer',
        });
        colorPicker.addEventListener('click', () => {
            const color = prompt('Enter a color code or name (e.g., #ff0000 or red):');
            if (color) {
                applyStyles(qTB, { backgroundColor: color });
                qTB.style.backgroundColor = color;
            }
        });
        menu.appendChild(colorPicker);

        const refreshItem = document.createElement('div');
        refreshItem.textContent = 'Refresh';
        applyStyles(refreshItem, {
            padding: '10px',
            cursor: 'pointer',
        });
        refreshItem.addEventListener('click', () => {
            location.reload();
        });
        menu.appendChild(refreshItem);

        const closeItem = document.createElement('div');
        closeItem.textContent = 'Close';
        applyStyles(closeItem, {
            padding: '10px',
            cursor: 'pointer',
        });
        closeItem.addEventListener('click', () => {
            qTB.style.display = 'none';
            container.style.display = 'none';
            menu.style.display = 'none';
        });
        menu.appendChild(closeItem);

        document.body.appendChild(menu);

        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (e.target === qTB || e.target === container) {
                const menuWidth = menu.offsetWidth;
                const menuHeight = menu.offsetHeight;
                let left = e.clientX;
                let top = e.clientY;

                if (e.clientX + menuWidth > window.innerWidth) {
                    left = e.clientX - menuWidth;
                }
                if (e.clientY + menuHeight > window.innerHeight) {
                    top = e.clientY - menuHeight;
                }

                applyStyles(menu, { display: 'block', left: `${left}px`, top: `${top}px` });
            } else {
                menu.style.display = 'none';
            }
        });

        document.addEventListener('click', () => {
            menu.style.display = 'none';
        });
    }

    createContextMenu();

    document.body.appendChild(qTB);
    makeDraggable(qTB);

    const container = document.createElement('div');
    container.id = 'translator-container';
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

    const containerPos = loadPosition('translator-container');
    if (containerPos) {
        applyStyles(container, { left: containerPos.x, top: containerPos.y });
    } else {
        applyStyles(container, { top: '1em', right: '1em' });
    }
    adjustPosition(container);

    container.addEventListener('mouseleave', () => {
        applyStyles(container, { opacity: '0', transform: 'translateY(-20px)' });
        setTimeout(() => {
            container.style.display = 'none';
            applyStyles(qTB, { display: 'flex', opacity: '1', transform: 'scale(1)' });
        }, 300);
    });

    makeDraggable(container);

    function createCustomSelect(id, languages, selectedValue) {
        const selectContainer = document.createElement('div');
        applyStyles(selectContainer, {
            position: 'relative',
            width: '100%',
            marginTop: '10px'
        });

        const select = document.createElement('select');
        select.id = id;
        applyStyles(select, {
            width: '100%',
            padding: '0.5em',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            appearance: 'none',
            cursor: 'pointer'
        });

        for (const code in languages) {
            const option = document.createElement('option');
            option.value = code;
            option.text = languages[code];
            select.appendChild(option);
        }
        select.value = selectedValue;

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

        selectContainer.appendChild(select);
        selectContainer.appendChild(arrow);

        return selectContainer;
    }

    const languages = {
        'pl': 'Polish',
        'en': 'English',
        'es': 'Spanish',
        'de': 'German',
        'fr': 'French',
        'it': 'Italian',
        'ru': 'Russian',
        'zh': 'Chinese',
        'ja': 'Japanese'
    };

    const firstLanguageFieldContainer = createCustomSelect('firstLanguageField', languages, 'pl');
    const secondLanguageFieldContainer = createCustomSelect('secondLanguageField', languages, 'en');

    const input = document.createElement('textarea');
    input.id = 'word';
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

    input.autofocus = true;

    const result = document.createElement('textarea');
    result.id = 'translationResult';
    result.readOnly = true;
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

    function translate() {
        const word = input.value;
        const fromLang = firstLanguageFieldContainer.querySelector('select').value;
        const toLang = secondLanguageFieldContainer.querySelector('select').value;
        if (word.trim() === '') {
            result.value = '';
            return;
        }

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${fromLang}|${toLang}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const translation = data.responseData.translatedText;
                result.value = translation;
            })
            .catch(error => {
                result.value = 'Translation error';
            });
    }

    input.addEventListener('input', () => {
        clearTimeout(input._timeout);
        input._timeout = setTimeout(translate, 200);
    });

    firstLanguageFieldContainer.querySelector('select').addEventListener('change', translate);
    secondLanguageFieldContainer.querySelector('select').addEventListener('change', translate);

    container.appendChild(firstLanguageFieldContainer);
    container.appendChild(input);
    container.appendChild(result);
    container.appendChild(secondLanguageFieldContainer);

    document.body.appendChild(container);

    translate();
}
