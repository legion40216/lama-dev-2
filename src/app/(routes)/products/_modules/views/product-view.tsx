import React from 'react'

import { CategorySlug, FilterValue } from '@/schema';

import ProductsCategory from '../sections/products-category'
import CategoriesBar from '../components/categories-bar'

export default function ProductView({
  categoryParam,
  filterParam,
}: {
  categoryParam: CategorySlug;
  filterParam: FilterValue;
}) {
  return (
    <div className="space-y-4">
      <CategoriesBar categoryParam={categoryParam} />
      <ProductsCategory
        categoryParam={categoryParam}
        filterParam={filterParam}
      />
    </div>
  );
}
