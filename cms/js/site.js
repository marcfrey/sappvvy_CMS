import { readFilePromise, copyHtml } from "./persistenceUtil.js"
import buildList from "../elements/dragNDrop/moveList.js"
import generateDropDown from "../elements/dropDown/dropDown.js"

var dynamicDataFile = "./data.json"
var bricks = []

class Brick {
    constructor(name, type, listedData) {
        this.name = name
        this.changed = false
        this.elementQuery = "#" + name
        if (this.name == "menu") {
            this.data = getJSONDataFromLocalStorage()[name]
        } else {
            this.data = getJSONDataFromLocalStorage()[type][0] // make list listed data for movelist
            this.type = type
        }
        if (listedData) {
            this.listedData = listedData
        }

        bricks.push(this)    
    }

    changeData = (data) => {
        this.data = data
        this.changed = true
                
        let dynamicData = getJSONDataFromLocalStorage(dataID)
        dynamicData[this.name] = data
        setJSONDataFromLocalStorage(dynamicData)
    }
}

function createSliderManager(brick) {
    let sliderManager = generateHtml("div", {class: "slider", id: brick.name})
    let headings = generateHtml("div", {class: "heading"})
    headings.appendChild(generateHtml("h2", {}, brick.name))
    headings.appendChild(generateHtml("span", {}, "type: slider"))
    headings.appendChild(getInputWithDescription("bigger headline", brick.data.h1))
    headings.appendChild(getInputWithDescription("smaller headline", brick.data.h2))
    

    sliderManager.appendChild(headings)

    let bottom = generateHtml("ul", {}, generateHtml("input", {}, generateHtml("button", {class: "add"})))
    sliderManager.appendChild(bottom)

    document.body.appendChild(sliderManager)

    console.log(brick.listedData)
    // jeweils src auslesen: mit forEach

    let data = []
    brick.listedData.forEach((entry) => data.push(entry.img.src))
    brick.listedData = data
    buildList(brick) 
}

let getInputWithDescription = (description, content) => {
    let describedInput = generateHtml("div", {class: "describedInput"})
    describedInput.appendChild(generateHtml("span", {}, description))

    let input = generateHtml("input", {placeholder: "enter a headline"})
    input.value = content
    describedInput.appendChild(input)

    return describedInput
}

function buildCMS(data) {
    setJSONDataFromLocalStorage(data)

    let menu = document.querySelector("#menu > div")
    let elementTypes = []

    for (let type in data) {
        data[type].forEach((obj) => {
            if (obj.name) {
                elementTypes.push(obj.name)
            }
        })
    }
    menu.appendChild(generateDropDown(elementTypes))

    buildList(new Brick("menu", "menu"))


    createSliderManager(new Brick("Start", "slider", data.slider[0].gallery))



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

 