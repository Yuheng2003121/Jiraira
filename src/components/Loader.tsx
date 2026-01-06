import { LoaderCircleIcon } from 'lucide-react';
import React from 'react'

export default function Loader() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <LoaderCircleIcon className="text-neutral-500 animate-spin" />
    </div>
  );
}
