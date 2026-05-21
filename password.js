const DOM = {
    display: document.getElementById('password-display'),
    copyBtn: document.getElementById('copy-btn'),
    lengthSlider: document.getElementById('length-slider'),
    lengthVal: document.getElementById('length-val'),
    incUpper: document.getElementById('inc-upper'),
    incLower: document.getElementById('inc-lower'),
    incNumbers: document.getElementById('inc-numbers'),
    incSymbols: document.getElementById('inc-symbols'),
    generateBtn: document.getElementById('generate-btn')
};

const CHAR_SETS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

function generatePassword() {
    let charset = '';
    if (DOM.incUpper.checked) charset += CHAR_SETS.upper;
    if (DOM.incLower.checked) charset += CHAR_SETS.lower;
    if (DOM.incNumbers.checked) charset += CHAR_SETS.numbers;
    if (DOM.incSymbols.checked) charset += CHAR_SETS.symbols;

    if (charset === '') {
        DOM.display.innerText = "Select at least one option";
        DOM.display.style.color = "var(--danger)";
        return;
    }

    DOM.display.style.color = "var(--accent-1)";
    const length = DOM.lengthSlider.value;
    let password = '';
    
    // Ensure cryptographically strong random values if possible
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }

    DOM.display.innerText = password;
}

// Event Listeners
DOM.lengthSlider.addEventListener('input', (e) => {
    DOM.lengthVal.innerText = e.target.value;
    generatePassword();
});

[DOM.incUpper, DOM.incLower, DOM.incNumbers, DOM.incSymbols].forEach(checkbox => {
    checkbox.addEventListener('change', generatePassword);
});

DOM.generateBtn.addEventListener('click', generatePassword);

DOM.copyBtn.addEventListener('click', () => {
    const pwd = DOM.display.innerText;
    if (!pwd || pwd === "Select at least one option" || pwd === "Click Generate") return;

    navigator.clipboard.writeText(pwd).then(() => {
        const originalText = DOM.copyBtn.innerText;
        DOM.copyBtn.innerText = "Copied!";
        DOM.copyBtn.style.background = "var(--success)";
        setTimeout(() => {
            DOM.copyBtn.innerText = originalText;
            DOM.copyBtn.style.background = "";
        }, 2000);
    });
});

// Init on load
document.addEventListener('DOMContentLoaded', generatePassword);
