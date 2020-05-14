let selectedAnswer;

function setup(qids, ans) {
    // Navigation Setup
    const curQuestionId = curQuestionId._id;
    let questionIds;
    if (Array.isArray(qids)) {
        questionIds = qids;
    } else if (typeof qids === "string") {
        questionIds = qids.split(",");
    } else {
        console.log("qids was not an array or a string");
        return;
    }

    let index = questionIds.findIndex((qId) => {
        return qId == reqbody.curQuestion._id;
    });

    // // Range Checking require
    let next = document.getElementById("next");
    let prev = document.getElementById("prev");

    if (index == 0) {
        prev.style.display = "hidden";
    } else {
        prev.style.display = "";
        prev.href = `/${questionIds[index - 1]}`;
    }
    if (index == questionIds.length - 1) {
        next.style.display = "hidden";
    } else {
        next.href = `/${questionIds[index + 1]}`;
        next.style.display = "";
    }

    // Text Setup
    // This was saved when the user first selected an answer
    // It will clear when the page closes
    selectedAnswer = sessionStorage.getItem(`selectedAnswer${curQuestionId}`);

    let selectAnswerHTML = document.getElementById("selected-ans").innerHTML;
    if (!selectedAnswer) {
        //nothing selected
    } else if (selectedAnswer === ans) {
        selectAnswerHTML = "Correct!";
    } else {
        selectAnswerHTML = `Incorrect. The right answer is ${ans}.`;
    }
}

function selectChoice(mcNum) {
    const selectedChoice = document.getElementById(`q-mc-${mcNum}`);
    document.getElementById(
        "selected-ans"
    ).innerHTML = `Selected answer: ${selectedChoice.value}`;
    sessionStorage.setItem(
        `selectedAnswer${curQuestionId}`,
        selectChoice.value
    );
    document.getElementById("selected-ans").removeAttribute("hidden");
}
