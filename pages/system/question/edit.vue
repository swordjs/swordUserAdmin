<template>
	<view class="container">
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">修改题目</view>
				<view class="uni-sub-title"></view>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db
				ref="udb"
				v-slot:default="{ data, loading, error, options }"
				collection="question"
				field="title, content,tagID,areaID"
				:getone="true"
				:where="`_id=='${formData.id}'`"
				:manual="true"
			>
				<uni-forms ref="form" :value="formData" :rules="rules" validate-trigger="submit">
					<uni-forms-item labelWid="100" name="title" label="题目标题" required>
						<uni-easyinput v-model="formData.title" :clearable="false" placeholder="请输入专区名称" />
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
					<uni-forms-item labelWid="100" name="content" label="题目内容" required>
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
		this.loadData();
	},
	data() {
		return {
			rules: {
				title: {
					rules: [{
						required: true,
						errorMessage: '请输入标题',
					}]
				},
				area: {
					rules: [{
						required: true,
						errorMessage: '请选择专区',
					}]
				},
				content: {
					rules: [{
						required: true,
						errorMessage: '请输入内容',
					}]
				}
			},
			formData: {
				id: "",
				title: "",
				areaID: "",
				tagID: [],
				content: ""
			},
		};
	},
	methods: {
		loadData() {
			this.$refs.udb.loadData((res) => {
				this.formData.title = res.title;
				this.formData.content = res.content;
				this.formData.areaID = res.areaID;
				this.formData.tagID = res.tagID === "" ? [] : res.tagID;
				this.handleAreaPickerChange();
			})
		},
		handleAreaPickerChange() {
			// 因为tag这里是v-show之前是隐藏的，在area回调之后，area还没有值，所以立即调用loadData是空，所以这边要等area 双向绑定完毕之后再进行load
			// 即可实现area改变，重新加载tag checkbox的功能
			this.$nextTick(() => {
				this.$refs.checkboxRef.loadData();
			})
		},
		async submitForm() {
			this.$refs.form.submit().then(async res => {
				uni.showLoading({
					title: "提交中...",
					mask: true
				});
				const editResult = await callFunction({
					route: `api/question`,
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
						title: "修改成功",
						icon: "none"
					});
					this.loadData();
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
