<template>
	<view class="container">
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">新增标签</view>
				<view class="uni-sub-title"></view>
			</view>
		</view>
		<view class="uni-container">
			<uni-forms ref="form" :value="formData" :rules="rules" validate-trigger="submit">
				<uni-forms-item labelWid="100" name="name" label="标签名称" required>
					<uni-easyinput v-model="formData.name" :clearable="false" placeholder="请输入标签名称" />
				</uni-forms-item>
				<!-- 选择专区 -->
				<uni-forms-item name="area" label="选择专区" required>
					<uni-data-picker style="width: 100%;" v-model="formData.areaID" preload placeholder="请选择专区"
						popup-title="全部专区" collection="questionArea" field="_id as value, name as text"
						@change="handleAreaPickerChange">
					</uni-data-picker>
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
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入标签名称',
						}]
					},
					area: {
						rules: [{
							required: true,
							errorMessage: '请选择专区',
						}]
					}
				},
				formData: {
					name: "",
					areaID: ""
				}
			};
		},
		methods: {
			// 提交
			submitForm() {
				this.$refs.form.submit().then(async res => {
					uni.showLoading({
						title: "提交中...",
						mask: true
					});
					const addResult = await uniCloud.callFunction({
						name: "application",
						data: {
						  route: `api/questionTag`,
						  method: "POST",
						  params: this.formData,
						},
					});
					uni.hideLoading();
					if(addResult.success){
						uni.showToast({
							title: "新增标签成功",
							icon: "none"
						});
						// 重置表单内容，不能调用form中的resetFields方法，我们只清除标题和内容
						this.formData.name = "";
					}
				}).catch(err => {
					uni.showToast({
						title: "表单信息填写不正确",
						icon: "none"
					})
					console.log('表单错误信息：', err);
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
