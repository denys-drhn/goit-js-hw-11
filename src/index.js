import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiServise from './fetchImages';
// Описан в документации
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";
import InfiniteAjaxScroll from '@webcreate/infinite-ajax-scroll';


const refs = { //перенести в другой файл Модуль 12. HTTP-запросы (AJAX) 26/10/20   1ч 24минута

	searchForm: document.querySelector('.search-form'),
	loadMoreBtn: document.querySelector('.load-more'),
	galleryCardList: document.querySelector('.gallery')
};

refs.loadMoreBtn.classList.add('is-hidden'); // ховаємо кнопку

refs.searchForm.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick); // когда кнопка работает
refs.galleryCardList.addEventListener('click', onGalleryCardClick);

const imagesApiServise = new ImagesApiServise();
// console.log(imagesApiServise);
let gallery = new SimpleLightbox('.gallery a'); // https://simplelightbox.com/ 
let loadedItems;



async function onSearchClick(event) {
	event.preventDefault();
	
	imagesApiServise.query = event.currentTarget.elements.searchQuery.value.trim(); // значение ввода через метод SET + trim()
	
	if (imagesApiServise.query === '') {
		Notify.warning("Sorry, there are no images matching your search query. Please try again.");
		clearHitsMarkup()
		refs.loadMoreBtn.classList.add('is-hidden'); // сховав для бібліотеки
		return null; // якщо поле вводу пусте
	};

	imagesApiServise.resetPage();
	refs.loadMoreBtn.classList.add('is-hidden');
	
	try {
		const data = await imagesApiServise.fechImages();
		if (data.totalHits === 0) {
			Notify.failure("Sorry, there are no images matching your search query. Please try again.");
		} else {
			Notify.success(`Hooray! We found ${data.totalHits} images.`);
		};

		const hits = data.hits;
		clearHitsMarkup();
		appendHitsMarkup(hits);
		gallery.refresh(); // метод refresh() который обязательно нужно вызывать каждый раз после добавления новой группы карточек изображений.
		loadedItems = data.totalHits;
		loadedItems -= hits.length;
		setTimeout(() => {
			if (data.totalHits >= 40) {
				refs.loadMoreBtn.classList.remove('is-hidden'); // когда кнопка работает
			}
		}, 1000);
	} catch (error) {
		console.log(error)
	};
};


function appendHitsMarkup(hits) {
	const markup = hits.map((hit) => `<div class="photo-card">
<a href="${hit.largeImageURL}">
<img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
</a>
<div class="info">
<p class="info-item">
<b>Likes: ${hit.likes}</b>
</p>
<p class="info-item">
<b>Views: ${hit.views}</b>
</p>
<p class="info-item">
<b>Comments: ${hit.comments}</b>
</p>
<p class="info-item">
<b>Downloads: ${hit.downloads}</b>
</p>
</div>
</div>`).join("");
	// refs.countryInfo.innerHTML = '';
	refs.galleryCardList.insertAdjacentHTML('beforeend', markup);
};

function clearHitsMarkup() {
	refs.galleryCardList.innerHTML = "";
};

function onGalleryCardClick(event) {
	event.preventDefault();	// *Запрети (перенаправлен на другую страницу) по умолчанию.
// console.log(event.target.nodeName);
	// *нажатие только по тегу IMG:
	if (event.target.nodeName !== "IMG") { 
		return;

		// *У библиотеки есть метод refresh() который обязательно нужно
		//  вызывать каждый раз после добавления новой группы карточек изображений.
	};
};

// --------------------------------------------- intersectionObserved
const sentinel = refs.loadMoreBtn;
const options = {
	// root: по умолчанию window, но можно задать любой элемент-контейнер
	rootMargin: '0px 0px 75px 0px',
	threshold: 0,
};

const observer = new IntersectionObserver(onIntersection, options);
observer.observe(sentinel);


function onIntersection(entries) {
	if (entries[0].isIntersecting) {
	loadMoreImages();
	}
};

async function loadMoreImages() {
	
	try {
		const data = await imagesApiServise.fechImages();

		const hits = data.hits;

if (loadedItems < 40) {
	refs.loadMoreBtn.classList.add('is-hidden');
	Notify.failure("We're sorry, but you've reached the end of search results.");
	appendHitsMarkup(hits);
	gallery.refresh();
} else {
	if (hits.length < 40) {
		refs.loadMoreBtn.classList.add('is-hidden');
		Notify.failure("We're sorry, but you've reached the end of search results.");
		};
	appendHitsMarkup(hits);
	gallery.refresh(); // метод refresh() который обязательно нужно вызывать каждый раз после добавления новой группы карточек изображений.
	loadedItems -= hits.length;
	// console.log(loadedItems);
}
	} catch (error) {
		console.log(error);
	}
};


// ------------------------------------------- onLoadMoreBtnClick

async function onLoadMoreBtnClick() {
	
	try {
		const data = await imagesApiServise.fechImages();

		const hits = data.hits;

if (loadedItems < 40) {
	refs.loadMoreBtn.classList.add('is-hidden');
	Notify.failure("We're sorry, but you've reached the end of search results.");
	appendHitsMarkup(hits);
} else {
	if (hits.length < 40) {
		refs.loadMoreBtn.classList.add('is-hidden');
		Notify.failure("We're sorry, but you've reached the end of search results.");
		};
	appendHitsMarkup(hits);
	gallery.refresh(); // метод refresh() который обязательно нужно вызывать каждый раз после добавления новой группы карточек изображений.
	loadedItems -= hits.length;
	// console.log(loadedItems);
}
	} catch (error) {
		console.log(error);
	}
};

// --------------------------------------------- Infinite Ajax Scroll

// 		if (loadedItems === 40) {
// window.ias = new InfiniteAjaxScroll('.gallery', {
//   item: '.photo-card',
// 	next: loadMoreImages,
//   pagination: false,
//   trigger: false,
// });
// 		};

// const ias = new InfiniteAjaxScroll('.gallery', {
//   item: '.photo-card',
//   next: loadMoreImages,
//   trigger: false,
// });

// async function loadMoreImages() {
// 	try {
// 		const data = await imagesApiServise.fechImages();

// 		const hits = data.hits;

// 		if (loadedItems < 40) {
// 			// refs.loadMoreBtn.classList.add('is-hidden');
// 			Notify.failure("We're sorry, but you've reached the end of search results.");
// 			appendHitsMarkup(hits);
// 		}

// 		appendHitsMarkup(hits);
// 		gallery.refresh(); // метод refresh() который обязательно нужно вызывать каждый раз после добавления новой группы карточек изображений.
// 		loadedItems -= hits.length;
// 		console.log(hits.length);
// 		// console.log(loadedItems);
// 	} catch (error) {
// 		console.log(error);
// 	}
// }





// -------------------------------------------













// function onLoadMoreBtnClick() {
	
// 	imagesApiServise.fechImages().then(data => {
// 		const hits = data.hits;
// 		if (hits.length < 40) {
// 		refs.loadMoreBtn.classList.add('is-hidden');
// 		Notify.failure("We're sorry, but you've reached the end of search results.");
// 		};


// 		appendHitsMarkup(hits);
// 	}).catch(error => {
// 		console.log(error);
// 	});
// };

// async function onLoadMoreBtnClick() {
// 	try {

// 		const data = await imagesApiServise.fechImages();
// 		console.log(data);
// 		const hits = data.hits;

// 		if (hits.length < 40 ) {
// 		refs.loadMoreBtn.classList.add('is-hidden');
// 		Notify.failure("We're sorry, but you've reached the end of search results.");
// 		};
// 		appendHitsMarkup(hits);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };