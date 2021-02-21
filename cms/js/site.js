import { readFilePromise, copyHtml } from "./persistenceUtil.js"
import buildList from "../elements/dragNDrop/moveList.js"
import generateDropDown from "../elements/dropDown/dropDown.js"

var dynamicDataFile = "./data.json"
var dataID = "dynamicJSONdata"
var bricks = []



class Brick {
    constructor(name) {
        this.name = name
        this.changed = false
        this.elementQuery = "#" + name
        this.data = getJson()[name]
        bricks.push(this)
        buildList(this)
    }

    changeData = (data) => {
        this.data = data
        this.changed = true
                
        let dynamicData = getJson(dataID)
        dynamicData[this.name] = data
        localStorage.setItem(dataID, JSON.stringify(dynamicData))
    }
}

/**
 * - Prüfen ob Typ definiert
 */
function buildCMS(data) {
    
    let menu = document.querySelector("#menu > div")

    var elementTypes = Object.keys(data)
    elementTypes.shift()
    menu.appendChild(generateDropDown(elementTypes))

    localStorage.setItem(dataID, JSON.stringify(data))

    new Brick("menu")


    // sections
    for (let i in data) {
        if (data[i][0].type) {
            let sectionTemplate = document.createElement("div")
            sectionTemplate.setAttribute("id", i)
            let title = document.createElement("h2")
            title.innerHTML = "template: " + i
            sectionTemplate.appendChild(title)

            document.body.appendChild(sectionTemplate)

        }
        

    }
}

function generateHtml (type, attrs, ...children) { 
    let node = document.createElement(type) 
    for (let a in attrs) { 
        node.setAttribute(a, attrs[a]) 
    } 
    for (let child of children) { 
        if (typeof child != "string") node.appendChild(child) 
        else node.appendChild(document.createTextNode(child)) 
    } 
    return node 
} 

function loadContent() {
   return readFilePromise(dynamicDataFile, "application/json").then((data => buildCMS(data)))
}

function getJson () {
    return JSON.parse(localStorage.getItem(dataID))
}

export { generateHtml, loadContent, getJson, dataID, bricks }

 