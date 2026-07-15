import React, { useState } from 'react';
import { ShoppingBag, Coins, Check, Sofa, Coffee, Sparkles, X } from 'lucide-react';

export const SHOP_ITEMS = [
  // Furniture/Decor
  {
    id: 'fireplace',
    name: 'Cozy Fireplace',
    category: 'decor',
    cost: 150,
    description: 'A warm stone fireplace with a crackling fire.',
    icon: Sofa
  },
  {
    id: 'bookshelf',
    name: 'Wooden Bookshelf',
    category: 'decor',
    cost: 100,
    description: 'Stocked with books, mugs, and small trinkets.',
    icon: Sofa
  },
  {
    id: 'plants',
    name: 'Hanging Ivy & Ferns',
    category: 'decor',
    cost: 50,
    description: 'Brings some fresh green life into your café.',
    icon: Sofa
  },
  {
    id: 'rug',
    name: 'Plush Sage Rug',
    category: 'decor',
    cost: 80,
    description: 'A soft knit rug for the center floor.',
    icon: Sofa
  },
  // Menu
  {
    id: 'croissant',
    name: 'Buttery Croissants',
    category: 'menu',
    cost: 40,
    description: 'Freshly baked, golden, and super flaky.',
    icon: Coffee
  },
  {
    id: 'matcha',
    name: 'Matcha Latte',
    category: 'menu',
    cost: 60,
    description: 'Frothy green tea latte served in a handmade ceramic mug.',
    icon: Coffee
  },
  {
    id: 'cake',
    name: 'Strawberry Cake',
    category: 'menu',
    cost: 90,
    description: 'A slice of vanilla cream cake topped with fresh strawberries.',
    icon: Coffee
  },
  // Pets
  {
    id: 'cat',
    name: 'Sleeping Ginger Cat',
    category: 'pets',
    cost: 200,
    description: 'A sweet orange kitty who curls up near the warmth.',
    icon: Sparkles
  },
  {
    id: 'dog',
    name: 'Golden Retriever',
    category: 'pets',
    cost: 250,
    description: 'A loyal pup sitting by the window looking at passersby.',
    icon: Sparkles
  },
  // Base Upgrade
  {
    id: 'espresso_machine',
    name: 'Deluxe Espresso Machine',
    category: 'upgrades',
    cost: 120,
    description: 'A shiny brass double-boiler machine that steams perfectly.',
    icon: Sparkles
  }
];

export default function Shop({ coins, unlockedItems, onPurchaseItem, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('decor');

  const categories = [
    { id: 'decor', label: 'Furniture & Decor' },
    { id: 'menu', label: 'Café Menu' },
    { id: 'pets', label: 'Cozy Companions' },
    { id: 'upgrades', label: 'Equipment' }
  ];

  const filteredItems = SHOP_ITEMS.filter(item => item.category === activeTab);

  return (
    <div className={`shop-drawer ${isOpen ? 'open' : ''}`}>
      <div className="shop-header">
        <div className="shop-title">
          <ShoppingBag className="shop-title-icon" size={24} />
          <h2>Café Boutique</h2>
        </div>
        <div className="shop-coins-display">
          <Coins className="coin-icon" size={18} />
          <span>{coins} coins</span>
        </div>
        <button className="shop-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="shop-tabs">
        {categories.map(tab => (
          <button
            key={tab.id}
            className={`shop-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="shop-items-grid">
        {filteredItems.map(item => {
          const isUnlocked = unlockedItems.includes(item.id);
          const canAfford = coins >= item.cost;
          const Icon = item.icon;

          return (
            <div key={item.id} className={`shop-item-card ${isUnlocked ? 'unlocked' : ''}`}>
              <div className="item-visual">
                <div className="item-icon-wrapper">
                  <Icon size={28} className="item-icon" />
                </div>
                {isUnlocked && (
                  <div className="item-unlocked-badge">
                    <Check size={12} />
                    <span>Owned</span>
                  </div>
                )}
              </div>

              <div className="item-details">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                
                <div className="item-action-row">
                  {!isUnlocked && (
                    <div className="item-price">
                      <Coins className="shop-coin-small" size={14} />
                      <span>{item.cost}</span>
                    </div>
                  )}

                  {isUnlocked ? (
                    <button className="item-btn owned" disabled>
                      Placed in Café
                    </button>
                  ) : (
                    <button
                      className={`item-btn buy ${!canAfford ? 'locked' : ''}`}
                      disabled={!canAfford}
                      onClick={() => onPurchaseItem(item)}
                    >
                      {canAfford ? 'Purchase' : 'Need Coins'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
