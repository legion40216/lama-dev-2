// products-category.tsx
"use client";
import React from 'react'

import { ProductType } from '@/types';
import { CategorySlug, FilterValue } from '@/schema';
import { products } from '@/data/data';

import ProductList from '@/components/global-ui/product-list'
import ProductListFilter from '../components/product_list-filter';

function getMinPrice(product: ProductType): number {
  if (!product.sizes?.length) return 0;
  return Math.min(...product.sizes.map(size => size.price));
}

function sortProducts(products: ProductType[], filter: FilterValue): ProductType[] {
  const sorted = [...products]; // Don't mutate original

  switch (filter) {
    case "newest":
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    
    case "oldest":
      return sorted.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    
    case "price_low_high":
      return sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    
    case "price_high_low":
      return sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
    
    default:
      return sorted;
  }
}

export default function ProductsCategory({
  categoryParam,
  filterParam,
}: {
  categoryParam: CategorySlug;
  filterParam: FilterValue;
}) {
  // Filter by category
  const categoryFiltered = categoryParam === "all"
    ? products
    : products.filter(
        (product) =>
          product.category.toLowerCase() === categoryParam.toLowerCase()
      );

  // Sort
  const filteredAndSorted = sortProducts(categoryFiltered, filterParam);

  return (
    <div className='space-y-4'>
      <div className='flex justify-end items-center'>
         <ProductListFilter currentFilter={filterParam} />
      </div>
     
      <ProductList initialData={filteredAndSorted} />
    </div>
  );
}