import * as site from "../../js/site.js"

let selectList
let input
let button
let dropDown

let updateList = () => {
    let list = selectList.getElementsByTagName("li")
    let inputValue = input.value.toLowerCase()
    let k = 0
    for (let i = 0; i < list.length; i++) {
        if (list[i].innerText.toLowerCase().includes(inputValue)) {
            list[i].style.display = "block"
        } else {
            list[i].style.display = "none"
            k++
            
        }
    }
    if (k == list.length) {
        dropDown.classList.add("noMatch")
        button.disabled = true
    } else {
        dropDown.classList.remove("noMatch")
        button.disabled = false
    }
}


function generateDropDown(selection) {
    selectList = site.generateHtml("ul")
    dropDown = site.generateHtml("div", {class: "dropDown"}, selectList)
    button = site.generateHtml("button", {class: "add"}, "add")
    input = site.generateHtml("input", {class:"", placeholder: "select"})
    input.addEventListener("input", updateList)
    selectList.appendChild(input)
    for (let i in selection) {
        let item = site.generateHtml("li", {}, selection[i])
        item.addEventListener("click", () => {
            input.value = item.innerText
            updateList()
        })
        selectList.appendChild(item)
    }
    dropDown.appendChild(button)
    return dropDown
}

export default generateDropDown