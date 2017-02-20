// pages/account/updateaccount/index.js
let constants = require('../../../utils/constants.js');
let utils = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
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
      studentId: options.student_id,
      username: options.username,
      alias: options.alias,
      currentUserTypeIndex: parseInt(options.user_type),
      phoneNumber: options.phone_number,
      email: options.email,
      remark: options.remark
    })
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

  }
})