'use client';

import { PageContainer } from '@/components/layout/page-container';
import { useState } from 'react';
import { Search, Plus, Edit, Trash, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export default function ProductsTablePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products] = useState<Product[]>([
    { id: '1', name: 'Wireless Headphones', category: 'Electronics', price: 99.99, stock: 45, status: 'in_stock' },
    { id: '2', name: 'Smart Watch', category: 'Electronics', price: 249.99, stock: 12, status: 'low_stock' },
    { id: '3', name: 'Laptop Stand', category: 'Accessories', price: 49.99, stock: 0, status: 'out_of_stock' },
    { id: '4', name: 'USB-C Cable', category: 'Accessories', price: 19.99, stock: 150, status: 'in_stock' },
    { id: '5', name: 'Mechanical Keyboard', category: 'Electronics', price: 129.99, stock: 8, status: 'low_stock' },
  ]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'low_stock':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'out_of_stock':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    }
  };

  return (
    <PageContainer
      title="Products"
      description="Manage your product inventory"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tables', href: '/tables' },
        { title: 'Products' },
      ]}
      actions={
        <button className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Accessories</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.category}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4 text-sm">{product.stock} units</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="rounded-lg p-2 hover:bg-accent transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-accent transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-destructive/10 text-destructive transition-colors">
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredProducts.length}</span> of{' '}
              <span className="font-medium">{products.length}</span> products
            </p>
            <div className="flex items-center space-x-2">
              <button className="rounded-lg border px-3 py-1 text-sm hover:bg-accent transition-colors">
                Previous
              </button>
              <button className="rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                1
              </button>
              <button className="rounded-lg border px-3 py-1 text-sm hover:bg-accent transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

