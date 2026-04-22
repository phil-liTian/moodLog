/*
 * @Author: phil
 * @Date: 2026-04-22 20:27:21
 */
import { storage } from '../../utils/storage';
import { MOOD_OPTIONS, MoodType, MoodStatistics } from '../../types/mood';
Page({
  data: {
    year: 2026, month: 4,
    stats: { totalRecords: 0, avgMoodScore: 0, topMood: 'calm' as MoodType, moodCalendar: [], topTags: [], moodDistribution: {} } as MoodStatistics,
    topMoodEmoji: '😌', topMoodName: '平静', moodTrend: '平稳',
    summary: { overview: '', highlights: [], concerns: [], suggestions: [] },
  },
  onLoad(options: any) {
    const year = parseInt(options.year) || new Date().getFullYear();
    const month = parseInt(options.month) || new Date().getMonth() + 1;
    this.setData({ year, month });
    this.loadData();
  },
  loadData() {
    const { year, month } = this.data;
    const stats = storage.getMonthlyStatistics(year, month);
    const topMood = MOOD_OPTIONS.find(m => m.type === stats.topMood);
    const moodTrend = stats.avgMoodScore >= 70 ? '上升 📈' : stats.avgMoodScore >= 50 ? '平稳 ➡️' : '下降 📉';
    const summary = this.generateSummary(stats);
    this.setData({ stats, topMoodEmoji: topMood.emoji || '😌', topMoodName: topMood.name || '平静', moodTrend, summary });
  },
  generateSummary(stats: MoodStatistics): any {
    const { avgMoodScore, totalRecords, topMood, topTags } = stats;
    const overview = totalRecords === 0 ? '本月还没有记录，开始记录心情来获取AI分析吧！' :
      avgMoodScore >= 80 ? `本月你一共记录了${totalRecords}天心情，整体状态非常积极！最常出现的是「${MOOD_OPTIONS.find(m => m.type === topMood).name}」，为你点赞！` :
      avgMoodScore >= 60 ? `本月你记录了${totalRecords}天心情，整体状态还不错。保持积极心态，生活会更美好！` :
      `本月你记录了${totalRecords}天心情，情绪波动较大。记得关爱自己，可以尝试冥想或运动来调节情绪。`;
    const highlights = topTags.slice(0, 3).map(t => `「${t.tag}」是你本月最关注的话题`);
    const concerns = avgMoodScore < 60 ? ['近期情绪较低落，建议多关注自己的心理状态'] : [];
    const suggestions = avgMoodScore < 70 ? ['保持规律作息有助于情绪稳定', '适度运动可以提升心情', '可以尝试记录感恩日记'] : ['继续保持良好的生活习惯', '可以尝试挑战新目标'];
    return { overview, highlights, concerns, suggestions };
  },
});