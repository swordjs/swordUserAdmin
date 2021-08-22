<template>
	<view class="uni-container">
		<uni-forms ref="form" validateTrigger="bind">
			<uni-forms-item name="name">
				<uni-easyinput placeholder="请输入api名称" v-model="formData.name" />
			</uni-forms-item>
			<uni-forms-item name="remark">
				<uni-easyinput placeholder="请输入备注" v-model="formData.remark" />
			</uni-forms-item>
			<!-- 这里新增info -->
			<uni-forms-item name="info">
				<view class="info-item">
					<uni-easyinput placeholder="请输入api对应的云函数名称" v-model="formData.info.name" />
				</view>
				<view class="info-item">
					<uni-easyinput placeholder="请输入云函数对应的路由" v-model="formData.info.route" />
				</view>
				<view class="info-item">
					<uni-data-picker placeholder="请输入请求方式, GET/POST/PUT/DELETE"
						:localdata='[{text: "GET", value: "GET" }, { text: "POST" , value: "POST" },{ text: "PUT" , value: "PUT" },{ text: "DELETE" , value: "DELETE" }]'
						v-model="formData.info.method"></uni-data-picker>
				</view>
				<!-- 参数列表 -->
				<view class="params-list">
					<view class="params-list-item" v-for="(item, index) in paramOptions" :key="index">
						<uni-easyinput placeholder="key键名" v-model="item.name" />
						<view class="required">
							<uni-data-checkbox v-model="item.required" :localdata="[{
									text: ' 必填', value: 1 }, { text: '非必填' , value: 0 }]" :multiple="false">
							</uni-data-checkbox>
						</view>
						<view class="delete" @click="handleClickDeleteOption(index)">
							<uni-icons type="close"></uni-icons>
						</view>
					</view>
				</view>
				<!-- 新增参数 -->
				<button style="margin-top: 10px;" class="uni-button" @click="handleAddParamOption">新增参数选项</button>
			</uni-forms-item>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;">
					<button class="uni-button" style="width: 100px;">返回</button>
				</navigator>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import callFunction from "../../../common/callFunction.js"
	
	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'openApi';

	export default {
		data() {
			return {
				formData: {
					name: "",
					remark: "",
					info: {
						name: "",
						route: "",
						method: ""
					}
				},
				paramOptions: [],
			}
		},
		methods: {
			handleAddParamOption() {
				this.paramOptions.push({
					name: "",
					required: 1
				})
			},
			handleClickDeleteOption(index) {
				this.paramOptions.splice(index, 1)
			},
			/**
			 * 校验参数
			 */
			handleParams() {
				// 校验是否为空
				if (this.formData.name === "" || this.formData.remark === "") {
					uni.showToast({
						title: "请输入api名称和备注",
						icon: "none"
					})
					return;
				} else if (this.formData.info.name === "" || this.formData.info.route === "" || this.formData.info
					.method === "") {
					uni.showToast({
						title: "请输入url信息(云函数名称，路由，请求方法)",
						icon: "none"
					})
					return;
				}
				// 如果有参数列表的话，就校验key是否填写了
				if (this.paramOptions.length > 0) {
					for (let key in this.paramOptions) {
						let e = this.paramOptions[key];
						if (e.name === "") {
							uni.showToast({
								title: `您的第${Number(key) + 1}个参数的key未填写`,
								icon: "none"
							})
							return;
						}
					}
				}
				return true;
			},
			/**
			 * 触发表单提交
			 */
			async submit() {
				if (this.handleParams()) {
					// 将paramOptions中的必填转换为boolean
					const _paramOptions = this.paramOptions.map(p => {
						return {
							...p,
							required: Boolean(p.required)
						}
					})
					uni.showLoading({
						title: "提交中...",
						mask: true
					});
					const addResult = await callFunction({
						name: "application",
						data: {
							route: `api/openApi`,
							method: "POST",
							params: {
								...this.formData,
								info: {
									...this.formData.info,
									params: _paramOptions
								}
							},
						},
					});
					uni.hideLoading();
					if (addResult.success) {
						uni.showToast({
							title: "添加成功",
							icon: "none"
						});
					}
				}
			},
		}
	}
</script>
<style lang="scss">
	.info-item {
		margin-top: 10px;
	}

	.params-list {
		.params-list-item {
			position: relative;
			padding: 20px 0;

			&:not(:last-child) {
				border-bottom: 1px solid #ccc;
			}

			.required {
				margin-top: 10px;
			}

			.delete {
				position: absolute;
				right: -10%;
				top: 50%;
				transform: translateY(-50%);
				cursor: pointer;
			}
		}
	}
</style>
