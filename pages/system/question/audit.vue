<template>
	<view class="container">
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">审核</view>
				<view class="uni-sub-title"></view>
			</view>
		</view>
		<view class="uni-container">
			<radio-group style="display: flex;justify-content: flex-start;align-items: center;" @change="radioChange">
				<label>
					<radio value="pass" :checked="formData.type === 'pass'" />
					<text>审核成功</text>
				</label>
				<label style="margin-left: 20px;" :checked="formData.type === 'reject'">
					<radio value="reject" />
					<text>审核失败</text>
				</label>
			</radio-group>
			<div class="reason" v-if="formData.type === 'reject'">
				<uni-easyinput v-model="formData.reason" :clearable="false" placeholder="请输入拒绝理由" />
			</div>
			<view class="uni-button-group" style="display: flex;justify-content: flex-start;">
				<button style="width: 100px;" type="primary" class="uni-button" @click="submitForm">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;"><button style="width: 100px;"
						class="uni-button">返回</button></navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import callFunction from "../../../common/callFunction.js"
	export default {
		onLoad(e) {
			this.formData.id = e.id;
		},
		data() {
			return {
				formData: {
					id: "",
					type: "pass",
					reason: ""
				},
			};
		},
		methods: {
			radioChange(e) {
				this.formData.type = e.detail.value;
			},
			async submitForm() {
				uni.showLoading({
					title: "提交中...",
					mask: true
				});
				// 判断是审核成功还是失败
				const params = {
					_id: [this.formData.id],
					state: this.formData.type
				}
				if (params.state === "reject") {
					if (this.formData.reason === "") {
						uni.showToast({
							title: "请填写拒绝原因",
							icon: "none"
						})
						return;
					}
					params.examineInfo = {
						reason: this.formData.reason
					}
				}
				const result = await callFunction({
					name: "application",
					data: {
						route: `api/question/examineQuestion`,
						method: "PUT",
						params,
					},
				});
				uni.hideLoading();
				if (result.success) {
					uni.showToast({
						title: "处理成功",
						icon: "none"
					});
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.reason {
		width: 30vw;
		margin-top: 10px;
	}
</style>
