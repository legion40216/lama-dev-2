"use client";
import React from 'react';

import { categories } from '@/data/data';
import { useSearchParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function CategoriesBar({categoryParam}: {categoryParam: string | string[]}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", slug);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] 
          gap-2 bg-gray-100 p-2 rounded-md"
    >
      {categories.map((items, index) => {
        const Icon = items.icon;
        const isActive = categoryParam === items.slug;

        return (
          <Button
            key={index}
            onClick={() => handleCategoryClick(items.slug)}
            variant={"default"}
            className={`text-sm bg-transparent hover:bg-lama-primary-background 
                       hover:!text-primary 
                       !text-muted-foreground 
                       ${isActive ? "!text-primary bg-lama-primary-background" : ""}
                       `}
          >
            <span className="mr-2">
              <Icon className="size-5" />
            </span>
            {items.name}
          </Button>
        );
      })}
    </div>
  );
}