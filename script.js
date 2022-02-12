'use strict';

//--------------------SELECTIONS

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const header = document.querySelector('.header');
const nav = document.querySelector('nav');
const navigationLinks = document.querySelector('.nav__links');
const navigationLink = document.querySelectorAll('.nav__link');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const allSectionsEl = document.querySelectorAll('.section');
const section1El = document.querySelector('#section--1');
const lazyImg = document.querySelectorAll('img[data-src]');

const tabContainer = document.querySelector('.operations__tab-container');
const tabBtns = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const sliderButtonLeft = document.querySelector('.slider__btn--left');
const sliderButtonRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

//--------------------MODAL
const highOrderFn_Modal = function () {
    const openModal = function (e) {
        e.preventDefault();
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    };

    const closeModal = function (e) {
        e.preventDefault();
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    };

    btnsOpenModal.forEach(function (btn) {
        btn.addEventListener('click', openModal);
    });

    //----listeners

    btnCloseModal.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
};

//--------------------------SLIDINGS TO SECTIONS
const highOrderFn_SlidingsToSections = function () {
    btnScrollTo.addEventListener('click', function (e) {
        e.preventDefault();
        section1El.scrollIntoView({ behavior: 'smooth' });
    });

    navigationLinks.addEventListener('click', function (e) {
        e.preventDefault();

        if (
            e.target.classList.contains('nav__link') &&
            e.target.getAttribute('href') !== '#'
        )
            document
                .querySelector(`${e.target.getAttribute('href')}`)
                .scrollIntoView({ behavior: 'smooth' });
    });
};

//--------------------------TABS MENU SWITCHING
const highOrderFn_TabContainer = function () {
    tabContainer.addEventListener('click', function (e) {
        const clicked = e.target.closest('.operations__tab');
        if (!clicked) return;

        //-------------active button
        tabBtns.forEach(item =>
            item.classList.remove('operations__tab--active')
        );
        clicked.classList.add('operations__tab--active');
        //-------------active tab
        tabContents.forEach(item =>
            item.classList.remove('operations__content--active')
        );

        document
            .querySelector(
                `.operations__content--${clicked.getAttribute('data-tab')}`
            )
            .classList.add('operations__content--active');
    });
};

//--------------------------NAVIGATION FADING
const highOrderFn_NavHoverFading = function () {
    const fading = function (e) {
        if (e.target.classList.contains('nav__link')) {
            const link = e.target;
            const siblings = link
                .closest('.nav')
                .querySelectorAll('.nav__link');
            const logo = link.closest('.nav').querySelector('img');

            logo.style.opacity = this;

            siblings.forEach(item => {
                if (item !== link) {
                    item.style.opacity = this;
                }
            });
        }
    };
    nav.addEventListener('mouseover', fading.bind(0.5));
    nav.addEventListener('mouseout', fading.bind(1));
};

//--------------------------STIKY NAVIGATION
const highOrderFn_StikyNav = function () {
    const navHeight = nav.getBoundingClientRect().height;

    const navStickCallback = function (entries, observer) {
        const [entry] = entries;
        if (entry.isIntersecting === false) nav.classList.add('sticky');
        else nav.classList.remove('sticky');
    };

    const headerObserver = new IntersectionObserver(navStickCallback, {
        root: null,
        threshold: 0,
        rootMargin: `-${navHeight}px`,
    });
    headerObserver.observe(header);
};

//--------------------------REVEAL SECTION
const highOrderFn_RevealSection = function () {
    const revealSectionCallback = function (entries, observer) {
        const [entry] = entries;

        if (!entry.isIntersecting) return;

        entry.target.classList.remove('section--hidden');

        observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSectionCallback, {
        root: null,
        threshold: 0.2,
    });

    allSectionsEl.forEach(function (section) {
        sectionObserver.observe(section);
        section.classList.add('section--hidden');
    });
};

//--------------------------LAZY IMAGES
const highOrderFn_LazyImg = function () {
    const loadImg = function (entries, observer) {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        entry.target.src = entry.target.dataset.src;
        entry.target.addEventListener('load', function () {
            entry.target.classList.remove('lazy-img');
        });
        imgObserver.unobserve(entry.target);
    };

    const imgObserver = new IntersectionObserver(loadImg, {
        root: null,
        threshold: 0,
        rootMargin: '200px',
    });

    lazyImg.forEach(item => imgObserver.observe(item));
};

//--------------------------SLIDER
const highOrderFn_Slider = function () {
    //--------functions
    const selectSlide = function (slide) {
        slides.forEach(
            (item, i) =>
                (item.style.transform = `translateX(${100 * (i - slide)}%)`)
        );
    };

    const nextSlide = function () {
        if (currentSlide === maxSlides - 1) {
            currentSlide = 0;
        } else currentSlide++;
        selectSlide(currentSlide);
        paintDots(currentSlide);
    };

    const prevSlide = function () {
        if (currentSlide === 0) {
            currentSlide = maxSlides - 1;
        } else currentSlide--;
        selectSlide(currentSlide);
        paintDots(currentSlide);
    };

    function paintDots(slide) {
        dotContainer
            .querySelectorAll('.dots__dot')
            .forEach(item => item.classList.remove('dots__dot--active'));

        dotContainer
            .querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add('dots__dot--active');
    }

    const createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML(
                'beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`
            );
        });
    };

    const init = function () {
        selectSlide(0);
        createDots();
        paintDots(0);
    };
    //--------listeners
    let currentSlide = 0;
    const maxSlides = slides.length;

    sliderButtonLeft.addEventListener('click', prevSlide);
    sliderButtonRight.addEventListener('click', nextSlide);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            const { slide } = e.target.dataset;
            selectSlide(slide);
            paintDots(slide);
        }
    });
    //------init
    init();
};

highOrderFn_NavHoverFading();
highOrderFn_Modal();
highOrderFn_LazyImg();
highOrderFn_SlidingsToSections();
highOrderFn_TabContainer();
highOrderFn_StikyNav();
highOrderFn_RevealSection();
highOrderFn_Slider();
