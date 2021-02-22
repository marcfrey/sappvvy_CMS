import { addNewItem, changed, setChanged } from "./dragNDrop.js"

var items = []
let listData = []

function buildList(brick) {

    items = brick.data
    listData = (brick.listedData) ? brick.listedData : brick.data

    var btn = document.querySelector(brick.elementQuery + " .add");
    btn.addEventListener('click', () => {
        addNewItem(btn.value, brick.elementQuery)
        let data = listData
        data.push(btn.value)
        brick.changeData(data) 
    })

    let input = document.querySelector(brick.elementQuery + " input")

    input.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            // check for match

            let item = input.value
            addNewItem(item, brick.elementQuery)
            
            let data = listData
            data.push(item)
            brick.changeData(data)            
        }
        brick.changed = true
    })

    for (let i in listData) {
        let item = addNewItem(listData[i], brick.elementQuery)
        item.appendChild(removeButton(item, brick))
    }

    
    

    let changeSniffer = () => {
        setTimeout(() => {
            if (changed) {
                let data = []
                let sections = document.querySelector(brick.elementQuery + " > ul").children
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
            let data = listData
            data.pop(item.innerText)
            brick.changeData(data)
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