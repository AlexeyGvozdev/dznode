const fs = require('fs');
const path = require('path');

const nameChaosFolder = "/chaos/";
const nameCleanFolder = "/clean/";

function cleanChaos(pathFolder) {
    // читаем папку. получаем массив элементов files 
	fs.readdir(pathFolder, (err, files) => {
		if(err) {
			console.log(err.message)
		} else {
            // проходимся по элементам массива
            files.forEach( (name) => {
                // определяем путь к элементу папки
                var pathElement = path.join(pathFolder + "/" + name);
                fs.stat(pathElement, (err, stats) => {
                    if(err) { 
                        console.log( err);
                    } else {
                    
                        // проверка статуса элемента(папка или файл)
                        if(stats.isFile()) {
                            // создаем путь к папке куда будем копировать файл
                            let newFolderPath = path.join(__dirname + '/' + nameCleanFolder + '/' + name.slice(0, 1).toLowerCase() + '/');
                            // проверка на наличие такой папки
                            let exists = fs.existsSync(newFolderPath);
                            if(!exists) {
                                    fs.mkdirSync(newFolderPath);
                            }
                            // копируем файл и удаляем старый файл
                            fs.copyFile(pathElement, path.join(newFolderPath + '/' + name), (err) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    fs.unlinkSync(pathElement);
                                }
                            });
                        } else {
                            cleanChaos(pathElement);
                        }
                    }
                })
            })
		}
	})
}

cleanChaos(path.join(__dirname + nameChaosFolder));
// fs.rmdirSync(path.join(__dirname + nameChaosFolder));
console.log("hello");
