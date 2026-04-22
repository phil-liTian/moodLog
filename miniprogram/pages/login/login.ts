Page({
  data: {
    phone: '',
    code: '',
    codeText: '获取验证码',
    canSendCode: false,
  },
  onPhoneInput(e: any) {
    const phone = e.detail.value;
    this.setData({ phone, canSendCode: phone.length === 11 });
  },
  onCodeInput(e: any) {
    this.setData({ code: e.detail.value });
  },
  sendCode() {
    if (!this.data.canSendCode) return;
    this.setData({ codeText: '60s', canSendCode: false });
    let countdown = 60;
    const timer = setInterval(() => {
      countdown--;
      this.setData({ codeText: `${countdown}s` });
      if (countdown <= 0) {
        clearInterval(timer);
        this.setData({ codeText: '获取验证码', canSendCode: true });
      }
    }, 1000);
    wx.showToast({ title: '验证码已发送', icon: 'none' });
  },
  login() {
    if (!this.data.phone || !this.data.code) {
      wx.showToast({ title: '请填写完整', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '登录中...' });
    setTimeout(() => {
      const app = getApp<IAppOption>();
      app.onLogin({ nickname: '用户' + this.data.phone.slice(-4) }, 'mock-token');
      wx.hideLoading();
      wx.navigateBack();
    }, 1000);
  },
  skipLogin() {
    wx.navigateBack();
  },
});