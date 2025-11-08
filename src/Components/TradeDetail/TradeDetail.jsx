import { useParams } from "react-router-dom"
import "./TradeDetail.scss"

import { useBrand } from "../../Contexts/BrandContext/BrandContext"
import { useRef } from "react"






const TradeDetail = () => {

    const {id} = useParams()
    const {brands, setbrands} = useBrand()
    
    const brand = brands.find(b => b.id == id)
    if(!brand) return <p>{brand.brandName} topilmadi!!</p>

    
    const amount = useRef({})
    const price = useRef({})


    const handelSubmit = async(e, product) => {
        e.preventDefault()
        
        const soldAmount = Number(amount.current[product.id].value)
        const soldPrice = Number(price.current[product.id].value)
        const itogo = soldAmount * soldPrice

        if(soldAmount > product.currentAmount){
            return alert("Qolgan maxsulotdan ko'p sotib bo'lmaydi!")
        }

        const profit = (soldPrice - product.cPrice) * soldAmount



        const newHistory = {
            type: "sell",
            sellAmount: soldAmount,
            sellPrice:  soldPrice,
            itogo,
            profit,
            sellSana: new Date().toLocaleDateString("uz-UZ")
        }

        const upDateProduct = {
            ...product,
            currentAmount: product.currentAmount - soldAmount,
            history: [...(product.history || []), newHistory]
        }


        const upDateBrand = {
            ...brand,
            products: brand.products.map(p => p.id == product.id ? upDateProduct : p)
        }



        await fetch(`https://json-api.uz/api/project/AkaMarket/brands/${brand.id}`,{
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(upDateBrand)
        })

        setbrands(prev => 
            prev.map(b => b.id === brand.id ? upDateBrand : b)
        )

        


        amount.current[product.id].value =""
        price.current[product.id].value = ""
        alert("sotildi")
    }


  return (
    <div className="tradeDetail">
        <div className="tradeDetail-up">
            <h3 className="tradeDetail-up-title">{brand.brandName}</h3>
        </div>

        <div className="tradeDetail-down container">
            {brand.products.map((product) => {
                if(product.currentAmount > 0){

                
                return(
                    <div key={product.id} className="tradeDetail-down-card" >
                        <h4 className="tradeDetail-down-card-title">{product.maxName}</h4>

                        <form onSubmit={(e) => handelSubmit(e, product)} className="forma">

                            <label className="forma-label">
                                <span className="forma-label-span">soni: <small>{product.currentAmount} ta qolgan</small> </span>

                                <input 
                                ref={el => amount.current[product.id] = el}
                                required
                                type="number" 
                                className="forma-label-inp" />
                            </label>

                            <label className="forma-label">
                                <span className="forma-label-span">narxi: <small>{product.cPrice} dan kelgan</small> </span>
                                <input 
                                ref={el => price.current[product.id] = el}
                                required
                                type="number" 
                                className="forma-label-inp" />
                            </label>

                            {/* <div className="forma-label itogo">
                                <p>itogo:</p>
                                <p className="itogo-num" >{itogo}</p>
                            </div> */}

                            <div className="forma-btns">
                                <button type="submit" className="btn">sotish</button>
                            </div>

                        </form>
                    </div>
                )
            } 
            })}
        </div>
    </div>
  )
}

export default TradeDetail