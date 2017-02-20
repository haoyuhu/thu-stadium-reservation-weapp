var host = "thu.stadium.huhaoyu.com"

var config = {
    host,

    // 登录地址, 用code换取openId
    loginUrl: `https://${host}/login`,
    // 登出地址
    logoutUrl: `https://${host}/logout`,

    // 用于清华账户的增删改查
    accountUrl: `https://${host}/account`,
    // 用于清华账户的激活
    accountActivationUrl: `https://${host}/account/activate`,

    // 用于愿望清单的增删改查
    groupUrl: `https://${host}/group`,
    // 用于愿望项的增删改查
    candidateUrl: `https://${host}/group/candidate`,

    // 用于预约记录的查删
    recordUrl: `https://${host}/record`
};

module.exports = config