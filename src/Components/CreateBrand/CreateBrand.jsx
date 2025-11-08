import { useNavigate } from "react-router-dom"
import "./CreateBrand.scss"
import {v4 as uuidv4} from "uuid"


import React, { useState } from 'react'
import { useBrand } from "../../Contexts/BrandContext/BrandContext"

const CreateBrand = () => {
    const navigate = useNavigate()
    const {brands, setbrands} = useBrand()
    const [brandName, setBrandName] = useState("")

    const handelSubmit = async(e) => {
        e.preventDefault()

        const newBrand = {
            id: uuidv4(),
            brandName,
            products: []
        }

        await fetch("https://json-api.uz/api/project/AkaMarket/brands", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newBrand)
        })

        setbrands([...brands, newBrand])

        navigate(-1)
    }

  return (
    <div className="createBrand">
        <div className="createBrand-main">
            <h3 className="createBrand-main-title">yangi Brand qo'shing</h3>
            <form onSubmit={handelSubmit} className="forma">
                <label className="forma-label">
                    <span className="forma-label-span">bend nomini kiriting</span>
                    <input value={brandName} onChange={(e) => setBrandName(e.target.value)}
                    required type="text" placeholder="bend nomini kiriting" className="forma-label-inp" />
                </label>

                <div className="forma-btns">
                    <button className="btn" type="button" onClick={()=> navigate(-1)}>bekor qilish</button>

                    <button className="btn">saqlash</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateBrand