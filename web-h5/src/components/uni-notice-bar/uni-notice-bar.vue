<template>
	<view v-if="show" class="uni-noticebar" :style="{ backgroundColor }" @click="onClick">
    <img src="../../static/img/notice-logo.svg" alt="" class="notice-logo">
		<view ref="textBox" class="uni-noticebar__content-wrapper"
			:class="{
				'uni-noticebar__content-wrapper--scrollable': scrollable,
				'uni-noticebar__content-wrapper--single': !scrollable && (single || moreText)
			}"
			:style="{ height: scrollable ? fontSize * 1.5 + 'rpx' : 'auto' }"
		>
			<view :id="elIdBox" class="uni-noticebar__content"
				:class="{
					'uni-noticebar__content--scrollable': scrollable,
					'uni-noticebar__content--single': !scrollable && (single || moreText)
				}"
			>
				<text :id="elId" ref="animationEle" class="uni-noticebar__content-text"
					:class="{
						'uni-noticebar__content-text--scrollable': scrollable,
						'uni-noticebar__content-text--single': !scrollable && (single || showGetMore)
					}"
					:style="{
						color: color,
						fontSize: fontSize + 'rpx',
						lineHeight: fontSize * 1.5 + 'rpx',
						width: wrapWidth + 'rpx',
						'animationDuration': animationDuration,
						'-webkit-animationDuration': animationDuration,
						animationPlayState: webviewHide ? 'paused' : animationPlayState,
						'-webkit-animationPlayState': webviewHide ? 'paused' : animationPlayState,
						animationDelay: animationDelay,
						'-webkit-animationDelay': animationDelay
					}"
				>{{text}}</text>
			</view>
		</view>
		<view v-if="isShowGetMore" class="uni-noticebar__more uni-cursor-point"
			@click="clickMore">
			<text v-if="moreText.length > 0" :style="{ color: moreColor, fontSize: fontSize + 'rpx' }">{{ moreText }}</text>
			<uni-icons v-else type="right" :color="moreColor" :size="fontSize * 1.1" />
		</view>
		<view class="uni-noticebar-close uni-cursor-point" v-if="isShowClose">
			<uni-icons type="closeempty" :color="color" :size="fontSize * 1.1" @click="close" />
		</view>
    <view class="pos-abs"></view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom');
	const animation = weex.requireModule('animation');
	// #endif

	/**
	 * NoticeBar ??????????????????
	 * @description ???????????????
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=30
	 * @property {Number} speed ??????????????????????????????100rpx/???
	 * @property {String} text ????????????
	 * @property {String} backgroundColor ????????????
	 * @property {String} color ????????????
	 * @property {String} moreColor ???????????????????????????
	 * @property {String} moreText ?????????????????????????????????
	 * @property {Boolean} single = [true|false] ????????????
	 * @property {Boolean} scrollable = [true|false] ??????????????????true??????NoticeBar?????????
	 * @property {Boolean} showIcon = [true|false] ??????????????????????????????
	 * @property {Boolean} showClose = [true|false] ??????????????????????????????
	 * @property {Boolean} showGetMore = [true|false] ??????????????????????????????????????????true??????NoticeBar?????????
	 * @event {Function} click ?????? NoticeBar ????????????
	 * @event {Function} close ?????? NoticeBar ????????????
	 * @event {Function} getmore ???????????????????????????????????????
	 */

	export default {
		name: 'UniNoticeBar',
		emits: ['click', 'getmore', 'close'],
		props: {
			text: {
				type: String,
				default: ''
			},
			moreText: {
				type: String,
				default: ''
			},
			backgroundColor: {
				type: String,
				default: 'rgba(121, 72, 247,0.08)'
			},
			speed: {
				// ??????1s??????100rpx
				type: Number,
				default: 50
			},
			color: {
				type: String,
				default: '#7948F7'
			},
			fontSize: {
				type: Number,
				default: 28
			},
			moreColor: {
				type: String,
				default: '#FF9A43'
			},
			single: {
				// ????????????
				type: [Boolean, String],
				default: false
			},
			scrollable: {
				// ????????????????????????????????????????????????
				type: [Boolean, String],
				default: false
			},
			showIcon: {
				// ??????????????????icon
				type: [Boolean, String],
				default: false
			},
			showGetMore: {
				// ??????????????????????????????
				type: [Boolean, String],
				default: false
			},
			showClose: {
				// ??????????????????????????????
				type: [Boolean, String],
				default: false
			}
		},
		data() {
			const elId = `Uni_${Math.ceil(Math.random() * 10e5).toString(36)}`
			const elIdBox = `Uni_${Math.ceil(Math.random() * 10e5).toString(36)}`
			return {
				textWidth: 0,
				boxWidth: 0,
				wrapWidth: '',
				webviewHide: false,
				// #ifdef APP-NVUE
				stopAnimation: false,
				// #endif
				elId: elId,
				elIdBox: elIdBox,
				show: true,
				animationDuration: 'none',
				animationPlayState: 'paused',
				animationDelay: '0s'
			}
		},
		computed: {
			isShowGetMore() {
				return this.showGetMore === true || this.showGetMore === 'true'
			},
			isShowClose() {
				return (this.showClose === true || this.showClose === 'true')
					&& (this.showGetMore === false || this.showGetMore === 'false')
			}
		},
		mounted() {
			// #ifdef APP-PLUS
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			var currentWebview = page.$getAppWebview();
			currentWebview.addEventListener('hide', () => {
				this.webviewHide = true
			})
			currentWebview.addEventListener('show', () => {
				this.webviewHide = false
			})
			// #endif
			this.$nextTick(() => {
				this.initSize()
			})
		},
		// #ifdef APP-NVUE
		beforeDestroy() {
			this.stopAnimation = true
		},
		// #endif
		methods: {
			initSize() {
				if (this.scrollable) {
					// #ifndef APP-NVUE
					let query = [],
						boxWidth = 0,
						textWidth = 0;
					let textQuery = new Promise((resolve, reject) => {
						uni.createSelectorQuery()
							// #ifndef MP-ALIPAY
							.in(this)
							// #endif
							.select(`#${this.elId}`)
							.boundingClientRect()
							.exec(ret => {
								this.textWidth = ret[0].width
								resolve()
							})
					})
					let boxQuery = new Promise((resolve, reject) => {
						uni.createSelectorQuery()
							// #ifndef MP-ALIPAY
							.in(this)
							// #endif
							.select(`#${this.elIdBox}`)
							.boundingClientRect()
							.exec(ret => {
								this.boxWidth = ret[0].width
								resolve()
							})
					})
					query.push(textQuery)
					query.push(boxQuery)
					Promise.all(query).then(() => {
						this.animationDuration = `${this.textWidth / this.speed}s`
						this.animationDelay = `-${this.boxWidth / this.speed}s`
						setTimeout(() => {
							this.animationPlayState = 'running'
						}, 500)
					})
					// #endif
					// #ifdef APP-NVUE
					dom.getComponentRect(this.$refs['animationEle'], (res) => {
						let winWidth = uni.getSystemInfoSync().windowWidth
						this.textWidth = res.size.width
						animation.transition(this.$refs['animationEle'], {
							styles: {
								transform: `translateX(-${winWidth}rpx)`
							},
							duration: 0,
							timingFunction: 'linear',
							delay: 0
						}, () => {
							if (!this.stopAnimation) {
								animation.transition(this.$refs['animationEle'], {
									styles: {
										transform: `translateX(-${this.textWidth}rpx)`
									},
									timingFunction: 'linear',
									duration: (this.textWidth - winWidth) / this.speed * 1000,
									delay: 1000
								}, () => {
									if (!this.stopAnimation) {
										this.loopAnimation()
									}
								});
							}
						});
					})
					// #endif
				}
				// #ifdef APP-NVUE
				if (!this.scrollable && (this.single || this.moreText)) {
					dom.getComponentRect(this.$refs['textBox'], (res) => {
						this.wrapWidth = res.size.width
					})
				}
				// #endif
			},
			loopAnimation() {
				// #ifdef APP-NVUE
				animation.transition(this.$refs['animationEle'], {
					styles: {
						transform: `translateX(0rpx)`
					},
					duration: 0
				}, () => {
					if (!this.stopAnimation) {
						animation.transition(this.$refs['animationEle'], {
							styles: {
								transform: `translateX(-${this.textWidth}rpx)`
							},
							duration: this.textWidth / this.speed * 1000,
							timingFunction: 'linear',
							delay: 0
						}, () => {
							if (!this.stopAnimation) {
								this.loopAnimation()
							}
						});
					}
				});
				// #endif
			},
			clickMore() {
				this.$emit('getmore')
			},
			close() {
				this.show = false;
				this.$emit('close')
			},
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
  .notice-logo{
    width: 32rpx;
    height: 28rpx;
    margin-left: 30rpx;
    margin-right: 20rpx;
  }
  .pos-abs{
    position: absolute;
    right: 40rpx;
    width: 60rpx;
    height: 80rpx;
    background: linear-gradient(270deg, #F4F0FE 0%, rgba(244,240,254,0) 100%);
    border-radius: 20rpx;
  }
	.uni-noticebar {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
    height: 80rpx;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		padding: 26rpx 0rpx 26rpx 0rpx;
    border-radius: 20rpx;
	}

	.uni-cursor-point {
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-noticebar-close {
		margin-left: 8rpx;
		margin-right: 5rpx;
	}

	.uni-noticebar-icon {
		margin-right: 5rpx;
	}

	.uni-noticebar__content-wrapper {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
	}

	.uni-noticebar__content-wrapper--single {
		/* #ifndef APP-NVUE */
		line-height: 34rpx;
		/* #endif */
	}

	.uni-noticebar__content-wrapper--single,
	.uni-noticebar__content-wrapper--scrollable {
		flex-direction: row;
	}

	/* #ifndef APP-NVUE */
	.uni-noticebar__content-wrapper--scrollable {
		position: relative;
	}

	/* #endif */

	.uni-noticebar__content--scrollable {
		/* #ifdef APP-NVUE */
		flex: 0;
		/* #endif */
		/* #ifndef APP-NVUE */
		flex: 1;
		display: block;
		overflow: hidden;
		/* #endif */
	}

	.uni-noticebar__content--single {
		/* #ifndef APP-NVUE */
		display: flex;
		flex: none;
		width: 100%;
		justify-content: center;
		/* #endif */
	}

	.uni-noticebar__content-text {
		font-size: 24rpx;
    height: 34rpx;
		line-height: 28rpx;
		/* #ifndef APP-NVUE */
		word-break: break-all;
    font-weight: bold;
		/* #endif */
	}

	.uni-noticebar__content-text--single {
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		display: block;
		width: 100%;
		white-space: nowrap;
		/* #endif */
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.uni-noticebar__content-text--scrollable {
		/* #ifdef APP-NVUE */
		lines: 1;
		padding-left: 750rrpx;
		/* #endif */
		/* #ifndef APP-NVUE */
		position: absolute;
		display: block;
		height: 34rpx;
		line-height: 34rpx;
		white-space: nowrap;
		padding-left: 100%;
		animation: notice 10s 0s linear infinite both;
		animation-play-state: paused;
		/* #endif */
	}

	.uni-noticebar__more {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		padding-left: 5rpx;
	}

	@keyframes notice {
		100% {
			transform: translate3d(-100%, 0, 0);
		}
	}
</style>
