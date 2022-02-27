
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const img = new Image();   
img.src = '../images/terminal border.png'; 
img.addEventListener('load', function() { 
    context.drawImage(img,0,0);
}, false);