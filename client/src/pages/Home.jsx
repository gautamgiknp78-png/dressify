import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Kurti", price: 499, img: "https://placehold.co/150x150?text=Kurti" },
  { id: 2, name: "Shirt", price: 699, img: "https://placehold.co/150x150?text=Shirt" },
];

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>DRESSIFY PRO</h1>
      <Link to="/ai">Try AI Outfit</Link>
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        {products.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10, textAlign: "center" }}>
              <img src={p.img} alt={p.name} />
              <h2>{p.name}</h2>
              <p>₹{p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
