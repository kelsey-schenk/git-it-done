var repoNameEl = document.querySelector("#repo-name");
// create a reference to issue container so that issue elements can be appended
var issueContainerEl = document.querySelector("#issues-container");
// creating reference to limit-warning container
var limitWarningEl = document.querySelector("#limit-warning");
var getRepoName = function() {
    // the api is a property of the document object
    // used to query elements on the page
    // use document.location to locate the query string
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    console.log(repoName);
    // checks if the repo name exists
    // will only display the repo name and make the fetch call if the value
    // for repoName exists
    if(repoName) {
    // display repo name on the page
    repoNameEl.textContent = repoName;
    getRepoIssues(repoName);
    }
    // redirect user back to the homepage in case the repo
    // doesn't exist
    else {
        document.location.replace("./index.html");
    }
};
var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // make a get request to the url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data){
                // pass response data to dom function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                displayWarning(repo);
            }
        });
    }
        else {
            // if not successful, redirect to the homepage
            document.location.replace("./index.html");
        }
    });
};

// this function is dynamically creating html for the issues
var displayIssues = function(issues) {
    // Displays a message in the issues container, letting users know there are no open
    // issues for the given repository
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }


    // looping over the response data
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        // issue objects have an html_url property which links to the full issue on GitHub
        issueEl.setAttribute("href", issues[i].html_url);
        // added a target="_blank" attribute to each <a> element to open the linkin a new tab
        // instead of replacing the current webpage
        issueEl.setAttribute("target", "_blank");

        // display each issue's name as well as its type
        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        // append to the dom
        issueContainerEl.appendChild(issueEl);
    }
}
// create new displayWarning() function with repo parameter
var displayWarning = function(repo){
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    // create link element
    var linkEl = document.createElement("a");
    linkEl.textContent = "GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
getRepoIssues();