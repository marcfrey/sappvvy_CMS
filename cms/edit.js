import readFilePromise from "./JSONReader.js"
import buildList from "./moveList.js"

/**
 * - Prüfen ob Typ definiert
 */
function buildCMS(data) {
    // sections
    buildList(data.menu, "#menu")

    for (let i in data) {
        if (data[i][0].type) {
            let sectionTemplate = document.createElement("div")
            sectionTemplate.setAttribute("id", i)
            console.log(data[i][0].type)
            let title = document.createElement("h2")
            title.innerHTML = "template: " + i
            sectionTemplate.appendChild(title)

            document.body.appendChild(sectionTemplate)

        }
        

    }
}

function loadContent() {
   return readFilePromise("../content/data/sections.json").then((data => buildCMS(data)))
}


// function toJSON()

export { loadContent }

 