var questionIds = null;
var numQuestions = 0;
var selectedChoice = "";
var correctAns = "";

function setupQuiz(qids, ans) {
    document.getElementById("q-mc-0").addEventListener("click", selectChoice);
    document.getElementById("q-mc-1").addEventListener("click", selectChoice);
    document.getElementById("q-mc-2").addEventListener("click", selectChoice);
    document.getElementById("q-mc-3").addEventListener("click", selectChoice);
    document.getElementById("prev").addEventListener("click", gotoPrev);
    document.getElementById("next").addEventListener("click", gotoNext);
    document.getElementById("submit").addEventListener("click", submitAnswer);
    questionIds = qids.split(",");
    numQuestions = questionIds.length;
    correctAns = ans;
}

function getCurQuestionId() {
    let url = window.location.href.split("/");
    console.log(url[url.length - 1].replace("#", ""));
    return url[url.length - 1].replace("#", "");
}

function submitAnswer() {
    if (selectedChoice == "") return;
    document.getElementById("submit").setAttribute("disabled", "");
    if (selectedChoice == correctAns) {
        document.getElementById("selected-ans").innerHTML = "Correct!";
        // update db to reflect completed question
        $.ajax({
            type: "POST",
            url: "/question",
            data: {
                completedQuestion: getCurQuestionId(),
            },
        });
    } else {
        document.getElementById(
            "selected-ans"
        ).innerHTML = `Incorrect. The right answer is ${correctAns}.`;
    }
}

function selectChoice() {
    selectedChoice = $(event.target).text();
    document.getElementById(
        "selected-ans"
    ).innerHTML = `Selected answer: ${selectedChoice}`;
    document.getElementById("selected-ans").removeAttribute("hidden");
}

function gotoPrev() {
    
    const curQId = getCurQuestionId();
    const i = questionIds.findIndex((id) => {
        return id == curQId;
    });
    if (i != 0) {
        let parentUrl = window.location.href.split("/").slice(0, -1).join("/");
        window.location.href = parentUrl + "/" + questionIds[i - 1];
    }
}

function gotoNext() {
    const curQId = getCurQuestionId();
    const i = questionIds.findIndex((id) => {
        return id == curQId;
    });
    if (i != questionIds.length - 1) {
        let parentUrl = window.location.href.split("/").slice(0, -1).join("/");
        window.location.href = parentUrl + "/" + questionIds[i + 1];
    }
}
