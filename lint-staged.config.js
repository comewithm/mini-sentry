"use strict";
module.exports = {
    "{src,server}/**/!(*.min).js": [
        "prettier --write",
        "eslint --fix"
    ],
    "{src,server}/**/*.ts": [
        "prettier --write",
        "eslint --fix"
    ]
}