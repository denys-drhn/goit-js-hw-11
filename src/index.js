import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import axios from 'axios';
import ImagesApiServise from './fetchImages'

const refs = { //перенести в другой файл Модуль 12. HTTP-запросы (AJAX) 26/10/20   1ч 24минута

	searchForm: document.querySelector('.search-form'),
	loadMoreBtn: document.querySelector('.load-more'),
	galleryCardList: document.querySelector('.gallery')
}

refs.searchForm.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

const imagesApiServise = new ImagesApiServise();
// console.log(imagesApiServise);


refs.loadMoreBtn.classList.add('is-hidden');

function onSearchClick(event) {
	event.preventDefault();
	
	imagesApiServise.query = event.currentTarget.elements.searchQuery.value.trim(); // значение ввода через метод SET + trim()
	
	if (imagesApiServise.query === '') {
		Notify.warning("Sorry, there are no images matching your search query. Please try again.");
		return []; // якщо поле вводу пусте
	}

	imagesApiServise.resetPage();
	refs.loadMoreBtn.classList.add('is-hidden');
	imagesApiServise.fechImages().then(data => {

	if (data.totalHits === 0) {
	Notify.failure("Sorry, there are no images matching your search query. Please try again.");
	} else {
		Notify.success(`Hooray! We found ${data.totalHits} images.`);
	}
	// console.log(data.totalHits);

		const hits = data.hits;

		
		// console.log(hits);
		clearHitsMarkup();
		appendHitsMarkup(hits);
		setTimeout(() => {
			if (data.totalHits >= 40) {
			refs.loadMoreBtn.classList.remove('is-hidden');
		}
	}, 1000);
	}).catch(error => console.log(error));	
};

function onLoadMoreBtnClick() {
	
	imagesApiServise.fechImages().then(data => { 
		const hits = data.hits;
		if (hits.length < 40) {
		refs.loadMoreBtn.classList.add('is-hidden');
		Notify.failure("We're sorry, but you've reached the end of search results.");
		};
		console.log(hits.length);
		appendHitsMarkup(hits);
	}).catch(error => {
		console.log(error);
	});
};


function appendHitsMarkup(hits) {
	const markup = hits.map((hit) => `<div class="photo-card">
<img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
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