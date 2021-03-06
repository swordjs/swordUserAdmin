<template>
	<view class="container">
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">标签管理</view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="标签名称" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
				<button @click="navigateTo('./add')" size="mini" class="uni-button" type="primary">新增</button>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db
				ref="dataQuery"
				@load="onqueryload"
				collection="questionTag,questionArea"
				:options="options"
				:where="{
					...where,
					deleteDate: ''
				}"
				page-data="replace"
				:orderby="orderby"
				:getcount="true"
				:page-size="options.pageSize"
				:page-current="options.pageCurrent"
				v-slot:default="{ data, pagination, loading, error }"
			>
				<uni-table :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe>
					<uni-tr>
						<uni-th width="250" align="center">id</uni-th>
						<uni-th width="150" align="center">专区名称</uni-th>
						<uni-th width="250" align="center">标签名称</uni-th>
						<uni-th width="170" align="center">创建时间</uni-th>
						<uni-th width="160" align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in data" :key="index">
						<uni-td align="center">{{ item._id }}</uni-td>
						<uni-td align="center">{{ item.areaID[0].name }}</uni-td>
						<uni-td align="center">{{ item.name }}</uni-td>
						<uni-td align="center">{{ item.createDate | formatTime }}</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button
									size="mini"
									@click="navigateTo('./edit?id=' + item._id, false)"
									class="uni-button"
									type="primary"
								>修改</button>
								<button size="mini" @click="confirmDelete(item._id)" class="uni-button" type="warn">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<picker
						class="select-picker"
						mode="selector"
						:value="pageSizeIndex"
						:range="pageSizeOption"
						@change="changeSize"
					>
						<button type="default" size="mini" :plain="true">
							<text>{{ pageSizeOption[pageSizeIndex] }} 条/页</text>
							<uni-icons class="select-picker-icon" type="arrowdown" size="12" color="#999"></uni-icons>
						</button>
					</picker>
					<uni-pagination
						show-icon
						:page-size="pagination.size"
						v-model="pagination.current"
						:total="pagination.count"
						@change="onPageChanged"
					/>
				</view>
			</unicloud-db>
		</view>
		<!-- #ifndef H5 -->
		<fix-window />
		<!-- #endif -->
	</view>
</template>

<script>
import callFunction from "../../../common/callFunction.js"

const db = uniCloud.database();
// 表查询配置
const dbOrderBy = "create_date desc";
const dbSearchFields = ["name"]; // 支持模糊搜索的字段列表
// 分页配置
const pageSize = 20;
const pageCurrent = 1;

export default {
	data() {
		return {
			query: "",
			where: "",
			orderby: dbOrderBy,
			options: {
				pageSize,
				pageCurrent,
			},
			selectedIndexs: [], //批量选中的项
			pageSizeIndex: 1,
			pageSizeOption: [1, 20, 50, 100, 500],
		};
	},
	watch: {
		pageSizeIndex: {
			immediate: true,
			handler(val, old) {
				this.options.pageSize = this.pageSizeOption[val];
				this.options.pageCurrent = 1;
			},
		},
	},
	methods: {
		onqueryload(data) {
			for (var i = 0; i < data.length; i++) {
				let item = data[i];
				item.create_date = this.$formatDate(item.create_date);
			}
			this.expData = data; //仅导出当前页
		},
		changeSize(e) {
			this.pageSizeIndex = e.detail.value;
		},
		getWhere() {
			const query = this.query.trim();
			if (!query) {
				return "";
			}
			const queryRe = `/${query}/i`;
			return dbSearchFields
				.map((name) => queryRe + ".test(" + name + ")")
				.join(" || ");
		},
		search() {
			const newWhere = this.getWhere();
			const isSameWhere = newWhere === this.where;
			this.where = newWhere;
			if (isSameWhere) {
				// 相同条件时，手动强制刷新
				this.loadData();
			}
		},
		loadData(clear = true) {
			this.$refs.dataQuery.loadData({
				clear,
			});
		},
		onPageChanged(e) {
			this.options.pageCurrent = e.current;
		},
		navigateTo(url, clear) {
			// clear 表示刷新列表时是否清除当前页码，true 表示刷新并回到列表第 1 页，默认为 true
			uni.navigateTo({
				url,
				events: {
					refreshData: () => {
						this.loadData(clear);
					},
				},
			});
		},
		confirmDelete(id) {
			uni.showModal({
				title: "提示",
				content: "确认删除该记录？",
				success: (res) => {
					res.confirm && this.delete(id);
				},
			});
		},
		async delete(id) {
			uni.showLoading({
				mask: true,
			});
			const removeResult = await callFunction({
				route: `api/questionTag`,
				method: "DELETE",
				params: {
					_id: id
				},
			});
			uni.hideLoading();
			if (removeResult.success) {
				uni.showToast({
					title: "删除成功",
				});
			}
			this.loadData(false);
		},
	},
};
</script>

<style>
</style>
