/**
 * loads json files
 **/
function loadJSON(callback, file) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json")
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
async function readFilePromise (file) {
    return new Promise((resolve, reject) => { 
        loadJSON(function(response) {  
            try {
                resolve(JSON.parse(response))
            } catch(e) {
                reject(response)
            }

        }, file)
    })  
}

export default readFilePromise