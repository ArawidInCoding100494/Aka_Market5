import { useBrand } from "../../Contexts/BrandContext/BrandContext";
import "./Xisobotlar.scss";
import { NavLink, useParams } from "react-router-dom";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Xisobotlar = () => {
  const { id } = useParams();
  const { brands, isPending, error } = useBrand();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);

  if (isPending) return <p>loading....</p>;
  if (error) return <p>xatolik {error}</p>;
  if (!brands) return <p>brand kelmadi</p>;

  // --- normalizeDate va isSameDay funksiyalari ---
  const normalizeDate = (val) => {
    if (!val && val !== 0) return null;
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
    if (typeof val === "number") return new Date(val);
    if (typeof val !== "string") return null;

    const s = val.trim();
    const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const m1 = s.match(ddmmyyyyRegex);
    if (m1) {
      const day = Number(m1[1]);
      const month = Number(m1[2]);
      const year = Number(m1[3]);
      return new Date(year, month - 1, day);
    }

    const isoLikeRegex = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/;
    if (isoLikeRegex.test(s)) {
      const d = new Date(s.replace(/\//g, "-"));
      return isNaN(d.getTime()) ? null : d;
    }

    const fallback = new Date(s);
    return isNaN(fallback.getTime()) ? null : fallback;
  };

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

  // --- allSales ---
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

  // --- Filter: faqat tanlangan sana ---
  const filteredSales = selectedDate
    ? allSales.filter((s) => s.dateObj && isSameDay(s.dateObj, selectedDate))
    : allSales;

  // --- groupByDate ---
  const groupByDate = (sales) => {
    return sales.reduce((acc, item) => {
      const key = item.dateKey || "no-date";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  };

  const groupedFilteredSales = groupByDate(filteredSales);

  const sortedFilteredDates = Object.keys(groupedFilteredSales).sort((a, b) => {
    if (a === "no-date") return 1;
    if (b === "no-date") return -1;
    const da = normalizeDate(a);
    const db = normalizeDate(b);
    if (da && db) return db - da;
    if (da && !db) return -1;
    if (!da && db) return 1;
    return a.localeCompare(b);
  });

  // ------------kunlik umumiy xisobotlar-----------
  const getDayTotals = (sales) => {

    const totalAmount = Math.floor(sales.reduce((acc, item) => acc + (item.sellAmount || 0), 0) * 100 ) / 100;
    const totalItogo = Math.floor(sales.reduce((acc, item) => acc + (item.itogo || 0), 0) * 100 ) / 100;
    const totalProfit = Math.floor(sales.reduce((acc, item) => acc + (item.profit || 0), 0) * 100 ) / 100;

    return { totalAmount, totalItogo, totalProfit };
  };

  // Umumiy xisobotlar
  const totalSoldProducts = Math.floor(allSales.reduce((acc, item) => acc + (item.sellAmount || 0), 0) * 100) / 100;
  const totalItogo = Math.floor(allSales.reduce((acc, item) => acc + (item.itogo || 0), 0) * 100) / 100;

  const totalPrice = Math.floor(allSales.reduce((acc, item) => acc + (item.cPrice || 0) ,
    0
  ) * 100) /100;
  const totalProfits = Math.floor(allSales.reduce((acc, item) => acc + (item.profit || 0) ,
    0
  ) * 100 ) / 100;

  // --- JSX ---
  return (
    <div className="xisobotlar container">
      <h3 className="xisobotlar-title">brendlar boyicha xisobotlar</h3>

      {/* brendlar */}
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

      {/* // calendar JSX */}
      <div className="xisobotlar-calendar"
      style={{display: "flex", justifyContent: "space-between"}}
      >
        <button className="btn" onClick={() => setShowCalendar(!showCalendar)}>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-GB")
            : "Sanani tanlash"}
        </button>

        {showCalendar && (
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              setShowCalendar(false);
            }}
            value={selectedDate}
          />
        )}

        {selectedDate && selectedDate !== today && (
          <button className="btn" onClick={() => setSelectedDate(today)}>
            Bugungi xisobotlariga qaytish
          </button>
        )}
      </div>

      {/* Filterlangan xisobotlar */}
      {sortedFilteredDates.length === 0 ? (
        <p>Tanlangan kunda savdo xisoboti mavjud emas.</p>
      ) : (
        <div>
          {/* Filterlangan kun xisobotlari */}
          {sortedFilteredDates.map((date) => {
            const daySales = groupedFilteredSales[date];
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
                    sotilgan mahsulotlar: <b>{totalAmount}</b>{" "}
                  </p>
                  <p>
                    {" "}
                    savdo: <b>{totalItogo}$</b>{" "}
                  </p>
                  <p>
                    {" "}
                    foyda: <b>{totalProfit}$</b>{" "}
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
                        {" "}
                        soni: <br /> {item.sellAmount}{" "}
                      </p>
                      <p style={{ color: "darkslategray" }}>
                        {" "}
                        kelishi: <br /> {item.cPrice}${" "}
                      </p>
                      <p>
                        {" "}
                        sotilishi: <br /> {item.sellPrice}${" "}
                      </p>
                      <p>
                        {" "}
                        itogo: <br /> {item.itogo.toFixed(2)}${" "}
                      </p>
                      <p style={{ color: item.profit > 0 ? "" : "red" }}>
                        foyda: <br /> {item.profit}$
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

          {/* ------------------ umumiy xisobotlar har doim ko‘rsin ------------------ */}
          <div className="xisobotlar-all-xisobotlai">
            <p>jami soni: {totalSoldProducts} ta</p>
            <p>jami kelish summasi: {totalPrice}$</p>
            <p>jami summa: {totalItogo}$</p>
            <p>jami foyda: {totalProfits}$</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Xisobotlar;
