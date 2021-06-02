let people = [];
let filters = {};
// get 100 users
fetch('https://randomuser.me/api/?results=100')
  .then(response => response.json())
  .then(data => data.results.forEach(person => people.push(person)))
  .finally(() => {generateCards(people)});
// populate page with cards based on filters
function generateCards(list){
	let listContainer = document.getElementById('results');
	let cards = '';
	list.forEach(function(person){
		cards = cards + `
		<li> 
			<div class="profile-pic"><img src="${person.picture.large}" /></div>
			<div class="details">
				<span class="name">${person.login.username}</span>
				<span class="sex">${person.gender}</span>
				<span class="age">${person.dob.age}</span>
			</div>
		</li>`
		document.querySelector('#results').innerHTML = cards;
	})
}
// clear filters
document.querySelector('#clear').onclick = function(){
	// clear radio buttons
	let inputs = document.querySelectorAll("input[type=radio]:checked");
	radioButtons = inputs.length;
	while(radioButtons--)inputs[radioButtons].checked = 0;
	// reset text input
	document.querySelector('#searchByName').value = '';
	// reset filters
	filters = {};
	runFilter();
}
// store text input into filters object
function setNameFilter(){
	let value = document.querySelector('#searchByName').value;
	filters = {...filters, name: value};
	runFilter();
}
// store radio inputs into filters object
function setRadioFilters(radioType, radioValue){
	if(radioType === 'age'){
		let value = document.querySelector('input[name="age"]:checked').value;
		filters = {...filters, age: value}
		runFilter();
	};
	if(radioType === 'gender'){
		let value = document.querySelector('input[name="gender"]:checked').value;
		filters = {...filters, gender: value};
		runFilter();
	};
}
// run filters on all items in filters object
function runFilter(){
	let results = [];
	// Start setting up the age filter if it exists
	if (filters.age) {
		results = people.filter(function(person){
			switch (filters.age) {
			  case '30':
			    return person.dob.age <= 30
			    break;
			  case '50':
			    return person.dob.age >= 50
			    break;
			  default:
	    		return person.dob.age < 50 && person.dob.age > 30		
	  }})
	} 
	// set up gender filters 
	if(filters.gender){
		results.length > 0 ? 
		// if there are existing results (from age) filter from that list else filter through from whole list
		results = results.filter((person) => {return person.gender === filters.gender}) :
		results = people.filter((person) => {return person.gender === filters.gender})
	}
	// set up name filters
	if(filters.name){
		results.length > 0 ? 
		// if there are existing results  filter from that list else filter through from whole list
		results = results.filter((person) => {return person.login.username.startsWith(filters.name)}) :
		results = people.filter((person) => {return person.login.username.startsWith(filters.name)})
	}
	//adjust text in header
	let count = document.querySelector('.count');
	let editMessage = document.querySelector('#edit');
	count.innerHTML = results.length;
	if(results.length === 0){
		count.classList.add('red');
		editMessage.classList.remove('hide');
		generateCards(people);
	} else {
		count.classList.remove('red');
		editMessage.classList.add('hide');
		generateCards(results);
	}
}