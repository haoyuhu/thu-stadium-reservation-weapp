let utils = require('../../utils/util.js');
let constants = require('../../utils/constants.js');
var app = getApp();

Page({
  data: {
    touchStart: 0,
    touchEnd: 0,
    isLogin: app.isAuthorized(),
    weekday: constants.WEEK_DAY,
    list: []
  },
  onLoad: function (options) {
    this.refreshData();
  },
  onShow: function () {
    this.setData({
      isLogin: app.isAuthorized()
    });
  },
  onGroupShortTap: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (('group-id-' + list[i].id) == id) {
        list[i].open = !list[i].open
      }
    }
    this.setData({
      list: list
    });
  },
  onGroupLongTap: function (e) {
    var item = e.currentTarget.dataset.groupItem;
    var that = this;
    wx.showActionSheet({
      itemList: ['添加预约项', '更改清单配置', item.available ? '禁用清单' : '启用清单', '删除清单'],
      success: function (e) {
        switch (e.tapIndex) {
          case 0:
            var queryString = utils.jsonToQueryString({ group_id: item.id });
            wx.navigateTo({ url: 'createcandidate/index' + queryString });
            break;
          case 1:
            var bundle = {
              group_id: item.id,
              name: item.name,
              description: item.description,
              mail_receivers: item.receivers
            };
            var queryString = utils.jsonToQueryString(bundle);
            wx.navigateTo({ url: 'updategroup/index' + queryString });
            break;
          case 2:
            that.updateGroupStatus(item.id, !item.available);
            break;
          case 3:
            that.deleteGroup(item.id);
            break;
        }
      }
    });
  },
  onGroupTap: function (e) {
    if (!app.verifyLoginStatusBeforeOperation()) return;

    let DEFAULT_LONG_TAP_INTERVAL = 350;
    let that = this;
    var touchInterval = that.data.touchEnd - that.data.touchStart;
    if (touchInterval >= DEFAULT_LONG_TAP_INTERVAL) {
      that.onGroupLongTap(e);
    } else {
      that.onGroupShortTap(e);
    }
  },
  onCandidateTap: function (e) {
    if (!app.verifyLoginStatusBeforeOperation()) return;

    var that = this;
    var groupItem = e.currentTarget.dataset.groupItem;
    var candidateItem = e.currentTarget.dataset.candidateItem;
    wx.showActionSheet({
      itemList: ['更改预约项配置', candidateItem.available ? '禁用预约项' : '启用预约项', '删除预约项'],
      success: function (e) {
        switch (e.tapIndex) {
          case 0:
            var bundle = {
              group_id: groupItem.id,
              candidate_id: candidateItem.id,
              sport_type: candidateItem.sport_type,
              week: candidateItem.week,
              wish_start: candidateItem.wish_start_time,
              wish_end: candidateItem.wish_end_time,
              section_start: candidateItem.section_start_time,
              section_end: candidateItem.section_end_time,
              fixed: candidateItem.fixed,
              description: candidateItem.description
            };
            var queryString = utils.jsonToQueryString(bundle);
            wx.navigateTo({ url: 'updatecandidate/index' + queryString });
            break;
          case 1:
            that.updateCandidateStatus(groupItem.id, candidateItem.id, !candidateItem.available);
            break;
          case 2:
            that.deleteCandidate(groupItem.id, candidateItem.id);
            break;
        }
      }
    });
  },
  onCreationButtonTap: function (e) {
    if (!app.verifyLoginStatusBeforeOperation()) return;

    wx.navigateTo({ url: 'creategroup/index' });
  },
  onTouchStart: function (e) {
    let that = this;
    that.setData({
      touchStart: e.timeStamp
    })
  },
  onTouchEnd: function (e) {
    let that = this;
    that.setData({
      touchEnd: e.timeStamp
    })
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
      url: 'group',
      data: { session_id: sessionId },
      success: function (groups) {
        let current = that.data.list || [];
        var statusHolder = {}
        current.forEach(function (item, index) {
          statusHolder[item.id] = item.open || false;
        });

        if (groups == null) {
          groups = [];
        }
        for (var i = 0; i < groups.length; ++i) {
          var groupId = groups[i].id;
          var open = statusHolder[groupId];
          if (open == null) open = false;
          var brief = that.getGroupBrief(groups[i]);
          groups[i].open = open;
          groups[i].brief = brief;
        }
        that.setData({
          list: groups
        });
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
  getGroupBrief: function (group) {
    let morning = utils.timeStringToTimestampInSeconds('6:30');
    let afternoon = utils.timeStringToTimestampInSeconds('12:00');
    let evening = utils.timeStringToTimestampInSeconds('18:00');

    var ret = '';
    group.candidates.forEach(function (item, index) {
      // if (!item.available) return;
      if (ret) ret += ' ';
      ret += constants.WEEK_DAY[item.week];

      let current = utils.timeStringToTimestampInSeconds(item.wish_start_time);
      if (current >= evening) {
        ret += '晚';
      } else if (current >= afternoon) {
        ret += '午';
      } else if (current >= morning) {
        ret += '早';
      }
    });

    if (!ret) {
      ret = '暂无预约时段';
    }
    return ret;
  },
  deleteGroup: function (groupId) {
    var that = this;
    var request = utils.createDefaultRequestCallbacks(function () {
      that.setData({ isLogin: false });
    });
    var queryString = utils.jsonToQueryString({
      group_id: groupId,
      session_id: app.getSessionId()
    });
    request.url = 'group' + queryString;
    request.method = 'DELETE';
    request.success = function () {
      var groups = that.data.list;
      var index = null;
      var found = groups.some(function (item, i) {
        if (item.id == groupId) {
          index = i;
          return true;
        }
        return false;
      });
      if (found) {
        groups.splice(index, 1);
        that.setData({ list: groups });
      }
    };

    utils.request(request);
  },
  updateGroupStatus: function (groupId, status) {
    var that = this;
    var request = utils.createDefaultRequestCallbacks(function () {
      that.setData({ isLogin: false });
    });
    request.url = 'group';
    request.method = 'PUT';
    request.data = {
      group_id: groupId,
      session_id: app.getSessionId(),
      available: status
    };
    request.success = function () {
      var groups = that.data.list;
      groups.some(function (item) {
        if (item.id == groupId) {
          item.available = status;
          return true;
        }
        return false;
      });
      that.setData({ list: groups });
    };

    utils.request(request);
  },
  deleteCandidate: function (groupId, candidateId) {
    var that = this;
    var request = utils.createDefaultRequestCallbacks(function () {
      that.setData({ isLogin: false });
    });
    var queryString = utils.jsonToQueryString({
      group_id: groupId,
      candidate_id: candidateId,
      session_id: app.getSessionId()
    });
    request.url = 'group/candidate' + queryString;
    request.method = 'DELETE';
    request.success = function () {
      var groups = that.data.list;
      var groupIndex = null, candidateIndex = null;
      var found = groups.some(function (groupItem, i) {
        if (groupItem.id == groupId) {
          groupIndex = i;
          return groupItem.candidates.some(function (candidateItem, j) {
            if (candidateItem.id == candidateId) {
              candidateIndex = j;
              return true;
            }
            return false;
          });
        }
        return false;
      });
      if (found) {
        groups[groupIndex].candidates.splice(candidateIndex, 1);
        that.setData({ list: groups });
      }
    };

    utils.request(request);
  },
  updateCandidateStatus: function (groupId, candidateId, status) {
    var that = this;
    var request = utils.createDefaultRequestCallbacks(function () {
      that.setData({ isLogin: false });
    });
    request.url = 'group/candidate';
    request.method = 'PUT';
    request.data = {
      group_id: groupId,
      candidate_id: candidateId,
      available: status,
      session_id: app.getSessionId()
    };
    request.success = function () {
      var groups = that.data.list;
      groups.some(function (groupItem, i) {
        if (groupItem.id == groupId) {
          return groupItem.candidates.some(function (candidateItem, j) {
            if (candidateItem.id == candidateId) {
              candidateItem.available = status;
              return true;
            }
            return false;
          });
        }
        return false;
      });
      that.setData({ list: groups });
    };

    utils.request(request);
  }
})

