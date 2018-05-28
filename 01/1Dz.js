const fs = require('fs');
const path = require('path');

const nameChaosFolder = "/chaos/";
const nameCleanFolder = "/clean/";

function cleanChaos(pathFolder) {
	fs.readdir(pathFolder, (err, files) => {
		if(err) {
			console.log(err.message)
		} else {
			if(files.length === 0) {
				console.log("000", pathFolder);
				
				fs.rmdir(pathFolder, (err) => {
					if(err) {
						console.log(err);
					}
				});
			} else {
				files.forEach( (name) => {
					
					var pathElement = path.join(pathFolder + "/" + name);
						
					fs.stat(pathElement, (err, stats) => {
						if(err) return err;
						if(stats.isFile()) {
							// console.log(name.slice(0,1), newPath);
							// var tempPath = path.join(__dirname + '/' + nameChaosFolder + "/../../");
							var newFolderPath = path.join(__dirname + '/' + nameCleanFolder + '/' + name.slice(0, 1) + '/');
							fs.exists(newFolderPath, (exists) => {
								// console.log(exists);
								if(!exists) {
										// console.log(exists);
										fs.mkdirSync(newFolderPath);
								}
								fs.copyFile(pathElement, path.join(newFolderPath + '/' + name), (err) => {
									if(err) {
										console.log(err);
									} else {
										fs.unlinkSync(pathElement);
									}
								});
								// var rs = fs.createReadStream(pathElement);
								// var os = fs.createWriteStream(path.join(newFolderPath + '/' + name));
								// // console.log(name);
										
								
								// rs.pipe(os);
								// rs.on('end',function() {
								// 	fs.unlinkSync(pathElement);
								// 	// console.log(pathFolder);
								// 	fs.readdir(pathFolder, (err, name) => {
								// 		if(err) {
								// 			console.log(err);
								// 		} else {
								// 			if(name.length === 0) {
								// 				fs.rmdir(pathFolder, (err) => {
								// 					if(err) console.log(err);
								// 				})
								// 			}
								// 		}
								// 	})
									
								// });
								// console.log(newPath);
										
							}); 	
						} else {
							cleanChaos(pathElement);
						}
					})	
				})				
			}
		}
	})	
}

cleanChaos(path.join(__dirname + nameChaosFolder));
// fs.rmdirSync(path.join(__dirname + nameChaosFolder));
console.log("hello");
