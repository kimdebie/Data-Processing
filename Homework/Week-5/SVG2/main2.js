/* use this to test out your function */
window.onload = function() {
 	changeColor("de", "#ffff00");
 	changeColor("lv", "#581047");
 	changeColor("is", "#56dc28");
 	changeColor("ua", "#e5a470");
};

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
        document.getElementById(id).style.fill = color;
};