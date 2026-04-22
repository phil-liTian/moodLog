/*
 * @Author: phil
 * @Date: 2026-04-22 20:26:26
 */
import { storage } from '../../utils/storage';
import { MOOD_OPTIONS } from '../../types/mood';
Page({
  data: { record: null as any },
  onLoad(options: any) {
    const id = options.id;
    const records = storage.getMoodRecords();
    const r = records.find(x => x.recordId === id);
    if (r) {
      const mood = MOOD_OPTIONS.find(m => m.type === r.mood);
      const date = new Date(r.recordDate);
      this.setData({
        record: {
          ...r,
          emoji: mood.emoji || '😊',
          moodName: (mood && mood.name) || '平静',
          dateText: `${date.getMonth() + 1}月${date.getDate()}日`,
        }
      });
    }
  },
  editRecord() {
    wx.navigateTo({ url: `/pages/record/record?id=${this.data.record.recordId}` });
  },
  deleteRecord() {
    wx.showModal({ title: '删除记录', content: '确定删除这条记录吗？', success: (res) => {
      if (res.confirm) {
        storage.deleteMoodRecord(this.data.record.recordId);
        wx.navigateBack();
      }
    }});
  },
});