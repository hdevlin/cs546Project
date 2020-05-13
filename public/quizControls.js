var questionIds = null
var numQuestions = 0
var selectedChoice = ''
var correctAns = ''

function setup(qids, ans) {
    document.getElementById("q-mc-0").addEventListener("click", selectChoice)
    document.getElementById("q-mc-1").addEventListener("click", selectChoice)
    document.getElementById("q-mc-2").addEventListener("click", selectChoice)
    document.getElementById("q-mc-3").addEventListener("click", selectChoice)
    document.getElementById("prev").addEventListener("click", gotoPrev)
    document.getElementById("next").addEventListener("click", gotoNext)
    document.getElementById("submit").addEventListener("click", submitAnswer)
    questionIds = qids.split(',')
    numQuestions = questionIds.length
    correctAns = ans
}

function getCurQuestionId() {
    let url = window.location.href.split('/')
    return url[url.length - 1].replace('#', '')
}

function submitAnswer() {
    if (selectedChoice == '') return
    document.getElementById("submit").setAttribute("disabled", "")
    if (selectedChoice == correctAns) {
        document.getElementById("selected-ans").innerHTML = "Correct!"
        // update db to reflect completed question
        $.ajax({
            type: "POST",
            url: "/question",
            data: {
                completedQuestion: getCurQuestionId()
            }
        })
    } else {
        document.getElementById("selected-ans").innerHTML = `Incorrect. The right answer is ${correctAns}.`
    }
}

function selectChoice() {
    selectedChoice = $(event.target).text()
    document.getElementById("selected-ans").innerHTML = `Selected answer: ${selectedChoice}`
    document.getElementById("selected-ans").removeAttribute("hidden")
}

function gotoPrev() {
    const curQId = getCurQuestionId()
    let curQuestion = parseInt(curQId.replace("q", ""))
    if (curQuestion > 0) {
        curQuestion--
        let parentUrl = window.location.href.split('/').slice(0, -1).join('/')
        window.location.href = parentUrl + "/q" + curQuestion
    }
}

function gotoNext() {
    const curQId = getCurQuestionId()
    let curQuestion = parseInt(curQId.replace("q", ""))
    if (curQuestion < numQuestions - 1) {
        curQuestion++
        let parentUrl = window.location.href.split('/').slice(0, -1).join('/')
        window.location.href = parentUrl + "/q" + curQuestion
    }
}
