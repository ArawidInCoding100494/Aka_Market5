import { NavLink, useParams } from "react-router-dom";
import "./BrandDetails.scss";

import { useBrand } from "../../Contexts/BrandContext/BrandContext";

const BrandDetails = () => {
  const { id } = useParams();
  const { brands, deleteProduct } = useBrand();

  const brand = brands?.find((b) => b.id == id);

  if (!brand) return <p>brand topilmadi....</p>;


  const totalAmounts = brand.products.reduce((acc, item) => acc + (item.cAmount || 0), 0)

  const totalcurrentAmounts = brand.products.reduce((acc, item) => acc + Number((item.currentAmount) || 0), 0)

  const totalSums = brand.products.reduce((acc, item) => acc + Number((item.itogo) || 0), 0)

  return (
    <div className="brandDetails container">
      <div className="brandDetails-header">

        <div className="brandDetails-header-left">
            <h3>{brand.brandName}</h3>
        </div>

     <div className="brandDetails-header-right">
           <h3 className="brandDetails-header-right-title">yangi maxsulot</h3>
        <nav>
          <NavLink to={`/brand/${id}/CreateProduct`} className="btn">
            qoshish
          </NavLink>
        </nav>
     </div>


      </div>

      <h5>jami kelgan soni: {totalAmounts}</h5>
      <h5>ommborda jami: {totalcurrentAmounts} </h5>
      <h5>jami summa: {totalSums}$</h5>

      {brand.products.map((product) => {

        if(product.currentAmount <= 0){
          return <p style={{color: "red"}} 
           >{product.maxName} Qolmadi</p>
        }
        
        return (
          <div key={product.id} className="brandDetails-card">
            <div className="brandDetails-card-up">
              <h3>{product.maxName}</h3>
              <small>{product.sana}</small>
            </div>
            <div className="brandDetails-card-down">
              <p>
                jami kelgani: <br /> {product.cAmount}
              </p>
              <p>
                omborda: <br /> {product.currentAmount} {" "}
              </p>
              <p>
                narxi: <br /> {product.cPrice}${" "}
              </p>
              <strong>
                itogo: <br /> {product.itogo}$
              </strong>
              <nav>
                <NavLink
                  className="edit"
                  to={`/brand/${brand.id}/edit/${product.id}`}
                >
                  taxrir: ✍
                </NavLink>
                <button onClick={() => {
                    if (window.confirm("Mahsulotni o‘chirmoqchimisiz?")) {
                      deleteProduct(brand.id, product.id);
                    }
                  }}>удалит</button>
              </nav>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BrandDetails;
