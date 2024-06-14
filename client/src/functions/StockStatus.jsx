const stockStatus = (quantity) => {
    if (quantity > 3) {
      return <span className="text-green-500">En stock</span>;
    } else if (quantity > 0) {
      return <span className="text-orange-500">Plus que {quantity} en stock</span>;
    } else {
      return <span className="text-red-500">En rupture de stock</span>;
    }
  };

  export default stockStatus