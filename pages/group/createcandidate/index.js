// pages/group/createcandidate/index.js
let constants = require('../../../utils/constants.js');
let utils = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    groupId: null,
    fixed: false,
    sportType: constants.SPORT_TYPE,
    currentSportTypeIndex: 0,
    weekday: constants.WEEK_DAY,
    currentWeekIndex: 0,
    reservationTime: constants.RESERVATION_TIME,
    currentWishStartIndex: 15,
    currentWishEndIndex: 18,
    currentSectionStartIndex: 12,
    currentSectionEndIndex: 18,
    remark: ''
  },
  onLoad(options) {
    this.setData({ groupId: parseInt(options.group_id) });
  },
  onSportTypePickerChanged: function (e) {
    this.setData({
      currentSportTypeIndex: parseInt(e.detail.value)
    });
  },
  onWeekPickerChanged: function (e) {
    this.setData({
      currentWeekIndex: parseInt(e.detail.value)
    });
  },
  onWishStartPickerChanged: function (e) {
    this.setData({
      currentWishStartIndex: parseInt(e.detail.value)
    });
  },
  onWishEndPickerChanged: function (e) {
    this.setData({
      currentWishEndIndex: parseInt(e.detail.value)
    });
  },
  onSectionStartPickerChanged: function (e) {
    this.setData({
      currentSectionStartIndex: parseInt(e.detail.value)
    });
  },
  onSectionEndPickerChanged: function (e) {
    this.setData({
      currentSectionEndIndex: parseInt(e.detail.value)
    });
  },
  onFixedSwitchChanged: function (e) {
    this.setData({
      fixed: e.detail.value
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
    request.url = 'group/candidate';
    request.method = 'POST';
    request.data = {
      session_id: app.getSessionId(),
      group_id: that.data.groupId,
      available: true,
      sport_type: that.data.currentSportTypeIndex,
      week: that.data.currentWeekIndex,
      wish_start: constants.RESERVATION_TIME[that.data.currentWishStartIndex],
      wish_end: constants.RESERVATION_TIME[that.data.currentWishEndIndex],
      section_start: constants.RESERVATION_TIME[that.data.currentSectionStartIndex],
      section_end: constants.RESERVATION_TIME[that.data.currentSectionEndIndex],
      fixed: that.data.fixed,
      description: that.data.remark
    };
    request.success = function (candidate) {
      var page = utils.getPreviousPage();
      if (page != null) {
        page.refreshData();
      }
      wx.navigateBack({ delta: 1 });
    };

    utils.request(request);
  }
})