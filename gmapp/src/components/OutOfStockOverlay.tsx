import React from 'react';
import { AlertOctagon } from 'lucide-react';

function OutOfStockOverlay() {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white px-4 py-2 rounded-md flex items-center space-x-2">
        <AlertOctagon className="w-5 h-5 text-red-500" />
        <span className="text-red-500 font-medium">Out of Stock</span>
      </div>
    </div>
  );
}

export default OutOfStockOverlay;