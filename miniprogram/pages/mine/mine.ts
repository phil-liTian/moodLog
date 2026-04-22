// 我的页面逻辑
import { storage } from '../../utils/storage';
import { UserSettings } from '../../types/user';

const app = getApp<IAppOption>();

Page({
  data: {
    isLoggedIn: false,
    userInfo: null as any,
    settings: {
      aiAnalysisEnabled: false,
      privacyLevel: 'local',
      dataSyncEnabled: false,
      reminderEnabled: false,
      reminderTime: '21:00',
      theme: 'light',
    } as UserSettings,
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const isLoggedIn = app.globalData.isLoggedIn;
    const userInfo = app.globalData.userInfo;
    const settings = storage.getUserSettings();
    
    this.setData({
      isLoggedIn,
      userInfo,
      settings,
    });
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },

  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings',
    });
  },

  goToAbout() {
    wx.showModal({
      title: '关于心情日记',
      content: '心情日记 v1.0.0\n\n一个帮助你记录每日心情的小程序。\n\n保护隐私，数据仅本地存储。',
      showCancel: false,
    });
  },

  toggleAI(e: any) {
    const enabled = e.detail.value;
    storage.saveUserSettings({ aiAnalysisEnabled: enabled });
    
    wx.showToast({
      title: enabled ? 'AI总结已开启' : 'AI总结已关闭',
      icon: 'none',
    });
  },

  exportData() {
    wx.showLoading({ title: '导出中...' });
    
    setTimeout(() => {
      const data = storage.exportAllData();
      
      // 模拟文件导出
      wx.hideLoading();
      wx.showToast({
        title: '数据已导出',
        icon: 'success',
      });
      
      console.log('导出数据:', data);
    }, 1000);
  },

  clearData() {
    wx.showModal({
      title: '清空数据',
      content: '确定要清空所有心情记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          storage.clearAllData();
          wx.showToast({
            title: '数据已清空',
            icon: 'success',
          });
          this.loadData();
        }
      },
    });
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.onLogout();
          this.loadData();
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
          });
        }
      },
    });
  },
});