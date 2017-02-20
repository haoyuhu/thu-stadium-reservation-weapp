//app.js
let constants = require('utils/constants.js');
let utils = require('utils/util.js');

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var infoCached = wx.getStorageSync('user_info') || null;
    var sessionIdCached = wx.getStorageSync('session_id') || null;

    this.globalData.userInfo = infoCached;
    this.globalData.sessionId = sessionIdCached;
  },
  getUserInfoCached: function () {
    return this.globalData.userInfo;
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      //调用登录接口
      wx.login({
        success: function (data) {
          wx.getUserInfo({
            success: function (res) {
              that.loginWeapp(data.code, res.userInfo, {
                success: function () {
                  wx.setStorageSync('user_info', res.userInfo);
                  that.globalData.userInfo = res.userInfo;
                  typeof cb == "function" && cb(that.globalData.userInfo);
                },
                fail: function () {
                  wx.removeStorageSync('user_info');
                  that.globalData.userInfo = null;
                  typeof cb == "function" && cb(null);
                }
              });
            }
          });
        }
      });
    }
  },
  loginWeapp: function (authCode, userInfo, callbacks) {
    var that = this;
    this.logoutWeapp(function () {
      var globalData = that.globalData;
      utils.request({
        url: 'login',
        method: 'POST',
        data: {
          code: authCode,
          nickname: userInfo.nickName,
          gender: userInfo.gender,
          language: userInfo.language,
          city: userInfo.city,
          province: userInfo.province,
          country: userInfo.country,
          avatar_url: userInfo.avatarUrl,
          description: 'user of weapp version ' + constants.VERSION
        },
        prepare: function () {
          utils.showLoadingToast('正在登录');
        },
        success: function (res) {
          globalData.sessionId = res.session_id;
          wx.setStorageSync('session_id', res.session_id);
          utils.hideToast();
          utils.showSuccessToast('登录成功');
          if (callbacks != null && typeof (callbacks.success) == 'function') {
            callbacks.success();
          }
        },
        fail: function (errorMessage) {
          wx.removeStorageSync('session_id');
          utils.hideToast();
          utils.showInfoByModal(constants.DEFAULT_MODAL_TITLE, errorMessage);
          if (callbacks != null && typeof (callbacks.fail) == 'function') {
            callbacks.fail();
          }
        }
      });
    }, true);
  },
  logoutWeapp: function (success, silent) {
    var globalData = this.globalData;
    if (globalData.sessionId != null) {
      utils.request({
        url: 'logout',
        data: { session_id: globalData.sessionId },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        prepare: function () {
          if (!silent) {
            utils.showLoadingToast('正在登出');
          }
        },
        complete: function () {
          if (!silent) {
            utils.hideToast();
          }
          globalData.sessionId = null;
          globalData.userInfo = null;
          if (typeof (success) == 'function') {
            success();
          }
        }
      })
    } else {
      globalData.userInfo = null;
      if (typeof (success) == 'function') {
        success();
      }
    }
    wx.clearStorageSync();
  },
  getSessionId: function () {
    return this.globalData.sessionId;
  },
  isAuthorized: function () {
    let data = this.globalData;
    return data.sessionId != null && data.userInfo != null;
  },
  verifyLoginStatusBeforeOperation: function () {
    if (this.isAuthorized()) {
      return true;
    }
    utils.showInfoByModal(null, "当前未微信登录，无法使用预约功能，请进入用户中心登录并获取用户信息。");
    return false;
  },
  globalData: {
    sessionId: null,
    userInfo: null
  }
})