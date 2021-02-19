/***
 * T O D O
 *  menu hier erstellen
 * 
 */

let menu 
let container = []

/**
 * returns array with coloring percent for each menu item 
 **/
function showVisibile() {
    let visibleFrom = window.pageYOffset
    let visibleTo = window.pageYOffset + window.innerHeight

    for (let i in container) {

        let activeItem = document.getElementsByTagName("a")[i]

        if (container[i][0] >= visibleFrom && container[i][1] <= visibleTo) {
            activeItem.setAttribute("class", "active")
        } else {
            if ((container[i][1] < visibleTo && container[i][1] > visibleFrom)
                || (container[i][0] < visibleTo && container[i][0] > visibleFrom)) {
                activeItem.setAttribute("class", "semiActive")
            } else {
                activeItem.classList.remove("active")
                activeItem.classList.remove("semiActive")
            }
        }
    }
}

function initialize() {
    
    menu = document.querySelector("nav div")
    for (let i in menu.children) {
        // '0' is not accepted as a number
        if (parseInt(i) || i == 0) { 
            let id = menu.children[i].href
            id = id.substring(id.indexOf("#") + 1)
            let from = document.getElementById(id).offsetTop
            let height = document.getElementById(id).offsetHeight
            container.push(new Array(from, from + height))

            menu.children[i].addEventListener("click", function(e) {
                // if window is already at correct position, another scroll is prevented
                if (e.target.classList.contains("active")) {
                    let store = window.pageYOffset
                    e.preventDefault()
                    window.scrollTo(0, store)
                }

                // on scrolling to an anchor-tag, the position deviates (+/- 1px) sometimes
                setTimeout(() => {
                    window.scrollTo(0, document.getElementById(e.target.hash.substring(1)).offsetTop)
                }, 500)
            })
        }
    }
}



export {initialize, showVisibile as getVisibilityTable}