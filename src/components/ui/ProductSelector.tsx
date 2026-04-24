import { useState } from 'react'
import { SPORTS, PRODUCTS } from '../../data/mockData'
import type { Product } from '../../types'

interface ProductSelectorProps {
  selectedProduct: Product
  onProductChange: (product: Product) => void
}

export default function ProductSelector({ selectedProduct, onProductChange }: ProductSelectorProps) {
  const [selectedSport, setSelectedSport] = useState(selectedProduct.sport)

  const filteredProducts = PRODUCTS.filter(p => p.sport === selectedSport)
  const years = [...new Set(filteredProducts.map(p => p.year))].sort((a, b) => b - a)

  function handleSportChange(sport: string) {
    setSelectedSport(sport)
    const firstProduct = PRODUCTS.find(p => p.sport === sport)
    if (firstProduct) onProductChange(firstProduct)
  }

  function handleProductChange(productId: string) {
    const product = PRODUCTS.find(p => p.id === productId)
    if (product) onProductChange(product)
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={selectedSport}
        onChange={e => handleSportChange(e.target.value)}
        className="bg-[#1c1c30] border border-[#252540] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
      >
        {SPORTS.map(sport => (
          <option key={sport.id} value={sport.id}>{sport.abbreviation}</option>
        ))}
      </select>

      <select
        value={selectedProduct.year}
        onChange={e => {
          const yr = parseInt(e.target.value)
          const p = filteredProducts.find(prod => prod.year === yr)
          if (p) onProductChange(p)
        }}
        className="bg-[#1c1c30] border border-[#252540] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
      >
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select
        value={selectedProduct.id}
        onChange={e => handleProductChange(e.target.value)}
        className="bg-[#1c1c30] border border-[#252540] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer min-w-[200px]"
      >
        {filteredProducts
          .filter(p => p.year === selectedProduct.year)
          .map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))
        }
      </select>
    </div>
  )
}
