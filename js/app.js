var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());

/*
let block = document.querySelector('.click');
block.addEventListener("click", function (e) {
	alert('Все ок ;)');
});
*/

/*
//Объявляем переменные
const parent_original = document.querySelector('.content__blocks_city');
const parent = document.querySelector('.content__column_river');
const item = document.querySelector('.content__block_item');

//Слушаем изменение размера экрана
window.addEventListener('resize', move);

//Функция
function move(){
	const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if (viewport_width <= 992) {
		if (!item.classList.contains('done')) {
			parent.insertBefore(item, parent.children[2]);
			item.classList.add('done');
		}
	} else {
		if (item.classList.contains('done')) {
			parent_original.insertBefore(item, parent_original.children[2]);
			item.classList.remove('done');
		}
	}
}

//Вызываем функцию
move();

*/


//SlideToggle
let _slideUp = (target, duration = 500) => {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}
let _slideDown = (target, duration = 500) => {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display === 'none')
		display = 'block';

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}
let _slideToggle = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (window.getComputedStyle(target).display === 'none') {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
}
//========================================

// === anim handler ===========================================
const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll() {
		for (let index = 0; index < animItems.length; index++) {
			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 4;

			let animItemPoint = window.innerHeight - animItemHeight / animStart;
			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
				animItem.classList.add('_active');
			} else {
				if (!animItem.classList.contains('_anim-no-hide')) {
					animItem.classList.remove('_active');
				}
			}
		}
	}
	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}

	setTimeout(() => {
		animOnScroll();
	}, 300);
}
// === anim handler ===========================================

$(document).ready(function () {
	document.body.classList.add('is-load');

	// === Burger Handler =====================================================================
	function burgerBtnAnimation(e) {
		$('.burger span:nth-child(1)').toggleClass('first');
		$('.burger span:nth-child(2)').toggleClass('second');
		$('.burger span:nth-child(3)').toggleClass('third');
		$('.burger span:nth-child(4)').toggleClass('fourth');
		let classNameElem = document.querySelector('.burger').dataset.activel;
		document.querySelector(`.${classNameElem}`).classList.toggle('open');
		_slideToggle(document.querySelector(`.${classNameElem}`));
	}
	$('.burger').click((e) => burgerBtnAnimation(e));
// === Burger Handler =====================================================================	;

	// === Проверка, поддержка браузером формата webp ==================================================================

	function testWebP(callback) {

		var webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

	testWebP(function (support) {

		if (support == true) {
			document.querySelector('body').classList.add('webp');
		} else {
			document.querySelector('body').classList.add('no-webp');
		}
	});

	// === // Проверка, поддержка браузером формата webp ==================================================================

	// === Конвертация svg картинки в svg код ==================================================================
	$('img.img-svg').each(function () {
		var $img = $(this);
		var imgClass = $img.attr('class');
		var imgURL = $img.attr('src');
		$.get(imgURL, function (data) {
			var $svg = $(data).find('svg');
			if (typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass + ' replaced-svg');
			}
			$svg = $svg.removeAttr('xmlns:a');
			if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
				$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
			}
			$img.replaceWith($svg);
		}, 'xml');
	});
	// === // Конвертация svg картинки в svg код ==================================================================


	//Select
let selects = document.getElementsByTagName('select');
if (selects.length > 0) {
	selects_init();
}
function selects_init() {
	for (let index = 0; index < selects.length; index++) {
		const select = selects[index];
		select_init(select);
	}
	//select_callback();
	document.addEventListener('click', function (e) {
		selects_close(e);
	});
	document.addEventListener('keydown', function (e) {
		if (e.which == 27) {
			selects_close(e);
		}
	});
}
function selects_close(e) {
	const selects = document.querySelectorAll('.select');
	if (!e.target.closest('.select')) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_body_options = select.querySelector('.select__options');
			select.classList.remove('_active');
			_slideUp(select_body_options, 100);
		}
	}
}
function select_init(select) {
	const select_parent = select.parentElement;
	const select_modifikator = select.getAttribute('class');
	const select_selected_option = select.querySelector('option:checked');
	select.setAttribute('data-default', select_selected_option.value);
	select.style.display = 'none';

	select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');

	let new_select = select.parentElement.querySelector('.select');
	new_select.appendChild(select);
	select_item(select);
}
function select_item(select) {
	const select_parent = select.parentElement;
	const select_items = select_parent.querySelector('.select__item');
	const select_options = select.querySelectorAll('option');
	const select_selected_option = select.querySelector('option:checked');
	const select_selected_text = select_selected_option.text;
	const select_type = select.getAttribute('data-type');
	console.log(select_selected_option.value)

	if (select_items) {
		select_items.remove();
	}

	let select_type_content = '';
	if (select_type == 'input') {
		select_type_content = '<div class="select__value icon-select-arrow"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
	} else {
		select_type_content = '<div class="select__value icon-select-arrow"><span>' + select_selected_option.value + '</span></div>';
	}

	select_parent.insertAdjacentHTML('beforeend',
		'<div class="select__item">' +
		'<div class="select__title">' + select_type_content + '</div>' +
		'<div class="select__options">' + select_get_options(select_options) + '</div>' +
		'</div></div>');

	select_actions(select, select_parent);
}
function select_actions(original, select) {
	const select_item = select.querySelector('.select__item');
	const select_body_options = select.querySelector('.select__options');
	const select_options = select.querySelectorAll('.select__option');
	const select_type = original.getAttribute('data-type');
	const select_input = select.querySelector('.select__input');

	select_item.addEventListener('click', function () {
		let selects = document.querySelectorAll('.select');
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_body_options = select.querySelector('.select__options');
			if (select != select_item.closest('.select')) {
				select.classList.remove('_active');
				_slideUp(select_body_options, 100);
			}
		}
		_slideToggle(select_body_options, 100);
		select.classList.toggle('_active');
	});

	for (let index = 0; index < select_options.length; index++) {
		const select_option = select_options[index];
		const select_option_value = select_option.getAttribute('data-value');
		const select_option_text = select_option.innerHTML;

		if (select_type == 'input') {
			select_input.addEventListener('keyup', select_search);
		} else {
			if (select_option.getAttribute('data-value') == original.value) {
				select_option.style.display = 'none';
			}
		}
		select_option.addEventListener('click', function () {
			for (let index = 0; index < select_options.length; index++) {
				const el = select_options[index];
				el.style.display = 'block';
			}
			if (select_type == 'input') {
				select_input.value = select_option_text;
				original.value = select_option_value;
			} else {
				select.querySelector('.select__value').innerHTML = '<span>' + select_option_value + '</span>';
				original.value = select_option_value;
				select_option.style.display = 'none';
			}
		});
	}
}
function select_get_options(select_options) {
	if (select_options) {
		let select_options_content = '';
		for (let index = 0; index < select_options.length; index++) {
			const select_option = select_options[index];
			const select_option_value = select_option.value;
			if (select_option_value != '') {
				const select_option_text = select_option.text;
				select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
			}
		}
		return select_options_content;
	}
}
function select_search(e) {
	let select_block = e.target.closest('.select ').querySelector('.select__options');
	let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
	let select_search_text = e.target.value.toUpperCase();

	for (let i = 0; i < select_options.length; i++) {
		let select_option = select_options[i];
		let select_txt_value = select_option.textContent || select_option.innerText;
		if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
			select_option.style.display = "";
		} else {
			select_option.style.display = "none";
		}
	}
}
function selects_update_all() {
	let selects = document.querySelectorAll('select');
	if (selects) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			select_item(select);
		}
	}
};

	// ==  slider ==========================================================================
{
	let slider = document.querySelector('.main-slider');
	let bgSliderData;
	if(slider) {
			let mySwiper;
			mySwiper = new Swiper(slider.querySelector('.swiper-container'), {
			slidesPerView:1,
			speed: 600,
			// autoplay: {
			//   delay: 8000,
			// },
			spaceBetween: 35,
			pagination: {
			    el: slider.querySelector('.swiper-pagination'),
			    clickable: true,
			  },
			 on: {
			 	slideChange: function() {
			 		if(mySwiper) {
			 			console.log(mySwiper.activeIndex)
			 			bgSliderData.slideTo(mySwiper.activeIndex)
			 		}
			 	}
			 } 
			})
	}

	let bgSlider = document.querySelector('.bg-slider');
	if(bgSlider) {
		bgSliderData = new Swiper(bgSlider.querySelector('.swiper-container'), {
		slidesPerView:1,
		speed: 600,
		effect: 'fade',
		})
	}
}
{
	let bgSlider = document.querySelector('.bg-slider-v2');
	if(bgSlider) {
		 $('.bg-slider-v2').slick({
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  infinite: false,
		  arrows: false,
		  fade: true,
		  asNavFor: '.main-slider-v2'
		});
		$('.main-slider-v2').slick({
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  asNavFor: '.bg-slider-v2',
		  dots: true,
		   arrows: false,
		   touchThreshold: 10,
		   infinite: false,
		   autoplay: true,
		   autoplaySpeed: 8000,

		});
	}
}

// == and  slider ========================================================================== ;

	// ==  slider ==========================================================================
{
	let slider = document.querySelector('.aside-slider');
	if(slider) {
			let mySwiper = new Swiper(slider.querySelector('.swiper-container'), {
			slidesPerView:1,
			autoHeight: true,
			loop: true,
			speed: 600,
			// autoplay: {
			//   delay: 8000,
			// },
			pagination: {
			    el: slider.querySelector('.swiper-pagination'),
			    clickable: true,
			  },
			on: {
			  slideChange: function () {
			    //$(".aside__inner").getNiceScroll().resize();

			  },
			}  
			});


			slider.querySelectorAll('.swiper-slide').forEach((item) => {
				let height = item.clientHeight;
				item.style.maxHeight = '350px';
				slider.querySelector('.swiper-wrapper').style.height = 'auto';
				let btn = item.querySelector('.aside-slider__read-all');
				btn.addEventListener('click', function() {
					if(item.classList.contains('is-open')) { 
						item.style.maxHeight = '350px';
						item.classList.remove('is-open');
						btn.innerText = "Read All";
						slider.querySelector('.swiper-wrapper').style.height = 'auto';
					} else {
						if(height < 350) {
							let height2 = item.clientHeight;
							console.log(height);
							console.log(height2);
							item.style.maxHeight = (height2 + 40) + 'px';
							item.classList.add('is-open');
							slider.querySelector('.swiper-wrapper').style.height = 'auto';
							btn.innerText = "Close";
						} else {
							item.style.maxHeight = (height + 40) + 'px';
							item.classList.add('is-open');
							slider.querySelector('.swiper-wrapper').style.height = 'auto';
							btn.innerText = "Close";
						}
					}
				})

			})	
	}
}
// == and  slider ==========================================================================;

	{
	const slider = document.querySelector('.block-cards.swiper-container');
	let mySwiper;

	if (slider) {
		function mobileSlider() {
			if(document.documentElement.clientWidth <= 991 && slider.dataset.mobile == 'false') {
				mySwiper = new Swiper(slider, {
					slidesPerView: 'auto',
					spaceBetween: 15,
					centeredSlides: true,
					on: {
					  init: function () {
					    console.log('swiper initialized');
					  },
					},
				});

				slider.dataset.mobile = 'true';

				mySwiper.slideNext(0);
			}

			if(document.documentElement.clientWidth > 991) {
				slider.dataset.mobile = 'false';

				if(slider.classList.contains('swiper-container-initialized')) {
					mySwiper.destroy();
				}
			}
		}

		mobileSlider();

		window.addEventListener('resize', () => {
			mobileSlider();
		})
	}

};

	function cardNewsHandler(){
	let cards = document.querySelectorAll('.card-news');
	if(cards.length) {
		cards.forEach(item => {
			let text = item.querySelector('.card-news__text');
			if(text.innerText.length > 162) {
				text.innerText = [...text.innerText].slice(0, 162).join('') + '...';
			}
		})
	}
};

cardNewsHandler();;

	// === aside handler ==================================================================

	{
		let aside = document.querySelector('.aside');
		if (aside) {
			let btnOpen = document.querySelector('.head-mobile__btn-left');
			let btnClose = document.querySelector('.aside__close');
			if (btnOpen) {
				btnOpen.addEventListener('click', function (e) {
					if (e.target.closest('.head-mobile__btn-left')) {
						aside.classList.add('open');
						document.body.classList.add('lock');

						if (document.documentElement.clientWidth < 768) {
							let menu = document.querySelector('.header__body')
							menu.classList.remove('open');
						}
					}
				})
			}

			if (btnClose) {
				btnClose.addEventListener('click', function (e) {
					if (e.target.closest('.aside__close')) {
						aside.classList.remove('open');
						document.body.classList.remove('lock');
					}
				})
			}

			let headTab1 = aside.querySelector('.aside__head-tab_1');
			let headTab2 = aside.querySelector('.aside__head-tab_2');
			let slider = aside.querySelector('.aside__body-slider');
			let form = aside.querySelector('.aside__body-form');

			headTab1.addEventListener('click', function () {
				headTab1.classList.add('active');
				headTab2.classList.remove('active');
				slider.classList.add('active');
				form.classList.remove('active');
			});

			headTab2.addEventListener('click', function () {
				headTab2.classList.add('active');
				headTab1.classList.remove('active');
				slider.classList.remove('active');
				form.classList.add('active');
			});
		}
	}
	// === // aside handler ==================================================================

	//Spollers
	function runSpoller() {
		let spollers = document.querySelectorAll("._spoller");
		if (spollers.length > 0) {
			for (let index = 0; index < spollers.length; index++) {
				const spoller = spollers[index];
				spoller.addEventListener("click", function (e) {
					e.preventDefault();
					if (spoller.classList.contains('_spoller-992') && window.innerWidth > 992) {
						return false;
					}
					if (spoller.classList.contains('_spoller-768') && window.innerWidth > 768) {
						return false;
					}
					if (spoller.closest('._spollers').classList.contains('_one')) {
						let curent_spollers = spoller.closest('._spollers').querySelectorAll('._spoller');
						for (let i = 0; i < curent_spollers.length; i++) {
							let el = curent_spollers[i];
							if (el != spoller) {
								el.classList.remove('_active');
								_slideUp(el.nextElementSibling);
							}
						}
					}
					spoller.classList.toggle('_active');
					_slideToggle(spoller.nextElementSibling);
				});
			}
		}
	}

	//=================

	// === mobile menu handler ==================================================================
	{
		let menu = document.querySelector('.header__body')
		if (menu) {
			let burger = document.querySelector('.head-mobile__btn-right');
			if (burger) {
				burger.addEventListener('click', function () {
					menu.classList.add('open');
					document.body.classList.add('lock');
					if (document.documentElement.clientWidth < 768) {
						let aside = document.querySelector('.aside');
						aside.classList.remove('open');
					}
				})
			}

			let btnClose = document.querySelector('.header__close')
			if (btnClose) {
				btnClose.addEventListener('click', function () {
					menu.classList.remove('open');
					document.body.classList.remove('lock');
				})
			}
		}

		let navMenu = document.querySelector('.menu');
		if (navMenu) {
			function addClasses() {
				if (document.documentElement.clientWidth < 992) {
					navMenu.classList.add('_spollers', '_one');
					navMenu.querySelectorAll('.menu__item > a').forEach(link => {
						link.classList.add('_spoller');
					})
				}
			}

			function removeClasses() {
				navMenu.classList.remove('_spollers', '_one');
				navMenu.querySelectorAll('.menu__item > a').forEach(link => {
					link.classList.remove('_spoller');
				})
			}
			addClasses()

			window.addEventListener('resize', function () {
				if (document.documentElement.clientWidth < 992) {
					addClasses()
					runSpoller();
				} else {
					removeClasses()
				}
			})
		}

	}
	runSpoller();
	// === // mobile menu handler ==================================================================

	// === if there are cards ==================================================================
	// let blockCards = document.querySelector('.block-cards');
	//  if(blockCards) {
	//  	let mainSlider = document.querySelector('.main-slider .swiper-container');
	//  	mainSlider.classList.add('_margin-bottom');
	//  }
	// // === // if there are cards ==================================================================
	// console.log('test4')

	// === add background mobile head ==================================================================
	window.addEventListener('scroll', function () {
		let mobileHead = document.querySelector('.head-mobile');
		if (window.pageYOffset > 10) {
			mobileHead.classList.add('background');
		} else {
			mobileHead.classList.remove('background');
		}
	})
	// === // add background mobile head ==================================================================

	// === footer text handler ==================================================================
	{
		let statement = document.querySelector('.statement__inner');
		if (statement) {
			let btn = statement.querySelector('.statement__btn-close');
			if (btn) {
				btn.addEventListener('click', function () {

					if (statement.classList.contains('is-open')) {
						statement.style.maxHeight = '163px';
						statement.classList.remove('is-open');
						btn.innerText = "Read All";
					} else {
						statement.style.maxHeight = statement.scrollHeight + 'px';
						statement.classList.add('is-open');
						btn.innerText = "Close";
					}

				})
			}
		}
	}
	// === // footer text handler ==================================================================

	{
		let logo = document.querySelector('.header__logo a');
		if (logo) {
			lottie.loadAnimation({
				container: logo, // the dom element that will contain the animation
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: 'https://vitaliiradaiev.github.io/CometFx-page/img/CometFX-Logo.json' // the path to the animation json
			});
		}

		let mobileLogo = document.querySelector('.head-mobile__logo a');
		if (mobileLogo) {
			lottie.loadAnimation({
				container: mobileLogo, // the dom element that will contain the animation
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: 'https://vitaliiradaiev.github.io/CometFx-page/img/CometFX-Logo.json' // the path to the animation json
			});
		}
	}


	// == list column 3 h2 ceneter mobile ==========================
	{
		if (document.documentElement.clientWidth < 768) {
			let list = document.querySelectorAll('.list-column-3');
			if (list) {
				list.forEach(item => {
					let prevEl = item.previousElementSibling;
					if (prevEl.nodeName == 'H2' || prevEl.nodeName == 'H3') {
						prevEl.style.textAlign = 'center';
					}

				})
			}
		}

		let list = document.querySelectorAll('.list-column-3.center');
		if (list) {
			list.forEach(item => {
				let prevEl = item.previousElementSibling;
				if (prevEl.nodeName == 'H2' || prevEl.nodeName == 'H3') {
					prevEl.style.textAlign = 'center';
				}

			})
		}
	}
	// == list column 3 h2 ceneter mobile ==========================


	let menuTable = document.querySelector('.tabs-block');
	if (menuTable) {
		document.querySelectorAll('.tabs-block__triggers').forEach((item) => {
			item.addEventListener('click', function (e) {
				e.preventDefault();
				const id = e.target.getAttribute('href').replace('#', '');
				console.log(id)
				document.querySelectorAll('.tabs-block__triggers').forEach((child) => {
					child.classList.remove('active');
				});

				document.querySelectorAll('.tabs-block__content').forEach((child) => {
					child.classList.remove('active');
				});

				item.classList.add('active');
				document.getElementById(id).classList.add('active');
			});
		});

		if (isMobile.any()) {
			$("div#scroll").addClass('_mobile');
		} else {
			$("div#scroll").smoothDivScroll({
				touchScrolling: true,
				hotSpotScrolling: false,
			});
		}

	}
	// == and platform tabs handler =========================


	// == ruls-list handler =========================
	{
		let rulsBlock = document.querySelector('.rulls__list');
		if (rulsBlock) {
			if (rulsBlock.children.length % 2 != 0) {
				rulsBlock.classList.add('_is-odd-childern');
			}
		}
	}
	// == and ruls-list handler =========================


	// == block-column-2 handler =========================
	{
		let block = document.querySelector('.block-column-2');
		if (block) {
			let arr = [...block.children];
			let count = Math.ceil(block.children.length / 2);
			for (let i = 0; i < 2; i++) {
				let column = document.createElement('div');
				column.className = 'column';

				for (let j = 0; j < count; j++) {
					if (arr[j]) {

						column.append(arr[j]);
					}
				}
				arr = arr.slice(count)
				block.append(column);
			}
		}
	}
	// == and block-column-2 handler =========================
});;