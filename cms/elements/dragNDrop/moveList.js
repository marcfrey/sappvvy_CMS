import { addNewItem  } from "./dragNDrop.js"

let lists = new Map()

function buildList(brick, query) {
    
    let listData = (brick.listedData) ? brick.listedData : brick.data
    lists.set(query, brick)    

    var btn = document.querySelector(query + " .add")
    btn.addEventListener('click', () => {
        addNewItem(btn.value, query)
        listData.push(btn.value)
        brick.updateData(listData) 
    })

    let input = document.querySelector(query + " input.listInput")
    input.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            addNewItem(input.value, query)
            listData.push(input.value)
            brick.updateData(listData)     
        }
    })

    for (let i in listData) {
        let item = addNewItem(listData[i], query)
        item.appendChild(removeButton(item, brick, query))
    }   
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
            let data = (lists.get(query).listedData) ? lists.get(query).listedData : lists.get(query).data
            data.pop(item.innerText)
            brick.updateData(data)
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

export { buildList, removeButton, lists }