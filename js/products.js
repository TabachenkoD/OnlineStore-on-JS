function initProducts() {
    const form = document.querySelector('form');
    if (!form) {
        return;
    }

    const inputRange = form.querySelector('input[type=range]');
    inputRange.value = 0;
    const rangeValue = form.querySelector('.range_value');
    rangeValue.innerHTML = `$0`;
    const inputSearch = form.querySelector('input[type="search"]');
    const mainCatalog = document.querySelector('.main_catalog');
    const company = form.querySelector('ul');
    const hideStr = 'hide';

    function contentTemplate(varJson, iterattor) {
        const cardTemplate = `
            <div class="card_item">
                <img src="${varJson[iterattor].img}" alt="img description">
                <ul>
                    <li class="name_product">${varJson[iterattor].name}</li>
                    <li class="cost">${varJson[iterattor].cost}</li>
                </ul>
                <div><button class="buy">Buy</button></div>
            </div>
            `;
        return cardTemplate;
    }

    async function loadJSON() {
        try {
            const response = await fetch('./data.json');
            const respResult = await response.json();

            localStorage.setItem("jsonFile", JSON.stringify(respResult));
            printProductCard();
        } catch (Error) {
            console.log(Error);
        }
    }

    function printProductCard() {
        const jsonFileParse = JSON.parse(localStorage.getItem('jsonFile'));

        for (let i = 0; i < Object.keys(jsonFileParse).length; i++) {
            mainCatalog.innerHTML += contentTemplate(jsonFileParse, i);
        }
    }

    async function filterOfCompany(userSelect) {
        try {
            if (localStorage.getItem('jsonFile') !== null) {
                if (userSelect === 'All') {
                    mainCatalog.innerHTML = "";
                    printProductCard(mainCatalog, contentTemplate);
                } else {
                    const jsonFileParse = JSON.parse(localStorage.getItem('jsonFile'));

                    mainCatalog.innerHTML = "";

                    for (let i = 0; i < Object.keys(jsonFileParse).length; i++) {
                        if (jsonFileParse[i].company === userSelect) {
                            mainCatalog.innerHTML += contentTemplate(jsonFileParse, i);
                        }
                    }
                }
            }
        } catch (Error) {
            console.log(Error);
        }
    };

    if (inputSearch) {
        inputSearch.addEventListener('input', () => {
            const nameProduct = mainCatalog.querySelectorAll('.name_product');
            const inpVal = inputSearch.value.toLowerCase().trim();
            const regExp = /[^a-z]/gi;

            nameProduct.forEach((elem) => {
                if (inpVal && !regExp.test(inpVal) && elem.innerText.toLowerCase().search(inpVal) === -1) {
                    elem.closest('div').classList.add(hideStr)
                } else {
                    elem.closest('div').classList.remove(hideStr)
                }
            })
        });
    }

    if (inputRange) {
        inputRange.addEventListener('input', () => rangeValue.innerHTML = `$${inputRange.value}`);
        inputRange.addEventListener('change', () => {
            const costProduct = mainCatalog.querySelectorAll('.cost');

            costProduct.forEach((elem) => {
                if (Number(elem.innerText) < Number(inputRange.value)) {
                    elem.closest('div').classList.add(hideStr)
                } else {
                    elem.closest('div').classList.remove(hideStr)
                }
            })
        })
    }

    if (company) {
        company.addEventListener('click', (e) => filterOfCompany(e.target.innerText))
    }

    if (form) {
        form.addEventListener('submit', (e) => e.preventDefault());
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem('jsonFile') !== null) {
            printProductCard();
        } else {
            loadJSON();
        }
    })
}

initProducts();

