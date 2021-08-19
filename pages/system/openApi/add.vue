<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind">
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
          <uni-easyinput placeholder="请输入请求方式, GET/POST/PUT/DELETE" v-model="formData.info.method" />
        </view>
        <!-- 参数列表 -->
        <view class="params-list">
          <view class="params-list-item" v-for="(item, index) in paramOptions" :key="index">
            <uni-easyinput placeholder="key键名" v-model="item.name" />
            <view class="required">
              <uni-data-checkbox
                v-model="item.required"
                :localdata="[{
                  text: '必填',
                  value: 1
                }, {
                  text: '非必填',
                  value: 0
                }]"
                :multiple="false"
              ></uni-data-checkbox>
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
import {
  validator
} from '../../../js_sdk/validator/openApi.js';

const db = uniCloud.database();
const dbCmd = db.command;
const dbCollectionName = 'openApi';

function getValidator(fields) {
  let reuslt = {}
  for (let key in validator) {
    if (fields.includes(key)) {
      reuslt[key] = validator[key]
    }
  }
  return reuslt
}

export default {
  data() {
    return {
      formData: {
        name: "",
        remark: "",
        state: "",
        info: {}
      },
      paramOptions: [],
      rules: {
        ...getValidator(["name", "remark", "state"])
      }
    }
  },
  onReady() {
    this.$refs.form.setRules(this.rules)
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
     * 触发表单提交
     */
    submit() {
      uni.showLoading({
        mask: true
      })
      this.$refs.form.submit().then((res) => {
        this.submitForm(res)
      }).catch((errors) => {
        uni.hideLoading()
      })
    },

    submitForm(value) {
      // 使用 clientDB 提交数据
      db.collection(dbCollectionName).add(value).then((res) => {
        uni.showToast({
          title: '新增成功'
        })
        this.getOpenerEventChannel().emit('refreshData')
        setTimeout(() => uni.navigateBack(), 500)
      }).catch((err) => {
        uni.showModal({
          content: err.message || '请求服务失败',
          showCancel: false
        })
      }).finally(() => {
        uni.hideLoading()
      })
    }
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
