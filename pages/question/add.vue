<template>
	<view class="container">
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">新增题目</view>
				<view class="uni-sub-title"></view>
			</view>
		</view>
		<view class="uni-container">
			<uni-forms ref="form" :value="formData" :rules="rules" validate-trigger="submit">
				<uni-forms-item labelWid="100" name="title" label="题目标题" required>
					<uni-easyinput v-model="formData.title" :clearable="false" placeholder="请输入题目标题" />
				</uni-forms-item>
				<!-- 选择专区 -->
				<uni-forms-item name="area" label="选择专区" required>
					<uni-data-picker
						style="width: 100%;"
						v-model="formData.areaID"
						preload
						placeholder="请选择专区"
						popup-title="全部专区"
						collection="questionArea"
						field="_id as value, name as text"
						@change="handleAreaPickerChange"
					></uni-data-picker>
				</uni-forms-item>
				<!-- 选择标签 -->
				<uni-forms-item name="tag" label="选择标签" v-show="formData.areaID !== ''">
					<uni-data-checkbox
						ref="checkboxRef"
						emptyText="该专区下暂无标签..."
						:multiple="true"
						v-model="formData.tagID"
						:where="`areaID == '${formData.areaID}'`"
						collection="questionTag"
						field="name as text, _id as value"
					/>
				</uni-forms-item>
				<uni-forms-item name="content" label="题目内容">
					<uni-easyinput
						type="textarea"
						autoHeight
						v-model="formData.content"
						:clearable="false"
						placeholder="请输入题目内容"
					/>
				</uni-forms-item>
				<view class="uni-button-group">
					<button style="width: 100px;" type="primary" class="uni-button" @click="submitForm">提交</button>
					<navigator open-type="navigateBack" style="margin-left: 15px;">
						<button style="width: 100px;" class="uni-button">返回</button>
					</navigator>
				</view>
			</uni-forms>
		</view>
	</view>
</template>

<script>
import callFunction from "../../common/callFunction.js"
export default {
	data() {
		return {
			rules: {
				title: {
					rules: [{
						required: true,
						errorMessage: '请输入题目标题',
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
				title: "",
				areaID: "",
				tagID: [],
				content: ""
			}
		};
	},
	methods: {
		handleAreaPickerChange() {
			// 因为tag这里是v-show之前是隐藏的，在area回调之后，area还没有值，所以立即调用loadData是空，所以这边要等area 双向绑定完毕之后再进行load
			// 即可实现area改变，重新加载tag checkbox的功能
			this.$nextTick(() => {
				this.$refs.checkboxRef.loadData();
			})
		},
		// 提交
		submitForm() {
			this.$refs.form.submit().then(async res => {
				uni.showLoading({
					title: "提交中...",
					mask: true
				});
				const addResult = await callFunction({
					route: `api/question`,
					method: "POST",
					params: this.formData,
				});
				uni.hideLoading();
				if (addResult.success) {
					uni.showToast({
						title: "发布成功",
						icon: "none"
					});
					// 重置表单内容，不能调用form中的resetFields方法，我们只清除标题和内容
					this.formData.title = "";
					this.formData.content = "";
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
