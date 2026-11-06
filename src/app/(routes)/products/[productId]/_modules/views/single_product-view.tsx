import React from 'react'
import ProductSection from '../sections/product-section'

export default function SingleProductView({
  productId
}: {
  productId: string
}) {
  return (
    <div>
      <ProductSection 
        productId={productId}
      />
    </div>
  )
}
