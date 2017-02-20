// pages/group/updategroup/index.js
let utils = require('../../../utils/util.js');
let app = getApp();

Page({
  data: {
    queries: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    options.group_id = parseInt(options.group_id);
    this.setData({ queries: options });
  },
  onNameInput: function (e) {
    var queries = this.data.queries;
    queries.name = e.detail.value;
    this.setData({ queries: queries });
  },
  onMailReceiversInput: function (e) {
    var queries = this.data.queries;
    queries.mail_receivers = e.detail.value;
    this.setData({ queries: queries });
  },
  onDescriptionInput: function (e) {
    var queries = this.data.queries;
    queries.description = e.detail.value;
    this.setData({ queries: queries });
  },
  onCreationButtonTap: function (e) {
    var request = utils.createDefaultRequestCallbacks(null);
    request.url = 'group';
    request.method = 'PUT';
    var data = this.data.queries;
    data.session_id = app.getSessionId();
    request.data = data;
    request.success = function(group) {
      var previous = utils.getPreviousPage();
      if (previous != null) {
        previous.refreshData();
      }
      wx.navigateBack({ delta: 1 });
    };
    utils.request(request);
  }
})