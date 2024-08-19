
if (!document.getElementById('quickTranslateButton')) {

    const qTB = component_qTB();

    const qTBPos = loadPosition('quickTranslateButton');
    
    if (qTBPos) {
        applyStyles(qTB, { top: qTBPos.y, left: qTBPos.x });
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

        const menu = component_menu();

        const resetItem = component_resetItem();

        resetItem.addEventListener('click', () => {
            const defaultPos = { top: '1em', right: '1em' };
            applyStyles(qTB, defaultPos);
            applyStyles(container, defaultPos);
            savePosition('quickTranslateButton', defaultPos.right, defaultPos.top);
            savePosition('translator-container', defaultPos.right, defaultPos.top);
            menu.style.display = 'none';
        });
        menu.appendChild(resetItem);


        const colorPicker = component_colorPicker();

        colorPicker.addEventListener('click', () => {
            const color = prompt('Enter a color code or name (e.g., #ff0000 or red):');
            if (color) {
                applyStyles(qTB, { backgroundColor: color });
                qTB.style.backgroundColor = color;
            }
        });
        menu.appendChild(colorPicker);

        const refreshItem = component_refreshItem();
        
        refreshItem.addEventListener('click', () => {
            location.reload();
        });
        menu.appendChild(refreshItem);

        const closeItem = component_closeItem();

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

    const container = component_container();

    container.id = 'translator-container';

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
        const selectContainer = component_selectContainer();

        const select = component_select();
        select.id = id;

        for (const code in languages) {
            const option = document.createElement('option');
            option.value = code;
            option.text = languages[code];
            select.appendChild(option);
        }

        select.value = selectedValue;

        const arrow = component_arrow();

        selectContainer.appendChild(select);
        selectContainer.appendChild(arrow);

        return selectContainer;
    }

    languages = getLanguages;

    const firstLanguageFieldContainer = createCustomSelect('firstLanguageField', languages, 'pl');
    const secondLanguageFieldContainer = createCustomSelect('secondLanguageField', languages, 'en');

    const input = component_input();
    input.id = 'word';


    input.autofocus = true;

    const result = component_result();

    result.id = 'translationResult';

    result.readOnly = true;

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
        input._timeout = setTimeout(translate, 0);
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
