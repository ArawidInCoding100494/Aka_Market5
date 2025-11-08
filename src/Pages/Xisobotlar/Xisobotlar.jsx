import { useBrand } from "../../Contexts/BrandContext/BrandContext"
import "./Xisobotlar.scss"

    import { NavLink, useParams } from "react-router-dom"

    const Xisobotlar = () => {
        const {id} = useParams()
        const {brands, isPending, error} = useBrand()

        if(isPending) return <p>lading....</p>
        if(error) return <p>xatolik {error}</p>
        if(!brands) return <p>brand kelmadi</p>
      
    

  return (
    <div className="xisobotlar container">
        {brands.map((brand) => (
            <nav key={brand.id}>
                <NavLink  to={`/brand/${brand.id}/xisob`} className="xisobotlar-card btn">
                <h3>{brand.brandName}</h3>
                </NavLink>
            </nav>
        ))}
    </div>
  )
}

export default Xisobotlar