// pages/group/updatecandidate/index.js
let constants = require('../../../utils/constants.js');
let utils = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    groupId: null,
    candidateId: null,
    fixed: false,
    sportType: constants.SPORT_TYPE,
    currentSportTypeIndex: 0,
    weekday: constants.WEEK_DAY,
    currentWeekIndex: 0,
    reservationTime: constants.RESERVATION_TIME,
    currentWishStartIndex: 15,
    currentWishEndIndex: 18,
    currentSectionStartIndex: 12,
    currentSectionEndIndex: 19,
    remark: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    this.setData({
      groupId: parseInt(options.group_id),
      candidateId: parseInt(options.candidate_id),
      fixed: options.fixed == 'true' ? true : false,
      currentSportTypeIndex: parseInt(options.sport_type),
      currentWeekIndex: parseInt(options.week),
      currentWishStartIndex: that.data.reservationTime.indexOf(options.wish_start),
      currentWishEndIndex: that.data.reservationTime.indexOf(options.wish_end),
      currentSectionStartIndex: that.data.reservationTime.indexOf(options.section_start),
      currentSectionEndIndex: that.data.reservationTime.indexOf(options.section_end),
      remark: options.description
    });
  },
  onSportTypePickerChanged: function (e) {
    this.setData({
      currentSportTypeIndex: e.detail.value
    });
  },
  onWeekPickerChanged: function (e) {
    this.setData({
      currentWeekIndex: e.detail.value
    });
  },
  onWishStartPickerChanged: function (e) {
    this.setData({
      currentWishStartIndex: e.detail.value
    });
  },
  onWishEndPickerChanged: function (e) {
    this.setData({
      currentWishEndIndex: e.detail.value
    });
  },
  onSectionStartPickerChanged: function (e) {
    this.setData({
      currentSectionStartIndex: e.detail.value
    });
  },
  onSectionEndPickerChanged: function (e) {
    this.setData({
      currentSectionEndIndex: e.detail.value
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
    request.method = 'PUT';
    request.data = {
      session_id: app.getSessionId(),
      group_id: that.data.groupId,
      candidate_id: that.data.candidateId,
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