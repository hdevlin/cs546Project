/* Change the difficulty number on the page to a descriptive word */
function changeDifficultyText() {
    let elems = document.getElementsByClassName("diff");
    for (let i = 0; i < elems.length; ++i) {
        switch (elems[i].innerHTML) {
            case "1":
                elems[i].innerHTML = "Easy";
                break;
            case "2":
                elems[i].innerHTML = "Intermediate";
                break;
            case "3":
                elems[i].innerHTML = "Advanced";
                break;
            default:
                elems[i].innerHTML += " difficulty";
        }
    }
}

/* Event listeners for some pages */
function setup() {
    let openElems = document.getElementsByClassName("open-lesson");
    for (let i = 0; i < openElems.length; ++i) {
        openElems[i].addEventListener("click", startClick);
    }

    let closeElems = document.getElementsByClassName("drop-lesson");
    for (let i = 0; i < closeElems.length; ++i) {
        closeElems[i].addEventListener("click", dropClick);
    }
}

/* Launch lesson */
function startClick() {
    let parentUrl = window.location.href.split("/").slice(0, -1).join("/");
    window.location.href = parentUrl + `/lesson/${event.target.id}`;
}

/* Remove lesson from user's lessons */
function dropClick() {
    $.ajax({
        type: "POST",
        url: "/lesson",
        data: {
            dropLesson: event.target.id,
        },
    });
}
