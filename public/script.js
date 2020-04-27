/* Change the difficulty number on the page to a descriptive word */
function changeDifficultyText() {
    elems = document.getElementsByClassName("diff")
    for (let i = 0; i < elems.length; ++i) {
        switch (elems[i].innerHTML) {
            case "1":
                elems[i].innerHTML = "Beginner"
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