var mainImage = document.getElementById('mainImage');
mainImage.src = '../images/busy.jpg'; 

var popup = document.getElementById('popup');
popup.src = "../images/dog.gif";

let wasOverlaid = false;
function overPicture(pageX, pageY) {
    let imageLeft = mainImage.offsetLeft + mainImage.clientLeft,
        imageTop = mainImage.offsetTop + mainImage.clientTop,
        x = pageX - imageLeft,
        y = pageY - imageTop;

    let isOverlaid = 427 < x && x < 497 && 325 < y && y < 394;

    if (wasOverlaid && !isOverlaid) {
        popup.classList.add('hidden');
    }

    if (!wasOverlaid && isOverlaid) {
        popup.style.left = '425px';
        popup.style.top = '350px';
        popup.style.width = '100px';
        popup.style.height = '120px';
        popup.classList.remove('hidden');
    }

    wasOverlaid = isOverlaid;
}

mainImage.addEventListener('mousemove', function (event) {overPicture(event.pageX, event.pageY);}, false);