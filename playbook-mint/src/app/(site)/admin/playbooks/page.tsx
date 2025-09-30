'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Playbook {
  id: string;
  sku: string;
  slug: string;
  title: string;
  headline: string;
  shortDescription: string;
  basePriceCents: number;
  currency: string;
  status: 'draft' | 'published' | 'archived';
  category?: string;
  totalViews: number;
  totalPurchases: number;
  totalRevenueCents: number;
  createdAt: string;
  updatedAt: string;
  platforms?: Array<{
    platform: string;
    isActive: boolean;
    syncStatus: string;
  }>;
}

export default function PlaybooksManagement() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchPlaybooks();
  }, [filters]);

  const fetchPlaybooks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.category) params.set('category', filters.category);
      
      const response = await fetch(`/api/admin/playbooks?${params}`);
      const result = await response.json();
      
      if (result.success) {
        let data = result.data;
        
        // Client-side search filtering
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          data = data.filter((playbook: Playbook) =>
            playbook.title.toLowerCase().includes(searchTerm) ||
            playbook.headline.toLowerCase().includes(searchTerm) ||
            playbook.sku.toLowerCase().includes(searchTerm)
          );
        }
        
        setPlaybooks(data);
      } else {
        setError(result.error || 'Failed to load playbooks');
      }
    } catch (err) {
      setError('Failed to load playbooks');
      console.error('Playbooks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, action: 'publish' | 'archive') => {
    try {
      const response = await fetch(`/api/admin/playbooks/${id}/${action}`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh the list
        fetchPlaybooks();
      } else {
        alert(result.error || `Failed to ${action} playbook`);
      }
    } catch (err) {
      console.error(`Error ${action}ing playbook:`, err);
      alert(`Failed to ${action} playbook`);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Draft</span>;
      case 'archived':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Archived</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const getPlatformStatus = (platforms: Playbook['platforms']) => {
    if (!platforms || platforms.length === 0) {
      return <span className="text-xs text-gray-500">Not synced</span>;
    }

    return (
      <div className="flex space-x-1">
        {platforms.map((platform) => (
          <span
            key={platform.platform}
            className={`text-xs px-2 py-1 rounded ${
              platform.isActive && platform.syncStatus === 'synced'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {platform.platform}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-400">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Playbooks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your playbook catalog and pricing
          </p>
        </div>
        <Link
          href="/admin/playbooks/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          📝 New Playbook
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search playbooks..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              <option value="emergency-fund">Emergency Fund</option>
              <option value="budgeting">Budgeting</option>
              <option value="investing">Investing</option>
              <option value="debt">Debt Management</option>
            </select>
          </div>
        </div>
      </div>

      {/* Playbooks List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {playbooks.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl">📚</span>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No playbooks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first playbook.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/playbooks/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                📝 New Playbook
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {playbooks.map((playbook) => (
              <div key={playbook.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {playbook.title}
                      </h3>
                      {getStatusBadge(playbook.status)}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{playbook.headline}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>💰 {formatCurrency(playbook.basePriceCents)}</span>
                      <span>👁️ {playbook.totalViews} views</span>
                      <span>🛒 {playbook.totalPurchases} purchases</span>
                      {playbook.totalRevenueCents > 0 && (
                        <span>📈 {formatCurrency(playbook.totalRevenueCents)} revenue</span>
                      )}
                    </div>
                    <div className="mt-2">
                      {getPlatformStatus(playbook.platforms)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/playbooks/${playbook.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/playbooks/${playbook.id}/analytics`}
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Analytics
                    </Link>
                    {playbook.status === 'draft' && (
                      <button
                        onClick={() => handleStatusChange(playbook.id, 'publish')}
                        className="text-green-600 hover:text-green-900 text-sm font-medium"
                      >
                        Publish
                      </button>
                    )}
                    {playbook.status === 'published' && (
                      <button
                        onClick={() => handleStatusChange(playbook.id, 'archive')}
                        className="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}