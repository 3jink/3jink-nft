/*
 * @Description: 公共方法
 * @Version: 1.0.0
 * @Autor: hch
 * @Date: 2021-07-22 00:01:09
 */

/**
 * @description: 绘制正方形（可以定义圆角），并且有图片地址的话填充图片
 * @param {CanvasContext} ctx canvas上下文
 * @param {number} x 圆角矩形选区的左上角 x坐标
 * @param {number} y 圆角矩形选区的左上角 y坐标
 * @param {number} w 圆角矩形选区的宽度
 * @param {number} h 圆角矩形选区的高度
 * @param {number} r 圆角的半径
 * @param {String} url 图片的url地址
 * @param {String} bg canvas背景色
 * @param {String} code canvas背景色
 * @param {Boolean} num 圆角个数
 * @param {Boolean} rewrite 圆角个数
 */
export function drawSquarePic(ctx, x, y, w, h, r, url, bg = '#ffffff', code = '', num = false, rewrite = false) {

  ctx.save()
  ctx.beginPath()
  // 绘制左上角圆弧
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
  // 绘制border-top
  // 画一条线 x终点、y终点
  ctx.lineTo(x + w - r, y)
  // // 绘制右上角圆弧
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
  // // 绘制border-right
  ctx.lineTo(x + w, y + h - r)
  // // 绘制右下角圆弧
  if (num) {
    ctx.arc(x + w, y + h, 0, 0, Math.PI * 0.5)
    // // 绘制左下角圆弧
    ctx.arc(x, y + h, 0, Math.PI * 0.5, Math.PI)
  } else {
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    // // 绘制左下角圆弧
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
  }

  // // 绘制border-left
  ctx.lineTo(x, y + r)
  if (code === 'code' || code === 'codeX') {
    // ctx.setShadow(0, 3, 12, 'rgba(0, 0, 0, 0.08)')
  }
  // 填充颜色(需要可以自行修改)
  ctx.setFillStyle(bg)
  ctx.fill()
  // 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore 这个很重要 不然没办法保存
  ctx.clip()

  // 绘制图片
  return new Promise((resolve, reject) => {
    if (url) {
      wx.getImageInfo({
        src: url,
        success(res) {
          if (code === 'codeX') {
            ctx.drawImage(res.path, x + 8, y + 8, w - 16, h - 16)
          } else if (code === 'bg') {
            let system = uni.getSystemInfoSync()
            let sx, sy, sw, sh, imgRatio, canvasRatio;
            canvasRatio = system.windowWidth / 500;
            imgRatio = res.width / res.height;
            if (imgRatio <= canvasRatio) {
              sw = res.width
              sh = sw / canvasRatio
              sx = 0
              sy = (res.height - sh) / 2
            } else {
              sh = res.height
              sw = sh * canvasRatio
              sx = (res.width - sw) / 2
              sy = 0
            }
            ctx.drawImage(res.path, sx, sy, sw, sh, 0, 0, system.windowWidth, 500 * getSystem().scale)
          } else if (code === 'code') {
            ctx.drawImage(res.path, x, y, w, h)
          } else {
            ctx.drawImage(res.path, x, y, w, h)
          }

          ctx.restore() //恢复之前被切割的canvas，否则切割之外的就没办法用
          ctx.draw(true)
          resolve()
        },
        fail(res) {
          console.log('fail -> res', res)
          uni.showToast({
            title: '图片下载异常',
            duration: 2000,
            icon: 'none'
          })
        }
      })
    } else if (!url && rewrite) {
      resolve()
    } else {
      ctx.restore()
      ctx.draw(true)
      resolve()
    }
  })
}

/**
 * @description: 获取设备信息
 * @param {type}
 * @return {type}
 * @author: hch
 */
export function getSystem() {
  let system = uni.getSystemInfoSync()

  let scale = system.windowWidth / 375 //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
  let scaleY = 500 / 705 //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
  return {w: system.windowWidth, h: system.windowHeight, scale, scaleY}
}

/**
 * @description: 绘制文本时文本的总体高度
 * @param {Object} ctx canvas上下文
 * @param {String} text 需要输入的文本
 * @param {Number} x X轴起始位置
 * @param {Number} y Y轴起始位置
 * @param {Number} maxWidth 单行最大宽度
 * @param {Number} fontSize 字体大小
 * @param {String} color 字体颜色
 * @param {Number} lineHeight 行高
 * @param {String} textAlign 字体对齐方式
 * @param {String} hide 字体对齐方式
 * @param {Boolean} bold 加粗,
 * @param {Boolean} right 加粗,
 *
 */
export function drawTextReturnH(
  ctx,
  text,
  x,
  y,
  maxWidth = 310,
  fontSize = 14,
  color = '#000',
  lineHeight = 30,
  textAlign = 'left',
  hide, bold, right = false
) {
  // let arrText = text.length > 14 ? (text.substring(0, 14) + '...').split('') : text.split('')
  let arrText = text.split('')
  let line = ''
  let textW = 0
  for (let n = 0; n < arrText.length; n++) {
    let testLine = line + arrText[n]
    if (hide === 'hide') {
      ctx.font = 'bold ' + fontSize + 'px sans-serif'
    } else if (bold) {
      ctx.font = 'bold ' + fontSize + 'px sans-serif'
    } else {
      ctx.font = fontSize + 'px sans-serif'
    }
    //设置字体大小，注意：百度小程序 用ctx.setFontSize设置字体大小后，计算字体宽度会无效
    ctx.setFillStyle(color) //设置字体颜色
    let metrics = ctx.measureText(testLine) //measureText() 方法返回包含一个对象，该对象包含以像素计的指定字体宽度。
    let testWidth = metrics.width
    textW = testWidth
    if (testWidth > maxWidth && n > 0) {
      if (hide === 'hide') {
        line = line.substring(0, line.length - 2) + '...'
        ctx.fillText(line, x, y)
        break
      }
      ctx.fillText(line, x, y)
      line = arrText[n]
      y += lineHeight
    } else {
      line = testLine
    }
  }
  if(right){
    x = 265 - textW
  }
  ctx.fillText(line, x, y)
  ctx.setFillStyle('#ffffff')
  ctx.draw(true) //本次绘制是否接着上一次绘制。即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；若 reserve 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面，默认 false。
  return textW + x
}
