import { useParams } from "react-router-dom";
import { useBrand } from "../../Contexts/BrandContext/BrandContext";
import "./XisobDetail.scss";

const XisobDetail = () => {
  const { brands, isPending, error } = useBrand();
  const { id } = useParams();

  if (isPending) return <p>lodaing....</p>;
  if (error) return <p>xatolik {error}</p>;

  const brand = brands.find((b) => b.id == id);
  if (!brand) return <p> {brand} topilmadi</p>;

  const selled = brand.products.flatMap((product) =>
    (product.history || [])
      .filter((soldProduct) => soldProduct.type === "sell")
      .map((soldProduct) => ({
        productId: product.id,
        productName: product.maxName,
        sellAmount: soldProduct.sellAmount,
        sellPrice: soldProduct.sellPrice,
        itogo: soldProduct.itogo,
        profit: soldProduct.profit,
        sellSana: soldProduct.sellSana,
      }))
  );


// ishlata olmadim
  // const now = new Date();
  // const currentMonth = now.getMonth() + 1;
  // const currentYear = now.getFullYear();

  // const monthlyProfit = selled
  //   .filter((item) => {
  //     const date = new Date(item.sellSana);
  //     return (
  //       date.getMonth() === currentMonth && date.getFullYear() === currentYear
  //     );
  //   })
  //   .reduce((acc, item) => acc + (item.profit || 0), 0);


  const totalProfit = selled.reduce((acc, item) => acc + (item.profit || 0), 0);




  return (
    <div className="xisobDetail container">
      <div className="xisobDetail-xisobot">
        <h4>
          <strong>{brand.brandName}</strong> xisobotlari
        </h4>

        <h5>jami foyda: {totalProfit}</h5>

        {/* <h5>joriy oydagi foyda: {monthlyProfit}</h5> */}
      </div>

      {selled.map((item) => (
        <div key={item.productId} className="xisobDetail-card">
          <div className="xisobDetail-card-header">
            <h4>{item.productName}</h4>
            <small>{item.sellSana}</small>
          </div>

          <div className="xisobDetail-card-body">
            <p>
              soni: <br /> {item.sellAmount}
            </p>
            <p>
              {" "}
              narxi: <br /> {item.sellPrice}
            </p>
            <p>
              itogosi: <br /> {item.itogo}
            </p>
            <p>
              foyda: <br /> {item.profit}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default XisobDetail;
