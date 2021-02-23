import { addNewItem, changed, setChanged } from "./dragNDrop.js"

var items = []
let listData = []

function buildList(brick, query) {
    
    items = brick.data
    listData = (brick.listedData) ? brick.listedData : brick.data

    var btn = document.querySelector(query + " .add");
    console.log(query)

    btn.addEventListener('click', () => {
        addNewItem(btn.value, query)
        let data = listData
        data.push(btn.value)
        brick.changeData(data) 
    })

    let input = document.querySelector(query + " input.listInput")

    input.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            let item = input.value
            addNewItem(item, query)
            
            let data = listData
            data.push(item)
            brick.changeData(data)            
        }
        brick.changed = true
    })

    for (let i in listData) {
        let item = addNewItem(listData[i], query)
        item.appendChild(removeButton(item, brick, query))
    }

    let changeSniffer = () => {
        setTimeout(() => {
            if (changed) {
                let data = []
                let sections = document.querySelector(query + " > ul").children
                for (let i in sections) {
                    if (parseInt(i) || i == "0") {
                        sections[i].appendChild(removeButton(sections[i], brick, query))
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


let removeButton = (item, brick, query) => {
    let sectionList = document.querySelector(query + "> ul")
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