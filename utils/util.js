let constants = require('constants');
var app = getApp();

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function jsonToQueryString(json) {
  json = deleteNullValueInJson(json);
  return '?' + Object.keys(json).map(function (key) {
    return key + '=' + json[key];
  }).join('&');
}

function timeStringToTimestampInSeconds(timeString) {
  var parts = timeString.split(':');
  if (parts.length != 2 && parts.length != 3) {
    return -1;
  }

  let millisUnit = 1000;
  let secondUnit = 60;
  let minuteUnit = 60;
  let hourUnit = 24;

  var ret = parseInt(parts[0]);
  ret = ret * minuteUnit + parseInt(parts[1]);
  ret = ret * secondUnit + (parts.length == 3 ? parseInt(parts[2]) : 0);

  return ret;
}

function getErrorMessage(errorCode) {
  let index = Math.abs(errorCode);
  return constants.RESPONSE_MSG[index] || '未知错误，请重试或联系开发者。';
}

function deleteNullValueInJson(obj) {
  for (var key in obj) {
    if (obj[key] == null) {
      delete obj[key];
    }
  }
  return obj;
}

function request(req) {
  var that = this;
  if (typeof (req.prepare) == 'function') {
    req.prepare();
  }

  req.data = deleteNullValueInJson(req.data);
  var header = req.header || {};
  if (header['content-type'] == null) {
    header['content-type'] = 'application/x-www-form-urlencoded';
  }
  wx.request({
    url: constants.SERVER_BASE_URL + req.url,
    data: req.data || {},
    method: req.method || 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: header,
    success: function (res) {
      var response = res.data;
      if (response.error_code == constants.status.OK) {
        if (typeof (req.success) == 'function') {
          req.success(response.data);
        }
      } else {
        if (res.statusCode == constants.UNAUTHORIZED && typeof (req.unauthorized) == 'function') {
          req.unauthorized(that.getErrorMessage(response.error_code));
        } else if (typeof (req.fail) == 'function') {
          req.fail(that.getErrorMessage(response.error_code));
        }
      }
    },
    fail: function () {
      if (typeof (req.fail) == 'function') {
        req.fail('网络访问错误，请仔细检查网络并重试。');
      }
    },
    complete: function () {
      if (typeof (req.complete) == 'function') {
        req.complete();
      }
    }
  });
}

function showInfoByModal(title, content, showCancel) {
  var options = {}
  if (title != null && title != '') {
    options.title = title;
  } else {
    options.title = constants.DEFAULT_MODAL_TITLE;
  }
  options.content = content;
  options.confirmText = '确定';
  if (showCancel) {
    options.cancelText = '取消';
  } else {
    options.showCancel = false;
  }
  wx.showModal(options);
}

function showLoadingToast(content) {
  var options = {
    title: content != null ? content : '正在加载',
    icon: 'loading',
    mask: true,
    duration: 5000
  };
  wx.showToast(options);
}

function showSuccessToast(content) {
  var options = {
    title: content != null ? content : "操作成功",
    icon: 'success',
    mask: true
  };
  wx.showToast(options);
}

function hideToast() {
  wx.hideToast();
}

function getPreviousPage() {
  var pages = getCurrentPages();
  return pages.length >= 2 ? pages[pages.length - 2] : null;
}

function createDefaultRequestCallbacks(onUnauthorizationError) {
  return {
    prepare: function () {
      showLoadingToast('正在操作');
    },
    success: function () {
    },
    fail: function (message) {
      showInfoByModal(null, message);
    },
    unauthorized: function (message) {
      showInfoByModal(null, message);
      app.logoutWeapp(onUnauthorizationError, true);
    },
    complete: function () {
      hideToast();
    }
  };
}

module.exports = {
  formatTime: formatTime,
  jsonToQueryString: jsonToQueryString,
  timeStringToTimestampInSeconds: timeStringToTimestampInSeconds,
  getErrorMessage: getErrorMessage,
  request: request,
  showInfoByModal: showInfoByModal,
  showLoadingToast: showLoadingToast,
  showSuccessToast: showSuccessToast,
  hideToast: hideToast,
  getPreviousPage: getPreviousPage,
  createDefaultRequestCallbacks: createDefaultRequestCallbacks
}
