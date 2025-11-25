import "./CreateProduct.scss"

import React, { useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {v4 as uuiv4} from "uuid"
import { useBrand } from "../../Contexts/BrandContext/BrandContext"

const CreateProduct = () => {
  const { setbrands} = useBrand()
  const navigate = useNavigate()
  const {id} = useParams()

  const maxName = useRef()
  const cAmount = useRef()
  const cPrice = useRef()
  const [sana, setSana] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD format
  const [itogo, setItogo] = useState(0)

  const handelchange = () => {
  const amount = Number(cAmount.current.value.replace(",", "."))
  const price = Number(cPrice.current.value.replace(",", "."))
  setItogo(Math.floor((amount * price) * 100) /100)
}


  const handelSubmit = async(e) =>{
    e.preventDefault()


    const newProduct = {
      id: uuiv4(),
      maxName: maxName.current.value,
      cAmount: Number(cAmount.current.value),
      currentAmount: Number(cAmount.current.value),
      cPrice: Number(cPrice.current.value),
      itogo,
      sana, // foydalanuvchi tanlagan sana
      history: [
        {
          type: "add",
          addAmount: Number(cAmount.current.value),
          addPrice: Number(cPrice.current.value),
          itogo,
          sana, // foydalanuvchi tanlagan sana
        }
      ]
    }


    const res = await fetch(`https://json-api.uz/api/project/AkaMarket/brands/${id}`)
    const brand = await res.json()

    const upDateProducts = [...(brand.products || []), newProduct]

    await fetch(`https://json-api.uz/api/project/AkaMarket/brands/${id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({products: upDateProducts})
    })

    setbrands((prev) => 
    prev.map(b => b.id === brand.id 
      ? {...b, products: upDateProducts}
      : b
    )
    )

    alert("maxsulot qo'shildi")
    navigate(-1)
  }


  return (
    <div className="createProduct">
      <div className="createProduct-main">
        <h3 className="createProduct-main-title">yangi maxsulot qoshing</h3>
        <form onSubmit={handelSubmit} className="forma">


          <label className="forma-label">
            <span className="forma-label-span">nomi:</span>
            <input required ref={maxName} type="text" placeholder="nomi" className="forma-label-inp" />
          </label>


          <label className="forma-label">
            <span className="forma-label-span">soni:</span>
            <input onChange={handelchange} required ref={cAmount} type="number" placeholder="soni" className="forma-label-inp" />
          </label>



          <label className="forma-label">
            <span className="forma-label-span">narxi:</span>
            <input onChange={handelchange}  ref={cPrice} type="number" step="0.01" placeholder="narxi" className="forma-label-inp" />
          </label>

          <label className="forma-label">
            <span className="forma-label-span">sana:</span>
            <input 
              type="date" 
              value={sana} 
              onChange={(e) => setSana(e.target.value)} 
              className="forma-label-inp"
            />
          </label>



          <div className="forma-label">
            <p>itogo:</p>
            <p>{itogo}$</p>
          </div>


          <div className="forma-btns">
            <button className="btn" type="button" onClick={() => navigate(-1)} >bekor qilish</button>
            <button className="btn">saqlash</button>
          </div>


        </form>
      </div>
    </div>
  )
}

export default CreateProduct