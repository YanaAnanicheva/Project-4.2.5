
let enteredRequest = document.querySelector('.enteredRequest');
let repoList = document.querySelector('.repoList')
receivedRequest = debounce(receivedRequest, 300)
input = document.querySelector('.main-background__search');
input.addEventListener('keyup', receivedRequest)



async function receivedRequest() {
  if(input.value) {
    let searchElem = input.value;
    return await fetch(`https://api.github.com/search/repositories?q=${searchElem}`)
    .then((result) => {
        result.json()
        .then(result => {
          searchResult(result, enteredRequest);
          enteredRequest.onclick = (ev) => { createCheckedRepo(ev, result);
            deleteOldSearchResult(enteredRequest);
          }
        })
      })
    }
}

function searchResult(foundRepo, enteredRequest) {
  while(enteredRequest.children.length !== 0) {
    enteredRequest.removeChild(enteredRequest.firstChild)
  }
  createResSearchResult(foundRepo, enteredRequest)
}

function createResSearchResult(foundRepo, repoList) {
  let reposResult = 0;
  foundRepo.items.length >= 5 ? reposResult  = 5 : reposResult = foundRepo.items.length;

  let newRepo;

  for (let i = 0; i < reposResult; i++){
    newRepo = document.createElement('div');
    newRepo.classList.add('main-background__search-result');
    newRepo.textContent = foundRepo.items[i].name;
    repoList.appendChild(newRepo);
  }
}

function createCheckedRepo(ev, result) {
  ev.stopPropagation()
  let repoName = ev.target.innerText;
  let [checkedRepo] = result.items.filter(function (repo) {
    return repoName === repo.name;
  })

  let repoItem = document.createElement('div');
  repoItem.classList.add('main-background__search-result-save');
  repoList.appendChild(repoItem);

  let repoNameText = document.createElement('p');
  repoNameText.textContent = `Name: ${checkedRepo.name}`;
  repoItem.appendChild(repoNameText);

  let repoOwnerText = document.createElement('p');
  repoOwnerText.textContent = `Owner: ${checkedRepo.owner.login}`;
  repoNameText.appendChild(repoOwnerText);

  let repoStarsText = document.createElement('p');
  repoStarsText.textContent = `Stars: ${checkedRepo.stargazers_count}`
  repoOwnerText.appendChild(repoStarsText)

  let repoCloseBtn = document.createElement('div');
  repoCloseBtn.classList.add('close-btn');
  repoNameText.appendChild(repoCloseBtn);
  repoCloseBtn.onclick = function () {
    repoList.removeChild(repoItem)
  }
  input.value = '';
}

function deleteOldSearchResult(enteredRequest) {
  while(enteredRequest.children.length !== 0) {
    enteredRequest.removeChild(enteredRequest.firstChild)
  }
}

function debounce (cb, delay){
  let timer;
  return function (){
      clearTimeout(timer);
      timer = setTimeout(() => {
          cb.apply(this, arguments)
      }, delay)
  }
}