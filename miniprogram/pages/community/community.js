// pages/community/community.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        catcatarr: [{
                catcat: "abc",
                catcatpro: 29
            },
            {
                catcat: "cdaf",
                catcatpro: 35
            }, {
                catcat: "asfabfac",
                catcatpro: 42
            }, {
                catcat: "asdafbc",
                catcatpro: 60
            }, {
                catcat: "absafdc",
                catcatpro: 70
            }, {
                catcat: "asadfbc",
                catcatpro: 90
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTabBar().init();

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onChange: function (event) {
        switch (event.detail) {
            case 0:
                getApp().st("/pages/now/now")
                break;
            case 1:
                getApp().st("/pages/deadline/deadline")
                break;
            case 2:
                getApp().st("/pages/community/community")
                break;
            case 3:
                getApp().st("/pages/setting/setting")
                break;
        }
    }
})