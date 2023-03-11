import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
export default class ImagesApiServise {
	constructor() {
		this.searchQuery = '';
		this.page = 1;
	}

async fechImages() {
		const params = {
		key: '34146115-f93b131a505bf9d05e96b838b',
		q: this.searchQuery,
		page: this.page,
		per_page: 40,
		orientation: 'horizontal',
		safesearch: true,
		image_type: 'photo'
		};
		const response = await axios.get('https://pixabay.com/api/', { params });
		// console.log(response);
		const data = response.data;
		// console.log(response.data);
		// console.log(data);
		this.page += 1;
		return data;
}
	
	resetPage() {
	this.page = 1;
}

	get query() {
		return this.searchQuery;
	}

	set query(newQuery) {
		this.searchQuery = newQuery;
	}
}

// --work - without axios and async
	// fechImages() {
	// return fetch(`https://pixabay.com/api/?key=34146115-f93b131a505bf9d05e96b838b&q=${this.searchQuery}&page=${this.page}&per_page=40&orientation=horizontal&safesearch=true&image_type=photo`)
	// .then(response => {
	// 	return response.json();
	// }).then(data => {
	// 	this.page += 1; // можно винести за єту функцию
	// 	// console.log(data);
	// 	return data.hits;
	// })
	// }