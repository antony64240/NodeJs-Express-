const fs = require('fs');
const __Config =require('../config.json');


async function getFilesList(email, url){
    return new Promise((acc,rej)=>{
        let arrayList = [];
        let dir = `${__Config.Folder.path}${email}/${url}`;
        fs.readdir(dir, (error, fileNames) => {
            if (error) 
                rej(error);
            let ext = "";
            fileNames.forEach(filename => {
                let name = path.parse(filename).name;
                if (path.parse(filename).ext == "") {
                    ext = "dossier";
                } else {
                    ext = path.parse(filename).ext;
                }
                let length = filename.length;
                file = new File(name, ext, length);
                arrayList.push(file);
            });
            acc({list: arrayList, status: "success"});
        });
    })
}

module.exports={
    getFilesList
}