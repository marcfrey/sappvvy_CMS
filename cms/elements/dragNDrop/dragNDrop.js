/**
 * Source: https://webdevtrick.com/html-drag-and-drop-list/, [10.02.2021]
 * 
 * 
 */

 // Code By Webdevtrick ( https://webdevtrick.com )

var changedList = null
var resetChanged = () => {changedList = null}
var dragSrcEl

function dragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
};

function dragEnter(e) {
    this.classList.add('over');
}

function dragLeave(e) {
    e.stopPropagation();
    this.classList.remove('over');
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}


function dragDrop(e) {
    if (dragSrcEl != this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
    return false;
  }

function dragEnd(e) {
    var listItens = document.querySelectorAll('.draggable');
    [].forEach.call(listItens, function(item) {
        item.classList.remove('over');
    });
    
    this.style.opacity = '1';

    let elementId = ""
    let parent = e.target.parentNode

    while (elementId == "") {
        if (parent.localName == "body") {
            continue
        }
        if (parent.id) {
            elementId = parent.id
        } else {
            parent = parent.parentNode
        }
    }

    changedList = elementId
}

function addEventsDragAndDrop(el) {
    el.addEventListener('dragstart', dragStart, false);
    el.addEventListener('dragenter', dragEnter, false);
    el.addEventListener('dragover', dragOver, false);
    el.addEventListener('dragleave', dragLeave, false);
    el.addEventListener('drop', dragDrop, false);
    el.addEventListener('dragend', dragEnd, false);
}

var listItens = document.querySelectorAll('.draggable');
[].forEach.call(listItens, function(item) {
    addEventsDragAndDrop(item);
});

function addNewItem(text, query) {

    var newItem = document.querySelector(query + " input.listInput").value;
    document.querySelector(query + " input.listInput").value = '';

    var li = document.createElement('li');
    var attr = document.createAttribute('draggable');
    var ul = document.querySelector(query + " > ul");
    li.className = 'draggable';
    attr.value = 'true';
    li.setAttributeNode(attr);
    if (newItem != '') {
      li.appendChild(document.createTextNode(newItem));
    } else {
      li.appendChild(document.createTextNode(text));
    }

    ul.appendChild(li);
    addEventsDragAndDrop(li);

    changedList = query.split(" ")[0].substring(1)

    return li
}





export { addNewItem, changedList, resetChanged }