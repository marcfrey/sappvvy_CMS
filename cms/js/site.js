import { readFilePromise, copyHtml } from "./persistenceUtil.js"
import * as elements from "./cmsElements.js"

var dynamicDataFile = "./data.json"
//var dynamicDataFile = "../../content/data/sections.json"
var bricks = []

class Brick {
    constructor(name, type, listedData) {
        this.name = name
        this.changed = false
        this.elementQuery = "#" + name
        this.type = type
        if (this.name == "menu") {
            this.data = getJSONDataFromLocalStorage()[name]
        } else {
            this.data = getJSONDataFromLocalStorage()[type][0] // make list listed data for movelist
            
        }
        if (listedData) {
            this.listedData = listedData
        }

        bricks.push(this)    
    }

    changeData = (data, subsection) => {   /// refactor to changeListData
        this.data = data
        this.changed = true
        
        let dynamicData = getJSONDataFromLocalStorage(dataID)
        if (dynamicData[this.name]) {
            dynamicData[this.name] = data
        } else {
            for (let i = 0; i < dynamicData[this.type].length; i++) {
                if (dynamicData[this.type][i].name == this.name) {
                    switch (this.type) {
                        case "slider":
                            for (let k = 0; k < data.length; k++) {
                                if (dynamicData[this.type][i].gallery[k]) {
                                    dynamicData[this.type][i].gallery[k].img.src = data[k]
                                } else {
                                    dynamicData[this.type][i].gallery.push({img: {src: data[k]}})
                                }
                            }
                            break
                        case "text":
                            console.log(data)
                            if (subsection == "text") {
                                dynamicData[this.type][i].text = data
                            }
                            
                            break

                    }

                }
            }
        }
        setJSONDataFromLocalStorage(dynamicData)

        //console.log(getJSONDataFromLocalStorage(dataID))
    }
}

function buildCMS(data) {
    setJSONDataFromLocalStorage(data)

    for (let element in data) {
        if (element == "menu") {
            elements.createSectionManager("#menu > div", new Brick(element, element), data)
        } else {
            for (let i = 0; i < data[element].length; i++) {
                if (i == 0) {
                    let typeContainer = generateHtml("div", {id: element, class: "closed"})
                    typeContainer.appendChild(generateHtml("h2", {}, element))
                    typeContainer.appendChild(generateHtml("span", {}, "edit content of type " + element))
                    typeContainer.appendChild(generateHtml("button", {class: "add"}, "add new " + element))
                    let toggleButton = generateHtml("button", {class: "toggle"})
                    toggleButton.addEventListener("click", () => {
                        if(typeContainer.classList.contains("closed")) {
                            typeContainer.classList.remove("closed")
                        } else {
                            typeContainer.classList.add("closed")
                        }
                    })
                    typeContainer.appendChild(toggleButton)
                    document.body.appendChild(typeContainer)
                }
                switch(element) {
                    case "slider":
                        elements.createSliderManager(new Brick(data[element][i].name, element, data.slider[i].gallery)) 
                        break
                    case "text":
                        elements.createTextManager(new Brick(data[element][i].name, element, data.text[i]))
                        break
                    case "link":
                        elements.createLinkManager(new Brick(data[element][i].name, element, data.link[i].buttons))
                        break
                    case "map":
                        elements.createMapManager(new Brick(data[element][i].name, element, data.map[i]))
                }

            }
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

// refactor to persistence and rename to localStorageData
var dataID = "dynamicJSONdata"

function getJSONDataFromLocalStorage () {
    return JSON.parse(localStorage.getItem(dataID))
}

function setJSONDataFromLocalStorage (content) {
    localStorage.setItem(dataID, JSON.stringify(content))
}

export { generateHtml, loadContent, getJSONDataFromLocalStorage as getJson, dataID, bricks }

 