var questionIds = null
var numQuestions = 0

function setup(qids) {
    document.getElementById("prev").addEventListener("click", gotoPrev)
    document.getElementById("next").addEventListener("click", gotoNext)
    document.getElementById("submit").addEventListener("click", submitAnswer)
    questionIds = qids.split(',')
    numQuestions = questionIds.length
}

function submitAnswer() {
    document.getElementById("submit").setAttribute("disabled", "")
}

function gotoPrev() {
    let url = window.location.href.split('/')
    let curQuestion = parseInt(url[url.length - 1].replace("q", ""))
    if (curQuestion > 0) {
        curQuestion--
        let parentUrl = window.location.href.split('/').slice(0, -1).join('/')
        window.location.href = parentUrl + "/q" + curQuestion
    }
}

function gotoNext() {
    let url = window.location.href.split('/')
    let curQuestion = parseInt(url[url.length - 1].replace("q", ""))
    if (curQuestion < numQuestions - 1) {
        curQuestion++
        let parentUrl = window.location.href.split('/').slice(0, -1).join('/')
        window.location.href = parentUrl + "/q" + curQuestion
    }
}
