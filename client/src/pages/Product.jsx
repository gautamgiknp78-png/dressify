import { useParams, Link } from "react-router-dom";

const products = [
  { id: 1, name: "Kurti", price: 499, img: "https://placehold.co/300x300?text=Kurti" },
  { id: 2, name: "Shirt", price: 699, img: "https://placehold.co/300x300?text=Shirt" },
];

export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Product not found</h2>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Link to="/">← Back to Home</Link>
      <h1>{product.name}</h1>
      <img src={product.img} alt={product.name} />
      <p style={{ fontSize: 24 }}>₹{product.price}</p>
    </div>
  );
}
