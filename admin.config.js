export default {
	login: {
		url: '/pages/login/login' // 登录页面路径
	},
	index: {
		url: '/pages/index/index' // 登录后跳转的第一个页面
	},
	error: {
		url: '/pages/error/404' // 404 Not Found 错误页面路径
	},
	navBar: { // 顶部导航
		logo: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/43743ae3-1249-4ca6-a3a1-bb96afee3e1e.png', // 左侧 Logo
		links: [{ // 右侧链接
			text: '剑指题解-小程序',
			url: 'https://ext.dcloud.net.cn/plugin?id=4637'
		}, {
			text: '文档',
			url: 'https://www.yuque.com/mlgrgm/lmm8g4'
		}],
		debug: {
			enable: process.env.NODE_ENV !== 'production', //是否显示错误信息
			engine: [{ // 搜索引擎配置（每条错误信息后，会自动生成搜索链接，点击后跳转至搜索引擎）
				name: '百度',
				url: 'https://www.baidu.com/baidu?wd=ERR_MSG'
			}, {
				name: '谷歌',
				url: 'https://www.google.com/search?q=ERR_MSG'
			}]
		}
	},
	sideBar: { // 左侧菜单
		// 配置静态菜单列表（放置在用户被授权的菜单列表下边）
		staticMenu: []
	}
}


/**
 * staticMenu: [{
			menu_id: "demo",
			name: '静态功能演示',
			icon: 'uni-icons-list',
			url: "",
			children: [{
				menu_id: "icons",
				name: '图标',
				icon: 'uni-icons-star',
				url: '/pages/demo/icons/icons',
			}, {
				menu_id: "table",
				name: '表格',
				icon: 'uni-icons-map',
				url: '/pages/demo/table/table',
			}]
		}]

 
 */
