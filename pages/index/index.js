//index.js
//获取应用实例

const app = getApp()

Page({
  
  data: {
    avatarUrl: "https://s1.ax1x.com/2020/08/01/a8xgSg.png",
    
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl2:"../../images/instagram.png",
    mode:"widthFix",
    imgs:[],
    load:0,
    imgwidth: 0,
    imgheight: 0, 
    imgtype:0,
    greyScale:0,
    sepiaNum:0,
    svgurl: 0,
    blur:0,
    brightness:100,
    contrast:100,
    saturate:100,
    opacity:100,
    imageClass: "imageArea",
    canvasHeight:641,
    data:''
  },

  saveImage(e) {
    // 开启相册授权无反应，猜测是默认已经打开相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }
          })
        }
      }
    });

    wx.showLoading({
      title: '保存中...',
      mask: true,
    });
    wx.downloadFile({
      url: e.target.dataset.src,
      success: function (res) {
        if (res.statusCode === 200) {
          let img = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              });
            },
            fail(res) {
              wx.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      }
    });
  },

/*
  saveImage1:function(e){
    //获取相册授权
    console.log('授权成功')
    
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }
          })
        }
      }
    })
    
    var imgSrc = e.target.dataset.src//调用对应button中的data-src
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            console.log(data);
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })


  },
*/
  //事件处理函数
  bindViewTap: function(e) {
    
    var that = this;
  
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) {
            that.setData({
              load: 1, imgwidth: res.width, imgheight: res.height, imgtype: res.type,
              canvasHeight: 641 * res.height / res.width
            })

          }
        })
        /*
        console.log(tempFilePaths)//测试用
        console.log(tempFilePaths[0])
        */
        
        that.setData({ avatarUrl: tempFilePaths[0], mode: "widthFix",
          avatarUrl2: tempFilePaths[0], greyScale: 0, sepiaNum: 0, svgurl: 0,blur: 0,contrast:100,
          brightness: 100, saturate: 100, opacity: 100, imageClass: 0
          })
        // 再把greyScaleNum等设一遍是为了保证新导入一张图片不受之前处理影响
        
      }
     })
   
    },

  //问题：全屏预览时灰度不变，怎么解决？黑白处理后图片地址是否改变？
  origin: function (e) {
    var that = this
    
    
    this.setData({
      svgurl:0,
      sepiaNum:0,
      blur:0,
      greyScale: 0,
      contrast:100,
      brightness: 100,
      saturate:100,
      opacity:100,
    })
   },

  
  
  
  
  
  // 未完待续
  previewImage: function(e){
    var current = e.target.dataset.src//调用viewImage对应button中的data-src
    
    console.log(this.data.avatarUrl2)
    
    wx.previewImage({
      urls:[this.data.avatarUrl2],
    });
    
  },

  
  //现在的问题是出来的地址打不开,我怀疑canvasToTempFilePath得跟其他一些函数配合用，单个用不行
  //王鹏伟：saveCanvasToTempFile这个接口，必须在context.draw的回调函数中调用。
  canvas:function(){
    var that = this;
    const ctx = wx.createCanvasContext('canvas')
    /*
    wx.canvasGetImageData({
      canvasId: 'canvas',
      x: 0,
      y: 0,
      width: 641,
      height: 641,
      success(res) { 
        console.log("成功……")
        console.log(res.width)
        console.log(res.height)
        console.log(res.data)
        that.setData({
          data: res.data
        })
        
        
      },

      
    }),
    
    wx.canvasPutImageData({
      canvasId: 'canvas',
      data:'',
      x: 0,
      y: 0,
      width: 641,
      height: 641,
      fail(res) { 
        console.log("失败") 
        console.log(this.data.data) 
      },
      success(res) {
        console.log("成功")
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 641,
          height: 641,
          fileType: "jpg",
          canvasId: 'canvas',
          success: function (res) {
            console.log(res.tempFilePath)
            console.log(1);
            that.setData({
              avatarUrl2: res.tempFilePath,
            })
          },
        })
      }
    });
    */

    
      //获取canvas图片数据
    ctx.draw(false, function () {
      console.log('draw callback')
      
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 641,
                height: 641,
                fileType: "jpg",
                canvasId: 'canvas',
                success: function (res) {
                  console.log(res.tempFilePath)
                  that.setData({
                    avatarUrl2: res.tempFilePath,
                  })
                },
              })
            
          
        
      
    })

    
   
  },

  getImageInfo:function(e){
    var current = e.target.dataset.src
    var that = this;
    // console.log(current)
    wx.getImageInfo({
      src: current,
      success(res) {
        that.setData({
          load:1, imgwidth: res.width,imgheight: res.height,imgtype:res.type,
          canvasHeight: 641 * res.height / res.width})
        /*
        console.log(res.width)
        console.log(res.height)
        console.log(res.type)
        console.log(res.path)
        */
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  

  // ------------------------滤镜-------------------------------------------
  filter1: function () {
    this.setData({
      blur: 4
    })

  },
  filter2: function () {
    this.setData({
      greyScale: 100
    })
  },
  filter3: function () {
    this.setData({
      svgurl: '../../images/svgHueRotate.svg#svgHueRotate'
    })
  },
  filter4: function () {
    this.setData({
      svgurl: '../../images/svgInvert.svg#svgInvert'
    })
  },
  filter5: function () {
    this.setData({
      brightness: 150,
    })
  },
  filter6: function () {
    this.setData({
      contrast: 150,
    })
  },
  filter7: function () {
    this.setData({
      saturate: 200,
    })
  },
  filter8: function () {
    this.setData({
      opacity: 50,
    })
  },


  hfilter0: function () {
    this.setData({
      sepiaNum: 100,

    })
  },
  hfilter1: function () {
    this.setData({
      svgurl: '../../images/autumn.svg#autumn'
    })
  },
  hfilter2: function () {
    this.setData({
      svgurl: '../../images/blacklight.svg#blackLight'
    })
  },
  hfilter3: function () {
    this.setData({
      svgurl: '../../images/debris.svg#debris'
    })
  },
  hfilter4: function () {
    this.setData({
      svgurl: '../../images/f.svg#f'
    })
  },
  hfilter5: function () {
    this.setData({
      svgurl: '../../images/rawPaper.svg#rawPaper'
    })
  },
  hfilter6: function () {
    this.setData({
      svgurl: '../../images/dilate.svg#dilate'
    })
  },
  hfilter7: function () {
    this.setData({
      svgurl: '../../images/soft.svg#soft'
    })
  },

  hfilter8: function () {
    this.setData({
      svgurl: '../../images/softFocus.svg#softFocus'
    })
  },


  ifilter0: function () {
    this.setData({
      svgurl: '../../images/1977.svg#1977'

    })
  },
  ifilter1: function () {
    this.setData({
      svgurl: '../../images/aden.svg#aden'
    })
  },
  ifilter2: function () {
    this.setData({
      svgurl: '../../images/brooklyn.svg#brooklyn'
    })
  },
  ifilter3: function () {
    this.setData({
      svgurl: '../../images/kelvin.svg#kelvin'
    })
  },
  /*
  ifilter4: function () {
    this.setData({
      svgurl: '../../images/brannan.svg#brannan'
    })
  },
  ifilter5: function () {
    this.setData({
      svgurl: '../../images/earlybird.svg#earlybird'
    })
  },
  */
  ifilter6: function () {
    this.setData({
      svgurl: '../../images/gingham.svg#gingham'
    })
  },
  /*
  ifilter7: function () {
    this.setData({
      svgurl: '../../images/hudson.svg#hudson'
    })
  },
  */
  ifilter8: function () {
    this.setData({
      svgurl: '../../images/inkwell.svg#inkwell'
    })
  },

  ifilter9: function () {
    this.setData({
      svgurl: '../../images/lofi.svg#lofi'

    })
  },
  ifilter10: function () {
    this.setData({
      svgurl: '../../images/walden.svg#walden'
    })
  },
  ifilter11: function () {
    this.setData({
      svgurl: '../../images/reyes.svg#reyes'
    })
  },
  ifilter12: function () {
    this.setData({
      svgurl: '../../images/xpro2.svg#xpro2'
    })
  },
  ifilter13: function () {
    this.setData({
      svgurl: '../../images/toaster.svg#toaster'
    })
  },
  ifilter14: function () {
    this.setData({
      svgurl: '../../images/maven.svg#maven'
    })
  },
  ifilter15: function () {
    this.setData({
      svgurl: '../../images/moon.svg#moon'
    })
  },
  ifilter16: function () {
    this.setData({
      svgurl: '../../images/perpetua.svg#perpetua'
    })
  },

})




