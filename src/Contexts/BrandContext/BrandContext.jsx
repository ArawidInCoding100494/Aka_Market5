import { createContext, useContext, useState, useEffect } from "react";

const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [brands, setbrands] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const url = "https://json-api.uz/api/project/AkaMarket/brands";

  useEffect(() => {
    const getDate = async () => {
      setIsPending(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("serverda xatolik bor");
        const result = await res.json();
         console.log("API javobi:", result);

         if (result && Array.isArray(result.data)) {
          setbrands(result.data);
        } else {
          console.warn("Kutilmagan format:", result);
          setbrands([]);
        }
        setIsPending(false);
      } catch (err) {
        setIsPending(false);
        setError(err.message);
      }
    };

    getDate();
  }, []);

const deleteProduct = async (brandId, productId) => {
  try {
    // 1) Brandni olish
    const res = await fetch(`${url}/${brandId}`);
    const brand = await res.json();

    // 2) Productni arraydan olib tashlash
    const updatedProducts = brand.products.filter(p => p.id !== productId);

    // 3) API ga PATCH bilan yangi products arrayni yuborish
    await fetch(`${url}/${brandId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: updatedProducts })
    });

    // 4) Local state ni ham yangilash
    setbrands(prev =>
      prev.map(b =>
        b.id === brandId
          ? { ...b, products: updatedProducts }
          : b
      )
    );

  } catch (err) {
    console.error("O‘chirishda xatolik:", err);
  }
};



  return (
    <BrandContext.Provider value={{ brands, isPending, error, setbrands, deleteProduct }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
export default BrandProvider;
