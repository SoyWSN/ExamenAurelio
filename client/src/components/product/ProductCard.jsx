// src/components/product/ProductCard.jsx

export default function ProductCard({ product, onOpen }) {
  return (
    <button
      onClick={() => onOpen(product)}
      className="bg-white rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden text-left flex flex-col"
    >
      <div className="aspect-square bg-amber-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23fef3c7"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23d97706"%3ELa Casa Amarilla%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-amber-900 text-base mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-amber-700/80 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>
        <span className="text-lg font-bold text-amber-600">
          ${product.price.toFixed(2)} MXN
        </span>
      </div>
    </button>
  );
}
