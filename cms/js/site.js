import * as persistence from "./persistenceUtil.js"
import * as elements from "./cmsElements.js"
import * as brickClasses from "./brick.js"
import * as dragNDrop from "../elements/dragNDrop/dragNDrop.js"
import { removeButton, lists } from "../elements/dragNDrop/moveList.js"

var dynamicDataFile = "./data.json"
//var dynamicDataFile = "../../content/data/sections.json"
var bricks = []

class Brick {
    constructor(name, type, listedData) {
        this.name = name
        this.changed = null
        this.elementQuery = "#" + name
        this.type = type
        if (this.name == "menu") {
            this.data = persistence.getLocalJSON()[name]
        } else {
            this.data = persistence.getLocalJSON()[type][0] // make list listed data for movelist
            
        }
        if (listedData) {
            this.listedData = listedData
        }

        bricks.push(this)    
    }

    updateData = (data, subsection) => { 
        this.data = data
        this.changed = "listChange"
        
        let dynamicData = persistence.getLocalJSON()
        if (dynamicData[this.name]) {
            dynamicData[this.name] = data
        } else {
            let i = this.getIndexOfBrick()
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
                    if (subsection == "text") {
                        dynamicData[this.type][i].text = data
                    } 
                    if (subsection == "image") {
                        // implement
                    }
                    break
            }
                    
        }
        persistence.setLocalJSON(dynamicData)
    }

    newInput = (jsonQuery, text) => {
        let dynamicData = persistence.getLocalJSON()
        dynamicData[this.type][this.getIndexOfBrick()][jsonQuery] = text
        persistence.setLocalJSON(dynamicData)
    }

    getIndexOfBrick = () => {
        let dynamicData = persistence.getLocalJSON()
        for (let i = 0; i < dynamicData[this.type].length; i++) {
            if (dynamicData[this.type][i].name == this.name) return i
        }
        return -1
    }
}

function buildCMS(data) {
    persistence.setLocalJSON(data)

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
                        new brickClasses.Slider(data[element][i].name, element, data.slider[i].gallery)
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

function updateIframeOnChange() {
    bricks.forEach((brick) => {
        document.querySelectorAll(brick.elementQuery + " .describedInput input").forEach((entry) => {
            entry.addEventListener("input", (e) => {
                brick.changed = e.target.classList[0]
                brick.newInput(e.target.classList[0], e.target.value)
            })
        })
    })

    let listChangeSniffer = () => {
        setTimeout(() => {
            if (dragNDrop.changedList) {
                let data = []
                for (var [key, value] of lists) {
                    if (dragNDrop.changedList == value.name) {
                        switch (value.type) {
                            case "menu" || "slider":
                                let items = document.querySelectorAll(key + " > ul li")
                                for (let i in items) {
                                    if (parseInt(i) || i == "0") {
                                        items[i].appendChild(removeButton(items[i], value, key))
                                        data.push(items[i].innerText)
                                    }
                                }
                                value.updateData(data)
                                break

                            case "text":
                                let texts = document.querySelectorAll(key + " > ul li")
                                for (let i in texts) {
                                    if (parseInt(i) || i == "0") {
                                        texts[i].appendChild(removeButton(texts[i], value, key))
                                        data.push(texts[i].innerText)
                                    }
                                }
                                value.updateData(data, "text")
                                break
                        } 
                        dragNDrop.resetChanged()
                    }
                }
            }   
            listChangeSniffer()
        }, 10)
    }
    listChangeSniffer()
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
    return persistence.readFilePromise(dynamicDataFile, "application/json").then((data) => {
       buildCMS(data)
       updateIframeOnChange()
    })
}

export { generateHtml, loadContent, bricks }

 