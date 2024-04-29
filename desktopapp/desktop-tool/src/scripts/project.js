document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll(".view, .tab").forEach(div => div.classList.remove('selected'));
        this.classList.add('selected')
        document.querySelector("." + tab.dataset.container).classList.add('selected');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with class 'tooltab'
    var tooltabs = document.querySelectorAll('.tooltab');

    // Loop through each 'tooltab' element
    tooltabs.forEach(function (tab) {
        // Add click event listener to each 'tooltab'
        tab.addEventListener('click', function () {
            // Remove 'clicked' class from all 'tooltab' elements
            tooltabs.forEach(function (t) {
                t.classList.remove('clicked');
            });
            // Add 'clicked' class to the clicked 'tooltab' element
            tab.classList.add('clicked');
        });
    });
});
