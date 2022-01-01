const form = document.querySelector('.search-container')
const resultsParent = document.querySelector('.ul-results')
const favorites = document.querySelector('.favorites')
let viewLayer = document.querySelector(".view-layer");
let viewBox = document.querySelector(".view-container");
let closeView = document.querySelector('.close-view')

let currentItems = [];
let favoriteItems = [];
let idOfItem;
let temp = {}

// search form
form.addEventListener('submit', async (e) => {
    clearAll()
    e.preventDefault();
    try {
        const query = form.elements.query.value;
        const res = await fetch('https://api.tvmaze.com/search/shows?q=' + query)
        const data = await res.json()
        addToCurrentItem(data)
        if (data.length > 0) {
            resultsParent.innerHTML = ''
            makeImages(data)
            
        } else {
            resultsParent.innerHTML = "Sorry! No results found."
        }
    }
    catch (err) {
        console.log('The error is:', err)
    }

    activeBtnEvent()
    addToFav()
})

// add current results to currentItems array
const addToCurrentItem = (...i) => {
    for(let x of i){
        x.forEach(e => {
            currentItems.push(e)
        })
    }
    console.log(currentItems)
}

// clear frontend and empty currentItems array
const clearAll = () => {
    let results = document.querySelectorAll('.ul-results .result-div')
    results.forEach((e) => {
        e.remove()
    })
    currentItems = [];
}

// add to favorites
const addToFav = () => {
    let heartBtns = document.querySelectorAll('.heart-icon')
    
    heartBtns.forEach(favorite => {
        favorite.addEventListener('click', e => {
            let currentShowID = e.target.nextSibling.firstChild.getAttribute('data');
            // let localStorageData = JSON.parse(localStorage.getItem('Favs'));

            for (let item of currentItems) {
                if (item.show.id.toString() === currentShowID) {
                    temp.id = item.show.id
                    temp.name = item.show.name
                    temp.image = item.show.image.medium ? item.show.image.medium : "#"
                    temp.genres = item.show.genres.length == 0 ? "Not specified" : item.show.genres
                    temp.language = item.show.language
                    temp.aired = item.show.aired
                }
            }

            const s = obj => obj.id === temp.id

            if(favoriteItems.length > 0){
                let localStorageData = JSON.parse(localStorage.getItem('Favs'))
                if(favoriteItems.some(s)){
                    console.log('exists')
                } else {
                    favoriteItems.push(temp)
                    
                }
            } else {
                favoriteItems.push(temp)
            }
            localStorage.setItem('Favs', JSON.stringify(favoriteItems));
            temp = {}
            // console.log(temp)
        })
    })
}




// popup window with data
const activeBtnEvent = () => {
    const searchItems = document.querySelectorAll('.result-info');
    for (let item of searchItems) {
        item.addEventListener('click', (e) => {
            idOfItem = e.target.getAttribute('data')
            for(let item of currentItems){
                if(idOfItem === item.show.id.toString()){
                    document.querySelector('.view-container .image').setAttribute('src', item.show.image.medium ? item.show.image.medium : "#")
                    document.querySelector('.view-container .name').innerText = item.show.name
                    document.querySelector('.view-container .genres').innerText = item.show.genres.length == 0 ? "Not specified" : item.show.genres
                    document.querySelector('.view-container .language').innerText = item.show.language
                    document.querySelector('.view-container .aired').innerText = item.show.aired
                }
            }
            viewLayer.style.display = "block";
            viewLayer.style.width = "100%";
            viewLayer.style.height = "100%";
            viewBox.style.width = "100%";
            viewBox.style.height = "100%";
            
        })
    }
}

closeView.addEventListener('click', e => {
    viewBox.style.width = 0;
    viewBox.style.height = 0;
    viewLayer.style.width = 0;
    viewLayer.style.height = 0;
})


const makeImages = () => {

    for(let result of currentItems){

        let image = result.show.image;

        let icon = document.createElement('i')
        icon.setAttribute('class', 'uil uil-heart change-theme heart-icon')
        icon.setAttribute('alt', 'Add to your favorites')
        icon.setAttribute('id', 'theme-button')

        let pTitle = document.createElement('p')
        pTitle.setAttribute('class', 'result-title')
        pTitle.setAttribute('data', result.show.id)
        pTitle.innerText = result.show.name

        let divInfo = document.createElement('div')
        divInfo.setAttribute('class', 'result-info')

        let img = document.createElement('img')
        img.setAttribute('src', result.show.image.medium ? result.show.image.medium : "#")
        

        let div = document.createElement('div')
        div.setAttribute('class', 'result-div')

        divInfo.appendChild(pTitle)
        div.appendChild(icon)
        div.appendChild(divInfo)
        div.appendChild(img)
        resultsParent.appendChild(div)

        if (image) {
            img.setAttribute('src', image.medium)
        } else {
            img.setAttribute('src', '#')
        }
    }
}
