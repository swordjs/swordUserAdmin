<template>
	<view>
		<view class="uni-header">
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
				<button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" collection="openApi" field="name,remark,state,info,createDate,updateDate"
				:where="where" page-data="replace" :orderby="orderby" :getcount="true" :page-size="options.pageSize"
				:page-current="options.pageCurrent" v-slot:default="{ data, pagination, loading, error, options }"
				:options="options">
				<uni-table :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection"
					@selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center">api名称</uni-th>
						<uni-th align="center">备注</uni-th>
						<uni-th align="center">状态</uni-th>
						<uni-th align="center">详情</uni-th>
						<uni-th align="center">创建时间</uni-th>
						<uni-th align="center">修改时间</uni-th>
						<uni-th width="204" align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{ item.name }}</uni-td>
						<uni-td align="center">{{ item.remark }}</uni-td>
						<!-- 这里展示状态列表 -->
						<uni-td align="center">
							<uni-data-checkbox 
								style="display: flex;justify-content: center;"
								@change="handleStateChange($event, item._id)" v-model="item.state" :localdata='[{
								text: "开启", value: "open" }, { text: "关闭" , value: "close" }]' :multiple="false">
							</uni-data-checkbox>
						</uni-td>
						<!-- 这里展示详情信息 -->
						<uni-td align="center">
							云函数名称: {{ item.info.url.name }}
							<br />
							云函数路由: {{ item.info.url.route }}
							<br />
							云函数请求方式: {{ item.info.url.method }}
							<br />
							云函数必传参数:
							{{ item.info.url.params.map(p => `${p.key}(${p.required ? '必传' : '非必传'})`).join(",") }}
							<br />
						</uni-td>
						<uni-td align="center">
							<uni-dateformat :date="item.createDate" :threshold="[0, 0]" />
						</uni-td>
						<uni-td align="center">
							<uni-dateformat :date="item.updateDate" :threshold="[0, 0]" />
						</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button @click="navigateTo('./edit?id=' + item._id, false)" class="uni-button"
									size="mini" type="primary">修改</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current"
						:total="pagination.count" @change="onPageChanged" />
				</view>
			</unicloud-db>
		</view>
	</view>
</template>

<script>
	import callFunction from "../../../common/callFunction.js"

	import {
		enumConverter
	} from '../../../js_sdk/validator/openApi.js';

	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = '' // 排序字段
	const dbSearchFields = ["name", "remark"] // 模糊搜索字段，支持模糊搜索的字段列表
	// 分页配置
	const pageSize = 20
	const pageCurrent = 1

	export default {
		data() {
			return {
				query: '',
				where: '',
				orderby: dbOrderBy,
				selectedIndexs: [],
				options: {
					pageSize,
					pageCurrent,
					...enumConverter
				},
				imageStyles: {
					width: 64,
					height: 64
				}
			}
		},
		methods: {
			async handleStateChange(e, id) {
				uni.showLoading({
					title: "更改状态中...",
					mask: true
				});
				const result = await callFunction({
					route: `api/openApi/toggleOpenApiState`,
					method: "POST",
					params: {
						id,
						state: e.detail.value
					},
				});
				uni.hideLoading();
				if (result.success) {
					uni.showToast({
						title: "更改状态成功",
						icon: "none"
					});
				}
			},
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return ''
				}
				const queryRe = new RegExp(query, 'i')
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search() {
				const newWhere = this.getWhere()
				const isSameWhere = newWhere === this.where
				this.where = newWhere
				if (isSameWhere) { // 相同条件时，手动强制刷新
					this.loadData()
				}
			},
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},
			onPageChanged(e) {
				this.$refs.udb.loadData({
					current: e.current
				})
			},
			navigateTo(url, clear) {
				// clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.loadData(clear)
						}
					}
				})
			},
		}
	}
</script>
<style scoped>
</style>
