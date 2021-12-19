<template>
	<view class="container">
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">修改标签</view>
				<view class="uni-sub-title"></view>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db
				ref="udb"
				v-slot:default="{ data, loading, error, options }"
				collection="sword-question-tag"
				field="name,areaID"
				:getone="true"
				:where="`_id=='${formData.id}'`"
				:manual="true"
			>
				<uni-forms ref="form" :value="formData" :rules="rules" validate-trigger="submit">
					<uni-forms-item labelWid="100" name="name" label="标签名称" required>
						<uni-easyinput v-model="formData.name" :clearable="false" placeholder="请输入标签名称" />
					</uni-forms-item>
					<!-- 选择专区 -->
					<uni-forms-item name="areaID" label="选择专区" required>
						<uni-data-picker
							style="width: 100%;"
							v-model="formData.areaID"
							preload
							placeholder="请选择专区"
							popup-title="全部专区"
							collection="questionArea"
							field="_id as value, name as text"
						></uni-data-picker>
					</uni-forms-item>
					<view class="uni-button-group">
						<button style="width: 100px;" type="primary" class="uni-button" @click="submitForm">提交</button>
						<navigator open-type="navigateBack" style="margin-left: 15px;">
							<button style="width: 100px;" class="uni-button">返回</button>
						</navigator>
					</view>
				</uni-forms>
			</unicloud-db>
		</view>
	</view>
</template>

<script>
import callFunction from "../../../common/callFunction.js"
export default {
	onLoad(e) {
		this.formData.id = e.id;
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			rules: {
				name: {
					rules: [{
						required: true,
						errorMessage: '请输入标签名称',
					}]
				},
				areaID: {
					rules: [{
						required: true,
						errorMessage: '请选择专区',
					}]
				}
			},
			formData: {
				id: "",
				name: "",
				areaID: ""
			}
		};
	},
	methods: {
		loadData() {
			this.$refs.udb.loadData((res) => {
				this.formData.name = res.name;
				this.formData.areaID = res.areaID;
			})
		},
		// 提交
		submitForm() {
			this.$refs.form.submit().then(async res => {
				uni.showLoading({
					title: "提交中...",
					mask: true
				});
				const editResult = await callFunction({
					route: `api/questionTag`,
					method: "PUT",
					params: {
						...this.formData,
						_id: this.formData.id,
						id: undefined
					},
				});
				uni.hideLoading();
				if (editResult.success) {
					uni.showToast({
						title: "修改标签成功",
						icon: "none"
					});
					this.loadData()
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
