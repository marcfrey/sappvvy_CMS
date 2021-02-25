import { addNewItem, changedList, resetChanged } from "./dragNDrop.js"

var items = []
let listData = [] // als map mit query als key
let lists = new Map()

function buildList(brick, query) {
    
    items = brick.data
    listData = (brick.listedData) ? brick.listedData : brick.data
    lists.set(query, brick)    

    var btn = document.querySelector(query + " .add");

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
            brick.changed = true          
        }
    })

    for (let i in listData) {
        let item = addNewItem(listData[i], query)
        item.appendChild(removeButton(item, brick, query))
    }

    let changeSniffer = () => {
        setTimeout(() => {
            if (changedList) {
                let data = []
                for (var [key, value] of lists) {
                    if (changedList == value.name) {
                        switch (value.type) {
                            case "menu" || "slider":
                                let items = document.querySelectorAll(key + " > ul li")
                                for (let i in items) {
                                    if (parseInt(i) || i == "0") {
                                        console.log(brick)
                                        items[i].appendChild(removeButton(items[i], value, key))
                                        data.push(items[i].innerText)
                                    }
                                }
                                value.changeData(data)
                                break

                            case "text":
                                let texts = document.querySelectorAll(key + " > ul li")
                                for (let i in texts) {
                                    if (parseInt(i) || i == "0") {
                                        texts[i].appendChild(removeButton(texts[i], value, key))
                                        data.push(texts[i].innerText)
                                    }
                                }
                                value.changeData(data, "text")
                                break
                            
                        } 
                        resetChanged()
                    }
                }
            } else {
                // check for each
            }
            changeSniffer()
        }, 10)
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
            console.log(query)
            console.log(lists)
            console.log(lists.get(query))
            let data = (lists.get(query).listedData) ? lists.get(query).listedData : lists.get(query).data
            data.pop(item.innerText)
            console.log(data)
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