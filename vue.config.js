const ignored = ['**/uni_modules/**/*.md', '**/uni_modules/**/package.json','**/uni_modules/*/uniCloud/**/*']

process.env.VUE_APP_V1_TEST_API_HTTP_URL = 'https://c7e81452-9d28-4486-bedc-5dbf7c8386a5.bspapp.com/http/v1/'
process.env.VUE_APP_V1_RELEASE_API_HTTP_URL = 'https://86dc45ba-28e8-4734-a880-bbf700b08cf9.bspapp.com/http/v1/'

module.exports = {
	configureWebpack() {
		return {
			watchOptions: {
				ignored
			},
			devServer: {
				watchOptions: {
					ignored
				}
			}
		}
	}
}
