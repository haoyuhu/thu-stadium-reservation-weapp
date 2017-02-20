var app = getApp();
let utils = require('../../utils/util.js');
let constants = require('../../utils/constants.js');

Page({
  data: {
    userType: constants.USER_TYPE,
    isLogin: app.isAuthorized(),
    list: [
      {
        id: 1,
        student_id: '2014210130',
        username: 'hhy14',
        alias: 'hahahu',
        user_type: 0,
        phone_number: '15201524605',
        email: 'im@huhaoyu.com',
        status: 0,
        status_str: '账号启用',
        description: ''
      }, {
        id: 2,
        student_id: '2014210119',
        username: 'lush14',
        alias: 'lushenghan',
        user_type: 0,
        phone_number: '15201524665',
        email: 'im@lushenghan.com',
        status: 1,
        status_str: '账号可用',
        description: ''
      }
    ]
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
    var account = e.currentTarget.dataset.accountItem;
    wx.showActionSheet({
      itemList: ['更改账号配置', account.status == 0 ? '停用账号' : '启用账号', '删除账号'],
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
            break;
          case 2:
            break;
        }
      }
    });
  },
  onPullDownRefresh: function () {

  },
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})

