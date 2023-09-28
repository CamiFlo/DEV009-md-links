const fs = require('node:fs');
const path = require('node:path');
const { searchMdFiles, readdingFile, searchLinks, validateUrl, readdingFileMdDirectory } = require('./data.js');
const readdirSync = require('node:fs');
//const files = readdirSync('./docs')
//console.log(files);

function mdLinks(filePath, validate = false) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(filePath);
      }
      if (fs.statSync(filePath).isDirectory()) { //verifica si la ruta filePath corresponde a un directorio
        // Si filePath es un directorio, verifica si contiene archivos md
        const filesDirectory = fs.readdirSync(filePath);
        const mdFilesDirectory = filesDirectory.filter((file) => path.extname(file) === '.md');

        if (mdFilesDirectory.length === 0) {
          reject('El directorio no contiene archivos Markdown');
          return;
        }

        const linksInDirectory = [];

        // Crear un arreglo de promesas
        const promises = mdFilesDirectory.map((fileMd) => {
          const mdFilePath = path.join(filePath, fileMd);

          // Leer el contenido del archivo Markdown
          return readdingFileMdDirectory(mdFilePath)
            .then((fileData) => {
              const links = searchLinks(fileData, mdFilePath);

              if (validate) {
                // Si validate es true, validar los enlaces y resolver con los resultados de validación
                return validateUrl(links);
              } else {
                // Si validate es false,  resuelve con los enlaces con 3 propiedades
                return links;
              }
            })
            .then((result) => {
              linksInDirectory.push(result);
            });
        });

        // Esperar a que todas las promesas se resuelvan
        Promise.all(promises)
          .then(() => {
            // En este punto, todas las promesas se han resuelto y los resultados se han agregado a linksInDirectory
            console.log(linksInDirectory);
          })
          .catch((error) => {
            console.error(error);
          });

      } else {
        if (!searchMdFiles(filePath)) {
          reject('El archivo no es Markdown');
          return;
        }
        readdingFile(filePath)
          .then((fileData) => {
            const links = searchLinks(fileData, filePath);
            if (links.length > 0) {
              if (validate) {
                resolve(validateUrl(links));
              } else {
                resolve(links);
              }
            } else {
              reject('No hay links en el archivo');
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    } else {
      reject('La ruta no existe');
    }
  });
}


/* mdLinks('./docs/archivos.md')
   .then((resolve) => {
      console.log(resolve);
    })
    .catch((reject) => {
      console.log(reject);
    })*/

module.exports = {
  mdLinks
};