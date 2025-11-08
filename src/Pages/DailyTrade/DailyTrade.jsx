import { NavLink, useParams } from "react-router-dom"
import { useBrand } from "../../Contexts/BrandContext/BrandContext"
import "./DailyTrade.scss"


const DailyTrade = () => {

  const {id} = useParams()

  const {brands, isPending, error} = useBrand()


  if(isPending) return <p>loading....</p>
  if(error) return <p>xatolik {error}</p>



  return (
    <div className="dailyTrade">
      <h3 className="dailyTrade-title">maxsulotlar ro'yxati</h3>
     <div className="dailyTrade-cards container">
       {brands && brands.map((brand) => {
        return (
          <div key={brand.id} className="dailyTrade-cards-card" >
            <nav>
              <NavLink to={`brand/${brand.id}/trade`} className="btn" >{brand.brandName}</NavLink>
            </nav>
          </div>
        )
      })}
     </div>
    </div>
  )
}

export default DailyTrade