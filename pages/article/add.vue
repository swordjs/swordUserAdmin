<template>
	<view class="container">
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">发布文章</view>
				<view class="uni-sub-title"></view>
			</view>
		</view>
		<view class="uni-container">
			<uni-forms ref="form" :value="formData" :rules="rules" validate-trigger="submit">
				<uni-forms-item style="width: 60vw;" labelWid="100" name="title" label="文章标题" required>
					<uni-easyinput v-model="formData.title" :clearable="false" placeholder="请输入题目标题" />
				</uni-forms-item>
				<!-- 选择标签 -->
				<uni-forms-item style="width: 60vw;" name="tag" label="选择标签" required>
					<uni-data-checkbox ref="checkboxRef" emptyText="该专区下暂无标签..." :multiple="true"
						v-model="formData.tagID" collection="questionTag" field="name as text, _id as value" />
				</uni-forms-item>
				<uni-forms-item style="width: 60vw;z-index:1;" name="content" label="文章内容" required>
					<div id="article" style="width: 60vw;"></div>
				</uni-forms-item>

				<view class="uni-button-group">
					<button style="width: 100px;" type="primary" class="uni-button" @click="submitForm">发布</button>
					<navigator open-type="navigateBack" style="margin-left: 15px;"><button style="width: 100px;"
							class="uni-button">返回</button></navigator>
				</view>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import callFunction from "../../common/callFunction.js"
	import WangEditor from 'wangeditor'
	export default {
		mounted() {
			let editor = new WangEditor("#article");
			this.editor = editor;
			editor.create();
		},
		data() {
			return {
				editor: null,
				rules: {
					title: {
						rules: [{
							required: true,
							errorMessage: '请输入题目标题',
						}]
					},
					tag: {
						rules: [{
							required: true,
							errorMessage: '请选择标签',
						}]
					}
				},
				formData: {
					title: "",
					tagID: [],
					content: ""
				}
			};
		},
		methods: {
			setConfig() {
				let setting = {
					uploadImgShowBase64: true,
					pasteFilterStyle: true,
					zIndex: 1,
					showLinkImg: false,
				}
				//配置给编辑器
				this.editor.customConfig = Object.assign(this.editor.customConfig, setting)
			},
			// 提交
			submitForm() {
				this.$refs.form.submit().then(async res => {
					console.log("进入")
					// 获取富文本内容
					const text = this.editor.txt.text();
					console.log(text)
					if (text.length <= 50) {
						uni.showToast({
							title: "您的文章内容太短了，拜托50字以上吧",
							icon: "none"
						})
					} else {
						// 获取富文本内容
						this.formData.content = this.editor.txt.html();
						uni.showLoading({
							title: "提交中...",
							mask: true
						});
						const addResult = await callFunction({
							name: "application",
							data: {
								route: `api/article`,
								method: "POST",
								params: this.formData,
							},
						});
						uni.hideLoading();
						if (addResult.success) {
							uni.showToast({
								title: "发布成功，等待管理员审核～",
								icon: "none"
							});
							this.$refs.form.resetFields()
							// 清空富文本
							this.editor.txt.clear()
						}
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
