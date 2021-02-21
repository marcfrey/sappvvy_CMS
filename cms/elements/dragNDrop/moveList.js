import { initialize, addNewItem, changed, setChanged } from "./dragNDrop.js"

var items

function buildList(brick) {

    items = brick.data

    let input = document.querySelector(brick.elementQuery + " input")
    input.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            let item = input.value
            addNewItem(item)
            
            let data = brick.data
            data.push(item)
            brick.changeData(data)            
        }
        brick.changed = true
    })

    for (let i in brick.data) {
        let item = addNewItem(brick.data[i])
        item.appendChild(removeButton(item, brick))
    }

    initialize()

    let changeSniffer = () => {
        setTimeout(() => {
            if (changed) {
                let data = []
                let sections = document.querySelector(brick.elementQuery + "> ul").children
                for (let i in sections) {
                    if (parseInt(i) || i == "0") {
                        sections[i].appendChild(removeButton(sections[i], brick))
                        data.push(sections[i].innerText)
                    }
                }
                brick.changeData(data)
                setChanged(false)
            }
            changeSniffer()
        }, 2000)
    }
    changeSniffer()
}


let removeButton = (item, brick) => {
    let sectionList = document.querySelector(brick.elementQuery + "> ul")
    let remove

    if (item.getElementsByTagName("div")[0]) {
        remove = item.getElementsByTagName("div")[0]
    } else {
        remove = document.createElement("div")
    }
   
    remove.addEventListener("click", (e) => {
        if (sectionList.contains(item)) {
            let data = brick.data
            data.pop(item.innerText)
            brick.changeData(data)
            items.pop(item.innerText)
            sectionList.removeChild(item)
        }
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