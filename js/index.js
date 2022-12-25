function initFeatured() {
    const featuredBody = document.querySelector('.featured_body');

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

        for (let i = 0; i < 3; i++) {
            featuredBody.innerHTML += contentTemplate(jsonFileParse, i);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem('jsonFile') !== null) {
            printProductCard();
        } else {
            loadJSON();
            printProductCard();
        }
    })
}

initFeatured();