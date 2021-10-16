<template>
  <Form ref="formCom" class="xtx-form" :validation-schema="mySchema" v-slot="{errors}">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi~ {{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" name="mobile" v-model="form.mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}" name="code" v-model="form.code" class="input" type="text" placeholder="短信验证码" />
        <span class="code" @click="send()">
          {{time===0 ? '发送验证码' : `${time}秒后发送`}}
        </span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { onUnmounted, reactive, ref } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema.js'
import { useIntervalFn } from '@vueuse/core'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 1、准备信息：unionId,qq头像，昵称
    const nickname = ref(null)
    const avatar = ref(null)
    // 2、完成表单校验
    // 3、发送验证码（校验、定义api、调用、完成倒计时）
    // 4、进行绑定
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        // console.log(res)
        nickname.value = res.data.nickname
        avatar.value = res.data.figureurl_1
      })
    }
    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 校验规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }
    // 切换表单元素，还原数据和清除校验效果
    const formCom = ref(null)
    const time = ref(0)
    // pause 暂停 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })
    // 发送验证码
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          // 没有倒计时才能发送
          await userQQBindCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败,使用vee的错误函数信息，setFieldError(字段，错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // 立即绑定
    // 使用store
    const store = useStore()
    // 使用router
    const router = useRouter()
    // 使用route
    const route = useRoute()
    const submit = async () => {
      const valid = await formCom.value.validate()
      if (valid) {
        userQQBindLogin({ unionId: props.unionId, ...form }).then(data => {
          // 1. 存储信息
          const { id, account, nickname, avatar, mobile, token } = data.result
          store.commit('user/setUser', { id, account, nickname, avatar, mobile, token })
          // 2. 提示
          Message({ type: 'success', text: 'QQ绑定成功' })
          // 3. 跳转 到之前请求的页面或者首页
          router.push(route.query.redirectUrl || '/')
        }).catch(e => {
          Message({ type: 'error', text: '绑定失败' })
        })
      }
    }
    return { nickname, avatar, form, mySchema, formCom, send, time, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
