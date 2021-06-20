<template>
	<view class="container">
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">新增专区</view>
				<view class="uni-sub-title"></view>
			</view>
		</view>
		<view class="uni-container">
			<uni-forms ref="form" :v-model="formData" validate-trigger="submit">
				<uni-forms-item labelWid="100" name="name" label="专区名称" required>
					<uni-easyinput v-model="formData.name" :clearable="false" placeholder="请输入专区名称" />
				</uni-forms-item>
				<uni-forms-item labelWid="100" name="icon" label="专区图标" required>
					<uni-file-picker limit="1" v-model="formData.icon" fileMediatype="image" mode="list" />
				</uni-forms-item>
				<view class="uni-button-group">
					<button style="width: 100px;" type="primary" class="uni-button" @click="submitForm">提交</button>
					<navigator open-type="navigateBack" style="margin-left: 15px;"><button style="width: 100px;"
							class="uni-button">返回</button></navigator>
				</view>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					name: "",
					icon: []
				},
			};
		},
		methods: {
			async submitForm() {
				if (this.formData.name === "" || this.formData.icon.length === 0) {
					uni.showToast({
						title: "专区名称或者图标为空",
						icon: "none"
					});
				} else {
					uni.showLoading({
						title: "提交中...",
						mask: true
					});
					const addResult = await uniCloud.callFunction({
						name: "application",
						data: {
							route: `api/questionArea`,
							method: "POST",
							params: {
								name: this.formData.name,
								iconPath: this.formData.icon[0].url
							},
						},
					});
					uni.hideLoading();
					if (addResult.success) {
						uni.showToast({
							title: "添加成功",
							icon: "none"
						});
					}else{
						uni.showToast({
							title: addResult.msg,
							icon: "none"
						});
					}
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
