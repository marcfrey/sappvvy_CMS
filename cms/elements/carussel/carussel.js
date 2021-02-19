/**
 * IMAGE CARUSSEL
 *
 * Provides a looping mode and a left-right navigation.
 *
 * @author   Marc Frey
 * @version  0.1
 * @date     08.02.2021
 * 
 * 0.1 - finished basic implementation
 *
 * Usage:
 * - requires container(s) with class "slider"
 * - sliders need to be initialized, using initialize() once! 
 * - the images have to be the direct child
 * - the looping-button is a child
 *
 **/

class Slider {
    images = []
    loopTime = 2000
    loop = false
    current = 0

    constructor(name, obj) {
        this.name = name;
        this.length = obj.getAttribute("data-length")
               
        for (let i = 0; i < this.length; i++) {
            this.images.push(document.getElementById(name).getElementsByTagName("img")[i])
        }
    }

    /**
     * recursive function
     * while looping is activated changes image
     */
    slide = (first = true) => {
        let button = document.getElementById(this.name).getElementsByClassName("toggle")[0]

        if (!this.loop) {
            document.getElementById(this.name).removeAttribute("class", "looping")
            document.getElementById(this.name).setAttribute("class", "slider")
            button.innerHTML = "loop"
        } else {
            document.getElementById(this.name).setAttribute("class", "slider looping")
            button.innerHTML = "stop"
            let timeout = (first) ? 0 : this.loopTime
            setTimeout(() => {
                if (!this.loop) {
                    return
                }
                let next = this.getNext(this.current)
                this.changeVisibility(next, this.current)
                this.current = next
                this.slide(false)
            }, timeout)
        }
    }

    changeVisibility = (show, hide) => {
        this.images[show].removeAttribute("class", "invisible")
        this.images[hide].setAttribute("class", "invisible")
    }

    getPrev = (index) => index = (index == 0) ? this.length - 1 : index - 1
    getNext = (index) => index = (index == this.length - 1) ? 0 : index + 1
}

let carussels = []

const getSlider = (id) => {
    for (let i in carussels) {
        if (carussels[i].name == id) {
            return carussels[i]
        } 
    }
}

const toggleLoop = (carussel) => {
    let slider = getSlider(carussel.id)
    slider.loop = !slider.loop;
    slider.slide(true);
}

const right = (carussel) => {
    let slider = getSlider(carussel.id)
    let next = slider.getNext(slider.current)
    slider.changeVisibility(next, slider.current);
    slider.current = next;
}

const left = (carussel) => {
    let slider = getSlider(carussel.id)
    let prev = slider.getPrev(slider.current)
    slider.changeVisibility(prev, slider.current);
    slider.current = prev;
}

const initialize = () => {

    var slider = [].slice.call(document.getElementsByClassName("slider"))

    for (let i in slider) {
        let name = "slider" + i
        slider[i].setAttribute("id", name)

        carussels.push(new Slider(name, slider[i]))
        carussels[i].changeVisibility(carussels[i].getPrev(1), 1)
    }
}


export { initialize, left, right, toggleLoop }