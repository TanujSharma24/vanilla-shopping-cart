if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
class Item {
    constructor(name, price, image, quantity = 1, tax = false) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.tax = tax;
        this.image = image;
    }
}

let itemsInCart = []

function ready() {
    taxed = []
    dataToSave = []

    const removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (element of removeCartItemButtons) { // returns the button elements
        element.addEventListener('click', removeCartItem);
    }

    const quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (element of quantityInputs) {
        element.addEventListener('change', quantityChanged);
    }

    const vatTax = document.getElementsByClassName('btn-tax')
    for (element of vatTax) {
        element.addEventListener('click', taxChanged)
    }

    const addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (element of addToCartButtons) {
        element.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-cancel')[0].addEventListener('click', orderCancelled)
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
    document.getElementsByClassName('btn-save')[0].addEventListener('click', orderSaved)
}

function orderSaved(event) {
    alert('Your order has been successfuly saved.')

    let cartItems = document.getElementsByClassName('cart-items')[0].innerText
    const a = document.createElement("a")

    a.href = URL.createObjectURL(new Blob([cartItems]), { type: "text/plain" })
    a.setAttribute("download", "order.txt")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    orderCancelled()
}

function orderCancelled(event) {
    let cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal(taxed)
}

function taxChanged(event) {
    const clicked = event.target
    const item = clicked.parentElement
    const title = item.getElementsByClassName('cart-item-title')[0].innerText

    const cartItems = document.getElementsByClassName('cart-items')[0]
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('Tax preferences will be updated.')
            taxed.push(i)
            break
        }
    }
    updateCartTotal(taxed)
}

function purchaseClicked() {
    alert('Thank you for your purchase')
    const cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal(taxed)
}

function removeCartItem(event) {
    const buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    //var removed = buttonClicked.parentElement.parentElement
    // --
    // for (let item of itemsInCart) {
    //     if (item.name == removed.getElementsByClassName('cart-item-title')[0].innerText) {
    //         item.
    //     }
    // }
    // console.log(removed.getElementsByClassName('cart-item-title')[0].innerText)
    // --

    updateCartTotal(taxed)
}

function quantityChanged(event) {
    const input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal(taxed)
}

function addToCartClicked(event) {
    const button = event.target
    const shopItem = button.parentElement.parentElement
    const title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    const price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    const imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    let item = new Item(title, price, imageSrc);
    itemsInCart.push(item);
    addItemToCart(item);
    updateCartTotal(taxed)
}

function addItemToCart(item) {
    const cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    const cartItems = document.getElementsByClassName('cart-items')[0]
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (let element of cartItemNames) {
        if (element.innerText == item.name) {
            alert('This item is already added to the cart')
            return
        }
    }

    const cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${item.image}" width="100" height="100">
            <span class="cart-item-title">${item.name}</span>
        </div>
        <span class="cart-price cart-column">${item.price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>
        <button class = "btn btn-tax" type="button">Apply Tax</button>
        `
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    cartRow.getElementsByClassName('btn-tax')[0].addEventListener('click', taxChanged)
}

function updateCartTotal(taxedArr) {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0]
    const cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let subtotal = 0
    let taxAmount = 0
    let total = 0
    let taxTotal = 0

    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))

        document.getElementsByClassName('cart-subtotal-price')[0].innerText = '$' + price
        if (taxedArr.includes(i, 0)) {
            taxAmount = price * .1
            taxAmount = Math.round(taxAmount * 100) / 100
        }

        let quantity = quantityElement.value
        taxTotal = taxTotal + (taxAmount * quantity)
        subtotal = subtotal + (price * quantity)
        taxAmount = 0
    }
    subtotal = Math.round(subtotal * 100) / 100
    document.getElementsByClassName('cart-subtotal-price')[0].innerText = '$' + subtotal
    document.getElementsByClassName('cart-tax-price')[0].innerText = '$' + taxTotal
    total = subtotal + taxTotal
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total

}