<template>
	<view class="container">
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">文章详情</view>
				<view class="uni-sub-title"></view>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db
				ref="udb"
				v-slot:default="{ data, loading, error, options }"
				collection="article,questionTag,uni-id-users"
				field="title,content,tagID{name}"
				:getone="true"
				:where="`_id=='${id}'`"
				:manual="true"
			>
				<uni-forms ref="form" :value="formData" :rules="rules" validate-trigger="submit">
					<uni-forms-item style="width: 60vw;" labelWid="100" name="title" label="文章标题" required>
						<uni-easyinput v-model="formData.title" :clearable="false" placeholder="请输入题目标题" />
					</uni-forms-item>
					<!-- 选择标签 -->
					<uni-forms-item style="width: 60vw;" name="tag" label="选择标签" required>
						<uni-data-checkbox
							ref="checkboxRef"
							emptyText="该专区下暂无标签..."
							:multiple="true"
							v-model="formData.tagID"
							collection="questionTag"
							field="name as text, _id as value"
						/>
					</uni-forms-item>
					<uni-forms-item style="width: 60vw;z-index:1;" name="content" label="文章内容" required>
						<div id="article" style="width: 60vw;"></div>
					</uni-forms-item>
					<uni-forms-item style="width: 60vw;z-index:1;" name="result" label="审核结果" required>
						<radio-group style="width: 300px;display: flex;" @change="radioChange">
							<label class="radio">
								<radio value="pass" checked />审核通过
							</label>
							<label class="radio" style="margin-left: 30px;">
								<radio value="reject" />审核失败
							</label>
						</radio-group>
					</uni-forms-item>
					<uni-forms-item
						v-if="state === 'reject'"
						style="width: 60vw;"
						labelWid="100"
						name="reason"
						label="拒绝原因"
						required
					>
						<uni-easyinput v-model="formData.reason" :clearable="false" placeholder="请输入拒绝原因" />
					</uni-forms-item>

					<view class="uni-button-group">
						<button style="width: 100px;" type="primary" class="uni-button" @click="submitAudit">确定审核</button>
						<button
							style="width: 100px;margin-left: 15px;"
							type="primary"
							class="uni-button"
							@click="submitForm"
						>修改信息</button>
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
import WangEditor from 'wangeditor'
export default {
	onLoad(e) {
		this.id = e.id;
	},
	mounted() {
		let editor = new WangEditor("#article");
		this.editor = editor;
		editor.create();
		// 加载数据
		this.loadData();
	},
	data() {
		return {
			id: "",
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
			state: "pass",
			formData: {
				title: "",
				tagID: [],
				content: "",
				reason: ""
			}
		};
	},
	methods: {
		loadData() {
			this.$refs.udb.loadData((res) => {
				this.formData = {
					title: res.title,
					tagID: res.tagID.map(t => t._id),
					content: res.content
				}
				this.editor.txt.html(res.content)
			})
		},
		radioChange(e) {
			const {
				value
			} = e.detail;
			this.state = value;
			console.log(this.state)
		},
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
		// 审核
		async submitAudit() {
			uni.showLoading({
				title: "请稍后",
				mask: true
			});
			const params = {
				id: this.id,
				state: this.state,
			}
			// 如果是拒绝，就赋值拒绝原因
			params.rejectReason = this.formData.reason;
			const result = await callFunction({
				route: `api/article/auditArticle`,
				method: "POST",
				params,
			});
			uni.hideLoading();
			if (result.success) {
				uni.showToast({
					title: "审核完成～",
					icon: "none"
				});
				this.loadData();
			}
		},
		// 修改信息	
		submitForm() {
			this.$refs.form.submit().then(async res => {
				// 获取富文本内容
				const text = this.editor.txt.text();
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
						route: `api/article`,
						method: "PUT",
						params: {
							id: this.id,
							...this.formData
						},
					});
					uni.hideLoading();
					if (addResult.success) {
						uni.showToast({
							title: "修改成功",
							icon: "none"
						});
						this.loadData();
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
