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
  const [itogo, setItogo] = useState(0)

  const handelchange = () => {
    const amount = Number(cAmount.current.value )
    const price = Number(cPrice.current.value )
    setItogo(amount * price)
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
      sana: new Date().toLocaleDateString("uz-UZ"),
      history: [
        {
          type: "add",
          addAmount: Number(cAmount.current.value),
          addPrice: Number(cPrice.current.value),
          itogo,
          sana: new Date().toLocaleDateString("uz-UZ")
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
            <span className="forma-label-span">nomi</span>
            <input required ref={maxName} type="text" placeholder="nomi" className="forma-label-inp" />
          </label>


          <label className="forma-label">
            <span className="forma-label-span">soni</span>
            <input onChange={handelchange} required ref={cAmount} type="number" placeholder="soni" className="forma-label-inp" />
          </label>



          <label className="forma-label">
            <span className="forma-label-span">narxi</span>
            <input onChange={handelchange} required ref={cPrice} type="number" placeholder="narxi" className="forma-label-inp" />
          </label>


          <div className="forma-label">
            <p>itogp</p>
            <p>{itogo} so'm</p>
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