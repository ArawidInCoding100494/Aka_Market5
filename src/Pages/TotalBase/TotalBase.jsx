import { NavLink, Link, useParams } from "react-router-dom"
import "./TotalBase.scss"

import { useBrand } from "../../Contexts/BrandContext/BrandContext"

const TotalBase = () => {

    const {brands, isPending, error} = useBrand()

    const {id} = useParams()

    if(isPending) return <p>loading...</p>
    if(error) return <p>xatolik: {error}</p>
 
  
    
   
    

    

  return (
    <div className="totalBase">

        <div className="totalBase-up">
            <h2 className="totalBase-up-title">yangi brend qoshing</h2>
            <nav>

            <NavLink to="/CreateBrand" className="btn">qoshish</NavLink>
            </nav>
            
        </div>

        <div className="totalBase-down container">

            {brands && brands.map((brand) => (
                <nav key={brand.id} >
                    <NavLink className="totalBase-down-card"   to={`/brand/${brand.id}`} >
                    <h3>{brand.brandName}</h3>
                    <p>jami: {brand.products.reduce((acc, item)=> acc + (Number(item.cAmount) || 0),0)} ta maxsulot bor</p>

                    <p>jami: {brand.products.reduce((acc, item) => acc + (Number(item.itogo) || 0), 0)} sum</p>
                    </NavLink>
                </nav>
            ))}

        </div>
    </div>
  )
}

export default TotalBase