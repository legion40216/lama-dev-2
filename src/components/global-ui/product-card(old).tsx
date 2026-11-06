"use client";
import React from "react";
import { ProductType } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import useCart from "@/hooks/useCartStore";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { formatter } from "@/utils/formatters";

interface ProductCardProps
  extends Pick<ProductType, "id" | "name" | "description" | "images" | "sizes"> {}

export default function ProductCard({
  id,
  name,
  description,
  images,
  sizes,
}: ProductCardProps) {
  const { addItem, removeItem, getItemCount } = useCart();

  const [selectedSize, setSelectedSize] = React.useState<string>(
    sizes[0]?.size || ""
  );

  const [colorsBySize, setColorsBySize] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    sizes.forEach(sizeObj => {
      initial[sizeObj.size] = sizeObj.variants[0]?.color || "";
    });
    return initial;
  });

  const getCurrentSizeObj = () => {
    return sizes.find(s => s.size === selectedSize) || sizes[0];
  };

  const getActiveVariant = () => {
    const sizeObj = getCurrentSizeObj();
    const currentColor = colorsBySize[selectedSize];
    return sizeObj?.variants.find(v => v.color === currentColor) || sizeObj?.variants[0];
  };

  const getDiscount = () => {
    return getCurrentSizeObj()?.discount ?? 0;
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    
    const newSizeObj = sizes.find(s => s.size === size);
    if (newSizeObj && !colorsBySize[size]) {
      setColorsBySize(prev => ({
        ...prev,
        [size]: newSizeObj.variants[0]?.color || ""
      }));
    }
  };

  const handleColorChange = (color: string) => {
    setColorsBySize(prev => ({
      ...prev,
      [selectedSize]: color,
    }));
  };

  const handleAddToCart = () => {
    const activeVariant = getActiveVariant();
    const sizeObj = getCurrentSizeObj();

    if (!sizeObj || !activeVariant) return;

    addItem({
      id: id.toString(),
      title: name,
      description: description,
      image: activeVariant.image || images[0] || "/placeholder.png",
      price: sizeObj.price,
      discount: sizeObj.discount || 0,
      selectedSize,
      selectedColor: colorsBySize[selectedSize],
    });
  };

  const handleRemoveFromCart = () => {
    removeItem(id.toString(), selectedSize, colorsBySize[selectedSize]);
  };

  const activeVariant = getActiveVariant();
  const sizeObj = getCurrentSizeObj();
  const finalPrice = sizeObj.price - getDiscount();
  const hasDiscount = getDiscount() > 0;
  const isStandalone = sizes.length === 1 && sizes[0].size === "One Size";

  // Check if this specific combination is in cart
  const itemCountInCart = getItemCount(
    id.toString(),
    selectedSize,
    colorsBySize[selectedSize]
  );
  
  const isInCart = itemCountInCart > 0;

  return (
    <div className="space-y-4 rounded-lg p-3 border shadow-sm">
      {/* Product Image */}
      <Link href={`/products/${id}`} className="block">
        <div className="relative w-full h-60 rounded-md overflow-hidden bg-gray-100">
          <Image
            src={activeVariant?.image || images?.[0] || "/placeholder.png"}
            alt={`${name} - ${activeVariant?.color}`}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Title */}
      <h3 className="font-semibold text-lg">{name}</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground">{description}</p>

      {/* Sizes + Colors */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Select Size - Hide if standalone product */}
        {!isStandalone && (
          <Select value={selectedSize} onValueChange={handleSizeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Size" />
            </SelectTrigger>

            <SelectContent>
              {sizes?.map((item, index) => (
                <SelectItem key={index} value={item.size}>
                  {item.size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Select Color - Show available colors for current size */}
        <RadioGroup
          value={colorsBySize[selectedSize] || ""}
          onValueChange={handleColorChange}
          className="flex gap-2"
        >
          {sizeObj?.variants?.map((variant, index) => (
            <RadioGroupItem
              key={index}
              value={variant.color}
              id={`${id}-${selectedSize}-${variant.color}`}
              className="size-6 rounded-full border-2 border-gray-300
                         data-[state=checked]:border-black disabled:opacity-50"
              style={{ backgroundColor: variant.colorCode }}
              title={`${variant.color} ${
                variant.stock === 0 ? "(Out of Stock)" : ""
              }`}
              disabled={variant.stock === 0}
            />
          ))}
        </RadioGroup>
      </div>

      {/* Price + Add to Cart */}
      <div className="space-y-4 pt-3 ">
        <div className="flex justify-between">
          <span className="font-semibold text-lg">
            {formatter.format(finalPrice)}
          </span>

          <>
            {hasDiscount && (
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground line-through">
                  {formatter.format(sizeObj.price)}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  Save {formatter.format(getDiscount())}
                </span>
              </div>
            )}
          </>
        </div>

        <div className="flex justify-end">
          {isInCart ? (
            <Button variant="outline" onClick={handleRemoveFromCart}>
              <ShoppingCart className="size-5 mr-2" />
              Remove from Cart
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleAddToCart}
              disabled={activeVariant?.stock === 0}
            >
              <ShoppingCart className="size-5 mr-2" />
              {activeVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}