//PlusObjectsEditor

function openPlusObjectsEditor() {
    const PlusObjectsEditorPanel = document.getElementById('PlusObjectsEditorPanel');
    PlusObjectsEditorPanel.style.display = 'flex'; // Показываем панель
}

function closePlusObjectsEditor() {
    const PlusObjectsEditorPanel = document.getElementById('PlusObjectsEditorPanel');
    PlusObjectsEditorPanel.style.display = 'none'; // Скрываем панель
}

//3DObjects

function openThreeDMenu() {
    const ThreeDObjectsMenuPanel = document.getElementById('ThreeDObjectsMenuPanel');
    ThreeDObjectsMenuPanel.style.display = 'flex'; // Показываем панель
}

function closeThreeDMenu() {
    const ThreeDObjectsMenuPanel = document.getElementById('ThreeDObjectsMenuPanel');
    ThreeDObjectsMenuPanel.style.display = 'none'; // Скрываем панель
}

//GUIMenu

function openGUIMenu() {
    const GUIMenuPanel = document.getElementById('GUIMenuPanel');
    GUIMenuPanel.style.display = 'flex'; // Показываем панель
}

function closeGUIMenu() {
    const GUIMenuPanel = document.getElementById('GUIMenuPanel');
    GUIMenuPanel.style.display = 'none'; // Скрываем панель
}

//Panel

function CreateGUIPanel() {
    const panel = document.getElementById('panel');

    // Создаем новый квадрат
    const square = document.createElement('div');
    square.classList.add('square');

    // Генерируем случайный цвет для квадрата
    square.style.backgroundColor = `rgb(255,255,255)`;

    // Устанавливаем начальные координаты квадрата (центр панели)
    square.style.left = `${panel.offsetWidth / 2 - 50}px`;
    square.style.top = `${panel.offsetHeight / 2 - 50}px`;

    // Добавляем квадрат на панель
    panel.appendChild(square);

    // Добавляем обработчик для перетаскивания
    square.addEventListener('mousedown', startDragging);
}

// Переменные для хранения активного элемента и смещения
let activeElement = null;
let offsetX = 0;
let offsetY = 0;

// Функция начала перетаскивания
function startDragging(event) {
    // Убедимся, что элемент имеет позиционирование "absolute"
    if (event.target.style.position !== 'absolute') {
        event.target.style.position = 'absolute';
    }

    activeElement = event.target;

    // Вычисляем смещение относительно позиции курсора
    const rect = activeElement.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    // Устанавливаем стиль курсора
    activeElement.style.cursor = 'grabbing';

    // Добавляем события перемещения и завершения перетаскивания
    document.addEventListener('mousemove', dragElement);
    document.addEventListener('mouseup', stopDragging);
}

// Функция перемещения элемента
function dragElement(event) {
    if (activeElement) {
        // Определяем родительский контейнер для ограничения перемещения
        const parent = activeElement.parentElement;
        const parentRect = parent.getBoundingClientRect();

        // Новая позиция с учетом границ контейнера
        let newLeft = event.clientX - offsetX;
        let newTop = event.clientY - offsetY;

        // Ограничиваем движение внутри контейнера
        newLeft = Math.max(parentRect.left, Math.min(newLeft, parentRect.right - activeElement.offsetWidth));
        newTop = Math.max(parentRect.top, Math.min(newTop, parentRect.bottom - activeElement.offsetHeight));

        // Применяем новые координаты
        activeElement.style.left = `${newLeft - parentRect.left}px`;
        activeElement.style.top = `${newTop - parentRect.top}px`;
    }
}

// Функция завершения перетаскивания
function stopDragging() {
    if (activeElement) {
        // Возвращаем курсор в исходное состояние
        activeElement.style.cursor = 'grab';
    }

    // Удаляем события перемещения и завершения перетаскивания
    document.removeEventListener('mousemove', dragElement);
    document.removeEventListener('mouseup', stopDragging);

    activeElement = null;
}

// Функция удаления элемента
function deleteElement(event) {
    const target = event.target;
    if (target.classList.contains('draggable')) {
        target.remove();
    }
}

// Привязываем событие начала перетаскивания ко всем элементам с классом "draggable"
const draggableElements = document.querySelectorAll('.draggable');
draggableElements.forEach(element => {
    element.addEventListener('mousedown', startDragging);
    element.addEventListener('dblclick', deleteElement); // Удаление по двойному клику
});

//GUIText

function CreateGUIText() {
    const panel = document.getElementById('panel');

    // Создаем новый текстовый элемент
    const textElement = document.createElement('div');
    textElement.classList.add('text-element');

    // Устанавливаем содержимое текста и стиль
    textElement.textContent = 'Перетащи меня';
    textElement.style.position = 'absolute';
    textElement.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // Лёгкий фон для видимости
    textElement.style.padding = '10px';
    textElement.style.borderRadius = '5px';
    textElement.style.color = '#000';
    textElement.style.fontSize = '16px';
    textElement.style.cursor = 'grab';
    textElement.style.border = '1px solid #ccc';

    // Устанавливаем начальные координаты текста (центр панели)
    textElement.style.left = `${panel.offsetWidth / 2 - 50}px`;
    textElement.style.top = `${panel.offsetHeight / 2 - 20}px`;

    // Добавляем текстовый элемент на панель
    panel.appendChild(textElement);

    // Добавляем обработчик для перетаскивания
    textElement.addEventListener('mousedown', startDragging);

    // Добавляем обработчик для контекстного меню
    textElement.addEventListener('contextmenu', openContextMenu);

    // Добавляем возможность удаления по двойному клику
    textElement.addEventListener('dblclick', deleteElement);
}

// Функция удаления элемента
function deleteElement(event) {
    const target = event.target;
    if (target.classList.contains('text-element')) {
        target.remove();
    }
}

// Функция изменения текста
function editTextElement(target) {
    const newText = prompt('Введите новый текст:', target.textContent);
    if (newText !== null) {
        target.textContent = newText;
    }
}

// Функция открытия контекстного меню
function openContextMenu(event) {
    event.preventDefault(); // Предотвращаем стандартное контекстное меню

    // Удаляем предыдущее меню, если оно есть
    const existingMenu = document.getElementById('context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    // Создаем новое меню
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.style.position = 'absolute';
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
    menu.style.backgroundImage = 'linear-gradient(90deg, #1f2937, #293647)';
    menu.style.border = '1px solid #000';
    menu.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    menu.style.padding = '5px';
    menu.style.zIndex = '1000';
    menu.style.fontSize = '14px';
    menu.style.borderRadius = '4px';

    // Добавляем пункты меню
    const editOption = document.createElement('div');
    editOption.textContent = 'Изменить';
    editOption.style.padding = '5px';
    editOption.style.cursor = 'pointer';
    editOption.style.borderBottom = '1px solid #000';
    editOption.addEventListener('click', () => {
        editTextElement(event.target);
        menu.remove();
    });

    const deleteOption = document.createElement('div');
    deleteOption.textContent = 'Удалить';
    deleteOption.style.padding = '5px';
    deleteOption.style.cursor = 'pointer';
    deleteOption.addEventListener('click', () => {
        event.target.remove();
        menu.remove();
    });

    // Добавляем пункты в меню
    menu.appendChild(editOption);
    menu.appendChild(deleteOption);

    // Добавляем меню в документ
    document.body.appendChild(menu);

    // Удаляем меню при клике вне его
    document.addEventListener('click', function removeMenu(e) {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', removeMenu);
        }
    });
}

// Привязываем событие начала перетаскивания ко всем элементам с классом "text-element"
const textElements = document.querySelectorAll('.text-element');
textElements.forEach(element => {
    element.addEventListener('mousedown', startDragging);
    element.addEventListener('contextmenu', openContextMenu);
    element.addEventListener('dblclick', deleteElement); // Удаление по двойному клику
});

//SpritesEditor

function openSpritesEditor() {
    const SpritesEditorPanel = document.getElementById('SpritesEditorPanel');
    SpritesEditorPanel.style.display = 'flex'; // Показываем панель
}

function closeSpritesEditor() {
    const SpritesEditorPanel = document.getElementById('SpritesEditorPanel');
    SpritesEditorPanel.style.display = 'none'; // Скрываем панель
}

document.getElementById('uploadSprite').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('spritePreview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Sprite" style="max-width: 100%; max-height: 100%;">`;
        };
        reader.readAsDataURL(file);
    }
});

//ScriptMenu

function openScriptMenu() {
    const ScriptMenuPanel = document.getElementById('ScriptMenuPanel');
    ScriptMenuPanel.style.display = 'flex'; // Показываем панель
}

function closeScriptMenu() {
    const ScriptMenuPanel = document.getElementById('ScriptMenuPanel');
    ScriptMenuPanel.style.display = 'none'; // Скрываем панель
}

//BuildSettingsMenu

function openBuildSettingsMenu() {
    const BuildSettingsMenuPanel = document.getElementById('BuildSettingsMenuPanel');
    BuildSettingsMenuPanel.style.display = 'flex'; // Показываем панель
}

function closeBuildSettingsMenu() {
    const BuildSettingsMenuPanel = document.getElementById('BuildSettingsMenuPanel');
    BuildSettingsMenuPanel.style.display = 'none'; // Скрываем панель
}

function saveJSON() {
    // Получаем значения из текстовых полей
    const name = document.getElementById('projectName').value || "MyProject";
    const packageName = document.getElementById('projectPackage').value || "com.myproject";
    const version = document.getElementById('projectVersion').value || "1.0.0";
    const author = document.getElementById('projectAuthor').value || "Your Name";
    const buildnum = document.getElementById('projectBuildNum').value || "1";

    // Создаем объект JSON
    const jsonData = {
        name: name,
        package: packageName,
        version: version,
        author: author,
        buildnum: buildnum
    };

    // Преобразуем объект в строку
    const jsonString = JSON.stringify(jsonData, null, 4);

    // Создаем файл для загрузки
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${name}.json`; // Имя файла совпадает с названием проекта
    link.click();
}

//RunLoading

function openRunLoading() {
    const RunLoadingPanel = document.getElementById('RunLoadingPanel');
    RunLoadingPanel.style.display = 'flex'; // Показываем панель
    
    // Запускаем таймер на 3 секунды
    setTimeout(() => {
        RunLoadingPanel.style.display = 'none'; // Скрываем панель
        closeRunLoading(); // Вызываем функцию после таймера
    }, 3000);
}

function closeRunLoading() {
    const RunLoadingPanel = document.getElementById('RunLoadingPanel');
    RunLoadingPanel.style.display = 'none'; // Скрываем панель
    openRunMenu()
}

//RunMenu

function openRunMenu() {
    const RunMenuPanel = document.getElementById('RunMenuPanel');
    RunMenuPanel.style.display = 'flex'; // Показываем панель
}

function closeRunMenu() {
    const RunMenuPanel = document.getElementById('RunMenuPanel');
    RunMenuPanel.style.display = 'none'; // Скрываем панель
}
