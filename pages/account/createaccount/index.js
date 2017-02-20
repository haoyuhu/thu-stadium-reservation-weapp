// pages/account/createaccount/index.js
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
  onStudentIdInput: function (e) {
    this.setData({
      studentId: e.detail.value
    });
  },
  onUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
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
    request.method = 'POST';
    request.data = {
      session_id: app.getSessionId(),
      student_id: that.data.studentId,
      username: that.data.username,
      password: that.data.password,
      alias: that.data.alias,
      user_type: that.data.currentUserTypeIndex,
      phone_number: that.data.phoneNumber,
      email: that.data.email,
      description: that.data.remark
    };
    request.success = function (account) {
      var previous = utils.getPreviousPage();
      if (previous != null) {
        previous.refreshData();
      }
      wx.navigateBack({ delta: 1 });
    };
    utils.request(request);
  }
})