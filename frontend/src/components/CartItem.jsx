export default function CartItem({ item, onRemove }) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />

      <div>
        <h3>{item.name}</h3>
        <p>₹{item.price}</p>

        {item.customizations.map((custom, index) => (
          <p key={index}>
            <strong>{custom.label}:</strong> {custom.value}
          </p>
        ))}

        <button onClick={() => onRemove(item.cartId)}>Remove</button>
      </div>
    </div>
  );
}
