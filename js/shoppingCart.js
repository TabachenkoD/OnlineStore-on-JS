function initShoppingCart() {
    const body = document.body;
    const shoppingCartButton = body.querySelector('.shopping_cart');
    const popupShoppingCart = body.querySelector('.popup_shopping_cart');
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    const mainCatalog = document.querySelector('.main_catalog');
    const popupShoppingCartContent = popupShoppingCart.querySelector('.popup_shopping_cart_content');
    const btnCheckout = popupShoppingCart.querySelector('button');
    const totalCount = popupShoppingCart.querySelector('.total_count');
    const featuredBody = document.querySelector('.featured_body');

    let arrShoppCart = [];

    function productInShoppCartTemplate(varArr, iterattor) {
        const productInShoppCartTemplate = `
            <div class="cardItemInShoppingCart">
                <img src="${varArr[iterattor].img}" alt="img description">
                <div class="cardItemInShoppingCart_body">
                    <h3>${varArr[iterattor].name}</h3>
                    <h4>$${varArr[iterattor].cost}</h4>
                    <a href="#" class="remove">remove</a>
                </div>
                <div class="amount">
                    <span class="arrow_top"><a href="#">&#8743;</a></span>
                    <span class="amount_count">${varArr[iterattor].amount}</span>
                    <span class="arrow_bottom"><a href="#">&#8744;</a></span>
                </div>
            </div>
            `;
        return productInShoppCartTemplate;
    }

    if (shoppingCartButton && popupShoppingCart) {
        shoppingCartButton.addEventListener('click', () => {
            popupShoppingCart.classList.add('open');
            body.style.paddingRight = lockPaddingValue;
            body.classList.add('lock');
        })

        popupShoppingCart.addEventListener('click', (e) => {
            if (!e.target.closest('.popup_shopping_cart_body') || e.target.dataset.id === 'popupShoppingCartClosed') {
                popupShoppingCart.classList.remove('open');
                body.style.paddingRight = 0;
                body.classList.remove('lock');
            }
        })
    }

    function addToArr(elementTarget) {
        const targetting = elementTarget.closest('.card_item');

        const productObj = {
            "name": targetting.querySelector('.name_product').innerHTML,
            "cost": targetting.querySelector('.cost').innerHTML,
            "img": targetting.querySelector('img').getAttribute('src'),
            "amount": 1
        }

        if (localStorage.getItem('arrShoppCart') !== null) {
            arrShoppCart = JSON.parse(localStorage['arrShoppCart']);
            let flag = true;

            for (let i = 0; i < arrShoppCart.length; i++) {
                if (arrShoppCart[i].name === productObj.name) {
                    flag = false;
                    arrShoppCart[i].amount += 1;
                    localStorage['arrShoppCart'] = JSON.stringify(arrShoppCart);

                } 
            }

            if (flag) {
                arrShoppCart.push(productObj)
                localStorage['arrShoppCart'] = JSON.stringify(arrShoppCart);
            }
        } else {
            arrShoppCart.push(productObj)
            localStorage['arrShoppCart'] = JSON.stringify(arrShoppCart);
        }
    }

    function printToShoppCart() {
        if (localStorage.getItem('arrShoppCart') !== null) {
            arrShoppCart = JSON.parse(localStorage['arrShoppCart']);

            popupShoppingCartContent.innerHTML = "";
            for (let i = 0; i < arrShoppCart.length; i++) {
                popupShoppingCartContent.innerHTML += productInShoppCartTemplate(arrShoppCart, i);
            }
        }
    }

    function plusORminusCount(eventTarget) {
        const parent = eventTarget.closest('.cardItemInShoppingCart');
        const counter = parent.querySelector('.amount_count');
        const name = parent.querySelector('h3').innerHTML;

        arrShoppCart = JSON.parse(localStorage['arrShoppCart']);

        for (let i = 0; i < arrShoppCart.length; i++) {
            if (arrShoppCart[i].name === name) {

                if (eventTarget.parentElement.className === 'arrow_top') {
                    arrShoppCart[i].amount += 1;
                } else if (eventTarget.parentElement.className === 'arrow_bottom' && Number(counter.innerHTML) > 1) {
                    arrShoppCart[i].amount -= 1;
                }

                counter.innerHTML = arrShoppCart[i].amount;
                localStorage['arrShoppCart'] = JSON.stringify(arrShoppCart);
            }
        }
    }

    function removeItemFromShoppingCart(eventTarget) {
        const parent = eventTarget.closest('.cardItemInShoppingCart');
        const name = parent.querySelector('h3').innerHTML;

        for (let i = 0; i < arrShoppCart.length; i++) {
            if (arrShoppCart[i].name === name) {
                arrShoppCart.splice(i, 1);
                localStorage['arrShoppCart'] = JSON.stringify(arrShoppCart);
            }
        }
        workingMask();
        parent.style.display = 'none';
    }

    function fixed(N, n) {
        return Math.round(N * Math.pow(10, n)) / Math.pow(10, n);
    }

    function totalCounting() {
        let summator = 0;

        if (localStorage.getItem('arrShoppCart') !== null) {
            arrShoppCart = JSON.parse(localStorage['arrShoppCart']);

            for (let i = 0; i < arrShoppCart.length; i++) {
                summator += arrShoppCart[i].cost * arrShoppCart[i].amount;
            }

            totalCount.innerHTML = fixed(summator, 2);
        }
    }

    function workingMask() {
        const mask = shoppingCartButton.querySelector('.mask');
        const lengthShoppingCartCount = mask.querySelector('.count-item');

        if (arrShoppCart.length > 0) {
            lengthShoppingCartCount.innerHTML = Number(arrShoppCart.length);
            mask.style.visibility = "visible";
        } else {
            lengthShoppingCartCount.innerHTML = "";
            mask.style.visibility = "hidden";
        }
    }

    function setupShopCartOnPages(e) {
        if (e.target.className === 'buy') {
            addToArr(e.target);
            printToShoppCart();
            totalCounting();
            workingMask();
        }
    }
    
    if (mainCatalog) {
        mainCatalog.addEventListener('click', (e) => setupShopCartOnPages(e));
    }

    if (featuredBody) {
        featuredBody.addEventListener('click', (e) => setupShopCartOnPages(e));
    }

    document.addEventListener('DOMContentLoaded', () => {
        printToShoppCart();
        workingMask();
        totalCounting();
    })

    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            arrShoppCart = [];
            localStorage.removeItem('arrShoppCart')
            popupShoppingCartContent.innerHTML = "";
            totalCount.innerHTML = "0";
            workingMask();
        })
    }

    if (popupShoppingCartContent) {
        popupShoppingCartContent.addEventListener('click', (e) => {
            if (e.target.parentElement.className === 'arrow_top' || e.target.parentElement.className === 'arrow_bottom') {
                plusORminusCount(e.target);
                totalCounting();
            }

            if (e.target.className === 'remove') {
                removeItemFromShoppingCart(e.target);
                totalCounting();
            }
        })
    }
}

initShoppingCart();
