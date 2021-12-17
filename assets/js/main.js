// Initial Values
const INITIAL_SEARCH_VALUE = 'classic';
const log = console.log;
const $ = document.querySelector.bind(document);


// Selecting elements from the DOM
const searchButton = document.querySelector('#search');;
const searchInput = document.querySelector('#exampleInputEmail1');
const moviesContainer = document.querySelector('#movies-container');
const moviesSearchable = document.querySelector('#movies-searchable');

function createComment(commentDoc, id) {
    
    var div = document.createElement('div');
    var texSpan = div.appendChild(document.createElement(`span`));
    texSpan.className = "spanComment";
    var timestamp;
    if (commentDoc.TimeStamp) {
        timestamp = commentDoc.TimeStamp.toDate();
    }
    else {
        timestamp = new Date();
        div.classList.add("currentUserComment");
    }
    texSpan.innerHTML = `${commentDoc.comment} <div class = "timestamp" style="text-align: right"> ${timestamp.toDateString()} </div>`;


    $('#comments').appendChild(div);
    console.log(email, commentDoc.email);

    if (auth.currentUser.email === commentDoc.email) {
        div.classList.add("currentUserComment");
        var trashIcon = div.appendChild(document.createElement("span"));
        trashIcon.innerHTML = `<i class="fas fa-trash"></i>`;
        trashIcon.className = "Trash";
        trashIcon.onclick = function () {
            if (confirm("You sure???")) {
                deleteComment(id);
                div.remove();
            }
        }

        var editIcon = div.appendChild(document.createElement("span"));
        editIcon.innerHTML = `<i class="fas fa-edit"></i>`;
        editIcon.className = "Edit";
        editIcon.onclick = function () {
            var message = prompt("Edit?");
            if (message) {
                updateComment(id, message);
                texSpan.innerHTML = `${message} <div class = "timestamp" style="text-align: right"> ${timestamp.toDateString()} </div> `;
            }
        }

    }
    div.className = 'comment';
}

window.onload = function () {
    this.fetch(`https://api.themoviedb.org/3/movie/550?api_key=edd68774360c1fb578661fcb231c08a2`)
        .then(r => r.json())
        .then(data => {
            console.log(data);
        });


    // check if user is logged in
    onLogin(user => {
        if (user) {
            //user just logged in
            $('#comments').style.visibility = 'visible';
            $('#addCommentDiv').style.display = 'block';
            $('#loginDiv').style.display = 'none';
            $('#signupDiv').style.display = 'none';
            $('.container').style.display = 'visible';
            forEachComment(createComment);
        } else {
            //user just logged out
            $('#comments').style.visibility = 'collapse';
            $('#loginDiv').style.display = 'block';
            $('#addCommentDiv').style.display = 'none';
            $('.container').style.display = 'visible';
        }
    });

    // show comments
    


    $('#loginLink').onclick = function () {
        $('#loginDiv').style.display = 'block';
        $('#signupDiv').style.display = 'none';
    }

    $('#signupLink').onclick = function () {
        $('#loginDiv').style.display = 'none';
        $('#signupDiv').style.display = 'block';
    }

    $('#out').onclick = function () {
        logout();
    }

    $('#loginBtn').onclick = function () {
        console.log(`here`);
        login($('#email').value, $('#password').value)
            .catch(err => $('.error').innerText = err.message);
    }

    $('#registerBtn').onclick = function () {
        signup($('#emailReg').value, $('#passwordReg').value)
            .catch(err => $('.error').innerText = err.message);
    }

    $('#addCommentBtn').onclick = function () {
        addComment($('#newComment').value)
            .then(() => {
                createComment({ comment: $('#newComment').value });
                $('#newComment').value = '';
            })
            .catch(err => $('.error').innerText = err.message)
    }
}

function createImageContainer(imageUrl, id) {
    const tempDiv = document.createElement('div');
    tempDiv.setAttribute('class', 'imageContainer');
    tempDiv.setAttribute('data-id', id);

    const movieElement = `
        <img src="${imageUrl}" alt="" data-movie-id="${id}">
    `;
    tempDiv.innerHTML = movieElement;

    return tempDiv;
}

function resetInput() {
    searchInput.value = '';
}

function handleGeneralError(error) {
    log('Error: ', error.message);
    alert(error.message || 'Internal Server');
}

function createIframe(video) {
    const videoKey = (video && video.key) || 'No key found!!!';
    const iframe = document.createElement('iframe');
    iframe.src = `http://www.youtube.com/embed/${videoKey}`;
    // iframe.src = `https://soap2day.ac/embed/${videoKey}`;
    // iframe.src = `https://soap2day.ac/MczozMjoiMTE5ODh8fDI0Ljg5LjE5MS4xNzh8fDE2Mzg1NTkxNjIiOw.html/${videoKey}`;
    iframe.width = 200;
    iframe.height = 200;
    iframe.allowFullscreen = true;
    return iframe;
}

function insertIframeIntoContent(video, content) {
    const videoContent = document.createElement('div');
    const iframe = createIframe(video);

    videoContent.appendChild(iframe);
    content.appendChild(videoContent);
}


function createVideoTemplate(data) {
    const content = this.content;
    content.innerHTML = '<p id="content-close">EXIT</p>';

    const videos = data.results || [];

    if (videos.length === 0) {
        content.innerHTML = `
            <p id="content-close">EXIT</p>
            <p>No Trailer found for this video id of ${data.id}</p>
        `;
        return;
    }

    for (let i = 0; i < 4; i++) {
        const video = videos[i];
        insertIframeIntoContent(video, content);
    }
}

function createSectionHeader(title) {
    const header = document.createElement('h2');
    header.innerHTML = title;

    return header;
}

function renderMovies(data) {
    const moviesBlock = generateMoviesBlock(data);
    const header = createSectionHeader(this.title);
    moviesBlock.insertBefore(header, moviesBlock.firstChild);
    moviesContainer.appendChild(moviesBlock);
}

function renderSearchMovies(data) {
    moviesSearchable.innerHTML = '';
    const moviesBlock = generateMoviesBlock(data);
    moviesSearchable.appendChild(moviesBlock);
}

function generateMoviesBlock(data) {
    const movies = data.results;
    const section = document.createElement('section');
    section.setAttribute('class', 'section');

    for (let i = 0; i < movies.length; i++) {
        const { poster_path, id } = movies[i];

        if (poster_path) {
            const imageUrl = MOVIE_DB_IMAGE_ENDPOINT + poster_path;

            const imageContainer = createImageContainer(imageUrl, id);
            section.appendChild(imageContainer);
        }
    }

    const movieSectionAndContent = createMovieContainer(section);
    return movieSectionAndContent;
}



// Inserting section before content element
function createMovieContainer(section) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const template = `
        <div class="content">
            <p id="content-close">X</p>
        </div>
    `;

    movieElement.innerHTML = template;
    movieElement.insertBefore(section, movieElement.firstChild);
    return movieElement;
}

searchButton.onclick = function (event) {
    event.preventDefault();
    const value = searchInput.value

    if (value) {
        searchMovie(value);
    }
    resetInput();
}

function reload() {
    // reload = window.reload();
    reload = moviesContainer.reload();
    // reload2 = moviesSearchable.reload();
}

// Click on any movies
// Event Delegation
document.onclick = function (event) {
    // log('Event: ', event);
    const { tagName, id } = event.target;
    if (tagName.toLowerCase() === 'img') {
        const movieId = event.target.dataset.movieId;
        const section = event.target.parentElement.parentElement;
        const content = section.nextElementSibling;
        content.classList.add('content-display');
        getVideosByMovieId(movieId, content);
    }

    if (id === 'content-close') {
        const content = event.target.parentElement;
        content.classList.remove('content-display');

    }
    ////////////////////////////////////////////////////////////////
    ////////////movie to login poum fini
    if (id == 'W1') {
        $('#addCommentBtn').onclick = function () {
            addComment($('#newComment').value)
                .then(() => {
                    createComment({ comment: $('#newComment').value });
                    $('#newComment').value = '';
                })
                .catch(err => $('.error').innerText = err.message)
        }
    }
    if (id == 'loginBtn') {

        // console.log("YES SIR");
        $('#loginBtn').onclick = function () {
            console.log(`here`);
            login($('#email').value, $('#password').value)
                .catch(err => $('.error').innerText = err.message);
        }
    }

    if (id == `out`, `addCommentBtn`, `loginBtn`, `signupLink`, `registerBtn`, `loginLink`) {

        $('#out').onclick = function () {
            logout();
        }

        $('#addCommentBtn').onclick = function () {
            addComment($('#newComment').value)
                .then(() => {
                    createComment({ comment: $('#newComment').value });
                    $('#newComment').value = '';
                })
                .catch(err => $('.error').innerText = err.message)
        }

        $('#loginBtn').onclick = function () {
            console.log(`here`);
            login($('#email').value, $('#password').value)
                .catch(err => $('.error').innerText = err.message);
            reload();
        }

        $('#signupLink').onclick = function () {
            $('#loginDiv').style.display = 'none';
            $('#signupDiv').style.display = 'block';
        }

        $('#registerBtn').onclick = function () {
            signup($('#emailReg').value, $('#passwordReg').value)
                .catch(err => $('.error').innerText = err.message);
        }

        $('#loginLink').onclick = function () {
            $('#loginDiv').style.display = 'block';
            $('#signupDiv').style.display = 'none';
        }

        // forEachComment(createComment);

        // onLogin(user => {
        //     if (user) {
        //         //user just logged in
        //         $('#comments').style.visibility = 'visible';
        //         $('#addCommentDiv').style.display = 'block';
        //         $('#loginDiv').style.display = 'none';
        //         $('#signupDiv').style.display = 'none';
        //     } else {
        //         //user just logged out
        //         $('#comments').style.visibility = 'collapse';
        //         $('#loginDiv').style.display = 'block';
        //         $('#addCommentDiv').style.display = 'none';
        //     }
        // });
    }

}


// Initialize the search
// searchMovie(INITIAL_SEARCH_VALUE);
searchUpcomingMovies();
searchPopularMovie();
getTrendingMovies();
// getTopRatedMovies();
