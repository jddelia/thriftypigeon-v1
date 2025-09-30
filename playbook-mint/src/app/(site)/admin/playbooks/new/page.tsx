'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PlaybookFormData {
  sku: string;
  title: string;
  headline: string;
  shortDescription: string;
  longDescription: string;
  featureBullets: string[];
  basePriceCents: number;
  currency: string;
  coverImageUrl: string;
  coverImageAlt: string;
  demoVideoUrl: string;
  category: string;
  tags: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  metaTitle: string;
  metaDescription: string;
}

export default function NewPlaybook() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PlaybookFormData>({
    sku: '',
    title: '',
    headline: '',
    shortDescription: '',
    longDescription: '',
    featureBullets: [''],
    basePriceCents: 700, // $7.00 default
    currency: 'USD',
    coverImageUrl: '',
    coverImageAlt: '',
    demoVideoUrl: '',
    category: '',
    tags: [],
    difficultyLevel: 'beginner',
    metaTitle: '',
    metaDescription: '',
  });

  const handleInputChange = (
    field: keyof PlaybookFormData,
    value: string | number | string[]
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFeatureBulletChange = (index: number, value: string) => {
    const bullets = [...formData.featureBullets];
    bullets[index] = value;
    setFormData({ ...formData, featureBullets: bullets });
  };

  const addFeatureBullet = () => {
    setFormData({
      ...formData,
      featureBullets: [...formData.featureBullets, '']
    });
  };

  const removeFeatureBullet = (index: number) => {
    const bullets = formData.featureBullets.filter((_, i) => i !== index);
    setFormData({ ...formData, featureBullets: bullets });
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData({ ...formData, tags });
  };

  const generateSku = () => {
    if (formData.title) {
      const sku = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData({ ...formData, sku });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filter out empty feature bullets
      const cleanedData = {
        ...formData,
        featureBullets: formData.featureBullets.filter(bullet => bullet.trim() !== ''),
        basePriceCents: Number(formData.basePriceCents),
      };

      const response = await fetch('/api/admin/playbooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin/playbooks');
      } else {
        if (result.details) {
          // Validation errors
          const errorMessages = result.details.map((detail: any) => 
            `${detail.field}: ${detail.message}`
          ).join('\n');
          setError(`Validation errors:\n${errorMessages}`);
        } else {
          setError(result.error || 'Failed to create playbook');
        }
      }
    } catch (err) {
      setError('Failed to create playbook');
      console.error('Create playbook error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Playbook</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new playbook to your catalog
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700 whitespace-pre-line">{error}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onBlur={generateSku}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Emergency Fund Blueprint"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="emergency-fund-blueprint"
              />
              <p className="mt-1 text-xs text-gray-500">Lowercase letters, numbers, and hyphens only</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                <option value="emergency-fund">Emergency Fund</option>
                <option value="budgeting">Budgeting</option>
                <option value="investing">Investing</option>
                <option value="debt">Debt Management</option>
                <option value="savings">Savings</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Headline</label>
              <input
                type="text"
                required
                value={formData.headline}
                onChange={(e) => handleInputChange('headline', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Build a 90-day cash buffer in six weeks"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Short Description</label>
              <textarea
                required
                rows={3}
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="A proven system to build emergency savings..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Long Description</label>
              <textarea
                rows={6}
                value={formData.longDescription}
                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Detailed description with markdown support..."
              />
            </div>
          </div>
        </div>

        {/* Feature Bullets */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Bullets</h3>
          <div className="space-y-3">
            {formData.featureBullets.map((bullet, index) => (
              <div key={index} className="flex space-x-3">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => handleFeatureBulletChange(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="4-week sprint plan with accountability check-ins"
                />
                {formData.featureBullets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeatureBullet(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeatureBullet}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Feature Bullet
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Base Price (cents)</label>
              <input
                type="number"
                required
                min="100"
                value={formData.basePriceCents}
                onChange={(e) => handleInputChange('basePriceCents', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="700"
              />
              <p className="mt-1 text-xs text-gray-500">
                {(formData.basePriceCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
              <select
                value={formData.difficultyLevel}
                onChange={(e) => handleInputChange('difficultyLevel', e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Media</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
              <input
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => handleInputChange('coverImageUrl', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image Alt Text</label>
              <input
                type="text"
                value={formData.coverImageAlt}
                onChange={(e) => handleInputChange('coverImageAlt', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Emergency fund blueprint cover"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Demo Video URL</label>
              <input
                type="url"
                value={formData.demoVideoUrl}
                onChange={(e) => handleInputChange('demoVideoUrl', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* SEO & Marketing */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO & Marketing</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Meta Title</label>
              <input
                type="text"
                maxLength={60}
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Emergency Fund Blueprint - The Thrifty Pigeon"
              />
              <p className="mt-1 text-xs text-gray-500">{formData.metaTitle.length}/60 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="emergency, savings, budgeting"
              />
              <p className="mt-1 text-xs text-gray-500">Comma-separated tags</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Meta Description</label>
              <textarea
                maxLength={160}
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Learn how to build a 90-day emergency fund with our proven system..."
              />
              <p className="mt-1 text-xs text-gray-500">{formData.metaDescription.length}/160 characters</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Playbook'}
          </button>
        </div>
      </form>
    </div>
  );
}