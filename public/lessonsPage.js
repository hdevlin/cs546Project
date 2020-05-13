function setup() {
    elems = document.getElementsByClassName("start");
    for (let i = 0; i < elems.length; ++i) {
        elems[i].addEventListener("click", startClick);
    }
}

function startClick() {
    let parentUrl = window.location.href.split('/').slice(0, -1).join('/');
    window.location.href = parentUrl + `/lesson/${event.target.id}`;
}
