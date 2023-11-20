function Confirm(accept, deny) {
    let box = document.createElement('div');
    box.classList.add('confirmationPopup');
    let confirmBtn = document.createElement('button');
    let denyBtn = document.createElement('button');

    
    confirmBtn.addEventListener('click', accept);
    denyBtn.addEventListener('click', deny)
    box.appendChild(confirmBtn);
    box.appendChild(denyBtn);
    document.body.appendChild(callback);
}
export { Confirm } 