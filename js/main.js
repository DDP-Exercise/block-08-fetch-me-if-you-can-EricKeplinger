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

init();