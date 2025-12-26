import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VerifyBill() {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/verify/${billId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setBill(data.bill);
        }
      })
      .catch(() => setError("Server error"));
  }, [billId]);

  if (error) return <h2>{error}</h2>;
  if (!bill) return <h2>Verifying bill...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h2>✅ Bill Verified</h2>
      <p><b>Name:</b> {bill.customerName}</p>
      <p><b>Phone:</b> {bill.customerPhone}</p>
      <p><b>Total:</b> ₹{bill.totalAmount}</p>

      <h3>Items</h3>
      <ul>
        {bill.items.map((item, i) => (
          <li key={i}>
            {item.name} — {item.qty} × ₹{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
