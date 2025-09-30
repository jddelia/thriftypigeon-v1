import { db } from '@/db/client';
import { 
  playbooks, 
  playbookPlatforms, 
  playbookAnalytics, 
  playbookTestimonials,
  playbookVersions,
  playbookPurchases,
  type Playbook,
  type NewPlaybook,
  type PlaybookPlatform,
  type NewPlaybookPlatform,
  type NewPlaybookAnalytics
} from '@/db/schema';
import { eq, desc, and, sql, count, sum, avg } from 'drizzle-orm';
import { z } from 'zod';

// ==========================================
// INPUT VALIDATION SCHEMAS
// ==========================================

export const createPlaybookSchema = z.object({
  sku: z.string().min(1).regex(/^[a-z0-9-]+$/, 'SKU must be lowercase with hyphens only'),
  title: z.string().min(1).max(200),
  headline: z.string().min(1).max(500),
  shortDescription: z.string().min(1).max(1000),
  longDescription: z.string().optional(),
  featureBullets: z.array(z.string()).min(1).max(10),
  
  // Pricing
  basePriceCents: z.number().min(100), // Minimum $1.00
  currency: z.string().default('USD'),
  
  // Media
  coverImageUrl: z.string().url().optional(),
  coverImageAlt: z.string().optional(),
  demoVideoUrl: z.string().url().optional(),
  
  // Content Management
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  
  // SEO
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const updatePlaybookSchema = createPlaybookSchema.partial().omit({ sku: true });

export const addPlatformSchema = z.object({
  platform: z.enum(['stripe', 'lemonsqueezy', 'gumroad']),
  externalProductId: z.string().min(1),
  externalPriceId: z.string().optional(),
  priceCents: z.number().min(100),
  checkoutUrl: z.string().url().optional(),
  platformConfig: z.record(z.any()).default({}),
});

// ==========================================
// PLAYBOOK SERVICE CLASS
// ==========================================

export class PlaybookService {
  
  // ==========================================
  // CRUD OPERATIONS
  // ==========================================
  
  async createPlaybook(data: z.infer<typeof createPlaybookSchema>): Promise<Playbook> {
    const validatedData = createPlaybookSchema.parse(data);
    
    // Generate slug from title
    const slug = this.generateSlug(validatedData.title);
    
    // Check if SKU or slug already exists
    const existing = await db.select()
      .from(playbooks)
      .where(
        sql`${playbooks.sku} = ${validatedData.sku} OR ${playbooks.slug} = ${slug}`
      )
      .limit(1);
    
    if (existing.length > 0) {
      throw new Error(`Playbook with SKU "${validatedData.sku}" or slug "${slug}" already exists`);
    }
    
    // Create search content for full-text search
    const searchContent = [
      validatedData.title,
      validatedData.headline, 
      validatedData.shortDescription,
      validatedData.longDescription || '',
      ...validatedData.featureBullets,
      ...(validatedData.tags || [])
    ].join(' ').toLowerCase();
    
    const newPlaybook = await db.insert(playbooks).values({
      ...validatedData,
      slug,
      searchContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    // Create initial version record
    await this.createVersion(newPlaybook[0].id, {
      version: '1.0',
      versionType: 'major',
      changeSummary: 'Initial creation',
      changedBy: 'system',
    });
    
    console.log(`✅ Created playbook: ${validatedData.title} (${validatedData.sku})`);
    return newPlaybook[0];
  }
  
  async updatePlaybook(id: string, data: z.infer<typeof updatePlaybookSchema>): Promise<Playbook> {
    const validatedData = updatePlaybookSchema.parse(data);
    
    // Get current version for comparison
    const current = await this.getPlaybookById(id);
    if (!current) {
      throw new Error(`Playbook with ID "${id}" not found`);
    }
    
    // Update slug if title changed
    let updateData: any = { ...validatedData, updatedAt: new Date() };
    if (validatedData.title && validatedData.title !== current.title) {
      updateData.slug = this.generateSlug(validatedData.title);
    }
    
    // Update search content if any searchable fields changed
    if (validatedData.title || validatedData.headline || validatedData.shortDescription) {
      updateData.searchContent = [
        validatedData.title || current.title,
        validatedData.headline || current.headline,
        validatedData.shortDescription || current.shortDescription,
        validatedData.longDescription || current.longDescription || '',
        ...(validatedData.featureBullets || current.featureBullets || []),
        ...(validatedData.tags || current.tags || [])
      ].join(' ').toLowerCase();
    }
    
    const updated = await db.update(playbooks)
      .set(updateData)
      .where(eq(playbooks.id, id))
      .returning();
    
    if (updated.length === 0) {
      throw new Error(`Failed to update playbook with ID "${id}"`);
    }
    
    // Create new version if significant changes
    const hasSignificantChanges = validatedData.title || validatedData.headline || 
                                  validatedData.basePriceCents || validatedData.featureBullets;
    
    if (hasSignificantChanges) {
      await this.createVersion(id, {
        version: this.incrementVersion(current.version, 'minor'),
        versionType: 'minor',
        changeSummary: 'Content update',
        changedBy: 'admin', // TODO: Get from auth context
      });
    }
    
    console.log(`✅ Updated playbook: ${updated[0].title} (${updated[0].sku})`);
    return updated[0];
  }
  
  async publishPlaybook(id: string): Promise<Playbook> {
    const updated = await db.update(playbooks)
      .set({ 
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(playbooks.id, id))
      .returning();
    
    if (updated.length === 0) {
      throw new Error(`Playbook with ID "${id}" not found`);
    }
    
    console.log(`📢 Published playbook: ${updated[0].title}`);
    return updated[0];
  }
  
  async archivePlaybook(id: string): Promise<Playbook> {
    const updated = await db.update(playbooks)
      .set({ 
        status: 'archived',
        updatedAt: new Date()
      })
      .where(eq(playbooks.id, id))
      .returning();
    
    if (updated.length === 0) {
      throw new Error(`Playbook with ID "${id}" not found`);
    }
    
    console.log(`📦 Archived playbook: ${updated[0].title}`);
    return updated[0];
  }
  
  async deletePlaybook(id: string): Promise<void> {
    // Soft delete
    await db.update(playbooks)
      .set({ 
        deletedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(playbooks.id, id));
    
    console.log(`🗑️  Soft deleted playbook: ${id}`);
  }
  
  // ==========================================
  // QUERY OPERATIONS
  // ==========================================
  
  async getPlaybookById(id: string): Promise<Playbook | null> {
    const result = await db.select()
      .from(playbooks)
      .where(and(
        eq(playbooks.id, id),
        sql`${playbooks.deletedAt} IS NULL`
      ))
      .limit(1);
    
    return result[0] || null;
  }
  
  async getPlaybookBySku(sku: string): Promise<Playbook | null> {
    const result = await db.select()
      .from(playbooks)
      .where(and(
        eq(playbooks.sku, sku),
        sql`${playbooks.deletedAt} IS NULL`
      ))
      .limit(1);
    
    return result[0] || null;
  }
  
  async getPlaybookBySlug(slug: string): Promise<Playbook | null> {
    const result = await db.select()
      .from(playbooks)
      .where(and(
        eq(playbooks.slug, slug),
        sql`${playbooks.deletedAt} IS NULL`
      ))
      .limit(1);
    
    return result[0] || null;
  }
  
  async listPlaybooks(options: {
    status?: 'draft' | 'published' | 'archived';
    category?: string;
    limit?: number;
    offset?: number;
    orderBy?: 'created_at' | 'updated_at' | 'total_views' | 'total_purchases' | 'total_revenue_cents';
    orderDirection?: 'asc' | 'desc';
  } = {}): Promise<Playbook[]> {
    let query = db.select().from(playbooks);
    
    // Apply filters
    const conditions = [sql`${playbooks.deletedAt} IS NULL`];
    
    if (options.status) {
      conditions.push(eq(playbooks.status, options.status));
    }
    
    if (options.category) {
      conditions.push(eq(playbooks.category, options.category));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply ordering
    const orderByField = playbooks[options.orderBy || 'createdAt'];
    const orderDirection = options.orderDirection || 'desc';
    
    query = query.orderBy(orderDirection === 'desc' ? desc(orderByField) : orderByField);
    
    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.offset(options.offset);
    }
    
    return await query;
  }
  
  async searchPlaybooks(searchTerm: string, limit = 10): Promise<Playbook[]> {
    const searchQuery = `%${searchTerm.toLowerCase()}%`;
    
    return await db.select()
      .from(playbooks)
      .where(and(
        sql`${playbooks.searchContent} LIKE ${searchQuery}`,
        sql`${playbooks.deletedAt} IS NULL`,
        eq(playbooks.status, 'published')
      ))
      .limit(limit)
      .orderBy(desc(playbooks.totalViews));
  }
  
  // ==========================================
  // PLATFORM MANAGEMENT
  // ==========================================
  
  async addPlatform(playbookId: string, data: z.infer<typeof addPlatformSchema>): Promise<PlaybookPlatform> {
    const validatedData = addPlatformSchema.parse(data);
    
    const platform = await db.insert(playbookPlatforms).values({
      playbookId,
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    console.log(`🔗 Added ${validatedData.platform} integration for playbook ${playbookId}`);
    return platform[0];
  }
  
  async updatePlatform(
    playbookId: string, 
    platform: string, 
    updates: Partial<z.infer<typeof addPlatformSchema>>
  ): Promise<PlaybookPlatform> {
    const updated = await db.update(playbookPlatforms)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(
        eq(playbookPlatforms.playbookId, playbookId),
        eq(playbookPlatforms.platform, platform)
      ))
      .returning();
    
    if (updated.length === 0) {
      throw new Error(`Platform integration not found: ${platform} for playbook ${playbookId}`);
    }
    
    console.log(`🔄 Updated ${platform} integration for playbook ${playbookId}`);
    return updated[0];
  }
  
  async getPlatforms(playbookId: string): Promise<PlaybookPlatform[]> {
    return await db.select()
      .from(playbookPlatforms)
      .where(eq(playbookPlatforms.playbookId, playbookId))
      .orderBy(playbookPlatforms.platform);
  }
  
  // ==========================================
  // ANALYTICS TRACKING
  // ==========================================
  
  async trackEvent(event: {
    playbookId: string;
    eventType: 'view' | 'add_to_cart' | 'purchase' | 'refund';
    platform?: string;
    userId?: string;
    sessionId?: string;
    visitorId?: string;
    referrerUrl?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    articleSlug?: string;
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    countryCode?: string;
    revenueCents?: number;
    metadata?: Record<string, any>;
  }): Promise<void> {
    // Insert analytics event
    await db.insert(playbookAnalytics).values({
      ...event,
      createdAt: new Date(),
    });
    
    // Update playbook aggregated stats
    if (event.eventType === 'view') {
      await this.incrementPlaybookStat(event.playbookId, 'totalViews', 1);
    } else if (event.eventType === 'purchase') {
      await Promise.all([
        this.incrementPlaybookStat(event.playbookId, 'totalPurchases', 1),
        this.incrementPlaybookStat(event.playbookId, 'totalRevenueCents', event.revenueCents || 0)
      ]);
      
      // Recalculate conversion rate
      await this.updateConversionRate(event.playbookId);
    }
  }
  
  private async incrementPlaybookStat(
    playbookId: string, 
    field: 'totalViews' | 'totalPurchases' | 'totalRevenueCents', 
    increment: number
  ): Promise<void> {
    await db.update(playbooks)
      .set({
        [field]: sql`${playbooks[field]} + ${increment}`,
        updatedAt: new Date()
      })
      .where(eq(playbooks.id, playbookId));
  }
  
  private async updateConversionRate(playbookId: string): Promise<void> {
    const stats = await db.select({
      totalViews: playbooks.totalViews,
      totalPurchases: playbooks.totalPurchases
    })
    .from(playbooks)
    .where(eq(playbooks.id, playbookId))
    .limit(1);
    
    if (stats[0] && stats[0].totalViews > 0) {
      const conversionRate = stats[0].totalPurchases / stats[0].totalViews;
      
      await db.update(playbooks)
        .set({ 
          conversionRate,
          updatedAt: new Date()
        })
        .where(eq(playbooks.id, playbookId));
    }
  }
  
  // ==========================================
  // ANALYTICS REPORTING
  // ==========================================
  
  async getPlaybookAnalytics(playbookId: string, options: {
    dateFrom?: Date;
    dateTo?: Date;
  } = {}): Promise<{
    totalViews: number;
    totalPurchases: number;
    totalRevenue: number;
    conversionRate: number;
    dailyStats: Array<{
      date: string;
      views: number;
      purchases: number;
      revenue: number;
    }>;
    topSources: Array<{
      source: string;
      views: number;
      purchases: number;
    }>;
  }> {
    // Get playbook summary stats
    const playbook = await this.getPlaybookById(playbookId);
    if (!playbook) {
      throw new Error(`Playbook ${playbookId} not found`);
    }
    
    // Build date filter conditions
    const conditions = [eq(playbookAnalytics.playbookId, playbookId)];
    
    if (options.dateFrom) {
      conditions.push(sql`${playbookAnalytics.createdAt} >= ${Math.floor(options.dateFrom.getTime() / 1000)}`);
    }
    
    if (options.dateTo) {
      conditions.push(sql`${playbookAnalytics.createdAt} <= ${Math.floor(options.dateTo.getTime() / 1000)}`);
    }
    
    // Get daily aggregated stats
    const dailyStats = await db.select({
      date: sql`DATE(datetime(${playbookAnalytics.createdAt}, 'unixepoch'))`.as('date'),
      views: count(sql`CASE WHEN ${playbookAnalytics.eventType} = 'view' THEN 1 END`).as('views'),
      purchases: count(sql`CASE WHEN ${playbookAnalytics.eventType} = 'purchase' THEN 1 END`).as('purchases'),
      revenue: sum(sql`CASE WHEN ${playbookAnalytics.eventType} = 'purchase' THEN ${playbookAnalytics.revenueCents} ELSE 0 END`).as('revenue')
    })
    .from(playbookAnalytics)
    .where(and(...conditions))
    .groupBy(sql`DATE(datetime(${playbookAnalytics.createdAt}, 'unixepoch'))`)
    .orderBy(sql`date DESC`)
    .limit(30);
    
    // Get top traffic sources
    const topSources = await db.select({
      source: sql`COALESCE(${playbookAnalytics.utmSource}, 'direct')`.as('source'),
      views: count(sql`CASE WHEN ${playbookAnalytics.eventType} = 'view' THEN 1 END`).as('views'),
      purchases: count(sql`CASE WHEN ${playbookAnalytics.eventType} = 'purchase' THEN 1 END`).as('purchases')
    })
    .from(playbookAnalytics)
    .where(and(...conditions))
    .groupBy(sql`COALESCE(${playbookAnalytics.utmSource}, 'direct')`)
    .orderBy(desc(sql`views`))
    .limit(10);
    
    return {
      totalViews: playbook.totalViews,
      totalPurchases: playbook.totalPurchases,
      totalRevenue: playbook.totalRevenueCents,
      conversionRate: playbook.conversionRate,
      dailyStats: dailyStats.map(stat => ({
        date: stat.date as string,
        views: Number(stat.views),
        purchases: Number(stat.purchases),
        revenue: Number(stat.revenue || 0)
      })),
      topSources: topSources.map(source => ({
        source: source.source as string,
        views: Number(source.views),
        purchases: Number(source.purchases)
      }))
    };
  }
  
  async getDashboardOverview(): Promise<{
    totalPlaybooks: number;
    publishedPlaybooks: number;
    totalViews: number;
    totalPurchases: number;
    totalRevenue: number;
    averageConversionRate: number;
    topPerformers: Array<{
      id: string;
      title: string;
      views: number;
      purchases: number;
      revenue: number;
    }>;
  }> {
    // Get summary stats
    const summaryStats = await db.select({
      totalPlaybooks: count(),
      publishedPlaybooks: count(sql`CASE WHEN ${playbooks.status} = 'published' THEN 1 END`),
      totalViews: sum(playbooks.totalViews),
      totalPurchases: sum(playbooks.totalPurchases),
      totalRevenue: sum(playbooks.totalRevenueCents),
      averageConversionRate: avg(playbooks.conversionRate)
    })
    .from(playbooks)
    .where(sql`${playbooks.deletedAt} IS NULL`);
    
    // Get top performing playbooks
    const topPerformers = await db.select({
      id: playbooks.id,
      title: playbooks.title,
      views: playbooks.totalViews,
      purchases: playbooks.totalPurchases,
      revenue: playbooks.totalRevenueCents
    })
    .from(playbooks)
    .where(and(
      sql`${playbooks.deletedAt} IS NULL`,
      eq(playbooks.status, 'published')
    ))
    .orderBy(desc(playbooks.totalRevenueCents))
    .limit(5);
    
    const stats = summaryStats[0];
    
    return {
      totalPlaybooks: Number(stats.totalPlaybooks || 0),
      publishedPlaybooks: Number(stats.publishedPlaybooks || 0),
      totalViews: Number(stats.totalViews || 0),
      totalPurchases: Number(stats.totalPurchases || 0),
      totalRevenue: Number(stats.totalRevenue || 0),
      averageConversionRate: Number(stats.averageConversionRate || 0),
      topPerformers: topPerformers.map(p => ({
        id: p.id,
        title: p.title,
        views: p.views,
        purchases: p.purchases,
        revenue: p.revenue
      }))
    };
  }
  
  // ==========================================
  // VERSION MANAGEMENT
  // ==========================================
  
  private async createVersion(playbookId: string, versionData: {
    version: string;
    versionType: 'major' | 'minor' | 'patch';
    changeSummary: string;
    changedBy: string;
  }): Promise<void> {
    const playbook = await this.getPlaybookById(playbookId);
    if (!playbook) return;
    
    await db.insert(playbookVersions).values({
      playbookId,
      version: versionData.version,
      versionType: versionData.versionType,
      title: playbook.title,
      headline: playbook.headline,
      shortDescription: playbook.shortDescription,
      longDescription: playbook.longDescription,
      featureBullets: playbook.featureBullets,
      basePriceCents: playbook.basePriceCents,
      changeSummary: versionData.changeSummary,
      changedBy: versionData.changedBy,
      createdAt: new Date(),
    });
  }
  
  // ==========================================
  // UTILITY METHODS
  // ==========================================
  
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .replace(/-+/g, '-')          // Remove duplicate hyphens
      .trim();
  }
  
  private incrementVersion(currentVersion: string, type: 'major' | 'minor' | 'patch'): string {
    const parts = currentVersion.split('.').map(Number);
    
    switch (type) {
      case 'major':
        return `${parts[0] + 1}.0.0`;
      case 'minor':
        return `${parts[0]}.${(parts[1] || 0) + 1}.0`;
      case 'patch':
        return `${parts[0]}.${parts[1] || 0}.${(parts[2] || 0) + 1}`;
      default:
        return currentVersion;
    }
  }
}

// Export singleton instance
export const playbookService = new PlaybookService();