//PlusObjectsEditor

function openPlusObjectsEditor() {
    const PlusObjectsEditorPanel = document.getElementById('PlusObjectsEditorPanel');
    PlusObjectsEditorPanel.style.display = 'flex'; // Показываем панель
}

function closePlusObjectsEditor() {
    const PlusObjectsEditorPanel = document.getElementById('PlusObjectsEditorPanel');
    PlusObjectsEditorPanel.style.display = 'none'; // Скрываем панель
}

//AIEditor

function openAIEditor() {
    const AIEditorPanel = document.getElementById('AIEditorPanel');
    AIEditorPanel.style.display = 'flex'; // Показываем панель
}

function closeAIEditor() {
    const AIEditorPanel = document.getElementById('AIEditorPanel');
    AIEditorPanel.style.display = 'none'; // Скрываем панель
}

function closeAIEditor() {
    document.getElementById("AIEditorPanel").style.display = "none";
}

function closeAIEditor() {
    document.getElementById("AIEditorPanel").style.display = "none";
}

function closeAIEditor() {
    document.getElementById("AIEditorPanel").style.display = "none";
}

function closeAIEditor() {
    document.getElementById("AIEditorPanel").style.display = "none";
}

function closeAIEditor() {
    document.getElementById("AIEditorPanel").style.display = "none";
}

// Функция для обработки нажатия Enter
function handleEnter(event) {
    if (event.key === "Enter") {
        checkQuestion();
    }
}

// Функция для анимации печатания текста
function typeText(element, text, speed, callback) {
    let index = 0;
    const interval = setInterval(() => {
        element.textContent += text.charAt(index);
        index++;
        if (index === text.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, speed);
}

// Функция для проверки вопроса и ответа
function checkQuestion() {
    const userQuestion = document.getElementById("userQuestion").value.toLowerCase();
    const userMessageContainer = document.getElementById("userMessageContainer");
    const aiMessageContainer = document.getElementById("AIMessageContainer");

    // Отправка сообщения пользователя
    const userMessage = document.createElement("p");
    userMessage.textContent = userQuestion;
    userMessageContainer.appendChild(userMessage);

    // Заглушка "думания" AI
    const aiThinkingMessage = document.createElement("p");
    aiThinkingMessage.textContent = "Подождите, я думаю...";
    aiMessageContainer.appendChild(aiThinkingMessage);

    // Загрузка JSON данных
    fetch('qa.json')
        .then(response => response.json())
        .then(data => {
            // Поиск ответа на основе вопроса
            const foundAnswer = data.questions.find(item => item.question.toLowerCase() === userQuestion);
            setTimeout(() => {
                aiThinkingMessage.textContent = ""; // Убираем "думающий" текст
                const aiAnswerMessage = document.createElement("p");

                if (foundAnswer) {
                    // Анимация печатания ответа
                    typeText(aiAnswerMessage, foundAnswer.answer, 100); // 10ms для каждого символа
                } else {
                    // Анимация печатания для ответа "не понимаю"
                    typeText(aiAnswerMessage, "Я не понимаю ваш вопрос.", 100);
                }

                aiMessageContainer.appendChild(aiAnswerMessage);
                document.getElementById("userQuestion").value = ""; // Очистка поля ввода
            }, 1500); // Задержка для эффекта "думания"
        })
        .catch(error => {
            console.error('Error loading QA data:', error);
            aiThinkingMessage.textContent = "Ошибка загрузки данных. Попробуйте позже.";
        });
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

//Transform

// Global variables
let currentMode = null; // Current active mode
let selectedElement = null; // Active object for interaction
let isDragging = false; // Dragging flag
let offsetX = 0; // X offset
let offsetY = 0; // Y offset
let isRotating = false; // Rotation flag
let initialAngle = 0; // Initial angle for rotation
let initialMouseX = 0; // Initial mouse X position for rotation
let initialMouseY = 0; // Initial mouse Y position for rotation
let isScaling = false; // Scaling flag
let initialWidth = 0; // Initial width for scaling
let initialHeight = 0; // Initial height for scaling
let scaleDirection = ''; // Direction of scaling

// Enable cursor mode
function enableCursorMode() {
    if (currentMode === 'cursor') return;

    disableCurrentMode();
    currentMode = 'cursor';

    document.querySelector('.Cursor').style.backgroundColor = 'lightblue';
    document.querySelector('.Transform').style.backgroundColor = '';

    document.getElementById('panel').addEventListener('mousedown', startDraggingCursor);
    document.addEventListener('mouseup', stopDraggingCursor);
    document.addEventListener('mousemove', dragCursor);
}

// Enable transform mode
function enableTransformMode() {
    if (currentMode === 'transform') return;

    disableCurrentMode();
    currentMode = 'transform';

    document.querySelector('.Transform').style.backgroundColor = 'lightblue';
    document.querySelector('.Cursor').style.backgroundColor = '';

    if (selectedElement) {
        createTransformArrows(selectedElement);
    }

    document.addEventListener('keydown', moveWithArrows);
}

// Enable rotate mode
function enableRotateMode() {
    if (currentMode === 'rotate') return;

    disableCurrentMode();
    currentMode = 'rotate';

    document.querySelector('.Rotate').style.backgroundColor = 'lightblue';
    document.querySelector('.Cursor').style.backgroundColor = '';

    if (selectedElement) {
        createRotateCircle(selectedElement);
    }

    document.addEventListener('mousedown', startRotation);
    document.addEventListener('mousemove', rotateElement);
    document.addEventListener('mouseup', stopRotation);
}

// Enable scale mode
function enableScaleMode() {
    if (currentMode === 'scale') return;

    disableCurrentMode();
    currentMode = 'scale';

    document.querySelector('.Scale').style.backgroundColor = 'lightblue';
    document.querySelector('.Cursor').style.backgroundColor = '';

    if (selectedElement) {
        createScaleHandles(selectedElement);
    }
}

// Create transform arrows
function createTransformArrows(element) {
    const arrowContainer = document.createElement('div');
    arrowContainer.classList.add('arrow-container');
    arrowContainer.style.position = 'relative';

    const arrowX = document.createElement('div');
    arrowX.classList.add('arrow', 'arrow-x');
    arrowX.style.backgroundColor = 'red';
    arrowX.style.position = 'absolute';
    arrowX.style.width = '20px';
    arrowX.style.height = '20px';
    arrowX.style.top = '50%';
    arrowX.style.right = '-10px';
    arrowX.style.cursor = 'pointer';

    const arrowY = document.createElement('div');
    arrowY.classList.add('arrow', 'arrow-y');
    arrowY.style.backgroundColor = 'green';
    arrowY.style.position = 'absolute';
    arrowY.style.width = '20px';
    arrowY.style.height = '20px';
    arrowY.style.bottom = '-10px';
    arrowY.style.left = '50%';
    arrowY.style.transform = 'translateX(-50%)';
    arrowY.style.cursor = 'pointer';

    element.appendChild(arrowContainer);
    arrowContainer.appendChild(arrowX);
    arrowContainer.appendChild(arrowY);

    arrowX.addEventListener('mousedown', (event) => {
        event.preventDefault();
        isDragging = true;
        offsetX = event.clientX - element.getBoundingClientRect().left;
    });

    arrowY.addEventListener('mousedown', (event) => {
        event.preventDefault();
        isDragging = true;
        offsetY = event.clientY - element.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (event) => {
        if (!isDragging) return;

        if (event.target === arrowX) {
            const parentRect = element.parentElement.getBoundingClientRect();
            let newLeft = event.clientX - parentRect.left - offsetX;
            newLeft = Math.max(0, Math.min(newLeft, parentRect.width - element.offsetWidth));
            element.style.left = `${newLeft}px`;
        }

        if (event.target === arrowY) {
            const parentRect = element.parentElement.getBoundingClientRect();
            let newTop = event.clientY - parentRect.top - offsetY;
            newTop = Math.max(0, Math.min(newTop, parentRect.height - element.offsetHeight));
            element.style.top = `${newTop}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Create rotate circle
function createRotateCircle(element) {
    const rotateCircle = document.createElement('div');
    rotateCircle.classList.add('rotate-circle');
    rotateCircle.style.position = 'absolute';
    rotateCircle.style.width = '30px';
    rotateCircle.style.height = '30px';
    rotateCircle.style.borderRadius = '50%';
    rotateCircle.style.border = '2px solid blue';
    rotateCircle.style.cursor = 'pointer';
    rotateCircle.style.top = `${element.offsetTop - 20}px`;
    rotateCircle.style.left = `${element.offsetLeft + element.offsetWidth - 15}px`;

    element.parentElement.appendChild(rotateCircle);
}

// Create scale handles
function createScaleHandles(element) {
    const handlePositions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    const handleContainer = document.createElement('div');
    handleContainer.classList.add('scale-handles');
    
    handlePositions.forEach(position => {
        const handle = document.createElement('div');
        handle.classList.add('scale-handle', `scale-handle-${position}`);
        handle.style.position = 'absolute';
        handle.style.width = '10px';
        handle.style.height = '10px';
        handle.style.backgroundColor = '#0066cc';
        handle.style.cursor = getCursorStyle(position);

        // Position the handle
        switch(position) {
            case 'nw': 
                handle.style.top = '-5px';
                handle.style.left = '-5px';
                break;
            case 'n':
                handle.style.top = '-5px';
                handle.style.left = '50%';
                handle.style.transform = 'translateX(-50%)';
                break;
            case 'ne':
                handle.style.top = '-5px';
                handle.style.right = '-5px';
                break;
            case 'e':
                handle.style.top = '50%';
                handle.style.right = '-5px';
                handle.style.transform = 'translateY(-50%)';
                break;
            case 'se':
                handle.style.bottom = '-5px';
                handle.style.right = '-5px';
                break;
            case 's':
                handle.style.bottom = '-5px';
                handle.style.left = '50%';
                handle.style.transform = 'translateX(-50%)';
                break;
            case 'sw':
                handle.style.bottom = '-5px';
                handle.style.left = '-5px';
                break;
            case 'w':
                handle.style.top = '50%';
                handle.style.left = '-5px';
                handle.style.transform = 'translateY(-50%)';
                break;
        }

        handle.addEventListener('mousedown', (e) => {
            startScaling(e, position);
        });

        element.appendChild(handle);
    });

    document.addEventListener('mousemove', scaleElement);
    document.addEventListener('mouseup', stopScaling);
}

// Get cursor style for scale handles
function getCursorStyle(position) {
    const cursorStyles = {
        'nw': 'nw-resize',
        'n': 'n-resize',
        'ne': 'ne-resize',
        'e': 'e-resize',
        'se': 'se-resize',
        's': 's-resize',
        'sw': 'sw-resize',
        'w': 'w-resize'
    };
    return cursorStyles[position];
}

// Start rotation
function startRotation(event) {
    if (currentMode !== 'rotate' || !selectedElement) return;

    const rect = selectedElement.getBoundingClientRect();
    initialMouseX = event.clientX;
    initialMouseY = event.clientY;

    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;

    initialAngle = Math.atan2(event.clientY - elementCenterY, event.clientX - elementCenterX) * 180 / Math.PI;

    isRotating = true;
    event.preventDefault();
}

// Rotate element
function rotateElement(event) {
    if (!isRotating || currentMode !== 'rotate' || !selectedElement) return;

    const rect = selectedElement.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;

    const angle = Math.atan2(event.clientY - elementCenterY, event.clientX - elementCenterX) * 180 / Math.PI;
    const rotation = angle - initialAngle;

    selectedElement.style.transform = `rotate(${rotation}deg)`;
}

// Stop rotation
function stopRotation() {
    if (isRotating) {
        isRotating = false;
        selectedElement = null;
    }
}

// Start scaling
function startScaling(event, direction) {
    if (currentMode !== 'scale' || !selectedElement) return;

    isScaling = true;
    scaleDirection = direction;
    initialWidth = selectedElement.offsetWidth;
    initialHeight = selectedElement.offsetHeight;
    
    const rect = selectedElement.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    event.preventDefault();
}

// Scale element
function scaleElement(event) {
    if (!isScaling || currentMode !== 'scale' || !selectedElement) return;

    const rect = selectedElement.getBoundingClientRect();
    const deltaX = event.clientX - (rect.left + offsetX);
    const deltaY = event.clientY - (rect.top + offsetY);

    let newWidth = initialWidth;
    let newHeight = initialHeight;

    switch(scaleDirection) {
        case 'e':
            newWidth = initialWidth + deltaX;
            break;
        case 'w':
            newWidth = initialWidth - deltaX;
            break;
        case 's':
            newHeight = initialHeight + deltaY;
            break;
        case 'n':
            newHeight = initialHeight - deltaY;
            break;
        case 'se':
            newWidth = initialWidth + deltaX;
            newHeight = initialHeight + deltaY;
            break;
        case 'sw':
            newWidth = initialWidth - deltaX;
            newHeight = initialHeight + deltaY;
            break;
        case 'ne':
            newWidth = initialWidth + deltaX;
            newHeight = initialHeight - deltaY;
            break;
        case 'nw':
            newWidth = initialWidth - deltaX;
            newHeight = initialHeight - deltaY;
            break;
    }

    // Apply minimum size constraints
    newWidth = Math.max(20, newWidth);
    newHeight = Math.max(20, newHeight);

    selectedElement.style.width = `${newWidth}px`;
    selectedElement.style.height = `${newHeight}px`;
}

// Stop scaling
function stopScaling() {
    isScaling = false;
    scaleDirection = '';
}

// Disable current mode
function disableCurrentMode() {
    if (currentMode === 'cursor') {
        document.getElementById('panel').removeEventListener('mousedown', startDraggingCursor);
        document.removeEventListener('mouseup', stopDraggingCursor);
        document.removeEventListener('mousemove', dragCursor);
    } else if (currentMode === 'transform') {
        document.removeEventListener('keydown', moveWithArrows);
    } else if (currentMode === 'rotate') {
        document.removeEventListener('mousedown', startRotation);
        document.removeEventListener('mousemove', rotateElement);
        document.removeEventListener('mouseup', stopRotation);
    } else if (currentMode === 'scale') {
        document.removeEventListener('mousemove', scaleElement);
        document.removeEventListener('mouseup', stopScaling);
        const handles = document.querySelectorAll('.scale-handle');
        handles.forEach(handle => handle.remove());
    }

    resetHighlight();
    currentMode = null;
    selectedElement = null;
    isDragging = false;
    isRotating = false;
    isScaling = false;
}

// Create GUI panel
function CreateGUIPanel() {
    const panel = document.getElementById('panel');

    const square = document.createElement('div');
    square.classList.add('square');
    square.style.width = '100px';
    square.style.height = '100px';
    square.style.position = 'absolute';
    square.style.backgroundColor = 'rgb(255,255,255)';
    square.style.left = `${panel.offsetWidth / 2 - 50}px`;
    square.style.top = `${panel.offsetHeight / 2 - 50}px`;

    panel.appendChild(square);

    square.addEventListener('click', () => {
        if (currentMode === 'cursor' || currentMode === 'transform' || currentMode === 'rotate' || currentMode === 'scale') {
            selectedElement = square;
            resetHighlight();
            square.style.border = '2px solid blue';
        }
    });
}

// Start dragging cursor
function startDraggingCursor(event) {
    if (currentMode !== 'cursor') return;

    const target = event.target;
    if (!target.classList.contains('square')) return;

    selectedElement = target;
    isDragging = true;

    const rect = selectedElement.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    event.preventDefault();
}

// Drag cursor (continued)
function dragCursor(event) {
    if (!isDragging || currentMode !== 'cursor' || !selectedElement) return;

    const parentRect = selectedElement.parentElement.getBoundingClientRect();

    let newLeft = event.clientX - parentRect.left - offsetX;
    let newTop = event.clientY - parentRect.top - offsetY;

    newLeft = Math.max(0, Math.min(newLeft, parentRect.width - selectedElement.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, parentRect.height - selectedElement.offsetHeight));

    selectedElement.style.left = `${newLeft}px`;
    selectedElement.style.top = `${newTop}px`;
}

// Stop dragging cursor
function stopDraggingCursor() {
    isDragging = false;
    selectedElement = null;
}

// Move with arrows
function moveWithArrows(event) {
    if (!selectedElement || currentMode !== 'transform') return;

    const step = 5;
    switch (event.key) {
        case 'ArrowLeft':
            selectedElement.style.left = `${parseInt(selectedElement.style.left || 0) - step}px`;
            break;
        case 'ArrowRight':
            selectedElement.style.left = `${parseInt(selectedElement.style.left || 0) + step}px`;
            break;
        case 'ArrowUp':
            selectedElement.style.top = `${parseInt(selectedElement.style.top || 0) - step}px`;
            break;
        case 'ArrowDown':
            selectedElement.style.top = `${parseInt(selectedElement.style.top || 0) + step}px`;
            break;
    }
}

// Reset highlight
function resetHighlight() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.style.border = '';
    });
}

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

//BackgroundOptions

function openBackgroundOptions() {
    const BackgroundOptionsPanel = document.getElementById('BackgroundOptionsPanel');
    BackgroundOptionsPanel.style.display = 'flex'; // Показываем панель
}

function closeBackgroundOptions() {
    const BackgroundOptionsPanel = document.getElementById('BackgroundOptionsPanel');
    BackgroundOptionsPanel.style.display = 'none'; // Скрываем панель
}

const colorPicker = document.getElementById('backgroundColor');
const runMenuPanel = document.getElementById('RunMenuPanel');

// Слушаем событие изменения цвета
colorPicker.addEventListener('input', function () {
  // Меняем цвет фона объекта
  runMenuPanel.style.backgroundColor = colorPicker.value;
});

// Получаем элементы
const urlInput = document.getElementById('backgroundUrl');
const applyButton = document.getElementById('applyBackground');

// Слушаем нажатие кнопки
applyButton.addEventListener('click', function () {
    const imageUrl = urlInput.value; // Получаем URL из поля ввода
    if (imageUrl) {
    runMenuPanel.style.backgroundImage = `url(${imageUrl})`; // Меняем фон объекта
    } else {
    alert('Please enter a valid URL!');
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
