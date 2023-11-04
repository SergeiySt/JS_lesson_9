function saveColorsToCookie(colors) {
    const jsonString = JSON.stringify(colors);
    document.cookie = `colors=${jsonString}; expires= ${new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toUTCString()}`;
}

// Функція для завантаження кольорів з Cookie
function loadColorsFromCookie() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'colors') {
            return JSON.parse(value);
        }
    }
    return [];
}

const colorList = document.getElementById('color-list');
const colorForm = document.getElementById('color-form');
const colorNameInput = document.getElementById('color-name');
const colorTypeSelect = document.getElementById('color-type');
const colorCodeInput = document.getElementById('color-code');
const saveColorButton = document.getElementById('save-color');

let colors = loadColorsFromCookie();

// Функція для відображення колекції кольорів на сторінці
function displayColors() {
    colorList.innerHTML = '';
    colors.forEach(color => {
        const colorItem = document.createElement('div');
        colorItem.style.backgroundColor = color.code;
        colorItem.innerText = `${color.name} (${color.type})`;
        colorList.appendChild(colorItem);
    });
}

// Функція для перевірки правильності введених даних та додавання нового кольору
function addColor() {
    const name = colorNameInput.value;
    const type = colorTypeSelect.value;
    const code = colorCodeInput.value;

    // Перевірка, чи існує колір з такою ж назвою
    const existingColor = colors.find(color => color.name.toLowerCase() === name.toLowerCase());

    if (existingColor) {
        alert('Ця назва кольору вже існує.');
        return;
    }

    if (type === 'RGB') {
        const rgbValues = code.split(',').map(value => parseInt(value));
        if (rgbValues.length !== 3 || rgbValues.some(value => isNaN(value) || value < 0 || value > 255)) {
            alert('Неправильний формат RGB.');
            return;
        }
    } else if (type === 'RGBA') {
        const rgbaValues = code.split(',').map(value => parseFloat(value));
        if (rgbaValues.length !== 4 || rgbaValues.slice(0, 3).some(value => isNaN(value) || value < 0 || value > 255) || rgbaValues[3] < 0 || rgbaValues[3] > 1) {
            alert('Неправильний формат RGBA.');
            return;
        }
    } else if (type === 'HEX') {
        if (!/^#([0-9A-Fa-f]{6})$/.test(code)) {
            alert('Неправильний формат HEX.');
            return;
        }
    } else {
        alert('Неправильний тип кольору.');
        return;
    }

    colors.push({ name, type, code });
    saveColorsToCookie(colors);
    displayColors();
    colorForm.reset();
}

saveColorButton.addEventListener('click', function (event) {
    event.preventDefault();
    addColor();
});

displayColors();