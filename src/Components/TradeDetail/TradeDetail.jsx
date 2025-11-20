import { useParams } from "react-router-dom";
import "./TradeDetail.scss";

import { useBrand } from "../../Contexts/BrandContext/BrandContext";
import { useRef, useState } from "react";

const TradeDetail = () => {
  const { id } = useParams();
  const { brands, setbrands } = useBrand();

  const brand = brands.find((b) => b.id == id);
  if (!brand) return <p>{brand?.brandName} topilmadi!!</p>;

  const amount = useRef({});
  const price = useRef({});
  const [profitState, setProfitState] = useState({}); // REAL-TIME PROFIT

  // Real-time profit hisoblash
  const handleChange = (product) => {
    const soldAmount = Number(amount.current[product.id]?.value || 0);
    const soldPrice = Number(price.current[product.id]?.value || 0);

    if (soldAmount && soldPrice) {
      const profit = Math.floor((soldPrice - product.cPrice) * soldAmount * 100) / 100;
      setProfitState((prev) => ({
        ...prev,
        [product.id]: profit,
      }));
    } else {
      setProfitState((prev) => ({
        ...prev,
        [product.id]: "",
      }));
    }
  };

  // Submit
  const handelSubmit = async (e, product) => {
    e.preventDefault();

    const soldAmount = Number(amount.current[product.id].value);
    const soldPrice = Number(price.current[product.id].value);
    const itogo = soldAmount * soldPrice;

    if (soldAmount > product.currentAmount) {
      return alert("Qolgan maxsulotdan ko'p sotib bo'lmaydi!");
    }

    // Profit bo‘sh bo‘lishi ham mumkin
    const profit =
      profitState[product.id] === "" ? "" : profitState[product.id];

    const newHistory = {
      type: "sell",
      sellAmount: soldAmount,
      sellPrice: soldPrice,
      itogo,
      profit,
      sellSana: new Date().toLocaleDateString("uz-UZ"),
    };

    const upDateProduct = {
      ...product,
      currentAmount: product.currentAmount - soldAmount,
      history: [...(product.history || []), newHistory],
    };

    const upDateBrand = {
      ...brand,
      products: brand.products.map((p) =>
        p.id == product.id ? upDateProduct : p
      ),
    };

    await fetch(
      `https://json-api.uz/api/project/AkaMarket/brands/${brand.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(upDateBrand),
      }
    );

    setbrands((prev) =>
      prev.map((b) => (b.id === brand.id ? upDateBrand : b))
    );

    amount.current[product.id].value = "";
    price.current[product.id].value = "";
    setProfitState((prev) => ({ ...prev, [product.id]: "" })); // profitni tozalash

    alert("sotildi");
  };

  const totalProducts = brand.products.reduce(
    (acc, item) => acc + (item.cAmount || 0),
    0
  );
  const totalAmounts = brand.products.reduce(
    (acc, item) => acc + (item.currentAmount || 0),
    0
  );

  return (
    <div className="tradeDetail container">
      <div className="tradeDetail-up">
        <h3 className="tradeDetail-up-title">{brand.brandName}</h3>
        <h5>jami kelgani: {totalProducts}</h5>
        <h5>omborda: {totalAmounts}</h5>
      </div>

      <div className="tradeDetail-down ">
        {brand.products.map((product) => {
          if (product.currentAmount > 0) {
            return (
              <div key={product.id} className="tradeDetail-down-card">
                <h4 className="tradeDetail-down-card-title">
                  {product.maxName}
                </h4>

                <form
                  onSubmit={(e) => handelSubmit(e, product)}
                  className="forma"
                >
                  <label className="forma-label">
                    <span className="forma-label-span">
                      soni: <br />{" "}
                      <small>omborda:{product.currentAmount}</small>{" "}
                    </span>

                    <input
                      ref={(el) => (amount.current[product.id] = el)}
                      required
                      type="number"
                      className="forma-label-inp"
                      onChange={() => handleChange(product)}
                    />
                  </label>

                  <label className="forma-label">
                    <span className="forma-label-span">
                      narxi: <br />{" "}
                      <small>kelishi: {product.cPrice}$</small>{" "}
                    </span>

                    <input
                      ref={(el) => (price.current[product.id] = el)}
                      required
                      type="number"
                      step="0.001"
                      className="forma-label-inp"
                      onChange={() => handleChange(product)}
                    />
                  </label>

                  {/* REAL-TIME PROFIT UI */}
                  <div className="forma-label">
                    <span style={{marginBottom: "10px"}}
                    className="forma-label-span">foyda:
                        </span>
                    
                    <input
                        type="text"
                        value={profitState[product.id] ?? ""}
                        onChange={(e) =>
                        setProfitState(prev => ({
                            ...prev,
                            [product.id]: e.target.value   
                        }))
                        }
                        className="forma-label-inp"
                        placeholder="foyda..."
                    />
                    </div>


                  <div className="forma-btns">
                    <button type="submit" className="btn">
                      sotish
                    </button>
                  </div>
                </form>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default TradeDetail;
