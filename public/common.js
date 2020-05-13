/* Change the difficulty number on the page to a descriptive word */
function changeDifficultyText() {
    elems = document.getElementsByClassName("diff")
    for (let i = 0; i < elems.length; ++i) {
        switch (elems[i].innerHTML) {
            case "1":
                elems[i].innerHTML = "Easy"
                break
            case "2":
                elems[i].innerHTML = "Intermediate"
                break
            case "3":
                elems[i].innerHTML = "Advanced"
                break
            default:
                elems[i].innerHTML += " difficulty"
        }
    }
}

/* Event listeners for some pages */
function setup() {
    elems = document.getElementsByClassName("open-lesson");
    for (let i = 0; i < elems.length; ++i) {
        elems[i].addEventListener("click", startClick);
    }
    elems = document.getElementsByClassName("drop-lesson");
    for (let i = 0; i < elems.length; ++i) {
        elems[i].addEventListener("click", dropClick);
    }
}

/* Launch lesson */
function startClick() {
    let parentUrl = window.location.href.split('/').slice(0, -1).join('/');
    window.location.href = parentUrl + `/lesson/${event.target.id}`;
}

function dropClick() {
    alert("dropped");
}