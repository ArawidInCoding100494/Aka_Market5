import { useNavigate, useParams } from "react-router-dom"
import "./EditProduct.scss"
import { useBrand } from "../../Contexts/BrandContext/BrandContext"
import { useState } from "react"

const EditProduct = () => {

    const {id, productId} = useParams()
    const {brands, setbrands} = useBrand()

    const brand = brands.find(b => b.id == id)
    const product = brand?.products.find(p => p.id == productId)

    if(!product) return <p>product topilmadi</p>

    const navigate = useNavigate()

    const [maxName, setmaxName] = useState(product.maxName)
    const [cAmount, setcAmount] = useState(product.cAmount)
    const [price, setprice] = useState(product.cPrice)


    const handelSubmit = (e) => {
        e.preventDefault()

        const upDateProduct =   {
            ...product,
            maxName,
            cAmount: Number(cAmount),
            cPrice: Number(price),
            itogo: Number(cAmount) * Number(price)
        }

        const upDateBrand = {
            ...brand,
            products: brand.products.map((p => 
                p.id == product.id ? upDateProduct : p
            ))
        }


        fetch(`https://json-api.uz/api/project/AkaMarket/brands/${brand.id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(upDateBrand)
        })
        .then(() => {
            setbrands(prevBrands =>
                prevBrands.map(b => 
                    b.id === brand.id ? upDateBrand : b
                )
            )
            navigate(-1)
        })

    }

  return (
    <div className="editProduct">
        <div className="editProduct-main">

        <h3 className="editProduct-main-title">{product.maxName}ni tahrirlash</h3>

        <form onSubmit={handelSubmit} className="forma">
            <label className="forma-label">
                <span className="forma-label-span">nomi</span>
                <input value={maxName} onChange={(e) => setmaxName(e.target.value)}
                type="text" placeholder="nomi" className="forma-label-inp" />
            </label>

            <label className="forma-label">
                <span className="forma-label-span">soni</span>
                <input value={cAmount} onChange={(e) => setcAmount(e.target.value)}
                type="number" placeholder="soni" className="forma-label-inp" />
            </label>

            <label className="forma-label">
                <span className="forma-label-span">narxi</span>
                <input value={price} onChange={(e) => setprice(e.target.value)}
                type="number" placeholder="narxi" className="forma-label-inp" />
            </label>


            <div className="forma-btns">
                <button className="btn" onClick={() => navigate("..")} type="button" >bekor qiliw</button>
                <button className="btn" type="submit" >saqlaw</button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default EditProduct