import { useBrand } from "../../Contexts/BrandContext/BrandContext";
import "./Xisobotlar.scss";
import { NavLink, useParams } from "react-router-dom";

const Xisobotlar = () => {
  const { id } = useParams();
  const { brands, isPending, error } = useBrand();

  if (isPending) return <p>loading....</p>;
  if (error) return <p>xatolik {error}</p>;
  if (!brands) return <p>brand kelmadi</p>;

  /* -------------------------
     Robust date normalizer
     - qabul qiladi: Date | number | string
     - qaytaradi: valid Date yoki null
  --------------------------*/
  const normalizeDate = (val) => {
    if (!val && val !== 0) return null;

    // agar allaqachon Date obyekti bo'lsa
    if (val instanceof Date) {
      return isNaN(val.getTime()) ? null : val;
    }

    // agar number (timestamp) bo'lsa
    if (typeof val === "number") {
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    }

    // endi string bo'lishi kerak — lekin avvalo typeof tekshiramiz
    if (typeof val !== "string") return null;

    const s = val.trim();

    // DD/MM/YYYY (masalan 18/11/2025)
    const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const m1 = s.match(ddmmyyyyRegex);
    if (m1) {
      const day = Number(m1[1]);
      const month = Number(m1[2]);
      const year = Number(m1[3]);
      const d = new Date(year, month - 1, day);
      return isNaN(d.getTime()) ? null : d;
    }

    // ISO yoki YYYY-MM-DD yoki YYYY/MM/DD
    const isoLikeRegex = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/;
    if (isoLikeRegex.test(s)) {
      // Date konstruktor ISO tarzidagi YYYY-MM-DD ni to'g'ri parse qiladi
      const d = new Date(s);
      if (!isNaN(d.getTime())) return d;

      // ba'zan "2025/11/18" bo'lsa, replace qilib ko'rish
      const alt = s.replace(/\//g, "-");
      const d2 = new Date(alt);
      return isNaN(d2.getTime()) ? null : d2;
    }

    // boshqa umumiy parse urinish (fallback)
    const fallback = new Date(s);
    return isNaN(fallback.getTime()) ? null : fallback;
  };

  /* isSameDay - normalize qilib solishtiradi */
  const isSameDay = (a, b) => {
    const da = normalizeDate(a);
    const db = normalizeDate(b);
    if (!da || !db) return false;
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  };

  const today = new Date();

  /* -----------------------------------
     Build allSales va saqlash uchun dateObj/dateKey
  ------------------------------------*/
  const allSales = brands.flatMap((brand) =>
    brand.products.flatMap((product) =>
      (product.history || [])
        .filter((h) => h.type === "sell")
        .map((sell) => {
          const dateObj = normalizeDate(
            sell.sellSana ?? sell.sana ?? sell.date
          );
          const dateKey = dateObj ? dateObj.toLocaleDateString("en-GB") : "";

          return {
            brandId: brand.id,
            productId: product.id,
            sellId: sell.id, 
            brandName: brand.brandName,
            productName: product.maxName,
            cPrice: product.cPrice,
            currentAmount: product.currentAmount,
            sellAmount: sell.sellAmount || 0,
            sellPrice: sell.sellPrice || 0,
            itogo: sell.itogo || 0,
            profit: sell.profit || 0,
            rawSana: sell.sellSana ?? sell.sana ?? "",
            dateObj,
            dateKey,
          };
          
        })
      )
    );

  /* -----------------------
     Today sales (dateObj asosida)
  ------------------------*/
  const todaySales = allSales.filter(
    (s) => s.dateObj && isSameDay(s.dateObj, today)
  );

  const allSoldProducts = todaySales.reduce(
    (acc, item) => acc + (item.sellAmount || 0),
    0
  );
  const allItogo = todaySales.reduce((acc, item) => acc + (item.itogo || 0), 0);
  const allProfits = todaySales.reduce(
    (acc, item) => acc + (item.profit || 0),
    0
  );

  /* -----------------------------------
     groupByDate (dateKey bilan)
  ------------------------------------*/
  const groupByDate = (sales) => {
    return sales.reduce((acc, item) => {
      const key = item.dateKey || "no-date";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  };

  const groupedSales = groupByDate(allSales);

  /* sort qilingan dateKeys (dateObj yordamida aniq tartiblash) */
  const sortedDates = Object.keys(groupedSales).sort((a, b) => {
    // "no-date"larni oxiriga surish
    if (a === "no-date") return 1;
    if (b === "no-date") return -1;

    const da = normalizeDate(a);
    const db = normalizeDate(b);
    // agar ikkala dateObj ham bo'lsa teskari tartib
    if (da && db) return db - da;
    if (da && !db) return -1;
    if (!da && db) return 1;
    return a.localeCompare(b);
  });

  const getDayTotals = (sales) => {
    const totalAmount = sales.reduce(
      (acc, item) => acc + (item.sellAmount || 0),
      0
    );
    const totalItogo = sales.reduce((acc, item) => acc + (item.itogo || 0), 0);
    const totalProfit = sales.reduce(
      (acc, item) => acc + (item.profit || 0),
      0
    );
    return { totalAmount, totalItogo, totalProfit };
  };

  /* umumiy hisoblar */
  const totalSoldProducts = allSales.reduce(
    (acc, item) => acc + (item.sellAmount || 0),
    0
  );
  
  const totalItogo = Math.floor(allSales.reduce((acc, item) => acc + (item.itogo || 0), 0) * 100 ) / 100;

  const totalPrice = Math.floor(allSales.reduce(
    (acc, item) => acc + (item.cPrice || 0),
    0
  ) * 100) /100;
  const totalProfits = allSales.reduce(
    (acc, item) => acc + (item.profit || 0),
    0
  );

  /* ------------------ JSX ------------------ */
  return (
    <div className="xisobotlar container">
      <h3 className="xisobotlar-title">brendlar boyicha xisobotlar</h3>

{/* ---------brendlar boyicha xisobotlar ------------------------------------ */}
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
{/* ------------------------------------------------------------------------- */}

{/* ------------kunlik xisobotlar----------------------------------------------------------------- */}
      <div className="xisobotlar-daily">
        <h2 className="xisobotlar-daily-title">
          Xisobotlar <small>{today.toLocaleDateString("en-GB")}</small>
        </h2>

        <div className="xisobotlar-daily-foydalar">
          <p> maxsulot sotildi: {allSoldProducts} </p>
          <p> savdo {allItogo}$ </p>
          <p> foyda {allProfits}$ </p>
        </div>

        {todaySales.length === 0 ? (
          <p>Bugun sotuv bolmadi!!!</p>
        ) : (
          todaySales.map((item, i) => (
            <div key={i} className="xisobotlar-daily-card">
              <div className="card-top">
                <h4 className="card-top-brandName">{item.brandName}</h4>
                <h4>{item.productName}</h4>
                <small>{item.dateKey || item.rawSana}</small>
              </div>

              <div className="card-down">
                <p>
                  soni: <br /> {item.sellAmount}
                </p>
                <p style={{ color: "darkslategray" }}>
                  kelishi: <br /> {item.cPrice}$
                </p>
                <p>
                  sotildi: <br /> {item.sellPrice}$
                </p>
                <p>
                  itogo: <br /> {item.itogo}$
                </p>
                <p
                style={{
                  color:
                  item.profit > 0 ? ""
                  : item.profit <= 0 ? "red" : "red"
                }}
                >
                  foyda: <br />
                  {item.profit }$
                </p>
                <p style={{ marginTop: "10px", paddingRight: "1px" }}>
                  omborda: {item.currentAmount}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
{/* ------------------------------------------------------------------------------------------------- */}


{/*----------------------- umumuy xisobotlar -------------------------------------------- */}

      <div className="xisobotlar-all">
        <h3 className="xisobotlar-all-title">umumiy xisobotlar</h3>

        {sortedDates.map((date) => {
          const daySales = groupedSales[date];
          const { totalAmount, totalItogo, totalProfit } =
            getDayTotals(daySales);

          return (
            <div
              key={date}
              className="xisobotlar-date-group"
              style={{
                borderTop: "2px solid white",
                paddingTop: "15px",
                paddingBottom: "25px",
                marginTop: "25px",
              }}
            >
              <h4 className="date-title">{date}</h4>

              <div className="day-summary">
                <p>
                  {" "}
                  sotilgan mahsulotlar: <b>{totalAmount}</b>
                </p>
                <p>
                  {" "}
                  savdo: <b>{totalItogo}$</b>
                </p>
                <p>
                  {" "}
                  foyda: <b>{totalProfit}$</b>
                </p>
              </div>

              {daySales.map((item, i) => (
                <div key={i} className="xisobotlar-daily-card all">
                  <div className="card-top">
                    <h4 className="card-top-brandName">{item.brandName}</h4>
                    <h4>{item.productName}</h4>
                    <small>{item.dateKey || item.rawSana}</small>
                  </div>

                  <div className="card-down">
                    <p>
                      soni: <br /> {item.sellAmount}
                    </p>
                    <p style={{ color: "darkslategray" }}>
                      kelishi: <br /> {item.cPrice}$
                    </p>
                    <p>
                      sotilishi: <br /> {item.sellPrice}$
                    </p>
                    <p>
                      itogo: <br /> {item.itogo}$
                    </p>
                       <p
                        style={{
                          color:
                          item.profit > 0 ? ""
                          : item.profit <= 0 ? "red" : "red"
                        }}
                        >
                          foyda: <br />
                          {item.profit }$
                        </p>

                        <p style={{ marginTop: "10px", paddingRight: "1px" }}>
                          omborda: <br /> {item.currentAmount}
                        </p>
                    
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <div className="xisobotlar-all-xisobotlai">
          <p>jami soni: {totalSoldProducts} ta</p>
          <p>jami kelish summasi: {totalPrice}$</p>
          <p>jami summa: {totalItogo}$</p>
          <p>jami foyda: {totalProfits}$</p>
        </div>
      </div>
{/* --------------------------------------------------------------------------------------- */}
    </div>
  );
};

export default Xisobotlar;
