/**
 * loads json files
 **/
function loadFile(callback, file, type) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType(type)
    xobj.open('GET', file, true)
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText)
        } 
        if (xobj.status == "404") {
            callback(xobj.status + " " + xobj.statusText)
        }
    }
    xobj.send(null)
}

/**
 * Returns either the File, or a 404 not found
 */
async function readFilePromise (file, type) {
    return new Promise((resolve, reject) => { 
        loadFile(function(response) {  
            if (type == "text/html") { 
                resolve(response)
            }
            try {
                resolve(JSON.parse(response))
            } catch(e) {
                reject(response)
            }

        }, file, type)
    })  
}

function copyHtml () {

    var ifrm = document.getElementsByTagName("iframe")[0]
    readFilePromise("../content/index.html", "text/html").then((fileContent) => {

        let lines = fileContent.split("\n")
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("link") && !lines[i].includes('href=".')) {
                let oldLine = lines[i]
                let newLine = lines[i].replace('href="', 'href="../content/')
                fileContent = fileContent.replace(oldLine.trim(), newLine.trim())
            }
        }

        fileContent = fileContent.replaceAll('./factory', '../content/factory')
        fileContent = fileContent.replaceAll('data = "data/sections.json"', 'data = "./data.json"')


        ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
        ifrm.document.open();
        ifrm.document.write(fileContent);
        ifrm.document.close();
    })
    
}


export { readFilePromise, copyHtml }