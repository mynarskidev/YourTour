//typing welcome on page load
let i = -4;
const text = "Welcome!";
const speed = 160;

window.onload = typing = () => {
    if (i < text.length) {
        document.querySelector(".text").textContent += text.charAt(i);
        i++;
        setTimeout(typing, speed);
    }
}

const cursorAnimation = () => {
    const spnCursor = document.querySelector('.cursor');
    if(spnCursor) spnCursor.classList.toggle('active');
    else setTimeout(cursorAnimation, 1000);
}
setInterval(cursorAnimation, 550);