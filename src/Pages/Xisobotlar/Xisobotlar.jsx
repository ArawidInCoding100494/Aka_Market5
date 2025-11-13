import { useBrand } from "../../Contexts/BrandContext/BrandContext";
import "./Xisobotlar.scss";

import { NavLink, useParams } from "react-router-dom";

const Xisobotlar = () => {
  const { id } = useParams();
  const { brands, isPending, error } = useBrand();

  if (isPending) return <p>lading....</p>;
  if (error) return <p>xatolik {error}</p>;
  if (!brands) return <p>brand kelmadi</p>;

 // helper: "DD/MM/YYYY" -> Date obyekt
const parseDDMMYYYY = (str) => {
  if (!str) return null;
  const parts = str.split("/").map(Number); // ["13","11","2025"]
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
};

const isSameDay = (d1, d2) =>
  d1 && d2 &&
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();


const today = new Date();

const allSales = brands.flatMap((brand) =>
  brand.products.flatMap((product) =>
    (product.history || [])
      .filter((h) => h.type === "sell")
      .map((sell) => ({
        brandName: brand.brandName,
        productName: product.maxName,
        cPrice: product.cPrice,
        sellAmount: sell.sellAmount,
        sellPrice: sell.sellPrice,
        itogo: sell.itogo,
        profit: sell.profit,
        sellSana: sell.sellSana,
      }))
  )
);


const todaySales = allSales.filter((s) => {
  const sellDate = parseDDMMYYYY(s.sellSana);
  return isSameDay(sellDate, today);
});

// daily counts
const allSoldProducts = todaySales.reduce((acc, item) => acc + (item.sellAmount || 0),0)
const allItogo = todaySales.reduce((acc, item) => acc + (item.itogo || 0), 0)
const allProfits = todaySales.reduce((acc, item) => acc + (item.profit || 0), 0)

// all counts
const totalSoldProducts = allSales.reduce((acc, item) => acc + (item.sellAmount || 0), 0)
const totalItogo = allSales.reduce((acc, item) => acc + (item.itogo || 0), 0)
const totalPrice = allSales.reduce((acc, item) => acc + (item.cPrice || 0), 0)
const totalProfits = allSales.reduce((acc, item) => acc + (item.profit || 0), 0)


  return (
    <div className="xisobotlar container">
      <h3 className="xisobotlar-title">brendlar boyicha xisobotlar</h3>

      <div className="xisobotlar-brands">
        {brands.map((brand) => (
          <nav key={brand.id}>
            <NavLink
              to={`/brand/${brand.id}/xisob`}
              className="xisobotlar-card btn"
            >
              <h3>{brand.brandName}</h3>
            </NavLink>
          </nav>
        ))}
      </div>

      <div className="xisobotlar-daily">
        <h2 className="xisobotlar-daily-title">
          Xisobotlar <small>{today.toLocaleDateString("en-GB")}</small>  

        </h2>


          <div className="xisobotlar-daily-foydalar">
            <p> maxsulot sotildi: {allSoldProducts}  </p>
            <p> savdo {allItogo}$  </p>
            <p> foyda {allProfits}$  </p>
        </div>



        {todaySales.legth === 0 ? (
          <p>Bugun sotuv bolmadi!!!</p>
        ) : (
          todaySales.map((item, i) => (
            <div key={i} className="xisobotlar-daily-card">

              <div className="card-top">
                <h4 className="card-top-brandName">{item.brandName}</h4>
                <h4>{item.productName}</h4>
                <small>{item.sellSana}</small>
              </div>

              <div className="card-down">
                <p>soni: <br /> {item.sellAmount}</p>
                <p>kelishi: <br /> {item.cPrice}$</p>
                <p>sotildi: <br /> {item.sellPrice}$</p>
                <p>itogo: <br /> {item.itogo}$</p>
                <p>foyda: <br />{item.profit}$</p>
              </div>
            </div>
          ))
        )}

      
        
      </div>

        <div className="xisobotlar-all">

            <h3 className="xisobotlar-all-title">umumiy xisobotlar</h3>

            {allSales.map((item, i) => (
                <div key={i} className="xisobotlar-daily-card all" >
                    <div className="card-top ">
                <h4 className="card-top-brandName">{item.brandName}</h4>
                <h4>{item.productName}</h4>
                <small>{item.sellSana}</small>
              </div>

              <div className="card-down">
                <p>soni: <br /> {item.sellAmount}</p>
                <p>kelishi: <br /> {item.cPrice}$</p>
                <p>sotilishi: <br /> {item.sellPrice}$</p>
                <p>itogo: <br /> {item.itogo}$</p>
                <p>foyda: <br />{item.profit}$</p>
              </div>
                </div>
            ))}

            <div className="xisobotlar-all-xisobotlai">
                <p>jami soni: {totalSoldProducts} ta</p>
                <p>jami kelish summsi: {totalPrice}$</p>
                <p>jami summa:{totalItogo}$</p>
                <p>jami foyda: {totalProfits}$</p>
            </div>

        </div>

    </div>
  );
};

export default Xisobotlar;
