/*
 * @Author: phil
 * @Date: 2026-04-22 20:28:03
 */
Component({
  properties: {
    year: { type: Number, value: 2026 },
    month: { type: Number, value: 4 },
    moodData: { type: Array, value: [] },
  },
  data: {
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    calendar: [] as any[],
  },
  observers: {
    'year, month, moodData': function() {
      this.generateCalendar();
    },
  },
  lifetimes: {
    attached() {
      this.generateCalendar();
    },
  },
  methods: {
    generateCalendar() {
      const { year, month, moodData } = this.data;
      const firstDay = new Date(year, month - 1, 1).getDay();
      const daysInMonth = new Date(year, month, 0).getDate();
      const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
      
      const calendar = [];
      const moodMap: Record<string, any> = {};
      (moodData as any[]).forEach(item => {
        moodMap[item.date] = item;
      });
      
      // 上月
      for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(year, month - 2, day).toISOString().split('T')[0];
        calendar.push({ day, date, mood: moodMap[date], moodEmoji: this.getMoodEmoji(moodMap[date].mood), isCurrentMonth: false });
      }
      
      // 当月
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        calendar.push({ day, date, mood: moodMap[date], moodEmoji: this.getMoodEmoji(moodMap[date].mood), isCurrentMonth: true });
      }
      
      // 下月补齐
      const remaining = 42 - calendar.length;
      for (let day = 1; day <= remaining; day++) {
        const date = new Date(year, month, day).toISOString().split('T')[0];
        calendar.push({ day, date, mood: moodMap[date], moodEmoji: this.getMoodEmoji(moodMap[date].mood), isCurrentMonth: false });
      }
      
      this.setData({ calendar });
    },
    getMoodEmoji(mood?: string): string {
      const map: Record<string, string> = {
        happy: '😊', calm: '😌', excited: '🤩', blessed: '🥰', thinking: '🤔', sad: '😢', anxious: '😰', tired: '😫'
      };
      return mood ? map[mood] || '' : '';
    },
    onDayClick(e: any) {
      const date = e.currentTarget.dataset.date;
      this.triggerEvent('dayClick', { date });
    },
  },
});