function setup(qids, ans) {
    const answer = sessionStorage.getItem("selectedAnswer");
    let selectAnswerHTML = document.getElementById("selected-ans").innerHTML;

    const questionIds = qids.split(",");
    const correctAns = ans;
    if (answer === correctAns) {
        selectAnswerHTML = "Correct!";
    } else {
        selectAnswerHTML = `Incorrect. The right answer is ${correctAns}.`;
    }

    let i = questionIds.findIndex((qId) => {
        return qId == reqbody.curQuestion._id;
    });

    // Range Checking require
    document.getElementById("next").href = `/${questionIds[i + 1]}`;
    document.getElementById("prev").href = `/${questionIds[i - 1]}`;
}

function selectChoice(mcNum) {
    const selectedChoice = document.getElementById(`q-mc-${mcNum}`);
    document.getElementById(
        "selected-ans"
    ).innerHTML = `Selected answer: ${selectedChoice.value}`;
    sessionStorage.setItem("selectedAnswer", selectChoice.value);
    document.getElementById("selected-ans").removeAttribute("hidden");
}
