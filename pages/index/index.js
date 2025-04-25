const app = getApp()

Page({
  data: {
    tempImagePath: '',
    resultImagePath: '',
    result: {
      class: '',
      confidence: 0,
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          tempImagePath: res.tempFilePaths[0],
          resultImagePath: '',
          result: {
            class: '',
            confidence: 0,
            x: 0,
            y: 0,
            w: 0,
            h: 0
          }
        })
      }
    })
  },

  startDetect() {
    if (!this.data.tempImagePath) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '检测中...',
    })

    // 将图片转换为base64
    wx.getFileSystemManager().readFile({
      filePath: this.data.tempImagePath,
      encoding: 'base64',
      success: (res) => {
        // 调用本地服务
        wx.request({
          url: `${app.globalData.baseUrl}/detect`,
          method: 'POST',
          data: {
            image: res.data
          },
          success: (res) => {
            console.log('检测结果：', res.data)
            const { class: pestClass, confidence, x, y, w, h, resultImage } = res.data
            this.setData({
              resultImagePath: resultImage,
              result: {
                class: pestClass,
                confidence: (confidence * 100).toFixed(2),
                x: x.toFixed(2),
                y: y.toFixed(2),
                w: w.toFixed(2),
                h: h.toFixed(2)
              }
            })
          },
          fail: (err) => {
            console.error('检测失败：', err)
            wx.showToast({
              title: '检测失败',
              icon: 'none'
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: (err) => {
        console.error('读取图片失败：', err)
        wx.showToast({
          title: '读取图片失败',
          icon: 'none'
        })
        wx.hideLoading()
      }
    })
  }
}) 