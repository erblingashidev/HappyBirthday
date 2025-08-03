const pages = document.querySelectorAll('.page');
    let currentPage = 0;

    document.body.addEventListener('click', () => {
      if (currentPage < pages.length - 1) {
        pages[currentPage].classList.remove('active');
        currentPage++;
        pages[currentPage].classList.add('active');
      }
    });