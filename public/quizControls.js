
let questionIds;
let selectedChoice = "";
let correctAns = "";
const currentQuestionId = window.location.pathname.replace("/question/", "");

function setupQuiz(qids, ans) {
    document.getElementsByName("multiple-choice").forEach((elem) => {
        elem.addEventListener("click", selectChoice);
    });
    document.getElementById("prev").addEventListener("click", gotoPrev);
    document.getElementById("next").addEventListener("click", gotoNext);
    document.getElementById("submit").addEventListener("click", submitAnswer);
    questionIds = qids.split(",");
    correctAns = ans;
}

function submitAnswer() {
    if (selectedChoice === "") return;
    document.getElementById("submit").setAttribute("disabled", "");
    if (selectedChoice === correctAns) {
        document.getElementById("selected-ans").innerHTML = "Correct!";
        // update db to reflect completed question
        fetch("/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completedQuestion: currentQuestionId }),
        });
    } else {
        document.getElementById(
            "selected-ans"
        ).innerHTML = `Incorrect. The right answer is ${correctAns}.`;
    }
}

function selectChoice(e) {
    selectedChoice = e.target.innerHTML;
    document.getElementById(
        "selected-ans"
    ).innerHTML = `Selected answer: ${selectedChoice}`;
    document.getElementById("selected-ans").removeAttribute("hidden");
}

function gotoPrev() {
    const curQId = currentQuestionId;
    const i = questionIds.findIndex((id) => {
        return id == curQId;
    });
    if (i > 0) {
        let parentUrl = window.location.href.split("/").slice(0, -1).join("/");
        window.location.href = parentUrl + "/" + questionIds[i - 1];
    }
}

function gotoNext() {
    const curQId = currentQuestionId;
    const i = questionIds.findIndex((id) => {
        return id == curQId;
    });
    if (i < questionIds.length - 1) {
        let parentUrl = window.location.href.split("/").slice(0, -1).join("/");
        window.location.href = parentUrl + "/" + questionIds[i + 1];
    }
}
