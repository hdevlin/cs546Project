var curQuestion = 0
var numQuestions = 0
var questionIds = null

function setup(qids) {
    document.getElementById("prev").addEventListener("click", gotoPrev)
    document.getElementById("next").addEventListener("click", gotoNext)
    document.getElementById("submit").addEventListener("click", submitAnswer)
    questionIds = qids.split(",")
    numQuestions = questionIds.length
}

function submitAnswer() {
    document.getElementById("submit").setAttribute("disabled", "")
}

function gotoPrev() {
    if (curQuestion > 0) {
        curQuestion--
        let parentUrl = window.location.href.split('/').slice(0, -1).join('/')
        window.location.href = parentUrl + "/" + questionIds[curQuestion]
    }
}

function gotoNext() {
    if (curQuestion < numQuestions - 1) {
        curQuestion++
        let parentUrl = window.location.href.split('/').slice(0, -1).join('/')
        window.location.href = parentUrl + "/" + questionIds[curQuestion]
    }
}
