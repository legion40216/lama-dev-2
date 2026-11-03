import React from "react";

import { ProductsType } from "@/types";

import ProductCard from "./product-card";
import EmptyState from "./empty-state";

export default function ProductList({ initialData }: { initialData: ProductsType }) {
  return (
    <div>
      {initialData.length > 0 ? (
        <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(min(180px,100%),1fr))]">
          {initialData.map((item) => (
            <div key={item.id}>
             <ProductCard  
                id={item.id}
                name={item.name}
                description={item.description}
                images={item.images}
                sizes={item.sizes}          
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
