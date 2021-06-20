export default (params) => {
	return new Promise(async (resolve) => {
		const {
			result
		} = await uniCloud.callFunction({
			name: params.name,
			data: {
				route: params.data.route,
				method: params.data.method,
				params: params.data.params,
			},
		});
		let response = {
			success: true,
			data: result,
		};
		if (result.code) {
			// 判断code是否存在于errorMessage对象中
			if (result.code !== 0) {
				response = {
					success: false,
				};
				uni.hideLoading();
				if (result.msg) {
					uni.showToast({
						title: result.msg,
						icon: "none",
					});
				}
			}
		}
		resolve(response);
	});
}
