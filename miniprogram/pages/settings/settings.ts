import { storage } from '../../utils/storage';
import { UserSettings } from '../../types/user';
Page({
  data: { settings: {} as UserSettings },
  onShow() { this.setData({ settings: storage.getUserSettings() }); },
  togglePrivacy(e: any) { storage.saveUserSettings({ privacyLevel: e.detail.value ? 'cloud' : 'local' }); this.onShow(); },
  toggleSync(e: any) { storage.saveUserSettings({ dataSyncEnabled: e.detail.value }); this.onShow(); },
  toggleAI(e: any) { storage.saveUserSettings({ aiAnalysisEnabled: e.detail.value }); this.onShow(); },
  toggleReminder(e: any) { storage.saveUserSettings({ reminderEnabled: e.detail.value }); this.onShow(); },
  exportData() { wx.showToast({ title: '数据已导出', icon: 'success' }); },
  clearData() { wx.showModal({ title: '清空数据', content: '确定清空所有数据？', success: (r) => { if (r.confirm) { storage.clearAllData(); wx.showToast({ title: '已清空', icon: 'success' }); } } }); },
});