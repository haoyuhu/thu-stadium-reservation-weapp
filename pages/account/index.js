var app = getApp();
let utils = require('../../utils/util.js');
let constants = require('../../utils/constants.js');

Page({
  data: {
    isLogin: app.isAuthorized(),
    userInfo: app.getUserInfoCached(),
    userType: constants.USER_TYPE,
    accountStatus: constants.ACCOUNT_STATUS,
    list: []
  },
  onLoad: function (options) {
    this.refreshData();
  },
  onShow: function () {
    this.setData({
      isLogin: app.isAuthorized(),
      userInfo: app.getUserInfoCached()
    });
  },
  onLogin: function () {
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
        isLogin: app.isAuthorized()
      });
    });
  },
  onLogout: function () {
    var that = this;
    app.logoutWeapp(function () {
      that.setData({
        userInfo: null,
        isLogin: false
      });
    }, false);
  },
  onAccountTap: function (e) {
    let USING_STATUS = 0;
    let AVAILABLE_STATUS = 1;
    var that = this;
    var account = e.currentTarget.dataset.accountItem;
    wx.showActionSheet({
      itemList: ['更改账号配置', account.status == USING_STATUS ? '停用账号' : '启用账号', '删除账号'],
      success: function (e) {
        switch (e.tapIndex) {
          case 0:
            var queryString = utils.jsonToQueryString({
              account_id: account.id,
              student_id: account.student_id,
              username: account.username,
              alias: account.alias,
              user_type: account.user_type,
              phone_number: account.phone_number,
              email: account.email,
              remark: account.description
            });
            wx.navigateTo({ url: 'updateaccount/index' + queryString });
            break;
          case 1:
            that.updateAccountStatus(account.id, account.status == USING_STATUS ? AVAILABLE_STATUS : USING_STATUS);
            break;
          case 2:
            that.deleteAccount(account.id);
            break;
        }
      }
    });
  },
  onCreationButtonTap: function (e) {
    wx.navigateTo({ url: 'createaccount/index' });
  },
  onPullDownRefresh: function () {
    this.refreshData();
  },
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  refreshData: function () {
    if (!app.isAuthorized()) {
      this.stopPullDownRefresh();
      return;
    }

    let sessionId = app.getSessionId();
    var that = this;
    utils.request({
      url: 'account',
      data: { session_id: sessionId },
      success: function (accounts) {
        if (accounts == null) {
          accounts = [];
        }
        that.setData({ list: accounts });
      },
      fail: function (message) {
        utils.showInfoByModal(constants.DEFAULT_MODAL_TITLE, message);
      },
      unauthorized: function (message) {
        utils.showInfoByModal(constants.DEFAULT_MODAL_TITLE, message);
        app.logoutWeapp(function () {
          that.setData({
            isLogin: false
          });
        }, true);
      },
      complete: function () {
        that.stopPullDownRefresh();
      }
    });
  },
  updateAccountStatus: function (accountId, status) {
    var that = this;
    var request = utils.createDefaultRequestCallbacks(function () {
      that.setData({
        isLogin: false,
        userInfo: null
      });
    });

    request.url = 'account/activate';
    request.method = 'PUT';
    request.data = {
      account_id: accountId,
      status: status,
      session_id: app.getSessionId()
    }
    request.success = function () {
      var accounts = that.data.list;
      var index = null;
      var found = accounts.some(function (item, i) {
        if (item.id == accountId) {
          item.status = status;
          return true;
        }
        return false;
      });
      that.setData({ list: accounts });
    };

    utils.request(request);
  },
  deleteAccount: function (accountId) {
    var that = this;
    var request = utils.createDefaultRequestCallbacks(function () {
      that.setData({
        isLogin: false,
        userInfo: null
      });
    });
    var queryString = utils.jsonToQueryString({
      account_id: accountId,
      session_id: app.getSessionId()
    });
    request.url = 'account' + queryString;
    request.method = 'DELETE';
    request.success = function () {
      var accounts = that.data.list;
      var index = null;
      var found = accounts.some(function (item, i) {
        if (item.id == accountId) {
          index = i;
          return true;
        }
        return false;
      });
      if (found) {
        accounts.splice(index, 1);
        that.setData({ list: accounts });
      }
    };

    utils.request(request);
  }
})

