import { NavLink, useParams } from "react-router-dom";
import "./BrandDetails.scss";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, parse } from "date-fns";

import { useBrand } from "../../Contexts/BrandContext/BrandContext";

const BrandDetails = () => {
  const { id } = useParams();
  const { brands, deleteProduct } = useBrand();
  // const navigate = useNavigate();


  const brand = brands?.find((b) => b.id == id);

  if (!brand) return <p>brand topilmadi....</p>;

  const totalAmounts = brand.products.reduce(
    (acc, item) => acc + (item.cAmount || 0),
    0
  );

  const totalcurrentAmounts = brand.products.reduce(
    (acc, item) => acc + Number(item.currentAmount || 0),
    0
  );

  const totalSums =
    Math.floor(
      brand.products.reduce((acc, item) => acc + Number(item.itogo || 0), 0) *
        100
    ) / 100;

  const yetztAllSums =
    Math.floor(
      brand.products.reduce((acc, item) => {
        const price = Number(item.cPrice) || 0;
        const amount = Number(item.currentAmount) || 0;
        const total = price * amount;
        return acc + total;
      }, 0) * 100
    ) / 100;

  const yetztItogo =
    Math.floor(
      brand.products.reduce((acc, item) => {
        const price = Number(item.cPrice) || 0;
        const amount = Number(item.currentAmount) || 0;
        const total = price * amount;
        return acc + total;
      }, 0) * 100
    ) / 100;

  // ---------kalendar functions ---------------------------------

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // serverdan kelgan sanani YYYY-MM-DD ga o‘tkazamiz
  function normalizeDate(dateStr) {
    if (!dateStr) return "";

    if (dateStr.includes("/")) {
      const parsed = parse(dateStr, "dd/MM/yyyy", new Date());
      return format(parsed, "yyyy-MM-dd");
    }

    if (dateStr.includes("-")) return dateStr;

    return dateStr;
  }

  // Calendar dan kelgan sanani YYYY-MM-DD ga o‘tkazish
  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const filteredProducts = selectedDateStr
    ? brand.products.filter((p) => normalizeDate(p.sana) === selectedDateStr)
    : brand.products;    

  return (
    <div className="brandDetails container">
      <div className="brandDetails-header">
        <div
          className="brandDetails-header-left"
          style={{ borderBottom: "4px solid cadetblue" }}
          onClick={() => setSelectedDate(null)}
        >
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


{/* ----------- all xissob----------------------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h5>Mahsulotlar turi: {brand.products.length} xil</h5>
          <h5>Omborda jami maxsulotlar: {totalcurrentAmounts} </h5>
          <h5>Xozirgi summa: {yetztAllSums}$</h5>
        </div>
        <div>
          <h5>Umumiy kelgan soni: {totalAmounts}</h5>
          <h5>Umumiy summa: {totalSums}$</h5>
        </div>
      </div>


{/* ----------------kalendar-------------------- */}
      <div className="kalendar">
        <button className="btn" style={{marginTop: "15px"}}
          onClick={() => setShowCalendar(!showCalendar)}>
             kalendar
        </button>

        {showCalendar && (
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              setShowCalendar(false); // tanlagandan keyin yopiladi
            }}
          />
        )}
      </div>
{/* ---------------------------------------------- */}
      {filteredProducts.map((product) => {
        return (
          <div
            key={product.id}
            className={
              product.currentAmount > 0
                ? "brandDetails-card"
                : "brandDetails-card-bacRed"
            }
          >
            <div className="brandDetails-card-up">
              <h3>{product.maxName}</h3>
              <small>{product.sana}</small>
            </div>
            <div className="brandDetails-card-down">
              <p>
                jami kelgani: <br /> {product.cAmount}
              </p>
              <p>
                omborda: <br /> {product.currentAmount}{" "}
              </p>
              <p>
                narxi: <br /> {product.cPrice}${" "}
              </p>
              <strong>
                itogo: <br />
                {Math.floor(product.currentAmount * product.cPrice * 100) / 100}
                $
              </strong>
              <nav>
                {product.currentAmount > 0 ? (
                  <NavLink
                    className="edit"
                    to={`/brand/${brand.id}/edit/${product.id}`}
                  >
                    taxrir: ✍
                  </NavLink>
                ) : (
                  ""
                )}

                <button
                  className="btn"
                  onClick={() => {
                    if (window.confirm("Mahsulotni o‘chirmoqchimisiz?")) {
                      deleteProduct(brand.id, product.id);
                    }
                  }}
                >
                  удалит
                </button>
              </nav>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BrandDetails;
