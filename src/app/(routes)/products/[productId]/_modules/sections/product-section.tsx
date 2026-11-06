"use client";
import React, { useState } from 'react';
import { products } from '@/data/data';
import Image from 'next/image';

import ProductDetails from '../components/product-details';

interface ProductSectionProps {
  productId: string;
}

export default function ProductSection({ productId }: ProductSectionProps) {
  const product = products.find(p => p.id.toString() === productId);
  
  if (!product) {
    return <div>Product not found</div>;
  }

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0]?.size || ""
  );

  const [colorsBySize, setColorsBySize] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.sizes.forEach(sizeObj => {
      initial[sizeObj.size] = sizeObj.variants[0]?.color || "";
    });
    return initial;
  });

  const [mainImage, setMainImage] = useState<string>(product.images[0]);

  // Get current size object
  const getCurrentSizeObj = () => {
    return product.sizes.find(s => s.size === selectedSize) || product.sizes[0];
  };

  // Get active variant based on selected size and color
  const getActiveVariant = () => {
    const sizeObj = getCurrentSizeObj();
    const currentColor = colorsBySize[selectedSize];
    return sizeObj?.variants.find(v => v.color === currentColor) || sizeObj?.variants[0];
  };

  // Update main image when variant changes
  React.useEffect(() => {
    const activeVariant = getActiveVariant();
    if (activeVariant?.image) {
      setMainImage(activeVariant.image);
    } else if (product.images[0]) {
      setMainImage(product.images[0]);
    }
  }, [selectedSize, colorsBySize]);

  const activeVariant = getActiveVariant();
  
  // Create image gallery from product images
  const imageGallery = React.useMemo(() => {
    const images: string[] = [];
    
    // Add general product images
    product.images.forEach(img => {
      if (!images.includes(img)) {
        images.push(img);
      }
    });
    
    return images;
  }, [product.images]);

  const handleThumbnailClick = (image: string) => {
    setMainImage(image);
    
    // Find which color this image belongs to for the current size
    const sizeObj = getCurrentSizeObj();
    const variant = sizeObj?.variants.find(v => v.image === image);
    
    if (variant) {
      setColorsBySize(prev => ({
        ...prev,
        [selectedSize]: variant.color
      }));
    }
  };

  // Get all available sizes from product
  const availableSizes = product.sizes.map(s => s.size);

  return (
    <div className='grid md:grid-cols-2 gap-8'>
      {/* Left Side - Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className='aspect-square relative w-full rounded-lg 
              overflow-hidden border border-gray-200'
        >
          <Image 
            src={mainImage} 
            alt={`${product.name} - ${activeVariant?.color}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Thumbnail Gallery */}
        {imageGallery.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {imageGallery.map((img, index) => {
              const sizeObj = getCurrentSizeObj();
              const variant = sizeObj?.variants.find(v => v.image === img);
              const isAvailable = !!variant;
              
              return (
                <button
                  key={index}
                  title={isAvailable ? `${variant.color}` : 'Not available in this size'}
                  onClick={() => handleThumbnailClick(img)}
                  disabled={!isAvailable}
                  aria-label={isAvailable ? `View ${variant.color} variant` : 'Not available in this size'}
                  className={`
                    aspect-square relative rounded-md overflow-hidden border-2 
                    transition-all hover:border-gray-400 p-0
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${img === mainImage ? 'border-black ring-2 ring-black' : 'border-gray-200'}
                  `}
                >
                  <Image 
                    src={img}
                    alt={`${product.name} - ${variant?.color || 'variant'}`}
                    fill
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Side - Product Details */}
      <div>
        <ProductDetails
          id={product.id}
          images={product.images} 
          name={product.name}
          description={product.description}
          availableSizes={availableSizes}
          allColors={product.colors}
          sizes={product.sizes}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          colorsBySize={colorsBySize}
          setColorsBySize={setColorsBySize}
        />
      </div>
    </div>
  );
}