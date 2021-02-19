function loadHtml(callback, readfile) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("text/html")
    xobj.open('GET', readfile, true)
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
 * move to json reader
 */
async function readFilePromise (file) {
    return new Promise((resolve, reject) => { 
        loadHtml(function(response) {  
            try {
                resolve(response)
            } catch(e) {
                reject(response)
            }

        }, file)
    })  
}

function copyHtml () {

    var ifrm = document.getElementsByTagName("iframe")[0]
    readFilePromise("../content/index.html").then((fileContent) => {

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


export default copyHtml

