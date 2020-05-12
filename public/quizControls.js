var numQuestions = 0
var curQuestion = 0
var questions = null

function setup(n) {
    document.getElementById("prev").addEventListener("click", gotoPrev)
    document.getElementById("next").addEventListener("click", gotoNext)
    document.getElementById("submit").addEventListener("click", submitAnswer)
    numQuestions = parseInt(n)
    document.getElementById("prev").setAttribute("disabled", "")

    alert(questions.length)
}

function submitAnswer() {
    document.getElementById("submit").setAttribute("disabled", "")
}

function gotoPrev() {
    if (curQuestion > 0) curQuestion--
}

function gotoNext() {
    if (curQuestion < numQuestions - 1) curQuestion++
    let templateScript = Handlebars.compile(document.getElementById("q-title").innerHTML)
    let html = templateScript()
    document.getElementById("q-title").innerHTML = html
}