#!/usr/bin/env node

const { mdLinks} = require ('./index.js');

mdLinks('C:\\Users\\Laboratoria\\DataLovers', true)
.then((links) => {
    console.log(links);
})
.catch((error) => {
    console.error(error);
});

//'C:\\Users\\Laboratoria\\DataLovers'
