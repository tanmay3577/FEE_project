document.addEventListener('DOMContentLoaded', () => {
    let currentMode = 'qr';
    const inputEl = document.getElementById('data-input');
    const qrContainer = document.getElementById('qrcode-container');
    const barcodeCanvas = document.getElementById('barcode-canvas');
    const placeholderText = document.getElementById('placeholder-text');

    // Tab Switching
    document.getElementById('btn-qr').addEventListener('click', (e) => switchMode('qr', e.target));
    document.getElementById('btn-bar').addEventListener('click', (e) => switchMode('barcode', e.target));

    function switchMode(mode, btnEl) {
        currentMode = mode;
        document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
        btnEl.classList.add('active');
        
        // Reset display
        qrContainer.style.display = 'none';
        barcodeCanvas.style.display = 'none';
        placeholderText.style.display = 'block';
    }

    // Generate Logic
    document.getElementById('generate-btn').addEventListener('click', () => {
        const text = inputEl.value.trim();
        
        if (!text) {
            alert("Please enter some data to generate.");
            return;
        }

        placeholderText.style.display = 'none';

        if (currentMode === 'qr') {
            barcodeCanvas.style.display = 'none';
            qrContainer.innerHTML = ''; // Clear previous
            qrContainer.style.display = 'block';
            
            new QRCode(qrContainer, {
                text: text,
                width: 200,
                height: 200,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        } 
        else if (currentMode === 'barcode') {
            qrContainer.style.display = 'none';
            barcodeCanvas.style.display = 'block';
            
            try {
                JsBarcode("#barcode-canvas", text, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 100,
                    displayValue: true
                });
            } catch (error) {
                alert("Invalid format for Barcode. Try standard alphanumeric characters.");
                barcodeCanvas.style.display = 'none';
                placeholderText.style.display = 'block';
            }
        }
    });
});
