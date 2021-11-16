var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    // When we submit the form we get the value from the input element via
    // nameInputEl DOM variable and store the value in its own variable
    // called username
    // trim is useful if we accidentally leave a leading or trailing
    // space in the <input> element
    var username = nameInputEl.value.trim();
    // Check that there's a value in the username variable
    if (username) {

        // if there is a value to username, we pass the data through
        // getUserRepos() as an argument
        getUserRepos(username);
        // to clear the form, we clear out the <input> element's value
        repoContainerEl.textContent='';
        nameInputEl.value = '';
    } else {
        alert('Please enter a GitHub username');
    }
};

var getUserRepos = function(user) {
// format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    // make a request to the url
    fetch(apiUrl)
        .then(function(response){
            // request was successful
                if (response.ok) {
                    response.json().then(function(data) {
                    console.log(data);
                    displayRepos(data,user);
            });
        } else {
            alert('Error: '+ response.statusText);
        }
    })
    .catch(function(error) {
        // notice this '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to GitHub");
    });
};


var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent + "No repositories found.";
        return;
    }

    repoSearchTerm.textContent = searchTerm;
    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";      
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

// add event listeners to forms
userFormEl.addEventListener('submit', formSubmitHandler);