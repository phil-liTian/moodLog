// 统计页面逻辑
import { storage } from '../../utils/storage';
import { MOOD_OPTIONS, MoodType, MoodStatistics, MoodCalendarItem } from '../../types/mood';

interface TrendItem {
  date: string;
  score: number;
  color: string;
}

interface DistributionItem {
  type: MoodType;
  name: string;
  emoji: string;
  color: string;
  count: number;
  percent: number;
}

Page({
  data: {
    currentYear: 2026,
    currentMonth: 4,
    isCurrentMonth: true,
    
    stats: {
      totalRecords: 0,
      avgMoodScore: 0,
      topMood: 'calm' as MoodType,
      moodCalendar: [] as MoodCalendarItem[],
      topTags: [] as any[],
      moodDistribution: {} as Record<MoodType, number>,
    } as MoodStatistics,
    
    topMoodEmoji: '😌',
    topMoodName: '平静',
    
    trendData: [] as TrendItem[],
    trendLabels: [] as string[],
    
    distributionData: [] as DistributionItem[],
    
    keywordColors: ['#8B5CF6', '#F472B6', '#38BDF8', '#34D399', '#FBBF24'],
    
    aiSummary: null as any,
  },

  onLoad() {
    const now = new Date();
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      isCurrentMonth: true,
    });
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const { currentYear, currentMonth } = this.data;
    
    // 获取统计数据
    const stats = storage.getMonthlyStatistics(currentYear, currentMonth);
    
    // 获取顶部心情
    const topMoodOption = MOOD_OPTIONS.find(m => m.type === stats.topMood);
    
    // 处理趋势数据
    const trendData = this.processTrendData(stats.moodCalendar);
    
    // 处理分布数据
    const distributionData = this.processDistributionData(stats.moodDistribution, stats.totalRecords);
    
    // 获取AI总结
    const aiSummary = this.getAISummary(currentYear, currentMonth);
    
    this.setData({
      stats,
      topMoodEmoji: (topMoodOption && topMoodOption.emoji) || '😌',
      topMoodName: (topMoodOption && topMoodOption.name) || '平静',
      trendData,
      trendLabels: this.getTrendLabels(stats.moodCalendar),
      distributionData,
      aiSummary,
    });
  },

  processTrendData(calendar: MoodCalendarItem[]): TrendItem[] {
    if (calendar.length === 0) return [];
    
    // 取最近14天的数据
    const recent = calendar.slice(-14);
    
    return recent.map(item => {
      const moodOption = MOOD_OPTIONS.find(m => m.type === item.mood);
      return {
        date: item.date,
        score: item.moodScore,
        color: (moodOption && moodOption.color) || '#8B5CF6',
      };
    });
  },

  getTrendLabels(calendar: MoodCalendarItem[]): string[] {
    if (calendar.length === 0) return [];
    
    const recent = calendar.slice(-14);
    return recent.map(item => {
      const day = new Date(item.date).getDate();
      return `${day}日`;
    });
  },

  processDistributionData(distribution: Record<MoodType, number>, total: number): DistributionItem[] {
    if (total === 0) return [];
    
    return MOOD_OPTIONS
      .map(option => ({
        type: option.type,
        name: option.name,
        emoji: option.emoji,
        color: option.color,
        count: distribution[option.type] || 0,
        percent: Math.round(((distribution[option.type] || 0) / total) * 100),
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.percent - a.percent);
  },

  getAISummary(year: number, month: number): any {
    const { avgMoodScore, topMood, totalRecords } = this.data.stats;
    
    if (totalRecords === 0) return null;
    
    const topMoodOption = MOOD_OPTIONS.find(m => m.type === topMood);
    
    // 模拟AI总结
    let overview = '';
    if (avgMoodScore >= 70) {
      overview = `本月你的心情整体不错，平均心情指数达 ${avgMoodScore} 分，最常出现的是「${(topMoodOption && topMoodOption.name)}」，继续保持！`;
    } else if (avgMoodScore >= 50) {
      overview = `本月心情波动较大，平均心情指数 ${avgMudScore} 分。`;
    } else {
      overview = `本月心情较低落，平均心情指数仅 ${avgMoodScore} 分，记得好好照顾自己。`;
    }
    
    return {
      overview,
      moodTrend: avgMoodScore >= 70 ? '上升' : '平稳',
    };
  },

  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    
    if (currentMonth === 1) {
      currentMonth = 12;
      currentYear--;
    } else {
      currentMonth--;
    }
    
    this.setData({
      currentYear,
      currentMonth,
      isCurrentMonth: false,
    });
    this.loadData();
  },

  nextMonth() {
    if (this.data.isCurrentMonth) return;
    
    let { currentYear, currentMonth } = this.data;
    
    if (currentMonth === 12) {
      currentMonth = 1;
      currentYear++;
    } else {
      currentMonth++;
    }
    
    const now = new Date();
    const isCurrentMonth = currentYear === now.getFullYear() && currentMonth === now.getMonth() + 1;
    
    this.setData({
      currentYear,
      currentMonth,
      isCurrentMonth,
    });
    this.loadData();
  },

  goToAIReport() {
    const { currentYear, currentMonth } = this.data;
    wx.navigateTo({
      url: `/pages/ai-report/ai-report?year=${currentYear}&month=${currentMonth}`,
    });
  },
});