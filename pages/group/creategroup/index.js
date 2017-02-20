// pages/group/creategroup/index.js
var app = getApp();
let utils = require('../../../utils/util.js');

Page({
  data: {
    queries: {
      session_id: app.getSessionId(),
      name: null,
      available: true,
      description: null,
      mail_receivers: null
    }
  },
  onNameInput: function (e) {
    var data = this.data.queries;
    data.name = e.detail.value;
    this.setData({
      queries: data
    });
  },
  onMailReceiversInput: function (e) {
    var data = this.data.queries;
    data.mail_receivers = e.detail.value;
    this.setData({
      queries: data
    });
  },
  onDescriptionInput: function (e) {
    var data = this.data.queries;
    data.description = e.detail.value;
    this.setData({
      queries: data
    });
  },
  onCreationButtonTap: function (e) {
    var request = utils.createDefaultRequestCallbacks(null);
    request.url = 'group';
    request.method = 'POST';
    request.data = this.data.queries;
    request.success = function (group) {
      var previous = utils.getPreviousPage();
      if (previous != null) {
        previous.refreshData();
      }
      wx.navigateBack({ delta: 1 });
    };
    utils.request(request);
  }
})