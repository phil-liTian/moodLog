// 首页逻辑
import { storage } from '../../utils/storage';
import { MOOD_OPTIONS, MoodType, MoodCalendarItem, TagCount } from '../../types/mood';

interface DisplayRecord {
  recordId: string;
  emoji: string;
  moodName: string;
  dateText: string;
  content: string;
}

interface MonthStats {
  totalRecords: number;
  avgMoodScore: number;
  topMood: MoodType;
  moodCalendar: MoodCalendarItem[];
  topTags: TagCount[];
  moodDistribution: Record<MoodType, number>;
}

Page({
  data: {
    userGreeting: {
      avatar: '👤',
      timeText: '',
      name: '朋友',
    },
    
    currentYear: 2026,
    currentMonth: 4,
    
    showMonthPicker: false,
    pickerYear: 2026,
    pickerMonth: 4,
    
    todayRecord: null as DisplayRecord | null,
    
    monthStats: {
      totalRecords: 0,
      avgMoodScore: 0,
      topMood: 'calm' as MoodType,
      moodCalendar: [] as MoodCalendarItem[],
      topTags: [] as TagCount[],
      moodDistribution: {} as Record<MoodType, number>,
    } as MonthStats,
    
    topMoodEmoji: '😊',
    
    recentRecords: [] as DisplayRecord[],
  },

  onLoad() {
    const now = new Date();
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      pickerYear: now.getFullYear(),
      pickerMonth: now.getMonth() + 1,
    });
    
    this.updateGreeting();
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  // 更新问候语
  updateGreeting() {
    const hour = new Date().getHours();
    let timeText = '';
    let avatar = '👤';
    
    if (hour < 6) {
      timeText = '夜深了';
      avatar = '🌙';
    } else if (hour < 9) {
      timeText = '早上好';
      avatar = '🌅';
    } else if (hour < 12) {
      timeText = '上午好';
      avatar = '☀️';
    } else if (hour < 14) {
      timeText = '中午好';
      avatar = '🌤️';
    } else if (hour < 18) {
      timeText = '下午好';
      avatar = '🌇';
    } else if (hour < 22) {
      timeText = '晚上好';
      avatar = '🌙';
    } else {
      timeText = '夜深了';
      avatar = '🌙';
    }
    
    // 获取用户昵称
    const userInfo = wx.getStorageSync('userInfo') as any;
    const name = (userInfo && userInfo.nickname) || '朋友';
    
    this.setData({
      userGreeting: { timeText, name, avatar },
    });
  },

  // 加载数据
  loadData() {
    const { currentYear, currentMonth } = this.data;
    
    // 加载今日记录
    const todayRecord = storage.getTodayRecord();
    if (todayRecord) {
      const moodOption = MOOD_OPTIONS.find(m => m.type === todayRecord.mood);
      this.setData({
        todayRecord: {
          recordId: todayRecord.recordId,
          emoji: moodOption.emoji || '😊',
          moodName: moodOption.name || '平静',
          dateText: this.formatDate(todayRecord.recordDate),
          content: todayRecord.content,
        },
      });
    } else {
      this.setData({ todayRecord: null });
    }
    
    // 加载月度统计
    const monthStats = storage.getMonthlyStatistics(currentYear, currentMonth);
    const topMoodOption = MOOD_OPTIONS.find(m => m.type === monthStats.topMood);
    
    this.setData({
      monthStats,
      topMoodEmoji: topMoodOption.emoji || '😊',
    });
    
    // 加载最近记录
    const records = storage.getMoodRecords().slice(0, 5);
    const recentRecords = records.map(r => {
      const moodOption = MOOD_OPTIONS.find(m => m.type === r.mood);
      return {
        recordId: r.recordId,
        emoji: moodOption.emoji || '😊',
        moodName: moodOption.name || '平静',
        dateText: this.formatDate(r.recordDate),
        content: r.content,
      };
    });
    
    this.setData({ recentRecords });
  },

  // 格式化日期
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) {
      return '今天';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return '昨天';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  },

  // 跳转记录页
  goToRecord() {
    wx.navigateTo({
      url: '/pages/record/record',
    });
  },

  // 跳转设置页
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings',
    });
  },

  // 跳转统计页
  goToStatistics() {
    wx.switchTab({
      url: '/pages/statistics/statistics',
    });
  },

  // 跳转详情页
  goToDetail(e: any) {
    const recordId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${recordId}`,
    });
  },

  // 切换月份选择器
  toggleMonthPicker() {
    this.setData({
      showMonthPicker: !this.data.showMonthPicker,
    });
  },

  // 上一年
  prevYear() {
    this.setData({
      pickerYear: this.data.pickerYear - 1,
    });
  },

  // 下一年
  nextYear() {
    this.setData({
      pickerYear: this.data.pickerYear + 1,
    });
  },

  // 选择月份
  selectMonth(e: any) {
    const month = e.currentTarget.dataset.month;
    this.setData({
      currentYear: this.data.pickerYear,
      currentMonth: month,
      pickerMonth: month,
      showMonthPicker: false,
    });
    this.loadData();
  },

  // 点击日历某天
  onDayClick(e: any) {
    const date = e.detail.date;
    const records = storage.getMoodRecordsByDateRange(date, date);
    
    if (records.length > 0) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${records[0].recordId}`,
      });
    } else {
      // 未记录，跳转记录页并预设日期
      wx.navigateTo({
        url: `/pages/record/record?date=${date}`,
      });
    }
  },
});