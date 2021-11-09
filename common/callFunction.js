export default (params) => {
  const {
    VUE_APP_V1_TEST_API_HTTP_URL,
    VUE_APP_V1_RELEASE_API_HTTP_URL,
    UNI_PLATFORM,
    NODE_ENV,
  } = process.env;
  const base_url =
    NODE_ENV === "development"
      ? VUE_APP_V1_TEST_API_HTTP_URL
      : VUE_APP_V1_RELEASE_API_HTTP_URL;
  const { method = "POST", params: _params = {}, route } = params;

  // uni-id-token
  const token = uni.getStorageSync("uni_id_token");
  const id = uni.getStorageSync("uid");

  return new Promise(async (resolve) => {
    uni.request({
      url: `${base_url}${route}`,
      method,
      data: _params,
      header: {
        "uni-id-token": token,
        uni_id: id,
        "sword-platform": UNI_PLATFORM,
      },
      success: (res) => {
        console.log(res)
        resolve({
          success: true,
          data: res.data,
        });
      },
      fail: () => {},
    });
  });
};
