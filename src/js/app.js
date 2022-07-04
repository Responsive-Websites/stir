//import * as flsFunctions from "./modules/functions.js";
//flsFunctions.thisTest();

'use strict';

// detect block view

const detectBusinessBlock = document.querySelector('.business__title');

document.addEventListener('scroll', function () {
  const posTop = detectBusinessBlock.getBoundingClientRect().top;

  // Блок достиг верхней границы экрана (или выше)
  // elem.classList.toggle('visible', posTop <= 0);

  // Блок только появляется снизу (или выше)
  // elem.classList.toggle('visible', posTop < window.innerHeight);

  // Блок целиком находится в видимой зоне
  detectBusinessBlock.classList.toggle(
    'business__title_active',
    posTop + detectBusinessBlock.clientHeight <= window.innerHeight && posTop >= 0
  );
});

// revenue-breakdown show help for mobile
let revenueHelpMobile = document.querySelector('._revenue-breakdown-mobile');
let revenueHelp = document.querySelector('.organized__revenue'),
  cur = revenueHelp.scrollLeft || 0,
  event = function (e) {
    if (e.currentTarget.scrollLeft !== cur) {
      revenueHelpMobile.style = 'opacity: 0; visibility: hidden;';
      revenueHelp.removeEventListener('scroll', event);
    }
  };

revenueHelp.addEventListener('scroll', event);

// revenueHelp.addEventListener('click', function (e) {
//   revenueHelp.classList.remove('_revenue-breakdown-mobile');
// });

// burger

let header_menu = document.querySelector('.menu__list');
let burger_icon = document.querySelector('.menu__icon');
burger_icon.addEventListener('click', function (e) {
  header_menu.classList.toggle('_active');
  burger_icon.classList.toggle('_active');
  document.body.classList.toggle('_lock');
});

// =========================================================

// ibg

function ibg() {
  let ibg = document.querySelectorAll('._ibg');
  for (var i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector('img')) {
      ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
    }
  }
}

ibg();

// =========================================================

// smooth scroll
// data-goto=".main-slider"

const menuLinks = document.querySelectorAll('.nav-descktop__item[data-goto]');
if (menuLinks.length > 0) {
  menuLinks.forEach((menuLink) => {
    menuLink.addEventListener('click', onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
    const menuLink = e.target;
    if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto);
      const gotoBlockValue =
        gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

      window.scrollTo({
        top: gotoBlockValue,
        behavior: 'smooth',
      });
      e.preventDefault();
    }
  }
}

const menuBurgerLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuBurgerLinks.length > 0) {
  menuBurgerLinks.forEach((menuLink) => {
    menuLink.addEventListener('click', onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
    const menuLink = e.target;
    if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto);
      const gotoBlockValue =
        gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

      if (burger_icon.classList.contains('_active')) {
        document.body.classList.remove('_lock');
        burger_icon.classList.remove('_active');
        header_menu.classList.remove('_active');
      }

      window.scrollTo({
        top: gotoBlockValue,
        behavior: 'smooth',
      });
      e.preventDefault();
    }
  }
}

// =========================================================

// Dynamic Adaptive
// data-da=".menu__body,767,1"

function DynamicAdapt(type) {
  this.type = type;
}

DynamicAdapt.prototype.init = function () {
  const _this = this;
  // массив объектов
  this.оbjects = [];
  this.daClassname = '_dynamic_adapt_';
  // массив DOM-элементов
  this.nodes = document.querySelectorAll('[data-da]');

  // наполнение оbjects объктами
  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i];
    const data = node.dataset.da.trim();
    const dataArray = data.split(',');
    const оbject = {};
    оbject.element = node;
    оbject.parent = node.parentNode;
    оbject.destination = document.querySelector(dataArray[0].trim());
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
    оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
    оbject.index = this.indexInParent(оbject.parent, оbject.element);
    this.оbjects.push(оbject);
  }

  this.arraySort(this.оbjects);

  // массив уникальных медиа-запросов
  this.mediaQueries = Array.prototype.map.call(
    this.оbjects,
    function (item) {
      return '(' + this.type + '-width: ' + item.breakpoint + 'px),' + item.breakpoint;
    },
    this
  );
  this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
    return Array.prototype.indexOf.call(self, item) === index;
  });

  // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске
  for (let i = 0; i < this.mediaQueries.length; i++) {
    const media = this.mediaQueries[i];
    const mediaSplit = String.prototype.split.call(media, ',');
    const matchMedia = window.matchMedia(mediaSplit[0]);
    const mediaBreakpoint = mediaSplit[1];

    // массив объектов с подходящим брейкпоинтом
    const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
      return item.breakpoint === mediaBreakpoint;
    });
    matchMedia.addListener(function () {
      _this.mediaHandler(matchMedia, оbjectsFilter);
    });
    this.mediaHandler(matchMedia, оbjectsFilter);
  }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.moveTo(оbject.place, оbject.element, оbject.destination);
    }
  } else {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      if (оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(оbject.parent, оbject.element, оbject.index);
      }
    }
  }
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname);
  if (place === 'last' || place >= destination.children.length) {
    destination.insertAdjacentElement('beforeend', element);
    return;
  }
  if (place === 'first') {
    destination.insertAdjacentElement('afterbegin', element);
    return;
  }
  destination.children[place].insertAdjacentElement('beforebegin', element);
};

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname);
  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement('beforebegin', element);
  } else {
    parent.insertAdjacentElement('beforeend', element);
  }
};

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
  const array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === 'min') {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === 'first' || b.place === 'last') {
          return -1;
        }

        if (a.place === 'last' || b.place === 'first') {
          return 1;
        }

        return a.place - b.place;
      }

      return a.breakpoint - b.breakpoint;
    });
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === 'first' || b.place === 'last') {
          return 1;
        }

        if (a.place === 'last' || b.place === 'first') {
          return -1;
        }

        return b.place - a.place;
      }

      return b.breakpoint - a.breakpoint;
    });
    return;
  }
};

const da = new DynamicAdapt('max');
da.init();

// =========================================================

let swiperPreview = new Swiper('.preview__slider', {
  speed: 700,
  loop: true,
  slidesPerView: 1,
  loopAdditionalSlides: 10,

  slideToClickedSlide: true,
  spaceBetween: 56,
  initialSlide: 2,

  autoplay: {
    delay: 4000,
    disableOnInteraction: true,
  },
  breakpoints: {
    480: {
      grabCursor: true,
    },
  },
});

let swiperCommunity = new Swiper('.community__slider', {
  speed: 700,
  slidesPerView: 1,
  initialSlide: 1,
  slideToClickedSlide: true,
  spaceBetween: 40,
  pagination: {
    el: '.slider-community__pagination',
    type: 'fraction',
    renderFraction: function (currentClass, totalClass) {
      return 'Slide <span class="' + currentClass + '"></span>' + ' of ' + '<span class="' + totalClass + '"></span>';
    },
  },
  breakpoints: {
    480: {
      grabCursor: true,
      spaceBetween: 20,
    },
  },
  navigation: {
    nextEl: '.slider-community__control-next',
    prevEl: '.slider-community__control-preview',
  },
});

let swiperTeam = new Swiper('.team__slider', {
  speed: 700,
  slideToClickedSlide: true,
  slidesPerView: 1,
  autoplay: {
    delay: 6000,
    disableOnInteraction: true,
  },
  breakpoints: {
    480: {
      grabCursor: true,
    },
  },
});

let swiperCreators = new Swiper('.creators__slider', {
  speed: 700,
  // slideToClickedSlide: true,

  loop: true,

  // centeredSlides: true,
  // centeredSlidesBounds: true,
  // autoplay: {
  //   delay: 6000,
  //   disableOnInteraction: true,
  // },
  observer: true,
  observeParents: true,
  breakpoints: {
    480: {
      grabCursor: true,
      spaceBetween: 0,
      slidesPerView: 1,
    },

    640: {
      spaceBetween: 20,
      slidesPerView: 2,
    },

    1024: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1200: {
      spaceBetween: 64,
      slidesPerView: 3,
    },
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: true,
  },
});
