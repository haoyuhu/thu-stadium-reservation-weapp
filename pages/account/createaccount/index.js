// pages/account/updateaccount/index.js
Page({
  data: {
    currentUserTypeIndex: 0,
    userType: ['在校学生', '教师职工'],
    remark: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onUserTypePickerChanged: function (e) {
    this.setData({
      currentUserTypeIndex: e.detail.value
    });
  },
  onTextAreaInput: function (e) {
    this.setData({
      remark: e.detail.value
    });
  },
  onCreationButtonTap: function (e) {

  }
})