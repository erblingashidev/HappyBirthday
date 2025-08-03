const pages = document.querySelectorAll('.page');
let currentPage = 0;

function goToNextPage() {
  if (currentPage < pages.length - 1) {
    pages[currentPage].classList.remove('active');
    currentPage++;
    pages[currentPage].classList.add('active');
  }
}

document.body.addEventListener('click', goToNextPage);

setInterval(() => {
  if (currentPage < pages.length - 1) goToNextPage();
}, 8000); // auto-advance every 8 seconds