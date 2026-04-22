// 记录页面逻辑
import { storage } from '../../utils/storage';
import { MOOD_OPTIONS, QUICK_TAGS, MoodType, MoodOption } from '../../types/mood';

Page({
  data: {
    // 日期
    recordDate: '',
    dateText: '',
    weekdayText: '',
    
    // 心情列表
    moodList: MOOD_OPTIONS,
    
    // 已选心情
    selectedMood: '' as MoodType | '',
    
    // 内容
    content: '',
    
    // 标签
    tagList: QUICK_TAGS,
    selectedTags: [] as string[],
    
    // 能否保存
    canSave: false,
    
    // 是否编辑模式
    isEdit: false,
    editRecordId: '',
  },

  onLoad(options: any) {
    const date = options.date ? new Date(options.date) : new Date();
    this.setData({
      recordDate: date.toISOString().split('T')[0],
      dateText: `${date.getMonth() + 1}月${date.getDate()}日`,
      weekdayText: this.getWeekday(date.getDay()),
    });
    
    // 检查是否是编辑模式
    if (options.id) {
      this.loadRecord(options.id);
    }
    
    // 检查是否有草稿
    this.loadDraft();
  },

  onUnload() {
    // 保存草稿
    this.saveDraft();
  },

  getWeekday(day: number): string {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[day];
  },

  loadRecord(recordId: string) {
    const records = storage.getMoodRecords();
    const record = records.find(r => r.recordId === recordId);
    
    if (record) {
      this.setData({
        isEdit: true,
        editRecordId: recordId,
        selectedMood: record.mood,
        content: record.content,
        selectedTags: record.tags,
        canSave: true,
      });
    }
  },

  loadDraft() {
    const draft = storage.getDraft();
    if (draft && !this.data.isEdit) {
      this.setData({
        selectedMood: draft.mood || '',
        content: draft.content || '',
        selectedTags: draft.tags || [],
      });
      this.checkCanSave();
    }
  },

  saveDraft() {
    const { selectedMood, content, selectedTags, recordDate, isEdit } = this.data;
    if (!isEdit && (selectedMood || content || selectedTags.length > 0)) {
      storage.saveDraft({
        mood: selectedMood as MoodType,
        content,
        tags: selectedTags,
        recordDate,
      });
    }
  },

  selectMood(e: any) {
    const mood = e.currentTarget.dataset.mood as MoodType;
    this.setData({ selectedMood: mood });
    this.checkCanSave();
  },

  onContentInput(e: any) {
    this.setData({ content: e.detail.value });
    this.checkCanSave();
  },

  toggleTag(e: any) {
    const tag = e.currentTarget.dataset.tag;
    const { selectedTags } = this.data;
    const index = selectedTags.indexOf(tag);
    
    if (index > -1) {
      selectedTags.splice(index, 1);
    } else {
      if (selectedTags.length < 5) {
        selectedTags.push(tag);
      }
    }
    
    this.setData({ selectedTags: [...selectedTags] });
  },

  checkCanSave() {
    const { selectedMood, content } = this.data;
    const canSave = !!selectedMood;
    this.setData({ canSave });
  },

  saveRecord() {
    const { selectedMood, content, selectedTags, recordDate, isEdit, editRecordId } = this.data;
    
    if (!selectedMood) {
      wx.showToast({
        title: '请选择心情',
        icon: 'none',
      });
      return;
    }
    
    const moodOption = MOOD_OPTIONS.find(m => m.type === selectedMood);
    
    wx.showLoading({ title: '保存中...' });
    
    setTimeout(() => {
      if (isEdit) {
        // 更新记录
        storage.updateMoodRecord(editRecordId, {
          mood: selectedMood as MoodType,
          moodScore: (moodOption && moodOption.score) || 50,
          content,
          tags: selectedTags,
        });
      } else {
        // 创建新记录
        storage.createMoodRecord({
          mood: selectedMood as MoodType,
          moodScore: (moodOption && moodOption.score) || 50,
          content,
          tags: selectedTags,
          recordDate,
        });
      }
      
      // 清除草稿
      storage.clearDraft();
      
      wx.hideLoading();
      wx.showToast({
        title: isEdit ? '更新成功' : '记录成功',
        icon: 'success',
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 500);
  },
});