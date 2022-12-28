<template>
	<view class="pt">
		<view class="pt-verification-box">
			<view class="pt-verification-images">
<!--				<view class="iconfont refresh" @click="refresh">&#xe64c;</view>-->
				<image mode="widthFix" :src="bgImg" class="bg-img" ref="image"/>
				<image :src="maskImg" class="drag-img" :style="{ left: dragWidth+10 + 'px'}"/>
			</view>
			<view class="pt-dragbar">
				<view :class="['pt-drag-area',{fail: fail,success: success}]" :style="{ width: dragWidth + 'px'}"
              v-if="dragWidth"/>
				<movable-area class="pt-dragbar-area">
					<movable-view
						:class="['pt-dragbar-view',{active: dragWidth > 2,fail: fail,success: success}]"
						:direction="direction"
						@change="drag"
						@touchend="dragEnd"
            @mouseup="dragEnd"
						:damping="200"
						:x="x"
						:animation="false"
						:disabled="fail"
            :data-dragWidth="dragWidth"><view><image src="./right-arrows.svg" class="w-h-right"></image>
<!--							<block v-if="success">&#xe687;</block>-->
<!--							<block v-else-if="fail">&#xe65c;</block>-->
<!--							<block v-else>&#xe62a;</block>-->
						</view>
					</movable-view>
					<text v-if="dragWidth==0" class="tips">{{tips}}</text>
				</movable-area>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			bgImg: {
				type: String,
				default: ''
			},
			maskImg: {
				type: String,
				default: ''
			},
      rightNum: {
				type: Number,
				default: 0
			},
			// 滑块滑动的方向
			direction: {
				type: String,
				default: 'horizontal'
			},
			tips: {
				type: String,
				default: '向右拖动滑块填充拼图'
			}
		},
		data() {
			return {
				disabled: false,
				dragWidth: 0,
				success: false,
				fail: false,
				x: 0
			};
		},
		methods: {
			// 开始拖拽
			drag(e){
				this.dragWidth = e.detail.x
			},
			// 停止滑动后判断前后误差不超过5px，可自行修改
			dragEnd(e){
				this.x = e.currentTarget.dataset.dragwidth
				if(e.currentTarget.dataset.dragwidth > 0 && !this.disabled){
					let result = this.isRangeIn(e.currentTarget.dataset.dragwidth)
					if(!result){
						this.fail = true
						uni.showToast({
							icon: 'none',
							title: '验证失败，再来一次吧',
							duration: 1000
						})
						// 验证失败延迟重置
						setTimeout(() => {
							this.$emit('refresh')
							this.dragWidth = 0
							this.x = 0
							this.fail = false
						},1000)
					}else{
						this.success = true
						this.disabled = true
						this.$emit('success')
					}
				}
			},
			isRangeIn(num ) {
        const width = this.$refs.image.$el.offsetWidth
				var num = parseFloat(num);
        let autos=width*this.rightNum;
        let min=autos-15
        let max=autos+15
				if(num <= max && num >= min){
						return true;
				}
				return false;
			},
			refresh(){
				this.dragWidth = 0
				this.fail = false
				this.success = false
				this.x = 0
				this.disabled = false
				this.$emit('refresh')
			}
		}
	}
</script>

<style lang="scss">
	@font-face {
	  font-family: 'iconfont';  /* project id 2047533 */
	  src: url('https://at.alicdn.com/t/font_2047533_o8axbabfs3.ttf') format('truetype')
	}
  .pt-dragbar{
    height: 100rpx !important;
    margin-top: -2rpx !important;
    border-bottom-left-radius: 12rpx !important;
    border-bottom-right-radius: 12rpx !important;
  }
  .pt-dragbar-view{
    height: 97rpx !important;
    width: 140rpx !important;
  }
	.iconfont {
	  font-family: iconfont !important;
	  font-size: 16rpx;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	.pt{
		width: 670rpx;
		margin: 0 auto;
		&-verification-images{
			position: relative;
			.refresh{
				position: absolute;
				right: 20rpx;
				top: 20rpx;
				z-index: 10;
				color: #FFF;
				font-weight: bold;
			}
			.bg-img{
				width: 100%;
				vertical-align: top;
        border-top-left-radius: 40rpx;
        border-top-right-radius: 40rpx;
			}
			.drag-img{
				position: absolute;
				width: 124rpx;
				top: -2rpx;
				height: 380rpx;
				left: 0;
				z-index: 1;
			}
		}
		&-dragbar{
			position: relative;
			height: 80rpx;
			background-color: #F2F2F2;
			border: solid 2rpx #EEE;
			margin-top: 20rpx;
			.pt-drag-area{
				position: absolute;
				height: 100rpx;
				//border: solid 2rpx $uni-color-primary;
				background-color: #D1E9F1;
				top: -2rpx;
        border-bottom-left-radius: 12rpx;
        border-bottom-right-radius: 12rpx;
				&.fail{
					border-color: $uni-color-error;
					background-color: #ffdbdb;
				}
				&.success{
					border-color: $uni-color-success;
					background-color: #d7ffe1;
				}
			}
			&-area{
				position: absolute;
				width: 100%;
				height: 100%;
				left: -2rpx;
				top: 0;
        border-bottom-right-radius: 12rpx;
        border-bottom-left-radius: 12rpx;
				.tips{
          height: 96rpx;
					font-size: 28rpx;
					//color: #999;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
					//position: absolute;
					//left: 50%;
					//top: 50%;
					//transform: translate(-50%,-24%);
				}
			}
			&-view{
				width: 80rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border: solid 2rpx #EEE;
				background-color: #FFF;
        border-radius: 12rpx;
				top: -2rpx;
				left: 0rpx;
				&.active{
					background-color: #7948F7;
					border-color: $uni-color-primary;
					color: #FFF;
				}
				&.fail{
					background-color: $uni-color-error;
					border-color: $uni-color-error;
				}
				&.success{
					border-color: $uni-color-success;
					background-color: #00a029;
				}
			}
		}
	}
  .w-h-right{
    width: 32rpx;
    height: 32rpx;
  }
</style>
