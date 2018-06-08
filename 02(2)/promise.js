const fs = require('fs');
const path = require('path');
const program = require('commander');

program
  .version('0.0.1')
  .option('-c, --chaos', 'Chaos folder path')
  .option('-l --clean', 'Clean folder path')
  .parse(process.argv);

let nameCleanFolder;
if(program.chaos && program.clean) {
  const nameChaosFolder = program.args[0];
  nameCleanFolder = program.args[1];
  if(fs.existsSync(nameChaosFolder) && fs.existsSync(nameCleanFolder)) {
    cleanChaos(path.join(__dirname, nameChaosFolder));
  } else {
    console.log('Указан не верный путь');
  }
} else {
  console.log('Введите пути до папок');
}


function cleanChaos(pathFolder) {
  let p = new Promise( (resolve, reject) => {
    // читаем папку. получаем массив элементов files
    fs.readdir(pathFolder, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
  p.then( (files) => {
    new Promise( (resolve, reject) => {
      // проходимся по элементам массива
      files.forEach( (name) => {
        isFile(path.join(pathFolder, name), name);
      })
    })
  })
  .catch( (err) => writeError(err));
}
// Функция, которая определяет что делать с файлом или папкой
function isFile(pathElement, name) {
  return new Promise( (resolve, reject) => {
      fs.stat(pathElement, (err, stats) => {
        if(err) reject(err);
        else resolve(stats);
    })
  }).then( (stats) => {
    if(stats.isFile()) {
      let newFolderPath = path.join(__dirname, nameCleanFolder, name.slice(0, 1).toLowerCase());
      // проверка на наличие такой папки
      if(!fs.existsSync(newFolderPath)) {
        fs.mkdirSync(newFolderPath);
      }
      // копируем файл и удаляем старый файл
      fs.copyFile(pathElement, path.join(newFolderPath, name), (err) => {
          if(err) writeError(err)
          // else fs.unlinkSync(pathElement);
      });
    } else {
      cleanChaos(pathElement);
    }
  }).catch( (err) => writeError(err));
}


function writeError(err) {
  const time = new Date().toISOString()
                      .replace(/T/, ' ')
                      .replace(/\..+/, '');

  fs.appendFile('error file.txt', 
                time + " : " + err.toString() + '\n',
                (err) => {
    if(err) {}
  });
}
console.log("hello");
