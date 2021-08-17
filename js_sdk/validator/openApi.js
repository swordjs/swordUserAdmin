
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "name": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "remark": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "state": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "info": {
    "rules": [
      {
        "format": "object"
      }
    ]
  },
  "createDate": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "updateDate": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "deleteDate": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  }
}

const enumConverter = {}

export { validator, enumConverter }
