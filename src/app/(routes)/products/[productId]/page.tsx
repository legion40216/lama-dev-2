import React from 'react'
import SingleProductView from './_modules/views/single_product-view'

export default function page({params}: {params: {productId: string}}) {
  return (
    <div>
      <SingleProductView productId={params.productId}/>
    </div>
  )
}
