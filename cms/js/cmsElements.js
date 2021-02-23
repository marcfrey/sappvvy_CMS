import * as site from "./site.js"
import generateDropDown from "../elements/dropDown/dropDown.js"
import buildList from "../elements/dragNDrop/moveList.js"

function createSectionManager(query, brick, data) {
    
    let menu = document.querySelector(query)
    let elementTypes = []

    for (let type in data) {
        data[type].forEach((obj) => {
            if (obj.name) {
                elementTypes.push(obj.name)
            }
        })
    }

    let dropDown = generateDropDown(elementTypes)
    dropDown.querySelector("input").setAttribute("class", "listInput")
    menu.appendChild(dropDown)
    buildList(brick, brick.elementQuery)
}

function createSliderManager(brick) {
    let sliderManager = site.generateHtml("div", {class: "content", id: brick.name})
    let headings = site.generateHtml("div", {class: "heading"})
    headings.appendChild(site.generateHtml("h2", {}, brick.name))
    headings.appendChild(getInputWithDescription("bigger headline", brick.data.h1))
    headings.appendChild(getInputWithDescription("smaller headline", brick.data.h2))
    

    sliderManager.appendChild(headings)

    let inputField = site.generateHtml("div", {class: "inputField"})
    inputField.appendChild(site.generateHtml("input", {class: "listInput", placeholder:"enter new image source"}))
    inputField.appendChild(site.generateHtml("button", {class: "add"}, "add"))
    
    sliderManager.appendChild(site.generateHtml("ul", {}, inputField))

    document.getElementById("slider").appendChild(sliderManager)

    let data = []
    brick.listedData.forEach((entry) => data.push(entry.img.src))
    brick.listedData = data
    buildList(brick, brick.elementQuery) 
}

function createTextManager(brick) {
    let textManager = site.generateHtml("div", {class: "content", id: brick.name})

    textManager.appendChild(site.generateHtml("h2", {}, brick.name))
    
    textManager.appendChild(site.generateHtml("h3", {}, "edit text"))
    textManager.appendChild(getInputWithButton("enter new text", "text"))

    textManager.appendChild(site.generateHtml("h3", {}, "edit images"))
    textManager.appendChild(getInputWithButton("enter new image source", "img"))
    document.getElementById("text").appendChild(textManager)

    brick.listedData = brick.data.text
    buildList(brick, brick.elementQuery + " .text ") 

    let data = []
    brick.data.gallery.forEach((entry) => data.push(entry.src))
    brick.listedData = data
    buildList(brick, brick.elementQuery + " .img ") 
}

function createLinkManager(brick) {
    let linkManager = site.generateHtml("div", {class: "content", id: brick.name})

}

let getInputWithButton = (placeholder, className) => {
    let inputFieldImg = site.generateHtml("div", {class: "inputField"})
    inputFieldImg.appendChild(site.generateHtml("input", {class: "listInput", placeholder: placeholder}))
    inputFieldImg.appendChild(site.generateHtml("button", {class: "add"}, "add"))
    return site.generateHtml("div", {class: className}, site.generateHtml("ul", {}, inputFieldImg))
}

let getInputWithDescription = (description, content) => {
    let describedInput = site.generateHtml("div", {class: "describedInput"})
    describedInput.appendChild(site.generateHtml("span", {}, description))
    let input = site.generateHtml("input", {placeholder: "enter a headline"})
    input.value = content
    describedInput.appendChild(input)
    return describedInput
}

export { createSectionManager, createSliderManager, createTextManager }
