async function productload(){
    try{
        let res = await fetch("./json/product.json")
        let product = await res.json()
        let html = ''
        product.forEach(function(item){
            html += `
                    <div class='product_card'>
                        <div class='productImg'>
                            <img src='${item.src}' alt='${item.title}'/>
                        </div>
                        <p>${item.brand}</p>
                        <h4>${item.name}</h4>
                        <h4>${item.price}</h4>
                        <button>장바구니</button>
                    </div>
                    `
        })
        let productBox = document.querySelector(".product_box")
        productBox.innerHTML = html
    }catch(err){
        console.error("에러발생", err)
    }
}
productload()