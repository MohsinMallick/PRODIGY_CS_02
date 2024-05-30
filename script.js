document.getElementById('imageInput').addEventListener('change', handleImageUpload);
document.getElementById('encryptButton').addEventListener('click', encryptImage);
document.getElementById('decryptButton').addEventListener('click', decryptImage);
document.getElementById('downloadButton').addEventListener('click', downloadImage);

let originalImageData;
let encryptedImageData;
const key = 123; // Simple XOR key for encryption

function handleImageUpload(event) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            displayImage(originalImageData);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

function displayImage(imageData) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    const dataUrl = canvas.toDataURL();
    document.getElementById('displayImage').src = dataUrl;
    document.getElementById('displayImage').style.display = 'block';
    document.getElementById('downloadButton').style.display = 'inline-block';
}

function encryptImage() {
    if (!originalImageData) {
        alert('Please upload an image first.');
        return;
    }
    encryptedImageData = manipulatePixels(originalImageData, key, true);
    displayImage(encryptedImageData);
}

function decryptImage() {
    if (!encryptedImageData) {
        alert('Please encrypt an image first.');
        return;
    }
    const decryptedImageData = manipulatePixels(encryptedImageData, key, false);
    displayImage(decryptedImageData);
}

function manipulatePixels(imageData, key, isEncryption) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i++) {
        if (isEncryption) {
            data[i] = (data[i] + key) % 256;  // Shift the pixel values by key for encryption
        } else {
            data[i] = (data[i] - key + 256) % 256;  // Shift back for decryption
        }
    }
    return imageData;
}

function downloadImage() {
    const canvas = document.getElementById('canvas');
    const dataUrl = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'image.png';
    link.click();
}
