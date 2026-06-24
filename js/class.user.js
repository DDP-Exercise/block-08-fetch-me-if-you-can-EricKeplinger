"use strict";

/*******************************************************
 *  Users
 *
 *  See: https://jsonplaceholder.typicode.com/users
 *
 *  Your users should have:
 *      -id
 *      -name
 *      -username
 *      -email
 *      -website
 *
 *  You can skip address, phone and company.
 *
 *  users should also have posts[] (see main.js).
 *
 *  When printing a user, don't forget to make
 *      - href="mailto:.." for the email and
 *      - href=".." target="_blank" for the website.
 *  *******************************************************/

export default class User {
    constructor(users) {
        this.id = users.id;
        this.name = users.name;
        this.username = users.username;
        this.email = users.email;
        this.website = users.website;
        this.posts = [];
    }

    addPost(post) {
        this.posts.push(post);
    }

    getMailLink() {
        return `mailto:${this.email}`;
    }

    getWebsiteLink() {
        if (this.website.startsWith("http")) {
            return this.website;
        }

        return `https://${this.website}`;
    }
}