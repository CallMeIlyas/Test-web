import type { Product } from '../../types/types';

const BestSelling = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "10R / A4",
      size: "25x30cm",
      imageUrl: "../assets/karya/10R.jpg",
      category: "Frames",
      shippedFrom: "Jakarta",
      shippedTo: ["Indonesia"],
      price: 0,
    },
    {
      id: 2,
      name: "12R / A3",
      size: "30x40cm",
      imageUrl: "../assets/karya/12R-6.jpg",
      category: "Frames",
      shippedFrom: "Jakarta",
      shippedTo: ["Indonesia"],
      price: 0,
    },
    {
      id: 3,
      name: "A2",
      size: "40x55cm",
      imageUrl: "../assets/karya/55x80cm.jpg",
      category: "Frames",
      shippedFrom: "Jakarta",
      shippedTo: ["Indonesia"],
      price: 0,
    },
    {
      id: 4,
      name: "A1",
      size: "55x80cm",
      imageUrl: "../assets/karya/80x110cm.jpeg",
      category: "Frames",
      shippedFrom: "Jakarta",
      shippedTo: ["Indonesia"],
      price: 0,
    },
  ];

  return (
    <>
      {/* Border */}
      <div className="relative my-10 text-center h-[1px]">
        <div className="absolute top-0 left-0 w-1/4 border-t-[5px] border-black"></div>
        <div className="absolute top-0 right-0 w-1/4 border-t-[5px] border-black"></div>
      </div>

      <section className="py-16 bg-white">
        <h2 className="font-nataliecaydence text-[46px] text-4xl text-center mb-10 text-black">
          Best Selling Frames
        </h2>
        <div className="grid grid-cols-4 gap-5 px-10 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="text-center bg-white p-5 rounded-xl shadow-md hover:-translate-y-1 transition-transform"
            >
              <img
                src={product.imageUrl}
                alt={`Frame ${product.name}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p className="m-2.5 font-bold text-gray-600 text-base">
                {product.name}
                <br />
                {product.size}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default BestSelling;