import React from 'react'

import Image from 'next/image'
import MainSection from '../sections/main-section'
import Link from 'next/link'
import { CategorySlug } from '@/schema'

import { Button } from '@/components/ui/button'

export default function HomepageView({
  categoryParam
}: {
  categoryParam: CategorySlug
}) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/1]">
        <Image src="/assets/featured.png" alt="Garment Store Home" fill />
      </div>

      <MainSection categoryParam={categoryParam}/>

      <div className='flex justify-end'>
        <Button 
          variant={"link"} 
          asChild 
          className="text-muted-foreground"
        >
          <Link href={categoryParam === 'all' ? `/products` : `/products/?category=${categoryParam}`}>
           See All Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
