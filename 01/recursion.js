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
  // читаем папку. получаем массив элементов files 
  fs.readdir(pathFolder, (err, files) => {
    if(err) {
      writeError(err)
    } else {
      // проходимся по элементам массива
      files.forEach( (name) => {
        // определяем путь к элементу папки
        var pathElement = path.join(pathFolder, name);
        fs.stat(pathElement, (err, stats) => {
          if(err) { 
            writeError(err);
          } else {
            // проверка статуса элемента(папка или файл)
            if(stats.isFile()) {
                // создаем путь к папке куда будем копировать файл
                let newFolderPath = path.join(__dirname, nameCleanFolder, name.slice(0, 1).toLowerCase());
                
                // проверка на наличие такой папки
                if(!fs.existsSync(newFolderPath)) {
                        fs.mkdirSync(newFolderPath);
                }
                // копируем файл и удаляем старый файл
                fs.copyFile(pathElement, path.join(newFolderPath, name), (err) => {
                    if(err) {
                      writeError(err);
                    } else {
                      fs.unlinkSync(pathElement);
                    }
                });
            } else {
                // если выбранный элемент - папка, 
                // то делаем рекурсию передовая в аргументы полное имя папки 
                cleanChaos(pathElement);
            }
          }
        })
      })
		}
	})
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
