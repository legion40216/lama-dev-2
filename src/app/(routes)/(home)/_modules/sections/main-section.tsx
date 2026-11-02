"use client"
import React from 'react'

import { products } from '@/data/data'
import { CategorySlug } from '@/schema'

import ProductList from '@/components/global-ui/product-list'
import CategoriesBar from '../components/categories-bar'

export default function MainSection({
  categoryParam
}: {
  categoryParam: CategorySlug
}) {

  const filteredProducts = typeof categoryParam === 'string'
    ? categoryParam === 'all' ? products : products.filter(product => product.category.toLowerCase() === categoryParam.toLowerCase())
    : products;
    
  return (
    <div className='space-y-2'>
      <CategoriesBar categoryParam={categoryParam}/>
      <div className='mb-2'>
        <ProductList initialData={filteredProducts} />
      </div>
    </div>
  )
}
