document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll(".view, .tab").forEach(div => div.classList.remove('selected'));
        this.classList.add('selected')
        document.querySelector("." + tab.dataset.container).classList.add('selected');
    });
});