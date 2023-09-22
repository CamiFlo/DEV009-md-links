const path = require('path');
const fs = require('fs');
const { promiseHooks } = require('v8');
const axios = require('axios');


// funcion para encontrar solo archivos Markdown
function searchMdFiles(filePath) {
  const extension = path.extname(filePath);
  // Lista de extensiones Markdown permitidas
  const mdExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
  //console.log(mdExtensions.includes(extension));
  return mdExtensions.includes(extension);
}

// función para leer archivo
function readdingFile(filePath) {
  return new Promise((resolve, reject) => {

    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        reject('Ocurrió un error al leer el archivo:', error);
      } else {
        resolve(data);
      }
    });
  })
}

//función que busca links en archivo y encuentra href, text y file
function searchLinks(data, filePath) {
  const regExp = RegExp(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g); //guarda url del link
  const links = [];
  if (regExp.test(data)) {
    const foundLinks = data.match(regExp)
    console.log(foundLinks, 'foundlinks');
    foundLinks.forEach(link => {
      const linkParts = link.slice(1, -1).split('](');
      const text = linkParts[0]; // texto descriptivo dentro de []
      const href = linkParts[1]; // URL dentro de ()

      console.log(link);
      links.push({
        text: text,
        href: href,
        file: filePath,
        status:'response.status',
        statusText:'response.statusText'
      })
    });
  } else {
    console.log('no hay links en este archivo');
  }

  return links;
}

const validateUrl = (url) => {
  return new Promise((resolve, reject) =>{
    axios.get(url)
    .then((response) =>{
      console.log(response)
      resolve(response.status)
    })
    .catch((error) => {
      reject(error.response.status)
    })

  }
  )

}

/*const validateUrl = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          console.log('URL válida');
          resolve(response.status);
        } else {
          console.log('URL no válida');
          reject(response.status);
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
        reject(error);
      });
  });
};*/

module.exports = {
  searchMdFiles,
  readdingFile,
  searchLinks,
  validateUrl }