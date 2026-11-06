"use client";
import React from "react";
import { ProductColor, ProductType } from "@/types";
import useCart from "@/hooks/useCartStore";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { formatter } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductDetailsProps
  extends Pick<ProductType, "id" | "name" | "description" | "images" | "sizes"> {
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  colorsBySize: Record<string, string>;
  setColorsBySize: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  availableSizes: string[];
  allColors: ProductColor[];
}

export default function ProductDetails({
  id,
  name,
  description,
  images,
  sizes,
  selectedSize,
  setSelectedSize,
  colorsBySize,
  setColorsBySize,
  availableSizes,
  allColors
}: ProductDetailsProps) {
  const { addItem, removeItem, getItemCount, updateItemCount } = useCart();

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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItemCount(id.toString(), selectedSize, colorsBySize[selectedSize], newQuantity);
  };

  const activeVariant = getActiveVariant();
  const sizeObj = getCurrentSizeObj();
  const finalPrice = sizeObj.price - getDiscount();
  const hasDiscount = getDiscount() > 0;
  const isStandalone = sizes.length === 1 && sizes[0].size === "One Size";

  const itemCountInCart = getItemCount(
    id.toString(),
    selectedSize,
    colorsBySize[selectedSize]
  );
  
  const isInCart = itemCountInCart > 0;
  const isOutOfStock = activeVariant?.stock === 0;

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
        {isOutOfStock && (
          <Badge variant="destructive" className="w-fit">
            Out of Stock
          </Badge>
        )}
        {activeVariant &&
          activeVariant.stock > 0 &&
          activeVariant.stock <= 5 && (
            <Badge variant="secondary" className="w-fit">
              Only {activeVariant.stock} left in stock
            </Badge>
          )}
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-4">
        <span className="text-4xl font-bold">
          {formatter.format(finalPrice)}
        </span>
        {hasDiscount && (
          <div className="flex flex-col">
            <span className="text-xl text-muted-foreground line-through">
              {formatter.format(sizeObj.price)}
            </span>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 hover:bg-green-100"
            >
              Save {formatter.format(getDiscount())}
            </Badge>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Description
        </h3>
        <p className="text-base leading-relaxed">{description}</p>
      </div>

      {/* Size Selection */}
      {!isStandalone && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Select Size
          </h3>
          <Select value={selectedSize} onValueChange={handleSizeChange}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Choose a size" />
            </SelectTrigger>
            <SelectContent>
              {availableSizes?.map((item, index) => (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Color Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Select Color
          </h3>
          <span className="text-sm text-muted-foreground">
            ({colorsBySize[selectedSize]})
          </span>
        </div>
        <RadioGroup
          value={colorsBySize[selectedSize] || ""}
          onValueChange={handleColorChange}
          className="flex flex-wrap gap-3"
        >
          {sizeObj?.variants?.map((variant, index) => (
            <div key={index} className="relative">
              <RadioGroupItem
                value={variant.color}
                id={`${id}-${selectedSize}-${variant.color}`}
                className="h-10 w-10 rounded-full border-2 border-gray-300
                           data-[state=checked]:border-black data-[state=checked]:ring-2 
                           data-[state=checked]:ring-offset-2 data-[state=checked]:ring-black
                           disabled:opacity-30 disabled:cursor-not-allowed
                           hover:border-gray-400 transition-all cursor-pointer"
                style={{ backgroundColor: variant.colorCode }}
                title={`${variant.color}${
                  variant.stock === 0 ? " (Out of Stock)" : ""
                }`}
                disabled={variant.stock === 0}
              />
              {variant.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-0.5 bg-red-500 rotate-45" />
                </div>
              )}
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Add to Cart / Quantity Controls */}
      <div className="space-y-4">
        {isInCart ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Quantity in cart
              </span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(itemCountInCart - 1)}
                  disabled={itemCountInCart <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-6 font-semibold">{itemCountInCart}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(itemCountInCart + 1)}
                  disabled={isOutOfStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              size="lg"
              onClick={handleRemoveFromCart}
            >
              Remove from Cart
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2 pt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium">Product ID:</span>
          <span>{id}</span>
        </div>
        {activeVariant && activeVariant.stock > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Availability:</span>
            <span className="text-green-600">In Stock</span>
          </div>
        )}
      </div>
    </div>
  );
}