import { initialize, addNewItem, changed, setChanged } from "./dragNDrop.js"

/**
 * - Prüfen ob Typ definiert
 */
function buildList(data, elementQuery) {

    let input = document.querySelector(elementQuery + " input")
    input.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            addNewItem(input.value)
        }
    })

    for (let i in data) {
        let item = addNewItem((parseInt(i)+1) + ": " + data[i])
        item.appendChild(removeButton(item, elementQuery))
    }

    initialize()

    let changeSniffer = () => {
        setTimeout(() => {
            if (changed) {
                let sections = document.querySelector(elementQuery + " ul").children
                for (let i in sections) {
                    if (parseInt(i) || i == "0") {
                        sections[i].appendChild(removeButton(sections[i], elementQuery))
                    }
                }
                setChanged(false)
            }
            changeSniffer()
        }, 2000)
    }
    changeSniffer()
}


let removeButton = (item, elementQuery) => {
    let sectionList = document.querySelector(elementQuery + " ul")
    let remove

    if (item.getElementsByTagName("div")[0]) {
        remove = item.getElementsByTagName("div")[0]
    } else {
        remove = document.createElement("div")
    }

    remove.addEventListener("click", (e) => {
        sectionList.removeChild(item)
    })
    remove.addEventListener("mouseover", () => {
        item.classList.add("toRemove")
    })
    remove.addEventListener("mouseout", () => {
        item.classList.remove("toRemove")
    })
    return remove
}

export default buildList