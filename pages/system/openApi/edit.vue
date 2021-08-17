
<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind">
      <uni-forms-item name="name" label="">
  <uni-easyinput placeholder="api名称" v-model="formData.name" />
</uni-forms-item>
<uni-forms-item name="remark" label="">
  <uni-easyinput placeholder="备注" v-model="formData.remark" />
</uni-forms-item>
<uni-forms-item name="state" label="">
  <uni-easyinput placeholder="类型，close不开放，open开放" v-model="formData.state" />
</uni-forms-item>
<uni-forms-item name="createDate" label="">
  <uni-datetime-picker return-type="timestamp" :value="formData.createDate" />
</uni-forms-item>
<uni-forms-item name="updateDate" label="">
  <uni-datetime-picker return-type="timestamp" :value="formData.updateDate" />
</uni-forms-item>
<uni-forms-item name="deleteDate" label="">
  <uni-datetime-picker return-type="timestamp" :value="formData.deleteDate" />
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
  import { validator } from '../../../js_sdk/validator/openApi.js';

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
  "name": "",
  "remark": "",
  "state": "",
  "info": null,
  "createDate": null,
  "updateDate": null,
  "deleteDate": null
},
        formOptions: {},
        rules: {
          ...getValidator(["name","remark","state","info","createDate","updateDate","deleteDate"])
        }
      }
    },
    onLoad(e) {
      const id = e.id
      this.formDataId = id
      this.getDetail(id)
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
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
        db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            title: '修改成功'
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
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field('name,remark,state,info,createDate,updateDate,deleteDate').get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
          }
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

