// pages/account/updateaccount/index.js
let constants = require('../../../utils/constants.js');
let utils = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    accountId: null,
    studentId: null,
    username: null,
    password: null,
    alias: null,
    currentUserTypeIndex: 0,
    userType: constants.USER_TYPE,
    phoneNumber: null,
    email: null,
    remark: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      accountId: parseInt(options.account_id),
      studentId: options.student_id,
      username: options.username,
      alias: options.alias,
      currentUserTypeIndex: parseInt(options.user_type),
      phoneNumber: options.phone_number,
      email: options.email,
      remark: options.remark
    })
  },
  onPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  onAliasInput: function (e) {
    this.setData({
      alias: e.detail.value
    });
  },
  onPhoneNumberInput: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    });
  },
  onEmailInput: function (e) {
    this.setData({
      email: e.detail.value
    });
  },
  onUserTypePickerChanged: function (e) {
    this.setData({
      currentUserTypeIndex: parseInt(e.detail.value)
    });
  },
  onTextAreaInput: function (e) {
    this.setData({
      remark: e.detail.value
    });
  },
  onCreationButtonTap: function (e) {
    var that = this;
    var request = utils.createDefaultRequestCallbacks(null);
    request.url = 'account';
    request.method = 'PUT';
    request.data = {
      session_id: app.getSessionId(),
      account_id: that.data.accountId,
      alias: that.data.alias,
      user_type: that.data.currentUserTypeIndex,
      phone_number: that.data.phoneNumber,
      email: that.data.email,
      description: that.data.remark
    };
    if (that.data.password != null && that.data.password != '') {
      request.data.password = that.data.password;
    }
    request.success = function(account) {
      var previous = utils.getPreviousPage();
      if (previous != null) {
        previous.refreshData();
      }
      wx.navigateBack({ delta: 1 });
    };
    utils.request(request);
  }
})