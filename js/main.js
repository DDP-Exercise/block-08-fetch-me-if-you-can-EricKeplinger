"use strict";

/*******************************************************
 *    Asynchronotrigger - 100p
 *
 *    This is your last assignment. Finish this to proof that
 *    you are a grown up now, who doesn't need to be held by
 *    the hand.
 *
 *    Create a users-class. Fetch the users, create Instances.
 *    - https://jsonplaceholder.typicode.com/users
 *
 *    Create a posts-class. Fetch the posts. create Instances.
 *    Assign them to the users (see userId in the posts).
 *    - https://jsonplaceholder.typicode.com/posts
 *
 *    Print the shit. Beautifully:
 *    List the 10 users. On click, expand them with their posts.
 *    Each Post should also have a Button to "load comments".
 *    Yes, you are correct. This is the perfect usecase for
 *    event-delegation! You can get the comments to a post from either
 *    - https://jsonplaceholder.typicode.com/posts/1/comments
 *    or
 *    - https://jsonplaceholder.typicode.com/comments?postId=1
 *    where "1" stands for the posts ID of course.
 *
 *    I believe in...
 *    You - 2026-06-09
 *  *******************************************************/

import User from "./class.user.js";
import Post from "./class.post.js";

const API = "https://jsonplaceholder.typicode.com";

let users = [];

const app = document.createElement("main");
document.body.append(app);

async function getJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Could not fetch data from ${url}`);
    }

    return response.json();
}

async function init() {
    const userData = await getJSON(`${API}/users`);
    const postData = await getJSON(`${API}/posts`);

    users = userData.map(userInfo => new User(userInfo));

    createPostsAndAssignToUsers(postData);

    renderUsers();

    console.log(users);
}


function createPostsAndAssignToUsers(postData) {
    postData.forEach(postInfo => {
        const matchingUser = users.find(user => user.id === postInfo.userId);

        if (matchingUser) {
            const post = new Post(postInfo);
            matchingUser.addPost(post);
        }
    });
}

function renderUsers() {
    app.innerHTML = users.map(user => `
        <section class="user">
            <h2>${user.name}</h2>

            <p>${user.username}</p>

            <p>
                <a href="${user.getMailLink()}">
                    ${user.email}
                </a>
            </p>

            <p>
                <a href="${user.getWebsiteLink()}" target="_blank">
                    ${user.website}
                </a>
            </p>

            <button data-action="toggle-posts" data-user-id="${user.id}">
                Show posts
            </button>

            <div data-posts-for="${user.id}" hidden></div>
        </section>
    `).join("");
}

function togglePosts(userId) {
    const user = users.find(user => user.id === userId);
    const postsBox = app.querySelector(`[data-posts-for="${userId}"]`);

    if (!user || !postsBox) {
        return;
    }

    if (postsBox.hidden) {
        postsBox.innerHTML = renderPosts(user.posts);
        postsBox.hidden = false;
    } else {
        postsBox.hidden = true;
    }
}

function renderPosts(posts) {
    return posts.map(post => `
        <article class="post">
            <h3>${post.title}</h3>
            <p>${post.body}</p>

            <button data-action="load-comments" data-post-id="${post.id}">
                Load comments
            </button>

            <div data-comments-for="${post.id}"></div>
        </article>
    `).join("");
}

function findPostById(postId) {
    for (const user of users) {
        const post = user.posts.find(post => post.id === postId);

        if (post) {
            return post;
        }
    }

    return null;
}

function loadComments(postId) {
    const post = findPostById(postId);
    const commentsBox = app.querySelector(`[data-comments-for="${postId}"]`);

    if (!post || !commentsBox) {
        return;
    }

    if (post.commentsAreLoaded()) {
        renderComments(commentsBox, post.comments);
        return;
    }

    commentsBox.textContent = "Loading comments...";

    getJSON(`${API}/comments?postId=${postId}`)
        .then(comments => {
            post.setComments(comments);
            renderComments(commentsBox, comments);
        })
        .catch(error => {
            console.error(error);
            commentsBox.textContent = "Could not load comments.";
        });
}

function renderComments(commentsBox, comments) {
    commentsBox.innerHTML = comments.map(comment => `
        <section class="comment">
            <h4>${comment.name}</h4>
            <p>${comment.body}</p>
            <a href="mailto:${comment.email}">
                ${comment.email}
            </a>
        </section>
    `).join("");
}

app.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const action = button.dataset.action;

    if (action === "toggle-posts") {
        const userId = Number(button.dataset.userId);
        togglePosts(userId);
    }

    if (action === "load-comments") {
        const postId = Number(button.dataset.postId);
        loadComments(postId);
    }
});

init();