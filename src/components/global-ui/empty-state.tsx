"use client";
import React from 'react';

export default function EmptyState({
  title = "",
  subtitle = "",
  children,
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 place-content-center h-[60vh] space-y-4">
      <div className="text-center">
        <p className="text-2xl font-bold">{title}</p>
        <p className="font-light text-neutral-500">{subtitle}</p>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
